"use client";

import Layout from '@theme/Layout';
import { Box, Heading, Text, VStack, HStack, Card, Badge } from '@chakra-ui/react';
import { useCourseConfig } from '../hooks/useCourseConfig';
import { useWeekSchedule } from '../hooks/useCalendarEvents';
import { startOfWeek, format, parseISO, isSameDay } from 'date-fns';
import Link from '@docusaurus/Link';
import DocusaurusLink from '@docusaurus/Link';

// Helper to extract lectureId from uid and generate lecture URL
function getLectureUrlFromUid(uid: string | undefined): string | null {
  if (!uid || !uid.startsWith("lecture-")) return null;
  // uid format: lecture-{lectureId}-{dateStr}-{sectionId}
  // dateStr format: YYYY-MM-DD (has 2 hyphens)
  // We need to extract everything between "lecture-" and the date pattern
  const match = uid.match(/^lecture-(.+?)-(\d{4}-\d{2}-\d{2})-/);
  if (!match || match.length < 2) return null;
  const lectureId = match[1];
  return `/lecture-notes/${lectureId}`;
}

export default function Hello() {
    const courseConfig = useCourseConfig();
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // Sunday
    const weekEvents = useWeekSchedule(weekStart);

    // Group events by date
    const eventsByDate = weekEvents.reduce((acc, event) => {
        const eventDate = parseISO(event.start_time);
        const dateKey = format(eventDate, 'yyyy-MM-dd');
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {} as Record<string, typeof weekEvents>);

    // Sort dates
    const sortedDates = Object.keys(eventsByDate).sort();

    return (
        <Layout title="Welcome" description="CS 3100: Program Design and Implementation II">
            <Box maxW="800px" mx="auto" px={6} py={8}>
                <VStack align="stretch" gap={8}>

                    {/* Course Header */}
                    <Box>
                        <Text fontSize="sm" color="fg.muted" mb={1}>
                            {courseConfig?.semester || 'Spring 2026'}
                        </Text>
                        <Heading size="2xl" mb={2}>
                            {courseConfig?.courseCode || 'CS 3100'}: Program Design & Implementation II
                        </Heading>
                        <Text color="fg.muted" lineHeight="tall">
                            Most software outlives the assumptions it was built on. Requirements evolve, teams change, and the world around your code shifts in ways you didn't anticipate. This course teaches you to write software that can adapt—code that remains understandable, modifiable, and valuable over its entire lifecycle. You'll learn to think beyond immediate correctness to consider sustainability in multiple dimensions: technical longevity, economic viability, and the broader impacts your software has on its users and society.
                        </Text>
                        <Text color="fg.muted" lineHeight="tall" mt={4}>
                            The assignments in this course center on <em>CookYourBooks</em>, a desktop application you'll build from domain model to polished GUI. It's real software—with messy requirements, design tradeoffs, and the need to coordinate with teammates. Midway through, you'll learn to leverage AI coding assistants while maintaining the judgment to know when they help and when they mislead. The work surfaces questions that matter beyond any single assignment:
                        </Text>
                        <Box as="ol" fontSize="sm" color="fg.muted" pl={5} css={{ '& li': { marginBottom: '0.25rem' } }}>
                            <li>Why do some codebases become unmaintainable within months, while others remain flexible for decades?</li>
                            <li>What does it mean for code to be "readable"—and why do experienced developers often disagree?</li>
                            <li>How do you build software when the people paying for it want different things than the people using it?</li>
                            <li>When does using an AI coding assistant make you more productive, and when does it waste your time or lead you astray?</li>
                            <li>What separates high-functioning teams from groups where one person does all the work?</li>
                            <li>How do you design software that works for users whose abilities and contexts differ from your own?</li>
                            <li>When should you invest in more design upfront, and when should you just start coding?</li>
                        </Box>
                    </Box>

                    {/* Navigation */}
                    <Box borderY="1px solid" borderColor="border.muted" py={4}>
                        <HStack gap={6} flexWrap="wrap" justify="center">
                            <Link to="/schedule">
                                <Text fontWeight="medium" _hover={{ textDecoration: 'underline' }}>Schedule</Text>
                            </Link>
                            <Link to="/syllabus">
                                <Text fontWeight="medium" _hover={{ textDecoration: 'underline' }}>Syllabus</Text>
                            </Link>
                            <Link to="/lecture-notes">
                                <Text fontWeight="medium" _hover={{ textDecoration: 'underline' }}>Lecture Notes</Text>
                            </Link>
                            <Link to="/assignments">
                                <Text fontWeight="medium" _hover={{ textDecoration: 'underline' }}>Assignments</Text>
                            </Link>
                            <Link to="/staff">
                                <Text fontWeight="medium" _hover={{ textDecoration: 'underline' }}>Staff</Text>
                            </Link>
                        </HStack>
                    </Box>

                    {/* AI Approach */}
                    <Box>
                        <Heading size="md" mb={2}>Our Approach to AI</Heading>
                        <Text fontSize="sm" color="fg.muted" lineHeight="tall">
                            AI coding assistants can generate code quickly, but they cannot judge whether that code solves the right problem, integrates cleanly, or will be maintainable. We restrict AI tools early while you build foundational competence, then explicitly teach effective human-AI collaboration once you can critically evaluate generated code.{' '}
                            <Link to="/syllabus#artificial-intelligence">Read our full AI policy →</Link>
                        </Text>
                    </Box>

                    {/* This Week's Events */}
                    <Box>
                        <HStack justify="space-between" align="center" mb={4}>
                            <Heading size="md">This Week</Heading>
                            <Link to="/schedule">
                                <Text fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                                    View full schedule →
                                </Text>
                            </Link>
                        </HStack>

                        {sortedDates.length === 0 ? (
                            <Card.Root>
                                <Card.Body>
                                    <Text color="fg.muted" textAlign="center">
                                        No events scheduled this week.
                                    </Text>
                                </Card.Body>
                            </Card.Root>
                        ) : (
                            <VStack align="stretch" gap={3}>
                                {sortedDates.map((dateKey) => {
                                    const date = parseISO(dateKey);
                                    const isToday = isSameDay(date, today);
                                    const dayEvents = eventsByDate[dateKey];

                                    return (
                                        <Card.Root key={dateKey} borderColor={isToday ? "blue.500" : undefined} borderWidth={isToday ? "2px" : "1px"}>
                                            <Card.Body>
                                                <VStack align="stretch" gap={2}>
                                                    <HStack>
                                                        <Text fontWeight="semibold" fontSize="sm">
                                                            {format(date, 'EEEE, MMM d')}
                                                        </Text>
                                                        {isToday && (
                                                            <Badge colorPalette="blue" size="sm">Today</Badge>
                                                        )}
                                                    </HStack>
                                                    <VStack align="stretch" gap={1.5}>
                                                        {dayEvents.map((event) => {
                                                            const startTime = format(parseISO(event.start_time), 'h:mm a');
                                                            const endTime = format(parseISO(event.end_time), 'h:mm a');
                                                            const lectureUrl = getLectureUrlFromUid(event.uid);
                                                            const isOfficeHours = event.calendar_type === 'office_hours';
                                                            const isAssignment = event.uid?.startsWith('assignment-');

                                                            return (
                                                                <HStack key={event.id} align="flex-start" gap={3}>
                                                                    <Text fontSize="xs" color="fg.muted" minW="80px" flexShrink={0}>
                                                                        {startTime} - {endTime}
                                                                    </Text>
                                                                    <VStack align="flex-start" gap={0.5} flex={1}>
                                                                        {lectureUrl ? (
                                                                            <DocusaurusLink to={lectureUrl}>
                                                                                <Text fontSize="sm" fontWeight="medium" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                                                                                    {event.title}
                                                                                </Text>
                                                                            </DocusaurusLink>
                                                                        ) : (
                                                                            <Text fontSize="sm" fontWeight="medium">
                                                                                {event.title}
                                                                            </Text>
                                                                        )}
                                                                        {event.location && (
                                                                            <Text fontSize="xs" color="fg.muted">
                                                                                📍 {event.location}
                                                                            </Text>
                                                                        )}
                                                                        {event.queue_name && (
                                                                            <Badge colorPalette="blue" size="xs">
                                                                                {event.queue_name}
                                                                            </Badge>
                                                                        )}
                                                                    </VStack>
                                                                    {isOfficeHours && (
                                                                        <Badge colorPalette="blue" size="sm">Office Hours</Badge>
                                                                    )}
                                                                    {isAssignment && (
                                                                        <Badge colorPalette="orange" size="sm">Due</Badge>
                                                                    )}
                                                                </HStack>
                                                            );
                                                        })}
                                                    </VStack>
                                                </VStack>
                                            </Card.Body>
                                        </Card.Root>
                                    );
                                })}
                            </VStack>
                        )}
                    </Box>

                </VStack>
            </Box>
        </Layout>
    );
}
