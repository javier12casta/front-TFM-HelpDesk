export class LocalStorageMock {
  private store: { [key: string]: string } = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }

  get length(): number {
    return Object.keys(this.store).length;
  }
}

export function setupTestLocalStorage() {
  const mockLocalStorage = new LocalStorageMock();
  
  // Setup default user
  mockLocalStorage.setItem('user', JSON.stringify({
    _id: 'user123',
    username: 'testuser',
    role: 'admin',
    email: 'test@test.com',
    isActive: true
  }));

  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  return mockLocalStorage;
} 