# FaidaFarm / FMNR System Guide

Prepared for the FaidaFarm team.

This document explains what the current FaidaFarm application contains, how the frontend pages work, what the backend code does, what the database stores, and what professional skills are normally needed to build and maintain this type of system.

---

## 1. System Summary

FaidaFarm is a farming and FMNR monitoring platform. It currently supports two main user workspaces:

1. Farmer Workspace
2. Research / FMNR Workspace

The same frontend code is used for:

1. Web app
2. Mobile web app
3. Android app through Capacitor
4. Desktop browser app

The backend is a FastAPI system prepared for:

1. Firebase authentication
2. PostgreSQL database storage
3. Farmer APIs
4. Research APIs
5. Field collection APIs
6. KoboToolbox integration
7. Admin analytics
8. Media and notification foundations
9. AI prediction foundations
10. Render deployment

---

## 2. Frontend Applications

### 2.1 Web App

The web app runs in a normal browser. It is built with React and Vite.

Main purpose:

1. Allow users to log in.
2. Let farmers manage farming information.
3. Let researchers monitor FMNR and nutrition records.
4. Let field officers collect and review field data.
5. Let admins review analytics and exports.

Deployment:

The web app is deployed to Firebase Hosting.

Live hosting target:

https://faidafarm-baa26.web.app

### 2.2 Mobile Web App

The mobile web app is the same React app but styled for phone screens.

Main purpose:

1. Give users a clean phone experience.
2. Show bottom navigation on mobile.
3. Use compact pages, clean tables, and mobile-friendly menus.
4. Allow quick navigation between Dashboard, Households, FMNR, Nutrition, Reports, and Settings.

### 2.3 Android App

The Android app is created from the same web app using Capacitor.

Main purpose:

1. Package FaidaFarm as an installable Android app.
2. Use the same React screens inside a native Android shell.
3. Support phone use by farmers, researchers, supervisors, and field officers.

Android package:

com.faidafarm.app

### 2.4 Desktop Browser App

The desktop version is used on laptops and larger screens.

Main purpose:

1. Show side navigation.
2. Support wider dashboards and data tables.
3. Give admins and researchers more space for monitoring workflows.

---

## 3. Frontend Code Structure

Main frontend folder:

src/

Important files and folders:

1. src/App.jsx
   - Defines all frontend routes.
   - Decides which page opens for each URL.
   - Protects farmer, research, and admin routes using stored user role information.

2. src/main.jsx
   - Starts the React app.
   - Applies the app theme.
   - Mounts the app into the browser.

3. src/index.css
   - Contains global styling.
   - Includes mobile layout refinements.
   - Includes light and dark theme support.

4. src/auth/session.js
   - Stores and reads local user session details.
   - Helps decide whether the user is a farmer, researcher, field officer, supervisor, admin, or viewer.

5. src/components/farmer/
   - Shared farmer layout components.
   - Includes farmer sidebar, mobile menu, cards, buttons, and bottom navigation.

6. src/modules/farmer/
   - Farmer workspace pages.

7. src/research/
   - Research, FMNR, field collection, and admin monitoring pages.

8. src/settings/
   - Shared settings pages for farmer and research workspaces.

9. android/
   - Native Android project generated and synced by Capacitor.

10. dist/
   - Production build output used for Firebase deployment.

---

## 4. Frontend Pages and How They Work

## 4.1 Public and Account Pages

### Onboarding

Route:

/onboarding

Purpose:

Introduces the app and helps the user choose the correct workspace.

### Login

Route:

/login

Purpose:

Allows the user to enter the app. The current frontend has the login flow prepared. Backend Firebase verification is also prepared.

### Signup

Route:

/signup

Purpose:

Collects account details for new users.

### Forgot Password

Route:

/forgot-password

Purpose:

Starts password recovery.

### OTP Verification

Route:

/verify-otp

Purpose:

Verifies a code during account recovery or verification flow.

### Reset Password

Route:

/reset-password

Purpose:

Allows a user to set a new password.

---

## 4.2 Farmer Workspace Pages

### Farmer Dashboard

Route:

/dashboard

Purpose:

Shows the farmer a quick summary of farm performance, market highlights, weather, alerts, and useful actions.

How it works:

1. Opens after a farmer logs in.
2. Shows cards and summaries.
3. Links the farmer to other tools.

### My Farm

Route:

/my-farm

Purpose:

Shows farm details, crops, acreage, and farm-related records.

How it works:

1. Helps the farmer view farm information.
2. Prepares the app for crop and farm records from the backend.

### Market Intelligence

Route:

/market-intelligence

Purpose:

Shows crop prices and market information.

How it works:

1. Displays price information.
2. Prepares for future market prediction.

### Sell Smart

Route:

/sell-smart

Purpose:

Helps farmers decide when and where to sell.

How it works:

1. Shows selling guidance.
2. Prepared for future recommendation logic.

### Buyers

Route:

/buyers

Purpose:

Shows possible buyers and buyer contacts.

How it works:

1. Lists buyer information.
2. Prepares for buyer matching.

### Weather

Route:

/weather

Purpose:

Shows weather information relevant to the farmer.

How it works:

1. Displays weather snapshots.
2. Prepares for future weather risk alerts.

### Alerts

Route:

/alerts

Purpose:

Shows important farmer alerts.

How it works:

1. Lists farm, weather, price, or system alerts.
2. Prepares for backend notifications.

### Tools and Services

Route:

/tools-services

Purpose:

Shows useful services and support tools.

How it works:

1. Groups useful farmer services.
2. Can later connect to real service providers.

### Financing

Route:

/financing

Purpose:

Placeholder for future farmer financing features.

How it works:

1. Shows financing readiness.
2. Does not process real payments or loans yet.

### Farmer Settings

Routes:

/settings
/settings/profile
/settings/security
/settings/preferences
/settings/notifications
/settings/help

Purpose:

Allows users to manage profile, email, password area, theme preferences, notifications, and help.

How it works:

1. Main settings page shows clean account rows.
2. Each settings feature opens on its own page.
3. Browser and Android back navigation return to the previous settings page.

---

## 4.3 Research / FMNR Workspace Pages

### Research Dashboard

Route:

/research

Purpose:

Shows FMNR monitoring summary.

How it works:

1. Displays household counts.
2. Displays FMNR plot counts.
3. Displays child nutrition summary.
4. Shows county summary and field activity.

### Households

Route:

/research/households

Purpose:

Shows household monitoring records.

How it works:

1. Lists household IDs.
2. Shows county and site information.
3. Supports future filtering and backend household data.

### FMNR Plots

Route:

/research/fmnr-plots

Purpose:

Tracks FMNR plots.

How it works:

1. Shows plot IDs.
2. Shows county.
3. Shows FMNR intensity.
4. Shows whether GPS was captured.

### Child Nutrition

Route:

/research/child-nutrition

Purpose:

Tracks child dietary diversity and nutrition records.

How it works:

1. Shows children assessed.
2. Shows MDD achievement.
3. Shows FMNR food benefit.
4. Lists 24-hour recall records.

### Field Activity

Route:

/research/field-activity

Purpose:

Shows enumerator progress and review readiness.

How it works:

1. Lists field activity.
2. Helps supervisors see what was captured and reviewed.

### Sync Status

Route:

/research/sync-status

Purpose:

Shows field device sync status.

How it works:

1. Shows device sync information.
2. Helps identify records that are synced, queued, or failed.

### Reports

Route:

/research/reports

Purpose:

Prepares report and export workflows.

How it works:

1. Shows report options.
2. Prepares for CSV, JSON, and county reports.

### Research Settings

Routes:

/research/settings
/research/settings/profile
/research/settings/security
/research/settings/preferences
/research/settings/notifications
/research/settings/help

Purpose:

Same settings experience as the farmer workspace, but for research users.

---

## 4.4 Field Collection Pages

### Field Home

Route:

/research/field

Purpose:

Shows field collection workflow summary.

How it works:

1. Shows active forms.
2. Shows draft submissions.
3. Shows queued records.
4. Shows sync issues.

### Forms Library

Route:

/research/field/forms

Purpose:

Lists field forms.

How it works:

1. Shows available forms.
2. Allows field teams to open form previews.

### New Form Builder

Route:

/research/field/forms/new

Purpose:

Prepares form creation.

How it works:

1. Shows a form building interface.
2. Prepares future custom Kobo-like forms.

### Form Preview

Route:

/research/field/forms/:formId

Purpose:

Shows one form before collection.

How it works:

1. Displays form details.
2. Shows the questions and structure.

### Submissions

Route:

/research/field/submissions

Purpose:

Shows submitted field records.

How it works:

1. Lists submissions.
2. Shows status and review readiness.

### Drafts

Route:

/research/field/drafts

Purpose:

Shows local draft records.

How it works:

1. Allows field officers to see saved drafts.
2. Prepares offline collection behavior.

### Devices

Route:

/research/field/devices

Purpose:

Shows registered devices.

How it works:

1. Lists devices used by field teams.
2. Tracks sync and device information.

### Sync Queue

Route:

/research/field/sync-queue

Purpose:

Shows queued field records waiting to sync.

How it works:

1. Shows queued, failed, and synced counts.
2. Prepares retry and offline sync logic.

---

## 4.5 Admin Analytics Pages

### Admin Overview

Route:

/research/admin

Purpose:

Shows high-level monitoring indicators.

How it works:

1. Shows household totals.
2. Shows child totals.
3. Shows FMNR plot totals.
4. Shows average diet score.

### FMNR Map

Route:

/research/admin/fmnr-map

Purpose:

Prepares geographic FMNR monitoring.

How it works:

1. Shows map-ready FMNR information.
2. Prepares future GIS/map integration.

### Diet Scores

Route:

/research/admin/diet-scores

Purpose:

Shows child diet score analysis.

How it works:

1. Lists nutrition scoring information.
2. Prepares chart-ready analytics.

### County Comparison

Route:

/research/admin/county

Purpose:

Compares counties.

How it works:

1. Shows county performance.
2. Helps supervisors compare adoption, nutrition, and activity.

### Exports

Route:

/research/admin/exports

Purpose:

Prepares data export tools.

How it works:

1. Prepares CSV export.
2. Prepares JSON export.
3. Prepares report export.

---

## 5. Backend Overview

Backend folder:

backend/

Backend stack:

1. Python
2. FastAPI
3. PostgreSQL
4. SQLAlchemy 2.0
5. Alembic migrations
6. Pydantic schemas
7. Firebase Admin SDK
8. Render deployment configuration

Main backend command:

uvicorn app.main:app --reload

Production idea:

Run the FastAPI app on Render using the configured start command and environment variables.

---

## 6. Backend Code Structure

### backend/app/main.py

Purpose:

Starts the FastAPI app.

What it does:

1. Creates the API application.
2. Loads routes.
3. Applies middleware.
4. Adds health checks.
5. Prepares startup and shutdown lifecycle.

### backend/app/core/config.py

Purpose:

Stores environment-based settings.

What it does:

1. Reads DATABASE_URL.
2. Reads FIREBASE_PROJECT_ID.
3. Reads FRONTEND_URL.
4. Reads ENVIRONMENT.
5. Reads Kobo settings.
6. Controls CORS origins.

### backend/app/core/database.py

Purpose:

Connects the backend to PostgreSQL.

What it does:

1. Creates the SQLAlchemy engine.
2. Creates database sessions.
3. Provides database dependency for API routes.
4. Uses database pooling settings.

### backend/app/core/security.py

Purpose:

Controls authentication and roles.

What it does:

1. Reads bearer tokens from Authorization headers.
2. Verifies the current user.
3. Enforces role-based access.
4. Blocks inactive users.
5. Returns 401 or 403 errors when needed.

### backend/app/core/middleware.py

Purpose:

Handles global backend middleware.

What it does:

1. Supports production error handling.
2. Helps keep API responses cleaner.

### backend/app/core/logging.py

Purpose:

Sets up backend logging.

What it does:

1. Helps track backend events.
2. Supports production debugging.

---

## 7. Backend API Routes

Main API router:

backend/app/api/v1/api.py

It connects all route files into one versioned API under:

/api/v1

### Health Routes

File:

backend/app/api/v1/routes/health.py

Main endpoint:

/api/v1/health

Purpose:

Checks whether the backend is running.

### Auth Routes

File:

backend/app/api/v1/routes/auth.py

Main endpoint:

/api/v1/auth/verify

Purpose:

1. Receives Firebase ID token from frontend.
2. Verifies the token.
3. Finds or creates the user in PostgreSQL.
4. Returns user information.

### User Routes

File:

backend/app/api/v1/routes/users.py

Main endpoints:

1. /api/v1/users/me
2. /api/v1/users/admin-check

Purpose:

1. Returns current user profile.
2. Tests admin-only access.

### Farmer Routes

File:

backend/app/api/v1/routes/farmer.py

Main endpoints:

1. /api/v1/farmer/dashboard
2. /api/v1/farmer/farms
3. /api/v1/farmer/market-prices
4. /api/v1/farmer/weather
5. /api/v1/farmer/buyers
6. /api/v1/farmer/alerts

Purpose:

Supports the farmer workspace.

### Research Routes

File:

backend/app/api/v1/routes/research.py

Main endpoints:

1. /api/v1/research/households
2. /api/v1/research/fmnr-plots
3. /api/v1/research/child-nutrition
4. /api/v1/research/field-activity

Purpose:

Supports FMNR household and nutrition monitoring.

### Field Routes

File:

backend/app/api/v1/routes/field.py

Main endpoints:

1. /api/v1/field/forms
2. /api/v1/field/submissions
3. /api/v1/field/devices
4. /api/v1/field/sync

Purpose:

Supports field officer workflows, draft submissions, queued submissions, GPS structure, and media structure.

### Kobo Integration Routes

File:

backend/app/api/v1/routes/integrations_kobo.py

Main endpoints:

1. /api/v1/integrations/kobo/sync
2. /api/v1/integrations/kobo/status

Purpose:

Allows admin users to sync KoboToolbox submissions into the backend.

### Admin Analytics Routes

File:

backend/app/api/v1/routes/admin.py

Main endpoints:

1. /api/v1/admin/overview
2. /api/v1/admin/fmnr-map
3. /api/v1/admin/diet-scores
4. /api/v1/admin/county-comparison
5. /api/v1/admin/sync-summary

Purpose:

Supports admin dashboards and monitoring intelligence.

### Prediction Routes

File:

backend/app/api/v1/routes/predictions.py

Main endpoints:

1. /api/v1/predictions/market
2. /api/v1/predictions/recommendations

Purpose:

Prepares future AI prediction services.

### Operations Routes

File:

backend/app/api/v1/routes/operations.py

Purpose:

Supports data quality, safeguarding, supervisor review, consent, and audit foundations.

### Media Routes

File:

backend/app/api/v1/routes/media.py

Purpose:

Prepares upload and media metadata workflows.

### Notifications Routes

File:

backend/app/api/v1/routes/notifications.py

Purpose:

Prepares user and system notification workflows.

### Settings Routes

File:

backend/app/api/v1/routes/settings.py

Purpose:

Prepares organization, project, county, site, and feature flag configuration.

---

## 8. Backend Services

### Firebase Auth Service

File:

backend/app/services/firebase_auth.py

Purpose:

Verifies Firebase ID tokens safely.

What it does:

1. Initializes firebase-admin safely.
2. Verifies Firebase ID token.
3. Returns decoded token.
4. Handles missing, invalid, and expired tokens cleanly.

Important rule:

The backend should not store Firebase ID tokens.

### User Service

File:

backend/app/services/users.py

Purpose:

Finds or creates users after login.

### Analytics Service

File:

backend/app/services/analytics.py

Purpose:

Builds admin dashboard summaries.

### Kobo Client

Files:

1. backend/app/integrations/kobo/client.py
2. backend/app/integrations/kobo/sync_service.py
3. backend/app/integrations/kobo/parsers.py

Purpose:

1. Connects to Kobo API.
2. Pulls submissions.
3. Prevents duplicate imports.
4. Stores sync logs.
5. Avoids exposing Kobo tokens.

### Prediction Services

Folder:

backend/app/services/predictions/

Files:

1. market_prediction.py
2. recommendation_engine.py
3. weather_risk.py

Purpose:

Prepares future AI services for:

1. Price forecasting.
2. Sell-now recommendations.
3. Weather risk alerts.

Current status:

Architecture only. No heavy ML training is implemented yet.

---

## 9. Database Overview

Database:

PostgreSQL

ORM:

SQLAlchemy 2.0

Migrations:

Alembic

Migration command:

alembic upgrade head

Main database purpose:

Store users, farmers, farms, crops, research households, FMNR plots, nutrition records, field submissions, media metadata, Kobo sync records, analytics support data, settings, and notifications.

---

## 10. Main Database Tables and Meaning

### users

Stores app users.

Important fields:

1. id
2. firebase_uid
3. email
4. phone
5. full_name
6. role
7. is_active
8. created_at
9. updated_at

Roles:

1. farmer
2. field_officer
3. researcher
4. supervisor
5. analyst
6. admin
7. viewer

### farms

Stores farmer farm records.

Connected to:

users

Meaning:

Each farmer can have one or more farms.

### crops

Stores crops grown on farms.

Connected to:

farms

Meaning:

A farm can have many crops.

### market_prices

Stores crop market prices.

Meaning:

Used by market intelligence and future price prediction.

### weather_snapshots

Stores weather information.

Meaning:

Used by weather pages and future weather risk alerts.

### buyers

Stores buyer information.

Meaning:

Used to connect farmers to possible buyers.

### farmer_alerts

Stores alerts for farmers.

Meaning:

Used for price, weather, farm, and system alerts.

### research_sites

Stores research site information.

Meaning:

Used to organize research by county and site.

### households

Stores household records.

Connected to:

research_sites

Meaning:

Used for FMNR household monitoring.

### household_members

Stores household member records.

Connected to:

households

Meaning:

Used for household-level demographic records.

### child_nutrition_records

Stores child nutrition records.

Connected to:

households

Meaning:

Used to track diet diversity, MDD status, and nutrition monitoring.

### fmnr_plots

Stores FMNR plot records.

Connected to:

households and research sites

Meaning:

Used to track FMNR adoption and plot verification.

### enumerator_activities

Stores field officer or enumerator activity.

Meaning:

Used to monitor field progress and review readiness.

### field_forms

Stores field collection forms.

Meaning:

Used for Kobo-like form workflows.

### field_questions

Stores questions inside a field form.

Connected to:

field_forms

Meaning:

Each form can have many questions.

### field_submissions

Stores submitted form records.

Meaning:

Supports draft, queued, synced, and failed submission states.

Submission statuses:

1. draft
2. queued
3. synced
4. failed

### submission_answers

Stores answers for each field submission.

Connected to:

field_submissions

### submission_media

Stores photo and media metadata.

Meaning:

Prepares the system for future media uploads.

### device_registrations

Stores field device records.

Meaning:

Used to track devices used by field teams.

### sync_queue

Stores queued sync actions.

Meaning:

Prepares offline-ready sync workflows.

### kobo_import_logs

Stores Kobo import results.

Meaning:

Prevents duplicate imports and tracks sync errors.

### kobo_project_configs

Stores Kobo project configuration.

Meaning:

Allows the backend to manage Kobo project sync settings without hardcoding tokens.

### media_assets

Stores media metadata.

Meaning:

Prepares photo and file upload workflows.

### data_quality_flags

Stores possible data quality issues.

Meaning:

Helps supervisors review bad or missing data.

### supervisor_reviews

Stores review records.

Meaning:

Supports supervisor approval and correction workflows.

### safeguarding_referrals

Stores safeguarding or referral records.

Meaning:

Supports sensitive field workflows.

### consent_records

Stores consent status.

Meaning:

Tracks whether consent was captured.

### audit_logs

Stores important system actions.

Meaning:

Supports audit-ready accountability.

### export_jobs

Stores export job status.

Meaning:

Prepares CSV, JSON, and report exports.

### system_notifications

Stores notifications for users.

Meaning:

Supports sync failure notices, review reminders, and system alerts.

### organization_settings

Stores organization-level settings.

### project_settings

Stores project-level settings.

### county_configurations

Stores county and site configuration.

### feature_flags

Stores feature switches.

Meaning:

Allows features to be turned on or off safely.

---

## 11. Authentication and Roles

Authentication method:

Firebase Auth token verification.

Frontend flow:

1. User logs in using Firebase Auth.
2. Firebase returns an ID token.
3. Frontend sends the ID token to the backend.
4. Backend verifies the token.
5. Backend finds or creates the user in PostgreSQL.
6. Backend returns the user profile and role.
7. Frontend opens the correct workspace.

Authorization header example:

Authorization: Bearer FIREBASE_ID_TOKEN_HERE

Role access:

1. farmer: Farmer workspace.
2. field_officer: Field collection workflow.
3. researcher: Research monitoring workflow.
4. supervisor: Research and admin-style review workflow.
5. analyst: Analytics-focused access.
6. admin: Full administrative access.
7. viewer: Read-only future access.

Inactive users:

If is_active is false, the backend should block access.

---

## 12. Deployment

### Frontend Deployment

Platform:

Firebase Hosting

Build command:

npm run build

Deploy command:

firebase deploy --only hosting

### Android Deployment / Update

Technology:

Capacitor

Sync command:

npx cap sync android

Install to connected Android phone:

Run the Android Gradle install task from the android folder.

### Backend Deployment

Platform:

Render

Backend folder:

backend/

Important files:

1. backend/render.yaml
2. backend/requirements.txt
3. backend/runtime.txt
4. backend/.env.example

Health check:

/api/v1/health

---

## 13. Environment Variables

Important backend environment variables:

1. DATABASE_URL
2. FIREBASE_PROJECT_ID
3. FRONTEND_URL
4. ENVIRONMENT
5. KOBO_BASE_URL
6. KOBO_API_TOKEN
7. KOBO_PROJECT_ID

Important security notes:

1. Do not hardcode database credentials.
2. Do not expose Kobo tokens.
3. Do not store Firebase ID tokens.
4. Keep production values in Render environment variables.

---

## 14. Developer Knowledge and Team Roles

This system is large enough that a professional production team would normally include several specialists.

Recommended professional team size:

8 to 12 people.

Recommended roles:

1. Product Manager
   - Defines what the app should do.
   - Prioritizes farmer, researcher, supervisor, and admin needs.

2. UI/UX Designer
   - Designs mobile, desktop, Android, and web experiences.
   - Keeps the app clean, simple, and easy to use.

3. Frontend Developer
   - Builds React pages.
   - Connects pages to APIs.
   - Handles mobile and desktop layouts.

4. Android / Mobile Developer
   - Manages Capacitor Android packaging.
   - Tests on real Android devices.
   - Handles app permissions and native behavior.

5. Backend Developer
   - Builds FastAPI APIs.
   - Implements authentication, roles, and business logic.
   - Connects services to the database.

6. Database Engineer
   - Designs PostgreSQL tables.
   - Manages migrations.
   - Optimizes queries and indexes.

7. DevOps / Deployment Engineer
   - Manages Firebase Hosting.
   - Manages Render backend deployment.
   - Handles environment variables and production readiness.

8. QA Tester
   - Tests web, mobile web, Android, and backend APIs.
   - Checks bugs before release.

9. Data / M&E Specialist
   - Confirms household, FMNR, nutrition, and field collection workflows.
   - Makes sure indicators match real monitoring needs.

10. Security / Privacy Reviewer
   - Reviews authentication, sensitive data, consent, and safeguarding workflows.

11. AI / Data Science Specialist
   - Later builds market prediction, weather risk, and recommendation models.

12. Kobo / Field Systems Specialist
   - Helps connect KoboToolbox and field workflows.

Current development note:

The current codebase has been built as a full-stack foundation. A smaller team can continue developing it, but production rollout should still involve testing, security review, field validation, and database review.

---

## 15. What Is Ready Now

Frontend ready foundations:

1. Farmer workspace.
2. Research workspace.
3. Field collection workspace.
4. Admin analytics workspace.
5. Settings pages.
6. Mobile web layout.
7. Android app shell.
8. Firebase Hosting deployment.

Backend ready foundations:

1. FastAPI app structure.
2. PostgreSQL database setup.
3. SQLAlchemy models.
4. Alembic migrations.
5. Firebase token verification structure.
6. Role-based access.
7. Farmer APIs.
8. Research APIs.
9. Field collection APIs.
10. Kobo integration structure.
11. Admin analytics APIs.
12. Media and notification foundations.
13. Prediction service foundations.
14. Render deployment files.

Database ready foundations:

1. Users and roles.
2. Farmer records.
3. Research records.
4. Field collection records.
5. Kobo sync records.
6. Operational records.
7. Analytics support records.
8. Settings records.
9. Notification records.

---

## 16. What Should Be Future Work

Frontend future work:

1. Connect every page to live backend APIs.
2. Replace remaining mock data with PostgreSQL data.
3. Add final loading, empty, and error states.
4. Add final Android device testing.
5. Add field usability testing with real users.

Backend future work:

1. Connect production Firebase project credentials.
2. Add complete admin user management.
3. Add complete media upload storage.
4. Add real Kobo project mapping rules.
5. Add stronger analytics queries.
6. Add background jobs for sync and exports.
7. Add full automated test coverage.

Database future work:

1. Add final indexes after real query patterns are known.
2. Add backup and restore process.
3. Add production monitoring.
4. Add data retention rules.

AI future work:

1. Train market price prediction models.
2. Build sell-now recommendation logic.
3. Build weather risk scoring.
4. Validate AI recommendations with field experts.

---

## 17. Simple Local Testing Guide

### Frontend

Install dependencies:

npm install

Run locally:

npm run dev

Build production files:

npm run build

### Android

Sync web app into Android:

npx cap sync android

Install on connected phone:

Use the Android Gradle install command from the android folder.

### Backend

Go to backend folder:

cd backend

Install Python packages:

pip install -r requirements.txt

Run migrations:

alembic upgrade head

Run backend:

uvicorn app.main:app --reload

Check backend:

/api/v1/health

---

## 18. Final Notes for the Team

FaidaFarm is structured as a serious production foundation. The frontend already supports farmer, research, field, admin, settings, mobile web, desktop web, and Android experiences. The backend already has the main architecture needed for authentication, PostgreSQL data, Kobo sync, analytics, media, notifications, and future AI.

The next big step is connecting the polished frontend screens to live backend data and testing the full workflow with real users in the field.
