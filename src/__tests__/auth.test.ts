import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../stores/useAuthStore';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(async (creds: any) => ({
      token: 'mock-access-token',
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      id: '1',
      name: creds.email.includes('admin') ? 'Admin User' : creds.email.includes('staff') ? 'Staff User' : 'Customer User',
      email: creds.email,
      role: creds.email.includes('admin') ? 'ROLE_ADMIN' : creds.email.includes('staff') ? 'ROLE_STAFF' : 'ROLE_CUSTOMER',
      tier: 'MEMBER',
      tierPoints: 50,
    })),
    register: vi.fn(async (data: any) => ({
      success: true,
      requiresActivation: true,
      email: data.email,
      message: 'Account created successfully',
    })),
    getProfile: vi.fn(async () => null),
  }
}));

describe('Authentication & Access Control', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('starts as unauthenticated with no user', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
  });

  it('authenticates admin account via demo credentials', async () => {
    const store = useAuthStore.getState();
    const result = await store.login({ email: 'admin@eiffel.com', password: 'admin123' });

    expect(result.role).toBe('ROLE_ADMIN');
    expect(result.email).toBe('admin@eiffel.com');

    const updatedState = useAuthStore.getState();
    expect(updatedState.isAuthenticated).toBe(true);
    expect(updatedState.role).toBe('ROLE_ADMIN');
    expect(updatedState.user?.name).toContain('Admin');
  });

  it('authenticates staff account via demo credentials', async () => {
    const store = useAuthStore.getState();
    const result = await store.login({ email: 'staff@eiffel.com', password: 'staff123' });

    expect(result.role).toBe('ROLE_STAFF');
    expect(result.email).toBe('staff@eiffel.com');

    const updatedState = useAuthStore.getState();
    expect(updatedState.isAuthenticated).toBe(true);
    expect(updatedState.role).toBe('ROLE_STAFF');
  });

  it('authenticates customer account and assigns customer role', async () => {
    const store = useAuthStore.getState();
    const result = await store.login({ email: 'client@gmail.com', password: 'password123' });

    expect(result.role).toBe('ROLE_CUSTOMER');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().role).toBe('ROLE_CUSTOMER');
  });

  it('registers new user correctly with activation requirement', async () => {
    const store = useAuthStore.getState();
    const result = await store.register({
      name: 'Youssef Mansour',
      email: 'youssef@example.com',
      password: 'pass1234password',
      phone: '+201012345678',
    });

    expect(result.email).toBe('youssef@example.com');
    expect(result.requiresActivation).toBe(true);
    expect(result.success).toBe(true);
  });

  it('updates loyalty points balance properly', () => {
    const store = useAuthStore.getState();
    store.setUser({
      id: 'test-user-1',
      name: 'Test Customer',
      email: 'cust@eiffel.com',
      role: 'ROLE_CUSTOMER',
      tier: 'MEMBER',
      tierPoints: 50,
      phone: '',
      memberSince: '2026',
      addresses: [],
      paymentMethods: [],
      orders: [],
    }, 'token-123');

    expect(useAuthStore.getState().user?.tierPoints).toBe(50);

    // Deduct 20 points (e.g. on checkout redemption)
    useAuthStore.getState().updateUserPoints(-20);
    expect(useAuthStore.getState().user?.tierPoints).toBe(30);

    // Add 10 points (e.g. 1% purchase reward)
    useAuthStore.getState().updateUserPoints(10);
    expect(useAuthStore.getState().user?.tierPoints).toBe(40);
  });

  it('resets state on logout', async () => {
    const store = useAuthStore.getState();
    await store.login({ email: 'admin@eiffel.com', password: 'admin123' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();
    const loggedOutState = useAuthStore.getState();
    expect(loggedOutState.isAuthenticated).toBe(false);
    expect(loggedOutState.user).toBeNull();
    expect(loggedOutState.token).toBeNull();
  });
});
