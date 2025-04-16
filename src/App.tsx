import {
  differenceInCalendarWeeks,
  isBefore,
  parseISO,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";

const USM_START_DATE = parseISO("2025-03-24"); // Monday of Week 1
const USM_END_DATE = parseISO("2025-08-03"); // Sunday of Week 19
const MID_SEM_BREAK_WEEK = 8;
const STUDY_WEEK = 16;

export default function App() {
  const today = new Date();
  const formattedToday = format(today, "EEEE, dd MMMM yyyy");

  let weekInfo = null;
  let additionalMessage = null;

  if (isBefore(today, USM_START_DATE)) {
    weekInfo = (
      <>
        <div className="text-sm text-gray-700">It is currently...</div>
        <div className="text-3xl font-bold my-2">Semester not started</div>
        <div className="text-md text-gray-600">
          Semester starts on 24 March 2025
        </div>
      </>
    );
    document.title = "Semester not started";
  } else if (!isBefore(today, USM_END_DATE)) {
    weekInfo = (
      <>
        <div className="text-sm text-gray-700">It is currently...</div>
        <div className="text-3xl font-bold my-2">Semester ended!</div>
        <div className="text-md text-gray-600">
          Semester ended on 3 August 2025
        </div>
      </>
    );
    document.title = "Semester ended!";
  } else {
    const currentWeek =
      differenceInCalendarWeeks(today, USM_START_DATE, { weekStartsOn: 1 }) + 1;
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const formattedRange = `${format(weekStart, "dd MMMM")} - ${format(
      weekEnd,
      "dd MMMM yyyy"
    )}`;

    // Determine additional message
    if (currentWeek < MID_SEM_BREAK_WEEK) {
      const weeksUntilBreak = MID_SEM_BREAK_WEEK - currentWeek;
      additionalMessage = (
        <>
          {weeksUntilBreak} week{weeksUntilBreak > 1 ? "s" : ""} until mid-semester break
        </>
      );
    } else if (currentWeek === MID_SEM_BREAK_WEEK) {
      additionalMessage = <>Enjoy your break!</>;
    } else if (currentWeek < STUDY_WEEK) {
      const weeksUntilStudyWeek = STUDY_WEEK - currentWeek;
      additionalMessage = (
        <>
          {weeksUntilStudyWeek} week{weeksUntilStudyWeek > 1 ? "s" : ""} until study week
        </>
      );
    } else if (currentWeek === STUDY_WEEK) {
      additionalMessage = <>Get studying!</>;
    } else {
      additionalMessage = <>Good luck!</>;
    }

    weekInfo = (
      <>
        <div className="text-sm text-gray-700">It is currently...</div>
        <div className="text-5xl font-bold my-2">Week {currentWeek}</div>
        <div className="text-md text-gray-600">{formattedRange}</div>
      </>
    );
    document.title = `Week ${currentWeek} at USM`;
  }

  return (
    <div className="px-4 min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="py-8 px-16 shadow-lg rounded-2xl text-center space-y-4 bg-white">
        <div className="text-md text-gray-600">
          Today is <span className="font-bold">{formattedToday}</span>
        </div>
        <div className="py-6">{weekInfo}</div>
        <div className="gap-1 flex flex-col justify-center text-xs">{additionalMessage}</div>
      </div>
    </div>
  );
}
