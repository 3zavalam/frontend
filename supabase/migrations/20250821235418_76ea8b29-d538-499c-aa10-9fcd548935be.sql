-- Create waitlist table for email collection
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert emails to the waitlist
CREATE POLICY "Allow insert to waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Allow service role to select from waitlist (for admin access)
CREATE POLICY "Allow select to service role" 
ON public.waitlist 
FOR SELECT 
USING (true);