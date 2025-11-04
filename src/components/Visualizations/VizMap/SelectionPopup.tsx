import IconButton from "@/components/Buttons/IconButton";
import { GeoJSONProperties } from "@/types/types";
import { MapPin, Minus, TableIcon, X } from "lucide-react";
import { useState } from "react";

interface Props {
  properties: GeoJSONProperties;
  handleClose: () => void;
  handleFlyTo: () => void;
}

export default function SelectionPopup(props: Props) {
  const [isMinimized, setIsMinimized] = useState(false);
  const { properties, handleClose, handleFlyTo } = props;

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const getInnerContent = () => {
    if (isMinimized) {
      return (
        <IconButton
          icon={<TableIcon width={24} />}
          description="Open table"
          handleClick={handleMinimize}
        />
      );
    } else {
      return (
        <div className="max-w-70 p-2">
          <div className="flex justify-between mb-1">
            <div className="flex gap-2">
              <IconButton
                icon={<MapPin width={16} />}
                description="Zoom to feature"
                handleClick={handleFlyTo}
              />
              {/* <IconButton
                icon={<PinOff width={16} />}
                description="Unpin table"
                handleClick={() => {}}
              /> */}
            </div>
            <div className="flex gap-2">
              <IconButton
                icon={<Minus width={16} />}
                description="Minimize table"
                handleClick={handleMinimize}
              />
              <IconButton
                icon={<X width={16} />}
                description="Close table and unselect feature"
                handleClick={handleClose}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto border-t-3 border-[#0000000d]">
            <table className="w-full table-fixed">
              <tbody>
                {Object.entries(properties).map(([key, value]) => {
                  return (
                    <tr key={key} className="even:bg-[#f2f2f2] odd:bg-white">
                      <td className="border-r-3 border-[#0000000d] py-1.5 px-2">
                        {key}
                      </td>
                      <td className=" py-1.5 px-2">{value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };
  return (
    <div className="absolute left-2 top-2 z-10 bg-white shadow rounded-md">
      {getInnerContent()}
    </div>
  );
}
