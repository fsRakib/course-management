# CourseHub - Course Management Platform

A comprehensive course management platform built with Next.js, NextAuth.js, and MongoDB. This platform supports multiple user roles (students, instructors, developers, managers) with role-based access control, course management, and file upload capabilities.

## Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
- 👥 **Multi-Role Support**: Student, Developer, Manager, Admin, Instructor, and User roles
- 📚 **Course Management**: Full CRUD operations for courses and modules
- 📁 **File Upload System**: Role-based file upload and management
- 📱 **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- 🛡️ **Protected Routes**: Middleware-based route protection
- 🎨 **Modern UI**: Custom UI components built with shadcn/ui principles

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm, yarn, pnpm, or bun

### Environment Setup

1. **Copy the environment file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Configure environment variables:**
   See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed instructions.

3. **Required environment variables:**
   ```bash
   MONGODB_URI=mongodb://localhost:27017/course-management
   NEXTAUTH_SECRET=your-super-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

### Installation & Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

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

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── [role]/dashboard/  # Role-based dashboards
│   └── developer/courses/ # Course management
├── components/            # Reusable UI components
├── lib/                   # Utility libraries
├── models/               # MongoDB models
└── types/                # TypeScript type definitions
```

## User Roles & Permissions

- **Student**: View courses, access learning materials
- **Developer**: Full course management, file uploads
- **Manager**: File uploads, content management
- **Admin**: Full system access
- **Instructor**: Course creation and management
- **User**: Basic access and dashboard

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication

### Courses

- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course
- `GET /api/courses/[id]` - Get course details
- `PUT /api/courses/[id]` - Update course
- `DELETE /api/courses/[id]` - Delete course

### Modules

- `POST /api/courses/[id]/modules` - Add module to course
- `PUT /api/courses/[id]/modules/[moduleId]` - Update module
- `DELETE /api/courses/[id]/modules/[moduleId]` - Delete module

### File Upload

- `POST /api/upload` - Upload files (role-restricted)
- `GET /api/upload` - List uploaded files
- `DELETE /api/upload` - Delete files

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js with JWT
- **UI Components**: Custom components following shadcn/ui principles
- **Development**: ESLint, TypeScript, PostCSS

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
