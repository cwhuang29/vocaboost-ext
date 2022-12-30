import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { login } from '@actions/auth';
import { validateMsg } from '@constants/messages';
import useAuth from '@hooks/useAuth';

import { LoadingButton } from '@mui/lab';
import { Alert, Box, TextField } from '@mui/material';

const validationSchema = Yup.object({
  email: Yup.string('Enter your email').email(validateMsg.AUTH.EMAIL_REQUIRED).required(validateMsg.AUTH.EMAIL_REQUIRED),
  password: Yup.string('Enter your password').min(8, validateMsg.AUTH.PASSWORD_MIN).required(validateMsg.AUTH.PASSWORD_REQUIRED),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jwt } = useAuth();

  // Without useEffect:
  // 01. Warning: Cannot update a component (`BrowserRouter`) while rendering a different component (`Login`). To locate the bad setState() call inside `Login`
  // 02. You should call navigate() in a React.useEffect(), not when your component is first rendered.
  useEffect(() => {
    if (jwt) navigate('/');
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      setErrorMessage('');

      await dispatch(login(values))
        .then(() => navigate('/'))
        .catch(err => setErrorMessage(`${err.title}. ${err.content || ''}`))
        .finally(() => setLoading(false));
    },
  });

  return (
    <Box
      component='form'
      onSubmit={formik.handleSubmit} // Alternative: execute formik.handleSubmit() manually in the onClick callback function
      sx={{
        mt: '80px',
        ml: 'auto',
        mr: 'auto',
        textAlign: 'center',
        overflowX: 'hidden',
      }}
      style={{
        width: '80%',
        maxWidth: '600px',
      }}
    >
      {errorMessage && (
        <Alert severity='error' style={{ textAlign: 'left' }}>
          {errorMessage}
        </Alert>
      )}
      <br />
      <TextField
        fullWidth
        id='email'
        name='email'
        label='Email'
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        autoFocus
        style={{ marginBottom: '20px' }}
      />
      <TextField
        fullWidth
        id='password'
        name='password'
        label='Password'
        type='password'
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        style={{ marginBottom: '20px' }}
      />
      <LoadingButton loading={loading} variant='contained' type='submit' style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        Submit
      </LoadingButton>
    </Box>
  );
};

export default Login;
