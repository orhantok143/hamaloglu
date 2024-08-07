import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./login.css";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import { FaApple } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  registerUser,
  loginUser,
  checkToken,
} from "../../redux/login/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../redux/products/productSlice";
import { getAllCategories } from "../../redux/category/categorySlice";
import {
  selectActiveCategories,
  selectActiveProducts,
} from "../../redux/selectors";

const Login = () => {
  const [isActive, setIsActive] = useState(true);
  const param = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.auth);
  const products = useSelector(selectActiveProducts);
  const categories = useSelector(selectActiveCategories);
  useEffect(() => {
    if (!products.products && !categories.categories) {
      dispatch(getAllProducts(param.id));
      dispatch(getAllCategories());
    }
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(checkToken(token));
    }
  }, [dispatch, products.products, categories.categories,param.id]);

  useEffect(() => {
    if (loginState.tokenValid) {
      navigate(`/${param.id}/anasayfa`);
    }
  }, [navigate, param.id, loginState.tokenValid]);

  const initialLoginValues = {
    email: "",
    password: "",
  };

  const initialSignupValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email("Geçerli bir email adresi girin")
      .required("* E-mail zorunludur"),
    password: Yup.string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .required("* Şifre zorunludur"),
  });

  const signupValidationSchema = Yup.object({
    username: Yup.string().required("* Kullanıcı adı zorunludur"),
    email: Yup.string()
      .email("Geçerli bir email adresi girin")
      .required("* E-mail zorunludur"),
    password: Yup.string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .required("* Şifre zorunludur"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor")
      .required("* Şifre onayı zorunludur"),
  });

  const handleLoginSubmit = (values, { resetForm }) => {
    dispatch(loginUser(values));
    if (!loginState.error) {
      resetForm();
    }
  };

  const handleSignupSubmit = (values, { resetForm }) => {
    dispatch(registerUser(values));
    resetForm();
  };

  const handleToMenu = () => {
    navigate(`/${param.id}/anasayfa`);
  };

  return (
    <div className="_container">
      <div
        className="_form_container"
        style={
          loginState.error
            ? { boxShadow: "0px 0px 5px red" }
            : { boxShadow: "0px 0px 5px rgba(255, 255, 255, 0.671)" }
        }
      >
        {isActive ? (
          <div className="_login">
            <Formik
              initialValues={initialLoginValues}
              validationSchema={loginValidationSchema}
              onSubmit={handleLoginSubmit}
            >
              <Form className="login-form">
                <h3>Giriş Yap</h3>
                {loginState?.error ? (
                  <p className="error-message error">
                    {loginState?.message?.message}
                  </p>
                ) : null}
                <div className="form-field">
                  <label htmlFor="email">E-mail</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="E-mail"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="password">Şifre</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Şifre"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="_social_form">
                  <p>Ve ya</p>
                  <div className="_social">
                    <FcGoogle />
                    <FaXTwitter />
                    <FaApple />
                  </div>
                </div>
                <button type="submit" className="login-form-button">
                  Giriş Yap
                </button>
              </Form>
            </Formik>
            <button onClick={() => setIsActive(false)} className="register">
              Kaydol
            </button>
            <span className="_already">
              <p>Üye olmadan</p>
              <button onClick={handleToMenu}>Devam Et</button>
            </span>
          </div>
        ) : (
          <div className="_signup">
            <Formik
              initialValues={initialSignupValues}
              validationSchema={signupValidationSchema}
              onSubmit={handleSignupSubmit}
            >
              <Form className="login-form">
                <h3>Kayıt Ol</h3>
                <div className="form-field">
                  <label htmlFor="username">Kullanıcı Adı</label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Kullanıcı Adı"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">E-mail</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="E-mail"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="password">Şifre</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Şifre"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="confirmPassword">Şifreyi Onayla</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Şifreyi Onayla"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error-message"
                  />
                </div>
                <button type="submit" className="login-form-button">
                  Kaydol
                </button>
              </Form>
            </Formik>
            <div className="_social_form">
              <p>Ya da</p>
              <div className="_social">
                <FcGoogle />
                <FaXTwitter />
                <FaApple />
              </div>
            </div>
            <span className="_already">
              <p>Zaten hesabınız var mı?</p>
              <button onClick={() => setIsActive(true)}>Giriş Yap</button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
