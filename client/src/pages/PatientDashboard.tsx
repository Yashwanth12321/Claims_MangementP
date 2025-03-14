
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientDashboard as Dashboard } from '@/components/patient/Dashboard';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';

const PatientDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'patient')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0A09]">
      <Header />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8 0D1117">
        <h1 className="text-3xl font-bold mb-8 text-white">Patient Dashboard</h1>
        <Dashboard />
      </main>
    </div>
  );
};

export default PatientDashboard;
