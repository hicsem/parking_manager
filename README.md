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

- GET `api/users` (returns a list of users)
- POST `api/users` (create a user)
- GET `api/users/:userId` (returns a user)
- PUT `api/users/:userId` (update a user)
- DELETE `api/users/:userId` (delete a user)

#### parking

- GET `api/parkings` (returns a list of parking spaces)
- POST `api/parkings` (create a parking space)
- GET `api/parkings/:parkingId` (returns a parking space)
- PUT `api/parkings/:parkingId` (update a parking space)
- DELETE `api/parkings/:parkingId` (delete a parking space)

- PUT `/api/modifyparking/:parkingId` (update a parking space by the user)
- GET `/api/freeparking` (returns a list of available parking spaces (if the floor is specified in the body of the request, it returns the list of available spaces in that floor))
- GET `/api/myparkingspace/:userId` (returns a the user's parking space (where did I park my car?))
