import React, { useState } from "react";
import { Button, Form, Grid, Header, Icon, Message, Segment } from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";

/**custom imports */
import { signin, authenticate, isAuthenticated } from "../auth";
import Layout from "../core/Layout";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToReferral: false
  });
  /**store the last location before rendering this page.
   * It is used to know which page invoked this route so we can redirect to it if necessary
   */
  const lastLocation = useLastLocation();

  const { user } = isAuthenticated();

  const { email, password, loading, error, redirectToReferral } = values;

  const handleChange = (e, { value, name }) => {
    setValues({ ...values, error: false, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    const data = await signin({ email, password });
    if (data.error) {
      setValues({ ...values, error: data.error, loading: false });
    } else {
      authenticate(data, () => {
        setValues({ ...values, redirectToReferral: true });
      });
    }
  };

  const signinForm = () => {
    return (
      <Grid textAlign="center" style={{ height: "100vh", marginTop: "2rem" }}>
        <Grid.Column style={{ maxWidth: 500 }}>
          <Header as="h2" color="teal" textAlign="center">
            <Icon name="unlock alternate" size="large" color="teal" /> Log-in to your account
          </Header>
          <Form size="large">
            {showError()}
            {showLoading()}
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
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
            Dont Have an account? <Link to="/signup">Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  };

  const showLoading = () =>
    loading && (
      <Message color="blue" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
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
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (user) return <Redirect to="/" />;
  };

  return (
    <Layout title="Signin Page" description="Node React E-commerce App">
      {signinForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
