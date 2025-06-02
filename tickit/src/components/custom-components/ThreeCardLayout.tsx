import React, { useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

//Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Column from "./Column";

//Types
import type { ColumnId } from "../../types/ColumnIdType";
import type { Task } from "../../types/TaskType";

//Mock data for now
import { initialData } from "./constants";

const ThreeCardLayout: React.FC = () => {
  const [columns, setColumns] = useState(initialData);

  const handleDropTask = useCallback((task: Task, targetColumnId: ColumnId) => {
    setColumns((prev) => {
      const newCols = { ...prev };
      for (const colId in newCols) {
        newCols[colId as ColumnId] = newCols[colId as ColumnId].filter((t) => t.id !== task.id);
      }
      newCols[targetColumnId] = [...newCols[targetColumnId], task];
      return newCols;
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 overflow-x-auto">
        <Card className="w-full max-w-6xl h-[80vh] flex flex-col">
          <CardHeader>
            <CardTitle>Kanban Board</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6 flex-1 overflow-auto">
            <Column id="todo" title="To-do" tasks={columns.todo} onDropTask={handleDropTask} />
            <Column id="inprogress" title="In-progress" tasks={columns.inprogress} onDropTask={handleDropTask} />
            <Column id="done" title="Done" tasks={columns.done} onDropTask={handleDropTask} />
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
};

export default ThreeCardLayout;
