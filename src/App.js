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
import ListBookHome from "./Home/ListBookHome";
import SubmitBuyBook from "./Home/SubmitBuyBook";
import Pages1 from "./Test/Pages1";
import Pages2 from "./Test/Pages2";
import AppRouter from "./Test/Routers/routers";
import AddAddress from "./user/AddAddress";
import ProFile from "./user/Profile";
import RegisterUser from "./user/RegisterUser";



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
      {/* <DetailBuy book_id={7861741} /> */}
      {/* <AppRouter/> */}
      {/* <Pages2/> */}
      {/* <SubmitBuyBook/> */}
      {/* <ListBookHome nameTypeBook={'6'}/> */}
    {/* <Pages1/> */}
    {/* <RegisterUser/> */}
    {/* <ProFile/> */}
    <AddAddress/>
    </div>
  );
}

export default App;
