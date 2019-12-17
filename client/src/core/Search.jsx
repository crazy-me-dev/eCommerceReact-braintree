import React, { useState, useEffect } from "react";
import { getCategories, getSearchedProducts } from "./apiCore";
import Card from "./Card";
const Search = () => {
  const [loadingCategory, setLoadingCategory] = useState(false);

  const [emptyInput, setEmptyInput] = useState(false);
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searchSuccess: false,
    error: false,
    haveSearched: false
  });

  const { categories, category, search, results, searchSuccess, haveSearched, error } = data;
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    loadCategories();
  };

  const loadCategories = async () => {
    setLoadingCategory(true);
    const data = await getCategories();
    if (data.error) {
      setData({ ...data, error: data.error });
      setLoadingCategory(false);
    } else {
      setData({ ...data, categories: data });
      setLoadingCategory(false);
    }
  };

  const handleChange = event => {
    setEmptyInput(false);

    setData({
      ...data,
      [event.target.name]: event.target.value
    });

    if (event.target.name === "category") {
      searchProduct(event.target.value);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    setData({ ...data, searchSuccess: false, haveSearched: false });
    console.log(category, search);

    searchProduct();
  };

  const searchProduct = async (incomingCategory = category) => {
    const res = await getSearchedProducts({ category: incomingCategory, search });
    if (res.error) {
      setData({ ...data, error: res.error });
    } else {
      if (res.length > 0)
        setData({ ...data, searchSuccess: true, results: res, haveSearched: true });
      else {
        setData({ ...data, searchSuccess: false, results: undefined, haveSearched: true });
      }
    }
  };

  const showEmptyInput = () => {
    return (
      <div className="alert alert-warning alert-dismissible fade show text-center" role="alert">
        Please type something to start search!
        <button type="button" className="close" onClick={() => setEmptyInput(false)}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  };

  const showResultMessage = () => {
    if (haveSearched && searchSuccess) {
      return <h4 className="mb-4 mt-4">{`Found ${results.length} products`}</h4>;
    }

    if (haveSearched && !searchSuccess)
      return (
        <div className="container alert alert-info mt-4">
          <h4 className="mb-4 mt-4">No products found!</h4>
        </div>
      );
  };

  const searchedProducts = (resultList = []) => {
    return resultList.map(product => (
      <div key={product._id} className="col-xl-3 col-lg-4 col-md-6  mb-3">
        <Card product={product} />
      </div>
    ));
  };

  const searchForm = () => {
    return (
      <form action="">
        {emptyInput && showEmptyInput()}
        <span className="input-group-text">
          <div className="input-group">
            <div className="input-group-prepend">
              <select name="category" onChange={handleChange} disabled={loadingCategory}>
                <option value="All">All</option>
                {data &&
                  data.categories &&
                  data.categories.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search Product"
              onChange={handleChange}
            />
            <div className="input-group-append">
              <button type="submit" onClick={handleSubmit} className="input-group-text">
                Search
              </button>
            </div>
          </div>
        </span>
      </form>
    );
  };

  return (
    <div className="row">
      <div className="container">{searchForm()}</div>

      <div className="container-fluid mt-4">
        {showResultMessage()}
        <div className="row">{searchedProducts(results)}</div>
      </div>
    </div>
  );
};

export default Search;
