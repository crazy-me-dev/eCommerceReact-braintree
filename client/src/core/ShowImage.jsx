import React from "react";
import noImage from "../images/No_Image_Available.jpg";
const ShowImage = ({ item, url }) => (
  <div className="product-img">
    <img
      src={item.hasPhoto ? `/api/${url}/photo/${item._id}` : `${noImage}`}
      alt={item.name}
      className="mb-3 same-size"
      style={{ maxHeight: "100%", maxWidth: "100%" }}
    ></img>
  </div>
);
export default ShowImage;
