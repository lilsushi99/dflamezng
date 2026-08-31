export type InquiryStatus = 'NEW' | 'REVIEWED' | 'ARCHIVED';

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  project_type: string;
  timeline: string;
  message: string;
  budget?: string;
  status: InquiryStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
