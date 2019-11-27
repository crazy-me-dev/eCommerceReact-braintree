const request = require("supertest");
const mongoose = require("mongoose");

const { Product } = require("../../models/product");
const { Category } = require("../../models/category");

const { User } = require("../../models/user");

let server;
let supertest;

describe("/api/product", () => {
  let user;
  let resSignin;
  let token;
  let userId;
  let name = "product1";
  //node1.jpg is 14.1KB. Any picture smaller than 1MB can be here
  let photo = "node1.jpg";
  /**
   * this exec fucntion will be used to POST an form-data type object
   */
  const exec = async () => {
    return await supertest
      .post("/api/product/create/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .field("name", name)
      .field("description", "desc")
      .field("price", 52)
      .field("category", "5dd757d885e5dd20dc1a59aa")
      .field("quantity", 12)
      .field("shipping", false)
      .attach("photo", `images/${photo}`);
  };

  beforeEach(async () => {
    server = require("../../index");
    supertest = request(server);

    //creating user with random values
    user = new User({
      role: 1,
      password: "anyPassword1",
      email: "any@email.com",
      name: "anyuserhere"
    });
    user = await user.save();
    resSignin = await supertest
      .post("/api/signin")
      .send({ password: "anyPassword1", email: "any@email.com" });

    token = resSignin.body.token;
    userId = user._id;
  });

  afterEach(async () => {
    await server.close();
    await Product.remove({});
    await Category.remove({});
    await User.remove({});
  });

  /**
   * Testing all GET routes
   */
  describe("GET /", () => {
    it("should return all products", async () => {
      await Product.collection.insertMany(createProducts());
      const res = await supertest.get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "product1")).toBeTruthy();
      expect(res.body.some(g => g.name === "product2")).toBeTruthy();
    });
  });

  describe("GET /:productId", () => {
    it("it should return a product if valid ", async () => {
      const product = new Product(createProducts()[0]);

      await product.save();
      const res = await supertest.get("/api/product/" + product._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", product.name);
    });

    it("it should return 404 if invalid id is passed", async () => {
      const res = await supertest.get("/api/product/1");

      expect(res.status).toBe(404);
    });

    it("it should return 400 if no product with the given id is found", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await supertest.get("/api/product/" + id);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /related/:productId", () => {
    it("should return a list of related products if valid id,  excluding the one passed as parameter", async () => {
      const productList = await Product.collection.insertMany(createProducts());

      const res = await supertest.get(
        "/api/products/related/" + productList.ops[0]._id
      );

      expect(res.status).toBe(200);

      //we have two objects in DB with the same category so the result should be 1
      expect(res.body.length).toBe(1);
    });

    it("it should return 404 if invalid id is passed", async () => {
      const res = await supertest.get("/api/products/related/1");

      expect(res.status).toBe(404);
    });

    it("it should return 404 if no id is passed", async () => {
      const res = await supertest.get("/api/products/related");

      expect(res.status).toBe(404);
    });

    it("it should return 400 if no product with the given id is found", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await supertest.get("/api/products/related/" + id);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /products/categories", () => {
    it("should return a list of all categories in use", async () => {
      await Product.collection.insertMany(createProducts());
      const res = await supertest.get("/api/products/categories");

      expect(res.status).toBe(200);

      //we only have 1 category in DB
      expect(res.body.length).toBe(1);

      //inserting 2 categories to DB should not add more to the result
      await Category.collection.insertMany([
        createCategory(),
        createCategory()
      ]);

      expect(res.body.length).toBe(1);
    });
  });

  it("should return the photo of the product if valid Id is provided", async () => {
    const res = await exec();

    const resPhoto = await supertest.get("/api/product/photo/" + res.body._id);

    expect(resPhoto.status).toBe(200);
  });

  it("should return 400 if invalid Id is provided", async () => {
    const res = await exec();

    const productId = mongoose.Types.ObjectId();
    const resPhoto = await supertest.get("/api/product/photo/" + productId);

    expect(resPhoto.status).toBe(400);
  });

  it("should return 404 if the product does not have a picture", async () => {
    /**
     * creating a POST with no image attached
     */
    const resNoImage = await supertest
      .post("/api/product/create/" + userId)
      .set("Authorization", `Bearer ${token}`)
      .field("name", name)
      .field("description", "desc")
      .field("price", 52)
      .field("category", "5dd757d885e5dd20dc1a59aa")
      .field("quantity", 12)
      .field("shipping", false);

    const res = await supertest.get(
      "/api/product/photo/" + resNoImage.body._id
    );

    expect(res.status).toBe(404);
  });

  /**
   * Testing all POST routes
   */

  describe("POST /create/:userId", () => {
    it("should create a product if valid User Id and ", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", res.body.name);
    });

    it("should return 400 if the product does not have all required fields", async () => {
      name = "";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the id does not match the token", async () => {
      userId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 403 if the token does not belong to the user", async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if the id is not valid", async () => {
      userId = "randomid";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if user is not signed in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 403 if user is not Admin", async () => {
      user.role = 0;
      await user.save();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 400 if the photo is larger than 1MB ", async () => {
      //himalayas.jpg is 3.23MB. Any picture larger than 1MB can be here
      photo = "himalayas.jpg";
      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  /**
   * Testing DELETE routes
   */

  describe("DELETE /product", () => {
    it("should delete the product if valid id is provided", async () => {
      let products = await Product.collection.insertMany(createProducts());

      const res = await supertest
        .delete(`/api/product/${products.ops[0]._id}/${user._id}`)
        .set("Authorization", `Bearer ${resSignin.body.token}`);

      products = await Product.find();

      expect(res.status).toBe(200);
      expect(products.length).toBe(1);
    });

    it("should return 400 if the product id is not found", async () => {
      await Product.collection.insertMany(createProducts());
      const invalidId = mongoose.Types.ObjectId();
      const res = await supertest
        .delete(`/api/product/${invalidId}/${user._id}`)
        .set("Authorization", `Bearer ${resSignin.body.token}`);

      expect(res.status).toBe(400);
    });

    it("should return 400 if the userID is not valid", async () => {
      const products = await Product.collection.insertMany(createProducts());
      const invalidUserId = mongoose.Types.ObjectId();
      const res = await supertest
        .delete(`/api/product/${products.ops[0]._id}/${invalidUserId}`)
        .set("Authorization", `Bearer ${resSignin.body.token}`);

      expect(res.status).toBe(400);
    });

    it("should return 400 if the Athorization token is invalid", async () => {
      const products = await Product.collection.insertMany(createProducts());
      const invalidToken = "invalidToken";
      const res = await supertest
        .delete(`/api/product/${products.ops[0]._id}/${user._id}`)
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(res.status).toBe(400);
    });

    it("should return 403 if the Athorization token doesnt belog to the user", async () => {
      const products = await Product.collection.insertMany(createProducts());
      const randomToken = new User().generateAuthToken();
      const res = await supertest
        .delete(`/api/product/${products.ops[0]._id}/${user._id}`)
        .set("Authorization", `Bearer ${randomToken}`);

      expect(res.status).toBe(403);
    });
  });

  /**
   * Testing PUT routes
   */

  describe("PUT /product", () => {
    let productId;
    const execPost = async () => {
      return await supertest
        .put(`/api/product/${productId}/${userId}`)
        .set("Authorization", `Bearer ${token}`)
        .field("name", name)
        .field("description", "desc")
        .field("price", 52)
        .field("category", "5dd757d885e5dd20dc1a59aa")
        .field("quantity", 12)
        .field("shipping", false);
    };

    it("should update a product if valid product id and user id. Authorized user is needed", async () => {
      const products = await Product.collection.insertMany(createProducts());
      productId = products.ops[0]._id;
      name = "updatedProduct";
      res = await execPost();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", name);
    });

    ///vupied

    it("should return 400 if the product id is not found", async () => {
      await Product.collection.insertMany(createProducts());
      //creating a fake product ID
      productId = mongoose.Types.ObjectId();

      res = await execPost();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the userID is not valid", async () => {
      await Product.collection.insertMany(createProducts());
      //creating a fake user ID
      userId = mongoose.Types.ObjectId();

      res = await execPost();

      expect(res.status).toBe(400);
    });

    it("should return 400 if the Athorization token is invalid", async () => {
      await Product.collection.insertMany(createProducts());
      //creating a fake invalid token
      token = "invalidToken";

      res = await execPost();

      expect(res.status).toBe(400);
    });

    it("should return 403 if the Athorization token doesnt belog to the user", async () => {
      const products = await Product.collection.insertMany(createProducts());

      //creating a fake valid token
      token = new User().generateAuthToken();

      //restoring user id and product Id to be valid query values
      productId = products.ops[0]._id;

      userId = user._id;

      res = await execPost();
      expect(res.status).toBe(403);
    });
  });
});

/**
 * helper functions to create models
 */

const createCategory = () => {
  return new Category({
    name: "category1"
  });
};

const createProducts = () => {
  const category = createCategory();
  const products = [
    {
      name: "product1",
      description: "The best hands-on guide to NodeJS",
      price: 52,
      //any valid mongo id
      category: category._id,
      quantity: 100,
      shipping: false
    },
    {
      name: "product2",
      description: "The best hands-on guide to NodeJS",
      price: 52,
      //any valid mongo id
      category: category._id,
      quantity: 100,
      shipping: false
    }
  ];

  return products;
};
