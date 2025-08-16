# Resume Generator Backend

A Node.js/Express backend with TypeScript for the Resume Generator application.

## Features

- Express.js server with TypeScript
- Prisma ORM with PostgreSQL
- Google Generative AI integration
- File upload handling with Multer
- PDF parsing capabilities
- CORS enabled
- Environment configuration

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Google AI API key

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp env.example .env
```

3. Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/resume_gen_db"
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── config/
│   ├── database.ts    # Database configuration
│   └── ai.ts          # AI configuration
├── middleware/
│   ├── errorHandler.ts # Error handling middleware
│   └── upload.ts      # File upload middleware
└── index.ts           # Main server file
```

## API Endpoints

- `GET /health` - Health check
- `GET /api` - Basic API info

## Development

The server runs on port 5000 by default. You can change this in the `.env` file.

## License

MIT
