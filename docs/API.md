# Development notes for APIs

## Setup server for development

- Download `.env` file and put it in the root folder.
- Run `npm run dev` to start the server.

## Authentication

### 1. Sign in

- Try at http://localhost:3000/en/login.

### 2. Sign out

- Try at http://localhost:3000/en/logout.

## Customers

### 1. Place the order

- POST /api/customers/orders
- Implementation: `src/pages/api/customers/orders.js`.
- Try at cart page (Order Now button): `src/app/[lng]/cart/page.js`.

### 2. Get the list of 20 last orders

- GET /api/customers/orders
- Implementation: `src/pages/api/customers/orders.js`.
- Try at: `/api/customers/orders`.

## Staffs

### 1. Get the list of last orders

- GET /api/staffs/orders
- Implementation: `src/pages/api/staffs/orders/index.js`.

### 2. Set order status

- POST /api/staffs/orders/:id/set_status
  {
  "status": "queued|confirmed|preparing|completed|cancelled"
  }
