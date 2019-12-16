import React, { useState, useEffect } from "react";
import noImage from "../images/No_Image_Available.jpg";

const PaymentCard = ({ product }) => {
  const { name, _id, price, hasPhoto, count } = product;

  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    calculateSubtotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showImage = className => {
    return (
      <div className={className}>
        <img
          src={hasPhoto ? `/api/product/photo/${_id}` : `${noImage}`}
          alt={name}
          className=""
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        ></img>
      </div>
    );
  };

  const calculateSubtotal = () => {
    setSubtotal((count * price).toFixed(2));
  };

  return (
    <div className="card payment-card-height">
      <div className="card-body">
        <div className="row">
          <div className="col-lg-2  col-md-2 col-sm-2 col-2">{showImage("payment-image")}</div>
          <div className="col-lg-8 col-md-8 col-sm-7 col-10">
            <p className="title">{name.substring(0, 50)}</p>
          </div>

          <div className="col-lg-2 col-md-2 col-sm-3 col">
            <div className="row">
              <div className="col-lg-12 col-md-12 col">
                <p className="card-text  text-nowrap ">
                  AU$
                  {subtotal}
                </p>
              </div>
              <div className="col-lg-12 col-md-12 col ">
                {" "}
                <p className="card-text text-light text-nowrap text-muted old-price">
                  AU${(subtotal * 2.4).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
