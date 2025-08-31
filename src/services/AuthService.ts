import { LoginRequest } from '@/context/authContext';
import { Service } from './class/Service.class';

export class AuthService extends Service {
  static logIn(body: LoginRequest) {
    return this.fetchWithPOST<typeof body, any>('/auth/login', body);
  }
}
