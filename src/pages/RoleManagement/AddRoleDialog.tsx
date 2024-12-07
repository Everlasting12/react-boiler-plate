import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../my-components/Modal';

import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CirclePlus, Trash2 } from 'lucide-react';
import SecondaryButton from '../../my-components/SecondaryButton';
import { useEffect, useState } from 'react';
import { useRoleStore } from '../../store/useRoleStore';
import Dropdown from '../../my-components/Dropdown';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  roleId: yup
    .string()
    .matches(/^[A-Z_]+$/, 'roleId must be uppercase and underscored only')
    .required('roleId is required'),
  permissionIds: yup.array().of(yup.string().required('Value is required')),
  permissionEntities: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required('key is required'),
        value: yup.string().required('Value is required'),
      }),
    )
    .test('unique-keys', 'Role entity keys must be unique', (value) => {
      if (!value) return true; // Skip validation if the array is empty or undefined
      const keys = value.map((item) => item.key);
      return new Set(keys).size === keys.length; // Ensure all keys are unique
    }),
  isDefault: yup.boolean().default(true),
  isActive: yup.boolean().default(true),
});

type InputObject = {
  name: string;
  permissionIds: string[];
  permissionEntities: { key: string; value: string }[];
  isDefault?: boolean;
  isActive?: boolean;
};

type OutputObject = {
  name: string;
  permissionIds: string[];
  permissionEntities: Record<string, string>;
  isDefault?: boolean;
  isActive?: boolean;
};

const AddRoleDialog = () => {
  const { addRole } = useRoleStore();
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
      name: '',
      roleId: '',
      permissionIds: [''],
      permissionEntities: [
        {
          key: '',
          value: '',
        },
      ],
      isDefault: true,
      isActive: true,
    },
  });

  const {
    fields: permissionEntities,
    append: appendPermissionEntities,
    remove: removePermissionEntities,
  } = useFieldArray({
    control,
    name: 'permissionEntities',
  });

  const onSubmit = (data: any) => {
    const convertedObject = transformObject(data);

    if (convertedObject) {
      addRole(convertedObject);
      reset();
      setIsModalOpen(false);
    }
  };

  function transformObject(input: InputObject): OutputObject {
    return {
      name: input.name,
      permissionIds: input.permissionIds,
      permissionEntities: input.permissionEntities.reduce(
        (prevValue, currentValue) => {
          return { ...prevValue, [currentValue.key]: currentValue.value };
        },
        {},
      ),
      isDefault: input.isDefault,
      isActive: input.isActive,
    };
  }

  useEffect(() => {
    reset();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = [
    {
      label: 'Add Permission',
      value: 'CREATE_PERMISSIONS',
    },
    {
      label: 'Send Notification',
      value: 'SEND_NOTIFICATIONS',
    },
    {
      label: 'Create Notification Template',
      value: 'CREATE_NOTIFICATION_TEMPLATE',
    },
  ];
  const handleSelection = (selected: any) => {
    console.log('Selected:', selected);
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <SecondaryButton
          onClick={() => setIsModalOpen(true)}
          className="py-1 my-1"
          type="button"
          title="Role"
          icon={<CirclePlus size={15} />}
        />
      </DialogTrigger>
      <DialogContent className="w-[95%] md:w-1/2 bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Add Role</DialogTitle>
          <DialogDescription className="text-xs">
            Add your role and Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto h-[calc(100vh-50vh)] max-h-[calc(100vh-30%)] scrollbar md:px-5 flex flex-col gap-2 text-xs"
        >
          <div className="flex flex-col">
            <label className="text-xs">Name:</label>
            <input
              className="px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
              {...register('name')}
              placeholder="Enter role name"
            />
            <p className="text-red-500 text-[9px]">{errors?.name?.message}</p>
          </div>

          <div className="w-full">
            <label>Permission Ids:</label>

            <Dropdown
              label="Choose an option"
              options={options}
              isMulti
              isSearchable
              isPaginated
              onChange={handleSelection}
              isDarkMode={true}
            />
            <p className="text-red-500 text-[9px]">
              {errors.permissionIds?.message ??
                errors.permissionIds?.root?.message}
            </p>
          </div>

          <div>
            <label>Role Entities:</label>

            {permissionEntities.map((field, index) => (
              <div key={field.id} className="mb-1">
                <div className="flex items-center gap-2">
                  {/* Input for Endpoint */}

                  <input
                    {...register(`permissionEntities.${index}.key` as const)}
                    className="w-1/4 md:w-1/3 px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                    placeholder="Enter key"
                  />

                  <input
                    {...register(`permissionEntities.${index}.value` as const)}
                    placeholder="Enter value"
                    className="flex-grow px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                  />

                  <button
                    type="button"
                    className="rounded-full bg-red-500 h-6 w-6 flex items-center justify-center text-white"
                    onClick={() => removePermissionEntities(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-red-500 text-[9px]">
                  {errors?.permissionEntities?.length ? (
                    <span className="flex gap-2">
                      {errors?.permissionEntities?.at(index) &&
                        Object.keys(
                          errors?.permissionEntities?.at(index) as any,
                        ).map((key, ind) => (
                          <span key={ind} className="w-1/3">
                            {
                              (errors?.permissionEntities?.at(index) as any)?.[
                                key
                              ]?.message
                            }
                          </span>
                        ))}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
            <p className="text-red-500 text-[9px]">
              {errors.permissionEntities?.message ??
                errors.permissionEntities?.root?.message}
            </p>
            <SecondaryButton
              className="mt-1"
              type="button"
              title=" Add Role Entity"
              icon={<CirclePlus size={15} />}
              onClick={
                () => appendPermissionEntities({ key: '', value: '' }) // Default new scope values
              }
            />
          </div>

          <div className="flex gap-5">
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isDefault')}
                className="cursor-pointer"
              />
              Default
            </label>
            <label className="flex gap-2 items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isActive')}
                className="cursor-pointer"
              />
              Active
            </label>
          </div>

          <button
            type="submit"
            className="p-2 my-2 bg-primary hover:bg-primary/90 rounded-md text-white"
          >
            Save Role
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleDialog;
