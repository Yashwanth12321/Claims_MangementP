
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/comon/Status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Claim } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Eye } from 'lucide-react';

interface ClaimsDashboardProps {
  onViewClaim: (claimId: string) => void;
}

export const ClaimsDashboard = ({ onViewClaim }: ClaimsDashboardProps) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // const data = await api.getClaims();
        const response =await fetch("http://localhost:5000/claims/all",{
          method:'GET',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        })
        const data =await response.json();
        setClaims(data.claims);
      } catch (error) {
        console.error('Failed to fetch claims:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const columns = [
    {
      header: 'Patient',
      accessorKey: 'name' as keyof Claim,
      cell: (claim: Claim) => (
        <div>
          <div className="font-medium">{claim.name}</div>
          <div className="text-sm text-muted-foreground">{claim.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Description',
      accessorKey: 'description' as keyof Claim,
      cell: (claim: Claim) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{claim.description}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Amount',
      accessorKey: 'amount' as keyof Claim,
      cell: (claim: Claim) => formatCurrency(claim.claimAmount),
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status' as keyof Claim,
      cell: (claim: Claim) => <StatusBadge status={claim.status} />,
      sortable: true,
    },
    {
      header: 'Submitted',
      accessorKey: 'submissionDate' as keyof Claim,
      cell: (claim: Claim) => formatDate(claim.submissionDate),
      sortable: true,
    },
    {
      header: 'Actions',
      accessorKey: 'id' as keyof Claim,
      cell: (claim: Claim) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewClaim(claim._id)}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          <span>Review</span>
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Card className="shadow-soft bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="text-white">Claims Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft animate-fade-in bg-[#0D1117] text-white">
      <CardHeader>
        <CardTitle className="text-white">Claims Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {claims.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-white">No claims have been submitted yet.</p>
          </div>
        ) : (
          <DataTable
            data={claims}
            columns={columns}
            searchField="name"
            searchPlaceholder="Search by patient name..."
          />
        )}
      </CardContent>
    </Card>
  );
};
