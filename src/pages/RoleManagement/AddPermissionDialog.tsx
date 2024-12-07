import {
  Dialog,
  DialogClose,
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
import { usePermissionStore } from '../../store/usePermissionStore';

const methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Z_]+$/, 'Name must be uppercase and underscored only')
    .required('Name is required'),
  apiScopes: yup
    .array()
    .of(
      yup.object().shape({
        method: yup.string().required('HTTP method is required'),
        endpoint: yup
          .string()
          .matches(/^\S+$/, 'Endpoint cannot be empty or contain spaces')
          .required('Endpoint is required'),
      }),
    )
    .min(1, 'At least one API scope is required')
    .test('unique-keys', 'API scopes must be unique', (value) => {
      if (!value) return true; // Skip validation if the array is empty or undefined
      const keys = value.map((item) => item.method + item.endpoint);
      return new Set(keys).size === keys.length; // Ensure all keys are unique
    }),
  feScopes: yup
    .array()
    .of(yup.string().required('FE Scope is required'))
    .test('unique-keys', 'FE Scopes must be unique', (value) => {
      if (!value) return true; // Skip validation if the array is empty or undefined
      const keys = value.map((item) => item);
      return new Set(keys).size === keys.length; // Ensure all keys are unique
    }),
  permissionEntities: yup
    .array()
    .of(
      yup.object().shape({
        key: yup.string().required('key is required'),
        value: yup.string().required('Value is required'),
      }),
    )
    .test('unique-keys', 'Permission entity keys must be unique', (value) => {
      if (!value) return true; // Skip validation if the array is empty or undefined
      const keys = value.map((item) => item.key);
      return new Set(keys).size === keys.length; // Ensure all keys are unique
    }),
  isDefault: yup.boolean().default(true),
  isActive: yup.boolean().default(true),
});

type InputObject = {
  name: string;
  apiScopes: { method: string; endpoint: string }[];
  feScopes: string[];
  permissionEntities: { key: string; value: string }[];
  isDefault: boolean;
  isActive: boolean;
};

type OutputObject = {
  name: string;
  apiScopes: string[];
  feScopes: string[];
  permissionEntities: Record<string, string>;
  isDefault: boolean;
  isActive: boolean;
};

const AddPermissionDialog = () => {
  const { addPermission } = usePermissionStore();
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
      apiScopes: [
        { method: 'GET', endpoint: '.*/api/v1/<<your-api-route>>.*' },
      ],
      feScopes: [''],
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
    fields: apiScopes,
    append: appendApiScopes,
    remove: removeApiScopes,
  } = useFieldArray({
    control,
    name: 'apiScopes',
  });

  const {
    fields: feScopes,
    append: appendfeScopes,
    remove: removefeScopes,
  } = useFieldArray({
    control,
    name: 'feScopes',
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
      addPermission(convertedObject);
      reset();
      setIsModalOpen(false);
    }
  };

  function transformObject(input: InputObject): OutputObject {
    return {
      name: input.name,
      apiScopes: input.apiScopes.map(
        (scope) => `${scope.method}::${scope.endpoint}`,
      ),
      feScopes: input.feScopes,
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
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <SecondaryButton
          onClick={() => setIsModalOpen(true)}
          className="py-1 my-1"
          type="button"
          title="Permission"
          icon={<CirclePlus size={15} />}
        />
      </DialogTrigger>
      <DialogContent className="w-[95%] md:w-1/2 bg-white dark:bg-slate-900 text-black dark:text-white shadow-xl border-0">
        <DialogHeader>
          <DialogTitle>Add Permission</DialogTitle>
          <DialogDescription className="text-xs">
            Add your permission and Click save when you're done.
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
              placeholder="Enter permission name"
            />
            <p className="text-red-500 text-[9px]">{errors?.name?.message}</p>
          </div>

          <div>
            <label className="text-xs">API Scopes:</label>
            {apiScopes.map((field, index) => (
              <div key={field.id} className="mb-1">
                {/* Dropdown for HTTP Method */}
                <div className="w-full flex items-center gap-2">
                  <select
                    defaultValue={''}
                    {...register(`apiScopes.${index}.method` as const)}
                    className="border-2 border-slate-300 py-2 dark:border-slate-600 rounded-md cursor-pointer bg-transparent"
                  >
                    {methods.map((method) => (
                      <option
                        key={method}
                        value={method}
                        className="text-black dark:text-white dark:bg-black"
                      >
                        {method}
                      </option>
                    ))}
                  </select>

                  {/* Input for Endpoint */}
                  <input
                    {...register(`apiScopes.${index}.endpoint` as const)}
                    className="flex-grow px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                    placeholder="Enter endpoint"
                  />
                  <button
                    type="button"
                    className="rounded-full bg-red-500 h-6 w-6 flex items-center justify-center text-white"
                    onClick={() => removeApiScopes(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-red-500 text-[9px]">
                  {errors?.apiScopes?.length ? (
                    <span className="flex gap-2">
                      {errors?.apiScopes?.at(index) &&
                        Object.keys(errors?.apiScopes?.at(index) as any).map(
                          (key, ind) => (
                            <span key={ind}>
                              {
                                (errors?.apiScopes?.at(index) as any)?.[key]
                                  ?.message
                              }
                            </span>
                          ),
                        )}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
            <p className="text-red-500 text-[9px]">
              {errors.apiScopes?.message ?? errors.apiScopes?.root?.message}
            </p>
            <SecondaryButton
              className="mt-1"
              type="button"
              title="Add API Scope"
              icon={<CirclePlus size={15} />}
              onClick={
                () =>
                  appendApiScopes({
                    method: 'GET',
                    endpoint: '.*/api/v1/<<your-api-route>>.*',
                  }) // Default new scope values
              }
            />
          </div>

          <div>
            <label>Frontend Scopes:</label>

            {feScopes.map((field, index) => (
              <div key={field.id} className="gap-2 mb-1">
                <div className="w-full flex gap-2 items-center">
                  {/* Input for Endpoint */}
                  <input
                    {...register(`feScopes.${index}` as const)}
                    className="flex-grow px-2 py-2 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent"
                    placeholder="Enter FE Scope"
                  />

                  <button
                    type="button"
                    className="rounded-full bg-red-500 h-6 w-6 flex items-center justify-center text-white"
                    onClick={() => removefeScopes(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-red-500 text-[9px]">
                  {errors?.feScopes?.length ? (
                    <span className="flex gap-2">
                      {errors?.feScopes?.at(index)?.message}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
            <p className="text-red-500 text-[9px]">
              {errors.feScopes?.message ?? errors.feScopes?.root?.message}
            </p>
            <SecondaryButton
              className="mt-1"
              type="button"
              title="Add FE Scope"
              icon={<CirclePlus size={15} />}
              onClick={() => appendfeScopes('')}
            />
          </div>

          <div>
            <label>Permission Entities:</label>

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
              title=" Add Permission Entity"
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
            Save Permission
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPermissionDialog;
