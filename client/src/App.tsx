import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast'
import DefaultRoute from "./components/DefaultRoute";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewPost from "./pages/ViewPost";
import CreatePost from "./pages/CreatePost";
import PrivateRoute from "./components/PrivateRoute";
import ErrorPage from "./components/ErrorPage";

function App() {
  const router = createBrowserRouter([  
    {
      path: "/",
      element: <PrivateRoute children={<Dashboard />} />,
    },
    {
      path: "/login",
      element: <DefaultRoute children={<Login />} />,
    },
    {
      path: "/register",
      element: <DefaultRoute children={<Register />} />,
    },
   
    {
      path: "/create-post",
      element: <PrivateRoute children={<CreatePost />} />,
    },
    {
      path: "/post/:id",
      element: <PrivateRoute children={<ViewPost />} />,
    },
    {
      path: "*", 
      element: <ErrorPage />, 
    },
  ])
  const queryClient = new QueryClient();

  return (
    <div className="max-w-[120rem] mx-auto">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          toastOptions={{
            className: "font-inter",
          }}
        />
      </QueryClientProvider>
    </div>
  );
}

export default App;
