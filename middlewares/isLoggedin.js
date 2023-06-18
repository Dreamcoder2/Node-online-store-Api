const getHeader = require("../utils/getHeader");
const generateToken = require("../utils/getHeader");
const verifyToken = require("../utils/verifyToken");

isLoggedIn = (req, res, next) => {
  // get toke from header
  const token = getHeader(req);

  // verify thee token
  const decodedUser = verifyToken(token);
  // save the user in req
  if (!decodedUser) {
    //
    throw new Error(" user not found");
  } else {
    req.userAuthId = decodedUser?.id;
    next();
  }
};
module.exports = isLoggedIn;
