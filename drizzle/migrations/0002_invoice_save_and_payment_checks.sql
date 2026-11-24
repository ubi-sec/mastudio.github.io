CREATE OR REPLACE FUNCTION public.save_invoice(_id uuid, _data jsonb, _items jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE iid uuid; item jsonb; ord int := 0; disc numeric;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501'; END IF;
  IF jsonb_typeof(_items) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Items must be a list'; END IF;
  IF jsonb_array_length(_items) > 50 THEN RAISE EXCEPTION 'Too many line items'; END IF;
  disc := coalesce((_data->>'discount')::numeric, 0);

  IF _id IS NULL THEN
    INSERT INTO public.invoices (invoice_date, due_date, customer_id, booking_id, customer_name, customer_phone, customer_email,
      event_type, event_date, event_location, package_name, package_price, discount, tax_rate, payment_method, notes)
    VALUES (
      coalesce((_data->>'invoice_date')::date, current_date),
      nullif(_data->>'due_date','')::date,
      nullif(_data->>'customer_id','')::uuid,
      nullif(_data->>'booking_id','')::uuid,
      trim(coalesce(_data->>'customer_name','')),
      coalesce(_data->>'customer_phone',''),
      coalesce(_data->>'customer_email',''),
      coalesce(_data->>'event_type',''),
      nullif(_data->>'event_date','')::date,
      coalesce(_data->>'event_location',''),
      coalesce(_data->>'package_name',''),
      coalesce((_data->>'package_price')::numeric, 0),
      0,
      coalesce((_data->>'tax_rate')::numeric, 0),
      nullif(_data->>'payment_method',''),
      coalesce(_data->>'notes','')
    ) RETURNING id INTO iid;
  ELSE
    UPDATE public.invoices SET
      invoice_date = coalesce((_data->>'invoice_date')::date, invoice_date),
      due_date = nullif(_data->>'due_date','')::date,
      customer_id = nullif(_data->>'customer_id','')::uuid,
      booking_id = nullif(_data->>'booking_id','')::uuid,
      customer_name = trim(coalesce(_data->>'customer_name','')),
      customer_phone = coalesce(_data->>'customer_phone',''),
      customer_email = coalesce(_data->>'customer_email',''),
      event_type = coalesce(_data->>'event_type',''),
      event_date = nullif(_data->>'event_date','')::date,
      event_location = coalesce(_data->>'event_location',''),
      package_name = coalesce(_data->>'package_name',''),
      package_price = coalesce((_data->>'package_price')::numeric, 0),
      discount = 0,
      tax_rate = coalesce((_data->>'tax_rate')::numeric, 0),
      payment_method = nullif(_data->>'payment_method',''),
      notes = coalesce(_data->>'notes','')
    WHERE id = _id RETURNING id INTO iid;
    IF iid IS NULL THEN RAISE EXCEPTION 'Invoice not found'; END IF;
    DELETE FROM public.invoice_items WHERE invoice_id = iid;
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    ord := ord + 1;
    INSERT INTO public.invoice_items (invoice_id, kind, description, quantity, unit_price, sort_order)
    VALUES (iid, coalesce(item->>'kind','service'), trim(coalesce(item->>'description','')),
      coalesce((item->>'quantity')::numeric, 1), coalesce((item->>'unit_price')::numeric, 0), ord);
  END LOOP;

  -- Apply the discount last so it is checked against the full subtotal.
  UPDATE public.invoices SET discount = disc WHERE id = iid;
  RETURN iid;
END $$;
REVOKE EXECUTE ON FUNCTION public.save_invoice(uuid, jsonb, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_invoice(uuid, jsonb, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.invoice_payment_check()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE inv_total numeric; paid numeric;
BEGIN
  SELECT total INTO inv_total FROM public.invoices WHERE id = NEW.invoice_id;
  SELECT coalesce(sum(amount), 0) INTO paid FROM public.invoice_payments
   WHERE invoice_id = NEW.invoice_id AND (TG_OP = 'INSERT' OR id <> NEW.id);
  IF paid + NEW.amount > inv_total + 0.009 THEN
    RAISE EXCEPTION 'Payment is more than the remaining balance';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER invoice_payment_check BEFORE INSERT OR UPDATE ON public.invoice_payments
FOR EACH ROW EXECUTE FUNCTION public.invoice_payment_check();