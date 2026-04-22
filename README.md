# Personal Expense Management System

A MERN stack application for managing personal expenses with a modern, professional UI.

## Features

- User registration and login with JWT authentication
- Add and view expenses
- Filter expenses by category
- View total expenses
- Responsive design
- Modern UI with professional styling

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios
- **Backend**: Node.js, Express (converted to Vercel serverless functions)
- **Database**: MongoDB
- **Authentication**: JWT
- **Deployment**: Vercel

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```
3. Set up environment variables (see .env.example)
4. Start the development server:
   ```bash
   cd frontend && npm run dev
   ```

## Deployment to Vercel

### Prerequisites
- [Vercel account](https://vercel.com)
- [MongoDB Atlas](https://www.mongodb.com/atlas) database

### Steps

1. **Connect your repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure environment variables**:
   - In your Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```

3. **Deploy**:
   - Vercel will automatically detect the configuration and deploy
   - The frontend will be built and the API routes will be deployed as serverless functions

### Environment Variables

See `.env.example` for the required environment variables.

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/expenses` - Get user's expenses (requires auth)
- `POST /api/expenses` - Add new expense (requires auth)

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── auth.js            # Authentication endpoints
│   └── expenses.js        # Expense management endpoints
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   └── ...
│   └── ...
├── vercel.json           # Vercel configuration
└── package.json          # Root package.json
```

## Setup

### Backend

1. Navigate to backend directory
2. Run `npm install`
3. Set up MongoDB and update .env
4. Run `npm run dev`

### Frontend

1. Navigate to frontend directory
2. Run `npm install`
3. Run `npm run dev`

## Usage

- Register or login
- Add expenses on dashboard
- View and filter expenses