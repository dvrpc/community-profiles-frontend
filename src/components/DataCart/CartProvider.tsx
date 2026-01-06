// CartProvider.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type VarsByTopic = Record<number, any[]>;

const CartContext = createContext<{
    vizVars: VarsByTopic;
    cartVars: VarsByTopic;
    setVizVars: (topicId: number, vars: any[]) => void;
    getVizVars: (topicId: number) => any[];
    addCartVars: (topicId: number, vars: any[]) => void;
    removeCartVars: (topicId: number) => void;
} | null>(null);

interface Props {
    children: React.ReactNode
}

export function CartProvider(props: Props) {

    const { children } = props
    const [vizVars, setVizVarsState] = useState<VarsByTopic>({});
    const [cartVars, setCartVars] = useState<VarsByTopic>({})

    function setVizVars(topicId: number, vars: any[]) {
        setVizVarsState((v) => ({ ...v, [topicId]: vars }));
    }

    function addCartVars(topicId: number, vars: string[]) {
        setCartVars((v) => ({ ...v, [topicId]: vars }))
        console.log(cartVars)
    }

    function removeCartVars(topicId: number) {
        setCartVars(currentCartVars => {
            const { [topicId]: _, ...rest } = currentCartVars
            return rest
        })
    }

    function getVizVars(topicId: number) {
        return vizVars[topicId] ?? [];
    }

    return (
        <CartContext.Provider value={{ vizVars, cartVars, setVizVars, getVizVars, addCartVars, removeCartVars }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCartVizVars() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCartVizVars must be used within CartProvider");
    return ctx;
}