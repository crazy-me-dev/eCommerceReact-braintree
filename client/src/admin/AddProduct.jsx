import React, { useState, useRef, useEffect } from "react";

import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { createProduct, getCategories } from "../admin/apiAdmin";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };
  return [htmlElRef, setFocus];
};

const AddProduct = () => {
  const {
    user: { _id: userId, name: userName },
    token
  } = isAuthenticated();
  const [inputRef, setInputFocus] = useFocus();

  const [values, setValues] = useState({
    name: "",
    description: "",
    categories: [],
    category: "",
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
    shipping,
    quantity,
    loading,
    error,
    createdProduct,
    formData
  } = values;

  const handleChange = event => {
    const value = event.target.name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(event.target.name, value);
    setValues({
      ...values,
      [event.target.name]: value,
      error: "",
      loading: false,
      createdProduct: ""
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true, createdProduct: "" });
    const data = await createProduct(formData, userId, token);
    if (data.error) {
      setValues({ ...values, error: data.error, loading: false });
    } else {
      setValues({
        ...values,
        createdProduct: data.name,
        loading: false,
        name: "",
        description: "",
        category: "",
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

  const init = async () => {
    const data = await getCategories();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setValues({ ...values, categories: data, formData: new FormData() });
    }
  };

  useEffect(() => {
    init();
  }, []);

  const newProductForm = () => {
    return (
      <form className="card-body mx-auto">
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
              name="category"
              className="form-control"
              value={category}
              onChange={handleChange}
            >
              <option>Please Select</option>
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

        <div className="text-right">
          <button
            className="btn btn-primary
                "
            type="submit"
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout
      title="Add Product"
      description={`G'day ${userName}, ready to add a new product?`}
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
