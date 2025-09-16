# Admin Setup Guide

This guide explains how to set up and use the admin system for the Flyover application.

## Prerequisites

- MongoDB running locally or accessible via connection string
- Node.js and npm installed
- Environment variables configured in `.env.local`

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
MONGDB_URI=mongodb://localhost:27017/flyover
```

## Creating an Admin User

### Method 1: Using the CLI Script (Recommended)

1. Run the admin creation script:
   ```bash
   npm run create-admin
   ```

2. Follow the prompts to enter:
   - Admin name
   - Admin email
   - Admin password (minimum 6 characters)

3. The script will create an admin user with full privileges.

### Method 2: Using the Web Interface

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/create-admin`

3. Fill out the form with admin details

4. Submit to create the admin user

## Logging In

1. Navigate to: `http://localhost:3000/login`

2. Enter your admin credentials

3. You'll be redirected to the admin dashboard at: `http://localhost:3000/admin`

## Admin Features

Once logged in as an admin, you can:

- Manage destinations
- Manage events
- Manage blog posts
- Manage resources
- View and manage users
- Configure system settings

## User Roles

The system supports three user roles:

- **USER**: Regular user with limited access
- **SUPPORT**: Support staff with moderate privileges
- **ADMIN**: Full administrative access

## Security Notes

- Admin passwords are hashed using bcrypt with 12 rounds
- Sessions are managed via NextAuth with JWT tokens
- Admin routes are protected by middleware
- Always use strong passwords for admin accounts

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check the `MONGODB_URI` in your `.env.local`
- Verify network connectivity

### Authentication Issues

- Clear browser cookies and try again
- Check that `NEXTAUTH_SECRET` is set
- Verify the user exists in the database

### Permission Issues

- Ensure the user has the correct role (ADMIN)
- Check that the user is active (`isActive: true`)

## Database Schema

The User model includes:

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (USER|SUPPORT|ADMIN),
  isActive: Boolean,
  emailVerified: Date,
  image: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Next Steps

After creating your admin user:

1. Log in to the admin panel
2. Configure system settings
3. Start adding content (destinations, events, posts)
4. Create additional admin or support users as needed