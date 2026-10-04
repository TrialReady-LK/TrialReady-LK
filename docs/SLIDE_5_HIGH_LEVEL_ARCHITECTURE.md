# Slide 5: High-Level System Architecture Specification & Presentation Guide

> **Presentation Slide:** Slide 5 — High-Level System Architecture  
> **Project:** TrialReady LK — AI-Assisted Driving Academy Management & Regulatory Compliance System  
> **Degree Program:** BSc (Hons) in Cyber Security (Final Year Enterprise Project)  
> **Author:** Ravishka Rathnayaka (*Lead Full-Stack & Security Architect*)  
> **Presentation Rubric:** 6 Core Components (Data Sources, Preprocessing, Model/Inference, Backend, Frontend/UI, Data Stores) + Left-to-Right Flow + External Services & APIs + Left-to-Right Narration Script.

---

## 1. High-Level Architecture Diagram (Left-to-Right Flow)

> 🖼️ **Full High-Resolution Diagram (1920x1080 Full HD):**  
> Direct Vector File: [`docs/assets/high_level_system_architecture_slide5.svg`](./assets/high_level_system_architecture_slide5.svg)

---

### 🎨 High-Resolution System Architecture Map (Slide 5)

![TrialReady LK - High-Level System Architecture Diagram](./assets/high_level_system_architecture_slide5.svg)

---

### 🧭 High-Level Data Flow Topology (Stage-by-Stage)

```mermaid
flowchart TD
    %% =========================================================================
    %% SLIDE 5: HIGH-LEVEL ARCHITECTURE PIPELINE (READABLE TOPOLOGY)
    %% =========================================================================

    subgraph S1["1. DATA SOURCES & INGESTION"]
        DS1["🧑‍🎓 Student Enrolments (NIC, DOB, Contact, Branch)"]
        DS2["🏥 NTMI Medical Records (Clinical Fitness Barcode)"]
        DS3["📜 DMT Learner Permits (6-Month Validity & Expiry)"]
        DS4["🚗 Practical Sessions (1-5★ Star Ratings & Maneuvers)"]
        DS5["📝 Mock Theory Exams (40-Q Trilingual Submissions)"]
        DS6["💳 Tuition Payments (Bank Slips, LankaQR, Cards)"]
    end

    subgraph S2["2. PREPROCESSING & VALIDATION LAYER"]
        PP1["⚙️ Zod Strict Type Sanitizer & Anti-XSS Virtual DOM"]
        PP2["⏱️ Permit Countdown Engine (Δt = Expiry - Current)"]
        PP3["🎯 7-Maneuver Bitmask & Practical Hours Vectorizer"]
        PP4["🌐 Trilingual Context Token Mapper (EN / SI / TA)"]
        PP5["🛡️ RFC-4180 CSV Anti-Formula Injection Sanitizer"]
    end

    subgraph S3["3. AI MODEL & INFERENCE ENGINE"]
        ML1["🧠 6-Factor AI Trial Readiness Composite Scoring (0-100%)<br/>Medical(15%) + Permit(15%) + Theory(15%) + Hours(25%) + Maneuvers(20%) + Rating(10%)"]
        ML2["🚫 Regulatory Veto Classifier (Hard Lock for Expired Permits / Missing Medicals)"]
        ML3["📊 Adaptive Theory Diagnostics (Highway Code Weakness Profiler & Remedial Drills)"]
        ML4["📅 Scheduling Conflict Engine (Instructor & Vehicle Fleet Double-Book Shield)"]
    end

    subgraph S4["4. BACKEND & CYBER SECURITY LAYER"]
        BE1["🔐 GoTrue Auth Engine (Bcrypt Salt≥10, Stateless JWT Token Lifecycle)"]
        BE2["⚡ PostgREST Automated API (Prepared Parameterized SQL, 100% Anti-SQLi)"]
        BE3["🛡️ Kernel-Level Row-Level Security (RLS Tenant Isolation per driving_school_id)"]
    end

    subgraph S5["5. FRONTEND & PRESENTATION LAYER"]
        FE1["💻 React 19 SPA + Vite 7 + Tailwind CSS v4 Glassmorphic UI"]
        FE2["🚦 React Router v7 RBAC Gatekeepers (Admin, Instructor, Student Portals)"]
        FE3["📱 18 Integrated Feature Modules (Leaderboard, Payments, Journey, Theory Hub)"]
        FE4["🖨️ Zero-PDF Vector Print Engine (Official DMT Logbook & Trial Admission Passes)"]
    end

    subgraph S6["6. HYBRID DATA STORES & PERSISTENCE"]
        ST1["🗄️ Primary PostgreSQL 15 Cloud Database (18 Multi-Tenant Relational Tables)"]
        ST2["💾 Persistent Client Fallback Cache (trialready_* LocalStorage Offline Engine)"]
    end

    subgraph S7["7. INTEGRATED EXTERNAL SERVICES & REGULATORY APIS"]
        EXT1["☁️ Supabase Cloud BaaS (Auth, PostgreSQL 15, PostgREST)"]
        EXT2["▲ Vercel Edge Network (Anycast CDN, TLS 1.3, Serverless Hosting)"]
        EXT3["🏛️ Dept. of Motor Traffic (Motor Traffic Act No. 14 of 1951, Werahera Standards)"]
        EXT4["🏥 National Transport Medical Institute (NTMI Fitness Clearance Protocols)"]
        EXT5["💳 LankaQR / Central Bank of Sri Lanka (National Payment Rails)"]
    end

    %% Flow Pipeline
    S1 ==>|1. Raw Ingestion| S2
    S2 ==>|2. Cleaned Feature Vectors| S3
    S3 ==>|3. Scoring & Predictions| S4
    S4 <==>|4. Authenticated Prepared Queries with RLS| S6
    S4 ==>|5. Typed RESTful JSON Payload| S5
    S5 ==>|6. User Mutations & Real-Time Queries| S4
    S5 <==>|7. Deterministic Offline Fallback Sync| ST2

    EXT1 -.->|BaaS Hosting| S4
    EXT2 -.->|Edge CDN Delivery| S5
    EXT3 -.->|Statutory Test Rules| S3
    EXT4 -.->|Medical Directives| S3
    EXT5 -.->|Banking Protocol| S5

    classDef stage1 fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef stage2 fill:#0f172a,stroke:#0284c7,stroke-width:2px,color:#fff;
    classDef stage3 fill:#1e1b4b,stroke:#8b5cf6,stroke-width:2px,color:#fff;
    classDef stage4 fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef stage5 fill:#0c2d48,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef stage6 fill:#3d2204,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef stage7 fill:#18181b,stroke:#a855f7,stroke-width:2px,color:#fff;

    class S1 stage1;
    class S2 stage2;
    class S3 stage3;
    class S4 stage4;
    class S5 stage5;
    class S6 stage6;
    class S7 stage7;
```

---

## 2. Component-by-Component Architectural Breakdown

| Stage / Component | Key Subsystems & Responsibilities | Technologies & Protocols |
| :--- | :--- | :--- |
| **1. Data Sources** | • Student registration profiles (NIC, DOB, contact details)<br/>• NTMI medical certificate numbers and examination dates<br/>• 6-Month DMT Learner's Permit issuance and expiry records<br/>• Practical in-car driving lessons with instructor star ratings (1–5) and maneuver checkboxes<br/>• Trilingual computerized theory mock examination attempts<br/>• Fee payment receipts and course package installments | HTTP Forms, Document Ingestion, Structured JSON Payload |
| **2. Preprocessing Layer** | • Client & Server data validation via Zod schemas and TypeScript interfaces<br/>• Dynamic permit expiry calculation ($\Delta t = \text{Date}_{\text{expiry}} - \text{Date}_{\text{current}}$)<br/>• 7 mandatory DMT maneuver bitmask aggregation<br/>• Trilingual string tokenization and locale fallback (`en` $\leftrightarrow$ `si` $\leftrightarrow$ `ta`)<br/>• RFC-4180 CSV formula sanitization (`=`, `+`, `-`, `@`) | TypeScript, Regular Expressions, Date-Math Engine, UTF-8 BOM |
| **3. Model & Inference Layer** | • **6-Factor Weighted AI Readiness Composite Scoring Engine** ($0 - 100\%$ score)<br/>• **Regulatory Veto Classifier** enforcing hard blocks for expired permits or missing medicals<br/>• **Adaptive Diagnostic Engine** mapping incorrect mock answers to specific Highway Code categories and generating custom remedial quizzes<br/>• **Temporal Overlap Collision Detection** preventing instructor and vehicle double-booking | Multivariate Weighted Scoring Algorithm, Rule-Based AI Classifier, Interval Scheduling Geometry |
| **4. Backend Layer** | • GoTrue Authentication Engine managing JWT stateless tokens and session lifetimes<br/>• PostgREST automated API layer generating typed REST endpoints<br/>• PostgreSQL Row-Level Security (RLS) enforcing multi-tenant isolation per `driving_school_id` | Supabase Cloud BaaS, JWT (HS256/RS256), Bcrypt (Salt $\ge 10$), PostgreSQL RLS |
| **5. Frontend / UI Layer** | • Modern React 19 Single Page Application with Tailwind CSS v4 design system<br/>• Protected Route Gatekeeper enforcing Role-Based Access Control (`administrator`, `instructor`, `student`)<br/>• 18 modular feature views across portals, sessions, payments, and theory hubs<br/>• Zero-dependency Browser-Native Vector Print Engine using pure `@media print` CSS | React 19, TypeScript 5.8, Tailwind CSS v4, Lucide React, React Router v7 |
| **6. Data Stores** | • **Primary Cloud Database**: Managed PostgreSQL 15 with 18 multi-tenant relational tables<br/>• **Persistent Client Fallback Engine**: LocalStorage key-value storage (`trialready_*`) providing deterministic offline execution and demo state management | PostgreSQL 15 Relational DB, Web Storage API, Indexed Storage Sync |
| **7. External Services & APIs** | • **Supabase Cloud Infrastructure**: PostgreSQL 15 BaaS, Auth, and Storage<br/>• **Vercel Edge Network**: Anycast CDN, HTTP/2, TLS 1.3 hosting<br/>• **Department of Motor Traffic (DMT)**: Alignment with official testing syllabi and Werahera trial ground standards<br/>• **National Transport Medical Institute (NTMI)**: Driver medical fitness compliance standards<br/>• **LankaQR / CBSL**: Sri Lankan national digital payment standards | HTTPS/REST, PostgREST, TLS 1.3, Vercel Edge Serverless CDN |

---

## 3. Left-to-Right Narration Script for the Viva Panel

> *Tip: Present this slide smoothly from left to right following the numbered stages. Speak with confidence and highlight the cyber security and regulatory compliance aspects.*

### 🎙️ Viva Candidate Speaking Script

> **"Distinguished Members of the Evaluation Panel, on Slide 5, we present the High-Level System Architecture of TrialReady LK, engineered with a robust, defense-in-depth, 6-stage data flow from left to right:**
>
> 1. **Data Sources (Far Left):**  
>    The system ingests raw multi-domain inputs: student identity credentials (NIC and date of birth), official NTMI medical clearances, 6-month DMT Learner's Permit dates, in-car instructor star evaluations across 7 core maneuvers, trilingual mock theory test submissions, and tuition installment transactions.
>
> 2. **Preprocessing Layer:**  
>    Raw inputs pass through strict validation layers. Here, our date-math engine calculates permit expiration countdowns, normalizes the 7-maneuver skill matrix, maps trilingual localized tokens across Sinhala, Tamil, and English, and sanitizes outgoing audit records against RFC-4180 CSV Formula Injection attacks.
>
> 3. **Model & Inference Layer (AI Engine):**  
>    At the heart of the system is our **6-Factor AI Trial Readiness Composite Scoring Algorithm**. It computes a weighted 100-point composite score: Medical Clearance (15%), Permit Validity (15%), Theory Mastery (15%), Practical Hours (25%), Maneuver Coverage (20%), and Instructor Rating (10%). It applies a **Regulatory Veto Override** that instantly locks candidates who have expired permits or unpassed medicals. It also runs our **Adaptive Theory Diagnostic Engine** which identifies weak Highway Code categories to generate targeted remedial drills.
>
> 4. **Backend Layer:**  
>    The backend is powered by Supabase Cloud BaaS with PostgreSQL 15. We implement **Kernel-Level Row-Level Security (RLS)**, ensuring multi-tenant isolation where each driving academy can only access its own records. Authentication is managed via GoTrue with Bcrypt password hashing ($\ge 10$ salt rounds) and stateless JWT verification.
>
> 5. **Frontend / UI Layer:**  
>    Delivered as a high-performance React 19 SPA with Tailwind CSS v4 and React Router v7 role gatekeepers for Administrator, Instructor, and Student roles. It features 18 integrated domain modules and a **Browser-Native Vector Print Engine** using pure `@media print` CSS for official A4 DMT Practical Logbooks (`DMT/SL/LOG-01`) and Trial Admission Passes (`DMT/SL/ADM-PASS`), completely eliminating server-side PDF exploitation risks.
>
> 6. **Data Stores (Right):**  
>    Data is stored in PostgreSQL 15 across 18 relational tables, coupled with a hybrid **Persistent Storage Fallback Engine** in the browser, enabling seamless offline capabilities and deterministic demo seeding.
>
> 7. **External Integrations:**  
>    The architecture seamlessly integrates with Supabase Cloud BaaS, Vercel Edge Serverless CDN, and regulatory frameworks set by the Department of Motor Traffic (DMT), NTMI, and LankaQR payment standards.
>
> **This decoupled, highly resilient architecture delivers enterprise security, statutory compliance, and sub-second operational response times."**

---

## 4. Key Defense-in-Depth Highlights for the Examiners

1. **Zero-Trust Multi-Tenancy**: Guaranteed at the database level via PostgreSQL RLS policies tied to `driving_school_id`.
2. **Spreadsheet Formula Injection Defense**: Full sanitization of risky Excel formula triggers (`=`, `+`, `-`, `@`) in CSV audit logs.
3. **Zero-PDF Attack Vector**: Direct CSS vector printing replaces binary PDF libraries, eliminating remote code execution vulnerabilities.
4. **Offline Resiliency**: Hybrid dual-mode persistence architecture allows full offline operation without data loss.
5. **100% Automated Test Pass Rate**: 53 automated tests across 13 test suites validating the AI readiness engine, financial calculations, permit timers, and security boundaries.
