"use client";

import { useEffect, useRef } from "react";
import { useVegaEmbed, VegaEmbed } from "react-vega";
import { EmbedOptions } from "vega-embed";
import { TopLevelSpec } from "vega-lite";

interface Props {
  spec: TopLevelSpec;
  options?: EmbedOptions;
}

// export default function VegaChart(props: Props) {
//     const { spec, options } = props

//     spec.width = 1000
//     return <VegaEmbed spec={spec} options={options} />;
// }

export default function VegaChart(props: Props) {
  const { spec, options } = props;

  const ref = useRef<HTMLDivElement>(null);

  const embed = useVegaEmbed({
    ref,
    spec: {
      ...spec,
      width: "container",
      autosize: {
        contains: "padding",
      },
    },
    options: {
      mode: "vega-lite",
    },
  });

  useEffect(() => {
    if (!ref.current || !embed) return;

    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event("resize"));
      embed?.view.runAsync();
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [embed]);

  return (
    <div className="w-full flex">
      <div ref={ref} className="flex-1 max-w-full" />
    </div>
  );
}
