import { useState, useEffect, useCallback } from 'react';
import { userService } from '@/service/user';

interface UseAccountLinkingResult {
  isLinked: boolean;
  isChecking: boolean;
  showLinkingModal: boolean;
  setShowLinkingModal: (show: boolean) => void;
  checkAccountLinking: () => Promise<void>;
  userId: number | null;
}

export const useAccountLinking = (): UseAccountLinkingResult => {
  const [isLinked, setIsLinked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showLinkingModal, setShowLinkingModal] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const checkAccountLinking = useCallback(async () => {
    try {
      const response = await userService.checkZaloId();
      console.log('Check account response:', response);

      setIsLinked(response.is_linked);
      setUserId(response.user_id);
      
      // Don't automatically show the modal, just update the linked status
      if (response.is_linked) {
        console.log('Account is linked, user ID:', response.user_id);
        setShowLinkingModal(false);
      }
    } catch (error) {
      console.error('Error checking account linking:', error);
      setIsLinked(false);
      setUserId(null);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Check account linking status on mount
  useEffect(() => {
    checkAccountLinking();
  }, [checkAccountLinking]);

  return {
    isLinked,
    isChecking,
    showLinkingModal,
    setShowLinkingModal,
    checkAccountLinking,
    userId,
  };
}; 