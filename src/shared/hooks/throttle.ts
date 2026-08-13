import { useEffect, useRef, useState } from "react"

const useThrottle = (value: any, delay = 500) => {
    const [throttleValue, setThrottleValue] = useState(value);
    const lastExecuted = useRef<number>(Date.now());

    useEffect(() => {
        const elapsed = Date.now() - lastExecuted.current;

        if (elapsed >= delay) {
            setThrottleValue(value);
            lastExecuted.current = Date.now();
        } else {
            const timerId = setTimeout(() => {
                setThrottleValue(value);
                lastExecuted.current = Date.now();
            }, delay - elapsed);

            return () => clearTimeout(timerId);
        }
    }, [value, delay])

    return throttleValue;
}

export { useThrottle }