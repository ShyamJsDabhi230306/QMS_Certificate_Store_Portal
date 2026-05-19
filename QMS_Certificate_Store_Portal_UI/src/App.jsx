import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { Toaster } from 'react-hot-toast';


function App() {

  useEffect(() => {
    const saved = localStorage.getItem('custom-theme-variables');
    if (saved) {
      const theme = JSON.parse(saved);
      const root = document.documentElement;

      // Mount all layout canvas states
      root.style.setProperty('--background', theme.background);
      root.style.setProperty('--foreground', theme.foreground);
      root.style.setProperty('--muted-foreground', theme.mutedForeground);
      root.style.setProperty('--card', theme.card);
      root.style.setProperty('--border', theme.border);
      root.style.setProperty('--gold', theme.gold);

      // Mount all sidebar state variables
      root.style.setProperty('--sidebar', theme.sidebar);
      root.style.setProperty('--sidebar-foreground', theme.sidebarForeground);
      root.style.setProperty('--sidebar-active', theme.sidebarActive);

      // Mount text-scaling
      root.style.setProperty('--font-size-base', `${theme.fontSize}px`);
    }
  }, []);


  return (
    <>
      {/* 🟢 Now the Toaster is INSIDE the return, so it will work! */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
          },
        }}
      />

      <AppRoutes />
    </>
  );
}

export default App;
