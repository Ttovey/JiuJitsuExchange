# ExchangeApp - Full Stack Gym Management System

A full-stack web application for gym management, built with Angular frontend and .NET backend, deployed on Microsoft Azure.

## 🌐 Live Application

The application is deployed and accessible at:

- **Frontend**: https://exchangeapp-web.azurewebsites.net
- **Backend API**: https://exchangeapp-api.azurewebsites.net
- **API Documentation (Swagger)**: https://exchangeapp-api.azurewebsites.net/swagger

## 📋 Features

- **User Authentication**: Login and registration for students and gym owners
- **Gym Management**: Create, edit, and manage gym profiles (gym owners)
- **Class Scheduling**: Set up class schedules with time slots
- **Gym Discovery**: Browse and join available gyms (students)
- **Digital Waivers**: Electronic waiver signing for gym membership
- **Dashboard**: Personalized dashboard showing class schedules and gym information
- **Profile Management**: User profile and password management

## 🏗️ Architecture

### Frontend (Angular 19)
- **Technology**: Angular with Material UI
- **Hosting**: Azure App Service
- **Features**: Responsive design, SPA routing, form validation

### Backend (.NET 9)
- **Technology**: ASP.NET Core Web API
- **Database**: Azure SQL Database (production), SQLite (development)
- **Hosting**: Azure App Service
- **Features**: RESTful API, Entity Framework, Swagger documentation

## 🔧 Local Development Setup

### Prerequisites
- Node.js (v16 or later)
- Angular CLI (`npm install -g @angular/cli`)
- .NET 9 SDK
- Visual Studio 2022 or Visual Studio Code

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run
   ```
   
   The local backend will be available at: `http://localhost:5086`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   ng serve
   ```
   
   The local frontend will be available at: `http://localhost:4200`

### Local Development URLs
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5086
- **Swagger UI**: http://localhost:5086/swagger

## 🚀 Azure Deployment

The application is deployed using Azure App Services with the following resources:

- **Resource Group**: `exchangeApp-rg` (East US)
- **Frontend App Service**: `exchangeApp-web` (Free F1 tier)
- **Backend App Service**: `exchangeApp-api` (Free F1 tier)
- **SQL Server**: `exchangeappsql1750007269.database.windows.net` (West US 2)
- **SQL Database**: `exchangeApp-db` (Basic tier)

## 🎯 Usage

### For Gym Owners
1. Register with account type "Gym Owner"
2. Navigate to Profile → Gym to create and manage gyms
3. Set up class schedules for each day of the week
4. Monitor gym membership through the dashboard

### For Students
1. Register with account type "Student"
2. Browse available gyms on the Gym page
3. Join gyms (requires digital waiver signing)
4. View your class schedule on the dashboard

## 🛠️ Development Notes

- **Hot Reload**: Both frontend (`ng serve`) and backend (`dotnet watch run`) support hot reload during development
- **Environment Configuration**: The application uses different environment configurations for development and production
- **CORS**: Properly configured to allow communication between frontend and backend
- **Database**: Automatically switches between SQLite (development) and SQL Server (production)
