import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { signup } from '../auth';
import Layout from '../core/Layout';

const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  });

  const { name, email, password, success, error } = values;

  const handleChange = event => {
    setValues({ ...values, error: false, [event.target.name]: event.target.value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: false });
    const data = await signup({ name, email, password });

    if (data.error) {
      setValues({ ...values, error: data.error, success: false });
    } else {
      setValues({ ...values, name: '', email: '', password: '', error: '', success: true });
    }
  };

  const signupForm = () => {
    return (
      <div className='container col-sm-6'>
        <article className='card bg-light'>
          <form className='card-body mx-auto'>
            <h4 className='card-title mt-3 text-center'>Create Account</h4>
            <p className='text-center'>Get started with your free account</p>

            {showError()}
            {showSuccess()}
            <div className='form-group input-group'>
              <div className='input-group-prepend'>
                <span className='input-group-text'>
                  {' '}
                  <i className='fa fa-user'></i>{' '}
                </span>
              </div>
              <input
                className='form-control'
                placeholder='Full name'
                type='text'
                name='name'
                value={name}
                onChange={handleChange}
              />
            </div>
            <div className='form-group input-group'>
              <div className='input-group-prepend'>
                <span className='input-group-text'>
                  {' '}
                  <i className='fa fa-envelope'></i>{' '}
                </span>
              </div>
              <input
                className='form-control'
                placeholder='Email address'
                type='email'
                name='email'
                value={email}
                onChange={handleChange}
              />
            </div>

            <div className='form-group input-group'>
              <div className='input-group-prepend'>
                <span className='input-group-text'>
                  {' '}
                  <i className='fa fa-lock'></i>{' '}
                </span>
              </div>
              <input
                className='form-control'
                placeholder='Create password'
                type='password'
                name='password'
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <button type='submit' className='btn btn-primary btn-block' onClick={handleSubmit}>
                {' '}
                Create Account{' '}
              </button>
            </div>
            <p className='text-center'>
              Have an account? <Link to='/signin'>Sign In</Link>{' '}
            </p>
          </form>
        </article>
      </div>
    );
  };

  const showSuccess = () => (
    <div className='alert alert-info' style={{ display: success ? '' : 'none' }}>
      New Account has been created. Please <Link to='signin'>Sign in</Link>
    </div>
  );
  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );
  return (
    <Layout title='Signup Page' description='Node React E-commerce App' className='container'>
      {signupForm()}
    </Layout>
  );
};

export default Signup;
