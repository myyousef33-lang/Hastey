import type { Developer, SiteSettings, MediaItem } from '../types';

function getAuthToken(): string | null {
  return localStorage.getItem('hassty_admin_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('hassty_admin_token', token);
  } else {
    localStorage.removeItem('hassty_admin_token');
  }
}

function getHeaders(isMultipart = false): HeadersInit {
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchDevelopers(): Promise<Developer[]> {
  const res = await fetch('/api/developers', {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('فشل جلب قائمة المطورين');
  return res.json();
}

export async function fetchDeveloperById(id: string): Promise<Developer> {
  const res = await fetch(`/api/developers/${id}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('فشل جلب بيانات المطور');
  return res.json();
}

export async function createDeveloper(dev: Partial<Developer>): Promise<Developer> {
  const res = await fetch('/api/developers', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(dev)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل إضافة المطور');
  }
  return res.json();
}

export async function updateDeveloper(id: string, dev: Partial<Developer>): Promise<Developer> {
  const res = await fetch(`/api/developers/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(dev)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل تحديث بيانات المطور');
  }
  return res.json();
}

export async function deleteDeveloper(id: string): Promise<void> {
  const res = await fetch(`/api/developers/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل حذف المطور');
  }
}

export async function reorderDevelopers(orderedIds: string[]): Promise<Developer[]> {
  const res = await fetch('/api/developers/reorder', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ orderedIds })
  });
  if (!res.ok) throw new Error('فشل حفظ ترتيب المطورين');
  return res.json();
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('فشل جلب إعدادات الموقع');
  return res.json();
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(settings)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل تحديث الإعدادات');
  }
  return res.json();
}

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'فشل رفع الصورة');
  }

  return res.json();
}

export async function fetchMedia(): Promise<MediaItem[]> {
  const res = await fetch('/api/media', {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('فشل جلب قائمة الوسائط');
  return res.json();
}

export async function deleteMedia(filename: string): Promise<void> {
  const res = await fetch(`/api/media/${filename}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('فشل حذف الملف');
}

export async function loginAdmin(password: string): Promise<{ token: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'كلمة المرور غير صحيحة');
  }

  const data = await res.json();
  setAuthToken(data.token);
  return data;
}

export async function checkAuth(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.valid);
  } catch {
    return false;
  }
}
