import React, { useEffect, useState } from 'react';
import { Form, Button, notification, Spin, Menu } from 'antd';
import {
    MDBFooter,
    MDBContainer,
    MDBIcon,
    MDBCol,
    MDBRow,
} from 'mdb-react-ui-kit';

import './user_index.css';
import ProductCard from './ProductCard';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const Context = React.createContext({
    name: 'Default',
});


function FormBuyCart() {
    const [listCartJson, setListCartJson] = useState([]);
    const [loading, setLoading] = useState(true);
    const [api, contextHolder] = notification.useNotification();

    const shippingFee = 30000; // Phí vận chuyển mặc định

    const openNotification = (placement) => {
        api.success({
            message: 'Đặt hàng thành công!',
            description: (
                <Context.Consumer>
                    {({ name }) =>
                        'Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ ngay với bạn.'
                    }
                </Context.Consumer>
            ),
            placement,
            duration: 3,
        });
    };

    const handleBuyNow = () => {
        console.log('Mua ngay');
    };

    const handleOrder = () => {
        console.log('Đặt hàng');
        openNotification('topRight');
    };

    const handleDeleteItem = (cartId) => {
        if (listCartJson.length > 1) { // Kiểm tra nếu còn nhiều hơn 1 item
            const updatedCart = listCartJson.filter(item => item.cart_id !== cartId);
            setListCartJson(updatedCart);
            localStorage.setItem('list_cart', JSON.stringify(updatedCart)); // Cập nhật localStorage sau khi xóa
        } else {
            notification.error({
                message: 'Không thể xóa',
                description: 'Phải có ít nhất 1 sản phẩm trong giỏ hàng',
                placement: 'topRight',
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const listCart = localStorage.getItem('list_cart');
            const parsedData = JSON.parse(listCart || '[]');
            setListCartJson(parsedData);
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const totalAmount = listCartJson.reduce((total, item) => total + item.total_amount, 0);
    const totalWithShipping = totalAmount + shippingFee;

    return (
        <Spin spinning={loading} tip="Đang tải..." size="large">
            <Menu
                mode="horizontal"
                style={{
                    display: 'flex',
                    justifyContent: 'center', /* Center the items horizontally */
                    height: '80px', /* Set the height of the Menu */
                    lineHeight: '80px', /* Align text vertically in the middle */
                }}
            >
                <Menu.Item key="home">Trang chủ</Menu.Item>
                <Menu.Item key="contact">Liên hệ</Menu.Item>
            </Menu>
            <div>
                {contextHolder}
                <Form className="form-cart">
                    <Form.Item>
                        {listCartJson.map(item => (
                            <ProductCard
                                key={item.cart_id}
                                imageUrl={item.url}
                                title={item.book_name}
                                price={item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                quantity={item.quantity}
                                sell="15"
                                onDelete={() => handleDeleteItem(item.cart_id)}
                            />
                        ))}
                    </Form.Item>
                    <Form.Item>
                        <div className="form-item-total">
                            <div
                                style={{
                                    backgroundColor: 'white',
                                    height: '50px',
                                    fontSize: '20px',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                className="total-product"
                            >
                                Tổng tiền sản phẩm: {totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'white',
                                    height: '50px',
                                    fontSize: '20px',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                className="total-shipping"
                            >
                                Phí vận chuyển: {shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                            <div
                                style={{
                                    backgroundColor: '#2ecc71',
                                    height: '50px',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    padding: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    borderRadius: '8px',
                                    color: 'white',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                }}
                                className="total-payment"
                            >
                                Tổng tiền thanh toán: {totalWithShipping.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item className="form-item-button">
                        <Button type="primary" onClick={handleBuyNow} className="form-button">
                            Mua ngay
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default" onClick={handleOrder} className="form-button">
                            Đặt hàng
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <div>

            <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Kết nối với chúng tôi trên các mạng xã hội:</span>
        </div>

        <div>
          <a href='https://facebook.com' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='facebook-f' />
          </a>
          <a href='https://twitter.com' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='twitter' />
          </a>
          <a href='https://plus.google.com' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='google' />
          </a>
          <a href='https://instagram.com' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='instagram' />
          </a>
          <a href='https://linkedin.com' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='linkedin' />
          </a>
          <a href='https://github.com' className='me-4 text-reset'>
            <MDBIcon color='secondary' fab icon='github' />
          </a>
        </div>
      </section>

      <section>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon color='secondary' icon='book' className='me-3' />
                Nhà Sách ABC
              </h6>
              <p>
                Chúng tôi cung cấp đa dạng các loại sách từ sách giáo khoa, sách văn học đến sách chuyên ngành. Khám phá bộ sưu tập sách của chúng tôi và tìm đọc những cuốn sách yêu thích.
              </p>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Sách Nổi Bật</h6>
              <p>
                <a href='/category/novels' className='text-reset'>
                  Tiểu Thuyết
                </a>
              </p>
              <p>
                <a href='/category/education' className='text-reset'>
                  Giáo Khoa
                </a>
              </p>
              <p>
                <a href='/category/science' className='text-reset'>
                  Khoa Học
                </a>
              </p>
              <p>
                <a href='/category/technology' className='text-reset'>
                  Công Nghệ
                </a>
              </p>
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Liên kết Hữu Ích</h6>
              <p>
                <a href='/about' className='text-reset'>
                  Giới Thiệu
                </a>
              </p>
              <p>
                <a href='/contact' className='text-reset'>
                  Liên Hệ
                </a>
              </p>
              <p>
                <a href='/faq' className='text-reset'>
                  Câu Hỏi Thường Gặp
                </a>
              </p>
              <p>
                <a href='/returns' className='text-reset'>
                  Chính Sách Đổi Trả
                </a>
              </p>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Thông Tin Liên Hệ</h6>
              <p>
                <MDBIcon color='secondary' icon='home' className='me-2' />
                123 Đường Sách, Quận 1, TP. Hồ Chí Minh
              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-3' />
                info@nhasachabc.com
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-3' /> +84 123 456 789
              </p>
              <p>
                <MDBIcon color='secondary' icon='print' className='me-3' /> +84 123 456 788
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024 Bản quyền:
        <a className='text-reset fw-bold' href='https://nhasachabc.com'>
          Nhà Sách ABC
        </a>
      </div>
    </MDBFooter>

            </div>

        </Spin>
    );
}

export default FormBuyCart;
