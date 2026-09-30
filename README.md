# Biteora — Restaurant Ordering Platform

Biteora is a modern, responsive restaurant ordering platform built with Next.js, React, TypeScript, and Tailwind CSS.

The current repository contains the complete frontend experience and a development-ready API integration layer. The frontend is intentionally designed to remain independent from the final database and backend implementation.

The backend/database/payment/storage infrastructure will be integrated separately by the backend developer.

---

## Project Status

**Frontend:** Complete  
**Dashboard:** Complete  
**API Integration Layer:** Ready  
**Responsive UI:** Implemented  
**Authentication UI:** Implemented  
**Development Authentication:** Implemented  
**Backend Integration:** Ready for handoff  
**Database:** Backend pending  
**Production Authentication:** Backend pending  
**Payment Integration:** Backend pending  
**Production Image Storage:** Backend pending  

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Zustand
- React Hook Form
- Zod

## Architecture

- Next.js App Router
- Client-side state management with Zustand
- Frontend API abstraction layer
- Development mock data
- Backend-ready API contracts
- Responsive mobile-first UI

---

# Main Features

## Customer Website

### Home

- Restaurant hero section
- Promotional content
- Featured products
- Popular combinations
- Restaurant information
- Testimonials
- App/download section
- Responsive navigation
- Cart indicator

### Menu

- Product listing
- Category filtering
- Search/filter-ready architecture
- Product images
- Product pricing
- Product descriptions
- Add to cart
- Quantity management
- Cart count
- Add-to-cart feedback
- Responsive layout

### Cart

- Cart item list
- Increase quantity
- Decrease quantity
- Remove item
- Subtotal calculation
- Dine-in / takeaway selection
- Table number for dine-in
- Takeaway packaging fee
- Coupon discount
- Final total
- Checkout navigation

### Checkout

- Customer name
- Phone number
- Optional email
- Order type
- Table number
- Payment method
- Special instructions
- Coupon information
- Order total
- Backend-ready order payload

---

# Restaurant Dashboard

The dashboard is designed for restaurant management.

## Dashboard Overview

Provides the main restaurant management interface.

## Orders

Features:

- Order listing
- Search
- Status filtering
- Order summary
- Order details
- Status updates
- Order cancellation
- Dine-in/takeaway information
- Production API contract

Supported order statuses:

```text
PENDING
CONFIRMED
PREPARING
READY
COMPLETED
CANCELLED
```

Supported order types:

```text
DINE_IN
TAKEAWAY
```

---

## Products

Features:

- Product listing
- Search
- Category filtering
- Add product
- Edit product
- Delete product
- Active/inactive status
- Product statistics
- Product image upload
- Image preview
- Replace image
- Remove image
- Image validation

Supported frontend image types:

```text
JPG
PNG
WEBP
```

Frontend maximum image size:

```text
5 MB
```

Production image upload architecture:

```text
Dashboard
    ↓
Frontend upload
    ↓
POST /api/uploads/products
    ↓
Backend validation
    ↓
Storage provider
    ↓
Permanent image URL
    ↓
Product database record
```

The frontend does NOT directly write files into `/public` in production.

---

# Categories

The dashboard supports dynamic product categories.

Current development categories:

```text
Combos
Buckets
Burgers
Chicken
Sides
Drinks
Desserts
```

Production backend should provide:

```text
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

The backend must safely handle deletion of categories currently used by products.

---

# Coupons

Dashboard coupon management supports:

- Create coupon
- Edit coupon
- Delete coupon
- Activate/deactivate coupon
- Percentage discount
- Fixed discount
- Minimum order amount
- Expiration date
- Usage limit
- Search
- Filter
- Coupon statistics

Development coupon examples:

```text
WELCOME10
SAVE5
BITE20
```

Important:

Coupon validation and discount calculation must be performed again on the backend.

The frontend calculation is only for UI purposes.

---

# Customers

Dashboard customer management supports:

- Customer listing
- Search
- Customer details
- Active/inactive status
- Status updates
- Customer statistics

Production backend should provide customer persistence and order history.

---

# Reports

Dashboard reports include:

- Revenue
- Orders
- Average order value
- Completion information
- Revenue charts
- Order charts
- Top products
- Recent sales
- Date-range filtering

Current frontend ranges:

```text
7 days
30 days
90 days
```

Production reports must be calculated from real database/order data.

---

# Staff & Roles

The dashboard supports:

```text
OWNER
ADMIN
WORKER
```

## OWNER

Can access:

```text
/dashboard
/dashboard/orders
/dashboard/products
/dashboard/coupons
/dashboard/customers
/dashboard/reports
/dashboard/staff
/dashboard/settings
```

## ADMIN

Can access:

```text
/dashboard
/dashboard/orders
/dashboard/products
/dashboard/coupons
/dashboard/customers
/dashboard/reports
```

Cannot access:

```text
/dashboard/staff
/dashboard/settings
```

## WORKER

Can access:

```text
/dashboard
/dashboard/orders
```

Cannot access other management sections.

Important:

Frontend route protection is only a UX layer.

Backend APIs MUST independently authenticate and authorize every request.

---

# Settings

Settings currently support:

## Restaurant Information

- Restaurant name
- Email
- Phone
- Address
- Currency
- Timezone

## Order Settings

- Accept new orders
- Dine-in orders
- Takeaway orders
- Auto-confirm orders

## Notifications

- New order notifications
- Order status notifications
- Low stock notifications
- Daily report

## Security

- Password change UI placeholder
- Backend security requirements

## Business Hours

Frontend placeholder for future backend configuration.

## Payment Configuration

Frontend placeholder.

Sensitive payment credentials must remain server-side.

---

# State Management

The customer cart uses Zustand.

Cart state is persisted using:

```text
biteora-cart
```

Cart functionality includes:

```text
addToCart
increaseQuantity
decreaseQuantity
removeFromCart
clearCart
```

Important:

Client-side cart data must NOT be trusted by the backend.

The backend must recalculate:

- Product prices
- Quantities
- Subtotal
- Packaging fee
- Coupon discount
- Final total

before creating an order.

---

# API Layer

The frontend API abstraction is located at:

```text
src/lib/api/
```

Current API modules:

```text
client.ts
categories.ts
coupons.ts
customers.ts
orders.ts
products.ts
reports.ts
settings.ts
staff.ts
uploads.ts
```

---

# API Client

The main API client is:

```text
src/lib/api/client.ts
```

It provides:

```text
apiRequest()
apiGet()
apiPost()
apiPatch()
apiDelete()
ApiError
```

The client automatically:

- Normalizes API paths
- Sends JSON when required
- Sends cookies with requests
- Parses JSON responses
- Handles API errors
- Supports FormData uploads

---

# Backend API Contracts

## Authentication

```text
POST /api/auth/login
POST /api/auth/logout
```

Production authentication must use a secure server-side authentication/session system.

---

## Staff

```text
GET    /api/staff
POST   /api/staff
DELETE /api/staff?id=:id
```

Production requirements:

- Authentication
- Authorization
- Secure password hashing
- Database persistence
- Session validation
- Permission checks
- Audit logging where appropriate

---

## Products

```text
GET    /api/products
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

Product payload:

```text
name
category
price
image
description
active
```

Backend must validate all product data.

---

## Categories

```text
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
```

---

## Product Images

```text
POST /api/uploads/products
```

Request:

```text
multipart/form-data
field: file
```

Response:

```json
{
  "url": "https://example.com/product-image.jpg"
}
```

Backend responsibilities:

- Authentication
- Owner/Admin authorization
- File type validation
- File size validation
- Secure filename generation
- Image processing
- Storage
- Security/malware checks where applicable
- Permanent URL generation

---

## Orders

```text
GET   /api/orders
PATCH /api/orders/:id
```

Customer order creation should use the checkout API contract:

```text
POST /api/orders
```

The backend must recalculate the order.

Never trust client-submitted:

```text
price
subtotal
discount
packagingFee
total
coupon validity
product availability
```

---

## Coupons

```text
GET    /api/coupons
POST   /api/coupons
PATCH  /api/coupons/:id
DELETE /api/coupons/:id
```

Backend must verify:

- Coupon exists
- Coupon is active
- Expiration
- Usage limit
- Minimum order
- Eligibility
- Discount calculation

---

## Customers

```text
GET   /api/customers
GET   /api/customers/:id
PATCH /api/customers/:id/status
```

---

## Reports

Suggested production endpoints:

```text
GET /api/reports/summary
GET /api/reports/revenue
GET /api/reports/products
GET /api/reports/orders
```

The backend should calculate reports from actual database records.

---

## Settings

```text
GET   /api/settings
PATCH /api/settings/restaurant
PATCH /api/settings/orders
PATCH /api/settings/notifications
PATCH /api/settings/business-hours
```

---

# Environment Variables

The frontend supports:

```text
NEXT_PUBLIC_API_BASE_URL=
```

For local development:

```env
NEXT_PUBLIC_API_BASE_URL=
```

If the backend is hosted separately:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

IMPORTANT:

Never put private secrets in:

```text
NEXT_PUBLIC_*
```

Never expose:

- Database passwords
- Payment secret keys
- Service-role keys
- Private API keys
- Authentication secrets

to the browser.

---

# Security Architecture

The frontend includes basic validation and UX protection, but frontend validation is NOT a security boundary.

The backend must independently validate every request.

## Backend must protect against

- SQL injection
- NoSQL injection
- XSS
- CSRF where applicable
- Broken authentication
- Broken authorization
- IDOR
- Mass assignment
- Rate-limit abuse
- Malicious file uploads
- Invalid order manipulation
- Price manipulation
- Coupon abuse
- Payment manipulation
- Session hijacking
- Brute-force login attempts

---

# Order Security

Never trust the frontend order total.

Example malicious payload:

```json
{
  "price": 1,
  "clientTotal": 0.01
}
```

The backend must ignore client pricing and retrieve actual product prices from the database.

Correct flow:

```text
Frontend
    ↓
product IDs + quantities
    ↓
Backend
    ↓
Database product lookup
    ↓
Validate availability
    ↓
Calculate subtotal
    ↓
Validate coupon
    ↓
Calculate discount
    ↓
Calculate packaging fee
    ↓
Calculate final total
    ↓
Create order
```

---

# Payment Security

Payment integration must be implemented on the backend.

The frontend must never contain payment secret keys.

Backend must handle:

- Payment creation
- Payment provider communication
- Webhook verification
- Transaction verification
- Payment status
- Failed payments
- Duplicate payment prevention

Never trust a frontend payment-success flag.

---

# Authentication Security

Current authentication files are development implementations.

Development files include:

```text
app/api/auth/login/route.ts
app/api/auth/logout/route.ts
app/api/staff/route.ts
```

Current development implementation uses temporary:

- Demo accounts
- Development cookies
- Global memory storage
- SHA-256 password hashing

These MUST be replaced before production.

Production authentication should use:

- Secure password hashing such as Argon2id/bcrypt/scrypt
- Server-side session management
- Secure cookies
- Proper session expiration
- Session revocation
- Rate limiting
- Login attempt protection
- Server-side authorization

---

# Development Demo Accounts

Development-only accounts currently include:

```text
OWNER
Email: owner@biteora.com
Password: Biteora@123

ADMIN
Email: admin@biteora.com
Password: Biteora@123

WORKER
Email: worker@biteora.com
Password: Biteora@123
```

WARNING:

These credentials are for local development only.

They MUST NOT be used in production.

---

# Temporary Development Storage

Some current frontend/backend development routes use temporary in-memory storage:

```text
globalThis.__biteoraStaffStore
```

This is intentionally temporary.

Production must replace this with a real database.

---

# Project Structure

```text
restaurant-modern/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── logout/
│   │   └── staff/
│   │
│   ├── auth/
│   │   └── login/
│   │
│   ├── cart/
│   │
│   ├── checkout/
│   │
│   ├── dashboard/
│   │   ├── coupons/
│   │   ├── customers/
│   │   ├── orders/
│   │   ├── products/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── staff/
│   │
│   ├── menu/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── src/
│   ├── components/
│   │   └── dashboard/
│   │       ├── DashboardSidebar.tsx
│   │       └── DashboardTopbar.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── categories.ts
│   │   │   ├── coupons.ts
│   │   │   ├── customers.ts
│   │   │   ├── orders.ts
│   │   │   ├── products.ts
│   │   │   ├── reports.ts
│   │   │   ├── settings.ts
│   │   │   ├── staff.ts
│   │   │   └── uploads.ts
│   │   │
│   │   └── mock/
│   │       ├── categories.ts
│   │       └── products.ts
│   │
│   └── store/
│       └── cartStore.ts
│
├── public/
│   └── images/
│       └── products/
│
├── proxy.ts
├── package.json
├── tsconfig.json
├── tailwind configuration
├── .gitignore
└── README.md
```

---

# Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Production Build

Run:

```bash
npm run build
```

Then:

```bash
npm start
```

A successful production build should complete without TypeScript or Next.js compilation errors.

---

# Git Workflow

Check changes:

```bash
git status
```

Stage:

```bash
git add .
```

Commit:

```bash
git commit -m "your commit message"
```

Push:

```bash
git push origin main
```

---

# Backend Integration Workflow

The frontend should not be rewritten when the backend is connected.

The intended architecture is:

```text
Frontend UI
     ↓
src/lib/api/*
     ↓
Backend REST API
     ↓
Authentication
     ↓
Authorization
     ↓
Business Logic
     ↓
Database / Storage / Payment
```

The frontend API modules are designed to provide a clear integration boundary.

---

# Backend Developer Responsibilities

The backend developer is responsible for:

- Database design
- Database migrations
- Authentication
- Authorization
- Session management
- Password hashing
- User management
- Product persistence
- Category persistence
- Coupon persistence
- Customer persistence
- Order persistence
- Order validation
- Image storage
- File validation
- Payment integration
- Payment webhooks
- Reports
- Restaurant settings
- Business hours
- Notification infrastructure
- Rate limiting
- Security headers
- CORS
- CSRF protection where applicable
- Input validation
- Output validation
- Logging
- Error handling
- Production deployment

---

# Frontend Developer Responsibilities

The frontend is responsible for:

- UI
- UX
- Responsive layouts
- Form handling
- Client-side validation
- Loading states
- Error states
- API integration
- Displaying backend data
- Sending user actions to backend APIs
- Cart UI/state
- Dashboard UI
- Product image upload UI
- Checkout UI

The frontend must not implement database logic.

---

# Important Backend Rule

The frontend must never be considered a trusted environment.

Anything received from the browser can be modified.

Therefore backend validation is mandatory.

---

# Current Frontend Completion

The frontend currently contains:

```text
✓ Home
✓ Menu
✓ Cart
✓ Checkout
✓ Dashboard
✓ Orders
✓ Products
✓ Categories
✓ Coupons
✓ Customers
✓ Reports
✓ Staff & Roles
✓ Settings
✓ Product image upload UI
✓ API abstraction layer
✓ Development authentication
✓ Role-based dashboard routing
✓ Responsive layouts
✓ Error/loading states
✓ Production API contracts
✓ Security handoff documentation
```

---

# Backend Integration Priority

Recommended implementation order:

```text
1. Database
2. Authentication
3. Users / Staff
4. Categories
5. Products
6. Image Storage
7. Coupons
8. Customers
9. Orders
10. Checkout
11. Payments
12. Restaurant Settings
13. Business Hours
14. Notifications
15. Reports
16. Security hardening
17. Production deployment
```

---

# Production Readiness Checklist

Before production launch:

- [ ] Remove demo credentials
- [ ] Remove development authentication
- [ ] Replace temporary staff store
- [ ] Implement real database
- [ ] Implement secure password hashing
- [ ] Implement real server-side sessions
- [ ] Implement authorization
- [ ] Implement product persistence
- [ ] Implement category persistence
- [ ] Implement image storage
- [ ] Implement coupon validation
- [ ] Implement order validation
- [ ] Recalculate all prices server-side
- [ ] Implement payment provider
- [ ] Verify payment webhooks
- [ ] Implement business hours
- [ ] Implement notifications
- [ ] Implement reports
- [ ] Add rate limiting
- [ ] Add security headers
- [ ] Configure CORS
- [ ] Review CSRF protection
- [ ] Validate all inputs server-side
- [ ] Review file upload security
- [ ] Review authentication security
- [ ] Review authorization/IDOR protection
- [ ] Remove development secrets
- [ ] Configure production environment variables
- [ ] Run production build
- [ ] Run end-to-end testing
- [ ] Test mobile layouts
- [ ] Test payment failure scenarios
- [ ] Test unauthorized API access
- [ ] Test expired sessions
- [ ] Test invalid product prices
- [ ] Test coupon abuse
- [ ] Test duplicate order/payment scenarios
```

---

# License

Private client project.

All rights reserved.