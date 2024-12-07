import { useNavigate } from 'react-router-dom';
import Logo from '../../images/logo/logo.svg';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useLoginStore } from '../../store/useLoginStore';
import { LockKeyhole, LockKeyholeOpen, Mail } from 'lucide-react';
import { useState } from 'react';

const loginSchema = yup
  .object({
    username: yup.string().required().email(),
    password: yup.string().required().min(8).max(16),
  })
  .required();

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginWithEmail } = useLoginStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const onSubmit = async ({ username, password }: any) => {
    const success = await loginWithEmail({ username, password });
    if (success) {
      navigate('/');
    }
  };
  return (
    <div className="h-screen dark:bg-boxdark-2">
      <div className="flex flex-wrap items-center h-full">
        <div className="hidden w-full xl:flex xl:items-center xl:justify-center xl:w-1/2 bg-slate-50 dark:bg-boxdark-2 h-full">
          <div className="py-17.5 px-26 text-center">
            <img className="hidden dark:block" src={Logo} alt="Logo" />
            <p className="2xl:px-20 md:text-2xl">
              {import.meta.env.VITE_APP_NAME}
            </p>
            <p className="2xl:px-20">your logo</p>

            <span className="mt-15 inline-block"></span>
          </div>
        </div>

        <div className="w-full xl:w-1/2 h-full xl:flex xl:items-center">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5 h-full flex flex-col justify-center">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Sign In to {import.meta.env.VITE_APP_NAME}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    {...register('username')}
                    defaultValue={'sidheshlineup@gmail.com'}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border text-black dark:text-white border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    <Mail className="text-slate-400" />
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={!showPassword ? 'password' : 'text'}
                    {...register('password')}
                    defaultValue={'Sidhesh@123'}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border text-black dark:text-white border-stroke bg-transparent py-3 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />

                  <span className="absolute right-4 top-4">
                    {showPassword ? (
                      <LockKeyhole
                        className="text-slate-400 cursor-pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <LockKeyholeOpen
                        className="text-slate-400 cursor-pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
