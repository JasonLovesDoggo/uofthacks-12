import { Ellipsis } from "lucide-react";
import { Handle, Position } from "reactflow";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NodeData {
  label: string;
  actions?: string[];
}

export const ActionNode = ({
  data,
  selected,
}: {
  data: NodeData;
  selected?: boolean;
}) => (
  <div
    className={`w-full min-w-[300px] overflow-hidden rounded-sm bg-white shadow-lg transition-all ${selected ? "ring-2 ring-purple-500" : ""}`}
    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
  >
    {/* Header */}
    <div className="flex items-center justify-between bg-red-600 px-4 py-2">
      <span className="font-medium text-white">Action</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full text-white hover:bg-white/10"
      >
        <Ellipsis className="h-4 w-4" />
      </Button>
    </div>

    {/* Content */}
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Choose Action Type
        </label>
        <Select>
          <SelectTrigger className="w-full border-gray-200 hover:border-gray-300">
            <SelectValue placeholder="Select Action" />
          </SelectTrigger>
          <SelectContent>
            {data.actions?.map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <Handle
      type="target"
      position={Position.Top}
      className="!-top-2 !h-2 !w-2 !bg-purple-500"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!-bottom-2 !h-2 !w-2 !bg-purple-500"
    />
  </div>
);
