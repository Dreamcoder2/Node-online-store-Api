const getHeader = (req) => {
  return (token = req.headers.authorization.split(" ")[1]);
};

module.exports = getHeader;
