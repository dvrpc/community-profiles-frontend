

import { VegaEmbed } from "react-vega";

export default function VegaChart() {
    return <VegaEmbed spec={spec} options={options} />;
}