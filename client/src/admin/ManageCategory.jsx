import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Divider, Button, Header, Icon, Modal, Table, Popup } from "semantic-ui-react";
import moment from "moment";

/**custom imports */
import Layout from "../layout/Layout";
import DashboardLayout from "../layout/DashboardLayout";
import { isAuthenticated } from "../auth";
import { getCategories, removeCategory, getCategoriesInUse } from "./apiAdmin";
import { ButtonContainer } from "../common/components/customComponents";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Table.Row key={category._id}>
        <Table.Cell>{category.name && category.name}</Table.Cell>

        <Table.Cell>{category.createdAt && moment(category.createdAt).format("ll")}</Table.Cell>
        <Table.Cell>{category.updatedAt && moment(category.updatedAt).format("ll")}</Table.Cell>
        {/* <Table.Cell>{category._id && categoryHasProducts() ? "Yes" : "No"}</Table.Cell> */}
        <Table.Cell align="center">
          {category._id && categoryHasProducts(category._id) ? "Yes" : "No"}
        </Table.Cell>

        <Table.Cell>
          <Popup
            content="Update Product"
            position="top right"
            trigger={
              <Button to={`/admin/category/${category._id}`} as={Link} icon="edit" color="teal" />
            }
          />
          <Popup
            content="Delete Product"
            position="top right"
            trigger={<Button onClick={() => handleDelete(category)} icon="delete" color="red" />}
          />
        </Table.Cell>
      </Table.Row>
    ));
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Category Name</Table.HeaderCell>
            <Table.HeaderCell>Created</Table.HeaderCell>
            <Table.HeaderCell>Last Update</Table.HeaderCell>
            <Table.HeaderCell>Contain Products</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{tableItems}</Table.Body>
      </Table>
    );
  };

  const deleteModal = () => (
    <Modal closeOnEscape={true} open={showModal} dimmer="blurring" size="tiny">
      <Header
        icon="trash alternate"
        content={categoryHasProducts(itemToDelete._id) ? `Cannot delete` : `Delete Category`}
      />
      <Modal.Content>
        <Header as="h3">{itemToDelete.name}</Header>
        <p>
          {" "}
          {categoryHasProducts(itemToDelete._id)
            ? "This category contains products. Make sure to change products to another category before proceeding to delete"
            : "Are you sure you want to delete this category category?"}{" "}
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={cancelDelete} color="red">
          <Icon name="remove" /> No
        </Button>
        {!categoryHasProducts(itemToDelete._id) && (
          <Button onClick={deleteCategory} color="green">
            <Icon name="checkmark" /> Yes
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );

  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        <Container fluid style={{ marginTop: "2rem" }}>
          <Header as="h1">Category Management</Header>
          <ButtonContainer>
            <Button as={Link} fluid color="green" to="/admin/category/create">
              Create Category
            </Button>
          </ButtonContainer>
        </Container>
        <Divider />

        <Header as="h3">List of Categories</Header>
        {showCategories()}
        {deleteModal()}
      </DashboardLayout>
    </Layout>
  );
};

export default ManageCategory;
