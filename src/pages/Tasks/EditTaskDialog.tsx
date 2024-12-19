import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../my-components/Modal';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useTaskStore } from '../../store/useTasksStore';
import { TaskPriority, TaskStatus } from '../../common/enums';
import { useProjectStore } from '../../store/useProjectStore';
import {
  darkModeStyles,
  lightModeStyles,
} from '../../common/react-select.styles';
import AsyncSelect from 'react-select/async';
import { useCommonStore } from '../../store/useCommonStore';
import { useTeamStore } from '../../store/useTeamStore';
import { Task, TaskQuery } from '../../types/useTasksStore.types';

const validationSchema = yup.object().shape({
  title: yup.string().required('title is required'),
  drawingTitle: yup.string(),
  description: yup.string().required('Description is required'),
  projectId: yup.string().required('Project is required'),
  priority: yup
    .mixed()
    .oneOf(Object.keys(TaskPriority))
    .required('Priority is required'),
  status: yup
    .mixed()
    .oneOf(Object.keys(TaskStatus))
    .required('Status is required'),
  dueTime: yup
    .number()
    .typeError('Due time should in seconds')
    .positive()
    .required('Due Time is required'),
  assignedToId: yup
    .object()
    .typeError('Assignee is required')
    .required('Assignee is required'),
});

type Props = {
  query: TaskQuery;
  skip: number;
  limit: number;
  isEditModalOpen: boolean;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task | undefined;
};

const EditTaskDialog = ({
  limit,
  query,
  skip,
  isEditModalOpen,
  setIsEditModalOpen,
  task,
}: Props) => {
  const { isDarkMode } = useCommonStore();
  const { editTask, fetchTasks } = useTaskStore();
  const { fetchMembers } = useTeamStore();
  const { fetchProjects, projects } = useProjectStore();
  const {
    setValue,
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  const onSubmit = async (data: any) => {
    let payload = {
      ...data,
    };
    console.log(
      '88888888888888888 data.assignedToId.value',
      data.assignedToId.value,
    );
    payload.assignedToId = data.assignedToId.value;
    const { projectId, ...rest } = payload;
    console.log('🚀 ~ onSubmit ~ rest:', rest);

    if (task?.taskId) {
      console.log('🚀 ~ onSubmit ~ task:', task);

      const updatedFields = Object.keys(payload).reduce((acc, key) => {
        if (payload[key] !== task[key as keyof Task]) {
          acc[key] = payload[key];
        }
        return acc;
      }, {} as any);

      console.log('updatedFields --------------->>', updatedFields);
      const success = await editTask(task.taskId, projectId, rest);
      console.log('🚀 ~ onSubmit ~ success:', success);
      if (success) {
        reset();
        setIsEditModalOpen(false);

        query.skip = skip;
        query.limit = limit;
        fetchTasks(query);
      }
    }
  };

  useEffect(() => {
    if (isEditModalOpen) {
      reset();
      fetchProjects({
        paginate: false,
        select: ['projectId', 'name'],
      });
    }
  }, [isEditModalOpen]);

  const loadMembersOptions = async (inputValue: string = '') => {
    const query: any = {
      paginate: false,
      relation: true,
    };
    if (inputValue) query['name'] = inputValue;
    const data = await fetchMembers(query);
    const formattedOptions = data.data.map((option) => {
      const role = option['userRole']?.at(0)?.role?.name ?? '';
      return {
        value: option.userId,
        label: `${option.name}${role ? ` (${role})` : ''}`,
      };
    });

    if (task)
      setValue(
        'assignedToId',
        formattedOptions.filter((f) => f.value == task.assignedToId).at(0)!,
      );
    //
    return formattedOptions;
  };

  useEffect(() => {
    if (task && isEditModalOpen) {
      const {
        projectId,
        status,
        priority,
        description,
        drawingTitle,
        dueTime,
        title,
      } = task;
      setValue('title', title);
      setValue('description', description);
      setValue('priority', priority);
      setValue('dueTime', dueTime);
      setValue('drawingTitle', drawingTitle);
      setValue('projectId', projectId);
      setValue('status', status);
    }
  }, [task, isEditModalOpen]);

  return (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className="w-[95%] md:w-1/2 h-fit bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription className="text-xs">
            edit your task and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Task Title:</label>
            <input
              className="px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('title')}
              placeholder="Enter title"
            />
            <p className="text-red-500 text-[9px]">{errors?.title?.message}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Drawing Title:</label>
            <input
              className="px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('drawingTitle')}
              placeholder="Enter Drawing title"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.drawingTitle?.message}
            </p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Description:</label>
            <input
              className="px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('description')}
              placeholder="Enter description"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.description?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Project:</label>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                  defaultValue={projects?.data?.at(0)?.projectId}
                >
                  {projects?.data?.map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.projectId?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Assignee:</label>
            <Controller
              name="assignedToId"
              control={control}
              render={({ field }) => (
                <AsyncSelect
                  {...field}
                  defaultOptions
                  loadOptions={loadMembersOptions as any}
                  styles={isDarkMode ? darkModeStyles : lightModeStyles}
                  placeholder={
                    <span className="text-slate-500">Select members</span>
                  }
                  className="react-select-container"
                  classNamePrefix="react-select"
                  onChange={(selected) => field.onChange(selected)}
                />
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.assignedToId?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Status:</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                >
                  {Object.entries(TaskStatus).map(([key, status]) => (
                    <option key={key} value={key}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">{errors?.status?.message}</p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs">Priority:</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                >
                  {Object.entries(TaskPriority).map(([key, priority]) => (
                    <option key={key} value={key}>
                      {priority}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.priority?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-xs">Due Time:</label>
            <input
              className="px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('dueTime')}
              placeholder="Enter Due Time in hours (hr)"
            />
            <p className="text-red-500 text-[9px]">
              {errors?.dueTime?.message}
            </p>
          </div>

          <button
            type="submit"
            className="p-2 my-2 bg-primary hover:bg-primary/90 rounded-md text-white"
          >
            Save Task
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
