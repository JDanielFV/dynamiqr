# GEMINI.md

## Project Overview

This is a Next.js project bootstrapped with `create-next-app`. It appears to be a web application for generating and managing dynamic QR codes. The project is currently undergoing debugging for a persistent hydration error, particularly affecting PWA on iPhone/Safari.

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
*   **Navigation:** The global `Navbar` and `Layout` components have been removed. Navigation is now handled by individual buttons within `generar.tsx`, `editar.tsx`, and `dashboard.tsx` pages.

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

## Current Status & Debugging

*   **Persistent Hydration Error:** A persistent hydration error was encountered, particularly on iPhone/Safari PWA installations. This issue has been **resolved** by:
    *   Removing the global `Navbar` and `Layout` components.
    *   Refactoring navigation to use individual buttons within `generar.tsx`, `editar.tsx`, and `dashboard.tsx` pages.
    *   Correcting an `<a>` tag nesting issue within `Link` components by removing `passHref` and `as="a"` from child `Button` components.
*   **`index.php` Removal:** The `index.php` file, which contained hardcoded Supabase credentials and posed a security risk, has been successfully removed. Its functionality will be replaced by a Next.js API route if needed.
*   **`editar.tsx` Loading Issue:** The issue where the `src/pages/dynamiqr/editar.tsx` page was stuck in a loading state and not displaying folder content has been **resolved** by:
    *   Adding a `try...catch...finally` block to the `fetchData` function to ensure `isLoading` is always set to `false`.
    *   Adjusting the `folders.filter` condition in `renderContent` to correctly identify top-level folders (handling `null`, `undefined`, or empty string for `parentId`).
    *   Correcting the `handleSelectFolder` logic to ensure the `view` state transitions to `'qrs'` when a folder is selected, allowing QR codes within folders to be displayed.
*   **Pending UI/UX Improvement:** The text in input fields is currently black, making it difficult to read on the dark background. The next step is to change the input text color to white.