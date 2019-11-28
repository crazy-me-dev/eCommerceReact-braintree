const { User, validateUser } = require("../models/user");

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  req.profile = user;
  next();
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
