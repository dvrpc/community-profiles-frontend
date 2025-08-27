import { categoryTitleMap } from "@/consts";
import { CategoryKeys } from "@/types";

interface Props {
  category: CategoryKeys;
  content: string;
  visualizations: any;
}

export default function CategorySection(props: Props) {
  const { category, content, visualizations } = props;
  return (
    <div className="p-16">
      <div className="w-1/3">
        <h2 id={category} className="text-4xl text-dvrpc-blue-1 font-bold mb-8">
          {categoryTitleMap[category]}
        </h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <div className="w-2/3"></div>
    </div>
  );
}
