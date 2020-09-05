const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AUTH_SECRET = process.env.AUTH_SECRET || "test-secret";

const authenticateUser = async (req, res, next) => {
  // Get the authorization header from the request, this is using Bearer {token} but it could also be
  // a header on the request such as req.headers.authToken
  const authorizationHeader = req.headers.authorization;

  // If the header does not exist then they don't have a token
  if (!authorizationHeader) {
    res.status(401).send({
      success: false,
      message: "You're not authorised to access this route",
    });

    return;
  }

  // Get the token from 'Bearer {token}'
  const userAuthToken = authorizationHeader.split(" ")[1];

  // Verify this is the same jwt token that we gave to the client when they logged in
  const jwtPayload = jwt.verify(userAuthToken, AUTH_SECRET);

  // JWT hasn't been tampered with and is valid
  const user = await User.findById(jwtPayload.id);

  // Double check that the user inside is valid in case someone figured out the secret
  if (!user) {
    res.status(404).send({
      success: false,
      message: "Your user could not be found",
    });

    return;
  }

  // Carry on and allow the user to access the rest of the routes
  next();
};

module.exports = authenticateUser;
