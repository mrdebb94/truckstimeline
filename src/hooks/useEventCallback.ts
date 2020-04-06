import { useRef, useEffect, useCallback } from "react";

export function useEventCallback<T extends (...args: any[]) => any>(fn: T, dependencies: React.DependencyList) {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = fn;
    }, [fn, ...dependencies]);

    return useCallback((...args: any[]) => {
        const fn = ref.current;
        return fn(...args);
    }, [ref]);
}