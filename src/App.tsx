import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';
import Calc from './routes/Calc';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: 'calc',
          element: <Calc />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
