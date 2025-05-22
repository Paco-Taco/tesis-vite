import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { AppSidebar } from './components/app-sidebar';
import { Avatar } from './components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Settings, Bell } from 'lucide-react';
import { AccessibilityProvider } from './context/accessibilityContext';
import { AccessibilityTab } from './components/shared/AccessibilityTab';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-6 dark:bg-black">
          <div className="flex-1 flex justify-between mb-3">
            <SidebarTrigger />
            <div className="flex items-center gap-8">
              <Bell />
              <Settings />
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>UC</AvatarFallback>
              </Avatar>
            </div>
          </div>
          {children}
          <AccessibilityTab />
        </main>
      </SidebarProvider>
    </AccessibilityProvider>
  );
}
