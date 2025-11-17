"use client"
import { useAllProducts, useSource } from "@/lib/hooks";
import { Source } from "@/types/types";
import MultiSelect from "./MultiSelect";
import { useState } from "react";
import Button from "@/components/Buttons/Button";

export interface Option {
    value: number;
    label: string
}

interface Props {
    sources: Source[];

}
export default function ContentForm(props: Props) {
    const { data: sources } = useSource();
    const { data: products } = useAllProducts();

    const [selectedSources, setSelectedSources] = useState<Option[]>([])
    const [selectedProducts, setSelectedProducts] = useState<Option[]>([])

    if (!sources || !products) return <></>

    const sourceOptions: Option[] = sources.map(source => {
        return {
            value: source.id,
            label: source.name
        }
    })

    const productOptions: Option[] = products.map(product => {
        return {
            value: product.id,
            label: product.title
        }
    })

    const handleSourceChange = (values: readonly Option[]) => {
        let newSources: Option[] = [...values]
        setSelectedSources(newSources)
    }

    const handleProductChange = (values: readonly Option[]) => {
        let newProducts: Option[] = [...values]
        setSelectedProducts(newProducts)
    }

    const handleSave = () => {

    }

    const citationString = () => {
        if (!sources) return ""

        let citation = ""
        const sourceIds = selectedSources.map(s => s.value)
        const selectedSourceIds = new Set(sourceIds)
        const filteredSources = sources.filter(source => selectedSourceIds.has(source.id))
        filteredSources.forEach((filteredSource, index) => {
            citation += filteredSource.citation
            if (index < filteredSources.length - 1) {
                citation += ', '
            } else {
                citation += '.'
            }
        })
        return citation
    }

    return (
        <form className="">
            <div className="flex flex-col gap-4">

                <div className="w-100">
                    <label>Sources</label>
                    <MultiSelect value={selectedSources} options={sourceOptions} onChange={handleSourceChange} />
                    <span className="italic">
                        {citationString()}
                    </span>
                </div>
                {/* <div></div> */}

                <div className="w-100">
                    <label>Related Products</label>
                    <MultiSelect value={selectedProducts} options={productOptions} onChange={handleProductChange} />
                </div>
            </div>
            <div className="">
                <Button type="primary" handleClick={handleSave}>
                    Save
                </Button>
            </div>

        </form>
    )
}