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