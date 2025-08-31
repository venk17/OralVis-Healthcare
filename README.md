# OralVis Healthcare - Dental Scan Management System

## Project Description

OralVis Healthcare is a comprehensive full-stack web application designed for dental practices to manage patient scan uploads and reviews. The system features role-based authentication with two distinct user types: **Technicians** who upload patient dental scans, and **Dentists** who review these scans and generate detailed PDF reports.

## Technology Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express.js
- **Database**: SQLite
- **File Storage**: Cloudinary
- **Authentication**: JWT with bcryptjs password hashing
- **HTTP Requests**: Axios
- **PDF Generation**: jsPDF
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Features

### 🔐 Role-Based Authentication
- Secure JWT-based login system
- Two user roles: Technician and Dentist
- Protected routes based on user permissions
- Password hashing with bcryptjs

### 📤 Technician Features
- Upload patient dental scans and radiographs
- Form validation for patient information
- Image upload to Cloudinary with automatic optimization
- Support for multiple scan types and dental regions

### 👩‍⚕️ Dentist Features
- View all uploaded scans in a responsive grid layout
- Modal preview for detailed scan examination
- Generate and download comprehensive PDF reports
- Patient information and scan metadata display

### 📄 PDF Report Generation
- Professional PDF reports with patient details
- Embedded high-quality scan images
- Automated file naming and download
- Medical-grade report formatting

## Default Login Credentials

### Technician Account
- **Email**: `tech@oralvis.com`
- **Password**: `password123`
- **Access**: Upload scans, view dashboard

### Dentist Account
- **Email**: `dentist@oralvis.com`
- **Password**: `password123`
- **Access**: View scans, generate reports, dashboard

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd oralvis-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Update `.env` file with your Cloudinary credentials
   - Get your Cloudinary credentials from [cloudinary.com](https://cloudinary.com)

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd oralvis-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Environment Variables

Create a `.env` file in the `oralvis-backend` directory with the following variables:

```env
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login with email and password

### Scans
- `POST /api/scans/upload` - Upload new scan (Technicians only)
- `GET /api/scans` - Get all scans (Dentists only)

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
oralvis-healthcare/
├── oralvis-backend/
│   ├── routes/
│   │   ├── auth.js
│   │   └── scans.js
│   ├── middleware/
│   │   └── auth.js
│   ├── database.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── oralvis-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   └── Viewer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Deployment

### Backend Deployment (Render/Vercel)
1. Deploy the `oralvis-backend` folder to your preferred platform
2. Set environment variables in your deployment platform
3. Update CORS configuration with your frontend URL

### Frontend Deployment (Netlify/Vercel)
1. Deploy the `oralvis-frontend` folder
2. Update API endpoints to point to your deployed backend
3. Configure build settings: `npm run build`, output directory: `dist`

## Security Features

- JWT token-based authentication
- Role-based access control
- Password hashing with bcryptjs
- Protected API endpoints
- File type validation
- CORS configuration
- Input sanitization

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `role` (technician/dentist)
- `name`
- `created_at`

### Scans Table
- `id` (Primary Key)
- `patient_name`
- `patient_id`
- `scan_type`
- `region`
- `image_url`
- `uploaded_by` (Foreign Key)
- `upload_date`

## Support

For technical support or questions about the OralVis Healthcare system, please contact the development team.

---

**OralVis Healthcare** - Professional Dental Scan Management System