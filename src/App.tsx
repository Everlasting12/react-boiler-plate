import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Loader from './common/Loader';
import routes from './routes';
import { useLoginStore } from './store/useLoginStore';
import RouteGuard from './common/RouteGuard';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { getAuthDetails, isAuthenticated, feScopes } = useLoginStore();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const isAuthRoute = location.pathname.startsWith('/auth/');
    if (!isAuthenticated && !feScopes?.length) {
      const data = getAuthDetails();
      if (data == false && !isAuthRoute) {
        navigate('/auth/signin');
      } else {
        navigate('/');
      }
    } else {
      if (location.pathname && !isAuthRoute) {
        navigate(location.pathname);
      } else {
        navigate('/');
      }
    }
  }, [getAuthDetails, isAuthenticated, location?.state]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route element={<RouteGuard Component={DefaultLayout} />}>
          <Route index element={<ECommerce />} />
          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            return (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loader />}>
                    <Component />
                  </Suspense>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
}

export default App;