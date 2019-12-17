import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
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

  const showProduc = displayBy => {
    let productList;
    switch (displayBy) {
      case "byArrival":
        productList =
          productByArrival &&
          productByArrival.map(product => (
            <div key={product._id} className="col-xl-3 col-lg-4 col-md-6  mb-3">
              <Card product={product} />
            </div>
          ));
        break;
      case "bySold":
        productList =
          productBySell &&
          productBySell.map(product => (
            <div key={product._id} className="col-xl-3 col-lg-4 col-md-6  mb-3">
              <Card product={product} />{" "}
            </div>
          ));
        break;

      default:
        break;
    }
    return productList;
  };

  const showError = () => (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  );

  return (
    <Layout title="Home Page" description="Node React E-commerce App" className="container-fluid">
      <Search />

      {error ? (
        showError()
      ) : (
        <>
          <h4 className="mb-4 mt-4">New Arrivals</h4>
          <div className="row">{showProduc("byArrival")}</div>
        </>
      )}
      {error ? (
        showError()
      ) : (
        <>
          <hr />
          <h4 className="mb-4 mt-4">More Sold Products</h4>
          <div className="row">{showProduc("bySold")}</div>
        </>
      )}
    </Layout>
  );
};

export default Home;
