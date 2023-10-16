import { cx } from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "../Icons/Chevron";
import { Button } from "../Buttons";

export const VideoDescription = ({
  description,
  linesToShow = 3,
}: {
  description: string;
  linesToShow?: number;
}) => {
  const divRef = useRef<null | HTMLParagraphElement>(null);
  const [isAllVisible, setIsAllVisible] = useState(false);
  const [alreadyAllShow, setAlreadyAllShow] = useState(false);
  const maxHeight = (linesToShow ?? 5) * 1.7;

  useEffect(() => {
    if (!divRef.current) return;
    if (divRef.current.clientHeight < divRef.current.scrollHeight) {
      setAlreadyAllShow(false);
    } else {
      setAlreadyAllShow(true);
    }
  }, [linesToShow, description]);

  return (
    <div
      ref={divRef}
      className="relative mt-2
        overflow-hidden pb-[3em] text-sm leading-6 text-gray-600"
      style={{
        maxHeight: isAllVisible
          ? divRef.current?.scrollHeight
          : `${maxHeight}em`,
        transition: "max-height 0.5s cubic-bezier(0, 1, 0, 1)",
      }}
    >
      {description}

      <div
        aria-hidden={true}
        className={cx([
          "absolute bottom-0 flex h-[4em] w-full items-end justify-center bg-gradient-to-t  to-transparent text-center",
          !isAllVisible ? "from-white" : "from-transparent",
          alreadyAllShow ? "hidden" : "",
        ])}
      >
        <Button
          variant="tertiary-gray"
          onClick={() => setIsAllVisible(!isAllVisible)}
          className={`transition-all ${
            !isAllVisible ? "rotate-0" : "rotate-180"
          }`}
        >
          <ChevronDown />
          <span className="sr-only">
            {isAllVisible ? "Show Less" : "Show More"}
          </span>
        </Button>
      </div>
    </div>
  );
};
