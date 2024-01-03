import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Fade, ThemeProvider, Tooltip, createTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { motion } from "framer-motion"
import { toast } from 'react-toastify';

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

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => { event.preventDefault() };


  async function registerNewUser(values) {
    setLoading(true);
    try {
      let { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', values);
      if (data.message === 'success') {
        setLoading(false);
        toast.success('Account Registration Successful');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Email Already Exists');
    }
  }

  let formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
    },
    onSubmit: function (values) {
      const newValues =
        { name: values.name, email: values.email, password: values.password, rePassword: values.confirmPassword, phone: values.phone }
      registerNewUser(newValues);
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(3, 'Name should be 3 chars minimum.').max(20, 'Name should be 15 chars maximum.').required('Required!'),
      phone: Yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Enter a valid phone number!').required('Required!'),
      email: Yup.string().email('Enter a valid Email!').required('Required!'),
      password: Yup.string().required('Required!').min(8, 'Password should be 8 chars minimum.').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Enter a valid password 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'"),
      confirmPassword: Yup.string().required('Required!').oneOf([Yup.ref('password'), null], 'Passwords must match')
    })
  })

  return <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5">
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' height='450px'>
        <h2 className="mb-3 text-center">Create New Account</h2>
        <form onSubmit={formik.handleSubmit} className='text-center w-100'>
          <div className="mb-3 w-50 m-auto ">
            <ThemeProvider theme={inputTheme}>
              <TextField error={formik.errors.name && formik.touched.name} className='w-100' required label="Name" variant="filled" id="name" size="small" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.name}
                InputProps={{
                  endAdornment: (<InputAdornment position="end">
                    {formik.errors.name && formik.touched.name ? <Tooltip TransitionComponent={Fade} placement="top-start"
                      TransitionProps={{ timeout: 600 }} title={<p className='m-0 fw-bold fs-6'>{formik.errors.name}</p>}>
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
          <div className="mb-3 w-50 m-auto">
            <ThemeProvider theme={inputTheme}>
              <TextField error={formik.errors.confirmPassword && formik.touched.confirmPassword} className='w-100' required type={showConfirmPassword ? 'text' : 'password'} label="Confirm Password" variant="filled" id="confirmPassword" size="small" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.confirmPassword}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    {formik.errors.confirmPassword && formik.touched.confirmPassword ? <Tooltip TransitionComponent={Fade} placement="top-start"
                      TransitionProps={{ timeout: 600 }} title={<p className='m-0 fw-bold fs-6'>{formik.errors.confirmPassword}</p>}>
                      <ErrorOutlineIcon color='error' />
                    </Tooltip> : ""}
                    <IconButton
                      aria-label="toggle confirmPassword visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>,
                }} />
            </ThemeProvider>
          </div>
          <div className='mb-2 text-center'>
            Already have an account? <Link to={'/login'} >Login</Link>
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
                <span>Register</span>
              </LoadingButton>
            </ThemeProvider>
          </div>
        </form >
      </Box>
    </motion.div >
  </>
}
