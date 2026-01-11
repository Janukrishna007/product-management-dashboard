# Product Management Dashboard

A modern, feature-rich e-commerce product management dashboard built with Next.js 15, featuring real-time analytics, order management, and a seamless shopping experience.

![Dashboard Preview](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwindcss)

##  Features Implemented

### Core Functionality
- ** User Authentication**: Secure login system with persistent sessions using localStorage
- ** Product Catalog**: Browse products fetched from DummyJSON API with real-time data
- ** Shopping Cart**: 
  - Add/remove products
  - Quantity management
  - Real-time total calculation
  - Persistent cart state across sessions
  - Clear cart functionality
- ** Checkout Process**: Complete order placement with shipping information
- ** Order Management**: View order history with detailed item breakdowns

### Advanced Features
- ** Analytics Dashboard**:
  - Revenue tracking over time (Line chart)
  - Orders per day visualization (Bar chart)
  - Product category distribution (Pie chart)
  - Order status breakdown (Pie chart)
  - Real-time statistics (Total revenue, orders, average order value)
  
- ** Reports System**:
  - Top-selling products table
  - Recent orders with status tracking
  - Downloadable sales reports (.txt format)
  - Comprehensive business insights

### UI/UX Features
- ** Premium Design**:
  - Gradient color scheme (Slate/Teal/Blue)
  - Frosted glass effects with backdrop blur
  - Smooth animations using Framer Motion
  - Responsive layout for all screen sizes
  
- ** Persistent Navigation**:
  - Fixed sidebar across all pages
  - Active page highlighting
  - Smooth page transitions without sidebar re-rendering

- ** Multi-Currency Support**:
  - INR (₹) currency display
  - Automatic USD to INR conversion (1 USD = ₹83)
  - Formatted price displays throughout

##  Tech Stack

### Frontend Framework
- **Next.js 15.1.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety and better DX

### Styling & UI
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Shadcn/UI** - High-quality React components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### State Management & Data
- **Zustand** - Lightweight state management
- **TanStack Query (React Query)** - Data fetching and caching
- **localStorage** - Client-side persistence

### Data Visualization
- **Recharts** - Chart library for analytics

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

##  Setup and Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd product-management-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Login credentials** (DummyJSON API)
   - Username: `emilys`
   - Password: `emilyspass`
   
   Or any valid credentials from [DummyJSON Users](https://dummyjson.com/users)

### Build for Production

```bash
npm run build
npm start
```

##  Architecture & Approach

### Project Structure
```
product-management-dashboard/
├── app/
│   ├── analytics/          # Analytics page with charts
│   ├── checkout/           # Checkout flow
│   ├── dashboard/          # Main product dashboard
│   ├── login/              # Authentication page
│   ├── orders/             # Order history
│   ├── reports/            # Sales reports
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── cart-sidebar.tsx    # Shopping cart sidebar
│   └── product-card.tsx    # Product display card
├── lib/
│   ├── currency.ts         # Currency conversion utilities
│   └── store.ts            # Zustand state management
└── public/                 # Static assets
```

### Key Architectural Decisions

#### 1. **State Management with Zustand**
- Chose Zustand over Redux for its simplicity and minimal boilerplate
- Implemented localStorage middleware for persistence
- Centralized state for user, cart, and orders
- Type-safe store with TypeScript interfaces

#### 2. **App Router (Next.js 15)**
- Leveraged Next.js 15's App Router for better performance
- Client-side rendering for interactive features
- Server Components where applicable
- Optimized routing with automatic code splitting

#### 3. **Component Architecture**
- Reusable UI components from Shadcn/UI
- Custom components for business logic (ProductCard, CartSidebar)
- Separation of concerns (presentation vs. logic)
- Consistent prop interfaces with TypeScript

#### 4. **Data Flow**
```
DummyJSON API → TanStack Query → Zustand Store → React Components
                                      ↓
                                 localStorage
```

#### 5. **Styling Strategy**
- Utility-first approach with Tailwind CSS
- Custom color palette (Slate/Teal/Blue)
- Consistent design tokens across components
- Responsive design with mobile-first approach

#### 6. **Performance Optimizations**
- Memoized calculations with `useMemo`
- Lazy loading of components
- Optimized re-renders with proper state management
- Image optimization with Next.js Image component

##  Challenges & Solutions

### Challenge 1: Currency Conversion
**Problem**: Product prices from DummyJSON API are in USD, but requirement was to display in INR.

**Solution**: 
- Created a utility module (`lib/currency.ts`) with conversion functions
- Implemented `formatUSDtoINR()` for automatic conversion and formatting
- Used consistent conversion rate (1 USD = ₹83)
- Applied across all price displays (products, cart, checkout, analytics)

### Challenge 2: State Persistence
**Problem**: Cart and user session data lost on page refresh.

**Solution**:
- Implemented Zustand middleware for localStorage persistence
- Automatic serialization/deserialization of state
- Hydration handling to prevent SSR/client mismatch
- Graceful fallback for localStorage unavailability

### Challenge 3: Sidebar Animation on Navigation
**Problem**: Sidebar was re-animating on every page navigation, causing jarring UX.

**Solution**:
- Removed Framer Motion animations from sidebar
- Changed from `<motion.aside>` to regular `<aside>` element
- Sidebar now persists across page changes
- Only main content area updates on navigation

### Challenge 4: TypeScript Type Safety with External API
**Problem**: DummyJSON API responses needed proper typing.

**Solution**:
- Created comprehensive TypeScript interfaces for all data models
- Type guards for runtime validation
- Proper typing for Zustand store
- Ensured type safety across the entire application

### Challenge 5: Analytics Data Aggregation
**Problem**: Need to generate meaningful analytics from order data.

**Solution**:
- Used `useMemo` for expensive calculations
- Implemented data aggregation functions for:
  - Revenue over time
  - Product category distribution
  - Order status breakdown
- Optimized re-computation with proper dependencies

### Challenge 6: React setState During Render Error
**Problem**: Router redirects in component body caused React errors.

**Solution**:
- Wrapped `router.push()` calls in `useEffect` hooks
- Proper dependency arrays to prevent infinite loops
- Separated render logic from side effects

##  Assumptions Made

1. **Currency Conversion**: Assumed a fixed conversion rate of 1 USD = ₹83 INR
2. **User Authentication**: Used DummyJSON's mock authentication API
3. **Order Status**: Assumed orders are automatically set to "completed" status
4. **Product Availability**: All products from API are assumed to be in stock
5. **Shipping**: Free shipping assumed for all orders
6. **Date Format**: Used browser's locale for date formatting
7. **Browser Support**: Modern browsers with ES6+ support

##  Areas for Improvement

### Short-term Improvements
1. **Search & Filtering**:
   - Implement product search functionality
   - Add category filters
   - Price range filtering
   - Sort options (price, rating, popularity)

2. **Form Validation**:
   - Enhanced checkout form validation
   - Real-time error messages
   - Input sanitization

3. **Error Handling**:
   - Better error boundaries
   - Retry mechanisms for failed API calls
   - User-friendly error messages

### Medium-term Improvements
4. **Backend Integration**:
   - Replace DummyJSON with real backend API
   - Implement proper authentication (JWT, OAuth)
   - Real-time order updates with WebSockets

5. **Testing**:
   - Unit tests with Jest
   - Integration tests with React Testing Library
   - E2E tests with Playwright/Cypress

6. **Performance**:
   - Implement virtual scrolling for large product lists
   - Image lazy loading optimization
   - Code splitting for route-based chunks

### Long-term Improvements
7. **Features**:
   - User profile management
   - Wishlist functionality
   - Product reviews and ratings
   - Order tracking with status updates
   - Email notifications
   - Multi-language support (i18n)

8. **Analytics Enhancement**:
   - More detailed analytics (conversion rates, user behavior)
   - Export analytics to PDF/Excel
   - Custom date range selection
   - Comparative analytics (month-over-month, year-over-year)

9. **Accessibility**:
   - ARIA labels for screen readers
   - Keyboard navigation improvements
   - High contrast mode
   - Focus management

10. **DevOps**:
    - CI/CD pipeline setup
    - Automated testing in pipeline
    - Docker containerization
    - Environment-based configurations

##  License

This project is created for demonstration purposes.

##  Contributing

Contributions, issues, and feature requests are welcome!

