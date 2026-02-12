# 🚖 Uber Clone API Documentation

This documentation describes all available endpoints for the Uber Clone backend API, including Users and Captains authentication, profile management, and logout functionality.

---

# Base URL

```
http://localhost:4000
```

---

# Authentication

Protected routes require authentication using JWT token.

The token must be sent in one of the following ways:

### Option 1: Authorization Header

```
Authorization: Bearer <token>
```

### Option 2: Cookie

```
token=<jwt_token>
```

---

# User Endpoints

---

# 1. Register User

Creates a new user account.

### Endpoint

```
POST /users/register
```

### Request Body

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

### Validation Rules

| Field              | Required | Rules            |
| ------------------ | -------- | ---------------- |
| fullname.firstname | Yes      | Min 3 characters |
| fullname.lastname  | No       | Min 3 characters |
| email              | Yes      | Valid and unique |
| password           | Yes      | Min 6 characters |

---

### Success Response

Status: `201 Created`

```json
{
  "user": {
    "_id": "USER_ID",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  },
  "token": "JWT_TOKEN"
}
```

---

### Error Response

Status: `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters",
      "param": "fullname.firstname"
    }
  ]
}
```

---

# 2. Login User

Authenticates user and returns JWT token.

### Endpoint

```
POST /users/login
```

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Success Response

Status: `200 OK`

```json
{
  "user": {
    "_id": "USER_ID",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  },
  "token": "JWT_TOKEN"
}
```

---

### Error Response

Status: `401 Unauthorized`

```json
{
  "message": "Invalid email or password"
}
```

---

# 3. Get User Profile

Returns authenticated user profile.

### Endpoint

```
GET /users/profile
```

### Headers

```
Authorization: Bearer JWT_TOKEN
```

---

### Success Response

Status: `200 OK`

```json
{
  "_id": "USER_ID",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com"
}
```

---

### Error Response

Status: `401 Unauthorized`

```json
{
  "message": "Unauthorized"
}
```

---

# 4. Logout User

Logs out user and blacklists token.

### Endpoint

```
GET /users/logout
```

### Headers

```
Authorization: Bearer JWT_TOKEN
```

---

### Success Response

Status: `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

---

# Captain Endpoints

---

# 5. Register Captain

Creates a new captain account.

### Endpoint

```
POST /captains/register
```

---

### Request Body

```json
{
  "fullname": {
    "firstname": "Raj",
    "lastname": "Kumar"
  },
  "email": "raj@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Black",
    "plate": "DL01AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

---

### Validation Rules

| Field               | Required | Rules              |
| ------------------- | -------- | ------------------ |
| fullname.firstname  | Yes      | Min 3 characters   |
| email               | Yes      | Unique             |
| password            | Yes      | Min 6 characters   |
| vehicle.color       | Yes      | Min 3 characters   |
| vehicle.plate       | Yes      | Min 3 characters   |
| vehicle.capacity    | Yes      | Min 1              |
| vehicle.vehicleType | Yes      | car, bike, scooter |

---

### Success Response

Status: `201 Created`

```json
{
  "captain": {
    "_id": "CAPTAIN_ID",
    "fullname": {
      "firstname": "Raj",
      "lastname": "Kumar"
    },
    "email": "raj@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "token": "JWT_TOKEN"
}
```

---

# 6. Login Captain

Authenticates captain.

### Endpoint

```
POST /captains/login
```

---

### Request Body

```json
{
  "email": "raj@example.com",
  "password": "password123"
}
```

---

### Success Response

```json
{
  "captain": {
    "_id": "CAPTAIN_ID",
    "email": "raj@example.com"
  },
  "token": "JWT_TOKEN"
}
```

---

# 7. Captain Profile

Returns authenticated captain profile.

### Endpoint

```
GET /captains/profile
```

---

### Headers

```
Authorization: Bearer JWT_TOKEN
```

---

### Success Response

```json
{
  "captain": {
    "_id": "CAPTAIN_ID",
    "fullname": {
      "firstname": "Raj"
    },
    "email": "raj@example.com"
  }
}
```

---

# 8. Logout Captain

Logs out captain.

### Endpoint

```
GET /captains/logout
```

---

### Headers

```
Authorization: Bearer JWT_TOKEN
```

---

### Success Response

```json
{
  "message": "Logged out successfully"
}
```

---

# Authentication Flow

```
Register → Receive Token
Login → Receive Token
Send Token → Access Protected Routes
Logout → Token Blacklisted
```

---

# Token Expiry

| Role    | Expiry   |
| ------- | -------- |
| User    | 24 hours |
| Captain | 24 hours |

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* bcrypt
* cookie-parser

---

# Author

Uber Clone Backend API
