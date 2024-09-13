import CountrySelect from "./admin/CountrySelect";
import Dashboard from "./admin/Dashboard";
import ListBooks from "./admin/ListBooks";
import Publishers from "./admin/Publishers";
import Statistical from "./admin/Statistical";
import StatisticalFormHeader from "./admin/StatisticalFormHeader";
import TypeBook from "./admin/TypeBook";
import UploadBook from "./admin/UploadBook";
import ChatBot from "./ChatBot/ChatBot";
import GetListBookUserBook from "./ChatBot/GetListBookUseBot";
import CheckLogin from "./common/CheckLogin";
import CheckQrCode from "./common/CheckQrCode";
import Login from "./common/Login";
import AuthorBook from "./Home/AuthorBook";
import BookWellSell from "./Home/BookWellSell";
import CardProduct from "./Home/CardProduct";
import DetailBuy from "./Home/DetailBuy";
import HomePage from "./Home/HomePage";
import ListBookHome from "./Home/ListBookHome";
import ListPublicSher from "./Home/ListPublicSher";
import SubmitBuyBook from "./Home/SubmitBuyBook";
import Pages1 from "./Test/Pages1";
import SliderCard from "./Test/Pages2";
import Pages2 from "./Test/Pages2";
import AppRouter from "./Test/Routers/routers";
import AddAddress from "./user/AddAddress";
import DisPlaySubmitByFromCart from "./user/DisPlaySubmitByFromCart";
import DonHangForm from "./user/FormBuyCart";
import FormBuyCart from "./user/FormBuyCart";
import GetTheShippingAddress from "./user/GetTheShippingAddress";
import ListCart from "./user/ListCart";
import ListOrderUser from "./user/ListOrderUser";
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
      <CheckLogin/>
      {/* <TypeBook/> */}
      {/* <Publishers/> */}
      {/* <AuthorBook/> */}
      {/* <DetailBuy  /> */}
      {/* <AppRouter/> */}
      {/* <Pages2/> */}
      {/* <SubmitBuyBook/> */}
      {/* <ListBookHome nameTypeBook={'6'}/> */}
      {/* <Pages1/> */}
      {/* <RegisterUser/> */}
      {/* <ProFile/> */}
      {/* <AddAddress/> */}
      {/* <GetTheShippingAddress/> */}
      {/* <ListCart/> */}
      {/* <ListOrderUser/> */}
      {/* <Statistical/> */}
      {/* <ChatBot/> */}
      {/* <GetListBookUserBook/> */}
      {/* <DisPlaySubmitByFromCart/> */}
      {/* <FormBuyCart/> */}
      {/* <FormBuyCart/> */}
      {/* <ListCart/> */}
      {/* <ListPublicSher/> */}
      {/* <AuthorBook/> */}
      {/* <ListPublicSher/> */}
      {/* <Pages1/> */}
      {/* <CardProduct
        author_name='hi hi'
        bookId='99'
        discount_price='12'
        file_desc_first='http://localhost:8080/manager/shader/thao/6284312.png'
        price='1000'
        publisher='hi hi'
        title='hi hi' /> */}
      {/* <SliderCard/> */}
      {/* <BookWellSell title='Sắp xuất bản'/> */}
      {/* <SubmitBuyBook/> */}
      {/* <StatisticalFormHeader/> */}
      {/* <CountrySelect/> */}
    </div>
  );
}

export default App;
