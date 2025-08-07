import Image from "next/image";
import { Search } from "lucide-react";

export default function Header() {
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
          <a className="px-4 border-r-2 border-r-dvrpc-blue-4">
            DVRPC Products
          </a>

          <a className="px-4 border-r-2 border-r-dvrpc-blue-4">Data Center</a>

          <a className="px-4">Long-Range Plan</a>
          <div className="text-dvrpc-blue-3 bg-white w-8 h-8 rounded-2xl flex justify-center items-center text-base">
            <Search />
          </div>
        </div>
      </div>
    </header>
  );
}
