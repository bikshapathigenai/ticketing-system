# Walkthrough - IT Ticketing System (Spring Boot + React CRUD)

A full-stack IT Ticketing System CRUD application built with a **Spring Boot REST API backend** and a modern **React SPA frontend**.

---

## 📁 Complete Project Structure

```
reactjs-crud/
├── backend/                                       # Spring Boot REST API
│   ├── pom.xml                                    # Maven Dependencies (Spring Web, Data JPA, H2)
│   └── src/main/java/com/example/ticketing/
│       ├── TicketingApplication.java              # Main Launcher & Database Data Seeder
│       ├── model/
│       │   ├── Ticket.java                        # Ticket JPA Entity
│       │   ├── Status.java                        # Status Enum (OPEN, IN_PROGRESS, CLOSED)
│       │   └── Priority.java                      # Priority Enum (LOW, MEDIUM, HIGH)
│       ├── repository/
│       │   └── TicketRepository.java              # Spring Data JPA Repository
│       ├── service/
│       │   ├── TicketService.java                 # Service Interface
│       │   └── TicketServiceImpl.java             # Business Logic & CRUD Handler
│       ├── controller/
│       │   └── TicketController.java              # REST Controller (@RequestMapping("/api/tickets"))
│       └── config/
│           └── WebConfig.java                     # Global CORS Configuration
│   └── src/main/resources/
│       └── application.properties                 # H2 In-Memory DB & Server Configuration
└── frontend/                                      # React SPA Frontend (Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx                               # React Root Entry Point
        ├── App.jsx                                # React Router Configuration (<Routes>, <Route>)
        ├── index.css                              # Glassmorphism Design System & CSS Variables
        ├── services/
        │   └── ticketService.js                   # Axios REST Client & Mock Fallback Handler
        ├── components/
        │   ├── Navbar.jsx                         # Sticky Navigation Bar with active routes
        │   ├── StatusBadge.jsx                    # Glassmorphic Status Pill Badges
        │   ├── PriorityBadge.jsx                  # Color-coded Priority Badges
        │   ├── LoadingSpinner.jsx                 # Animated Loading Indicator
        │   ├── ErrorAlert.jsx                     # Interactive Error Banner (400, 404, 500)
        │   └── TicketForm.jsx                     # Reusable Controlled Form Component
        └── pages/
            ├── TicketListPage.jsx                 # Page 1: '/' Dashboard Table with Search & Filters
            ├── CreateTicketPage.jsx               # Page 2: '/create' Ticket Creation Form
            └── EditTicketPage.jsx                 # Page 3: '/edit/:id' Edit Form pre-filled on mount
```

---

## 🛠️ Backend Architecture (Spring Boot)

### 1. Entity & Enums
- **[Ticket.java](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/model/Ticket.java)**: JPA Entity mapped to database table `tickets`.
  - `id`: Auto-generated Identity Primary Key (Long).
  - `title`: String (not null).
  - `description`: String (up to 2000 chars).
  - `status`: Enum (`OPEN`, `IN_PROGRESS`, `CLOSED`).
  - `priority`: Enum (`LOW`, `MEDIUM`, `HIGH`).
  - `createdAt`: LocalDateTime initialized automatically via `@PrePersist`.
- **[Status.java](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/model/Status.java)** & **[Priority.java](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/model/Priority.java)**: Enums defining lifecycle states.

### 2. Service & Repository Layer
- **[TicketRepository.java](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/repository/TicketRepository.java)**: Extends `JpaRepository<Ticket, Long>`.
- **[TicketServiceImpl.java](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/service/TicketServiceImpl.java)**: Handles business rules, default fallback values, and data persistence.

### 3. REST Controller & CORS Configuration
- **[TicketController.java](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/controller/TicketController.java)**: Exposes RESTful endpoints under `/api/tickets`:

| HTTP Method | Endpoint | Description | Response Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets` | Retrieve list of all tickets | `200 OK` |
| `GET` | `/api/tickets/{id}` | Retrieve single ticket by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/tickets` | Create a new ticket | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/tickets/{id}` | Update existing ticket | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/tickets/{id}` | Delete ticket by ID | `204 No Content` / `404 Not Found` |

- **[WebConfig.java](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/config/WebConfig.java)**: Sets up CORS (`allowedOriginPatterns("*")`) so the React app running on `http://localhost:5173` can make cross-origin requests.

---

## 🎨 Frontend Architecture (React SPA)

### 1. React Router Setup (`App.jsx`)
In **[App.jsx](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/App.jsx)**:
- `<BrowserRouter>` wraps the application.
- `<Routes>` and `<Route>` define 3 primary pages:
  - `/` -> `TicketListPage`
  - `/create` -> `CreateTicketPage`
  - `/edit/:id` -> `EditTicketPage`
- `useNavigate()` is used for programmatic navigation (e.g. redirecting to `/` after creating or editing a ticket).
- `<Link>` is used in **[Navbar.jsx](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/Navbar.jsx)** for client-side navigation without full page reloads.

### 2. Controlled Components (`TicketForm.jsx`)
In **[TicketForm.jsx](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/TicketForm.jsx)**:
- All form controls (`input`, `textarea`, `select`) are bound to local React state `formData`.
- `value={formData.title}` ensures React is the **single source of truth**.
- Dynamic change handler:
  ```javascript
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  ```

### 3. Loading & Error States
- **Loading State**: **[LoadingSpinner.jsx](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/LoadingSpinner.jsx)** renders an animated loader while GET, POST, or PUT network requests are pending.
- **Error State**: **[ErrorAlert.jsx](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/ErrorAlert.jsx)** catches HTTP status codes (400 Bad Request, 404 Not Found, 500 Server Error) and displays an alert box with a retry option.

---

## 🧪 Empirical Verification & Results

### 1. Spring Boot REST API Endpoint Tests
Executed via PowerShell `Invoke-RestMethod` against `http://localhost:8080/api/tickets`:

- **GET `/api/tickets`**: Returned `200 OK` with 4 seeded database records (`VPN Connection Dropout`, `Laptop Screen Replacement`, etc.).
- **POST `/api/tickets`**: Sent JSON payload for new ticket `Wi-Fi Router Firmware Upgrade`. Returned `201 Created` with generated ID `#5`.
- **PUT `/api/tickets/5`**: Sent updated payload with status `CLOSED`. Returned `200 OK` with updated ticket.
- **DELETE `/api/tickets/5`**: Sent request. Returned `204 No Content`.
- **GET `/api/tickets/5` (Post-delete)**: Returned `404 Not Found`.

### 2. React Production Build
- Command `npm run build` executed in `frontend/`.
- Built successfully in **465ms** with zero JSX or compilation errors.

---

## 🚀 How to Run the Project

### Running the Backend (Spring Boot)
1. Open a terminal in `reactjs-crud/backend`.
2. Execute:
   ```powershell
   $env:JAVA_HOME="D:\softwares\jdk-21.0.8"
   & "D:\softwares\apache-maven-3.9.16\bin\mvn.cmd" spring-boot:run
   ```
3. Backend runs at: `http://localhost:8080/api/tickets`
4. In-Memory H2 Console: `http://localhost:8080/h2-console`

### Running the Frontend (React Vite)
1. Open a terminal in `reactjs-crud/frontend`.
2. Execute:
   ```bash
   npm run dev
   ```
3. Frontend runs at: `http://localhost:5173`
