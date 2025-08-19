import FadeMask from "./FadeMask";
import HeroMap from "./HeroMap";
import HeroLeftContent from "./HeroLeftContent";
import { CountyData, ProfileData } from "@/types";

interface Props {
  geographyName?: string;
  profileData?: ProfileData;
}

export default function Hero(props: Props) {
  const { geographyName, profileData } = props;
  const title = geographyName ? geographyName : "Community Profiles";

  return (
    <div className="flex">
      <HeroLeftContent title={title} profileData={profileData} />
      <FadeMask />
      <HeroMap buffer_box={profileData?.buffer_bbox} fips={profileData?.fips} />
    </div>
  );
}
