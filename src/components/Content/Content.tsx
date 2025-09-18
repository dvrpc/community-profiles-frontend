import { CountyData, GeoLevel, MunicipalityData, ProfileContent, ProfileData } from "@/types";
import CategorySection from "../CategorySection/CategorySection";
import { useEffect } from "react";

interface Props {
    content: ProfileContent[];
    data: ProfileData
    geoLevel: GeoLevel;
}
export default function Content(props: Props) {
    const { content, data, geoLevel } = props


    return <div>
        {content.map(c => {
            return (
                <CategorySection
                    key={c.category}
                    category={c.category}
                    content={c.content}
                    visualizations={c.visualizations}
                    profileData={data}
                    geoLevel={geoLevel}
                />
            );
        })}
    </div>
}