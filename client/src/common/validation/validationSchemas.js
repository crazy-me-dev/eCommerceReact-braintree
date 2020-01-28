import * as yup from "yup";

export const SigninSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .matches(/\d/, "Password must contain at least one digit")
    .min(6)
    .required()
});

export const SignupSchema = yup.object().shape({
  name: yup
    .string()
    .min(6)
    .required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .matches(/\d/, "Password must contain at least one digit")
    .min(6)
    .required()
});

export const UpdateProfileSchema = yup.object().shape({
  name: yup
    .string()
    .min(6)
    .required(),
  street: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  country: yup.string().required(),
  zip: yup.string().required()
});
