# 🩺 DocAppoint — Server

The **DocAppoint Server** is the backend API for the DocAppoint doctor appointment management application.

It is built with **Node.js, Express.js, and MongoDB** and provides APIs for doctors, appointments, user profiles, and authenticated requests.

---

## 🚀 Features

* RESTful API with Express.js
* MongoDB database integration
* Doctor data management
* Appointment creation and management
* User profile management
* User-specific appointment retrieval
* Protected API routes
* JWT/JWKS-based token verification
* CORS configuration
* Environment variable support
* MongoDB ObjectId support

---

## 🛠️ Technologies Used

* **Node.js**
* **Express.js**
* **MongoDB**
* **MongoDB Node.js Driver**
* **JOSE**
* **dotenv**
* **CORS**
* **Nodemon**

---

## 📂 Project Structure

```text
server/
│
├── index.js
├── package.json
├── package-lock.json
├── .env
└── README.md
```

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/doc-appoint-server.git
```

Navigate to the server directory:

```bash
cd doc-appoint-server
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the root of the server:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

If your authentication configuration requires additional environment variables, add them to the `.env` file as well.

### ⚠️ Important

Never commit your `.env` file to GitHub.

Add the following to `.gitignore`:

```gitignore
node_modules
.env
```

---

## ▶️ Run the Server

### Development

Using Nodemon:

```bash
nodemon index.js
```

Or:

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will run on:

```text
http://localhost:5000
```

---

## 📡 API Endpoints

### 👨‍⚕️ Appointments

Get all appointments:

```http
GET /appointments
```

Get a specific appointment:

```http
GET /appointments/:id
```

Get appointments for a specific user:

```http
GET /booking/:userId
```

Update an appointment:

```http
PATCH /booking/:bookingId
```

---

### 👤 User Profile

Update a user's profile:

```http
PATCH /user/:userId
```

The endpoint can be used to update profile information such as:

* Name
* Profile image
* Other supported user information

---

## 🔒 Authentication & Authorization

The server supports authenticated API requests using token-based authorization.

The authentication flow is:

```text
Client
  │
  ▼
User Login
  │
  ▼
Authentication Provider
  │
  ▼
Access Token
  │
  ▼
Express API
  │
  ▼
Token Verification
  │
  ▼
Protected Resource
```

The backend uses **JOSE/JWKS verification** to validate authentication tokens where required.

Clients should send the token through the `Authorization` header:

```http
Authorization: Bearer <token>
```

---

## 🗄️ Database

DocAppoint uses **MongoDB** as its database.

The application uses the following main collections:

```text
DocAppoint
│
├── doctors
├── bookings
├── users
└── session
```

### Doctors

Stores doctor information such as:

* Name
* Specialty
* Image
* Experience
* Availability
* Description
* Hospital
* Location
* Consultation fee
* Rating
* Reviews

### Bookings

Stores appointment information for users and doctors.

### Users

Stores registered user information.

### Session

Stores authentication session information used by the authentication system.

---

## 🌐 CORS

The Express server enables CORS so that the Next.js frontend can communicate with the backend API.

For local development:

```text
Frontend → http://localhost:3000
Backend  → http://localhost:5000
```

For production, configure CORS according to your deployed frontend URL.

---

## 🧪 API Testing

You can test the backend APIs using tools such as:

* Postman
* Thunder Client
* Insomnia
* Browser for GET requests

Example:

```http
GET http://localhost:5000/appointments
```

---

## 🔗 Frontend Integration

The DocAppoint frontend is built with **Next.js** and communicates with this Express API.

Example API request:

```javascript
const response = await fetch(
  `${process.env.NEXT_PUBLIC_SERVER_URL}/booking/${user.id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const data = await response.json();
```

---

## 🚀 Deployment

The Express server can be deployed to platforms such as:

* Render
* Railway
* Vercel
* Other Node.js-compatible hosting services

After deployment, update the frontend environment variable:

```env
NEXT_PUBLIC_SERVER_URL=https://your-deployed-server-url.com
```

Also make sure the deployed server has the required environment variables configured.

---

## 🔒 Security

* Sensitive credentials are stored in environment variables.
* `.env` files should never be committed.
* Protected endpoints verify authentication tokens.
* User-specific resources are accessed using authenticated user information.
* MongoDB credentials are kept outside the source code.
