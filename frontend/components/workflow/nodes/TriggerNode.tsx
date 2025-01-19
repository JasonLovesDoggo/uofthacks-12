import { Ellipsis, Link2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Handle, Position } from "reactflow";

import { cn } from "@/lib/utils";

export const TriggerNode = ({ selected }: { selected?: boolean }) => {
  const { data: sessionData } = useSession();

  if (!sessionData?.user) {
    return null;
  }

  return (
    <div
      className={cn(
        "group w-full min-w-[300px] overflow-hidden rounded-sm border border-transparent bg-white shadow-lg transition-all hover:border-blue-600",
        {
          "border-blue-600": selected,
        },
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-500 px-4 py-2">
        <span className="font-medium text-white">Email</span>
        <button className="rounded-full p-1 text-white hover:bg-white/10">
          <Ellipsis className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Link2 className="h-4 w-4" />
          <span>
            Connected to{" "}
            {sessionData.user.email || (
              <span className="font-bold text-gray-400">[EMAIL NOT SET]</span>
            )}
          </span>
        </div>

        <div className="rounded-sm bg-gray-100 p-2.5 text-sm text-gray-500">
          <p>This event is triggered when a new email arrives.</p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2 !bg-blue-300 group-hover:!bg-blue-600"
      />
    </div>
  );
};
