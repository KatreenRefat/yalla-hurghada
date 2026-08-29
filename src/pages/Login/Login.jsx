import { useFormik } from 'formik'
import './Login.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import * as yup from 'yup'
import { supabase } from "../../services/supabase";
import logo from '../../assets/logo.png'
import picture from '../../assets/backgrounds.jpeg'
import { useLanguage } from '../../context/useLanguage'

const content = {
  EN: {
    welcome: "Welcome back",
    subtitle: "Sign in to continue your Hurghada adventure",
    email: "Email",
    password: "Password",
    login: "Login →",
    noAccount: "Don't have an account?",
    signup: "Sign Up",
    gateway: "Your gateway to the Red Sea",
    placeholders: { email: "name@company.com" },
    emailRequired: "email is required",
    emailValid: "enter valid email",
    passwordRequired: "password is required",
    passwordMin: "min 8 characters",
    passwordMax: "max 20 characters",
  },
  AR: {
    welcome: "مرحباً بعودتك",
    subtitle: "سجل دخولك لمتابعة مغامرتك في الغردقة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "← تسجيل الدخول",
    noAccount: "ليس لديك حساب؟",
    signup: "إنشاء حساب",
    gateway: "بوابتك إلى البحر الأحمر",
    placeholders: { email: "اسم@شركة.com" },
    emailRequired: "البريد الإلكتروني مطلوب",
    emailValid: "أدخل بريد إلكتروني صحيح",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordMin: "الحد الأدنى 8 أحرف",
    passwordMax: "الحد الأقصى 20 حرف",
  },
  RU: {
    welcome: "С возвращением",
    subtitle: "Войдите, чтобы продолжить приключение в Хургаде",
    email: "Эл. почта",
    password: "Пароль",
    login: "Войти →",
    noAccount: "Нет аккаунта?",
    signup: "Зарегистрироваться",
    gateway: "Ваш путь к Красному морю",
    placeholders: { email: "имя@компания.com" },
    emailRequired: "Эл. почта обязательна",
    emailValid: "Введите корректный email",
    passwordRequired: "Пароль обязателен",
    passwordMin: "Минимум 8 символов",
    passwordMax: "Максимум 20 символов",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { console.log(error.message); return false; }
    console.log("Logged in:", data);
    return true;
  }

  const validate = yup.object().shape({
    email: yup.string().required(t.emailRequired).email(t.emailValid),
    password: yup.string().required(t.passwordRequired).min(8, t.passwordMin).max(20, t.passwordMax),
  });

  const LoginData = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validate,
    onSubmit: async (values) => {
      const success = await loginUser(values.email, values.password);
      if (success) {
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        navigate("/error");
      }
    }
  });

  return (
    <div className="login-page" style={{ backgroundImage: `url(${picture})` }}>
      <div className='overlay'></div>
      <div className='aboute-body'>
        <div className="logo-container">
          <img src={logo} width={90} alt="" />
        </div>
        <h3>{t.welcome}</h3>
        <p className='p-style'>{t.subtitle}</p>

        <div className="container d-flex justify-content-center">
          <div className="card login-card rounded-4">
            <form onSubmit={LoginData.handleSubmit}>
              <div className="mb-3">
                <label className="form-label">{t.email}</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder={t.placeholders.email}
                  value={LoginData.values.email}
                  onChange={LoginData.handleChange}
                  onBlur={LoginData.handleBlur}
                />
                {LoginData.errors.email && LoginData.touched.email && (
                  <div className="alert alert-danger p-1 mt-1">{LoginData.errors.email}</div>
                )}
              </div>

              <div className="mb-3 pt-3">
                <label className="form-label">{t.password}</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="●●●●●●●●"
                  value={LoginData.values.password}
                  onChange={LoginData.handleChange}
                  onBlur={LoginData.handleBlur}
                />
                {LoginData.errors.password && LoginData.touched.password && (
                  <div className="alert alert-danger p-1 mt-1">{LoginData.errors.password}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 rounded-4">
                {t.login}
              </button>
            </form>

            <h6>
              {t.noAccount} <Link to="/signup">{t.signup}</Link>
            </h6>
          </div>
        </div>
        <p className='pt-2'>{t.gateway}</p>
      </div>
    </div>
  );
}