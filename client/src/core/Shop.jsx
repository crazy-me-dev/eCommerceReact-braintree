import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import Radiobox from "./Radiobox";
import { prices } from "./staticContent";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [error, setError] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(6);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);

  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] }
  });

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    loadCategories();
    loadFilteredResults();
  };

  const loadCategories = async () => {
    setLoadingCategory(true);
    const data = await getCategories();
    if (data.error) {
      setError(data.error);
      setLoadingCategory(false);
    } else {
      setCategories(data);
      setLoadingCategory(false);
    }
  };

  const loadFilteredResults = async filteredSearchObject => {
    const data = await getFilteredProducts(skip, limit, filteredSearchObject);
    if (data.error) {
      setError(data.error);
    } else {
      setFilteredResults(data);
      setSize(data.length);
      setSkip(0);
    }
  };

  const loadMore = async () => {
    let toSkip = skip + limit;
    const data = await getFilteredProducts(toSkip, limit, myFilters.filters);
    if (data.error) {
      setError(data.error);
    } else {
      setFilteredResults([...filteredResults, ...data]);

      setSize(data.length);
      setSkip(toSkip);
    }
  };

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-8">
          Load More
        </button>
      )
    );
  };
  const showPriceFilter = className => (
    <div className={className}>
      <h4>Filter by Price</h4>
      <div>
        <Radiobox
          prices={prices}
          handleFilters={filters => handleFilters(filters, "price")}
        ></Radiobox>
      </div>
    </div>
  );

  const showCategoryFilter = className => (
    <div className={className}>
      <h4>Filter by Categories</h4>
      {loadingCategory ? (
        <h5>Loading categories...</h5>
      ) : (
        <ul>
          <Checkbox
            categories={categories}
            handleFilters={filters => handleFilters(filters, "category")}
          ></Checkbox>
        </ul>
      )}
    </div>
  );

  const showProduc = () => {
    let productList = filteredResults;
    productList = productList ? (
      productList.map(product => (
        <div key={product._id} className="col-xl-3 col-lg-6 col-md-6">
          <Card product={product} />
        </div>
      ))
    ) : (
      <h4>Loading...</h4>
    );
    return productList;
  };

  const showError = () => (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  );

  return (
    <Layout
      title="Shop Page"
      description="Search and find books of your choice"
      className="container-fluid"
    >
      <div className="row">
        <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
          <div className="row">
            {error ? showError() : showCategoryFilter("col-lg-12 col-md-6 col-sm-6")}
            {error ? showError() : showPriceFilter("col-lg-12 col-md-6 col-sm-6")}
          </div>
        </div>
        <div className="col-lg-9">
          <div className="row">{showProduc("byArrival")}</div>
          <div>{error ? showError() : loadMoreButton()}</div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
