export const debounce = (fn: (...args: unknown[]) => void, delay: number) => {
    let timeout: number | undefined;

    return (...args: unknown[]) => {
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(() => fn(...args), delay);
    };
};
