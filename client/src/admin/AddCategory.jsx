import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { createCategory } from "../admin/apiAdmin";

const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [inputRef, setInputFocus] = useFocus();

  const {
    user: { _id: userId, name: userName },
    token
  } = isAuthenticated();

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
    const data = await createCategory({ name }, userId, token);
    if (data.error) {
      setError(data.error);
      setSuccess(false);
    } else {
      setSuccess(true);
      setName("");
      setInputFocus();
    }
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
      <Link to="/admin/dashboard" className="text-warning">
        Back to Dashboard &larr;
      </Link>
    </div>
  );

  const newCategoryForm = () => {
    return (
      <div className="card">
        <article className=" bg-light">
          <h4 className="card-title mt-3 text-center">Add Category</h4>
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
                  Create
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
