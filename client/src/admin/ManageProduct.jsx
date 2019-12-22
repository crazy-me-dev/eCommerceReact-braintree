import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import DashboardLayout from "../user/DashboardLayout";
import styled from "styled-components";
import { isAuthenticated } from "../auth";
import { getCategories, getProducts, removeProduct } from "./apiAdmin";
import {
  Modal,
  Header,
  Card,
  Button,
  Icon,
  Table,
  Container,
  Divider,
  Popup
} from "semantic-ui-react";
import { media } from "../utils/mediaQueriesBuilder";

const ManageProduct = () => {
  const {
    user: { _id: userId },
    token
  } = isAuthenticated();

  const [limit, setLimit] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setitemToDelete] = useState({});
  const [run, setRun] = useState(false);

  const [values, setValues] = useState({
    categories: [],
    productList: [],
    loading: false,
    error: ""
  });

  const { productList } = values;

  const loadCategories = async () => {
    const data = await getCategories();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setValues({ ...values, categories: data });
    }
  };

  const loadProducts = async () => {
    const data = await getProducts(limit);
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setValues({ ...values, productList: data });
    }
  };

  const init = () => {
    loadCategories();
    loadProducts();
  };

  useEffect(() => {
    init();
  }, [run]);

  const handleDelete = product => {
    setShowModal(true);
    setitemToDelete(product);
  };
  const cancelDelete = () => {
    setShowModal(false);
    setitemToDelete({});
  };

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
   * to setShowModal to true hence closing the Modal
   * used useCallback and useEffect hooks
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

  const deleteModal = () => (
    <Modal closeOnEscape={true} open={showModal} dimmer="blurring" size="tiny">
      <Header icon="trash alternate" content="Delete Produc" />
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
      </Table>
    );
  };

  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        {deleteModal()}
        <Container fluid style={{ marginTop: "2rem" }}>
          <Header as="h1">Product Management</Header>
          <Button style={{ marginTop: "1rem" }} color="blue" as={Link} to="/admin/product/create">
            Create a Product
          </Button>
          <Divider style={{ marginBottom: "2rem" }} />
          {showProducts()}
        </Container>
      </DashboardLayout>
    </Layout>
  );
};

export default ManageProduct;
