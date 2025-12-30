"use client";

import { useMemo, useState, useEffect } from 'react';
import { useCourseSchedule } from '../../hooks/useCourseConfig';
import { startOfWeek, endOfWeek, parseISO, format, isWithinInterval, isSameDay, addWeeks, isSameWeek } from 'date-fns';
import { Box, Heading, VStack, HStack, Text, Card, Badge, Button, Icon } from '@chakra-ui/react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import DocusaurusLink from '@docusaurus/Link';
import type { ScheduleEntry, Assignment, Lab } from '../../../plugins/classasaurus/types';

/**
 * Component to display the current week's lectures, labs, and deadlines
 * Uses the same localStorage keys as SchedulePage for section selection
 */
export default function CurrentWeekSchedule() {
  const schedule = useCourseSchedule();
  const [selectedLectureId, setSelectedLectureId] = useState<string>('');
  const [selectedLabId, setSelectedLabId] = useState<string>('');
  const [weekOffset, setWeekOffset] = useState(0);

  // Initialize from localStorage (same keys as SchedulePage)
  // Don't auto-select - allow "all sections" view
  useEffect(() => {
    if (typeof window === 'undefined' || !schedule) return;
    
    const savedLecture = window.localStorage.getItem('cs3100.schedule.lectureSection');
    const savedLab = window.localStorage.getItem('cs3100.schedule.labSection');
    
    if (savedLecture && schedule.config.sections.some(s => s.id === savedLecture)) {
      setSelectedLectureId(savedLecture);
    }
    // Don't auto-select - leave empty to show all sections
    
    if (savedLab && schedule.config.labSections?.some(s => s.id === savedLab)) {
      setSelectedLabId(savedLab);
    }
    // Don't auto-select - leave empty to show all sections
  }, [schedule]);

  // Persist selections
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedLectureId) {
      window.localStorage.setItem('cs3100.schedule.lectureSection', selectedLectureId);
    }
    if (selectedLabId) {
      window.localStorage.setItem('cs3100.schedule.labSection', selectedLabId);
    }
  }, [selectedLectureId, selectedLabId]);

  // Get selected week range (with offset)
  const selectedWeek = useMemo(() => {
    const now = new Date();
    const targetDate = addWeeks(now, weekOffset);
    return {
      start: startOfWeek(targetDate, { weekStartsOn: 0 }), // Sunday
      end: endOfWeek(targetDate, { weekStartsOn: 0 }) // Saturday
    };
  }, [weekOffset]);

  // Check if selected week is the current week
  const isCurrentWeek = useMemo(() => {
    const now = new Date();
    return isSameWeek(selectedWeek.start, now, { weekStartsOn: 0 });
  }, [selectedWeek]);

  // Get selected sections
  const lectureSection = useMemo(() => {
    if (!schedule || !selectedLectureId) return null;
    return schedule.config.sections.find(s => s.id === selectedLectureId) || schedule.config.sections[0];
  }, [schedule, selectedLectureId]);

  const labSection = useMemo(() => {
    if (!schedule || !selectedLabId || !schedule.config.labSections) return null;
    return schedule.config.labSections.find(s => s.id === selectedLabId) || schedule.config.labSections[0];
  }, [schedule, selectedLabId]);

  // Get entries for selected week (all sections if none selected)
  const weekEntries = useMemo(() => {
    if (!schedule) return [];
    
    let entries: ScheduleEntry[] = [];
    
    if (lectureSection) {
      // Show only selected section
      entries = schedule.scheduleBySection[lectureSection.id] || [];
    } else {
      // Show all sections
      entries = schedule.allEntries || [];
    }
    
    const filtered = entries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isWithinInterval(entryDate, { start: selectedWeek.start, end: selectedWeek.end });
    });
    
    // If showing all sections, deduplicate by lectureId
    if (!lectureSection) {
      const seen = new Map<string, ScheduleEntry>();
      for (const entry of filtered) {
        if (entry.lecture && !entry.isCancelled) {
          const key = entry.lecture.lectureId;
          if (!seen.has(key)) {
            seen.set(key, entry);
          }
        }
      }
      return Array.from(seen.values());
    }
    
    return filtered;
  }, [schedule, lectureSection, selectedWeek]);

  // Get lab entries for selected week (all sections if none selected)
  const weekLabEntries = useMemo(() => {
    if (!schedule) return [];
    
    let labEntries: ScheduleEntry[] = [];
    
    if (labSection && schedule.labScheduleBySection) {
      // Show only selected lab section
      labEntries = schedule.labScheduleBySection[labSection.id] || [];
    } else if (schedule.labScheduleBySection) {
      // Show all lab sections
      Object.values(schedule.labScheduleBySection).forEach(sectionLabs => {
        labEntries.push(...sectionLabs);
      });
    }
    
    const filtered = labEntries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isWithinInterval(entryDate, { start: selectedWeek.start, end: selectedWeek.end });
    });
    
    // If showing all sections, deduplicate by lab.id
    if (!labSection) {
      const seen = new Map<string, ScheduleEntry>();
      for (const entry of filtered) {
        if (entry.lab && !entry.isCancelled) {
          const key = entry.lab.id || entry.lab.title; // Use id if available, otherwise title
          if (!seen.has(key)) {
            seen.set(key, entry);
          }
        }
      }
      return Array.from(seen.values());
    }
    
    return filtered;
  }, [schedule, labSection, selectedWeek]);

  // Get assignments due in selected week
  const weekAssignments = useMemo(() => {
    if (!schedule || !schedule.config.assignments) return [];
    
    return schedule.config.assignments.filter(assignment => {
      const dueDate = parseISO(assignment.dueDate);
      return isWithinInterval(dueDate, { start: selectedWeek.start, end: selectedWeek.end });
    }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [schedule, selectedWeek]);

  // Check if selected week has any events
  const hasEvents = weekEntries.length > 0 || weekLabEntries.length > 0 || weekAssignments.length > 0;

  // Auto-select first week with events if current week is empty
  useEffect(() => {
    if (!schedule || hasEvents) return;
    
    // Only auto-select if we're showing current week (weekOffset === 0)
    if (weekOffset !== 0) return;
    
    // Find the first future week with events (check all sections)
    const allEntries = schedule.allEntries || [];
    const allLabEntries: ScheduleEntry[] = [];
    if (schedule.labScheduleBySection) {
      Object.values(schedule.labScheduleBySection).forEach(sectionLabs => {
        allLabEntries.push(...sectionLabs);
      });
    }
    const allAssignments = schedule.config.assignments || [];
    
    const now = new Date();
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 0 });
    
    // Check up to 16 weeks ahead
    for (let offset = 1; offset <= 16; offset++) {
      const weekStart = addWeeks(currentWeekStart, offset);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
      
      const hasLectures = allEntries.some(entry => {
        const entryDate = parseISO(entry.date);
        return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
      });
      
      const hasLabs = allLabEntries.some(entry => {
        const entryDate = parseISO(entry.date);
        return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
      });
      
      const hasAssignments = allAssignments.some(assignment => {
        const dueDate = parseISO(assignment.dueDate);
        return isWithinInterval(dueDate, { start: weekStart, end: weekEnd });
      });
      
      if (hasLectures || hasLabs || hasAssignments) {
        setWeekOffset(offset);
        break;
      }
    }
  }, [schedule, weekOffset, hasEvents]);

  // Get lecture title (from config.title or topics[0] or lectureId)
  const getLectureTitle = (entry: ScheduleEntry): string => {
    if (entry.lecture?.title) {
      return entry.lecture.title;
    }
    if (entry.lecture?.topics && entry.lecture.topics.length > 0) {
      return entry.lecture.topics[0];
    }
    return entry.lecture?.lectureId || 'Lecture';
  };

  // Get lecture URL
  const getLectureUrl = (lectureId: string): string => {
    return `/lecture-notes/${lectureId}`;
  };

  // Get lab URL
  const getLabUrl = (lab: Lab | undefined): string | null => {
    if (!lab?.url) return null;
    return lab.url.startsWith('/') ? lab.url : `/labs/${lab.url}`;
  };

  // Helper to format days for display
  const formatDays = (days: string[]): string => {
    if (days.length === 0) return '';
    if (days.length === 1) return days[0].slice(0, 3);
    return days.map(d => d.slice(0, 3)).join('/');
  };

  // Helper to infer campus from location/timezone
  const inferCampus = (location: string | undefined, timezone: string): string => {
    if (!location) {
      if (timezone.includes('Los_Angeles')) return 'Oakland';
      if (timezone.includes('New_York')) return 'Boston';
      return '';
    }
    // Simple inference - could be enhanced
    if (location.toLowerCase().includes('oakland')) return 'Oakland';
    if (location.toLowerCase().includes('boston')) return 'Boston';
    return '';
  };

  // Format lecture section label (like SchedulePage)
  const lectureLabel = (section: typeof schedule.config.sections[0]): string => {
    const lectureMeeting = section.meetings.find(m => m.type !== 'lab') || section.meetings[0];
    const days = lectureMeeting ? formatDays(lectureMeeting.days) : '';
    const startEnd = lectureMeeting ? `${lectureMeeting.startTime}-${lectureMeeting.endTime}` : '';
    const campus = inferCampus(lectureMeeting?.location, section.timeZone);
    const instructor = section.instructors?.[0] || 'Staff';
    return `${instructor} ${days} ${startEnd} ${campus}`;
  };

  // Format lab section label
  const labLabel = (lab: typeof schedule.config.labSections[0]): string => {
    const meeting = lab.meetings[0];
    const days = meeting ? formatDays(meeting.days) : '';
    const startEnd = meeting ? `${meeting.startTime}-${meeting.endTime}` : '';
    const campus = inferCampus(meeting?.location, lab.timeZone);
    return `${days} ${startEnd} ${campus}`;
  };

  if (!schedule) {
    return (
      <Box p={4}>
        <Text color="fg.muted">Loading schedule...</Text>
      </Box>
    );
  }

  const weekRangeText = `${format(selectedWeek.start, 'MMM d')} - ${format(selectedWeek.end, 'MMM d, yyyy')}`;

  return (
    <Box>
      <VStack align="stretch" gap={4}>
        {/* Header */}
        <HStack justify="space-between" wrap="wrap">
          <HStack gap={2}>
            <Heading size="md">
              {isCurrentWeek ? 'This Week' : `Week of ${format(selectedWeek.start, 'MMM d')}`}: {weekRangeText}
            </Heading>
            {!isCurrentWeek && (
              <Badge colorPalette="blue" size="sm">Future Week</Badge>
            )}
          </HStack>
          
          {/* Week Navigation */}
          <HStack gap={1}>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setWeekOffset(weekOffset - 1)}
              aria-label="Previous week"
            >
              <Icon as={BsChevronLeft} />
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
            >
              This Week
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setWeekOffset(weekOffset + 1)}
              aria-label="Next week"
            >
              <Icon as={BsChevronRight} />
            </Button>
          </HStack>
          
          {/* Section selectors */}
          <HStack gap={2} wrap="wrap">
            {schedule.config.sections.length > 0 && (
              <Box>
                <label htmlFor="lecture-section-select" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Lecture Section
                </label>
                <select
                  id="lecture-section-select"
                  value={selectedLectureId || ''}
                  onChange={(e) => setSelectedLectureId(e.target.value || '')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--chakra-colors-border-emphasized)',
                    fontSize: '0.875rem',
                    minWidth: '250px'
                  }}
                >
                  <option value="">All Sections</option>
                  {schedule.config.sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name} ({lectureLabel(section)})
                    </option>
                  ))}
                </select>
              </Box>
            )}
            
            {schedule.config.labSections && schedule.config.labSections.length > 0 && (
              <Box>
                <label htmlFor="lab-section-select" style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Lab Section
                </label>
                <select
                  id="lab-section-select"
                  value={selectedLabId || ''}
                  onChange={(e) => setSelectedLabId(e.target.value || '')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--chakra-colors-border-emphasized)',
                    fontSize: '0.875rem',
                    minWidth: '250px'
                  }}
                >
                  <option value="">All Sections</option>
                  {schedule.config.labSections.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name} ({labLabel(lab)})
                    </option>
                  ))}
                </select>
              </Box>
            )}
          </HStack>
        </HStack>

        {/* Section selection cue */}
        {((!selectedLectureId && schedule.config.sections.length > 1) || 
          (!selectedLabId && schedule.config.labSections && schedule.config.labSections.length > 1)) && 
          (weekEntries.length > 0 || weekLabEntries.length > 0) && (
          <Box p={3} bg="blue.subtle" borderRadius="md" borderWidth="1px" borderColor="blue.200">
            <Text fontSize="sm" color="blue.700">
              💡 <strong>Tip:</strong> Select specific sections above to filter to your schedule.
            </Text>
          </Box>
        )}

        {/* Combined Lectures and Labs */}
        {(weekEntries.length > 0 || weekLabEntries.length > 0) && (
          <Box>
            <Heading size="sm" mb={2}>Lectures & Labs</Heading>
            <VStack align="stretch" gap={2}>
              {/* Combine and sort by date/time (only if section selected) or by title */}
              {[...weekEntries, ...weekLabEntries]
                .filter(entry => !entry.isCancelled && (entry.lecture || entry.lab))
                .sort((a, b) => {
                  // If showing all sections, sort by title
                  if (!selectedLectureId && !selectedLabId) {
                    const titleA = a.lecture ? getLectureTitle(a) : (a.lab?.title || '');
                    const titleB = b.lecture ? getLectureTitle(b) : (b.lab?.title || '');
                    return titleA.localeCompare(titleB);
                  }
                  // If section selected, sort by date/time
                  const dateA = parseISO(a.date);
                  const dateB = parseISO(b.date);
                  if (dateA.getTime() !== dateB.getTime()) {
                    return dateA.getTime() - dateB.getTime();
                  }
                  // If same date, sort by time
                  const timeA = a.meeting?.startTime || '00:00';
                  const timeB = b.meeting?.startTime || '00:00';
                  return timeA.localeCompare(timeB);
                })
                .map((entry, idx) => {
                  const isShowingAllSections = (!selectedLectureId && entry.lecture) || (!selectedLabId && entry.lab);
                  const dateStr = format(parseISO(entry.date), 'EEEE, MMM d');
                  const isLecture = !!entry.lecture;
                  const isLab = !!entry.lab;
                  
                  if (isLecture) {
                    const lectureUrl = getLectureUrl(entry.lecture!.lectureId);
                    const sectionName = entry.sectionName || 'Unknown';
                    const topics = entry.lecture?.topics && entry.lecture.topics.length > 0
                      ? entry.lecture.topics.join(', ')
                      : (entry.lecture?.title || entry.lecture?.lectureId || 'TBD');
                    const lectureText = `${sectionName}: ${topics}`;
                    
                    return (
                      <Card.Root key={`lecture-${entry.lecture!.lectureId}-${idx}`} size="sm">
                        <Card.Body>
                          <HStack justify="space-between" align="flex-start">
                            <VStack align="flex-start" gap={1} flex={1}>
                              <HStack>
                                <Badge colorPalette="blue" size="sm">Lecture</Badge>
                                {!isShowingAllSections && (
                                  <>
                                    <Text fontWeight="semibold" fontSize="sm">{dateStr}</Text>
                                    {entry.meeting && (
                                      <Text fontSize="xs" color="fg.muted">
                                        {entry.meeting.startTime} - {entry.meeting.endTime}
                                      </Text>
                                    )}
                                  </>
                                )}
                              </HStack>
                              {lectureUrl ? (
                                <DocusaurusLink to={lectureUrl}>
                                  <Text fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                                    {lectureText}
                                  </Text>
                                </DocusaurusLink>
                              ) : (
                                <Text fontSize="sm">{lectureText}</Text>
                              )}
                            </VStack>
                            {!isShowingAllSections && entry.meeting?.location && (
                              <Text fontSize="xs" color="fg.muted">
                                {entry.meeting.location}
                              </Text>
                            )}
                          </HStack>
                        </Card.Body>
                      </Card.Root>
                    );
                  }
                  
                  if (isLab) {
                    const lab = entry.lab!;
                    const labUrl = getLabUrl(lab);
                    
                    return (
                      <Card.Root key={`lab-${lab.id || lab.title}-${idx}`} size="sm">
                        <Card.Body>
                          <HStack justify="space-between" align="flex-start">
                            <VStack align="flex-start" gap={1} flex={1}>
                              <HStack>
                                <Badge colorPalette="green" size="sm">Lab</Badge>
                                {!isShowingAllSections && (
                                  <>
                                    <Text fontWeight="semibold" fontSize="sm">{dateStr}</Text>
                                    {entry.meeting && (
                                      <Text fontSize="xs" color="fg.muted">
                                        {entry.meeting.startTime} - {entry.meeting.endTime}
                                      </Text>
                                    )}
                                  </>
                                )}
                              </HStack>
                              {labUrl ? (
                                <DocusaurusLink to={labUrl}>
                                  <Text fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                                    {lab.title}
                                  </Text>
                                </DocusaurusLink>
                              ) : (
                                <Text fontSize="sm">{lab.title}</Text>
                              )}
                              {lab.description && (
                                <Text fontSize="xs" color="fg.muted">
                                  {lab.description}
                                </Text>
                              )}
                            </VStack>
                            {!isShowingAllSections && entry.meeting?.location && (
                              <Text fontSize="xs" color="fg.muted">
                                {entry.meeting.location}
                              </Text>
                            )}
                          </HStack>
                        </Card.Body>
                      </Card.Root>
                    );
                  }
                  
                  return null;
                })}
            </VStack>
          </Box>
        )}

        {/* Assignments/Deadlines */}
        {weekAssignments.length > 0 && (
          <Box>
            <Heading size="sm" mb={2}>Deadlines</Heading>
            <VStack align="stretch" gap={2}>
              {weekAssignments.map((assignment) => {
                const dueDate = parseISO(assignment.dueDate);
                const dueTime = assignment.dueTime || '23:59';
                const dateStr = format(dueDate, 'EEEE, MMM d');
                const isToday = isSameDay(dueDate, new Date());
                
                return (
                  <Card.Root key={assignment.id} size="sm" borderColor={isToday ? "orange.500" : undefined}>
                    <Card.Body>
                      <HStack justify="space-between" align="flex-start">
                        <VStack align="flex-start" gap={1} flex={1}>
                          <HStack>
                            <Text fontWeight="semibold" fontSize="sm">{dateStr}</Text>
                            <Text fontSize="xs" color="fg.muted">Due: {dueTime}</Text>
                            {isToday && (
                              <Badge colorPalette="orange" size="sm">Today</Badge>
                            )}
                          </HStack>
                          {assignment.url ? (
                            <DocusaurusLink to={assignment.url}>
                              <Text fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                                {assignment.title}
                              </Text>
                            </DocusaurusLink>
                          ) : (
                            <Text fontSize="sm">{assignment.title}</Text>
                          )}
                          {assignment.points && (
                            <Text fontSize="xs" color="fg.muted">
                              {assignment.points} points
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    </Card.Body>
                  </Card.Root>
                );
              })}
            </VStack>
          </Box>
        )}

        {/* Empty state */}
        {weekEntries.length === 0 && weekLabEntries.length === 0 && weekAssignments.length === 0 && (
          <Box p={4} bg="bg.muted" borderRadius="md">
            <Text color="fg.muted" textAlign="center">
              No lectures, labs, or deadlines scheduled for this week.
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
}
