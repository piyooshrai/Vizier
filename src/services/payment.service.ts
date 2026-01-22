import api from './api';

export interface CheckoutSessionResponse {
  url?: string;
  checkout_url?: string;
  session_url?: string;
}

export const paymentService = {
  async createCheckoutSession(): Promise<CheckoutSessionResponse> {
    const response = await api.post<CheckoutSessionResponse>(
      '/payment/create-checkout-session',
    );
    return response.data;
  },
};

export default paymentService;
