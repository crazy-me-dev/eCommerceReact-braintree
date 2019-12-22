import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import {
  Segment,
  Form,
  Icon,
  Header,
  Message,
  List,
  Grid,
  Container,
  Divider
} from "semantic-ui-react";

//custom imports
import { media } from "../utils/mediaQueriesBuilder";
import MainCard from "./MainCard";
import { getCategories, getSearchedProducts } from "./apiCore";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const SelectUI = styled(Form.Select)`
  margin-right: 2rem !important;
  ${media.sizeMedium`
		margin-right: 3.5rem !important;
    `}
  ${media.sizeSmall`
    margin-bottom: 1rem !important;
    margin-right: 0rem !important;
    `}
`;

const Search = () => {
  const [loadingCategory, setLoadingCategory] = useState(false);
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
      setData({ ...data, categories: data, category: "" });
      setLoadingCategory(false);
    }
  };

  const handleChange = (e, { value, name }) => {
    setData({ ...data, [name]: value, haveSearched: false });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setData({ ...data, searchSuccess: false, haveSearched: false });
    searchProduct();
  };

  const getCategoryName = id => {
    return categories.filter(c => c._id === id)[0].name;
  };

  const searchProduct = async () => {
    const res = await getSearchedProducts({ category, search });
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

  const showResultMessage = () => {
    if (searchSuccess) {
      return <Header as="h1">{`${results.length} products found`}</Header>;
    }

    if (haveSearched && !searchSuccess)
      return (
        <Message size="large" style={{ marginBottom: "3rem" }}>
          <Header as="h1">
            Sorry, we couldn't find any results for
            {category ? ` "${getCategoryName(category)}" & ` : null}
            {search ? `"${search}"` : null}
          </Header>

          <p style={{ marginTop: "2rem", fontSize: "2rem", color: "F8F8F9" }}>
            Try adjusting your search. Here are some ideas:
          </p>

          <List bulleted style={{ fontSize: "1.5rem", color: "F8F8F9", marginBottom: "1rem" }}>
            <List.Item>Make sure all words are spelled correctly.</List.Item>
            <List.Item>Make sure your desired category is selected.</List.Item>
            <List.Item>Try more general search terms.</List.Item>
            <List.Item>
              <Link to="shop">Visit our shop page for more filters.</Link>
            </List.Item>
          </List>
        </Message>
      );
  };

  const searchedProducts = (resultList = []) => {
    return resultList.map(product => (
      <Grid.Column mobile={16} tablet={8} computer={4} key={product._id}>
        <MainCard product={product} />
      </Grid.Column>
    ));
  };

  const categoryOptions =
    categories &&
    categories.map(c => {
      return { key: c._id, value: c._id, text: c.name };
    });

  const searchForm = () => {
    return (
      <Segment style={{ margin: "2rem 0rem" }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <SelectUI
              onChange={handleChange}
              name="category"
              width={4}
              placeholder="All"
              options={categoryOptions}
              disabled={loadingCategory}
            />
            <Form.Input
              onChange={handleChange}
              name="search"
              width={11}
              placeholder="Search..."
              icon={<Icon name="search" circular link onClick={handleSubmit} />}
            />
          </Form.Group>
        </Form>
      </Segment>
    );
  };

  return (
    <Container>
      {searchForm()}
      {showResultMessage()}
      <Grid>
        <Grid.Row>{searchedProducts(results)}</Grid.Row>
      </Grid>
    </Container>
  );
};

export default Search;
