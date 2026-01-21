import { Text, TextProps } from "@mantine/core";
import React from 'react';

interface TruncateWrapperProps extends TextProps {
    children: React.ReactNode;
    lines?: number;
}

export const TruncateWrapper = ({ children, lines = 3, ...props }: TruncateWrapperProps) => {
    return (
        <Text lineClamp={lines} {...props}>
            {children}
        </Text>
    );
};
