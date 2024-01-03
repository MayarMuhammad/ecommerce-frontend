import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from "framer-motion"
import { Box, Button } from "@mui/material";
import { clearCart, getCartItems } from '../../Redux/cartAPI.js';
import CartItem from '../CartItem/CartItem.jsx';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Cart() {

  const { cartItems, status, cartTotalAmount } = useSelector(store => store.cartAPIReducer);

  const [totalAmount, setTotalAmount] = useState(cartTotalAmount);

  const updateCartTotalAmount = (updatedCartItems) => {
    const totalAmount = updatedCartItems?.reduce((accumulator, item) => {
      return accumulator + item.count * item.price;
    }, 0);
    console.log(totalAmount);
    setTotalAmount(totalAmount);
  };

  const dispatch = useDispatch();

  useEffect(function () {
    dispatch(getCartItems())
  }, [dispatch]);

  useEffect(() => {
    setTotalAmount(cartTotalAmount);
  }, [cartTotalAmount]);

  return <>
    <div className="mt-5 text-center">
      <h2>Shopping Cart</h2>
    </div>
    {(status === 'success' || status === 'failed') ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5">
      <div className="row">
        {cartItems.length > 0 ? <div className='mt-5'>
          <div className="row border-bottom px-0 py-2 fw-bold">
            <div className="col-5">
              <p className='m-0'>Product</p>
            </div>
            <div className="col-2">
              <p className='text-center m-0'>Price</p>
            </div>
            <div className="col-3">
              <p className='text-center m-0'>Quantity</p>
            </div>
            <div className="col-2">
              <p className='text-end m-0'>Total</p>
            </div>
          </div>
          {cartItems.map((item, index) => {
            return <CartItem key={index} item={item} index={index} updateCartTotalAmount={updateCartTotalAmount} />
          })}
          <div>
            <div className='row px-0 py-4'>
              <div className="col-8">
                <Button color='error' variant="contained" onClick={() => { dispatch(clearCart()) }}>Clear Cart</Button>
              </div>
              <div className="col-2">
                <div className="d-flex justify-content-end"><p className='me-5'>SubTotal</p></div>
              </div>
              <div className="col-2">
                <div className="d-flex justify-content-end"><p>{totalAmount}  EGP</p></div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <Link to={'/payment'}>
                <Button variant="contained" color='success' style={{ width: 200 }}>CheckOut</Button>
              </Link>
            </div>
          </div>
        </div>
          : <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' height={"50vh"}>
            <h3 className='mb-3'>Cart Is Empty</h3>
            <Link to={'/home'}>
              <Button variant="text" color="success" className='w-100'><ShoppingCartIcon className='me-1' /> Go Shopping</Button>
            </Link>
          </Box>}
      </div>
    </motion.div> : <Box display='flex' justifyContent='center' alignItems='center' height={"75vh"}>
      <CircularProgress />
    </Box>}
  </>
}
