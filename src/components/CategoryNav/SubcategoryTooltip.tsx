import { displaySubcategoryTopicTitle } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  isActive: boolean;
  subcategory: string;
  topics: string[];
}

export default function SubcategoryTooltip(props: Props) {
  const { isActive, subcategory, topics } = props;
  return (
    <Tooltip>
      <TooltipTrigger>
        <a href={`#${subcategory}`}>
          {displaySubcategoryTopicTitle(subcategory)}
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col p-2 font-sm bg-dvrcp-blue-1">
          {" "}
          {topics.map((topic) => (
            <a
              key={`${subcategory}-${topic}`}
              href={`#${subcategory}-${topic}`}
            >
              {displaySubcategoryTopicTitle(topic)}
            </a>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
