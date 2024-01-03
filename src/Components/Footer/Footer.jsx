import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {
  return <>
    <footer className="p-5 bg-main-light">
      <div className="container-fluid">
        <h3>Get the FreshCart app</h3>
        <p>We will send you a link, Open it on your phone to download the app.</p>
        <form className='row mx-3 border-bottom'>
          <div className="mb-3 col-md-10">
            <input type="email" className="form-control" id="exampleInputEmail1" placeholder='Enter your Email ...' />
          </div>
          <div className="mb-3 col-md-2">
            <button type="submit" className="btn btn-success w-100">Get App Link</button>
          </div>
        </form>
        <div className="row mx-3 border-bottom">
          <div className="col-xl-6">
            <ul className='list-unstyled d-flex align-items-center my-4'>
              <li className='me-3'><h6>Payment Partners</h6></li>
              <li className='paymentLogo me-3'><img src={require('../../Images/Amazon_Pay_logo.png')} alt="amazon pay logo" className='w-100' /></li>
              <li className="paymentLogo me-3"><img src={require('../../Images/MasterCard_logo.png')} alt="mastercard logo" className='w-100' /></li>
              <li className="paymentLogo me-3"><img src={require('../../Images/paypal-logo.png')} alt="paypal logo" className='w-100' /></li>
              <li className="paymentLogo me-3"><img src={require('../../Images/American-Express-Logo.png')} alt="american express logo" className='w-100' /></li>
            </ul>
          </div>
          <div className="col-xl-6">
            <ul className='list-unstyled d-flex align-items-center justify-content-end my-4'>
              <li className='me-2'><h6>Get deliveries with FreshCart</h6></li>
              <li className='me-3'><Link type="submit"><img src={require('../../Images/apple store.png')} alt="apple store logo" className='storesLogo' /></Link></li>
              <li className="me-3"><Link type="submit"><img src={require('../../Images/google play.png')} alt="google play logo" className='storesLogo' /></Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </>
}
