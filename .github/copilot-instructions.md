# COMP3011/6006 Practical Assignment - Strict Minimal Scope Instructions (Highest Priority)

> **Source of truth:** `Practical Assignment Final.pdf`.
>  
> **This section has highest priority and overrides any conflicting rule below it in this file.**

## 0) Mission and Scope

Build only what is explicitly required to pass the assignment.  
Do not add advanced patterns, extra architecture, or optional features unless they are necessary for a required rubric item.

## 1) Mandatory Tech Stack (No Substitutions)

Use exactly:

- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Views:** Pug
- **Styling/UI:** Bootstrap 5
- **Validation:** Joi
- **Auth stack:** Passport.js (Local Strategy) + express-session + bcrypt

Do **not** use: Next.js, React SPA architecture, TypeScript-only setup, Prisma, PostgreSQL, Tailwind-first architecture, GraphQL, or other frameworks not requested.

## 2) Assignment Features to Implement (Exactly)

### A. User Authentication (5 marks)

Implement:

- Registration form
- Login form
- Passport Local authentication
- bcrypt password hashing
- express-session session management
- Navbar that changes by login state
- Show logged-in **UserID/CustomerID** in navbar

### B. Bank Account Management + Authorization (8 marks)

Implement:

- Create own bank accounts (e.g., savings/checking/business)
- View own accounts
- Simulate transactions (credit/debit/transfer between own accounts)
- View transaction history for own accounts
- Update personal details (address and phone)
- All account data private to owner only

Authorization must be enforced in **both** places:

1. UI: hide account actions for non-owners
2. Server: ownership middleware check before operation

Use `createdBy` on account model linked to user.

### C. Frontend with Pug + Bootstrap 5 (6 marks)

Required pages:

- Registration
- Login
- Dashboard (logged-in user accounts)
- Account create form
- Account details (type, balance, status, transaction history)
- Navigation bar

Requirements:

- Responsive on mobile and desktop
- Clear and structured layout
- Use Bootstrap components
- Reuse layout with Pug `extends`/`block`

### D. Search Functionality (4 marks)

Provide search/filter capability for user-owned data by:

- Transaction description/reference (partial + case-insensitive)
- Account number
- Transaction date or date range
- Transaction amount

Implementation hint from brief: use MongoDB `$regex`, `$or`, and GET query params.

### E. Joi Validation (2 marks)

Server-side Joi validation for all forms:

- Registration: unique userID/CustomerID, required, max 100; password min 8
- Login: userID/CustomerID + password required
- Bank account: account type required
- Transaction: positive numeric amount + required transaction type

Validation errors must be shown in views via Bootstrap alerts.

### F. Admin Panel (5 marks)

Implement admin-only area with:

- View all users
- View all accounts
- View all transactions
- Activate/deactivate any user or bank account

Use `isAdmin` in user schema and `isAdmin` route middleware.

## 3) Strict Out-of-Scope Rules

Do not build any feature not required by the PDF, including:

- Email verification, MFA, OAuth, JWT architecture, RBAC expansion
- Charts/analytics dashboards beyond required views
- External payment APIs
- Real banking integrations
- Complex event-driven architecture
- Docker/Kubernetes setup unless explicitly required

Keep logic simple, readable, and easy to explain in viva/demo.

## 4) Coding Style for This Assignment

- Prefer simple controller logic over abstract layers
- Keep model fields minimal and directly tied to requirements
- Use explicit, beginner-friendly naming
- Avoid "clever" optimizations that reduce explainability
- Ensure every protected route has auth/ownership checks

## 5) Minimum Passing Checklist (Use as gate)

Before considering work complete, all must be true:

1. Full required stack matches assignment (Node/Express/Mongo/Mongoose/Pug/Bootstrap/Joi).
2. All six rubric sections (Auth, Account Mgmt+AuthZ, Frontend, Search, Joi, Admin) are implemented.
3. Owner-only privacy rules are enforced server-side.
4. Navbar behavior changes correctly based on login and shows UserID/CustomerID.
5. No unnecessary advanced/out-of-scope additions were introduced.
6. Project submission excludes `node_modules`.

---
