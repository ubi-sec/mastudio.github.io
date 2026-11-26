CREATE TABLE public.whatsapp_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id text NOT NULL UNIQUE,
  event text NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processing_error text,
  next_retry_at timestamptz
);
GRANT SELECT ON public.whatsapp_webhook_events TO authenticated;
GRANT ALL ON public.whatsapp_webhook_events TO service_role;
ALTER TABLE public.whatsapp_webhook_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read WhatsApp webhook events" ON public.whatsapp_webhook_events FOR SELECT TO authenticated USING (public.is_admin());

CREATE TABLE public.whatsapp_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE CHECK (phone ~ '^[0-9]{7,15}$'),
  customer_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'assistant' CHECK (status IN ('assistant', 'handed_off', 'paused')),
  booking_draft jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_inbound_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.whatsapp_conversations TO authenticated;
GRANT ALL ON public.whatsapp_conversations TO service_role;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read WhatsApp conversations" ON public.whatsapp_conversations FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins update WhatsApp conversations" ON public.whatsapp_conversations FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER whatsapp_conversations_updated BEFORE UPDATE ON public.whatsapp_conversations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  provider_message_id text,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  body text NOT NULL DEFAULT '',
  message_type text NOT NULL DEFAULT 'text',
  status text NOT NULL DEFAULT 'received',
  status_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  provider_timestamp timestamptz,
  reply_text text,
  reply_state text NOT NULL DEFAULT 'none' CHECK (reply_state IN ('none', 'pending', 'sending', 'completed', 'failed', 'review')),
  reply_attempts integer NOT NULL DEFAULT 0,
  next_reply_at timestamptz,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.whatsapp_messages TO authenticated;
GRANT ALL ON public.whatsapp_messages TO service_role;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read WhatsApp messages" ON public.whatsapp_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins send WhatsApp messages" ON public.whatsapp_messages FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update WhatsApp messages" ON public.whatsapp_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE UNIQUE INDEX whatsapp_messages_provider_id_unique ON public.whatsapp_messages (provider_message_id) WHERE provider_message_id IS NOT NULL;
CREATE INDEX whatsapp_messages_conversation_created ON public.whatsapp_messages (conversation_id, created_at);
CREATE INDEX whatsapp_messages_reply_recovery ON public.whatsapp_messages (reply_state, next_reply_at) WHERE direction = 'inbound' AND reply_state IN ('pending', 'failed');

CREATE TABLE public.whatsapp_assistant_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.whatsapp_assistant_settings TO authenticated;
GRANT ALL ON public.whatsapp_assistant_settings TO service_role;
ALTER TABLE public.whatsapp_assistant_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read WhatsApp assistant settings" ON public.whatsapp_assistant_settings FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins update WhatsApp assistant settings" ON public.whatsapp_assistant_settings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER whatsapp_assistant_settings_updated BEFORE UPDATE ON public.whatsapp_assistant_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.whatsapp_assistant_settings (id, enabled) VALUES (1, true);