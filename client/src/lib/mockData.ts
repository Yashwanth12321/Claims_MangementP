
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'patient' | 'insurer';
    password: string; // In a real app, you would never store passwords like this
  }
  
  export interface Claim {
    _id: string;
    id: string;
    name: string;
    email: string;
    claimAmount: number;
    description: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submissionDate: string;
    document: string;
    approvedAmount?: number;
    insurerComments?: string;
    reviewedBy?: string;
    reviewedAt?: string;
  }
  