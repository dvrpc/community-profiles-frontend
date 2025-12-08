"use client";
import "react-multi-carousel/lib/styles.css";
import { useRef, useState, useEffect } from "react";
import { PRODUCT_IMAGE_BASE_URL } from "@/consts";
import { useProducts } from "@/lib/hooks";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Carousel from "react-multi-carousel";
interface Props {
  relatedProducts: string[];
}
const itemsPerPage = 2;

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1500 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 1500, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default function RelatedProducts({ relatedProducts }: Props) {
  const products = useProducts(relatedProducts);
  const isLoading = products.some((result) => result.isPending);
  const isError = products.some((result) => result.isError);

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error loading products.</div>;

  return (
    <div className="">
      <span className="text-md font-semibold">Related Products</span>
      <Carousel
        responsive={responsive}
        draggable={false}
        centerMode={false}
        additionalTransfrom={0}
        arrows
        autoPlaySpeed={3000}
        className=""
        containerClass="container"
        dotListClass=""
        focusOnSelect={false}
        infinite
        itemClass=""
        keyBoardControl
        minimumTouchDrag={80}
        partialVisible
        pauseOnHover
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        sliderClass=""
        slidesToSlide={1}
        swipeable
      >
        {products.map((result, index) => (
          <div key={index} className="mx-1 w-55">
            <div className="w-full h-35 overflow-hidden rounded-md shadow-md">
              <a href={result.data?.urllink} target="_blank">

                <img
                  src={`${PRODUCT_IMAGE_BASE_URL}/${result.data?.id}.png`}
                  alt={`Thumbnail of ${result.data?.title}`}
                  className="w-full h-full object-cover"
                />
              </a>

            </div>
            <span className="block mt-2 text-left text-sm">
              {result.data?.title}
            </span>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
