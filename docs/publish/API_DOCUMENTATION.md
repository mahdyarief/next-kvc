# 📜 API Documentation & Specification

## 🔐 Security & Authentication

All endpoints require one of the following authentication methods. Ensure you have the appropriate `X-API-Key` or a valid session cookie.

| Method | Header / Cookie | Example |
| :--- | :--- | :--- |
| **API Key** | `X-API-Key` (header) | `X-API-Key: kvcyour_key` |
| **Session Cookie** | `next-auth.session-token` | Managed by Auth.js |

---

## 📂 Authentication & Registration

### `[POST] /api/auth/register`
**Purpose**: Register a new user in the system.

*   **Required Header**: `X-API-Key` OR `Session`
*   **Request Body**:
    - `name` (string)
    - `email` (string)
    - `password` (string)

**Response (200)**:
```json
{
  "success": true,
  "user": {
    "id": "clx123abc",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

---

## 📂 User Profile & Keys

### `[GET] /api/user`
**Purpose**: Retrieve the profile of the currently authenticated user.

*   **Response**: `User` object (ID, Name, Email, Role, Timestamps).

### `[POST] /api/user/api-key`
**Purpose**: Generate or rotate a secure `kvc` API key.

*   **Action**: Replaces any existing key.
*   **Response**: The new plaintext API key (shown only once).

---

## 📂 System Notifications

### `[GET] /api/notifications`
**Purpose**: List the most recent notifications for the session user.

*   **Filters**: Defaults to unread items first.
*   **Response**: Array of `Notification` objects.

### `[POST] /api/system/check-updates`
**Purpose**: Proactively check GitHub for new version releases.

*   **Action**: Creates a system notification if a new release is found.

---

## 📂 User Management (Admin Only)

### `[GET] /api/users`
**Purpose**: Paginated list of all users in the application.

*   **Access**: Requires `ADMIN` or `SUPERADMIN` role.
*   **Response**: Array of `User` objects.

---

## 📦 Data Schemas

### Standard API Response
```json
{
  "success": boolean,
  "message": "Human-readable status",
  "data": { ... },
  "error": "Error details (if any)"
}
```

### User Object
| Field | Type | Options |
| :--- | :--- | :--- |
| `id` | CUID | — |
| `role` | String | `SUPERADMIN`, `ADMIN`, `USER` |
| `email` | String | Validated email format |

---

## 🛠️ Testing & Playground

To test the API interactively, navigate to:
- **Swagger UI**: [`/swagger`](/swagger)
- **Discovery Portal**: Internal UI for browsing versioned endpoints.

---

<div align="center">
  **Document Status**: Reference | **Framework Version**: 1.1.0
</div>
