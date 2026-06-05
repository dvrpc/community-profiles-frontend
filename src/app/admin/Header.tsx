import { useSession } from "next-auth/react";
import { Mode, TreeLevel } from "./Dashboard";
import { signOut } from "next-auth/react";
import Button from "@/components/Buttons/Button";

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
        className={`inline-block ${
          currentTab == "content"
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
        className={`inline-block ${
          currentTab == "viz" ? highlightTab : "border-b-2 border-transparent"
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
        className={`inline-block ${
          currentTab == "properties"
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
        className={`inline-block ${
          currentTab == "sources"
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
        className={`inline-block ${
          currentTab == "variables"
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
        className={`inline-block ${
          currentTab == "sql" ? highlightTab : "border-b-2 border-transparent"
        } p-4 rounded-t-lg hover:text-gray-600 hover:border-dvrpc-gray-6`}
      >
        SQL Editor
      </a>
    </li>
  );

  if (!session) return <></>;
  return (
    <>
      <div className="text-sm font-medium text-center text-dvrpc-gray-2 pt-4">
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

      <div className="flex items-center gap-2 pr-4">
        <Button handleClick={() => signOut()} type="primary">
          Refresh Session
        </Button>

        <img
          src={session.user.image}
          alt="User Avatar"
          className="h-12 w-12 rounded-full align-middle justify-center"
        />
        <h2>{session.user.name}</h2>
      </div>
    </>
  );
}
