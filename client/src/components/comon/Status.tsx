import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected';
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    Pending: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-600',
      border: 'border-yellow-200',
      label: 'Pending',
    },
    Approved: {
      bg: 'bg-green-500/10',
      text: 'text-green-600',
      border: 'border-green-200',
      label: 'Approved',
    },
    Rejected: {
      bg: 'bg-red-500/10',
      text: 'text-red-600',
      border: 'border-red-200',
      label: 'Rejected',
    },
  };
  
  const config = statusConfig[status];
  
  if (!config) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {config.label}
    </span>
  );
};
