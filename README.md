# URL Shortener API

A simple URL shortening service built with Node.js, Express, and MySQL.

## Features
- Shorten long URLs
- Track click metrics
- RESTful API endpoints
- MySQL database persistence
- Health monitoring

## Tech Stack
- Node.js (v18+)
- Express.js
- MySQL (v8.0+)
- Sequelize ORM
- nanoid

## Installation

1. Clone the repository:
```bash
git clone https://github.com/brasendawson/urlshortener.git
cd urlshortener
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `config` directory:
```env
PORT=3333
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=urlshortener
DB_PORT=3306
BASE=http://localhost:3333
```

4. Initialize database:
```sql
CREATE DATABASE urlshortener;
```

## API Reference

### Create Short URL
```http
POST /api/url/shorten
Content-Type: application/json

{
    "origUrl": "https://example.com"
}
```

Response:
```json
{
    "urlId": "abc123",
    "origUrl": "https://example.com",
    "shortUrl": "http://localhost:3333/abc123",
    "clicks": 0,
    "created_at": "2024-03-22T..."
}
```

### Create Short URL with Custom Slug
```http
POST /api/url/shorten
Content-Type: application/json

{
    "origUrl": "https://example.com",
    "customSlug": "my-custom-url"  // Optional
}
```

### Access Short URL
```http
GET /:urlId
```
Response: `302 Found` - Redirects to original URL

### Get URL Statistics
```http
GET /api/url/stats/:urlId
```
Response:
```json
{
    "urlId": "abc123",
    "clicks": 42,
    "created_at": "2024-03-22T...",
    "qrCode": "data:image/png;base64,..."
}
```

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "secretpass123"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "secretpass123"
}
```

### Get User's URLs
```http
GET /api/url/my-urls
Authorization: Bearer your_jwt_token
```

### Health Check
```http
GET /api/health
```
Response:
```json
{
    "status": "UP",
    "timestamp": "2024-03-22T...",
    "service": "URL Shortener API",
    "database": "Connected",
    "uptime": 123.45
}
```

## Authentication

### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "message": "User created successfully"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "testuser",
    "password": "password123"
}
```

Response:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

### Using Authentication

All protected routes require a JWT token in the Authorization header:

```http
Authorization: Bearer your_jwt_token
```

#### Protected Routes
- `POST /api/url/shorten` - Create short URL
- `GET /api/url/my-urls` - Get user's URLs
- `GET /api/url/stats/:urlId` - Get URL statistics

### Testing with Postman

1. Register a new user using the `/api/auth/register` endpoint
2. Login with the user credentials at `/api/auth/login`
3. Copy the received token
4. For protected routes:
   - Go to the "Headers" tab
   - Add header: `Authorization: Bearer your_jwt_token`
   - Replace `your_jwt_token` with the actual token

### Error Responses

Authentication errors return 401 status code:
```json
{
    "message": "Please authenticate"
}
```

## Usage Examples

Using cURL:
```bash
# Create short URL
curl -X POST http://localhost:3333/api/url/shorten \
-H "Content-Type: application/json" \
-d "{\"origUrl\":\"https://example.com\"}"

# Access shortened URL
curl -L http://localhost:3333/abc123

# Check health
curl http://localhost:3333/api/health
```

Using Postman:
1. Create Short URL:
   - Method: POST
   - URL: http://localhost:3333/api/url/shorten
   - Body: Raw JSON
   - Content: {"origUrl": "https://example.com"}

2. Access URL:
   - Method: GET
   - URL: http://localhost:3333/abc123
   - Disable "Automatically follow redirects" to see 302 status

## Project Structure
```
urlshortener/
├── config/
│   ├── .env
│   └── db.js
├── models/
│   └── Urls.js
├── routes/
│   ├── index.js
│   └── urls.js
├── utils/
│   └── utils.js
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Development Commands
```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

## Database Schema

### URLs Table
```sql
CREATE TABLE urls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    urlId VARCHAR(255) NOT NULL,
    origUrl TEXT NOT NULL,
    shortUrl VARCHAR(255) NOT NULL,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

| Variable    | Description         | Default   |
|-------------|-------------------|-----------|
| PORT        | Server port       | 3333      |
| DB_HOST     | Database host     | localhost |
| DB_USER     | Database user     | root      |
| DB_PASSWORD | Database password | -         |
| DB_NAME     | Database name     | urlshortener |
| DB_PORT     | Database port     | 3306      |
| BASE        | Base URL         | http://localhost:3333 |

## Error Codes

| Status | Description |
|--------|------------|
| 200    | Success    |
| 302    | URL Redirect |
| 400    | Bad Request |
| 404    | URL Not Found |
| 500    | Server Error |

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
ISC License

## Author
Brasen Ethan Kwame Dawson