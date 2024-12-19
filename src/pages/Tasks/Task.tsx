'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskStore } from '../../store/useTasksStore';
import { SendHorizontal } from 'lucide-react';
import { TaskStatus, TaskStatusColors } from '../../common/enums';
import dayjs from 'dayjs';

interface HistoryEvent {
  id: number;
  eventType: string;
  details: {
    from: string;
    to?: string;
    text?: string;
  };
  createdAt: string;
}

const historyT: HistoryEvent[] = [
  {
    id: 1,
    eventType: 'STATUS_CHANGE',
    details: {
      from: 'PENDING',
      to: 'IN_PROGRESS',
    },
    createdAt: '2024-12-14T16:20:10.230Z',
  },
  {
    id: 2,
    eventType: 'COMMENT',
    details: {
      from: 'Sidhesh Parab',
      text: 'Hii this is a comment',
    },
    createdAt: '2024-12-14T16:20:10.230Z',
  },
  {
    id: 3,
    eventType: 'STATUS_CHANGE',
    details: {
      from: 'IN_PROGRESS',
      to: 'DONE',
    },
    createdAt: '2024-12-15T16:20:10.230Z',
  },
  {
    id: 4,
    eventType: 'STATUS_CHANGE',
    details: {
      from: 'DONE',
      to: 'IN_REVIEW',
    },
    createdAt: '2024-12-16T16:20:10.230Z',
  },
  {
    id: 5,
    eventType: 'COMMENT',
    details: {
      from: 'Pranay Nar',
      text: 'Facing issues for doing this task as this is dependedent on task - 703',
    },
    createdAt: '2024-12-15T16:20:10.230Z',
  },
  {
    id: 6,
    eventType: 'COMMENT',
    details: {
      from: 'Pratik H',
      text: 'I will finish the task 703 first tommorrow 2nd half, then we can proceeds with this task',
    },
    createdAt: '2024-12-16T16:20:10.230Z',
  },
];
const Task = () => {
  const { taskId } = useParams();

  const { task, fetchTaskByTaskId } = useTaskStore();
  const [taskComment, setTaskComment] = useState<string>('');

  const [taskStatus, setTaskStatus] = useState<keyof typeof TaskStatus>(
    task?.status as keyof typeof TaskStatus,
  );

  useEffect(() => {
    if (taskId) {
      fetchTaskByTaskId(taskId);
    }
    return () => {};
  }, [taskId]);

  useEffect(() => {
    if (task?.status) {
      setTaskStatus(task.status as keyof typeof TaskStatus);
    }
  }, [task?.status]);

  if (!task) {
    return <div>Loading...</div>;
  }

  const handleComment = () => {
    console.log('taskComment', taskComment);
    setTaskComment('');
  };

  return (
    <div className="w-full md:grid md:grid-cols-5 grow my-3 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="p-3 md:col-span-3">
        <div className="flex flex-col gap-3">
          <span className="text-black dark:text-white text-xl font-medium">
            {task?.drawingTitle}
          </span>
          <span className="text-sm">Description:</span>
          <div className="w-full p-5 rounded bg-slate-400/10">
            <pre className="font-sans text-slate-600 w-full text-pretty dark:text-slate-400 text-base break-words whitespace-break-spaces overflow-auto">
              {task?.description}
            </pre>
          </div>
        </div>
        <div className="mt-2">
          <span className="text-sm">Comments</span>
          <div className="flex gap-2 items-center">
            <input
              value={taskComment}
              onChange={(e) => {
                if (e?.target?.value) setTaskComment(e.target.value!);
              }}
              className="w-full px-3 py-2 rounded bg-slate-400/10 placeholder:text-sm"
              placeholder="Add a comment..."
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
              onClick={handleComment}
            >
              <SendHorizontal className="text-white" />
            </button>
          </div>
          <TaskStatusHistory history={historyT} />
        </div>
      </div>
      <div className="p-3 md:col-span-2 border-l border-slate-200 dark:border-slate-700">
        <div className="flex flex-col gap-3">
          <Select
            value={taskStatus}
            onValueChange={(value: string) => {
              setTaskStatus(value as keyof typeof TaskStatus);
            }}
          >
            <SelectTrigger
              className={`w-[180px] text-base font-medium focus:ring-0 border-0 ${TaskStatusColors[
                taskStatus as keyof typeof TaskStatus
              ]?.bg} ${TaskStatusColors[taskStatus as keyof typeof TaskStatus]
                ?.text}`}
            >
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="border-0 bg-white dark:bg-slate-900 shadow-2xl">
              <SelectGroup className="">
                <SelectLabel>Status</SelectLabel>
                {Object.entries(TaskStatus).map(([key, status]) => (
                  <SelectItem
                    className="hover:bg-slate-200 rounded cursor-pointer focus:bg-slate-200"
                    key={key}
                    value={key}
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <TaskMetaInformation task={task} />
          <div className="border border-slate-300 dark:border-none dark:bg-slate-800 rounded-md p-3 flex flex-col gap-3 text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Created {dayjs(task?.createdAt).format('DD MMM YYYY')} at{' '}
              {dayjs(task?.createdAt).format('hh:mm a')}
            </span>

            <span className="text-slate-500 dark:text-slate-400">
              Updated {dayjs(task?.updatedAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../my-components/Accordian';
import { Task as TaskType } from '../../types/useTasksStore.types';
import {
  ProjectCategory,
  ProjectCategoryColors,
  TaskPriority,
  TaskPriorityColors,
} from '../../common/enums';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../my-components/Select';
import TaskStatusHistory from '../../my-components/TaskStatusHistory';

export const TaskMetaInformation = ({ task }: { task: TaskType }) => {
  return (
    <Accordion
      type="single"
      defaultValue="item-1"
      collapsible
      className="w-full"
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="border hover:no-underline border-slate-300 dark:border-slate-700 rounded-t-md dark:bg-slate-800 px-3 py-3">
          Details
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-3 gap-5 p-3 border border-slate-300 border-t-0 dark:border-slate-700 rounded-b-md">
          <span>Assignee</span>
          <span className="col-span-2">{task?.assignedTo?.name}</span>
          <span>Priority</span>

          <div className="col-span-2">
            <span
              className={`px-4 py-1 text-xs rounded-xl font-medium ${TaskPriorityColors[
                task?.priority as keyof typeof TaskPriority
              ]?.bg} ${TaskPriorityColors[
                task?.priority as keyof typeof TaskPriority
              ]?.text}`}
            >
              {TaskPriority[task?.priority as keyof typeof TaskPriority]}
            </span>
          </div>

          <span>Project</span>
          <div className="col-span-2 flex gap-2">
            <span className="font-semibold">{task?.project?.name}</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-xl ${ProjectCategoryColors[
                task?.project?.category as keyof typeof ProjectCategory
              ]?.bg} ${ProjectCategoryColors[
                task?.project?.category as keyof typeof ProjectCategory
              ]?.text}`}
            >
              {
                ProjectCategory[
                  task?.project?.category as keyof typeof ProjectCategory
                ]
              }
            </span>
          </div>

          <span>Reporter</span>
          <span className="col-span-2">{task?.createdBy?.name}</span>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
