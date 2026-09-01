export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
  created_at: Date;
  updated_at: Date;
}
