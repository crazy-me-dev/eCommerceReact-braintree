const formidable = require("formidable");
const fs = require("fs");
const { Product, validateProduct } = require("../models/product");

exports.productById = async (req, res, next, id) => {
  const product = await Product.findById(id).populate("category");

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
      product.hasPhoto = true;
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
      product.hasPhoto = true;
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
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;

  let products = await Product.find()
    .select("-photo")
    .populate("category")
    .skip(skip)
    .sort([[sortBy, order]])
    .limit(limit)
    .exec();

  res.json(products);
};

exports.listSearch = async (req, res) => {
  // create query object to hold search value and category value
  const query = {};

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
  } else if (req.query.category && req.query.category != "All") {
    query.category = req.query.category;
  }

  const productList = await Product.find(query).select("-photo");

  res.json(productList);
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
  //return the diffent cat that are in use in Product collection
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
        //if length is 2 then there is pair range of prices
        //if not then lets not set the args for price
        if (req.body.filters[key].length === 2) {
          // gte -  greater than price [0-10]
          // lte - less than
          findArgs[key] = {
            $gte: parseInt(req.body.filters[key][0]),
            $lte: parseInt(req.body.filters[key][1])
          };
        }
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

  res.json(data);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  res.status(404).json({ error: "Product does not have image" });
  next();
};

/** this updateQuantity middleware */
exports.updateQuantity = async (req, res, next) => {
  /**creating the array of product queries to be updated  */
  let bulkOps = req.body.products.map(item => {
    return {
      updateOne: {
        filter: {
          _id: item._id,
          quantity: { $gte: item.count }
        },
        update: {
          $inc: {
            quantity: -item.count,
            sold: +item.count
          }
        }
      }
    };
  });
  /**updating the queries in bulk */
  let results = await Product.bulkWrite(bulkOps);

  /** checking if the number of updated results match the number of queries*/
  if (results.modifiedCount < bulkOps.length) {
    /** If we have less modified items than queries, it means that one or more of the products didnt have enough stock
     * hence we will roll back the update. Next lets create the queries for roll back
     */
    bulkOps = req.body.products.map(item => {
      return {
        updateOne: {
          filter: {
            _id: item._id,
            quantity: { $gte: item.count }
          },
          update: {
            $inc: {
              quantity: +item.count,
              sold: -item.count
            }
          }
        }
      };
    });
    /**executing the roll back  */
    await Product.bulkWrite(bulkOps);
    /** */
    throw new Error("Sorry, we dont have enough stock for your order");
  }
  /** if everything goes right, lets call next */

  next();
};
