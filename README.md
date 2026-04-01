Mediward Application


### 🏥 Mediward Application — Backend API

The **Hospital Management Application** is a robust and comprehensive backend system designed to streamline the operations of modern healthcare facilities. Built with **NestJS** and **MySQL**, it provides secure, scalable modules for managing **Admin operations**, **Patient records**, **Medical history**, **Appointment scheduling**, **Pharmacy**, **Ward and Bed management**, **Billing**, and **Reviews**.

With built-in **JWT authentication**, optional **Two-Factor Authentication (2FA)**, and **role-based access control**, the system ensures secure access for Admin, Staff, and Patients. It supports complete patient lifecycle management including admissions, discharges, medical record tracking, appointment booking, and feedback — all while ensuring **data privacy and operational efficiency**.

#### 🔐 Core Features:

* **Role-Based Access Control** for Admins, Patients, and Staff
* **JWT Authentication** with optional **Two-Factor Authentication (2FA)**
* **Medical Record Management** and historical tracking
* **Appointment Scheduling System** with availability slots
* **Ward & Bed Assignment Module** with live admission/discharge updates
* **Admin Dashboard Endpoints** for analytics (revenue, appointments, discharges, inventory stats)

#### 🚀 Tech Stack:

* **Backend**: NestJS (Node.js)
* **Database**: MYSQL
* **Authentication**: JWT + 2FA
* **Mailing**: SMTP via Ethereal
* **API Docs**: Swagger/OpenAPI (`/api-docs`)

Installation

- clone the repository


`git clone git@github.com:olawuwo-abideen/mediward.git`


- navigate to the folder


`cd mediward-main.git`

To run the app in development mode

Open a terminal and enter the following command to install all the  modules needed to run the app:

`npm install`


Create a `.env` file with


`DB_HOST=localhost`

`DB_PORT=3306`

`DB_USERNAME=root`

`DB_PASSWORD=password`

`DB_NAME=mediward`

`PORT=3000`

`JWT_SECRET= secret`

`JWT_EXPIRATION_TIME= 3d`

`MAIL_USERNAME=mailuser.email`

`MAIL_PASSWORD=mailpassword`

`MAIL_HOST=smtp.ethereal.email`

`JWT_EXPIRES_IN= 1d`

`ADMIN_EMAIL= adminemail`

`ADMIN_PASSWORD= admin password`


Enter the following `npm start` command to Command Line Interface to Start the app

This will start the app and set it up to listen for incoming connections on port 3000. 

Use Postman or open api to test the endpoint

Open API endpoints = http://localhost:3000/api-docs

API Endpoints

The following API endpoints are available:

- BaseUrl https://localhost:3000/api-docs

**Admin Endpoint**

- **POST /admin/login**: Admin login.
- **GET /admin/staff**: Get staff user.
- **GET /admin/staff/count**: Get total number of staff.
- **GET /admin/users**: Get all users.
- **GET /admin/user/:id**: Get a user.
- **GET /admin/delete/:id**: Delete a user.
- **GET /admin/staff/status/:id**: Get staff account status.
- **PATCH /admin/staff/activate/:id**: Activate staff account.
- **GET /admin/revenue**: Get billing revenue.
- **GET /admin/admissions**: Get patient admission overview.
- **GET /admin/discharges**: Get discharge overview.
- **GET /admin/appointments**: Get appointments overview.
- **GET /admin/inventory**: Get inventory report.
- **POST /admin/bed**: Create bed.
- **PUT /admin/bed/:id**: Update bed.
- **DELETE /admin/bed/:id**: Delete bed.
- **POST /admin/ward**: Create ward.
- **PUT /admin/ward/:id**: Update ward.
- **DELETE /admin/ward/:id**: Delete ward.
- **POST /admin/:bedId/:wardId**: Add bed to  ward.
- **DELETE /admin/:wardId/:bedId**: Remove bed from ward.


**Authentication Endpoint**

- **POST /auth/signup**: User signup.
- **POST /auth/login**: User login.
- **POST /auth/forgot-password**: User forget password.
- **POST /auth/reset-password**: User reset password.

**User Endpoint**

- **GET /user/**: Retrieve the currently authenticated user’s profile.
- **POST user/change-password**: User change password.
- **PUT /user/**: Update the patient profile.
- **PUT /user/staff**: Update staff profile.
- **PUT /user/user-image**: Update user image.
- **POST /user/initiate-2fa**: Initiate 2fa authentication.
- **POST /user/verify-2fa**: Verify 2fa  authentication.
- **POST /user/disable-2fa**: Disable 2fa  authentication.

**Availability Slot Endpoint**

- **POST availabilityslot**: Set availability slots.
- **GET availabilityslot**: Get doctor availability.
- **GET /availabilityslot/:id**: Get an availability slot.
- **PUT /availabilityslot/:id**: Update availability slot.
- **DELETE /availabilityslot/:id**: Delete availability slot.

**Appointments Endpoint**

- **POST /appointments/book/**: Book an appointment.
- **GET /appointments**: Get all available appointments.
- **GET /appointments/**: Get all appointments.
- **GET /appointments/details/:id**: Get details of a specific appointment.
- **PUT /appointments/reschedule/:id**:	Reschedule an appointment.
- **DELETE /appointments/cancel/:id**: Cancel an appointment.






**Medical Record Endpoints**

- **POST /patient/:id**: Add a medical record of a patient.
- **GET /patient/:id**: Get a medical record of a patient.
- **PUT /patient/:id**: Update  a medical record of a patient.





