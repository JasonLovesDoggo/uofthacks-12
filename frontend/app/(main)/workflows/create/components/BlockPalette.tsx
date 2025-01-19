"use client";

import BlockPaletteItem from "./BlockPaletteItem";

interface BlockPaletteProps {
  onDragStart?: (event: React.DragEvent, nodeType: string) => void;
}

export const BlockPalette = ({ onDragStart }: BlockPaletteProps) => (
  <aside className="w-[360px] border-r bg-gray-100 p-6">
    <h2 className="mb-2 text-xl font-semibold">Block Palette</h2>
    <p className="text-sm text-gray-500">
      <span className="font-semibold text-black">Drag and drop</span> a block to
      the workspace to add it to your workflow.
    </p>

    <hr className="mb-6 mt-4" />

    <div className="space-y-6">
      <BlockPaletteItem
        type="trigger"
        label="Email"
        description="When a new email arrives"
        color="blue"
      />
      <BlockPaletteItem
        type="condition"
        label="Condition"
        description="Add logic to your workflow"
        color="green"
      />
      <BlockPaletteItem
        type="action"
        label="Action"
        description="Perform an action"
        color="red"
      />
    </div>
  </aside>
);
