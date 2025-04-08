import { useState } from "react";
import { MapData } from "../../apiConstants";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { Swiper as SwiperType } from "swiper/types";

interface ClusterCarouselProps {
  clusterImages: MapData[];
}

export const ClusterCarousel = ({ clusterImages }: ClusterCarouselProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <Swiper
        key={"top-swiper"}
        keyboard={{
          enabled: true,
        }}
        style={
          {
            height: "250px",
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Keyboard, FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {clusterImages.map((image) => (
          <SwiperSlide key={`top-${image.id}`}>
            <img
              src={image.imageUrl}
              loading="lazy"
              alt="thumbnail"
              style={{
                margin: "auto",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        key={"bottom-swiper"}
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {clusterImages.map((image) => (
          <SwiperSlide key={`bottom-${image.id}`}>
            <img
              src={image.imageUrl}
              loading="lazy"
              alt="thumbnail"
              style={{
                width: "100%",
                height: "50px",
                objectFit: "contain",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
