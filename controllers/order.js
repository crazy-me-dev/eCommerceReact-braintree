const { Order } = require("../models/order");
const { User } = require("../models/user");

exports.create = async (req, res) => {
  req.body.user = req.profile._id;
  let order = new Order(req.body);

  order = await order.save();

  let user = await User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: order._id } },
    { new: true }
  );

  res.json({ order });
};

exports.listOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "_id, name")
    .sort("-createdAt");

  res.json(orders);
};

exports.read = (req, res) => {
  return res.json(req.order);
};

exports.orderById = async (req, res, next, id) => {
  const order = await Order.findById(id).populate("user", "_id, name");

  if (!order) return res.status(400).json({ error: "Order not found" });

  req.order = order;
  next();
};

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = async (req, res) => {
  let order = await Order.findOneAndUpdate(
    { _id: req.order._id },
    { $set: { status: req.body.newStatus } },
    { new: true }
  );

  res.json(order);
};
