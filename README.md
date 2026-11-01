# 🎓 SYMPORA — College Symposium & Workshop Registration Portal
> **A Comprehensive Full-Stack MERN Application**  
> **Project Owner & Lead Developer:** **Jaishree K**  
> **Technology Stack:** MongoDB Compass • Express.js • React 18 • Node.js • Tailwind CSS

---

## 🌟 Concept & Project Overview

**SYMPORA** is a centralized college portal designed for student clubs, technical societies, and departments (ACM, IEEE, CSI, GDSC, Biotech Forum, Robotics Club, SAE) to publish events, track live seat capacity with collision protection, collect student registrations, issue verified digital entry passes, and export attendee rosters.

### ✨ Key Features Implemented

1. **User Registration & Role-Based Authentication:**
   - Secure student registration and login with encrypted passwords (`bcryptjs`) and JSON Web Tokens (`JWT`).
   - Dual-role permissions: **Students** (RSVP & Pass Access) and **Admins / Club Organizers** (Event Creation, Management & Attendee Roster Exports).
   - Fast 1-Click Demo Pre-Fill buttons for effortless evaluation.

2. **Event Filtering & Multi-Criteria Search:**
   - **Department Filter:** CSE, IT, ECE, AI & DS, Mechanical, Biotechnology, and All Departments.
   - **Category Filter:** Workshops, Technical Symposiums, 24-Hour Hackathons, Paper Presentations, and Tech Seminars.
   - **Seat Status Filter:** All Events, Available Seats Only, and "Filling Fast" (🔥 <20% seats remaining).
   - **Live Keyword Search:** Instant search across titles, descriptions, clubs, venues, and topic tags.

3. **Single-Click Instant RSVP & Live Seat Tracking:**
   - Real-time seat decrement: shows exact remaining seats vs total capacity.
   - Dynamic visual progress bar (Green → Amber/Orange → Red when sold out).
   - Immediate generation of **Digital Boarding Pass / Ticket** with unique ticket code (e.g., `SYM-2026-X9A21`), student roll number, college, venue, QR code, and **1-Click Print / Save PDF** functionality.
   - Integrated confetti celebration on successful seat reservation.
   - Student can view their passes or cancel reservations at any time (which automatically releases the seat back to the pool).

4. **Exportable Attendee List (CSV & JSON) for Admins:**
   - Dedicated Admin Dashboard displaying total published events, total RSVPs, and seat utilization metrics.
   - Interactive attendee roster table per event.
   - **1-Click CSV Export:** Generates formatted `.csv` files ready for Microsoft Excel or Google Sheets.
   - **1-Click JSON Export:** Generates clean structured JSON for attendance scanners and college databases.

5. **MongoDB Compass Integration:**
   - Database: `symposium_portal`
   - Connection URI: `mongodb://127.0.0.1:27017/symposium_portal`
   - Collections: `users`, `events`, `registrations`
   - Pre-seeded with 6 rich college events and student registrations.

6. **Single Localhost Port (`http://localhost:5000`):**
   - The Express backend serves the production-built React client directly on port `5000`. You only need to open one single localhost URL in your browser!

---

## 🚀 Quick Start Guide (VS Code Terminal Commands)

Follow these simple steps in the **VS Code Terminal** to run the project on a **single localhost**:

### Step 1: Open the Project in VS Code
Open the project directory:
```powershell
cd "d:\Jaishree FSD Project"
```

### Step 2: Ensure MongoDB Compass is Connected
1. Open **MongoDB Compass**.
2. Connect to the default URI:
   ```
   mongodb://127.0.0.1:27017
   ```
3. *(Optional)* Run the seed script to populate realistic sample events and initial registrations:
   ```powershell
   npm run seed
   ```

### Step 3: Run on Single Localhost
Run this single command in the VS Code terminal:
```powershell
npm start
```
> **That's it!** The server will start and serve both the API and the complete UI on:  
> 🌐 **`http://localhost:5000`**

Open `http://localhost:5000` in your web browser (Chrome, Edge, Firefox, Brave) to use the project!

---

## 🔑 Demo Login Credentials

For quick evaluation and grading, pre-configured accounts are provided with convenient 1-click login buttons in the UI:

| Role | Name | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- | :--- |
| **Lead Admin** | **Jaishree K** | `jaishree@sympora.edu` | `Admin@123` | Full admin dashboard, create/delete events, export attendee CSV/JSON |
| **Student** | **Rahul Sharma** | `rahul@student.edu` | `User@123` | 1-Click RSVP, view/print digital entry passes, cancel registration |

---

## 📦 Project ZIP File Path

The complete project archive (with pre-built production client, backend, database models, seed script, and documentation, excluding bulky `node_modules`) is generated and located at:

📍 **Absolute File Path:**
```
D:\Jaishree FSD Project\symposium-portal-jaishree-k.zip
```

### How to Re-generate the ZIP at Any Time
If you make changes and want to update the ZIP file, run in the VS Code terminal:
```powershell
npm run zip
```
Or with PowerShell:
```powershell
Compress-Archive -Path client, server, package.json, README.md, .env.example, .gitignore -DestinationPath symposium-portal-jaishree-k.zip -Force
```

---

## 📂 Project Directory Structure

```text
d:\Jaishree FSD Project\
├── package.json                   # Root package configuration & run scripts
├── .env                           # Environment configurations (Port, MongoDB URI, JWT Secret)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── README.md                      # Comprehensive project documentation
├── symposium-portal-jaishree-k.zip# Complete project zip file for submission
│
├── server/                        # Express.js Backend
│   ├── server.js                  # Main server entry & Single Localhost static server
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection handler
│   ├── models/
│   │   ├── User.js                # User & student schema with bcrypt hashing
│   │   ├── Event.js               # Symposium & Workshop schema with seat logic
│   │   └── Registration.js        # RSVP registration ticket schema
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT token protector & Admin authorization
│   ├── controllers/
│   │   ├── authController.js      # User registration, login, and profile
│   │   ├── eventController.js     # Event CRUD, filtering, search & statistics
│   │   └── registrationController.js # 1-Click RSVP, seat decrements & CSV/JSON exports
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication endpoints (/api/auth)
│   │   ├── eventRoutes.js         # Event endpoints (/api/events)
│   │   └── registrationRoutes.js  # RSVP & Export endpoints (/api/registrations)
│   └── utils/
│       ├── seedData.js            # MongoDB Compass database seeder
│       └── mockStore.js           # Seamless in-memory fallback store
│
└── client/                        # React 18 + Vite + Tailwind CSS Frontend
    ├── package.json               # Frontend dependencies & build script
    ├── vite.config.js             # Vite config with API proxy
    ├── tailwind.config.js         # Modern theme & custom palette
    ├── index.html                 # Main HTML with Space Grotesk & Plus Jakarta fonts
    ├── dist/                      # Pre-built production assets (served on port 5000)
    └── src/
        ├── main.jsx               # React entry point
        ├── App.jsx                # Router & main application shell
        ├── index.css              # Custom styling, glow cards & print styles
        ├── context/
        │   └── AuthContext.jsx    # User auth state, toasts & demo logins
        ├── utils/
        │   └── api.js             # Clean Fetch API wrapper with JWT headers
        ├── components/
        │   ├── Navbar.jsx         # Sticky header with branding by Jaishree K
        │   ├── Footer.jsx         # Footer with tech stack & student attribution
        │   ├── EventCard.jsx      # Gradient cards with live seat progress bars
        │   ├── FilterBar.jsx      # Search, Department & Category filter controls
        │   ├── StatsBanner.jsx    # Real-time metrics banner
        │   ├── TicketModal.jsx    # Printable boarding-pass style entry ticket
        │   ├── EventModal.jsx     # Detailed event agenda & organizer modal
        │   └── Notification.jsx   # Sleek floating toast notifications
        └── pages/
            ├── HomePage.jsx       # Hero, stats, filtering, and event grid
            ├── MyRegistrationsPage.jsx # Student passes & ticket cancel options
            ├── AdminDashboardPage.jsx  # Event publisher & CSV/JSON attendee export
            ├── LoginPage.jsx      # Sign in page with 1-click demo buttons
            └── RegisterPage.jsx   # Student account registration page
```

---

## 🖥️ How to Use the Project

### 1. Exploring & Filtering Events
- Use the **Search Bar** to type keywords such as `"AI"`, `"Robotics"`, `"Hackathon"`, or `"Symposium"`.
- Click on **Category Pills** (`Workshop`, `Symposium`, `Hackathon`, `Paper Presentation`, `Tech Seminar`) to isolate specific types of events.
- Click on **Department Filters** (`CSE`, `IT`, `ECE`, `AI & DS`, `Mechanical`, `Biotechnology`) to view events organized by relevant academic streams.
- Use the **Seat Availability Dropdown** to quickly find events that are currently open or filling fast.

### 2. Single-Click RSVP & Digital Ticket Pass
1. Click **"Demo Student"** or log in as a student.
2. Find any open event on the home page and click **"⚡ 1-Click RSVP"**.
3. Instant seat verification:
   - A celebration confetti burst appears.
   - An **Official Entry Pass** opens immediately displaying the student's name, roll number, unique ticket code (`SYM-2026-XXXX`), event date, venue, and QR code.
   - Click **"Print / Save PDF"** to save or print the pass for admission.
4. The remaining seats on the card will dynamically decrement (e.g., from 118 to 117).

### 3. Admin Event Creation & Attendee Export (CSV / JSON)
1. Click **"Demo Admin"** or log in as **Jaishree K** (`jaishree@sympora.edu` / `Admin@123`).
2. Click the **"Admin Dashboard"** link in the navigation bar.
3. Click **"Publish New Event"** to launch the event creation modal:
   - Fill in title, club name, category, department, capacity, date, venue, and description.
   - Click **"Publish Event"** to make it instantly live.
4. To export attendees for any event:
   - Click **"Attendees"** to inspect registered students in a modal table.
   - Click **"CSV"** to download an attendee roster spreadsheet formatted for Excel.
   - Click **"JSON"** to download a structured JSON file.

---

## 🏆 Project Attribution
- **Project Name:** SYMPORA — Symposium Management & Workshop Registration System
- **Developed by:** **Jaishree K**
- **Architecture:** MERN Stack (MongoDB, Express, React, Node.js)
- **Deployment Port:** Single Localhost: `http://localhost:5000`
