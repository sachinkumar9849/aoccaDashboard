// src/schemas/leadSchema.ts
import * as yup from 'yup';

export const leadSchema = yup.object().shape({
  full_name: yup.string().required('Full name is required'),
  phone: yup.string().required('Phone number is required'),
 
  address: yup.string().required('Address is required'),
 

  lead_source: yup.string().required('Lead source is required'),
  inquiry: yup.string().required('Inquiry is required'),
 
  status: yup.string().required('Status is required'),
//   follow_up_date: yup.date().required('Follow up date is required'),
 
});