import {
  CategoryKeyMap,
  CategoryKeys,
  ProfileBundle,
  Category as CategoryType,
} from "@/types/types";
import Category from "./Category";
import CategoryNav from "../CategoryNav/CategoryNav";
import ScrollProvider from "@/context/ScrollProvider";
import { API_BASE_URL } from "@/consts";
import { CartProvider } from "../DataCart/CartProvider";
import DataCartModal from "../DataCart/DataCartModal";
import { useTree } from "@/lib/hooks";

interface Props {
  contentTree: CategoryType[];
}

export default async function Content(props: Props & ProfileBundle) {
  const { contentTree, ...profileBundle } = props;

  return (
    <ScrollProvider>
      <CategoryNav geoLevel={profileBundle.geoLevel} />
      <CartProvider>
        <div>
          {contentTree.map((category) => {
            return (
              <Category
                key={category.id}
                category={category}
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
