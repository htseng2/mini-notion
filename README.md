# Mini-Notion: A Collaborative Note-Taking App

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), demonstrating a full-stack application with real-time collaboration features.

## ✨ Key Features

- **Real-time Collaborative Editing:** Multiple users can edit documents simultaneously, powered by Yjs & Liveblocks.
- **Rich Text Editor:** Intuitive and powerful document editing capabilities using Tiptap.
- **User Authentication:** Secure user sign-up, login, and session management with NextAuth.js.
- **Full-Stack Architecture:** Leverages Next.js for both frontend rendering and API routes.
- **Efficient Data Management:** Utilizes Prisma ORM for seamless interaction with a PostgreSQL database.
- **Modern UI/UX:** Styled with Tailwind CSS for a responsive and aesthetically pleasing user interface.
- **Optimized Data Fetching:** Employs React Query for efficient server state management and data synchronization.

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js (with App Router)
- **Styling:** Tailwind CSS
- **Rich Text Editor:** Tiptap
- **State Management:** React Query
- **Font Optimization:** `next/font` with Geist

### Backend

- **Runtime/Framework:** Next.js API Routes
- **ORM:** Prisma
- **Database:** PostgreSQL

### Authentication

- **Provider:** NextAuth.js

### Real-time Features

- **Collaboration Engine:** Yjs
- **Synchronization Service:** Liveblocks

### Hosting & Deployment

- **Platform:** Vercel
- **Database Hosting:** Supabase (PostgreSQL)

## 🚀 Getting Started

First, ensure you have Node.js and npm/yarn/pnpm/bun installed.

1.  **Clone the repository (if you haven't already):**

    ```bash
    git clone <your-repository-url>
    cd mini-notion
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up your environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary environment variables (e.g., database connection string, NextAuth.js secret, Liveblocks API keys). Refer to `.env.example` if available.

4.  **Run database migrations (if using Prisma):**

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 📚 Learn More (Next.js)

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
