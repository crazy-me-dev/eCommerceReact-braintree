import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import {
  Container,
  TextArea,
  Divider,
  Header,
  Segment,
  Form,
  Button,
  Message,
  Input
} from "semantic-ui-react";

//custom imports
import { mediaUI as media } from "../utils/mediaQueriesBuilder";
import Layout from "../core/Layout";
import DashboardLayout from "../user/DashboardLayout";
import { isAuthenticated } from "../auth";
import { createProduct, updateProduct, getCategories, getProduct } from "../admin/apiAdmin";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const FormFieldUI = styled(Form.Field)`
  width: 100%;
  margin-top: 1rem !important;
  ${media.large`
    width: 20%;
  `}
  ${media.wide`
    width: 15%;
  `}
`;

/**this values are taken from semantic UI label */
const LabelCustom = styled.label`
  display: block;
  margin: 0 0 0.28571429rem 0;
  color: rgba(0, 0, 0, 0.87);
  font-size: 0.92857143em;
  font-weight: 700;
  text-transform: none;
`;

const ButtonContainer = styled.div`
  ${media.mobile`width: 50%;`}
  ${media.tablet`width: 30%;`}
  ${media.large` width: 20%;`}
  ${media.wide`width: 15%;`}
`;

/** custom hook for focus an element */
const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };
  return [htmlElRef, setFocus];
};

const AddProduct = props => {
  /**input ref for product name. */
  const [inputRef, setInputFocus] = useFocus();

  //input ref for product  file
  const fileInputRef = useRef(null);

  const {
    user: { _id: userId },
    token
  } = isAuthenticated();

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

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** If creating a new product, it fetches categories and set values
   *  If updating a product, it fetches the product with the productId passed as parameter and the categories
   */
  const load = async () => {
    /**getting the productId passed as param */
    const productId = props.match.params.productId ? props.match.params.productId : null;
    let product;
    /**if we have the productId as parameter means it is updating */
    if (productId) {
      setIsUpdating(true);
      product = await getProduct(productId);
    }
    /**feteching categories */
    const categoryList = await getCategories();
    /** checking if there is an error. If it is, the values object is set accordindly */
    if (categoryList.error) {
      setValues({ ...values, error: categoryList.error, loading: false });
      return;
    }
    if (productId && product.error) {
      setValues({ ...values, error: product.error, loading: false });
      return;
    }

    let incomingData = undefined;
    /** If updating, the FormData is filled with the product that matches the productId param */
    if (productId) incomingData = fillFormData(product);

    /** if everything goes well, we set all values obtained */
    setValues({
      ...values,
      categories: categoryList,
      formData: productId ? incomingData : new FormData(),
      categoryInput: productId ? product.category._id : "",
      loading: false,
      ...product
    });
  };

  /**this function fills the FormData object */
  const fillFormData = product => {
    return Object.keys(product).reduce((formData, key) => {
      //These following keys are not part of the FormData object. So we skip them.
      if (
        key === "createdAt" ||
        key === "updatedAt" ||
        key === "_id" ||
        key === "hasPhoto" ||
        key === "sold" ||
        key === "__v"
      )
        return formData;
      //Since category is a nested object, we take the _id from it
      else if (key === "category") formData.append(key, product[key]._id);
      //finally, we append the rest of valid keys
      else formData.append(key, product[key]);
      return formData;
    }, new FormData());
  };

  const validatePositiveNumber = value => {
    /** this regex avoid characters other than numbers*/
    const re = /^[0-9\b]+$/;
    if (re.test(value)) {
      let newValue;
      //if the input value is less than 1, set newValue to 1
      if (value < 0) newValue = 1;
      //Double checking we got an int value
      else newValue = parseInt(value);
      return newValue;
    }
    return null;
  };

  /*** sets the form inputs to values object   */
  const handleChange = (event, { name, value }) => {
    let newValue = value;
    if (name === "quantity" || name === "price") newValue = validatePositiveNumber(value);
    if (name === "categoryInput") formData.set("category", newValue);
    else formData.set(name, newValue);
    setValues({
      ...values,
      [name]: newValue,
      error: "",
      loading: false,
      createdProduct: ""
    });
  };

  /** sets the file selected */
  const fileChange = e => {
    formData.set(e.target.name, e.target.files[0]);
    setValues({
      ...values,
      [e.target.name]: e.target.files[0],
      error: "",
      loading: false,
      createdProduct: ""
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true, createdProduct: "" });
    let data;
    /**if is updating, it calls the updatedProduct method */
    if (isUpdating) {
      data = await updateProduct(formData, userId, token, values._id);
    } else data = await createProduct(formData, userId, token);
    /**if creating a new product, it calls the createProduct method */
    /** set error if there is any */
    if (data.error) {
      setValues({ ...values, error: data.error, loading: false });
    } else {
      /**if it is updating, redirects back to the Product Management dashboard */
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

  const shouldRedirect = () => {
    if (redirect) return <Redirect to="/admin/product"></Redirect>;
  };

  const showSuccess = () => (
    <Message color="green" style={{ display: createdProduct ? "" : "none", fontSize: "1.3rem" }}>
      {`${
        !isUpdating ? `${createdProduct} has been created.` : `${createdProduct} has been updated.`
      }`}
    </Message>
  );

  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      Product {error}
    </Message>
  );
  const showLoading = () => (
    <Message style={{ display: loading ? "" : "none", fontSize: "1.3rem" }}>
      <h4>Loading...</h4>
    </Message>
  );

  const goBack = () => (
    <ButtonContainer>
      <Button
        fluid
        as={Link}
        to="/admin/product"
        color="red"
        icon="left arrow"
        labelPosition="right"
        style={{ marginBottom: "1rem" }}
        content="Back to Dashboard"
      />
    </ButtonContainer>
  );

  /** category options use with category select element*/
  const categoryOptions =
    categories &&
    categories.map(c => {
      return { key: c._id, value: c._id, text: c.name };
    });

  /** category options use with shipping select element*/
  const shippingOptions = [
    { key: "yes", value: true, text: "Yes" },
    { key: "no", value: false, text: "No" }
  ];

  const newProductForm = () => {
    return (
      <Form size="large">
        {shouldRedirect()}
        <Segment stacked>
          <LabelCustom>Name</LabelCustom>
          <Input
            fluid
            placeholder="Product name"
            name="name"
            value={name}
            onChange={handleChange}
            ref={inputRef}
            autoFocus
          />

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
              min="0"
            />
            <Form.Input
              width={4}
              fluid
              label="Quantity"
              placeholder="Quantity"
              name="quantity"
              min="0"
              value={quantity}
              type="number"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <FormFieldUI>
              <Button
                fluid
                basic
                color="olive"
                size="large"
                width={4}
                content="Choose Photo"
                labelPosition="right"
                icon="file"
                onClick={() => fileInputRef.current.click()}
              />
              {/* since semantic UI Input doesnt accept file inputs, we make a trick with a semantic UI Button and a normal input element
                  so  the bottom is attached to the input with the fileInputRef           
              */}
              <input ref={fileInputRef} type="file" hidden onChange={fileChange} name="photo" />
            </FormFieldUI>
            <FormFieldUI>
              <Button
                icon="edit"
                labelPosition="right"
                fluid
                color="blue"
                size="large"
                type="submit"
                onClick={handleSubmit}
                content={isUpdating ? "Update" : "Create"}
              />
            </FormFieldUI>
            <FormFieldUI>
              <Button
                as={Link}
                to="/admin/product"
                icon="x"
                labelPosition="right"
                fluid
                color="red"
                size="large"
                content="Cancel"
              />
            </FormFieldUI>
          </Form.Group>
        </Segment>
      </Form>
    );
  };

  return (
    /**the layout changes when isDashboard props is  set to true */
    <Layout isDashboard={true}>
      <DashboardLayout>
        <Container fluid style={{ marginTop: "2rem" }}>
          <Header as="h1">{isUpdating ? "Update" : "Create"} Product</Header>
          <Divider style={{ marginBottom: "2rem" }} />
          {goBack()}
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
