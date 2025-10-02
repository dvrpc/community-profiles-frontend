import FadeMask from "./FadeMask";
import HeroMap from "./HeroMap";
import HeroLeftContent from "./HeroLeftContent";
import { CountyData, GeoLevel, MunicipalityData, ProfileData, RegionData } from "@/types";
import Link from "next/link";

interface Props {
  title: string;
  profileData: ProfileData;
  geoLevel: GeoLevel;
}


const getBackLink = (parentCounty?: string) => {
  if (parentCounty) {
    return (
      <Link href={`/${parentCounty.toLowerCase()}`}>
        &larr; Return to {parentCounty} County
      </Link>
    );
  } else {
    return <Link href="/">&larr; Return to Home</Link>;
  }
};

export default function Hero(props: Props) {
  const { title, profileData, geoLevel } = props;

  let backLink;
  if (geoLevel == 'county') backLink == getBackLink()
  if (geoLevel == 'municipality') backLink = getBackLink(profileData.county)

  return (
    <div className="flex">
      <HeroLeftContent
        title={title}
        profileData={profileData}
        backLink={backLink}
      />
      <FadeMask />
      {geoLevel == 'region' ? <HeroMap /> : <HeroMap
        buffer_box={profileData.buffer_bbox}
        geoid={profileData.geoid}
        geoLevel={geoLevel}
      />}
    </div>
  );

}
