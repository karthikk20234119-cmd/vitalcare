
DROP POLICY "Anyone can create appointments" ON public.appointments;

CREATE POLICY "Anyone can create appointments"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(patient_name) BETWEEN 2 AND 120
    AND char_length(email) BETWEEN 5 AND 255
    AND char_length(phone) BETWEEN 5 AND 40
    AND char_length(treatment) BETWEEN 1 AND 80
    AND char_length(doctor) BETWEEN 1 AND 80
    AND (notes IS NULL OR char_length(notes) <= 1000)
    AND appointment_at > now()
    AND status = 'pending'
  );
