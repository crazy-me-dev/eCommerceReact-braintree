import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import {
  Container,
  TextArea,
  Divider,
  Header,
  Segment,
  Form,
  Button,
  Icon
} from "semantic-ui-react";
import DashboardLayout from "../user/DashboardLayout";

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
  //creating the ref by passing initial value null
  const fileInputRef = useRef(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event, { name, value }) => {
    if (name === "categoryInput") formData.set("category", value);
    else formData.set(name, value);
    setValues({
      ...values,
      [name]: value,
      error: "",
      loading: false,
      createdProduct: ""
    });
  };

  const fileChange = e => {
    console.log("File chosen --->", e.target.files[0], e.target.name);
    formData.set(e.target.name, e.target.files[0]);
    setValues({
      ...values,
      [e.target.name]: e.target.files[0],
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
      {`${
        !isUpdating
          ? `New Product ${createdProduct} has been created.`
          : `Product ${createdProduct} has been updated.`
      }`}
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

  const categoryOptions =
    categories &&
    categories.map(c => {
      return { key: c._id, value: c._id, text: c.name };
    });

  const shippingOptions = [
    { key: "yes", value: true, text: "Yes" },
    { key: "no", value: false, text: "No" }
  ];

  const newProductForm = () => {
    return (
      <Form size="large">
        {shouldRedirect()}
        <Segment stacked>
          <Form.Group>
            <Form.Input
              width={16}
              fluid
              label="Name"
              placeholder="Product name"
              name="name"
              value={name}
              onChange={handleChange}
              // ref={inputRef}
            />
          </Form.Group>

          <Form.Field
            style={{ minHeight: 150 }}
            control={TextArea}
            label="Description"
            placeholder="Enter the full product description"
            name="description"
            value={description}
            onChange={handleChange}
          />

          <Form.Group>
            <Form.Select
              width={4}
              fluid
              label="Category"
              placeholder="Select"
              name="categoryInput"
              value={categoryInput}
              options={categoryOptions}
              onChange={handleChange}
              // ref={inputRef}
            />
            <Form.Select
              width={4}
              fluid
              label="Shipping"
              placeholder="Shipping"
              name="shipping"
              value={shipping}
              options={shippingOptions}
              onChange={handleChange}
              // ref={inputRef}
            />
            <Form.Input
              width={4}
              fluid
              label="Price"
              placeholder="Price"
              name="price"
              value={price}
              type="number"
              onChange={handleChange}
              // ref={inputRef}
            />
            <Form.Input
              width={4}
              fluid
              label="Quantity"
              placeholder="Quantity"
              name="quantity"
              value={quantity}
              type="number"
              onChange={handleChange}
              // ref={inputRef}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field>
              <Button
                color="yellow"
                size="large"
                width={4}
                content="Choose Photo"
                labelPosition="left"
                icon="file"
                onClick={() => fileInputRef.current.click()}
              />
              <input ref={fileInputRef} type="file" hidden onChange={fileChange} name="photo" />
            </Form.Field>

            <Button color="blue" size="large" type="submit" onClick={handleSubmit}>
              {isUpdating ? "Update" : "Create"}
            </Button>
          </Form.Group>
        </Segment>
      </Form>
    );
  };

  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        <Container fluid style={{ marginTop: "2rem" }}>
          <Header as="h1">{isUpdating ? "Update" : "Create"} Product</Header>

          <Divider style={{ marginBottom: "2rem" }} />

          {showError()}
          {showSuccess()}
          {showLoading()}
          {newProductForm()}
        </Container>
      </DashboardLayout>
    </Layout>
  );
};

export default AddProduct;
