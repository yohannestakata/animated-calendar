import {
  format,
  parse,
  startOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfMonth,
  endOfWeek,
  isSameMonth,
} from "date-fns";
import { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import useMeasure from "react-use-measure";

function App() {
  const [direction, setDirection] = useState(1);
  const [monthString, setMonthString] = useState(format(new Date(), "yyyy-MM"));
  const [isAnimating, setIsAnimating] = useState(false);
  const month = parse(monthString, "yyyy-MM", new Date());

  function nextMonth() {
    if (isAnimating) return;

    const nextMonth = addMonths(month, 1);
    setMonthString(format(nextMonth, "yyyy-MM"));
    setDirection(1);
    setIsAnimating(true);
  }

  function previousMonth() {
    if (isAnimating) return;

    const previousMonth = subMonths(month, 1);
    setMonthString(format(previousMonth, "yyyy-MM"));
    setDirection(-1);
    setIsAnimating(true);
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  return (
    <MotionConfig transition={transition}>
      <div className="flex h-screen w-screen items-start justify-center pt-16">
        <div className="relative w-sm overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
          <ResizablePannel>
            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={direction}
              onExitComplete={() => setIsAnimating(false)}
            >
              <motion.div
                key={monthString}
                initial="initial"
                animate="medium"
                exit="exit"
              >
                <header className="relative flex items-center justify-between px-6 pt-6">
                  <motion.button
                    className="z-10 cursor-pointer rounded-full p-2"
                    onClick={previousMonth}
                    whileHover={{
                      backgroundColor: "#3f3f46",
                      scale: 1.2,
                    }}
                    whileTap={{
                      scale: 1.1,
                    }}
                    transition={{
                      type: "tween",
                      ease: "easeOut",
                      duration: 0.1,
                    }}
                  >
                    <ChevronLeft />
                  </motion.button>
                  <motion.span
                    variants={variants}
                    className="absolute inset-0 flex items-center justify-center pt-6 text-lg font-semibold"
                    custom={direction}
                  >
                    {format(month, "MMM yyyy")}
                  </motion.span>
                  <motion.button
                    className="z-10 cursor-pointer rounded-full p-2"
                    onClick={nextMonth}
                    whileHover={{
                      backgroundColor: "#3f3f46",
                      scale: 1.2,
                    }}
                    whileTap={{
                      scale: 1.1,
                    }}
                    transition={{
                      type: "tween",
                      ease: "easeOut",
                      duration: 0.1,
                    }}
                  >
                    <ChevronRight />
                  </motion.button>

                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #18181b 15%, transparent 30%,transparent 70%, #18181b 85%)",
                    }}
                  ></div>
                </header>

                <div className="grid grid-cols-7 items-center justify-items-center gap-y-6 px-6 pt-6">
                  <span className="font-semibold text-zinc-400">Sun</span>
                  <span className="font-semibold text-zinc-400">Mon</span>
                  <span className="font-semibold text-zinc-400">Tue</span>
                  <span className="font-semibold text-zinc-400">Wed</span>
                  <span className="font-semibold text-zinc-400">Thu</span>
                  <span className="font-semibold text-zinc-400">Fri</span>
                  <span className="font-semibold text-zinc-400">Sat</span>
                </div>

                <motion.div
                  variants={variants}
                  className="grid grid-cols-7 items-center justify-items-center gap-y-6 p-6"
                  custom={direction}
                >
                  {days.map((day) => (
                    <span
                      className={`${isSameMonth(month, day) ? "" : "text-zinc-700"} font-semibold`}
                      key={format(day, "yyyy-MM-dd")}
                    >
                      {format(day, "dd")}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </ResizablePannel>
        </div>
      </div>
    </MotionConfig>
  );
}

function ResizablePannel({ children }: { children: React.ReactNode }) {
  const [ref, bounds] = useMeasure();

  return (
    <motion.div
      animate={{ height: bounds.height > 0 ? bounds.height : "auto" }}
      transition={transition}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}

const transition = { type: "spring", bounce: 0, duration: 0.2 };

const variants = {
  initial: (direction: number) => ({
    x: `${direction * 100}%`,
    opacity: 0,
  }),
  medium: {
    x: "0%",
    scale: 1,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: `${direction * -100}%`,
    opacity: 0,
  }),
};

export default App;
