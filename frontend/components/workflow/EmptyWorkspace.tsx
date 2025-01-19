import Image from "next/image";

export const EmptyWorkspace = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <h3 className="font-montserrat text-xl font-semibold text-gray-500">
        Add a block to get started.
      </h3>
      <p className="mb-4 font-semibold text-gray-400">Drag and drop!🎉</p>
      <Image
        src="/empty-workspace.svg"
        alt="Empty workspace"
        width={1}
        height={1}
        className="w-60"
      />
    </div>
  );
};
