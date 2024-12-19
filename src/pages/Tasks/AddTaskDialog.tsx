import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../my-components/Modal';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CirclePlus } from 'lucide-react';
import SecondaryButton from '../../my-components/SecondaryButton';
import { useEffect, useState } from 'react';
import { useTaskStore } from '../../store/useTasksStore';
import {
  AccessMethods,
  AccessModules,
  TaskPriority,
  TaskStatus,
} from '../../common/enums';
import renderWithAccessControl from '../../common/access-control';
import { useProjectStore } from '../../store/useProjectStore';
import {
  darkModeStyles,
  lightModeStyles,
} from '../../common/react-select.styles';
import AsyncSelect from 'react-select/async';
import { useCommonStore } from '../../store/useCommonStore';
import { useTeamStore } from '../../store/useTeamStore';
import { TaskQuery } from '../../types/useTasksStore.types';
import { useLoginStore } from '../../store/useLoginStore';

const validationSchema = yup.object().shape({
  drawingTitle: yup.string().required('Title is required'),
  description: yup.string().max(1000, 'Maximum 1000 characters allowed'),
  projectId: yup.string().required('Project is required'),
  priority: yup
    .mixed()
    .oneOf(Object.keys(TaskPriority))
    .required('Priority is required'),
  assignedToId: yup
    .object()
    .typeError('Assignee is required')
    .required('Assignee is required'),
});

type Props = { query: TaskQuery; skip: number; limit: number };

const AddTaskDialog = ({ query, skip, limit }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDarkMode } = useCommonStore();
  const { addTask, fetchTasks } = useTaskStore();
  const { fetchMembers } = useTeamStore();
  const { fetchProjects, projects } = useProjectStore();
  const {
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
    data.status = TaskStatus.NEW.toUpperCase();
    data.assignedToId = data.assignedToId.value;

    const { projectId, ...rest } = data;

    const success = await addTask(projectId, rest);

    if (success) {
      reset();
      setIsModalOpen(false);

      query.skip = skip;
      query.limit = limit;
      fetchTasks(query);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      reset();
      fetchProjects({
        paginate: false,
        select: ['projectId', 'name'],
      });
    }
  }, [isModalOpen]);

  const { authenticatedUserRoleId, user } = useLoginStore();
  const loadMembersOptions = async (inputValue: string = '') => {
    const query: any = {
      paginate: false,
      relation: true,
      // select: ['userId', 'name', 'email'],
    };
    if (inputValue) query['name'] = inputValue;

    let formattedOptions;

    if (!['TEAM_LEAD', 'DIRECTOR'].includes(authenticatedUserRoleId)) {
      formattedOptions = [
        {
          value: user?.userId!,
          label: `${user?.name}`,
        },
      ];
    } else {
      const data = await fetchMembers(query);
      formattedOptions = data.data.map((option) => {
        const role = option['userRole']?.at(0)?.role?.name ?? '';
        return {
          value: option.userId,
          label: `${option.name} ${role ? `(${role})` : ''} `,
        };
      });
    }

    return formattedOptions;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      {renderWithAccessControl(
        <DialogTrigger asChild>
          <SecondaryButton
            onClick={() => setIsModalOpen(true)}
            className="py-1 my-1"
            type="button"
            title="Add New Task"
            icon={<CirclePlus size={15} />}
          />
        </DialogTrigger>,
        AccessModules.TASKS,
        AccessMethods.UPDATE,
        '',
      )}

      <DialogContent className="w-[95%] md:w-1/2 bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription className="text-xs">
            Add your task and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-[calc(100vh-50vh)] max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Title:</label>
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
            <textarea
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
                  // defaultValue={projects?.data?.at(0)?.projectId}
                  defaultValue={''}
                >
                  <option value="" disabled className="text-sm">
                    Select Project
                  </option>
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
            <label className="text-xs">Priority:</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  defaultValue=""
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent dark:bg-slate-900"
                >
                  <option value="" disabled className="text-sm">
                    Select Priority
                  </option>
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

          <button
            type="submit"
            className="p-2 my-2 block bg-primary hover:bg-primary/90 rounded-md text-white"
          >
            Save Task
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
