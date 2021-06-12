import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { ToastContainer } from 'react-toastify';
import Routes from './routes';
import axios from 'axios';
require('dotenv').config();
function App() {
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  return (
    <>
      <Routes></Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>

  );
}

export default App;
