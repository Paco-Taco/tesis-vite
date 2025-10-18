import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { MainDashboard } from './screens/MainDashboard';
import { PronosticoScreen } from './screens/PronosticoScreen';
import { ConsumoScreen } from './screens/ConsumoScreen';
import LoginScreen from './screens/LoginScreen';
import { AccessibilityProvider } from './context/accessibilityContext';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicOnlyRoute from './routes/PublicOnlyRoute';
import LayoutRoute from './routes/LayoutRoute';
import SignUpScreen from './screens/SignUpScreen';
import { ReciboScreen } from './screens/ReciboScreen';

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public-only (no layout) */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/sign-up" element={<SignUpScreen />} />
            </Route>

            {/* Protected (with layout) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<LayoutRoute />}>
                <Route path="/" element={<MainDashboard />} />
                <Route path="/pronostico" element={<PronosticoScreen />} />
                <Route path="/consumo" element={<ConsumoScreen />} />
                <Route path="/recibo" element={<ReciboScreen />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
