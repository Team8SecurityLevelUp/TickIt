import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface TaskCardProps {
  title: string;
  description: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, description }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Make the entire card clickable */}
        <Card className="mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <h4 className="font-medium text-base">{title}</h4>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {/* Add a close button or any additional dialog content here */}
        <DialogClose className="mt-4 btn">Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCard;
