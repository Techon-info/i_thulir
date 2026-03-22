import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Inter','Segoe UI',sans-serif",
              fontSize: '14px',
              borderRadius: '10px',
            }
          }}
        />
      </AuthProvider>
    </Router>
  );
}
