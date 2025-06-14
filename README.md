# Autism Insight – Frontend

A modern, full-featured web application for autism screening, user progress tracking, and admin management. Built with Next.js, React, Firebase Auth, MongoDB, and TailwindCSS.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Routes](#routes)
  - [Public Routes](#public-routes)
  - [User Routes](#user-routes)
  - [Admin Routes](#admin-routes)
  - [Authentication Routes](#authentication-routes)
- [Authentication & Authorization](#authentication--authorization)
- [Admin Features](#admin-features)
- [API Endpoints](#api-endpoints)
- [How the App Works](#how-the-app-works)
- [Environment Variables](#environment-variables)
- [Setup & Development](#setup--development)
- [License](#license)

---

## Features

- **User Registration & Login** (Email/Password, Google)
- **Email Verification** for new users
- **Password Reset** via email
- **Autism Screening** (form, video, images)
- **User Progress Tracking** (weekly, monthly, quarterly, yearly, custom)
- **Admin Dashboard** with:
  - User management (role, status, verification)
  - Results & progress analytics (filterable, printable)
  - Progress deletion
- **Role-based Access Control** (admin/user)
- **Persistent Authentication** (cookies, tokens)
- **Responsive UI** with TailwindCSS
- **Print-friendly Reports**
- **Secure API** (Next.js API routes, MongoDB models)

---

## Project Structure

```
src/
  app/
    (auth)/         # Authentication pages (login, signup, user details)
    (admin)/        # Admin dashboard and user management
    detect/         # Autism screening page
    progress/       # User progress page
    centers/        # Autism centers info
    about/          # About page
    forgot-password/# Password reset
    api/            # API endpoints (users, results, progress, save)
  components/       # Shared and UI components
  lib/              # Auth, Firebase, hooks, utilities
  middleware.ts     # Route protection and redirection
public/             # Static assets
```

---

## Routes

### Public Routes

| Path       | Description                    |
| ---------- | ------------------------------ |
| `/`        | Home page (Hero section, info) |
| `/about`   | About Autism Insight           |
| `/centers` | List of autism centers         |

### User Routes (Requires Login)

| Path        | Description                       |
| ----------- | --------------------------------- |
| `/detect`   | Autism screening (form/video/img) |
| `/progress` | User's weekly progress & reports  |
| `/user`     | User profile/details              |

### Admin Routes (Requires Admin Role)

| Path     | Description                        |
| -------- | ---------------------------------- |
| `/admin` | Admin dashboard (analytics, print) |
| `/users` | User management (roles, status)    |

### Authentication Routes

| Path               | Description    |
| ------------------ | -------------- |
| `/login`           | Login page     |
| `/signup`          | Signup page    |
| `/forgot-password` | Password reset |

---

## Authentication & Authorization

- **User Auth:** Firebase Auth (email/password, Google)
- **Email Verification:** Required for new users before login
- **Role-based Access:**
  - `userToken` cookie for all authenticated users
  - `adminToken` cookie for admins (granted after login if user is admin)
- **Route Protection:**
  - Middleware checks cookies and redirects to `/login` if not authenticated
  - Admin routes require both `userToken` and `adminToken`

---

## Admin Features

- **Dashboard:**
  - View all user results and progress
  - Filter by weekly, monthly, quarterly, yearly, or custom date range
  - Print reports (print-friendly)
- **User Management:**
  - View all users, roles, status, last login
  - Change user roles (user/admin)
  - Activate/deactivate users
- **Progress Management:**
  - Delete user progress

---

## API Endpoints

All API endpoints are under `/api/` and are protected as needed.

### `/api/users`

- **POST:** Create or update user (on signup/login)
- **GET:** List all users (admin only)
- **PUT:** Update user role/status (admin only)

### `/api/results`

- **GET:** Get all screening results (admin)
- **POST:** Save new screening result

### `/api/progress`

- **GET:** Get user progress (user/admin)
- **POST:** Update/add progress
- **DELETE:** Delete user progress (admin)

### `/api/save`

- **POST:** Save additional data (e.g., images, videos)

### `/api/models/user.ts`

- Mongoose schema for users (email, name, role, status, etc.)

---

## How the App Works

1. **User Registration/Login:**

   - Users can sign up with email/password or Google.
   - After signup, email verification is required.
   - On login, user and (if admin) admin tokens are set in cookies.

2. **Route Protection:**

   - Middleware checks for required tokens.
   - If not authenticated, user is redirected to `/login?redirectTo=...`.

3. **Screening & Progress:**

   - Users complete autism screening (form, video, images).
   - Results and progress are saved and visualized.
   - Users can view their progress and print reports.

4. **Admin Management:**

   - Admins can view all users, results, and progress.
   - Filter analytics by time range.
   - Change user roles, delete progress, print reports.

5. **API Security:**
   - All sensitive endpoints require authentication and/or admin role.
   - Data is stored in MongoDB via Mongoose models.

---

## Environment Variables

Set these in your `.env.local` (and production environment):

```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
MONGODB_URI=...
```

---

## Setup & Development

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Run locally:**

   ```bash
   yarn dev
   ```

3. **Build for production:**

   ```bash
   yarn build
   yarn start
   ```

4. **Environment:**
   - Make sure to set all required environment variables.

---

## License

MIT

---

**For more details, see the codebase and comments in each file.**

---

npm run dev
