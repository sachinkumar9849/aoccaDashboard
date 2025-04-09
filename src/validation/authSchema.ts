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

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    slug: Yup.string().required("Slug is required"),
 
    status: Yup.string().required("Status is required"),
    meta_title: Yup.string().required("Meta title is required"),
    meta_description: Yup.string()
      .required("Meta description is required"),
    meta_keywords: Yup.string().required("Meta keywords are required"),
    // image: Yup.mixed().required("Image is required"),
  });