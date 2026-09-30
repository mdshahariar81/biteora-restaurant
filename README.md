# Biteora — Modern Restaurant Ordering Website

Biteora is a modern, responsive restaurant ordering website built with Next.js, React, TypeScript, and Tailwind CSS.

The project is designed with a clean and user-friendly interface for browsing food items, managing a shopping cart, selecting an order type, and preparing for the checkout and online ordering flow.

---

## Features

### Home Page
- Modern restaurant landing page
- Hero section
- Food categories
- Popular combos
- Special offers
- Restaurant features
- About section
- Customer testimonials
- App download section
- Contact section
- Responsive navigation and footer

### Menu
- Food category filtering
- Product cards
- Product images
- Product pricing
- Add to cart functionality
- Visual add-to-cart feedback
- Cart item count
- Responsive menu layout

### Shopping Cart
- Add and remove products
- Increase/decrease product quantity
- Clear cart
- Subtotal calculation
- Order type selection
- Dine-in support
- Table number input
- Takeaway / parcel support
- $1.00 packaging fee for takeaway
- Dynamic total calculation
- Persistent cart using Zustand

### Checkout
Checkout is being developed as the next stage of the project.

Planned checkout functionality includes:

- Customer information
- Order details
- Order type confirmation
- Table number validation for dine-in
- Takeaway packaging fee
- Payment method selection
- Order placement
- Order confirmation
- Order ID and order status

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- Lucide React
- ESLint

---

## Project Structure

```text
biteora-restaurant/
│
├── app/
│   ├── cart/
│   │   └── page.tsx
│   │
│   ├── menu/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── public/
│   └── images/
│       ├── app/
│       ├── categories/
│       ├── hero/
│       ├── products/
│       ├── restaurant/
│       └── testimonials/
│
├── src/
│   ├── components/
│   │   ├── home/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── data/
│   ├── lib/
│   ├── store/
│   │   └── cartStore.ts
│   │
│   └── types/
│
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md