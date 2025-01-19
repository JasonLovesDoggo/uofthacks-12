import { useState } from "react";

export const useWorkflowTitle = (initialTitle: string = "New Workflow") => {
  const [workflowTitle, setWorkflowTitle] = useState(initialTitle);

  const handleTitleUpdate = (newTitle: string) => {
    setWorkflowTitle(newTitle);
  };

  return {
    workflowTitle,
    handleTitleUpdate,
  };
};
