import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Fade, ThemeProvider, Tooltip, createTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { motion } from "framer-motion"
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';

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

export default function ForgetPassword() {

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function forgetUserPassword(values) {
    setLoading(true);
    try {
      let { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', values);
      if (data.statusMsg === 'success') {
        setLoading(false);
        toast.success('Reset code is sent to your email');
        setTimeout(() => {
          navigate('/resetcode', { replace: true });
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      toast.error(" Email Doesn't Exist");
    }
  }

  let formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: function (values) {
      localStorage.setItem('User Email', values.email);
      forgetUserPassword(values);
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Enter a valid Email!').required('Required!'),
    })
  })

  return <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5">
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' height='450px'>
        <h2 className="mb-3 text-center">Forget Password</h2>
        <form onSubmit={formik.handleSubmit} className='text-center w-100'>
          <div className="mb-3 w-50 m-auto">
            <ThemeProvider theme={inputTheme}>
              <TextField error={formik.errors.email && formik.touched.email} className='w-100' required type="email" label="Email Address" variant="filled" id="email" size="small" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.email}
                InputProps={{
                  endAdornment: (<InputAdornment position="end">
                    {formik.errors.email && formik.touched.email ? <Tooltip TransitionComponent={Fade} placement="top-start"
                      TransitionProps={{ timeout: 600 }} title={<p className='m-0 fw-bold fs-6'>{formik.errors.email}</p>}>
                      <ErrorOutlineIcon color='error' />
                    </Tooltip> : ""}
                  </InputAdornment>
                  ),
                }} />
            </ThemeProvider>
          </div>
          <div className='mb-3'>
            <ThemeProvider theme={buttonTheme}>
              <LoadingButton type='submit'
                size="medium"
                color="success"
                loading={loading}
                variant="contained"
                disabled={loading || !(formik.isValid && formik.dirty)}
              >
                <span>Forget Password</span>
              </LoadingButton>
            </ThemeProvider>
          </div>
        </form >
      </Box>
      {/* {forgetPasswordSuccessful ? <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={1500} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Reset code is sent to your email
        </Alert>
      </Snackbar> : <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Email Doesn't Exist
        </Alert>
      </Snackbar>} */}
    </motion.div >
  </>
}
