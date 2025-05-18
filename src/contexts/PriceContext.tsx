import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFirms, calculatePrice } from '../api/priceApi';
import type { Firm, PriceCalculationRequest, PriceCalculationResponse } from '../types';

interface PriceContextType {
  firms: Firm[];
  loading: boolean;
  error: string | null;
  selectedFirm: Firm | null;
  setSelectedFirm: (firm: Firm | null) => void;
  calculatePrices: (fullPrice: number, discount: number) => Promise<PriceCalculationResponse>;
}

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFirm, setSelectedFirm] = useState<Firm | null>(null);

  useEffect(() => {
    const loadFirms = async () => {
      try {
        const firmData = await getFirms();
        setFirms(firmData);
        setError(null);
      } catch (err) {
        setError('Failed to load firms');
      } finally {
        setLoading(false);
      }
    };

    loadFirms();
  }, []);

  const calculatePrices = async (fullPrice: number, discount: number): Promise<PriceCalculationResponse> => {
    if (!selectedFirm) {
      throw new Error('No firm selected');
    }

    const request: PriceCalculationRequest = {
      fullPrice,
      discount,
      firm: {
        name: selectedFirm.name,
        code: selectedFirm.code
      }
    };

    return calculatePrice(request);
  };

  return (
    <PriceContext.Provider
      value={{
        firms,
        loading,
        error,
        selectedFirm,
        setSelectedFirm,
        calculatePrices
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export const usePriceContext = () => {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error('usePriceContext must be used within a PriceProvider');
  }
  return context;
};