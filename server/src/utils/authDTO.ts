export interface AuthUserDTO {
  id: number;
  username: string;
  email: string;
  currency: string;
  avatar_url: string;
  is_verified: boolean;
  token: string;
  last_active_date?: Date;
}
