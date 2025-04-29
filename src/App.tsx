import Layout from './layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainDashboard } from './screens/MainDashboard';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/pronostico" element={<h1>Pronostico</h1>} />
          <Route path="/consumo" element={<h1>Consumo</h1>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
