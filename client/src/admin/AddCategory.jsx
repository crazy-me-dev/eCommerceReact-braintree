import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";

import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { createCategory, getCategory, updateCategory } from "../admin/apiAdmin";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

const AddCategory = props => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [inputRef, setInputFocus] = useFocus();
  const [category, setCategory] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const {
    user: { _id: userId, name: userName },
    token
  } = isAuthenticated();

  const load = async () => {
    const categoryId = props.match.params.categoryId ? props.match.params.categoryId : null;
    let category;
    if (categoryId) {
      setIsUpdating(true);
      category = await getCategory(userId, token, categoryId);
      if (category.error) {
        setError(category.error);
      } else {
        setCategory(category);
        setName(category.name);
      }
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = e => {
    setError("");
    setSuccess(false);
    setName(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    //make requeest
    let data;
    if (isUpdating) data = updateCategory({ name }, userId, token, category._id);
    else data = await createCategory({ name }, userId, token);
    if (data.error) {
      setError(data.error);
      setSuccess(false);
    } else {
      if (isUpdating) {
        setRedirect(true);
      }
      setSuccess(true);
      setName("");
      setInputFocus();
    }
  };

  const shouldRedirect = () => {
    if (redirect) return <Redirect to="/admin/category"></Redirect>;
  };

  const showSuccess = () => (
    <div className="alert alert-info" style={{ display: success ? "" : "none" }}>
      New Category has been created.
    </div>
  );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      Category {error}
    </div>
  );
  const goBack = () => (
    <div className=" mt-5">
      <Link to="/admin/category" className="text-warning">
        Back to Dashboard &larr;
      </Link>
    </div>
  );

  const newCategoryForm = () => {
    return (
      <div className="card">
        <article className=" bg-light">
          <h4 className="card-title mt-3 text-center">{isUpdating ? "Update" : "Add"}</h4>
          <form className="card-body mx-auto">
            <div className="form-group input-group">
              <input
                name="name"
                type="text"
                placeholder="Enter Name"
                className="form-control"
                autoFocus
                value={name}
                onChange={handleChange}
                ref={inputRef}
              />
              <div className="input-group-append">
                <button
                  type="submit"
                  className="btn btn-outline-primary float-right"
                  onClick={handleSubmit}
                >
                  {isUpdating ? "Update" : "Create"}
                </button>
              </div>
            </div>
            {goBack()}
          </form>
        </article>
      </div>
    );
  };

  return (
    <Layout title="Category Form" description={`G'day ${userName}`} className="container">
      <div className="row">
        {shouldRedirect()}
        <div className="col-md-8 offset-md-2">
          {showError()}
          {showSuccess()}
          {newCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default AddCategory;
