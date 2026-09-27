-- Schema for TribalScholar

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'MANAGER', 'ADMIN')) DEFAULT 'STUDENT',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: student_profiles
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    category TEXT DEFAULT 'ST',
    tribe_name TEXT,
    pvtg_status BOOLEAN DEFAULT false,
    pvtg_group TEXT,
    state TEXT,
    district TEXT,
    pincode TEXT,
    address TEXT,
    mobile_number TEXT,
    email TEXT,
    institution_name TEXT,
    institution_code TEXT,
    institution_state TEXT,
    course TEXT,
    course_level TEXT,
    academic_year TEXT,
    year_of_study TEXT,
    previous_marks_percentage NUMERIC(5,2),
    family_income NUMERIC(12,2),
    income_certificate_number TEXT,
    income_validity_date DATE,
    caste_certificate_number TEXT,
    aadhaar_last_four TEXT,
    domicile_state TEXT,
    domicile_status TEXT DEFAULT 'Pending',
    st_status TEXT DEFAULT 'Pending',
    disability_status BOOLEAN DEFAULT false,
    disability_percentage NUMERIC(5,2),
    bank_account_masked TEXT,
    bank_name TEXT,
    ifsc_code TEXT,
    aadhaar_seeded BOOLEAN DEFAULT false,
    dbt_active BOOLEAN DEFAULT false,
    apaar_id TEXT,
    digilocker_linked BOOLEAN DEFAULT false,
    profile_completion NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: manager_profiles
CREATE TABLE manager_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    manager_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    department TEXT,
    designation TEXT,
    office TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_manager_profiles_updated_at BEFORE UPDATE ON manager_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: scholarships
CREATE TABLE scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT,
    target_group TEXT,
    eligibility_summary JSONB,
    max_income_limit NUMERIC(12,2),
    benefits_summary TEXT,
    annual_grant_amount_text TEXT,
    required_documents JSONB,
    important_dates JSONB,
    demo_rules_note TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_scholarships_updated_at BEFORE UPDATE ON scholarships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number TEXT UNIQUE NOT NULL,
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    scholarship_id UUID REFERENCES scholarships(id),
    academic_year TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','SUBMITTED','UNDER_VERIFICATION','ACTION_REQUIRED','MANUAL_REVIEW','APPROVED','REJECTED','SANCTIONED','PAYMENT_PROCESSING','PAID')),
    current_stage TEXT,
    application_date DATE DEFAULT CURRENT_DATE,
    submitted_at TIMESTAMPTZ,
    claimed_amount NUMERIC(12,2),
    approved_amount NUMERIC(12,2),
    sanction_date DATE,
    sanction_amount NUMERIC(12,2),
    payment_status TEXT,
    used_digilocker_reuse BOOLEAN DEFAULT false,
    remarks TEXT,
    timeline JSONB,
    verification_issues JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL,
    document_name TEXT,
    file_name TEXT,
    file_size TEXT,
    storage_path TEXT,
    source TEXT,
    verification_status TEXT DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING','VERIFIED','MISMATCH','MANUAL_REVIEW','REJECTED','NOT_AVAILABLE','FAILED')),
    verification_remarks TEXT,
    expiry_date DATE,
    certificate_number TEXT,
    issuing_authority TEXT,
    ocr_extracted_data JSONB,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: verification_records
CREATE TABLE verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    verification_type TEXT NOT NULL,
    verification_source TEXT,
    status TEXT DEFAULT 'PENDING',
    confidence NUMERIC(5,2),
    remarks TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: manual_reviews
CREATE TABLE manual_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    assigned_manager_id UUID REFERENCES manager_profiles(id),
    student_name TEXT,
    scheme_name TEXT,
    issue_type TEXT,
    source_system TEXT,
    submitted_value TEXT,
    source_value TEXT,
    reason TEXT,
    priority TEXT DEFAULT 'NORMAL',
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN','PENDING_REVIEW','IN_REVIEW','CORRECTION_REQUESTED','ACTION_REQUIRED','APPROVED','REJECTED','RESOLVED')),
    manager_remarks TEXT,
    requested_action TEXT,
    documents_attached JSONB,
    flagged_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);
CREATE TRIGGER update_manual_reviews_updated_at BEFORE UPDATE ON manual_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    student_id UUID REFERENCES student_profiles(id),
    scheme_name TEXT,
    installment_no TEXT,
    sanction_amount NUMERIC(12,2),
    amount NUMERIC(12,2),
    payment_status TEXT DEFAULT 'SANCTIONED' CHECK (payment_status IN ('SANCTIONED','PAYMENT_INITIATED','BANK_PROCESSING','CREDITED','FAILED')),
    transaction_reference TEXT,
    pfms_reference_id TEXT,
    bank_utr_number TEXT,
    sanction_order_number TEXT,
    sanction_date DATE,
    payment_date DATE,
    credited_date DATE,
    bank_name TEXT,
    account_masked TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Table: notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    type TEXT DEFAULT 'INFO' CHECK (type IN ('VERIFICATION','ACTION_REQUIRED','PAYMENT','OFFICER_NOTE','INFO','APPLICATION','DOCUMENT','SYSTEM')),
    severity TEXT,
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    action_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_student_profiles_student_id ON student_profiles(student_id);
CREATE INDEX idx_manager_profiles_user_id ON manager_profiles(user_id);
CREATE INDEX idx_manager_profiles_manager_id ON manager_profiles(manager_id);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_scholarship_id ON applications(scholarship_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_application_number ON applications(application_number);
CREATE INDEX idx_documents_student_id ON documents(student_id);
CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_verification_records_application_id ON verification_records(application_id);
CREATE INDEX idx_manual_reviews_application_id ON manual_reviews(application_id);
CREATE INDEX idx_manual_reviews_assigned_manager_id ON manual_reviews(assigned_manager_id);
CREATE INDEX idx_manual_reviews_status ON manual_reviews(status);
CREATE INDEX idx_payments_application_id ON payments(application_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
