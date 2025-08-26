#  Ride Booking System Backend API

A role-based backend API for a ride booking platform (like Uber or Pathao) built using **Node.js**, **Express.js**, **MongoDB**, and **TypeScript**. This project is part of Assignment 5 of the Programming Hero Web Development course.

---

##  Project Overview

This system allows users to:
-  Request rides (riders)
-  Accept & update ride status (drivers)
-  Manage users & rides (admins)

The API supports secure authentication, role-based authorization, and full ride lifecycle management.

---

##  Tech Stack

| Category       | Technology                    |
|----------------|-------------------------------|
| Runtime        | Node.js                       |
| Framework      | Express.js                    |
| Language       | TypeScript                    |
| Database       | MongoDB + Mongoose            |
| Auth & Security| JWT, bcrypt, cookie-parser    |
| Validation     | Zod                           |
| Dev Tools      | dotenv, ts-node-dev, etc.     |

---

##  Features

###  Authentication
- User Registration (Rider, Driver)
- Login with JWT & Hashed Password (bcrypt)
- Role-based access control

###  Riders
- Request ride with pickup & destination
- Cancel ride (if not accepted)
- View ride history

###  Drivers
- Accept or reject ride requests
- Update ride status (`picked_up → in_transit → completed`)
- View total earnings
- Toggle availability (Online/Offline)

### 🛡️ Admin
- Approve or suspend drivers
- Block or unblock users
- View all users & rides

---

## 🛠 API Endpoints Summary



Vercel dep




###  Auth
- `POST` https://ride-booking-api.vercel.app/api/v1/user/register - `Register user`
- `POST` https://ride-booking-api.vercel.app/api/v1/user/login - Login & get token
- `GET` https://ride-booking-api.vercel.app/api/v1/user/me - Get profile info

###  Rider
- `POST` https://ride-booking-api.vercel.app/api/v1/ride/request - Request ride
- `PATCH `  https://ride-booking-api.vercel.app/api/v1/ride/cancel/:id - Cancel ride
- `GET ` https://ride-booking-api.vercel.app/api/v1/ride/history - Get ride history

###  Driver
- `PATCH`  https://ride-booking-api.vercel.app/api/v1/ride/accept/:id - Accept ride
- `PATCH`  https://ride-booking-api.vercel.app/api/v1/ride/status/:id - Update ride status
- `GET`    https://ride-booking-api.vercel.app/api/v1/ride/earnings - Get total earnings
- `PATCH ` https://ride-booking-api.vercel.app/api/v1/ride/availability - Toggle availability




###  Admin
- `GET`  https://ride-booking-api.vercel.app/api/v1/ride/users - Get all users
- `PATCH`  https://ride-booking-api.vercel.app/api/v1/ride/drivers/approve/:id - Approve/suspend driver (toggle) one click suspand one click approve
- `PATCH`  https://ride-booking-api.vercel.app/api/v1/ride/users/block/:id - Block/unblock user
- `GET`   https://ride-booking-api.vercel.app/api/v1/ride/rides  - Get all ride records

---

##  Testing

You can test all routes using **Postman**   
 Don't forget to include `Authorization` header with JWT token for protected routes.

---

##  Project Structure

