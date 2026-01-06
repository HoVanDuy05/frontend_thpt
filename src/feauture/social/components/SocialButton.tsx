import { Button, ButtonProps } from '@mantine/core';
import { ComponentPropsWithoutRef } from 'react';

export interface SocialButtonProps extends ButtonProps, Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonProps> {
    variantType?: 'primary' | 'secondary' | 'ghost';
}

export const SocialButton = ({ variantType = 'primary', className, ...props }: SocialButtonProps) => {

    // Threads/Instagram Style
    // Primary: Black bg (White text) / Dark mode: White bg (Black text)
    // Secondary: Gray bg
    // Ghost: Transparent

    const getClasses = () => {
        switch (variantType) {
            case 'primary':
                return "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 border-transparent";
            case 'secondary':
                return "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 border-transparent";
            case 'ghost':
                return "bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-zinc-900 border-transparent";
            default:
                return "";
        }
    };

    return (
        <Button
            radius="xl"
            size="md"
            className={`${getClasses()} font-semibold transition-all ${className || ''}`}
            variant={variantType === 'ghost' ? 'subtle' : 'filled'}
            {...props}
        />
    );
};
