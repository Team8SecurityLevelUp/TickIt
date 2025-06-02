import React, { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import type { Task } from "../../types/TaskType";
import { ItemTypes } from "./constants";
import TaskCard from "./TaskCard";

interface Props {
  task: Task;
}

const DraggableTaskCard: React.FC<Props> = ({ task }) => {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: task,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
  }, [drag]);

  return (
    <div ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <TaskCard title={task.title} description={task.description} />
    </div>
  );
};

export default DraggableTaskCard;
