
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C0A09]">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 px-4  flex flex-col justify-center">
          <div className="container max-w-5xl mx-auto text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-6 animate-fade-in">
              Minimal Claims Management
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-slide-up transition-all duration-300 text-white">
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent transition duration-300 hover:from-purple-500 hover:to-pink-500">Streamline</span> Your Insurance
              <span className="bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent transition duration-300 hover:from-red-500 hover:to-blue-500"> Claims </span>Process
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            ClaimHub makes it easy to submit, track, and manage insurance claims with a simple and intuitive interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/login">
              <Button
                size="lg"
                className="premium-button w-full sm:w-auto bg-primary relative overflow-hidden border border-transparent group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
              </Link>
            </div>
          </div>
        </section>
        <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-12 animate-fade-in"></div>

        
        <section className="py-16 px-4 container max-w-5xl mx-auto bg-[#0C0A09]">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1D1817] p-6 rounded-lg shadow-soft hover:shadow-medium transition-shadow">
                
                <h3 className="text-xl font-semibold mb-2 text-white">Easy Submission</h3>
                <p className="text-muted-foreground">
                  Submit your claims in a simple and intuitive interface.
                </p>
              </div>
              <div className="bg-[#1D1817] p-6 rounded-lg shadow-soft hover:shadow-medium transition-shadow">
              
                <h3 className="text-xl font-semibold mb-2 text-white">Real-time Tracking</h3>
                <p className="text-muted-foreground">
                  Track the status of your claims in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
