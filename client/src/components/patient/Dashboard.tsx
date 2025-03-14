
import { ClaimForm } from './Form';
import { ClaimList } from './List';

export const PatientDashboard = () => {
  return (
    <div className="space-y-8">
      <section>
        <ClaimForm />
      </section>
      
      <section>
        <ClaimList />
      </section>
    </div>
  );
};
