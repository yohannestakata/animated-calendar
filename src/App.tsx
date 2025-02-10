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
  const [ref, bounds] = useMeasure();
  const month = parse(monthString, "yyyy-MM", new Date());

  function nextMonth() {
    const nextMonth = addMonths(month, 1);
    setMonthString(format(nextMonth, "yyyy-MM"));
    setDirection(1);
  }

  function previousMonth() {
    const previousMonth = subMonths(month, 1);
    setMonthString(format(previousMonth, "yyyy-MM"));
    setDirection(-1);
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  return (
    <MotionConfig transition={{ duration: 0.7, type: "spring", bounce: 0 }}>
      <div className="flex h-screen w-screen items-start justify-center pt-16">
        <div className="relative w-sm overflow-hidden rounded-xl border border-zinc-700">
          <motion.div
            animate={{ height: bounds.height > 0 ? bounds.height : "auto" }}
          >
            <div ref={ref}>
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
              >
                <motion.div
                  key={monthString}
                  initial="initial"
                  animate="medium"
                  exit="exit"
                >
                  <header className="relative flex items-center justify-between px-6 pt-6">
                    <button
                      className="z-10 cursor-pointer rounded-full p-2 duration-200 ease-out hover:bg-zinc-800"
                      onClick={previousMonth}
                    >
                      <ChevronLeft />
                    </button>
                    <motion.span
                      variants={variants}
                      className="absolute inset-0 flex items-center justify-center pt-6 text-lg font-semibold"
                      custom={direction}
                    >
                      {format(month, "MMMM yyyy")}
                    </motion.span>
                    <button
                      className="z-10 cursor-pointer rounded-full p-2 duration-200 ease-out hover:bg-zinc-800"
                      onClick={nextMonth}
                    >
                      <ChevronRight />
                    </button>

                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #09090b 15%, transparent 30%,transparent 70%, #09090b 85%)",
                      }}
                    ></div>
                  </header>

                  <div className="grid grid-cols-7 items-center justify-items-center gap-y-6 px-6 pt-6">
                    <span className="font-semibold text-zinc-400">Su</span>
                    <span className="font-semibold text-zinc-400">Mo</span>
                    <span className="font-semibold text-zinc-400">Tu</span>
                    <span className="font-semibold text-zinc-400">We</span>
                    <span className="font-semibold text-zinc-400">Th</span>
                    <span className="font-semibold text-zinc-400">Fr</span>
                    <span className="font-semibold text-zinc-400">Sa</span>
                  </div>

                  <motion.div
                    variants={variants}
                    className="grid grid-cols-7 items-center justify-items-center gap-y-6 p-6"
                    custom={direction}
                  >
                    {days.map((day) => (
                      <motion.span
                        className={`${isSameMonth(month, day) ? "" : "text-zinc-600"} font-semibold`}
                        key={format(day, "yyyy-MM-dd")}
                        whileHover={{ scale: 1.3, cursor: "pointer" }}
                        transition={{ duration: 0.2 }}
                      >
                        {format(day, "dd")}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}

const variants = {
  initial: (direction: number) => ({
    x: `${direction * 100}%`,
    opacity: 0.3,
  }),
  medium: {
    x: "0%",
    scale: 1,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: `${direction * -100}%`,
    opacity: 0.3,
  }),
};

export default App;
