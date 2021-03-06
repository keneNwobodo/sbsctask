import axios from "axios"
import { useFormik } from "formik"
import { useEffect, useState, useContext } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import useAuth from "hooks/useAuth"
import { useLocation, useNavigate} from "react-router-dom"
import AuthService from 'service/authService'

import * as yup from 'yup'
import './login.css'


//check if it's a strong password with minimum of 8 characters
const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, 'Please must not be less than 8 characters')
    .required('Password is required')
})

// const LOGIN_API_URL = 'https://reqres.in/api/login'

//login component
const Login = () => {
  const { setAuth } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/";
  console.log(from)

  //store success, error and shownPassword variable(data)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [shownPassword, setIsShowPassword] = useState(false)

  //hide or show password func
  const togglePassword = () => {
    setIsShowPassword(!shownPassword)
  }

    //submit form func
    const onSubmit = async (values) => {
      const { email, password } = values

      try {
        await AuthService.login(email, password)
        .then(() => {
          navigate("/home")
          window.location.reload()
        },
        (err) => {
          console.log(err)
        }
      )
    } catch (err) {
       if (!err?.response) {
            setError(err.response, 'No Server Response');
        } else if (err.response?.status === 400) {
            setError(err.response, 'Missing Email or Password');
        } else if (err.response?.status === 401) {
            setError(err.response,'Unauthorized');
        } else {
            setError(err.response, 'Login Failed');
       }

    }
 } 

    const formik = useFormik({ initialValues: { email: '', password: '' },
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema
  })

  return (
    <div className='login__container'>
      
      <form onSubmit={formik.handleSubmit} className='login__form'>
        <h2 className="form__header">Log In</h2>
        {/* {!error && <span className='login__success'>{success ? "You have succesfully logged in" : ''}</span>} */}
        <span className='login__error'>{error ? "You have an error" : ''}</span>
         <div className="form__input-container">
          <input 
              className='form__input-email'
              placeholder='Enter Email'
              value={formik.values.email}
              onChange={formik.handleChange} 
              name='email'
              onBlur={formik.handleBlur}
            />
            <span className="form__errors">
              {formik.errors.email 
              ? formik.errors.email 
              : ''}
            </span>
         </div>
         <div className="form__input-container-password">
            <input 
                className='form__input-password'
                placeholder='Enter Password'
                value={formik.values.password}
                onChange={formik.handleChange}
                name='password'
                onBlur={formik.handleBlur}
                type={shownPassword ? "text" : "password"}
              />
              {shownPassword
               ? <FaEyeSlash className="form__password-icon" onClick={togglePassword} size={12} /> 
               : <FaEye className="form__password-icon_two" onClick={togglePassword} size={12}  /> 
              }
              <span className="form__errors">
                {formik.errors.password 
                ? formik.errors.password 
                : ''}
              </span>
         </div>
          
          <button type="submit" disabled={!formik.isValid} className="login__form-submit">Log in</button>
      </form>
    </div>
  )
}

export default Login