"use client"
import { useEffect, useRef, useState } from "react";

interface Props {
    level: 'category' | 'subcategory'
    key: string;
}

export default function ScrollNode(props: Props) {
    const { level, key } = props
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [reachedBottom, setReachedBottom] = useState(false);

    if (reachedBottom) {
        console.log(key)
    }
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            // Check if the user has scrolled to the bottom
            console.log(scrollHeight)
            if (scrollTop + clientHeight >= scrollHeight) {
                setReachedBottom(true);
            } else {
                setReachedBottom(false);
            }
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        console.log(key)
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return <div ref={scrollContainerRef} className="p-4" />

}