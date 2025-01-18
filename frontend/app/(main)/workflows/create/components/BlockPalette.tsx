"use client";

import React from "react";

interface BlockPaletteItemProps {
  type: string;
  icon: string;
  label: string;
  color: string;
}

const BlockPaletteItem = ({
  type,
  icon,
  label,
  color,
}: BlockPaletteItemProps) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`cursor-pointer rounded-lg p-3 hover:bg-${color}-200 ${`bg-${color}-100`}`}
      draggable
      onDragStart={(event) => onDragStart(event)}
    >
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
    </div>
  );
};

interface BlockPaletteProps {
  onDragStart?: (event: React.DragEvent, nodeType: string) => void;
}

export const BlockPalette = ({ onDragStart }: BlockPaletteProps) => (
  <div className="w-64 border-r bg-gray-50 p-4">
    <h2 className="mb-4 text-lg font-semibold">Block Palette</h2>
    <div className="space-y-2">
      <BlockPaletteItem
        type="trigger"
        icon="⚡"
        label="Triggers"
        color="blue"
      />
      <BlockPaletteItem
        type="condition"
        icon="🔗"
        label="Conditions"
        color="green"
      />
      <BlockPaletteItem type="action" icon="⚙️" label="Actions" color="red" />
    </div>
  </div>
);
