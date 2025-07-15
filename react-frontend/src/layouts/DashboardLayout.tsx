import { useState, ReactNode, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { width } = useWindowSize();
  const isMobile = width < 1024; // lg breakpoint
  const location = useLocation();

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-dark-bg font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
        isMobile={isMobile}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto animate-fade-in">
            <Outlet key={location.pathname} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
