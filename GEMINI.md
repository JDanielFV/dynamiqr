# GEMINI.md

## Project Overview

This is a Next.js web application for generating and managing dynamic QR codes. The application now features a role-based user system with `admin` and `user` roles, a simulated authentication system, and user management capabilities.

**Key Technologies:**

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Backend:** Supabase (for database), Node.js API routes
*   **Styling:** styled-components
*   **QR Code Generation:** qr-code-styling

**Architecture:**

*   The frontend is built with React and Next.js, with pages located in `src/pages`.
*   API routes are defined in `src/pages/api` to handle backend logic, including QR code management (`/api/qr`) and user management (`/api/users`).
*   The project connects to a Supabase instance for data persistence, as configured in `src/lib/supabaseClient.ts`. The database schema has been updated to support soft deletes and user-specific data.
*   The application uses `styled-components` for component-level styling.

## Authentication and Authorization

*   **Simulated Authentication:** The application uses a `public/users.json` file to simulate a user database. The login page (`/login`) authenticates users against this file.
*   **User Roles:** There are two roles:
    *   `admin`: Can view all data and manage users (add, delete, change limits).
    *   `user`: Can only manage their own QR codes.
*   **Session Management:** User sessions are managed using `localStorage`, where the logged-in user's data (including their role) is stored.
*   **Route Protection:** A Higher-Order Component (HOC) at `src/components/withAuth.tsx` protects routes based on authentication status and user role. The `/manage-users` page is restricted to admins.

## Building and Running

Before running the application, you need to create a `.env.local` file in the root of the project and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

*   **Development:** To run the development server, use the following command:

    ```bash
    npm run dev
    ```

*   **Building:** To create a production build, use the following command:

    ```bash
    npm run build
    ```

*   **Running:** To start the production server, use the following command:

    ```bash
    npm run start
    ```

## Development Conventions

*   **Linting:** The project uses ESLint for code linting. To run the linter, use the following command:

    ```bash
    npm run lint
    ```

*   **Changelog:** Project progress and a prioritized development plan are tracked in `CHANGELOG.md`.