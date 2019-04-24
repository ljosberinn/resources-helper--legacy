import { useEffect } from 'react';

export const useAsyncEffect = (effect: () => Promise<void | (() => void)>, dependencies: any[]) =>
  useEffect(() => {
    const cleanupPromise = effect();
    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
