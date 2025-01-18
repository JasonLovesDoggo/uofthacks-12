import { Ellipsis } from "lucide-react";
import { Handle, Position } from "reactflow";

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
  fields?: string[];
}

export const ConditionNode = ({
  data,
  selected,
}: {
  data: NodeData;
  selected?: boolean;
}) => (
  <div
    className={`overflow-hidden rounded-sm bg-white shadow-lg transition-all ${selected ? "ring-2 ring-red-500" : ""}`}
  >
    {/* Header */}
    <div className="flex items-center justify-between bg-lime-600 px-4 py-2">
      <span className="font-medium text-white">Condition</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full text-white hover:bg-white/10"
      >
        <Ellipsis className="h-4 w-4" />
      </Button>
    </div>

    {/* Content */}
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Field" />
          </SelectTrigger>
          <SelectContent>
            {data.fields?.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="greater">Greater than</SelectItem>
            <SelectItem value="less">Less than</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Value" />
      </div>
    </div>

    <Handle
      type="target"
      position={Position.Top}
      className="!-top-2 !h-2 !w-2 !bg-red-500"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      className="!-bottom-2 !h-2 !w-2 !bg-red-500"
    />
  </div>
);
