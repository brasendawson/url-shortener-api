# URL Shortener API

A simple URL shortening service built with Node.js, Express, and MySQL.

## Features
- Shorten long URLs
- Custom URL slugs
- QR code generation
- Click tracking
- User-specific URL management
- JWT authentication
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
npm install qrcode
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

### Create Short URL with a QR Code and Optional Custom Slug
```http
POST /api/url/shorten
Content-Type: application/json

{
    "origUrl": "https://example.com",
    "customSlug": "my-custom-url",  // Optional
}
```

Response:
```json
{
    "clicks": 0,
    "id": 1,
    "urlId": "abc123",
    "origUrl": "https://example.com",
    "shortUrl": "http://localhost:3333/abc123",
    "customSlug": "your-custom-slug",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "username": "your_username",
    "created_at": "2025-03-23T08:01:15.565Z"
}
```

### Response Field Descriptions
| Field | Type | Description |
|-------|------|-------------|
| clicks | number | Number of times URL has been accessed |
| id | number | Internal database ID |
| urlId | string | Unique identifier for short URL |
| origUrl | string | Original long URL |
| shortUrl | string | Generated short URL |
| customSlug | string | Custom URL slug (if provided) |
| qrCode | string | Base64 encoded QR code image |
| username | string | Owner of the shortened URL |
| created_at | string | Timestamp of creation |

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
## Get User's URLs
```http
GET /api/url/my-urls
Authorization: Bearer your_jwt_token
```
Response: It lists all the URLs Shortened by a User

## Api Authentication Reference

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



## Health Check
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

### Authentication Errors (400-403)
| Code | Message | Description |
|------|---------|-------------|
| 400 | "Invalid credentials" | Wrong username or password |
| 401 | "Please authenticate" | No token or invalid token provided |
| 401 | "Token has been invalidated" | Token is blacklisted (after logout) |
| 403 | "Access denied" | Valid token but insufficient permissions |

### URL Related Errors (400-404)
| Code | Message | Description |
|------|---------|-------------|
| 400 | "Invalid URL" | URL format is not valid |
| 400 | "Custom slug already taken" | Requested custom slug is in use |
| 404 | "URL not found" | Short URL does not exist |
| 404 | "Not found" | Resource not found |

### Server Errors (500)
| Code | Message | Description |
|------|---------|-------------|
| 500 | "Server Error" | Generic server error |
| 503 | "Service Unavailable" | Database connection failed |

### Success Responses (200-302)
| Code | Message | Description |
|------|---------|-------------|
| 200 | "OK" | Request succeeded |
| 201 | "Created" | Resource created successfully |
| 302 | "Found" | URL redirect |

### Example Error Response
```json
{
    "message": "Invalid URL",
    "status": 400
}
```

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