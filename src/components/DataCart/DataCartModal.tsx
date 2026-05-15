"use client"
import { ShoppingCart } from "lucide-react"
import { useCartVizVars } from "./CartProvider";
import { useState, useEffect } from "react";
import { categoryTitleMap, CATEGORIES } from "../../consts";

export default function DataCartModal() {
    const [open, setOpen] = useState(false)
    const { cartVars, removeCartVars } = useCartVizVars();

    const active = Object.keys(cartVars).length > 0

    const handleClick = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose()
            }
        }
        if (open) {
            document.addEventListener('keydown', handleKeyDown)
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open])

    return (
        <>
            {active && <button onClick={handleClick} className="fixed right-4 bottom-4 bg-dvrpc-blue-1 p-3.5 rounded-[50%] hover:bg-dvrpc-blue-3 hover:cursor-pointer z-100000">
                <ShoppingCart color="white" size={28} />
            </button>}
            {open && <div className="overflow-y-auto overflow-x-hidden py-12 fixed inset-0 z-500000 flex justify-center items-center w-full h-full bg-black/50" onClick={handleClose}>
                <div className="relative p-4 w-full max-w-2xl rounded-md bg-white min-h-25" onClick={(e) => e.stopPropagation()}>
                    <div className="relative p-4">
                        <div className="flex items-center justify-between ">
                            <h3 className="text-lg font-medium text-heading">
                                Data Cart
                            </h3>
                            <button type="button" onClick={handleClose} className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" /></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="overflow-y-auto ">
                            {Object.entries(cartVars).map(([topicId, vars]) => (
                                <div key={topicId}>
                                    <h4 className="font-medium text-heading">{categoryTitleMap[CATEGORIES[parseInt(topicId)]]}</h4>
                                    <ul className="list-disc list-inside text-body">
                                        {vars.map((v, i) => <li key={i}>{v}</li>)}
                                    </ul>
                                    <button onClick={() => removeCartVars(parseInt(topicId))} className="mt-2 text-sm text-red-500 hover:underline">Remove all from this category</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
                            <button onClick={handleClose} type="button" className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Close</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}