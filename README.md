 HEAD
URL Shortener

A full-stack URL shortener application with a Go (Gin) backend and a React (TypeScript, TailwindCSS) frontend.

## Project Structure

```
URL-shotener/
  backend/    # Go backend API (Gin)
  frontend/   # React frontend (TypeScript, TailwindCSS)
```

---

## Features

- Shorten long URLs to easy-to-share short links
- Simple, modern UI
- Copy short URLs to clipboard
- Instant redirect from short URL to original

---

## Backend (Go + Gin)

- **Location:** `backend/`
- **Main file:** `main.go`
- **Framework:** [Gin](https://github.com/gin-gonic/gin)
- **Endpoints:**
  - `POST /shortURL` — Accepts a long URL, returns a short URL
  - `GET /:shortURL` — Redirects to the original URL
- **CORS enabled** for local frontend-backend communication

### Setup & Run

1. Install [Go](https://golang.org/dl/)
2. Install dependencies:
   ```sh
   cd backend
   go mod tidy
   ```
3. Run the server:
   ```sh
   go run main.go
   ```
4. The backend runs on [http://localhost:8080](http://localhost:8080)

---

## Frontend (React + TypeScript + TailwindCSS)

- **Location:** `frontend/`
- **Main file:** `src/UrlShortener.tsx`
- **UI:** Modern, responsive, easy to use
- **API:** Connects to backend at `http://localhost:8080`

### Setup & Run

1. Install [Node.js](https://nodejs.org/)
2. Install dependencies:
   ```sh
   cd frontend
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. The frontend runs on [http://localhost:3000](http://localhost:3000)

---

## Usage

1. Start the backend (`go run main.go` in `backend/`)
2. Start the frontend (`npm start` in `frontend/`)
3. Open [http://localhost:3000](http://localhost:3000)
4. Enter a long URL, click **Shorten URL**
5. Copy and use the generated short link

---

## Example

- **Shorten:**
  - Input: `https://example.com/very/long/url`
  - Output: `http://localhost:8080/abc123...`
- **Redirect:**
  - Visit `http://localhost:8080/abc123...` → Redirects to original URL

---

## Dependencies

### Backend
- gin-gonic/gin
- gin-contrib/cors

### Frontend
- React
- TypeScript
- TailwindCSS
- lucide-react (icons)

---

## License

MIT 
=======
# QuickLink
 Full-stack URL shortener: Go backend API + React &amp; TailwindCSS frontend.
>>>>>>> d9f0fcb55788f36fad7f7b238d50b7c22e2b8f1d
