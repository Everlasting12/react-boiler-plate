import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUserStore } from '../../store/useUserStore';
import { UsersLinks } from './Users';
import { LockKeyhole, LockKeyholeOpen, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const createUserSchema = yup
  .object({
    name: yup.string().required('Name is required'),
    email: yup.string().required('Email id is required').email(),
    password: yup.string().required('Password is required').min(8).max(16),
  })
  .required();

const AddUser = () => {
  const { addUser } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createUserSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: any) => {
    const success = await addUser(data);
    if (success) {
      reset();
      navigate('/users/table');
    }
  };

  return (
    <div>
      <UsersLinks />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:w-1/2 mx-auto flex flex-col gap-3"
      >
        <label className="text-lg block">Create User</label>
        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-black dark:text-white">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('name')}
              placeholder="Enter full name"
              className="w-full text-xs rounded-lg border text-black dark:text-white border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <Mail size={18} className="text-slate-400" />
            </span>
          </div>
          <p className="text-xs text-red-500">{errors?.name?.message}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-black dark:text-white">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              {...register('email')}
              placeholder="Enter email"
              className="w-full text-xs rounded-lg border text-black dark:text-white border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <Mail size={18} className="text-slate-400" />
            </span>
          </div>
          <p className="text-xs text-red-500">{errors?.email?.message}</p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="block text-xs font-medium text-black dark:text-white">
            Password
          </label>
          <div className="relative">
            <input
              type={!showPassword ? 'password' : 'text'}
              {...register('password')}
              placeholder="Enter password"
              className="w-full text-xs rounded-lg border text-black dark:text-white border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <LockKeyhole
                  size={18}
                  className="text-slate-400 cursor-pointer"
                />
              ) : (
                <LockKeyholeOpen
                  size={18}
                  className="text-slate-400 cursor-pointer"
                />
              )}
            </button>
          </div>
          <p className="text-xs text-red-500">{errors?.password?.message}</p>
        </div>
        <input
          type="submit"
          value="Add user"
          className="w-full text-sm block cursor-pointer rounded-lg border border-primary bg-primary px-3 py-2 text-white transition hover:bg-opacity-90"
        />
      </form>
    </div>
  );
};

export default AddUser;
