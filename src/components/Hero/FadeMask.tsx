import { HOME_REMAINING_VIEWPORT_HEIGHT_PROPERTY, PROFILE_REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";

interface Props {
  viewPort: string;
}
export default function FadeMask(props: Props) {
  const { viewPort } = props
  return (
    <div
      className={`absolute left-1/3 ${viewPort} w-1/6 bg-l bg-gradient-to-r from-white to-transparent% z-5`}
    ></div>
  );
}
