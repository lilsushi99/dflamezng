export type InquiryStatus = 'NEW' | 'REVIEWED' | 'ARCHIVED';

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  project_location: string;
  budget?: string;
  project_brief: string;
  status: InquiryStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
