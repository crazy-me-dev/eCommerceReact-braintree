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

  user.hashedPassword = undefined;
  user.salt = undefined;

  res.json(user);
};
