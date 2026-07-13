
-- Add user link + management columns
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON public.appointments(user_id);

-- Replace overly-strict insert policy with a user-scoped one
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;

CREATE POLICY "Users can insert own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND char_length(patient_name) BETWEEN 2 AND 120
  AND char_length(email) BETWEEN 5 AND 255
  AND char_length(phone) BETWEEN 5 AND 40
  AND char_length(treatment) BETWEEN 1 AND 80
  AND char_length(doctor) BETWEEN 1 AND 80
  AND (notes IS NULL OR char_length(notes) <= 1000)
  AND appointment_at > now()
  AND status = 'pending'
);

CREATE POLICY "Users can view own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
ON public.appointments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND status IN ('pending','confirmed','cancelled')
  AND (status = 'cancelled' OR appointment_at > now())
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS appointments_set_updated_at ON public.appointments;
CREATE TRIGGER appointments_set_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public RPC: return only times taken (active bookings) for a doctor on a date,
-- without exposing patient data. Definer-secured.
CREATE OR REPLACE FUNCTION public.get_taken_slots(_doctor text, _day date)
RETURNS SETOF timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_at
  FROM public.appointments
  WHERE doctor = _doctor
    AND status <> 'cancelled'
    AND appointment_at >= _day::timestamptz
    AND appointment_at <  (_day + INTERVAL '1 day')::timestamptz;
$$;

GRANT EXECUTE ON FUNCTION public.get_taken_slots(text, date) TO anon, authenticated;
