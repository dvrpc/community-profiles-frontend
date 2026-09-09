import { useSession } from "next-auth/react";
import { Mode, TreeLevel } from "./Dashboard";
import Image from "next/image";

interface Props {
  currentTab: Mode;
  setCurrentTab: (mode: Mode) => void;
  treeLevel: TreeLevel;
}

const highlightTab =
  "text-dvrpc-blue-3 border-dvrpc-blue-3 border-b-2 border-dvrpc-blue-3";
export default function Header(props: Props) {
  const { currentTab, setCurrentTab, treeLevel } = props;
  const { data: session } = useSession();

  const contentTab = () => (
    <li className="me-2">
      <a
        onClick={() => setCurrentTab("content")}
        className={`inline-block ${currentTab == "content"
          ? highlightTab
          : "border-b-2 border-transparent"
          } p-4  rounded-t-lg hover:text-gray-600 hover:border-dvrpc-gray-6`}
      >
        Content
      </a>
    </li>
  );

  const vizTab = () => (
    <li className="me-2">
      <a
        onClick={() => setCurrentTab("viz")}
        className={`inline-block ${currentTab == "viz" ? highlightTab : "border-b-2 border-transparent"
          } p-4 rounded-t-lg hover:text-gray-600 hover:border-dvrpc-gray-6`}
      >
        Visualizations
      </a>
    </li>
  );

  const propertiesTab = () => (
    <li className="me-2">
      <a
        onClick={() => setCurrentTab("properties")}
        className={`inline-block ${currentTab == "properties"
          ? highlightTab
          : "border-b-2 border-transparent"
          } p-4 rounded-t-lg hover:text-gray-600 hover:border-dvrpc-gray-6`}
      >
        Properties
      </a>
    </li>
  );

  const sourceTab = () => (
    <li className="me-2">
      <a
        onClick={() => setCurrentTab("sources")}
        className={`inline-block ${currentTab == "sources"
          ? highlightTab
          : "border-b-2 border-transparent"
          } p-4 rounded-t-lg hover:text-gray-600 hover:border-dvrpc-gray-6`}
      >
        Source Editor
      </a>
    </li>
  );

  const variablesTab = () => (
    <li className="me-2">
      <a
        onClick={() => setCurrentTab("variables")}
        className={`inline-block ${currentTab == "variables"
          ? highlightTab
          : "border-b-2 border-transparent"
          } p-4 rounded-t-lg hover:text-gray-600 hover:border-dvrpc-gray-6`}
      >
        Variables
      </a>
    </li>
  );

  const sqlTab = () => (
    <li className="me-2">
      <a
        onClick={() => setCurrentTab("sql")}
        className={`inline-block ${currentTab == "sql" ? highlightTab : "border-b-2 border-transparent"
          } p-4 rounded-t-lg hover:text-gray-600 hover:border-dvrpc-gray-6`}
      >
        SQL Editor
      </a>
    </li>
  );

  if (!session) return <></>;
  return (
    <div className="flex w-full items-center gap-5">
      <a
        href="https://www.dvrpc.org/"
        target="_blank"
        rel="noreferrer"
        className="flex shrink-0 items-center border-r border-dvrpc-gray-6 pr-5"
        aria-label="Visit DVRPC"
      >
        <Image
          src="/dvrpc-mini.svg"
          alt="DVRPC"
          width={74}
          height={30}
          className="h-8 w-auto brightness-0"
        />
      </a>

      <div className="shrink-0 border-r border-dvrpc-gray-6 pr-5">
        <h1 className="text-lg font-semibold tracking-tight text-dvrpc-blue-1">
          Community Profiles
        </h1>
        <p className="mt-0.5 text-xs text-dvrpc-gray-3">Admin dashboard</p>
      </div>

      <div className="min-w-0 flex-1 self-stretch text-center text-sm font-medium text-dvrpc-gray-2">
        <ul className="flex flex-wrap -mb-px">
          {treeLevel != "subcategory" && contentTab()}
          {treeLevel == "topic" && vizTab()}
          {(treeLevel == "topic" || treeLevel == "subcategory") &&
            propertiesTab()}
          {sourceTab()}
          {variablesTab()}
          {sqlTab()}
        </ul>
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-lg bg-dvrpc-gray-7 px-3 py-2 text-sm">
        <img
          src={session.user.image}
          alt="User Avatar"
          className="h-9 w-9 rounded-full align-middle justify-center"
        />
        <h2 className="max-w-32 truncate font-medium text-dvrpc-gray-1">
          {session.user.name}
        </h2>
      </div>
    </div>
  );
}
