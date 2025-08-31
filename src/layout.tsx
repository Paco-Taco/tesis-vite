import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { AppSidebar } from './components/app-sidebar';
import { Avatar } from './components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AccessibilityTab } from './components/shared/AccessibilityTab';
import { SettingsDialog } from './components/navbar/SettingsDialog';
import { useLocation } from 'react-router-dom';
import { useAuth } from './context/authContext';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const authPaths = ['/login', '/register'];
  const isAuthPage = authPaths.includes(location.pathname);

  if (isAuthPage) return children;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6 dark:bg-black">
        <div className="flex-1 flex justify-between mb-3">
          <SidebarTrigger />
          <div className="flex items-center gap-6">
            <SettingsDialog />
            {/* <div className="hover:bg-gray-100 hover:dark:bg-neutral-900 rounded-3xl p-2">
                <Bell />
              </div> */}
            <Avatar>
              <AvatarImage
                src={user.imageUrl ?? 'https://github.com/shadcn.png'}
              />
              <AvatarFallback>UC</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {children}
        <AccessibilityTab />
      </main>
    </SidebarProvider>
  );
}
