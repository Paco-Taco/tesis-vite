import { apiCore } from '@/api/apiCoreInstance';
import {
  LoginRequest,
  User,
  UserClass,
} from '@/infraestructure/interfaces/auth.interfaces';
import { AuthService } from '@/services/AuthService';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AuthContextType {
  // user: User | null;
  user: UserClass | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (body: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

const LS_USER = 'auth:user';
const LS_TOKEN = 'auth:accessToken';

const saveSession = (res: User) => {
  localStorage.setItem(LS_USER, JSON.stringify(res.user));
  localStorage.setItem(LS_TOKEN, res.access_token);
};

const clearSession = () => {
  localStorage.removeItem(LS_USER);
  localStorage.removeItem(LS_TOKEN);
};

const loadSession = (): {
  user: UserClass | null;
  accessToken: string | null;
} => {
  try {
    const userRaw = localStorage.getItem(LS_USER);
    const user = userRaw ? (JSON.parse(userRaw) as UserClass) : null;
    const accessToken = localStorage.getItem(LS_TOKEN);

    return { user, accessToken };
  } catch (error) {
    clearSession();
    return { user: null, accessToken: null };
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [{ user, accessToken }, setAuthState] = useState<{
    user: UserClass | null;
    accessToken: string | null;
  }>({ user: null, accessToken: null });

  useEffect(() => {
    const { user, accessToken } = loadSession();
    setAuthState({ user, accessToken });
    setLoading(false);
  }, []);

  const signIn = async (body: any): Promise<void> => {
    try {
      setLoading(true);
      const res = await AuthService.logIn(body);

      saveSession(res);
      setAuthState({ user: res.user, accessToken: res.access_token });
      apiCore.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${res.access_token}`;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      // await AuthService.logOut();

      clearSession();
      setAuthState({ user: null, accessToken: null });

      // clean up API client headers
      // delete apiCore.defaults.headers.common['Authorization'];
    } catch (err) {
      // Keep clearing local session even if backend call fails
      clearSession();
      setAuthState({ user: null, accessToken: null });

      // Optionally rethrow if you want UI to react:
      // throw new Error('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      loading,
      signIn,
      signOut,
    }),
    [user, accessToken, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {/* {loading ? (
        <div className="flex-1 align-middle justify-center bg-white">
          <div className="items-center space-y-4">
            <h2 className="text-lg text-gray-800 font-noto-regular mt-3">
              Cargando...
            </h2>
          </div>
        </div>
      ) : ( */}
      {children}
      {/* )} */}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
};

export { AuthContext, AuthProvider, useAuth };
