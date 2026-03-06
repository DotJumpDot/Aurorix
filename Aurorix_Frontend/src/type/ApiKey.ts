export interface ApiKey {
  id: string;
  user_id: string;
  key: string;
  name: string;
  created_at: string;
  last_used?: string;
  is_active: boolean;
}
