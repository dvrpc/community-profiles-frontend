import {
  CategoryKeyMap,
  CategoryKeys,
  ProfileBundle,
  ProfileContent,
} from "@/types/types";
import Category from "./Category";
import CategoryNav from "../CategoryNav/CategoryNav";
import ScrollProvider from "@/context/ScrollProvider";
import { API_BASE_URL } from "@/consts";
import { CartProvider } from "../DataCart/CartProvider";
import DataCartModal from "../DataCart/DataCartModal";

interface Props {
  content: ProfileContent;
}

export default async function Content(props: Props & ProfileBundle) {
  const { content, ...profileBundle } = props;

  const treeResponse = await fetch(
    `${API_BASE_URL}/content/tree/${profileBundle.geoLevel}`,
  );
  const categoryKeyMap = (await treeResponse.json()) as CategoryKeyMap;

  return (
    <ScrollProvider>
      <CategoryNav categoryKeyMap={categoryKeyMap} />
      <CartProvider>
        <div>
          {Object.entries(content).map(([key, value]) => {
            const category = key as CategoryKeys;
            return (
              <Category
                key={category}
                category={category}
                categoryContent={value}
                {...profileBundle}
              />
            );
          })}
          <DataCartModal />
        </div>
      </CartProvider>
    </ScrollProvider>
  );
}
