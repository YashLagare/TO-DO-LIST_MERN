import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {0
  const[formData, setFormData] = useState({
    email:'',
    password:''
  });
  const { login, loading, error, clearError, isAuthenticated} = useAuthStore();
  const navigate = useNavigate();

  //Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  },[isAuthenticated, navigate]);

  //Clear error when component mounts
  useEffect(() => {
    clearError();
  },[clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);
    if (result) {
      navigate("/");
    }
    //errors is automatically handel by the store
  };
  return (
    <div>LoginPage</div>
  )
}

export default LoginPage