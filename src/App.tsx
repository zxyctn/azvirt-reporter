import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';
import Calc from './routes/Calc';
import Login from './routes/Login';

const App = () => {
  const router = createBrowserRouter(
    [
      {
        path: '',
        element: <Root />,
        errorElement: <div>Error</div>,
        children: [
          {
            path: '',
            element: <Calc />,
          },
          {
            path: 'login',
            element: <Login />,
          },
        ],
      },
    ],
    {
      basename: '/azvirt-reporter/',
    }
  );

  return (
    <div className='w-screen h-screen'>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
