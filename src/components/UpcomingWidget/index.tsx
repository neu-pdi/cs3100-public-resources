/**
 * Upcoming Widget Component
 * 
 * Displays upcoming lectures and assignments - can be embedded anywhere
 */

import React from 'react';
import Link from '@docusaurus/Link';
import type { CourseSchedule } from '@site/plugins/classasaurus/types';
import { getUpcomingMeetings, getUpcomingAssignments, formatDate } from '@site/plugins/classasaurus/utils';

interface UpcomingWidgetProps {
  scheduleData?: CourseSchedule;
  maxItems?: number;
  showAssignments?: boolean;
  showLectures?: boolean;
}

export default function UpcomingWidget({
  scheduleData,
  maxItems = 5,
  showAssignments = true,
  showLectures = true,
}: UpcomingWidgetProps): JSX.Element | null {
  // If no schedule data provided, try to load from plugin
  // In a real scenario, you'd use usePluginData from @docusaurus/useGlobalData
  if (!scheduleData) {
    return null;
  }

  const upcomingMeetings = getUpcomingMeetings(scheduleData, undefined, maxItems);
  const upcomingAssignments = getUpcomingAssignments(scheduleData.config, undefined, maxItems);

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: '8px',
      backgroundColor: 'var(--ifm-color-emphasis-0)',
      marginBottom: '2rem',
    }}>
      <h3 style={{ marginTop: 0 }}>📅 Upcoming</h3>

      {showLectures && upcomingMeetings.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Classes
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {upcomingMeetings.map((meeting, idx) => {
              const date = formatDate(meeting.date, { month: 'short', day: 'numeric' });
              const topic = meeting.lecture?.title || meeting.lecture?.lectureId || 'TBD';
              
              return (
                <li
                  key={`${meeting.date}-${meeting.sectionId}-${idx}`}
                  style={{
                    padding: '0.5rem 0',
                    borderBottom: idx < upcomingMeetings.length - 1
                      ? '1px solid var(--ifm-color-emphasis-100)'
                      : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      {meeting.lecture?.lectureId ? (
                        <Link to={`/lecture-notes/${meeting.lecture.lectureId}`}>
                          {meeting.lecture.topics && meeting.lecture.topics.length > 0
                            ? `${meeting.sectionName}: ${meeting.lecture.topics.join(', ')}`
                            : `${meeting.sectionName}: ${topic}`
                          }
                        </Link>
                      ) : (
                        <span>{topic}</span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--ifm-color-emphasis-600)',
                      textAlign: 'right',
                      marginLeft: '1rem',
                    }}>
                      {date}
                      <div>{meeting.meeting.startTime}</div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showAssignments && upcomingAssignments.length > 0 && (
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Assignments
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {upcomingAssignments.map((assignment, idx) => {
              const dueDate = formatDate(assignment.dueDate, { month: 'short', day: 'numeric' });
              const daysUntilDue = Math.ceil(
                (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              const urgencyColor = daysUntilDue <= 2
                ? 'var(--ifm-color-danger)'
                : daysUntilDue <= 7
                ? 'var(--ifm-color-warning)'
                : 'var(--ifm-color-emphasis-600)';
              
              return (
                <li
                  key={assignment.id}
                  style={{
                    padding: '0.5rem 0',
                    borderBottom: idx < upcomingAssignments.length - 1
                      ? '1px solid var(--ifm-color-emphasis-100)'
                      : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      {assignment.url ? (
                        <Link to={assignment.url}>{assignment.title}</Link>
                      ) : (
                        <span>{assignment.title}</span>
                      )}
                      <div style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)' }}>
                        {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
                        {assignment.points && ` • ${assignment.points} pts`}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      color: urgencyColor,
                      textAlign: 'right',
                      marginLeft: '1rem',
                      fontWeight: daysUntilDue <= 2 ? 'bold' : 'normal',
                    }}>
                      {dueDate}
                      <div>
                        {daysUntilDue === 0 && 'Due today!'}
                        {daysUntilDue === 1 && 'Due tomorrow'}
                        {daysUntilDue > 1 && `in ${daysUntilDue} days`}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {upcomingMeetings.length === 0 && upcomingAssignments.length === 0 && (
        <p style={{ color: 'var(--ifm-color-emphasis-600)', margin: 0 }}>
          No upcoming items scheduled
        </p>
      )}

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link to="/schedule" style={{ fontSize: '0.9rem' }}>
          View Full Schedule →
        </Link>
      </div>
    </div>
  );
}

