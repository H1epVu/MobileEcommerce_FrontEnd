import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/client/Home";
import Login from "./pages/client/Login";
import Detail from "./pages/client/Detail";
import Register from "./pages/client/Register";
import Cart from "./pages/client/Cart";
import Payment from "./pages/client/Payment";
import PaymentSuccess from "./pages/client/PaymentSuccess";
import PaymentCancel from "./pages/client/PaymentCancel";
import Profile from "./pages/client/Profile";
import Mobile from "./pages/admin/Mobile";
import Order from "./pages/admin/Order";
import User from "./pages/admin/User";
import Comment from "./pages/admin/Comment";
import AddUser from "./pages/admin/AddUser";
import UpdateUser from "./pages/admin/UpdateUser";
import AddMobile from "./pages/admin/AddMobile";
import UpdateMobile from "./pages/admin/UpdateMobile";
import DetailOrder from "./pages/admin/DetailOrder";
import NotFound from "./components/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import UserLayout from './pages/client/UserLayout';
import "./style.scss";
import { Provider } from 'react-redux';
import store from "./redux/Store";
import { ToastContainer } from "react-toastify";
import ForgetPassword from "./pages/client/ForgetPassword";
import ChangePassword from "./pages/client/ChangePassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "detail",
        children: [
          {
            path: ":id",
            element: <Detail />,
          },
          {
            path: "*",
            element: <NotFound />
          }
        ]
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "forgetPassword",
        element: <ForgetPassword />
      },
      {
        path: "changePassword/:id",
        element: <ChangePassword />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "payment",
        element: <Payment />
      },
      {
        path: "paymentSuccess",
        element: <PaymentSuccess />
      },
      {
        path: "paymentCancel",
        element: <PaymentCancel />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }, {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: 'user',
        element: <User />,
      },
      {
        path: 'user/add',
        element: <AddUser />
      },
      {
        path: 'user/update/:id',
        element: <UpdateUser />
      },
      {
        path: 'mobile',
        element: <Mobile />
      },
      {
        path: 'mobile/add',
        element: <AddMobile />
      },
      {
        path: 'mobile/update/:id',
        element: <UpdateMobile />
      },
      {
        path: 'order',
        element: <Order />
      },
      {
        path: 'order/detail/:orderId',
        element: <DetailOrder />
      },
      {
        path: 'comment',
        element: <Comment />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
        />
      </div>
    </Provider>
  );
}

export default App;