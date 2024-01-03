import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, getCartItems, removeFromCart } from '../../Redux/cartAPI.js';
import { addToWishlist, getWishlistItems, removeFromWishlist } from '../../Redux/wishlistAPI.js';
import Slider from 'react-slick';

export default function ProductDetails() {
  const { id } = useParams();

  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExistInCart, setIsExistInCart] = useState(false);
  const [isExistInWishlist, setIsExistInWishlist] = useState(false);

  const { cartItems } = useSelector(store => store.cartAPIReducer);
  const { wishlistItems } = useSelector(store => store.wishlistAPIReducer);

  const dispatch = useDispatch();

  async function getProductDetails(productID) {
    try {
      let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products/${productID}`);
      setProductDetails(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setProductDetails(null);
    }
  }

  useEffect(() => {
    getProductDetails(id);
    dispatch(getCartItems());
    dispatch(getWishlistItems());
  }, [id, dispatch]);

  useEffect(() => {
    if (cartItems && productDetails) {
      const existsInCart = cartItems.some(product => product.product._id === productDetails._id);
      setIsExistInCart(existsInCart);
    }
  }, [cartItems, productDetails]);

  useEffect(() => {
    if (wishlistItems && productDetails) {
      const existsInWishlist = wishlistItems.some(product => product._id === productDetails._id);
      setIsExistInWishlist(existsInWishlist);
    }
  }, [wishlistItems, productDetails]);

  async function handleAddToCart() {
    if (isExistInCart) {
      return;
    }
    await dispatch(addToCart(productDetails._id));
    setIsExistInCart(true);
  }

  async function handleRemoveFromCart() {
    if (!isExistInCart) {
      return;
    }
    await dispatch(removeFromCart(productDetails._id));
    setIsExistInCart(false);
  }

  async function handleAddToWishlist() {
    if (isExistInWishlist) {
      return;
    }
    await dispatch(addToWishlist(productDetails._id));
    setIsExistInWishlist(true);
  }

  async function handleRemoveFromWishlist() {
    if (!isExistInWishlist) {
      return;
    }
    await dispatch(removeFromWishlist(productDetails._id));
    setIsExistInWishlist(false);
  }

  const settings = {
    customPaging: function (i) {
      return <img src={productDetails.images[i]} alt={`slide-${i}`} className='w-100 rounded-3' />
    },
    arrows: false,
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return <>{loading ?
    <Box display='flex' justifyContent='center' alignItems='center' height={"75vh"}>
      <CircularProgress />
    </Box> : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5 extraMargin">
      <div className="row">
        <div className="col-4">
          <Slider {...settings}>{productDetails.images.slice(0, 4).map((image, index) => (
            <div key={index}>
              <img src={image} alt={`slide-${index}`} className='w-100' />
            </div>
          ))}
          </Slider>
        </div>
        <div className="col-8 d-flex flex-column justify-content-center">
          <Typography variant="h4" gutterBottom>
            {productDetails.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" className='mb-2'>
            <strong>Category:</strong> {productDetails.subcategory[0].name}
          </Typography>
          {productDetails.brand?.name ? <Typography variant="h6" color="text.secondary" className='mb-3'>
            <strong>Brand:</strong> {productDetails.brand?.name}
          </Typography> : <></>}
          <Typography variant="body1" color="text.secondary" className='mb-3'>
            {productDetails.description}
          </Typography>
          <div className="d-flex justify-content-between">
            <Typography variant="h5" color="error.main" className='mb-3'>
              <strong>EGP {productDetails.price}</strong>
            </Typography>
            <Typography variant="h6" className='mb-3'>
              <StarIcon sx={{ color: "rgb(255, 167, 38)" }} /> {productDetails.ratingsAverage}
            </Typography>
          </div>
          <div className="d-flex">
            <div className="col-6 me-2">
              {productDetails && <Button onClick={isExistInCart ? handleRemoveFromCart : handleAddToCart} variant="contained" color={isExistInCart ? "error" : "success"} className='w-100'>
                {isExistInCart ? <div className='d-flex align-items-center'><RemoveShoppingCartIcon className='me-1' />REMOVE FROM CART</div> : <div className='d-flex align-items-center'><ShoppingCartIcon className='me-1' />ADD TO CART</div>}
              </Button>}
            </div>
            <div className="col-6">
              {productDetails && <Button onClick={isExistInWishlist ? handleRemoveFromWishlist : handleAddToWishlist} variant="contained" color={isExistInWishlist ? "error" : "success"} className='w-100'>
                {isExistInWishlist ? <div className='d-flex align-items-center'><NotInterestedIcon className='me-1' />REMOVE FROM WISHLIST</div> : <div className='d-flex align-items-center'><FavoriteIcon className='me-1' />ADD TO WISHLIST</div>}
              </Button>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  }
  </>
}
