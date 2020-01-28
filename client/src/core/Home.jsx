import React, { useState, useEffect } from "react";
import { Grid, Header, Container, Message } from "semantic-ui-react";

//custom imports
import Layout from "../layout/Layout";
import MainCard from "./MainCard";
import Search from "./Search";
import { getProducts } from "./apiCore";

const Home = () => {
  const [productBySell, setProductBySell] = useState([]);
  const [productByArrival, setProductByArrival] = useState([]);
  const [error, setError] = useState(false);

  const getProductBySell = async () => {
    const data = await getProducts("sold");
    if (data.error) setError(true);
    else setProductBySell(data);
  };
  const getProductByArrival = async () => {
    const data = await getProducts("createdAt");
    if (data.error) setError(true);
    else setProductByArrival(data);
  };

  useEffect(() => {
    getProductByArrival();
    getProductBySell();
  }, []);

  const showProduct = displayBy => {
    switch (displayBy) {
      case "byArrival":
        return productByArrival.map(product => (
          <Grid.Column mobile={16} tablet={8} computer={4} key={product._id}>
            <MainCard product={product} />
          </Grid.Column>
        ));
      case "bySold":
        return productBySell.map(product => (
          <Grid.Column mobile={16} tablet={8} computer={4} key={product._id}>
            <MainCard product={product} />
          </Grid.Column>
        ));
      default:
        return null;
    }
  };

  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      {error}
    </Message>
  );

  return (
    <Layout title="Home Page" description="Node React E-commerce App">
      <Search />
      <Container>
        {error ? (
          showError()
        ) : (
          <>
            <Grid style={{ marginTop: "2rem" }} divided="vertically">
              <Header as="h1">New Arrivals</Header>
              <Grid.Row>{showProduct("byArrival")}</Grid.Row>

              <Header as="h1">Best Sellers</Header>

              <Grid.Row>{showProduct("bySold")}</Grid.Row>
            </Grid>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Home;
