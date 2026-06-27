import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component handles:
// 1. Scrolling to top on route change
// 2. Scrolling to hash element when URL has a hash
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    if (hash) {
      // If there's a hash, scroll to that element
      const scrollToHash = () => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      // Small delay to ensure DOM is ready
      setTimeout(scrollToHash, 100);
    } else {
      // No hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;