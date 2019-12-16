import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getProduct, getRelatedProducts } from "./apiCore";

const Product = props => {
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(false);

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

  const showError = () => (
    <div className="alert alert-danger p-3" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );
  return (
    <Layout
      title={product && product.name}
      description={product && product.description && product.description.substring(0, 100)}
      className="container"
    >
      {showError()}
      {product && product.description && (
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-12">
            <Card product={product} showViewProductButton={false} showFullDescription={true}></Card>
          </div>
          <div className="col-xl-5 col-lg-5 col-md-10 offset-1 ">
            <h2 className="mb-5">Related Products</h2>
            {relatedProducts &&
              relatedProducts.map(product => <Card key={product._id} product={product}></Card>)}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Product;
