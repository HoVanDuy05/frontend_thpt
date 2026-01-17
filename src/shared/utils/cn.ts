export type ClassValue =
    | string
    | number
    | null
    | undefined
    | boolean
    | Record<string, boolean>
    | ClassValue[];

export function cn(...inputs: ClassValue[]) {
    const classes: string[] = [];

    const push = (value: ClassValue) => {
        if (!value) return;

        if (typeof value === 'string' || typeof value === 'number') {
            classes.push(String(value));
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(push);
            return;
        }

        if (typeof value === 'object') {
            for (const [key, enabled] of Object.entries(value)) {
                if (enabled) classes.push(key);
            }
        }
    };

    inputs.forEach(push);

    return classes.join(' ');
}
