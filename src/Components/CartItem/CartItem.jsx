import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Button } from "@mui/material";
import { removeFromCart } from '../../Redux/cartAPI.js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function CartItem({ item, index, updateCartTotalAmount }) {

  const dispatch = useDispatch();

  const [count, setCount] = useState(item.count);
  const [totalPrice, setTotalPrice] = useState(item.count * item.price);
  const [isLoading, setIsLoading] = useState(false);

  async function increaseItemQuantity(productID, currentCount) {
    try {
      setIsLoading(true);
      const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productID}`, { count: currentCount + 1 }, { headers: { token: localStorage.getItem('token') } });
      data.data.products.forEach(product => {
        if (product.product._id === productID) {
          setCount(product.count);
          setTotalPrice(product.count * product.price);
          toast.success('Product Quantity increased');
        }
      });
      updateCartTotalAmount(data.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function decreaseItemQuantity(productID, currentCount) {
    try {
      setIsLoading(true);
      if (currentCount > 1) {
        const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productID}`, { count: currentCount - 1 }, { headers: { token: localStorage.getItem('token') } });
        data.data.products.forEach(product => {
          if (product.product._id === productID) {
            setCount(product.count);
            setTotalPrice(product.count * product.price);
            toast.success('Product Quantity decreased');
          }
        });
        updateCartTotalAmount(data.data.products);
      } else {
        toast.error("Minimum quantity reached");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return <>
    <div className="row border-bottom px-0 py-2" key={index} id={item.product._id} disabled={isLoading}>
      <div className="col-5">
        <div className="d-flex">
          <div className="cartItemImage me-3"><img src={item.product.imageCover} alt={item.product.title} className='cartItemImage rounded-5' /></div>
          <div className="cartItemsDetails d-flex flex-column align-items-start justify-content-center">
            <Link to={`/productdetails/${item.product._id}`} className='text-decoration-none mb-2'>{item.product.title}</Link>
            <Button color='error' onClick={() => dispatch(removeFromCart(item.product._id))}>Remove</Button>
          </div>
        </div>
      </div>
      <div className="col-2 d-flex align-items-center justify-content-center">
        <p className='m-0'>EGP {item.price}</p>
      </div>
      <div className="col-3 d-flex align-items-center justify-content-center">
        <div className="cart-product-quantity">
          <button onClick={() => decreaseItemQuantity(item.product._id, count)}>-</button>
          <div className="count">{count}</div>
          <button onClick={() => increaseItemQuantity(item.product._id, count)}>+</button>
        </div>
      </div>
      <div className="col-2 d-flex align-items-center justify-content-end">
        <p className='m-0'>{Number((totalPrice).toFixed(2))}  EGP </p>
      </div>
    </div>
  </>
}
