import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4 text-white">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline text-white">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
