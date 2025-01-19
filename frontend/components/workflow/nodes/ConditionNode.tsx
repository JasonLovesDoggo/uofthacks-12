import { useCallback } from "react";
import { Ellipsis } from "lucide-react";
import { Handle, Position } from "reactflow";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NodeData {
  label: string;
  field?: string;
  operator?: string;
  value: string;
}

export const ConditionNode = ({
  data,
  selected,
  id,
}: {
  data: NodeData;
  selected?: boolean;
  id: string;
}) => {
  const updateNodeData = useCallback(
    (newData: Partial<NodeData>) => {
      const updateEvent = {
        type: "updateNodeData",
        id,
        data: newData,
      };
      // Dispatch a custom event that useFlowManagement will listen to
      window.dispatchEvent(
        new CustomEvent("nodeDataUpdate", { detail: updateEvent }),
      );
    },
    [id],
  );

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-sm border border-transparent bg-white shadow-lg transition-all hover:border-blue-600",
        {
          "border-blue-600": selected,
        },
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-green-500 px-4 py-2">
        <span className="font-medium text-white">Condition</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 rounded-full text-white hover:bg-white/10"
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-3 gap-4">
          <Select onValueChange={(value) => updateNodeData({ field: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="location">📍 Location</SelectItem>
              <SelectItem value="time">⏰ Time</SelectItem>
              <SelectItem value="amount">💲 Amount</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => updateNodeData({ operator: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">Equals</SelectItem>
              <SelectItem value="contains">Contains</SelectItem>
              <SelectItem value="greater">Greater than</SelectItem>
              <SelectItem value="less">Less than</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Value"
            onChange={(e) => {
              const value = e.target.value;
              updateNodeData({ value: value || "" });
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.stopPropagation();
              }
            }}
            value={data.value}
          />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!size-2 !bg-green-300 group-hover:!bg-green-600"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2 !bg-green-300 group-hover:!bg-green-600"
      />
    </div>
  );
};
