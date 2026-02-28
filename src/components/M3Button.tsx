import React from "react";

interface M3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "tertiary" | "surface";
    size?: "md" | "lg" | "xl";
    children: React.ReactNode;
}

export const M3Button = ({
    variant = "primary",
    size = "lg",
    children,
    className = "",
    ...props
}: M3ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 active:scale-95 touch-manipulation shadow-sm active:shadow-none";

    const variants = {
        primary: "bg-primary text-on-primary hover:brightness-110",
        secondary: "bg-secondary-container text-on-surface-variant hover:brightness-95",
        tertiary: "bg-primary-container text-on-primary-container hover:brightness-95",
        surface: "bg-surface-container text-on-surface-variant hover:brightness-95",
    };

    const sizes = {
        md: "px-6 py-3 text-lg rounded-2xl min-h-[56px] min-w-[120px]",
        lg: "px-10 py-5 text-2xl rounded-[32px] min-h-[72px] min-w-[200px]",
        xl: "px-16 py-8 text-4xl rounded-[48px] min-h-[100px] min-w-[300px]",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
