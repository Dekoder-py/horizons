import createClient from 'openapi-fetch';
import type { paths } from './schema';

const getBaseUrl = () => {
	if (typeof window === 'undefined') {
		return process.env.API_URL || 'http://localhost:3002';
	}
	return import.meta.env.VITE_API_URL || 'http://localhost:3002';
};

export const api = createClient<paths>({
	baseUrl: getBaseUrl(),
	credentials: 'include'
});
