import { useFormik } from 'formik'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import * as yup from 'yup'
import { supabase } from "../../services/supabase";
import './Register.css'
import logo from '../../assets/logo.png'
import picture from '../../assets/backgrounds.jpeg'
import { useLanguage } from '../../context/useLanguage'

const content = {
  EN: {
    title: "Create Account",
    subtitle: "Join Yalla Hurghada and start your Red Sea journey",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    confirmPassword: "Confirm Password",
    submit: "Create account →",
    haveAccount: "Already have an account?",
    login: "Login",
    gateway: "Your gateway to the Red Sea",
    placeholders: {
      fullName: "Enter your name",
      email: "name@example.com",
      phone: "+20 123 456 789",
    },
    errors: {
      nameRequired: "name is required", nameMin: "min 3 chars", nameMax: "max 20 chars",
      phoneRequired: "phone required", phoneInvalid: "invalid Egyptian number",
      emailRequired: "email is required", emailInvalid: "invalid email",
      passwordRequired: "password is required", passwordMin: "min 8 chars", passwordMax: "max 20 chars",
      confirmRequired: "confirm password is required", confirmMatch: "passwords must match",
    }
  },
  AR: {
    title: "إنشاء حساب",
    subtitle: "انضم إلى يلا الغردقة وابدأ رحلتك في البحر الأحمر",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    submit: "← إنشاء حساب",
    haveAccount: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    gateway: "بوابتك إلى البحر الأحمر",
    placeholders: {
      fullName: "أدخل اسمك",
      email: "name@example.com",
      phone: "+20 123 456 789",
    },
    errors: {
      nameRequired: "الاسم مطلوب", nameMin: "الحد الأدنى 3 أحرف", nameMax: "الحد الأقصى 20 حرف",
      phoneRequired: "رقم الهاتف مطلوب", phoneInvalid: "رقم مصري غير صحيح",
      emailRequired: "البريد الإلكتروني مطلوب", emailInvalid: "بريد إلكتروني غير صحيح",
      passwordRequired: "كلمة المرور مطلوبة", passwordMin: "الحد الأدنى 8 أحرف", passwordMax: "الحد الأقصى 20 حرف",
      confirmRequired: "تأكيد كلمة المرور مطلوب", confirmMatch: "كلمتا المرور غير متطابقتين",
    }
  },
  RU: {
    title: "Создать аккаунт",
    subtitle: "Присоединяйтесь к Yalla Hurghada и начните путешествие",
    fullName: "Полное имя",
    email: "Эл. почта",
    phone: "Телефон",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    submit: "Создать аккаунт →",
    haveAccount: "Уже есть аккаунт?",
    login: "Войти",
    gateway: "Ваш путь к Красному морю",
    placeholders: {
      fullName: "Введите ваше имя",
      email: "name@example.com",
      phone: "+20 123 456 789",
    },
    errors: {
      nameRequired: "Имя обязательно", nameMin: "Минимум 3 символа", nameMax: "Максимум 20 символов",
      phoneRequired: "Телефон обязателен", phoneInvalid: "Неверный египетский номер",
      emailRequired: "Эл. почта обязательна", emailInvalid: "Неверный email",
      passwordRequired: "Пароль обязателен", passwordMin: "Минимум 8 символов", passwordMax: "Максимум 20 символов",
      confirmRequired: "Подтверждение пароля обязательно", confirmMatch: "Пароли не совпадают",
    }
  },
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  const signUpUser = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username } },
    });
    if (error) { console.log(error.message); return false; }
    console.log("User created:", data);
    return true;
  }

  const validator = yup.object().shape({
    userName: yup.string().required(t.errors.nameRequired).min(3, t.errors.nameMin).max(20, t.errors.nameMax),
    phone: yup.string().required(t.errors.phoneRequired).matches(/^01[0125][0-9]{8}$/, t.errors.phoneInvalid),
    email: yup.string().required(t.errors.emailRequired).email(t.errors.emailInvalid),
    password: yup.string().required(t.errors.passwordRequired).min(8, t.errors.passwordMin).max(20, t.errors.passwordMax),
    confirmPassword: yup.string().required(t.errors.confirmRequired).oneOf([yup.ref("password")], t.errors.confirmMatch),
  });

  const formData = useFormik({
    initialValues: { userName: "", email: "", phone: "", password: "", confirmPassword: "" },
    validationSchema: validator,
    onSubmit: async (values) => {
      const success = await signUpUser(values.email, values.password, values.userName);
      if (success) {
        navigate("/login", { state: { from: location.state?.from } });
      } else {
        navigate("/error");
      }
    }
  });

  return (
    <div className="signup-wrapper">
      <div className="signup-bg" style={{ backgroundImage: `url(${picture})` }}></div>
      <div className="signup-overlay"></div>
      <div className="signup-content">
        <img src={logo} alt="logo" className="signup-logo" />
        <h2 className="signup-title">{t.title}</h2>
        <p className="signup-subtitle">{t.subtitle}</p>
        <div className="signup-card">
          <form onSubmit={formData.handleSubmit}>
            <div className="mb-3">
              <label className="form-label">{t.fullName}</label>
              <input type="text" className="form-control" name="userName"
                placeholder={t.placeholders.fullName}
                value={formData.values.userName} onChange={formData.handleChange} onBlur={formData.handleBlur} />
              {formData.errors.userName && formData.touched.userName && (
                <div className="alert alert-danger p-1 mt-1">{formData.errors.userName}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">{t.email}</label>
              <input type="email" className="form-control" name="email"
                placeholder={t.placeholders.email}
                value={formData.values.email} onChange={formData.handleChange} onBlur={formData.handleBlur} />
              {formData.errors.email && formData.touched.email && (
                <div className="alert alert-danger p-1 mt-1">{formData.errors.email}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">{t.phone}</label>
              <input type="tel" className="form-control" name="phone"
                placeholder={t.placeholders.phone}
                value={formData.values.phone} onChange={formData.handleChange} onBlur={formData.handleBlur} />
              {formData.errors.phone && formData.touched.phone && (
                <div className="alert alert-danger p-1 mt-1">{formData.errors.phone}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">{t.password}</label>
              <input type="password" className="form-control" name="password" placeholder="●●●●●●●●"
                value={formData.values.password} onChange={formData.handleChange} onBlur={formData.handleBlur} />
              {formData.errors.password && formData.touched.password && (
                <div className="alert alert-danger p-1 mt-1">{formData.errors.password}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">{t.confirmPassword}</label>
              <input type="password" className="form-control" name="confirmPassword" placeholder="●●●●●●●●"
                value={formData.values.confirmPassword} onChange={formData.handleChange} onBlur={formData.handleBlur} />
              {formData.errors.confirmPassword && formData.touched.confirmPassword && (
                <div className="alert alert-danger p-1 mt-1">{formData.errors.confirmPassword}</div>
              )}
            </div>
            <div className="pt-2">
              <button type="submit" className="btn btn-primary w-100 py-2 rounded-4">
                {t.submit}
              </button>
              <p className="signup-login-link">
                {t.haveAccount} <Link to="/login">{t.login}</Link>
              </p>
            </div>
          </form>
        </div>
        <p className="signup-footer">{t.gateway}</p>
      </div>
    </div>
  );
}