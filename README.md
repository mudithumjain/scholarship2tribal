# TribalScholar (MoTA)
## Unified Scholarship Platform for Tribal Students
**Ministry of Tribal Affairs, Government of India**  
**Problem Statement ID: 26238** | *Unified Scholarship Mobile Application for Tribal Students*

---

## 🌟 Executive Summary

TribalScholar is a production-style, mobile-first **Digital Public Infrastructure (DPI)** platform designed to replace fragmented scholarship portals with **ONE unified student journey**.

Instead of navigating five separate departmental systems and repeatedly submitting identical physical documents every academic year, Scheduled Tribe (ST) students experience:
1. **One Lifelong Student Profile**
2. **Unified Discovery & Non-Black-Box Eligibility Engine**
3. **Multi-Step Application Wizard with 1-Click "Reuse Verified Information"**
4. **Digital Document Wallet Integrated with DigiLocker**
5. **Unified Verification Orchestrator across 7+ National & State Government Adapters**
6. **Non-Punitive Manual Review Exceptions** (No automatic disqualification for expired papers or spelling mismatches)
7. **Transparent Application Milestone Timeline with PFMS DBT Tracking**
8. **JAGO Context-Aware AI Scholarship Assistant with Voice Support**
9. **Officer Sanctions & Manual-Review Workspace**
10. **National Tribal Inclusion & Scholarship Gap Analytics**

---

## 🏛️ The 5 MoTA Scholarship Schemes Unified

| # | Scheme Name | Target Level | Annual Grant / Assistance |
|---|---|---|---|
| **1** | **Pre-Matric Scholarship for ST Students** | Classes IX & X | ₹3,500 – ₹7,000 / year (Day Scholar / Hosteller) |
| **2** | **Post-Matric Scholarship for ST Students** | Class XI to Post-Doctoral | 100% Compulsory Tuition Reimbursement + up to ₹13,500/yr Maintenance |
| **3** | **Top Class Education Scholarship for ST Students** | Premier Institutes (IIT, NIT, IIM, AIIMS, NLU) | 100% Tuition Waiver + ₹3,000/mo Living + ₹45,000 Computer Grant |
| **4** | **National Fellowship for ST Students (NFST)** | M.Phil / Ph.D. Research Scholars | ₹37,000 – ₹42,000 / month Fellowship + Contingency Grant |
| **5** | **National Overseas Scholarship (NOS)** | Top 500 QS Universities Abroad | 100% Foreign Tuition + ~$15,400/year Stipend + Airfare |

---

## 🔌 Unified Verification & Integration Layer (Mock DPI Adapters)

The platform decouples external dependencies through a standardized **Verification Orchestrator** interface:

```
                      [ Student Mobile App / PWA ]
                                   │
                                   ▼
                      [ Unified API Gateway ]
                                   │
                                   ▼
               [ Unified Verification Orchestrator ]
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
   [ Mock UIDAI ]          [ Mock DigiLocker ]        [ Mock AISHE ]
 Demographic Token         State Caste Registry    College Accreditation
         │                         │                         │
         ▼                         ▼                         ▼
   [ Mock APAAR ]          [ Mock e-District ]       [ Mock NPCI DBT ]
  ABC Credit History       Nadakacheri Income          Aadhaar APBS
                                   │
                                   ▼
          ┌─────────────────────────────────────────────────┐
          │  Standardized Result:                           │
          │  • VERIFIED                                     │
          │  • MANUAL_REVIEW_REQUIRED (Non-Punitive!)       │
          │  • CORRECTION_REQUESTED                         │
          └─────────────────────────────────────────────────┘
                                   │
                                   ▼
              [ District Welfare Officer Review Desk ]
```

---

## ⚡ The 2-Minute End-to-End Evaluator Story

Judges can test the complete end-to-end story using the **Persona Bar** at the top of the screen:

1. **Student View (Rahul Kumar, ST10001)**:
   - Observe the **Dashboard**: Total DBT received is ₹48,000; 1 pending action flagged.
   - Observe the **Post-Matric Application**: Status is in **Manual Review**.
   - Navigate to **Verification Center**: Notice that while UIDAI, DigiLocker, and AISHE are `VERIFIED`, the **State e-District Income Adapter** flagged that the certificate expired on `31-03-2025`.
   - Notice that the system **did not reject Rahul**. It created an exception for manual review.

2. **Officer View (Mr. Rajesh Meena, MoTA)**:
   - Click **"Officer (MoTA)"** in the top demo bar.
   - Open **Manual Review Queue**: Notice item `REV-1001` for Rahul Kumar.
   - Inspect the **Two-Column Inspector**: Student submitted `₹1,20,000` vs State record `Expired on 31-03-2025`.
   - Click **"Request Correction"** with note: *"Please upload renewed FY 2025-26 certificate"*.

3. **Student Resolution**:
   - Switch back to **"Student (Rahul)"**.
   - Notice the instant notification: *"Officer Action Required: Correction Requested"*.
   - Navigate to **Document Wallet** or click the banner **"Upload Renewed Cert (1-Click)"** or test with **"OCR Auto-Scan"**.
   - Upload the renewed certificate (`KA/RD/INC/2025/9902`). Status immediately updates to **VERIFIED**!

4. **Sanction & Disbursement**:
   - Switch back to **Officer View** and click **"Approve & Proceed to Sanction"**.
   - Switch to **Student View**:
     - Timeline moves to **Sanction** -> **Disbursement Credited**.
     - Payment Dashboard updates with an additional **₹34,000** credited to SBI ••••4589.
     - Confetti celebrates the completed disbursement!

5. **Ask JAGO AI**:
   - Ask JAGO: *"Why is my application pending?"* or *"What is my payment status?"*.
   - JAGO responds using the live student state with direct clickable action buttons.

---

## 🚀 Running Locally

```bash
# Clone or open workspace
cd "f:\New folder"

# Install dependencies (already completed)
npm install

# Start development preview server
npm run preview -- --port 3000 --host
```

Access the app in your browser at:  
👉 **`http://localhost:3000`**
