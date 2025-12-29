/**
 * Staff member information for the CS 3100 course
 */

export type StaffRole = 'instructor' | 'academic-coordinator' | 'ta';

export interface StaffMember {
  /** Full name of the staff member */
  name: string;
  /** Pronouns (e.g., "he/him", "she/her", "they/them") - optional */
  pronouns?: string;
  /** Role: instructor, academic-coordinator, or ta */
  role: StaffRole;
  /** Campus location (e.g., "Boston", "Oakland", "Seattle") */
  campus: string;
  /** Brief biography */
  bio: string;
  /** Path to headshot image relative to static/img/staff/ */
  headshot: string;
  /** Email address (for instructors) - optional */
  email?: string;
  /** Homepage URL (for instructors) - optional, makes name a link */
  homepage?: string;
}

export const staffMembers: StaffMember[] = [
  // Instructors
  {
    name: "Jonathan Bell",
    pronouns: "he/him",
    role: "instructor",
    campus: "Boston",
    bio: "Associate Professor of Computer Science with research interests in software engineering and program analysis.",
    headshot: "jbell.jpg",
    email: "j.bell@northeastern.edu",
    homepage: "https://www.jonbell.net"
  },
  {
    name: "Ellen Spertus",
    pronouns: "she/her",
    role: "instructor",
    campus: "Oakland",
    bio: "Teaching Professor",
    headshot: "staff-placeholder.svg",
    email: "e.spertus@northeastern.edu"
  },
  {
    name: "Ferdinand Vesely",
    pronouns: "",
    role: "instructor",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg",
    email: "f.vesely@northeastern.edu"
  },
  {
    name: "Jeongkyu Lee",
    pronouns: "",
    role: "instructor",
    campus: "New York City",
    bio: "",
    headshot: "staff-placeholder.svg",
    email: "jeo.lee@northeastern.edu"
  },
  
  // Academic Coordinator
  {
    name: "Tim Howard",
    pronouns: "",
    role: "academic-coordinator",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  
  // Teaching Assistants
  {
    name: "Dhairya Bhatia",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Lauren Brissette",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Edgar Castaneda",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Edward Chan",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Rohan Kumar Chitra",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Sahil Chute",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Manav Kamleshbhai Dhamani",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Amber Friar",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Ran Fukazawa",
    role: "ta",
    campus: "Oakland",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Carmen Gray",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Zainab Imadulla",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Pratham Kiran Mehta",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Avery Neuner",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Shivang Manishkumar Patel",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Peter SantaLucia",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Samyak Bijal Shah",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Ivan Shuvalov",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Rimjhim Singh",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Sean Snaider",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Advaita Srihari Raghavan",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Liangliang Sun",
    role: "ta",
    campus: "Oakland",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Jessica Teurn",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Prakriti Timalsina",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Abhishek Tuteja",
    role: "ta",
    campus: "Oakland",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Aditya Vij",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Grant Wang",
    role: "ta",
    campus: "Boston",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
  {
    name: "Rebecca Williams",
    role: "ta",
    campus: "Oakland",
    bio: "",
    headshot: "staff-placeholder.svg"
  },
];
