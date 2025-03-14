
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/Login';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (user.role === 'insurer') {
        navigate('/insurer-dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0A09]">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
