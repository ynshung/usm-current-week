import React, { useState, useEffect } from "react";
import {
  differenceInCalendarWeeks,
  isBefore,
  parseISO,
  startOfWeek,
  endOfWeek,
  format, // Make sure format is imported
} from "date-fns";

// ... (Keep constants USM_START_DATE, etc.)
const USM_START_DATE = parseISO("2025-03-24");
const USM_END_DATE = parseISO("2025-08-03");
const MID_SEM_BREAK_WEEK = 8;
const STUDY_WEEK = 16;

export default function App() {
  const today = new Date();
  // Format today's date as YYYY-MM-DD for the input default value
  const todayString = format(today, "yyyy-MM-dd");

  // Initialize the state with today's date string
  const [selectedDate, setSelectedDate] = useState(todayString);

  // --- The rest of the component logic remains largely the same ---

  // Handle potential parsing errors if selectedDate becomes invalid (though unlikely with type="date")
  let effectiveDate;
  try {
    effectiveDate = selectedDate ? parseISO(selectedDate) : today;
  } catch (error) {
    console.error("Error parsing date:", selectedDate, error);
    effectiveDate = today; // Fallback to today on error
    // Optionally reset selectedDate state here if parse fails
    // setSelectedDate(todayString);
  }

  // Format the date being used (either today or selected date)
  const formattedEffectiveDate = format(effectiveDate, "EEEE, dd MMMM yyyy");
  // This label logic still works: If selectedDate has a value (which it now does initially),
  // it will reflect that value. If cleared, it reverts to showing "Today is".
  const labelText =
    selectedDate === todayString ? "Today's date is" : "Showing info for";

  let weekInfo = null;
  let additionalMessage = null;
  let pageTitle = "USM Week Calculator"; // Default title

  // --- Calculate Week Info based on effectiveDate ---
  // This calculation logic does not need to change
  if (isBefore(effectiveDate, USM_START_DATE)) {
    weekInfo = (
      <>
        <div className="text-sm text-gray-700">On this date...</div>
        <div className="text-3xl font-bold my-2">Semester not started</div>
        <div className="text-md text-gray-600">
          Semester starts on 24 March 2025
        </div>
      </>
    );
    pageTitle = "Semester not started";
  } else if (isBefore(USM_END_DATE, effectiveDate)) {
    weekInfo = (
      <>
        <div className="text-sm text-gray-700">On this date...</div>
        <div className="text-3xl font-bold my-2">Semester ended!</div>
        <div className="text-md text-gray-600">
          Semester ended on 3 August 2025
        </div>
      </>
    );
    pageTitle = "Semester ended!";
  } else {
    const currentWeek =
      differenceInCalendarWeeks(effectiveDate, USM_START_DATE, {
        weekStartsOn: 1, // Monday
      }) + 1;

    const weekStart = startOfWeek(effectiveDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(effectiveDate, { weekStartsOn: 1 });
    const formattedRange = `${format(weekStart, "dd MMMM")} - ${format(
      weekEnd,
      "dd MMMM yyyy"
    )}`;

    // Determine additional message (no changes needed here)
    if (currentWeek < MID_SEM_BREAK_WEEK) {
      const weeksUntilBreak = MID_SEM_BREAK_WEEK - currentWeek;
      additionalMessage = (
        <>
          {weeksUntilBreak} week{weeksUntilBreak > 1 ? "s" : ""} until
          mid-semester break
        </>
      );
    } else if (currentWeek === MID_SEM_BREAK_WEEK) {
      additionalMessage = <>Mid-Semester Break!</>;
    } else if (currentWeek < STUDY_WEEK) {
      const weeksUntilStudyWeek = STUDY_WEEK - currentWeek;
      additionalMessage = (
        <>
          {weeksUntilStudyWeek} week{weeksUntilStudyWeek > 1 ? "s" : ""} until
          study week
        </>
      );
    } else if (currentWeek === STUDY_WEEK) {
      additionalMessage = <>It's study week. Get studying!</>;
    } else {
      // Weeks 17, 18, 19 are exam weeks
      additionalMessage = <>It's exam week. Good luck!</>;
    }

    weekInfo = (
      <>
        <div className="text-sm text-gray-700">
          {selectedDate === todayString ? "Today is" : "On this date, it is..."}
        </div>
        <div className="text-5xl font-bold my-2">Week {currentWeek}</div>
        <div className="text-md text-gray-600">{formattedRange}</div>
      </>
    );
    pageTitle = `Week ${currentWeek} at USM`;
  }
  // --- End Calculate Week Info ---

  // Update document title when pageTitle changes
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate: string = event.target.value || todayString;
    const parsedDate: Date = parseISO(newDate);

    // Ensure the selected date is within the year 2025
    if (parsedDate.getFullYear() === 2025) {
      setSelectedDate(newDate);
    } else {
      alert("Please select a date within the year 2025.");
      // Optionally reset to a valid date or keep the previous state
      // For example, reset to today if the selected date is invalid:
      // setSelectedDate(todayString);
    }
  };
  // Decide if the "Clear" button should actually function as "Reset to Today"
  // Let's rename the button and handler for clarity if it resets to today
  const handleResetToToday = () => {
    setSelectedDate(todayString);
  };

  return (
    <div className="px-4 min-h-dvh flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="py-8 px-4 md:px-12 shadow-lg rounded-2xl text-center space-y-4 bg-white w-full max-w-md">
        {/* Date Input Row */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <label
            htmlFor="date-select"
            className="text-sm text-gray-700 sr-only"
          >
            Select a date:
          </label>
          <input
            id="date-select"
            type="date"
            value={selectedDate} // Controlled by state, which is initialized to todayString
            onChange={handleDateChange}
            min="2025-01-01" // Set minimum date to 1 January 2025
            max="2025-12-31" // Set maximum date to 31 December 2025
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleResetToToday} // Changed handler name
            // Disable if the currently selected date *is* today
            disabled={selectedDate === todayString}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              selectedDate !== todayString // Enable only if date is different from today
                ? "bg-blue-500 hover:bg-blue-600 text-white" // Style for "Reset"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            aria-label="Reset date to today" // Updated accessibility label
          >
            Reset {/* Changed button text */}
          </button>
        </div>
        {/* Date Display */}
        <div className="text-md text-gray-600">
          {/* Changed label slightly for clarity when default is today */}
          {labelText}{" "}
          <span className="font-bold">{formattedEffectiveDate}</span>
        </div>

        {/* Week Info Display */}
        <div className="pt-8 pb-12">{weekInfo}</div>

        {/* Additional Message Display */}
        <div className="gap-1 flex flex-col justify-center text-xs min-h-[1.5em]">
          {additionalMessage}
        </div>
      </div>
    </div>
  );
}
