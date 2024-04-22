import * as Yup from 'yup';

export const AuthStepKeys = {
  VERIFY_EMAIL: 0,
  VERIFY_OTP: 1,
  RESET_PASSWORD: 2,
};

export const passwordResetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Password is required')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase char')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special char'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const PASSWORD_RESET_INITIAL_VALUES = {
  newPassword: '',
  confirmNewPassword: '',
};

export const SIGN_UP_FORM_INITIAL_VALUES = {
  name: '',
  mobile: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAndConditions: false,
  countryCode: { label: 'UK', value: '+44', flag: '🇬🇧' },
};

export const signUpSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  countryCode: Yup.object().shape({
    label: Yup.string().required('Code is required'),
    value: Yup.string().required('Code is required'),
    flag: Yup.string().required('Code is required'),
  }),
  email: Yup.string().email('Invalid email').required('Email is required'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
    .min(10, 'Mobile number is too short - should be 10 digits minimum.')
    .max(10),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase char')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase char')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special char'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const PHONE_INITIAL_VALUES = {
  countryCode: { label: 'UK', value: '+44', flag: '🇬🇧' },
  mobile: '',
};

export const phoneSchema = Yup.object().shape({
  countryCode: Yup.object().shape({
    label: Yup.string().required('Code is required'),
    value: Yup.string().required('Code is required'),
    flag: Yup.string().required('Code is required'),
  }),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
    .min(10, 'Mobile number is too short - should be 10 digits minimum.')
    .max(10),
});

export const ADD_PHONE_INITIAL_VALUES = {
  countryCode: { label: 'UK', value: '+44', flag: '🇬🇧' },
  mobile: '',
};

export const addPhoneSchema = Yup.object().shape({
  countryCode: Yup.object().shape({
    label: Yup.string().required('Code is required'),
    value: Yup.string().required('Code is required'),
    flag: Yup.string().required('Code is required'),
  }),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]+$/, 'Mobile number must contain only digits')
    .min(10, 'Mobile number is too short - should be 10 digits minimum.')
    .max(10),
});
