import Image from "next/image";
import { Search } from "lucide-react";

type DrupalData<T> = {
  data: T[];
};

type DrupalItem<T> = {
  type: string;
  id: string;
  attributes: T;
};

type UpperNavigationItem = DrupalItem<{
  title: string;
  link: {
    uri: string;
  };
}>;

const BASE_URL = "https://www.dvrpc.org";

export default async function Header() {
  const upperNavigationResponse = await fetch(
    `${BASE_URL}/jsonapi/menu_link_content/upper-navigation`,
  );
  const upperNavigationData =
    (await upperNavigationResponse.json()) as DrupalData<UpperNavigationItem>;

  console.log(upperNavigationData);
  return (
    <header className="bg-linear-to-b from-dvrpc-blue-1 to-dvrpc-blue-3 h-43 content-center">
      <div className="flex justify-between max-w px-16">
        <a href="https://www.dvrpc.org/" target="_blank">
          <Image
            src="/dvrpc_logo_white.svg"
            alt="DVRPC Logo"
            height={209}
            width={209}
          />
        </a>
        <div className="flex content-center text-white items-center text-lg">
          {upperNavigationData.data.map((item) => (
            <a
              key={item.id}
              href={`${BASE_URL}/${item.attributes.link.uri.split(":")[1]}`}
              className="px-4 border-r-2 border-r-dvrpc-blue-4"
            >
              {item.attributes.title}
            </a>
          ))}
          {/* <a className="px-4 border-r-2 border-r-dvrpc-blue-4">
            DVRPC Products
          </a>

          <a className="px-4 border-r-2 border-r-dvrpc-blue-4">Data Center</a>

          <a className="px-4">Long-Range Plan</a> */}
          <div className="text-dvrpc-blue-3 bg-white w-8 h-8 rounded-2xl flex justify-center items-center text-base">
            <Search />
          </div>
        </div>
      </div>
    </header>
  );
}
