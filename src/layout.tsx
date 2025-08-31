import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { AppSidebar } from './components/app-sidebar';
import { Avatar } from './components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AccessibilityProvider } from './context/accessibilityContext';
import { AccessibilityTab } from './components/shared/AccessibilityTab';
import { SettingsDialog } from './components/navbar/SettingsDialog';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AccessibilityProvider>
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
