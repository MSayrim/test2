import { API_BASE_URL, endpoints } from './config';
import type { ApiResponse, Firm, PriceCalculationRequest, PriceCalculationResponse } from '../types';

export const getFirms = async (): Promise<Firm[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoints.firms}`);
    if (!response.ok) {
      throw new Error('Failed to fetch firms');
    }
    const data: ApiResponse<Firm[]> = await response.json();
    return data.responseData;
  } catch (error) {
    console.error('Error fetching firms:', error);
    throw error;
  }
};

export const calculatePrice = async (request: PriceCalculationRequest): Promise<PriceCalculationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoints.calculate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to calculate price');
    }
    
    const data: ApiResponse<PriceCalculationResponse> = await response.json();
    return data.responseData;
  } catch (error) {
    console.error('Error calculating price:', error);
    throw error;
  }
};