# MongoDB Setup Guide

## Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in to your account
3. Click on "Connect" button for your cluster
4. Choose "Connect your application"
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
   ```

## Step 2: Configure Your Project

1. Open the `.env.local` file in your project root
2. Replace the `MONGODB_URI` value with your actual connection string
3. Make sure to replace:
   - `username` with your MongoDB username
   - `password` with your MongoDB password
   - `database_name` with your database name (e.g., "registration")

Example:
```
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/registration?retryWrites=true&w=majority
```

## Step 3: Test the Connection

The connection file is located at `lib/mongodb.ts`

To use it in your API routes or server components:

```typescript
import connectDB from '@/lib/mongodb';

// In your API route or server component
await connectDB();
```

## Important Notes

- Never commit your `.env.local` file to Git (it's already in .gitignore)
- Keep your MongoDB password secure
- The connection uses connection pooling for better performance
- The connection is cached to avoid multiple connections in development mode
