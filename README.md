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
