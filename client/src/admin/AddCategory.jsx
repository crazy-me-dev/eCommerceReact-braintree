import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import {
  Container,
  Divider,
  Header,
  Segment,
  Form,
  Button,
  Message,
  Input,
  Grid
} from "semantic-ui-react";

//custom imports
import Layout from "../layout/Layout";
import DashboardLayout from "../layout/DashboardLayout";
import { createCategory, getCategory, updateCategory } from "../admin/apiAdmin";
import { ButtonContainer, LabelCustom } from "../common/components/customComponents";
import useFocus from "../common/hooks/useFocus";

const AddCategory = props => {
  const [inputRef, setInputFocus] = useFocus();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [category, setCategory] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const { user, token } = useSelector(state => ({
    ...state.authReducer
  }));
  const { _id: userId } = user ? user : null;

  const load = async () => {
    const categoryId = props.match.params.categoryId ? props.match.params.categoryId : null;
    let category;
    if (categoryId) {
      setIsUpdating(true);
      category = await getCategory(userId, token, categoryId);
      if (category.error) {
        setError(category.error);
      } else {
        setCategory(category);
        setName(category.name);
      }
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = e => {
    setError("");
    setSuccess(false);
    setName(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    //make requeest
    let data;
    if (isUpdating) data = updateCategory({ name }, userId, token, category._id);
    else data = await createCategory({ name }, userId, token);
    if (data.error) {
      setError(data.error);
      setSuccess(false);
    } else {
      if (isUpdating) {
        setRedirect(true);
      }
      setSuccess(true);
      setName("");
      setInputFocus();
    }
  };

  const shouldRedirect = () => {
    if (redirect) return <Redirect to="/admin/category"></Redirect>;
  };

  const goBack = () => (
    <ButtonContainer>
      <Button
        fluid
        as={Link}
        to="/admin/category"
        color="red"
        icon="left arrow"
        labelPosition="right"
        style={{ marginBottom: "1rem" }}
        content="Back to Dashboard"
      />
    </ButtonContainer>
  );

  const showSuccess = () => (
    <Message color="green" style={{ display: success ? "" : "none", fontSize: "1.3rem" }}>
      New Category has been created.
    </Message>
  );

  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      Category {error}
    </Message>
  );

  const newCategoryForm = () => {
    return (
      <Form size="large" onSubmit={handleSubmit}>
        {shouldRedirect()}
        <Segment stacked>
          <LabelCustom>Name</LabelCustom>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={10} computer={12}>
                <Input
                  style={{ marginTop: "1rem" }}
                  fluid
                  placeholder="Product name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  ref={inputRef}
                  autoFocus
                />
              </Grid.Column>
              <Grid.Column mobile={16} tablet={6} computer={4}>
                <Button style={{ marginTop: "1rem" }} fluid color="blue" type="submit">
                  {isUpdating ? "Update" : "Create"}
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Form>
    );
  };

  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        <Container fluid style={{ marginTop: "2rem" }}>
          {shouldRedirect()}
          <Header as="h1">Create Category</Header>
          <Divider />
          {goBack()}
          {showError()}
          {showSuccess()}
          {newCategoryForm()}
        </Container>
      </DashboardLayout>
    </Layout>
  );
};

export default AddCategory;
