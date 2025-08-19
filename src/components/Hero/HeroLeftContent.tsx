import { CountyData, ProfileData } from "@/types";
import ActiveTransportationIcon from "../Icons/ActiveTransportationIcon";
import DemographicHousingIcon from "../Icons/DemographicHousingIcon";
import EconomyIcon from "../Icons/EconomyIcon";
import EnvironmnentIcon from "../Icons/EnvironmentIcon";
import FreightIcon from "../Icons/FreightIcon";
import RoadwaysIcon from "../Icons/RoadwaysIcon";
import SafetyHealthIcon from "../Icons/SafetyHealthIcon";
import TransitIcon from "../Icons/TransitIcon";
import { displayNumber } from "@/utils";

interface Props {
  title: string;
  profileData?: ProfileData
}

export default function HeroLeftContent(props: Props) {
  const { title, profileData: profileData } = props;

  return (
    <div className="w-1/3 z-10 pl-16 pt-16 flex flex-col">
      <h1 className="text-5xl text-dvrpc-blue-1 font-bold mb-16">{title}</h1>
      {profileData && <div className="grid grid-cols-2 text-dvrpc-gray-1 flex-1">
        <div className="flex">
          <DemographicHousingIcon fill="fill-dvrpc-gray-1" className="h-12 mr-2" />
          <div>
            <span className="font-bold">Population</span>
            <br />
            <span>{displayNumber(profileData.total_pop)}</span>
          </div>
        </div>
        <div className="flex">
          <EconomyIcon fill="fill-dvrpc-gray-1" className="h-12 mr-2" />
          <div>
            <span className="font-bold">Median Household Income</span>
            <br />
            <span>${displayNumber(profileData.median_hh_inc)}</span>
            <span className="text-dvrpc-gray-3 text-sm">&nbsp;&plusmn;{displayNumber(profileData.median_hh_inc_moe)}</span>

          </div>
        </div>
        <div className="flex">
          <ActiveTransportationIcon fill="fill-dvrpc-gray-1" className="h-12 mr-2" />
          <div>
            <span className="font-bold">Miles of Trails</span>
            <br />
            <span>{displayNumber(profileData.existing_trail_mi)}</span>
          </div>
        </div>
        <div className="flex">
          <SafetyHealthIcon fill="fill-dvrpc-gray-1" className="h-12 mr-2" />
          <div>
            <span className="font-bold">KSI Crashes</span>
            <br />
            <span>000</span>
          </div>
        </div>
        <div className="flex">
          <FreightIcon fill="fill-dvrpc-gray-1" className="h-12 mr-2" />
          <div>
            <span className="font-bold">Freight Centers</span>
            <br />
            <span>{displayNumber(profileData.unique_freight_centers)}</span>
          </div>
        </div>
        <div className="flex">
          <EnvironmnentIcon fill="fill-dvrpc-gray-1" className="h-12 mr-2" />
          <div>
            <span className="font-bold">GHG Emissions</span>
            <br />
            <span>000</span>
          </div>
        </div>
        <div className="flex">
          <TransitIcon fill="fill-dvrpc-gray-1" className="h-12 mr-2" />
          <div>
            <span className="font-bold">Rail Stations</span>
            <br />
            <span>{displayNumber(profileData.passenger_rail_stations)}</span>
          </div>
        </div>
        <div className="flex">
          <RoadwaysIcon fill="fill-dvrpc-gray-1" className="h-12 mr-2" />
          <div>
            <span className="font-bold">Miles of Poor Condition Roadways</span>
            <br />
            <span>000</span>
          </div>
        </div>
      </div>}
    </div>
  );
}
