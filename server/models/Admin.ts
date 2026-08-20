export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  display_name: string;
  created_at: Date;
  updated_at: Date;
}

export type AdminSafeProfile = Omit<Admin, 'password_hash'>;
