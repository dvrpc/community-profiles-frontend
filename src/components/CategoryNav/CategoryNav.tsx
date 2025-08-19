import ActiveTransportationIcon from "../Icons/ActiveTransportationIcon";
import DemographicHousingIcon from "../Icons/DemographicHousingIcon";
import EconomyIcon from "../Icons/EconomyIcon";
import EnvironmnentIcon from "../Icons/EnvironmentIcon";
import FreightIcon from "../Icons/FreightIcon";
import RoadwaysIcon from "../Icons/RoadwaysIcon";
import SafetyHealthIcon from "../Icons/SafetyHealthIcon";
import TransitIcon from "../Icons/TransitIcon";
import CategoryButton from "./CategoryButton";

export default function CategoryNav() {
  return (
    <div className="bg-dvrpc-blue-3 flex justify-center p-4">
      <div className="grid grid-cols-8">
        <CategoryButton
          name="Demographics & Housing"
          icon={<DemographicHousingIcon fill="white" className='h-18' />}
          href="#demographics-housing"
        />
        <CategoryButton
          name="Economy"
          icon={<EconomyIcon fill="white" className='h-18' />}
          href="#economy"
        />

        <CategoryButton
          name="Active Transportation"
          icon={<ActiveTransportationIcon fill="white" className='h-18' />}
          href="#active-transportation"
        />
        <CategoryButton
          name="Safety & Health"
          icon={<SafetyHealthIcon fill="white" className='h-18' />}
          href="#safety-health"
        />
        <CategoryButton
          name="Freight"
          icon={<FreightIcon fill="white" className='h-18' />}
          href="#freight"
        />
        <CategoryButton
          name="Environment"
          icon={<EnvironmnentIcon fill="white" className='h-18' />}
          href="#environment"
        />
        <CategoryButton
          name="Transit"
          icon={<TransitIcon fill="white" className='h-18' />}
          href="#transit"
        />
        <CategoryButton
          name="Roadways"
          icon={<RoadwaysIcon fill="white" className='h-18' />}
          href="#roadways"
        />
      </div>
    </div>
  );
}
