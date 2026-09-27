-- Helper function for role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE auth_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "Users can read their own row" ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update their own row" ON users FOR UPDATE USING (auth.uid() = auth_id);

-- student_profiles
CREATE POLICY "Students can read their own profile" ON student_profiles FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Students can update their own profile" ON student_profiles FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Managers can read all student profiles" ON student_profiles FOR SELECT USING (public.get_user_role() = 'MANAGER');
CREATE POLICY "Students can insert their own profile" ON student_profiles FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- manager_profiles
CREATE POLICY "Managers can read their own profile" ON manager_profiles FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Managers can update their own profile" ON manager_profiles FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "All managers can read manager profiles" ON manager_profiles FOR SELECT USING (public.get_user_role() = 'MANAGER');

-- scholarships
CREATE POLICY "Anyone authenticated can read scholarships" ON scholarships FOR SELECT USING (auth.uid() IS NOT NULL);

-- applications
CREATE POLICY "Students can read their own applications" ON applications FOR SELECT USING (student_id IN (SELECT id FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));
CREATE POLICY "Students can insert applications for their own profile" ON applications FOR INSERT WITH CHECK (student_id IN (SELECT id FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));
CREATE POLICY "Students can update their own DRAFT applications" ON applications FOR UPDATE USING (
    status = 'DRAFT' AND student_id IN (SELECT id FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
);
CREATE POLICY "Managers can read all applications" ON applications FOR SELECT USING (public.get_user_role() = 'MANAGER');
CREATE POLICY "Managers can update application status" ON applications FOR UPDATE USING (public.get_user_role() = 'MANAGER');

-- documents
CREATE POLICY "Students can read their own documents" ON documents FOR SELECT USING (student_id IN (SELECT id FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));
CREATE POLICY "Students can insert their own documents" ON documents FOR INSERT WITH CHECK (student_id IN (SELECT id FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));
CREATE POLICY "Managers can read all documents" ON documents FOR SELECT USING (public.get_user_role() = 'MANAGER');

-- verification_records
CREATE POLICY "Students can see their own verification records" ON verification_records FOR SELECT USING (application_id IN (SELECT id FROM applications WHERE student_id IN (SELECT id FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))));
CREATE POLICY "Managers can read all verification records" ON verification_records FOR SELECT USING (public.get_user_role() = 'MANAGER');
CREATE POLICY "Managers can create verification records" ON verification_records FOR INSERT WITH CHECK (public.get_user_role() = 'MANAGER');
CREATE POLICY "Managers can update verification records" ON verification_records FOR UPDATE USING (public.get_user_role() = 'MANAGER');

-- manual_reviews
CREATE POLICY "Students see reviews related to their applications" ON manual_reviews FOR SELECT USING (application_id IN (SELECT id FROM applications WHERE student_id IN (SELECT id FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))));
CREATE POLICY "Managers read all manual reviews" ON manual_reviews FOR SELECT USING (public.get_user_role() = 'MANAGER');
CREATE POLICY "Managers can create manual reviews" ON manual_reviews FOR INSERT WITH CHECK (public.get_user_role() = 'MANAGER');
CREATE POLICY "Managers can update manual reviews" ON manual_reviews FOR UPDATE USING (public.get_user_role() = 'MANAGER');

-- payments
CREATE POLICY "Students see their own payments" ON payments FOR SELECT USING (student_id IN (SELECT id FROM student_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())));
CREATE POLICY "Managers see all payments" ON payments FOR SELECT USING (public.get_user_role() = 'MANAGER');
CREATE POLICY "Managers can manage payments" ON payments FOR INSERT WITH CHECK (public.get_user_role() = 'MANAGER');
CREATE POLICY "Managers can update payments" ON payments FOR UPDATE USING (public.get_user_role() = 'MANAGER');

-- notifications
CREATE POLICY "Users see their own notifications" ON notifications FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Users can mark their own as read" ON notifications FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Managers can create notifications" ON notifications FOR INSERT WITH CHECK (public.get_user_role() = 'MANAGER');
