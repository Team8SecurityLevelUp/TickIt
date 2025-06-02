import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task } from "../../types/TaskType";
import type { ColumnId } from "../../types/ColumnIdType";
import { ItemTypes } from "./constants";
import DraggableTaskCard from "./DraggableTaskCard";

interface Props {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onDropTask: (task: Task, columnId: ColumnId) => void;
}

const Column: React.FC<Props> = ({ id, title, tasks, onDropTask }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: Task) => {
      onDropTask(item, id);
    },
  });

  const dropRef = useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <Card ref={dropRef} className="w-full md:w-1/3 flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2 p-2 sm:p-4">
        {tasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  );
};

export default Column;
