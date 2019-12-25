import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Card, Image, Grid, Header, Input } from "semantic-ui-react";

/**custom imports */
import noImage from "../images/No_Image_Available.jpg";
import { updateItem, removeItem } from "./cartHelper";
import { mediaUI as media } from "../utils/mediaQueriesBuilder";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const CardHeaderUI = styled(Card.Header)`
  line-height: 1.5rem;
  max-height: 3rem;
  overflow: hidden;
  font-size: 1.4rem;
  ${media.tablet`
  font-size : 1.5rem !important;
  line-height: 1.7rem;
  max-height: 3.4rem;
  `}
`;

const PriceUI = styled(Header)`
  font-size: 1.5rem !important;
  margin: 0.5rem 0 !important;
`;

const ImageUI = styled(Image)`
  visibility: hidden;
  ${media.tablet`visibility: visible;`}
`;

const CheckoutCard = ({ product, setRun = f => f, run = undefined }) => {
  const { _id, name, price, hasPhoto, count: initialCount, quantity } = product;

  const [subtotal, setSubtotal] = useState(0);
  const [count, setCount] = useState(initialCount);

  /** this effect run every time count changes  */
  useEffect(() => {
    calculateSubtotal();
  }, [count]);

  const calculateSubtotal = () => {
    setSubtotal(count * price);
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

  const handleChange = (event, { value }) => {
    /** this regex avoid characters other than numbers*/
    const re = /^[0-9\b]+$/;
    if (re.test(value)) {
      let countValue;
      //if the input value is less than 1, set countValue to 1
      if (value < 1) countValue = 1;
      //if the input value is greater than quantity, setcountValue to quantity
      else if (value > quantity) countValue = parseInt(quantity);
      //Double checking we got an int value
      else countValue = parseInt(value);
      setCount(countValue);
      updateItem(_id, countValue);
      //setRun will make the total section in ShoppingCart to update
      setRun(!run);
    }
  };

  const remove = () => {
    removeItem(_id);
    //setRun will make the total section in ShoppingCart to update
    setRun(!run);
  };

  return (
    <Card fluid>
      <Card.Content>
        <Grid>
          <Grid.Row verticalAlign="middle">
            <Grid.Column mobile={1} tablet={3} computer={2}>
              <ImageUI
                floated="left"
                size="tiny"
                src={hasPhoto ? `/api/product/photo/${_id}` : `${noImage}`}
              />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={13} computer={14}>
              <Grid style={{ marginTop: "0.1rem" }}>
                <Grid.Row style={{ paddingTop: 0 }}>
                  <Grid.Column>
                    <CardHeaderUI>{name && name.substring(0, 100)}</CardHeaderUI>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign="middle" style={{ paddingTop: 0 }}>
                  <Grid.Column mobile={8} tablet={4} computer={3}>
                    <PriceUI>AU${formatPrice(subtotal)}</PriceUI>
                  </Grid.Column>
                  <Grid.Column mobile={8} tablet={4} computer={3}>
                    <PriceUI
                      style={{
                        textDecoration: "line-through",
                        color: "#c7c7c9"
                      }}
                    >
                      AU${formatPrice(subtotal * 2.4)}
                    </PriceUI>
                  </Grid.Column>
                  <Grid.Column mobile={8} tablet={4} computer={5}>
                    <Input
                      style={{ marginTop: ".5rem" }}
                      fluid
                      label={{ basic: true, content: "Qty" }}
                      labelPosition="left"
                      type="number"
                      value={count}
                      min="1"
                      max={quantity}
                      onChange={handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column mobile={8} tablet={4} computer={3}>
                    <Button
                      style={{ marginTop: ".5rem" }}
                      content="Remove"
                      basic
                      fluid
                      size="large"
                      color="red"
                      onClick={remove}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
  );
};

export default CheckoutCard;
