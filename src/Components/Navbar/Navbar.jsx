import { Button, IconButton } from '@mui/material';
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems } from '../../Redux/cartAPI.js';
import { getWishlistItems } from '../../Redux/wishlistAPI.js';

export default function Navbar({ decodedUser, clearUserData }) {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { cartTotalQuantity } = useSelector(store => store.cartAPIReducer);
  const { wishlistTotalQuantity } = useSelector(store => store.wishlistAPIReducer);

  function logoutUser() {
    clearUserData();
    navigate('/login', { replace: true })
  }

  useEffect(function () {
    dispatch(getCartItems());
  }, [dispatch]);

  useEffect(function () {
    dispatch(getWishlistItems());
  }, [dispatch]);

  return <>
    <nav className="navbar navbar-expand-lg bg-main-light">
      <div className="container">
        <Link className="navbar-brand" to={'/home'}><img src={require('../../Images/freshcart-logo.jpg')} alt="freshcart logo" className='w-100' /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to={'/home'}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/categories'}>Categories</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/cart'}>Cart</Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {decodedUser ? <>
              <li className="nav-item">
                <div className="iconDiv">
                  <Link to={'/cart'}>
                    <IconButton>
                      <span className="iconCount">{cartTotalQuantity}</span>
                      <ShoppingCartIcon fontSize='medium' className='icon' />
                    </IconButton>
                  </Link>
                </div>
              </li>
              <li className="nav-item me-3">
                <div className="iconDiv">
                  <IconButton>
                    <span className="iconCount">{wishlistTotalQuantity}</span>
                    <FavoriteBorderIcon fontSize='medium' className='icon' />
                  </IconButton>
                </div>
              </li>
              <li className="nav-item">
                <Button onClick={logoutUser} variant="contained" color="success">Logout</Button>
              </li>
            </> : <>
              <li className="nav-item">
                <Link className="nav-link" to={'/login'}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={'/register'}>Register</Link>
              </li>
            </>}
          </ul>
        </div>
      </div>
    </nav>
  </>
}
