# 🐾 Pet Store Booking API Documentation

## 📑 API Endpoints Summary

| No. | Method              | Endpoint                              | Description                          | Access       | 
| --- | ------------------- | ------------------------------------- | ------------------------------------ | ------------ | 
|     | **Authentication**  |                                       |                                      |              | 
| 1   | POST                | `/auth/register`                      | ลงทะเบียนผู้ใช้                       | Public ⭐      |
| 2   | POST                | `/auth/login`                         | เข้าสู่ระบบ                           | Public  ⭐     |
|     | **User**            |                                       |                                      |              |        |
| 3   | GET                 | `/auth/me`                           | ดูข้อมูลตัวเอง                        | User   ⭐      |
| 4   | PUT                 | `/auth/me/profile`                   | แก้ไขข้อมูลตัวเอง                     | User    ⭐     |
| 5   | DELETE              | `/auth/me`                           | ลบบัญชีตัวเอง                         | User   ⭐      |
|     | **Stores**          |                                       |                                      |              |        |
| 6  | GET                 | `/stores`                             | ดูรายการร้านทั้งหมด                   | Public      ⭐ |
| 7  | GET                 | `/stores/:id`                         | ดูรายละเอียดร้าน                      | Public      ⭐ |
| 8  | POST                | `/stores`                             | สร้างร้านใหม่                         | Owner      ⭐  |
| 9  | PUT                 | `/stores/:id`                         | แก้ไขข้อมูลร้าน                       | Owner      ⭐  |
| 10  | DELETE              | `/stores/:id`                         | ลบร้าน                                | Owner       ⭐ |
|     | **Reservations**    |                                       |                                      |              |        |
| 11  | GET                 | `/reservations`                       | ดูการจองของตัวเอง                     | User       ⭐  |
| 12  | GET                 | `/reservations/:id`                   | ดูรายละเอียดการจอง                    | User         ⭐|
| 13  | POST                | `/reservations`                       | สร้างการจองใหม่                       | User        ⭐ |
| 14  | PUT                 | `/reservations/:id`                   | แก้ไขการจอง                           | User        ⭐ |
| 15  | DELETE              | `/reservations/:id`                   | ยกเลิกการจอง                          | User        ⭐ |
|     | **History**         |                                       |                                      |              |        |
| 16  | GET                 | `/history`                            | ดูประวัติการจองทั้งหมด                | User        ⭐ |
| 17  | GET                 | `/history/:id`                        | ดูประวัติการจองเฉพาะ                  | User         ⭐|
|     | **Reviews**         |                                       |                                      |              |        |
| 18  | GET                 | `/stores/:id/reviews`                 | ดูรีวิวของร้าน                        | Public       ⭐|
| 19  | POST                | `/stores/:id/reviews`                 | สร้างรีวิว                            | User         ⭐|
| 20  | PUT                 | `/stores/:id/reviews/:reviewId`       | แก้ไขรีวิว                            | User        ⭐ |
| 21  | DELETE              | `/stores/:id/reviews/:reviewId`       | ลบรีวิว                               | User         ⭐|
|     | **Media**           |                                       |                                      |              |        |
| 22  | GET                 | `/media/:id`                          | ดูไฟล์มีเดีย                          | Public       ⭐|
| 23  | POST                | `/media`                              | อัปโหลดรูปภาพ                         | User / Owner ⭐|
| 24  | DELETE              | `/media/:id`                          | ลบไฟล์มีเดีย                          | User / Owner ⭐|


---

## 🔐 Authentication

### 1. Register

```http
POST /auth/register
```

**Request Body**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone_number": "string",
  "password": "string"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

### 2. Login

```http
POST /auth/login
```

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "token": "string",
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

---

### 3. Logout

```http
POST /auth/logout
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Forgot Password

```http
POST /auth/forgot-password
```

**Request Body**

```json
{
  "email": "string"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 5. Reset Password

```http
POST /auth/reset-password
```

**Request Body**

```json
{
  "token": "string",
  "newPassword": "string"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 👤 User Management

### 6. Get User Profile

```http
GET /users/me
```

**Response (200 OK)**

```json
{
  "id": "number",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone_number": "string",
  "profile_image": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

### 7. Update User Profile

```http
PUT /users/me
```

**Request Body**

```json
{
  "firstName": "string",
  "lastName": "string",
  "phone_number": "string",
  "profile_image": "string"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

---

### 8. Change Password

```http
PUT /users/me/password
```

**Request Body**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 9. Delete Account

```http
DELETE /users/me
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 🏪 Store Management

### 10. Get All Stores

```http
GET /stores
```

**Query Parameters**

- `pet_type`: กรองตามประเภทสัตว์เลี้ยง
- `store_type`: กรองตามประเภทร้าน
- `price`: กรองตามราคา
- `address`: กรองตามที่อยู่

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "store_type": "string",
      "pet_type": "string",
      "total_storeentry": "number",
      "total_table": "number",
      "total_pet": "number",
      "summary": "string",
      "address": "string",
      "price": "number",
      "open_datetime": "string",
      "owner_id": "number",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

---

### 11. Get Store by ID

```http
GET /stores/:id
```

**Response (200 OK)**

```json
{
  "id": "number",
  "store_type": "string",
  "pet_type": "string",
  "total_storeentry": "number",
  "total_table": "number",
  "total_pet": "number",
  "summary": "string",
  "address": "string",
  "price": "number",
  "open_datetime": "string",
  "owner_id": "number",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

### 12. Create Store

```http
POST /stores
```

**Request Body**

```json
{
  "store_type": "string",
  "pet_type": "string",
  "total_storeentry": "number",
  "total_table": "number",
  "total_pet": "number",
  "summary": "string",
  "address": "string",
  "price": "number",
  "open_datetime": "string"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "Store created successfully",
  "data": {
    "id": "number",
    "store_type": "string",
    "owner_id": "number"
  }
}
```

---

### 13. Update Store

```http
PUT /stores/:id
```

**Request Body**

```json
{
  "store_type": "string",
  "pet_type": "string",
  "total_storeentry": "number",
  "total_table": "number",
  "total_pet": "number",
  "summary": "string",
  "address": "string",
  "price": "number",
  "open_datetime": "string"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Store updated successfully"
}
```

---

### 14. Delete Store

```http
DELETE /stores/:id
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Store deleted successfully"
}
```

---

## 📅 Reservations

### 15. Get My Reservations

```http
GET /reservations
```

**Query Parameters**

- `status`: กรองตามสถานะ
- `from`: วันที่เริ่มต้น (YYYY-MM-DD)
- `to`: วันที่สิ้นสุด (YYYY-MM-DD)

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "user_id": "number",
      "store_id": "number",
      "history_id": "number",
      "start_date": "datetime",
      "end_date": "datetime",
      "price": "number",
      "total_guest": "number",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

---

### 16. Get Reservation by ID

```http
GET /reservations/:id
```

**Response (200 OK)**

```json
{
  "id": "number",
  "user_id": "number",
  "store_id": "number",
  "history_id": "number",
  "start_date": "datetime",
  "end_date": "datetime",
  "price": "number",
  "total_guest": "number",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

### 17. Create Reservation

```http
POST /reservations
```

**Request Body**

```json
{
  "store_id": "number",
  "start_date": "datetime",
  "end_date": "datetime",
  "total_guest": "number"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": "number",
    "store_id": "number",
    "start_date": "datetime",
    "end_date": "datetime",
    "price": "number",
    "total_guest": "number"
  }
}
```

---

### 18. Update Reservation

```http
PUT /reservations/:id
```

**Request Body**

```json
{
  "start_date": "datetime",
  "end_date": "datetime",
  "total_guest": "number"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Reservation updated successfully"
}
```

---

### 19. Cancel Reservation

```http
DELETE /reservations/:id
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Reservation cancelled successfully"
}
```

---

## 📜 History Reservation

### 20. Get All History

```http
GET /history
```

**Query Parameters**

- `pet_type`: กรองตามประเภทสัตว์เลี้ยง
- `from`: วันที่เริ่มต้น (YYYY-MM-DD)
- `to`: วันที่สิ้นสุด (YYYY-MM-DD)

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "user_id": "number",
      "store_id": "number",
      "owner_id": "number",
      "reservation_id": "number",
      "pet_type": "string",
      "total_table": "number",
      "total_pet": "number",
      "summary": "string",
      "address": "string",
      "price": "number",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

---

### 21. Get History by ID

```http
GET /history/:id
```

**Response (200 OK)**

```json
{
  "id": "number",
  "user_id": "number",
  "store_id": "number",
  "owner_id": "number",
  "reservation_id": "number",
  "pet_type": "string",
  "total_table": "number",
  "total_pet": "number",
  "summary": "string",
  "address": "string",
  "price": "number",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

---

## ⭐ Reviews

### 22. Get Reviews for a Store

```http
GET /stores/:id/reviews
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "reservation_id": "number",
      "user_id": "number",
      "rating": "number",
      "comment": "string"
    }
  ]
}
```

---

### 23. Create Review

```http
POST /stores/:id/reviews
```

**Request Body**

```json
{
  "reservation_id": "number",
  "rating": "number",
  "comment": "string"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": "number",
    "reservation_id": "number",
    "user_id": "number",
    "rating": "number",
    "comment": "string"
  }
}
```

---

### 24. Update Review

```http
PUT /stores/:id/reviews/:reviewId
```

**Request Body**

```json
{
  "rating": "number",
  "comment": "string"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Review updated successfully"
}
```

---

### 25. Delete Review

```http
DELETE /stores/:id/reviews/:reviewId
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## 🖼️ Media

### 26. Get Media File

```http
GET /media/:id
```

**Response (200 OK)**

```json
{
  "id": "number",
  "model_id": "number",
  "review_id": "number",
  "store_type": "string",
  "pet_type": "number"
}
```

---

### 27. Upload Media

```http
POST /media
```

**Request Body** (multipart/form-data)

```
file: <image file>
store_type: "string"   (profile | store | review)
model_id: "number"
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "Media uploaded successfully",
  "data": {
    "id": "number",
    "url": "string",
    "store_type": "string"
  }
}
```

---

### 28. Delete Media

```http
DELETE /media/:id
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid request data"
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "error": "You don't have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 409 Conflict

```json
{
  "error": "Resource already exists"
}
```

---

## 📝 Notes

1. ทุก protected route ต้องส่ง token ใน header:
   ```
   Authorization: Bearer <token>
   ```
2. Error responses จะมี HTTP status code ที่เหมาะสม
3. `store_type` ใน Media ใช้เพื่อแยกประเภทของรูปภาพ (profile / store / review)
4. History reservation สร้างโดยอัตโนมัติเมื่อการจองเสร็จสิ้น ไม่สามารถสร้างหรือแก้ไขได้โดยตรง
