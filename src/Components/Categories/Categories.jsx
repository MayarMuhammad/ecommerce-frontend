import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { Box, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Categories() {

  const [allCategories, setAllCategories] = useState([]);
  const [loadingDone, setLoadingDone] = useState(undefined);

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

  return <>
    {(loadingDone && allCategories) ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container px-5 my-5">
      <div className="row">
        <div className="col-sm-6 col-md-4 col-lg-3 d-flex flex-column justify-content-center">
          <Typography variant="h4" color={'primary.main'} gutterBottom>
            Our Categories
          </Typography>
          <Typography variant="body1" color="text.secondary" className='mb-3'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam eaque blanditiis inventore obcaecati fuga officiis consectetur odit debitis asperiores totam.
          </Typography>
        </div>
        {allCategories.map(function (category, index) {
          return <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
            <Link to={`/categorydetails/${category._id}`} id={category._id} className='text-decoration-none'>
              <img className="w-100 rounded-3" style={{ height: '350px' }} src={category.image} alt={category.name} />
              <Typography variant="h6" className='text-center' gutterBottom>
                {category.name}
              </Typography>
            </Link>
          </div>
        })}
      </div>
    </motion.div> : <Box display='flex' justifyContent='center' alignItems='center' height={"100vh"}>
      <CircularProgress />
    </Box>}

  </>
}
