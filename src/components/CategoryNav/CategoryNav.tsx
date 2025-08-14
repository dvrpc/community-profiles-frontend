import CategoryButton from "./CategoryButton";

export default function CategoryNav() {
  return (
    <div className="bg-dvrpc-blue-3">
      <div className="flex">
        <CategoryButton
          name="Active Transportation"
          imagePath="categories/active_transportation.svg"
          href="#active-transportation"
        />
      </div>
    </div>
  );
}
