# ⚛️ ReactJS Step-by-Step Architecture & Undergraduate Beginner Guide

> **Project:** IT Ticketing System — Full-Stack Spring Boot 3 & React CRUD Architecture  
> **Target Audience:** Undergraduates, Computer Science Students & React Beginners  

Welcome! If you are an undergraduate student or beginner stepping into modern web development, React can feel overwhelming at first. This guide was written specifically to bridge the gap between basic college HTML/JS knowledge and real-world React development.

---

## 📚 Table of Contents
1. [🎓 React Fundamentals for Undergraduates](#1-react-fundamentals-for-undergraduates)
   - [What is JSX?](#11-what-is-jsx)
   - [What is Component State (`useState`)?](#12-what-is-component-state-usestate)
   - [What are Props?](#13-what-are-props)
   - [What are Hooks & `useEffect`?](#14-what-are-hooks--useeffect)
   - [Virtual DOM vs Real DOM](#15-virtual-dom-vs-real-dom)
2. [Single Page Application (SPA) Concept](#2-single-page-application-spa-concept)
3. [Phase 1: Project Setup & Environment Setup Guide](#3-phase-1-project-setup--environment-setup-guide)
   - [3.1 Prerequisites & System Requirements](#31-prerequisites--system-requirements)
   - [3.2 Full Project Directory Architecture](#32-full-project-directory-architecture)
   - [3.3 Step-by-Step Backend Setup (Spring Boot 3)](#33-step-by-step-backend-setup-spring-boot-3)
   - [3.4 Step-by-Step Frontend Setup (React + Vite)](#34-step-by-step-frontend-setup-react--vite)
   - [3.5 How Frontend & Backend Connect (CORS & Service Layer)](#35-how-frontend--backend-connect-cors--service-layer)
   - [3.6 Quick Start Execution Checklist](#36-quick-start-execution-checklist)
4. [Phase 2: API Service Layer (`ticketService.js`)](#4-phase-2-api-service-layer-ticketservicejs)
5. [🎓 Undergraduate Deep-Dive: File-by-File & Component-by-Component](#5-undergraduate-deep-dive-file-by-file--component-by-component)
   - [5.1 index.html & main.jsx (How React starts)](#51-indexhtml--mainjsx-how-react-starts)
   - [5.2 App.jsx (Routing & Navigation)](#52-appjsx-routing--navigation)
   - [5.3 Navbar.jsx (Header & Links)](#53-navbarjsx-header--links)
   - [5.4 StatusBadge.jsx & PriorityBadge.jsx (Props in Action)](#54-statusbadgejsx--prioritybadgejsx-props-in-action)
   - [5.5 LoadingSpinner.jsx & ErrorAlert.jsx (Handling Async UI)](#55-loadingspinnerjsx--erroralertjsx-handling-async-ui)
   - [5.6 TicketForm.jsx (Controlled Forms & State Input Binding)](#56-ticketformjsx-controlled-forms--state-input-binding)
   - [5.7 TicketListPage.jsx (Data Fetching, `map()`, & List Keys)](#57-ticketlistpagejsx-data-fetching-map--list-keys)
   - [5.8 CreateTicketPage.jsx (POST Requests & Navigation)](#58-createticketpagejsx-post-requests--navigation)
   - [5.9 EditTicketPage.jsx (`useParams` & Pre-filling Form State)](#59-editticketpagejsx-useparams--pre-filling-form-state)
6. [⚠️ Common Beginner Traps & Mistakes to Avoid](#6-common-beginner-traps--mistakes-to-avoid)

---

## 1. 🎓 React Fundamentals for Undergraduates

Before looking at code files, let's understand the 5 core building blocks of React in simple terms.

### 1.1 What is JSX?
In traditional web dev, HTML is in `.html` files and JS is in `.js` files. React uses **JSX (JavaScript XML)**, which lets you write HTML-like markup directly inside JavaScript files (`.jsx`).

```jsx
// This is JSX! HTML elements inside JavaScript:
const element = <h1 className="title">Hello, React!</h1>;
```
* **Key difference:** In HTML you write `class="title"`. In JSX you write `className="title"` because `class` is a reserved keyword in JavaScript!
* **JavaScript expressions in JSX:** Wrap any JS variable or math inside `{}` braces: `<p>Total: {5 + 5}</p>`.

---

### 1.2 What is Component State (`useState`)?
**Analogy:** State is like a light switch's memory (is it ON or OFF?).

In vanilla JavaScript, to update text on screen, you write:
`document.getElementById("count").innerText = 5;`

In React, **you never touch the DOM manually**. Instead, you create a **State Variable**. When state changes, React automatically updates the screen!

```jsx
import { useState } from 'react';

function Counter() {
  // useState returns 2 things: [currentValue, updaterFunction]
  const [count, setCount] = useState(0); 

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

---

### 1.3 What are Props?
**Analogy:** Props (Properties) are like parameters passed to a JavaScript function.

Imagine a function: `function add(a, b)`. You pass `a` and `b` into the function.  
In React, you pass **Props** into components:

```jsx
// Parent component calling child component with a prop:
<StatusBadge status="OPEN" />

// Child component receiving props:
function StatusBadge(props) {
  return <span>Status is: {props.status}</span>;
}
```

---

### 1.4 What are Hooks & `useEffect`?
Hooks are special functions provided by React (always start with `use`, e.g., `useState`, `useEffect`, `useParams`).

**`useEffect`** allows you to run code at specific lifecycle moments (e.g., when the page first loads):

```jsx
useEffect(() => {
  console.log("This code runs ONCE when the component first appears on screen!");
}, []); // The empty [] means: "run only once on mount"
```

---

### 1.5 Virtual DOM vs Real DOM
Updating the actual browser DOM is slow. React creates a lightweight copy in memory called the **Virtual DOM**.

1. When state changes, React updates the Virtual DOM first.
2. React compares (diffs) the new Virtual DOM with the old Virtual DOM.
3. React updates **ONLY the exact changed elements** in the real browser DOM (this is called **Reconciliation**).

---

## 2. Single Page Application (SPA) Concept

In traditional HTML/PHP apps, clicking a link requests a new HTML file from the server. The screen flashes white while loading.

In this React app, there is only **ONE HTML file**:
* [`frontend/index.html`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/index.html)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>frontend</title>
  </head>
  <body>
    <!-- React injects EVERYTHING inside this root div -->
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```
React dynamically swaps UI components inside `<div id="root"></div>` without page reloads.

---

## 3. Phase 1: Project Setup & Environment Setup Guide

To run this Full-Stack IT Ticketing System application locally, you will set up both the **Spring Boot REST API Backend** and the **React SPA Frontend**.

---

### 3.1 Prerequisites & System Requirements

Before getting started, ensure you have the following installed on your machine:

| Requirement | Minimum Version | Recommended | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | v18.0.0+ | v20.x or higher | JavaScript runtime for Vite and React development server |
| **npm** | v9.0.0+ | v10.x | Node package manager to install frontend dependencies |
| **Java Development Kit (JDK)** | JDK 17+ | JDK 21 | Needed to compile and run the Spring Boot backend |
| **Apache Maven** | v3.8+ | v3.9+ (or Maven Wrapper `mvnw`) | Build automation tool for Java/Spring Boot |
| **Web Browser** | Modern Browser | Chrome / Edge / Firefox | Web browser to access the React app UI |

---

### 3.2 Full Project Directory Architecture

```
reactjs-crud/
├── backend/                                       # Spring Boot REST API
│   ├── pom.xml                                    # Maven Dependencies (Spring Web, Data JPA, H2)
│   └── src/main/java/com/example/ticketing/
│       ├── TicketingApplication.java              # Main Launcher & Database Data Seeder
│       ├── model/                                 # JPA Entities & Enums (Ticket, Status, Priority)
│       ├── repository/                            # JpaRepository interface
│       ├── service/                               # Service interface & implementation
│       ├── controller/                            # REST Controller (@RequestMapping("/api/tickets"))
│       └── config/                                # WebConfig (CORS allowed origins)
└── frontend/                                      # React SPA Frontend (Vite)
    ├── package.json                               # npm dependencies (React 19, Axios, Lucide icons)
    ├── vite.config.js                             # Vite configuration
    ├── index.html                                 # Single HTML entry point (<div id="root"></div>)
    └── src/
        ├── main.jsx                               # React entry point
        ├── App.jsx                                # React Router (<Routes>, <Route>)
        ├── index.css                              # Glassmorphism styling & design system tokens
        ├── services/ticketService.js              # Axios REST Client + Mock fallback
        ├── components/                            # Reusable UI Components (Navbar, Badges, Form)
        └── pages/                                 # Main Pages (TicketListPage, CreateTicketPage, EditTicketPage)
```

---

### 3.3 Step-by-Step Backend Setup (Spring Boot 3)

The backend is built with Spring Boot 3.2, Java 21, Spring Data JPA, and an H2 In-Memory Database.

#### Step 1: Navigate to the Backend Directory
```bash
cd backend
```

#### Step 2: Build the Application
Compile the code and package the application using Maven:
```bash
mvn clean package
```
*(If using Maven wrapper: `./mvnw clean package` on Linux/macOS or `.\mvnw.cmd clean package` on Windows)*

#### Step 3: Run the Backend Server
```bash
mvn spring-boot:run
```

* **API Endpoint:** [`http://localhost:8080/api/tickets`](http://localhost:8080/api/tickets)
* **H2 Database Console:** [`http://localhost:8080/h2-console`](http://localhost:8080/h2-console)
  * **JDBC URL:** `jdbc:h2:mem:ticketdb`
  * **User Name:** `sa`
  * **Password:** *(leave blank)*

> 💡 **Seed Data:** Upon starting, [`TicketingApplication.java`](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/TicketingApplication.java) automatically seeds the H2 database with sample tickets.

---

### 3.4 Step-by-Step Frontend Setup (React + Vite)

The frontend is a single-page application built with React 19, Vite, React Router v7, Axios, and Lucide React icons.

#### Step 1: Scaffolding (If creating from scratch)
Vite was used to scaffold the React project template:
```bash
npm create vite@latest frontend -- --template react
```

#### Step 2: Navigate to Frontend & Install Dependencies
```bash
cd frontend
npm install
```
This installs the required dependencies defined in [`frontend/package.json`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/package.json):
* `react` & `react-dom` — Core React 19 library.
* `react-router-dom` — Client-side SPA routing (`<BrowserRouter>`, `<Routes>`, `<Route>`, `useNavigate`).
* `axios` — HTTP client to communicate with the Spring Boot backend REST API.
* `lucide-react` — Modern UI icons (`Ticket`, `Plus`, `List`, `Loader2`).

#### Step 3: Start the React Development Server
```bash
npm run dev
```
* **Local Access URL:** [`http://localhost:5173`](http://localhost:5173)
* **Hot Module Replacement (HMR):** Code changes saved in `.jsx` or `.css` files immediately update in the browser without full reloads.

#### Step 4: Production Build Verification (Optional)
To create an optimized production bundle:
```bash
npm run build
```
Generates production assets in `frontend/dist/`.

---

### 3.5 How Frontend & Backend Connect (CORS & Service Layer)

1. **CORS Configuration:**  
   The backend [`WebConfig.java`](file:///d:/projects/practice/reactjs/reactjs-crud/backend/src/main/java/com/example/ticketing/config/WebConfig.java) permits requests from the React dev server (`http://localhost:5173`), preventing browser cross-origin blocking.
2. **API Service Layer:**  
   The frontend [`ticketService.js`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/services/ticketService.js) uses Axios to send requests to `http://localhost:8080/api/tickets`.
3. **Offline Standalone Fallback:**  
   If the Spring Boot server is offline or not started yet, `ticketService.js` automatically falls back to an in-memory mock ticket array, allowing you to develop and explore the React UI seamlessly without backend dependency!

---

### 3.6 Quick Start Execution Checklist

Open two terminal windows:

| Terminal 1 (Backend) | Terminal 2 (Frontend) |
| :--- | :--- |
| `cd backend` | `cd frontend` |
| `mvn spring-boot:run` | `npm run dev` |
| Runs on `http://localhost:8080` | Runs on `http://localhost:5173` |

---



---

## 4. Phase 2: API Service Layer (`ticketService.js`)

* **File:** [`frontend/src/services/ticketService.js`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/services/ticketService.js)

Instead of writing HTTP requests inside React UI files, we pull API calls into a service file:

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/tickets',
  headers: { 'Content-Type': 'application/json' },
  timeout: 4000,
});

export const ticketService = {
  getAllTickets: async () => {
    const response = await apiClient.get('');
    return response.data;
  },
  createTicket: async (ticketData) => {
    const response = await apiClient.post('', ticketData);
    return response.data;
  },
  // Includes automatic fallback to mock array if Spring Boot is offline!
};
```

---

## 5. 🎓 Undergraduate Deep-Dive: File-by-File & Component-by-Component

Here is every file in `frontend/src/`, complete with code snippets and beginner explanations.

---

### 5.1 `index.html` & `main.jsx` (How React Starts)
* **File:** [`frontend/src/main.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/main.jsx)

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 1. Grab <div id="root"> from index.html
// 2. Attach React root renderer
// 3. Render <App /> component inside <StrictMode>
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

#### Line-by-Line Beginner Breakdown:
* **Line 2 (`createRoot`)**: React 18/19 function that attaches React to the browser's HTML DOM node `#root`.
* **Line 7 (`<StrictMode>`)**: A wrapper tool that warns you about bad practices during development (does not show in production).
* **Line 8 (`<App />`)**: The top-level parent component of our entire application.

---

### 5.2 `App.jsx` (Routing & Navigation)
* **File:** [`frontend/src/App.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/App.jsx)

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { TicketListPage } from './pages/TicketListPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { EditTicketPage } from './pages/EditTicketPage';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar /> {/* Persistent Top Navigation */}

        <main className="app-container" style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<TicketListPage />} />
            <Route path="/create" element={<CreateTicketPage />} />
            <Route path="/edit/:id" element={<EditTicketPage />} />
            <Route path="*" element={<TicketListPage />} />
          </Routes>
        </main>

        <footer>IT Ticketing System — Full-Stack React Architecture</footer>
      </div>
    </BrowserRouter>
  );
}
```

#### Line-by-Line Beginner Breakdown:
* **`<BrowserRouter>`**: Listens to the browser URL bar.
* **`<Navbar />`**: Placed *outside* `<Routes>`, so it stays visible on every page!
* **`<Routes>` & `<Route>`**: Evaluates current URL:
  * URL `/` $\rightarrow$ shows `<TicketListPage />`
  * URL `/create` $\rightarrow$ shows `<CreateTicketPage />`
  * URL `/edit/5` $\rightarrow$ shows `<EditTicketPage />` (`:id` is a variable representing ticket ID `5`)

---

### 5.3 `Navbar.jsx` (Header & Navigation Links)
* **File:** [`frontend/src/components/Navbar.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/Navbar.jsx)

```jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Plus, List } from 'lucide-react';

export function Navbar() {
  const location = useLocation(); // Hook to check current URL path

  return (
    <header>
      <Link to="/">TechDesk</Link>

      <nav>
        <Link 
          to="/" 
          className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <List size={16} /> All Tickets
        </Link>

        <Link 
          to="/create" 
          className={`btn ${location.pathname === '/create' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Plus size={16} /> Create Ticket
        </Link>
      </nav>
    </header>
  );
}
```

#### Line-by-Line Beginner Breakdown:
* **`useLocation()`**: React Router hook that tells us the current path (`/` or `/create`).
* **`<Link to="...">`**: Replaces standard HTML `<a>` tags. `<a href="/create">` reloads the page, while `<Link to="/create">` changes the view instantly without reloading!

---

### 5.4 `StatusBadge.jsx` & `PriorityBadge.jsx` (Props in Action)
* **Files:** [`frontend/src/components/StatusBadge.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/StatusBadge.jsx) & [`frontend/src/components/PriorityBadge.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/PriorityBadge.jsx)

```jsx
import React from 'react';

// Props Destructuring: Extracts 'status' directly from incoming props object
export function StatusBadge({ status }) {
  const normalizedStatus = (status || 'OPEN').toUpperCase();

  const statusMap = {
    OPEN: { label: 'Open', class: 'badge-open' },
    IN_PROGRESS: { label: 'In Progress', class: 'badge-in_progress' },
    CLOSED: { label: 'Closed', class: 'badge-closed' },
  };

  const current = statusMap[normalizedStatus] || statusMap.OPEN;

  return (
    <span className={`badge ${current.class}`}>
      <span className="badge-dot" style={{ backgroundColor: 'currentColor' }}></span>
      {current.label}
    </span>
  );
}
```

#### Line-by-Line Beginner Breakdown:
* **`{ status }` (Props Destructuring)**: Instead of writing `props.status`, `{ status }` unpacks the property directly.
* **Stateless / Pure Component**: This component has no internal `useState`. It is just a function that converts an input string (`"OPEN"`) into styled HTML JSX.

---

### 5.5 `LoadingSpinner.jsx` & `ErrorAlert.jsx` (Handling Async UI)
* **Files:** [`frontend/src/components/LoadingSpinner.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/LoadingSpinner.jsx) & [`frontend/src/components/ErrorAlert.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/ErrorAlert.jsx)

```jsx
// LoadingSpinner Component with Default Prop Message
export function LoadingSpinner({ message = 'Loading tickets...' }) {
  return (
    <div className="fade-in">
      <Loader2 className="animate-spin" size={36} />
      <p>{message}</p>
    </div>
  );
}

// ErrorAlert Component with Early Guard Return
export function ErrorAlert({ error, onRetry }) {
  if (!error) return null; // If no error, render NOTHING!

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="alert alert-danger">
      <p>{errorMessage}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}
```

#### Line-by-Line Beginner Breakdown:
* **`if (!error) return null;`**: In React, returning `null` tells React: *"Don't display anything in the DOM right now."*
* **`onRetry` Callback Prop**: `ErrorAlert` calls `onRetry()` when the user clicks Retry. The parent page handles what happens when Retry is clicked!

---

### 5.6 `TicketForm.jsx` (Controlled Forms & State Input Binding)
* **File:** [`frontend/src/components/TicketForm.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/components/TicketForm.jsx)

```jsx
export function TicketForm({ initialData = null, onSubmit, isSubmitting = false }) {
  // 1. CONTROLLED FORM STATE
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'MEDIUM',
  });

  // 2. Pre-fill state if editing existing ticket
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'OPEN',
        priority: initialData.priority || 'MEDIUM',
      });
    }
  }, [initialData]);

  // 3. Universal Change Handler for Controlled Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Dynamic property update!
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop standard browser page reload!
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title} // State bound to input value
        onChange={handleChange} // Handler updates state on every keypress
      />
      <button type="submit">Submit Ticket</button>
    </form>
  );
}
```

#### Line-by-Line Beginner Breakdown:
* **Controlled Component Pattern**: The `<input>` value comes from React state (`value={formData.title}`). When you type a character, `onChange` runs, `setFormData` updates state, and React re-renders the input with the new text.
* **`e.preventDefault()`**: Prevents traditional HTML forms from submitting and reloading the browser page.

---

### 5.7 `TicketListPage.jsx` (Data Fetching, `map()`, & List Keys)
* **File:** [`frontend/src/pages/TicketListPage.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/pages/TicketListPage.jsx)

```jsx
export function TicketListPage() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on initial component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const data = await ticketService.getAllTickets();
      setTickets(data); // State update triggers table re-render!
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorAlert error={error} />
      ) : (
        <table>
          <tbody>
            {tickets.map((ticket) => (
              // KEY PROP IS REQUIRED when rendering lists in React!
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.title}</td>
                <td><StatusBadge status={ticket.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

#### Line-by-Line Beginner Breakdown:
* **`useEffect(..., [])`**: Runs `fetchTickets()` **ONCE** after the component renders on screen.
* **Ternary Operator (`isLoading ? ... : ...`)**: Shows spinner while fetching, error alert if failed, or data table on success.
* **`.map((ticket) => <tr key={ticket.id}>)`**: Transforms an array of ticket JS objects into HTML `<tr>` table rows.
* **`key={ticket.id}`**: Crucial for React Virtual DOM diffing! React uses `key` to identify which row was added, updated, or deleted.

---

### 5.8 `CreateTicketPage.jsx` (POST Requests & Navigation)
* **File:** [`frontend/src/pages/CreateTicketPage.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/pages/CreateTicketPage.jsx)

```jsx
export function CreateTicketPage() {
  const navigate = useNavigate(); // Navigation hook
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTicket = async (formData) => {
    setIsSubmitting(true);
    try {
      await ticketService.createTicket(formData); // Sends HTTP POST
      navigate('/'); // Redirect back to Dashboard
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Create New Ticket</h2>
      {/* Reuses TicketForm component */}
      <TicketForm onSubmit={handleCreateTicket} isSubmitting={isSubmitting} mode="create" />
    </div>
  );
}
```

#### Line-by-Line Beginner Breakdown:
* **`useNavigate()`**: Allows programmatic redirection (navigating back to `/` after POST request succeeds).
* **Lifting State Up**: `TicketForm` captures input data and passes it up to `CreateTicketPage` via the `onSubmit` prop.

---

### 5.9 `EditTicketPage.jsx` (`useParams` & Pre-filling Form State)
* **File:** [`frontend/src/pages/EditTicketPage.jsx`](file:///d:/projects/practice/reactjs/reactjs-crud/frontend/src/pages/EditTicketPage.jsx)

```jsx
export function EditTicketPage() {
  const { id } = useParams(); // Extracts :id from URL parameter (e.g., /edit/2 -> id = '2')
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const loadTicket = async () => {
      const data = await ticketService.getTicketById(id); // HTTP GET /api/tickets/:id
      setTicket(data);
    };
    if (id) loadTicket();
  }, [id]);

  const handleUpdateTicket = async (formData) => {
    await ticketService.updateTicket(id, formData); // HTTP PUT /api/tickets/:id
    navigate('/');
  };

  return (
    <div>
      <h2>Edit Ticket #{id}</h2>
      {ticket && <TicketForm initialData={ticket} onSubmit={handleUpdateTicket} mode="edit" />}
    </div>
  );
}
```

#### Line-by-Line Beginner Breakdown:
* **`useParams()`**: Extracts variables from the URL path (`/edit/:id`).
* **`useEffect(..., [id])`**: Re-fetches ticket details whenever `id` changes.
* **Pre-filling Form**: Passes `initialData={ticket}` into `TicketForm` so inputs open pre-populated with existing ticket values.

---

## 6. ⚠️ Common Beginner Traps & Mistakes to Avoid

1. ❌ **Direct State Mutation:**
   * **Wrong:** `tickets.push(newTicket);` (React won't re-render!)
   * **Right:** `setTickets([...tickets, newTicket]);` (Creates a new array reference!)
2. ❌ **Missing List Keys:**
   * **Wrong:** `tickets.map(t => <div>{t.title}</div>)`
   * **Right:** `tickets.map(t => <div key={t.id}>{t.title}</div>)`
3. ❌ **Infinite Loops in `useEffect`:**
   * **Wrong:** `useEffect(() => { setTickets(data); });` (Missing `[]` dependency array causes infinite re-render loops!)
   * **Right:** `useEffect(() => { setTickets(data); }, []);`
4. ❌ **Using `class` instead of `className`:**
   * In JSX, always use `className="my-style"` instead of HTML `class`.
