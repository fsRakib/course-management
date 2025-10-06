# Environment Setup Guide

This document explains how to configure environment variables for the Course Management Platform.

## Required Environment Variables

### 1. MONGODB_URI

The connection string for your MongoDB database.

**Local Development:**

```
MONGODB_URI=mongodb://localhost:27017/course-management
```

**MongoDB Atlas (Cloud):**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course-management?retryWrites=true&w=majority
```

### 2. NEXTAUTH_SECRET

A secret key used by NextAuth.js for encrypting JWT tokens and securing sessions.

**Generate a secure secret:**

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Example:**

```
NEXTAUTH_SECRET=your-generated-secret-key-here
```

### 3. NEXTAUTH_URL

The canonical URL of your application.

**Local Development:**

```
NEXTAUTH_URL=http://localhost:3000
```

**Production:**

```
NEXTAUTH_URL=https://yourdomain.com
```

## Setup Instructions

1. **Copy the example file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your actual values:

   ```bash
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/course-management

   # NextAuth Configuration
   NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Verify the setup** by running the development server:
   ```bash
   npm run dev
   ```

## Environment Variable Usage

### MongoDB Connection

- Used in: `src/lib/mongodb.ts`
- Purpose: Establishes connection to MongoDB database
- Error handling: Application will throw an error if not defined

### NextAuth Secret

- Used in: All API routes with authentication
- Purpose: Signs and encrypts JWT tokens
- Security: Must be unique and kept secret in production

### NextAuth URL

- Used in: NextAuth.js configuration
- Purpose: Defines the canonical URL for callbacks and redirects
- Important: Must match your actual domain in production

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use different secrets** for different environments
3. **Rotate secrets** regularly in production
4. **Use strong, randomly generated secrets**
5. **Restrict database access** with proper user permissions

## Troubleshooting

### Common Issues

1. **"MONGODB_URI not defined" error**

   - Ensure `.env.local` exists in the root directory
   - Check that the variable name is spelled correctly
   - Restart the development server after adding variables

2. **NextAuth session issues**

   - Verify `NEXTAUTH_SECRET` is set
   - Clear browser cookies and localStorage
   - Check that `NEXTAUTH_URL` matches your current URL

3. **Database connection errors**
   - Verify MongoDB is running (for local development)
   - Check connection string format
   - Ensure database user has proper permissions

### Environment Variable Loading Order

Next.js loads environment variables in this order:

1. `.env.local` (always loaded, should be in .gitignore)
2. `.env.production` or `.env.development` (depending on NODE_ENV)
3. `.env`

Variables in `.env.local` take precedence over others.

## Production Deployment

For production deployments:

1. **Set environment variables** in your hosting platform
2. **Use secure, production-grade values**
3. **Enable MongoDB authentication** and use restricted user accounts
4. **Use HTTPS** for NEXTAUTH_URL
5. **Regularly rotate secrets**

## Additional Configuration

### Optional Variables

```bash
# Optional: Specify database name if different from URI
MONGODB_DB=course-management

# Optional: Enable debug mode for NextAuth
NEXTAUTH_DEBUG=true
```

These optional variables can be added if needed for specific configurations.
