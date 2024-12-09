import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { useCommonStore } from '../store/useCommonStore';

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage('color-theme', 'light');
  const { setIsDarkMode } = useCommonStore();

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.body.classList;

    if (colorMode === 'dark') {
      setIsDarkMode(true);
      bodyClass.add(className);
    } else {
      setIsDarkMode(false);
      bodyClass.remove(className);
    }
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
