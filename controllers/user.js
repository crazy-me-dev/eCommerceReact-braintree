const { User, validateUser } = require("../models/user");

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id).populate("history");
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
  // console.log(req.body);
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
