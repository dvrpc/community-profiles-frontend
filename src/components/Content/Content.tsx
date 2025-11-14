import { CategoryKeyMap, CategoryKeys, GeoLevel, ProfileContent, ProfileData } from "@/types/types";
import Category from "./Category";
import CategoryNav from "../CategoryNav/CategoryNav";
import ScrollProvider from "@/context/ScrollProvider";
import { API_BASE_URL } from "@/consts";

interface Props {
  content: ProfileContent;
  data: ProfileData;
  geoLevel: GeoLevel;
}

export default async function Content(props: Props) {
  const { content, data, geoLevel } = props;

  const treeResponse = await fetch(`${API_BASE_URL}/content/tree/${geoLevel}`);
  const categoryKeyMap = (await treeResponse.json()) as CategoryKeyMap;

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
