import { REMAINING_VIEWPORT_HEIGHT_PROPERTY } from "@/consts";

export default function FadeMask() {
  return (
    <div
      className={`absolute left-1/3 ${REMAINING_VIEWPORT_HEIGHT_PROPERTY} w-1/3 bg-l bg-gradient-to-r from-white to-transparent% z-5`}
    ></div>
  );
}
