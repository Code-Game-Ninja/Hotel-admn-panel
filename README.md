# Grand Horizon - Admin Panel

This is the isolated, standalone Admin Dashboard for managing the **Grand Horizon** hotel website. It connects to the exact same MongoDB database as the public site (`Hotel-Template`) to ensure immediate live updates.

## Features
- **Dashboard Overview**: Metrics, recent bookings, and quick actions.
- **Room Management**: Create, edit, and manage suite details and prices.
- **Availability Calendar**: Visual calendar to track booked dates and room status.
- **Reservations**: View and manage upcoming or past guest bookings.
- **Dining & Menu**: Update restaurant details and the culinary menu.
- **Gallery**: Upload images directly to Cloudinary and manage the public gallery.
- **Inquiries**: Read messages submitted via the public contact form.
- **Site Content & Settings**: Live-edit the text, phone numbers, hero images, and policies for the public website.

## Tech Stack
- Next.js 14 (App Router)
- React & Tailwind CSS
- NextAuth.js (Authentication & Security)
- MongoDB & Mongoose (Database)
- Cloudinary (Image Hosting)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file. It **must** share the same DB and Cloudinary keys as the public site.
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.../grand-horizon?retryWrites=true&w=majority

   # NextAuth
   NEXTAUTH_SECRET=your_super_secret_key
   NEXTAUTH_URL=http://localhost:3001

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Run the Development Server:**
   ```bash
   # The admin panel is configured to run on Port 3001
   npm run dev
   ```
   The admin panel will be available at `http://localhost:3001`.

## Security Notice
This project contains the full `POST`, `PUT`, and `DELETE` database access functionalities. It should be hosted separately from the public frontend (e.g., as an internal tool or behind strict deployment authorization) to ensure the hotel's data remains 100% secure.
