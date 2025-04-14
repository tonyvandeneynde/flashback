import { useState } from "react";
import { MapData } from "../../apiConstants";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { Swiper as SwiperType } from "swiper/types";
import { styled } from "@mui/material";

interface ClusterCarouselProps {
  clusterImages: MapData[];
  onImageChanged: (newImage: MapData) => void;
}

const StyledSwiper = styled(Swiper)`
  height: 250px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  --swiper-navigation-color: ${({ theme }) => theme.palette.primary.main};
  --swiper-pagination-color: ${({ theme }) => theme.palette.primary.main};
`;

export const ClusterCarousel = ({
  clusterImages,
  onImageChanged,
}: ClusterCarouselProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    const activeIndex = swiper.activeIndex;
    const activeImage = clusterImages[activeIndex];
    onImageChanged(activeImage);
  };

  return (
    <>
      <StyledSwiper
        onSlideChange={handleSlideChange}
        key={"top-swiper"}
        keyboard={{
          enabled: true,
        }}
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
      </StyledSwiper>
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
