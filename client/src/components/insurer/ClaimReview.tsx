import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/comon/Status';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Claim } from '@/lib/mockData';
import { toast } from 'sonner';
import { ChevronLeft, FileText, Eye, Check, X, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ClaimReviewProps {
  claimId: string;
  onBack: () => void;
  onClaimUpdated: () => void;
}
const BASE_URL = 'http://localhost:5000';  

export const ClaimReview = ({ claimId, onBack, onClaimUpdated }: ClaimReviewProps) => {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState<string>('');
  const [insurerComments, setInsurerComments] = useState('');

  const documentUrl = `${BASE_URL}/${claim?.document}`;
  useEffect(() => {

    const fetchClaim = async () => {
      try {
        console.log('Fetching claim:', claimId);
        const response = await fetch(`http://localhost:5000/claims/${claimId}`,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        console.log(data.claim);
        setClaim(data.claim);
        if (data?.claim.approvedAmount !== undefined) {
          setApprovedAmount(data.claim.approvedAmount.toString());
        } else if (data) {
          setApprovedAmount(data.claim.claimAmount.toString());
        }
        if (data?.claim.insurerComments) {
          setInsurerComments(data.claim.insurerComments);
        }
      } catch (error) {
        console.error('Failed to fetch claim:', error);
        toast(
          "Error"+"Failed to load claim details.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchClaim();
  }, [claimId, toast]);
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

  const handleUpdateStatus = async (status: 'Approved' | 'Rejected') => {
    if (!claim) return;

    setUpdating(true);
    try {
      await  fetch(`http://localhost:5000/claims/${claim._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          status,
          approvedAmount: status === 'Approved' ? parseFloat(approvedAmount) : undefined,
          insurerComments
        })
      });

      toast(
        `Claim ${status === 'Approved' ? 'Approved' : 'Rejected'}`+"The claim has been successfully " + status + ".",
      );

      onClaimUpdated();
    } catch (error) {
      console.error('Failed to update claim:', error);
      toast(
        "Update Failed"+"There was an error updating the claim status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-soft bg-[#0D1117]">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Claim Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!claim) {
    return (
      <Card className="shadow-soft bg-[#0D1117]">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Claim Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white">
            <p>Claim not found or has been deleted.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack} className="w-full">
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft animate-fade-in bg-[#0D1117] text-white">
      <CardHeader>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Claim Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">{claim.description}</h3>
            <p className="text-sm text-muted-foreground">
              Submitted {formatDate(claim.submissionDate)}
            </p>
          </div>
          <StatusBadge status={claim.status} className="self-start md:self-center" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white ">
          <div>
            <h4 className="text-sm font-medium mb-2">Patient Information</h4>
            <div className="p-4 rounded-md bg-[#141B22]">
              <p className="font-medium">{claim.name}</p>
              <p className="text-sm text-muted-foreground">{claim.email}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Claim Amount</h4>
            <div className="bg-[#141B22] p-4 rounded-md">
              <p className="font-medium">{formatCurrency(claim.claimAmount)}</p>
              {claim.approvedAmount !== undefined && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Approved: </span>
                  <span className="font-medium text-success">
                    {formatCurrency(claim.approvedAmount)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2 ">Supporting Document</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-[#141B22]">
                <FileText className="h-4 w-4" />
                <span>View Document</span>
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Supporting Document</DialogTitle>
              </DialogHeader>
              <div className="mt-4 flex justify-center">
                {claim.document.endsWith('.pdf') ? (
                  <iframe 
                    src={documentUrl} 
                    className="w-full h-[70vh] rounded-md border"
                  />  
                ) : (
                  <img 
                    src={documentUrl} 
                    alt="Supporting document" 
                    className="max-h-[70vh] object-contain rounded-md border"
  />
)}

              </div>
            </DialogContent>
          </Dialog>
        </div>

        {(claim.status === 'Pending' || claim.insurerComments) && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Review Details</h4>
            
            {claim.status === 'Pending' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="approvedAmount">Approved Amount ($)</Label>
                  <Input
                    id="approvedAmount"
                    type="number"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="premium-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    value={insurerComments}
                    onChange={(e) => setInsurerComments(e.target.value)}
                    placeholder="Add any notes or explanations about your decision"
                    className="premium-input min-h-[100px]"
                  />
                </div>
              </>
            )}
            
            {claim.insurerComments && claim.status !== 'Pending' && (
              <div className="bg-[#141B22] p-4 rounded-md">
                <p className="text-sm font-medium mb-1">Insurer Comments:</p>
                <p className="text-sm">{claim.insurerComments}</p>
                {claim.reviewedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Reviewed {formatDate(claim.reviewedAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {claim.status === 'Pending' && (
        <CardFooter className="flex flex-col sm:flex-row gap-3 ">
          <Button 
            onClick={() => handleUpdateStatus('Approved')}
            className="w-full sm:w-auto premium-button hover:bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
            disabled={updating}
          >
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Approve Claim
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => handleUpdateStatus('Rejected')}
            variant="outline"
            className="w-full sm:w-auto premium-button-secondary text-black"
            disabled={updating}
          >
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Reject Claim
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
