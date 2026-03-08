import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AuthProvider>
  );
}
