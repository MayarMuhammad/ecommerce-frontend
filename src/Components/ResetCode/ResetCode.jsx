import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import { Fade, ThemeProvider, Tooltip, createTheme, Box } from '@mui/material';
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

export default function ResetCode() {

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  async function resetPasswordCode(values) {
    setLoading(true);
    try {
      let { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode', values);
      if (data.status === 'Success') {
        setLoading(false);
        toast.success('Success');
        setTimeout(() => {
          navigate('/resetPassword', { replace: true });
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      toast.error(' Reset code is invalid or has expired');
      console.log(error);
    }
  }

  let formik = useFormik({
    initialValues: {
      resetCode: '',
    },
    onSubmit: function (values) {
      const newValues = {
        resetCode: String(values.resetCode)
      }
      resetPasswordCode(newValues);
    },
    validationSchema: Yup.object().shape({
      resetCode: Yup.string().required('Required!').min(5, 'Reset code should be at least 5 Numbers'),
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
        <h2 className="mb-3 text-center">Reset Code</h2>
        <form onSubmit={formik.handleSubmit} className='text-center w-100'>
          <div className="mb-3 w-50 m-auto">
            <ThemeProvider theme={inputTheme}>
              <StyledNumberInput error={formik.errors.resetCode && formik.touched.resetCode} className='w-100' required type="number" label="Reset Code" variant="filled" id="resetCode" size="small" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.resetCode}
                InputProps={{
                  endAdornment: (<InputAdornment position="end">
                    {formik.errors.resetCode && formik.touched.resetCode ? <Tooltip TransitionComponent={Fade} placement="top-start"
                      TransitionProps={{ timeout: 600 }} title={<p className='m-0 fw-bold fs-6'>{formik.errors.resetCode}</p>}>
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
                <span>Verify Reset Code</span>
              </LoadingButton>
            </ThemeProvider>
          </div>
          {/* {resetPassword ? <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={1500} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Success
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
