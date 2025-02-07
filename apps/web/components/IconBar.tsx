import { Tool } from "../lib/types";
import { IconButton } from "./IconButton";
import { Circle, MousePointer, Pencil, RectangleHorizontalIcon } from "lucide-react";

interface Props {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}

export const IconBar = ({ selectedTool, setSelectedTool }: Props) => {
  return (
    <div className="w-full lg:max-w-6xl max-md:w-md max-sm:w-sm mx-auto flex justify-center gap-8 bg-black border border-gray-600 rounded-lg shadow-lg p-2 fixed top-4 z-50">
        <IconButton
          icon={<Pencil />}
          onClick={() => {
            setSelectedTool(Tool.pencil);
          }}
          activated={selectedTool === Tool.pencil}
        />
        <IconButton
          icon={<RectangleHorizontalIcon />}
          onClick={() => {
            setSelectedTool(Tool.rectangle);
          }}
          activated={selectedTool === Tool.rectangle}
        />
        <IconButton
          icon={<Circle />}
          onClick={() => {
            setSelectedTool(Tool.circle);
          }}
          activated={selectedTool === Tool.circle}
        />
          <IconButton
          icon={<MousePointer />}
          onClick={() => {
            setSelectedTool(Tool.pointer);
          }}
          activated={selectedTool === Tool.pointer}
        />
      </div>
  );
};
