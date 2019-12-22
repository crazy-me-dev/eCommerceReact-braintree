import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Layout from "../core/Layout";
import DashboardLayout from "../user/DashboardLayout";
import moment from "moment";
import { isAuthenticated } from "../auth";
import { getCategories, removeCategory, getCategoriesInUse } from "./apiAdmin";

const ManageCategory = () => {
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
    categoriesInUse: [],
    loading: false,
    error: ""
  });

  const { categories, categoriesInUse } = values;

  useEffect(() => {
    load();
  }, [run]);

  const load = async () => {
    const categoryList = await getCategories();
    if (categoryList.error) {
      setValues({ ...values, error: categoryList.error });
      return;
    }
    const categoryInUseList = await getCategoriesInUse();
    if (categoryInUseList.error) {
      setValues({ ...values, error: categoryInUseList.error });
      return;
    }
    setValues({ ...values, categoriesInUse: categoryInUseList, categories: categoryList });
  };

  const categoryHasProducts = categoryId => {
    return categoriesInUse.includes(categoryId);
  };

  const handleDelete = category => {
    setShowModal(true);
    setitemToDelete(category);
  };
  const cancelDelete = () => {
    setShowModal(false);
    setitemToDelete({});
  };

  const deleteCategory = () => {
    setShowModal(false);
    const data = removeCategory(userId, token, itemToDelete._id);
    if (data.error) {
      setValues({ ...data, error: data.error });
    } else {
      setRun(!run);
    }
  };

  const showCategories = () => {
    let tableItems = categories.map(category => (
      <tr key={category._id}>
        <td>{category.name && category.name}</td>

        <td>{category.createdAt && moment(category.createdAt).format("ll")}</td>
        <td>{category.updatedAt && moment(category.updatedAt).format("ll")}</td>
        {/* <td>{category._id && categoryHasProducts() ? "Yes" : "No"}</td> */}
        <td align="center">{category._id && categoryHasProducts(category._id) ? "Yes" : "No"}</td>
        <td>
          <Link to={`/create/category/${category._id}`} className="btn btn-link">
            Update
          </Link>
        </td>
        <td>
          <button onClick={() => handleDelete(category)} className="btn btn-link">
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <table className="ui stackable  celled  table mt-5">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Created</th>
            <th>Last Update</th>
            <th>Contain Products</th>
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
          <Modal.Title id="contained-modal-title-vcenter">
            {categoryHasProducts(itemToDelete._id) ? `Cannot delete` : `Delete Category`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{itemToDelete.name}</h4>
          <p>
            {categoryHasProducts(itemToDelete._id)
              ? "This category contains products. Make sure to change products to another category before proceeding to delete"
              : "Are you sure you want to delete this category category?"}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={cancelDelete}>Close</Button>
          {!categoryHasProducts(itemToDelete._id) && (
            <Button variant="danger" onClick={deleteCategory}>
              Delete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        <Link to="/create/category" className="btn btn-primary mb-3 mr-3">
          Create a category
        </Link>
        <Link to="/admin" className="btn btn-warning mb-3 ">
          Back to Dashboard
        </Link>
        {showCategories()}
        <DeleteModal show={showModal} onHide={() => setShowModal(false)} />
      </DashboardLayout>
    </Layout>
  );
};

export default ManageCategory;
