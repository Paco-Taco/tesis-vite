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
import { Link, useLocation } from 'react-router-dom';

export function AppSidebar({
  ...props
}: {
  props?: React.ComponentProps<typeof Sidebar>;
}) {
  const location = useLocation();
  const currentPath = location.pathname;

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
                <SidebarMenuButton asChild isActive={currentPath === '/'}>
                  <Link to="/">
                    <Home className="mr-2" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === '/pronostico'}
                >
                  <Link to="/pronostico">
                    <LineChart className="mr-2" />
                    Pronóstico
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentPath === '/consumo'}
                >
                  <Link to="/consumo">
                    <DollarSign className="mr-2" />
                    Consumo
                  </Link>
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
