import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem } from "./cartHelper";

const Card = ({ product, showViewProductButton = true, showFullDescription = false }) => {
  const [redirect, setRedirect] = useState(false);

  const { _id, name, description, price, hasPhoto, category, createdAt, quantity } = product;
  const addToCart = () => {
    addItem(product, setRedirect(true));
  };

  const shouldRedirect = () => {
    if (redirect) return <Redirect to="/cart"></Redirect>;
  };

  return (
    <div className="card spur-card">
      {shouldRedirect()}
      <div className="card-header bg-primary text-white">
        <div className="spur-card-title">
          <h6> {name.substring(0, 50)} ...</h6>
        </div>
      </div>
      <div className="card-body">
        <ShowImage item={{ _id, name, hasPhoto }} url="product" />

        <p className="card-text  text-justify lead">
          {showFullDescription ? description : description.substring(0, 120)}{" "}
          {!showFullDescription && <Link to={`/product/${_id}`}>...read more</Link>}
        </p>
        <p className="card-text">${price}</p>
        <p className="card-text">Category: {category && category.name}</p>
        <p className="card-text">Added on {moment(createdAt).fromNow()}</p>

        {quantity > 0 ? (
          <span className="badge badge-pill badge-info">In Stock</span>
        ) : (
          <span className="badge badge-pill badge-alert">Out of Stock</span>
        )}

        <br />
        {showViewProductButton && (
          <Link to={`/product/${_id}`}>
            <button className="btn btn-outline-primary mt-2 mb-2 mr-2">View Product</button>
          </Link>
        )}
        <button type="button" onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
