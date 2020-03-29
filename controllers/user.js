const { User, validateUser } = require("../models/user");

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id, {
    name: 1,
    email: 1,
    _id: 1,
    "address.street": 1,
    "address.city": 1,
    "address.zip": 1,
    "address.state": 1,
    "address.country": 1
  });

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  req.profile = user;
  next();
};

exports.purchaseHistory = async (req, res) => {
  const user = await User.findById(req.profile._id)
    .populate("history")
    .sort("-createdAt");
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  res.json(user.history);
};

exports.read = (req, res) => {
  req.profile.hashedPassword = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  let user = await User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true }
  );

  // since Mongoose doesn't apply for virtuals, middlewares, settles and so on with findByIdAndUpdate()
  // we update the password manually and then save it.
  if (req.body.password) {
    user.password = req.body.password;
    await user.save();
  }

  user.hashedPassword = undefined;
  user.salt = undefined;

  //return response with user and token
  const { _id, name, email, role, address, history } = user;
  res.json({ user: { _id, name, email, role, address } });
};
