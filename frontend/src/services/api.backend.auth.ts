import { User } from './types';
import { API_URL, getHeaders, handleResponse, fetchWithCredentials } from './api.backend.utils';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetchWithCredentials(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(res);
    
    const mappedUser: User = {
      id: data.user.id,
      name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.email.split('@')[0],
      email: data.user.email,
      role: data.user.role || 'user',
      avatar: `https://i.pravatar.cc/150?u=${data.user.email}`,
    };
    
    localStorage.setItem('evt_user', JSON.stringify(mappedUser));
    return { user: mappedUser, token: 'cookie_managed' };
  },

  async register(data: { firstName: string; lastName: string; email: string; password: string; role: 'user' | 'organizer' }): Promise<{ user: User; token: string }> {
    const res = await fetchWithCredentials(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      })
    });
    const dataRes = await handleResponse(res);
    
    const mappedUser: User = {
      id: dataRes.user.id,
      name: `${dataRes.user.firstName || ''} ${dataRes.user.lastName || ''}`.trim() || dataRes.user.email.split('@')[0],
      email: dataRes.user.email,
      role: dataRes.user.role || 'user',
      avatar: `https://i.pravatar.cc/150?u=${dataRes.user.email}`,
    };
    
    localStorage.setItem('evt_user', JSON.stringify(mappedUser));
    return { user: mappedUser, token: 'cookie_managed' };
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await fetchWithCredentials(`${API_URL}/auth/me`, { headers: getHeaders() });
      if (!res.ok) return null;
      const data = await res.json();
      const mappedUser: User = {
        id: data.id,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email.split('@')[0],
        email: data.email,
        role: data.role || 'user',
        avatar: `https://i.pravatar.cc/150?u=${data.email}`,
      };
      localStorage.setItem('evt_user', JSON.stringify(mappedUser));
      return mappedUser;
    } catch {
      return null;
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const payload: any = {};
    if (data.name) {
      const parts = data.name.split(' ');
      payload.first_name = parts[0];
      payload.last_name = parts.slice(1).join(' ') || 'User';
    }
    
    const res = await fetchWithCredentials(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const dataRes = await handleResponse(res);
    
    const mappedUser: User = {
      id: dataRes.id,
      name: `${dataRes.firstName || ''} ${dataRes.lastName || ''}`.trim() || dataRes.email.split('@')[0],
      email: dataRes.email,
      role: dataRes.role || 'user',
      avatar: `https://i.pravatar.cc/150?u=${dataRes.email}`,
    };
    localStorage.setItem('evt_user', JSON.stringify(mappedUser));
    return mappedUser;
  },

  async logout(): Promise<void> {
    try {
      await fetchWithCredentials(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch (e) {
      // Ignore errors on logout
    }
    localStorage.removeItem('evt_user');
  }
};
