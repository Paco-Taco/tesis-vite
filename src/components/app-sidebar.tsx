import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Home, LineChart, DollarSign } from 'lucide-react';
import logoUdc from '@/assets/img/logo-udc.png';

export function AppSidebar({
  ...props
}: {
  props?: React.ComponentProps<typeof Sidebar>;
}) {
  return (
    <Sidebar {...props} collapsible="offcanvas">
      <SidebarHeader>
        <img
          src={logoUdc}
          alt="Universidad de Colima"
          className="h-12 mx-auto"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/dashboard">
                    <Home className="mr-2" />
                    Dashboard
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/pronostico">
                    <LineChart className="mr-2" />
                    Pronóstico
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/consumo">
                    <DollarSign className="mr-2" />
                    Consumo
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <p className="text-xs text-muted-foreground text-center">
          &copy; U de C 2025
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
