import React from "react";

interface Props {
    children: React.ReactNode;
    type: 'primary' | 'secondary';
    disabled?: boolean;
    handleClick: () => void;
}

export default function Button(props: Props) {
    const { children, type, disabled, handleClick } = props
    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`text-white ${disabled ? 'bg-dvrpc-gray-5' : 'bg-dvrpc-blue-1 hover:bg-dvrpc-blue-3'} focus:ring-4 focus:ring-dvrpc-blue-5 font-medium rounded-lg text-sm px-5 py-2.5`}>
            {children}
        </button>
    )
}