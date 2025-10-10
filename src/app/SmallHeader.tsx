import Image from "next/image";

export default function SmallHeader() {
    return (
        <div className="bg-dvrpc-blue-3 h-16 flex px-8 items-center gap-4 text-white ">
            <a href="https://www.dvrpc.org/" target="_blank">
                <Image
                    className="mt-3"
                    src="/dvrpc-mini.svg"
                    alt="DVRPC Logo"
                    height={124}
                    width={124}
                />
            </a>
            <h1 className="text-3xl font-bold border-l-3 pl-4">
                Community Profiles
            </h1>
        </div>
    )
}