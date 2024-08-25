import AuthorBook from "./admin/AuthorBook";
import Dashboard from "./admin/Dashboard";
import ListBooks from "./admin/ListBooks";
import Publishers from "./admin/Publishers";
import TypeBook from "./admin/TypeBook";
import UploadBook from "./admin/UploadBook";
import CheckLogin from "./common/CheckLogin";
import CheckQrCode from "./common/CheckQrCode";
import Login from "./common/Login";
import HomePage from "./Home/HomePage";



function App() {
  return (
    <div>
      {/* <Dashboard /> */}
      <UploadBook/>
      {/* <ListBooks/> */}
      {/* <HomePage/> */}
      {/* <CheckQrCode/> */}
      {/* <Login/> */}
      {/* <CheckLogin/> */}
      {/* <TypeBook/> */}
      {/* <Publishers/> */}
      {/* <AuthorBook/> */}
    </div>
  );
}

export default App;
