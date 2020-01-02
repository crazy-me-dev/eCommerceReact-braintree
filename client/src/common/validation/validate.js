import {
  SigninSchema,
  SignupSchema,
  UpdateProfileSchema,
  ProductSchema
} from "./validationSchemas";

export const validateSignin = async values => {
  try {
    await SigninSchema.validate(values, { abortEarly: false });
    /**if validation is succesful, return an empty object */
    return {};
  } catch (e) {
    /**error description and field name comes inside the e.inner array.
     * we loop through and set the errors object to the last error of each field*/
    return e.inner.reduce((errors, e) => {
      errors[e.path] = e.message;
      return errors;
    }, {});
  }
};

export const validateSignup = async values => {
  try {
    await SignupSchema.validate(values, { abortEarly: false });
    /**if validation is succesful, return an empty object */
    return {};
  } catch (e) {
    /**error description and field name comes inside the e.inner array.
     * we loop through and set the errors object to the last error of each field*/
    return e.inner.reduce((errors, e) => {
      errors[e.path] = e.message;
      return errors;
    }, {});
  }
};

export const validateUpdateProfile = async values => {
  try {
    await UpdateProfileSchema.validate(values, { abortEarly: false });
    /**if validation is succesful, return an empty object */
    return {};
  } catch (e) {
    /**error description and field name comes inside the e.inner array.
     * we loop through and set the errors object to the last error of each field*/
    return e.inner.reduce((errors, e) => {
      errors[e.path] = e.message;
      return errors;
    }, {});
  }
};

export const validateProduct = async values => {
  try {
    await ProductSchema.validate(values, { abortEarly: false });
    /**if validation is succesful, return an empty object */
    return {};
  } catch (e) {
    /**error description and field name comes inside the e.inner array.
     * we loop through and set the errors object to the last error of each field*/
    return e.inner.reduce((errors, e) => {
      errors[e.path] = e.message;
      return errors;
    }, {});
  }
};
