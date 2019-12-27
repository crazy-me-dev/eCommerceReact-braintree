import { useState, useEffect } from "react";

const useForm = (callback, initialState = {}, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event, { name, value }) => {
    setValues({
      ...values,
      [name]: value
    });
    /**Clear errors object so the form error messages dissapear  */
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      setErrors({});
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setIsSubmitting(true);
    if (validate) {
      let res = await validate(values);
      setErrors(res);
    } else {
      setErrors({});
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  return {
    handleChange,
    handleSubmit,
    setValues,
    values,
    errors
  };
};

export default useForm;
