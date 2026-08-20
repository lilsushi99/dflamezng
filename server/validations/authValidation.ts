export interface LoginInput {
  username?: string;
  password?: string;
}

export function validateLoginInput(body: any): { isValid: boolean; error?: string; data?: { username: string; password: string } } {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a valid JSON object' };
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }

  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (username.length < 3 || username.length > 50) {
    return { isValid: false, error: 'Username must be between 3 and 50 characters' };
  }

  return {
    isValid: true,
    data: { username, password },
  };
}
