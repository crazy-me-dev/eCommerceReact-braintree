const { Category, validateCategory } = require("../models/category");

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.list = async (req, res) => {
  const list = await Category.find();
  res.json(list);
};

exports.create = async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category(req.body);

  const data = await category.save();

  res.json({ data });
};

exports.update = async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const category = req.category;
  category.name = req.body.name;
  const data = await category.save();

  res.json({ data });
};

exports.remove = async (req, res) => {
  let category = req.category;

  await category.remove();

  res.json({ message: `Category ${req.category.name} deleted succesfully` });
};

exports.categoryById = async (req, res, next, id) => {
  const category = await Category.findById(id);

  if (!category) return res.status(400).json({ error: "Category not found" });

  req.category = category;
  next();
};
