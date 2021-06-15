import Layout from "../components/layout/Layout";

import { ClientInfoSaveFormValidation } from '../Constant/ValidationMessage';
import { Field, Form, Formik } from 'formik';
import { toastSuccess, toastError } from '../services/ToasterService'
import axios from 'axios';
import { useEffect, useState } from "react";
import SocialIcons from '../components/SocialIcons';
import PostList from "../components/PostList";
import PricingList from "../components/PricingList";
const HomePage = () => {
  const [fetchData, setFetchData] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [clientDetails, setClientDetails] = useState({});

  const fetchClients = async () => {
    try {
      const result = await axios.get("/clientinfos");
      setClientList(result.data);
      setFetchData(true);
      if (result.data.length) {
        setClientDetails({})
        setClientDetails(result.data[0]);
      }
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
  const onClickDetails = async (id) => {
    const data = clientList.find(item => item.id === id);
    if (data) {
      setClientDetails(data);
    } else {
      setClientDetails({});
    }
    console.log("details", clientDetails);
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <h1 className="display-3">UpsellX</h1>
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
                  <div className="input-group mb-1 mt-3">
                    <Field type="text" name="url" className="form-control" placeholder="https://example.com/" />
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" type="submit">Submit</button>
                    </div>
                  </div>
                  {errors.url && touched.url ? (<div className="text-danger">{errors.url}</div>) : null}
                </Form>
              )}
            </Formik>
            <br />

          </div>

        </div>
        <div className="row">
          <div className="col-md-4">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {clientList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td><a href="#" onClick={() => onClickDetails(item.id)}>{item.url}</a></td>
                      <td>
                        {/* <button className="btn btn-sm btn-inf" onClick={() => onClickDetails(item.id)}>Details</button> */}
                        <button className="btn btn-sm btn-danger" onClick={() => onClickDelete(item.id)}>Delete</button>
                      </td>
                    </tr>
                  )
                })}

              </tbody>
            </table>
          </div>
          <div className="col-md-8">
            <div className="card">
              <h6 className="card-header">Client Details</h6>
              <div className="card-body">
                <div className="client-information-item">
                  <strong>Url:</strong> {clientDetails?.url}
                </div>
                <SocialIcons socialLinks={clientDetails.socialLinks}></SocialIcons>
                {/* <div className="client-information-item social-icons">
                  <h6 className="mb-1">Social links:</h6>
                  {clientDetails?.socialLinks?.facebookLink ? (<a href={clientDetails?.socialLinks?.facebookLink} className="fa fa-facebook" target="_blank"></a>) : null}
                  {clientDetails?.socialLinks?.twitterUrl ? (<a href={clientDetails?.socialLinks?.twitterUrl} className="fa fa-twitter" target="_blank"></a>) : null}
                  {clientDetails?.socialLinks?.linkedInLink ? (<a href={clientDetails?.socialLinks?.linkedInLink} className="fa fa-linkedin" target="_blank"></a>) : null}
                  {clientDetails?.socialLinks?.youtubeLink ? (<a href={clientDetails?.socialLinks?.youtubeLink} className="fa fa-youtube" target="_blank"></a>) : null}
                  {clientDetails?.socialLinks?.instagramLink ? (<a href={clientDetails?.socialLinks?.instagramLink} className="fa fa-instagram" target="_blank"></a>) : null}
                </div> */}
                {clientDetails && clientDetails?.posts?.length ? <PostList postList={clientDetails?.posts}></PostList> : null}
                {clientDetails && clientDetails?.prices?.length ? <PricingList pricingList={clientDetails?.prices}></PricingList> : null}

              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default HomePage;