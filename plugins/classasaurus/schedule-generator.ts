/**
 * Schedule generation utilities
 */

import { parseISO, format as formatDateFns, addDays, isWithinInterval, getDay } from 'date-fns';
import type {
  CourseConfig,
  CourseSchedule,
  CourseSection,
  DateString,
  DayOfWeek,
  Holiday,
  Lab,
  LectureMapping,
  MeetingPattern,
  ScheduleEntry,
} from './types';

/**
 * Get day of week from date
 */
function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[getDay(date)];
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): DateString {
  return formatDateFns(date, 'yyyy-MM-dd');
}

/**
 * Check if a date is a holiday
 */
function isHoliday(date: DateString, holidays: Holiday[]): Holiday | undefined {
  const checkDate = parseISO(date);
  return holidays.find((holiday) => {
    if (holiday.endDate) {
      // Multi-day holiday - check if date is within the range
      return isWithinInterval(checkDate, {
        start: parseISO(holiday.date),
        end: parseISO(holiday.endDate)
      });
    }
    return date === holiday.date;
  });
}

/**
 * Generate all class meeting dates for a section (including holidays)
 */
function generateMeetingDates(
  section: CourseSection,
  courseStartDate: DateString,
  courseEndDate: DateString,
  holidays: Holiday[]
): Map<DateString, MeetingPattern> {
  const startDate = parseISO(section.startDate || courseStartDate);
  const endDate = parseISO(section.endDate || courseEndDate);
  const meetingDates = new Map<DateString, MeetingPattern>();
  
  // Iterate through each day in the date range
  let currentDate = startDate;
  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate);
    const dayOfWeek = getDayOfWeek(currentDate);
    
    // Check if there's a meeting on this day of week
    for (const meeting of section.meetings) {
      if (meeting.days.includes(dayOfWeek)) {
        // Include all meeting days, even if they fall on holidays
        // (holidays will be marked as cancelled in the schedule entries)
        meetingDates.set(dateStr, meeting);
      }
    }
    
    // Move to next day
    currentDate = addDays(currentDate, 1);
  }
  
  return meetingDates;
}

/**
 * Find lecture for a given date
 */
function findLectureForDate(
  date: DateString,
  sectionId: string,
  lectures: LectureMapping[]
): LectureMapping | undefined {
  return lectures.find((lecture) => {
    // Check if this lecture is for this date
    if (!lecture.dates.includes(date)) {
      return false;
    }
    
    // Check if lecture is section-specific
    if (lecture.sections && lecture.sections.length > 0) {
      return lecture.sections.includes(sectionId);
    }
    
    // Lecture applies to all sections
    return true;
  });
}

/**
 * Find lab for a given date
 */
function findLabForDate(
  date: DateString,
  sectionId: string,
  labs: Lab[]
): Lab | undefined {
  if (!labs || labs.length === 0) return undefined;
  
  return labs.find((lab) => {
    // Check if this lab is for this date
    if (!lab.dates.includes(date)) {
      return false;
    }
    
    // Check if lab is section-specific
    if (lab.sections && lab.sections.length > 0) {
      return lab.sections.includes(sectionId);
    }
    
    // Lab applies to all sections
    return true;
  });
}

/**
 * Generate schedule for a single section
 */
function generateSectionSchedule(
  section: CourseSection,
  config: CourseConfig
): ScheduleEntry[] {
  const allHolidays = [
    ...config.holidays,
    ...(section.additionalHolidays || []),
  ];
  
  const meetingDates = generateMeetingDates(
    section,
    config.startDate,
    config.endDate,
    allHolidays
  );
  
  const schedule: ScheduleEntry[] = [];
  let meetingNumber = 1;
  
  // Sort dates chronologically
  const sortedDates = Array.from(meetingDates.keys()).sort();
  
  for (const date of sortedDates) {
    const meeting = meetingDates.get(date)!;
    const dateObj = parseISO(date);
    const holiday = isHoliday(date, allHolidays);
    const lecture = findLectureForDate(date, section.id, config.lectures);
    const lab = findLabForDate(date, section.id, config.labs || []);
    
    const entry: ScheduleEntry = {
      date,
      dayOfWeek: getDayOfWeek(dateObj),
      meetingNumber: meetingNumber++,
      sectionId: section.id,
      sectionName: section.name,
      meeting,
      lecture,
      lab,
      holiday,
      isCancelled: !!holiday,
    };
    
    schedule.push(entry);
  }
  
  return schedule;
}

/**
 * Generate complete course schedule
 */
export function generateSchedule(config: CourseConfig): CourseSchedule {
  const scheduleBySection: { [sectionId: string]: ScheduleEntry[] } = {};
  const allEntries: ScheduleEntry[] = [];
  
  // Generate schedule for each section
  for (const section of config.sections) {
    const sectionSchedule = generateSectionSchedule(section, config);
    scheduleBySection[section.id] = sectionSchedule;
    allEntries.push(...sectionSchedule);
  }
  
  // Sort all entries by date
  allEntries.sort((a, b) => a.date.localeCompare(b.date));
  
  // Extract important dates
  const examDates = config.holidays
    .filter((h) => h.type === 'exam-period')
    .map((h) => h.date);
  
  const assignmentDueDates = (config.assignments || []).map((a) => a.dueDate);
  
  return {
    config,
    scheduleBySection,
    allEntries,
    importantDates: {
      startDate: config.startDate,
      endDate: config.endDate,
      holidays: config.holidays,
      examDates,
      assignmentDueDates,
    },
  };
}

/**
 * Export schedule to various formats
 */
export function exportScheduleToJSON(schedule: CourseSchedule): string {
  return JSON.stringify(schedule, null, 2);
}

/**
 * Generate a markdown table for the schedule
 */
export function exportScheduleToMarkdown(
  schedule: CourseSchedule,
  sectionId?: string
): string {
  const entries = sectionId
    ? schedule.scheduleBySection[sectionId]
    : schedule.allEntries;
  
  let markdown = '# Course Schedule\n\n';
  markdown += `**Course:** ${schedule.config.courseCode} - ${schedule.config.courseTitle}\n\n`;
  markdown += `**Semester:** ${schedule.config.semester}\n\n`;
  
  markdown += '| # | Date | Day | Topic | Notes |\n';
  markdown += '|---|------|-----|-------|-------|\n';
  
  for (const entry of entries) {
    const date = new Date(entry.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    let topic = entry.lecture?.title || entry.lecture?.lectureId || '';
    let notes = entry.holiday?.name || entry.notes || '';
    
    if (entry.isCancelled) {
      topic = '~~' + (topic || 'Class') + '~~';
      notes = entry.holiday?.name || 'No class';
    }
    
    markdown += `| ${entry.meetingNumber} | ${date} | ${entry.dayOfWeek.slice(0, 3)} | ${topic} | ${notes} |\n`;
  }
  
  return markdown;
}

