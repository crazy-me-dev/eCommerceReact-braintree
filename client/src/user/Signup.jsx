import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Grid, Header, Icon, Message, Segment } from "semantic-ui-react";

import Layout from "../layout/Layout";
import { signup } from "../auth";
import useForm from "../common/hooks/useForm";
import { validateSignup } from "../common/validation/validate";

const initialState = {
  email: "",
  password: "",
  name: ""
};

const Signup = () => {
  const { handleChange, handleSubmit, setValues, values, errors } = useForm(
    submit,
    initialState,
    validateSignup
  );

  const { name, email, password } = values;

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  //function declaration
  async function submit() {
    setError(false);
    const data = await signup({ name, email, password });
    if (data.error) {
      setError(data.error);
      setSuccess(false);
    } else {
      setSuccess(true);
      setValues(initialState);
    }
  }

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

  const signupForm = () => {
    return (
      <Grid textAlign="center" style={{ height: "100vh", marginTop: "2rem" }}>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header as="h2" color="teal" textAlign="center">
            <Icon name="unlock alternate" size="large" color="teal" /> Sign-up to your account
          </Header>
          <Form size="large" onSubmit={handleSubmit} onChange={() => setError(false)}>
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
                error={errors && errors.name && errors.name}
              />
              <Form.Input
                fluid
                icon="mail"
                iconPosition="left"
                placeholder="E-mail address"
                name="email"
                value={email}
                onChange={handleChange}
                error={errors && errors.email && errors.email}
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
                error={errors && errors.password && errors.password}
              />

              <Button color="teal" fluid size="large" type="submit">
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

  return (
    <Layout title="Signup Page" description="Node React E-commerce App">
      {signupForm()}
    </Layout>
  );
};

export default Signup;
