import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { createProduct, updateProduct, getCategories, getProduct } from "../admin/apiAdmin";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };
  return [htmlElRef, setFocus];
};

const AddProduct = props => {
  const {
    user: { _id: userId, name: userName },
    token
  } = isAuthenticated();
  const [inputRef, setInputFocus] = useFocus();

  const [isUpdating, setIsUpdating] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [values, setValues] = useState({
    name: "",
    description: "",
    categories: [],
    category: "",
    categoryInput: "",
    shipping: "",
    price: "",
    quantity: "",
    photo: "",
    loading: false,
    error: "",
    createdProduct: "",
    redirectToProfile: false,
    formData: ""
  });

  const {
    name,
    price,
    description,
    categories,
    category,
    categoryInput,
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    formData
  } = values;

  const load = async () => {
    const productId = props.match.params.productId ? props.match.params.productId : null;
    let product;
    if (productId) {
      setIsUpdating(true);
      product = await getProduct(productId);
    }
    const categoryList = await getCategories();
    if (categoryList.error) {
      setValues({ ...values, error: categoryList.error, loading: false });
      return;
    }
    if (productId && product.error) {
      setValues({ ...values, error: product.error, loading: false });
      return;
    }

    let incomingData = undefined;
    if (productId) incomingData = fillFormData(product);

    setValues({
      ...values,
      categories: categoryList,
      formData: productId ? incomingData : new FormData(),
      categoryInput: productId ? product.category._id : "",
      loading: false,
      ...product
    });
  };

  const fillFormData = product => {
    return Object.keys(product).reduce((formData, key) => {
      if (
        key === "createdAt" ||
        key === "updatedAt" ||
        key === "_id" ||
        key === "hasPhoto" ||
        key === "sold" ||
        key === "__v"
      )
        return formData;
      else if (key === "category") formData.append(key, product[key]._id);
      else formData.append(key, product[key]);

      return formData;
    }, new FormData());
  };
  useEffect(() => {
    load();
  }, []);

  const handleChange = event => {
    const value = event.target.name === "photo" ? event.target.files[0] : event.target.value;
    if (event.target.name === "categoryInput") formData.set("category", value);
    else formData.set(event.target.name, value);
    setValues({
      ...values,
      [event.target.name]: value,
      error: "",
      loading: false,
      createdProduct: ""
    });
  };

  const shouldRedirect = () => {
    if (redirect) return <Redirect to="/admin/product"></Redirect>;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true, createdProduct: "" });
    let data;
    if (isUpdating) {
      data = await updateProduct(formData, userId, token, values._id);
      // console.log(values.formData);
      // return;
    } else data = await createProduct(formData, userId, token);
    if (data.error) {
      setValues({ ...values, error: data.error, loading: false });
    } else {
      if (isUpdating) {
        setRedirect(true);
      }
      setValues({
        ...values,
        createdProduct: data.name,
        loading: false,
        name: "",
        description: "",
        categoryInput: "",
        shipping: "",
        price: "",
        quantity: "",
        photo: "",
        error: "",
        formData: new FormData()
      });
      setInputFocus();
    }
  };

  const showSuccess = () => (
    <div className="alert alert-info" style={{ display: createdProduct ? "" : "none" }}>
      New Product {createdProduct} has been created.
    </div>
  );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      Product {error}
    </div>
  );
  const showLoading = () => (
    <div className="alert alert-success" style={{ display: loading ? "" : "none" }}>
      <h4>Loading...</h4>
    </div>
  );

  const goBack = () => (
    <div className=" mt-5">
      <Link to="/admin/product" className="text-warning">
        Back to Product &larr;
      </Link>
    </div>
  );

  const newProductForm = () => {
    return (
      <form className="card-body mx-auto">
        {shouldRedirect()}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            type="text"
            className="form-control"
            autoFocus
            value={name}
            onChange={handleChange}
            ref={inputRef}
          />
        </div>

        <div className="form-group ">
          <label className="text-muted" htmlFor="description">
            Description
          </label>
          <textarea
            name="description"
            className="form-control"
            value={description}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label className="text-muted" htmlFor="category">
              Category
            </label>
            <select
              name="categoryInput"
              className="form-control"
              value={categoryInput}
              onChange={handleChange}
            >
              {!isUpdating ? <option>Please Select</option> : null}
              {categories &&
                categories.map((c, i) => (
                  <option key={i} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group col-md-6">
            <label className="text-muted" htmlFor="shipping">
              Shipping
            </label>
            <select
              name="shipping"
              className="form-control"
              value={shipping}
              onChange={handleChange}
            >
              <option>Please Select</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="quantity">Quantity</label>
            <input
              name="quantity"
              type="number"
              className="form-control"
              value={quantity}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="price">Price</label>
            <input
              name="price"
              type="number"
              className="form-control"
              value={price}
              onChange={handleChange}
            />
          </div>
        </div>

        <h4>Select Image</h4>
        <div className="form-group">
          <label className="btn btn-secondary">
            <input type="file" name="photo" accept="image/*" onChange={handleChange} id="photo" />
          </label>
        </div>
        {goBack()}

        <div className="text-right">
          <button
            className="btn btn-primary
                "
            type="submit"
            onClick={handleSubmit}
          >
            {isUpdating ? "Update" : "Create"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout
      title={isUpdating ? "Update Product" : "Add Product"}
      description={`G'day ${userName}, ready to ${isUpdating ? "update" : "add"} a product?`}
      className="container"
    >
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card ">
            <article className=" bg-light">
              {showError()}
              {showSuccess()}
              {showLoading()}
              {newProductForm()}
            </article>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddProduct;
