import { Service } from './class/Service.class';
import {
  LoginRequest,
  RegisteredUser,
  User,
} from '@/infraestructure/interfaces/auth.interfaces';

export class AuthService extends Service {
  static logIn(body: LoginRequest) {
    return this.fetchWithPOST<typeof body, User>('/auth/login', body);
  }

  static signUp(body: FormData) {
    return this.fetchWithPOST<typeof body, RegisteredUser>(
      '/users/register',
      body
    );
  }
}
