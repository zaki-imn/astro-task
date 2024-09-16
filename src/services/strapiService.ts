const STRAPI_URL = (import.meta.env.STRAPI_URL || 'http://localhost:1337') + '/api';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  identifier: string;
  password: string;
}

class StrapiService {
  private async fetchStrapi(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${STRAPI_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(data: RegisterData) {
    return this.fetchStrapi('/auth/local/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData) {
    return this.fetchStrapi('/auth/local', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProducts() {
    return this.fetchStrapi('/products');
  }

  async getProduct(id: string) {
    return this.fetchStrapi(`/products/${id}`);
  }

  async getCart(token: string) {
    return this.fetchStrapi('/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async addToCart(token: string, productId: string, quantity: number) {
    return this.fetchStrapi('/cart/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(token: string, productId: string) {
    return this.fetchStrapi('/cart/remove', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
  }
}

export const strapiService = new StrapiService();