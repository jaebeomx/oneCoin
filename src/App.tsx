import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Menubar from './components/MenuBar';
import Exchange from './pages/Exchange';
import Todo from './pages/Todo';
import Test from './pages/Test';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Menubar />,
    errorElement: <div>error</div>,
    children: [
      {
        path: '/',
        element: <Todo />,
      },
      {
        path: '/exchange',
        element: <Exchange />,
      },
      {
        path: '/test',
        element: <Test />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
