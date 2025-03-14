
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ClaimForm = () => {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);  // Key to reset FileUpload


  const handleFileChange = (newFiles: File[]) => {
    setDocument(null);
    if (newFiles.length > 0) {
      const file = newFiles[0];
      setDocument(file);
      console.log("File attached:", file);
    }
  };
  const handleClearFile = () => {
    setDocument(null);
    setUploadKey((prevKey) => prevKey + 1);  // Increment key to reset component
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Document being sent:", document);
    
    if (!user) {
      toast(
        "Authentication Error"+"You must be logged in to submit a claim.",
      );
      return;
    }
    
    setLoading(true);
    
    try {
      
      const formData = new FormData();
      console.log("User:", user);
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('claimAmount', parseFloat(amount).toFixed(2));
      formData.append('description', description);
      formData.append('submissionDate', new Date().toISOString());
      formData.append('status', 'pending');
      formData.append('reviewedAt', "");
      formData.append('reviewedBy', "");
      formData.append('approvedAmount', "");
      formData.append('insurerComments', "");
      
      if (document) {
        formData.append('document', document);
      } else {
        console.log('No document attached');

        toast(
          "No Document Attached"+"Please attach a supporting document before submitting.",
        );
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/claims', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,     
      });
      
      const data = await response.json();
      console.log(data);
      
      toast(
        "Claim Submitted"+"Your claim has been successfully submitted. Refresh to update",
      );
      
      // Reset form
      setDescription('');
      setAmount('');
      handleClearFile();
      
    } catch (error) {
      toast(
        "Submission Failed"+"There was an error submitting your claim. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-soft animate-fade-in bg-[#0D1117]">
      <CardHeader>
        <CardTitle className="text-white">Submit a New Claim</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-white">Claim Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
              className="premium-input text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about your claim"
              required
              className="premium-input min-h-[100px] text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document" className="text-white">Supporting Document</Label>
            <FileUpload 
              key={uploadKey}
              onChange={(newFiles) => {
                console.log(newFiles);
                if (newFiles.length > 1) {
                  toast(
                    "Only One File Allowed"+"You can only upload one file at a time.",
                  );
                  setUploadKey((prevKey) => prevKey + 1);
                  return;
                } else {
                  handleFileChange(newFiles);
                }
              }}
              accept="image/*,application/pdf"
              maxSize={5 * 1024 * 1024} // 5MB
            />
            {document && (
              <Button 
                variant="destructive" 
                onClick={handleClearFile} 
                className="text-white"
              >
                Clear
              </Button>
            )}
          </div>
          
          {document && <p className="text-sm text-white">Selected: {document.name}</p>}
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full premium-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <Button
                type="submit"
                className="w-full premium-button cursor-pointer hover:bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 "
                disabled={loading}
              >
                Submit Claim
              </Button>
            )}
          </Button>
          
          
        </CardFooter>
      </form>
    </Card>
  );
};
