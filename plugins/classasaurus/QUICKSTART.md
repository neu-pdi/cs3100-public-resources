# Classasaurus Quick Start Guide

Get your course website up and running in 5 minutes!

## Step 1: Configure Your Course

Create or edit `course.config.json` in your project root:

```json
{
  "courseCode": "CS 3100",
  "courseTitle": "Your Course Title",
  "semester": "Spring 2026",
  "academicYear": "2025-2026",
  "startDate": "2026-01-12",
  "endDate": "2026-04-24",
  "sections": [...],
  "holidays": [...],
  "lectures": [...]
}
```

See `course.config.json` for a complete example, or `course.config.example.ts` for a TypeScript version with full type safety.

## Step 2: Define Your Sections

Add your course sections with meeting times:

```json
{
  "sections": [
    {
      "id": "01",
      "name": "Morning Section",
      "meetings": [
        {
          "days": ["Monday", "Wednesday", "Friday"],
          "startTime": "09:50",
          "endTime": "10:55",
          "location": "Room 101"
        }
      ],
      "instructors": ["Your Name"]
    }
  ]
}
```

## Step 3: Add Holidays

Define when classes don't meet:

```json
{
  "holidays": [
    {
      "date": "2026-01-19",
      "name": "MLK Day",
      "type": "holiday"
    },
    {
      "date": "2026-03-02",
      "endDate": "2026-03-06",
      "name": "Spring Break",
      "type": "break"
    }
  ]
}
```

## Step 4: Map Lectures to Dates

Link your lecture notes to specific class meetings:

```json
{
  "lectures": [
    {
      "lectureId": "l1-intro",
      "dates": ["2026-01-12"],
      "topics": ["Introduction", "Syllabus"]
    },
    {
      "lectureId": "l2-data-structures",
      "dates": ["2026-01-14", "2026-01-16"],
      "topics": ["Arrays", "Lists", "Trees"]
    }
  ]
}
```

**Important:** The `lectureId` must match your lecture note filename (e.g., `l1-intro.md` in `lecture-notes/`).

## Step 5: Add Schedule Link to Navbar

In `docusaurus.config.ts`, add the schedule link to your navbar items:

```typescript
navbar: {
  items: [
    // ... other items
    {
      to: '/schedule',
      position: 'left',
      label: 'Schedule',
    },
  ],
}
```

## Step 6: Add Assignments (Optional)

Define homework, projects, and exams:

```json
{
  "assignments": [
    {
      "id": "hw1",
      "title": "Homework 1",
      "type": "homework",
      "assignedDate": "2026-01-14",
      "dueDate": "2026-01-21",
      "dueTime": "23:59",
      "points": 100
    }
  ]
}
```

## Step 7: Build and View

```bash
npm run build
npm run serve
```

Visit `/schedule` to see your automatically generated course schedule!

## What You Get

✅ **Automatic Schedule Generation** - All class meetings calculated based on patterns and holidays  
✅ **Lecture Links** - Direct links from schedule to lecture notes  
✅ **Assignment Tracking** - Organized view of all deadlines  
✅ **Multi-Section Support** - Handle multiple sections with different schedules  
✅ **Holiday Management** - Automatically skip holidays and breaks  
✅ **Export Options** - JSON and iCalendar formats available  

## Common Patterns

### Lab + Lecture Format

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
          "notes": "Lecture"
        },
        {
          "days": ["Friday"],
          "startTime": "10:30",
          "endTime": "12:10",
          "location": "Lab 123",
          "notes": "Lab"
        }
      ]
    }
  ]
}
```

### Section-Specific Lectures

```json
{
  "lectures": [
    {
      "lectureId": "l1-intro",
      "dates": ["2026-01-12", "2026-01-13"],
      "sections": ["01"],
      "notes": "Only for morning section"
    }
  ]
}
```

### Late Submissions

```json
{
  "assignments": [
    {
      "id": "project1",
      "title": "Final Project",
      "type": "project",
      "assignedDate": "2026-03-01",
      "dueDate": "2026-04-15",
      "lateDeadline": {
        "date": "2026-04-22",
        "penalty": "10% per day"
      }
    }
  ]
}
```

## Validation

The plugin automatically validates your configuration:

- ✓ Date formats (YYYY-MM-DD)
- ✓ Time formats (HH:MM in 24-hour)
- ✓ Date ranges (end after start)
- ✓ Section references
- ✓ Required fields

If there's an error, you'll see a clear message during build.

## Tips

1. **Start Simple** - Begin with one section and a few lectures, then expand
2. **Use Comments** - JSON doesn't support comments, but TypeScript config does! Use `course.config.example.ts` as a starting point
3. **Test Incrementally** - Build after each major addition to catch errors early
4. **Check the Schedule** - Review the generated `/schedule` page to verify everything looks correct

## Need Help?

- See `README.md` for full documentation
- Check `course.config.example.ts` for a complete TypeScript example
- Review `types.ts` for all available configuration options

## Next Steps

Once your basic schedule is working:

- [ ] Add all assignments and due dates
- [ ] Include office hours in metadata
- [ ] Add assignment URLs pointing to assignment pages
- [ ] Set up Canvas integration (coming soon)
- [ ] Export to iCalendar for student calendars
- [ ] Add reading materials and resources to lectures

Happy teaching! 🎓

