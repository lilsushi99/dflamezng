import { Inquiry, InquiryStatus } from '../models/Inquiry';
import { isDatabaseConnected, query, execute } from '../database/db';
import { PersistentStore } from '../database/persistentStore';

export class ContactRepository {
  async getAllInquiries(): Promise<Inquiry[]> {
    if (isDatabaseConnected()) {
      try {
        const rows = await query<Inquiry>('SELECT * FROM inquiries ORDER BY created_at DESC');
        if (rows) {
          return rows;
        }
      } catch (e) {
        console.warn('[ContactRepository] Falling back to persistent store for inquiries:', e);
      }
    }
    const store = PersistentStore.getStore();
    return [...(store.inquiries || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createInquiry(data: {
    name: string;
    email: string;
    project_type: string;
    timeline: string;
    message: string;
    budget?: string;
  }): Promise<Inquiry> {
    const store = PersistentStore.getStore();
    if (!store.inquiries) store.inquiries = [];

    let newId = store.inquiries.length > 0 ? Math.max(...store.inquiries.map((i) => i.id)) + 1 : 1;

    if (isDatabaseConnected()) {
      try {
        const res = await execute(
          'INSERT INTO inquiries (name, email, project_type, timeline, message, budget, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [data.name, data.email, data.project_type, data.timeline, data.message, data.budget || '', 'NEW']
        );
        if (res?.insertId) {
          newId = res.insertId;
        }
      } catch (e) {
        console.warn('[ContactRepository] DB insert error for inquiry, using persistent store:', e);
      }
    }

    const created: Inquiry = {
      id: newId,
      name: data.name,
      email: data.email,
      project_type: data.project_type,
      timeline: data.timeline,
      message: data.message,
      budget: data.budget || '',
      status: 'NEW',
      created_at: new Date(),
      updated_at: new Date(),
    };

    store.inquiries.unshift(created);
    PersistentStore.saveStore();
    return created;
  }

  async updateInquiryStatus(id: number, status: InquiryStatus, notes?: string): Promise<Inquiry | null> {
    if (isDatabaseConnected()) {
      try {
        await execute('UPDATE inquiries SET status = ?, notes = COALESCE(?, notes), updated_at = NOW() WHERE id = ?', [
          status,
          notes || null,
          id,
        ]);
      } catch (e) {
        console.warn('[ContactRepository] DB update inquiry status error:', e);
      }
    }

    const store = PersistentStore.getStore();
    const item = store.inquiries?.find((i) => i.id === id);
    if (item) {
      item.status = status;
      if (notes !== undefined) item.notes = notes;
      item.updated_at = new Date();
      PersistentStore.saveStore();
      return item;
    }
    return null;
  }

  async deleteInquiry(id: number): Promise<boolean> {
    if (isDatabaseConnected()) {
      try {
        await execute('DELETE FROM inquiries WHERE id = ?', [id]);
      } catch (e) {
        console.warn('[ContactRepository] DB delete inquiry error:', e);
      }
    }

    const store = PersistentStore.getStore();
    const initialLen = store.inquiries?.length || 0;
    store.inquiries = (store.inquiries || []).filter((i) => i.id !== id);
    PersistentStore.saveStore();
    return (store.inquiries?.length || 0) < initialLen;
  }
}

export const contactRepository = new ContactRepository();
