import * as Yup from 'yup';
export const ClientInfoSaveFormValidation = Yup.object().shape({
  url: Yup.string().required('Url is Required'),
});
