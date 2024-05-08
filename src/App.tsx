import { createHashRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';
import Calc from './routes/Calc';
import Login from './routes/Login';

const App = () => {
  const router = createHashRouter([
    {
      path: '/*',
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
  ]);

  return (
    <div className='w-screen h-screen'>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
