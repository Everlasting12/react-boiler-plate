import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../my-components/Modal';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CirclePlus } from 'lucide-react';
import SecondaryButton from '../../my-components/SecondaryButton';
import { useEffect, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import {
  ProjectCategory,
  ProjectPriority,
  ProjectStatus,
} from '../../common/enums';
import { ProjectQuery } from '../../types/useProjectStore.types';

const validationSchema = yup.object().shape({
  name: yup.string().required('title is required'),
  description: yup.string().required('Description is required'),
  // status: yup
  //   .mixed()
  //   .oneOf(Object.values(TaskStatus))
  //   .required('Status is required'),
  priority: yup
    .mixed()
    .oneOf(Object.keys(ProjectPriority))
    .required('Priority is required'),
  category: yup
    .mixed()
    .oneOf(Object.keys(ProjectCategory))
    .required('Category is required'),
  startDate: yup
    .date()
    .required('Start Date is required')
    .typeError('Invalid date'),
});

type Props = { query: ProjectQuery; skip: number; limit: number };

const AddProjectDialog = ({ limit, query, skip }: Props) => {
  const { addProject, fetchProjects } = useProjectStore();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      priority: ProjectPriority.MEDIUM.toUpperCase(),
      category: ProjectCategory.A.toUpperCase(),
    },
  });

  const onSubmit = (data: any) => {
    data.status = ProjectStatus.NEW.toUpperCase();
    data.createdById = 'f89749ce-a94e-4c4f-bb37-c19b32d7fe9b';
    addProject(data);
    reset();
    setIsModalOpen(false);

    query.skip = skip;
    query.limit = limit;
    fetchProjects(query);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <SecondaryButton
          onClick={() => {
            setIsModalOpen(true);
            reset();
          }}
          className="py-1 my-1"
          type="button"
          title="Add New Project"
          icon={<CirclePlus size={15} />}
        />
      </DialogTrigger>
      <DialogContent className="w-[95%] md:w-1/2 bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription className="text-xs">
            Add your project and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-[calc(100vh-50vh)] max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Project Name:</label>
            <input
              className="px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('name')}
              placeholder="Enter Project Name"
            />
            <p className="text-red-500 text-[9px]">{errors?.name?.message}</p>
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
            <label className="text-xs">Start Date:</label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="w-full px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                  {...field}
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date: Date | null) => field.onChange(date)}
                  dateFormat="yyyy/MM/dd"
                />
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.startDate?.message}
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
            <label className="text-xs">Category:</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                >
                  {Object.entries(ProjectCategory).map(([key, category]) => (
                    <option key={category} value={key}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-red-500 text-[9px]">
              {errors?.category?.message}
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
                  className="py-2 px-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                >
                  {Object.entries(ProjectPriority).map(([key, priority]) => (
                    <option key={priority} value={key}>
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
            className="p-2 my-2 bg-primary hover:bg-primary/90 rounded-md text-white"
          >
            Save Project
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
