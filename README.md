# ✈️ Flight Booking Frontend

A fully responsive flight booking system frontend built using **React** with role-based access for Admin and User. Users can browse flights, book seats, and view bookings, while Admins can manage flights and bookings.

---

## 🌐 Live Demo

🔗 **[Live Link](https://air-booker.netlify.app)**

---

## 🚀 Features

### 🔐 Authentication (User & Admin)

- User registration & login using API
- Role-based access control
- Token-based session handling

### 🛫 Flights Management (Admin)

- View all flights in table format
- Add new flights
- Update existing flights (fields like flight number, date, price, seats, etc.)
- Delete flights

### 👀 Flight Details (All Users)

- View flight details and available seats
- Seat reservation with 2-minute countdown timer
- Confirm booking after seat reservation

### 📜 Bookings Management

- **User:**
  - View all personal bookings (My Bookings)
- **Admin:**
  - View all bookings
  - Update number of seats (change booked seats)
  - Delete bookings

### 🎨 UI/UX

- Fully responsive design
- Clean and professional table-based views
- Interactive modals for forms (React Hook Form)
- Confirmation dialogs using SweetAlert2

### ⚠️ Known Limitations / Issues

-Search feature not implemented (time limitation).
-Flight Update feature implemented, but may not work due to API-side issues.

---

## 🛠️ Technologies Used

- **React 19** (SPA)
- **React Router v7** (Dynamic Routing)
- **Tailwind CSS 4.1** + `@tailwindcss/vite`
- **TanStack React Query v5** (Data Fetching)
- **Axios** (API Requests)
- **React Hook Form** (Form Handling)
- **SweetAlert2** (Alerts & Confirmations)
- **React Icons**

---

## ⚙️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Abdullah0604/air-booker.git

   cd air-booker

    npm install

    npm run dev

   ```
