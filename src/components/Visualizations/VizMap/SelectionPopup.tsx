import IconButton from "@/components/Buttons/IconButton";
import { GeoJSONProperties } from "@/types";
import { MapPin, Minus, PinOff, TableIcon, X } from "lucide-react";
import { useState } from "react";

interface Props {
  properties: GeoJSONProperties;
  handleClose: () => void;
}

export default function SelectionPopup(props: Props) {
  const [isMinimized, setIsMinimized] = useState(false);
  const { properties, handleClose } = props;

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const getInnerContent = () => {
    if (isMinimized) {
      return <TableIcon />;
    } else {
      return (
        <div className="max-w-70">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <IconButton
                icon={<MapPin width={16} />}
                description="Zoom to feature"
                handleClick={() => {}}
              />
              <IconButton
                icon={<PinOff width={16} />}
                description="Unpin table"
                handleClick={() => {}}
              />
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
          <div className="max-h-60 overflow-auto">
            <table>
              <tbody>
                {Object.entries(properties).map(([key, value]) => {
                  return (
                    <tr className="even:bg-dvrpc-gray-7 odd:bg-white">
                      <td>{key}</td>
                      <td>{value}</td>
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
    <div className="absolute left-2 top-2 z-10 p-4 bg-white shadow">
      {getInnerContent()}
    </div>
  );
}
