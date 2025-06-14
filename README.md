# Full Stack Web Application

This project consists of an Angular frontend and a .NET backend API.

## Project Structure
- `/frontend` - Angular application
- `/backend` - .NET Web API

## Prerequisites
- Node.js (v16 or later)
- Angular CLI
- .NET 8 SDK
- Visual Studio 2022 or Visual Studio Code

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Restore dependencies:
   ```
   dotnet restore
   ```
3. Run the application:
   ```
   dotnet run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   ng serve
   ```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:5000

## Development
- Frontend development server supports hot-reload
- Backend API supports hot-reload with `dotnet watch run`

Once your backend is running, you can access the Swagger UI page at:

```
http://localhost:5086/swagger/index.html
```

The exact port might vary depending on your configuration. You can check the actual port in your `backend/Properties/launchSettings.json` file. The Swagger UI provides an interactive documentation of your API endpoints where you can test them directly in the browser.

If you're having trouble accessing it, make sure:
1. Your backend is running (`dotnet run` in the backend directory)
2. You're using the correct port (check the console output when you start the backend)
3. You're using the correct protocol (http vs https) 