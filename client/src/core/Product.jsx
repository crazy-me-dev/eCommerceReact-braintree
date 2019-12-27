import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { useLastLocation } from "react-router-last-location";

//custom imports
import Layout from "../layout/Layout";
import MainCard from "./MainCard";
import { getProduct, getRelatedProducts } from "./apiCore";
import { Container, Message, Grid, Header, Card, Image, Button } from "semantic-ui-react";
import noImage from "../images/No_Image_Available.jpg";
import { addItem } from "./cartHelper";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const PriceUI = styled(Header)`
  font-size: 1.5rem !important;
  margin: 0.5rem 0 !important;
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-family: "Segoe UI", sans-serif;
  padding-top: 1rem;
`;

const Product = props => {
  const lastLocation = useLastLocation();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const {
    _id,
    name,
    description,
    price,
    hasPhoto,
    category,
    createdAt,
    shipping,
    quantity
  } = product;
  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  const loadSingleProduct = async productId => {
    const data = await getProduct(productId);
    if (data.error) {
      setError(true);
    } else {
      setProduct(data);
      const res = await getRelatedProducts(data._id);
      if (res.error) {
        setError(true);
      } else {
        setRelatedProducts(res);
      }
    }
  };

  const addToCart = () => {
    const productForCart = { _id, name, price, category, hasPhoto, shipping, quantity };
    addItem(productForCart, setRedirect(true));
  };

  /** This function formats the decimal part to be smaller and above  */
  const formatPrice = priceToFormat => {
    let newPrice = priceToFormat.toFixed(2).toString();
    let decimalPart = newPrice.substring(newPrice.indexOf("."));
    newPrice = newPrice.substring(0, newPrice.indexOf("."));
    return (
      <span>
        {newPrice}
        <sup style={{ fontSize: 15 }}>{decimalPart}</sup>
      </span>
    );
  };

  const shouldRedirect = () => {
    if (redirect) return <Redirect to="/cart"></Redirect>;
  };
  const displayProduct = () => {
    return (
      <Card fluid style={{ marginTop: "-3rem" }}>
        {shouldRedirect()}
        <Card.Content>
          <Image
            floated="right"
            size="small"
            src={product && hasPhoto ? `/api/product/photo/${_id}` : `${noImage}`}
          />

          <Card.Header>
            <Header as="h1">{name}</Header>
          </Card.Header>
          <Card.Meta style={{ fontSize: "1.5rem" }}>{product && category.name}</Card.Meta>
          <Card.Description>
            <Container
              fluid
              textAlign="justified"
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
                padding: "2rem 0",
                fontSize: "1.5rem"
              }}
            >
              {product && description}
            </Container>
          </Card.Description>
        </Card.Content>
        <Card.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <PriceUI>Now only: AU${formatPrice(price)}</PriceUI>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <PriceUI
                  style={{
                    textDecoration: "line-through",
                    color: "#c7c7c9"
                  }}
                >
                  Before was: AU${formatPrice(price * 2.4)}
                </PriceUI>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Title>Added on: {createdAt && moment(createdAt).fromNow()}</Title>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={8} computer={4}>
                <Title>{quantity > 0 ? "In-Stock" : "Out of Stock "}</Title>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          <Grid>
            <Grid.Row>
              <Grid.Column
                mobile={16}
                tablet={8}
                computer={5}
                widescreen={3}
                style={{ marginTop: ".5rem" }}
              >
                <Button
                  fluid
                  size="large"
                  color="green"
                  type="button"
                  icon="shop"
                  labelPosition="right"
                  onClick={addToCart}
                  content="Add to Cart"
                />
              </Grid.Column>

              <Grid.Column
                mobile={16}
                tablet={8}
                computer={5}
                widescreen={3}
                style={{ marginTop: ".5rem" }}
              >
                <Button
                  as={Link}
                  fluid
                  size="large"
                  color="red"
                  to={`${lastLocation ? lastLocation.pathname : "/home"}`}
                  icon="left arrow"
                  labelPosition="right"
                  content="Back"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  };

  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      {error}
    </Message>
  );
  return (
    <Layout title="Product Overview" description="">
      {showError()}
      {product && product.description && (
        <Container>
          {displayProduct()}
          {relatedProducts > 0 && (
            <>
              <Header>Related Products</Header>
              <Grid>
                <Grid.Row>
                  {relatedProducts &&
                    relatedProducts.map(product => (
                      <Grid.Column mobile={16} tablet={8} computer={4} key={product._id}>
                        <MainCard key={product._id} product={product}></MainCard>
                      </Grid.Column>
                    ))}
                </Grid.Row>
              </Grid>
            </>
          )}
        </Container>
      )}
    </Layout>
  );
};

export default Product;
