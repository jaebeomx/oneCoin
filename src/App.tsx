import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Menubar from './components/MenuBar';
import Exchange from './pages/Exchange';
import Todo from './pages/Todo';
import Test from './pages/Test';
import Editor from './pages/Editor';
import Article from './pages/Article';
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
      {
        path: 'editor',
        element: <Editor />,
      },
      {
        path: '/article',
        element: <Article />,
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
