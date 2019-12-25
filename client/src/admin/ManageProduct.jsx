import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Modal,
  Header,
  Button,
  Icon,
  Table,
  Container,
  Divider,
  Popup,
  Grid
} from "semantic-ui-react";

/** custom imports */
import Layout from "../core/Layout";
import DashboardLayout from "../user/DashboardLayout";
import { isAuthenticated } from "../auth";
import { getProducts, removeProduct } from "./apiAdmin";
import Search from "../core/Search";

const ManageProduct = () => {
  /** get the userId and token to make request as admin */
  const {
    user: { _id: userId },
    token
  } = isAuthenticated();

  /**state declaration */
  const [toggleSearch, setToggleSearch] = useState(true);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setitemToDelete] = useState({});
  const [run, setRun] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(6);
  const [values, setValues] = useState({
    productList: [],
    loading: false,
    error: ""
  });

  /**deconstructing values object */
  const { productList, loading } = values;

  /**fetch the products and sets the state */
  const loadProducts = async () => {
    setValues({ ...values, loading: true });
    const data = await getProducts(limit, skip);
    if (data.error) {
      setValues({ ...values, error: data.error, loading: false });
    } else {
      setValues({ ...values, productList: data, loading: false });
    }
  };

  /**
   * Fires load product when mounting and whenever there is a change on run or skip
   * run is used mainly after deleting to update the dom and skip is for pagination
   */
  useEffect(() => {
    loadProducts();
  }, [run, skip]);

  /**this function marks or select the product to be deleted and opens the modal
   * itemToDelete is used for the delete modal
   */
  const handleDelete = product => {
    setShowModal(true);
    setitemToDelete(product);
  };

  /**unselect the item to be deleted by setting itemToDelete to empty object. Close the modal too */
  const cancelDelete = () => {
    setShowModal(false);
    setitemToDelete({});
  };

  /**After user confirmation, this functions set the request to delete the product
   * it also closes the modal and setRun to fires the loadProducts function
   */
  const deleteProduct = () => {
    setShowModal(false);
    const data = removeProduct(userId, token, itemToDelete._id);
    if (data.error) {
      setValues({ ...data, error: data.error });
    } else {
      setRun(!run);
    }
  };

  /**
   * setting an event listener to detect the escape key
   * to setShowModal to false hence closing the Modal
   * uses useCallback and useEffect hooks
   */
  const escFunction = useCallback(event => {
    if (event.keyCode === 27) {
      setShowModal(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  /** this function either loads more items or load less
   * sets pageNumber and also skip which will fire an effect to reload items
   */
  const handlePaginationChange = (e, { name }) => {
    if (name === "next" && productList.length >= limit) {
      setSkip(pageNumber * limit);
      setPageNumber(pageNumber + 1);
    }
    if (name === "back" && pageNumber > 1) {
      setSkip((pageNumber - 2) * limit);
      setPageNumber(pageNumber - 1);
    }
  };

  const deleteModal = () => (
    <Modal closeOnEscape={true} open={showModal} dimmer="blurring" size="tiny">
      <Header icon="trash alternate" content="Delete Product" />
      <Modal.Content>
        <p>Are you sure you want to delete {` ${itemToDelete.name}`}?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={cancelDelete} color="red">
          <Icon name="remove" /> No
        </Button>
        <Button onClick={deleteProduct} color="green">
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );

  const showProducts = () => {
    let tableItems = productList.map(product => (
      <Table.Row className="left-aligned" key={product._id}>
        <Table.Cell>{product.name && product.name}</Table.Cell>
        <Table.Cell>{product.category && product.category.name}</Table.Cell>
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
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="6">
              <Button.Group floated="right">
                <Button
                  disabled={pageNumber === 1}
                  name="back"
                  labelPosition="left"
                  size="medium"
                  color="grey"
                  icon="left chevron"
                  content="Back"
                  onClick={handlePaginationChange}
                />
                <Button
                  disabled={productList && productList.length < limit}
                  name="next"
                  labelPosition="right"
                  size="medium"
                  color="grey"
                  icon="right chevron"
                  content="Next"
                  onClick={handlePaginationChange}
                />
              </Button.Group>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  };

  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        {deleteModal()}
        <Container fluid style={{ marginTop: "1rem" }}>
          <Header as="h3">Product Management</Header>
          <Search
            run={run}
            isAdmin={true}
            handleDelete={handleDelete}
            toggleSearch={toggleSearch}
            setToggleSearch={setToggleSearch}
            setShowToggleButton={setShowToggleButton}
          />
          <Grid>
            <Grid.Row>
              <Grid.Column
                mobile={16}
                tablet={8}
                computer={5}
                widescreen={3}
                style={{ marginTop: ".5rem" }}
              >
                <Button
                  positive
                  as={Link}
                  to="/admin/product/create"
                  content="Create Product"
                  icon="add"
                  labelPosition="right"
                  size="medium"
                  fluid
                />
              </Grid.Column>
              <Grid.Column
                mobile={16}
                tablet={8}
                computer={5}
                widescreen={3}
                style={{ marginTop: ".5rem" }}
              >
                {showToggleButton && (
                  <Button
                    color={toggleSearch ? "red" : "blue"}
                    onClick={() => setToggleSearch(!toggleSearch)}
                    content={toggleSearch ? "Hide Search" : "Show Search"}
                    icon={toggleSearch ? "hide" : "unhide"}
                    labelPosition="right"
                    size="medium"
                    fluid
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Divider />

          <Header as="h3">List of Products</Header>
          {!loading && showProducts()}
        </Container>
      </DashboardLayout>
    </Layout>
  );
};

export default ManageProduct;
