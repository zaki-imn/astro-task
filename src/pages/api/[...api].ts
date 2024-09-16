import type { APIRoute } from 'astro';
import fetchApi from '@/lib/strapi';

const createResponse = (data: any, status = 200) => 
  new Response(JSON.stringify(data), { 
    status, 
    headers: { 'Content-Type': 'application/json' }
  });

const handleError = (error: any) => 
  createResponse({ error: error.message || 'An error occurred' }, error.status || 500);

const getToken = (request: Request) => 
  request.headers.get('Authorization')?.split(' ')[1];

const requireAuth = (token: string | undefined) => {
  if (!token) throw new Error('Unauthorized');
};

const handleRequest = async (
  endpoint: string, 
  query: Record<string, string> = {}, 
  requiresAuth = false,
  token?: string
) => {
  if (requiresAuth) {
    requireAuth(token);
    query.token = token!;
  }
  return createResponse(await fetchApi({ endpoint, query }));
};

export const POST: APIRoute = async ({ request, params }) => {
  const apiPath = params.api;
  const body = await request.json();
  const token = getToken(request);

  try {
    switch (apiPath) {
      case 'register':
        return handleRequest('auth/local/register', body);
      case 'login':
        return handleRequest('auth/local', body);
      case 'cart/add':
        return handleRequest('cart/add', body, true, token);
      case 'cart/remove':
        return handleRequest('cart/remove', body, true, token);
      default:
        return createResponse({ error: 'Invalid API route' }, 404);
    }
  } catch (error) {
    return handleError(error);
  }
};

export const GET: APIRoute = async ({ request, params, url }) => {
  const apiPath = params.api;
  const id = url.searchParams.get('id');
  const token = getToken(request);

  try {
    switch (apiPath) {
      case 'cart':
        return handleRequest('cart', {}, true, token);
      case 'products':
        return handleRequest('products', id ? { id } : {});
      default:
        return createResponse({ error: 'Invalid API route' }, 404);
    }
  } catch (error) {
    return handleError(error);
  }
};


export const prerender = false;