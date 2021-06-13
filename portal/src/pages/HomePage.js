import Layout from "../components/layout/Layout";

import { ClientInfoSaveFormValidation } from '../Constant/ValidationMessage';
import { Field, Form, Formik } from 'formik';
import { toastSuccess, toastError } from '../services/ToasterService'
import axios from 'axios';
import { useEffect, useState } from "react";

const HomePage = () => {
  const [fetchData, setFetchData] = useState(false);
  const [clientList, setClientList] = useState([]);

  const fetchClients = async () => {
    try {
      const result = await axios.get("/clientinfos");
      setClientList(result.data);
      setFetchData(true);
    } catch (error) {
      console.log(error);
      setFetchData(true);
    }
  };

  useEffect(() => {
    if (!fetchData) fetchClients();
  }, [fetchData])

  const checkDuplicate = (url) => {
    const found = clientList.find(item => {
      return item.url.includes(url);
    });
    return found ? true : false;
  }

  const getHostname = (url) => {
    return new URL(url).hostname;
  }

  const onFinish = async (values) => {
    if (checkDuplicate(getHostname(values.url))) {
      toastSuccess("Website already exist");
      return;
    }
    console.log("values", values);
    try {
      const result = await axios.post(
        `/clientinfos`,
        values,
      );
      if (result) {
        toastSuccess('Thank you for the submission. We will contact you soon!');
        const list = clientList;
        list.push(result.data);
        setClientList([]);
        setClientList(list);
        console.log("clientList", clientList);
      } else {
        toastError('Save Failed');
      }
    } catch (error) {
      toastError('Save Failed');
    }
  }

  const onClickDelete = async (id) => {
    try {
      const result = await axios.delete(`/clientinfos/${id}`);
      const newClients = clientList.filter(item => item.id != id);
      setClientList(newClients);
      toastSuccess(result.data.message)
    } catch (error) {
      toastError(error.message)
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
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Url</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {clientList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td><a href="#">{item.url}</a></td>
                      <td><button className="btn btn-sm btn-danger" onClick={() => onClickDelete(item.id)}>Delete</button></td>
                    </tr>
                  )
                })}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default HomePage;