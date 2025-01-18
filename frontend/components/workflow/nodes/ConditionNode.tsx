import { Handle, Position } from "reactflow";

interface NodeData {
  label: string;
}

export const ConditionNode = ({
  data,
  selected,
}: {
  data: NodeData;
  selected?: boolean;
}) => (
  <div
    className={`rounded-lg bg-green-100 p-3 shadow transition-all ${selected ? "shadow-lg ring-2 ring-green-500" : ""}`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="!-top-2 !h-2 !w-2 !bg-green-500"
    />
    <div className="flex items-center gap-2">
      <span>🔗</span>
      <span>{data.label}</span>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="!-bottom-2 !h-2 !w-2 !bg-green-500"
    />
  </div>
);
