import AuthorBook from "./admin/AuthorBook";
import Dashboard from "./admin/Dashboard";
import ListBooks from "./admin/ListBooks";
import Publishers from "./admin/Publishers";
import TypeBook from "./admin/TypeBook";
import UploadBook from "./admin/UploadBook";
import CheckLogin from "./common/CheckLogin";
import CheckQrCode from "./common/CheckQrCode";
import Login from "./common/Login";
import DetailBuy from "./Home/DetailBuy";
import HomePage from "./Home/HomePage";
import AppRouter from "./Test/Routers/routers";



function App() {
  return (
    <div>
      {/* <Dashboard /> */}
      {/* <UploadBook/> */}
      {/* <ListBooks/> */}
      {/* <HomePage/> */}
      {/* <CheckQrCode/> */}
      {/* <Login/> */}
      {/* <CheckLogin/> */}
      {/* <TypeBook/> */}
      {/* <Publishers/> */}
      {/* <AuthorBook/> */}
      <DetailBuy book_id={7861741} />
      {/* <AppRouter/> */}
    </div>
  );
}

export default App;
