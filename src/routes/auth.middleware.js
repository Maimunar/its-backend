require('dotenv').config()
const jwt = require('jsonwebtoken')


exports.loggedIn = function (req, res, next) {
  let token = req.header('Authorization');
  if (!token) return res.status(401).send("Access Denied");

  try {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  }
  catch (err) {
    res.status(400).send("Invalid Token");
  }
}

exports.adminOnly = async function (req, res, next) {
  if (req.user.user_type_id === 'user') {
    return res.status(401).send("Access Denied");
  }
  next();
}
