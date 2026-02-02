# Contact Management System

A full-fledged CRUD backend for managing contacts using Node.js, Express, and TypeScript with clean OOP architecture.

## Features

- **CRUD Operations**: Create, Read, Update, Delete contacts
- **Search & Filter**: Search by name/email/phone, filter by tags and favorites
- **Pagination**: Paginated results with customizable page size
- **Sorting**: Sort by name or creation date
- **Validation**: Comprehensive input validation with meaningful error messages
- **Simple UI**: Basic HTML interface for testing

## Tech Stack

- Node.js
- Express.js
- TypeScript
- In-memory storage (easily replaceable with MongoDB/Mongoose)

## Project Structure

```
src/
├── controllers/     # HTTP request handlers
│   └── contact.controller.ts
├── services/        # Business logic layer
│   └── contact.service.ts
├── repositories/    # Data access layer
│   └── contact.repository.ts
├── models/          # Data models
│   └── contact.model.ts
├── routes/          # API routes
│   └── contact.routes.ts
├── middlewares/     # Express middlewares
│   └── error.middleware.ts
├── utils/           # Utility classes
│   ├── ApiError.ts
│   └── ApiResponse.ts
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   PORT=3000
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

For development:
```bash
npm run dev
```

## API Endpoints

### Contacts
- `POST /api/contacts` - Create a new contact
- `GET /api/contacts` - Get all contacts (with search, filter, sort, pagination)
- `GET /api/contacts/:id` - Get a specific contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact

## Query Parameters for GET /api/contacts

- `search`: Search in name, email, or phone
- `tag`: Filter by tag
- `isFavorite`: Filter by favorite status (true/false)
- `sortBy`: Sort by field (name, createdAt)
- `sortOrder`: Sort order (asc, desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

## Example Requests

### Create Contact
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "tags": ["work", "friend"],
    "isFavorite": false
  }'
```

### Create Contact (without email)
```bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "phone": "0987654321",
    "tags": ["personal"],
    "isFavorite": true
  }'
```

### Get Contacts with Search
```bash
curl "http://localhost:3000/api/contacts?search=john&page=1&limit=5"
```

## Contact Model

```typescript
{
  id: string;
  name: string;          // Required
  email?: string;        // Optional, unique if provided
  phone: string;         // Required
  tags: string[];        // Array of strings
  isFavorite: boolean;   // Default: false
  createdAt: Date;
  updatedAt: Date;
}
```

## Running the UI

Open `http://localhost:3000` in your browser to access the simple HTML interface.

## Architecture Principles

- **Controller Layer**: Handles HTTP requests/responses, delegates to services
- **Service Layer**: Contains business logic, validation, orchestrates repository calls
- **Repository Layer**: Manages data access, no business logic
- **Clean Separation**: Each layer has a single responsibility
- **Error Handling**: Centralized error handling with custom ApiError class