# Community Library Management System

A React + Express + MySQL library management application for BIWA2110.

## Requirements
- Node.js 18 or newer
- MySQL Server (or compatible MySQL service)

## 1. Create the database
1. Open MySQL Workbench or your MySQL client.
2. Run the contents of `database.sql`.

## 2. Start the backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env`, then update the MySQL password and set a long random `JWT_SECRET`.

Create the first librarian account:
```bash
npm run seed -- LIB001 ChangeMe123! "Main Librarian"
```
You can replace the membership ID, password and name with your own values. Change the example password after signing in.

Start the API:
```bash
npm run dev
```
The API runs at `http://localhost:5000`. Test `http://localhost:5000/api/health`.

## 3. Start the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the local URL Vite prints (normally `http://localhost:5173`). Sign in using the librarian membership ID and password created by the seed command.

## Features
- Login with membership ID and password; password hashes are stored in MySQL.
- Dashboard with total titles, total copies, low-stock titles and transaction count.
- Book create, read, update and delete operations.
- Stock addition and borrowing transactions with database transaction protection against negative stock.
- User create, read, update and delete operations for librarians.
- Role-based API access: members can view books and transaction history; librarians can manage records.
- Responsive dark-blue interface.

## API routes
| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/books` | List books | Logged-in |
| POST | `/api/books` | Add book | Librarian |
| PUT | `/api/books/:id` | Update book | Librarian |
| DELETE | `/api/books/:id` | Delete book | Librarian |
| GET | `/api/transactions` | List transactions | Logged-in |
| POST | `/api/transactions` | Add stock / borrow | Librarian |
| GET | `/api/users` | List users | Librarian |
| POST | `/api/users` | Add user | Librarian |
| PUT | `/api/users/:id` | Update user | Librarian |
| DELETE | `/api/users/:id` | Delete user | Librarian |

## Important notes
- The seed script creates the first librarian. Do not publish your `.env` file or real credentials to GitHub.
- This is an educational assignment implementation. Before public deployment, add HTTPS, stronger input validation, rate limiting, secure cookie/session strategy, audit controls and production CORS configuration.
- Borrowing is recorded as a stock deduction. A return workflow and due-date tracking were not explicitly required in the assignment brief and are not included in this version.
