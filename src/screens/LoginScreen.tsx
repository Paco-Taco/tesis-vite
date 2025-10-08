import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import blurredBg from '@/assets/img/blurred-bg.jpg';

/** shadcn/ui */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCurrentLogo } from '@/hooks/useCurrentLogo';
import { useAuth } from '@/context/authContext';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Link, Navigate } from 'react-router-dom';
import { AccessibilityTab } from '@/components/shared/AccessibilityTab';

// Schema
const LoginFormSchema = z.object({
  correo_institucional: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Introduce un correo válido'),
  password: z.string().min(8, 'Al menos 8 caracteres'),
  // remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof LoginFormSchema>;

export default function LoginScreen() {
  const { signIn, isAuthenticated } = useAuth();
  const { currentLogo } = useCurrentLogo();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      correo_institucional: '',
      password: '',
      //  remember: true
    },
    mode: 'onChange',
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await signIn(values);
    } catch (error) {
      const msg = getErrorMessage(error) ?? 'Error inesperado';
      toast.error('Error al ingresar', {
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-background to-muted/40">
      {/* Left side */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col justify-between p-10 border-r bg-background/60 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <img src={currentLogo} alt="Universidad de Colima" className="h-12" />
        </div>

        <div className="max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight leading-tight">
            Bienvenido 👋
          </h1>
          <p className="mt-3 text-muted-foreground">
            Inicia sesión para acceder al dashboard.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> Monitoreo en
              tiempo real
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> Pronóstico
              basado en algorítmos de estadística
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> Reportes de
              consumo
            </li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Facultad de Ingeniería Electromecánica.
        </p>
      </motion.aside>

      {/* Right side / Form */}
      <main
        className="flex items-center justify-center p-6 md:p-10 bg-cover"
        style={{
          background: `url(${blurredBg})`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-sm border-border/60">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <CardDescription>
                Accede con tus credenciales universitarias
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="correo_institucional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="email"
                              inputMode="email"
                              autoComplete="email"
                              placeholder="nombre@ucol.mx"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Contraseña</FormLabel>
                          {/* <a
                            href="#"
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </a> */}
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="current-password"
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              aria-label={
                                showPassword ? 'Hide password' : 'Show password'
                              }
                              onClick={() => setShowPassword((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Remember me */}
                  {/* <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label="Remember me"
                          />
                        </FormControl>
                        <Label className="text-sm leading-none">
                          Remember me for 30 days
                        </Label>
                      </FormItem>
                    )}
                  /> */}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !form.formState.isValid}
                  >
                    {loading ? 'Cargando…' : 'Ingresar'}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
              <span>¿Aún no tienes una cuenta?</span>
              <Link to="/sign-up" className="text-primary hover:underline">
                Crea una
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
      <AccessibilityTab />
    </div>
  );
}
