import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';
import Calc from './routes/Calc';
import Login from './routes/Login';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: 'calc',
          element: <Calc />,
        },
        {
          path: 'login',
          element: <Login />,
        },
      ],
    },
  ]);

  return (
    <div className='w-screen h-screen sm:p-10 m-auto'>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
