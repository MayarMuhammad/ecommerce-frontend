import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../Redux/cartAPI.js';


export default function CategoryDetails() {

  const [categoryDetails, setCategoryDetails] = useState([]);
  const [loadingDone, setLoadingDone] = useState(undefined);

  const dispatch = useDispatch();

  const { id } = useParams();

  async function getCategoryDetails(categoryID) {
    try {
      let { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/products', { params: { 'category': categoryID } });
      setCategoryDetails(data.data);
      setLoadingDone(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(function () {
    getCategoryDetails(id);
  }, [id]);

  return <>
    {(loadingDone && categoryDetails) ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5">
      <div className="row">
        {categoryDetails.length === 0 ? <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' height='450px'>
          <Typography variant="h4" gutterBottom>
            <strong>No Products Available</strong>
          </Typography>
        </Box> : categoryDetails.length > 3 ?
          categoryDetails.map(function (category, index) {
            return <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch">
              <Link to={`/productdetails/${category._id}`} className="card text-decoration-none" id={category._id}>
                <img className="card-img" src={category.imageCover} alt={category.title} />
                <div className="card-body d-flex flex-column">
                  <h4 className="card-title">{category.title.split(/\s+/).slice(0, 8).join(" ")}</h4>
                  <h6 className="card-subtitle mb-2 text-muted"><strong>SubCategory: </strong>{category.subcategory[0].name}</h6>
                  <p className="card-text">{category.description.split(/\s+/).slice(0, 8).join(" ")} . . .</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto ">
                    <div className="text-danger"><h5><strong> EGP {category.price}</strong></h5></div>
                    <Link to="#">
                      <Button onClick={function () { dispatch(addToCart(category._id)) }} variant="contained" color="success" className='w-100'><ShoppingCartIcon className='me-1' /> ADD TO CARD</Button></Link>
                  </div>
                </div>
              </Link>
            </div>
          }) : categoryDetails.map(function (category, index) {
            console.log(category);
            return <div key={index} className="col-sm-6 col-md-4 mb-4 d-flex align-items-stretch">
              <Link to={`/productdetails/${category._id}`} className="card text-decoration-none" id={category._id}>
                <img className="card-img" src={category.imageCover} alt={category.title} />
                <div className="card-body d-flex flex-column">
                  <h4 className="card-title">{category.title.split(/\s+/).slice(0, 8).join(" ")}</h4>
                  <h6 className="card-subtitle mb-2 text-muted"><strong>SubCategory: </strong>{category.subcategory[0].name}</h6>
                  <p className="card-text">{category.description.split(/\s+/).slice(0, 8).join(" ")} . . .</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto ">
                    <div className="text-danger"><h5><strong> EGP {category.price}</strong></h5></div>
                    <Link to="#">
                      <Button onClick={function () { dispatch(addToCart(category._id)) }} variant="contained" color="success" className='w-100'><ShoppingCartIcon className='me-1' /> ADD TO CARD</Button></Link>
                  </div>
                </div>
              </Link>
            </div>
          })
        }
      </div >
    </motion.div > : <Box display='flex' justifyContent='center' alignItems='center' height={"100vh"}>
      <CircularProgress />
    </Box>}
  </>
}
