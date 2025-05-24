// src/schemas/leadSchema.ts
import * as yup from 'yup';

export const leadSchema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  phone: yup.string().required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required'),
  previous_qualification: yup.string().required('Previous qualification is required'),
  current_status: yup.string().required('Current status is required'),
  lead_source: yup.string().required('Lead source is required'),
  inquiry: yup.string().required('Inquiry is required'),
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
  status: yup.string().required('Status is required'),
//   follow_up_date: yup.date().required('Follow up date is required'),
  tag: yup.string().required('Tag is required'),
});