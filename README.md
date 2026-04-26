# Online Banking Website  
**COMP3011/6006 Practical Assignment**

A full-stack online banking simulation built exactly with the required assignment stack:
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB + Mongoose  
- **Views:** Pug  
- **UI:** Bootstrap 5  
- **Validation:** Joi  
- **Auth:** Passport Local + express-session + bcrypt

---

## Table of Contents
1. [What this project includes](#what-this-project-includes)
2. [Project structure](#project-structure)
3. [Setup and run](#setup-and-run)
4. [Environment variables](#environment-variables)
5. [Testing](#testing)
6. [Admin access](#admin-access)
7. [Submission notes](#submission-notes)

---

## What this project includes

### 1. Authentication
- User registration and login forms
- Passport Local authentication
- bcrypt password hashing
- Session-based login with express-session
- Dynamic navbar showing `UserID/CustomerID` when logged in

### 2. Account management + authorization
- Create own bank accounts (Savings / Checking / Business)
- View own accounts on dashboard
- Account details page with balance, status, and history
- Simulated transactions: credit, debit, and transfer between own accounts
- Update personal details (address, phone)
- Ownership checks on server before account operations

### 3. Frontend
- Pug templates with reusable layout/partials
- Bootstrap 5 responsive components (cards, forms, tables, navbar, alerts)

### 4. Search
- Search/filter transactions by:
  - description/reference (partial, case-insensitive)
  - account number
  - date range
  - amount

### 5. Joi validation
- Server-side validation for registration, login, account creation, transactions, and transfer
- Errors displayed in Bootstrap alerts

### 6. Admin panel
- View all users
- View all bank accounts
- View all transactions
- Activate/deactivate users and accounts

---

## Project structure

```text
.
├── app.js
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── test/
├── utils/
├── validations/
├── views/
├── README.md
├── EXPLANATION.md
├── package.json
└── package-lock.json
```

For the detailed directory-by-directory and file-by-file explanation, see **`EXPLANATION.md`**.

---

## Setup and run

### Prerequisites
- Node.js (LTS recommended)
- MongoDB running locally (or a valid MongoDB URI)

### Install dependencies
```bash
npm install
```

### Configure environment variables
This project now reads configuration from `.env` using `dotenv`.

If `.env` does not exist yet, copy from the example:
```bash
cp .env.example .env
```

Then edit `.env` as needed:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/online_banking_assignment
SESSION_SECRET=default-secret
```

### Start MongoDB
If running locally, ensure MongoDB is available at:
```text
mongodb://127.0.0.1:27017
```

### Start the app
```bash
npm start
```

### Open in browser
```text
http://localhost:3000
```

---

## Environment variables

Environment values are loaded from `.env`:

- `PORT` (default: `3000`)
- `MONGODB_URI` (default: `mongodb://127.0.0.1:27017/online_banking_assignment`)
- `SESSION_SECRET` (default: `default-secret`)

---

## Testing

Run unit tests:
```bash
npm test
```

Current tests cover:
- Joi validation schemas
- Auth middleware behavior
- Utility functions
- Pug template compilation

---

## Admin access

Admin routes are protected with `isAdmin`.

To make a user admin, update that user in MongoDB:
```js
db.users.updateOne(
  { customerId: "yourCustomerId" },
  { $set: { isAdmin: true } }
)
```

---

## Submission notes

- **Do not include `node_modules`** in your submission zip.
- Do not submit `.env` if it contains any real/private secret values.
- Include source code, `package.json`, and `package-lock.json`.
- Include `README.md` and `EXPLANATION.md` for clarity (recommended).
