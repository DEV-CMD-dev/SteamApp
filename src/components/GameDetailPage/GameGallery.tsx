import { useEffect, useRef, useState } from "react";
import "../../css/gameGallery.css";
import arrowLeft from "../../assets/detail-page/arrow-left.png";
import arrowRight from "../../assets/detail-page/arrow-right.png";

type GameGalleryProps = {
  slides: string[] | null | undefined;
  title: string;
};

export default function GameGallery({
  slides: rawSlides,
  title,
}: GameGalleryProps) {
  const slides = (rawSlides ?? []).filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const goPrev = () => {
    setActiveIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  };

  const goNext = () => {
    setActiveIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    const container = thumbsRef.current;
    const activeThumb = thumbRefs.current[activeIndex];

    if (!container || !activeThumb) return;

    const containerLeft = container.scrollLeft;
    const containerRight = containerLeft + container.clientWidth;

    const thumbLeft = activeThumb.offsetLeft;
    const thumbRight = thumbLeft + activeThumb.offsetWidth;

    if (thumbRight > containerRight) {
      container.scrollTo({
        left: thumbLeft,
        behavior: "smooth",
      });
    } else if (thumbLeft < containerLeft) {
      container.scrollTo({
        left: thumbRight - container.clientWidth,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);


  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="game-gallery">

      <div className="gallery-hero">
        <img src={slides[activeIndex]} alt={title} />
      </div>

      <div className="gallery-thumbs-wrapper">

        <button
          className="gallery-thumbs-arrow gallery-thumbs-arrow-left"
          onClick={goPrev}
          aria-label="Previous screenshot"
        >
          <img src={arrowRight} alt="" />
        </button>

        <div className="gallery-thumbs" ref={thumbsRef}>

          {slides.map((src, index) => (
            <button
              key={index}
              ref={(el) => {
                thumbRefs.current[index] = el;
              }}
              className={`gallery-thumb ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={src} alt={`${title} screenshot ${index + 1}`} />
            </button>
          ))}

        </div>

        <button
          className="gallery-thumbs-arrow gallery-thumbs-arrow-right"
          onClick={goNext}
          aria-label="Next screenshot"
        >
          <img src={arrowLeft} alt="" />
        </button>

      </div>

    </div>
  );
}