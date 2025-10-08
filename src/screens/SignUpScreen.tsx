import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Upload, Mail, User, Lock, Eye, EyeOff } from 'lucide-react';
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
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { Link } from 'react-router-dom';

import {
  DropzoneEmptyState,
  DropzoneContent,
  Dropzone,
} from '@/components/ui/shadcn-io/dropzone';
import { AuthService } from '@/services/AuthService';
import { VerificationPendingDialog } from '../components/auth/VerificationPendingDialog';
import { AccessibilityTab } from '@/components/shared/AccessibilityTab';

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5 MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const SignUpFormSchema = z
  .object({
    correo_institucional: z
      .string()
      .min(1, 'El correo es requerido')
      .email('Introduce un correo válido'),
    username: z.string().min(1, 'El nombre de usuario es requerido'),
    password: z.string().min(8, 'Al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'Al menos 8 caracteres'),
    img: z
      .any()
      .refine((files: File[]) => !!files?.[0], 'La imagen es requerida')
      .refine(
        (files: File[]) => !!files?.[0] && files[0].size <= MAX_FILE_SIZE,
        'El tamaño máximo de imagen es de 5 MB'
      )
      .refine(
        (files: File[]) =>
          !!files?.[0] && ACCEPTED_IMAGE_TYPES.includes(files[0].type),
        'Formato inválido. Sólo se aceptan PNG, JPG y JPEG'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas deben de coincidir',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof SignUpFormSchema>;

export default function SignUpScreen() {
  const { currentLogo } = useCurrentLogo();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string | undefined>();
  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      correo_institucional: '',
      username: '',
      password: '',
      confirmPassword: '',
      img: undefined as unknown as File[],
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { isSubmitting, isValid } = form.formState;

  const handleDrop = (files: File[]) => {
    form.setValue('img', files, { shouldDirty: true, shouldValidate: true });
    if (files?.[0] && files?.[0].size <= MAX_FILE_SIZE) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string')
          setFilePreview(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFilePreview(undefined);
    }
  };

  async function onSubmit(values: FormValues) {
    try {
      const formData = new FormData();
      formData.append('correo_institucional', values.correo_institucional);
      formData.append('username', values.username);
      formData.append('password', values.password);
      if (values.img?.[0]) formData.append('img', values.img[0]);

      const response = await AuthService.signUp(formData);
      console.log(response);
      toast.success('Cuenta registrada satisfactoriamente 🎉');
      setIsDialogOpen(true);
      // form.reset(); // opcional
    } catch (error) {
      const msg = getErrorMessage(error) ?? 'Error inesperado';
      // Mapea error a campos para feedback inline:
      form.setError('correo_institucional', { type: 'server', message: msg });
      form.setError('password', {
        type: 'server',
        message: 'Verifica tu contraseña',
      });
      toast.error('No se pudo crear la cuenta', { description: msg });
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-background to-muted/40">
      {/* Left */}
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
            ¡Mucho gusto! 😀
          </h1>
          <p className="mt-3 text-muted-foreground">
            Regístrate para acceder al dashboard.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> Monitoreo en
              tiempo real
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> Pronóstico
              basado en algoritmos
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

      {/* Right / Form */}
      <main
        className="flex items-center justify-center p-6 md:p-10 bg-cover"
        style={{ background: `url(${blurredBg})` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-sm border-border/60">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Crear cuenta</CardTitle>
              <CardDescription>
                Completa tus datos para registrarte
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="correo_institucional"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo institucional</FormLabel>
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

                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de usuario</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type="text"
                              autoComplete="username"
                              placeholder="tu_usuario"
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
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type={showPass ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              aria-label={
                                showPass
                                  ? 'Ocultar contraseña'
                                  : 'Mostrar contraseña'
                              }
                              aria-pressed={showPass}
                              onClick={() => setShowPass((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPass ? (
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

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              type={showConfirm ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              aria-label={
                                showConfirm
                                  ? 'Ocultar contraseña'
                                  : 'Mostrar contraseña'
                              }
                              aria-pressed={showConfirm}
                              onClick={() => setShowConfirm((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirm ? (
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

                  {/* Image (Dropzone) */}
                  <FormField
                    control={form.control}
                    name="img"
                    render={() => (
                      <FormItem>
                        <FormLabel>Foto de perfil</FormLabel>
                        <FormControl>
                          <Dropzone
                            accept={{ image: ['.png', '.jpg', '.jpeg'] }}
                            onDrop={handleDrop}
                            onError={console.error}
                            src={form.watch('img')}
                          >
                            <DropzoneEmptyState>
                              <div className="flex w-full flex-col items-center justify-center gap-4">
                                <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                  <Upload className="size-5" />
                                </div>
                                <p className="text-sm font-bold">
                                  Sube tu foto
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG o JPEG (máx. 5 MB)
                                </p>
                              </div>
                            </DropzoneEmptyState>

                            <DropzoneContent>
                              {filePreview && (
                                <div className="relative h-[120px] w-full overflow-hidden rounded-md">
                                  <img
                                    src={filePreview}
                                    alt="Preview"
                                    className="absolute inset-0 h-full w-full object-cover"
                                  />
                                </div>
                              )}
                            </DropzoneContent>
                          </Dropzone>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
              <span>¿Ya tienes cuenta?</span>
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
      <VerificationPendingDialog open={isDialogOpen} />
      <AccessibilityTab />
    </div>
  );
}
