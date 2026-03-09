import { FC } from "react";

interface StatusLegendItem {
  icon: string;
  label: string;
  description: string;
  colorClass: string;
}

const LEGEND_ITEMS: StatusLegendItem[] = [
  {
    icon: "🟡",
    label: "Yellow",
    description: "Pending, Collected",
    colorClass: "border-yellow-300 bg-yellow-50 text-yellow-800",
  },
  {
    icon: "🔵",
    label: "Blue",
    description: "In Lab",
    colorClass: "border-blue-300 bg-blue-50 text-blue-800",
  },
  {
    icon: "🟣",
    label: "Purple",
    description: "Processing",
    colorClass: "border-purple-300 bg-purple-50 text-purple-800",
  },
  {
    icon: "🟢",
    label: "Green",
    description: "Result Ready, Approved, Normal",
    colorClass: "border-green-300 bg-emerald-50 text-emerald-800",
  },
  {
    icon: "🔴",
    label: "Red",
    description: "Abnormal, High, Low",
    colorClass: "border-red-300 bg-red-50 text-red-800",
  },
];

export const PathologyStatusLegend: FC = () => {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {LEGEND_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm ${item.colorClass}`}
        >
          <span className="text-base leading-none">{item.icon}</span>
          <span className="font-semibold">{item.label}:</span>
          <span className="text-xs sm:text-sm opacity-90">{item.description}</span>
        </div>
      ))}
    </div>
  );
};

