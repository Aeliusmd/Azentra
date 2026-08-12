"use client";

import { TaskCard } from "@/components/tech/preventive/task-card";
import { TODAY } from "@/lib/tech/dashboard-data";
import {
  completeTask,
  startTask,
  usePreventiveTasks,
} from "@/lib/tech/preventive-store";
import { showToast } from "@/lib/tech/toast-store";

export function PreventiveView() {
  const tasks = usePreventiveTasks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Preventive Maintenance</h1>
        <p className="mt-1 text-[13px] text-muted">
          Scheduled maintenance tasks and checklists
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStart={() => {
              startTask(task.id);
              showToast(`Task ${task.id} started`);
            }}
            onComplete={() => {
              completeTask(task.id, TODAY);
              showToast(`Task ${task.id} completed`);
            }}
          />
        ))}
      </div>
    </div>
  );
}
