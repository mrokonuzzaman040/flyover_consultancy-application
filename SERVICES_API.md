# Services API Documentation

This document describes the Services API endpoints for both admin (CRUD operations) and public (read-only) access.

## Model Structure

The Service model includes the following fields:

```typescript
interface IService {
  name: string;           // Service name
  slug: string;           // URL-friendly identifier (unique)
  title: string;          // Display title
  subtitle: string;       // Short description
  description: string;    // Detailed description
  image: string;          // Image URL/path
  sectionsMD: string[];   // Markdown content sections
  features: IFeature[];   // Service features
  benefits: string[];     // List of benefits
  process: IProcessStep[]; // Process steps
  ctaLabel: string;       // Call-to-action button text
  ctaText: string;        // Call-to-action description
  popular?: boolean;      // Whether service is marked as popular
  createdAt: Date;
  updatedAt: Date;
}

interface IFeature {
  icon: string;           // Icon identifier
  title: string;          // Feature title
  description: string;    // Feature description
}

interface IProcessStep {
  step: string;           // Step number/identifier
  title: string;          // Step title
  description: string;    // Step description
}
```

## Admin API Endpoints (CRUD Operations)

### 1. Get All Services
```
GET /api/admin/services
```

**Response:**
```json
{
  "services": [
    {
      "_id": "...",
      "name": "Study Abroad Consultation",
      "slug": "study-abroad-consultation",
      "title": "Expert Study Abroad Consultation",
      "subtitle": "Get personalized guidance from our experienced counselors",
      "description": "Our comprehensive study abroad consultation service...",
      "image": "/hero/slide1.svg",
      "sectionsMD": ["## Why Choose Our Consultation Service?\n\n..."],
      "features": [
        {
          "icon": "user-check",
          "title": "Personalized Guidance",
          "description": "One-on-one consultation tailored to your specific needs"
        }
      ],
      "benefits": ["Free initial consultation session", "..."],
      "process": [
        {
          "step": "1",
          "title": "Initial Consultation",
          "description": "We start with a comprehensive assessment..."
        }
      ],
      "ctaLabel": "Book Free Consultation",
      "ctaText": "Ready to Start Your Study Abroad Journey?",
      "popular": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### 2. Create New Service
```
POST /api/admin/services
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Service",
  "slug": "new-service",
  "title": "New Service Title",
  "subtitle": "Service subtitle",
  "description": "Detailed service description",
  "image": "/path/to/image.jpg",
  "sectionsMD": ["## Section 1\n\nContent here"],
  "features": [
    {
      "icon": "icon-name",
      "title": "Feature Title",
      "description": "Feature description"
    }
  ],
  "benefits": ["Benefit 1", "Benefit 2"],
  "process": [
    {
      "step": "1",
      "title": "Step Title",
      "description": "Step description"
    }
  ],
  "ctaLabel": "Get Started",
  "ctaText": "Ready to begin?",
  "popular": false
}
```

**Response:**
```json
{
  "service": {
    "_id": "...",
    // ... created service data
  }
}
```

### 3. Get Single Service by ID
```
GET /api/admin/services/{id}
```

**Response:**
```json
{
  "service": {
    "_id": "...",
    // ... service data
  }
}
```

### 4. Update Service
```
PATCH /api/admin/services/{id}
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "name": "Updated Service Name",
  "title": "Updated Title",
  "popular": true
  // ... any other fields to update
}
```

**Response:**
```json
{
  "service": {
    "_id": "...",
    // ... updated service data
  }
}
```

### 5. Delete Service
```
DELETE /api/admin/services/{id}
```

**Response:**
```json
{
  "ok": true
}
```

## Public API Endpoints (Read-Only)

### 1. Get All Services (Public)
```
GET /api/services
```

**Query Parameters:**
- `popular=true` - Filter only popular services
- `limit=10` - Limit number of results
- `search=keyword` - Search in name, title, and description

**Examples:**
```
GET /api/services
GET /api/services?popular=true
GET /api/services?limit=5
GET /api/services?search=consultation
GET /api/services?popular=true&limit=3
```

**Response:**
```json
{
  "services": [
    {
      "_id": "...",
      // ... service data (same structure as admin API)
    }
  ],
  "count": 5
}
```

### 2. Get Single Service by Slug (Public)
```
GET /api/services/{slug}
```

**Example:**
```
GET /api/services/study-abroad-consultation
```

**Response:**
```json
{
  "service": {
    "_id": "...",
    "name": "Study Abroad Consultation",
    "slug": "study-abroad-consultation",
    // ... complete service data
  }
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created (POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate slug)
- `500` - Internal Server Error

## Database Seeding

To populate the database with test data:

```bash
npm run seed-services
```

This will:
1. Clear existing services
2. Insert test data from `/data/services-test-data.json`
3. Display the seeded services

## Validation Rules

- `name`: Required, minimum 1 character
- `slug`: Required, unique, lowercase, URL-friendly format
- `title`: Required, minimum 1 character, max 200 characters
- `subtitle`: Required, minimum 1 character, max 300 characters
- `description`: Required, minimum 1 character, max 1000 characters
- `image`: Required, minimum 1 character
- `sectionsMD`: Required array, minimum 1 item
- `features`: Required array, minimum 1 item, maximum 10 items
- `benefits`: Required array, minimum 1 item
- `process`: Required array, minimum 1 item
- `ctaLabel`: Required, minimum 1 character, max 50 characters
- `ctaText`: Required, minimum 1 character, max 100 characters
- `popular`: Optional boolean, defaults to false

## Indexes

The following database indexes are created for optimal performance:
- `slug` (unique)
- `popular` (descending)
- Text search on `name`, `title`, `description`
- `createdAt` (descending)