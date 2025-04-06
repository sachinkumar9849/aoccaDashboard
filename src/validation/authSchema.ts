import * as Yup from 'yup';

export const registerSchema = Yup.object({
  first_name: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  
  last_name: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  
  user_type: Yup.string()
    .required('User type is required')
    .oneOf(['student', 'admin'], 'Invalid user type')
});