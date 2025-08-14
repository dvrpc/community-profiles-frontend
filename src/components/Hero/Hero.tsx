import FadeMask from "./FadeMask";
import HeroMap from "./HeroMap";
import HeroLeftContent from "./HeroLeftContent";

interface Props {
  geographyName?: string;
}

export default function Hero(props: Props) {
  const { geographyName } = props;
  const title = geographyName ? geographyName : "Community Profiles";

  return (
    <div className="flex">
      <HeroLeftContent title={title} />
      <FadeMask />
      <HeroMap />
    </div>
  );
}
