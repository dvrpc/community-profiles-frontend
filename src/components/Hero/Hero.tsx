import FadeMask from "./FadeMask";
import HeroMap from "./HeroMap";
import HeroLeftContent from "./HeroLeftContent";
import {
  CountyProfile,
  MunicipalityProfile,
  ProfileBundle,
  RegionProfile,
} from "@/types/types";
import {
  LARGE_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY,
  SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY,
} from "@/consts";

export type HeroProps =
  | {
      title: string;
      geoLevel: "region";
      profileData: RegionProfile;
    }
  | {
      title: string;
      geoLevel: "county";
      profileData: CountyProfile;
    }
  | {
      title: string;
      geoLevel: "municipality";
      profileData: MunicipalityProfile;
    };

type Props = {
  title: string;
};

export default function Hero(props: Props & ProfileBundle) {
  const { profileData, geoLevel } = props;

  const viewPort =
    geoLevel == "region"
      ? LARGE_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY
      : SMALL_HEADER_REMAINING_VIEWPORT_HEIGHT_PROPERTY;

  return (
    <div className="flex">
      <HeroLeftContent {...props} />
      <FadeMask viewPort={viewPort} />
      {geoLevel == "region" ? (
        <HeroMap viewPort={viewPort} />
      ) : (
        <HeroMap
          viewPort={viewPort}
          buffer_box={profileData.geography.buffer_bbox}
          geoid={profileData.geography.geoid}
          geoLevel={geoLevel}
        />
      )}
    </div>
  );
}
