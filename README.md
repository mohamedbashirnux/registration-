# Xirfad Hub Registration System

A complete student registration and management system for Xirfad Hub Academy, built with Next.js 15, MongoDB, and TypeScript.

## Features

- 🎓 **Seminar & Course Management**: Create and manage seminars and courses with detailed information
- 👥 **Student Registration**: Unique registration links for each student with one-time use
- 🎫 **Ticket System**: Sequential ticket numbering per course/seminar
- 📜 **Certificate Serial Numbers**: Automatic generation of unique certificate serials (Format: XH-YEAR-CODE-###)
- 📊 **Dashboard**: Overview of students, courses, seminars, and users
- 🔐 **User Authentication**: Secure login system with active/inactive user management
- 📱 **Responsive Design**: Works on all devices (mobile, tablet, desktop)
- 📥 **Export to Excel**: Export student data filtered by course/seminar
- 🌐 **Bilingual Support**: Somali language interface

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **UI Components**: shadcn/ui + Tailwind CSS
- **Form Validation**: Zod + React Hook Form
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xirfadhub-registration.git
cd xirfadhub-registration
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### First Time Setup

1. Navigate to [http://localhost:3000/dashboard/users](http://localhost:3000/dashboard/users)
2. Create your first admin user
3. Login at [http://localhost:3000/login](http://localhost:3000/login)

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── seminars/       # Seminar CRUD operations
│   │   ├── students/       # Student management
│   │   ├── users/          # User management
│   │   └── registration-links/  # Registration link generation
│   ├── dashboard/          # Admin dashboard pages
│   ├── login/              # Login page
│   └── register/           # Public registration pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── reusible/          # Custom reusable components
├── lib/                   # Utilities and configurations
│   ├── models/           # MongoDB models
│   └── validations/      # Zod validation schemas
└── public/               # Static assets (images, etc.)
```

## Key Features Explained

### Registration Flow

1. Admin creates a seminar/course
2. Admin generates unique registration link for each student
3. Student uses link to register (link expires after 30 days or one use)
4. Student receives ticket number and certificate serial
5. Admin can view all registered students with filtering options

### Certificate Serial Format

Format: `XH-YEAR-CODE-###`

Example: `XH-2026-JS-001`
- **XH**: Xirfad Hub
- **2026**: Current year
- **JS**: First 2 letters of course title (JavaScript)
- **001**: Sequential number (padded to 3 digits)

### Ticket Numbering

Each seminar/course has independent sequential ticket numbering starting from 1.

## API Endpoints

### Seminars
- `GET /api/seminars` - Get all seminars
- `POST /api/seminars` - Create new seminar
- `DELETE /api/seminars` - Delete all seminars

### Students
- `GET /api/students` - Get all students (with optional type filter)
- `POST /api/students` - Manually add student
- `DELETE /api/students` - Delete all students
- `DELETE /api/students/[id]` - Delete specific student
- `POST /api/students/register` - Register via link

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `DELETE /api/users` - Delete all users
- `PATCH /api/users/[id]` - Update user (toggle active status)
- `DELETE /api/users/[id]` - Delete specific user

### Authentication
- `POST /api/auth/login` - User login

### Registration Links
- `POST /api/registration-links` - Generate registration link
- `GET /api/registration-links/[token]` - Validate and get link info

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string and add to `.env.local`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@xirfadhub.com or open an issue on GitHub.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
