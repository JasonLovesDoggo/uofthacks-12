import { Ellipsis, Link2 } from "lucide-react";
import { Handle, Position } from "reactflow";

interface NodeData {
  label: string;
  email?: string;
}

export const TriggerNode = ({
  data,
  selected,
}: {
  data: NodeData;
  selected?: boolean;
}) => (
  <div
    className={`min-w-[300px] overflow-hidden rounded-sm bg-white shadow-lg transition-all ${selected ? "ring-2 ring-blue-500" : ""}`}
  >
    {/* Header */}
    <div className="flex items-center justify-between bg-blue-500 px-4 py-2">
      <span className="font-medium text-white">Email</span>
      <button className="rounded-full p-1 text-white hover:bg-white/10">
        <Ellipsis className="h-4 w-4" />
      </button>
    </div>

    {/* Content */}
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-600">
        <Link2 className="h-4 w-4" />
        <span>
          Connected to{" "}
          {data.email || (
            <span className="font-bold text-gray-400">[EMAIL NOT SET]</span>
          )}
        </span>
      </div>
    </div>

    <Handle
      type="source"
      position={Position.Bottom}
      className="!-bottom-2 !h-2 !w-2 !bg-blue-500"
    />
  </div>
);
