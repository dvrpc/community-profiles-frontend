import HeroMap from "@/components/HeroMap/HeroMap";
import { HEADER_HEIGHT, NAV_HEIGHT } from "@/consts";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex">
      <div className="w-1/3 z-10 p-16">
        <h1 className="text-5xl text-dvrpc-blue-1 font-bold">
          Community Profiles
        </h1>
      </div>
      <div
        className={`absolute left-1/3 h-[calc(100vh-${
          HEADER_HEIGHT + NAV_HEIGHT
        }px)] w-1/3 bg-l bg-gradient-to-r from-white to-transparent% z-5`}
      ></div>
      <HeroMap />
    </div>
  );
}
