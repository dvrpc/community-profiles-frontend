"use client"
import { ShoppingCart } from "lucide-react";
import { useCartVizVars } from "./CartProvider";
import { act, useState } from "react";

interface Props {
    topicId: number;
    topicVars: string[]
}
export default function AddDataToCartButton(props: Props) {
    const [active, setActive] = useState(false)
    const { topicId, topicVars } = props
    const { getVizVars, addCartVars, removeCartVars } = useCartVizVars();

    async function handleClick() {


        if (!active) {
            const vizVars = getVizVars(topicId);
            const allVars = [...topicVars, ...vizVars];
            addCartVars(topicId, allVars)
        } else {
            removeCartVars(topicId)
        }
        setActive(!active)
    }
    return (
        <button
            onClick={handleClick}
            className={`flex gap-2 items-center hover:cursor-pointer ${active ? 'text-dvrpc-blue-1 hover:text-dvrpc-blue-3' : 'hover:text-dvrpc-blue-1'} `}>
            <ShoppingCart size={20} />
            {`${active ? 'Remove Data from Cart' : 'Add Data to Cart'}`}
        </button>
    )
}