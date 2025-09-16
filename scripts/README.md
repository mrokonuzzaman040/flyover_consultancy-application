# Database Seeding Scripts

This directory contains scripts to seed the database with initial data.

## Available Scripts

### Seed Sections Data

```bash
npm run seed-sections
```

This script seeds the database with data from `/data/sections-data.json` including:

- **Services** - Educational services offered
- **Stats** - Company statistics and achievements
- **Destinations** - Study abroad destinations
- **Study Abroad Steps** - Process steps for studying abroad
- **Why Choose Us Features** - Company advantages
- **Awards** - Company awards and recognitions
- **Events** - Upcoming events and webinars
- **Partners** - University and institutional partners
- **Success Stories** - Student testimonials and achievements
- **Insights** - Blog posts and educational content
- **Slides** - Homepage carousel slides

## Environment Setup

Make sure you have the following environment variables set:

```env
MONGODB_URI=mongodb://localhost:27017/flyover
```

Or create a `.env.local` file in the project root with your MongoDB connection string.

## Usage

1. Ensure MongoDB is running
2. Set up your environment variables
3. Run the seeding script:

```bash
npm run seed-sections
```

The script will:
- Connect to MongoDB
- Clear existing data in each collection
- Insert new data from the JSON file
- Display progress and completion status

## Data Structure

The script automatically:
- Generates slugs for SEO-friendly URLs
- Creates relationships between models
- Adds timestamps and metadata
- Handles data transformation and validation

## Notes

- The script will **delete existing data** before seeding
- Make sure to backup your database before running in production
- The script uses ES6 modules and requires Node.js 14+