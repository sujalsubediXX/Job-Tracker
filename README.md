# Job Application Tracking Web Application

A full-stack web application for tracking job applications through different hiring stages. Users can add, view, edit, search, and delete applications, and the app stores data in MongoDB.

## Features

- Add new job applications
- View all applications in a table
- Search by company or job title
- Filter by application status
- Edit existing applications
- Delete applications
- Pagination support
- Responsive user interface

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- React Hook Form
- React Query
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Zod for validation

## Project Structure

- frontend/ - React frontend application
- backend/ - Express + TypeScript API server

## Prerequisites

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Job application tracking web application"
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example` and set your MongoDB connection:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/job_tracker
PORT=4000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the Vite development server, usually at:

```text
http://localhost:5173
```

## API Endpoints

The backend exposes the following main endpoints:

- GET /applications - List applications
- GET /applications/:id - Get one application
- POST /applications - Create an application
- PATCH /applications/:id - Update an application
- DELETE /applications/:id - Delete an application
- GET /health - Health check

## MongoDB Collection

The application data is stored in the MongoDB collection:

```text
applications
```

Each application document contains:
- id
- company_name
- job_title
- job_type
- status
- applied_date
- notes
- created_at
- updated_at

## Screenshots

Add screenshots here if needed.

## License

This project is open-source and available under the MIT License.
