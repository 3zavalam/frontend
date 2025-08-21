-- Enable Row Level Security on waitlist table
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Verify and recreate policies if needed
DROP POLICY IF EXISTS "Allow insert to waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Allow select to service role" ON public.waitlist;

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