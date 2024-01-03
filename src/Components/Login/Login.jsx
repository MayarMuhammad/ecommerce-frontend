import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Fade, ThemeProvider, Tooltip, createTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { motion } from "framer-motion"
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

export default function Login({ decodeUser }) {

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => { event.preventDefault() };

  async function loginUser(values) {
    setLoading(true);
    try {
      let { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', values);
      if (data.message === 'success') {
        localStorage.setItem('token', data.token);
        setLoading(false);
        toast.success('Login Successful');
        setTimeout(() => {
          navigate('/home', { replace: true });
          decodeUser()
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Invalid Credentials')
    }
  }

  let formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: function (values) {
      loginUser(values);
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Enter a valid Email!').required('Required!'),
      password: Yup.string().required('Required!'),
    })
  })

  return <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5">
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' height='450px'>
        <h2 className="mb-3 text-center">Login</h2>
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
          <div className="mb-3 w-50 m-auto">
            <ThemeProvider theme={inputTheme}>
              <TextField error={formik.errors.password && formik.touched.password} className='w-100' required type={showPassword ? 'text' : 'password'} label="Password" variant="filled" id="password" size="small" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.password}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    {formik.errors.password && formik.touched.password ? <Tooltip TransitionComponent={Fade} placement="top-start"
                      TransitionProps={{ timeout: 600 }} title={<p className='m-0 fw-bold fs-6'>{formik.errors.password}</p>}>
                      <ErrorOutlineIcon color='error' />
                    </Tooltip> : ""}
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>,
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
                <span>Login</span>
              </LoadingButton>
            </ThemeProvider>
          </div>
          <div className='w-50 m-auto row justify-content-between p-0'>
            <div className="col-lg-7 p-0 text-start">Don't have an account? <Link to={'/register'} >Create Account</Link></div>
            <div className="col-lg-5 p-0 text-end"><Link to={'/forgetpassword'} >Forget Password?</Link></div>
          </div>
        </form >
      </Box>
      {/* {loginSuccessful ? <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Login Successful
        </Alert>
      </Snackbar> : <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Invalid Credentials
        </Alert>
      </Snackbar>} */}
    </motion.div >
  </>
}
