const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AUTH_SECRET = process.env.AUTH_SECRET || "test-secret";

const authenticateUser = async (req, res, next) => {
  // Get the authorization header from the request, this is using Bearer {token} but it could also be
  // a header on the request such as req.headers.authToken
  const authorizationHeader = req.headers.authorization;

  // Get the token from 'Bearer {token}' first, otherwise 'Bearer undefined' would still get through.
  const userAuthToken = authorizationHeader.split(" ")[1];

  // Verify this is the same jwt token that we gave to the client when they logged in
  let jwtPayload;

  try {
    jwtPayload = jwt.verify(userAuthToken, AUTH_SECRET);
  } catch (error) {
    // If the authToken has an error, e.g. it's 'undefined'
    res.status(401).send({
      success: false,
      message: "You're not authorised to access this route",
    });

    // Carry on and allow the server to continue operations
    return next(new Error([error]));
  }

  // JWT hasn't been tampered with and is valid
  const user = await User.findById(jwtPayload.id);

  // Double check that the user inside is valid in case someone figured out the secret
  if (!user) {
    res.status(404).send({
      success: false,
      message: "Your user could not be found",
    });

    // Carry on and allow the server to continue operations
    return next(new Error(["Your user could not be found"]));
  }

  // Carry on and allow the user to access the rest of the routes
  next();
};

module.exports = authenticateUser;
