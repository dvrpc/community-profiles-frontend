import { CountyData, GeoLevel, MunicipalityData, ProfileContent, ProfileData } from "@/types";
import CategorySection from "../CategorySection/CategorySection";

interface Props {
    content: ProfileContent[];
    data: ProfileData
    geoLevel: GeoLevel;
}
export default function Content(props: Props) {
    const { content, data, geoLevel } = props

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.pageYOffset;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                console.log(sectionTop, section.offsetHeight, "", section, scrollPosition);
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    window.history.replaceState(null, null, `#${section.id}`);
                }
            });
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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