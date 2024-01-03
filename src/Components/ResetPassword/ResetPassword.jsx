import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
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

export default function ResetPassword() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownPassword = (event) => { event.preventDefault() };

  async function resetUserPassword(values) {
    setLoading(true);
    try {
      let { data } = await axios.put('https://ecommerce.routemisr.com/api/v1/auth/resetPassword', values);
      if (data.token) {
        setLoading(false);
        toast.success('Password Changed Successfully');
        localStorage.removeItem('User Email')
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('Reset code is invalid or has expired');
    }
  }

  let formik = useFormik({
    initialValues: {
      email: localStorage.getItem('User Email'),
      password: '',
      confirmPassword: '',
    },
    onSubmit: function (values) {
      const newValues =
        { email: values.email, newPassword: values.password }
      resetUserPassword(newValues);
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required('Required!').min(8, 'Password should be 8 chars minimum.').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Enter a valid password 'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'"),
      confirmPassword: Yup.string().required('Required!').oneOf([Yup.ref('password'), null], 'Passwords must match')
    })
  })

  useEffect(() => {
    setTimeout(() => {
      navigate('/login');
    }, 600000)
  }, [navigate])

  return <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} exit={{ opacity: 0 }} className="container my-5">
      <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' height='450px'>
        <h2 className="mb-3 text-center">Change Password</h2>
        <form onSubmit={formik.handleSubmit} className='text-center w-100'>
          <div className="mb-3 w-50 m-auto">
            <ThemeProvider theme={inputTheme}>
              <TextField error={formik.errors.email && formik.touched.email} disabled className='w-100' required type="email" label="Email Address" variant="filled" id="email" size="small" value={formik.values.email}
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
          <div className='mb-3'>
            <ThemeProvider theme={buttonTheme}>
              <LoadingButton type='submit'
                size="medium"
                color="success"
                loading={loading}
                variant="contained"
                disabled={loading || !(formik.isValid && formik.dirty)}
              >
                <span>Reset Password</span>
              </LoadingButton>
            </ThemeProvider>
          </div>
          {/* {resetPassword ? <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={1500} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Password Changed Successfully
            </Alert>
          </Snackbar> : <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              Reset code is invalid or has expired
            </Alert>
          </Snackbar>} */}
        </form >
      </Box>
    </motion.div >
  </>
}
