const formidable = require("formidable");
const fs = require("fs");
const { Product, validateProduct } = require("../models/product");

exports.productById = async (req, res, next, id) => {
  const product = await Product.findById(id);

  if (!product) {
    return res.status(400).json({ error: "Product not found" });
  }

  req.product = product;
  next();
};

exports.read = async (req, res) => {
  //avoid sending the image
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }

    const { error } = validateProduct(fields);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let product = new Product(fields);

    //cheching if the form comes with files
    if (files.photo) {
      //avoids saving files too large
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size"
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    try {
      const result = await product.save();
      result.photo = undefined;
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: "" + err
      });
    }
  });
};

exports.remove = async (req, res) => {
  let product = req.product;

  await product.remove();

  res.json({ message: `Product ${req.product.name} deleted succesfully` });
};

exports.update = async (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    const { error } = validateProduct(fields);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let product = req.product;

    product = Object.assign(product, fields);

    //cheching if the form comes with files
    if (files.photo) {
      //avoids saving files too large
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size"
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    try {
      const result = await product.save();
      result.photo = undefined;
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: "" + err
      });
    }
  });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */
exports.list = async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  let products = await Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec();

  res.json(products);
};

exports.listRelated = async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  const products = await Product.find({
    _id: { $ne: req.product },
    category: req.product.category
  })
    .limit(limit)
    .sort([[sortBy, order]])
    .populate("category", "_id name")
    .select("-photo")
    .exec();

  res.json(products);
};

exports.listCategories = async (req, res) => {
  //return teh diffent cat that are in use in Product collection
  const categories = await Product.distinct("category", {});
  res.json(categories);
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = async (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  const data = await Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec();

  res.json({ size: data.length, data });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  res.status(404).json({ error: "Product does not have image" });
  next();
};
