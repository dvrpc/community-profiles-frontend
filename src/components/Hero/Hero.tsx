import FadeMask from "./FadeMask";
import HeroMap from "./HeroMap";
import HeroLeftContent from "./HeroLeftContent";
import { AllOrNothing, CountyData, GeoLevel, ProfileData } from "@/types";

interface HeroProps {
  geographyName: string;
  profileData: ProfileData;
  geoLevel: GeoLevel;
}

type Props = AllOrNothing<HeroProps>;

export default function Hero(props: Props) {
  const { geographyName, profileData, geoLevel } = props;

  if (geoLevel) {
    return (
      <div className="flex">
        <HeroLeftContent
          title={geographyName}
          profileData={profileData}
          geoLevel={geoLevel}
        />
        <FadeMask />
        <HeroMap
          buffer_box={profileData.buffer_bbox}
          geoid={profileData.geoid}
          geoLevel={geoLevel}
        />
      </div>
    );
  } else {
    return (
      <div className="flex">
        <HeroLeftContent title={"Community Profiles"} />
        <FadeMask />
        <HeroMap />
      </div>
    );
  }
}
