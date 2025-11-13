/**
 * Utility functions for working with course data
 */

import type {
  CourseConfig,
  CourseSchedule,
  DateString,
  DayOfWeek,
  ScheduleEntry,
  LectureMapping,
  Assignment,
} from './types';

/**
 * Get schedule entries for a specific date
 */
export function getEntriesForDate(
  schedule: CourseSchedule,
  date: DateString
): ScheduleEntry[] {
  return schedule.allEntries.filter((entry) => entry.date === date);
}

/**
 * Get schedule entries for a specific date range
 */
export function getEntriesForDateRange(
  schedule: CourseSchedule,
  startDate: DateString,
  endDate: DateString
): ScheduleEntry[] {
  return schedule.allEntries.filter(
    (entry) => entry.date >= startDate && entry.date <= endDate
  );
}

/**
 * Get all dates when a specific lecture is covered
 */
export function getDatesForLecture(
  schedule: CourseSchedule,
  lectureId: string
): ScheduleEntry[] {
  return schedule.allEntries.filter(
    (entry) => entry.lecture?.lectureId === lectureId
  );
}

/**
 * Get upcoming class meetings (from today or a specific date)
 */
export function getUpcomingMeetings(
  schedule: CourseSchedule,
  fromDate?: DateString,
  limit?: number
): ScheduleEntry[] {
  const today = fromDate || new Date().toISOString().split('T')[0];
  const upcoming = schedule.allEntries.filter((entry) => entry.date >= today);
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Get recently past class meetings
 */
export function getRecentMeetings(
  schedule: CourseSchedule,
  fromDate?: DateString,
  limit: number = 5
): ScheduleEntry[] {
  const today = fromDate || new Date().toISOString().split('T')[0];
  const past = schedule.allEntries.filter((entry) => entry.date < today);
  return past.slice(-limit);
}

/**
 * Get all assignments due within a date range
 */
export function getAssignmentsDueInRange(
  config: CourseConfig,
  startDate: DateString,
  endDate: DateString
): Assignment[] {
  if (!config.assignments) return [];
  return config.assignments.filter(
    (assignment) =>
      assignment.dueDate >= startDate && assignment.dueDate <= endDate
  );
}

/**
 * Get upcoming assignments (due from today or a specific date)
 */
export function getUpcomingAssignments(
  config: CourseConfig,
  fromDate?: DateString,
  limit?: number
): Assignment[] {
  if (!config.assignments) return [];
  const today = fromDate || new Date().toISOString().split('T')[0];
  const upcoming = config.assignments
    .filter((assignment) => assignment.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Get the current week's schedule entries
 */
export function getCurrentWeekSchedule(
  schedule: CourseSchedule,
  referenceDate?: DateString
): ScheduleEntry[] {
  const today = referenceDate
    ? new Date(referenceDate)
    : new Date();
  
  // Find the start of the week (Sunday)
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  
  // Find the end of the week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startDateStr = startOfWeek.toISOString().split('T')[0];
  const endDateStr = endOfWeek.toISOString().split('T')[0];
  
  return getEntriesForDateRange(schedule, startDateStr, endDateStr);
}

/**
 * Get statistics about the course
 */
export interface CourseStats {
  totalMeetings: number;
  meetingsBySection: { [sectionId: string]: number };
  totalLectures: number;
  totalAssignments: number;
  totalHolidays: number;
  courseWeeks: number;
  averageMeetingsPerWeek: number;
}

export function getCourseStats(schedule: CourseSchedule): CourseStats {
  const config = schedule.config;
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const courseWeeks = Math.ceil(daysDiff / 7);
  
  const meetingsBySection: { [sectionId: string]: number } = {};
  for (const sectionId in schedule.scheduleBySection) {
    meetingsBySection[sectionId] = schedule.scheduleBySection[sectionId].length;
  }
  
  return {
    totalMeetings: schedule.allEntries.length,
    meetingsBySection,
    totalLectures: config.lectures.length,
    totalAssignments: config.assignments?.length || 0,
    totalHolidays: config.holidays.length,
    courseWeeks,
    averageMeetingsPerWeek: schedule.allEntries.length / courseWeeks,
  };
}

/**
 * Find gaps in the lecture schedule (dates with meetings but no lecture assigned)
 */
export function findUnassignedMeetings(schedule: CourseSchedule): ScheduleEntry[] {
  return schedule.allEntries.filter(
    (entry) => !entry.isCancelled && !entry.lecture
  );
}

/**
 * Find overlapping lectures (same lecture on multiple sections' different dates)
 */
export function findLectureOverlaps(schedule: CourseSchedule): LectureMapping[] {
  const lectureMap = new Map<string, Set<string>>();
  
  for (const entry of schedule.allEntries) {
    if (entry.lecture) {
      const dates = lectureMap.get(entry.lecture.lectureId) || new Set();
      dates.add(entry.date);
      lectureMap.set(entry.lecture.lectureId, dates);
    }
  }
  
  return schedule.config.lectures.filter((lecture) => {
    const dates = lectureMap.get(lecture.lectureId);
    return dates && dates.size > 1;
  });
}

/**
 * Format a date in a readable format
 */
export function formatDate(
  date: DateString,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Date(date).toLocaleDateString('en-US', options || {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a time string for display
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get the academic week number
 */
export function getAcademicWeek(
  date: DateString,
  courseStartDate: DateString
): number {
  const start = new Date(courseStartDate);
  const current = new Date(date);
  const daysDiff = Math.ceil(
    (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.ceil(daysDiff / 7);
}

/**
 * Check if a date is a class meeting day
 */
export function isMeetingDay(
  schedule: CourseSchedule,
  date: DateString,
  sectionId?: string
): boolean {
  const entries = getEntriesForDate(schedule, date);
  if (sectionId) {
    return entries.some(
      (entry) => entry.sectionId === sectionId && !entry.isCancelled
    );
  }
  return entries.some((entry) => !entry.isCancelled);
}

/**
 * Get progress through the semester (0 to 1)
 */
export function getSemesterProgress(
  config: CourseConfig,
  referenceDate?: DateString
): number {
  const today = referenceDate ? new Date(referenceDate) : new Date();
  const start = new Date(config.startDate);
  const end = new Date(config.endDate);
  
  if (today < start) return 0;
  if (today > end) return 1;
  
  const total = end.getTime() - start.getTime();
  const elapsed = today.getTime() - start.getTime();
  
  return elapsed / total;
}

/**
 * Group schedule entries by week
 */
export function groupByWeek(
  entries: ScheduleEntry[]
): Map<number, ScheduleEntry[]> {
  const weeks = new Map<number, ScheduleEntry[]>();
  
  if (entries.length === 0) return weeks;
  
  const courseStartDate = entries[0].date;
  
  for (const entry of entries) {
    const week = getAcademicWeek(entry.date, courseStartDate);
    const weekEntries = weeks.get(week) || [];
    weekEntries.push(entry);
    weeks.set(week, weekEntries);
  }
  
  return weeks;
}

/**
 * Convert schedule to iCalendar format
 */
export function scheduleToICalendar(
  schedule: CourseSchedule,
  sectionId?: string
): string {
  const entries = sectionId
    ? schedule.scheduleBySection[sectionId]
    : schedule.allEntries;
  
  let ical = 'BEGIN:VCALENDAR\r\n';
  ical += 'VERSION:2.0\r\n';
  ical += `PRODID:-//Classasaurus//Course Schedule//EN\r\n`;
  ical += `X-WR-CALNAME:${schedule.config.courseCode}\r\n`;
  ical += `X-WR-TIMEZONE:${schedule.config.timezone || 'America/New_York'}\r\n`;
  
  for (const entry of entries) {
    if (entry.isCancelled) continue;
    
    const dateStr = entry.date.replace(/-/g, '');
    const startTime = entry.meeting.startTime.replace(':', '');
    const endTime = entry.meeting.endTime.replace(':', '');
    
    const title = entry.lecture?.title || entry.lecture?.lectureId || `${schedule.config.courseCode} Class`;
    const location = entry.meeting.location || '';
    
    ical += 'BEGIN:VEVENT\r\n';
    ical += `DTSTART:${dateStr}T${startTime}00\r\n`;
    ical += `DTEND:${dateStr}T${endTime}00\r\n`;
    ical += `SUMMARY:${title}\r\n`;
    if (location) {
      ical += `LOCATION:${location}\r\n`;
    }
    if (entry.notes) {
      ical += `DESCRIPTION:${entry.notes}\r\n`;
    }
    ical += `UID:${entry.date}-${entry.sectionId}-${entry.meetingNumber}@classasaurus\r\n`;
    ical += 'END:VEVENT\r\n';
  }
  
  ical += 'END:VCALENDAR\r\n';
  return ical;
}

/**
 * Extract level 2 headings from markdown content
 */
export function extractHeadings(markdown: string): Array<{ text: string; id: string }> {
  const headings: Array<{ text: string; id: string }> = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    // Match level 2 headings (## Heading text)
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const text = match[1].trim();
      // Generate Docusaurus-style anchor ID (lowercase, replace spaces with hyphens, remove special chars)
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      headings.push({ text, id });
    }
  }
  
  return headings;
}

/**
 * Format a date string for display
 */
export function formatDateDisplay(dateStr: DateString): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generate anchor ID from heading text (Docusaurus-style)
 */
export function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

