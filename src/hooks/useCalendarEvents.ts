"use client";

import { useMemo } from 'react';
import { parseISO, format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { useCourseConfig, useCourseSchedule } from './useCourseConfig';
import type { CalendarType, CalendarEvent as PluginCalendarEvent } from '../../plugins/classasaurus/types';

let eventIdCounter = 1;

/**
 * Generate a unique event ID
 */
function generateEventId(): number {
  return eventIdCounter++;
}

/**
 * Calendar event interface matching what the calendar components expect
 * Re-export from plugin types for convenience
 */
export type CalendarEvent = PluginCalendarEvent;

/**
 * Generate calendar events from course config
 */
function generateEventsFromConfig(config: ReturnType<typeof useCourseConfig>): CalendarEvent[] {
  if (!config) return [];
  
  const events: CalendarEvent[] = [];
  
  // Generate events from lectures
  if (config.lectures) {
    for (const lecture of config.lectures) {
      for (const dateStr of lecture.dates) {
        // Find sections that meet on this date
        for (const section of config.sections) {
          for (const meeting of section.meetings) {
            const dayOfWeek = format(parseISO(dateStr), 'EEEE') as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
            
            if (meeting.days.includes(dayOfWeek)) {
              // Parse time and create event
              const [startHour, startMin] = meeting.startTime.split(':').map(Number);
              const [endHour, endMin] = meeting.endTime.split(':').map(Number);
              
              const startDate = parseISO(dateStr);
              startDate.setHours(startHour, startMin, 0, 0);
              
              const endDate = parseISO(dateStr);
              endDate.setHours(endHour, endMin, 0, 0);
              
              const topics = lecture.topics && lecture.topics.length > 0
                ? lecture.topics.join(', ')
                : (lecture.title || lecture.lectureId);
              const lectureTitle = `${section.name}: ${topics}`;
              
              events.push({
                id: generateEventId(),
                uid: `lecture-${lecture.lectureId}-${dateStr}-${section.id}`,
                title: lectureTitle,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                location: meeting.location,
                calendar_type: 'events',
              });
            }
          }
        }
      }
    }
  }
  
  // Generate events from labs
  if (config.labs) {
    for (const lab of config.labs) {
      for (const dateStr of lab.dates) {
        // Find lab sections that meet on this date
        if (config.labSections) {
          for (const labSection of config.labSections) {
            for (const meeting of labSection.meetings) {
              const dayOfWeek = format(parseISO(dateStr), 'EEEE') as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
              
              if (meeting.days.includes(dayOfWeek)) {
                const [startHour, startMin] = meeting.startTime.split(':').map(Number);
                const [endHour, endMin] = meeting.endTime.split(':').map(Number);
                
                const startDate = parseISO(dateStr);
                startDate.setHours(startHour, startMin, 0, 0);
                
                const endDate = parseISO(dateStr);
                endDate.setHours(endHour, endMin, 0, 0);
                
                events.push({
                  id: generateEventId(),
                  uid: `lab-meeting-${lab.id}-${dateStr}-${labSection.id}`,
                  title: `${labSection.name}: ${lab.title}`,
                  start_time: startDate.toISOString(),
                  end_time: endDate.toISOString(),
                  location: meeting.location,
                  organizer_name: labSection.instructors?.[0],
                  calendar_type: 'events',
                });
              }
            }
          }
        }
      }
    }
  }
  
  // Generate events from assignments (due dates)
  if (config.assignments) {
    for (const assignment of config.assignments) {
      const dueDate = parseISO(assignment.dueDate);
      const [dueHour, dueMin] = (assignment.dueTime || '23:59').split(':').map(Number);
      dueDate.setHours(dueHour, dueMin, 0, 0);
      
      // Create a 1-hour event for the due date
      const startDate = new Date(dueDate);
      startDate.setHours(dueHour - 1, dueMin, 0, 0);
      
      events.push({
        id: generateEventId(),
        uid: `assignment-${assignment.id}`,
        title: `Due: ${assignment.title}`,
        start_time: startDate.toISOString(),
        end_time: dueDate.toISOString(),
        calendar_type: 'events',
      });
    }
  }
  
  // Generate events from office hours in metadata
  if (config.metadata?.officeHours) {
    for (const officeHour of config.metadata.officeHours) {
      // Parse office hours schedule (e.g., "Tuesdays 2-3pm, Fridays 11am-12pm")
      // This is a simplified parser - you might want to enhance this
      const scheduleParts = officeHour.schedule.split(',');
      
      for (const part of scheduleParts) {
        const trimmed = part.trim();
        // Try to parse patterns like "Tuesdays 2-3pm" or "Fridays 11am-12pm"
        // This is a basic implementation - you may want to enhance it
        const dayMatch = trimmed.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)s?/i);
        const timeMatch = trimmed.match(/(\d{1,2})(?:am|pm)?-(\d{1,2})(am|pm)/i);
        
        if (dayMatch && timeMatch) {
          const dayName = dayMatch[1];
          const startHour = parseInt(timeMatch[1]);
          const endHour = parseInt(timeMatch[2]);
          const endPeriod = timeMatch[3];
          
          // Convert to 24-hour format (simplified)
          let startHour24 = startHour;
          let endHour24 = endHour;
          if (endPeriod.toLowerCase() === 'pm' && endHour < 12) {
            endHour24 += 12;
          }
          if (startHour < endHour24) {
            // Assume same period for start
            if (endPeriod.toLowerCase() === 'pm' && startHour < 12) {
              startHour24 += 12;
            }
          }
          
          // Generate events for the next few weeks (you might want to limit this)
          const today = new Date();
          for (let weekOffset = 0; weekOffset < 16; weekOffset++) {
            const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
            weekStart.setDate(weekStart.getDate() + weekOffset * 7);
            
            const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(dayName);
            if (dayIndex !== -1) {
              const eventDate = new Date(weekStart);
              eventDate.setDate(eventDate.getDate() + dayIndex);
              
              const startDate = new Date(eventDate);
              startDate.setHours(startHour24, 0, 0, 0);
              
              const endDate = new Date(eventDate);
              endDate.setHours(endHour24, 0, 0, 0);
              
              events.push({
                id: generateEventId(),
                uid: `office-hours-${officeHour.instructor}-${dayName}-${weekOffset}`,
                title: `Office Hours: ${officeHour.instructor}`,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                location: officeHour.location,
                organizer_name: officeHour.instructor,
                calendar_type: 'office_hours',
              });
            }
          }
        }
      }
    }
  }
  
  return events;
}

/**
 * Hook to get ICS calendar events (pre-fetched at build time)
 */
function useICSCalendars(): CalendarEvent[] {
  const schedule = useCourseSchedule();
  
  return useMemo(() => {
    // Calendar events are pre-fetched at build time and stored in schedule.calendarEvents
    return schedule?.calendarEvents || [];
  }, [schedule]);
}

/**
 * Main hook to get all calendar events (from config + ICS)
 */
export function useAllCalendarEvents(): CalendarEvent[] {
  const config = useCourseConfig();
  const icsEvents = useICSCalendars();
  
  const configEvents = useMemo(() => {
    return generateEventsFromConfig(config);
  }, [config]);
  
  return useMemo(() => {
    return [...configEvents, ...icsEvents].sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  }, [configEvents, icsEvents]);
}

/**
 * Hook to get events for a specific day
 */
export function useDaySchedule(date: Date): CalendarEvent[] {
  const allEvents = useAllCalendarEvents();
  
  return useMemo(() => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    return allEvents.filter(event => {
      const eventStart = parseISO(event.start_time);
      const eventEnd = parseISO(event.end_time);
      
      // Event overlaps with day if it starts before day ends AND ends after day starts
      return eventStart <= dayEnd && eventEnd >= dayStart;
    });
  }, [allEvents, date]);
}

/**
 * Hook to get events for a specific week
 */
export function useWeekSchedule(weekStart: Date): CalendarEvent[] {
  const allEvents = useAllCalendarEvents();
  
  return useMemo(() => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 }); // Sunday to Saturday
    
    return allEvents.filter(event => {
      const eventStart = parseISO(event.start_time);
      const eventEnd = parseISO(event.end_time);
      
      // Event overlaps with week if it starts before week ends AND ends after week starts
      return eventStart <= weekEnd && eventEnd >= weekStart;
    });
  }, [allEvents, weekStart]);
}

/**
 * Hook to get all office hours events
 */
export function useOfficeHoursSchedule(): CalendarEvent[] {
  const allEvents = useAllCalendarEvents();
  
  return useMemo(() => {
    return allEvents.filter(event => event.calendar_type === 'office_hours');
  }, [allEvents]);
}
