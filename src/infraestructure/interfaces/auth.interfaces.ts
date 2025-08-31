export interface User {
  access_token: string;
  user: UserClass;
}

export interface UserClass {
  _id: string;
  username: string;
  correo_institucional: string;
  imageUrl: string;
  verificado: boolean;
  verifyToken: null;
  __v: number;
}

export interface LoginRequest {
  correo_institucional: string;
  password: string;
}
