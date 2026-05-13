import React from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { Toaster } from 'react-hot-toast';


function App() {
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
