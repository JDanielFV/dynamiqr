# GEMINI.md

## Project Overview

This is a Next.js project bootstrapped with `create-next-app`. It appears to be a web application for generating and managing dynamic QR codes.

**Key Technologies:**

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Backend:** Supabase
*   **Styling:** styled-components
*   **QR Code Generation:** qr-code-styling

**Architecture:**

*   The frontend is built with React and Next.js, with pages located in `src/pages`.
*   API routes are defined in `src/pages/api` to handle backend logic.
*   The project connects to a Supabase instance for data persistence, as configured in `src/lib/supabaseClient.ts`.
*   The application uses `styled-components` for component-level styling.

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

*   **Build Configuration:** The `next.config.js` file is configured to ignore TypeScript and ESLint errors during the build process. This should be used with caution.