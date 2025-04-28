import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { AppSidebar } from './components/app-sidebar';
import { Avatar } from './components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Settings, Bell } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="flex-1 flex justify-between">
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
      </main>
    </SidebarProvider>
  );
}
