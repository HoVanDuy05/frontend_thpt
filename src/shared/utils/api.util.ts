/**
 * Replaces dynamic placeholders in a URL with actual values
 * @param url - The URL string with placeholders (e.g., "/users/:id")
 * @param params - Object containing the values to replace placeholders
 * @returns The URL with all placeholders replaced
 */
export const replaceDynamicValues = (
    url: string,
    params: Record<string, string | number>
): string => {
    let result = url;

    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, String(value));
    });

    return result;
};

/**
 * Parses query parameters into a URL-encoded string, handling arrays properly
 * @param params - Object containing query parameters
 * @returns URL-encoded query string
 */
export const parseQueryParams = (
    params?: Record<string, any>
): string => {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            // Handle array parameters by appending each value
            value.forEach((item) => {
                searchParams.append(key, String(item));
            });
        } else if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });

    return searchParams.toString();
};
