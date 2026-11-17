import { useEffect, useRef } from "react";

// export default function useThrottle(value, delay = 500) {
//   const [throttledValue, setThrottledValue] = useState(value);

//   const lastTime = useRef(0);

//   useEffect(() => {
//     const now = Date.now();
//     const remainingTime = delay - (now - lastTime.current);

//     if (remainingTime <= 0) {
//       setThrottledValue(value);
//       lastTime.current = now;
//       return;
//     }

//     const timer = setTimeout(() => {
//       setThrottledValue(value);
//       lastTime.current = Date.now();
//     }, remainingTime);

//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return throttledValue;
// }

function useThrottledScroll(callback, delay = 500) {
  const callbackRef = useRef(callback);
  const lastRunRef = useRef(0);
  const timeoutRef = useRef(null);

  // Keep the latest callback without re-registering the listener
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    function handleScroll() {
      const now = Date.now();
      const remaining = delay - (now - lastRunRef.current);

      if (remaining <= 0) {
        // Leading execution
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        lastRunRef.current = now;
        callbackRef.current();
      } else if (!timeoutRef.current) {
        // Trailing execution
        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          timeoutRef.current = null;

          callbackRef.current();
        }, remaining);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);
}

export default useThrottledScroll;
