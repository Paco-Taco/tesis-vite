import Layout from './layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainDashboard } from './screens/MainDashboard';
import { PronosticoScreen } from './screens/PronosticoScreen';
import { ConsumoScreen } from './screens/ConsumoScreen';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/pronostico" element={<PronosticoScreen />} />
          <Route path="/consumo" element={<ConsumoScreen />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
