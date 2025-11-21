import { useSession } from "next-auth/react";
import { Mode } from "./Dashboard";
import { signOut } from "next-auth/react";
import Button from "@/components/Buttons/Button";

interface Props {
  currentTab: Mode;
  setCurrentTab: (mode: Mode) => void;
}

const highlightTab =
  "text-dvrpc-blue-3 border-dvrpc-blue-3 border-b-2 border-dvrpc-blue-3";
export default function Header(props: Props) {
  const { currentTab, setCurrentTab } = props;
  const { data: session } = useSession();

  if (!session) return <></>;
  return (
    <>
      <div className="text-sm font-medium text-center text-dvrpc-gray-2 pt-4">
        <ul className="flex flex-wrap -mb-px">
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
          <li className="me-2">
            <a
              onClick={() => setCurrentTab("viz")}
              className={`inline-block ${currentTab == "viz"
                ? highlightTab
                : "border-b-2 border-transparent"
                } p-4 rounded-t-lg hover:text-gray-600 hover:border-dvrpc-gray-6`}
            >
              Visualizations
            </a>
          </li>

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
