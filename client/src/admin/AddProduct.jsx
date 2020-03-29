import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import queryString from "query-string";
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
  Input,
  Label,
  Image
} from "semantic-ui-react";

//custom imports
import { mediaUI as media } from "../utils/mediaQueriesBuilder";
import Layout from "../layout/Layout";
import DashboardLayout from "../layout/DashboardLayout";
import { createProduct, updateProduct, getCategories, getProduct } from "../admin/apiAdmin";

import { ButtonContainer, LabelCustom } from "../common/components/customComponents";
import useFocus from "../common/hooks/useFocus";
import { validateProduct } from "../common/validation/validate";
import useForm from "../common/hooks/useForm";
import useAsyncState from "../common/hooks/useAsyncState";
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

/**Initial state */

const initialState = {
  name: "",
  description: "",
  category: "",
  shipping: false,
  price: 0,
  quantity: 0
};

const AddProduct = props => {
  const { user, token } = useSelector(state => ({
    ...state.authReducer
  }));

  const { _id: userId } = user ? user : null;

  /**input ref for product name. */
  const [inputRef, setInputFocus] = useFocus();

  //input ref for product  file
  const fileInputRef = useRef(null);

  const { handleChange, handleSubmit, values, setValues, errors } = useForm(
    submit,
    initialState,
    validateProduct
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [pageNumber, setPageNumber] = useState("");
  const [productId, setProductId] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useAsyncState(new FormData());
  const [photoData, setPhotoData] = useState("");
  const [status, setStatus] = useState({
    error: false,
    loading: false,
    success: false
  });

  const { error, loading, success } = status;

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** If creating a new product, it fetches categories and set values
   *  If updating a product, it fetches the product with the productId passed as parameter and the categories
   */
  const load = async () => {
    setStatus({ ...status, error: false, loading: true });
    /**getting the productId passed as param */
    const id = props.match.params.productId ? props.match.params.productId : null;
    /**getting the query params to know which page to load */
    const parsed = queryString.parse(props.location.search);
    if (parsed && parsed.page) setPageNumber(parsed.page);
    let product;
    /**if we have the productId as parameter means it is updating */
    if (id) {
      setProductId(id);
      setIsUpdating(true);
      product = await getProduct(id);
    }
    /**fetching categories */
    const categoryList = await getCategories();
    /** checking if there is an error. If it is, the values object is set accordindly */
    if (categoryList.error) {
      setStatus({ ...status, error: categoryList.error, loading: false });
      return;
    }
    if (id && product.error) {
      setValues({ ...values, error: product.error, loading: false });
      return;
    }

    /** If updating, values object is filled with the product that matches the id param */
    if (id) {
      setHasPhoto(product.hasPhoto);
      setValues(fillUpdatingValues(product));
    }

    setCategories(categoryList);
    setStatus({ ...status, loading: false });
  };

  const { name, price, description, category, shipping, quantity } = values;

  async function submit() {
    let data;

    setStatus({ ...status, error: false, loading: true });
    //If there is a photo then add the photo element to the object passed as parameter
    //If not, just pass the values object
    let formDataUpdate = photoData
      ? fillFormData({ ...values, photo: photoData })
      : fillFormData(values);
    //seeting the form data and wait till it updates
    let updatedFormData = await setFormData(formDataUpdate);

    /**if is updating, it calls the updatedProduct method */
    if (isUpdating) data = await updateProduct(updatedFormData, userId, token, productId);
    else data = await createProduct(updatedFormData, userId, token);
    /**if creating a new product, it calls the createProduct method */
    /** set error if there is any */
    if (data.error) setStatus({ ...status, error: data.error, loading: false });
    else {
      /**if it is updating, redirects back to the Product Management dashboard */
      if (isUpdating) setRedirect(true);
      else {
        setStatus({ ...status, error: false, loading: false, success: true });
        setValues(initialState);
        setFormData(new FormData());
        setInputFocus();
      }
    }
  }

  /**this function removes unnecessary items in the product object received from back end */
  const fillUpdatingValues = product => {
    return Object.keys(product).reduce((items, key) => {
      //These following keys are not part of the values object. So we skip them.
      if (
        key === "createdAt" ||
        key === "updatedAt" ||
        key === "_id" ||
        key === "hasPhoto" ||
        key === "sold" ||
        key === "__v"
      )
        return items;
      //Since category is a nested object, we take the _id from it
      else if (key === "category") {
        items[key] = product[key]._id;
      }
      //finally, we append the rest of valid keys
      else {
        items[key] = product[key];
      }
      return items;
    }, {});
  };

  /**this function fills the FormData object */
  const fillFormData = product => {
    return Object.keys(product).reduce((fData, key) => {
      fData.append(key, product[key]);
      return fData;
    }, new FormData());
  };

  /** sets the file selected */
  const fileChange = e => {
    setPhotoData(e.target.files[0]);
  };

  const shouldRedirect = () => {
    if (redirect) return <Redirect to={`/admin/product?page=${pageNumber}`}></Redirect>;
  };

  const showSuccess = () => (
    <Message color="green" style={{ display: success ? "" : "none", fontSize: "1.3rem" }}>
      {`${!isUpdating ? `New Product has been created.` : `$The product has been updated.`}`}
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
        to={isUpdating ? `/admin/product?page=${pageNumber}` : `/admin/product`}
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
      <Form size="large" noValidate>
        {shouldRedirect()}
        <Segment stacked>
          <LabelCustom>Product</LabelCustom>
          <Input
            fluid
            placeholder="Product name"
            name="name"
            value={name}
            onChange={handleChange}
            ref={inputRef}
            autoFocus
            error={errors && errors.name ? true : false}
          />
          {errors && errors.name ? (
            <Label basic color="red" pointing>
              {errors.name}
            </Label>
          ) : null}

          <Form.Field
            style={{ minHeight: 150 }}
            control={TextArea}
            label="Description"
            placeholder="Enter the full product description"
            name="description"
            value={description}
            onChange={handleChange}
            error={errors && errors.description && errors.description}
          />

          <Form.Group>
            <Form.Select
              width={4}
              fluid
              label="Category"
              placeholder="Select"
              name="category"
              value={category}
              options={categoryOptions}
              onChange={handleChange}
              error={errors && errors.category && errors.category}
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
              error={errors && errors.shipping && errors.shipping}
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
              error={errors && errors.price && errors.price}
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
              error={errors && errors.quantity && errors.quantity}
            />
          </Form.Group>
          <Form.Group>
            {productId && !photoData && hasPhoto && (
              <FormFieldUI>
                <Image
                  src={`/api/product/photo/${productId}`}
                  size="tiny"
                  verticalAlign="middle"
                  centered
                />
              </FormFieldUI>
            )}

            <FormFieldUI>
              <Button
                fluid
                basic
                color="olive"
                size="large"
                width={4}
                content={photoData ? photoData.name : "Choose Photo"}
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
                to={isUpdating ? `/admin/product?page=${pageNumber}` : `/admin/product`}
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
