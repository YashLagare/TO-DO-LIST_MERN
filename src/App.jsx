
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider } from './store/AuthContext';

const App = () => {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/signup" element={<SignUpPage/>} />
      <Route path="/login" element={<LoginPage/>} />
    </Routes>
    </AuthProvider>
    );
};

export default App;
