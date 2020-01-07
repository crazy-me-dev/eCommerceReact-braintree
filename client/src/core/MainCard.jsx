import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { Card, Icon, Button, Image, Header } from "semantic-ui-react";

//custom imports
import { addItem } from "./cartHelper";
import noImage from "../images/No_Image_Available.jpg";
import { mediaUI as media } from "../utils/mediaQueriesBuilder";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const HeaderUI = styled(Header)`
  line-height: 1.5rem;
  min-height: 3rem;
  max-height: 3rem;
  overflow: hidden;
`;

const CardUI = styled(Card)`
  margin-bottom: 2rem !important;
  width: 100% !important;
  /* padding: 0 !important; */
  ${media.large`width: 90%!important;`}
  ${media.wide`width: 80%!important;`}
`;

const MainCard = ({ product, history }) => {
  const [redirect, setRedirect] = useState(false);

  const { _id, name, price, hasPhoto, category, createdAt, shipping, quantity } = product;

  const addToCart = () => {
    const productForCart = { _id, name, price, category, hasPhoto, shipping, quantity };
    addItem(productForCart, setRedirect(true));
  };

  const shouldRedirect = () => {
    if (redirect) return <Redirect to="/cart"></Redirect>;
  };

  const extra = (
    <div>
      <Link to={`/product/${_id}`}>
        <Button color="blue" animated="vertical">
          <Button.Content hidden>View</Button.Content>
          <Button.Content visible>
            <Icon name="search plus" />
          </Button.Content>
        </Button>
      </Link>

      <Button
        color="green"
        animated="vertical"
        type="button"
        onClick={addToCart}
        disabled={quantity < 1 ? true : false}
      >
        <Button.Content hidden>Cart</Button.Content>
        <Button.Content visible>
          <Icon name="shop" />
        </Button.Content>
      </Button>
    </div>
  );

  return (
    <CardUI>
      {shouldRedirect()}

      <Image
        as={Link}
        to={`/product/${_id}`}
        src={hasPhoto ? `/api/product/photo/${_id}` : `${noImage}`}
        wrapped
        ui={false}
        label={
          quantity < 1
            ? {
                size: "big",
                color: "red",
                content: "Out of Stock",
                ribbon: "right",
                icon: "info"
              }
            : null
        }
      />

      <Card.Content>
        {/* <Label color="red" ribbon="right">
          Out of Stock
        </Label> */}
        <HeaderUI>{`${name.substring(0, 40)}`}</HeaderUI>
        <Card.Meta>{`Added ${moment(createdAt).fromNow()}`}</Card.Meta>
        <Card.Description>
          <Header as="h3">{`AU$${price && price.toFixed(2)}`}</Header>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>{extra}</Card.Content>
    </CardUI>
  );
};

export default MainCard;
