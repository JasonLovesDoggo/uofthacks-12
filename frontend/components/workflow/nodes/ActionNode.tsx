import { Handle, Position } from "reactflow";

interface NodeData {
  label: string;
}

export const ActionNode = ({
  data,
  selected,
}: {
  data: NodeData;
  selected?: boolean;
}) => (
  <div
    className={`rounded-lg bg-red-100 p-3 shadow transition-all ${selected ? "shadow-lg ring-2 ring-red-500" : ""}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="!-top-2 !h-2 !w-2 !bg-red-500"
    />
    <div className="flex items-center gap-2">
      <span>⚙️</span>
      <span>{data.label}</span>
    </div>
  </div>
);
