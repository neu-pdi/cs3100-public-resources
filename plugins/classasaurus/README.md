# Classasaurus Plugin

A Docusaurus plugin for managing course websites with rich scheduling, lecture mapping, and assignment tracking.

## Features

- 📅 **Rich Schedule Generation**: Automatically generate course schedules based on meeting patterns, holidays, and special events
- 📚 **Lecture Mapping**: Link lecture notes to specific class meetings
- 📝 **Assignment Tracking**: Define assignments with due dates, late policies, and Canvas integration
- 🎓 **Multi-Section Support**: Handle multiple sections of the same course with different meeting times
- 🗓️ **Holiday Management**: Automatically account for university holidays and breaks
- 🔄 **Canvas Integration**: (Coming soon) Sync with Canvas LMS
- 📦 **Export Options**: Generate schedules in JSON, Markdown, and other formats

## Installation

The plugin is already included in this Docusaurus project. No additional installation needed.

## Configuration

### 1. Create a Course Configuration File

Create a `course.config.json` file in your project root (see `course.config.json` for a complete example):

```json
{
  "courseCode": "CS 3100",
  "courseTitle": "Software Engineering",
  "semester": "Spring 2026",
  "startDate": "2026-01-12",
  "endDate": "2026-04-24",
  "sections": [...],
  "holidays": [...],
  "lectures": [...],
  "assignments": [...]
}
```

### 2. Configure the Plugin

In `docusaurus.config.ts`, add the plugin with options:

```typescript
plugins: [
  [
    path.resolve(__dirname, './plugins/classasaurus/index.ts'),
    {
      configPath: './course.config.json',
      generateSchedule: true,
      scheduleRoute: '/schedule',
      validateLectureFiles: true,
    }
  ],
]
```

### 3. Add Schedule to Navbar (Optional)

Add a link to the schedule page in your navbar:

```typescript
themeConfig: {
  navbar: {
    items: [
      // ... other items
      {
        to: '/schedule',
        position: 'left',
        label: 'Schedule',
      },
    ],
  },
}
```

## Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `configPath` | `string` | - | Path to course configuration JSON file |
| `config` | `CourseConfig` | - | Provide configuration directly instead of from file |
| `generateSchedule` | `boolean` | `true` | Whether to generate a schedule page |
| `scheduleRoute` | `string` | `'/schedule'` | URL route for the schedule page |
| `enhanceLectures` | `boolean` | `false` | Add schedule metadata to lecture markdown files |
| `validateLectureFiles` | `boolean` | `false` | Validate that lecture IDs match actual files |

## Configuration Schema

### CourseConfig

Main course configuration object:

```typescript
{
  courseCode: string;           // e.g., "CS 3100"
  courseTitle: string;          // Full course title
  semester: Semester;           // e.g., "Spring 2026"
  academicYear: string;         // e.g., "2025-2026"
  startDate: DateString;        // Course start date (YYYY-MM-DD)
  endDate: DateString;          // Course end date
  sections: CourseSection[];    // Course sections
  holidays: Holiday[];          // Holidays and breaks
  lectures: LectureMapping[];   // Lecture-to-date mappings
  assignments?: Assignment[];   // Optional assignments
  canvas?: CanvasConfig;        // Optional Canvas integration
  timezone?: string;            // e.g., "America/New_York"
  metadata?: {...};             // Optional metadata
}
```

### CourseSection

Define course sections with meeting patterns:

```typescript
{
  id: string;                   // Unique section ID (e.g., "01", "02")
  name: string;                 // Display name
  crn?: string;                 // Registration number
  meetings: MeetingPattern[];   // Meeting times
  instructors?: string[];       // Instructor names
  startDate?: DateString;       // Override course start date
  endDate?: DateString;         // Override course end date
  additionalHolidays?: Holiday[]; // Section-specific holidays
}
```

### MeetingPattern

Define when and where classes meet:

```typescript
{
  days: DayOfWeek[];           // e.g., ["Monday", "Wednesday", "Friday"]
  startTime: TimeString;       // e.g., "09:50" (24-hour format)
  endTime: TimeString;         // e.g., "10:55"
  location?: string;           // Room/building
  notes?: string;              // Additional notes
}
```

### Holiday

Define holidays, breaks, and special dates:

```typescript
{
  date: DateString;            // Start date
  endDate?: DateString;        // End date for multi-day holidays
  name: string;                // Holiday name
  type: HolidayType;           // 'holiday', 'break', 'exam-period', etc.
  notes?: string;
}
```

### LectureMapping

Map lecture notes to class meetings:

```typescript
{
  lectureId: string;           // Must match lecture file (e.g., "l1-intro")
  title?: string;              // Override title from markdown
  dates: DateString[];         // Date(s) when covered
  sections?: string[];         // Optional: specific sections only
  topics?: string[];           // Topics covered
  notes?: string;
  materials?: {                // Optional materials
    slides?: string;
    recording?: string;
    additionalReading?: string[];
    code?: string[];
  }
}
```

### Assignment

Define assignments and projects:

```typescript
{
  id: string;                  // Unique identifier
  title: string;               // Assignment name
  type: AssignmentType;        // 'homework', 'project', 'exam', etc.
  assignedDate: DateString;
  dueDate: DateString;
  dueTime?: TimeString;        // Defaults to 23:59
  lateDeadline?: {             // Optional late submission
    date: DateString;
    time?: TimeString;
    penalty?: string;
  };
  points?: number;
  url?: string;                // Link to assignment page
  canvasId?: string;           // For Canvas sync
}
```

## Generated Schedule

The plugin generates a `CourseSchedule` object with:

- `scheduleBySection`: Schedule entries for each section
- `allEntries`: All meetings in chronological order
- `importantDates`: Quick access to key dates

Each `ScheduleEntry` includes:
- Date and day of week
- Meeting number
- Section information
- Associated lecture (if any)
- Holiday information (if applicable)
- Cancellation status

## Usage Examples

### Example 1: Single Section Course

```json
{
  "courseCode": "CS 2500",
  "semester": "Fall 2025",
  "startDate": "2025-09-03",
  "endDate": "2025-12-13",
  "sections": [
    {
      "id": "01",
      "name": "Main Section",
      "meetings": [
        {
          "days": ["Monday", "Wednesday"],
          "startTime": "11:45",
          "endTime": "13:25",
          "location": "Ryder Hall 155"
        }
      ]
    }
  ],
  "holidays": [
    {
      "date": "2025-11-27",
      "endDate": "2025-11-28",
      "name": "Thanksgiving Break",
      "type": "break"
    }
  ],
  "lectures": [...]
}
```

### Example 2: Multiple Sections with Different Schedules

```json
{
  "sections": [
    {
      "id": "morning",
      "name": "Morning Section",
      "meetings": [
        {
          "days": ["Monday", "Wednesday", "Friday"],
          "startTime": "08:00",
          "endTime": "09:05"
        }
      ]
    },
    {
      "id": "afternoon",
      "name": "Afternoon Section",
      "meetings": [
        {
          "days": ["Tuesday", "Thursday"],
          "startTime": "15:30",
          "endTime": "17:10"
        }
      ]
    }
  ],
  "lectures": [
    {
      "lectureId": "l1-intro",
      "dates": ["2026-01-12", "2026-01-13"],
      "notes": "Both sections cover same material on different days"
    }
  ]
}
```

### Example 3: Lab + Lecture Format

```json
{
  "sections": [
    {
      "id": "01",
      "name": "Section 01",
      "meetings": [
        {
          "days": ["Monday", "Wednesday"],
          "startTime": "10:30",
          "endTime": "11:35",
          "location": "Lecture Hall",
          "notes": "Lecture"
        },
        {
          "days": ["Friday"],
          "startTime": "10:30",
          "endTime": "12:10",
          "location": "Computer Lab 123",
          "notes": "Lab"
        }
      ]
    }
  ]
}
```

## Data Access

### In React Components

```typescript
import scheduleData from '@site/.docusaurus/docusaurus-plugin-classasaurus/default/schedule.json';

function MyScheduleComponent() {
  const schedule = scheduleData as CourseSchedule;
  
  return (
    <div>
      <h1>{schedule.config.courseCode}: {schedule.config.courseTitle}</h1>
      {/* Render schedule */}
    </div>
  );
}
```

### Exported JSON

After build, the schedule is exported to `build/schedule.json` for external tools.

## Future Features

- [ ] Canvas LMS integration
- [ ] iCalendar export
- [ ] Attendance tracking
- [ ] Automated assignment posting
- [ ] Grade calculations
- [ ] Student progress dashboards
- [ ] Email notifications
- [ ] Syllabus generation

## Development

### Type Definitions

All types are defined in `types.ts` and are fully exported.

### Validation

Configuration is validated on load using `config-validator.ts`. Validation includes:
- Date format validation
- Time format validation
- Date range validation
- Reference validation (e.g., section IDs in lectures)
- Required fields

### Schedule Generation

Schedules are generated using `schedule-generator.ts`, which:
1. Generates all meeting dates based on patterns
2. Excludes holidays
3. Maps lectures to dates
4. Numbers meetings sequentially
5. Handles section-specific overrides

## License

Same as parent project.

