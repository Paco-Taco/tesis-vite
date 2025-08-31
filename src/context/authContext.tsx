import { AuthService } from '@/services/AuthService';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface LoginRequest {
  correo_institucional: string;
  password: string;
}

interface AuthContextType {
  // user: User | null;
  user: any;
  session: boolean;
  loading: boolean;
  signIn: (body: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}
// USER SHOULD NOT BE any
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUserSession = async () => {
      try {
        setLoading(true);
        // const storedUser = await fetchFromStorage(
        //   ASYNC_STORAGE_STRINGS.userData
        // );

        // if (storedUser && storedAccessToken) {
        //   setUser(storedUser);
        //   setAccessToken(storedAccessToken);
        //   setSession(true);
        // }
      } catch (error) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();
  }, []);

  const signIn = async (body: any): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await AuthService.logIn(body);

      console.log(data);
      // await saveToStorage(ASYNC_STORAGE_STRINGS.userData, userData);

      setSession(true);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    // try {
    //   await deleteFromStorage(ASYNC_STORAGE_STRINGS.userData);
    //   await deleteSecurely(SECURE_STORE_STRINGS.token);
    //   setSession(false);
    //   setUser(null);
    //   router.replace('/(auth)/login');
    // } catch (error) {
    //   throw new Error('Error al cerrar sesión');
    // }
  };

  const contextData: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextData}>
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
