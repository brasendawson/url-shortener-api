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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### URL Operations
- `POST /api/url/shorten` - Create short URL
- `GET /api/url/my-urls` - List user's URLs
- `GET /api/url/stats/:urlId` - Get URL statistics
- `GET /api/url/:urlId` - Returns Original url to be redirected

### Health Check
- `GET /api/health` - API health status

### Create Short URL with a QR Code and Optional Custom Slug
```http
POST /api/url/shorten
Content-Type: application/json

{
    "origUrl": "https://example.com",
    "customSlug": "my-custom-url"
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
Response: Lists all the URLs Shortened by a User
```json
[
    {
        "urlId": "abc123",
        "origUrl": "https://example.com/page1",
        "shortUrl": "http://localhost:3333/abc123",
        "clicks": 5,
        "created_at": "2025-03-23T07:50:27.000Z"
    },
    {
        "urlId": "def456",
        "origUrl": "https://example.com/page2",
        "shortUrl": "http://localhost:3333/def456",
        "clicks": 0,
        "created_at": "2025-03-23T08:01:15.000Z"
    }
]
```

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
#### Protected Routes
- `POST /api/url/shorten` - Create short URL
- `GET /api/url/my-urls` - Get user's URLs
- `GET /api/url/stats/:urlId` - Get URL statistics


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

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### URLs Table
```sql
CREATE TABLE urls (
    id INT PRIMARY KEY AUTO_INCREMENT,
    urlId VARCHAR(255) NOT NULL UNIQUE,
    origUrl TEXT NOT NULL,
    shortUrl VARCHAR(255) NOT NULL,
    customSlug VARCHAR(255) UNIQUE,
    qrCode LONGTEXT,
    clicks INT DEFAULT 0,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username)
);
```

### Table Relationships
- One-to-Many: A user can have multiple shortened URLs
- Foreign Key: `urls.username` references `users.username`
- Both tables include creation timestamps
- All URLs must be associated with a user

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

## API Documentation
Swagger documentation available at: http://localhost:3333/api-docs

## API Documentation

The API documentation is available at: `http://localhost:3333/api-docs`

To view the documentation:
1. Start the server: `npm run dev`
2. Open your browser
3. Navigate to `http://localhost:3333/api-docs`

The documentation includes:
- All available endpoints
- Request/response formats
- Authentication requirements
- Example requests
- Response codes

## Security Features
- Rate limiting: 100 requests per 15 minutes
- Password requirements: Min 8 chars, uppercase, lowercase, number, special char
- CORS protection
- Input validation
- JWT token blacklisting
- Request validation

## Logging
- Error logs: ./error.log
- Combined logs: ./combined.log
- Console logging in development

## Backup Strategy
1. Database backups run daily
2. Logs rotated weekly
3. Backup retention: 30 days

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes window per IP
- Applies to all API endpoints
- Returns 429 status code when limit is exceeded

Example rate limit error response:
```json
{
    "status": "error",
    "message": "Too many requests. Try again in 15 minutes",
    "retryAfter": 900
}
```

### Rate Limit Headers
The API also includes standard rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1616501234
Retry-After: 900
```

### Understanding Rate Limit Values
- `retryAfter`: Seconds until the rate limit window resets
- `X-RateLimit-Limit`: Maximum requests allowed in the window
- `X-RateLimit-Remaining`: Number of requests remaining
- `X-RateLimit-Reset`: Unix timestamp when the limit resets

## Logging

The application uses Winston for logging. Logs are stored in the `logs` directory:
- `error.log`: Contains error-level logs
- `combined.log`: Contains all logs (info, warn, error)

### Log Types
1. **Error Logs**
   - Rate limit violations
   - Authentication failures
   - Database errors
   - API errors

2. **Info Logs**
   - URL creations
   - Successful authentications
   - Database connections

### Log Format
```json
{
  "timestamp": "2025-03-23T11:10:20.183Z",
  "level": "error",
  "message": "Rate limit exceeded",
  "ip": "::1",
  "endpoint": "/api/health",
  "event": "rate_limit_exceeded",
  "remainingTime": 15
}
```

### Viewing Logs
```powershell
# View error logs
Get-Content -Path ".\logs\error.log" -Wait

# View all logs
Get-Content -Path ".\logs\combined.log" -Wait
```

## Error Handling

The API returns standardized error responses:

```json
{
    "status": "error",
    "message": "Error description",
    "code": "ERROR_CODE"
}
```

Common HTTP Status Codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 429: Too Many Requests
- 500: Internal Server Error

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