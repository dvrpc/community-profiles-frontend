import { CategoryKeys, GeoLevel, ProfileContent, ProfileData } from "@/types/types";
import Category from "./Category";
import CategoryNav from "../CategoryNav/CategoryNav";
import ScrollProvider from "@/context/ScrollProvider";
import { getCategoryKeyMap } from "@/utils";

interface Props {
  content: ProfileContent;
  data: ProfileData;
  geoLevel: GeoLevel;
}

export default function Content(props: Props) {
  const { content, data, geoLevel } = props;

  const categoryKeyMap = getCategoryKeyMap(content);

  return (
    <ScrollProvider>
      <CategoryNav categoryKeyMap={categoryKeyMap} />
      <div>
        {Object.entries(content).map(([key, value]) => {
          const category = key as CategoryKeys;
          return (
            <Category
              key={category}
              category={category}
              subcategories={value}
              profileData={data}
              geoLevel={geoLevel}
            />
          );
        })}
      </div>
    </ScrollProvider>
  );
}
