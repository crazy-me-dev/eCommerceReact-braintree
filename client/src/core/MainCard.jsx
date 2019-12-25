import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";
import { Card, Icon, Button, Image, Header, Label } from "semantic-ui-react";

//custom imports
import { addItem } from "./cartHelper";
import noImage from "../images/No_Image_Available.jpg";

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

const MainCard = ({ product }) => {
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

      <Button color="red" animated="vertical" type="button" onClick={addToCart}>
        <Button.Content hidden>Cart</Button.Content>
        <Button.Content visible>
          <Icon name="shop" />
        </Button.Content>
      </Button>
    </div>
  );

  return (
    <Card style={{ marginBottom: "2rem" }}>
      {shouldRedirect()}
      <Image src={hasPhoto ? `/api/product/photo/${_id}` : `${noImage}`} wrapped ui={false} />
      <Card.Content>
        <HeaderUI>{`${name.substring(0, 40)}`}</HeaderUI>
        <Card.Meta>
          <span className="date">{`Added ${moment(createdAt).fromNow()}`}</span>
        </Card.Meta>
        <Card.Description>
          <Header as="h3">{`AU$${price && price.toFixed(2)}`}</Header>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>{extra}</Card.Content>
    </Card>
  );
};

export default MainCard;
