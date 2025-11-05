import FadeMask from "./FadeMask";
import HeroMap from "./HeroMap";
import HeroLeftContent from "./HeroLeftContent";
import { GeoLevel, ProfileData } from "@/types/types";
import { LARGE_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY, SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";

interface Props {
  title: string;
  profileData: ProfileData;
  geoLevel: GeoLevel;
}




export default function Hero(props: Props) {
  const { title, profileData, geoLevel } = props;

  const viewPort = geoLevel == 'region' ? LARGE_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY : SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY

  return (
    <div className="flex">
      <HeroLeftContent
        title={title}
        profileData={profileData}
        geoLevel={geoLevel}
      />
      <FadeMask viewPort={viewPort} />
      {geoLevel == 'region' ? <HeroMap viewPort={viewPort} /> : <HeroMap
        viewPort={viewPort}
        buffer_box={profileData.buffer_bbox}
        geoid={profileData.geoid}
        geoLevel={geoLevel}
      />}
    </div>
  );

}
