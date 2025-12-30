"use client";

import { Button, ButtonProps, createPolymorphicComponent } from "@mantine/core";
import { forwardRef } from "react";

interface AppButtonProps extends ButtonProps {
    variant?: "filled" | "light" | "outline" | "transparent" | "white" | "default" | "gradient" | "subtle";
}

const _AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(({ children, className, variant = "gradient", ...others }, ref) => {
    // Default gradient if variant is gradient and no gradient prop provided
    const gradient = others.gradient || { from: "blue.6", to: "indigo.6", deg: 45 };

    return (
        <Button
            ref={ref}
            variant={variant}
            gradient={variant === "gradient" ? gradient : undefined}
            radius="md"
            fw={600}
            className={`transition-all duration-200 active:scale-95 ${className || ""}`}
            {...others}
        >
            {children}
        </Button>
    );
});

_AppButton.displayName = "@pms/AppButton";

export const AppButton = createPolymorphicComponent<"button", AppButtonProps>(_AppButton);
