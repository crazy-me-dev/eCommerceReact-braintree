const keys = require("../config/keys");
const expressJwt = require("express-jwt");

const { User, validateNewUser, validateUser } = require("../models/user");
exports.signup = async (req, res) => {
  const { error } = validateNewUser(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let user = new User(req.body);
  user = await user.save();
  user.salt = undefined;
  user.hashedPassword = undefined;
  res.send(user);
};

exports.signin = async (req, res) => {
  const { email: incomingEmail, password } = req.body;

  const user = await User.findOne({ email: incomingEmail });

  if (!user) {
    return res
      .status(400)
      .json({ error: "User with that email does not exists. Please signup!" });
  }

  if (!user.authenticate(password)) {
    return res
      .status(401)
      .json({ error: "Password doesn't match the email provided!" });
  }

  //generate a signed token with user id and secret
  // const token = jwt.sign({ _id: user._id }, keys.jwtPrivateKey);
  const token = user.generateAuthToken();

  //persist the token in a cookie
  res.cookie("token", token, { expire: new Date() + 9999 });

  //return response with user and token
  const { _id, name, email, role } = user;

  return res.json({ token, user: { _id, name, email, role } });
};

exports.signout = (req, res) => {
  //clear the cookie
  res.clearCookie("token");
  res.json({ message: "Signout success" });
};

/*
this middleware requires users to be signedin 
*/

exports.requireSignin = expressJwt({
  //validates that we have the same secret than the one when signedin
  secret: keys.jwtPrivateKey,
  userProperty: "auth"
});

/*
this middleware requires users to be signedin and to be the same user 
*/
exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!user) {
    return res.status(403).json({
      error: "Access denied"
    });
  }

  next();
};

/*
this middleware requires users to be signedin  and to be the same user 
and also to have admin role assigned 
*/
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resourse! Access denied"
    });
  }

  next();
};
