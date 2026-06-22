import type { DoorItem } from "../types/project";

const finishColors: Record<string, string> = {
  ral: "#f4f1ea",
  veneer: "#b88455",
  hpl: "#87817a",
  mirror: "#c6b9a4",
  lacobel: "#ddd4c7",
  primer: "#ece8df"
};

export function DoorVisual({ item }: { item: DoorItem }) {
  const width = item.width === "custom" ? item.customWidth || "інд." : item.width;
  const height = item.height === "custom" ? item.customHeight || "інд." : item.height;
  const handleRight = item.opening === "left" || item.opening === "outside";
  const arcPath =
    item.opening === "left" || item.opening === "inside" ? "M 64 152 A 88 88 0 0 1 152 64" : "M 152 152 A 88 88 0 0 0 64 64";

  return (
    <div className="rounded-md border border-line bg-paper p-4">
      <svg viewBox="0 0 220 250" className="mx-auto h-56 w-full max-w-[240px]" role="img" aria-label="Схема дверей">
        <rect x="54" y="34" width="112" height="170" rx="2" fill="#ffffff" stroke="#d8d0c4" strokeWidth="5" />
        <rect x="65" y="45" width="90" height="148" rx="2" fill={finishColors[item.finish]} stroke="#252525" strokeWidth="1.5" />
        <circle cx={handleRight ? 140 : 80} cy="122" r="4" fill="#171717" />
        <path d={arcPath} fill="none" stroke="#b48a4a" strokeWidth="2" strokeDasharray="4 4" />
        <path d={handleRight ? "M 67 61 L 78 60 L 71 69" : "M 151 61 L 140 60 L 147 69"} fill="none" stroke="#b48a4a" strokeWidth="2" />
        <text x="110" y="226" textAnchor="middle" fontSize="13" fill="#6f6a60">
          {width} x {height} мм
        </text>
      </svg>
    </div>
  );
}
