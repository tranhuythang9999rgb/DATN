import React from "react";
import Slider from "react-slick";
import './index_utils.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Image } from "antd";
function ImageHeader() {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false
  };
  return (
    <div className="slider-container-v2">
      <Slider {...settings}>
        <div>
          <Image  src={"https://react-slick.neostack.com/img/react-slick/abstract01.jpg"} />
        </div>
        <div>
          <Image src={"https://react-slick.neostack.com/img/react-slick/abstract02.jpg"} />
        </div>
        <div>
          <Image src={"https://react-slick.neostack.com/img/react-slick/abstract03.jpg"} />
        </div>
        <div>
          <Image src={"https://react-slick.neostack.com/img/react-slick/abstract04.jpg"} />
        </div>
      </Slider>
    </div>
  );
}

export default ImageHeader;
