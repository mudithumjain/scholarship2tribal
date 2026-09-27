-- TribalScholar Demo Seed Data
-- All data is SYNTHETIC / PROTOTYPE. No real student information.
-- Run this after schema.sql and rls-policies.sql

INSERT INTO users (id, email, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'demo.student@tribalscholar.in', 'STUDENT'),
  ('33333333-3333-3333-3333-333333333333', 'demo.manager@tribalscholar.in', 'MANAGER')
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_profiles (id, user_id, student_id, full_name, date_of_birth, gender, category, tribe_name, pvtg_status, state, district, pincode, mobile_number, email, institution_name, institution_code, institution_state, course, course_level, academic_year, year_of_study, previous_marks_percentage, family_income, income_certificate_number, income_validity_date, caste_certificate_number, aadhaar_last_four, domicile_state, domicile_status, st_status, bank_account_masked, bank_name, ifsc_code, aadhaar_seeded, dbt_active, apaar_id, digilocker_linked, profile_completion)
VALUES (
  '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'ST10001', 'Rahul Kumar', '2004-05-14', 'Male', 'ST', 'Naikda / Nayaka', false, 'Karnataka', 'Dakshina Kannada', '575025', '+91 98765 43210', 'rahul.kumar.st@demo.gov.in', 'National Institute of Technology Karnataka (NITK), Surathkal', 'AISHE-C-1284', 'Karnataka', 'B.Tech - Computer Science & Engineering', 'Undergraduate', '2025-26', '3rd Year / 6th Semester', 81.5, 120000, 'KA/RD/INC/2024/7741', '2025-03-31', 'KA/ST/2021/88921', '4589', 'Karnataka', 'Verified', 'Verified', '•••• •••• 4589', 'State Bank of India', 'SBIN0002273', true, true, 'APAAR-9812-7721-4019', true, 95
) ON CONFLICT (id) DO NOTHING;

INSERT INTO manager_profiles (id, user_id, manager_id, full_name, department, designation, office, email, phone)
VALUES (
  '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'MGR001', 'Demo Officer', 'Ministry of Tribal Affairs', 'Scholarship Verification Manager', 'MoTA Regional Office, Karnataka', 'demo.manager@tribalscholar.in', NULL
) ON CONFLICT (id) DO NOTHING;

INSERT INTO scholarships (id, code, name, short_description, target_group, eligibility_summary, max_income_limit, benefits_summary, annual_grant_amount_text, required_documents, important_dates, demo_rules_note, status)
VALUES 
(
  '55555555-5555-5555-5555-555555555501', 'PRE_MATRIC', 'Pre-Matric Scholarship for ST Students (Class 9-10)', 'Financial assistance for ST students in classes 9 and 10 to reduce dropout rates.', 'ST students in classes 9 and 10', 
  '["Must be an ST student", "Studying in Class 9 or 10 in a recognized school", "Family income should not exceed limit"]', 
  250000, 'Monthly maintenance allowance and annual ad-hoc grant.', 'Up to ₹3,500/year', 
  '["ST Certificate", "Income Certificate", "Previous Year Marksheet", "Bank Passbook"]', 
  '{"portalOpen": "2025-04-01", "lastDate": "2025-08-31", "verificationDeadline": "2025-09-15"}', 
  'For demo purposes', 'ACTIVE'
),
(
  '55555555-5555-5555-5555-555555555502', 'POST_MATRIC', 'Post-Matric Scholarship for ST Students', 'Support for ST students pursuing higher education from class 11 up to Post-Graduation.', 'ST students in class 11 to PG', 
  '["Must be an ST student", "Pursuing recognized post-matriculation courses", "Family income should not exceed limit"]', 
  250000, 'Maintenance allowance, reimbursement of compulsory non-refundable fees.', 'Up to ₹12,000/year + Fees', 
  '["ST Certificate", "Income Certificate", "Institution ID", "Bank Passbook", "Fee Receipt"]', 
  '{"portalOpen": "2025-05-01", "lastDate": "2025-10-31", "verificationDeadline": "2025-11-15"}', 
  'For demo purposes', 'ACTIVE'
),
(
  '55555555-5555-5555-5555-555555555503', 'TOP_CLASS', 'National Fellowship and Scholarship for Higher Education (Top Class)', 'Funding for ST students studying in identified premier institutions like IITs, NITs, and IIMs.', 'ST students in premier institutes', 
  '["Must be an ST student", "Secured admission in identified top institutions", "Family income should not exceed limit"]', 
  800000, 'Full tuition fee, living expenses, book allowance, and computer grant.', 'Full Fees + Living Expenses', 
  '["ST Certificate", "Income Certificate", "Admission Letter", "Bonafide Certificate", "Bank Passbook"]', 
  '{"portalOpen": "2025-06-01", "lastDate": "2025-11-30", "verificationDeadline": "2025-12-15"}', 
  'For demo purposes', 'ACTIVE'
),
(
  '55555555-5555-5555-5555-555555555504', 'NFST', 'National Fellowship for ST Students', 'Fellowships for ST students pursuing M.Phil and Ph.D. degrees in universities/institutions.', 'ST students pursuing M.Phil/Ph.D.', 
  '["Must be an ST student", "Registered for regular M.Phil/Ph.D. program"]', 
  NULL, 'Monthly fellowship, contingency grant, and escort/reader assistance (if applicable).', '₹31,000 to ₹35,000/month', 
  '["ST Certificate", "PG Degree Marksheet", "Ph.D./M.Phil Registration Proof", "Bank Passbook"]', 
  '{"portalOpen": "2025-04-15", "lastDate": "2025-09-30", "verificationDeadline": "2025-10-15"}', 
  'For demo purposes', 'ACTIVE'
),
(
  '55555555-5555-5555-5555-555555555505', 'NOS', 'National Overseas Scholarship for ST Students', 'Financial assistance for ST students selected for pursuing higher studies (Masters, Ph.D., Post-Doctoral) abroad.', 'ST students studying abroad', 
  '["Must be an ST student", "Secured admission in an accredited foreign university", "Family income should not exceed limit", "Below 35 years of age"]', 
  600000, 'Tuition fees, maintenance allowance, travel expenses, visa fees.', 'Varies by Country + Tuition', 
  '["ST Certificate", "Income Certificate", "Foreign University Offer Letter", "Passport Details", "Visa Document"]', 
  '{"portalOpen": "2025-02-01", "lastDate": "2025-07-31", "verificationDeadline": "2025-08-15"}', 
  'For demo purposes', 'ACTIVE'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO applications (id, application_number, student_id, scholarship_id, academic_year, status, current_stage, claimed_amount, approved_amount, timeline, verification_issues)
VALUES 
(
  '66666666-6666-6666-6666-666666666601', 'APP-2025-00142', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555502', '2025-26', 'MANUAL_REVIEW', 'DEPARTMENT_VERIFICATION', 120000, NULL, 
  '[{"title": "Application Submitted", "date": "2025-07-15", "status": "completed"}, {"title": "Institution Verification", "date": "2025-07-28", "status": "completed"}]', 
  '{"issues": ["Income mismatch detected"]}'
),
(
  '66666666-6666-6666-6666-666666666602', 'APP-2025-00089', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555503', '2025-26', 'SANCTIONED', 'DISBURSEMENT', 86000, 86000, 
  '[{"title": "Application Submitted", "date": "2025-06-10", "status": "completed"}]', 
  '{}'
),
(
  '66666666-6666-6666-6666-666666666603', 'APP-2025-00221', '22222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555501', '2025-26', 'SUBMITTED', 'INSTITUTION_VERIFICATION', NULL, NULL, 
  '[{"title": "Application Submitted", "date": "2025-08-01", "status": "completed"}]', 
  '{}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO documents (id, student_id, application_id, document_type, document_name, verification_status, ocr_extracted_data)
VALUES 
('77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666601', 'ST_CERTIFICATE', 'ST Certificate', 'VERIFIED', '{"certificateNo": "KA/ST/2021/88921"}'),
('77777777-7777-7777-7777-777777777702', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666601', 'INCOME_CERTIFICATE', 'Income Certificate', 'MANUAL_REVIEW', '{"income": 120000, "validity": "2025-03-31"}'),
('77777777-7777-7777-7777-777777777703', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666601', 'MARKSHEET', 'Previous Year Marksheet', 'VERIFIED', NULL),
('77777777-7777-7777-7777-777777777704', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666601', 'INSTITUTION_ID', 'Institution ID Card', 'VERIFIED', NULL),
('77777777-7777-7777-7777-777777777705', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666601', 'BANK_PASSBOOK', 'Bank Passbook', 'VERIFIED', NULL),
('77777777-7777-7777-7777-777777777706', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666601', 'DOMICILE_CERTIFICATE', 'Domicile Certificate', 'VERIFIED', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO manual_reviews (id, application_id, assigned_manager_id, student_name, scheme_name, issue_type, source_system, submitted_value, source_value, reason, status)
VALUES 
('88888888-8888-8888-8888-888888888801', '66666666-6666-6666-6666-666666666601', NULL, 'Rahul Kumar', 'Post-Matric Scholarship for ST Students', 'INCOME_MISMATCH', 'DEMO_STATE_EDISTRICT', '120000', '150000', 'Income mismatch detected', 'PENDING_REVIEW'),
('88888888-8888-8888-8888-888888888802', '66666666-6666-6666-6666-666666666601', NULL, 'Rahul Kumar', 'Post-Matric Scholarship for ST Students', 'ST_CERTIFICATE_EXPIRED', 'DEMO_STATE_EDISTRICT', 'KA/ST/2021/88921', NULL, 'Certificate may be expired', 'PENDING_REVIEW'),
('88888888-8888-8888-8888-888888888803', '66666666-6666-6666-6666-666666666601', NULL, 'Rahul Kumar', 'Post-Matric Scholarship for ST Students', 'AISHE_CODE_MISMATCH', 'DEMO_AISHE', 'AISHE-C-1284', 'AISHE-C-1285', 'Institution Code mismatch', 'CORRECTION_REQUESTED'),
('88888888-8888-8888-8888-888888888804', '66666666-6666-6666-6666-666666666601', NULL, 'Rahul Kumar', 'Post-Matric Scholarship for ST Students', 'DOMICILE_STATE_DISCREPANCY', 'DEMO_STATE_EDISTRICT', 'Karnataka', 'Kerala', 'Domicile state mismatch', 'PENDING_REVIEW'),
('88888888-8888-8888-8888-888888888805', '66666666-6666-6666-6666-666666666601', NULL, 'Rahul Kumar', 'Post-Matric Scholarship for ST Students', 'PVTG_VALIDATION', 'INTERNAL', 'false', 'true', 'PVTG validation check needed', 'PENDING_REVIEW')
ON CONFLICT (id) DO NOTHING;

INSERT INTO payments (id, application_id, student_id, scheme_name, payment_status, amount)
VALUES 
('99999999-9999-9999-9999-999999999901', '66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222222', 'Post-Matric Scholarship for ST Students', 'BANK_PROCESSING', 67500),
('99999999-9999-9999-9999-999999999902', '66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222222', 'National Fellowship and Scholarship for Higher Education (Top Class)', 'CREDITED', 86000)
ON CONFLICT (id) DO NOTHING;

INSERT INTO verification_records (id, application_id, verification_type, verification_source, status, confidence)
VALUES 
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '66666666-6666-6666-6666-666666666601', 'ST_STATUS', 'DEMO_STATE_EDISTRICT', 'VERIFIED', 98.5),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '66666666-6666-6666-6666-666666666601', 'INCOME', 'DEMO_STATE_EDISTRICT', 'MISMATCH', 68),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '66666666-6666-6666-6666-666666666601', 'INSTITUTION', 'DEMO_AISHE', 'VERIFIED', 100),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '66666666-6666-6666-6666-666666666601', 'ACADEMIC', 'DEMO_APAAR', 'VERIFIED', 95),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '66666666-6666-6666-6666-666666666601', 'DOCUMENT', 'DEMO_DIGILOCKER', 'VERIFIED', 92)
ON CONFLICT (id) DO NOTHING;

INSERT INTO notifications (id, user_id, title, message, type)
VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '11111111-1111-1111-1111-111111111111', 'Application Submitted', 'Your application APP-2025-00142 has been submitted.', 'APPLICATION'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', 'Payment Credited', 'Payment for APP-2025-00089 has been credited.', 'PAYMENT'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '11111111-1111-1111-1111-111111111111', 'Action Required', 'Income certificate mismatch found for APP-2025-00142.', 'ACTION_REQUIRED'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', '11111111-1111-1111-1111-111111111111', 'Document Verified', 'Your ST Certificate has been verified.', 'DOCUMENT'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', '11111111-1111-1111-1111-111111111111', 'Institution Verification', 'Your institution has verified your application.', 'VERIFICATION')
ON CONFLICT (id) DO NOTHING;
