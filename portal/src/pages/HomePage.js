import Layout from "../components/layout/Layout";

import { ClientInfoSaveFormValidation } from '../Constant/ValidationMessage';
import { Field, Form, Formik } from 'formik';
import { toastSuccess, toastError } from '../services/ToasterService'
import axios from 'axios';


const HomePage = () => {
  const onFinish = async (values) => {
    console.log("values", values);
    try {
      const result = await axios.post(
        `/clientinfos`,
        values,
      );
      if (result) {
        toastSuccess('Thank you for the submission. We will contact you soon!');
      } else {
        toastError('Save Failed');
      }
    } catch (error) {
      toastError('Save Failed');
    }
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <h1 className="display-2">UpsellX</h1>
            <Formik
              initialValues={{
                url: '',
              }}
              validationSchema={ClientInfoSaveFormValidation}
              onSubmit={async (values) => {
                onFinish(values);
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="input-group mb-3 mt-3">
                    <Field type="text" name="url" className="form-control" placeholder="https://example.com/" />
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="submit">Submit</button>
                    </div>
                  </div>
                  {errors.url && touched.url ? (<div className="text-danger">{errors.url}</div>) : null}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage;