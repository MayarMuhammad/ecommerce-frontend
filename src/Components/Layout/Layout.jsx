import React from 'react'
import Navbar from './../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer.jsx';
import { AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify';

export default function Layout({ decodedUser, clearUserData }) {
  return <>
    <ToastContainer position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={true}
      pauseOnHover
      theme="light" />
    <Navbar decodedUser={decodedUser} clearUserData={clearUserData} />
    <AnimatePresence>
      <Outlet />
    </AnimatePresence>
    <Footer />
  </>
}
