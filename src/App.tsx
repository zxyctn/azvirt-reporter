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

  return <RouterProvider router={router} />;
};

export default App;
