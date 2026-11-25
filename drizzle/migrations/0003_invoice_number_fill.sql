CREATE OR REPLACE FUNCTION public.invoice_number_fill()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  yr text := to_char(coalesce(new.invoice_date, current_date), 'YYYY');
  prefix text := 'MA-' || to_char(coalesce(new.invoice_date, current_date), 'YYYY') || '-';
  nxt int;
BEGIN
  IF new.invoice_number IS NULL OR trim(new.invoice_number) = '' THEN
    PERFORM pg_advisory_xact_lock(hashtext('ma_invoice_number'));
    SELECT count(*) + 1 INTO nxt FROM public.invoices WHERE invoice_number LIKE prefix || '%';
    new.invoice_number := prefix || lpad(nxt::text, 4, '0');
  END IF;
  RETURN new;
END $$;

CREATE TRIGGER invoices_number_fill BEFORE INSERT ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.invoice_number_fill();
