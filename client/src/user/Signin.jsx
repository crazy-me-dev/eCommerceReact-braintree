import React, { useState } from "react";
import { Button, Form, Grid, Header, Icon, Message, Segment } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";

/**custom imports */
import useForm from "../common/hooks/useForm";
import { validateSignin } from "../common/validation/validate";
import { signin, authenticate, isAuthenticated } from "../auth";
import Layout from "../layout/Layout";

const initialState = {
  email: "",
  password: ""
};

const Signin = () => {
  const { handleChange, handleSubmit, values, errors } = useForm(
    submit,
    initialState,
    validateSignin
  );

  const [error, setError] = useState(false);
  const [loading, setloading] = useState(false);
  const [redirectToReferral, setRedirectToReferral] = useState(false);
  /**store the last location before rendering this page.
   * It is used to know which page invoked this route so we can redirect to it if necessary
   */
  const lastLocation = useLastLocation();
  const { user } = isAuthenticated();
  const { email, password } = values;

  //function declaration
  async function submit() {
    setError(false);
    setloading(true);
    const data = await signin({ email, password });
    if (data.error) {
      setError(data.error);
      setloading(false);
    } else {
      authenticate(data, () => {
        setRedirectToReferral(true);
      });
    }
  }

  const showLoading = () =>
    loading && (
      <Message
        size="tiny"
        color="blue"
        style={{ display: error ? "" : "none", fontSize: "1.3rem" }}
      >
        Loading...
      </Message>
    );
  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      {error}
    </Message>
  );

  const redirectUser = () => {
    if (redirectToReferral) {
      if (lastLocation && lastLocation.pathname === "/cart") {
        return <Redirect to="/cart" />;
      }
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/" />;
      }
    }
    if (user) return <Redirect to="/" />;
  };

  const signinForm = () => {
    return (
      <Grid textAlign="center" style={{ height: "100vh", marginTop: "2rem" }}>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header as="h2" color="teal" textAlign="center">
            <Icon name="unlock alternate" size="large" color="teal" /> Sign-in to your account
          </Header>
          <Form size="large" onSubmit={handleSubmit} onChange={() => setError(false)}>
            {showError()}
            {showLoading()}
            <Segment stacked>
              <Form.Input
                fluid
                placeholder="E-mail address"
                name="email"
                value={email}
                onChange={handleChange}
                error={errors && errors.email && errors.email}
              />
              <Form.Input
                fluid
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
            Dont Have an account? <Link to="/signup">Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  };

  return (
    <Layout title="Signin Page" description="Node React E-commerce App">
      {signinForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
