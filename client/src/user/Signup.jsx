import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Form, Grid, Header, Icon, Message, Segment } from "semantic-ui-react";
import { signup } from "../auth";
import Layout from "../core/Layout";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false
  });

  const { name, email, password, success, error } = values;

  const handleChange = (event, { name, value }) => {
    setValues({ ...values, error: false, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: false });
    const data = await signup({ name, email, password });

    if (data.error) {
      setValues({ ...values, error: data.error, success: false });
    } else {
      setValues({ ...values, name: "", email: "", password: "", error: "", success: true });
    }
  };

  const signupForm = () => {
    return (
      <Grid textAlign="center" style={{ height: "100vh", marginTop: "2rem" }}>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header as="h2" color="teal" textAlign="center">
            <Icon name="unlock alternate" size="large" color="teal" /> Log-in to your account
          </Header>
          <Form size="large">
            {showError()}
            {showSuccess()}
            <Segment stacked>
              <Form.Input
                autoFocus
                fluid
                icon="user"
                iconPosition="left"
                placeholder="Full name"
                name="name"
                value={name}
                onChange={handleChange}
              />
              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                placeholder="E-mail address"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
              />

              <Button color="teal" fluid size="large" onClick={handleSubmit}>
                Login
              </Button>
            </Segment>
          </Form>
          <Message style={{ fontSize: "1.5rem" }}>
            Have an account? <Link to="/signin">Sign In</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  };

  const showSuccess = () => (
    <Message color="blue" style={{ display: success ? "" : "none", fontSize: "1.3rem" }}>
      New Account has been created. Please <Link to="signin">Sign in</Link>
    </Message>
  );
  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      {error}
    </Message>
  );
  return (
    <Layout title="Signup Page" description="Node React E-commerce App">
      {signupForm()}
    </Layout>
  );
};

export default Signup;
