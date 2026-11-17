The Wild Oasis — Hotel Management Dashboard

The Wild Oasis is an internal hotel management web application designed for boutique hotel staff to manage daily operations efficiently—from tracking cabin availability and handling guest check-ins/check-outs to analyzing revenue and booking trends.

Key Features:

Authentication & Staff Management: Secure employee login, user registration, and profile management (avatar upload and password updates) powered by Supabase Auth.

Interactive Analytics Dashboard: Real-time overview of hotel KPIs including total bookings, sales revenue, check-ins, and occupancy rates with dynamic filtering (Last 7, 30, or 90 days) and interactive charts.

Booking Operations: Full lifecycle booking management—filter by status (Unconfirmed, Checked-in, Checked-out), sort by date or amount, process guest check-ins/check-outs, confirm breakfast add-ons, and manage payments.

Cabin Management (CRUD): View, create, edit, duplicate, and delete hotel cabins with image uploads, pricing, capacity, and discount controls.

Hotel Settings: Configurable global settings for minimum/maximum booking nights, max guests per booking, and breakfast pricing.

Dark Mode: Seamless switching between Light and Dark themes for comfortable day/night shift usage.

Architecture & Tech Stack:

Frontend & Architecture: React, React Router, Compound Component Pattern (for reusable modals, tables, and context menus)

Server State & Data Fetching: TanStack Query (React Query)

Forms & Schema Validation: React Hook Form, Zod

Styling: Styled Components

Backend & Database: Supabase (PostgreSQL, Authentication, Storage)

Data Visualization: Recharts

Icons & Notifications: React Icons, React Hot Toast
