
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  treatment TEXT NOT NULL,
  doctor TEXT NOT NULL,
  appointment_at TIMESTAMPTZ NOT NULL,
  patient_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX appointments_doctor_slot_unique
  ON public.appointments (doctor, appointment_at)
  WHERE status <> 'cancelled';

CREATE INDEX appointments_appointment_at_idx ON public.appointments (appointment_at);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can create a booking request
CREATE POLICY "Anyone can create appointments"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No public select/update/delete (admin to be added later)
