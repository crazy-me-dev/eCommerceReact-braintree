import React, { useState, useEffect } from "react";
import { Container, Grid, Header, Button, List, Message, Icon } from "semantic-ui-react";

//custom imports
import Layout from "../layout/Layout";
import MainCard from "./MainCard";
import { getCategories, getFilteredProducts } from "./apiCore";
import CheckboxList from "./CheckboxList";
import Radiobox from "./Radiobox";
import { prices } from "../common/staticContent";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [error, setError] = useState(false);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] }
  });

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = () => {
    loadCategories();
    loadFilteredResults();
  };

  const loadCategories = async () => {
    setLoadingCategory(true);
    setError(false);
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

  /**
   *
   * @param filters  {*filters will be coming from the callback function either Checkbox or Radiobox Components}
   * @param filterBy  {*filter wil either be "price" or category}
   */

  const handleFilters = (filters, filterBy) => {
    //store the previous myFilters in new filters
    const newFilters = { ...myFilters };
    //replacing the incoming filters
    newFilters.filters[filterBy] = filters;
    //calling loadFilteredResults to reload results
    loadFilteredResults(myFilters.filters);
    //Finally setting myFilters with updated array in newFilters
    setMyFilters(newFilters);
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <Button
          style={{ marginLeft: "1rem" }}
          icon
          labelPosition="right"
          basic
          color="red"
          size="huge"
          onClick={loadMore}
        >
          Load More
          <Icon name="plus" />
        </Button>
      )
    );
  };
  const showPriceFilter = () => (
    <Container style={{ marginTop: "2rem" }}>
      <Header as="h3">Filter by Price</Header>
      <div>
        <Radiobox
          prices={prices}
          handleFilters={filters => handleFilters(filters, "price")}
        ></Radiobox>
      </div>
    </Container>
  );

  const showCategoryFilter = () => (
    <Container fluid>
      <Header as="h3">Filter by Categories</Header>
      {loadingCategory ? (
        <Header as="h3">Loading categories...</Header>
      ) : (
        <List>
          <CheckboxList
            categories={categories}
            handleFilters={filters => handleFilters(filters, "category")}
          />
        </List>
      )}
    </Container>
  );

  const showProduct = () => {
    let productList = filteredResults;
    productList = productList ? (
      productList.map(product => (
        <Grid.Column key={product._id}>
          <MainCard product={product} />
        </Grid.Column>
      ))
    ) : (
      <Header as="h2">Loading...</Header>
    );
    return productList;
  };

  const showErrorMessage = () => (
    <Message size="large" style={{ marginBottom: "3rem" }}>
      <Header as="h1">Sorry, something went wrong internally!</Header>
      <p style={{ marginTop: "2rem", fontSize: "2rem", color: "F8F8F9" }}>
        Try the following ideas to ensure results:
      </p>
      <List bulleted style={{ fontSize: "1.5rem", color: "F8F8F9", marginBottom: "1rem" }}>
        <List.Item>Make sure you are connected to internet.</List.Item>
        <List.Item>Make sure you have enough disk space.</List.Item>
        <List.Item>Restart the app.</List.Item>
        <List.Item>Full error: ${error}</List.Item>
      </List>
    </Message>
  );
  const showEmptyResultsMessage = () => (
    <Grid.Column mobile={16} tablet={8} computer={12}>
      <Message size="small" style={{ marginBottom: "3rem" }}>
        <Header as="h1">Sorry, we couldn't find any results for your filtering</Header>
        <p style={{ marginTop: "2rem", fontSize: "2rem", color: "F8F8F9" }}>
          Try adjusting your filters. Here are some ideas:
        </p>
        <List bulleted style={{ fontSize: "1.5rem", color: "F8F8F9", marginBottom: "1rem" }}>
          <List.Item>Make sure your desired category is selected.</List.Item>
          <List.Item>Change the price range.</List.Item>
        </List>
      </Message>
    </Grid.Column>
  );

  return (
    <Layout title="Shop Page" description="Search and find books of your choice">
      <Container fluid style={{ marginTop: "3rem", padding: "0 .5rem" }}>
        {/* outter grid start */}
        <Grid>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={6} computer={4}>
              {/* inner grid start */}
              <Grid style={{ marginBottom: "3rem" }}>
                <Grid.Row centered>
                  {error ? (
                    showErrorMessage()
                  ) : (
                    <Grid.Column mobile={12} tablet={12} computer={12}>
                      {showCategoryFilter()}
                    </Grid.Column>
                  )}

                  {error ? (
                    showErrorMessage()
                  ) : (
                    <Grid.Column mobile={12} tablet={12} computer={12}>
                      {showPriceFilter()}
                    </Grid.Column>
                  )}
                </Grid.Row>
              </Grid>
              {/* inner grid ends */}
            </Grid.Column>
            {size <= 0 ? (
              showEmptyResultsMessage()
            ) : (
              <Grid.Column mobile={16} tablet={10} computer={12}>
                {/* inner grid start */}
                <Grid stackable doubling columns={4}>
                  <Header as="h1">{`${size} products found`}</Header>

                  <Grid.Row>{showProduct("byArrival")}</Grid.Row>
                  <Grid.Row>{error ? showErrorMessage : loadMoreButton()}</Grid.Row>
                </Grid>
                {/* inner grid ends */}
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
        {/* outter grid ends */}
      </Container>
    </Layout>
  );
};

export default Shop;
