import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClaimsDashboard } from '@/components/insurer/ClaimDashboard';
import { ClaimReview } from '@/components/insurer/ClaimReview';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';

const InsurerDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'insurer')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleViewClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
  };

  const handleBackToDashboard = () => {
    setSelectedClaimId(null);
  };

  const handleClaimUpdated = () => {
    setRefreshCounter(prev => prev + 1);
    setSelectedClaimId(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0D1117]">
      <Header />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Insurer Dashboard</h1>
        
        {selectedClaimId ? (
          <ClaimReview 
            claimId={selectedClaimId} 
            onBack={handleBackToDashboard} 
            onClaimUpdated={handleClaimUpdated}
          />
        ) : (
          <ClaimsDashboard 
            onViewClaim={handleViewClaim} 
            key={refreshCounter} //force re-render when claims are updated
          />
        )}
      </main>
    </div>
  );
};

export default InsurerDashboard;
