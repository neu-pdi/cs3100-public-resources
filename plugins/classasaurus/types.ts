/**
 * Classasaurus Plugin Types
 * 
 * Type definitions for course configuration and scheduling
 */

/**
 * Day of the week for class meetings
 */
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

/**
 * Time in 24-hour format (HH:MM)
 */
export type TimeString = string; // Format: "HH:MM" (e.g., "09:50", "15:30")

/**
 * Date in ISO format (YYYY-MM-DD)
 */
export type DateString = string; // Format: "YYYY-MM-DD" (e.g., "2026-01-12")

/**
 * Semester identifier
 */
export type Semester = `${'Spring' | 'Summer' | 'Fall'} ${number}`; // e.g., "Spring 2026"

/**
 * Meeting pattern for a class section
 */
export interface MeetingPattern {
  /** Type of meeting: lecture, lab, recitation, etc. */
  type?: 'lecture' | 'lab' | 'recitation' | 'studio' | 'other';
  
  /** Days of the week when class meets */
  days: DayOfWeek[];
  
  /** Start time of the class */
  startTime: TimeString;
  
  /** End time of the class */
  endTime: TimeString;
  
  /** Optional location/room */
  location?: string;
  
  /** Optional notes about the meeting (e.g., "Lab section") */
  notes?: string;
}

/**
 * A course section with its own schedule
 */
export interface CourseSection {
  /** Unique identifier for the section (e.g., "01", "02", "honors") */
  id: string;
  
  /** Human-readable section name */
  name: string;
  
  /** CRN or other registration identifier */
  crn?: string;
  
  /** Meeting pattern(s) for this section */
  meetings: MeetingPattern[];

  /** Timezone for the section, all times for lectures are in this timezone */
  timeZone: string;
  
  /** Instructor(s) for this section */
  instructors?: string[];
  
  /** Override dates for this specific section if different from course defaults */
  startDate?: DateString;
  endDate?: DateString;
  
  /** Section-specific holidays/cancellations (in addition to course-wide ones) */
  additionalHolidays?: Holiday[];
}

/**
 * Type of special date/holiday
 */
export type HolidayType = 
  | 'holiday'           // University holiday (no class)
  | 'break'             // Multi-day break
  | 'reading-day'       // Reading day
  | 'exam-period'       // Exam period
  | 'no-class'          // Instructor cancellation
  | 'special-event'     // Special event/guest lecture
  | 'deadline';         // Important deadline

/**
 * Holiday or special date
 */
export interface Holiday {
  /** Date or start date of the holiday */
  date: DateString;
  
  /** End date for multi-day holidays/breaks */
  endDate?: DateString;
  
  /** Name/description of the holiday */
  name: string;
  
  /** Type of holiday */
  type: HolidayType;
  
  /** Optional notes */
  notes?: string;
}

/**
 * Mapping between a lecture note file and class meeting(s)
 */
export interface LectureMapping {
  /** Lecture identifier (should match filename, e.g., "l1-intro" for l1-intro.md) */
  lectureId: string;
  
  /** Optional custom title (defaults to title from markdown file) */
  title?: string;
  
  /** Date(s) when this lecture is covered */
  dates: DateString[];
  
  /** Optional section IDs if this lecture is only for specific sections */
  sections?: string[];
  
  /** Optional topics/tags for this lecture */
  topics?: string[];
  
  /** Optional notes or additional context */
  notes?: string;
  
  /** Optional materials/resources for this lecture */
  materials?: {
    slides?: string;
    recording?: string;
    additionalReading?: string[];
    code?: string[];
  };
}

/**
 * Assignment configuration
 */
export interface Assignment {
  /** Unique identifier for the assignment */
  id: string;
  
  /** Assignment title */
  title: string;
  
  /** Assignment type */
  type: 'homework' | 'project' | 'lab' | 'quiz' | 'exam' | 'reading';
  
  /** Release/assigned date */
  assignedDate: DateString;
  
  /** Due date */
  dueDate: DateString;

  /** Optional time zone override, otherwise uses the section's time zone */
  timeZone?: string;

  /** Optional time for due date (defaults to 23:59) */
  dueTime?: TimeString;
  
  /** Points/weight */
  points?: number;
  
  /** Link to assignment document */
  url?: string;
  
  /** Canvas assignment ID (for syncing) */
  canvasId?: string;
  
  /** Optional notes */
  notes?: string;
}

/**
 * Lab definition
 */
export interface Lab {
  /** Unique ID for the lab */
  id: string;
  
  /** Lab title */
  title: string;
  
  /** Dates this lab is scheduled (one per section typically) */
  dates: DateString[];
  
  /** Section-specific dates if different */
  sections?: string[];
  
  /** Link to lab document */
  url?: string;
  
  /** Lab description/topics */
  description?: string;
  
  /** Points if graded */
  points?: number;
  
  /** Optional notes */
  notes?: string;
}

/**
 * Canvas integration configuration
 */
export interface CanvasConfig {
  /** Canvas instance URL */
  canvasUrl: string;
  
  /** Canvas course ID */
  courseId: string;
  
  /** Whether to enable Canvas sync */
  enableSync: boolean;
  
  /** API token (should be stored securely, not in config) */
  apiTokenEnvVar?: string;
  
  /** Sync settings */
  syncSettings?: {
    syncAssignments?: boolean;
    syncGrades?: boolean;
    syncAnnouncements?: boolean;
  };
}

/**
 * Course configuration
 */
export interface CourseConfig {
  /** Course code (e.g., "CS 3100") */
  courseCode: string;
  
  /** Course title */
  courseTitle: string;
  
  /** Semester */
  semester: Semester;
  
  /** Academic year */
  academicYear: string; // e.g., "2025-2026"
  
  /** Overall course start date */
  startDate: DateString;
  
  /** Overall course end date */
  endDate: DateString;
  
  /** Course sections */
  sections: CourseSection[];
  
  /** Holidays and special dates */
  holidays: Holiday[];
  
  /** Lecture mappings */
  lectures: LectureMapping[];
  
  /** Lab mappings */
  labs?: Lab[];
  
  /** Assignments */
  assignments?: Assignment[];
  
  /** Canvas integration (optional) */
  canvas?: CanvasConfig;
  
  /** Timezone for the course (e.g., "America/New_York") */
  timezone?: string;
  
  /** Optional course metadata */
  metadata?: {
    department?: string;
    credits?: number;
    prerequisites?: string[];
    description?: string;
    syllabus?: string; // URL to syllabus
    officeHours?: {
      instructor: string;
      schedule: string;
      location: string;
      bookingUrl?: string;
    }[];
  };
}

/**
 * Plugin options for Classasaurus
 */
export interface ClassasaurusPluginOptions {
  /** Path to course configuration file */
  configPath?: string;
  
  /** Or provide configuration directly */
  config?: CourseConfig;
  
  /** Whether to generate schedule page */
  generateSchedule?: boolean;
  
  /** Custom schedule page route */
  scheduleRoute?: string;
  
  /** Whether to add lecture metadata to markdown files */
  enhanceLectures?: boolean;
  
  /** Whether to validate lecture IDs against actual files */
  validateLectureFiles?: boolean;
}

/**
 * Generated schedule entry
 */
export interface ScheduleEntry {
  /** Date of the meeting */
  date: DateString;
  
  /** Day of week */
  dayOfWeek: DayOfWeek;
  
  /** Class meeting number (e.g., 1, 2, 3...) */
  meetingNumber: number;
  
  /** Section ID */
  sectionId: string;
  
  /** Section name */
  sectionName: string;
  
  /** Meeting pattern */
  meeting: MeetingPattern;
  
  /** Lecture mapped to this date (if any) */
  lecture?: LectureMapping;
  
  /** Lab mapped to this date (if any) */
  lab?: Lab;
  
  /** Holiday information (if this date is a holiday) */
  holiday?: Holiday;
  
  /** Whether class meets on this date */
  isCancelled: boolean;
  
  /** Optional notes */
  notes?: string;
}

/**
 * Complete schedule for a course
 */
export interface CourseSchedule {
  /** Course configuration */
  config: CourseConfig;
  
  /** Generated schedule entries, organized by section */
  scheduleBySection: {
    [sectionId: string]: ScheduleEntry[];
  };
  
  /** All schedule entries in chronological order */
  allEntries: ScheduleEntry[];
  
  /** Important dates */
  importantDates: {
    startDate: DateString;
    endDate: DateString;
    holidays: Holiday[];
    examDates: DateString[];
    assignmentDueDates: DateString[];
  };
}

