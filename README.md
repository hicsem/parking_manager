# Parking Manager

### Description

This is the backend of a parking management system.

##### Technologies used :

- Node.js
- Express
- Sequelize (MySQL Database)
- JSON Web Tokens (jwt)

## Basic Setup :

- run `npm install` or `yarn`
- create a `.env` file in the root folder and add the following lines:

```
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name
DB_HOST=host(ex:127.0.0.1)
PORT=port(ex:3000)
JWT_SECRET=your_json_web_token_secret
NODE_ENV=(ex:development)
```

- run `nodemon server`

## API Endpoints :

#### user

- GET `/api/users` (returns a list of users)
- POST `/api/users` (create a user or register)
- GET `/api/users/:userId` (returns a user)
- PUT `/api/users/:userId` (update a user)
- DELETE `/api/users/:userId` (delete a user)

#### auth

- POST `/auth/signin` (sign in or login)
- GET `/auth/signout` (sign out)

#### parking

- GET `/api/parking` (returns a list of parking spaces)
- POST `/api/parking` (create a parking space)
- GET `/api/parking/:parkingId` (returns a parking space)
- PUT `/api/parking/:parkingId` (update a parking space)
- DELETE `/api/parking/:parkingId` (delete a parking space)

- GET `/api/availableparkingspaces` (returns a list of available parking spaces)
- GET `/api/myparkingspace/:userId` (returns a the user's parking space (where did I park my car?))

#### Bookings

- GET `/api/parking/:parkingId/bookings` (returns a list of bookings of a parking space)
- POST `/api/parking/:parkingId/bookings` (books a parking space)

- GET `/api/parking/bookings/:bookingId/:userId` (return a booking by Id)
- DELETE `/api/parking/bookings/:bookingId/:userId` (delete a booking)
