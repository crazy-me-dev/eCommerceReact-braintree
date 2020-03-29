import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Form, Grid, Header, Icon, Message, Segment } from "semantic-ui-react";
import Layout from "../layout/Layout";

import { SIGNUP, RESET_FLAGS } from "../store/actions/authAction";
import useForm from "../common/hooks/useForm";
import { validateSignup } from "../common/validation/validate";

const initialState = {
  email: "",
  password: "",
  name: ""
};

const Signup = () => {
  const dispatch = useDispatch();
  let { error, success } = useSelector(state => ({
    ...state.authReducer
  }));

  const { handleChange, handleSubmit, values, errors } = useForm(
    submit,
    initialState,
    validateSignup
  );

  const { name, email, password } = values;

  //function declaration
  async function submit() {
    dispatch({
      type: SIGNUP,
      payload: values
    });
  }

  useEffect(() => {
    return () => {
      resetFlags();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSuccess = () => (
    <Message color="blue" style={{ display: success ? "" : "none", fontSize: "1.3rem" }}>
      New Account has been created. <Link to="signin">Sign in here</Link>
    </Message>
  );
  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      {error}
    </Message>
  );

  const resetFlags = () => {
    dispatch({
      type: RESET_FLAGS
    });
  };

  const signupForm = () => {
    return (
      <Grid textAlign="center" style={{ height: "100vh", marginTop: "2rem" }}>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header as="h2" color="teal" textAlign="center">
            <Icon name="unlock alternate" size="large" color="teal" /> Sign-up to your account
          </Header>
          <Form size="large" onSubmit={handleSubmit} onChange={resetFlags}>
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
                Sign Up
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
