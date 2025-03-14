
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/comon/Status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Claim } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ClaimList = () => {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchClaims = async () => {
      try {
        const response = await fetch('http://localhost:5000/claims',{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setClaims(data.claims);
        console.log(data.claims);
      } catch (error) {
        console.error('Failed to fetch claims:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();

  }, [user]);

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
      header: 'Description',
      accessorKey: 'description' as keyof Claim,
      cell: (claim: Claim) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{claim.description}</span>
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
      header: 'Approved Amount',
      accessorKey: 'approvedAmount' as keyof Claim,
      cell: (claim: Claim) => 
        claim.approvedAmount !== undefined ? formatCurrency(claim.approvedAmount) : '-',
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
  ];

  if (loading) {
    return (
      <Card className="shadow-soft bg-[#0D1117]">
        <CardHeader>
          <CardTitle className="text-white">Your Claims</CardTitle>
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
    <Card className="shadow-soft bg-[#0D1117]">
      <CardHeader>
        <CardTitle className="text-white">Your Claims</CardTitle>
      </CardHeader>
      <CardContent className="text-white">
        {claims.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven't submitted any claims yet.</p>
          </div>
        ) : (
          <DataTable
            data={claims}
            columns={columns}
            searchField="description"
            searchPlaceholder="Search claims..."
          />
        )}
      </CardContent>
    </Card>
  );
};
