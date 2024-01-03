import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, CircularProgress, Fade, ThemeProvider, Tooltip, createTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { motion } from "framer-motion"
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';


const StyledNumberInput = styled(TextField)`
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
`;

const inputTheme = createTheme({
  palette: {
    error: {
      main: '#f44336',
    },
  },
});

const buttonTheme = createTheme({
  palette: {
    action: {
      disabledBackground: 'rgba(102, 187, 106,0.7)',
      disabled: 'rgba(0, 0, 0, 0.7)',
    }
  }
})

export default function Payment() {

  const { cartID } = useSelector(store => store.cartAPIReducer);

  const [cashLoading, setCashLoading] = useState(false);
  const [creditLoading, setCreditLoading] = useState(false);
  const [cashDisabled, setCashDisabled] = useState(false);
  const [creditDisabled, setCreditDisabled] = useState(false);

  const navigate = useNavigate();

  async function confirmCashOrder(values) {
    setCreditDisabled(true);
    setCashLoading(true);
    try {
      let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartID}`, {
        "shippingAddress": {
          "details": values.address,
          "phone": values.phone,
          "city": values.city
        }
      }, { headers: { token: localStorage.getItem('token') } });
      if (data.status === 'success') {
        setCashLoading(false);
        setCreditDisabled(false);
        toast.success('Order Placed Successful');
        setTimeout(() => {
          navigate('/allOrders', { replace: true });
        }, 3000);
      }
    } catch (error) {
      setCashLoading(false);
    }
  }

  async function confirmCreditOrder(values) {
    setCashDisabled(true);
    setCreditLoading(true);
    try {
      let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartID}`,
        {
          "shippingAddress": {
            "details": values.address,
            "phone": values.phone,
            "city": values.city
          }
        }, { headers: { token: localStorage.getItem('token') }, params: { 'url': 'http://localhost:3000' } });
      if (data.status === 'success') {
        setCreditLoading(false);
        setCashDisabled(false);
        toast.success('Success!');
        setTimeout(() => {
          window.open(data.session.url);
          setTimeout(() => {
            navigate('/allOrders', { replace: true });
          }, 3000);
        }, 3000);
      }
    } catch (error) {
      setCreditLoading(false);
    }
  }

  let formik = useFormik({
    initialValues: {
      address: '',
      city: '',
      phone: '',
    },
    onSubmit: function (values, { setSubmitting }) {
      const newValues =
        { address: values.address, city: values.city, phone: values.phone }
      if (formik.values.button === "cash") {
        confirmCashOrder(newValues);
      } else if (formik.values.button === "credit") {
        confirmCreditOrder(newValues);
      }
      setSubmitting(false);
    },
    validationSchema: Yup.object().shape({
      address: Yup.string().min(3, 'Address should be 3 chars minimum.').required('Required!'),
      phone: Yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Enter a valid phone number!').required('Required!'),
      city: Yup.string().min(3, 'City should be 3 chars minimum.').max(20, 'City should be 30 chars maximum.').required('Required!')
    })
  })

  return <>{cartID ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5">
    <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' height='450px'>
      <h2 className="mb-3 text-center">Shipping Details</h2>
      <form onSubmit={formik.handleSubmit} className='text-center w-100'>
        <div className="mb-3 w-50 m-auto">
          <ThemeProvider theme={inputTheme}>
            <TextField error={formik.errors.address && formik.touched.address} className='w-100' required type="text" label="Address" variant="filled" id="address" size="small" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.address}
              InputProps={{
                endAdornment: (<InputAdornment position="end">
                  {formik.errors.address && formik.touched.address ? <Tooltip TransitionComponent={Fade} placement="top-start"
                    TransitionProps={{ timeout: 600 }} title={<p className='m-0 fw-bold fs-6'>{formik.errors.address}</p>}>
                    <ErrorOutlineIcon color='error' />
                  </Tooltip> : ""}
                </InputAdornment>
                ),
              }} />
          </ThemeProvider>
        </div>
        <div className="mb-3 w-50 m-auto">
          <ThemeProvider theme={inputTheme}>
            <StyledNumberInput error={formik.errors.phone && formik.touched.phone} className='w-100' required type="number" label="Mobile Number" variant="filled" id="phone" size="small" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.phone}
              InputProps={{
                endAdornment: (<InputAdornment position="end">
                  {formik.errors.phone && formik.touched.phone ? <Tooltip TransitionComponent={Fade} placement="top-start"
                    TransitionProps={{ timeout: 600 }} title={<p className='m-0 fw-bold fs-6'>{formik.errors.phone}</p>}>
                    <ErrorOutlineIcon color='error' />
                  </Tooltip> : ""}
                </InputAdornment>
                ),
              }} />
          </ThemeProvider>
        </div>
        <div className="mb-3 w-50 m-auto">
          <ThemeProvider theme={inputTheme}>
            <TextField error={formik.errors.city && formik.touched.city} className='w-100' required type="city" label="City" variant="filled" id="city" size="small" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.city}
              InputProps={{
                endAdornment: (<InputAdornment position="end">
                  {formik.errors.city && formik.touched.city ? <Tooltip TransitionComponent={Fade} placement="top-start"
                    TransitionProps={{ timeout: 600 }} title={<p className='m-0 fw-bold fs-6'>{formik.errors.city}</p>}>
                    <ErrorOutlineIcon color='error' />
                  </Tooltip> : ""}
                </InputAdornment>
                ),
              }} />
          </ThemeProvider>
        </div>
        <div className="d-flex justify-content-center">
          <div className='mb-3 me-5'>
            <ThemeProvider theme={buttonTheme}>
              <LoadingButton type='submit'
                name="cash"
                size="medium"
                color="success"
                loading={cashLoading}
                variant="contained"
                disabled={cashLoading || cashDisabled || !(formik.isValid && formik.dirty)}
                onClick={() => formik.setFieldValue('button', 'cash')}
              >
                <span>Pay Cash</span>
              </LoadingButton>
            </ThemeProvider>
          </div>
          <div className='mb-3'>
            <ThemeProvider theme={buttonTheme}>
              <LoadingButton type='submit'
                name="credit"
                size="medium"
                color="success"
                loading={creditLoading}
                variant="contained"
                disabled={creditLoading || creditDisabled || !(formik.isValid && formik.dirty)}
                onClick={() => formik.setFieldValue('button', 'credit')}
              >
                <span>Pay Credit</span>
              </LoadingButton>
            </ThemeProvider>
          </div>
        </div>
      </form >
    </Box>
  </motion.div > : <Box display='flex' justifyContent='center' alignItems='center' height={"75vh"}>
    <CircularProgress />
  </Box>}

  </>
}
