import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
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
  Table,
  Button,
  Popup
} from "semantic-ui-react";

//custom imports
import { mediaUI as media } from "../utils/mediaQueriesBuilder";
import MainCard from "./MainCard";
import { getCategories, getSearchedProducts } from "./apiCore";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const SelectUI = styled(Form.Select)`
  margin-bottom: 1rem !important;
  margin-right: 0rem !important;

  ${media.tablet`	margin-right: 3.5rem !important;margin-bottom: 0 !important;`}
  ${media.computer`	margin-right: 2rem !important;`}
`;

const Search = props => {
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

  /** Destructuring props object */
  const {
    isAdmin,
    handleDelete,
    run = undefined,
    toggleSearch,
    setToggleSearch,
    setShowToggleButton
  } = props;

  /** Destructuring data object  */
  const { categories, category, search, results, searchSuccess, haveSearched } = data;

  /** useDidMount is used as componentDidMount  */
  function useDidMount() {
    const [didMount, setDidMount] = useState(false);
    useEffect(() => setDidMount(true), []);
    return didMount;
  }
  const didMount = useDidMount();

  /**
   * runs the searchProduct method only after the component has mounted
   * Reloads the search after product's been deleted
   */
  useEffect(() => {
    if (haveSearched && didMount) {
      searchProduct();
    }
  }, [run]);

  useEffect(() => {
    loadCategories();
  }, []);

  /* fetch categories or set error if something goes wrong */
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

  /** create an array of objects to be used in Select element as options param*/
  const categoryOptions =
    categories &&
    categories.map(c => {
      return { key: c._id, value: c._id, text: c.name };
    });

  /**
   * gets the name of the first index of the array returned by filter
   *  based on the id passed as parameter
   */
  const getCategoryName = id => {
    return categories.filter(c => c._id === id)[0].name;
  };

  /*** sets search input and Select category option   */
  const handleChange = (e, { value, name }) => {
    setData({ ...data, [name]: value, haveSearched: false });
  };

  /** Sets flags and calls the searchProduct method */
  const handleSubmit = event => {
    event.preventDefault();
    setData({ ...data, searchSuccess: false, haveSearched: false });
    searchProduct();
  };

  /** Fetch the products based on the filters */
  const searchProduct = async () => {
    /* After the first search the toggleSearch stays in the state set by the user
     * if toggleSearch was false, then the new search would be hidden
     * we make sure to set toggleSearch to true before displaying the search */
    if (isAdmin && !toggleSearch) setToggleSearch(!toggleSearch);
    const res = await getSearchedProducts({ category, search });
    if (res.error) {
      setData({ ...data, error: res.error });
    } else {
      if (res.length > 0) {
        setData({ ...data, searchSuccess: true, results: res, haveSearched: true });
        console.log(res);

        if (isAdmin) setShowToggleButton(true);
      } else {
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

  /** this method create a table of products only if isAdmin props is set to true */
  const searchedProductsAdmin = (resultList = []) => {
    let tableItems = resultList.map(product => (
      <Table.Row className="left-aligned" key={product._id}>
        <Table.Cell>{product.name && product.name}</Table.Cell>
        <Table.Cell>{product.category && getCategoryName(product.category)}</Table.Cell>
        <Table.Cell>{product.quantity}</Table.Cell>
        <Table.Cell>${product.price && product.price.toFixed(2)}</Table.Cell>
        <Table.Cell>
          {product.shipping && product.shipping ? (
            <Icon color="green" name="checkmark" size="large" />
          ) : (
            <Icon color="red" name="x" size="large" />
          )}
        </Table.Cell>
        <Table.Cell>
          <Popup
            content="Update Product"
            position="top right"
            trigger={
              <Button to={`/create/product/${product._id}`} as={Link} icon="edit" color="teal" />
            }
          />
          <Popup
            content="Delete Product"
            position="top right"
            trigger={<Button onClick={() => handleDelete(product)} icon="delete" color="red" />}
          />
        </Table.Cell>
      </Table.Row>
    ));
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Product Name</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Stock</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Shipping</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{tableItems}</Table.Body>
      </Table>
    );
  };

  /** this method create Cards of products only if isAdmin props is set to false */
  const searchedProducts = (resultList = []) => {
    return resultList.map(product => (
      <Grid.Column mobile={16} tablet={8} computer={4} key={product._id}>
        <MainCard product={product} />
      </Grid.Column>
    ));
  };

  /** this method create the search form itself */
  const searchForm = () => {
    return (
      <Segment style={{ margin: "1rem 0" }}>
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
    // only full screen if isAdmin is set to true
    <Container fluid={isAdmin}>
      {searchForm()}
      {/* this is displayed when isAdmin is set to false */}
      {!isAdmin && showResultMessage()}
      {!isAdmin && (
        <Grid>
          <Grid.Row>{searchedProducts(results)}</Grid.Row>
        </Grid>
      )}
      {/* this is displayed when isAdmin is set to true */}
      {isAdmin && toggleSearch && showResultMessage()}
      {isAdmin && results && results.length > 0 && toggleSearch && searchedProductsAdmin(results)}
    </Container>
  );
};

export default Search;

Search.propTypes = {
  isAdmin: PropTypes.bool,
  handleDelete: PropTypes.func,
  run: PropTypes.bool,
  toggleSearch: PropTypes.bool,
  setToggleSearch: PropTypes.func,
  setShowToggleButton: PropTypes.func
};
