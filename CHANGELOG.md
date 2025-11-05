# Changelog

This document tracks the changes and simulated features implemented in the project.

## Prioritized Development Plan

This checklist is ordered by priority to guide the development process. We will work on converting these simulated features into functional ones in this order.

1.  [x] **Implement Login Functionality:**
    -   [x] Connect the login screen to a simulated authentication mechanism using `public/users.json`.
    -   [x] Handle user sessions and protect routes using `localStorage` and a `withAuth` HOC.
    -   [x] Added user roles (`admin`, `user`) to `users.json`.
    -   [x] Restricted access to the user management page to admins.
    -   [x] Added `deleted_at` column to `qrcodes` table for soft-delete functionality.

2.  [x] **Implement Dashboard Stats:**
    -   [x] Added `user_id` column to `qrcodes` table in `supabase_schema.sql`.
    -   [x] Modified `/api/qr` to filter by `deleted_at IS NULL` and `user_id` (if not admin), and to accept `user_id` for POST requests.
    -   [x] Modified `dashboard.tsx` to fetch user data from `localStorage`, pass user ID and role as headers to API calls, and display real QR code counts.
    -   [x] Simulated package limits based on user role in `dashboard.tsx`.

3.  [x] **Implement User Management:**
    -   [x] Created `/api/users` endpoint to manage users in `public/users.json` (GET, POST, PUT, DELETE).
    -   [x] Modified `manage-users.tsx` to fetch, add, change limits for, and delete users via the `/api/users` endpoint.

## Current Simulated Features Checklist:

- [x] **Login Screen:** A simulated login screen is now the entry point of the application.
- [x] **Dashboard Stats:** The dashboard now displays simulated statistics for:
    - [x] Active QR codes.
    - [x] Remaining QR codes from a package.
- [x] **User Management:**
    - [x] A "Manage Users" button has been added to the dashboard.
    - [x] A user management page has been created with a simulated list of users.
    - [x] This page includes buttons for adding, changing limits for, and deleting users.
