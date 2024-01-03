import axios from "axios";
import React, { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from "framer-motion"
import { Box, Button } from "@mui/material";
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch } from "react-redux";
import { addToCart } from "../../Redux/cartAPI.js";
import Slider from "react-slick";

export default function Home() {

  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loadingDone, setLoadingDone] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  const getAllProducts = async (page = 1) => {
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products?page=${page}&limit=30`);
      setAllProducts((prevProducts) => [...prevProducts, ...data.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    getAllProducts(nextPage);
    setCurrentPage(nextPage);
  };

  async function getAllCategories() {
    try {
      let { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/categories');
      // console.log(data.data);
      setAllCategories(data.data);
      setLoadingDone(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(function () {
    getAllCategories();
  }, [])

  useEffect(function () {
    getAllProducts();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
  };

  return <>
    {(loadingDone && allProducts.length !== 0 && allCategories.length !== 0) ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5">
      <div className="row">
        <div className="col-12 mb-5">
          <h4>Shop Popular Categories</h4>
          <Slider {...settings}>{allCategories.map((category, index) => (
            <Link key={index} to={`/categorydetails/${category._id}`} className='text-decoration-none'>
              <img src={category.image} alt={`slide-${index}`} className='w-100 sliderImage px-2 rounded-5' />
              <p className="text-center">{category.name}</p>
            </Link>
          ))}
          </Slider>
        </div>
      </div>
      <div className="row">
        {allProducts.map(function (product, index) {
          return <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex align-items-stretch">
            <Link to={`/productdetails/${product.id}`} className="card text-decoration-none" id={product.id}>
              <img className="card-img mx-auto" src={product.imageCover} alt={product.title} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.title.split(/\s+/).slice(0, 8).join(" ")}</h5>
                <h6 className="card-subtitle mb-2 text-muted"><strong>SubCategory: </strong>{product.subcategory[0].name}</h6>
                <p className="card-text">{product.description.split(/\s+/).slice(0, 8).join(" ")} . . .</p>
                <div className="d-flex justify-content-between align-items-center mt-auto ">
                  <div className="text-danger"><h5><strong> EGP {product.price}</strong></h5></div>
                  <Link to="#">
                    <Button onClick={function () { dispatch(addToCart(product.id)) }} variant="contained" color="success" className='w-100'><ShoppingCartIcon className='me-1' /> ADD TO CARD</Button>
                  </Link>
                </div>
              </div>
            </Link>
          </div>
        })}
      </div >
      <div className="text-center mt-3">
        <Button onClick={handleLoadMore} variant="contained" color="primary">Load More</Button>
      </div>
    </motion.div > : <Box display='flex' justifyContent='center' alignItems='center' height={"50vh"}>
      <CircularProgress />
    </Box>
    }
  </>
}
