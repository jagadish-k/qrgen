import { useState, useCallback } from 'react';
import { Gradient } from '../types';
import { FALLBACK_GRADIENTS } from '../constants/qrTypes';

export const useGradients = () => {
  const [availableGradients, setAvailableGradients] =
    useState<Gradient[]>(FALLBACK_GRADIENTS);
  const [currentGradient, setCurrentGradient] = useState<Gradient | null>(
    FALLBACK_GRADIENTS[0]
  );
  const [gradientOptions, setGradientOptions] =
    useState<Gradient[]>(FALLBACK_GRADIENTS);

  const generateRandomGradient = useCallback(() => {
    if (availableGradients.length > 0) {
      const randomGradient =
        availableGradients[
          Math.floor(Math.random() * availableGradients.length)
        ];
      setCurrentGradient(randomGradient);

      // Generate new 5 random options
      const shuffled = [...availableGradients].sort(() => 0.5 - Math.random());
      setGradientOptions(shuffled.slice(0, 5));

      return randomGradient;
    }
    return null;
  }, [availableGradients]);

  // Select specific gradient
  const selectGradient = useCallback((gradient: Gradient) => {
    setCurrentGradient(gradient);
    return gradient;
  }, []);

  return {
    availableGradients,
    currentGradient,
    gradientOptions,
    generateRandomGradient,
    selectGradient,
  };
};
