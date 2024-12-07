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
import { CirclePlus, Trash2 } from 'lucide-react';
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

const validationSchema = yup.object().shape({
  title: yup.string().required('title is required'),
  drawingTitle: yup.string(),
  description: yup.string().required('Description is required'),
  // status: yup
  //   .mixed()
  //   .oneOf(Object.values(TaskStatus))
  //   .required('Status is required'),
  priority: yup
    .mixed()
    .oneOf(Object.values(TaskPriority))
    .required('Priority is required'),
  dueTime: yup.number().positive().required('Due Time is required'),
  assignedTo: yup
    .string()
    .uuid('Invalid UUID')
    .required('Assigned To is required'),
});

const AddTaskDialog = () => {
  const { addTask } = useTaskStore();
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

  const onSubmit = (data: any) => {
    data.status = TaskStatus.NEW.toUpperCase();
    console.log('🚀 ~ onSubmit ~ data:', data);

    // addTask(data);
  };

  useEffect(() => {
    reset();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
          {/* <div className="flex flex-col">
            <label className="text-xs">Status:</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select {...field}>
                  {Object.values(TaskStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">{errors?.status?.message}</p>
          </div> */}
          <div className="flex flex-col">
            <label className="text-xs">Priority:</label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                >
                  {Object.values(TaskPriority).map((priority) => (
                    <option key={priority} value={priority}>
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
              placeholder="Enter Due Time"
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

export default AddTaskDialog;
