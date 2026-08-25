# SWATEK Platform — API Reference

Base URL: `http://localhost:3000/api`

All protected routes require: `Authorization: Bearer <token>`

---

## Auth

### POST /auth/login
Login and get a JWT token.

**Body:**
```json
{ "email": "admin@swatek.tech", "password": "Admin@123" }
```

**Response:**
```json
{ "token": "...", "user": { "id": "...", "name": "...", "email": "...", "role": "admin" } }
```

### GET /auth/me
Returns the currently authenticated user.

---

## Technologies

### GET /technologies
Query params: `domain` (slug), `tag`, `featured` (true), `q` (search)

### POST /technologies
Requires: editor+

**Body:** Full technology object (see Zod schema in `lib/validation/technology.ts`)

### GET /technologies/:id
`:id` can be the record `id` or the `slug`.

### PATCH /technologies/:id
Requires: editor+. Accepts partial technology object.

### DELETE /technologies/:id
Requires: admin.

---

## Domains

### GET /domains
Returns all technology domains with technology count.

---

## Solutions

### GET /solutions
### POST /solutions — editor+
**Body:** solution fields + optional `technologyIds: string[]`

### GET /solutions/:id
### DELETE /solutions/:id — admin

---

## Case Studies

### GET /case-studies
Query params: `sector`, `geography`, `tag`

### POST /case-studies — editor+
### GET /case-studies/:id
### PATCH /case-studies/:id — editor+
### DELETE /case-studies/:id — admin

---

## Knowledge Library

### GET /knowledge
Query params: `category` (whitepaper|case_study|technical_spec|brochure|report), `language` (en|fr|ar), `tag`, `q`

### POST /knowledge — editor+
### GET /knowledge/:id
### PATCH /knowledge/:id — editor+
### DELETE /knowledge/:id — admin

---

## Partners

### GET /partners
Query params: `type` (technology|academic|financial|government|industry), `featured` (true)

### POST /partners — editor+
### GET /partners/:id
### PATCH /partners/:id — editor+
### DELETE /partners/:id — admin

---

## Impact Metrics

### GET /metrics
Returns global (entity-unrelated) impact metrics used on the homepage.

---

## Inquiries (Lead Management)

### POST /inquiries
**Public** — submits a contact form inquiry.

**Body:**
```json
{
  "fullName": "Jane Doe",
  "organization": "Acme Corp",
  "email": "jane@acme.com",
  "phone": "+1 555 0100",
  "inquiryType": "investment",
  "message": "We're interested in co-investing in green hydrogen."
}
```

`inquiryType` values: `technology_partnership | project_development | investment | government_relation | technical_consulting | other`

### GET /inquiries — auth
Query params: `status`, `type`, `assignedTo`, `page`, `limit`

### GET /inquiries/:id — auth
Full detail including notes.

### PATCH /inquiries/:id — editor+
**Body:** `{ "status": "in_review", "assignedToId": "..." }`

`status` values: `new | in_review | assigned | in_progress | closed`

### DELETE /inquiries/:id — admin

### POST /inquiries/:id/notes — auth
Add an internal note.

**Body:** `{ "content": "Spoke with client, scheduling demo." }`

---

## Admin

### GET /admin/analytics — auth
Returns dashboard stats: totals, inquiries by status/type, recent inquiries.

### GET /admin/users — admin
### POST /admin/users — admin
**Body:** `{ "name": "...", "email": "...", "password": "...", "role": "editor" }`

---

## Upload

### POST /upload — editor+
Multipart form data. Field: `file` (PDF, DOCX, XLSX — max 20 MB).

**Response:** `{ "fileUrl": "/uploads/documents/filename.pdf", "fileName": "...", "size": 12345 }`

---

## Error Responses

All errors return:
```json
{ "error": "Human-readable message", "issues": [...] }
```

HTTP status codes used: `400` (validation), `401` (unauthenticated), `403` (forbidden), `404` (not found), `409` (conflict), `413` (too large), `415` (unsupported type), `500` (server error).
