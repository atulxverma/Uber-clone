# Uber Clone API Documentation

## Endpoints

### User Registration

#### Description
Registers a new user in the system. This endpoint creates a new user account and returns an authentication token upon successful registration.

#### HTTP Method
```
POST /users/register
```

#### Request Body
The request body should be a JSON object with the following properties:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `fullname.firstname` | String | Yes | Min length: 3 characters | User's first name |
| `fullname.lastname` | String | No | Min length: 3 characters | User's last name |
| `email` | String | Yes | Valid email format | User's email address (must be unique) |
| `password` | String | Yes | Min length: 6 characters | User's password |

#### Example Request
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Success Response

**Status Code:** `201 Created`

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**Status Code:** `400 Bad Request`

Returned when validation fails. Possible validation errors include:

```json
{
  "errors": [
    {
      "msg": "First name at least 3 characters long",
      "param": "fullname.firstname"
    },
    {
      "msg": "Invalid email address",
      "param": "email"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password"
    }
  ]
}
```

#### Examle Response

- `user` (object):
 - `fullname` (object).
   - `firstname` (string): User's first name (minimum 3 characters).
   - `lastname` (string): User's last name (minimum 3 characters).
 - `email` (string): User's email address (must be a valid email).
 - `password` (string): User's password (minimum 6 characters).
- `token` (String): JWT Token


#### Validation Rules
- **First name**: Minimum 3 characters
- **Last name**: Minimum 3 characters (optional)
- **Email**: Must be in valid email format and unique in the database
- **Password**: Minimum 6 characters

#### Notes
- The password is hashed using bcrypt before being stored in the database
- The response includes a JWT token that expires in 1 hour
- The token should be stored on the client and sent with subsequent requests for authentication

---

### User Login

#### Description
Authenticates a user with their email and password. This endpoint verifies the user's credentials and returns an authentication token upon successful login.

#### HTTP Method
```
POST /users/login
```

#### Request Body
The request body should be a JSON object with the following properties:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `email` | String | Yes | Valid email format | User's registered email address |
| `password` | String | Yes | Min length: 6 characters | User's password |

#### Example Request
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Success Response

**Status Code:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  }
}
```

#### Error Responses

**Status Code:** `400 Bad Request`

Returned when validation fails. Possible validation errors include:

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password"
    }
  ]
}
```

**Status Code:** `401 Unauthorized`

Returned when authentication fails due to invalid credentials:

```json
{
  "message": "Invalid email or password"
}
```

### Example Response

- `user` (object):
 - `fullname` (object).
   - `firstname` (string): User's first name (minimum 3 characters).
   - `lastname` (string): User's last name (minimum 3 characters).
 - `email` (string): User's email address (must be a valid email).
 - `password` (string): User's password (minimum 6 characters).
- `token` (String): JWT Token


#### Validation Rules
- **Email**: Must be in valid email format
- **Password**: Minimum 6 characters

#### Notes
- The password is compared using bcrypt to verify it matches the stored hashed password
- The response includes a JWT token that expires in 1 hour
- The token should be stored on the client and sent with subsequent requests for authentication
- Returns 401 Unauthorized if the email does not exist in the database or if the password is incorrect

---

### User Profile

#### Description
Retrieves the profile information of the authenticated user. This endpoint requires a valid authentication token.

#### HTTP Method
```
GET /users/profile
```

#### Authentication
Required. The authentication token must be provided either:
- In the `token` cookie
- In the `Authorization` header as `Bearer <token>`

#### Request Body
No request body required.

#### Example Request
```
GET /users/profile
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Success Response

**Status Code:** `200 OK`

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "socketId": null
}
```

#### Error Responses

**Status Code:** `401 Unauthorized`

Returned when authentication fails due to missing or invalid token:

```json
{
  "message": "Unauthorized"
}
```

#### Response Fields

- `_id` (string): Unique user identifier (MongoDB ObjectId)
- `fullname` (object):
  - `firstname` (string): User's first name
  - `lastname` (string): User's last name
- `email` (string): User's email address
- `socketId` (string/null): Socket ID for real-time communication (null if not connected)

#### Notes
- Token must be valid and not blacklisted
- Returns the complete user object without the password field
- Socket ID is used for real-time features like live ride tracking

---

### User Logout

#### Description
Logs out the authenticated user by invalidating their authentication token. This endpoint clears the token cookie and adds the token to a blacklist to prevent further use.

#### HTTP Method
```
GET /users/logout
```

#### Authentication
Required. The authentication token must be provided either:
- In the `token` cookie
- In the `Authorization` header as `Bearer <token>`

#### Request Body
No request body required.

#### Example Request
```
GET /users/logout
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

### Examle Response

- `user` (object):
 - `fullname` (object).
   - `firstname` (string): User's first name (minimum 3 characters).
   - `lastname` (string): User's last name (minimum 3 characters).
 - `email` (string): User's email address (must be a valid email).

#### Error Responses

**Status Code:** `401 Unauthorized`

Returned when authentication fails due to missing or invalid token:

```json
{
  "message": "Unauthorized"
}
```

#### Notes
- Token cookie is cleared from the client
- Token is added to the blacklist in the database to prevent reuse
- After logout, the token becomes invalid for future requests
- Client should remove the stored token from their side as well
- Subsequent requests with the blacklisted token will fail authentication

---

## Captain Endpoints

### Captain Registration

#### Description
Registers a new captain in the system. This endpoint creates a new captain account with vehicle information and returns an authentication token upon successful registration.

#### HTTP Method
```
POST /captains/register
```

#### Request Body
The request body should be a JSON object with the following properties:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `fullname.firstname` | String | Yes | Min length: 3 characters | Captain's first name |
| `fullname.lastname` | String | No | Min length: 3 characters | Captain's last name |
| `email` | String | Yes | Valid email format, unique | Captain's email address (must be unique) |
| `password` | String | Yes | Min length: 6 characters | Captain's password |
| `vehicle.color` | String | Yes | Min length: 3 characters | Vehicle color |
| `vehicle.plate` | String | Yes | Min length: 3 characters | Vehicle license plate |
| `vehicle.capacity` | Number | Yes | Min value: 1 | Number of passengers vehicle can hold |
| `vehicle.vehicleType` | String | Yes | One of: 'car', 'bike', 'scooter' | Type of vehicle |

#### Example Request
```json
{
  "fullname": {
    "firstname": "Rajesh",
    "lastname": "Kumar"
  },
  "email": "rajesh.kumar@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Black",
    "plate": "DL01AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Success Response

**Status Code:** `201 Created`

```json
{
  "captain": {
    "_id": "507f1f77bcf86cd799439012",
    "fullname": {
      "firstname": "Rajesh",
      "lastname": "Kumar"
    },
    "email": "rajesh.kumar@example.com",
    "vehicle": {
      "color": "Black",
      "plate": "DL01AB1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "status": "inactive",
    "socketId": null,
    "location": {
      "lat": null,
      "long": null
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses

**Status Code:** `400 Bad Request`

Returned when validation fails. Possible validation errors include:

```json
{
  "errors": [
    {
      "msg": "First name at least 3 characters long",
      "param": "fullname.firstname"
    },
    {
      "msg": "Invalid email address",
      "param": "email"
    },
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password"
    },
    {
      "msg": "Vehicle color must be at least 3 characters long",
      "param": "vehicle.color"
    },
    {
      "msg": "Vehicle plate must be at least 3 characters long",
      "param": "vehicle.plate"
    },
    {
      "msg": "Vehicle type must be either car, bike, or scooter",
      "param": "vehicle.vehicleType"
    }
  ]
}
```

**Status Code:** `400 Bad Request`

Returned when a captain with the provided email already exists:

```json
{
  "message": "Captain with this email already exists"
}
```

#### Response Fields

- `captain` (object):
  - `_id` (string): Unique captain identifier (MongoDB ObjectId)
  - `fullname` (object):
    - `firstname` (string): Captain's first name
    - `lastname` (string): Captain's last name (optional)
  - `email` (string): Captain's email address
  - `vehicle` (object):
    - `color` (string): Vehicle color
    - `plate` (string): Vehicle license plate
    - `capacity` (number): Maximum passenger capacity
    - `vehicleType` (string): Type of vehicle (car, bike, or scooter)
  - `status` (string): Captain's current status (active/inactive) - defaults to "inactive"
  - `socketId` (string/null): Socket ID for real-time communication (null if not connected)
  - `location` (object):
    - `lat` (number/null): Captain's latitude coordinate
    - `long` (number/null): Captain's longitude coordinate
- `token` (string): JWT Token

#### Validation Rules
- **First name**: Minimum 3 characters
- **Last name**: Minimum 3 characters (optional)
- **Email**: Must be in valid email format and unique in the database
- **Password**: Minimum 6 characters
- **Vehicle color**: Minimum 3 characters
- **Vehicle plate**: Minimum 3 characters
- **Vehicle capacity**: Minimum 1 passenger
- **Vehicle type**: Must be one of 'car', 'bike', or 'scooter'

#### Notes
- The password is hashed using bcrypt before being stored in the database
- The response includes a JWT token that expires in 24 hours
- The token should be stored on the client and sent with subsequent requests for authentication
- The captain account is created with "inactive" status by default
- Location coordinates are initially null and can be updated as the captain goes online
- Email addresses must be unique; attempting to register with an existing email will return a 400 error
