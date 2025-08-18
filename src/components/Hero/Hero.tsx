import FadeMask from "./FadeMask";
import HeroMap from "./HeroMap";
import HeroLeftContent from "./HeroLeftContent";
import { CountyData } from "@/types";

interface Props {
  geographyName?: string;
  countyData?: CountyData;
}

export default function Hero(props: Props) {
  const { geographyName, countyData } = props;
  const title = geographyName ? geographyName : "Community Profiles";

  return (
    <div className="flex">
      <HeroLeftContent title={title} />
      <FadeMask />
      <HeroMap buffer_box={countyData?.buffer_bbox} fips={countyData?.fips} />
    </div>
  );
}
