import React, { useEffect, useState } from "react";
import { Navigate, RouterProvider, createHashRouter } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Home from "./Components/Home/Home";
import NotFound from "./Components/NotFound/NotFound";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import ResetCode from "./Components/ResetCode/ResetCode";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import {jwtDecode} from "jwt-decode";
import ProductDetails from "./Components/ProductDetails/ProductDetails";
import Categories from "./Components/Categories/Categories";
import CategoryDetails from "./Components/CategoryDetails/CategoryDetails";
import Cart from "./Components/Cart/Cart.jsx";
import { toast } from "react-toastify";
import Payment from "./Components/Payment/Payment.jsx";
import AllOrders from "./Components/AllOrders/AllOrders.jsx";


export default function App() {

  const [decodedUser, setDecodedUser] = useState(null);

  function ProtectedRoute({ children }) {
    const loggedUser = localStorage.getItem("token");
    if (!loggedUser) {
      toast.warning('Please Login First');
      return <>
        <Navigate to={"/login"} />
      </>
    } else {
      return <>{children}</>
    }
  }

  function decodeUser() {
    const decodedToken = jwtDecode(localStorage.getItem("token"));
    setDecodedUser(decodedToken);
  }

  function clearUserData() {
    localStorage.removeItem("token");
    setDecodedUser(null);
  }

  useEffect(
    function () {
      if (localStorage.getItem("token") && !decodedUser) {
        decodeUser();
      }
    },
    [decodedUser]
  );

  const router = createHashRouter([
    {
      path: "",
      element: (<Layout clearUserData={clearUserData} decodedUser={decodedUser} />),
      children: [
        { path: "login", element: <Login decodeUser={decodeUser} /> },
        { path: "register", element: <Register /> },
        { path: "forgetpassword", element: <ForgetPassword /> },
        { path: "resetcode", element: <ResetCode /> },
        { path: "resetpassword", element: <ResetPassword /> },
        { path: "home", element: <Home />, },
        { path: "", element: <Home /> },
        { path: "cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
        { path: "payment", element: <ProtectedRoute><Payment /></ProtectedRoute> },
        { path: "allOrders", element: <ProtectedRoute><AllOrders /></ProtectedRoute> },
        { path: "categories", element: <Categories /> },
        { path: "categorydetails/:id", element: <CategoryDetails /> },
        { path: "productdetails/:id", element: <ProtectedRoute><ProductDetails /></ProtectedRoute> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}
