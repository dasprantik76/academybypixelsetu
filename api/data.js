// Vercel Serverless Function: /api/data.js
// Multi-Tenant MongoDB Partitioned SaaS API for Academy Platform

import { getDatabase } from './lib/mongodb.js';
import { randomUUID, randomInt } from 'node:crypto';

const COLLECTIONS = {
  PROFILE: 'profile',
  COURSES: 'courses',
  STUDENTS: 'students',
  AUTH_TOKEN: 'auth_token',
  COUNTERS: 'counters',
  MESSAGES: 'messages',
  BATCHES: 'batches'
};

async function getNextStudentId(db, ownerEmail) {
  const profile = await db.collection(COLLECTIONS.PROFILE).findOne(
    { ownerEmail },
    { projection: { studentIdPrefix: 1, slug: 1, academyName: 1 } }
  );

  let prefix = profile?.studentIdPrefix;
  if (!prefix) {
    if (profile?.slug) {
      prefix = `${profile.slug.toUpperCase().slice(0, 4)}/`;
    } else {
      prefix = 'STU/';
    }
  }
  if (!prefix.endsWith('/')) prefix += '/';

  const defaultStartSeq = 1000;
  const counter = await db.collection(COLLECTIONS.COUNTERS).findOneAndUpdate(
    { _id: `student-id:${ownerEmail}` },
    [{
      $set: {
        sequence: {
          $add: [{ $max: [{ $ifNull: ['$sequence', defaultStartSeq] }, defaultStartSeq] }, 1]
        }
      }
    }],
    { upsert: true, returnDocument: 'after' }
  );
  return `${prefix}${String(counter.sequence).padStart(5, '0')}`;
}

const COURSE_SEED_VERSION = 2;
function verifyImageKitStudentPhoto(student) {
  const urlEndpoint = String(process.env.IMAGEKIT_URL_ENDPOINT || '').replace(/\/$/, '');
  const photoUrl = String(student?.photoUrl || '').trim();
  const fileId = String(student?.imageKitFileId || '').trim();
  const filePath = String(student?.imageKitFilePath || '').trim();
  if (!urlEndpoint || !fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)
    || !filePath.startsWith('/academy/student-photos/')) return false;

  try {
    const endpoint = new URL(urlEndpoint);
    const uploaded = new URL(photoUrl);
    const expectedPath = `${endpoint.pathname.replace(/\/$/, '')}${filePath}`;
    return uploaded.origin === endpoint.origin && uploaded.pathname === expectedPath;
  } catch {
    return false;
  }
}

async function deleteImageKitFile(fileId) {
  if (!fileId || typeof fileId !== 'string') return false;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) return false;
  try {
    const authHeader = `Basic ${Buffer.from(privateKey + ':').toString('base64')}`;
    const response = await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader
      }
    });
    return response.ok || response.status === 404;
  } catch (err) {
    console.warn('[ImageKit Delete Error]:', err);
    return false;
  }
}

// Super Administrator Accounts with Platform Tenant Approval Rights
const configuredSuperAdmin = process.env.SUPER_ADMIN_EMAIL || process.env.SUPER_ADMIN_EMAILS || '';
const SUPER_ADMIN_EMAILS = new Set(
  configuredSuperAdmin.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
);

// Default seed profiles for multi-tenant academies
const DEFAULT_TENANTS = {
  diganta: {
    academyName: 'Diganta Computer Centre',
    ownerName: 'Diganta',
    phone: '9733894742',
    secondaryPhone: '9733894742',
    whatsapp: '9733894742',
    address: 'Shyampur, Howrah',
    pincode: '711314',
    slug: 'diganta',
    status: 'active',
    studentIdPrefix: 'DCC/SMP/',
    category: 'Computer Science & Information Technology',
    about: 'Premier professional computer and software training academy offering certified courses.',
    aboutHeadline: 'West Bengal',
    aboutStory: 'Premier professional computer and software training academy offering certified courses.',
    heroDesc: 'Premier professional computer and software training academy offering certified courses.',
    aboutHighlights: [
      'Certified Expert & Industry-Experienced Faculty',
      '100% Practical Hands-on Lab Sessions',
      'Recognized Government & Industry Certifications',
      'Comprehensive Career Guidance & Placement Assistance'
    ],
    tagline: 'Admissions & Registrations Open 2026'
  },
  poulami: {
    academyName: 'Poulami Dance Academy',
    ownerName: 'Poulami',
    phone: '9876543211',
    slug: 'poulami',
    status: 'active',
    category: 'Performing Arts & Classical Dance',
    about: 'Dedicated institute for Classical Dance, Bharatanatyam, Kathak, and Contemporary Dance training.'
  }
};

// Default sample courses for new academies
const DEFAULT_COURSES_BY_SLUG = {
  diganta: [
    {
      id: 'CRS-101',
      title: 'Diploma in Computer Applications (DCA)',
      duration: '6 Months',
      description: 'Comprehensive fundamentals of computer operations, MS Office suite, Internet basics, and database concepts.',
    },
    {
      id: 'CRS-102',
      title: 'Full Stack Web Development',
      duration: '1 Year',
      description: 'Modern front-end and back-end web development with HTML5, CSS3, JavaScript, Node.js, and Databases.',
    },
    {
      id: 'CRS-103',
      title: 'Post Graduate Diploma in Computer Applications (PGDCA)',
      duration: '1 Year',
      description: 'Advanced programming concepts, system architecture, database administration, and project implementation.',
    },
    {
      id: 'CRS-104',
      title: 'Certificate in Office Automation',
      duration: '3 Months',
      description: 'Practical training in Word, Excel, PowerPoint, email, document formatting, and everyday office productivity.',
    },
    {
      id: 'CRS-105',
      title: 'Tally Prime with GST',
      duration: '4 Months',
      description: 'Learn computerized accounting, inventory management, GST invoicing, taxation reports, and payroll using Tally Prime.',
    },
    {
      id: 'CRS-106',
      title: 'Graphic Design Fundamentals',
      duration: '6 Months',
      description: 'Build creative design skills through typography, image editing, branding, social media graphics, and print layouts.',
    },
    {"id": "CRS-DEMO-001", "title": "Advanced Excel & MIS Reporting", "duration": "3 Months", "description": "Build spreadsheet models using lookup functions, PivotTables, data validation, Power Query, and interactive dashboards. Complete a monthly sales reporting project.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-002", "title": "Python Programming", "duration": "4 Months", "description": "Learn variables, control flow, functions, collections, file handling, exceptions, and object-oriented programming. Build command-line utilities and automate routine tasks.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-003", "title": "Data Analysis with Python", "duration": "6 Months", "description": "Clean and explore datasets with pandas and NumPy, visualize results with Matplotlib, and summarize findings using descriptive statistics and reproducible notebooks.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-004", "title": "SQL & Database Design", "duration": "3 Months", "description": "Write queries with joins, subqueries, aggregate functions, and window functions. Design relational schemas, apply normalization, and practice transactions and indexing.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-005", "title": "Power BI Dashboard Development", "duration": "3 Months", "description": "Import and transform data with Power Query, build relationships and DAX measures, and create interactive reports with filters, drill-through pages, and business metrics.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-006", "title": "Web Design with HTML & CSS", "duration": "3 Months", "description": "Create responsive websites with semantic HTML, CSS Grid, Flexbox, accessible forms, and media queries. Publish a portfolio website with layouts for mobile and desktop.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-007", "title": "JavaScript Programming", "duration": "4 Months", "description": "Practice functions, arrays, objects, DOM manipulation, events, promises, and asynchronous requests. Build interactive browser applications with validation and error handling.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-008", "title": "React Frontend Development", "duration": "4 Months", "description": "Build reusable components with props, state, hooks, routing, and forms. Connect a frontend to an API and complete an accessible multi-page application.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-009", "title": "Node.js & Express Backend Development", "duration": "4 Months", "description": "Create REST APIs with routing, middleware, validation, authentication, and database integration. Practice automated tests, error handling, and application deployment.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-010", "title": "Django Web Development", "duration": "4 Months", "description": "Develop database-backed websites using models, views, templates, forms, authentication, and the Django admin. Build and deploy a complete student project.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-011", "title": "Java Programming", "duration": "6 Months", "description": "Learn Java syntax, classes, inheritance, interfaces, collections, exceptions, and JDBC. Develop a database-connected application using structured object-oriented design.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-012", "title": "C Programming Fundamentals", "duration": "3 Months", "description": "Understand data types, loops, functions, arrays, pointers, structures, and file operations. Practice debugging and implement small programs for common computing problems.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-013", "title": "C++ & Data Structures", "duration": "6 Months", "description": "Study classes, templates, the standard library, linked lists, stacks, queues, trees, and graphs. Compare sorting and searching algorithms using time and space complexity.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-014", "title": "Computer Hardware & Troubleshooting", "duration": "4 Months", "description": "Identify desktop components, assemble systems, install operating systems and drivers, diagnose common faults, and practice backups and preventive maintenance.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-015", "title": "Computer Networking Fundamentals", "duration": "4 Months", "description": "Learn network devices, Ethernet, IP addressing, subnetting, DNS, DHCP, routing, and wireless networks. Configure a small office network and troubleshoot connectivity.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-016", "title": "Linux Administration", "duration": "4 Months", "description": "Use the Linux shell, manage users and permissions, configure services, inspect logs, schedule jobs, and write shell scripts for routine administration tasks.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-017", "title": "Cybersecurity Fundamentals", "duration": "4 Months", "description": "Study access control, secure configuration, phishing awareness, network security, backups, and incident response. Practice defensive analysis in isolated training labs.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-018", "title": "Cloud Computing Fundamentals", "duration": "3 Months", "description": "Understand virtual machines, storage, networking, identity management, monitoring, and shared responsibility. Design a small cloud-hosted application and estimate resource usage.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-019", "title": "Git, Docker & CI/CD Fundamentals", "duration": "4 Months", "description": "Manage branches and code reviews with Git, package applications in Docker containers, and build automated pipelines for testing and deployment.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-020", "title": "UI & UX Design with Figma", "duration": "4 Months", "description": "Practice user interviews, information architecture, wireframes, component libraries, responsive layouts, and interactive prototypes. Conduct usability testing on a design project.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-021", "title": "Adobe Photoshop & Image Editing", "duration": "3 Months", "description": "Edit photographs using layers, masks, selections, retouching, color correction, and nondestructive adjustments. Prepare images for print, websites, and social media.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-022", "title": "Vector Illustration with Adobe Illustrator", "duration": "3 Months", "description": "Create vector artwork with shapes, paths, the Pen tool, typography, and reusable graphic assets. Design logos, icons, packaging layouts, and print-ready illustrations.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-023", "title": "Video Editing with Adobe Premiere Pro", "duration": "4 Months", "description": "Organize footage, edit sequences, synchronize audio, add titles and transitions, correct color, and export video. Complete a short promotional film from raw footage.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-024", "title": "WordPress Website Development", "duration": "3 Months", "description": "Build websites using themes, blocks, menus, forms, and plugins. Practice backups, security updates, performance optimization, and basic search-friendly site structure.", "createdAt": "2026-09-01T09:00:00.000Z"},
    {"id": "CRS-DEMO-025", "title": "AutoCAD 2D Drafting", "duration": "4 Months", "description": "Create technical drawings with precise dimensions, layers, blocks, annotations, layouts, and plotting. Produce a complete set of 2D plans for a drafting project.", "createdAt": "2026-09-01T09:00:00.000Z"}
  ],
  poulami: [
    {
      id: 'CRS-201',
      title: 'Classical Bharatanatyam (Foundation & Advanced)',
      duration: '1 Year',
      description: 'Traditional Margam repertoire, Adavus, Mudras, rhythmic Abhinaya, and stage performance mastery.',
    },
    {
      id: 'CRS-202',
      title: 'Kathak Dance Certification',
      duration: '6 Months',
      description: 'Tatkar footwork, Chakkars, Thaat, Tukras, and expressive storytelling through rhythm.',
    },
    {
      id: 'CRS-203',
      title: 'Contemporary & Creative Movement',
      duration: '6 Months',
      description: 'Fluid choreography, body alignment, contemporary expression, and stage performance techniques.',
    },
    {
      id: 'CRS-204',
      title: 'Rabindra Nritya',
      duration: '6 Months',
      description: 'Learn expressive movement, musical interpretation, and choreography based on the works of Rabindranath Tagore.',
    },
    {
      id: 'CRS-205',
      title: 'Creative Dance for Children',
      duration: '6 Months',
      description: 'An engaging foundation program that develops rhythm, coordination, expression, confidence, and stage presence.',
    },
    {
      id: 'CRS-206',
      title: 'Dance Performance Workshop',
      duration: '3 Months',
      description: 'Focused training in choreography, musicality, stagecraft, group coordination, and live performance preparation.',
    }
  ]
};

const DEFAULT_MESSAGES_BY_SLUG = {
  diganta: [
    {
      id: 'msg_101',
      academySlug: 'prantik',
      name: 'Sourav Mukherjee',
      phone: '9830145291',
      course: 'Certificate in Financial Accounting (Tally Prime & GST)',
      message: 'Hello Sir, I have completed B.Com and want to learn practical Tally Prime with GST filing and e-way billing. Are there weekend morning batches available? Please let me know the course fee and start date.',
      isRead: false,
      createdAt: '2026-09-13T13:31:25.413Z'
    },
    {
      id: 'msg_102',
      academySlug: 'prantik',
      name: 'Priyanka Sengupta',
      phone: '9874120365',
      course: 'Diploma in Computer Applications (DCA)',
      message: 'Hi, I want to enroll in the 6-month DCA course for college students. Do you provide ISO/government-recognized certificates upon course completion? Kindly share the detailed syllabus.',
      isRead: false,
      createdAt: '2026-09-13T12:06:25.413Z'
    },
    {
      id: 'msg_103',
      academySlug: 'prantik',
      name: 'Subhajit Karmakar',
      phone: '9123456780',
      course: 'Full Stack Web Development',
      message: 'I am interested in the Web Development batch starting this month. Does the curriculum cover React and Node.js with live database projects? Can I attend a demo class this Saturday?',
      isRead: false,
      createdAt: '2026-09-13T09:06:25.413Z'
    },
    {
      id: 'msg_104',
      academySlug: 'prantik',
      name: 'Ananya Roychowdhury',
      phone: '9433219087',
      course: 'Advanced Excel & Business Analytics',
      message: 'Good evening. I work as an accountant and need to master VLOOKUP, XLOOKUP, Pivot Tables, and financial dashboards. How long is the weekend crash course and what are the timings?',
      isRead: false,
      createdAt: '2026-09-13T06:06:25.413Z'
    },
    {
      id: 'msg_105',
      academySlug: 'prantik',
      name: 'Debjit Banerjee',
      phone: '9836541298',
      course: 'Desktop Publishing & Graphic Design',
      message: 'Sir, do you teach Adobe Photoshop, Illustrator, and CorelDRAW in the DTP course? I want to learn design for print and social media banners. Are individual workstations provided for practice?',
      isRead: false,
      createdAt: '2026-09-12T16:06:25.413Z'
    },
    {
      id: 'msg_106',
      academySlug: 'prantik',
      name: 'Riya Chakraborty',
      phone: '9748231905',
      course: 'Python Programming & Data Science',
      message: 'Hello, I am a 2nd year BCA student looking for a practical Python programming course that covers pandas and data visualization. Please share the admission procedure and fee installments.',
      isRead: false,
      createdAt: '2026-09-12T10:06:25.413Z'
    },
    {
      id: 'msg_107',
      academySlug: 'prantik',
      name: 'Tanmay Dutta',
      phone: '9831098234',
      course: 'Diploma in Computer Applications (DCA)',
      message: 'I want to enroll my younger sister in the computer basics and office automation batch after her 12th board exams. What are the daily batch hours for the afternoon session?',
      isRead: true,
      readAt: '2026-09-13T13:36:25.413Z',
      createdAt: '2026-09-11T14:06:25.413Z'
    },
    {
      id: 'msg_108',
      academySlug: 'prantik',
      name: 'Sneha Bhattacharya',
      phone: '9051876432',
      course: 'Certificate in Financial Accounting (Tally Prime & GST)',
      message: 'Inquired about the Tally certification last week. Can I pay the admission fee online through UPI or visit the center in person? Please confirm center timings tomorrow.',
      isRead: true,
      readAt: '2026-09-13T12:06:25.413Z',
      createdAt: '2026-09-11T07:06:25.413Z'
    },
    {
      id: 'msg_109',
      academySlug: 'prantik',
      name: 'Arindam Halder',
      phone: '9874561230',
      course: 'Hardware & Networking Essentials',
      message: 'Respected Sir, does the hardware networking course include hands-on PC assembling, OS installation, and router troubleshooting? Kindly inform when the new batch commences.',
      isRead: true,
      readAt: '2026-09-13T08:06:25.413Z',
      createdAt: '2026-09-10T14:06:25.413Z'
    },
    {
      id: 'msg_110',
      academySlug: 'prantik',
      name: 'Moumita Paul',
      phone: '9432109876',
      course: 'Full Stack Web Development',
      message: 'Thank you for sharing the syllabus earlier. I would like to confirm my seat for the evening batch. Please guide me through the registration and student ID verification process.',
      isRead: true,
      readAt: '2026-09-13T02:06:25.413Z',
      createdAt: '2026-09-09T14:06:25.413Z'
    }
  ]
};

const DEFAULT_BATCHES_BY_SLUG = {
  diganta: [
  {
    "id": "6e3812a3-9c16-4c92-810d-91d8c1a34b9c",
    "createdAt": "2026-09-13T09:38:36.607Z",
    "name": "Full Stack Web Development - Batch 2026",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02075",
      "DCC/SMP/02081",
      "STU-1444",
      "DCC/SMP/02058",
      "DCC/SMP/02020",
      "DCC/SMP/02037",
      "DCC/SMP/02100",
      "DCC/SMP/02028"
    ],
    "updatedAt": "2026-09-13T09:38:36.607Z"
  },
  {
    "id": "666b2ca0-cc40-4857-a244-dbd5bd6c8558",
    "createdAt": "2026-09-12T11:02:27.287Z",
    "name": "DCC Course",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02109",
      "STU-6309",
      "DCC/SMP/02096",
      "DCC/SMP/02095",
      "DCC/SMP/02108"
    ],
    "updatedAt": "2026-09-12T17:07:54.605Z",
    "certificateIssueDate": "2026-09-12",
    "completedAt": "2026-09-12T15:54:08.926Z",
    "grade": "A+"
  },
  {
    "id": "22ffd44f-bdfb-4ae5-aeee-65fc7d6b883c",
    "createdAt": "2026-09-11T17:29:02.591Z",
    "name": "New Batch 2021",
    "status": "Completed",
    "studentIds": [
      "DCC/SMP/02109",
      "DCC/SMP/02085",
      "DCC/SMP/02061"
    ],
    "updatedAt": "2026-09-11T17:29:32.270Z",
    "certificateIssueDate": "2026-09-11",
    "completedAt": "2026-09-11T17:29:31.834Z",
    "grade": "A+"
  },
  {
    "id": "d751d0a3-6fbf-4dd9-90aa-4872718ccd5a",
    "createdAt": "2026-09-11T13:52:29.133Z",
    "name": "computer science",
    "status": "Completed",
    "studentIds": [
      "DCC/SMP/02106",
      "DCC/SMP/02096",
      "DCC/SMP/02095",
      "DCC/SMP/02094",
      "DCC/SMP/02093",
      "DCC/SMP/02092",
      "DCC/SMP/02091",
      "DCC/SMP/02090"
    ],
    "updatedAt": "2026-09-12T15:46:04.069Z",
    "certificateIssueDate": "2030-08-12",
    "completedAt": "2026-09-12T15:46:01.407Z",
    "grade": "A+"
  },
  {
    "id": "360c0a7b-dd41-4988-9e88-16ad6a123f33",
    "createdAt": "2026-09-10T15:41:50.551Z",
    "name": "ABC",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02010",
      "STU-7383",
      "STU-9970",
      "STU-1444",
      "DCC/SMP/02081"
    ],
    "updatedAt": "2026-09-12T15:38:31.373Z"
  },
  {
    "id": "ff4eff8d-e437-4476-ba82-9c3d88067f60",
    "createdAt": "2026-09-10T15:34:22.539Z",
    "name": "Python for Data Analytics - Morning Cohort",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02047",
      "DCC/SMP/02105",
      "DCC/SMP/02083",
      "DCC/SMP/02026",
      "DCC/SMP/02090"
    ],
    "updatedAt": "2026-09-10T15:34:22.539Z"
  },
  {
    "id": "46703bae-aba5-468d-9f57-a1ddfcafb62c",
    "createdAt": "2026-09-08T10:56:46.934Z",
    "name": "Tally Prime & GST Filing - Weekend Batch",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02102",
      "STU-1444",
      "DCC/SMP/02054",
      "DCC/SMP/02022",
      "DCC/SMP/02039",
      "STU-9970",
      "DCC/SMP/02028",
      "DCC/SMP/02013",
      "DCC/SMP/02042",
      "DCC/SMP/02053",
      "DCC/SMP/02044"
    ],
    "updatedAt": "2026-09-08T10:56:46.934Z"
  },
  {
    "id": "af86a220-831a-4c25-9287-5b62ad4d00d1",
    "createdAt": "2026-09-05T08:15:45.050Z",
    "name": "Advanced Excel & MIS Reporting - Fast Track",
    "status": "Completed",
    "studentIds": [
      "DCC/SMP/02200",
      "DCC/SMP/02098",
      "STU-1444",
      "DCC/SMP/02035",
      "DCC/SMP/02100",
      "DCC/SMP/02091",
      "DCC/SMP/02068",
      "DCC/SMP/02077",
      "DCC/SMP/02093",
      "DCC/SMP/02052",
      "DCC/SMP/02094",
      "DCC/SMP/02040"
    ],
    "updatedAt": "2026-09-05T08:15:45.050Z"
  },
  {
    "id": "64b3974f-848b-43a3-a77e-b580959c3b2e",
    "createdAt": "2026-09-02T18:03:54.477Z",
    "name": "Graphic Design & UI/UX - Batch Alpha",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02056",
      "DCC/SMP/02200",
      "DCC/SMP/02017",
      "STU-1444",
      "DCC/SMP/02039",
      "DCC/SMP/02103",
      "DCC/SMP/02045",
      "DCC/SMP/02059",
      "DCC/SMP/02021",
      "DCC/SMP/02038",
      "DCC/SMP/02082",
      "DCC/SMP/02081",
      "DCC/SMP/02069",
      "DCC/SMP/02026",
      "DCC/SMP/02100"
    ],
    "updatedAt": "2026-09-02T18:03:54.477Z"
  },
  {
    "id": "af929672-216c-4f3c-b5fd-db314934ca0c",
    "createdAt": "2026-08-31T14:35:44.976Z",
    "name": "Cybersecurity & Ethical Hacking - Cohort 1",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02025",
      "DCC/SMP/02220",
      "STU-9970",
      "DCC/SMP/02105",
      "DCC/SMP/02073",
      "DCC/SMP/02217",
      "DCC/SMP/02028",
      "DCC/SMP/02037",
      "DCC/SMP/02019",
      "DCC/SMP/02078",
      "DCC/SMP/02034",
      "DCC/SMP/02035",
      "DCC/SMP/02023",
      "DCC/SMP/02027",
      "DCC/SMP/02026",
      "DCC/SMP/02011"
    ],
    "updatedAt": "2026-08-31T14:35:44.976Z"
  },
  {
    "id": "a0357697-9e15-4d7f-9d5f-80719dd77105",
    "createdAt": "2026-08-28T19:29:32.922Z",
    "name": "Diploma in Computer Applications (DCA) - Regular",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02028",
      "DCC/SMP/02053",
      "DCC/SMP/02052",
      "DCC/SMP/02205",
      "DCC/SMP/02207",
      "DCC/SMP/02068",
      "DCC/SMP/02105",
      "DCC/SMP/02200",
      "DCC/SMP/02041",
      "DCC/SMP/02102",
      "DCC/SMP/02218",
      "DCC/SMP/02045",
      "DCC/SMP/02215"
    ],
    "updatedAt": "2026-08-28T19:29:32.922Z"
  },
  {
    "id": "b12bb9b2-e59d-469e-9830-103282c99e6b",
    "createdAt": "2026-08-26T12:02:13.493Z",
    "name": "Cloud Computing & AWS - Evening Batch",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02038",
      "DCC/SMP/02204",
      "DCC/SMP/02070",
      "DCC/SMP/02083",
      "DCC/SMP/02102"
    ],
    "updatedAt": "2026-08-26T12:02:13.493Z"
  },
  {
    "id": "25e45c23-c0d9-40bc-9461-9e78cb5fabfe",
    "createdAt": "2026-08-24T14:41:04.297Z",
    "name": "Digital Marketing & SEO - Batch 2026-A",
    "status": "Completed",
    "studentIds": [
      "DCC/SMP/02078",
      "DCC/SMP/02055",
      "DCC/SMP/02044",
      "DCC/SMP/02067",
      "DCC/SMP/02053",
      "DCC/SMP/02211",
      "DCC/SMP/02021",
      "DCC/SMP/02051",
      "DCC/SMP/02066",
      "DCC/SMP/02052"
    ],
    "updatedAt": "2026-08-24T14:41:04.297Z"
  },
  {
    "id": "ae43300f-cefb-4860-b94f-0a174e43b69b",
    "createdAt": "2026-08-21T16:10:35.675Z",
    "name": "Java Enterprise & Spring Boot - Weekend Intensive",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02109",
      "DCC/SMP/02033",
      "DCC/SMP/02022",
      "DCC/SMP/02096",
      "DCC/SMP/02085",
      "DCC/SMP/02083",
      "DCC/SMP/02038"
    ],
    "updatedAt": "2026-08-21T16:10:35.675Z"
  },
  {
    "id": "b7e12059-53bd-4b11-8ede-b8d45c41967e",
    "createdAt": "2026-08-18T18:01:08.148Z",
    "name": "AutoCAD 2D/3D & Interior Drafting - Batch 3",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02070",
      "DCC/SMP/02069",
      "DCC/SMP/02219",
      "STU-1444",
      "DCC/SMP/02106",
      "DCC/SMP/02012",
      "DCC/SMP/02038",
      "DCC/SMP/02039",
      "DCC/SMP/02104",
      "DCC/SMP/02029"
    ],
    "updatedAt": "2026-08-18T18:01:08.148Z"
  },
  {
    "id": "872ad8c1-fe23-4734-b2e3-289a2a224fac",
    "createdAt": "2026-08-16T23:22:11.177Z",
    "name": "Computer Hardware & Networking - Morning 1",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02044",
      "DCC/SMP/02091",
      "DCC/SMP/02043",
      "DCC/SMP/02069",
      "DCC/SMP/02062",
      "DCC/SMP/02079",
      "DCC/SMP/02037",
      "DCC/SMP/02106"
    ],
    "updatedAt": "2026-08-16T23:22:11.177Z"
  },
  {
    "id": "ef5221d4-a9fb-4d36-8054-e6359d7782a9",
    "createdAt": "2026-08-13T23:31:46.243Z",
    "name": "React & Next.js Masterclass - Cohort B",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02084",
      "DCC/SMP/02093",
      "DCC/SMP/02080",
      "DCC/SMP/02220",
      "DCC/SMP/02074"
    ],
    "updatedAt": "2026-08-13T23:31:46.243Z"
  },
  {
    "id": "68530de7-71f1-4292-b770-50cbb396623a",
    "createdAt": "2026-08-12T03:05:40.728Z",
    "name": "Financial Accounting with Tally - Batch Delta",
    "status": "Completed",
    "studentIds": [
      "DCC/SMP/02202",
      "DCC/SMP/02038",
      "DCC/SMP/02045",
      "DCC/SMP/02013",
      "DCC/SMP/02098",
      "DCC/SMP/02081",
      "DCC/SMP/02213",
      "DCC/SMP/02082",
      "STU-9970",
      "DCC/SMP/02084",
      "DCC/SMP/02072",
      "DCC/SMP/02102"
    ],
    "updatedAt": "2026-08-12T03:05:40.728Z"
  },
  {
    "id": "c697dff2-e7b6-4b55-8edf-bf57de3491a2",
    "createdAt": "2026-08-09T12:29:44.247Z",
    "name": "C++ & Algorithms - Winter Cohort",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02043",
      "DCC/SMP/02059",
      "DCC/SMP/02017",
      "DCC/SMP/02038",
      "DCC/SMP/02047",
      "DCC/SMP/02023",
      "DCC/SMP/02027",
      "DCC/SMP/02099",
      "DCC/SMP/02021",
      "DCC/SMP/02108"
    ],
    "updatedAt": "2026-08-09T12:29:44.247Z"
  },
  {
    "id": "07c8a65d-da29-4cbc-ab78-95b5018e8fbc",
    "createdAt": "2026-08-06T05:40:42.880Z",
    "name": "Office Automation & Typing - Regular Batch",
    "status": "Active",
    "studentIds": [
      "STU-9970",
      "DCC/SMP/02038",
      "STU-7383",
      "DCC/SMP/02028"
    ],
    "updatedAt": "2026-08-06T05:40:42.880Z"
  },
  {
    "id": "8c2694a8-62d1-4574-a98c-2aa515b09153",
    "createdAt": "2026-08-03T17:56:23.714Z",
    "name": "Flutter & Mobile App Development - Weekend",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02095",
      "STU-1444",
      "DCC/SMP/02037",
      "DCC/SMP/02040",
      "DCC/SMP/02056",
      "DCC/SMP/02036",
      "DCC/SMP/02058",
      "DCC/SMP/02034",
      "DCC/SMP/02027",
      "DCC/SMP/02015",
      "STU-9970",
      "DCC/SMP/02048",
      "DCC/SMP/02209"
    ],
    "updatedAt": "2026-08-03T17:56:23.714Z"
  },
  {
    "id": "89ee35d0-c9f8-4206-93ea-2e93d5c19e68",
    "createdAt": "2026-08-01T20:28:22.458Z",
    "name": "Artificial Intelligence & Prompt Engineering - Cohort 2",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02223",
      "STU-1444",
      "DCC/SMP/02070",
      "DCC/SMP/02088",
      "DCC/SMP/02203",
      "DCC/SMP/02051",
      "DCC/SMP/02017",
      "DCC/SMP/02025",
      "DCC/SMP/02073",
      "DCC/SMP/02206"
    ],
    "updatedAt": "2026-08-01T20:28:22.458Z"
  },
  {
    "id": "f54c9bf4-4ea1-4f99-a0f9-06d3f0b25014",
    "createdAt": "2026-07-30T10:47:11.803Z",
    "name": "DTP, InDesign & Photoshop - Evening Batch",
    "status": "Completed",
    "studentIds": [
      "DCC/SMP/02016",
      "DCC/SMP/02206",
      "DCC/SMP/02075",
      "DCC/SMP/02042",
      "DCC/SMP/02207",
      "DCC/SMP/02101",
      "STU-1444",
      "DCC/SMP/02200",
      "DCC/SMP/02210",
      "DCC/SMP/02074",
      "DCC/SMP/02092",
      "DCC/SMP/02080",
      "DCC/SMP/02036",
      "DCC/SMP/02011",
      "DCC/SMP/02021"
    ],
    "updatedAt": "2026-07-30T10:47:11.803Z"
  },
  {
    "id": "1d403882-815e-45b6-bb76-5b54ec3a51ea",
    "createdAt": "2026-07-28T02:31:56.036Z",
    "name": "SQL & Database Administration - Fast Track",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02093",
      "DCC/SMP/02037",
      "STU-6309",
      "DCC/SMP/02038",
      "DCC/SMP/02011",
      "DCC/SMP/02069"
    ],
    "updatedAt": "2026-07-28T02:31:56.036Z"
  },
  {
    "id": "72f3a4af-5b8f-4a12-a6b5-7940f0c06767",
    "createdAt": "2026-07-25T14:16:02.899Z",
    "name": "IT Support & System Administration - Batch 4",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02094",
      "DCC/SMP/02013",
      "DCC/SMP/02080",
      "DCC/SMP/02083",
      "STU-1444",
      "DCC/SMP/02034",
      "DCC/SMP/02063",
      "DCC/SMP/02022",
      "DCC/SMP/02025",
      "DCC/SMP/02043"
    ],
    "updatedAt": "2026-07-25T14:16:02.899Z"
  },
  {
    "id": "6a5aabdf-f78a-4abb-bb36-683b703e1d0f",
    "createdAt": "2026-07-22T12:55:11.620Z",
    "name": "Web Design & Frontend Development - Cohort Gamma",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02208",
      "DCC/SMP/02081",
      "DCC/SMP/02064",
      "DCC/SMP/02066"
    ],
    "updatedAt": "2026-07-22T12:55:11.620Z"
  },
  {
    "id": "615a4275-6c74-40ee-9840-2d7b28965654",
    "createdAt": "2026-07-20T10:25:42.909Z",
    "name": "Node.js & Microservices - Weekend Cohort",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02092",
      "DCC/SMP/02026",
      "DCC/SMP/02053",
      "DCC/SMP/02030",
      "DCC/SMP/02042",
      "DCC/SMP/02038",
      "DCC/SMP/02029",
      "DCC/SMP/02067",
      "DCC/SMP/02051"
    ],
    "updatedAt": "2026-07-20T10:25:42.909Z"
  },
  {
    "id": "8dcf54cd-92cd-4386-b3f7-fc10d2dd1c5a",
    "createdAt": "2026-07-18T01:51:06.481Z",
    "name": "Certificate in Financial Management (CFM) - Batch 2",
    "status": "Completed",
    "studentIds": [
      "DCC/SMP/02045",
      "STU-7383",
      "DCC/SMP/02072",
      "STU-1444",
      "DCC/SMP/02219",
      "DCC/SMP/02207",
      "DCC/SMP/02084",
      "DCC/SMP/02089",
      "DCC/SMP/02037",
      "DCC/SMP/02014",
      "DCC/SMP/02028",
      "DCC/SMP/02016"
    ],
    "updatedAt": "2026-07-18T01:51:06.481Z"
  },
  {
    "id": "a1ab6746-a5f4-4c1e-a4ab-0415e17c5ac3",
    "createdAt": "2026-07-15T12:11:18.614Z",
    "name": "Python Django & REST API - Evening Cohort",
    "status": "Active",
    "studentIds": [
      "DCC/SMP/02205",
      "DCC/SMP/02029",
      "STU-7383",
      "DCC/SMP/02020",
      "DCC/SMP/02034",
      "DCC/SMP/02033",
      "DCC/SMP/02015"
    ],
    "updatedAt": "2026-07-15T12:11:18.614Z"
  }
]
};


let superAdminPurgeChecked = false;
async function purgeSuperAdminTenantData(db) {
  if (superAdminPurgeChecked) return;
  superAdminPurgeChecked = true;
  try {
    if (SUPER_ADMIN_EMAILS.size > 0) {
      const superAdminList = Array.from(SUPER_ADMIN_EMAILS);
      await Promise.all([
        db.collection(COLLECTIONS.PROFILE).deleteMany({ ownerEmail: { $in: superAdminList } }),
        db.collection(COLLECTIONS.COURSES).deleteMany({ ownerEmail: { $in: superAdminList } }),
        db.collection(COLLECTIONS.STUDENTS).deleteMany({ ownerEmail: { $in: superAdminList } }),
        db.collection(COLLECTIONS.BATCHES).deleteMany({ ownerEmail: { $in: superAdminList } }),
        db.collection(COLLECTIONS.MESSAGES).deleteMany({ ownerEmail: { $in: superAdminList } }),
        db.collection(COLLECTIONS.AUTH_TOKEN).deleteMany({ ownerEmail: { $in: superAdminList } }),
        db.collection(COLLECTIONS.COUNTERS).deleteMany({ _id: { $in: superAdminList.map(e => `student-id:${e}`) } })
      ]);
    }
  } catch (err) {
    console.warn('[SuperAdmin Purge Warning]:', err);
  }
}

export default async function handler(req, res) {
  // Universal CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check if MongoDB environment is configured
  if (!process.env.MONGODB_URI) {
    return res.status(200).json({
      success: false,
      isConfigured: false,
      message: 'MONGODB_URI is not configured. The frontend is operating in local fallback mode.'
    });
  }

  let db;
  try {
    db = await getDatabase();
    await purgeSuperAdminTenantData(db);
  } catch (dbErr) {
    console.error('[MongoDB Connection Error]:', dbErr);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: dbErr.message
    });
  }

  // Helper to resolve tenant email from request
  async function resolveOwnerEmail(queryEmail, querySlug, reqHost) {
    let email = (queryEmail || '').toLowerCase().trim();
    let slug = (querySlug || '').toLowerCase().trim();

    // If slug parameter actually contains an email, treat it as email directly
    if (!email && slug && slug.includes('@')) {
      email = slug;
      slug = '';
    }

    // Resolve legacy tenant-style hostnames when a slug was not supplied.
    if (!slug && reqHost) {
      const parts = reqHost.toLowerCase().split('.');
      if (parts.length >= 3) {
        const sub = parts[0];
        if (sub !== 'www' && sub !== 'academy' && sub !== 'app') {
          slug = sub;
        }
      }
    }

    if (!email && slug) {
      const profileDoc = await db.collection(COLLECTIONS.PROFILE).findOne(
        { $or: [{ slug }, { ownerEmail: slug }] },
        { projection: { _id: 0, ownerEmail: 1 } }
      );
      if (profileDoc && profileDoc.ownerEmail) {
        email = profileDoc.ownerEmail;
      } else {
        return null;
      }
    }

    // Default tenant fallback only when bare domain accessed with no specific subdomain/slug
    if (!email && !slug) {
      const firstActive = await db.collection(COLLECTIONS.PROFILE).findOne(
        { status: 'active' },
        { sort: { createdAt: 1 }, projection: { _id: 0, ownerEmail: 1 } }
      );
      if (firstActive && firstActive.ownerEmail) {
        email = firstActive.ownerEmail;
      }
    }
    return email;
  }

  // --------------------------------------------------------------------------
  // GET: Fetch Academy Data for Specific Tenant
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      const requestedSlug = req.query.academy || req.headers.host?.split('.')[0] || '';
      const ownerEmail = await resolveOwnerEmail(req.query.ownerEmail, req.query.academy, req.headers.host);

      if (!ownerEmail) {
        return res.status(404).json({
          success: false,
          notFound: true,
          slug: requestedSlug,
          message: `404 Not Found: The academy "${requestedSlug}" has not been registered or claimed yet.`
        });
      }

      const includeAdminData = Boolean(req.query.ownerEmail || req.query.admin === '1');
      let [profileDoc, coursesList, studentsList, authTokenDoc, messagesList, batchesList] = await Promise.all([
        db.collection(COLLECTIONS.PROFILE).findOne({ ownerEmail }, { projection: { _id: 0 } }),
        db.collection(COLLECTIONS.COURSES).find({ ownerEmail }, { projection: { _id: 0 } }).sort({ createdAt: -1, _id: -1 }).toArray(),
        db.collection(COLLECTIONS.STUDENTS).find({ ownerEmail }, { projection: { _id: 0 } }).sort({ joinDate: -1, createdAt: -1, _id: -1 }).toArray(),
        db.collection(COLLECTIONS.AUTH_TOKEN).findOne({ ownerEmail }, { projection: { _id: 0 } }),
        includeAdminData
          ? db.collection(COLLECTIONS.MESSAGES).find({ ownerEmail }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray()
          : Promise.resolve([]),
        includeAdminData
          ? db.collection(COLLECTIONS.BATCHES).find({ ownerEmail }, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray()
          : Promise.resolve([])
      ]);

      const tenantSlug = profileDoc?.slug;
      if (tenantSlug && DEFAULT_TENANTS[tenantSlug] && (!profileDoc || !profileDoc.updatedAt)) {
        const canonicalProfile = DEFAULT_TENANTS[tenantSlug];
        const missingFields = {};
        Object.entries(canonicalProfile).forEach(([key, value]) => {
          if (profileDoc?.[key] === undefined) {
            missingFields[key] = value;
          }
        });
        if (Object.keys(missingFields).length > 0) {
          profileDoc = { ...(profileDoc || {}), ...missingFields };
          await db.collection(COLLECTIONS.PROFILE).updateOne(
            { ownerEmail },
            { $set: missingFields },
            { upsert: true }
          );
        }
      }

      const starterCourses = tenantSlug ? DEFAULT_COURSES_BY_SLUG[tenantSlug] : null;
      if (starterCourses && profileDoc?.courseSeedVersion !== COURSE_SEED_VERSION) {
        const existingIds = new Set((coursesList || []).map(course => course.id));
        const missingCourses = starterCourses
          .filter(course => !existingIds.has(course.id))
          .map(course => ({ ...course, ownerEmail }));

        if (missingCourses.length > 0) {
          await db.collection(COLLECTIONS.COURSES).insertMany(missingCourses);
          coursesList = await db.collection(COLLECTIONS.COURSES)
            .find({ ownerEmail }, { projection: { _id: 0 } })
            .toArray();
        }

        await db.collection(COLLECTIONS.PROFILE).updateOne(
          { ownerEmail },
          { $set: { courseSeedVersion: COURSE_SEED_VERSION } },
          { upsert: true }
        );
        profileDoc = { ...(profileDoc || {}), courseSeedVersion: COURSE_SEED_VERSION };
      }

      const isSuperAdmin = SUPER_ADMIN_EMAILS.has(ownerEmail);
      const currentStatus = profileDoc?.status || (isSuperAdmin ? 'active' : 'pending');
      if (profileDoc && !profileDoc.status) {
        profileDoc.status = currentStatus;
      }

      return res.status(200).json({
        success: true,
        isConfigured: true,
        tenant: {
          ownerEmail,
          slug: profileDoc?.slug || '',
          status: currentStatus,
          isSuperAdmin
        },
        data: {
          profile: profileDoc || null,
          courses: Array.isArray(coursesList) ? coursesList : [],
          students: Array.isArray(studentsList) ? studentsList : [],
          messages: includeAdminData && Array.isArray(messagesList)
            ? (messagesList.length > 0 ? messagesList : ((tenantSlug && DEFAULT_MESSAGES_BY_SLUG[tenantSlug]) ? DEFAULT_MESSAGES_BY_SLUG[tenantSlug].map(m => ({ ...m, ownerEmail })) : []))
            : [],
          batches: includeAdminData && Array.isArray(batchesList)
            ? (batchesList.length > 0 ? batchesList : ((tenantSlug && DEFAULT_BATCHES_BY_SLUG[tenantSlug]) ? DEFAULT_BATCHES_BY_SLUG[tenantSlug].map(b => ({ ...b, ownerEmail })) : []))
            : [],
          authToken: includeAdminData ? (authTokenDoc || null) : null
        }
      });
    } catch (error) {
      console.error('[API GET Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve data from MongoDB',
        message: error.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // POST: Mutate Academy Data for Specific Tenant
  // --------------------------------------------------------------------------
  if (req.method === 'POST') {
    try {
      const { action, payload } = req.body || {};

      if (!action) {
        return res.status(400).json({ success: false, error: 'Missing action parameter' });
      }

      const ownerEmail = await resolveOwnerEmail(payload?.ownerEmail, payload?.academySlug);

      // Check tenant approval status for restricted actions
      const RESTRICTED_ACTIONS = new Set([
        'add_student', 'save_students', 'update_student', 'bulk_update_students', 'delete_student',
        'add_course', 'save_courses', 'delete_course',
        'save_batch', 'delete_batch',
        'save_auth_token'
      ]);

      if (RESTRICTED_ACTIONS.has(action)) {
        const tenantProfile = await db.collection(COLLECTIONS.PROFILE).findOne(
          { ownerEmail },
          { projection: { status: 1 } }
        );
        const isSuperAdmin = SUPER_ADMIN_EMAILS.has(ownerEmail);
        const currentStatus = tenantProfile?.status || (isSuperAdmin ? 'active' : 'pending');
        if (currentStatus !== 'active') {
          return res.status(403).json({
            success: false,
            code: 'ACCOUNT_ON_HOLD',
            error: 'Your academy account is currently on hold pending administrator approval.'
          });
        }
      }

      switch (action) {
        case 'submit_contact_message': {
          const academySlug = String(payload?.academySlug || '').toLowerCase().trim();
          const name = String(payload?.name || '').trim().slice(0, 120);
          const phone = String(payload?.phone || '').replace(/\D/g, '').slice(0, 10);
          const course = String(payload?.course || '').trim().slice(0, 160);
          const messageText = String(payload?.message || '').replace(/\r\n?/g, '\n').replace(/\n(?:[^\S\n]*\n)+/g, '\n').trim();
          if ((messageText.match(/\S+/g)?.length || 0) > 250) {
            return res.status(400).json({ success: false, error: 'Please keep your message to 250 words or fewer.' });
          }
          const messageOwnerEmail = await resolveOwnerEmail('', academySlug);

          if (!academySlug || !messageOwnerEmail) {
            return res.status(404).json({ success: false, error: 'Academy not found.' });
          }
          if (!name || phone.length !== 10 || !messageText) {
            return res.status(400).json({ success: false, error: 'Please provide a name, valid mobile number, and message.' });
          }

          const contactMessage = {
            id: randomUUID(),
            ownerEmail: messageOwnerEmail,
            academySlug,
            name,
            phone,
            course,
            message: messageText,
            isRead: false,
            createdAt: new Date().toISOString()
          };
          await db.collection(COLLECTIONS.MESSAGES).insertOne(contactMessage);
          return res.status(201).json({ success: true, messageId: contactMessage.id });
        }

        // Public registration: resolve the academy exclusively from its slug,
        // validate that academy's active code on the server, then save.
        case 'register_student': {
          const academySlug = String(payload?.academySlug || '').toLowerCase().trim();
          const submittedCode = String(payload?.authCode || '').trim();
          const student = payload?.student;
          const studentName = student?.name || student?.fullName;

          if (!academySlug) {
            return res.status(400).json({ success: false, code: 'ACADEMY_REQUIRED', error: 'Academy identifier is required.' });
          }

          const registrationOwnerEmail = await resolveOwnerEmail('', academySlug);
          if (!registrationOwnerEmail) {
            return res.status(404).json({ success: false, code: 'ACADEMY_NOT_FOUND', error: 'Academy not found.' });
          }

          if (!/^\d{6}$/.test(submittedCode)) {
            return res.status(400).json({ success: false, code: 'INVALID_CODE', error: 'Authentication code must be exactly 6 digits.' });
          }

          if (!student || !studentName || !student?.phone) {
            return res.status(400).json({ success: false, code: 'INVALID_STUDENT', error: 'Invalid student registration details.' });
          }

          const activeToken = await db.collection(COLLECTIONS.AUTH_TOKEN).findOne(
            { ownerEmail: registrationOwnerEmail },
            { projection: { _id: 0 } }
          );

          if (!activeToken?.code) {
            return res.status(403).json({ success: false, code: 'NO_ACTIVE_CODE', error: 'No active authentication code is available for this academy.' });
          }

          if (!activeToken.expiresAt || Date.now() > Number(activeToken.expiresAt)) {
            return res.status(403).json({ success: false, code: 'EXPIRED_CODE', error: 'The authentication code has expired. Please request a new code.' });
          }

          if (String(activeToken.code).trim() !== submittedCode) {
            return res.status(403).json({ success: false, code: 'WRONG_CODE', error: 'The authentication code is incorrect.' });
          }

          const requestedCourseId = student?.enrolledCourseIds?.[0];
          const courseExists = requestedCourseId && await db.collection(COLLECTIONS.COURSES).findOne(
            { id: requestedCourseId, ownerEmail: registrationOwnerEmail },
            { projection: { _id: 1 } }
          );
          if (!courseExists) {
            return res.status(400).json({ success: false, code: 'INVALID_COURSE', error: 'The selected course is not available for this academy.' });
          }

          if (!verifyImageKitStudentPhoto(student)) {
            return res.status(400).json({
              success: false,
              code: 'PHOTO_REQUIRED',
              error: 'A valid uploaded student passport photo is required.'
            });
          }

          const studentId = await getNextStudentId(db, registrationOwnerEmail);
          const normalizedStudent = {
            ...student,
            id: studentId,
            certificateSerial: studentId,
            name: studentName,
            fullName: studentName,
            ownerEmail: registrationOwnerEmail,
            academySlug
          };
          delete normalizedStudent.authCode;

          await db.collection(COLLECTIONS.STUDENTS).insertOne(normalizedStudent);
          delete normalizedStudent._id;
          return res.status(201).json({ success: true, student: normalizedStudent });
        }

        // 1. Save Academy Profile
        case 'save_profile': {
          if (!payload?.profile) {
            return res.status(400).json({ success: false, error: 'Missing profile in payload' });
          }
          const existingProfile = await db.collection(COLLECTIONS.PROFILE).findOne({ ownerEmail });
          const isSuperAdmin = SUPER_ADMIN_EMAILS.has(ownerEmail);
          let status = existingProfile?.status;
          if (!status) {
            status = isSuperAdmin ? 'active' : 'pending';
          }

          const updatedProfile = {
            ...payload.profile,
            ownerEmail,
            status,
            requestedAt: existingProfile?.requestedAt || new Date().toISOString()
          };
          await db.collection(COLLECTIONS.PROFILE).updateOne(
            { ownerEmail },
            { $set: updatedProfile },
            { upsert: true }
          );
          return res.status(200).json({ success: true, profile: updatedProfile });
        }

        // 2. Save All Courses
        case 'save_courses': {
          const courses = Array.isArray(payload?.courses) ? payload.courses : [];
          const now = Date.now();
          const taggedCourses = courses.map((c, idx) => ({
            ...c,
            ownerEmail,
            createdAt: c.createdAt || new Date(now - idx * 1000).toISOString()
          }));
          await db.collection(COLLECTIONS.COURSES).deleteMany({ ownerEmail });
          if (taggedCourses.length > 0) {
            await db.collection(COLLECTIONS.COURSES).insertMany(taggedCourses);
          }
          const updatedCourses = await db.collection(COLLECTIONS.COURSES).find({ ownerEmail }, { projection: { _id: 0 } }).sort({ createdAt: -1, _id: -1 }).toArray();
          return res.status(200).json({ success: true, courses: updatedCourses });
        }

        // 3. Add or Update a Single Course
        case 'add_course': {
          const course = payload?.course;
          if (!course || !course.id) {
            return res.status(400).json({ success: false, error: 'Invalid course payload' });
          }
          const taggedCourse = { ...course, ownerEmail, createdAt: course.createdAt || new Date().toISOString() };
          await db.collection(COLLECTIONS.COURSES).updateOne(
            { id: course.id, ownerEmail },
            { $set: taggedCourse },
            { upsert: true }
          );
          const updatedCourses = await db.collection(COLLECTIONS.COURSES).find({ ownerEmail }, { projection: { _id: 0 } }).sort({ createdAt: -1, _id: -1 }).toArray();
          return res.status(200).json({ success: true, courses: updatedCourses });
        }

        // 4. Delete Course
        case 'delete_course': {
          const courseId = payload?.courseId;
          if (!courseId) {
            return res.status(400).json({ success: false, error: 'Missing courseId' });
          }
          await db.collection(COLLECTIONS.COURSES).deleteOne({ id: courseId, ownerEmail });
          const updatedCourses = await db.collection(COLLECTIONS.COURSES).find({ ownerEmail }, { projection: { _id: 0 } }).sort({ createdAt: -1, _id: -1 }).toArray();
          return res.status(200).json({ success: true, courses: updatedCourses });
        }

        // 5. Save All Students
        case 'save_students': {
          const students = Array.isArray(payload?.students) ? payload.students : [];
          const taggedStudents = students.map(s => ({ ...s, ownerEmail }));
          await db.collection(COLLECTIONS.STUDENTS).deleteMany({ ownerEmail });
          if (taggedStudents.length > 0) {
            await db.collection(COLLECTIONS.STUDENTS).insertMany(taggedStudents);
          }
          return res.status(200).json({ success: true, students: taggedStudents });
        }

        // 6. Add New Student Registration (From Public Site)
        case 'add_student': {
          const student = payload?.student;
          const studentName = student?.name || student?.fullName;
          if (!student || !studentName || !student?.phone) {
            return res.status(400).json({ success: false, error: 'Invalid student registration payload' });
          }
          const studentId = await getNextStudentId(db, ownerEmail);
          const normalizedStudent = {
            ...student,
            id: studentId,
            certificateSerial: studentId,
            name: studentName,
            fullName: studentName,
            ownerEmail
          };
          await db.collection(COLLECTIONS.STUDENTS).insertOne(normalizedStudent);
          return res.status(200).json({ success: true, student: normalizedStudent });
        }

        // 7. Update Single Student (From Admin Portal)
        case 'update_student': {
          const { studentId, updatedData } = payload || {};
          if (!studentId || !updatedData) {
            return res.status(400).json({ success: false, error: 'Missing studentId or updatedData' });
          }

          // If changing or removing student photo, delete the old photo from ImageKit
          if ('imageKitFileId' in updatedData || 'photoUrl' in updatedData) {
            const currentStudent = await db.collection(COLLECTIONS.STUDENTS).findOne(
              { id: studentId, ownerEmail },
              { projection: { _id: 0, imageKitFileId: 1 } }
            );
            const oldFileId = currentStudent?.imageKitFileId;
            const newFileId = updatedData.imageKitFileId;
            if (oldFileId && oldFileId !== newFileId) {
              await deleteImageKitFile(oldFileId);
            }
          }

          const result = await db.collection(COLLECTIONS.STUDENTS).updateOne(
            { id: studentId, ownerEmail },
            { $set: updatedData }
          );
          if (result.matchedCount > 0) {
            const updatedStudent = await db.collection(COLLECTIONS.STUDENTS).findOne({ id: studentId, ownerEmail }, { projection: { _id: 0 } });
            return res.status(200).json({ success: true, student: updatedStudent });
          }
          return res.status(404).json({ success: false, error: 'Student not found' });
        }

        // 8. Bulk Update Students (e.g. Mark as Completed)
        case 'bulk_update_students': {
          const { studentIds, updateFields } = payload || {};
          if (!Array.isArray(studentIds) || !updateFields) {
            return res.status(400).json({ success: false, error: 'Invalid bulk update payload' });
          }
          const result = await db.collection(COLLECTIONS.STUDENTS).updateMany(
            { id: { $in: studentIds }, ownerEmail },
            { $set: updateFields }
          );
          return res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
        }

        case 'save_batch': {
          const batch = payload?.batch || {};
          const name = String(batch.name || '').trim().slice(0, 100);
          const studentIds = [...new Set(Array.isArray(batch.studentIds) ? batch.studentIds.map(String) : [])];
          if (!name) return res.status(400).json({ success: false, error: 'A batch name is required.' });
          const savedBatch = { ...batch, id: String(batch.id || randomUUID()), name, studentIds, ownerEmail, status: batch.status === 'Completed' ? 'Completed' : 'Active', createdAt: batch.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
          await db.collection(COLLECTIONS.BATCHES).updateOne({ id: savedBatch.id, ownerEmail }, { $set: savedBatch }, { upsert: true });
          return res.status(200).json({ success: true, batch: savedBatch });
        }

        case 'delete_batch': {
          const batchId = String(payload?.batchId || '').trim();
          if (!batchId) return res.status(400).json({ success: false, error: 'Missing batch ID.' });
          await db.collection(COLLECTIONS.BATCHES).deleteOne({ id: batchId, ownerEmail });
          return res.status(200).json({ success: true, batchId });
        }

        case 'mark_all_messages_read': {
          await db.collection(COLLECTIONS.MESSAGES).updateMany(
            { ownerEmail, isRead: false },
            { $set: { isRead: true, readAt: new Date().toISOString() } }
          );
          return res.status(200).json({ success: true });
        }

        case 'mark_message_read': {
          const messageId = String(payload?.messageId || '').trim();
          if (!messageId) return res.status(400).json({ success: false, error: 'Missing message ID.' });
          await db.collection(COLLECTIONS.MESSAGES).updateOne(
            { id: messageId, ownerEmail },
            { $set: { isRead: true, readAt: new Date().toISOString() } }
          );
          return res.status(200).json({ success: true });
        }

        case 'mark_message_unread': {
          const messageId = String(payload?.messageId || '').trim();
          if (!messageId) return res.status(400).json({ success: false, error: 'Missing message ID.' });
          await db.collection(COLLECTIONS.MESSAGES).updateOne(
            { id: messageId, ownerEmail },
            { $set: { isRead: false } }
          );
          return res.status(200).json({ success: true });
        }

        case 'delete_message': {
          const messageId = String(payload?.messageId || '').trim();
          if (!messageId) return res.status(400).json({ success: false, error: 'Missing message ID.' });
          await db.collection(COLLECTIONS.MESSAGES).deleteOne({ id: messageId, ownerEmail });
          return res.status(200).json({ success: true });
        }

        // 9. Delete Student
        case 'delete_student': {
          const studentId = payload?.studentId;
          if (!studentId) {
            return res.status(400).json({ success: false, error: 'Missing studentId' });
          }
          const studentToDelete = await db.collection(COLLECTIONS.STUDENTS).findOne(
            { id: studentId, ownerEmail },
            { projection: { _id: 0, imageKitFileId: 1 } }
          );
          if (studentToDelete?.imageKitFileId) {
            await deleteImageKitFile(studentToDelete.imageKitFileId);
          }
          await db.collection(COLLECTIONS.STUDENTS).deleteOne({ id: studentId, ownerEmail });
          return res.status(200).json({ success: true, studentId });
        }

        // 9b. Explicit Delete Student Photo Action
        case 'delete_student_photo': {
          const fileId = payload?.fileId;
          if (!fileId) {
            return res.status(400).json({ success: false, error: 'Missing fileId' });
          }
          const success = await deleteImageKitFile(fileId);
          return res.status(200).json({ success });
        }

        // 10. Save Authentication Token (6-Digit OTP)
        case 'save_auth_token': {
          const now = Date.now();
          const token = {
            code: String(randomInt(100000, 1000000)),
            createdAt: now,
            expiresAt: now + 5 * 60 * 60 * 1000,
            ownerEmail
          };
          // Atomically preserve an active code across browsers and simultaneous requests.
          const keepExisting = payload?.forceNew === true ? false : {
            $and: [
              { $gt: ['$expiresAt', now] },
              { $regexMatch: { input: { $ifNull: ['$code', ''] }, regex: '^[0-9]{6}$' } }
            ]
          };
          const savedToken = await db.collection(COLLECTIONS.AUTH_TOKEN).findOneAndUpdate(
            { ownerEmail },
            [{ $set: Object.fromEntries(Object.entries(token).map(([key, value]) => [
              key, { $cond: [keepExisting, `$${key}`, { $literal: value }] }
            ])) }],
            { upsert: true, returnDocument: 'after', includeResultMetadata: false }
          );
          return res.status(200).json({ success: true, token: savedToken });
        }

        // 11. Clear All Data (For specific owner only)
        case 'clear_all': {
          await Promise.all([
            db.collection(COLLECTIONS.COURSES).deleteMany({ ownerEmail }),
            db.collection(COLLECTIONS.STUDENTS).deleteMany({ ownerEmail }),
            db.collection(COLLECTIONS.BATCHES).deleteMany({ ownerEmail })
          ]);
          return res.status(200).json({ success: true, message: `All student and course records cleared for ${ownerEmail}` });
        }

        // 12. Super Admin: List All Platform Tenants
        case 'get_all_tenants': {
          if (!SUPER_ADMIN_EMAILS.has(ownerEmail)) {
            return res.status(403).json({ success: false, error: 'Forbidden: Super Admin access required' });
          }
          const superAdminList = Array.from(SUPER_ADMIN_EMAILS);
          const profiles = await db.collection(COLLECTIONS.PROFILE)
            .find({ ownerEmail: { $nin: superAdminList } }, { projection: { _id: 0 } })
            .sort({ requestedAt: -1, _id: -1 })
            .toArray();

          const [studentCounts, courseCounts, certCounts] = await Promise.all([
            db.collection(COLLECTIONS.STUDENTS).aggregate([
              { $match: { ownerEmail: { $nin: superAdminList } } },
              { $group: { _id: '$ownerEmail', count: { $sum: 1 } } }
            ]).toArray(),
            db.collection(COLLECTIONS.COURSES).aggregate([
              { $match: { ownerEmail: { $nin: superAdminList } } },
              { $group: { _id: '$ownerEmail', count: { $sum: 1 } } }
            ]).toArray(),
            db.collection(COLLECTIONS.STUDENTS).aggregate([
              { $match: { issueCertificate: true, ownerEmail: { $nin: superAdminList } } },
              { $group: { _id: '$ownerEmail', count: { $sum: 1 } } }
            ]).toArray()
          ]);

          const studentMap = Object.fromEntries(studentCounts.map(s => [s._id, s.count]));
          const courseMap = Object.fromEntries(courseCounts.map(c => [c._id, c.count]));
          const certMap = Object.fromEntries(certCounts.map(c => [c._id, c.count]));

          const enrichedTenants = profiles
            .filter(p => !SUPER_ADMIN_EMAILS.has(p.ownerEmail))
            .map(p => ({
              ...p,
              status: p.status || 'pending',
              studentCount: studentMap[p.ownerEmail] || 0,
              courseCount: courseMap[p.ownerEmail] || 0,
              certCount: certMap[p.ownerEmail] || 0
            }));

          return res.status(200).json({ success: true, tenants: enrichedTenants });
        }

        // 13. Super Admin: Update Tenant Approval Status
        case 'update_tenant_status': {
          if (!SUPER_ADMIN_EMAILS.has(ownerEmail)) {
            return res.status(403).json({ success: false, error: 'Forbidden: Super Admin access required' });
          }
          const { targetOwnerEmail, status: newStatus } = payload || {};
          if (!targetOwnerEmail || !['active', 'pending', 'suspended', 'rejected'].includes(newStatus)) {
            return res.status(400).json({ success: false, error: 'Invalid target email or status' });
          }
          await db.collection(COLLECTIONS.PROFILE).updateOne(
            { ownerEmail: targetOwnerEmail },
            {
              $set: {
                status: newStatus,
                statusUpdatedAt: new Date().toISOString(),
                approvedBy: ownerEmail
              }
            }
          );
          return res.status(200).json({ success: true, targetOwnerEmail, status: newStatus });
        }

        // 14. Super Admin: List All Platform Students across All Tenants
        case 'get_all_platform_students': {
          if (!SUPER_ADMIN_EMAILS.has(ownerEmail)) {
            return res.status(403).json({ success: false, error: 'Forbidden: Super Admin access required' });
          }
          const limit = Math.min(Number(payload?.limit || 1000), 2000);
          const students = await db.collection(COLLECTIONS.STUDENTS)
            .find({}, { projection: { _id: 0 } })
            .sort({ createdAt: -1, _id: -1 })
            .limit(limit)
            .toArray();
          return res.status(200).json({ success: true, students });
        }

        // 15. Super Admin: Create New Tenant Provisionally
        case 'superadmin_create_tenant': {
          if (!SUPER_ADMIN_EMAILS.has(ownerEmail)) {
            return res.status(403).json({ success: false, error: 'Forbidden: Super Admin access required' });
          }
          const { academyName, ownerName, targetOwnerEmail, slug, category, phone } = payload || {};
          if (!targetOwnerEmail || !academyName || !slug) {
            return res.status(400).json({ success: false, error: 'Missing required tenant fields' });
          }
          const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').trim();
          const cleanEmail = targetOwnerEmail.toLowerCase().trim();

          const existing = await db.collection(COLLECTIONS.PROFILE).findOne({
            $or: [{ ownerEmail: cleanEmail }, { slug: cleanSlug }]
          });
          if (existing) {
            return res.status(400).json({ success: false, error: 'An academy with this email or slug already exists' });
          }

          const newTenant = {
            ownerEmail: cleanEmail,
            academyName: academyName.trim(),
            ownerName: (ownerName || 'Academy Director').trim(),
            email: cleanEmail,
            phone: (phone || '').trim(),
            slug: cleanSlug,
            category: category || 'Education & Vocational Training',
            status: 'active',
            studentIdPrefix: (cleanSlug.toUpperCase() + '/'),
            requestedAt: new Date().toISOString(),
            approvedBy: ownerEmail,
            statusUpdatedAt: new Date().toISOString()
          };
          await db.collection(COLLECTIONS.PROFILE).insertOne(newTenant);
          return res.status(200).json({ success: true, tenant: newTenant });
        }

        default:
          return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
      }
    } catch (error) {
      console.error('[API POST Error]:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process mutation in MongoDB',
        message: error.message
      });
    }
  }

  return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
}
