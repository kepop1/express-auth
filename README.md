# Express Authentication

Quick mock up of using authentication with jsonwebtoken, utilising jwt auth, and using bcrypt to hash and store the password. In theory you can take this and run with it.

Endpoints are authenticated by default through an `authenticateUser` middleware.

## Utilising

1. [x] Express
1. [x] Mongoose
1. [x] Jsonwebtoken
1. [x] brypt

**Need a client/frontend ?** [@kepop1 - react-auth]('https://github.com/kepop1/react-auth')

## Available Endpoints

- POST

  - /register - body: { email: string, password: string}
  - /login - body: { email: string, password: string}

- GET
  - /route (authenticated) - headers: { authorization: "Bearer TOKEN" }
