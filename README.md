# Online Banking Website
**COMP3011/6006 Practical Assignment**

A full-stack online banking simulation built with the required assignment stack:
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Views:** Pug
- **UI:** Bootstrap 5
- **Validation:** Joi
- **Auth:** Passport Local + express-session + bcrypt

## What this project includes

### Authentication
- user registration and login forms
- Passport Local authentication
- bcrypt password hashing
- session-based login with `express-session`
- dynamic navbar showing logged-in `UserID/CustomerID`

### Account management and authorization
- create own bank accounts
- view own accounts on dashboard
- account details page with balance, status, and history
- simulated credit, debit, and transfer between own accounts
- update personal details: address and phone
- ownership checks before account operations

### Frontend
- Pug templates with reusable layout and partials
- Bootstrap 5 responsive components

### Search
- search/filter transactions by description/reference, account number, date range, and amount

### Validation
- server-side Joi validation for registration, login, account creation, transactions, transfers, and profile updates

### Admin panel
- view all users
- view all bank accounts
- view all transactions
- activate/deactivate users and accounts

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

For the full walkthrough, see `EXPLANATION.md`.

## Setup and run

### Prerequisites
- Node.js
- MongoDB running locally, or a valid MongoDB URI

### Install dependencies
```bash
npm install
```

### Configure environment variables
Create a `.env` file in the project root with:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/online_banking_assignment
SESSION_SECRET=default-secret
```

If `.env` is missing, the app still has defaults for all three values in `app.js`.

### Start the app
```bash
npm start
```

### Open in browser
```text
http://localhost:3000
```

## Testing

Run:
```bash
npm test
```

Current test coverage includes:
- Joi validation schemas
- auth middleware behavior
- utility functions
- Pug template compilation

## Admin access

Admin routes require `isAdmin: true` on the user document.

Example MongoDB shell update:
```js
db.users.updateOne(
  { customerId: "yourCustomerId" },
  { $set: { isAdmin: true } }
)
```

## Submission notes
- do not include `node_modules` in the submission zip
- do not include `.env` unless your teacher explicitly wants it
- include source code, `package.json`, and `package-lock.json`
- include documentation if helpful
