import React from "react";

interface Props {
    children: React.ReactNode;
    type: 'primary' | 'secondary';
    disabled?: boolean;
    handleClick: () => void;
}

const primaryColors = 'bg-dvrpc-blue-1 hover:bg-dvrpc-blue-3 text-white focus:ring-dvrpc-blue-5'
const secondaryColors = 'bg-dvrpc-gray-7 hover:bg-dvrpc-gray-6 text-dvrpc-gray-1  focus:ring-dvrpc-gray-5 '

export default function Button(props: Props) {
    const { children, type, disabled, handleClick } = props

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`flex gap-2 ${disabled ? 'bg-dvrpc-gray-5' : type == 'primary' ? primaryColors : secondaryColors} focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5`}>
            {children}
        </button>
    )
}