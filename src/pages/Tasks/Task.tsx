'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTaskStore } from '../../store/useTasksStore';
import { SendHorizontal } from 'lucide-react';
import {
  RolesEnum,
  TaskEvents,
  TaskStatus,
  TaskStatusColors,
} from '../../common/enums';
import dayjs from 'dayjs';

const Task = () => {
  const { taskId } = useParams();
  const { user, authenticatedUserRoleId } = useLoginStore();
  const { task, fetchTaskByTaskId, performTaskAction } = useTaskStore();
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

    const payload = {
      action: {
        eventType: TaskEvents.COMMENT,
        details: {
          from: user?.name,
          userId: user?.userId,
          text: taskComment,
        },
      },
    };

    performTaskAction(task.taskId!, task.projectId!, payload);
    setTaskComment('');
  };
  const handleStatusChange = (value: string) => {
    const payload = {
      status: value,
      action: {
        eventType: TaskEvents.STATUS_CHANGE,
        details: {
          from: task.status,
          userId: user?.userId,
          to: value,
        },
      },
    };

    performTaskAction(task.taskId!, task.projectId!, payload);
  };

  const handleDescriptionSave = (value: string) => {
    performTaskAction(task.taskId!, task.projectId!, {
      description: value,
    });
  };
  const handleTitleSave = (value: string) => {
    performTaskAction(task.taskId!, task.projectId!, {
      drawingTitle: value,
    });
  };
  return (
    <div className="w-full font-sans md:grid md:grid-cols-5 grow my-3 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="p-3 md:col-span-3">
        <div className="flex flex-col gap-3">
          <ConvertEditable
            data={task?.drawingTitle}
            element={
              <span className="text-black dark:text-white text-xl font-medium">
                {task?.drawingTitle}
              </span>
            }
            onSave={handleTitleSave}
          />
          <span className="text-sm">Description:</span>
          <div className="w-full p-5 rounded bg-slate-400/10">
            <ConvertEditable
              data={task?.description}
              element={
                <pre className="font-sans text-slate-600 w-full text-pretty dark:text-slate-400 text-xs md:text-base break-words whitespace-break-spaces overflow-auto">
                  {task?.description}
                </pre>
              }
              onSave={handleDescriptionSave}
            />
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
          <TaskStatusHistory history={task.history ?? []} />
        </div>
      </div>
      <div className="p-3 md:col-span-2 border-l border-slate-200 dark:border-slate-700">
        <div className="flex flex-col gap-3">
          <Select
            value={taskStatus}
            onValueChange={(value: string) => {
              const isSelectOptionCompletedDisabled =
                [RolesEnum.ARCHITECT, RolesEnum.DRAUGHTSMAN].includes(
                  authenticatedUserRoleId as RolesEnum,
                ) && value == 'COMPLETED';

              const isSelectOptionsDisabled =
                [RolesEnum.ARCHITECT, RolesEnum.DRAUGHTSMAN].includes(
                  authenticatedUserRoleId as RolesEnum,
                ) &&
                TaskStatus[task.status as keyof typeof TaskStatus] ===
                  TaskStatus.COMPLETED;

              if (isSelectOptionsDisabled) {
                toast.error(
                  `You don't have permission to change task's status once it is marked '${TaskStatus.COMPLETED}'`,
                  {
                    position: 'top-center',
                    duration: 3000,
                    className: 'bg-red-200 text-red-600 text-sm font-sans',
                  },
                );
                return;
              } else if (isSelectOptionCompletedDisabled) {
                toast.error(
                  `You don't have permission to mark task '${TaskStatus.COMPLETED}'`,
                  {
                    position: 'top-center',
                    duration: 3000,
                    className: 'bg-red-200 text-red-600 text-sm font-sans',
                  },
                );
                return;
              }

              setTaskStatus(value as keyof typeof TaskStatus);
              value !== task.status && handleStatusChange(value);
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
                {Object.entries(TaskStatus).flatMap(([key, status]) => (
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
import TaskStatusHistory from './TaskStatusHistory';
import { useLoginStore } from '../../store/useLoginStore';
import { ConvertEditable } from '../../my-components/ConvertEditable';
import toast from 'react-hot-toast';

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
