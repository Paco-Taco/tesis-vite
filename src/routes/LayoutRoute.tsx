import { Outlet } from 'react-router-dom';
import Layout from '@/layout';

export default function LayoutRoute() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
