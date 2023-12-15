# Customer Management API

This project is a Node.js application using Express.js and MongoDB. It provides an API for managing customer information and includes features like user registration, login, OTP verification(Using Twilio), and user data updates.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
git clone https://github.com/RutvikJogdand/auth-service.git

2. Navigate to the project directory

3. Install dependencies:
npm install

4. Create a `.env` file in the root directory with the following content:
JWT_SECRET=<your-jwt-secret>
TwilioAccountSID=<your-twilio-account-sid>
TwilioToken=<your-twilio-token>
MONGO_URI=<your-mongoDB-uri>
Also make sure to include your mongodb username and password in the .env file

5. Start the server: <b>nodemon index.js</b>


## API Endpoints

### Register Customer
- **Endpoint**: `/register`
- **Method**: `POST`
- **Body**:
- `username`: String, required
- `name`: String, required
- `email`: String, required
- `password`: String, required
- `confirmPassword`: String, required
- `phoneNumber`: String, required
- `country`: String, required

### Login
- **Endpoint**: `/login`
- **Method**: `POST`
- **Body**:
- `username`: String, required
- `password`: String, required

### Send OTP
- **Endpoint**: `/sendOtp`
- **Method**: `POST`
- **Body**:
- `phoneNumber`: String, required

### Verify Email
- **Endpoint**: `/verifyEmail`
- **Method**: `POST`
- **Body**:
- `otp`: Number, required

### Update User Information
- **Endpoint**: `/updateUser/:username`
- **Method**: `POST`
- **Body**:
- `name`: String, optional
- `email`: String, optional
- `password`: String, optional
- `country`: String, optional
- `phoneNumber`: String, optional



