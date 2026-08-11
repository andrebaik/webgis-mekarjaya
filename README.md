# WebGIS Mekarjaya

This project is a WebGIS application for Mekarjaya Village, built with a modern web stack.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Leaflet
- **Backend:** Node.js, Express, MySQL

## Running the Application

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables by creating a `.env` file in the `backend` directory. You'll need to provide database credentials:
    ```
    DB_HOST=your_db_host
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    PORT=5000
    JWT_SECRET=your_random_long_secret
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=change_me
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The backend will be running at `http://localhost:5000`.

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

## Build for Production

To create a production build for the frontend, run the following command in the `frontend` directory:

```bash
npm run build
```

This will create a `dist` folder with the optimized and minified assets.

## Features

- Interactive Leaflet map of village facilities & potentials (schools, health centers, village office, worship places, tourism, UMKM, etc.)
- Indonesian-only UI (single locale)
- Location detail pages
- **Village profile** page (`/desa`) driven by the database: village profile, demographics charts, village budget (APBDES), and a slider of village-head periods with their programs
- **Admin panel** at `/admin` (JWT-based): manage locations, categories, village profile, demographics, APBDES, periods & programs

## Admin Panel

1. Make sure `JWT_SECRET` is set in `backend/.env` (random long value, e.g. `openssl rand -hex 32`).
2. Seed the default admin account:
   ```bash
   cd backend
   npm run seed:admin
   ```
3. Open `http://localhost:5173/admin` and log in with the default credentials **`admin` / `admin123`**. Change them immediately in production by setting `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `backend/.env` and re-running `npm run seed:admin`.
