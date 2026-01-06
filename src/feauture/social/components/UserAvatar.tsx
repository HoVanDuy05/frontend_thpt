import React from 'react';
import { Avatar, AvatarProps } from '@mantine/core';

interface UserAvatarProps extends AvatarProps {
    src?: string | null;
    alt?: string;
    size?: number | string;
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
    src,
    alt,
    size = 40,
    className,
    ...props
}) => {
    return (
        <Avatar
            src={src}
            alt={alt}
            size={size}
            radius="xl"
            style={{ borderRadius: '50%', ...props.style }}
            classNames={{
                root: `flex-shrink-0 border border-black/5 dark:border-white/10 object-cover ${className || ''}`,
                image: 'rounded-full',
            }}
            {...props}
        />
    );
};
