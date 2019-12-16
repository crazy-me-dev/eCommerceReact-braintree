import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { getCategories, getProducts, removeProduct } from "./apiAdmin";

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

  const showProducts = () => {
    let tableItems = productList.map(product => (
      <tr key={product._id}>
        <td>{product.name && product.name.substring(0, 50)}</td>
        <td>{product.category && product.category.name}</td>
        <td>{product.quantity}</td>
        <td>${product.price && product.price.toFixed(2)}</td>
        <td align="center">{product.shipping && product.shipping ? "Yes" : "No"}</td>
        <td>
          <Link to={`/create/product/${product._id}`} className="btn btn-link">
            Update
          </Link>
        </td>
        <td>
          <button onClick={() => handleDelete(product)} className="btn btn-link">
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <table className="ui stackable  celled  table mt-5">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Shipping</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{tableItems}</tbody>
      </table>
    );
  };

  const DeleteModal = props => {
    return (
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{itemToDelete.name}</h4>
          <p>Are you sure you want to delete this product?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={cancelDelete}>Close</Button>
          <Button variant="danger" onClick={deleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Layout title="Add Product" description={`Product management`} className="container">
      <Link to="/create/product" className="btn btn-primary mb-3 mr-3">
        Create a Product
      </Link>
      <Link to="/admin/dashboard" className="btn btn-warning mb-3 ">
        Back to Dashboard
      </Link>
      {showProducts()}
      <DeleteModal show={showModal} onHide={() => setShowModal(false)} />
    </Layout>
  );
};

export default ManageProduct;
