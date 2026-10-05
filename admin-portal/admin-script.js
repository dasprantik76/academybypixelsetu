/**
 * EduCore Academy - Admin Panel Management Script
 * Pure Vanilla JavaScript (Zero frameworks; includes sample seed data)
 * Course Model: Course Name, Duration, Description
 */

// ==========================================================================
// 1. Storage Configuration & Utilities
// ==========================================================================
const STORAGE_KEYS = {
  COURSES: 'educore_academy_courses',
  STUDENTS: 'educore_academy_students',
  BATCHES: 'educore_academy_batches',
  MESSAGES: 'educore_academy_messages',
  AUTH_TOKEN: 'educore_academy_auth_token',
  SESSION: 'educore_admin_session',
  ACADEMY_PROFILE: 'pixelsetu_academy_profile'
};

function sortCourseOrBatchRecords(records, order, nameKey) {
  const nameCompare = (a, b) => String(a[nameKey] || '').localeCompare(String(b[nameKey] || ''), 'en', { sensitivity: 'base', numeric: true });
  const timestamp = record => Date.parse(record.createdAt) || 0;
  return [...records].sort((a, b) => {
    if (order === 'name-asc') return nameCompare(a, b);
    if (order === 'name-desc') return nameCompare(b, a);
    const difference = timestamp(a) - timestamp(b);
    return (order === 'oldest' ? difference : -difference) || nameCompare(a, b);
  });
}

const DEFAULT_COMPUTER_COURSES = [
  { id: 'CRS-101', title: 'Diploma in Computer Applications (DCA)', duration: '6 Months', description: 'Comprehensive fundamentals of computer operations, MS Office suite, Internet basics, and database concepts.', createdAt: '2026-01-06T09:00:00.000Z' },
  { id: 'CRS-102', title: 'Full Stack Web Development', duration: '1 Year', description: 'Modern front-end and back-end web development with HTML5, CSS3, JavaScript, Node.js, and databases.', createdAt: '2026-01-05T09:00:00.000Z' },
  { id: 'CRS-103', title: 'Post Graduate Diploma in Computer Applications (PGDCA)', duration: '1 Year', description: 'Advanced programming concepts, system architecture, database administration, and project implementation.', createdAt: '2026-01-04T09:00:00.000Z' },
  { id: 'CRS-104', title: 'Certificate in Office Automation', duration: '3 Months', description: 'Practical training in Word, Excel, PowerPoint, email, document formatting, and everyday office productivity.', createdAt: '2026-01-03T09:00:00.000Z' },
  { id: 'CRS-105', title: 'Tally Prime with GST', duration: '4 Months', description: 'Learn computerized accounting, inventory management, GST invoicing, taxation reports, and payroll using Tally Prime.', createdAt: '2026-01-02T09:00:00.000Z' },
  { id: 'CRS-106', title: 'Graphic Design Fundamentals', duration: '6 Months', description: 'Build creative design skills through typography, image editing, branding, social media graphics, and print layouts.', createdAt: '2026-01-01T09:00:00.000Z' },
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
];
const COURSE_SEED_VERSION = '2';

const INDIAN_STATES_DISTRICTS = {
  "Andhra Pradesh": ["Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang", "Itanagar"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tamulpur", "Tinsukia", "Udalguri", "West Karbi Anglong", "Bajali"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran (Motihari)", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda (Bihar Sharif)", "Nawada", "Patna", "Purnia", "Rohtas (Sasaram)", "Saharsa", "Samastipur", "Saran (Chhapra)", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali (Hajipur)", "West Champaran (Bettiah)"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar (Jagdalpur)", "Bemetara", "Bijapur", "Bilaspur", "Dantewada (South Bastar)", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa", "Jashpur", "Kabirdham (Kawardha)", "Kanker (North Bastar)", "Khairagarh-Chhuikhadan-Gandai", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh-Chirmiri-Bharatpur", "Mohla-Manpur-Ambagarh Chouki", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Sarangarh-Bilaigarh", "Sukma", "Surajpur", "Surguja (Ambikapur)"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha (Palanpur)", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda (Nadiad)", "Kutch (Bhuj)", "Mahisagar", "Mehsana", "Morbi", "Narmada (Rajpipla)", "Navsari", "Panchmahal (Godhra)", "Patan", "Porbandar", "Rajkot", "Sabarkantha (Himmatnagar)", "Surat", "Surendranagar", "Tapi (Vyara)", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra (Dharamshala)", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur (Nahan)", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum (Jamshedpur)", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu (Medininagar)", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum (Chaibasa)"],
  "Karnataka": ["Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada (Mangaluru)", "Davangere", "Dharwad (Hubballi)", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu (Madikeri)", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada (Karwar)", "Vijayapura", "Yadgir", "Vijayanagara"],
  "Kerala": ["Alappuzha", "Ernakulam (Kochi)", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Maihar", "Mandla", "Mandsaur", "Morena", "Mauganj", "Narmadapuram", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Pandhurna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad (Chhatrapati Sambhaji Nagar)", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad (Dharashiv)", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["Eastern West Khasi Hills", "East Garo Hills", "East Jaintia Hills", "East Khasi Hills (Shillong)", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills (Tura)", "West Jaintia Hills (Jowai)", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"],
  "Nagaland": ["Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Debagarh", "Dhenkanal", "Gajapati", "Ganjam (Berhampur)", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khurda (Bhubaneswar)", "Koraput", "Malkangiri", "Mayurbhanj (Baripada)", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur (Sonepur)", "Sundargarh (Rourkela)"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Shahid Bhagat Singh Nagar (Nawanshahr)", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Didwana-Kuchaman", "Dholpur", "Dudu", "Dungarpur", "Ganganagar", "Gangapur City", "Hanumangarh", "Jaipur", "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Jodhpur Rural", "Karauli", "Kekri", "Khairthal-Tijara", "Kota", "Kotputli-Behror", "Nagaur", "Neem Ka Thana", "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore", "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Tonk", "Udaipur"],
  "Sikkim": ["Gangtok", "Gyalshing", "Pakyong", "Mangan", "Namchi", "Soreng"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari (Nagercoil)", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris (Ooty)", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai (Ambassa)", "Gomati (Udaipur)", "Khowai", "North Tripura (Dharmanagar)", "Sepahijala (Bishramganj)", "South Tripura (Belonia)", "Unakoti (Kailashahar)", "West Tripura (Agartala)"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar (Noida)", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar (Rudrapur)", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum (Suri)", "Cooch Behar", "Dakshin Dinajpur (Balurghat)", "Darjeeling", "Hooghly (Chinsurah)", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda (English Bazar)", "Murshidabad (Baharampur)", "Nadia (Krishnanagar)", "North 24 Parganas (Barasat)", "Paschim Bardhaman (Asansol)", "Paschim Medinipur (Midnapore)", "Purba Bardhaman (Bardhaman)", "Purba Medinipur (Tamluk)", "Purulia", "South 24 Parganas (Alipore)", "Uttar Dinajpur (Raiganj)"],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep (Kavaratti)"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

// Gradient palette for student avatar circles
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5, #7c3aed)',
  'linear-gradient(135deg, #0ea5e9, #2563eb)',
  'linear-gradient(135deg, #10b981, #059669)',
  'linear-gradient(135deg, #f59e0b, #d97706)',
  'linear-gradient(135deg, #ec4899, #be185d)',
  'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  'linear-gradient(135deg, #14b8a6, #0f766e)'
];

function getAvatarGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getInboxIconSvg() {
  return `<svg viewBox="0 0 512 512" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M 38.5 76.0 L 39.0 75.5 L 472.0 75.5 L 473.0 76.5 L 477.0 76.5 L 478.0 77.5 L 481.0 77.5 L 484.0 79.5 L 486.0 79.5 L 490.0 82.5 L 491.0 82.5 L 493.0 84.5 L 494.0 84.5 L 502.5 93.0 L 502.5 94.0 L 506.5 99.0 L 506.5 101.0 L 509.5 106.0 L 509.5 109.0 L 510.5 110.0 L 510.5 114.0 L 511.5 115.0 L 511.5 396.0 L 510.5 397.0 L 510.5 401.0 L 509.5 402.0 L 509.5 405.0 L 504.5 415.0 L 502.5 417.0 L 502.5 418.0 L 494.0 426.5 L 493.0 426.5 L 491.0 428.5 L 481.0 433.5 L 478.0 433.5 L 477.0 434.5 L 473.0 434.5 L 472.0 435.5 L 39.0 435.5 L 38.0 434.5 L 34.0 434.5 L 33.0 433.5 L 28.0 432.5 L 20.0 428.5 L 17.0 425.5 L 16.0 425.5 L 8.5 418.0 L 8.5 417.0 L 4.5 412.0 L 4.5 410.0 L 1.5 405.0 L 1.5 402.0 L 0.5 401.0 L 0.5 397.0 L 0.0 396.0 L 0.0 115.0 L 0.5 114.0 L 0.5 110.0 L 1.5 109.0 L 1.5 106.0 L 4.5 101.0 L 4.5 99.0 L 6.5 97.0 L 8.5 93.0 L 16.0 85.5 L 17.0 85.5 L 23.0 80.5 L 25.0 80.5 L 30.0 77.5 L 33.0 77.5 L 34.0 76.5 L 38.5 76.0 Z M 51.5 106.0 L 52.0 105.5 L 459.0 105.5 L 459.5 106.0 L 265.0 300.5 L 261.0 302.5 L 250.0 302.5 L 246.0 300.5 L 51.5 106.0 Z M 29.5 127.0 L 30.0 126.5 L 158.5 255.0 L 158.5 256.0 L 30.0 384.5 L 29.5 384.0 L 29.5 127.0 Z M 480.5 127.0 L 481.0 126.5 L 481.5 127.0 L 481.5 384.0 L 481.0 384.5 L 352.5 256.0 L 352.5 255.0 L 480.5 127.0 Z M 178.5 278.0 L 181.0 277.5 L 181.5 279.0 L 223.0 320.5 L 224.0 320.5 L 231.0 326.5 L 239.0 330.5 L 241.0 330.5 L 242.0 331.5 L 245.0 331.5 L 246.0 332.5 L 265.0 332.5 L 266.0 331.5 L 269.0 331.5 L 270.0 330.5 L 272.0 330.5 L 280.0 326.5 L 286.0 321.5 L 287.0 321.5 L 331.0 277.5 L 332.0 277.5 L 459.5 405.0 L 459.0 405.5 L 52.0 405.5 L 51.5 405.0 L 178.5 278.0 Z"/></svg>`;
}


const DEFAULT_INBOX_MESSAGES = [
  {
    id: "msg_101",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Sourav Mukherjee",
    phone: "9830145291",
    course: "Certificate in Financial Accounting (Tally Prime & GST)",
    message: "Hello Sir, I have completed B.Com and want to learn practical Tally Prime with GST filing and e-way billing. Are there weekend morning batches available? Please let me know the course fee and start date.",
    isRead: false,
    createdAt: "2026-09-13T13:31:25.413Z"
  },
  {
    id: "msg_102",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Priyanka Sengupta",
    phone: "9874120365",
    course: "Diploma in Computer Applications (DCA)",
    message: "Hi, I want to enroll in the 6-month DCA course for college students. Do you provide ISO/government-recognized certificates upon course completion? Kindly share the detailed syllabus.",
    isRead: false,
    createdAt: "2026-09-13T12:06:25.413Z"
  },
  {
    id: "msg_103",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Subhajit Karmakar",
    phone: "9123456780",
    course: "Full Stack Web Development",
    message: "I am interested in the Web Development batch starting this month. Does the curriculum cover React and Node.js with live database projects? Can I attend a demo class this Saturday?",
    isRead: false,
    createdAt: "2026-09-13T09:06:25.413Z"
  },
  {
    id: "msg_104",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Ananya Roychowdhury",
    phone: "9433219087",
    course: "Advanced Excel & Business Analytics",
    message: "Good evening. I work as an accountant and need to master VLOOKUP, XLOOKUP, Pivot Tables, and financial dashboards. How long is the weekend crash course and what are the timings?",
    isRead: false,
    createdAt: "2026-09-13T06:06:25.413Z"
  },
  {
    id: "msg_105",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Debjit Banerjee",
    phone: "9836541298",
    course: "Desktop Publishing & Graphic Design",
    message: "Sir, do you teach Adobe Photoshop, Illustrator, and CorelDRAW in the DTP course? I want to learn design for print and social media banners. Are individual workstations provided for practice?",
    isRead: false,
    createdAt: "2026-09-12T16:06:25.413Z"
  },
  {
    id: "msg_106",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Riya Chakraborty",
    phone: "9748231905",
    course: "Python Programming & Data Science",
    message: "Hello, I am a 2nd year BCA student looking for a practical Python programming course that covers pandas and data visualization. Please share the admission procedure and fee installments.",
    isRead: false,
    createdAt: "2026-09-12T10:06:25.413Z"
  },
  {
    id: "msg_107",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Tanmay Dutta",
    phone: "9831098234",
    course: "Diploma in Computer Applications (DCA)",
    message: "I want to enroll my younger sister in the computer basics and office automation batch after her 12th board exams. What are the daily batch hours for the afternoon session?",
    isRead: true,
    readAt: "2026-09-13T13:36:25.413Z",
    createdAt: "2026-09-11T14:06:25.413Z"
  },
  {
    id: "msg_108",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Sneha Bhattacharya",
    phone: "9051876432",
    course: "Certificate in Financial Accounting (Tally Prime & GST)",
    message: "Inquired about the Tally certification last week. Can I pay the admission fee online through UPI or visit the center in person? Please confirm center timings tomorrow.",
    isRead: true,
    readAt: "2026-09-13T12:06:25.413Z",
    createdAt: "2026-09-11T07:06:25.413Z"
  },
  {
    id: "msg_109",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Arindam Halder",
    phone: "9874561230",
    course: "Hardware & Networking Essentials",
    message: "Respected Sir, does the hardware networking course include hands-on PC assembling, OS installation, and router troubleshooting? Kindly inform when the new batch commences.",
    isRead: true,
    readAt: "2026-09-13T08:06:25.413Z",
    createdAt: "2026-09-10T14:06:25.413Z"
  },
  {
    id: "msg_110",
    ownerEmail: "rcavirup@gmail.com",
    academySlug: "diganta",
    name: "Moumita Paul",
    phone: "9432109876",
    course: "Full Stack Web Development",
    message: "Thank you for sharing the syllabus earlier. I would like to confirm my seat for the evening batch. Please guide me through the registration and student ID verification process.",
    isRead: true,
    readAt: "2026-09-13T02:06:25.413Z",
    createdAt: "2026-09-09T14:06:25.413Z"
  }
];

const DEFAULT_BATCHES = [
  {
    "id": "6e3812a3-9c16-4c92-810d-91d8c1a34b9c",
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
    "ownerEmail": "rcavirup@gmail.com",
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
];

// ==========================================================================
// 2. State & Storage Management
// ==========================================================================
class AcademyStore {
  constructor(academySlug = 'diganta') {
    this.ownerEmail = (academySlug || 'diganta').toLowerCase().trim();
    this.courses = [];
    this.students = [];
    this.messages = [];
    this.batches = [];
    this.tenantStatus = 'active';
    this.isSuperAdmin = false;
    this.init();
  }

  getStorageKey(baseKey) {
    return `${baseKey}_${this.ownerEmail}`;
  }

  init() {
    const isSuperAdminEmail = this.ownerEmail === 'dasprantik76@gmail.com';
    const isMainDigantaEmail = this.ownerEmail === 'rcavirup@gmail.com' || this.ownerEmail === 'diganta';
    this.tenantStatus = localStorage.getItem(this.getStorageKey('educore_tenant_status')) || (isSuperAdminEmail || isMainDigantaEmail || this.ownerEmail === 'prantik' ? 'active' : 'pending');
    this.isSuperAdmin = isSuperAdminEmail;
    if (!isSuperAdminEmail) {
      localStorage.removeItem(this.getStorageKey('educore_is_super_admin'));
      localStorage.removeItem('educore_is_super_admin');
    }
    const rawCourses = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.COURSES));
    const rawStudents = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.STUDENTS));
    const rawMessages = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.MESSAGES));
    const rawBatches = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.BATCHES));

    const isDiganta = isMainDigantaEmail || isSuperAdminEmail || this.ownerEmail === 'prantik';
    if (rawCourses) {
      try {
        this.courses = JSON.parse(rawCourses) || [];
      } catch (e) {
        this.courses = [];
      }
    } else {
      this.courses = isDiganta ? DEFAULT_COMPUTER_COURSES.map(course => ({ ...course })) : [];
      if (this.courses.length > 0) {
        localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
      }
    }

    const seedVersionKey = this.getStorageKey('educore_course_seed_version');
    if (isDiganta && localStorage.getItem(seedVersionKey) !== COURSE_SEED_VERSION) {
      const existingIds = new Set(this.courses.map(course => course.id));
      DEFAULT_COMPUTER_COURSES.forEach(course => {
        if (!existingIds.has(course.id)) this.courses.push({ ...course });
      });
      localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
      localStorage.setItem(seedVersionKey, COURSE_SEED_VERSION);
    }

    if (rawStudents) {
      try {
        this.students = JSON.parse(rawStudents) || [];
      } catch (e) {
        this.students = [];
      }
    } else {
      this.students = [];
    }

    if (rawMessages) {
      try {
        this.messages = JSON.parse(rawMessages) || [];
      } catch (e) {
        this.messages = [];
      }
    }
    if (!Array.isArray(this.messages) || this.messages.length === 0) {
      this.messages = isDiganta ? JSON.parse(JSON.stringify(DEFAULT_INBOX_MESSAGES)) : [];
    }
    try { this.batches = JSON.parse(rawBatches || '[]') || []; } catch { this.batches = []; }
    if (!Array.isArray(this.batches) || this.batches.length === 0) {
      this.batches = isDiganta ? JSON.parse(JSON.stringify(DEFAULT_BATCHES)) : [];
    }

    // Ensure historical/existing records have createdAt timestamps for accurate New to Old sorting
    const baseTime = new Date('2026-01-01T00:00:00.000Z').getTime();
    if (Array.isArray(this.courses)) {
      this.courses = this.courses.map((c, idx) => {
        if (!c.createdAt) return { ...c, createdAt: new Date(baseTime + (this.courses.length - idx) * 60000).toISOString() };
        return c;
      });
    }
    if (Array.isArray(this.batches)) {
      this.batches = this.batches.map((b, idx) => {
        if (!b.createdAt) return { ...b, createdAt: new Date(baseTime + (this.batches.length - idx) * 60000).toISOString() };
        return b;
      });
    }
    if (Array.isArray(this.messages)) {
      this.messages = this.messages.map((m, idx) => {
        if (!m.createdAt) return { ...m, createdAt: new Date(baseTime + (this.messages.length - idx) * 60000).toISOString() };
        return m;
      });
    }
  }

  // Asynchronously synchronize with MongoDB Multi-Tenant Cloud Storage (/api/data)
  async fetchCloudData(onLoadedCallback) {
    try {
      const queryParam = this.ownerEmail.includes('@')
        ? `ownerEmail=${encodeURIComponent(this.ownerEmail)}`
        : `academy=${encodeURIComponent(this.ownerEmail)}`;
      const response = await fetch(`/api/data?${queryParam}&admin=1`, { cache: 'no-store' });
      if (!response.ok) return false;
      const json = await response.json();
      if (json && json.success) {
        if (json.tenant) {
          this.tenantStatus = json.tenant.status || (this.isSuperAdmin ? 'active' : 'pending');
          this.isSuperAdmin = Boolean(json.tenant.isSuperAdmin) && (this.ownerEmail === 'dasprantik76@gmail.com');
          localStorage.setItem(this.getStorageKey('educore_tenant_status'), this.tenantStatus);
          if (this.isSuperAdmin) {
            localStorage.setItem(this.getStorageKey('educore_is_super_admin'), 'true');
          } else {
            localStorage.removeItem(this.getStorageKey('educore_is_super_admin'));
            localStorage.removeItem('educore_is_super_admin');
          }
        }
        if (json.data) {
          const { profile, courses, students, messages, batches, authToken } = json.data;

        if (Array.isArray(courses)) {
          this.courses = courses;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
        }

        if (Array.isArray(students)) {
          this.students = students;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.STUDENTS), JSON.stringify(this.students));
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
        } else if (this.students.length > 0) {
          this.syncToCloud('save_students', { students: this.students });
        }

        if (Array.isArray(messages)) {
          this.messages = messages;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.MESSAGES), JSON.stringify(this.messages));
        }
        if (Array.isArray(batches)) {
          this.batches = batches;
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.BATCHES), JSON.stringify(this.batches));
        }

        if (profile) {
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.ACADEMY_PROFILE), JSON.stringify(profile));
        } else {
          const localProfile = this.getAcademyProfile();
          if (localProfile) this.syncToCloud('save_profile', { profile: localProfile });
        }

        if (!this.authTokenRequest && authToken && authToken.code && authToken.expiresAt && Date.now() < authToken.expiresAt) {
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.AUTH_TOKEN), JSON.stringify({ ...authToken, academySlug: this.ownerEmail }));
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify({ ...authToken, academySlug: this.ownerEmail }));
        }

        if (typeof onLoadedCallback === 'function') {
          onLoadedCallback();
        }
        return true;
      }
    }
  } catch (e) {
    console.info('[AcademyStore] Operating in local storage caching for', this.ownerEmail);
  }
    return false;
  }

  async syncToCloud(action, payload) {
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          payload: {
            ...payload,
            ownerEmail: this.ownerEmail,
            academySlug: this.getAcademyProfile()?.slug || this.ownerEmail
          }
        })
      });
      if (!response.ok) return false;
      return await response.json().catch(() => false);
    } catch (e) {
      return false;
    }
  }

  async getAllTenants() {
    return await this.syncToCloud('get_all_tenants', {});
  }

  async updateTenantStatus(targetOwnerEmail, status) {
    return await this.syncToCloud('update_tenant_status', { targetOwnerEmail, status });
  }

  save() {
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.COURSES), JSON.stringify(this.courses));
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.STUDENTS), JSON.stringify(this.students));
  }

  getAllMessages() {
    return [...this.messages].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }

  getAllBatches() {
    return [...this.batches].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }

  async saveBatch(batch) {
    const batchData = {
      ...batch,
      id: batch.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'batch_' + Date.now()),
      status: batch.status === 'Completed' ? 'Completed' : 'Active',
      updatedAt: new Date().toISOString()
    };
    const index = this.batches.findIndex(item => item.id === batchData.id);
    if (index >= 0) this.batches[index] = batchData;
    else this.batches.unshift(batchData);
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.BATCHES), JSON.stringify(this.batches));

    try {
      const result = await this.syncToCloud('save_batch', { batch: batchData });
      if (result?.success && result.batch) {
        const cloudIndex = this.batches.findIndex(item => item.id === result.batch.id);
        if (cloudIndex >= 0) {
          this.batches[cloudIndex] = { ...this.batches[cloudIndex], ...result.batch };
          localStorage.setItem(this.getStorageKey(STORAGE_KEYS.BATCHES), JSON.stringify(this.batches));
        }
        return result.batch;
      }
    } catch (e) {
      console.warn('[Cloud Sync Warning]: Failed to sync batch to cloud:', e);
    }
    return batchData;
  }

  async deleteBatch(batchId) {
    this.batches = this.batches.filter(item => item.id !== batchId);
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.BATCHES), JSON.stringify(this.batches));
    await this.syncToCloud('delete_batch', { batchId });
  }

  async markMessageRead(messageId) {
    const message = this.messages.find(item => item.id === messageId);
    if (!message || message.isRead) return;
    message.isRead = true;
    message.readAt = new Date().toISOString();
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.MESSAGES), JSON.stringify(this.messages));
    return await this.syncToCloud('mark_message_read', { messageId });
  }

  async markMessageUnread(messageId) {
    const message = this.messages.find(item => item.id === messageId);
    if (!message || !message.isRead) return;
    message.isRead = false;
    delete message.readAt;
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.MESSAGES), JSON.stringify(this.messages));
    return await this.syncToCloud('mark_message_unread', { messageId });
  }

  async markAllMessagesRead() {
    let changed = false;
    this.messages.forEach(item => {
      if (!item.isRead) {
        item.isRead = true;
        item.readAt = new Date().toISOString();
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(this.getStorageKey(STORAGE_KEYS.MESSAGES), JSON.stringify(this.messages));
      return await this.syncToCloud('mark_all_messages_read', {});
    }
  }

  async deleteMessage(messageId) {
    this.messages = this.messages.filter(item => item.id !== messageId);
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.MESSAGES), JSON.stringify(this.messages));
    return await this.syncToCloud('delete_message', { messageId });
  }

  async clearAllData() {
    this.courses = [];
    this.students = [];
    this.save();
    return await this.syncToCloud('clear_all', {});
  }

  // Academy Profile (Universal SaaS Multi-Owner Setup)
  getAcademyProfile() {
    const raw = localStorage.getItem(this.getStorageKey(STORAGE_KEYS.ACADEMY_PROFILE));
    if (!raw) {
      if (this.ownerEmail.includes('poulami')) {
        return {
          academyName: 'Poulami Dance Academy',
          ownerName: 'Poulami',
          email: this.ownerEmail,
          phone: '9876543211',
          slug: 'poulami'
        };
      }
      if (this.ownerEmail === 'rcavirup@gmail.com' || this.ownerEmail === 'diganta') {
        return {
          academyName: 'Diganta Computer Centre',
          ownerName: 'Diganta',
          email: 'rcavirup@gmail.com',
          phone: '9733894742',
          secondaryPhone: '9733894742',
          whatsapp: '9733894742',
          address: 'Shyampur, Howrah',
          slug: 'diganta',
          studentIdPrefix: 'DCC/SMP/'
        };
      }
      if (this.ownerEmail === 'rcavirup@gmail.com' || this.ownerEmail === 'prantik' || this.ownerEmail === 'diganta') {
        return {
          academyName: 'PixelSetu Academy Platform',
          ownerName: 'Prantik Das',
          email: 'rcavirup@gmail.com',
          phone: '9733894742',
          secondaryPhone: '9733894742',
          whatsapp: '9733894742',
          slug: 'prantik'
        };
      }
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  async saveAcademyProfile(profile) {
    const updated = { ...profile, ownerEmail: this.ownerEmail };
    localStorage.setItem(this.getStorageKey(STORAGE_KEYS.ACADEMY_PROFILE), JSON.stringify(updated));
    return await this.syncToCloud('save_profile', { profile: updated });
  }

  // Authentication Token (6-Digit OTP, 5-Hour Expiry)
  getCachedAuthToken() {
    try {
      const token = JSON.parse(localStorage.getItem(this.getStorageKey(STORAGE_KEYS.AUTH_TOKEN)) || 'null');
      return token && token.academySlug === this.ownerEmail && /^\d{6}$/.test(String(token.code))
        && Number(token.expiresAt) > Date.now() ? token : null;
    } catch { return null; }
  }

  async getOrGenerateAuthToken(forceNew = false) {
    if (this.authTokenRequest) return this.authTokenRequest;
    const academySlug = this.ownerEmail;
    this.authTokenRequest = (async () => {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_auth_token', payload: { forceNew, academySlug } }),
        signal: AbortSignal.timeout(15000)
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success || !result.token) {
        throw new Error('Authentication server unavailable');
      }
      if (this.ownerEmail !== academySlug) throw new Error('Academy changed during code request');
      const token = { ...result.token, academySlug };
      localStorage.setItem(this.getStorageKey(STORAGE_KEYS.AUTH_TOKEN), JSON.stringify(token));
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(token));
      return token;
    })();
    try { return await this.authTokenRequest; }
    finally { this.authTokenRequest = null; }
  }

  // Student Operations
  getAllStudents() {
    return [...this.students].sort((a, b) => {
      const timeA = a.joinDate ? new Date(a.joinDate).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.joinDate ? new Date(b.joinDate).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      if (timeB !== timeA) return timeB - timeA;
      const createA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const createB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (createB !== createA) return createB - createA;
      return (b.id || '').localeCompare(a.id || '', undefined, { numeric: true });
    });
  }

  getStudentById(id) {
    if (!id) return null;
    const target = String(id).trim().toLowerCase();
    return this.students.find(s => String(s.id).trim().toLowerCase() === target) || null;
  }

  async addStudent(studentData) {
    const result = await this.syncToCloud('add_student', { student: studentData });
    if (!result?.success || !result?.student) throw new Error('The student ID could not be generated.');
    const newStudent = result.student;
    this.students.unshift(newStudent);
    this.save();
    return newStudent;
  }

  async updateStudent(id, updatedData) {
    const index = this.students.findIndex(s => String(s.id).trim().toLowerCase() === String(id).trim().toLowerCase());
    if (index !== -1) {
      const existing = this.students[index];
      this.students[index] = {
        ...existing,
        ...updatedData,
        // Always preserve the original registration date — never overwrite it on edit.
        joinDate: existing.joinDate || updatedData.joinDate
      };
      this.save();
      await this.syncToCloud('update_student', { studentId: id, updatedData });
      return this.students[index];
    }
    return null;
  }

  async bulkUpdateStudents(studentIds, updateFields) {
    const idSet = new Set((studentIds || []).map(id => String(id).trim().toLowerCase()));
    this.students = this.students.map(student => {
      if (idSet.has(String(student.id).trim().toLowerCase())) {
        return { ...student, ...updateFields };
      }
      return student;
    });
    this.save();
    return await this.syncToCloud('bulk_update_students', { studentIds: Array.from(studentIds), updateFields });
  }

  async deleteStudent(id) {
    this.students = this.students.filter(s => s.id !== id);
    this.save();
    return await this.syncToCloud('delete_student', { studentId: id });
  }

  async bulkDeleteStudents(ids) {
    const idSet = new Set(ids);
    this.students = this.students.filter(s => !idSet.has(s.id));
    this.save();
    return await this.syncToCloud('bulk_delete_students', { studentIds: Array.from(ids) });
  }

  // Course Operations (3 Fields: Title/Name, Duration, Description)
  getAllCourses() {
    return [...this.courses].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (timeB !== timeA) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }

  getCourseById(id) {
    return this.courses.find(c => c.id === id);
  }

  async addCourse(courseData) {
    const newId = `CRS-${Math.floor(100 + Math.random() * 900)}`;
    const newCourse = {
      id: newId,
      title: courseData.title,
      duration: courseData.duration,
      description: courseData.description,
      createdAt: new Date().toISOString()
    };
    this.courses.unshift(newCourse);
    this.save();
    await this.syncToCloud('add_course', { course: newCourse });
    return newCourse;
  }

  async updateCourse(id, updatedData) {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses[index] = {
        ...this.courses[index],
        ...updatedData
      };
      this.save();
      await this.syncToCloud('save_courses', { courses: this.courses });
      return this.courses[index];
    }
    return null;
  }

  async deleteCourse(id) {
    this.courses = this.courses.filter(c => c.id !== id);
    // Un-enroll deleted course from any students who had it
    this.students.forEach(student => {
      if (Array.isArray(student.enrolledCourseIds)) {
        student.enrolledCourseIds = student.enrolledCourseIds.filter(courseId => courseId !== id);
      }
    });
    this.save();
    return await this.syncToCloud('delete_course', { courseId: id });
  }

  getCourseEnrollmentCount(courseId) {
    return this.students.filter(s => Array.isArray(s.enrolledCourseIds) && s.enrolledCourseIds.includes(courseId)).length;
  }

  getStats() {
    const totalStudents = this.students.length;
    const activeStudents = this.students.filter(s => s.status === 'Active').length;
    const totalCourses = this.courses.length;

    return {
      totalStudents,
      activeStudents,
      totalCourses
    };
  }
}

// All OAuth-approved administrators manage the configured academy.
const activeAcademySlug = window.ADMIN_PORTAL_CONFIG?.adminAcademySlug || 'prantik';
const store = new AcademyStore(activeAcademySlug);


// ==========================================================================
// 3. UI Controller & Rendering
// ==========================================================================
class UIController {
  constructor() {
    // Check for local development auto-login parameter (?dev=superadmin or ?dev=rcavirup or ?dev=new)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const devParam = new URLSearchParams(window.location.search).get('dev');
    if (isLocalhost && devParam) {
      let email = 'dasprantik76@gmail.com';
      let name = 'Prantik Das (Super Admin)';
      if (devParam === 'rcavirup' || devParam === 'diganta') {
        email = 'rcavirup@gmail.com';
        name = 'Diganta';
      } else if (devParam === 'new' || devParam === 'pending') {
        email = 'newtenant@academy.com';
        name = 'New Academy Owner';
      } else if (devParam.includes('@')) {
        email = devParam.toLowerCase().trim();
        name = email.split('@')[0];
      }
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({
        name,
        email,
        provider: 'google',
        loggedInAt: Date.now()
      }));
    }

    // Check Authentication Session Gate
    const rawSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!rawSession) {
      window.location.href = 'index.html' + (window.location.hash || '');
      return;
    }

    try {
      this.session = JSON.parse(rawSession);
      const userEmail = (this.session?.email || '').toLowerCase().trim();
      if (!this.session || this.session.provider !== 'google' || !userEmail) {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        window.location.href = 'index.html' + (window.location.hash || '');
        return;
      }
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      window.location.href = 'index.html' + (window.location.hash || '');
      return;
    }

    // Keep storage and cloud requests scoped to the authenticated administrator.
    const userEmail = (this.session?.email || '').toLowerCase().trim();
    const isMasterSuperAdmin = userEmail === 'dasprantik76@gmail.com' || Boolean(this.session?.isSuperAdmin);

    const urlParams = new URLSearchParams(window.location.search);
    const impersonateEmail = urlParams.get('impersonate')?.toLowerCase().trim();

    if (isMasterSuperAdmin && impersonateEmail) {
      store.ownerEmail = impersonateEmail;
      store.isImpersonating = true;
      store.masterSuperAdminEmail = userEmail;
    } else {
      store.ownerEmail = userEmail || activeAcademySlug;
      store.isImpersonating = false;
    }
    store.init();

    const isSuperAdminUser = isMasterSuperAdmin;
    if (isSuperAdminUser) {
      document.body.classList.add('is-superadmin');
    } else {
      document.body.classList.remove('is-superadmin');
    }

    const initialHash = (window.location.hash || '').replace('#', '');
    if (initialHash === 'tenants') {
      window.location.replace('superadmin.html');
      return;
    }
    const validViews = ['dashboard', 'students', 'courses', 'batches', 'certificates', 'idcards', 'inbox', 'branding', 'personalisation'];
    let targetView = validViews.includes(initialHash) ? initialHash : 'dashboard';
    this.currentView = targetView;
    this.confirmCallback = null;
    this.platformTenants = [];
    this.tenantActiveFilter = 'all';

    // Filter states
    this.studentSearchQuery = '';
    this.studentCourseFilterVal = 'all';
    this.studentStatusFilterVal = 'all';
    this.courseSearchQuery = '';
    this.selectedStudentIds = new Set();
    this.selectedInboxMessageIds = new Set();
    this.completionStudentIds = new Set();
    this.editingBatchId = null;
    this.editingBatchStudentIds = new Set();
    this.editingBatchMemberIds = new Set();
    this.editBatchSearchQuery = '';

    this.cacheDOMElements();
    this.populateCompletionPeriodSelectors();
    this.bindEvents();
    if (targetView !== 'dashboard') {
      this.applyViewLayout(targetView);
      if (targetView === 'personalisation') {
        this.populatePersonalisationForm();
      }
      if (targetView === 'branding') {
        this.populateBrandingForm();
      }
    }
    this.render();
    this.startAuthCountdownTimer();
    this.updatePublicSiteLink();
    this.checkAccountStatus();

    // Synchronize with Multi-Tenant MongoDB cloud storage in background
    store.fetchCloudData(() => {
      this.populateCourseFilterDropdown();
      this.populateBatchFilterDropdown();
      this.populateCourseDropdownInStudentModal();
      if (this.currentView === 'personalisation') {
        this.populatePersonalisationForm();
      }
      if (this.currentView === 'branding') {
        this.populateBrandingForm();
      }
      this.render();
      this.updatePublicSiteLink();
      this.checkAccountStatus();
    });

    // Auto-refresh data when switching back to this browser tab
    window.addEventListener('focus', () => {
      store.fetchCloudData(() => {
        if (this.currentView === 'personalisation') {
          this.populatePersonalisationForm();
        }
        if (this.currentView === 'branding') {
          this.populateBrandingForm();
        }
        this.render();
      });
    });
  }

  updateSuperAdminState() {
    // Academy owner portal remains completely clean with no superadmin controls
    if (this.navTenants) {
      this.navTenants.style.setProperty('display', 'none', 'important');
    }
  }

  getRootDomain() {
    return 'pixelsetu.com';
  }

  getPublicUrlForSlug(slug) {
    const cleanSlug = (slug || '').toLowerCase().trim();
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const configuredSites = window.ADMIN_PORTAL_CONFIG?.publicSites || {};

    // Dedicated custom production domain if explicitly mapped in config and not in local dev
    if (!isLocalhost && cleanSlug && configuredSites[cleanSlug]) {
      return configuredSites[cleanSlug];
    }

    // Default: Clean slug-based public website URL: /a/<slug>
    const baseOrigin = window.location.origin || 'https://academy.pixelsetu.com';
    if (!cleanSlug) {
      return `${baseOrigin}/a/`;
    }
    return `${baseOrigin}/a/${encodeURIComponent(cleanSlug)}`;
  }

  getCertificateVerificationUrl(student) {
    const slug = student.academySlug || store.getAcademyProfile()?.slug || store.ownerEmail;
    const url = new URL(this.getPublicUrlForSlug(slug));
    url.searchParams.set('certificate', student.id);
    url.searchParams.set('academy', slug);
    url.hash = 'certificate';
    return url.href;
  }

  updatePublicSiteLink() {
    const profile = store.getAcademyProfile();
    const slug = profile?.slug || (this.session?.email?.includes('poulami') ? 'poulami' : (this.session?.email?.includes('diganta') ? 'diganta' : ''));
    const publicUrl = this.getPublicUrlForSlug(slug);

    const btnViewPublicSite = document.getElementById('btnViewPublicSite');
    if (btnViewPublicSite) {
      btnViewPublicSite.href = publicUrl;
    }

    if (this.dashboardFullUrlText) {
      this.dashboardFullUrlText.textContent = publicUrl;
    }
    if (this.dashboardPublicLinkDisplay) {
      this.dashboardPublicLinkDisplay.href = publicUrl;
    }
  }

  cacheDOMElements() {
    // Navigation & Views
    this.navItems = document.querySelectorAll('.nav-item');
    this.views = document.querySelectorAll('.view-section');
    this.pageTitle = document.getElementById('pageTitle');
    this.pageSubtitle = document.getElementById('pageSubtitle');
    this.pageTitleIcon = document.getElementById('pageTitleIcon');
    this.studentCountBadge = document.getElementById('studentCountBadge');
    this.courseCountBadge = document.getElementById('courseCountBadge');
    this.inboxUnreadBadge = document.getElementById('inboxUnreadBadge');

    // Sidebar Mobile Toggle & User Profile
    this.sidebar = document.getElementById('sidebar');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
    this.btnSidebarToggle = document.getElementById('btnSidebarToggle');
    this.btnCloseSidebar = document.getElementById('btnCloseSidebar');
    this.btnClearAllData = document.getElementById('btnClearAllData');
    this.sidebarAcademyName = document.getElementById('sidebarAcademyName');
    this.sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
    this.sidebarUserName = document.getElementById('sidebarUserName');
    this.sidebarUserEmail = document.getElementById('sidebarUserEmail');
    this.btnLogout = document.getElementById('btnLogout');

    // Account on Hold Elements
    this.accountOnHoldScreen = document.getElementById('accountOnHoldScreen');
    this.holdAcademyName = document.getElementById('holdAcademyName');
    this.holdSubdomainUrl = document.getElementById('holdSubdomainUrl');
    this.holdOwnerName = document.getElementById('holdOwnerName');
    this.holdOwnerEmail = document.getElementById('holdOwnerEmail');
    this.holdStatusBadge = document.getElementById('holdStatusBadge');
    this.btnRefreshHoldStatus = document.getElementById('btnRefreshHoldStatus');
    this.btnHoldLogout = document.getElementById('btnHoldLogout');

    // Super Admin Elements
    this.navTenants = document.getElementById('nav-tenants');
    this.pendingTenantsBadge = document.getElementById('pendingTenantsBadge');
    this.statTotalTenants = document.getElementById('statTotalTenants');
    this.statPendingTenants = document.getElementById('statPendingTenants');
    this.statActiveTenants = document.getElementById('statActiveTenants');
    this.pillPendingCount = document.getElementById('pillPendingCount');
    this.tenantSearchQuery = document.getElementById('tenantSearchQuery');
    this.tenantFilterGroup = document.getElementById('tenantFilterGroup');
    this.tenantsTableBody = document.getElementById('tenantsTableBody');
    this.btnRefreshTenants = document.getElementById('btnRefreshTenants');

    // Dashboard Elements
    this.statTotalStudents = document.getElementById('statTotalStudents');
    this.statTotalCourses = document.getElementById('statTotalCourses');
    this.dashboardInboxList = document.getElementById('dashboardInboxList');
    this.btnViewInbox = document.getElementById('btnViewInbox');

    // Authentication Code Elements
    this.authCodeDigits = document.getElementById('authCodeDigits');
    this.authCountdownTimer = document.getElementById('authCountdownTimer');
    this.authProgressFill = document.getElementById('authProgressFill');
    this.btnGenerateNewAuthCode = document.getElementById('btnGenerateNewAuthCode');
    this.btnCopyAuthCode = document.getElementById('btnCopyAuthCode');

    // Student View Elements
    this.studentSearchInput = document.getElementById('studentSearchInput');
    this.btnClearStudentSearch = document.getElementById('btnClearStudentSearch');
    this.adminStudentCourseFilterDropdown = document.getElementById('adminStudentCourseFilterDropdown');
    this.adminStudentCourseFilterTrigger = document.getElementById('adminStudentCourseFilterTrigger');
    this.adminStudentCourseFilterDisplay = document.getElementById('adminStudentCourseFilterDisplay');
    this.adminStudentCourseFilterMenu = document.getElementById('adminStudentCourseFilterMenu');
    this.studentCourseFilter = document.getElementById('studentCourseFilter');

    this.adminStudentBatchFilterDropdown = document.getElementById('adminStudentBatchFilterDropdown');
    this.adminStudentBatchFilterTrigger = document.getElementById('adminStudentBatchFilterTrigger');
    this.adminStudentBatchFilterDisplay = document.getElementById('adminStudentBatchFilterDisplay');
    this.adminStudentBatchFilterMenu = document.getElementById('adminStudentBatchFilterMenu');
    this.studentBatchFilter = document.getElementById('studentBatchFilter');
    this.studentBatchFilterVal = 'all';

    this.adminStudentStatusFilterDropdown = document.getElementById('adminStudentStatusFilterDropdown');
    this.adminStudentStatusFilterTrigger = document.getElementById('adminStudentStatusFilterTrigger');
    this.adminStudentStatusFilterDisplay = document.getElementById('adminStudentStatusFilterDisplay');
    this.adminStudentStatusFilterMenu = document.getElementById('adminStudentStatusFilterMenu');
    this.studentStatusFilter = document.getElementById('studentStatusFilter');

    this.batchActionMenu = document.getElementById('batchActionMenu');
    this.btnCreateBatch = document.getElementById('btnCreateBatch');
    this.batchActionDropdown = document.getElementById('batchActionDropdown');
    this.btnCreateNewBatch = document.getElementById('btnCreateNewBatch');
    this.btnAddToExistingBatch = document.getElementById('btnAddToExistingBatch');
    this.btnBulkMarkCompleted = document.getElementById('btnBulkMarkCompleted');
    this.bulkMarkCompletedLabel = document.getElementById('bulkMarkCompletedLabel');
    this.studentMoreActionsMenu = document.getElementById('studentMoreActionsMenu');
    this.btnStudentMoreActions = document.getElementById('btnStudentMoreActions');
    this.studentMoreDropdown = document.getElementById('studentMoreDropdown');
    this.btnMoreDownloadCert = document.getElementById('btnMoreDownloadCert');
    this.btnMoreChangeStatus = document.getElementById('btnMoreChangeStatus');
    this.btnMoreDeleteStudent = document.getElementById('btnMoreDeleteStudent');
    this.labelMoreDownloadCert = document.getElementById('labelMoreDownloadCert');
    this.labelMoreChangeStatus = document.getElementById('labelMoreChangeStatus');
    this.labelMoreDeleteStudent = document.getElementById('labelMoreDeleteStudent');

    // Bulk Status Modal Elements
    this.bulkStatusModal = document.getElementById('bulkStatusModal');
    this.bulkStatusModalTitle = document.getElementById('bulkStatusModalTitle');
    this.bulkStatusModalSubtitle = document.getElementById('bulkStatusModalSubtitle');
    this.btnCloseBulkStatusModal = document.getElementById('btnCloseBulkStatusModal');
    this.btnCancelBulkStatus = document.getElementById('btnCancelBulkStatus');
    this.bulkStatusForm = document.getElementById('bulkStatusForm');
    this.bulkStatusDropdown = document.getElementById('bulkStatusDropdown');
    this.bulkStatusTrigger = document.getElementById('bulkStatusTrigger');
    this.bulkStatusDisplay = document.getElementById('bulkStatusDisplay');
    this.bulkStatusMenu = document.getElementById('bulkStatusMenu');
    this.bulkStatusSelect = document.getElementById('bulkStatusSelect');
    this.pendingCertificateDownloadIds = null;
    this.btnAddStudent = document.getElementById('btnAddStudent');
    this.selectAllStudentsCheckbox = document.getElementById('selectAllStudentsCheckbox');
    this.studentsTableBody = document.getElementById('studentsTableBody');
    // Keep the checkbox and name anchored and space the four remaining labels.
    const studentsTable = document.getElementById('studentsTable');
    if (studentsTable) {
      const rowsTable = document.getElementById('studentsRowsTable');
      const rowViewport = rowsTable.closest('.table-responsive');
      const labelViewport = document.getElementById('studentTableLabels');
      rowViewport.addEventListener('scroll', () => {
        labelViewport.scrollLeft = rowViewport.scrollLeft;
      }, { passive: true });
      const alignStudentColumns = () => {
        studentsTable.style.width = `${rowsTable.getBoundingClientRect().width}px`;
        labelViewport.style.marginRight = `${rowViewport.offsetWidth - rowViewport.clientWidth}px`;
        const tableWidth = studentsTable.getBoundingClientRect().width;
        if (!tableWidth) return;
        const headers = [...studentsTable.querySelectorAll('thead th')];
        const middleHeaders = headers.slice(2, 6);
        const labelWidths = middleHeaders.map(header => {
          const label = header.querySelector('.th-status-header-wrap') || header;
          const range = document.createRange();
          range.selectNodeContents(label);
          return range.getBoundingClientRect().width;
        });
        const checkboxWidth = headers[0].getBoundingClientRect().width;
        const nameWidth = Math.max(180, Math.min(240, tableWidth * 0.18));
        const available = tableWidth - checkboxWidth - nameWidth;
        const gap = (available - labelWidths.reduce((sum, width) => sum + width, 0)) / middleHeaders.length;
        if (gap < 0) return;
        headers[1].style.width = `${nameWidth}px`;
        middleHeaders.forEach((header, index) => {
          header.style.width = `${labelWidths[index] + gap}px`;
        });
        // Move only the name/ID boundary so ID is midway between label centers.
        const nameLabel = headers[1].querySelector('.th-student-label-wrap > span');
        const nameLabelWidth = nameLabel.getBoundingClientRect().width;
        const coursesWidth = labelWidths[1] + gap;
        const adjustedNameWidth = (nameLabelWidth + coursesWidth) / 2;
        const adjustedIdWidth = nameWidth + labelWidths[0] + gap - adjustedNameWidth;
        headers[1].style.width = `${adjustedNameWidth}px`;
        headers[2].style.width = `${adjustedIdWidth}px`;
        rowsTable.querySelectorAll('col').forEach((column, index) => {
          column.style.width = `${headers[index].getBoundingClientRect().width}px`;
        });
      };
      this.studentColumnsResizeObserver = new ResizeObserver(alignStudentColumns);
      this.studentColumnsResizeObserver.observe(rowViewport);
      document.fonts.ready.then(alignStudentColumns);
    }
    this.studentsEmptyState = document.getElementById('studentsEmptyState');
    this.studentFilteredCount = document.getElementById('studentFilteredCount');
    this.studentTotalCount = document.getElementById('studentTotalCount');
    this.studentSelectionCount = document.getElementById('studentSelectionCount');
    this.btnResetStudentFilters = document.getElementById('btnResetStudentFilters');

    // Course View Elements
    this.courseSearchInput = document.getElementById('courseSearchInput');
    this.btnClearCourseSearch = document.getElementById('btnClearCourseSearch');
    this.btnAddCourse = document.getElementById('btnAddCourse');
    this.coursesGrid = document.getElementById('coursesGrid');
    this.coursesEmptyState = document.getElementById('coursesEmptyState');
    this.btnResetCourseFilters = document.getElementById('btnResetCourseFilters');

    // Inbox Elements
    this.inboxList = document.getElementById('inboxList');
    this.inboxEmptyState = document.getElementById('inboxEmptyState');
    this.inboxSearchInput = document.getElementById('inboxSearchInput');
    this.btnClearInboxSearch = document.getElementById('btnClearInboxSearch');
    this.btnMarkAllInboxRead = document.getElementById('btnMarkAllInboxRead');
    this.inboxEmptyTitle = document.getElementById('inboxEmptyTitle');
    this.inboxEmptyDesc = document.getElementById('inboxEmptyDesc');
    this.btnResetInboxSearch = document.getElementById('btnResetInboxSearch');
    this.selectAllInboxCheckbox = document.getElementById('selectAllInboxCheckbox');
    this.inboxSelectionCount = document.getElementById('inboxSelectionCount');
    this.btnBulkDeleteInbox = document.getElementById('btnBulkDeleteInbox');
    this.inboxSearchQuery = '';
    this.batchCountBadge = document.getElementById('batchCountBadge');
    this.batchesGrid = document.getElementById('batchesGrid');
    this.batchesEmptyState = document.getElementById('batchesEmptyState');
    this.batchSearchInput = document.getElementById('batchSearchInput');
    this.btnClearBatchSearch = document.getElementById('btnClearBatchSearch');
    this.btnResetBatchFilters = document.getElementById('btnResetBatchFilters');
    this.batchesEmptyTitle = document.getElementById('batchesEmptyTitle');
    this.batchesEmptyDesc = document.getElementById('batchesEmptyDesc');
    this.batchSearchQuery = '';
    this.btnAddBatch = document.getElementById('btnAddBatch');
    this.btnEmptyCreateBatch = document.getElementById('btnEmptyCreateBatch');

    // ID Cards View Elements
    this.idCardStudentSearchInput = document.getElementById('idCardStudentSearchInput');
    this.btnClearIdCardSearch = document.getElementById('btnClearIdCardSearch');
    this.idCardCourseFilterDropdown = document.getElementById('idCardCourseFilterDropdown');
    this.idCardCourseFilterTrigger = document.getElementById('idCardCourseFilterTrigger');
    this.idCardCourseFilterDisplay = document.getElementById('idCardCourseFilterDisplay');
    this.idCardCourseFilterMenu = document.getElementById('idCardCourseFilterMenu');
    this.idCardCourseFilterVal = document.getElementById('idCardCourseFilterVal');
    this.idCardBatchFilterDropdown = document.getElementById('idCardBatchFilterDropdown');
    this.idCardBatchFilterTrigger = document.getElementById('idCardBatchFilterTrigger');
    this.idCardBatchFilterDisplay = document.getElementById('idCardBatchFilterDisplay');
    this.idCardBatchFilterMenu = document.getElementById('idCardBatchFilterMenu');
    this.idCardBatchFilterVal = document.getElementById('idCardBatchFilterVal');
    this.idCardStatusFilterDropdown = document.getElementById('idCardStatusFilterDropdown');
    this.idCardStatusFilterTrigger = document.getElementById('idCardStatusFilterTrigger');
    this.idCardStatusFilterDisplay = document.getElementById('idCardStatusFilterDisplay');
    this.idCardStatusFilterMenu = document.getElementById('idCardStatusFilterMenu');
    this.idCardStatusFilterVal = document.getElementById('idCardStatusFilterVal');
    this.btnClearIdCardFilter = document.getElementById('btnClearIdCardFilter');
    this.idCardStudentCountBadge = document.getElementById('idCardStudentCountBadge');
    this.idCardSelectAllCheckbox = document.getElementById('idCardSelectAllCheckbox');
    this.idCardSelectionCountBadge = document.getElementById('idCardSelectionCountBadge');
    this.idCardStudentList = document.getElementById('idCardStudentList');
    this.idCardListEmptyState = document.getElementById('idCardListEmptyState');
    this.btnResetIdCardFilters = document.getElementById('btnResetIdCardFilters');
    this.idCardSelectedStudentName = document.getElementById('idCardSelectedStudentName');
    this.idCardSelectedStudentMeta = document.getElementById('idCardSelectedStudentMeta');
    this.idCardPreviewActions = document.getElementById('idCardPreviewActions');
    this.btnDownloadIdCard = document.getElementById('btnDownloadIdCard');
    this.idCardMockupWrapper = document.getElementById('idCardMockupWrapper');
    const idCardStage = document.querySelector('.idcards-card-stage');
    if (idCardStage && this.idCardMockupWrapper) {
      this.idCardPreviewResizeObserver = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        if (!width || !height) return;
        const desktop = window.matchMedia('(min-width: 901px)').matches;
        const frame = this.idCardMockupWrapper.querySelector('.idcard-frame-holder');
        const naturalHeight = frame.offsetHeight + 19;
        const scale = desktop ? Math.min(1, width / 320, height / naturalHeight) : 1;
        this.idCardMockupWrapper.style.setProperty('--idcard-preview-scale', String(scale));
      });
      this.idCardPreviewResizeObserver.observe(idCardStage);
    }
    this.idCardPreviewCanvas = document.getElementById('idCardPreviewCanvas');
    this.idCardLoadingOverlay = document.getElementById('idCardLoadingOverlay');
    this.idCardNoSelection = document.getElementById('idCardNoSelection');

    this.selectedIdCardStudentIds = new Set();
    this.lastSelectedIdCardStudentId = null;
    this.idCardSearchQuery = '';
    this.idCardCourseFilterValue = 'all';
    this.idCardBatchFilterValue = 'all';
    this.idCardStatusFilterValue = 'all';
    this.cachedIdCardTemplate = null;

    // Modals - Student (Full fields aligned with registration portal)
    this.studentModal = document.getElementById('studentModal');
    this.studentForm = document.getElementById('studentForm');
    this.studentModalTitle = document.getElementById('studentModalTitle');
    this.studentIdInput = document.getElementById('studentId');
    this.studentPhotoPreview = document.getElementById('studentPhotoPreview');
    this.studentPhotoPreviewImg = document.getElementById('studentPhotoPreviewImg');
    this.studentPhotoPreviewInitials = document.getElementById('studentPhotoPreviewInitials');
    this.studentPhotoInput = document.getElementById('studentPhotoInput');
    this.btnClearStudentPhoto = document.getElementById('btnClearStudentPhoto');
    this.studentPhotoError = document.getElementById('studentPhotoError');
    this.studentPhotoUploadWrapper = document.getElementById('studentPhotoUploadWrapper');
    this.studentPhotoUrl = document.getElementById('studentPhotoUrl');
    this.studentImageKitFileId = document.getElementById('studentImageKitFileId');
    this.studentImageKitFilePath = document.getElementById('studentImageKitFilePath');
    this.selectedStudentPhotoFile = null;
    this.photoMarkedForRemoval = false;
    this.studentNameInput = document.getElementById('studentName');
    this.studentDobInput = document.getElementById('studentDob');
    this.studentFatherNameInput = document.getElementById('studentFatherName');
    this.studentMotherNameInput = document.getElementById('studentMotherName');
    this.studentAadharInput = document.getElementById('studentAadhar');
    this.studentAadharError = document.getElementById('studentAadharError');
    this.adminStudentGenderDropdown = document.getElementById('adminStudentGenderDropdown');
    this.adminStudentGenderTrigger = document.getElementById('adminStudentGenderTrigger');
    this.adminStudentGenderDisplay = document.getElementById('adminStudentGenderDisplay');
    this.adminStudentGenderMenu = document.getElementById('adminStudentGenderMenu');
    this.studentGenderInput = document.getElementById('studentGender');

    this.adminStudentMaritalStatusDropdown = document.getElementById('adminStudentMaritalStatusDropdown');
    this.adminStudentMaritalStatusTrigger = document.getElementById('adminStudentMaritalStatusTrigger');
    this.adminStudentMaritalStatusDisplay = document.getElementById('adminStudentMaritalStatusDisplay');
    this.adminStudentMaritalStatusMenu = document.getElementById('adminStudentMaritalStatusMenu');
    this.studentMaritalStatusInput = document.getElementById('studentMaritalStatus');

    this.adminStudentCategoryDropdown = document.getElementById('adminStudentCategoryDropdown');
    this.adminStudentCategoryTrigger = document.getElementById('adminStudentCategoryTrigger');
    this.adminStudentCategoryDisplay = document.getElementById('adminStudentCategoryDisplay');
    this.adminStudentCategoryMenu = document.getElementById('adminStudentCategoryMenu');
    this.studentCategoryInput = document.getElementById('studentCategory');

    this.adminStudentReligionDropdown = document.getElementById('adminStudentReligionDropdown');
    this.adminStudentReligionTrigger = document.getElementById('adminStudentReligionTrigger');
    this.adminStudentReligionDisplay = document.getElementById('adminStudentReligionDisplay');
    this.adminStudentReligionMenu = document.getElementById('adminStudentReligionMenu');
    this.studentReligionInput = document.getElementById('studentReligion');

    this.studentPhoneInput = document.getElementById('studentPhone');
    this.studentPhoneError = document.getElementById('studentPhoneError');
    this.studentEmailInput = document.getElementById('studentEmail');

    this.adminStudentStateDropdown = document.getElementById('adminStudentStateDropdown');
    this.adminStudentStateTrigger = document.getElementById('adminStudentStateTrigger');
    this.adminStudentStateDisplay = document.getElementById('adminStudentStateDisplay');
    this.adminStudentStateMenu = document.getElementById('adminStudentStateMenu');
    this.studentStateInput = document.getElementById('studentState');

    this.adminStudentDistrictDropdown = document.getElementById('adminStudentDistrictDropdown');
    this.adminStudentDistrictTrigger = document.getElementById('adminStudentDistrictTrigger');
    this.adminStudentDistrictDisplay = document.getElementById('adminStudentDistrictDisplay');
    this.adminStudentDistrictMenu = document.getElementById('adminStudentDistrictMenu');
    this.studentDistrictInput = document.getElementById('studentDistrict');

    this.studentPinCodeInput = document.getElementById('studentPinCode');
    this.studentPinCodeError = document.getElementById('studentPinCodeError');

    this.adminStudentQualificationDropdown = document.getElementById('adminStudentQualificationDropdown');
    this.adminStudentQualificationTrigger = document.getElementById('adminStudentQualificationTrigger');
    this.adminStudentQualificationDisplay = document.getElementById('adminStudentQualificationDisplay');
    this.adminStudentQualificationMenu = document.getElementById('adminStudentQualificationMenu');
    this.studentQualificationInput = document.getElementById('studentQualification');

    this.studentAddressInput = document.getElementById('studentAddress');

    this.adminStudentCourseDropdown = document.getElementById('adminStudentCourseDropdown');
    this.adminStudentCourseTrigger = document.getElementById('adminStudentCourseTrigger');
    this.adminStudentCourseDisplay = document.getElementById('adminStudentCourseDisplay');
    this.adminStudentCourseMenu = document.getElementById('adminStudentCourseMenu');
    this.studentCourseInput = document.getElementById('studentCourse');

    this.adminStudentStatusDropdown = document.getElementById('adminStudentStatusDropdown');
    this.adminStudentStatusTrigger = document.getElementById('adminStudentStatusTrigger');
    this.adminStudentStatusDisplay = document.getElementById('adminStudentStatusDisplay');
    this.adminStudentStatusMenu = document.getElementById('adminStudentStatusMenu');
    this.studentStatusSelect = document.getElementById('studentStatus');

    this.btnCloseStudentModal = document.getElementById('btnCloseStudentModal');
    this.btnCancelStudentModal = document.getElementById('btnCancelStudentModal');
    this.btnDeleteStudentModal = document.getElementById('btnDeleteStudentModal');
    this.btnSaveStudent = document.getElementById('btnSaveStudent');

    // Modals - Course (Only 3 Inputs: Title/Name, Duration, Description)
    this.courseModal = document.getElementById('courseModal');
    this.courseForm = document.getElementById('courseForm');
    this.courseModalTitle = document.getElementById('courseModalTitle');
    this.courseIdInput = document.getElementById('courseId');
    this.courseTitleInput = document.getElementById('courseTitle');
    this.courseDurationValueInput = document.getElementById('courseDurationValue');
    this.durationUnitDropdown = document.getElementById('durationUnitDropdown');
    this.durationUnitTrigger = document.getElementById('durationUnitTrigger');
    this.durationUnitDisplay = document.getElementById('durationUnitDisplay');
    this.durationUnitMenu = document.getElementById('durationUnitMenu');
    this.courseDurationUnitInput = document.getElementById('courseDurationUnit');
    this.courseDescriptionInput = document.getElementById('courseDescription');
    this.btnCloseCourseModal = document.getElementById('btnCloseCourseModal');
    this.btnCancelCourseModal = document.getElementById('btnCancelCourseModal');
    this.btnSaveCourse = document.getElementById('btnSaveCourse');

    // Modals - Student Details
    this.studentDetailsModal = document.getElementById('studentDetailsModal');
    this.studentDetailsContent = document.getElementById('studentDetailsContent');
    this.btnCloseDetailsModal = document.getElementById('btnCloseDetailsModal');
    this.btnEditFromDetails = document.getElementById('btnEditFromDetails');
    this.btnDeleteStudentFromDetails = document.getElementById('btnDeleteStudentFromDetails');
    this.currentViewingStudentId = null;
    this.completingBatchId = null;

    // Modals - Batch Management
    this.batchModal = document.getElementById('batchModal');
    this.batchForm = document.getElementById('batchForm');
    this.batchModalTitle = document.getElementById('batchModalTitle');
    this.batchStudentCount = document.getElementById('batchStudentCount');
    this.batchNameGroup = document.getElementById('batchNameGroup');
    this.batchNameInput = document.getElementById('batchNameInput');
    this.existingBatchGroup = document.getElementById('existingBatchGroup');
    this.existingBatchDropdown = document.getElementById('existingBatchDropdown');
    this.existingBatchTrigger = document.getElementById('existingBatchTrigger');
    this.existingBatchMenu = document.getElementById('existingBatchMenu');
    this.existingBatchDisplay = document.getElementById('existingBatchDisplay');
    this.existingBatchSelect = document.getElementById('existingBatchSelect');
    this.batchStudentSelectionGroup = document.getElementById('batchStudentSelectionGroup');
    this.createBatchSelectionCount = document.getElementById('createBatchSelectionCount');
    this.createBatchStudentSearch = document.getElementById('createBatchStudentSearch');
    this.createBatchStudentList = document.getElementById('createBatchStudentList');
    this.createBatchEmptyState = document.getElementById('createBatchEmptyState');
    this.createBatchSelectedStudentIds = new Set();
    this.createBatchSearchQuery = '';
    this.saveBatchLabel = document.getElementById('saveBatchLabel');
    this.btnCloseBatchModal = document.getElementById('btnCloseBatchModal');
    this.btnCancelBatchModal = document.getElementById('btnCancelBatchModal');
    this.btnSaveBatch = document.getElementById('btnSaveBatch');
    this.batchModalMode = 'create';

    // Modal - Edit Batch Students
    this.editBatchModal = document.getElementById('editBatchModal');
    this.editBatchForm = document.getElementById('editBatchForm');
    this.editBatchName = document.getElementById('editBatchName');
    this.editBatchNameInput = document.getElementById('editBatchNameInput');
    this.editBatchStudentSearch = document.getElementById('editBatchStudentSearch');
    this.editBatchSelectionCount = document.getElementById('editBatchSelectionCount');
    this.editBatchStudentList = document.getElementById('editBatchStudentList');
    this.editBatchEmptyState = document.getElementById('editBatchEmptyState');
    this.editBatchStatusDropdown = document.getElementById('editBatchStatusDropdown');
    this.editBatchStatusTrigger = document.getElementById('editBatchStatusTrigger');
    this.editBatchStatusMenu = document.getElementById('editBatchStatusMenu');
    this.editBatchStatusDisplay = document.getElementById('editBatchStatusDisplay');
    this.editBatchStatus = document.getElementById('editBatchStatus');
    this.btnCloseEditBatchModal = document.getElementById('btnCloseEditBatchModal');
    this.btnCancelEditBatch = document.getElementById('btnCancelEditBatch');
    this.btnSaveEditBatch = document.getElementById('btnSaveEditBatch');
    this.btnDeleteBatch = document.getElementById('btnDeleteBatch');

    // Modals - Course Completion
    this.completionModal = document.getElementById('completionModal');
    this.completionForm = document.getElementById('completionForm');
    this.completionModalTitle = document.getElementById('completionModalTitle');
    this.completionStudentCount = document.getElementById('completionStudentCount');
    this.completionStartMonthDropdown = document.getElementById('completionStartMonthDropdown');
    this.completionStartMonthTrigger = document.getElementById('completionStartMonthTrigger');
    this.completionStartMonthMenu = document.getElementById('completionStartMonthMenu');
    this.completionStartMonthDisplay = document.getElementById('completionStartMonthDisplay');
    this.completionStartMonth = document.getElementById('completionStartMonth');
    this.completionStartYearDropdown = document.getElementById('completionStartYearDropdown');
    this.completionStartYearTrigger = document.getElementById('completionStartYearTrigger');
    this.completionStartYearMenu = document.getElementById('completionStartYearMenu');
    this.completionStartYearDisplay = document.getElementById('completionStartYearDisplay');
    this.completionStartYear = document.getElementById('completionStartYear');
    this.completionEndMonthDropdown = document.getElementById('completionEndMonthDropdown');
    this.completionEndMonthTrigger = document.getElementById('completionEndMonthTrigger');
    this.completionEndMonthMenu = document.getElementById('completionEndMonthMenu');
    this.completionEndMonthDisplay = document.getElementById('completionEndMonthDisplay');
    this.completionEndMonth = document.getElementById('completionEndMonth');
    this.completionEndYearDropdown = document.getElementById('completionEndYearDropdown');
    this.completionEndYearTrigger = document.getElementById('completionEndYearTrigger');
    this.completionEndYearMenu = document.getElementById('completionEndYearMenu');
    this.completionEndYearDisplay = document.getElementById('completionEndYearDisplay');
    this.completionEndYear = document.getElementById('completionEndYear');
    this.completionIssueDate = document.getElementById('completionIssueDate');
    this.completionGrade = document.getElementById('completionGrade');
    this.btnCloseCompletionModal = document.getElementById('btnCloseCompletionModal');
    this.btnCancelCompletion = document.getElementById('btnCancelCompletion');
    this.btnConfirmCompletion = document.getElementById('btnConfirmCompletion');

    // Modals - Confirmation
    this.confirmModal = document.getElementById('confirmModal');
    this.confirmTitle = document.getElementById('confirmTitle');
    this.confirmMessage = document.getElementById('confirmMessage');
    this.btnExecuteConfirm = document.getElementById('btnExecuteConfirm');
    this.btnCancelConfirm = document.getElementById('btnCancelConfirm');
    this.btnCloseConfirmModal = document.getElementById('btnCloseConfirmModal');

    // Modals - Inbox Message Details
    this.inboxMessageModal = document.getElementById('inboxMessageModal');
    this.btnCloseInboxMessageModal = document.getElementById('btnCloseInboxMessageModal');
    this.btnCloseInboxMessageModalBtn = document.getElementById('btnCloseInboxMessageModalBtn');
    this.btnDeleteInboxMessageFromModal = document.getElementById('btnDeleteInboxMessageFromModal');
    this.btnToggleReadFromModal = document.getElementById('btnToggleReadFromModal');
    this.btnCallVisitorFromModal = document.getElementById('btnCallVisitorFromModal');
    this.inboxModalReceivedTime = document.getElementById('inboxModalReceivedTime');
    this.inboxModalAvatar = document.getElementById('inboxModalAvatar');
    this.inboxModalSenderName = document.getElementById('inboxModalSenderName');
    this.inboxModalStatusBadge = document.getElementById('inboxModalStatusBadge');
    this.inboxModalPhone = document.getElementById('inboxModalPhone');
    this.inboxModalPhoneText = document.getElementById('inboxModalPhoneText');
    this.inboxModalCourseSection = document.getElementById('inboxModalCourseSection');
    this.inboxModalCourseName = document.getElementById('inboxModalCourseName');
    this.inboxModalMessageText = document.getElementById('inboxModalMessageText');
    this.labelToggleRead = document.getElementById('labelToggleRead');

    // Dashboard Public Portal Widgets
    this.dashboardFullUrlText = document.getElementById('dashboardFullUrlText');
    this.dashboardPublicLinkDisplay = document.getElementById('dashboardPublicLinkDisplay');
    this.btnCopyPublicUrl = document.getElementById('btnCopyPublicUrl');
    this.btnOpenSubdomainSettings = document.getElementById('btnOpenSubdomainSettings');

    // Modals - Academy Settings
    this.btnEditAcademySettings = document.getElementById('btnEditAcademySettings');
    this.academySettingsModal = document.getElementById('academySettingsModal');
    this.academySettingsForm = document.getElementById('academySettingsForm');
    this.settingsAcademyName = document.getElementById('settingsAcademyName');
    this.settingsOwnerName = document.getElementById('settingsOwnerName');
    this.settingsSubdomainSlug = document.getElementById('settingsSubdomainSlug');
    this.settingsSubdomainSuffix = document.getElementById('settingsSubdomainSuffix');
    this.settingsSlugPrefix = document.getElementById('settingsSlugPrefix');
    this.btnCloseAcademySettingsModal = document.getElementById('btnCloseAcademySettingsModal');
    this.btnCancelAcademySettings = document.getElementById('btnCancelAcademySettings');

    // Modals - Onboarding Setup
    this.onboardingModal = document.getElementById('onboardingModal');
    this.onboardingForm = document.getElementById('onboardingForm');
    this.onboardingAcademyName = document.getElementById('onboardingAcademyName');
    this.onboardingOwnerName = document.getElementById('onboardingOwnerName');
    this.onboardingSubdomainSlug = document.getElementById('onboardingSubdomainSlug');
    this.onboardingSubdomainSuffix = document.getElementById('onboardingSubdomainSuffix');
    this.onboardingSlugPrefix = document.getElementById('onboardingSlugPrefix');
    // Personalisation View Elements
    this.navPersonalisation = document.getElementById('nav-personalisation');
    this.viewPersonalisation = document.getElementById('view-personalisation');
    this.btnPersonalisationPreviewLive = document.getElementById('btnPersonalisationPreviewLive');
    this.btnSavePersonalisationTop = document.getElementById('btnSavePersonalisationTop');
    this.personalisationForm = document.getElementById('personalisationForm');
    this.persTabBtns = document.querySelectorAll('.pers-tab-btn');
    this.persTabPanes = document.querySelectorAll('.pers-tab-pane');
    this.persSubdomainSlug = document.getElementById('persSubdomainSlug');
    this.persFullUrlPreview = document.getElementById('persFullUrlPreview');
    this.btnPersCopyLink = document.getElementById('btnPersCopyLink');
    this.persAcademyName = document.getElementById('persAcademyName');
    this.persCategory = document.getElementById('persCategory');
    this.persHeroTitle1 = document.getElementById('persHeroTitle1');
    this.persHeroTitle2 = document.getElementById('persHeroTitle2');
    this.persHeroTagline = document.getElementById('persHeroTagline');
    this.persOwnerName = document.getElementById('persOwnerName');
    this.persHeroDesc = document.getElementById('persHeroDesc');
    this.heroPhotos = [];
    this.persHeroPhotosFile = document.getElementById('persHeroPhotosFile');
    this.btnUploadHeroPhotos = document.getElementById('btnUploadHeroPhotos');
    this.heroPhotosDropZone = document.getElementById('heroPhotosDropZone');
    this.heroPhotosGrid = document.getElementById('heroPhotosGrid');
    this.heroPhotosCountBadge = document.getElementById('heroPhotosCountBadge');
    this.heroMultiActions = document.getElementById('heroMultiActions');
    this.heroUploadPromptText = document.getElementById('heroUploadPromptText');
    this.persHeroImg1 = document.getElementById('persHeroImg1');
    this.persHeroImg2 = document.getElementById('persHeroImg2');
    this.persNotice1 = document.getElementById('persNotice1');
    this.persNotice2 = document.getElementById('persNotice2');
    this.persNotice3 = document.getElementById('persNotice3');
    this.persBannerPhone = document.getElementById('persBannerPhone');
    this.persBannerTagline = document.getElementById('persBannerTagline');
    this.persEstYear = document.getElementById('persEstYear');
    this.persAboutHeadline = document.getElementById('persAboutHeadline');
    this.persAboutDirector = document.getElementById('persAboutDirector');
    this.persAboutStory = document.getElementById('persAboutStory');
    this.persAboutStoryImg = document.getElementById('persAboutStoryImg');
    this.persAboutStoryImgFile = document.getElementById('persAboutStoryImgFile');
    this.btnUploadAboutStoryImg = document.getElementById('btnUploadAboutStoryImg');
    this.btnRemoveAboutStoryImg = document.getElementById('btnRemoveAboutStoryImg');
    this.aboutStoryDropZone = document.getElementById('aboutStoryDropZone');
    this.persAboutStoryPreviewImg = document.getElementById('persAboutStoryPreviewImg');
    this.persAboutStoryPlaceholder = document.getElementById('persAboutStoryPlaceholder');
    this.persHighlight1 = document.getElementById('persHighlight1');
    this.persHighlight2 = document.getElementById('persHighlight2');
    this.persHighlight3 = document.getElementById('persHighlight3');
    this.persHighlight4 = document.getElementById('persHighlight4');
    this.persLogoUrl = document.getElementById('persLogoUrl');
    this.persLogoFile = document.getElementById('persLogoFile');
    this.btnUploadLogo = document.getElementById('btnUploadLogo');
    this.btnRemoveLogo = document.getElementById('btnRemoveLogo');
    this.logoDropZone = document.getElementById('logoDropZone');
    this.persLogoPreviewImg = document.getElementById('persLogoPreviewImg');
    this.persLogoPreviewPlaceholder = document.getElementById('persLogoPreviewPlaceholder');
    this.persFaviconUrl = document.getElementById('persFaviconUrl');
    this.persFaviconFile = document.getElementById('persFaviconFile');
    this.btnUploadFavicon = document.getElementById('btnUploadFavicon');
    this.btnRemoveFavicon = document.getElementById('btnRemoveFavicon');
    this.faviconDropZone = document.getElementById('faviconDropZone');
    this.persFaviconPreviewImg = document.getElementById('persFaviconPreviewImg');
    this.persFaviconPreviewPlaceholder = document.getElementById('persFaviconPreviewPlaceholder');
    this.persSignatureUrl = document.getElementById('persSignatureUrl');
    this.persSignatureFile = document.getElementById('persSignatureFile');
    this.btnUploadSignature = document.getElementById('btnUploadSignature');
    this.btnRemoveSignature = document.getElementById('btnRemoveSignature');
    this.signatureDropZone = document.getElementById('signatureDropZone');
    this.persSignaturePreviewImg = document.getElementById('persSignaturePreviewImg');
    this.persSignaturePreviewPlaceholder = document.getElementById('persSignaturePreviewPlaceholder');
    this.accreditationLogos = [];
    this.persAccreditationUrls = document.getElementById('persAccreditationUrls');
    this.persAccreditationsFile = document.getElementById('persAccreditationsFile');
    this.btnUploadAccreditations = document.getElementById('btnUploadAccreditations');
    this.accreditationsDropZone = document.getElementById('accreditationsDropZone');
    this.persAccreditationsGrid = document.getElementById('persAccreditationsGrid');
    this.accreditationsCountBadge = document.getElementById('accreditationsCountBadge');
    this.persGalleryHeading = document.getElementById('persGalleryHeading');
    this.persGallerySubtitle = document.getElementById('persGallerySubtitle');
    this.galleryPhotos = [];
    this.persGalleryUrls = document.getElementById('persGalleryUrls');
    this.persGalleryFiles = document.getElementById('persGalleryFiles');
    this.btnUploadGalleryPhotos = document.getElementById('btnUploadGalleryPhotos');
    this.galleryDropZone = document.getElementById('galleryDropZone');
    this.persGalleryGrid = document.getElementById('persGalleryGrid');
    this.galleryCountBadge = document.getElementById('galleryCountBadge');
    this.persPhone = document.getElementById('persPhone');
    this.persSecondaryPhone = document.getElementById('persSecondaryPhone');
    this.persEmail = document.getElementById('persEmail');
    this.persBranch1 = document.getElementById('persBranch1');
    this.persBranch2 = document.getElementById('persBranch2');
    this.persAddress = document.getElementById('persAddress');
    this.persPinCode = document.getElementById('persPinCode');
    this.persMapUrl = document.getElementById('persMapUrl');
    this.persSocialWhatsapp = document.getElementById('persSocialWhatsapp');
    this.persSocialFacebook = document.getElementById('persSocialFacebook');
    this.persSocialInstagram = document.getElementById('persSocialInstagram');
    this.persSocialYoutube = document.getElementById('persSocialYoutube');
    this.persSocialLinkedin = document.getElementById('persSocialLinkedin');
    this.persSocialTwitter = document.getElementById('persSocialTwitter');
    this.persFooterBio = document.getElementById('persFooterBio');
    this.persFooterProof = document.getElementById('persFooterProof');
    this.persFooterCopyright = document.getElementById('persFooterCopyright');
    this.btnSavePersonalisation = document.getElementById('btnSavePersonalisation');
    this.btnPublishPersonalisation = document.getElementById('btnPublishPersonalisation');

    // Section Visibility Toggles
    this.sectionVisibilityCheckboxes = document.querySelectorAll('.section-visibility-checkbox');
    this.toggleVisibilityHero = document.getElementById('toggleVisibilityHero');
    this.toggleVisibilityBanner = document.getElementById('toggleVisibilityBanner');
    this.toggleVisibilityAbout = document.getElementById('toggleVisibilityAbout');
    this.toggleVisibilityAccreditations = document.getElementById('toggleVisibilityAccreditations');
    this.toggleVisibilityGallery = document.getElementById('toggleVisibilityGallery');
    this.toggleVisibilityContact = document.getElementById('toggleVisibilityContact');
    this.toggleVisibilitySocials = document.getElementById('toggleVisibilitySocials');
    this.toggleVisibilityFooter = document.getElementById('toggleVisibilityFooter');

    // Branding View Elements
    this.navBranding = document.getElementById('nav-branding');
    this.viewBranding = document.getElementById('view-branding');
    this.brandingForm = document.getElementById('brandingForm');
    this.brandingAcademyName = document.getElementById('brandingAcademyName');
    this.brandingPhone = document.getElementById('brandingPhone');
    this.brandingEmail = document.getElementById('brandingEmail');
    this.brandingLogoDropZone = document.getElementById('brandingLogoDropZone');
    this.brandingLogoPreviewBox = document.getElementById('brandingLogoPreviewBox');
    this.brandingLogoImg = document.getElementById('brandingLogoImg');
    this.brandingLogoPlaceholder = document.getElementById('brandingLogoPlaceholder');
    this.brandingLogoFileInput = document.getElementById('brandingLogoFileInput');
    this.btnUploadBrandingLogo = document.getElementById('btnUploadBrandingLogo');
    this.btnRemoveBrandingLogo = document.getElementById('btnRemoveBrandingLogo');
    this.brandingLogoUrl = document.getElementById('brandingLogoUrl');
    this.btnSaveBranding = document.getElementById('btnSaveBranding');

    this.toastContainer = document.getElementById('toastContainer');
  }

  populateCompletionPeriodSelectors() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthOptions = monthNames.map((name, index) =>
      `<li class="custom-select-option" data-value="${String(index + 1).padStart(2, '0')}" role="option">${name}</li>`
    ).join('');
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from(
      { length: 10 },
      (_, index) => currentYear - index
    ).map(year => `<li class="custom-select-option" data-value="${year}" role="option">${year}</li>`).join('');

    this.completionStartMonthMenu.innerHTML = monthOptions;
    this.completionEndMonthMenu.innerHTML = monthOptions;
    this.completionStartYearMenu.innerHTML = yearOptions;
    this.completionEndYearMenu.innerHTML = yearOptions;

    [
      [this.completionStartMonthDropdown, this.completionStartMonthTrigger, this.completionStartMonthMenu, this.completionStartMonthDisplay, this.completionStartMonth],
      [this.completionStartYearDropdown, this.completionStartYearTrigger, this.completionStartYearMenu, this.completionStartYearDisplay, this.completionStartYear],
      [this.completionEndMonthDropdown, this.completionEndMonthTrigger, this.completionEndMonthMenu, this.completionEndMonthDisplay, this.completionEndMonth],
      [this.completionEndYearDropdown, this.completionEndYearTrigger, this.completionEndYearMenu, this.completionEndYearDisplay, this.completionEndYear]
    ].forEach(([container, trigger, menu, display, input]) => {
      this.setupAdminDropdown(container, trigger, menu, display, input, () => {
        trigger.classList.remove('input-error');
        this.validateCompletionPeriodSelection();
      });
    });
  }

  getCompletionPeriodValue(monthSelect, yearSelect) {
    return monthSelect.value && yearSelect.value ? `${yearSelect.value}-${monthSelect.value}` : '';
  }

  validateCompletionPeriodSelection() {
    const ready = Boolean(this.completionStartMonth.value && this.completionStartYear.value);
    const startYear = Number(this.completionStartYear.value);
    const years = ready ? Array.from(
      { length: 10 },
      (_, index) => startYear + index
    ) : [];
    let endYear = this.completionEndYear.value;
    let endMonth = this.completionEndMonth.value;
    if (!years.includes(Number(endYear))) endYear = '';
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = ready ? monthNames.map((label, index) => ({
      label, value: String(index + 1).padStart(2, '0')
    })) : [];
    if (!months.some(month => month.value === endMonth)) endMonth = '';
    this.completionEndYearMenu.innerHTML = years.map(year =>
      `<li class="custom-select-option" data-value="${year}" role="option">${year}</li>`
    ).join('');
    this.completionEndMonthMenu.innerHTML = months.map(month =>
      `<li class="custom-select-option" data-value="${month.value}" role="option">${month.label}</li>`
    ).join('');
    [
      [this.completionEndMonthDropdown, this.completionEndMonthMenu, this.completionEndMonthDisplay, this.completionEndMonth, this.completionEndMonthTrigger, endMonth, 'Month'],
      [this.completionEndYearDropdown, this.completionEndYearMenu, this.completionEndYearDisplay, this.completionEndYear, this.completionEndYearTrigger, endYear, 'Year']
    ].forEach(([container, menu, display, input, trigger, value, label]) => {
      trigger.disabled = !ready;
      trigger.setAttribute('aria-disabled', String(!ready));
      this.setAdminDropdownValue(container, menu, display, input, value, label);
    });
    this.validateCompletionDates();
  }

  validateCompletionDates() {
    const start = this.getCompletionPeriodValue(this.completionStartMonth, this.completionStartYear);
    const end = this.getCompletionPeriodValue(this.completionEndMonth, this.completionEndYear);
    const issue = this.completionIssueDate.value;
    const invalidDuration = Boolean(start && end && end <= start);
    const invalidIssue = this.completionIssueDate.validity.badInput || Boolean(issue && (
      !/^\d{4}-\d{2}-\d{2}$/.test(issue)
      || issue < '0001-01-01' || issue > '9999-12-31'
      || (end && issue.slice(0, 7) < end)
    ));
    const durationError = document.getElementById('completionDurationError');
    const issueError = document.getElementById('completionIssueDateError');
    durationError.textContent = invalidDuration ? 'Please select a valid course duration.' : '';
    durationError.hidden = !invalidDuration;
    issueError.textContent = invalidIssue ? 'Please select a valid certificate issuing date.' : '';
    issueError.hidden = !invalidIssue;
    const fields = [
      [this.completionStartMonth, this.completionStartMonthTrigger, false],
      [this.completionStartYear, this.completionStartYearTrigger, false],
      [this.completionEndMonth, this.completionEndMonthTrigger, invalidDuration],
      [this.completionEndYear, this.completionEndYearTrigger, invalidDuration],
      [this.completionIssueDate, this.completionIssueDate, invalidIssue],
      [this.completionGrade, this.completionGrade, false]
    ];
    let missing = false;
    fields.forEach(([input, field, invalid]) => {
      const empty = !input.value.trim();
      missing ||= empty;
      const error = invalid || Boolean(this.completionSubmitted && empty);
      field.classList.toggle('input-error', error);
      field.setAttribute('aria-invalid', String(error));
    });
    this.btnConfirmCompletion.disabled = invalidDuration || invalidIssue;
    return !missing && !invalidDuration && !invalidIssue;
  }

  bindEvents() {
    this.completionGrade.addEventListener('input', () => {
      const input = this.completionGrade;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = input.value.toUpperCase();
      input.setSelectionRange(start, end);
      this.validateCompletionDates();
    });
    // Copy Public Link Button
    if (this.btnCopyPublicUrl) {
      this.btnCopyPublicUrl.addEventListener('click', () => {
        const profile = store.getAcademyProfile();
        const slug = profile?.slug || (this.session?.email?.includes('poulami') ? 'poulami' : (this.session?.email?.includes('prantik') ? 'prantik' : ''));
        const url = this.getPublicUrlForSlug(slug);

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link Copied!', 'Your public admissions link has been copied to your clipboard.', 'success');
          }).catch(() => {
            prompt('Copy your public website link:', url);
          });
        } else {
          prompt('Copy your public website link:', url);
        }
      });
    }

    // Personalisation Subdomain Slug Auto-Cleaner & Live URL Update
    if (this.persSubdomainSlug) {
      this.persSubdomainSlug.addEventListener('input', (e) => {
        const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        e.target.value = clean;
        if (this.persFullUrlPreview) {
          this.persFullUrlPreview.textContent = this.getPublicUrlForSlug(clean || 'slug');
        }
        if (this.btnPersonalisationPreviewLive) {
          this.btnPersonalisationPreviewLive.href = this.getPublicUrlForSlug(clean || 'slug');
        }
      });
    }

    if (this.btnPersCopyLink) {
      this.btnPersCopyLink.addEventListener('click', () => {
        const rawSlug = (this.persSubdomainSlug?.value || '').trim() || 'slug';
        const url = this.getPublicUrlForSlug(rawSlug);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            this.showToast('Link Copied!', 'Your public admissions link has been copied to clipboard.', 'success');
          }).catch(() => {
            prompt('Copy your public website link:', url);
          });
        } else {
          prompt('Copy your public website link:', url);
        }
      });
    }

    // Personalisation Section Tabs Switching
    if (this.persTabBtns) {
      this.persTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tabKey = btn.getAttribute('data-tab');
          this.switchPersonalisationTab(tabKey);
        });
      });
    }

    // Section Visibility Toggle Switches (Instant toggle & auto-save)
    if (this.sectionVisibilityCheckboxes) {
      this.sectionVisibilityCheckboxes.forEach(chk => {
        chk.addEventListener('change', async () => {
          const sectionKey = chk.getAttribute('data-section');
          const isVisible = chk.checked;
          this.updateSectionVisibilityPill(sectionKey, isVisible);

          const currentProfile = store.getAcademyProfile() || {};
          const secVis = { ...(currentProfile.sectionVisibility || {}) };
          secVis[sectionKey] = isVisible;
          const updatedProfile = {
            ...currentProfile,
            sectionVisibility: secVis,
            updatedAt: Date.now()
          };
          try {
            await store.saveAcademyProfile(updatedProfile);
            const secName = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
            this.showToast(
              isVisible ? `${secName} Section Visible` : `${secName} Section Hidden`,
              `${secName} section is now ${isVisible ? 'visible on' : 'hidden from'} your public website.`,
              'info'
            );
          } catch (err) {
            console.error('[Admin] Failed saving section visibility:', err);
          }
        });
      });
    }

    // Initialize Personalisation Image Uploaders
    this.initPersonalisationUploaders();

    if (this.btnSavePersonalisation) {
      this.btnSavePersonalisation.addEventListener('click', (e) => this.handleSavePersonalisation(e, { publish: false }));
    }

    if (this.btnPublishPersonalisation) {
      this.btnPublishPersonalisation.addEventListener('click', (e) => this.handleSavePersonalisation(e, { publish: true }));
    }

    if (this.personalisationForm) {
      this.personalisationForm.addEventListener('submit', (e) => this.handleSavePersonalisation(e, { publish: false }));
    }

    // Branding Form & Logo Uploader Handlers
    if (this.btnUploadBrandingLogo && this.brandingLogoFileInput) {
      this.btnUploadBrandingLogo.addEventListener('click', () => {
        this.brandingLogoFileInput.click();
      });
    }

    if (this.brandingLogoFileInput) {
      this.brandingLogoFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) this.handleBrandingLogoSelection(file);
      });
    }

    if (this.btnRemoveBrandingLogo) {
      this.btnRemoveBrandingLogo.addEventListener('click', () => {
        this.updateBrandingLogoPreview('');
        this.showToast('Logo Removed', 'Click "Save Changes" to save this change.', 'info');
      });
    }

    if (this.brandingLogoUrl) {
      this.brandingLogoUrl.addEventListener('input', () => {
        this.updateBrandingLogoPreview(this.brandingLogoUrl.value);
      });
    }

    if (this.brandingLogoDropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        this.brandingLogoDropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.brandingLogoDropZone.classList.add('is-dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        this.brandingLogoDropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.brandingLogoDropZone.classList.remove('is-dragover');
        });
      });

      this.brandingLogoDropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer?.files?.[0];
        if (file) {
          this.handleBrandingLogoSelection(file);
        }
      });
    }

    // Hero Photos Multi-Uploader Handlers (Up to 5 Photos)
    if (this.btnUploadHeroPhotos && this.persHeroPhotosFile) {
      this.btnUploadHeroPhotos.addEventListener('click', () => {
        if (this.heroPhotos.length >= 5) {
          this.showToast('Limit Reached', 'Maximum 5 hero banner photos can be added. Remove one to replace.', 'info');
          return;
        }
        this.persHeroPhotosFile.click();
      });
    }

    if (this.persHeroPhotosFile) {
      this.persHeroPhotosFile.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
          this.handleHeroPhotosSelection(files);
        }
        this.persHeroPhotosFile.value = '';
      });
    }

    if (this.heroPhotosDropZone) {
      ['dragenter', 'dragover'].forEach(name => {
        this.heroPhotosDropZone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.heroPhotosDropZone.classList.add('is-dragover');
        });
      });
      ['dragleave', 'drop'].forEach(name => {
        this.heroPhotosDropZone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.heroPhotosDropZone.classList.remove('is-dragover');
        });
      });
      this.heroPhotosDropZone.addEventListener('drop', (e) => {
        const files = Array.from(e.dataTransfer?.files || []);
        if (files.length > 0) {
          this.handleHeroPhotosSelection(files);
        }
      });
    }

    if (this.btnSaveBranding) {
      this.btnSaveBranding.addEventListener('click', (e) => this.handleSaveBranding(e));
    }

    if (this.brandingForm) {
      this.brandingForm.addEventListener('submit', (e) => this.handleSaveBranding(e));
    }

    if (this.btnOpenSubdomainSettings) {
      this.btnOpenSubdomainSettings.addEventListener('click', () => this.openAcademySettingsModal());
    }

    // Subdomain Slug Cleaners (lowercase, alphanumeric, hyphens only)
    if (this.settingsSubdomainSlug) {
      this.settingsSubdomainSlug.addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      });
    }
    if (this.onboardingSubdomainSlug) {
      this.onboardingSubdomainSlug.addEventListener('input', (e) => {
        e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      });
    }

    // Academy Settings Handlers
    if (this.btnEditAcademySettings) {
      this.btnEditAcademySettings.addEventListener('click', () => this.openAcademySettingsModal());
    }
    if (this.btnCloseAcademySettingsModal) {
      this.btnCloseAcademySettingsModal.addEventListener('click', () => this.closeAcademySettingsModal());
    }
    if (this.btnCancelAcademySettings) {
      this.btnCancelAcademySettings.addEventListener('click', () => this.closeAcademySettingsModal());
    }
    if (this.academySettingsForm) {
      this.academySettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const academyName = this.settingsAcademyName.value.trim();
        const ownerName = this.settingsOwnerName.value.trim();
        let slug = (this.settingsSubdomainSlug?.value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

        if (!academyName || !ownerName) {
          this.showToast('Required Fields', 'Please enter both Academy Name and Owner Name.', 'error');
          return;
        }

        const currentProfile = store.getAcademyProfile() || {};
        if (!slug) {
          slug = currentProfile.slug || (this.session?.email?.includes('poulami') ? 'poulami' : (this.session?.email?.includes('prantik') ? 'prantik' : ''));
        }

        const submitBtn = this.academySettingsForm.querySelector('button[type="submit"]');
        setButtonLoading(submitBtn, true);

        const updatedProfile = {
          ...currentProfile,
          academyName,
          ownerName,
          slug,
          updatedAt: Date.now()
        };

        try {
          await store.saveAcademyProfile(updatedProfile);

          if (this.session) {
            this.session.name = ownerName;
            localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.session));
          }

          this.closeAcademySettingsModal();
          this.render();
          this.updatePublicSiteLink();
          this.showToast('Settings Saved', `Academy details & subdomain (${slug}) updated successfully!`, 'success');
        } catch (err) {
          this.showToast('Save Failed', err.message || 'Could not update academy settings.', 'error');
        } finally {
          setButtonLoading(submitBtn, false);
        }
      });
    }

    // Onboarding Form Submit (One-Time Setup)
    if (this.onboardingForm) {
      this.onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const academyName = this.onboardingAcademyName.value.trim();
        const ownerName = this.onboardingOwnerName.value.trim();
        let slug = (this.onboardingSubdomainSlug?.value || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

        if (!academyName || !ownerName) {
          this.showToast('Required Fields', 'Please fill in both Academy Name and Owner Name.', 'error');
          return;
        }

        if (!slug) {
          slug = academyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'academy';
        }

        const isSuperAdmin = store.isSuperAdmin;
        const profile = {
          academyName,
          ownerName,
          slug,
          ownerEmail: store.ownerEmail,
          status: isSuperAdmin ? 'active' : 'pending',
          studentIdPrefix: `${slug.toUpperCase().slice(0, 4)}/`,
          requestedAt: new Date().toISOString(),
          configuredAt: Date.now()
        };
        store.tenantStatus = profile.status;
        store.saveAcademyProfile(profile);

        if (this.session) {
          this.session.name = ownerName;
          localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.session));
        }

        this.closeOnboardingModal();
        this.checkAccountStatus();
        if (profile.status === 'active') {
          this.render();
          this.updatePublicSiteLink();
          this.showToast('Setup Complete', `Welcome to ${academyName}! Your subdomain (${slug}) is live.`, 'success');
        } else {
          this.showToast('Registration Received', 'Your academy has been submitted for review. Your account is on hold pending approval.', 'info');
        }
      });
    }

    // Navigation Tab Switching
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        if (view === 'tenants' && (!store.isSuperAdmin || store.ownerEmail !== 'dasprantik76@gmail.com')) {
          return;
        }
        this.switchView(view);
        this.closeSidebar();
      });
    });

    // Hash change handler for browser back/forward
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (['dashboard', 'students', 'courses', 'batches', 'certificates', 'idcards', 'inbox', 'branding', 'personalisation', 'tenants'].includes(hash)) {
        if (hash === 'tenants' && (!store.isSuperAdmin || store.ownerEmail !== 'dasprantik76@gmail.com')) {
          this.switchView('dashboard', true);
          return;
        }
        this.switchView(hash, false);
      }
    });

    // Mobile Sidebar controls
    this.btnSidebarToggle.addEventListener('click', () => this.openSidebar());
    this.btnCloseSidebar.addEventListener('click', () => this.closeSidebar());
    this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());

    // Dashboard shortcuts
    this.btnViewInbox?.addEventListener('click', () => this.switchView('inbox'));
    if (this.btnRefreshInbox) {
      this.btnRefreshInbox.addEventListener('click', async () => {
        this.btnRefreshInbox.disabled = true;
        await store.fetchCloudData(() => this.render());
        this.btnRefreshInbox.disabled = false;
      });
    }
    
    // Authentication Code Actions
    if (this.btnGenerateNewAuthCode) {
      this.btnGenerateNewAuthCode.addEventListener('click', async () => {
        setButtonLoading(this.btnGenerateNewAuthCode, true);
        try {
          const token = await store.getOrGenerateAuthToken(true);
          this.renderAuthCode();
          this.showToast('New Code Generated', `Security OTP: ${token.code}`, 'success');
        } catch (e) {
          this.showToast('Error', 'Failed to generate new code.', 'error');
        } finally {
          setButtonLoading(this.btnGenerateNewAuthCode, false);
        }
      });
    }

    if (this.btnCopyAuthCode) {
      this.btnCopyAuthCode.addEventListener('click', () => {
        const token = store.getCachedAuthToken();
        if (!token) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(token.code).then(() => {
            this.btnCopyAuthCode.classList.add('copied');
            this.btnCopyAuthCode.innerHTML = '<i class="fa-solid fa-check"></i>';
            this.showToast('Code Copied', `${token.code} copied to clipboard!`, 'info');
            setTimeout(() => {
              this.btnCopyAuthCode.classList.remove('copied');
              this.btnCopyAuthCode.innerHTML = '<i class="fa-regular fa-copy"></i>';
            }, 2000);
          }).catch(() => {
            this.showToast('Code', `Code: ${token.code}`, 'info');
          });
        } else {
          this.showToast('Code', `Code: ${token.code}`, 'info');
        }
      });
    }

    if (this.btnLogout) {
      this.btnLogout.addEventListener('click', () => {
        this.promptConfirmation({
          title: 'Sign Out?',
          message: 'Are you sure you want to sign out of the administrator portal?',
          action: () => {
            localStorage.removeItem(STORAGE_KEYS.SESSION);
            if (window.google?.accounts?.id) {
              window.google.accounts.id.disableAutoSelect();
            }
            window.location.href = 'index.html';
          }
        });
      });
    }

    if (this.btnClearAllData) {
      this.btnClearAllData.addEventListener('click', () => {
        this.promptConfirmation({
          title: 'Clear All Data?',
          message: 'Are you sure you want to permanently clear all student records and courses? This cannot be undone.',
          action: () => {
            store.clearAllData();
            this.render();
            this.showToast('Data Cleared', 'All student and course records have been cleared.', 'info');
          }
        });
      });
    }

    // Account on Hold Actions
    if (this.btnRefreshHoldStatus) {
      this.btnRefreshHoldStatus.addEventListener('click', async () => {
        setButtonLoading(this.btnRefreshHoldStatus, true);
        try {
          await store.fetchCloudData();
          this.checkAccountStatus();
          if (store.tenantStatus === 'active') {
            this.render();
            this.showToast('Account Approved!', 'Your academy is active. Welcome to your dashboard!', 'success');
          } else {
            this.showToast('Status Checked', 'Your account is still awaiting approval.', 'info');
          }
        } catch (err) {
          this.showToast('Check Failed', 'Could not refresh status at this time.', 'error');
        } finally {
          setButtonLoading(this.btnRefreshHoldStatus, false);
        }
      });
    }

    if (this.btnHoldLogout) {
      this.btnHoldLogout.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        if (window.google?.accounts?.id) {
          window.google.accounts.id.disableAutoSelect();
        }
        window.location.href = 'index.html';
      });
    }

    // Super Admin Platform Tenants Controls
    if (this.btnRefreshTenants) {
      this.btnRefreshTenants.addEventListener('click', async () => {
        setButtonLoading(this.btnRefreshTenants, true);
        try {
          await this.loadPlatformTenants();
          this.showToast('Refreshed', 'Platform tenant list updated.', 'info');
        } finally {
          setButtonLoading(this.btnRefreshTenants, false);
        }
      });
    }

    if (this.tenantSearchQuery) {
      this.tenantSearchQuery.addEventListener('input', () => {
        this.renderTenantsTable();
      });
    }

    if (this.tenantFilterGroup) {
      this.tenantFilterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.tenant-filter-btn');
        if (!btn) return;
        this.tenantFilterGroup.querySelectorAll('.tenant-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.tenantActiveFilter = btn.dataset.filter || 'all';
        this.renderTenantsTable();
      });
    }

    // Add Buttons inside respective view toolbars
    if (this.btnAddStudent) {
      this.btnAddStudent.addEventListener('click', () => this.openStudentModal());
    }
    this.btnAddCourse.addEventListener('click', () => this.openCourseModal());

    // Student Filter & Search Handlers
    this.studentSearchInput.addEventListener('input', (e) => {
      this.studentSearchQuery = e.target.value.trim().toLowerCase();
      this.btnClearStudentSearch.style.display = this.studentSearchQuery ? 'block' : 'none';
      this.renderStudentsView();
    });

    this.btnClearStudentSearch.addEventListener('click', () => {
      this.studentSearchInput.value = '';
      this.studentSearchQuery = '';
      this.btnClearStudentSearch.style.display = 'none';
      this.renderStudentsView();
    });

    // Setup Toolbar Filter Custom Dropdowns (opens right below)
    this.setupAdminDropdown(
      this.adminStudentCourseFilterDropdown,
      this.adminStudentCourseFilterTrigger,
      this.adminStudentCourseFilterMenu,
      this.adminStudentCourseFilterDisplay,
      this.studentCourseFilter,
      (val) => {
        this.studentCourseFilterVal = val;
        this.renderStudentsView();
      }
    );

    this.setupAdminDropdown(
      this.adminStudentBatchFilterDropdown,
      this.adminStudentBatchFilterTrigger,
      this.adminStudentBatchFilterMenu,
      this.adminStudentBatchFilterDisplay,
      this.studentBatchFilter,
      (val) => {
        this.studentBatchFilterVal = val;
        this.renderStudentsView();
      }
    );

    this.setupAdminDropdown(
      this.adminStudentStatusFilterDropdown,
      this.adminStudentStatusFilterTrigger,
      this.adminStudentStatusFilterMenu,
      this.adminStudentStatusFilterDisplay,
      this.studentStatusFilter,
      (val) => {
        this.studentStatusFilterVal = val;
        if (this.adminStudentStatusFilterDropdown) {
          this.adminStudentStatusFilterDropdown.classList.toggle('is-filtered', val !== 'all');
        }
        if (this.adminStudentStatusFilterTrigger) {
          this.adminStudentStatusFilterTrigger.title = val === 'all' ? 'Filter by Status' : `Status: ${val}`;
        }
        this.renderStudentsView();
      }
    );

    this.btnResetStudentFilters.addEventListener('click', () => {
      this.studentSearchInput.value = '';
      this.studentSearchQuery = '';
      this.setAdminDropdownValue(
        this.adminStudentCourseFilterDropdown,
        this.adminStudentCourseFilterMenu,
        this.adminStudentCourseFilterDisplay,
        this.studentCourseFilter,
        'all',
        'All Courses'
      );
      this.studentCourseFilterVal = 'all';
      this.setAdminDropdownValue(
        this.adminStudentBatchFilterDropdown,
        this.adminStudentBatchFilterMenu,
        this.adminStudentBatchFilterDisplay,
        this.studentBatchFilter,
        'all',
        'All Batches'
      );
      this.studentBatchFilterVal = 'all';
      this.setAdminDropdownValue(
        this.adminStudentStatusFilterDropdown,
        this.adminStudentStatusFilterMenu,
        this.adminStudentStatusFilterDisplay,
        this.studentStatusFilter,
        'all',
        'All Statuses'
      );
      this.studentStatusFilterVal = 'all';
      if (this.adminStudentStatusFilterDropdown) {
        this.adminStudentStatusFilterDropdown.classList.remove('is-filtered');
      }
      if (this.adminStudentStatusFilterTrigger) {
        this.adminStudentStatusFilterTrigger.title = 'Filter by Status';
      }
      this.btnClearStudentSearch.style.display = 'none';
      this.renderStudentsView();
    });

    // Bulk Mark Completed Handler
    if (this.btnBulkMarkCompleted) {
      this.btnBulkMarkCompleted.addEventListener('click', () => this.handleBulkMarkCompleted());
    }

    if (this.btnStudentMoreActions && this.studentMoreActionsMenu) {
      this.btnStudentMoreActions.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !this.studentMoreActionsMenu.classList.contains('open');
        this.closeAllAdminDropdowns(this.studentMoreActionsMenu);
        this.studentMoreActionsMenu.classList.toggle('open', willOpen);
        this.btnStudentMoreActions.setAttribute('aria-expanded', String(willOpen));
      });
    }

    this.btnMoreDownloadCert?.addEventListener('click', async (e) => {
      e.stopPropagation();
      this.studentMoreActionsMenu?.classList.remove('open');
      this.btnStudentMoreActions?.setAttribute('aria-expanded', 'false');
      await this.handleMoreDownloadCertificates();
    });

    this.btnMoreChangeStatus?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.studentMoreActionsMenu?.classList.remove('open');
      this.btnStudentMoreActions?.setAttribute('aria-expanded', 'false');
      this.openBulkStatusModal();
    });

    this.btnMoreDeleteStudent?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.studentMoreActionsMenu?.classList.remove('open');
      this.btnStudentMoreActions?.setAttribute('aria-expanded', 'false');
      this.handleMoreDeleteStudents();
    });

    // Bulk Status Modal handlers
    this.btnCloseBulkStatusModal?.addEventListener('click', () => this.closeModal(this.bulkStatusModal));
    this.btnCancelBulkStatus?.addEventListener('click', () => this.closeModal(this.bulkStatusModal));
    this.bulkStatusForm?.addEventListener('submit', (e) => this.handleBulkStatusSubmit(e));
    this.setupAdminDropdown(
      this.bulkStatusDropdown,
      this.bulkStatusTrigger,
      this.bulkStatusMenu,
      this.bulkStatusDisplay,
      this.bulkStatusSelect
    );

    if (this.btnCreateBatch && this.batchActionMenu) {
      this.btnCreateBatch.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !this.batchActionMenu.classList.contains('open');
        this.closeAllAdminDropdowns(this.batchActionMenu);
        this.batchActionMenu.classList.toggle('open', willOpen);
        this.btnCreateBatch.setAttribute('aria-expanded', String(willOpen));
        if (willOpen) this.btnCreateNewBatch?.focus();
      });
    }

    this.dashboardInboxList?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-dashboard-message-id]');
      if (button) this.openInboxMessageModal(button.dataset.dashboardMessageId);
    });

    this.batchesGrid?.addEventListener('click', (e) => {
      const button = e.target.closest('[data-batch-action]');
      if (!button) return;
      const batch = store.getAllBatches().find(item => item.id === button.dataset.batchId);
      if (!batch) return;
      if (button.dataset.batchAction === 'view-students') {
        this.openBatchStudentsModal(batch.id);
      }
      if (button.dataset.batchAction === 'edit') {
        this.openEditBatchModal(batch.id);
      }
      if (button.dataset.batchAction === 'complete') {
        const batchStudentIds = (batch.studentIds || []).filter(id => store.getStudentById(id));
        this.handleBulkMarkCompleted(batch.id, batchStudentIds);
      }
      if (button.dataset.batchAction === 'download-certs') {
        this.downloadBatchCertificatesZip(batch.id);
      }
    });

    [this.btnCreateNewBatch, this.btnAddToExistingBatch].forEach((option, index) => {
      option?.addEventListener('click', async (e) => {
        e.stopPropagation();
        this.batchActionMenu?.classList.remove('open');
        this.btnCreateBatch?.setAttribute('aria-expanded', 'false');
        this.btnCreateBatch?.focus();
        if (index === 0) await this.handleCreateNewBatch();
        else await this.handleAddToExistingBatch();
      });
    });

    // Select All Checkbox Handler
    if (this.selectAllStudentsCheckbox) {
      this.selectAllStudentsCheckbox.addEventListener('change', (e) => this.handleSelectAllStudents(e.target.checked));
    }

    // Individual Student Row Checkbox Delegation
    if (this.studentsTableBody) {
      this.studentsTableBody.addEventListener('change', (e) => {
        const checkbox = e.target.closest('.student-row-checkbox');
        if (checkbox) {
          const studentId = checkbox.getAttribute('data-student-id');
          if (checkbox.checked) {
            this.selectedStudentIds.add(studentId);
          } else {
            this.selectedStudentIds.delete(studentId);
          }
          const row = checkbox.closest('tr');
          if (row) row.classList.toggle('is-selected', checkbox.checked);
          this.updateBulkActionState();
        }
      });

      this.studentsTableBody.addEventListener('click', (e) => {
        // If clicking directly on a button, link, or input (checkbox handled by change event), skip
        if (e.target.closest('button, a, select, input')) {
          return;
        }

        const row = e.target.closest('tr');
        if (!row) return;

        const checkbox = row.querySelector('.student-row-checkbox');
        if (checkbox) {
          const studentId = checkbox.getAttribute('data-student-id');
          const clickedSelectionZone = Boolean(e.target.closest('.td-checkbox-col'));
          if (!clickedSelectionZone && !e.metaKey && !e.ctrlKey) {
            this.viewStudentProfile(studentId);
            return;
          }
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          if (checkbox.checked) {
            this.selectedStudentIds.add(studentId);
          } else {
            this.selectedStudentIds.delete(studentId);
          }
          row.classList.toggle('is-selected', checkbox.checked);
          this.updateBulkActionState();
        }
      });

      // Auto-hiding and appearing scrollbar for student table
      const studentScrollContainer = this.studentsTableBody.closest('.table-responsive');
      if (studentScrollContainer) {
        let studentScrollTimeout;
        studentScrollContainer.addEventListener('scroll', () => {
          studentScrollContainer.classList.add('is-scrolling');
          clearTimeout(studentScrollTimeout);
          studentScrollTimeout = setTimeout(() => {
            studentScrollContainer.classList.remove('is-scrolling');
          }, 1000);
        }, { passive: true });
      }
    }

    // Course Search Handler
    this.courseSearchInput.addEventListener('input', (e) => {
      this.courseSearchQuery = e.target.value.trim().toLowerCase();
      this.btnClearCourseSearch.style.display = this.courseSearchQuery ? 'block' : 'none';
      this.renderCoursesView();
    });

    this.btnClearCourseSearch.addEventListener('click', () => {
      this.courseSearchInput.value = '';
      this.courseSearchQuery = '';
      this.btnClearCourseSearch.style.display = 'none';
      this.renderCoursesView();
    });

    this.btnResetCourseFilters.addEventListener('click', () => {
      this.courseSearchInput.value = '';
      this.courseSearchQuery = '';
      this.btnClearCourseSearch.style.display = 'none';
      this.renderCoursesView();
    });

    // Batch Search Handler
    if (this.batchSearchInput) {
      this.batchSearchInput.addEventListener('input', (e) => {
        this.batchSearchQuery = e.target.value.trim().toLowerCase();
        if (this.btnClearBatchSearch) {
          this.btnClearBatchSearch.style.display = this.batchSearchQuery ? 'block' : 'none';
        }
        this.renderBatchesView();
      });
    }

    if (this.btnClearBatchSearch) {
      this.btnClearBatchSearch.addEventListener('click', () => {
        if (this.batchSearchInput) this.batchSearchInput.value = '';
        this.batchSearchQuery = '';
        this.btnClearBatchSearch.style.display = 'none';
        this.renderBatchesView();
      });
    }

    this.batchStatusFilter = document.getElementById('batchStatusFilter');
    this.batchStatusDropdown = document.getElementById('batchStatusDropdown');
    this.batchStatusMenu = document.getElementById('batchStatusMenu');
    this.batchStatusDisplay = document.getElementById('batchStatusDisplay');
    this.setupAdminDropdown(
      this.batchStatusDropdown,
      document.getElementById('batchStatusTrigger'),
      this.batchStatusMenu,
      this.batchStatusDisplay,
      this.batchStatusFilter,
      () => this.renderBatchesView()
    );

    if (this.btnResetBatchFilters) {
      this.btnResetBatchFilters.addEventListener('click', () => {
        this.setAdminDropdownValue(this.batchStatusDropdown, this.batchStatusMenu,
          this.batchStatusDisplay, this.batchStatusFilter, 'all', 'All Statuses');
        if (this.batchSearchInput) this.batchSearchInput.value = '';
        this.batchSearchQuery = '';
        if (this.btnClearBatchSearch) this.btnClearBatchSearch.style.display = 'none';
        this.renderBatchesView();
      });
    }

    this.cardGridObservers = [];
    for (const viewName of ['batches', 'courses']) {
      const view = document.getElementById(`view-${viewName}`);
      const grid = view?.querySelector('.batches-grid, .courses-grid');
      if (!grid) continue;
      const prefix = viewName === 'batches' ? 'batch' : 'course';
      const sortInput = document.getElementById(`${prefix}SortValue`);
      this[`${prefix}SortInput`] = sortInput;
      const sortDisplay = document.getElementById(`${prefix}SortDisplay`);
      this.setupAdminDropdown(
        document.getElementById(`${prefix}SortDropdown`),
        document.getElementById(`${prefix}SortTrigger`),
        document.getElementById(`${prefix}SortMenu`),
        sortDisplay,
        sortInput,
        () => {
          const option = document.querySelector(`#${prefix}SortMenu .custom-select-option.selected`);
          sortDisplay.textContent = `Sort by :\u00a0${option?.textContent || 'Name (A → Z)'}`;
          if (viewName === 'batches') this.renderBatchesView();
          else this.renderCoursesView();
        }
      );
      const updateBatchSearchWidth = () => {
        // Include the reserved scrollbar gutter in the outer right spacing.
        const scrollbarWidth = grid.offsetWidth - grid.clientWidth;
        grid.style.setProperty('--batch-scrollbar-width', `${scrollbarWidth}px`);
        const styles = getComputedStyle(grid);
        const columns = styles.gridTemplateColumns.split(' ').map(parseFloat).filter(Number.isFinite);
        const width = columns.length > 1
          ? columns[0] + parseFloat(styles.columnGap) + columns[1] / 2
          : columns[0];
        if (width) view.style.setProperty('--batch-search-width', `${width}px`);
      };
      const gridResizeObserver = new ResizeObserver(updateBatchSearchWidth);
      gridResizeObserver.observe(grid);
      this.cardGridObservers.push(gridResizeObserver);
      const batchToolbar = view.querySelector('.view-header-bar');
      if (batchToolbar) {
        const toolbarResizeObserver = new ResizeObserver(() => {
          const height = batchToolbar.getBoundingClientRect().height;
          if (height > 0) {
            view.style.setProperty('--batch-toolbar-height', `${height}px`);
          }
        });
        toolbarResizeObserver.observe(batchToolbar);
        this.cardGridObservers.push(toolbarResizeObserver);
      }
      let batchScrollbarTimer;
      const updateBatchesHeaderScroll = () => {
        grid.classList.add('is-scrolling');
        clearTimeout(batchScrollbarTimer);
        batchScrollbarTimer = setTimeout(() => {
          grid.classList.remove('is-scrolling');
        }, 900);
        const isScrolled = grid.scrollTop > 2;
        view.querySelector('.view-header-bar')?.classList.toggle('is-scrolled', isScrolled);
      };
      grid.addEventListener('scroll', updateBatchesHeaderScroll, { passive: true });
    }

    // Inbox Search & Action Handlers
    if (this.inboxSearchInput) {
      this.inboxSearchInput.addEventListener('input', (e) => {
        this.inboxSearchQuery = e.target.value.trim().toLowerCase();
        if (this.btnClearInboxSearch) {
          this.btnClearInboxSearch.style.display = this.inboxSearchQuery ? 'block' : 'none';
        }
        this.renderInboxView();
      });
    }

    if (this.btnClearInboxSearch) {
      this.btnClearInboxSearch.addEventListener('click', () => {
        if (this.inboxSearchInput) this.inboxSearchInput.value = '';
        this.inboxSearchQuery = '';
        this.btnClearInboxSearch.style.display = 'none';
        this.renderInboxView();
      });
    }

    if (this.btnResetInboxSearch) {
      this.btnResetInboxSearch.addEventListener('click', () => {
        if (this.inboxSearchInput) this.inboxSearchInput.value = '';
        this.inboxSearchQuery = '';
        if (this.btnClearInboxSearch) this.btnClearInboxSearch.style.display = 'none';
        this.renderInboxView();
      });
    }

    if (this.btnMarkAllInboxRead) {
      this.btnMarkAllInboxRead.addEventListener('click', async () => {
        setButtonLoading(this.btnMarkAllInboxRead, true);
        try {
          await store.markAllMessagesRead();
          this.render();
          this.showToast('All Messages Read', 'All messages have been marked as read.', 'success');
        } catch (e) {
          this.showToast('Error', 'Failed to mark messages as read.', 'error');
        } finally {
          setButtonLoading(this.btnMarkAllInboxRead, false);
          this.btnMarkAllInboxRead.disabled = !store.getAllMessages().some(message => !message.isRead);
        }
      });
    }

    if (this.selectAllInboxCheckbox) {
      this.selectAllInboxCheckbox.addEventListener('change', () => {
        const filteredMessages = this.getFilteredInboxMessages();
        if (this.selectAllInboxCheckbox.checked) {
          filteredMessages.forEach(m => this.selectedInboxMessageIds.add(m.id));
        } else {
          filteredMessages.forEach(m => this.selectedInboxMessageIds.delete(m.id));
        }
        this.renderInboxView();
      });
    }

    if (this.inboxList) {
      this.inboxList.addEventListener('change', (e) => {
        const checkbox = e.target.closest('.inbox-row-checkbox');
        if (checkbox) {
          const messageId = checkbox.getAttribute('data-message-id');
          if (checkbox.checked) {
            this.selectedInboxMessageIds.add(messageId);
          } else {
            this.selectedInboxMessageIds.delete(messageId);
          }
          const row = checkbox.closest('.inbox-row');
          if (row) row.classList.toggle('is-selected', checkbox.checked);
          this.updateInboxBulkActionState();
        }
      });

      this.inboxList.addEventListener('click', (e) => {
        if (e.target.closest('.inbox-checkbox-hit, .inbox-row-checkbox-col, .inbox-row-checkbox')) return;
        if (e.target.closest('button, a, select')) return;
        const row = e.target.closest('.inbox-row');
        if (row) {
          const messageId = row.getAttribute('data-message-id');
          if (messageId) {
            if (e.metaKey || e.ctrlKey) {
              e.preventDefault();
              const selected = !this.selectedInboxMessageIds.has(messageId);
              if (selected) this.selectedInboxMessageIds.add(messageId);
              else this.selectedInboxMessageIds.delete(messageId);
              const checkbox = row.querySelector('.inbox-row-checkbox');
              if (checkbox) checkbox.checked = selected;
              row.classList.toggle('is-selected', selected);
              this.updateInboxBulkActionState();
              return;
            }
            this.openInboxMessageModal(messageId);
          }
        }
      });

      this.inboxList.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('.inbox-checkbox-hit, .inbox-row-checkbox-col, .inbox-row-checkbox, button, a, select')) return;
          const row = e.target.closest('.inbox-row');
          if (row) {
            e.preventDefault();
            const messageId = row.getAttribute('data-message-id');
            if (messageId) {
              this.openInboxMessageModal(messageId);
            }
          }
        }
      });
    }

    if (this.btnBulkDeleteInbox) {
      this.btnBulkDeleteInbox.addEventListener('click', () => {
        const ids = Array.from(this.selectedInboxMessageIds);
        if (ids.length === 0) return;
        this.promptConfirmation({
          title: `Delete ${ids.length} Message(s)?`,
          message: `The selected ${ids.length} message(s) will be permanently removed from your inbox.`,
          action: async () => {
            for (const id of ids) {
              await store.deleteMessage(id);
            }
            this.selectedInboxMessageIds.clear();
            this.render();
            this.showToast('Messages Deleted', `${ids.length} message(s) removed.`, 'info');
          }
        });
      });
    }

    // ID Cards Search & Action Handlers
    if (this.idCardStudentSearchInput) {
      this.idCardStudentSearchInput.addEventListener('input', (e) => {
        this.idCardSearchQuery = e.target.value.trim().toLowerCase();
        if (this.btnClearIdCardSearch) {
          this.btnClearIdCardSearch.style.display = this.idCardSearchQuery ? 'block' : 'none';
        }
        this.renderIdCardsView();
      });
    }

    if (this.btnClearIdCardSearch) {
      this.btnClearIdCardSearch.addEventListener('click', () => {
        if (this.idCardStudentSearchInput) this.idCardStudentSearchInput.value = '';
        this.idCardSearchQuery = '';
        this.btnClearIdCardSearch.style.display = 'none';
        this.renderIdCardsView();
      });
    }

    if (this.btnResetIdCardFilters) {
      this.btnResetIdCardFilters.addEventListener('click', () => {
        this.resetIdCardFilters();
      });
    }

    if (this.btnClearIdCardFilter) {
      this.btnClearIdCardFilter.addEventListener('click', () => {
        this.resetIdCardFilters();
      });
    }

    if (this.btnDownloadIdCard) {
      this.btnDownloadIdCard.addEventListener('click', () => this.downloadSelectedStudentIdCard());
    }


    if (this.idCardSelectAllCheckbox) {
      this.idCardSelectAllCheckbox.addEventListener('change', (e) => {
        this.handleSelectAllIdCards(e.target.checked);
      });
    }

    if (this.idCardStudentList) {
      this.idCardStudentList.addEventListener('change', (e) => {
        const checkbox = e.target.closest('.idcard-student-checkbox');
        if (checkbox) {
          const studentId = checkbox.getAttribute('data-student-id');
          if (studentId) {
            this.toggleIdCardStudentSelection(studentId, checkbox.checked);
          }
        }
      });

      this.idCardStudentList.addEventListener('click', (e) => {
        // If the click is on the checkbox or its label hit area, let the 'change' handler deal with it
        if (e.target.closest('.idcard-checkbox-hit, .idcard-student-checkbox')) return;
        if (e.target.closest('button, a, select')) return;
        const item = e.target.closest('.idcard-student-item');
        if (item) {
          const studentId = item.getAttribute('data-student-id');
          if (studentId) {
            if (e.metaKey || e.ctrlKey) {
              e.preventDefault();
              this.toggleIdCardStudentSelection(studentId, !this.selectedIdCardStudentIds.has(studentId));
              return;
            }
            // Soft selection: only update preview, do not change bulk selection
            this.softSelectIdCardStudent(studentId);
          }
        }
      });

      this.idCardStudentList.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('input, button, a, select')) return;
          const item = e.target.closest('.idcard-student-item');
          if (item) {
            e.preventDefault();
            const studentId = item.getAttribute('data-student-id');
            if (studentId) {
              // Keyboard nav also does soft selection
              this.softSelectIdCardStudent(studentId);
            }
          }
        }
      });
    }

    if (this.idCardCourseFilterDropdown) {
      this.setupAdminDropdown(
        this.idCardCourseFilterDropdown,
        this.idCardCourseFilterTrigger,
        this.idCardCourseFilterMenu,
        this.idCardCourseFilterDisplay,
        this.idCardCourseFilterVal,
        (val) => {
          this.idCardCourseFilterValue = val;
          this.renderIdCardsView();
        }
      );
    }

    if (this.idCardBatchFilterDropdown) {
      this.setupAdminDropdown(
        this.idCardBatchFilterDropdown,
        this.idCardBatchFilterTrigger,
        this.idCardBatchFilterMenu,
        this.idCardBatchFilterDisplay,
        this.idCardBatchFilterVal,
        (val) => {
          this.idCardBatchFilterValue = val;
          this.renderIdCardsView();
        }
      );
    }

    if (this.idCardStatusFilterDropdown) {
      this.setupAdminDropdown(
        this.idCardStatusFilterDropdown,
        this.idCardStatusFilterTrigger,
        this.idCardStatusFilterMenu,
        this.idCardStatusFilterDisplay,
        this.idCardStatusFilterVal,
        (val) => {
          this.idCardStatusFilterValue = val;
          if (this.idCardStatusFilterDropdown) {
            this.idCardStatusFilterDropdown.classList.toggle('is-filtered', val !== 'all');
          }
          if (this.idCardStatusFilterTrigger) {
            this.idCardStatusFilterTrigger.title = val === 'all' ? 'Filter by Status' : `Status: ${val}`;
          }
          this.renderIdCardsView();
        }
      );
    }

    if (this.btnAddBatch) {
      this.btnAddBatch.addEventListener('click', () => this.openCreateBatchModal());
    }

    if (this.btnEmptyCreateBatch) {
      this.btnEmptyCreateBatch.addEventListener('click', () => this.openCreateBatchModal());
    }

    if (this.createBatchStudentSearch) {
      this.createBatchStudentSearch.addEventListener('input', (e) => {
        this.createBatchSearchQuery = e.target.value.trim().toLowerCase();
        this.renderCreateBatchStudentList();
      });
    }

    if (this.createBatchStudentList) {
      this.createBatchStudentList.addEventListener('change', (e) => {
        const checkbox = e.target.closest('.create-batch-student-checkbox');
        if (checkbox) {
          const studentId = checkbox.dataset.studentId;
          if (checkbox.checked) {
            this.createBatchSelectedStudentIds.add(studentId);
          } else {
            this.createBatchSelectedStudentIds.delete(studentId);
          }
          if (this.createBatchSelectionCount) {
            this.createBatchSelectionCount.textContent = `${this.createBatchSelectedStudentIds.size} selected`;
          }
        }
      });
    }

    // Setup Admin Student Form Custom Dropdowns (opens right below)
    this.setupAdminDropdown(this.adminStudentGenderDropdown, this.adminStudentGenderTrigger, this.adminStudentGenderMenu, this.adminStudentGenderDisplay, this.studentGenderInput);
    this.setupAdminDropdown(this.adminStudentMaritalStatusDropdown, this.adminStudentMaritalStatusTrigger, this.adminStudentMaritalStatusMenu, this.adminStudentMaritalStatusDisplay, this.studentMaritalStatusInput);
    this.setupAdminDropdown(this.adminStudentCategoryDropdown, this.adminStudentCategoryTrigger, this.adminStudentCategoryMenu, this.adminStudentCategoryDisplay, this.studentCategoryInput);
    this.setupAdminDropdown(this.adminStudentReligionDropdown, this.adminStudentReligionTrigger, this.adminStudentReligionMenu, this.adminStudentReligionDisplay, this.studentReligionInput);
    this.initAdminStateAndDistrictDropdowns();
    this.setupAdminDropdown(this.adminStudentQualificationDropdown, this.adminStudentQualificationTrigger, this.adminStudentQualificationMenu, this.adminStudentQualificationDisplay, this.studentQualificationInput);
    this.setupAdminDropdown(this.adminStudentCourseDropdown, this.adminStudentCourseTrigger, this.adminStudentCourseMenu, this.adminStudentCourseDisplay, this.studentCourseInput);
    this.setupAdminDropdown(this.adminStudentStatusDropdown, this.adminStudentStatusTrigger, this.adminStudentStatusMenu, this.adminStudentStatusDisplay, this.studentStatusSelect);

    // Auto Capitalization of Name Initials Everywhere
    applyAutoCapitalization(this.studentNameInput);
    applyAutoCapitalization(this.studentFatherNameInput);
    applyAutoCapitalization(this.studentMotherNameInput);
    applyAutoCapitalization(this.settingsAcademyName);
    applyAutoCapitalization(this.settingsOwnerName);
    applyAutoCapitalization(this.onboardingAcademyName);
    applyAutoCapitalization(this.onboardingOwnerName);

    // Strict 12-digit Aadhar Validation
    setupAadharInputValidation(this.studentAadharInput, this.studentAadharError);

    // Strict 10-digit Mobile Number Validation
    setupPhoneInputValidation(this.studentPhoneInput, this.studentPhoneError);

    // Strict 6-digit Pin Code Validation
    setupPinCodeInputValidation(this.studentPinCodeInput, this.studentPinCodeError);

    // Date inputs has-value styling
    if (this.studentDobInput) {
      ['input', 'change'].forEach(evt => {
        this.studentDobInput.addEventListener(evt, () => {
          this.studentDobInput.classList.toggle('has-value', Boolean(this.studentDobInput.value));
        });
      });
    }

    // Custom Duration Unit Dropdown Toggle & Selection
    if (this.durationUnitTrigger) {
      this.durationUnitTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAllAdminDropdowns(this.durationUnitDropdown);
        const isOpen = this.durationUnitDropdown.classList.toggle('open');
        this.durationUnitTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    if (this.durationUnitMenu) {
      this.durationUnitMenu.querySelectorAll('.custom-select-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = option.getAttribute('data-value');
          this.setDurationUnit(val);
          this.durationUnitDropdown.classList.remove('open');
          this.durationUnitTrigger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Close all custom dropdowns when clicking anywhere else in the document
    document.addEventListener('click', (e) => {
      this.closeAllAdminDropdowns();
    });

    window.addEventListener('resize', () => {
      if (this.portaledMenu) this.closeAllAdminDropdowns();
    }, { passive: true });

    window.addEventListener('scroll', () => {
      if (this.portaledMenu) this.closeAllAdminDropdowns();
    }, { passive: true });

    document.querySelectorAll('.modal-body, .table-responsive').forEach(el => {
      el.addEventListener('scroll', () => {
        if (this.portaledMenu) this.closeAllAdminDropdowns();
      }, { passive: true });
    });

    // Form Submissions
    this.studentForm.addEventListener('submit', (e) => this.handleStudentFormSubmit(e));
    this.courseForm.addEventListener('submit', (e) => this.handleCourseFormSubmit(e));

    // Student Photo Upload Events
    this.studentPhotoInput?.addEventListener('change', () => this.handleStudentPhotoSelection());
    this.btnClearStudentPhoto?.addEventListener('click', () => this.clearStudentPhoto());
    this.studentNameInput?.addEventListener('input', () => {
      if (!this.selectedStudentPhotoFile && !this.studentPhotoUrl?.value) {
        if (this.studentPhotoPreviewInitials) {
          const initials = getInitials(this.studentNameInput.value.trim()) || 'SP';
          this.studentPhotoPreviewInitials.textContent = initials;
        }
      }
    });

    // Modal Close Buttons
    this.btnCloseStudentModal.addEventListener('click', () => this.closeModal(this.studentModal));
    this.btnCancelStudentModal.addEventListener('click', () => this.closeModal(this.studentModal));
    this.btnDeleteStudentModal?.addEventListener('click', () => {
      const studentId = this.studentIdInput.value;
      if (!studentId) return;
      this.closeModal(this.studentModal);
      this.confirmDeleteStudent(studentId);
    });

    this.btnCloseCourseModal.addEventListener('click', () => this.closeModal(this.courseModal));
    this.btnCancelCourseModal.addEventListener('click', () => this.closeModal(this.courseModal));

    this.btnCloseDetailsModal.addEventListener('click', () => this.closeModal(this.studentDetailsModal));
    this.btnEditFromDetails.addEventListener('click', () => {
      this.closeModal(this.studentDetailsModal);
      if (this.currentViewingStudentId) {
        this.openStudentModal(this.currentViewingStudentId);
      }
    });
    this.btnDeleteStudentFromDetails?.addEventListener('click', () => {
      const studentId = this.currentViewingStudentId;
      if (!studentId) return;
      this.closeModal(this.studentDetailsModal);
      this.confirmDeleteStudent(studentId);
    });

    ['input', 'change'].forEach(event => this.completionIssueDate.addEventListener(event, () => this.validateCompletionDates()));
    this.completionForm.addEventListener('submit', (e) => this.handleCompletionSubmit(e));
    [this.completionStartMonth, this.completionStartYear, this.completionEndMonth, this.completionEndYear]
      .forEach(select => select.addEventListener('change', () => this.validateCompletionPeriodSelection()));
    this.btnCloseCompletionModal.addEventListener('click', () => this.closeModal(this.completionModal));
    this.btnCancelCompletion.addEventListener('click', () => this.closeModal(this.completionModal));
    this.btnCloseBatchModal?.addEventListener('click', () => this.closeModal(this.batchModal));
    this.btnCancelBatchModal?.addEventListener('click', () => this.closeModal(this.batchModal));
    this.batchForm?.addEventListener('submit', (e) => this.handleBatchFormSubmit(e));
    this.setupAdminDropdown(
      this.existingBatchDropdown,
      this.existingBatchTrigger,
      this.existingBatchMenu,
      this.existingBatchDisplay,
      this.existingBatchSelect,
      () => this.existingBatchTrigger.classList.remove('input-error')
    );
    this.btnCloseEditBatchModal?.addEventListener('click', () => this.closeModal(this.editBatchModal));
    this.btnCancelEditBatch?.addEventListener('click', () => this.closeModal(this.editBatchModal));
    this.btnDeleteBatch?.addEventListener('click', () => {
      const batchId = this.editingBatchId;
      const batch = store.getAllBatches().find(item => item.id === batchId);
      if (!batch) return;
      this.promptConfirmation({
        title: 'Delete Batch?',
        message: `Are you sure you want to delete the batch "${batch.name}"? This action cannot be undone.`,
        action: async () => {
          this.closeModal(this.editBatchModal);
          await store.deleteBatch(batchId);
          this.render();
          this.showToast('Batch Deleted', `Batch "${batch.name}" has been deleted.`, 'info');
        }
      });
    });
    this.editBatchForm?.addEventListener('submit', (e) => this.handleEditBatchSubmit(e));
    this.setupAdminDropdown(
      this.editBatchStatusDropdown,
      this.editBatchStatusTrigger,
      this.editBatchStatusMenu,
      this.editBatchStatusDisplay,
      this.editBatchStatus
    );
    this.editBatchStudentSearch?.addEventListener('input', (e) => {
      this.editBatchSearchQuery = e.target.value.trim().toLowerCase();
      this.renderEditBatchStudentList();
    });
    this.editBatchStudentList?.addEventListener('change', (e) => {
      const checkbox = e.target.closest('.batch-edit-student-checkbox');
      if (!checkbox) return;
      if (checkbox.checked) this.editingBatchStudentIds.add(checkbox.dataset.studentId);
      else this.editingBatchStudentIds.delete(checkbox.dataset.studentId);
      this.renderEditBatchStudentList();
    });

    this.btnCloseConfirmModal.addEventListener('click', () => this.closeModal(this.confirmModal));
    this.btnCancelConfirm.addEventListener('click', () => this.closeModal(this.confirmModal));

    if (this.btnCloseInboxMessageModal) {
      this.btnCloseInboxMessageModal.addEventListener('click', () => this.closeModal(this.inboxMessageModal));
    }
    if (this.btnCloseInboxMessageModalBtn) {
      this.btnCloseInboxMessageModalBtn.addEventListener('click', () => this.closeModal(this.inboxMessageModal));
    }
    this.btnExecuteConfirm.addEventListener('click', async () => {
      if (typeof this.confirmCallback === 'function') {
        setButtonLoading(this.btnExecuteConfirm, true);
        try {
          await this.confirmCallback();
        } catch (e) {
          console.error('[Confirm Callback Error]:', e);
        } finally {
          setButtonLoading(this.btnExecuteConfirm, false);
        }
      }
      this.closeModal(this.confirmModal);
    });

    // Escape closes dialogs through the shared cleanup path.
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const openDialogs = document.querySelectorAll('.modal-backdrop.open');
      if (!openDialogs.length) return;
      e.preventDefault();
      openDialogs.forEach(dialog => this.closeModal(dialog));
    });

    // Keyboard shortcut: Cmd+D (Mac) / Ctrl+D (Windows) to deselect all selections
    window.addEventListener('keydown', (e) => {
      const isCmdOrCtrl = (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey;
      const isKeyD = e.key === 'd' || e.key === 'D' || e.code === 'KeyD';

      if (isCmdOrCtrl && isKeyD) {
        // If a modal dialog is open, do not deselect
        if (document.querySelector('.modal-backdrop.open')) return;

        const isStudentsPage = this.currentView === 'students' ||
          Boolean(document.getElementById('view-students')?.classList.contains('active'));

        const isIdCardsPage = this.currentView === 'idcards' ||
          Boolean(document.getElementById('view-idcards')?.classList.contains('active'));

        const isInboxPage = this.currentView === 'inbox' ||
          Boolean(document.getElementById('view-inbox')?.classList.contains('active'));

        if (this.currentView === 'certificates') {
          e.preventDefault();
          this.selectedCertificateIds?.clear();
          this.certificatePreviewCleared = true;
          this.certificatePreviewId = null;
          this.renderCertificatesView();
          return;
        }

        if (isStudentsPage) {
          e.preventDefault();
          this.deselectAllStudents();
        } else if (isIdCardsPage) {
          e.preventDefault();
          this.selectedIdCardStudentIds.clear();
          this.idCardPreviewCleared = true;
          this.lastSelectedIdCardStudentId = null;
          this.updateIdCardSelectionUI();
        } else if (isInboxPage) {
          e.preventDefault();
          this.deselectAllMessages();
        }
      }
    });
  }

  setDurationUnit(unit) {
    const cleanUnit = (unit === 'Years' || unit === 'Year') ? 'Years' : 'Months';
    if (this.courseDurationUnitInput) {
      this.courseDurationUnitInput.value = cleanUnit;
    }
    if (this.durationUnitDisplay) {
      this.durationUnitDisplay.textContent = cleanUnit;
    }
    if (this.durationUnitDropdown) {
      this.durationUnitDropdown.classList.add('has-value');
    }
    if (this.durationUnitTrigger) {
      this.durationUnitTrigger.classList.add('has-value');
    }
    if (this.durationUnitMenu) {
      this.durationUnitMenu.querySelectorAll('.custom-select-option').forEach(opt => {
        const isSelected = opt.getAttribute('data-value') === cleanUnit;
        opt.classList.toggle('selected', isSelected);
        opt.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
    }
  }

  openSidebar() {
    this.sidebar.classList.add('open');
    this.sidebarOverlay.classList.add('active');
  }

  closeSidebar() {
    this.sidebar.classList.remove('open');
    this.sidebarOverlay.classList.remove('active');
  }

  applyViewLayout(viewName) {
    if (viewName === 'tenants' && (!store.isSuperAdmin || store.ownerEmail !== 'dasprantik76@gmail.com')) {
      this.switchView('dashboard', true);
      return;
    }
    this.updateSuperAdminState();

    this.navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.views.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    const headerConfig = {
      dashboard: {
        icon: '<i class="fa-solid fa-chart-pie"></i>',
        theme: 'theme-dashboard',
        title: 'Dashboard Overview',
        subtitle: 'Monitor key metrics, student enrollments, and recent activity'
      },
      students: {
        icon: '<i class="fa-solid fa-user-graduate"></i>',
        theme: 'theme-dashboard',
        title: 'Student Management',
        subtitle: 'Register, track progress, and manage enrolled learners'
      },
      courses: {
        icon: '<i class="fa-solid fa-desktop"></i>',
        theme: 'theme-dashboard',
        title: 'Course Management',
        subtitle: 'Curate academy courses, durations, and syllabus details'
      },
      batches: {
        icon: '<i class="fa-solid fa-layer-group"></i>',
        theme: 'theme-dashboard',
        title: 'Batch Management',
        subtitle: 'Organize students and process batch certificates'
      },
      idcards: {
        icon: '<i class="fa-solid fa-id-card"></i>',
        theme: 'theme-dashboard',
        title: 'Student ID Cards',
        subtitle: 'Generate, preview, and print official student identity cards'
      },
      inbox: {
        icon: '<svg viewBox="0 0 512 512" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M 237.5 43.0 L 238.0 42.5 L 273.0 42.5 L 274.0 43.5 L 283.0 43.5 L 284.0 44.5 L 290.0 44.5 L 291.0 45.5 L 295.0 45.5 L 296.0 46.5 L 300.0 46.5 L 301.0 47.5 L 305.0 47.5 L 306.0 48.5 L 309.0 48.5 L 310.0 49.5 L 312.0 49.5 L 313.0 50.5 L 316.0 50.5 L 317.0 51.5 L 319.0 51.5 L 320.0 52.5 L 322.0 52.5 L 323.0 53.5 L 325.0 53.5 L 326.0 54.5 L 331.0 55.5 L 334.0 57.5 L 336.0 57.5 L 341.0 60.5 L 343.0 60.5 L 359.0 68.5 L 361.0 70.5 L 366.0 72.5 L 368.0 74.5 L 369.0 74.5 L 371.0 76.5 L 372.0 76.5 L 374.0 78.5 L 378.0 80.5 L 381.0 83.5 L 385.0 85.5 L 396.0 95.5 L 397.0 95.5 L 415.5 114.0 L 415.5 115.0 L 421.5 121.0 L 421.5 122.0 L 430.5 133.0 L 430.5 134.0 L 438.5 145.0 L 440.5 150.0 L 442.5 152.0 L 450.5 168.0 L 450.5 170.0 L 453.5 175.0 L 453.5 177.0 L 455.5 180.0 L 455.5 182.0 L 456.5 183.0 L 456.5 185.0 L 457.5 186.0 L 457.5 188.0 L 458.5 189.0 L 458.5 191.0 L 460.5 195.0 L 460.5 198.0 L 462.5 202.0 L 462.5 206.0 L 463.5 207.0 L 463.5 210.0 L 464.5 211.0 L 465.5 220.0 L 466.5 221.0 L 466.5 228.0 L 467.5 229.0 L 467.5 237.0 L 468.5 238.0 L 468.5 273.0 L 467.5 274.0 L 467.5 282.0 L 466.5 283.0 L 466.5 290.0 L 465.5 291.0 L 464.5 300.0 L 463.5 301.0 L 463.5 304.0 L 462.5 305.0 L 462.5 309.0 L 460.5 313.0 L 460.5 316.0 L 459.5 317.0 L 459.5 319.0 L 458.5 320.0 L 458.5 322.0 L 457.5 323.0 L 457.5 325.0 L 456.5 326.0 L 455.5 331.0 L 450.5 341.0 L 450.5 343.0 L 442.5 359.0 L 440.5 361.0 L 436.5 369.0 L 434.5 371.0 L 434.5 372.0 L 432.5 374.0 L 430.5 378.0 L 427.5 381.0 L 427.5 382.0 L 424.5 385.0 L 424.5 386.0 L 421.5 389.0 L 421.5 390.0 L 415.5 396.0 L 415.5 397.0 L 397.0 415.5 L 396.0 415.5 L 390.0 421.5 L 389.0 421.5 L 378.0 430.5 L 377.0 430.5 L 369.0 436.5 L 366.0 437.5 L 364.0 439.5 L 361.0 440.5 L 359.0 442.5 L 343.0 450.5 L 341.0 450.5 L 336.0 453.5 L 334.0 453.5 L 331.0 455.5 L 329.0 455.5 L 328.0 456.5 L 326.0 456.5 L 325.0 457.5 L 323.0 457.5 L 322.0 458.5 L 320.0 458.5 L 316.0 460.5 L 313.0 460.5 L 309.0 462.5 L 306.0 462.5 L 305.0 463.5 L 301.0 463.5 L 300.0 464.5 L 296.0 464.5 L 295.0 465.5 L 291.0 465.5 L 290.0 466.5 L 284.0 466.5 L 283.0 467.5 L 274.0 467.5 L 273.0 468.5 L 75.0 468.5 L 74.0 467.5 L 69.0 466.5 L 65.0 463.5 L 64.0 463.5 L 61.0 460.5 L 60.0 460.5 L 54.5 454.0 L 51.5 448.0 L 51.5 446.0 L 50.5 445.0 L 50.5 440.0 L 49.5 439.0 L 49.5 434.0 L 50.5 433.0 L 50.5 429.0 L 51.5 428.0 L 51.5 426.0 L 53.5 423.0 L 53.5 421.0 L 60.5 408.0 L 60.5 406.0 L 67.5 393.0 L 67.5 391.0 L 73.5 379.0 L 73.5 368.0 L 72.5 367.0 L 72.5 365.0 L 70.5 361.0 L 68.5 359.0 L 60.5 343.0 L 60.5 341.0 L 57.5 336.0 L 57.5 334.0 L 55.5 331.0 L 55.5 329.0 L 54.5 328.0 L 54.5 326.0 L 53.5 325.0 L 53.5 323.0 L 52.5 322.0 L 52.5 320.0 L 50.5 316.0 L 50.5 313.0 L 49.5 312.0 L 49.5 310.0 L 48.5 309.0 L 48.5 306.0 L 47.5 305.0 L 47.5 301.0 L 46.5 300.0 L 45.5 291.0 L 44.5 290.0 L 44.5 284.0 L 43.5 283.0 L 43.5 275.0 L 42.5 274.0 L 42.5 238.0 L 43.5 237.0 L 43.5 228.0 L 44.5 227.0 L 44.5 221.0 L 45.5 220.0 L 45.5 216.0 L 46.5 215.0 L 47.5 206.0 L 48.5 205.0 L 48.5 202.0 L 50.5 198.0 L 50.5 195.0 L 51.5 194.0 L 51.5 192.0 L 52.5 191.0 L 52.5 189.0 L 53.5 188.0 L 53.5 186.0 L 54.5 185.0 L 55.5 180.0 L 57.5 177.0 L 57.5 175.0 L 60.5 170.0 L 60.5 168.0 L 68.5 152.0 L 70.5 150.0 L 72.5 145.0 L 74.5 143.0 L 74.5 142.0 L 76.5 140.0 L 76.5 139.0 L 78.5 137.0 L 80.5 133.0 L 83.5 130.0 L 85.5 126.0 L 95.5 115.0 L 95.5 114.0 L 114.0 95.5 L 115.0 95.5 L 121.0 89.5 L 122.0 89.5 L 133.0 80.5 L 134.0 80.5 L 145.0 72.5 L 150.0 70.5 L 152.0 68.5 L 168.0 60.5 L 170.0 60.5 L 180.0 55.5 L 182.0 55.5 L 183.0 54.5 L 185.0 54.5 L 186.0 53.5 L 188.0 53.5 L 189.0 52.5 L 191.0 52.5 L 195.0 50.5 L 198.0 50.5 L 202.0 48.5 L 206.0 48.5 L 207.0 47.5 L 210.0 47.5 L 211.0 46.5 L 215.0 46.5 L 216.0 45.5 L 220.0 45.5 L 221.0 44.5 L 228.0 44.5 L 229.0 43.5 L 237.0 43.5 L 237.5 43.0 Z M 191.5 192 h 43 a 20.5 20.5 0 0 1 20.5 20.5 a 20.5 20.5 0 0 1 -20.5 20.5 h -43 a 20.5 20.5 0 0 1 -20.5 -20.5 a 20.5 20.5 0 0 1 20.5 -20.5 Z M 191.5 278 h 128 a 20.5 20.5 0 0 1 20.5 20.5 a 20.5 20.5 0 0 1 -20.5 20.5 h -128 a 20.5 20.5 0 0 1 -20.5 -20.5 a 20.5 20.5 0 0 1 20.5 -20.5 Z"/></svg>',
        theme: 'theme-dashboard',
        title: 'Inbox',
        subtitle: 'Messages received from your public website'
      },
      branding: {
        icon: '<i class="fa-solid fa-palette"></i>',
        theme: 'theme-dashboard',
        title: 'Academy Branding',
        subtitle: 'Update your official academy brand name, logo, phone, and email address'
      },
      certificates: { icon: '<i class="fa-solid fa-certificate"></i>', theme: 'theme-dashboard', title: 'Student Certificates', subtitle: 'Preview and download certificates for completed students' },
      personalisation: {
        icon: '<i class="fa-solid fa-sliders"></i>',
        theme: 'theme-dashboard',
        title: 'Personalisation',
        subtitle: 'Customize your public website branding and settings'
      },
      tenants: {
        icon: '<i class="fa-solid fa-shield-halved"></i>',
        theme: 'theme-dashboard',
        title: 'Platform Tenants & Approvals',
        subtitle: 'Review registrations, approve tenant academies, and monitor live subdomains'
      }
    };

    const config = headerConfig[viewName] || headerConfig.dashboard;
    if (this.pageTitle) this.pageTitle.textContent = config.title;
    if (this.pageSubtitle) this.pageSubtitle.textContent = config.subtitle;
    if (this.pageTitleIcon) {
      this.pageTitleIcon.className = `page-title-icon ${config.theme}`;
      this.pageTitleIcon.innerHTML = config.icon;
    }
  }

  switchView(viewName, updateHash = true) {
    if (viewName === 'tenants' && (!store.isSuperAdmin || store.ownerEmail !== 'dasprantik76@gmail.com')) {
      viewName = 'dashboard';
    }
    this.currentView = viewName;
    if (updateHash) {
      window.location.hash = viewName;
    }

    this.applyViewLayout(viewName);
    this.render();
    if (viewName === 'batches' || viewName === 'courses') {
      const view = document.getElementById(`view-${viewName}`);
      const grid = view?.querySelector('.batches-grid, .courses-grid');
      view?.querySelector('.view-header-bar')?.classList.toggle('is-scrolled', (grid?.scrollTop || 0) > 2);
    }
    if (viewName === 'branding') {
      this.populateBrandingForm();
    }
    if (viewName === 'personalisation') {
      this.populatePersonalisationForm();
    }
    if (viewName === 'tenants' && store.isSuperAdmin && store.ownerEmail === 'dasprantik76@gmail.com') {
      this.loadPlatformTenants();
    }
    store.fetchCloudData(() => {
      this.render();
      if (this.currentView === 'branding') {
        this.populateBrandingForm();
      }
      if (this.currentView === 'personalisation') {
        this.populatePersonalisationForm();
      }
      if (viewName === 'tenants' && store.isSuperAdmin && store.ownerEmail === 'dasprantik76@gmail.com') {
        this.loadPlatformTenants();
      }
    });
  }

  switchPersonalisationTab(tabKey) {
    if (!this.persTabBtns || !this.persTabPanes) return;
    this.persTabBtns.forEach(btn => {
      const match = btn.getAttribute('data-tab') === tabKey;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });
    this.persTabPanes.forEach(pane => {
      const paneId = `tab-pane-${tabKey}`;
      pane.classList.toggle('active', pane.id === paneId);
    });
  }

  updateImgPreview(input, imgElem, placeholderElem) {
    if (!input || !imgElem) return;
    const url = (input.value || '').trim();
    if (url) {
      imgElem.src = url;
      imgElem.onload = () => {
        imgElem.style.display = 'block';
        if (placeholderElem) placeholderElem.style.display = 'none';
      };
      imgElem.onerror = () => {
        imgElem.style.display = 'none';
        if (placeholderElem) {
          placeholderElem.style.display = 'block';
          placeholderElem.innerHTML = '<span style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> Image failed to load</span>';
        }
      };
    } else {
      imgElem.style.display = 'none';
      if (placeholderElem) {
        placeholderElem.style.display = 'block';
      }
    }
  }

  renderGalleryPreview() {
    this.renderGalleryPhotosGrid();
  }

  updateSectionVisibilityPill(sectionKey, isVisible) {
    const capitalized = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
    const pill = document.getElementById(`pillVisibility${capitalized}`);
    if (!pill) return;
    if (isVisible) {
      pill.className = 'visibility-pill is-visible';
      pill.innerHTML = '<span class="visibility-dot"></span><span class="visibility-state-text">Visible</span>';
    } else {
      pill.className = 'visibility-pill is-hidden';
      pill.innerHTML = '<span class="visibility-dot"></span><span class="visibility-state-text">Hidden</span>';
    }
  }

  populatePersonalisationForm() {
    const profile = store.getAcademyProfile() || {};
    const defaultSlug = this.session?.email?.includes('poulami')
      ? 'poulami'
      : (this.session?.email?.includes('diganta') ? 'diganta' : (this.session?.email?.includes('prantik') ? 'diganta' : (this.session?.email ? this.session.email.split('@')[0].replace(/[^a-z0-9]/g, '') : 'diganta')));
    const slug = profile.slug || defaultSlug;

    // Tab 1: Hero Section & Public Address
    if (this.persSubdomainSlug) this.persSubdomainSlug.value = slug;
    if (this.persFullUrlPreview) this.persFullUrlPreview.textContent = this.getPublicUrlForSlug(slug);
    if (this.btnPersonalisationPreviewLive) this.btnPersonalisationPreviewLive.href = this.getPublicUrlForSlug(slug);

    if (this.persAcademyName) this.persAcademyName.value = profile.academyName || '';
    if (this.persCategory) this.persCategory.value = profile.category || '';
    if (this.persHeroTitle1) this.persHeroTitle1.value = profile.heroTitleLine1 || '';
    if (this.persHeroTitle2) this.persHeroTitle2.value = profile.heroTitleLine2 || '';
    if (this.persHeroTagline) this.persHeroTagline.value = profile.tagline || 'Student Registration';
    if (this.persOwnerName) this.persOwnerName.value = profile.ownerName || this.session?.name || '';
    if (this.persHeroDesc) this.persHeroDesc.value = (profile.heroDesc !== undefined && profile.heroDesc !== null) ? profile.heroDesc : '';
    if (Array.isArray(profile.heroPhotos)) {
      this.heroPhotos = profile.heroPhotos.filter(Boolean).slice(0, 5);
    } else {
      const legacy = [profile.heroImg1, profile.heroImg2].filter(Boolean);
      this.heroPhotos = legacy.slice(0, 5);
    }
    this.renderHeroPhotosGrid();

    // Tab 2: Top Notice Bar & Badge Banner
    if (this.persNotice1) this.persNotice1.value = profile.notice1Text || '';
    if (this.persNotice2) this.persNotice2.value = profile.notice2Text || '';
    if (this.persNotice3) this.persNotice3.value = profile.notice3Text || '';
    if (this.persBannerPhone) this.persBannerPhone.value = profile.bannerPhone || profile.phone || '';
    if (this.persBannerTagline) this.persBannerTagline.value = profile.bannerTagline || 'Building Skills. Creating Futures.';
    if (this.persEstYear) this.persEstYear.value = profile.estYear || '2005';

    // Tab 3: About Us & Academy Story
    if (this.persAboutHeadline) this.persAboutHeadline.value = profile.aboutHeadline || `Quality technical education, practical skills, and trusted training since ${profile.estYear || '2005'}.`;
    if (this.persAboutDirector) this.persAboutDirector.value = profile.aboutDirector || (profile.ownerName ? `Supervised & Directed by ${profile.ownerName}` : '');
    if (this.persAboutStory) this.persAboutStory.value = profile.aboutStory || profile.about || 'Premier professional training academy offering certified courses with modern practical laboratory sessions.';
    if (this.persAboutStoryImg) {
      this.persAboutStoryImg.value = profile.aboutStoryImg || '';
      this.updateAboutStoryPreview(this.persAboutStoryImg.value);
    }

    // Highlights
    const highlights = Array.isArray(profile.aboutHighlights) ? profile.aboutHighlights : [];
    if (this.persHighlight1) this.persHighlight1.value = highlights[0] || 'ISO 9001:2015 Certified Institute';
    if (this.persHighlight2) this.persHighlight2.value = highlights[1] || '100% Practical Hands-on Labs';
    if (this.persHighlight3) this.persHighlight3.value = highlights[2] || 'Recognized Government & Industry Certifications';
    if (this.persHighlight4) this.persHighlight4.value = highlights[3] || 'Comprehensive Career Guidance & Placement Assistance';

    // Tab 4: Accreditations & Brand Logos
    if (this.persLogoUrl) {
      this.persLogoUrl.value = profile.logoUrl || '';
      this.updatePersLogoPreview(this.persLogoUrl.value);
    }
    if (this.persFaviconUrl) {
      this.persFaviconUrl.value = profile.faviconUrl || '';
      this.updatePersFaviconPreview(this.persFaviconUrl.value);
    }
    if (this.persSignatureUrl) {
      this.persSignatureUrl.value = profile.signatureUrl || '';
      this.updatePersSignaturePreview(this.persSignatureUrl.value);
    }
    const accr = Array.isArray(profile.accreditationUrls)
      ? profile.accreditationUrls
      : (typeof profile.accreditationUrls === 'string' && profile.accreditationUrls ? profile.accreditationUrls.split('\n').map(u => u.trim()).filter(Boolean) : []);
    this.accreditationLogos = [...accr];
    if (this.persAccreditationUrls) {
      this.persAccreditationUrls.value = this.accreditationLogos.join('\n');
    }
    this.renderAccreditationLogosGrid();

    // Tab 5: Gallery Photos
    if (this.persGalleryHeading) this.persGalleryHeading.value = profile.galleryHeading || 'Our Students';
    if (this.persGallerySubtitle) this.persGallerySubtitle.value = profile.gallerySubtitle || 'A glimpse into our classrooms, practical sessions, and student learning experiences.';
    const gallery = Array.isArray(profile.galleryUrls)
      ? profile.galleryUrls
      : (typeof profile.galleryUrls === 'string' && profile.galleryUrls ? profile.galleryUrls.split('\n').map(u => u.trim()).filter(Boolean) : []);
    this.galleryPhotos = [...gallery];
    if (this.persGalleryUrls) {
      this.persGalleryUrls.value = this.galleryPhotos.join('\n');
    }
    this.renderGalleryPhotosGrid();

    // Tab 6: Contact & Location
    if (this.persPhone) this.persPhone.value = profile.phone || '';
    if (this.persSecondaryPhone) this.persSecondaryPhone.value = profile.secondaryPhone || profile.whatsapp || '';
    if (this.persEmail) this.persEmail.value = profile.email || this.session?.email || '';
    if (this.persBranch1) this.persBranch1.value = profile.branch1 || '';
    if (this.persBranch2) this.persBranch2.value = profile.branch2 || '';
    if (this.persAddress) this.persAddress.value = profile.address || '';
    if (this.persPinCode) this.persPinCode.value = profile.pincode || '';
    if (this.persMapUrl) this.persMapUrl.value = profile.mapUrl || '';

    // Tab 7: Connect & Social Channels
    const socials = profile.socials || {};
    if (this.persSocialWhatsapp) this.persSocialWhatsapp.value = socials.whatsapp || profile.whatsapp || profile.secondaryPhone || '';
    if (this.persSocialFacebook) this.persSocialFacebook.value = socials.facebook || profile.facebook || '';
    if (this.persSocialInstagram) this.persSocialInstagram.value = socials.instagram || profile.instagram || '';
    if (this.persSocialYoutube) this.persSocialYoutube.value = socials.youtube || profile.youtube || '';
    if (this.persSocialLinkedin) this.persSocialLinkedin.value = socials.linkedin || profile.linkedin || '';
    if (this.persSocialTwitter) this.persSocialTwitter.value = socials.twitter || profile.twitter || '';

    // Tab 8: Footer & Copyright
    if (this.persFooterBio) this.persFooterBio.value = profile.footerBio || 'Practical computer education, professional guidance and certified skills for a brighter digital future.';
    if (this.persFooterProof) this.persFooterProof.value = profile.footerProof || 'Trusted learning since 2005';
    if (this.persFooterCopyright) this.persFooterCopyright.value = profile.footerCopyright || `© 2026 ${profile.academyName || 'Academy'}. All rights reserved.`;

    // Populate Section Visibility Toggles (default true)
    const visibility = profile.sectionVisibility || {};
    const sectionKeys = ['hero', 'banner', 'about', 'accreditations', 'gallery', 'contact', 'socials', 'footer'];
    sectionKeys.forEach(sec => {
      const isVisible = visibility[sec] !== false;
      const capitalized = sec.charAt(0).toUpperCase() + sec.slice(1);
      const checkbox = document.getElementById(`toggleVisibility${capitalized}`);
      if (checkbox) {
        checkbox.checked = isVisible;
      }
      this.updateSectionVisibilityPill(sec, isVisible);
    });
  }

  async handleSavePersonalisation(e, options = { publish: false }) {
    if (e) e.preventDefault();

    const isPublish = !!(options && options.publish);
    const activeBtn = isPublish ? this.btnPublishPersonalisation : this.btnSavePersonalisation;

    const existingProfile = store.getAcademyProfile() || {};
    const rawSlug = this.persSubdomainSlug 
      ? (this.persSubdomainSlug.value || '').trim() 
      : (existingProfile.slug || '');
    const sanitizedSlug = rawSlug 
      ? (rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '') || existingProfile.slug || 'nyce')
      : (existingProfile.slug || 'nyce');
    if (this.persSubdomainSlug && !sanitizedSlug) {
      this.showToast('Invalid Subdomain', 'Please provide a valid subdomain (e.g. prantik, my-academy).', 'error');
      this.switchPersonalisationTab('hero');
      this.persSubdomainSlug?.focus();
      return;
    }

    const academyName = this.persAcademyName 
      ? this.persAcademyName.value.trim() 
      : (existingProfile.academyName || '');
    if (this.persAcademyName && !academyName) {
      this.showToast('Required Field', 'Please enter your Academy Brand Name.', 'error');
      this.switchPersonalisationTab('hero');
      this.persAcademyName?.focus();
      return;
    }

    const highlights = [
      this.persHighlight1?.value.trim(),
      this.persHighlight2?.value.trim(),
      this.persHighlight3?.value.trim(),
      this.persHighlight4?.value.trim()
    ].filter(Boolean);

    const galleryUrls = Array.isArray(this.galleryPhotos)
      ? this.galleryPhotos
      : (this.persGalleryUrls?.value || '')
          .split('\n')
          .map(u => u.trim())
          .filter(Boolean);

    const accreditationUrls = Array.isArray(this.accreditationLogos)
      ? this.accreditationLogos
      : (this.persAccreditationUrls?.value || '')
          .split('\n')
          .map(u => u.trim())
          .filter(Boolean);

    const socials = {
      facebook: this.persSocialFacebook?.value.trim() || '',
      instagram: this.persSocialInstagram?.value.trim() || '',
      youtube: this.persSocialYoutube?.value.trim() || '',
      whatsapp: this.persSocialWhatsapp?.value.trim() || '',
      linkedin: this.persSocialLinkedin?.value.trim() || '',
      twitter: this.persSocialTwitter?.value.trim() || ''
    };

    if (activeBtn) setButtonLoading(activeBtn, true);
    if (this.btnSavePersonalisation && this.btnSavePersonalisation !== activeBtn) {
      this.btnSavePersonalisation.disabled = true;
    }
    if (this.btnPublishPersonalisation && this.btnPublishPersonalisation !== activeBtn) {
      this.btnPublishPersonalisation.disabled = true;
    }

    const updatedProfile = {
      ...existingProfile,
      slug: sanitizedSlug,
      academyName: academyName || existingProfile.academyName || '',
      category: this.persCategory ? this.persCategory.value.trim() : (existingProfile.category || ''),
      heroTitleLine1: this.persHeroTitle1?.value.trim() || '',
      heroTitleLine2: this.persHeroTitle2?.value.trim() || '',
      tagline: this.persHeroTagline ? (this.persHeroTagline.value.trim() || 'Student Registration') : (existingProfile.tagline || 'Student Registration'),
      ownerName: this.persOwnerName?.value.trim() || existingProfile.ownerName || this.tenantProfile?.ownerName || this.session?.name || '',
      heroDesc: this.persHeroDesc?.value.trim() || '',
      heroPhotos: Array.isArray(this.heroPhotos) ? this.heroPhotos.slice(0, 5) : [],
      heroImg1: (this.heroPhotos && this.heroPhotos[0]) || this.persHeroImg1?.value.trim() || '',
      heroImg2: (this.heroPhotos && this.heroPhotos[1]) || this.persHeroImg2?.value.trim() || '',
      notice1Text: this.persNotice1?.value.trim() || '',
      notice2Text: this.persNotice2?.value.trim() || '',
      notice3Text: this.persNotice3?.value.trim() || '',
      bannerPhone: this.persBannerPhone?.value.trim() || '',
      bannerTagline: this.persBannerTagline?.value.trim() || '',
      estYear: this.persEstYear?.value.trim() || '',
      aboutHeadline: this.persAboutHeadline?.value.trim() || '',
      aboutDirector: this.persAboutDirector?.value.trim() || '',
      aboutStory: this.persAboutStory?.value.trim() || '',
      aboutStoryImg: this.persAboutStoryImg?.value.trim() || '',
      about: this.persAboutStory?.value.trim() || '',
      aboutHighlights: highlights,
      logoUrl: this.persLogoUrl?.value.trim() || '',
      faviconUrl: this.persFaviconUrl?.value.trim() || '',
      signatureUrl: this.persSignatureUrl?.value.trim() || '',
      accreditationUrls: accreditationUrls,
      galleryHeading: this.persGalleryHeading?.value.trim() || '',
      gallerySubtitle: this.persGallerySubtitle?.value.trim() || '',
      galleryUrls: galleryUrls,
      phone: this.persPhone?.value.trim() || '',
      secondaryPhone: this.persSecondaryPhone?.value.trim() || '',
      whatsapp: this.persSocialWhatsapp?.value.trim() || this.persSecondaryPhone?.value.trim() || '',
      email: this.persEmail?.value.trim() || '',
      branch1: this.persBranch1?.value.trim() || '',
      branch2: this.persBranch2?.value.trim() || '',
      address: this.persAddress?.value.trim() || '',
      pincode: this.persPinCode?.value.trim() || '',
      mapUrl: this.persMapUrl?.value.trim() || '',
      socials: socials,
      footerBio: this.persFooterBio?.value.trim() || '',
      footerProof: this.persFooterProof?.value.trim() || '',
      footerCopyright: this.persFooterCopyright?.value.trim() || '',
      sectionVisibility: {
        hero: this.toggleVisibilityHero ? this.toggleVisibilityHero.checked : (store.getAcademyProfile()?.sectionVisibility?.hero !== false),
        banner: this.toggleVisibilityBanner ? this.toggleVisibilityBanner.checked : (store.getAcademyProfile()?.sectionVisibility?.banner !== false),
        about: this.toggleVisibilityAbout ? this.toggleVisibilityAbout.checked : (store.getAcademyProfile()?.sectionVisibility?.about !== false),
        accreditations: this.toggleVisibilityAccreditations ? this.toggleVisibilityAccreditations.checked : (store.getAcademyProfile()?.sectionVisibility?.accreditations !== false),
        gallery: this.toggleVisibilityGallery ? this.toggleVisibilityGallery.checked : (store.getAcademyProfile()?.sectionVisibility?.gallery !== false),
        contact: this.toggleVisibilityContact ? this.toggleVisibilityContact.checked : (store.getAcademyProfile()?.sectionVisibility?.contact !== false),
        socials: this.toggleVisibilitySocials ? this.toggleVisibilitySocials.checked : (store.getAcademyProfile()?.sectionVisibility?.socials !== false),
        footer: this.toggleVisibilityFooter ? this.toggleVisibilityFooter.checked : (store.getAcademyProfile()?.sectionVisibility?.footer !== false)
      },
      isPublished: isPublish ? true : (store.getAcademyProfile()?.isPublished ?? true),
      publishedAt: isPublish ? Date.now() : (store.getAcademyProfile()?.publishedAt || null),
      updatedAt: Date.now()
    };

    try {
      await store.saveAcademyProfile(updatedProfile);
      this.updatePublicSiteLink();
      this.populatePersonalisationForm();
      if (this.populateBrandingForm) {
        this.populateBrandingForm();
      }
      this.render();

      if (isPublish) {
        const publicUrl = this.getPublicUrlForSlug(sanitizedSlug);
        this.showToast('Published Live!', `Your academy website is now live at ${sanitizedSlug}.`, 'success');
        try {
          window.open(publicUrl, '_blank');
        } catch (_) {}
      } else {
        this.showToast('Changes Saved', 'Your personalisation details have been saved.', 'success');
      }
    } catch (err) {
      this.showToast('Save Failed', err.message || 'Could not update academy profile.', 'error');
    } finally {
      if (activeBtn) setButtonLoading(activeBtn, false);
      if (this.btnSavePersonalisation) this.btnSavePersonalisation.disabled = false;
      if (this.btnPublishPersonalisation) this.btnPublishPersonalisation.disabled = false;
    }
  }

  populateBrandingForm() {
    const profile = store.getAcademyProfile() || {};
    if (this.brandingAcademyName) this.brandingAcademyName.value = profile.academyName || '';
    if (this.brandingPhone) this.brandingPhone.value = profile.phone || profile.bannerPhone || '';
    if (this.brandingEmail) this.brandingEmail.value = profile.email || this.session?.email || '';
    const logo = profile.logoUrl || '';
    if (this.brandingLogoUrl) this.brandingLogoUrl.value = logo;
    this.updateBrandingLogoPreview(logo);
  }

  updateBrandingLogoPreview(url) {
    const cleanUrl = (url || '').trim();
    if (this.brandingLogoImg && this.brandingLogoPlaceholder) {
      if (cleanUrl) {
        this.brandingLogoImg.src = cleanUrl;
        this.brandingLogoImg.style.display = 'block';
        this.brandingLogoPlaceholder.style.display = 'none';
        if (this.btnRemoveBrandingLogo) this.btnRemoveBrandingLogo.style.display = 'inline-flex';
      } else {
        this.brandingLogoImg.src = '';
        this.brandingLogoImg.style.display = 'none';
        this.brandingLogoPlaceholder.style.display = 'block';
        if (this.btnRemoveBrandingLogo) this.btnRemoveBrandingLogo.style.display = 'none';
        if (this.brandingLogoFileInput) this.brandingLogoFileInput.value = '';
        if (this.brandingLogoUrl) this.brandingLogoUrl.value = '';
      }
    }
  }

  handleBrandingLogoSelection(file) {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      this.showToast('Invalid File', 'Please select a valid image file (PNG, JPG, SVG, WebP).', 'error');
      if (this.brandingLogoFileInput) this.brandingLogoFileInput.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('File Too Large', 'Logo image must be smaller than 5 MB.', 'error');
      if (this.brandingLogoFileInput) this.brandingLogoFileInput.value = '';
      return;
    }

    // Direct read for SVG or small images (under 250 KB) to preserve original crisp vector/transparency quality
    if (file.type === 'image/svg+xml' || file.size <= 250 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result;
        if (this.brandingLogoUrl) this.brandingLogoUrl.value = dataUrl;
        this.updateBrandingLogoPreview(dataUrl);
        this.showToast('Logo Selected', 'Logo preview updated. Click "Save Changes" to save.', 'info');
      };
      reader.onerror = () => {
        this.showToast('Error', 'Could not read the selected image file.', 'error');
      };
      reader.readAsDataURL(file);
      return;
    }

    // For larger images, resize and optimize via canvas to keep data URL compact and responsive
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 512;
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      let dataUrl = '';
      try {
        dataUrl = canvas.toDataURL('image/webp', 0.88);
        if (!dataUrl || dataUrl.indexOf('data:image/webp') !== 0) {
          dataUrl = canvas.toDataURL('image/png');
        }
      } catch (_) {
        dataUrl = canvas.toDataURL('image/png');
      }

      if (this.brandingLogoUrl) this.brandingLogoUrl.value = dataUrl;
      this.updateBrandingLogoPreview(dataUrl);
      this.showToast('Logo Selected', 'Logo preview updated. Click "Save Changes" to save.', 'info');
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      this.showToast('Error', 'Failed to load image preview.', 'error');
    };
    img.src = objectUrl;
  }

  renderHeroPhotosGrid() {
    if (!this.heroPhotosGrid) return;
    const count = this.heroPhotos.length;

    // Update count badge
    if (this.heroPhotosCountBadge) {
      if (count === 0) {
        this.heroPhotosCountBadge.textContent = '0 / 5 Photos';
        this.heroPhotosCountBadge.style.background = 'var(--surface-muted)';
        this.heroPhotosCountBadge.style.color = 'var(--text-secondary)';
      } else if (count === 1) {
        this.heroPhotosCountBadge.textContent = '1 / 5 Photo (Static)';
        this.heroPhotosCountBadge.style.background = '#e0f2fe';
        this.heroPhotosCountBadge.style.color = '#0369a1';
      } else {
        this.heroPhotosCountBadge.textContent = `${count} / 5 Photos (${count} Loop Dissolve)`;
        this.heroPhotosCountBadge.style.background = '#dcfce7';
        this.heroPhotosCountBadge.style.color = '#15803d';
      }
    }

    // Update prompt text
    if (this.heroUploadPromptText) {
      if (count >= 5) {
        this.heroUploadPromptText.textContent = 'Maximum 5 photos added (slideshow loop ready)';
      } else {
        this.heroUploadPromptText.textContent = `Click or Drag & Drop to add photos (Max 5, ${5 - count} remaining)`;
      }
    }

    // Update disable state on upload button
    if (this.btnUploadHeroPhotos) {
      this.btnUploadHeroPhotos.disabled = count >= 5;
    }
    if (this.btnAddHeroPhotoUrl) {
      this.btnAddHeroPhotoUrl.disabled = count >= 5;
    }

    // Render cards HTML
    let html = '';
    this.heroPhotos.forEach((url, idx) => {
      html += `
        <div class="hero-photo-card" data-index="${idx}">
          <img src="${escapeHtml(url)}" alt="Hero Photo ${idx + 1}" onerror="this.src=''; this.alt='Failed to load';">
          <span class="hero-photo-badge">Slide ${idx + 1}</span>
          <button type="button" class="hero-photo-replace-btn" title="Replace photo ${idx + 1}" data-replace-index="${idx}">
            <i class="fa-solid fa-arrows-rotate"></i>
          </button>
          <button type="button" class="hero-photo-remove-btn" title="Remove photo ${idx + 1}" data-remove-index="${idx}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    const remainingSlots = 5 - count;
    for (let i = 0; i < remainingSlots; i++) {
      const slotNum = count + i + 1;
      html += `
        <div class="hero-photo-add-slot" data-slot-index="${count + i}" title="Click to add photo ${slotNum}">
          <i class="fa-solid fa-plus"></i>
          <span>Add Photo</span>
        </div>
      `;
    }

    this.heroPhotosGrid.innerHTML = html;

    // Attach click to add slots
    this.heroPhotosGrid.querySelectorAll('.hero-photo-add-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        if (this.heroPhotos.length >= 5) {
          this.showToast('Limit Reached', 'Maximum 5 photos allowed.', 'info');
          return;
        }
        if (this.persHeroPhotosFile) {
          this.persHeroPhotosFile.click();
        }
      });
    });

    // Attach click to replace buttons
    this.heroPhotosGrid.querySelectorAll('.hero-photo-replace-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const replaceIdx = parseInt(btn.getAttribute('data-replace-index'), 10);
        if (!isNaN(replaceIdx)) {
          this.replaceHeroPhoto(replaceIdx);
        }
      });
    });

    // Attach click to remove buttons
    this.heroPhotosGrid.querySelectorAll('.hero-photo-remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const removeIdx = parseInt(btn.getAttribute('data-remove-index'), 10);
        if (!isNaN(removeIdx)) {
          this.removeHeroPhoto(removeIdx);
        }
      });
    });

    // Sync legacy hidden inputs
    if (this.persHeroImg1) this.persHeroImg1.value = this.heroPhotos[0] || '';
    if (this.persHeroImg2) this.persHeroImg2.value = this.heroPhotos[1] || '';
  }

  replaceHeroPhoto(index) {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/*';
    tempInput.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type || !file.type.startsWith('image/')) {
        this.showToast('Invalid File', `${file.name} is not a valid image.`, 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('File Too Large', `${file.name} exceeds the 5MB size limit.`, 'error');
        return;
      }
      try {
        const dataUrl = await this.readAndCompressImage(file);
        if (dataUrl) {
          this.heroPhotos[index] = dataUrl;
          this.renderHeroPhotosGrid();
          this.showToast('Photo Replaced', `Replaced slide photo ${index + 1}. Remember to save changes.`, 'success');
        }
      } catch (err) {
        console.error('Failed replacing photo:', err);
      }
    };
    tempInput.click();
  }

  removeHeroPhoto(index) {
    if (index >= 0 && index < this.heroPhotos.length) {
      this.heroPhotos.splice(index, 1);
      this.renderHeroPhotosGrid();
      this.showToast('Photo Removed', `Removed slide photo ${index + 1}. Remember to save changes.`, 'info');
    }
  }

  async handleHeroPhotosSelection(files) {
    if (!files || files.length === 0) return;
    const availableSlots = 5 - this.heroPhotos.length;
    if (availableSlots <= 0) {
      this.showToast('Limit Reached', 'Maximum 5 hero banner photos reached. Remove one before adding more.', 'info');
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      this.showToast('Limit Notice', `Only ${availableSlots} more photo(s) can be added (max 5). Processing first ${availableSlots}.`, 'info');
    }

    let addedCount = 0;
    for (const file of filesToProcess) {
      if (!file.type || !file.type.startsWith('image/')) {
        this.showToast('Invalid File', `${file.name} is not a valid image.`, 'error');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('File Too Large', `${file.name} exceeds the 5MB size limit.`, 'error');
        continue;
      }

      try {
        const dataUrl = await this.readAndCompressImage(file);
        if (dataUrl && this.heroPhotos.length < 5) {
          this.heroPhotos.push(dataUrl);
          addedCount++;
        }
      } catch (err) {
        console.error('Failed to read image:', err);
        this.showToast('Upload Error', `Could not process image ${file.name}.`, 'error');
      }
    }

    if (addedCount > 0) {
      this.renderHeroPhotosGrid();
      this.showToast('Photos Added', `Hero photos updated (${this.heroPhotos.length}/5). Remember to save changes.`, 'success');
    }
  }

  readAndCompressImage(file) {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml' || file.size <= 250 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 1280;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', 0.85);
          if (!dataUrl || dataUrl.indexOf('data:image/webp') !== 0) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
        } catch (_) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }
        resolve(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image into element'));
      };
      img.src = objectUrl;
    });
  }

  updateHeroPhotoPreview(index, url) {
    // Stub kept for compatibility
  }

  setupSinglePhotoUploader({ dropZone, fileInput, uploadBtn, removeBtn, hiddenInput, updatePreviewFn, labelName }) {
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
    }
    if (fileInput) {
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        fileInput.value = '';
        if (!file.type || !file.type.startsWith('image/')) {
          this.showToast('Invalid File', `${file.name} is not a valid image.`, 'error');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.showToast('File Too Large', `${file.name} exceeds the 5MB limit.`, 'error');
          return;
        }
        try {
          const dataUrl = await this.readAndCompressImage(file);
          if (dataUrl) {
            if (hiddenInput) hiddenInput.value = dataUrl;
            if (updatePreviewFn) updatePreviewFn(dataUrl);
            this.showToast('Photo Uploaded', `${labelName} uploaded. Click "Save Changes" to save.`, 'info');
          }
        } catch (err) {
          console.error(`Failed uploading ${labelName}:`, err);
          this.showToast('Upload Failed', `Could not process ${file.name}.`, 'error');
        }
      });
    }
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (hiddenInput) hiddenInput.value = '';
        if (updatePreviewFn) updatePreviewFn('');
        this.showToast('Photo Removed', `${labelName} removed. Click "Save Changes" to save.`, 'info');
      });
    }
    if (dropZone && fileInput) {
      ['dragenter', 'dragover'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('is-dragover');
        });
      });
      ['dragleave', 'drop'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('is-dragover');
        });
      });
      dropZone.addEventListener('drop', async (e) => {
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        if (!file.type || !file.type.startsWith('image/')) {
          this.showToast('Invalid File', `${file.name} is not an image.`, 'error');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.showToast('File Too Large', `${file.name} exceeds the 5MB limit.`, 'error');
          return;
        }
        try {
          const dataUrl = await this.readAndCompressImage(file);
          if (dataUrl) {
            if (hiddenInput) hiddenInput.value = dataUrl;
            if (updatePreviewFn) updatePreviewFn(dataUrl);
            this.showToast('Photo Uploaded', `${labelName} uploaded. Click "Save Changes" to save.`, 'info');
          }
        } catch (err) {
          console.error(`Failed uploading ${labelName}:`, err);
          this.showToast('Upload Failed', `Could not process ${file.name}.`, 'error');
        }
      });
    }
  }

  setupMultiPhotoDropZone(dropZone, fileInput, handlerFn) {
    if (!dropZone) return;
    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('is-dragover');
      });
    });
    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('is-dragover');
      });
    });
    dropZone.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer?.files || []);
      if (files.length > 0 && handlerFn) {
        handlerFn(files);
      }
    });
  }

  initPersonalisationUploaders() {
    // 1. About Story Photo Uploader
    this.setupSinglePhotoUploader({
      dropZone: this.aboutStoryDropZone,
      fileInput: this.persAboutStoryImgFile,
      uploadBtn: this.btnUploadAboutStoryImg,
      removeBtn: this.btnRemoveAboutStoryImg,
      hiddenInput: this.persAboutStoryImg,
      updatePreviewFn: (url) => this.updateAboutStoryPreview(url),
      labelName: 'About Story Photo'
    });

    // 2. Main Logo Uploader
    this.setupSinglePhotoUploader({
      dropZone: this.logoDropZone,
      fileInput: this.persLogoFile,
      uploadBtn: this.btnUploadLogo,
      removeBtn: this.btnRemoveLogo,
      hiddenInput: this.persLogoUrl,
      updatePreviewFn: (url) => this.updatePersLogoPreview(url),
      labelName: 'Academy Logo'
    });

    // 3. Favicon Uploader
    this.setupSinglePhotoUploader({
      dropZone: this.faviconDropZone,
      fileInput: this.persFaviconFile,
      uploadBtn: this.btnUploadFavicon,
      removeBtn: this.btnRemoveFavicon,
      hiddenInput: this.persFaviconUrl,
      updatePreviewFn: (url) => this.updatePersFaviconPreview(url),
      labelName: 'Browser Favicon'
    });

    // 4. Signature Uploader
    this.setupSinglePhotoUploader({
      dropZone: this.signatureDropZone,
      fileInput: this.persSignatureFile,
      uploadBtn: this.btnUploadSignature,
      removeBtn: this.btnRemoveSignature,
      hiddenInput: this.persSignatureUrl,
      updatePreviewFn: (url) => this.updatePersSignaturePreview(url),
      labelName: 'Director Signature'
    });

    // 5. Accreditation Logos Multi-Uploader
    if (this.btnUploadAccreditations && this.persAccreditationsFile) {
      this.btnUploadAccreditations.addEventListener('click', () => {
        this.persAccreditationsFile.click();
      });
    }
    if (this.persAccreditationsFile) {
      this.persAccreditationsFile.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) this.handleAccreditationFilesSelection(files);
        this.persAccreditationsFile.value = '';
      });
    }
    this.setupMultiPhotoDropZone(this.accreditationsDropZone, this.persAccreditationsFile, (files) => {
      this.handleAccreditationFilesSelection(files);
    });

    // 6. Gallery Photos Multi-Uploader
    if (this.btnUploadGalleryPhotos && this.persGalleryFiles) {
      this.btnUploadGalleryPhotos.addEventListener('click', () => {
        this.persGalleryFiles.click();
      });
    }
    if (this.persGalleryFiles) {
      this.persGalleryFiles.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) this.handleGalleryFilesSelection(files);
        this.persGalleryFiles.value = '';
      });
    }
    this.setupMultiPhotoDropZone(this.galleryDropZone, this.persGalleryFiles, (files) => {
      this.handleGalleryFilesSelection(files);
    });

    // Initial render of Hero Photo Slots (5 slots)
    this.renderHeroPhotosGrid();
  }

  updateAboutStoryPreview(url) {
    const clean = (url || '').trim();
    if (this.persAboutStoryPreviewImg && this.persAboutStoryPlaceholder) {
      if (clean) {
        this.persAboutStoryPreviewImg.src = clean;
        this.persAboutStoryPreviewImg.style.display = 'block';
        this.persAboutStoryPlaceholder.style.display = 'none';
        if (this.btnRemoveAboutStoryImg) this.btnRemoveAboutStoryImg.style.display = 'inline-flex';
      } else {
        this.persAboutStoryPreviewImg.src = '';
        this.persAboutStoryPreviewImg.style.display = 'none';
        this.persAboutStoryPlaceholder.style.display = 'flex';
        if (this.btnRemoveAboutStoryImg) this.btnRemoveAboutStoryImg.style.display = 'none';
      }
    }
  }

  updatePersLogoPreview(url) {
    const clean = (url || '').trim();
    if (this.persLogoPreviewImg && this.persLogoPreviewPlaceholder) {
      if (clean) {
        this.persLogoPreviewImg.src = clean;
        this.persLogoPreviewImg.style.display = 'block';
        this.persLogoPreviewPlaceholder.style.display = 'none';
        if (this.btnRemoveLogo) this.btnRemoveLogo.style.display = 'inline-flex';
      } else {
        this.persLogoPreviewImg.src = '';
        this.persLogoPreviewImg.style.display = 'none';
        this.persLogoPreviewPlaceholder.style.display = 'flex';
        if (this.btnRemoveLogo) this.btnRemoveLogo.style.display = 'none';
      }
    }
  }

  updatePersFaviconPreview(url) {
    const clean = (url || '').trim();
    if (this.persFaviconPreviewImg && this.persFaviconPreviewPlaceholder) {
      if (clean) {
        this.persFaviconPreviewImg.src = clean;
        this.persFaviconPreviewImg.style.display = 'block';
        this.persFaviconPreviewPlaceholder.style.display = 'none';
        if (this.btnRemoveFavicon) this.btnRemoveFavicon.style.display = 'inline-flex';
      } else {
        this.persFaviconPreviewImg.src = '';
        this.persFaviconPreviewImg.style.display = 'none';
        this.persFaviconPreviewPlaceholder.style.display = 'flex';
        if (this.btnRemoveFavicon) this.btnRemoveFavicon.style.display = 'none';
      }
    }
  }

  updatePersSignaturePreview(url) {
    const clean = (url || '').trim();
    if (this.persSignaturePreviewImg && this.persSignaturePreviewPlaceholder) {
      if (clean) {
        this.persSignaturePreviewImg.src = clean;
        this.persSignaturePreviewImg.style.display = 'block';
        this.persSignaturePreviewPlaceholder.style.display = 'none';
        if (this.btnRemoveSignature) this.btnRemoveSignature.style.display = 'inline-flex';
      } else {
        this.persSignaturePreviewImg.src = '';
        this.persSignaturePreviewImg.style.display = 'none';
        this.persSignaturePreviewPlaceholder.style.display = 'flex';
        if (this.btnRemoveSignature) this.btnRemoveSignature.style.display = 'none';
      }
    }
  }

  renderAccreditationLogosGrid() {
    if (!this.persAccreditationsGrid) return;
    const count = this.accreditationLogos.length;
    if (this.accreditationsCountBadge) {
      this.accreditationsCountBadge.textContent = `${count} Logo${count === 1 ? '' : 's'} Uploaded`;
      if (count > 0) {
        this.accreditationsCountBadge.style.background = '#e0f2fe';
        this.accreditationsCountBadge.style.color = '#0369a1';
      } else {
        this.accreditationsCountBadge.style.background = 'var(--surface-muted)';
        this.accreditationsCountBadge.style.color = 'var(--text-secondary)';
      }
    }

    let html = '';
    this.accreditationLogos.forEach((url, idx) => {
      html += `
        <div class="accreditation-logo-card" data-index="${idx}">
          <img src="${escapeHtml(url)}" alt="Accreditation Logo ${idx + 1}" onerror="this.src=''; this.alt='Failed to load';">
          <button type="button" class="grid-photo-remove-btn" title="Remove logo ${idx + 1}" data-remove-accreditation="${idx}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    html += `
      <div class="grid-photo-add-slot" id="accreditationAddSlot" title="Click to add another accreditation logo">
        <i class="fa-solid fa-plus"></i>
        <span>Add Logo</span>
      </div>
    `;

    this.persAccreditationsGrid.innerHTML = html;

    const addSlot = this.persAccreditationsGrid.querySelector('#accreditationAddSlot');
    if (addSlot && this.persAccreditationsFile) {
      addSlot.addEventListener('click', () => {
        this.persAccreditationsFile.click();
      });
    }

    this.persAccreditationsGrid.querySelectorAll('[data-remove-accreditation]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-remove-accreditation'), 10);
        if (!isNaN(idx)) this.removeAccreditationLogo(idx);
      });
    });

    if (this.persAccreditationUrls) {
      this.persAccreditationUrls.value = this.accreditationLogos.join('\n');
    }
  }

  removeAccreditationLogo(index) {
    if (index >= 0 && index < this.accreditationLogos.length) {
      this.accreditationLogos.splice(index, 1);
      this.renderAccreditationLogosGrid();
      this.showToast('Logo Removed', `Accreditation logo ${index + 1} removed. Click "Save Changes" to save.`, 'info');
    }
  }

  async handleAccreditationFilesSelection(files) {
    if (!files || files.length === 0) return;
    let added = 0;
    for (const file of files) {
      if (!file.type || !file.type.startsWith('image/')) {
        this.showToast('Invalid File', `${file.name} is not a valid image.`, 'error');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('File Too Large', `${file.name} exceeds 5MB size limit.`, 'error');
        continue;
      }
      try {
        const dataUrl = await this.readAndCompressImage(file);
        if (dataUrl) {
          this.accreditationLogos.push(dataUrl);
          added++;
        }
      } catch (err) {
        console.error('Failed to read logo image:', err);
        this.showToast('Upload Error', `Could not process ${file.name}.`, 'error');
      }
    }
    if (added > 0) {
      this.renderAccreditationLogosGrid();
      this.showToast('Logos Added', `Added ${added} accreditation logo(s). Click "Save Changes" to save.`, 'success');
    }
  }

  renderGalleryPhotosGrid() {
    if (!this.persGalleryGrid) return;
    const count = this.galleryPhotos.length;
    if (this.galleryCountBadge) {
      this.galleryCountBadge.textContent = `${count} Photo${count === 1 ? '' : 's'} Uploaded`;
      if (count > 0) {
        this.galleryCountBadge.style.background = '#e0f2fe';
        this.galleryCountBadge.style.color = '#0369a1';
      } else {
        this.galleryCountBadge.style.background = 'var(--surface-muted)';
        this.galleryCountBadge.style.color = 'var(--text-secondary)';
      }
    }

    let html = '';
    this.galleryPhotos.forEach((url, idx) => {
      html += `
        <div class="gallery-photo-card" data-index="${idx}">
          <img src="${escapeHtml(url)}" alt="Gallery Photo ${idx + 1}" onerror="this.src=''; this.alt='Failed to load';">
          <button type="button" class="grid-photo-remove-btn" title="Remove photo ${idx + 1}" data-remove-gallery="${idx}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    html += `
      <div class="grid-photo-add-slot" id="galleryAddSlot" title="Click to add another gallery photo">
        <i class="fa-solid fa-plus"></i>
        <span>Add Photo</span>
      </div>
    `;

    this.persGalleryGrid.innerHTML = html;

    const addSlot = this.persGalleryGrid.querySelector('#galleryAddSlot');
    if (addSlot && this.persGalleryFiles) {
      addSlot.addEventListener('click', () => {
        this.persGalleryFiles.click();
      });
    }

    this.persGalleryGrid.querySelectorAll('[data-remove-gallery]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-remove-gallery'), 10);
        if (!isNaN(idx)) this.removeGalleryPhoto(idx);
      });
    });

    if (this.persGalleryUrls) {
      this.persGalleryUrls.value = this.galleryPhotos.join('\n');
    }
  }

  removeGalleryPhoto(index) {
    if (index >= 0 && index < this.galleryPhotos.length) {
      this.galleryPhotos.splice(index, 1);
      this.renderGalleryPhotosGrid();
      this.showToast('Photo Removed', `Gallery photo ${index + 1} removed. Click "Save Changes" to save.`, 'info');
    }
  }

  async handleGalleryFilesSelection(files) {
    if (!files || files.length === 0) return;
    let added = 0;
    for (const file of files) {
      if (!file.type || !file.type.startsWith('image/')) {
        this.showToast('Invalid File', `${file.name} is not a valid image.`, 'error');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('File Too Large', `${file.name} exceeds 5MB size limit.`, 'error');
        continue;
      }
      try {
        const dataUrl = await this.readAndCompressImage(file);
        if (dataUrl) {
          this.galleryPhotos.push(dataUrl);
          added++;
        }
      } catch (err) {
        console.error('Failed to read gallery photo:', err);
        this.showToast('Upload Error', `Could not process ${file.name}.`, 'error');
      }
    }
    if (added > 0) {
      this.renderGalleryPhotosGrid();
      this.showToast('Photos Added', `Added ${added} gallery photo(s). Click "Save Changes" to save.`, 'success');
    }
  }

  async handleSaveBranding(e) {
    if (e) e.preventDefault();
    const academyName = (this.brandingAcademyName?.value || '').trim();
    if (!academyName) {
      this.showToast('Required Field', 'Please enter your Academy Brand Name.', 'error');
      this.brandingAcademyName?.focus();
      return;
    }
    const phone = (this.brandingPhone?.value || '').trim();
    if (!phone) {
      this.showToast('Required Field', 'Please enter a Primary Phone Number.', 'error');
      this.brandingPhone?.focus();
      return;
    }
    const email = (this.brandingEmail?.value || '').trim();
    if (!email) {
      this.showToast('Required Field', 'Please enter an Official Email Address.', 'error');
      this.brandingEmail?.focus();
      return;
    }

    const logoUrl = (this.brandingLogoUrl?.value || '').trim();
    const existing = store.getAcademyProfile() || {};

    const updatedProfile = {
      ...existing,
      academyName,
      phone,
      email,
      logoUrl,
      bannerPhone: existing.bannerPhone && existing.bannerPhone !== existing.phone ? existing.bannerPhone : phone,
      updatedAt: Date.now()
    };

    if (this.btnSaveBranding) setButtonLoading(this.btnSaveBranding, true);

    try {
      await store.saveAcademyProfile(updatedProfile);
      this.renderUserProfile();
      this.populateBrandingForm();
      if (this.populatePersonalisationForm) {
        this.populatePersonalisationForm();
      }
      this.updatePublicSiteLink();
      this.render();
      this.showToast('Branding Saved', 'Academy branding details have been saved successfully.', 'success');
    } catch (err) {
      this.showToast('Save Failed', err.message || 'Could not update branding details.', 'error');
    } finally {
      if (this.btnSaveBranding) setButtonLoading(this.btnSaveBranding, false);
    }
  }

  render() {
    this.updateSuperAdminState();
    this.renderUserProfile();
    this.populateCourseFilterDropdown();
    this.populateBatchFilterDropdown();
    this.renderBadgesAndStats();
    this.renderDashboardView();
    this.renderStudentsView();
    this.renderCoursesView();
    this.renderBatchesView();
    this.renderIdCardsView();
    this.renderCertificatesView();
    this.renderInboxView();
  }

  renderUserProfile() {
    const profile = store.getAcademyProfile();
    const academyName = profile?.academyName || 'Academy';
    const ownerName = profile?.ownerName || this.session?.name || 'Admin Portal';

    if (this.sidebarAcademyName) {
      this.sidebarAcademyName.textContent = academyName;
    }
    if (this.sidebarUserName) {
      this.sidebarUserName.textContent = ownerName;
    }
    if (this.sidebarUserEmail) {
      this.sidebarUserEmail.textContent = this.session?.email || 'admin@pixelsetu.com';
    }
    if (this.sidebarUserAvatar) {
      if (this.session && this.session.avatar) {
        this.sidebarUserAvatar.innerHTML = `<img src="${escapeHtml(this.session.avatar)}" alt="${escapeHtml(ownerName)}" referrerpolicy="no-referrer">`;
      } else {
        this.sidebarUserAvatar.textContent = getInitials(ownerName);
      }
    }
  }

  populateCourseFilterDropdown() {
    const currentVal = this.studentCourseFilter ? this.studentCourseFilter.value : 'all';
    const courses = store.getAllCourses();
    
    if (this.adminStudentCourseFilterMenu) {
      let html = '<li class="custom-select-option" data-value="all" role="option">All Courses</li>';
      courses.forEach(course => {
        html += `<li class="custom-select-option" data-value="${escapeHtml(course.id)}" role="option">${escapeHtml(course.title)} (${escapeHtml(course.duration)})</li>`;
      });
      this.adminStudentCourseFilterMenu.innerHTML = html;
      
      const selectedCourse = courses.find(c => c.id === currentVal);
      const label = selectedCourse ? `${selectedCourse.title} (${selectedCourse.duration})` : 'All Courses';
      this.setAdminDropdownValue(
        this.adminStudentCourseFilterDropdown,
        this.adminStudentCourseFilterMenu,
        this.adminStudentCourseFilterDisplay,
        this.studentCourseFilter,
        currentVal,
        label
      );
    }
  }

  populateBatchFilterDropdown() {
    const currentVal = this.studentBatchFilter ? this.studentBatchFilter.value : 'all';
    const batches = store.getAllBatches();

    if (this.adminStudentBatchFilterMenu) {
      let html = '<li class="custom-select-option" data-value="all" role="option">All Batches</li>';
      batches.forEach(batch => {
        html += `<li class="custom-select-option" data-value="${escapeHtml(batch.id)}" role="option">${escapeHtml(batch.name)}</li>`;
      });
      this.adminStudentBatchFilterMenu.innerHTML = html;

      const selectedBatch = batches.find(b => b.id === currentVal);
      const label = selectedBatch ? selectedBatch.name : 'All Batches';
      this.setAdminDropdownValue(
        this.adminStudentBatchFilterDropdown,
        this.adminStudentBatchFilterMenu,
        this.adminStudentBatchFilterDisplay,
        this.studentBatchFilter,
        currentVal,
        label
      );
    }
  }

  renderBadgesAndStats() {
    const stats = store.getStats();
    
    // Sidebar Badges
    this.studentCountBadge.textContent = stats.totalStudents;
    this.courseCountBadge.textContent = stats.totalCourses;
    if (this.batchCountBadge) {
      this.batchCountBadge.textContent = stats.totalBatches || store.getAllBatches().length;
    }
    const unreadMessages = store.getAllMessages().filter(message => !message.isRead).length;
    if (this.inboxUnreadBadge) {
      this.inboxUnreadBadge.textContent = unreadMessages;
      this.inboxUnreadBadge.style.display = unreadMessages > 0 ? '' : 'none';
    }

    // Dashboard Metric Cards (2 Cards)
    this.statTotalStudents.textContent = stats.totalStudents;
    this.statTotalCourses.textContent = stats.totalCourses;
  }

  // ==========================================================================
  // Render Dashboard
  // ==========================================================================
  updateDashboardGreeting() {
    const greeting = document.getElementById('dashboardGreeting');
    if (!greeting) return;
    const hour = new Date().getHours();
    const message = hour >= 5 && hour < 12 ? '☀️\u00a0\u00a0Good Morning! Welcome to your dashboard.'
      : hour >= 12 && hour < 17 ? '🌤️\u00a0\u00a0Good Afternoon! Welcome to your dashboard.'
      : hour >= 17 && hour < 21 ? '🌅\u00a0\u00a0Good Evening! Welcome to your dashboard.'
      : '🌙\u00a0\u00a0Good Night! Welcome to your dashboard.';
    if (greeting.textContent !== message) greeting.textContent = message;
  }

  renderDashboardView() {
    this.updateDashboardGreeting();
    const messages = store.getAllMessages().slice(0, 3);
    if (this.dashboardInboxList) {
      this.dashboardInboxList.innerHTML = messages.length ? messages.map(item => `
        <button type="button" class="dashboard-inbox-item inbox-row ${item.isRead ? 'is-read' : 'is-unread'}" data-dashboard-message-id="${escapeHtml(item.id)}" title="View message from ${escapeHtml(item.name || 'Website Visitor')}">
          <span class="inbox-row-icon" aria-hidden="true"><i class="${item.isRead ? 'fa-solid fa-envelope-open' : 'fa-solid fa-envelope'}"></i></span>
          <span class="inbox-row-sender">${escapeHtml(item.name || 'Website Visitor')}</span>
          <span class="inbox-row-snippet">${escapeHtml(item.message || 'No message content.')}</span>
          <time class="inbox-row-time">${escapeHtml(formatInboxRowTime(item.createdAt))}</time>
        </button>
      `).join('') : `
        <div class="dashboard-inbox-empty empty-state">
          <div class="empty-icon">
            <i class="fa-regular fa-envelope-open"></i>
          </div>
          <p>No messages yet</p>
        </div>`;
    }

    this.renderAuthCode();
  }

  // ==========================================================================
  // Render Students View
  // ==========================================================================
  renderStudentsView() {
    const allStudents = store.getAllStudents();
    const allCourses = store.getAllCourses();
    const batches = store.getAllBatches();
    const activeBatchObj = this.studentBatchFilterVal !== 'all' ? batches.find(b => b.id === this.studentBatchFilterVal) : null;

    if (this.studentTotalCount) this.studentTotalCount.textContent = allStudents.length;

    // Filter Logic
    const filteredStudents = allStudents.filter(student => {
      const query = this.studentSearchQuery;
      const matchesSearch = !query ||
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.phone.toLowerCase().includes(query);

      const matchesCourse = this.studentCourseFilterVal === 'all' ||
        (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(this.studentCourseFilterVal));

      const matchesBatch = this.studentBatchFilterVal === 'all' ||
        Boolean(activeBatchObj && Array.isArray(activeBatchObj.studentIds) && activeBatchObj.studentIds.includes(student.id)) ||
        student.batchId === this.studentBatchFilterVal;

      const matchesStatus = this.studentStatusFilterVal === 'all' ||
        student.status === this.studentStatusFilterVal;

      return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
    });

    if (this.studentFilteredCount) this.studentFilteredCount.textContent = filteredStudents.length;

    if (this.adminStudentCourseFilterDropdown) {
      this.adminStudentCourseFilterDropdown.classList.toggle('is-filtered', Boolean(this.studentCourseFilterVal && this.studentCourseFilterVal !== 'all'));
    }
    if (this.adminStudentBatchFilterDropdown) {
      this.adminStudentBatchFilterDropdown.classList.toggle('is-filtered', Boolean(this.studentBatchFilterVal && this.studentBatchFilterVal !== 'all'));
    }
    if (this.adminStudentStatusFilterDropdown) {
      this.adminStudentStatusFilterDropdown.classList.toggle('is-filtered', Boolean(this.studentStatusFilterVal && this.studentStatusFilterVal !== 'all'));
    }

    if (filteredStudents.length === 0) {
      this.studentsTableBody.innerHTML = '';
      this.studentsEmptyState.style.display = 'flex';
      this.studentsEmptyState.closest('.student-table-card')?.classList.add('is-empty');
      this.updateBulkActionState(filteredStudents);
      return;
    }

    this.studentsEmptyState.closest('.student-table-card')?.classList.remove('is-empty');
    this.studentsEmptyState.style.display = 'none';

    this.studentsTableBody.innerHTML = filteredStudents.map(student => {
      const isChecked = this.selectedStudentIds.has(student.id);
      
      const enrolledCoursesBadges = (student.enrolledCourseIds || []).map(cid => {
        const c = allCourses.find(item => item.id === cid);
        return c ? `<span class="badge-course-tag" title="${escapeHtml(c.title)}">${escapeHtml(c.title)}</span>` : '';
      }).join('');

      return `
        <tr class="${isChecked ? 'is-selected' : ''}" title="Click to view student details; Cmd-click or Ctrl-click to select">
          <td class="td-checkbox-col" title="Select student ${escapeHtml(student.name)}">
            <input type="checkbox" class="student-row-checkbox custom-table-checkbox" data-student-id="${escapeHtml(student.id)}" ${isChecked ? 'checked' : ''} aria-label="Select student ${escapeHtml(student.name)}">
          </td>
          <td>
            <span class="student-name-text">${escapeHtml(student.name)}</span>
          </td>
          <td class="text-center">
            <span class="student-id-cell">${escapeHtml(student.id)}</span>
          </td>
          <td class="text-center student-courses-cell">
            ${enrolledCoursesBadges || '<span class="text-muted">No courses</span>'}
          </td>
          <td class="text-center">${formatDate(student.joinDate)}</td>
          <td class="text-center">
            <span class="badge ${getStatusBadgeClass(student.status)}">
              ${getStatusBadgeIcon(student.status)} ${escapeHtml(student.status === 'Active' ? 'On going' : student.status)}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    this.updateBulkActionState(filteredStudents);
  }

  // ==========================================================================
  // Render Courses View (Course Name, Duration, Description)
  // ==========================================================================
  renderCoursesView() {
    const allCourses = store.getAllCourses();

    const filteredCourses = allCourses.filter(course => {
      const query = this.courseSearchQuery;
      return !query ||
        course.title.toLowerCase().includes(query) ||
        course.duration.toLowerCase().includes(query) ||
        (course.description && course.description.toLowerCase().includes(query));
    });

    if (filteredCourses.length === 0) {
      this.coursesGrid.innerHTML = '';
      this.coursesEmptyState.style.display = 'flex';
      return;
    }

    this.coursesEmptyState.style.display = 'none';

    this.coursesGrid.innerHTML = sortCourseOrBatchRecords(filteredCourses, this.courseSortInput?.value || 'name-asc', 'title').map(course => {
      const enrolledCount = store.getCourseEnrollmentCount(course.id);
      return `
        <div class="course-card">
          <div class="course-card-header">
            <h4 class="course-title" style="margin-bottom: 0;">${escapeHtml(course.title)}</h4>
            <span class="course-duration-badge">
              <i class="fa-regular fa-clock"></i> ${escapeHtml(course.duration)}
            </span>
          </div>
          <div class="course-card-body">
            <p class="course-desc" title="${escapeHtml(course.description || '')}">${escapeHtml(course.description || 'No description provided.')}</p>
          </div>
          <div class="course-card-footer">
            <div class="enrolled-stat">
              <i class="fa-solid fa-user-graduate"></i>
              <span><strong>${enrolledCount}</strong> Enrolled</span>
            </div>
            <div class="table-actions">
              <button class="btn-icon edit" title="Edit Course" onclick="window.app.openCourseModal('${course.id}')">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button class="btn-icon delete" title="Delete Course" onclick="window.app.confirmDeleteCourse('${course.id}')">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderBatchesView() {
    const batches = store.getAllBatches();
    if (this.batchCountBadge) this.batchCountBadge.textContent = batches.length;
    if (!this.batchesGrid || !this.batchesEmptyState) return;

    let filteredBatches = batches;
    if (this.batchSearchQuery) {
      filteredBatches = batches.filter(batch => {
        const nameMatch = (batch.name || '').toLowerCase().includes(this.batchSearchQuery);
        const statusMatch = (batch.status || '').toLowerCase().includes(this.batchSearchQuery);
        const dateMatch = formatDate(batch.createdAt).toLowerCase().includes(this.batchSearchQuery);
        const studentMatch = (batch.studentIds || []).some(id => {
          const s = store.getStudentById(id);
          return s && (
            (s.name || '').toLowerCase().includes(this.batchSearchQuery) ||
            (s.regNo || '').toLowerCase().includes(this.batchSearchQuery)
          );
        });
        return nameMatch || statusMatch || dateMatch || studentMatch;
      });
    }

    const statusFilter = this.batchStatusFilter?.value || 'all';
    this.batchStatusDropdown?.classList.toggle('is-filtered', statusFilter !== 'all');
    if (statusFilter !== 'all') {
      filteredBatches = filteredBatches.filter(batch =>
        (batch.status === 'Completed' ? 'Completed' : 'Active') === statusFilter);
    }

    if (filteredBatches.length === 0) {
      this.batchesGrid.innerHTML = '';
      this.batchesEmptyState.style.display = 'flex';
      if (this.batchesEmptyTitle && this.batchesEmptyDesc) {
        if (this.batchSearchQuery || statusFilter !== 'all') {
          this.batchesEmptyTitle.textContent = 'No Batches Found';
          this.batchesEmptyDesc.textContent = 'No batches match your search and status filter.';
          if (this.btnResetBatchFilters) this.btnResetBatchFilters.style.display = 'inline-flex';
          if (this.btnEmptyCreateBatch) this.btnEmptyCreateBatch.style.display = 'none';
        } else {
          this.batchesEmptyTitle.textContent = 'No Batches Yet';
          this.batchesEmptyDesc.textContent = 'Create your first batch to organize students and issue certificates.';
          if (this.btnResetBatchFilters) this.btnResetBatchFilters.style.display = 'none';
          if (this.btnEmptyCreateBatch) this.btnEmptyCreateBatch.style.display = 'inline-flex';
        }
      }
      return;
    }

    this.batchesEmptyState.style.display = 'none';
    this.batchesGrid.innerHTML = sortCourseOrBatchRecords(filteredBatches, this.batchSortInput?.value || 'name-asc', 'name').map(batch => {
      const members = (batch.studentIds || []).map(id => store.getStudentById(id)).filter(Boolean);
      const isCompleted = batch.status === 'Completed';
      return `<article class="batch-card${isCompleted ? ' is-completed' : ''}">
        <div class="batch-card-header">
          <div class="batch-card-title-group">
            <h3 title="${escapeHtml(batch.name)}">${escapeHtml(batch.name)}</h3>
            <div class="batch-card-submeta">
              <span class="batch-created-date">Created on ${formatDate(batch.createdAt)}</span>
            </div>
          </div>
          <div class="batch-card-header-actions">
            <button class="btn btn-secondary btn-sm batch-edit-icon-button" data-batch-action="edit" data-batch-id="${escapeHtml(batch.id)}" title="Edit batch" aria-label="Edit batch"><i class="fa-regular fa-pen-to-square"></i></button>
          </div>
        </div>
        <div class="batch-card-body">
          <div class="batch-stat-center ${isCompleted ? 'is-completed' : 'is-active'}">
            <div class="batch-stat-students-action">
              <button type="button" class="batch-stat-number" data-batch-action="view-students" data-batch-id="${escapeHtml(batch.id)}" aria-label="View ${members.length} students in ${escapeHtml(batch.name)}">${members.length}</button>
              <button type="button" class="batch-stat-label" data-batch-action="view-students" data-batch-id="${escapeHtml(batch.id)}">Student${members.length === 1 ? '' : 's'}</button>
            </div>
            <span class="badge ${getStatusBadgeClass(isCompleted ? 'Completed' : 'Active')} batch-stat-badge">${getStatusBadgeIcon(isCompleted ? 'Completed' : 'Active')} ${isCompleted ? 'Completed' : 'On going'}</span>
          </div>
        </div>
        <div class="batch-card-footer">
          ${isCompleted ? `
            <button type="button" class="btn btn-secondary btn-sm batch-download-btn" data-batch-action="download-certs" data-batch-id="${escapeHtml(batch.id)}" ${!members.length ? 'disabled title="No students in this batch"' : 'title="Download all certificates in ZIP format"'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><line x1="12" y1="3" x2="12" y2="15"></line><polyline points="6 10 12 16 18 10"></polyline><line x1="4" y1="21" x2="20" y2="21"></line></svg> Download All Certificates
            </button>
          ` : `
            <button class="btn btn-success btn-sm batch-complete-btn" data-batch-action="complete" data-batch-id="${escapeHtml(batch.id)}" ${!members.length ? 'disabled title="No students in this batch"' : 'title="Mark batch as completed"'}>
              <i class="fa-solid fa-check"></i> Mark as Completed
            </button>
          `}
        </div>
      </article>`;
    }).join('');
  }

  openBatchStudentsModal(batchId) {
    const batch = store.getAllBatches().find(item => item.id === batchId);
    if (!batch) return;
    let modal = document.getElementById('batchStudentsModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'batchStudentsModal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `<div class="modal-window batch-students-modal-window" role="dialog" aria-modal="true" aria-labelledby="batchStudentsTitle">
        <div class="modal-header">
          <div class="modal-title-box"><i class="fa-solid fa-users modal-icon"></i><h3 id="batchStudentsTitle">Batch</h3></div>
          <button type="button" class="btn-close-modal" aria-label="Close student list"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body batch-students-modal-body"><ul class="batch-students-view-list"></ul></div>
      </div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', event => {
        if (event.target === modal || event.target.closest('.btn-close-modal')) this.closeModal(modal);
      });
    }
    const members = (batch.studentIds || []).map(id => store.getStudentById(id)).filter(Boolean);
    modal.querySelector('#batchStudentsTitle').textContent = `Batch : ${batch.name}`;
    modal.querySelector('ul').innerHTML = members.length ? members.map(student =>
      `<li><strong>${escapeHtml(student.name || student.fullName || 'Unnamed Student')}</strong><span>${escapeHtml(student.id)}</span></li>`
    ).join('') : '<li class="batch-students-empty">No students in this batch.</li>';
    this.openModal(modal);
  }

  openEditBatchModal(batchId) {
    const batch = store.getAllBatches().find(item => item.id === batchId);
    if (!batch) return;
    this.editingBatchId = batch.id;
    this.editingBatchStudentIds = new Set((batch.studentIds || []).filter(id => store.getStudentById(id)));
    this.editingBatchMemberIds = new Set(this.editingBatchStudentIds);
    this.editBatchSearchQuery = '';
    this.editBatchStudentSearch.value = '';
    this.editBatchName.textContent = batch.name;
    this.editBatchNameInput.value = batch.name || '';
    this.setAdminDropdownValue(
      this.editBatchStatusDropdown,
      this.editBatchStatusMenu,
      this.editBatchStatusDisplay,
      this.editBatchStatus,
      batch.status === 'Completed' ? 'Completed' : 'Active',
      'Active'
    );
    this.renderEditBatchStudentList();
    this.openModal(this.editBatchModal);
  }

  renderEditBatchStudentList() {
    const query = this.editBatchSearchQuery;
    const students = store.getAllStudents().filter(student => {
      if (!this.editingBatchMemberIds.has(student.id)) return false;
      if (!query) return true;
      return String(student.name || student.fullName || '').toLowerCase().includes(query)
        || String(student.id || '').toLowerCase().includes(query);
    });
    this.editBatchSelectionCount.textContent = `${this.editingBatchStudentIds.size} selected`;
    this.editBatchEmptyState.hidden = students.length > 0;
    this.editBatchStudentList.hidden = students.length === 0;
    this.editBatchStudentList.innerHTML = students.map(student => {
      const name = student.name || student.fullName || 'Unnamed Student';
      return `<label class="batch-edit-student-option">
        <input type="checkbox" class="custom-table-checkbox batch-edit-student-checkbox" data-student-id="${escapeHtml(student.id)}" ${this.editingBatchStudentIds.has(student.id) ? 'checked' : ''}>
        <span><strong>${escapeHtml(name)}</strong><small>${escapeHtml(student.id)}</small></span>
      </label>`;
    }).join('');
  }

  async handleEditBatchSubmit(e) {
    e.preventDefault();
    const batch = store.getAllBatches().find(item => item.id === this.editingBatchId);
    if (!batch) return this.closeModal(this.editBatchModal);
    const name = this.editBatchNameInput.value.trim();
    if (!name) {
      this.showToast('Batch Name Required', 'Enter a batch name.', 'error');
      this.editBatchNameInput.focus();
      return;
    }
    const studentIds = Array.from(this.editingBatchStudentIds);
    if (!studentIds.length) {
      this.showToast('Students Required', 'Keep at least one student in the batch.', 'error');
      return;
    }
    const submitBtn = this.btnSaveEditBatch || this.editBatchForm.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);
    try {
      const shouldComplete = this.editBatchStatus.value === 'Completed' && batch.status !== 'Completed';
      await store.saveBatch({ ...batch, name, studentIds, status: shouldComplete ? 'Active' : this.editBatchStatus.value });
      this.closeModal(this.editBatchModal);
      this.editingBatchId = null;
      this.editingBatchStudentIds.clear();
      this.editingBatchMemberIds.clear();
      if (shouldComplete) {
        this.handleBulkMarkCompleted(batch.id, studentIds);
        return;
      }
      this.renderBatchesView();
      this.showToast('Batch Updated', `${name} now has ${studentIds.length} student${studentIds.length === 1 ? '' : 's'}.`, 'success');
    } catch (error) {
      this.showToast('Batch Not Updated', error.message, 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  }

  openCreateBatchModal(initialStudentIds = []) {
    this.batchModalMode = 'create';
    this.batchForm.reset();
    this.batchModalTitle.textContent = 'Create New Batch';
    this.batchModal.querySelector('.modal-icon').className = 'fa-solid fa-plus modal-icon';
    this.batchNameGroup.hidden = false;
    this.existingBatchGroup.hidden = true;
    if (this.batchStudentSelectionGroup) this.batchStudentSelectionGroup.hidden = false;
    this.batchNameInput.required = true;
    this.saveBatchLabel.textContent = 'Create Batch';

    const preselected = Array.isArray(initialStudentIds) && initialStudentIds.length
      ? initialStudentIds
      : Array.from(this.selectedStudentIds || []);
    this.createBatchSelectedStudentIds = new Set(preselected);
    this.createBatchSearchQuery = '';
    if (this.createBatchStudentSearch) this.createBatchStudentSearch.value = '';
    this.renderCreateBatchStudentList();

    this.openModal(this.batchModal);
  }

  renderCreateBatchStudentList() {
    if (!this.createBatchStudentList) return;
    const query = this.createBatchSearchQuery;
    const students = store.getAllStudents().filter(student => {
      if (!query) return true;
      const name = String(student.name || student.fullName || '').toLowerCase();
      const id = String(student.id || student.regNo || '').toLowerCase();
      const course = String(student.course || student.courseName || '').toLowerCase();
      return name.includes(query) || id.includes(query) || course.includes(query);
    });

    if (this.createBatchSelectionCount) {
      this.createBatchSelectionCount.textContent = `${this.createBatchSelectedStudentIds.size} selected`;
    }

    if (this.createBatchEmptyState) {
      this.createBatchEmptyState.hidden = students.length > 0;
    }
    this.createBatchStudentList.hidden = students.length === 0;

    this.createBatchStudentList.innerHTML = students.map(student => {
      const name = student.name || student.fullName || 'Unnamed Student';
      const reg = student.regNo || student.id || '';
      const course = student.course || '';
      const isChecked = this.createBatchSelectedStudentIds.has(student.id);
      return `<label class="batch-edit-student-option">
        <input type="checkbox" class="custom-table-checkbox create-batch-student-checkbox" data-student-id="${escapeHtml(student.id)}" ${isChecked ? 'checked' : ''}>
        <span>
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(reg)}${course ? ` • ${escapeHtml(course)}` : ''}</small>
        </span>
      </label>`;
    }).join('');
  }

  handleCreateNewBatch() {
    this.openCreateBatchModal(Array.from(this.selectedStudentIds));
  }

  handleAddToExistingBatch() {
    const studentIds = Array.from(this.selectedStudentIds);
    const batches = store.getAllBatches().filter(batch => String(batch.status || 'Active').toLowerCase() !== 'completed');
    if (!studentIds.length) return this.showToast('Select Students', 'Select one or more students to add.', 'error');
    if (!batches.length) return this.showToast('No On going Batch', 'Create a new batch first.', 'error');
    this.batchModalMode = 'existing';
    this.batchForm.reset();
    this.batchModalTitle.textContent = 'Add to Existing Batch';
    this.batchModal.querySelector('.modal-icon').className = 'fa-solid fa-arrow-right-to-bracket modal-icon';
    this.batchNameGroup.hidden = true;
    this.existingBatchGroup.hidden = false;
    if (this.batchStudentSelectionGroup) this.batchStudentSelectionGroup.hidden = true;
    this.batchNameInput.required = false;
    this.existingBatchMenu.innerHTML = batches.map(batch => `<li class="custom-select-option" data-value="${escapeHtml(batch.id)}" role="option">${escapeHtml(batch.name)} (${(batch.studentIds || []).length} students)</li>`).join('');
    this.setAdminDropdownValue(this.existingBatchDropdown, this.existingBatchMenu, this.existingBatchDisplay, this.existingBatchSelect, '', 'Choose an active batch');
    this.existingBatchTrigger.classList.remove('input-error');
    this.saveBatchLabel.textContent = 'Add Students';
    this.openModal(this.batchModal);
  }

  async handleBatchFormSubmit(e) {
    e.preventDefault();
    const submitBtn = this.btnSaveBatch || this.batchForm.querySelector('button[type="submit"]');
    const existing = this.batchModalMode === 'existing';
    if (existing) {
      const studentIds = Array.from(this.selectedStudentIds);
      if (!studentIds.length) return this.closeModal(this.batchModal);
      const batch = store.getAllBatches().find(item => item.id === this.existingBatchSelect.value);
      if (!batch) {
        this.existingBatchTrigger.classList.add('input-error');
        this.existingBatchTrigger.focus();
        return;
      }
      setButtonLoading(submitBtn, true);
      try {
        const saved = await store.saveBatch({
          ...batch,
          studentIds: [...new Set([...(batch.studentIds || []), ...studentIds])]
        });
        this.closeModal(this.batchModal);
        this.selectedStudentIds.clear();
        this.render();
        this.showToast('Students Added', `Students were added to ${saved.name}.`, 'success');
      } catch (error) {
        this.showToast('Students Not Added', error.message, 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    } else {
      const name = this.batchNameInput.value.trim();
      if (!name) return this.batchForm.reportValidity();
      const studentIds = Array.from(this.createBatchSelectedStudentIds);
      setButtonLoading(submitBtn, true);
      try {
        const saved = await store.saveBatch({ name, studentIds, status: 'Active' });
        this.closeModal(this.batchModal);
        this.selectedStudentIds.clear();
        this.createBatchSelectedStudentIds.clear();
        this.render();
        this.showToast('Batch Created', `${saved.name} was created successfully.`, 'success');
      } catch (error) {
        this.showToast('Batch Not Created', error.message, 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    }
  }

  // ==========================================================================
  // Render & Manage ID Cards View
  // ==========================================================================
  resetIdCardFilters() {
    this.idCardPreviewCleared = true;
    if (this.idCardStudentSearchInput) this.idCardStudentSearchInput.value = '';
    this.idCardSearchQuery = '';
    if (this.btnClearIdCardSearch) this.btnClearIdCardSearch.style.display = 'none';
    this.setAdminDropdownValue(
      this.idCardCourseFilterDropdown,
      this.idCardCourseFilterMenu,
      this.idCardCourseFilterDisplay,
      this.idCardCourseFilterVal,
      'all',
      'All Courses'
    );
    this.idCardCourseFilterValue = 'all';
    this.setAdminDropdownValue(
      this.idCardBatchFilterDropdown,
      this.idCardBatchFilterMenu,
      this.idCardBatchFilterDisplay,
      this.idCardBatchFilterVal,
      'all',
      'All Batches'
    );
    this.idCardBatchFilterValue = 'all';
    this.setAdminDropdownValue(
      this.idCardStatusFilterDropdown,
      this.idCardStatusFilterMenu,
      this.idCardStatusFilterDisplay,
      this.idCardStatusFilterVal,
      'all',
      'All Statuses'
    );
    this.idCardStatusFilterValue = 'all';
    if (this.idCardStatusFilterDropdown) {
      this.idCardStatusFilterDropdown.classList.remove('is-filtered');
    }
    if (this.idCardStatusFilterTrigger) {
      this.idCardStatusFilterTrigger.title = 'Filter by Status';
    }

    // Deselect student selections
    this.selectedIdCardStudentIds.clear();
    this.lastSelectedIdCardStudentId = null;

    this.renderIdCardsView();
  }

  updateIdCardClearButtonState() {
    const hasActiveFilterOrSelection = Boolean(
      (this.idCardCourseFilterValue && this.idCardCourseFilterValue !== 'all') ||
      (this.idCardBatchFilterValue && this.idCardBatchFilterValue !== 'all') ||
      (this.idCardStatusFilterValue && this.idCardStatusFilterValue !== 'all') ||
      this.idCardSearchQuery ||
      this.selectedIdCardStudentIds.size > 0 ||
      this.lastSelectedIdCardStudentId
    );

    if (this.btnClearIdCardFilter) {
      this.btnClearIdCardFilter.disabled = !hasActiveFilterOrSelection;
    }
  }


  renderCertificatesView() {
    const list = document.getElementById('certificateStudents');
    if (!list) return;
    const search = document.getElementById('certificateSearch');
    const courseFilter = document.getElementById('certificateCourse');
    const batchFilter = document.getElementById('certificateBatch');
    const selectAll = document.getElementById('certificateSelectAll');
    const download = document.getElementById('certificateDownloadSelected');
    this.selectedCertificateIds ||= new Set();
    const completed = store.getAllStudents().filter(s => s.status === 'Completed');
    const fill = (element, items, label, prefix) => {
      const el = suffix => document.getElementById(prefix + suffix);
      const value = items.some(item => item.id === element.value) ? element.value : 'all';
      el('Menu').innerHTML = `<li class="custom-select-option" data-value="all" role="option">${label}</li>` + items.map(item => `<li class="custom-select-option" data-value="${escapeHtml(item.id)}" role="option">${escapeHtml(item.title || item.name || item.id)}</li>`).join('');
      this.setAdminDropdownValue(el('Dropdown'), el('Menu'), el('Display'), element, value, label);
      if (!el('Dropdown').dataset.initialized) {
        this.setupAdminDropdown(el('Dropdown'), el('Trigger'), el('Menu'), el('Display'), element, () => this.renderCertificatesView());
        el('Dropdown').dataset.initialized = 'true';
      }
    };
    fill(courseFilter, store.getAllCourses(), 'All Courses', 'certCardCourseFilter');
    fill(batchFilter, store.getAllBatches(), 'All Batches', 'certCardBatchFilter');
    const clear = () => {
      this.certificatePreviewCleared = true;
      search.value = '';
      courseFilter.value = batchFilter.value = 'all';
      this.selectedCertificateIds.clear();
      this.certificatePreviewId = null;
      this.renderCertificatesView();
    };
    document.getElementById('btnClearCertCardFilter').onclick = clear;
    document.getElementById('btnResetCertCardFilters').onclick = clear;
    const clearSearch = document.getElementById('btnClearCertCardSearch');
    clearSearch.style.display = search.value ? '' : 'none';
    clearSearch.onclick = () => { search.value = ''; this.renderCertificatesView(); search.focus(); };
    const batch = store.getAllBatches().find(b => b.id === batchFilter.value);
    const query = search.value.trim().toLowerCase();
    const students = completed.filter(s => (!query || `${s.name} ${s.id} ${s.email || ''} ${s.phone || ''}`.toLowerCase().includes(query)) && (courseFilter.value === 'all' || s.courseId === courseFilter.value || (s.enrolledCourseIds || []).includes(courseFilter.value)) && (!batch || (batch.studentIds || []).includes(s.id)));
    const visibleIds = new Set(students.map(s => s.id));
    this.selectedCertificateIds.forEach(id => { if (!visibleIds.has(id)) this.selectedCertificateIds.delete(id); });
    list.innerHTML = students.map(s => `<div class="idcard-student-item ${this.selectedCertificateIds.has(s.id) ? 'is-selected' : ''}" data-id="${escapeHtml(s.id)}" tabindex="0" role="button"><label class="idcard-checkbox-hit"><input type="checkbox" class="custom-table-checkbox" aria-label="Select ${escapeHtml(s.name)}" ${this.selectedCertificateIds.has(s.id) ? 'checked' : ''}></label><span class="idcard-student-name">${escapeHtml(s.name)}</span><div class="idcard-student-status-col"><span class="badge ${getStatusBadgeClass(s.status)} idcard-student-status">${getStatusBadgeIcon(s.status)} Completed</span></div></div>`).join('');
    document.getElementById('certificateEmpty').style.display = students.length ? 'none' : '';
    list.closest('.idcards-list-panel').classList.toggle('is-empty', !students.length);
    document.getElementById('certificateSelectionCount').textContent = this.selectedCertificateIds.size;
    document.getElementById('certificateSelectionCount').hidden = !this.selectedCertificateIds.size;
    selectAll.checked = students.length > 0 && students.every(s => this.selectedCertificateIds.has(s.id));
    selectAll.indeterminate = this.selectedCertificateIds.size > 0 && !selectAll.checked;
    download.disabled = !this.selectedCertificateIds.size;
    if (!visibleIds.has(this.certificatePreviewId)) {
      if (students.length && !this.certificatePreviewCleared) {
        this.previewCertificate(students[0].id);
      } else {
        this.certificatePreviewId = null;
        if (window.CertificateCanvas?.clear) window.CertificateCanvas.clear();
        document.getElementById('certificateCanvas').hidden = true;
        document.getElementById('certificatePreviewEmpty').hidden = false;
      }
    }
    const toggle = id => {
      if (this.selectedCertificateIds.has(id)) this.selectedCertificateIds.delete(id);
      else this.selectedCertificateIds.add(id);
      this.certificatePreviewId = this.selectedCertificateIds.has(id) ? id : [...this.selectedCertificateIds].at(-1);
      this.renderCertificatesView();
      if (this.certificatePreviewId) this.previewCertificate(this.certificatePreviewId);
    };
    list.onchange = e => { const row = e.target.closest('[data-id]'); if (row) toggle(row.dataset.id); };
    list.onclick = e => {
      if (e.target.closest('label, input')) return;
      const row = e.target.closest('[data-id]');
      if (!row) return;
      if (e.metaKey || e.ctrlKey) { e.preventDefault(); toggle(row.dataset.id); return; }
      this.previewCertificate(row.dataset.id);
    };
    list.onkeydown = e => {
      if (!['Enter', ' '].includes(e.key) || e.target.closest('input')) return;
      e.preventDefault();
      const row = e.target.closest('[data-id]');
      if (row) this.previewCertificate(row.dataset.id);
    };
    search.oninput = courseFilter.onchange = batchFilter.onchange = () => this.renderCertificatesView();
    selectAll.onchange = () => { this.selectedCertificateIds = new Set(selectAll.checked ? students.map(s => s.id) : []); this.certificatePreviewId = [...this.selectedCertificateIds].at(-1); this.renderCertificatesView(); if (this.certificatePreviewId) this.previewCertificate(this.certificatePreviewId); };
    download.disabled = !this.selectedCertificateIds.size && !this.certificatePreviewId;
    download.innerHTML = `<i class="fa-solid fa-download"></i> ${this.selectedCertificateIds.size > 1 ? 'Download Certificates' : 'Download Certificate'}`;
    download.onclick = () => this.executeCertificateDownload(this.selectedCertificateIds.size ? [...this.selectedCertificateIds] : [this.certificatePreviewId]);
    document.getElementById('btnClearCertCardFilter').disabled = !(search.value || courseFilter.value !== 'all' || batchFilter.value !== 'all' || this.selectedCertificateIds.size || this.certificatePreviewId);
  }

  previewCertificate(id) {
    const student = store.getStudentById(id);
    if (!student || student.status !== 'Completed') return;
    this.certificatePreviewId = id;
    document.getElementById('btnClearCertCardFilter').disabled = false;
    document.getElementById('certificateDownloadSelected').disabled = false;
    if (window.CertificateCanvas?.render) {
      window.CertificateCanvas.render(student, store.getCourseById(student.courseId || student.enrolledCourseIds?.[0]), this.getCertificateVerificationUrl(student));
    }
  }

  renderIdCardsView() {
    if (!this.idCardStudentList) return;

    const students = store.getAllStudents();
    const courses = store.getAllCourses();
    const batches = store.getAllBatches();

    // Populate ID Cards Course filter dropdown
    if (this.idCardCourseFilterMenu) {
      const currentVal = this.idCardCourseFilterVal ? this.idCardCourseFilterVal.value : 'all';
      let html = '<li class="custom-select-option" data-value="all" role="option">All Courses</li>';
      courses.forEach(course => {
        html += `<li class="custom-select-option" data-value="${escapeHtml(course.id)}" role="option">${escapeHtml(course.title)}</li>`;
      });
      this.idCardCourseFilterMenu.innerHTML = html;
      const selectedCourse = courses.find(c => c.id === currentVal);
      const label = selectedCourse ? selectedCourse.title : 'All Courses';
      this.setAdminDropdownValue(
        this.idCardCourseFilterDropdown,
        this.idCardCourseFilterMenu,
        this.idCardCourseFilterDisplay,
        this.idCardCourseFilterVal,
        currentVal,
        label
      );
    }

    // Populate ID Cards Batch filter dropdown
    if (this.idCardBatchFilterMenu) {
      const currentBatchVal = this.idCardBatchFilterVal ? this.idCardBatchFilterVal.value : 'all';
      let bHtml = '<li class="custom-select-option" data-value="all" role="option">All Batches</li>';
      batches.forEach(b => {
        bHtml += `<li class="custom-select-option" data-value="${escapeHtml(b.id)}" role="option">${escapeHtml(b.name)}</li>`;
      });
      this.idCardBatchFilterMenu.innerHTML = bHtml;
      const selectedBatch = batches.find(b => b.id === currentBatchVal);
      const bLabel = selectedBatch ? selectedBatch.name : 'All Batches';
      this.setAdminDropdownValue(
        this.idCardBatchFilterDropdown,
        this.idCardBatchFilterMenu,
        this.idCardBatchFilterDisplay,
        this.idCardBatchFilterVal,
        currentBatchVal,
        bLabel
      );
    }

    // Filter students
    const query = (this.idCardSearchQuery || '').toLowerCase();
    const courseFilter = this.idCardCourseFilterVal ? this.idCardCourseFilterVal.value : 'all';
    const batchFilter = this.idCardBatchFilterVal ? this.idCardBatchFilterVal.value : 'all';
    const statusFilter = this.idCardStatusFilterVal ? this.idCardStatusFilterVal.value : 'all';
    this.idCardStatusFilterValue = statusFilter;
    const activeBatchObj = batchFilter !== 'all' ? batches.find(b => b.id === batchFilter) : null;

    const filteredStudents = students.filter(student => {
      const matchesSearch = !query ||
        String(student.name || '').toLowerCase().includes(query) ||
        String(student.id || '').toLowerCase().includes(query) ||
        String(student.phone || '').toLowerCase().includes(query) ||
        String(student.email || '').toLowerCase().includes(query);

      const matchesCourse = courseFilter === 'all' ||
        (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(courseFilter));

      const matchesBatch = batchFilter === 'all' ||
        Boolean(activeBatchObj && Array.isArray(activeBatchObj.studentIds) && activeBatchObj.studentIds.includes(student.id)) ||
        student.batchId === batchFilter;

      const matchesStatus = statusFilter === 'all' ||
        String(student.status || '').toLowerCase() === String(statusFilter).toLowerCase();

      return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
    });

    // Update clear filter button state
    this.updateIdCardClearButtonState();

    if (this.idCardStudentCountBadge) {
      this.idCardStudentCountBadge.textContent = `${filteredStudents.length} Student${filteredStudents.length === 1 ? '' : 's'}`;
    }

    if (this.idCardCourseFilterDropdown) {
      this.idCardCourseFilterDropdown.classList.toggle('is-filtered', Boolean(this.idCardCourseFilterValue && this.idCardCourseFilterValue !== 'all'));
    }
    if (this.idCardBatchFilterDropdown) {
      this.idCardBatchFilterDropdown.classList.toggle('is-filtered', Boolean(this.idCardBatchFilterValue && this.idCardBatchFilterValue !== 'all'));
    }
    if (this.idCardStatusFilterDropdown) {
      this.idCardStatusFilterDropdown.classList.toggle('is-filtered', Boolean(this.idCardStatusFilterValue && this.idCardStatusFilterValue !== 'all'));
    }
    if (this.idCardStatusFilterTrigger) {
      this.idCardStatusFilterTrigger.title = (this.idCardStatusFilterValue && this.idCardStatusFilterValue !== 'all')
        ? `Status: ${this.idCardStatusFilterValue}`
        : 'Filter by Status';
    }

    const idCardPanel = this.idCardStudentList ? this.idCardStudentList.closest('.idcards-list-panel') : null;
    const idCardSelectAllRow = idCardPanel ? idCardPanel.querySelector('.idcards-select-all-row') : null;

    if (filteredStudents.length === 0) {
      if (idCardPanel) idCardPanel.classList.add('is-empty');
      if (idCardSelectAllRow) idCardSelectAllRow.style.display = 'none';
      if (this.idCardStudentList) {
        this.idCardStudentList.innerHTML = '';
        this.idCardStudentList.style.display = 'none';
      }
      if (this.idCardListEmptyState) this.idCardListEmptyState.style.display = 'flex';
      if (this.idCardMockupWrapper) this.idCardMockupWrapper.style.display = 'flex';
      if (this.idCardPreviewActions) this.idCardPreviewActions.style.display = 'flex';
      if (this.btnDownloadIdCard) this.btnDownloadIdCard.disabled = true;
      if (this.idCardNoSelection) this.idCardNoSelection.style.display = 'flex';
      this.selectedIdCardStudentIds.clear();
      this.lastSelectedIdCardStudentId = null;
      this.renderIdCardBlankTemplate();
      this.updateIdCardSelectionUI(filteredStudents);
      return;
    }

    if (idCardPanel) idCardPanel.classList.remove('is-empty');
    if (idCardSelectAllRow) idCardSelectAllRow.style.display = '';
    if (this.idCardStudentList) this.idCardStudentList.style.display = '';
    if (this.idCardListEmptyState) this.idCardListEmptyState.style.display = 'none';

    const validFilteredIds = new Set(filteredStudents.map(s => s.id));
    // Retain selections that are still present in the filtered list.
    if (this.selectedIdCardStudentIds.size > 0) {
      for (const id of this.selectedIdCardStudentIds) {
        if (!validFilteredIds.has(id)) {
          this.selectedIdCardStudentIds.delete(id);
        }
      }
      if (this.lastSelectedIdCardStudentId && !validFilteredIds.has(this.lastSelectedIdCardStudentId)) {
        const remaining = Array.from(this.selectedIdCardStudentIds);
        this.lastSelectedIdCardStudentId = remaining.length > 0 ? remaining[remaining.length - 1] : null;
      }
    } else if (this.lastSelectedIdCardStudentId && !validFilteredIds.has(this.lastSelectedIdCardStudentId)) {
      this.lastSelectedIdCardStudentId = null;
    }

    if (!this.lastSelectedIdCardStudentId && !this.idCardPreviewCleared) {
      this.lastSelectedIdCardStudentId = filteredStudents[0].id;
    }

    this.idCardStudentList.innerHTML = filteredStudents.map(student => {
      const isSelected = this.selectedIdCardStudentIds.has(student.id);
      const isPreviewed = student.id === this.lastSelectedIdCardStudentId;
      const statusText = student.status || 'Active';

      return `
        <div class="idcard-student-item ${isSelected ? 'is-selected' : ''} ${isPreviewed ? 'is-previewed' : ''}" data-student-id="${escapeHtml(student.id)}" role="button" tabindex="0">
          <label class="idcard-checkbox-hit" aria-label="Select student ${escapeHtml(student.name)}"><input type="checkbox" class="custom-table-checkbox idcard-student-checkbox" data-student-id="${escapeHtml(student.id)}" ${isSelected ? 'checked' : ''} aria-label="Select student ${escapeHtml(student.name)}"></label>
          <span class="idcard-student-name">${escapeHtml(student.name)}</span>
          <div class="idcard-student-status-col">
            <span class="badge ${getStatusBadgeClass(statusText)} idcard-student-status">
              ${getStatusBadgeIcon(statusText)} ${escapeHtml(statusText === 'Active' ? 'On going' : statusText)}
            </span>
          </div>
        </div>
      `;
    }).join('');

    this.updateIdCardSelectionUI(filteredStudents);
  }

  toggleIdCardStudentSelection(studentId, isSelected) {
    if (isSelected) {
      this.selectedIdCardStudentIds.delete(studentId);
      this.selectedIdCardStudentIds.add(studentId);
      this.lastSelectedIdCardStudentId = studentId;
    } else {
      this.selectedIdCardStudentIds.delete(studentId);
      if (this.lastSelectedIdCardStudentId === studentId) {
        const remaining = Array.from(this.selectedIdCardStudentIds);
        this.lastSelectedIdCardStudentId = remaining.length > 0 ? remaining[remaining.length - 1] : null;
      }
    }
    this.updateIdCardSelectionUI();
  }

  // Soft-select: update preview only, do not affect bulk selectedIdCardStudentIds
  softSelectIdCardStudent(studentId) {
    if (this.lastSelectedIdCardStudentId === studentId && this.currentRenderedIdCardStudentId === studentId && this.idCardNoSelection && this.idCardNoSelection.style.display === 'none') {
      return;
    }
    this.lastSelectedIdCardStudentId = studentId;
    // Update .is-previewed class on all rows
    if (this.idCardStudentList) {
      this.idCardStudentList.querySelectorAll('.idcard-student-item').forEach(item => {
        item.classList.toggle('is-previewed', item.getAttribute('data-student-id') === studentId);
      });
    }
    // Render preview for this student
    const student = store.getStudentById(studentId);
    if (student) {
      this.updateIdCardPreview(student);
    }
    // If no checkboxes are checked, enable download button for this soft-selected student
    if (this.selectedIdCardStudentIds.size === 0 && this.btnDownloadIdCard) {
      const downloadIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><line x1="12" y1="3" x2="12" y2="15"></line><polyline points="6 10 12 16 18 10"></polyline><line x1="4" y1="21" x2="20" y2="21"></line></svg>`;
      const labelText = 'Download ID Card';
      const btnContent = `${downloadIconSvg} ${labelText}`;
      this.btnDownloadIdCard.innerHTML = btnContent;
      this.btnDownloadIdCard.dataset.originalHtml = btnContent;
      this.btnDownloadIdCard.title = labelText;
      this.btnDownloadIdCard.disabled = false;
    }
    this.updateIdCardClearButtonState();
  }

  handleSelectAllIdCards(isChecked) {
    const allStudents = store.getAllStudents();
    const batches = store.getAllBatches();
    const activeBatchObj = this.idCardBatchFilterValue !== 'all' ? batches.find(b => b.id === this.idCardBatchFilterValue) : null;

    const filteredStudents = allStudents.filter(student => {
      const query = this.idCardSearchQuery;
      const matchesSearch = !query ||
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        (student.phone && student.phone.includes(query));

      const matchesCourse = this.idCardCourseFilterValue === 'all' ||
        (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(this.idCardCourseFilterValue));

      const matchesBatch = this.idCardBatchFilterValue === 'all' ||
        Boolean(activeBatchObj && Array.isArray(activeBatchObj.studentIds) && activeBatchObj.studentIds.includes(student.id)) ||
        student.batchId === this.idCardBatchFilterValue;

      const matchesStatus = this.idCardStatusFilterValue === 'all' ||
        String(student.status || '').toLowerCase() === String(this.idCardStatusFilterValue).toLowerCase();

      return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
    });

    if (isChecked) {
      filteredStudents.forEach(s => this.selectedIdCardStudentIds.add(s.id));
      if (filteredStudents.length > 0) {
        this.lastSelectedIdCardStudentId = filteredStudents[filteredStudents.length - 1].id;
      }
    } else {
      filteredStudents.forEach(s => this.selectedIdCardStudentIds.delete(s.id));
      const remaining = Array.from(this.selectedIdCardStudentIds);
      this.lastSelectedIdCardStudentId = remaining.length > 0 ? remaining[remaining.length - 1] : null;
    }
    this.updateIdCardSelectionUI(filteredStudents);
  }

  updateIdCardSelectionUI(filteredStudents = null) {
    if (!filteredStudents) {
      const allStudents = store.getAllStudents();
      const batches = store.getAllBatches();
      const activeBatchObj = this.idCardBatchFilterValue !== 'all' ? batches.find(b => b.id === this.idCardBatchFilterValue) : null;

      filteredStudents = allStudents.filter(student => {
        const query = this.idCardSearchQuery;
        const matchesSearch = !query ||
          student.name.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query) ||
          (student.phone && student.phone.includes(query));

        const matchesCourse = this.idCardCourseFilterValue === 'all' ||
          (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(this.idCardCourseFilterValue));

        const matchesBatch = this.idCardBatchFilterValue === 'all' ||
          Boolean(activeBatchObj && Array.isArray(activeBatchObj.studentIds) && activeBatchObj.studentIds.includes(student.id)) ||
          student.batchId === this.idCardBatchFilterValue;

        const matchesStatus = this.idCardStatusFilterValue === 'all' ||
          String(student.status || '').toLowerCase() === String(this.idCardStatusFilterValue).toLowerCase();

        return matchesSearch && matchesCourse && matchesBatch && matchesStatus;
      });
    }

    // Update row states in DOM
    if (this.idCardStudentList) {
      this.idCardStudentList.querySelectorAll('.idcard-student-item').forEach(item => {
        const studentId = item.getAttribute('data-student-id');
        const isSelected = this.selectedIdCardStudentIds.has(studentId);
        const isPreviewed = studentId === this.lastSelectedIdCardStudentId;
        item.classList.toggle('is-selected', isSelected);
        item.classList.toggle('is-previewed', isPreviewed);
        const cb = item.querySelector('.idcard-student-checkbox');
        if (cb) cb.checked = isSelected;
      });
    }

    // Update Select All Checkbox state
    if (this.idCardSelectAllCheckbox) {
      if (filteredStudents.length === 0) {
        this.idCardSelectAllCheckbox.checked = false;
        this.idCardSelectAllCheckbox.indeterminate = false;
      } else {
        const selectedVisibleCount = filteredStudents.filter(s => this.selectedIdCardStudentIds.has(s.id)).length;
        const allSelected = selectedVisibleCount === filteredStudents.length && filteredStudents.length > 0;
        const someSelected = selectedVisibleCount > 0 && selectedVisibleCount < filteredStudents.length;

        this.idCardSelectAllCheckbox.checked = allSelected;
        this.idCardSelectAllCheckbox.indeterminate = someSelected;
      }
    }

    // Update Selection Count Badge
    const selectedCount = this.selectedIdCardStudentIds.size;
    if (this.idCardSelectionCountBadge) {
      this.idCardSelectionCountBadge.textContent = selectedCount;
      this.idCardSelectionCountBadge.hidden = selectedCount === 0;
      this.idCardSelectionCountBadge.style.display = selectedCount > 0 ? 'inline-flex' : 'none';
    }

    // Update Action Buttons
    if (this.btnDownloadIdCard) {
      const downloadIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><line x1="12" y1="3" x2="12" y2="15"></line><polyline points="6 10 12 16 18 10"></polyline><line x1="4" y1="21" x2="20" y2="21"></line></svg>`;
      const labelText = selectedCount >= 2 ? 'Download ID Cards' : 'Download ID Card';
      const btnContent = `${downloadIconSvg} ${labelText}`;
      this.btnDownloadIdCard.innerHTML = btnContent;
      this.btnDownloadIdCard.dataset.originalHtml = btnContent;
      this.btnDownloadIdCard.title = labelText;
      this.btnDownloadIdCard.disabled = selectedCount === 0;
    }


    // Always show preview of the LAST SELECTED student (whether hard selected or soft selected)
    if (this.lastSelectedIdCardStudentId) {
      const student = store.getStudentById(this.lastSelectedIdCardStudentId);
      if (student) {
        this.updateIdCardPreview(student);
      }
      if (selectedCount === 0 && this.btnDownloadIdCard) {
        const downloadIconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;"><line x1="12" y1="3" x2="12" y2="15"></line><polyline points="6 10 12 16 18 10"></polyline><line x1="4" y1="21" x2="20" y2="21"></line></svg>`;
        const labelText = 'Download ID Card';
        const btnContent = `${downloadIconSvg} ${labelText}`;
        this.btnDownloadIdCard.innerHTML = btnContent;
        this.btnDownloadIdCard.dataset.originalHtml = btnContent;
        this.btnDownloadIdCard.title = labelText;
        this.btnDownloadIdCard.disabled = false;
      }
    } else {
      if (this.idCardPreviewActions) this.idCardPreviewActions.style.display = 'flex';
      if (this.btnDownloadIdCard) this.btnDownloadIdCard.disabled = true;
      if (this.idCardMockupWrapper) this.idCardMockupWrapper.style.display = 'flex';
      if (this.idCardNoSelection) this.idCardNoSelection.style.display = 'flex';
      this.renderIdCardBlankTemplate();
    }
    this.updateIdCardClearButtonState();
  }

  async renderIdCardBlankTemplate() {
    const revision = this.idCardRenderRevision = (this.idCardRenderRevision || 0) + 1;
    this.currentRenderingIdCardStudentId = null;
    if (this.idCardLoadingOverlay) this.idCardLoadingOverlay.style.display = 'none';
    this.currentRenderedIdCardStudentId = null;
    const renderToken = this.idCardPreviewRenderToken = {};
    if (this.idCardLoadingOverlay) this.idCardLoadingOverlay.style.display = 'none';
    if (!this.idCardPreviewCanvas) return;
    try {
      const templateImg = await this.loadIdCardTemplateImage();
      if (this.idCardPreviewRenderToken !== renderToken) return;
      if (revision !== this.idCardRenderRevision) return;
      const ctx = this.idCardPreviewCanvas.getContext('2d');
      ctx.drawImage(templateImg, 0, 0, 1250, 2000);
    } catch (e) {
      console.warn('Could not render blank ID card template:', e);
    }
  }

  async updateIdCardPreview(student) {
    if (!student) return;
    if (this.currentRenderedIdCardStudentId === student.id && this.idCardNoSelection && this.idCardNoSelection.style.display === 'none') {
      return;
    }
    const courses = store.getAllCourses();
    const enrolledCourse = courses.find(c => student.enrolledCourseIds && student.enrolledCourseIds.includes(c.id));
    const courseTitle = enrolledCourse ? `${enrolledCourse.title} (${enrolledCourse.duration})` : (student.courseName || 'General Curriculum');

    if (this.idCardSelectedStudentName) {
      this.idCardSelectedStudentName.textContent = student.name;
    }
    if (this.idCardSelectedStudentMeta) {
      this.idCardSelectedStudentMeta.textContent = `${student.id} • ${courseTitle} • Status: ${student.status}`;
    }
    if (this.idCardPreviewActions) {
      this.idCardPreviewActions.style.display = 'flex';
    }
    if (this.idCardMockupWrapper) {
      this.idCardMockupWrapper.style.display = 'flex';
    }

    await this.renderIdCardToCanvas(student);
  }

  async loadIdCardTemplateImage() {
    if (this.cachedIdCardTemplate && this.cachedIdCardTemplate.complete && this.cachedIdCardTemplate.naturalWidth > 0) {
      return this.cachedIdCardTemplate;
    }
    const localUrl = 'assets/student-idcard.jpg?v=3';
    const remoteUrl = 'https://ik.imagekit.io/d3ycnoiwd/academy/student-certificate/student-idcard.jpg?v=3';

    try {
      this.cachedIdCardTemplate = await loadCertificateImage(localUrl);
      return this.cachedIdCardTemplate;
    } catch {
      this.cachedIdCardTemplate = await loadCertificateImage(remoteUrl);
      return this.cachedIdCardTemplate;
    }
  }

  drawIdCardPhotoFallback(ctx, student, box) {
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, box.x, box.y, box.width, box.height, box.radius);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    const initials = getInitials(student.name || 'ST');
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 110px "SF Pro Display", "SF Pro", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, box.x + box.width / 2, box.y + box.height / 2);
    ctx.restore();
  }

  async renderIdCardToCanvas(student, targetCanvas = null) {
    const destination = targetCanvas || this.idCardPreviewCanvas;
    if (!destination || !student) return;
    const isPreview = destination === this.idCardPreviewCanvas;
    const renderToken = isPreview ? (this.idCardPreviewRenderToken = {}) : null;
    // Compose away from the visible canvas so image loads cannot expose partial cards.
    const canvas = isPreview ? document.createElement('canvas') : destination;
    if (isPreview) {
      canvas.width = destination.width;
      canvas.height = destination.height;
      this.currentRenderingIdCardStudentId = student.id;
    }

    if (this.idCardLoadingOverlay && isPreview) {
      const showingEmptyState = this.idCardNoSelection && this.idCardNoSelection.style.display !== 'none';
      this.idCardLoadingOverlay.style.display = showingEmptyState ? 'none' : 'flex';
    }

    try {
      const templateImg = await this.loadIdCardTemplateImage();
      const ctx = canvas.getContext('2d');

      // 1. Draw template image onto 1250 x 2000 canvas unedited
      ctx.drawImage(templateImg, 0, 0, 1250, 2000);

      // 2. Draw Student Photo with thick white stroke strictly outside the photo placeholder
      const STROKE_WIDTH = 16;
      const PHOTO_BOX = { x: 422, y: 596, width: 407, height: 433, radius: 36 };
      const OUTER_BOX = {
        x: PHOTO_BOX.x - STROKE_WIDTH,
        y: PHOTO_BOX.y - STROKE_WIDTH,
        width: PHOTO_BOX.width + STROKE_WIDTH * 2,
        height: PHOTO_BOX.height + STROKE_WIDTH * 2,
        radius: PHOTO_BOX.radius + STROKE_WIDTH
      };

      // Draw thick white outer stroke strictly outside the photo area
      ctx.save();
      ctx.beginPath();
      drawRoundedRect(ctx, OUTER_BOX.x, OUTER_BOX.y, OUTER_BOX.width, OUTER_BOX.height, OUTER_BOX.radius);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      if (student.photoUrl) {
        try {
          const photo = await loadCertificateImage(student.photoUrl);
          ctx.save();
          ctx.beginPath();
          drawRoundedRect(ctx, PHOTO_BOX.x, PHOTO_BOX.y, PHOTO_BOX.width, PHOTO_BOX.height, PHOTO_BOX.radius);
          ctx.clip();
          const scale = Math.max(PHOTO_BOX.width / photo.width, PHOTO_BOX.height / photo.height);
          const sw = PHOTO_BOX.width / scale;
          const sh = PHOTO_BOX.height / scale;
          ctx.drawImage(
            photo,
            (photo.width - sw) / 2,
            Math.max(0, (photo.height - sh) * 0.25),
            sw,
            sh,
            PHOTO_BOX.x,
            PHOTO_BOX.y,
            PHOTO_BOX.width,
            PHOTO_BOX.height
          );
          ctx.restore();
        } catch (photoErr) {
          console.warn('Could not load student photo for ID card:', photoErr);
          this.drawIdCardPhotoFallback(ctx, student, PHOTO_BOX);
        }
      } else {
        this.drawIdCardPhotoFallback(ctx, student, PHOTO_BOX);
      }

      // Calibrated parameters for ID Card typography and layout
      const tuning = {
        nameSize: 100,
        nameY: 1160,
        detSize: 54,
        weight: '500',
        valX: 560,
        maxWidth: 600,
        idY: 1311,
        phoneY: 1395,
        courseY: 1480,
        lineHeight: 54
      };
      try {
        const savedTuning = localStorage.getItem('idcard_tuning_config');
        if (savedTuning) {
          const parsed = JSON.parse(savedTuning);
          Object.assign(tuning, parsed);
        }
      } catch (err) {
        console.warn('Could not read idcard_tuning_config:', err);
      }

      // Ensure SF Pro font is loaded before rendering canvas text
      try {
        if (document.fonts && typeof document.fonts.load === 'function') {
          await Promise.all([
            document.fonts.load(`800 ${tuning.nameSize}px "SF Pro Display"`),
            document.fonts.load(`${tuning.weight} ${tuning.detSize}px "SF Pro Display"`),
            document.fonts.load(`${tuning.weight} ${tuning.detSize}px "SF Pro Text"`)
          ]);
        }
      } catch {}

      // 3. Draw Student Name in SF Pro (Bold and large, centered uppercase)
      const studentName = (student.name || student.fullName || '').toUpperCase();
      if (studentName) {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let fontSize = tuning.nameSize;
        ctx.font = `800 ${fontSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", sans-serif`;
        while (ctx.measureText(studentName).width > 980 && fontSize > 48) {
          fontSize -= 2;
          ctx.font = `800 ${fontSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", sans-serif`;
        }
        ctx.fillText(studentName, 625, tuning.nameY);
        ctx.restore();
      }

      // 4. Draw Dynamic Field Values in SF Pro matching labels in visual size, weight, and tone
      const VAL_X = tuning.valX;
      const MAX_VAL_WIDTH = tuning.maxWidth;
      const FIELD_FONT = `${tuning.weight} ${tuning.detSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", sans-serif`;

      const drawValue = (val, y) => {
        if (!val) return;
        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.font = FIELD_FONT;
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'left';
        ctx.fillText(val, VAL_X, y);
        ctx.restore();
      };

      // Value 1: Student ID
      const studentId = student.id || student.regNo || '';
      if (studentId) drawValue(studentId, tuning.idY);

      // Value 2: Mobile No.
      const phone = student.phone || '';
      if (phone) drawValue(phone, tuning.phoneY);

      // Value 3: Course Title (Dynamic multi-line wrap without text cropping)
      const courses = store.getAllCourses();
      const courseObj = courses.find(c => student.enrolledCourseIds && student.enrolledCourseIds.includes(c.id));
      const courseTitle = courseObj ? courseObj.title : (student.courseName || '');
      if (courseTitle) {
        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'left';

        let fontSize = tuning.detSize;
        let lineHeight = tuning.lineHeight;
        const maxTextWidth = tuning.maxWidth;

        const computeLines = (fSize) => {
          ctx.font = `${tuning.weight} ${fSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", sans-serif`;
          const words = courseTitle.split(/\s+/);
          const res = [];
          let cur = '';
          for (const w of words) {
            const test = cur ? `${cur} ${w}` : w;
            if (ctx.measureText(test).width <= maxTextWidth) {
              cur = test;
            } else {
              if (cur) res.push(cur);
              cur = w;
            }
          }
          if (cur) res.push(cur);
          return res;
        };

        let lines = computeLines(fontSize);
        while (lines.length > 2 && fontSize > 36) {
          fontSize -= 2;
          lineHeight = Math.round(fontSize * 1.18);
          lines = computeLines(fontSize);
        }

        ctx.font = `${tuning.weight} ${fontSize}px "SF Pro Display", -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", sans-serif`;
        lines.forEach((lineText, idx) => {
          ctx.fillText(lineText, VAL_X, tuning.courseY + idx * lineHeight);
        });
        ctx.restore();
      }

      if (isPreview) {
        if (this.idCardPreviewRenderToken !== renderToken) return;
        destination.getContext('2d').drawImage(canvas, 0, 0);
        this.currentRenderedIdCardStudentId = student.id;
        if (this.idCardNoSelection) this.idCardNoSelection.style.display = 'none';
      }

    } catch (err) {
      console.error('[Render ID Card Error]:', err);
    } finally {
      if (this.idCardLoadingOverlay && isPreview && this.idCardPreviewRenderToken === renderToken) {
        this.idCardLoadingOverlay.style.display = 'none';
      }
    }
  }

  async generateStudentIdCardBlob(student) {
    if (!student) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1250;
    canvas.height = 2000;
    await this.renderIdCardToCanvas(student, canvas);
    return await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }

  async downloadSelectedStudentIdCard() {
    let studentIds = Array.from(this.selectedIdCardStudentIds);
    if (studentIds.length === 0) {
      if (this.lastSelectedIdCardStudentId) {
        studentIds = [this.lastSelectedIdCardStudentId];
      } else {
        this.showToast('No Student Selected', 'Please select at least one student to download ID card.', 'warning');
        return;
      }
    }

    const btn = this.btnDownloadIdCard;
    setButtonLoading(btn, true);

    try {
      if (studentIds.length === 1) {
        const student = store.getStudentById(studentIds[0]);
        if (!student) throw new Error('Student data not found.');

        let blob;
        if (student.id === this.lastSelectedIdCardStudentId && this.idCardPreviewCanvas) {
          blob = await new Promise(resolve => this.idCardPreviewCanvas.toBlob(resolve, 'image/png'));
        } else {
          blob = await this.generateStudentIdCardBlob(student);
        }
        if (!blob) throw new Error('Could not export ID card image.');

        const safeName = (student.name || student.fullName || 'Student').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
        const safeId = String(student.id || '').replace(/[^a-zA-Z0-9_-]/g, '-');
        const filename = `IDCard_${safeId}_${safeName}.png`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('ID Card Downloaded', `Saved ID Card for ${student.name}`, 'success');
      } else {
        if (typeof window.JSZip === 'undefined') {
          this.showToast('ZIP Library Loading', 'Compression library is loading. Please try again in a few seconds.', 'info');
          return;
        }

        const students = studentIds.map(id => store.getStudentById(id)).filter(Boolean);
        if (students.length === 0) throw new Error('No valid student records found.');

        this.showToast('Generating ID Cards', `Preparing ZIP archive for ${students.length} students...`, 'info');
        const zip = new window.JSZip();
        let renderedCount = 0;

        for (const student of students) {
          let blob;
          if (student.id === this.lastSelectedIdCardStudentId && this.idCardPreviewCanvas) {
            blob = await new Promise(resolve => this.idCardPreviewCanvas.toBlob(resolve, 'image/png'));
          } else {
            blob = await this.generateStudentIdCardBlob(student);
          }

          if (blob) {
            const safeName = (student.name || student.fullName || 'Student').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
            const safeId = String(student.id || '').replace(/[^a-zA-Z0-9_-]/g, '-');
            zip.file(`IDCard_${safeId}_${safeName}.png`, blob);
            renderedCount++;
          }
        }

        if (renderedCount === 0) throw new Error('Failed to generate any ID cards for download.');

        const zipBlob = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });

        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `IDCards_Batch_${renderedCount}_Students_${timestamp}.zip`;

        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showToast('Bulk Download Complete', `Downloaded ${renderedCount} ID cards in ZIP package.`, 'success');
      }
    } catch (err) {
      console.error('[ID Card Download Error]:', err);
      this.showToast('Download Error', err.message || 'Failed to generate ID card download.', 'error');
    } finally {
      setButtonLoading(btn, false);
      this.updateIdCardSelectionUI();
    }
  }

  async printSelectedStudentIdCard() {
    const studentIds = Array.from(this.selectedIdCardStudentIds);
    if (studentIds.length === 0) {
      this.showToast('No Student Selected', 'Please select at least one student to print.', 'warning');
      return;
    }

    const students = studentIds.map(id => store.getStudentById(id)).filter(Boolean);
    if (students.length === 0) return;

    const btn = this.btnPrintIdCard;
    setButtonLoading(btn, true);

    try {
      const cardImages = [];
      for (const student of students) {
        let dataUrl;
        if (student.id === this.lastSelectedIdCardStudentId && this.idCardPreviewCanvas) {
          dataUrl = this.idCardPreviewCanvas.toDataURL('image/png');
        } else {
          const canvas = document.createElement('canvas');
          canvas.width = 1250;
          canvas.height = 2000;
          await this.renderIdCardToCanvas(student, canvas);
          dataUrl = canvas.toDataURL('image/png');
        }
        cardImages.push({
          dataUrl,
          student
        });
      }

      const printWindow = window.open('', '_blank', 'width=800,height=900');
      if (!printWindow) {
        this.showToast('Print Popup Blocked', 'Please allow popups to print ID cards.', 'warning');
        return;
      }

      const title = students.length === 1
        ? `Print ID Card - ${escapeHtml(students[0].name)} (${escapeHtml(students[0].id)})`
        : `Print ID Cards - ${students.length} Students`;

      const cardsHtml = cardImages.map(item => `
        <div class="idcard-print-card">
          <img src="${item.dataUrl}" alt="ID Card - ${escapeHtml(item.student.name)}">
        </div>
      `).join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            @page {
              size: 54mm 86mm;
              margin: 0;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              background: #f8fafc;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: system-ui, sans-serif;
              padding: 20px 0;
              gap: 20px;
            }
            .idcard-print-card {
              width: 54mm;
              height: 86mm;
              border-radius: 3.5mm;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              background: #fff;
              page-break-after: always;
              break-after: page;
            }
            .idcard-print-card:last-child {
              page-break-after: auto;
              break-after: auto;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }
            @media print {
              body {
                background: transparent;
                min-height: auto;
                padding: 0;
                gap: 0;
              }
              .idcard-print-card {
                width: 54mm;
                height: 86mm;
                box-shadow: none;
                border-radius: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${cardsHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 300);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('[ID Card Print Error]:', err);
      this.showToast('Print Error', 'Failed to prepare ID cards for printing.', 'error');
    } finally {
      setButtonLoading(btn, false);
    }
  }

  renderInboxView() {
    if (!this.inboxList || !this.inboxEmptyState) return;
    const allMessages = store.getAllMessages();

    // Filter by search query if present
    let filteredMessages = allMessages;
    if (this.inboxSearchQuery) {
      filteredMessages = allMessages.filter(item => {
        const name = (item.name || '').toLowerCase();
        const phone = (item.phone || '').toLowerCase();
        const course = (item.course || '').toLowerCase();
        const message = (item.message || '').toLowerCase();
        return name.includes(this.inboxSearchQuery) ||
               phone.includes(this.inboxSearchQuery) ||
               course.includes(this.inboxSearchQuery) ||
               message.includes(this.inboxSearchQuery);
      });
    }

    const hasMessages = allMessages.length > 0;
    const hasFiltered = filteredMessages.length > 0;

    // Update Mark All Read button state
    if (this.btnMarkAllInboxRead) {
      const unreadCount = allMessages.filter(m => !m.isRead).length;
      this.btnMarkAllInboxRead.disabled = unreadCount === 0;
    }

    if (!hasFiltered) {
      this.inboxList.style.display = 'none';
      this.inboxEmptyState.style.display = 'flex';
      if (this.inboxEmptyTitle && this.inboxEmptyDesc) {
        if (!hasMessages) {
          this.inboxEmptyTitle.textContent = 'No Messages Yet';
          this.inboxEmptyDesc.textContent = 'Messages sent through the public website will appear here.';
          if (this.btnResetInboxSearch) this.btnResetInboxSearch.style.display = 'none';
        } else {
          this.inboxEmptyTitle.textContent = 'No Messages Found';
          this.inboxEmptyDesc.textContent = 'No messages match your search keywords.';
          if (this.btnResetInboxSearch) this.btnResetInboxSearch.style.display = 'inline-flex';
        }
      }
      this.updateInboxBulkActionState([]);
      return;
    }

    this.inboxEmptyState.style.display = 'none';
    this.inboxList.style.display = 'flex';

    this.inboxList.innerHTML = filteredMessages.map(item => {
      const isSelected = this.selectedInboxMessageIds.has(item.id);
      return `
        <div class="inbox-row ${item.isRead ? 'is-read' : 'is-unread'} ${isSelected ? 'is-selected' : ''}" data-message-id="${escapeHtml(item.id)}" role="button" tabindex="0" title="Click to view message from ${escapeHtml(item.name || 'Website Visitor')}">
          <label class="inbox-checkbox-hit inbox-row-checkbox-col" aria-label="Select message from ${escapeHtml(item.name || 'Website Visitor')}">
            <input type="checkbox" class="inbox-row-checkbox custom-table-checkbox" data-message-id="${escapeHtml(item.id)}" ${isSelected ? 'checked' : ''} aria-label="Select message from ${escapeHtml(item.name || 'Website Visitor')}">
          </label>
          <div class="inbox-row-main">
            <div class="inbox-row-icon" aria-hidden="true">
              <i class="${item.isRead ? 'fa-solid fa-envelope-open' : 'fa-solid fa-envelope'}"></i>
            </div>
            <div class="inbox-row-sender">${escapeHtml(item.name || 'Website Visitor')}</div>
            <div class="inbox-row-snippet">${escapeHtml(item.message || 'No message content.')}</div>
          </div>
          <div class="inbox-row-time">
            ${escapeHtml(formatInboxRowTime(item.createdAt))}
          </div>
        </div>
      `;
    }).join('');

    this.updateInboxBulkActionState(filteredMessages);
  }

  getFilteredInboxMessages() {
    const allMessages = store.getAllMessages();
    if (!this.inboxSearchQuery) return allMessages;
    return allMessages.filter(item => {
      const name = (item.name || '').toLowerCase();
      const phone = (item.phone || '').toLowerCase();
      const course = (item.course || '').toLowerCase();
      const message = (item.message || '').toLowerCase();
      return name.includes(this.inboxSearchQuery) ||
             phone.includes(this.inboxSearchQuery) ||
             course.includes(this.inboxSearchQuery) ||
             message.includes(this.inboxSearchQuery);
    });
  }

  updateInboxBulkActionState(filteredMessages) {
    if (!filteredMessages) filteredMessages = this.getFilteredInboxMessages();
    const count = this.selectedInboxMessageIds.size;
    const hasSelections = count > 0;

    if (this.inboxSelectionCount) {
      this.inboxSelectionCount.textContent = count;
      this.inboxSelectionCount.hidden = !hasSelections;
    }

    if (this.btnBulkDeleteInbox) {
      this.btnBulkDeleteInbox.disabled = !hasSelections;
    }

    if (this.selectAllInboxCheckbox) {
      const allSelected = filteredMessages.length > 0 && filteredMessages.every(m => this.selectedInboxMessageIds.has(m.id));
      const someSelected = filteredMessages.some(m => this.selectedInboxMessageIds.has(m.id));
      this.selectAllInboxCheckbox.checked = allSelected;
      this.selectAllInboxCheckbox.indeterminate = !allSelected && someSelected;
    }
  }

  openInboxMessageModal(messageId) {
    const allMessages = store.getAllMessages();
    const message = allMessages.find(m => m.id === messageId);
    if (!message) return;

    this.currentViewingMessageId = messageId;

    if (this.inboxModalReceivedTime) {
      this.inboxModalReceivedTime.textContent = formatMessageDate(message.createdAt, true);
    }
    if (this.inboxModalSenderName) {
      this.inboxModalSenderName.textContent = message.name || 'Website Visitor';
    }
    if (this.inboxModalAvatar) {
      this.inboxModalAvatar.textContent = getInitials(message.name || 'Visitor');
      this.inboxModalAvatar.style.background = getAvatarGradient(message.name || 'Visitor');
    }
    if (this.inboxModalPhone && this.inboxModalPhoneText) {
      const phone = message.phone || '';
      if (phone) {
        this.inboxModalPhoneText.textContent = phone;
        this.inboxModalPhone.style.display = 'inline-flex';
      } else {
        this.inboxModalPhone.style.display = 'none';
      }
    }
    if (this.btnCallVisitorFromModal) {
      if (message.phone) {
        this.btnCallVisitorFromModal.href = `tel:${message.phone}`;
        this.btnCallVisitorFromModal.style.display = 'inline-flex';
      } else {
        this.btnCallVisitorFromModal.style.display = 'none';
      }
    }

    if (this.inboxModalStatusBadge) {
      if (message.isRead) {
        this.inboxModalStatusBadge.className = 'inbox-modal-badge is-read';
        this.inboxModalStatusBadge.textContent = 'Read';
      } else {
        this.inboxModalStatusBadge.className = 'inbox-modal-badge is-unread';
        this.inboxModalStatusBadge.textContent = '● New';
      }
    }

    if (this.labelToggleRead) {
      this.labelToggleRead.textContent = message.isRead ? 'Mark as Unread' : 'Mark as Read';
    }

    if (this.inboxModalCourseSection && this.inboxModalCourseName) {
      if (message.course) {
        this.inboxModalCourseName.textContent = message.course;
        this.inboxModalCourseSection.style.display = 'block';
      } else {
        this.inboxModalCourseSection.style.display = 'none';
      }
    }

    if (this.inboxModalMessageText) {
      this.inboxModalMessageText.textContent = String(message.message || '').replace(/\r\n?/g, '\n').replace(/\n(?:[^\S\n]*\n)+/g, '\n').trim() || 'No message content.';
    }

    // Bind footer action buttons
    if (this.btnDeleteInboxMessageFromModal) {
      this.btnDeleteInboxMessageFromModal.onclick = () => {
        this.closeModal(this.inboxMessageModal);
        this.confirmDeleteInboxMessage(messageId);
      };
    }

    if (this.btnToggleReadFromModal) {
      this.btnToggleReadFromModal.onclick = async () => {
        const msg = store.getAllMessages().find(m => m.id === messageId);
        if (!msg) return;
        if (msg.isRead) {
          await store.markMessageUnread(messageId);
          this.showToast('Marked as Unread', 'The message is now marked as unread.', 'info');
        } else {
          await store.markMessageRead(messageId);
          this.showToast('Marked as Read', 'The message is now marked as read.', 'info');
        }
        this.render();
        this.closeModal(this.inboxMessageModal);
      };
    }

    // Automatically mark as read if it was unread
    if (!message.isRead) {
      store.markMessageRead(messageId);
      this.renderBadgesAndStats();
      this.renderInboxView();
      if (this.inboxModalStatusBadge) {
        this.inboxModalStatusBadge.className = 'inbox-modal-badge is-read';
        this.inboxModalStatusBadge.textContent = 'Read';
      }
      if (this.labelToggleRead) {
        this.labelToggleRead.textContent = 'Mark as Unread';
      }
    }

    this.openModal(this.inboxMessageModal);
  }

  markInboxMessageRead(messageId) {
    store.markMessageRead(messageId);
    this.render();
  }

  confirmDeleteInboxMessage(messageId) {
    this.promptConfirmation({
      title: 'Delete Message?',
      message: 'This message will be permanently removed from the inbox.',
      action: () => {
        store.deleteMessage(messageId);
        this.render();
        this.showToast('Message Deleted', 'The inbox message was removed.', 'info');
      }
    });
  }

  // ==========================================================================
  // Custom Dropdown Helpers for Admin Student Form
  // ==========================================================================
  setupAdminDropdown(container, trigger, menu, display, hiddenInput, onChangeCallback) {
    if (!container || !trigger || !menu || !hiddenInput) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = container.classList.contains('open');

      this.closeAllAdminDropdowns();

      if (wasOpen) {
        container.classList.remove('open', 'drop-up');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.blur();
        return;
      }

      const isPortalModal = Boolean(container.closest('#studentModal') || container.closest('#bulkStatusModal'));
      const isTableDropdown = Boolean(container.closest('.table-responsive') || container.closest('.data-table') || container.classList.contains('th-minimal-dropdown'));

      if (isPortalModal || isTableDropdown || container === this.existingBatchDropdown) {
        // Open below the trigger and portal to body to avoid clipping by modal bodies, table scrollbars, or empty states
        const triggerRect = trigger.getBoundingClientRect();
        this.portaledMenu = menu;
        this.portaledOriginalParent = container;
        this.portaledNextSibling = menu.nextSibling;

        const maxAvailableBelow = window.innerHeight - triggerRect.bottom - 12;

        menu.classList.add('portal-select-menu');
        menu.style.top = `${triggerRect.bottom + 4}px`;

        if (container.classList.contains('th-minimal-dropdown')) {
          menu.style.minWidth = '145px';
          menu.style.width = 'max-content';
          // Anchor the menu card's left edge to the trigger button's rendered left edge.
          // This gives the most visually predictable alignment with the label text.
          const approxMenuWidth = 160;
          const rawLeft = triggerRect.left;
          const targetLeft = Math.max(8, Math.min(rawLeft, window.innerWidth - approxMenuWidth - 8));
          menu.style.left = `${targetLeft}px`;
        } else {
          menu.style.left = `${triggerRect.left}px`;
          menu.style.width = `${triggerRect.width}px`;
          menu.style.minWidth = '';
        }

        menu.style.maxHeight = `${Math.max(140, Math.min(240, maxAvailableBelow))}px`;
        document.body.appendChild(menu);

        container.classList.remove('drop-up');
        container.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        // Measure trigger position and scroll parent boundaries to decide drop-down vs drop-up
        const triggerRect = trigger.getBoundingClientRect();
        const scrollParent = container.closest('.modal-body') || document.body;
        const parentRect = scrollParent.getBoundingClientRect();

        const spaceBelow = parentRect.bottom - triggerRect.bottom;
        const spaceAbove = triggerRect.top - parentRect.top;
        const viewportBelow = window.innerHeight - triggerRect.bottom;
        const viewportAbove = triggerRect.top;

        // Open upwards if space below is tight (< 230px) and there is more room above
        const shouldDropUp = (spaceBelow < 230 || viewportBelow < 230) && (spaceAbove > spaceBelow || viewportAbove > viewportBelow);

        container.classList.toggle('drop-up', shouldDropUp);
        container.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    menu.addEventListener('click', (e) => {
      const option = e.target.closest('.custom-select-option');
      if (!option) return;

      const value = option.getAttribute('data-value');
      const label = option.textContent.trim();

      hiddenInput.value = value;
      if (display) display.textContent = label;
      container.classList.toggle('has-value', Boolean(value));

      const isFilter = container.classList.contains('toolbar-filter-dropdown') ||
        container.classList.contains('idcards-filter-dropdown') ||
        container.classList.contains('th-minimal-dropdown') ||
        Boolean(container.id && container.id.toLowerCase().includes('filter'));
      if (isFilter) {
        container.classList.toggle('is-filtered', Boolean(value && value !== 'all'));
      }

      menu.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      container.classList.remove('open', 'drop-up');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.blur();
      this.closeAllAdminDropdowns();

      if (typeof onChangeCallback === 'function') {
        onChangeCallback(value);
      }
    });
  }

  closeAllAdminDropdowns(except = null) {
    if (this.portaledMenu && this.portaledOriginalParent && this.portaledOriginalParent !== except) {
      if (this.portaledMenu.parentElement === document.body) {
        this.portaledOriginalParent.insertBefore(this.portaledMenu, this.portaledNextSibling || null);
      }
      this.portaledMenu.classList.remove('portal-select-menu');
      this.portaledMenu.style.top = '';
      this.portaledMenu.style.left = '';
      this.portaledMenu.style.width = '';
      this.portaledMenu.style.minWidth = '';
      this.portaledMenu.style.maxHeight = '';
      this.portaledMenu = null;
      this.portaledOriginalParent = null;
      this.portaledNextSibling = null;
    }

    const openDropdowns = document.querySelectorAll('.custom-select-container.open, .custom-dropdown.open, .batch-action-menu.open, .student-more-actions-menu.open');
    openDropdowns.forEach(dropdown => {
      if (dropdown && dropdown !== except) {
        dropdown.classList.remove('open', 'drop-up');
        const trigger = dropdown.querySelector('.custom-select-trigger, [aria-haspopup="listbox"], [aria-haspopup="true"]');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });

    const all = [
      this.durationUnitDropdown,
      this.adminStudentGenderDropdown,
      this.adminStudentMaritalStatusDropdown,
      this.adminStudentCategoryDropdown,
      this.adminStudentReligionDropdown,
      this.adminStudentStateDropdown,
      this.adminStudentDistrictDropdown,
      this.adminStudentQualificationDropdown,
      this.adminStudentCourseDropdown,
      this.adminStudentStatusDropdown,
      this.adminStudentCourseFilterDropdown,
      this.adminStudentBatchFilterDropdown,
      this.adminStudentStatusFilterDropdown,
      this.idCardCourseFilterDropdown,
      this.idCardBatchFilterDropdown,
      this.idCardStatusFilterDropdown,
      this.completionStartMonthDropdown,
      this.completionStartYearDropdown,
      this.completionEndMonthDropdown,
      this.completionEndYearDropdown,
      this.existingBatchDropdown,
      this.editBatchStatusDropdown,
      this.bulkStatusDropdown,
      this.batchActionMenu,
      this.studentMoreActionsMenu
    ];
    all.forEach(dropdown => {
      if (dropdown && dropdown !== except) {
        dropdown.classList.remove('open', 'drop-up');
        const trigger = dropdown.querySelector('.custom-select-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (dropdown === this.batchActionMenu) this.btnCreateBatch?.setAttribute('aria-expanded', 'false');
        if (dropdown === this.studentMoreActionsMenu) this.btnStudentMoreActions?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setAdminDropdownValue(container, menu, display, hiddenInput, value, defaultLabel) {
    if (!container || !menu || !display || !hiddenInput) return;
    hiddenInput.value = value || '';
    container.classList.toggle('has-value', Boolean(value));

    const isFilter = container.classList.contains('toolbar-filter-dropdown') ||
      container.classList.contains('idcards-filter-dropdown') ||
      container.classList.contains('th-minimal-dropdown') ||
      Boolean(container.id && container.id.toLowerCase().includes('filter'));
    if (isFilter) {
      container.classList.toggle('is-filtered', Boolean(value && value !== 'all'));
    }

    let matchedLabel = defaultLabel;
    menu.querySelectorAll('.custom-select-option').forEach(opt => {
      const optVal = opt.getAttribute('data-value');
      if (optVal === value && value) {
        opt.classList.add('selected');
        matchedLabel = opt.textContent.trim();
      } else {
        opt.classList.remove('selected');
      }
    });
    display.textContent = matchedLabel;
  }

  initAdminStateAndDistrictDropdowns() {
    if (!this.adminStudentStateMenu || !this.adminStudentDistrictMenu) return;

    const states = Object.keys(INDIAN_STATES_DISTRICTS).sort();
    this.adminStudentStateMenu.innerHTML = states.map(state => `
      <li class="custom-select-option" data-value="${escapeHtml(state)}" role="option">${escapeHtml(state)}</li>
    `).join('');

    this.setupAdminDropdown(
      this.adminStudentStateDropdown,
      this.adminStudentStateTrigger,
      this.adminStudentStateMenu,
      this.adminStudentStateDisplay,
      this.studentStateInput,
      (selectedState) => {
        this.populateAdminDistricts(selectedState);
      }
    );

    this.setupAdminDropdown(
      this.adminStudentDistrictDropdown,
      this.adminStudentDistrictTrigger,
      this.adminStudentDistrictMenu,
      this.adminStudentDistrictDisplay,
      this.studentDistrictInput
    );
  }

  populateAdminDistricts(selectedState) {
    if (!this.adminStudentDistrictMenu || !this.adminStudentDistrictDisplay || !this.studentDistrictInput) return;

    const districts = INDIAN_STATES_DISTRICTS[selectedState] || [];
    if (districts.length === 0) {
      this.adminStudentDistrictMenu.innerHTML = '<li class="custom-select-option" data-value="" style="color: var(--text-muted); cursor: default;">No districts available</li>';
    } else {
      this.adminStudentDistrictMenu.innerHTML = districts.map(d => `
        <li class="custom-select-option" data-value="${escapeHtml(d)}" role="option">${escapeHtml(d)}</li>
      `).join('');
    }

    this.adminStudentDistrictDisplay.textContent = 'Select District';
    this.studentDistrictInput.value = '';
    this.adminStudentDistrictMenu.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
  }

  populateAdminStudentCourseMenu(courses) {
    if (!this.adminStudentCourseMenu) return;

    if (courses.length === 0) {
      this.adminStudentCourseMenu.innerHTML = '<li class="custom-select-option" style="color: var(--text-muted); pointer-events: none;">No courses created yet</li>';
      if (this.adminStudentCourseDisplay) this.adminStudentCourseDisplay.textContent = 'No courses available';
      if (this.studentCourseInput) this.studentCourseInput.value = '';
    } else {
      let html = '';
      courses.forEach(c => {
        html += `<li class="custom-select-option" data-value="${escapeHtml(c.id)}" role="option">${escapeHtml(c.title)} (${escapeHtml(c.duration)})</li>`;
      });
      this.adminStudentCourseMenu.innerHTML = html;
    }
  }

  // --------------------------------------------------------------------------
  // Student Passport Photo Management (ImageKit)
  // --------------------------------------------------------------------------
  setStudentPhotoError(message) {
    if (!this.studentPhotoError) return;
    this.studentPhotoError.textContent = message || '';
    this.studentPhotoError.style.display = message ? 'block' : 'none';
    this.studentPhotoUploadWrapper?.classList.toggle('input-error', Boolean(message));
  }

  handleStudentPhotoSelection() {
    if (!this.studentPhotoInput) return;
    const file = this.studentPhotoInput.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.setStudentPhotoError('Please select a JPG, JPEG, PNG or WebP passport photo.');
      this.studentPhotoInput.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.setStudentPhotoError('Passport photo must be 2 MB or smaller.');
      this.studentPhotoInput.value = '';
      return;
    }

    this.setStudentPhotoError('');
    this.selectedStudentPhotoFile = file;
    this.photoMarkedForRemoval = false;

    if (this.studentPhotoPreviewImg) {
      this.studentPhotoPreviewImg.src = URL.createObjectURL(file);
      this.studentPhotoPreviewImg.hidden = false;
    }
    if (this.studentPhotoPreviewInitials) {
      this.studentPhotoPreviewInitials.hidden = true;
    }
    if (this.btnClearStudentPhoto) {
      this.btnClearStudentPhoto.hidden = false;
    }
  }

  clearStudentPhoto() {
    if (this.studentPhotoInput) this.studentPhotoInput.value = '';
    this.selectedStudentPhotoFile = null;
    this.photoMarkedForRemoval = true;
    if (this.studentPhotoUrl) this.studentPhotoUrl.value = '';
    if (this.studentImageKitFileId) this.studentImageKitFileId.value = '';
    if (this.studentImageKitFilePath) this.studentImageKitFilePath.value = '';

    if (this.studentPhotoPreviewImg) {
      this.studentPhotoPreviewImg.src = '';
      this.studentPhotoPreviewImg.hidden = true;
    }
    if (this.studentPhotoPreviewInitials) {
      this.studentPhotoPreviewInitials.hidden = false;
      const currentName = this.studentNameInput?.value?.trim() || 'SP';
      this.studentPhotoPreviewInitials.textContent = getInitials(currentName) || 'SP';
    }
    if (this.btnClearStudentPhoto) {
      this.btnClearStudentPhoto.hidden = true;
    }
    this.setStudentPhotoError('');
  }

  async compressStudentPhoto(file) {
    const sourceUrl = URL.createObjectURL(file);
    const image = new Image();
    try {
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error('The selected passport photo could not be processed.'));
        image.src = sourceUrl;
      });

      const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
      let scale = Math.min(1, 800 / longestSide);
      let quality = 0.82;
      let blob = null;

      while (scale >= 0.2) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(160, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(160, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if (!blob) throw new Error('The selected passport photo could not be compressed.');
        if (blob.size <= 50 * 1024) break;

        if (quality > 0.38) quality -= 0.08;
        else {
          scale *= 0.85;
          quality = 0.7;
        }
      }

      if (!blob || blob.size > 50 * 1024) {
        throw new Error('The passport photo could not be reduced below 50 KB. Please choose another image.');
      }

      const baseName = file.name.replace(/\.[^.]+$/, '') || 'passport-photo';
      return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  }

  async uploadStudentPhoto(file, studentId) {
    const uploadFile = await this.compressStudentPhoto(file);

    let authResponse;
    try {
      authResponse = await fetch('/api/imagekit-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isAdmin: true,
          ownerEmail: store.ownerEmail,
          academySlug: store.ownerEmail,
          fileType: uploadFile.type,
          fileSize: uploadFile.size
        })
      });
    } catch {
      throw new Error('Could not connect to photo upload service.');
    }

    const auth = await authResponse.json().catch(() => null);
    if (!authResponse.ok || !auth?.success) {
      throw new Error(auth?.error || 'Could not authorize photo upload.');
    }

    const safeStudentId = String(studentId || 'student').replace(/[^a-zA-Z0-9_-]+/g, '_');
    const fileName = `${safeStudentId}.jpg`;

    const uploadBody = new FormData();
    uploadBody.append('file', uploadFile);
    uploadBody.append('fileName', fileName);
    uploadBody.append('folder', '/academy/student-photos/');
    uploadBody.append('useUniqueFileName', 'false');
    uploadBody.append('overwriteFile', 'true');
    uploadBody.append('publicKey', auth.publicKey);
    uploadBody.append('token', auth.token);
    uploadBody.append('signature', auth.signature);
    uploadBody.append('expire', String(auth.expire));

    let uploadResponse;
    try {
      uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: uploadBody
      });
    } catch {
      throw new Error('Photo could not reach ImageKit. Please check connection.');
    }

    const uploaded = await uploadResponse.json().catch(() => null);
    if (!uploadResponse.ok || !uploaded?.url || !uploaded?.fileId) {
      throw new Error(uploaded?.message || 'Passport photo upload failed.');
    }

    const photoUrl = uploaded.url.includes('?') ? uploaded.url : `${uploaded.url}?updatedAt=${Date.now()}`;

    return {
      photoUrl,
      imageKitFileId: uploaded.fileId,
      imageKitFilePath: uploaded.filePath
    };
  }

  // ==========================================================================
  // Student Modals & Actions (Aligned with Public Registration Fields)
  // ==========================================================================
  openStudentModal(studentId = null) {
    this.studentForm.reset();
    if (this.studentAadharInput) this.studentAadharInput.classList.remove('input-error');
    if (this.studentAadharError) this.studentAadharError.style.display = 'none';
    this.studentPhoneInput.classList.remove('input-error');
    if (this.studentPhoneError) this.studentPhoneError.style.display = 'none';
    if (this.studentPinCodeInput) this.studentPinCodeInput.classList.remove('input-error');
    if (this.studentPinCodeError) this.studentPinCodeError.style.display = 'none';

    this.selectedStudentPhotoFile = null;
    this.photoMarkedForRemoval = false;
    if (this.studentPhotoInput) this.studentPhotoInput.value = '';
    this.setStudentPhotoError('');

    const courses = store.getAllCourses();
    this.populateAdminStudentCourseMenu(courses);

    if (studentId) {
      const student = store.getStudentById(studentId);
      if (!student) return;

      this.studentModalTitle.textContent = 'Edit Student Details';
      this.studentIdInput.value = student.id;
      this.studentNameInput.value = student.name || '';
      this.studentDobInput.value = student.dob || '';
      if (this.studentFatherNameInput) this.studentFatherNameInput.value = student.fatherName || '';
      if (this.studentMotherNameInput) this.studentMotherNameInput.value = student.motherName || '';
      if (this.studentAadharInput) this.studentAadharInput.value = student.aadhar || '';

      // Initialize Photo Preview & Hidden Inputs
      if (this.studentPhotoUrl) this.studentPhotoUrl.value = student.photoUrl || '';
      if (this.studentImageKitFileId) this.studentImageKitFileId.value = student.imageKitFileId || '';
      if (this.studentImageKitFilePath) this.studentImageKitFilePath.value = student.imageKitFilePath || '';

      const initials = getInitials(student.name) || 'SP';
      if (student.photoUrl) {
        if (this.studentPhotoPreviewImg) {
          this.studentPhotoPreviewImg.src = student.photoUrl;
          this.studentPhotoPreviewImg.hidden = false;
        }
        if (this.studentPhotoPreviewInitials) {
          this.studentPhotoPreviewInitials.hidden = true;
        }
        if (this.btnClearStudentPhoto) {
          this.btnClearStudentPhoto.hidden = false;
        }
      } else {
        if (this.studentPhotoPreviewImg) {
          this.studentPhotoPreviewImg.src = '';
          this.studentPhotoPreviewImg.hidden = true;
        }
        if (this.studentPhotoPreviewInitials) {
          this.studentPhotoPreviewInitials.hidden = false;
          this.studentPhotoPreviewInitials.textContent = initials;
        }
        if (this.btnClearStudentPhoto) {
          this.btnClearStudentPhoto.hidden = true;
        }
      }

      this.setAdminDropdownValue(this.adminStudentGenderDropdown, this.adminStudentGenderMenu, this.adminStudentGenderDisplay, this.studentGenderInput, student.gender || '', 'Select Gender');
      this.setAdminDropdownValue(this.adminStudentMaritalStatusDropdown, this.adminStudentMaritalStatusMenu, this.adminStudentMaritalStatusDisplay, this.studentMaritalStatusInput, student.maritalStatus || '', 'Select Marital Status');
      this.setAdminDropdownValue(this.adminStudentCategoryDropdown, this.adminStudentCategoryMenu, this.adminStudentCategoryDisplay, this.studentCategoryInput, student.category || '', 'Select Category');
      this.setAdminDropdownValue(this.adminStudentReligionDropdown, this.adminStudentReligionMenu, this.adminStudentReligionDisplay, this.studentReligionInput, student.religion || '', 'Select Religion');

      this.studentPhoneInput.value = student.phone || '';
      this.studentEmailInput.value = student.email || '';

      // State & District population
      if (student.state) {
        this.populateAdminDistricts(student.state);
        this.setAdminDropdownValue(this.adminStudentStateDropdown, this.adminStudentStateMenu, this.adminStudentStateDisplay, this.studentStateInput, student.state, student.state);
        if (student.district) {
          this.setAdminDropdownValue(this.adminStudentDistrictDropdown, this.adminStudentDistrictMenu, this.adminStudentDistrictDisplay, this.studentDistrictInput, student.district, student.district);
        }
      } else {
        this.setAdminDropdownValue(this.adminStudentStateDropdown, this.adminStudentStateMenu, this.adminStudentStateDisplay, this.studentStateInput, '', 'Select State');
        this.setAdminDropdownValue(this.adminStudentDistrictDropdown, this.adminStudentDistrictMenu, this.adminStudentDistrictDisplay, this.studentDistrictInput, '', 'Select District');
      }

      if (this.studentPinCodeInput) this.studentPinCodeInput.value = student.pinCode || '';
      this.studentAddressInput.value = student.address || '';

      this.setAdminDropdownValue(this.adminStudentQualificationDropdown, this.adminStudentQualificationMenu, this.adminStudentQualificationDisplay, this.studentQualificationInput, student.qualification || '', 'Select Qualification');

      const enrolledId = (student.enrolledCourseIds && student.enrolledCourseIds[0]) || '';
      const courseObj = courses.find(c => c.id === enrolledId);
      const courseLabel = courseObj ? `${courseObj.title} (${courseObj.duration})` : 'Select Course';
      this.setAdminDropdownValue(this.adminStudentCourseDropdown, this.adminStudentCourseMenu, this.adminStudentCourseDisplay, this.studentCourseInput, enrolledId, courseLabel);
      this.setAdminDropdownValue(this.adminStudentStatusDropdown, this.adminStudentStatusMenu, this.adminStudentStatusDisplay, this.studentStatusSelect, student.status || 'Active', student.status || 'Active');
      if (this.studentDobInput) this.studentDobInput.classList.toggle('has-value', Boolean(this.studentDobInput.value));
      if (this.btnDeleteStudentModal) this.btnDeleteStudentModal.style.display = 'inline-flex';
    } else {
      this.studentModalTitle.textContent = 'Add New Student';
      this.studentIdInput.value = '';
      this.studentNameInput.value = '';
      this.studentDobInput.value = '';
      if (this.studentDobInput) this.studentDobInput.classList.remove('has-value');
      if (this.studentFatherNameInput) this.studentFatherNameInput.value = '';
      if (this.studentMotherNameInput) this.studentMotherNameInput.value = '';
      if (this.studentAadharInput) this.studentAadharInput.value = '';

      if (this.studentPhotoUrl) this.studentPhotoUrl.value = '';
      if (this.studentImageKitFileId) this.studentImageKitFileId.value = '';
      if (this.studentImageKitFilePath) this.studentImageKitFilePath.value = '';
      if (this.studentPhotoPreviewImg) {
        this.studentPhotoPreviewImg.src = '';
        this.studentPhotoPreviewImg.hidden = true;
      }
      if (this.studentPhotoPreviewInitials) {
        this.studentPhotoPreviewInitials.hidden = false;
        this.studentPhotoPreviewInitials.textContent = 'SP';
      }
      if (this.btnClearStudentPhoto) {
        this.btnClearStudentPhoto.hidden = true;
      }

      this.setAdminDropdownValue(this.adminStudentGenderDropdown, this.adminStudentGenderMenu, this.adminStudentGenderDisplay, this.studentGenderInput, '', 'Select Gender');
      this.setAdminDropdownValue(this.adminStudentMaritalStatusDropdown, this.adminStudentMaritalStatusMenu, this.adminStudentMaritalStatusDisplay, this.studentMaritalStatusInput, '', 'Select Marital Status');
      this.setAdminDropdownValue(this.adminStudentCategoryDropdown, this.adminStudentCategoryMenu, this.adminStudentCategoryDisplay, this.studentCategoryInput, '', 'Select Category');
      this.setAdminDropdownValue(this.adminStudentReligionDropdown, this.adminStudentReligionMenu, this.adminStudentReligionDisplay, this.studentReligionInput, '', 'Select Religion');
      this.studentPhoneInput.value = '';
      this.studentEmailInput.value = '';
      this.setAdminDropdownValue(this.adminStudentStateDropdown, this.adminStudentStateMenu, this.adminStudentStateDisplay, this.studentStateInput, '', 'Select State');
      this.setAdminDropdownValue(this.adminStudentDistrictDropdown, this.adminStudentDistrictMenu, this.adminStudentDistrictDisplay, this.studentDistrictInput, '', 'Select District');
      if (this.adminStudentDistrictMenu) this.adminStudentDistrictMenu.innerHTML = '';
      if (this.studentPinCodeInput) this.studentPinCodeInput.value = '';
      this.studentAddressInput.value = '';
      this.setAdminDropdownValue(this.adminStudentQualificationDropdown, this.adminStudentQualificationMenu, this.adminStudentQualificationDisplay, this.studentQualificationInput, '', 'Select Qualification');
      this.setAdminDropdownValue(this.adminStudentCourseDropdown, this.adminStudentCourseMenu, this.adminStudentCourseDisplay, this.studentCourseInput, '', 'Select Course');
      this.setAdminDropdownValue(this.adminStudentStatusDropdown, this.adminStudentStatusMenu, this.adminStudentStatusDisplay, this.studentStatusSelect, 'Active', 'Active');
      if (this.btnDeleteStudentModal) this.btnDeleteStudentModal.style.display = 'none';
    }

    this.openModal(this.studentModal);
  }

  async handleStudentFormSubmit(e) {
    e.preventDefault();

    const id = this.studentIdInput.value;
    const rawName = this.studentNameInput.value.trim();
    const name = toTitleCase(rawName);
    const dob = this.studentDobInput.value;
    const rawFatherName = this.studentFatherNameInput ? this.studentFatherNameInput.value.trim() : '';
    const fatherName = toTitleCase(rawFatherName);
    const rawMotherName = this.studentMotherNameInput ? this.studentMotherNameInput.value.trim() : '';
    const motherName = toTitleCase(rawMotherName);
    const aadhar = this.studentAadharInput ? this.studentAadharInput.value.trim().replace(/\D/g, '') : '';
    const gender = this.studentGenderInput.value.trim();
    const maritalStatus = this.studentMaritalStatusInput.value.trim();
    const category = this.studentCategoryInput.value.trim();
    const religion = this.studentReligionInput.value.trim();
    const phone = this.studentPhoneInput.value.trim().replace(/\D/g, '');
    const email = this.studentEmailInput.value.trim();
    const state = this.studentStateInput.value.trim();
    const district = this.studentDistrictInput.value.trim();
    const pinCode = this.studentPinCodeInput ? this.studentPinCodeInput.value.trim().replace(/\D/g, '') : '';
    const address = this.studentAddressInput.value.trim();
    const qualification = this.studentQualificationInput.value.trim();
    const courseId = this.studentCourseInput.value.trim();
    const status = this.studentStatusSelect.value;

    if (
      !name || !dob || !fatherName || !motherName || !aadhar || !gender ||
      !maritalStatus || !category || !religion || !phone || !email ||
      !state || !district || !pinCode || !qualification || !address || !courseId
    ) {
      this.showToast('Validation Error', 'Please complete all required student fields.', 'error');
      return;
    }

    // Strict 12-Digit Aadhar Number Validation
    if (aadhar.length !== 12 || !/^\d{12}$/.test(aadhar)) {
      if (this.studentAadharInput) this.studentAadharInput.classList.add('input-error');
      if (this.studentAadharError) {
        this.studentAadharError.textContent = 'Please enter a valid 12-digit Aadhar number.';
        this.studentAadharError.style.display = 'block';
      }
      if (this.studentAadharInput) this.studentAadharInput.focus();
      this.showToast('Validation Error', 'Aadhar number must contain exactly 12 digits.', 'error');
      return;
    }

    // Strict 10-Digit Mobile Number Validation
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      this.studentPhoneInput.classList.add('input-error');
      if (this.studentPhoneError) {
        this.studentPhoneError.textContent = 'Please enter a valid 10-digit mobile number.';
        this.studentPhoneError.style.display = 'block';
      }
      this.studentPhoneInput.focus();
      this.showToast('Validation Error', 'Mobile number must contain exactly 10 digits.', 'error');
      return;
    }

    // Strict 6-Digit PIN Code Validation
    if (pinCode.length !== 6 || !/^\d{6}$/.test(pinCode)) {
      if (this.studentPinCodeInput) this.studentPinCodeInput.classList.add('input-error');
      if (this.studentPinCodeError) {
        this.studentPinCodeError.textContent = 'Please enter a valid 6-digit pin code.';
        this.studentPinCodeError.style.display = 'block';
      }
      if (this.studentPinCodeInput) this.studentPinCodeInput.focus();
      this.showToast('Validation Error', 'Pin code must be exactly 6 digits.', 'error');
      return;
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email)) {
      this.studentEmailInput.classList.add('input-error');
      if (this.studentEmailError) {
        this.studentEmailError.textContent = 'Please enter an email in the format name@domain.extension.';
        this.studentEmailError.style.display = 'block';
      }
      this.studentEmailInput.focus();
      this.showToast('Validation Error', 'Please enter an email in the format name@domain.extension.', 'error');
      return;
    }

    const saveBtn = this.btnSaveStudent || this.studentForm.querySelector('button[type="submit"]');
    setButtonLoading(saveBtn, true);

    let photoUrl = this.studentPhotoUrl?.value || '';
    let imageKitFileId = this.studentImageKitFileId?.value || '';
    let imageKitFilePath = this.studentImageKitFilePath?.value || '';

    // Handle photo upload if a new file was chosen
    if (this.selectedStudentPhotoFile) {
      try {
        const uploadResult = await this.uploadStudentPhoto(this.selectedStudentPhotoFile, id || 'temp');
        photoUrl = uploadResult.photoUrl;
        imageKitFileId = uploadResult.imageKitFileId;
        imageKitFilePath = uploadResult.imageKitFilePath;
      } catch (uploadError) {
        setButtonLoading(saveBtn, false);
        this.setStudentPhotoError(uploadError.message || 'Passport photo upload failed.');
        this.showToast('Upload Error', uploadError.message || 'Photo upload failed. Please try again.', 'error');
        return;
      }
    } else if (this.photoMarkedForRemoval) {
      photoUrl = '';
      imageKitFileId = '';
      imageKitFilePath = '';
    }

    const payload = {
      name,
      dob,
      fatherName,
      motherName,
      aadhar,
      gender,
      maritalStatus,
      category,
      religion,
      phone,
      email,
      state,
      district,
      pinCode,
      address,
      qualification,
      status,
      enrolledCourseIds: [courseId],
      photoUrl,
      imageKitFileId,
      imageKitFilePath
    };

    // For new students, stamp the registration date now.
    // For existing students, joinDate is intentionally excluded from the payload
    // so updateStudent never overwrites the original registration date.
    if (!id) {
      payload.joinDate = new Date().toISOString().split('T')[0];
    }

    try {
      if (id) {
        await store.updateStudent(id, payload);
        this.showToast('Student Updated', `${name}'s records have been updated.`, 'success');
        if (this.currentViewingStudentId === id) {
          this.viewStudentProfile(id);
        }
      } else {
        const newStudent = await store.addStudent(payload);
        this.showToast('Student Added', `${newStudent.name} (ID: ${newStudent.id}) registered successfully.`, 'success');
      }
      this.closeModal(this.studentModal);
      this.render();
    } catch (error) {
      this.showToast('Registration Error', error.message || 'The student could not be added.', 'error');
    } finally {
      setButtonLoading(saveBtn, false);
    }
  }

  viewStudentProfile(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    this.currentViewingStudentId = student.id;
    const courses = store.getAllCourses();
    const initials = getInitials(student.name);
    const gradient = getAvatarGradient(student.name);

    const enrolledCourses = (student.enrolledCourseIds || []).map(cid => {
      const c = courses.find(item => item.id === cid);
      if (!c) return null;
      return `<span class="value">${escapeHtml(c.title)}${c.duration ? ` (${escapeHtml(c.duration)})` : ''}</span>`;
    }).filter(Boolean).join('');

    this.studentDetailsContent.innerHTML = `
      <div class="profile-detail-header">
        <div class="profile-avatar-large${student.photoUrl ? ' has-photo' : ''}" style="background: ${gradient}">
          ${student.photoUrl ? `<img src="${escapeHtml(student.photoUrl)}" alt="Passport photo of ${escapeHtml(student.name)}" onerror="this.hidden=true; this.nextElementSibling.hidden=false; this.parentElement.classList.remove('has-photo')">` : ''}
          <span${student.photoUrl ? ' hidden' : ''}>${initials}</span>
        </div>
        <div class="profile-info">
          <h3>${escapeHtml(student.name)}</h3>
          <p>Student ID: <strong>${escapeHtml(student.id)}</strong></p>
          <span class="badge ${getStatusBadgeClass(student.status)}">
            ${getStatusBadgeIcon(student.status)} ${escapeHtml(student.status === 'Active' ? 'On going' : student.status)}
          </span>
        </div>
      </div>

      <div class="profile-meta-card">
        <span class="label"><i class="fa-solid fa-book-open"></i> ENROLLED COURSE</span>
        ${enrolledCourses || '<span class="value">No courses currently enrolled.</span>'}
      </div>

      <div class="profile-meta-grid">
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-user-tie"></i> Father's Name</span>
          <span class="value">${escapeHtml(student.fatherName || '—')}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-person-breastfeeding"></i> Mother's Name</span>
          <span class="value">${escapeHtml(student.motherName || '—')}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-id-card"></i> Aadhar Number</span>
          <span class="value">${escapeHtml(formatAadhar(student.aadhar))}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-regular fa-envelope"></i> Email Address</span>
          <span class="value">${escapeHtml(student.email)}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-phone"></i> Mobile Number</span>
          <span class="value">${escapeHtml(student.phone)}</span>
        </div>
        ${student.dob ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-regular fa-calendar"></i> Date of Birth</span>
            <span class="value">${formatDate(student.dob)}</span>
          </div>
        ` : ''}
        ${student.gender ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-venus-mars"></i> Gender</span>
            <span class="value">${escapeHtml(student.gender)}</span>
          </div>
        ` : ''}
        ${student.maritalStatus ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-ring"></i> Marital Status</span>
            <span class="value">${escapeHtml(student.maritalStatus)}</span>
          </div>
        ` : ''}
        ${student.category ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-layer-group"></i> Category</span>
            <span class="value">${escapeHtml(student.category)}</span>
          </div>
        ` : ''}
        ${student.religion ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-hands-praying"></i> Religion</span>
            <span class="value">${escapeHtml(student.religion)}</span>
          </div>
        ` : ''}
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-map-location-dot"></i> State & District</span>
          <span class="value">${escapeHtml(student.district ? `${student.district}, ${student.state}` : (student.state || '—'))}</span>
        </div>
        <div class="profile-meta-card">
          <span class="label"><i class="fa-solid fa-map-pin"></i> Pin Code</span>
          <span class="value">${escapeHtml(student.pinCode || '—')}</span>
        </div>
        ${student.qualification ? `
          <div class="profile-meta-card">
            <span class="label"><i class="fa-solid fa-award"></i> Highest Qualification</span>
            <span class="value">${escapeHtml(student.qualification)}</span>
          </div>
        ` : ''}
        <div class="profile-meta-card">
          <span class="label"><i class="fa-regular fa-calendar-check"></i> Registration Date</span>
          <span class="value">${formatDate(student.joinDate)}</span>
        </div>
      </div>

      ${student.address ? `
        <div style="margin-top: 1rem; padding: 0.875rem 1rem; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: flex; align-items: center; gap: 0.35rem;">
            <i class="fa-solid fa-location-dot"></i> Full Address
          </span>
          <p style="font-size: 0.875rem; color: var(--text-main); margin-top: 0.25rem;">${escapeHtml(student.address)}</p>
        </div>
      ` : ''}

    `;

    this.openModal(this.studentDetailsModal);
  }

  confirmDeleteStudent(studentId) {
    const student = store.getStudentById(studentId);
    if (!student) return;

    this.promptConfirmation({
      title: 'Delete Student Record?',
      message: `Are you sure you want to delete "${student.name}" (ID: ${student.id})? This action cannot be undone.`,
      action: () => {
        this.selectedStudentIds.delete(studentId);
        store.deleteStudent(studentId);
        this.render();
        this.showToast('Student Deleted', `${student.name} was removed from the registry.`, 'info');
      }
    });
  }

  // ==========================================================================
  // Course Modals & Actions (Only 3 Fields: Name, Duration, Description)
  // ==========================================================================
  openCourseModal(courseId = null) {
    this.courseForm.reset();
    if (this.durationUnitDropdown) {
      this.durationUnitDropdown.classList.remove('open');
      if (this.durationUnitTrigger) this.durationUnitTrigger.setAttribute('aria-expanded', 'false');
    }

    if (courseId) {
      const course = store.getCourseById(courseId);
      if (!course) return;

      this.courseModalTitle.textContent = 'Edit Course';
      this.courseIdInput.value = course.id;
      this.courseTitleInput.value = course.title;
      
      const parsed = parseDuration(course.duration);
      this.courseDurationValueInput.value = parsed.value;
      this.setDurationUnit(parsed.unit);

      this.courseDescriptionInput.value = course.description || '';
    } else {
      this.courseModalTitle.textContent = 'Add New Course';
      this.courseIdInput.value = '';
      this.courseDurationValueInput.value = '';
      this.setDurationUnit('Months');
    }

    this.openModal(this.courseModal);
  }

  async handleCourseFormSubmit(e) {
    e.preventDefault();

    const id = this.courseIdInput.value;
    const title = this.courseTitleInput.value.trim();
    const durationVal = this.courseDurationValueInput.value.trim();
    const durationUnit = this.courseDurationUnitInput ? this.courseDurationUnitInput.value : 'Months';
    const description = this.courseDescriptionInput.value.trim();

    if (!title || !durationVal || !description) {
      this.showToast('Validation Error', 'Please complete all course fields.', 'error');
      return;
    }

    const num = parseFloat(durationVal);
    let unitText = durationUnit;
    if (num === 1) {
      unitText = durationUnit === 'Years' ? 'Year' : 'Month';
    } else {
      unitText = durationUnit === 'Years' ? 'Years' : 'Months';
    }
    const duration = `${durationVal} ${unitText}`;

    const saveBtn = this.btnSaveCourse || this.courseForm.querySelector('button[type="submit"]');
    setButtonLoading(saveBtn, true);

    const payload = {
      title,
      duration,
      description
    };

    try {
      if (id) {
        await store.updateCourse(id, payload);
        this.showToast('Course Updated', `"${title}" has been updated.`, 'success');
      } else {
        const newCourse = await store.addCourse(payload);
        this.showToast('Course Created', `"${newCourse.title}" was created successfully.`, 'success');
      }
      this.closeModal(this.courseModal);
      this.render();
    } catch (error) {
      this.showToast('Course Error', error.message || 'Failed to save course.', 'error');
    } finally {
      setButtonLoading(saveBtn, false);
    }
  }

  confirmDeleteCourse(courseId) {
    const course = store.getCourseById(courseId);
    if (!course) return;

    const enrolledCount = store.getCourseEnrollmentCount(courseId);
    const extraMsg = enrolledCount > 0 
      ? ` Note: ${enrolledCount} student(s) currently enrolled in this course will be automatically un-enrolled.` 
      : '';

    this.promptConfirmation({
      title: 'Delete Course?',
      message: `Are you sure you want to delete "${course.title}"?${extraMsg}`,
      action: () => {
        store.deleteCourse(courseId);
        this.render();
        this.showToast('Course Deleted', `"${course.title}" was removed.`, 'info');
      }
    });
  }

  // ==========================================================================
  // Confirmation Modal & Generic Dialog
  // ==========================================================================
  promptConfirmation({ title, message, action }) {
    this.confirmTitle.textContent = title;
    this.confirmMessage.textContent = message;
    this.confirmCallback = action;
    this.openModal(this.confirmModal);
  }

  openModal(modalElement) {
    this.closeAllAdminDropdowns();
    modalElement.classList.add('open');
    document.body.style.overflow = 'hidden';
    const dialog = modalElement.querySelector('.modal-window') || modalElement;
    dialog.setAttribute('tabindex', '-1');
    dialog.focus({ preventScroll: true });
  }

  closeModal(modalElement) {
    this.closeAllAdminDropdowns();
    if (modalElement === this.completionModal) {
      this.pendingCertificateDownloadIds = null;
    }
    modalElement.classList.remove('open');
    if (document.querySelectorAll('.modal-backdrop.open').length === 0) {
      document.body.style.overflow = '';
    }
  }

  // ==========================================================================
  // Bulk Student Completion & Selection Methods
  // ==========================================================================
  handleSelectAllStudents(isChecked) {
    const allStudents = store.getAllStudents();
    const filteredStudents = allStudents.filter(student => {
      const query = this.studentSearchQuery;
      const matchesSearch = !query ||
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.phone.toLowerCase().includes(query);

      const matchesCourse = this.studentCourseFilterVal === 'all' ||
        (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(this.studentCourseFilterVal));

      const matchesStatus = this.studentStatusFilterVal === 'all' ||
        student.status === this.studentStatusFilterVal;

      return matchesSearch && matchesCourse && matchesStatus;
    });

    if (isChecked) {
      filteredStudents.forEach(s => this.selectedStudentIds.add(s.id));
    } else {
      filteredStudents.forEach(s => this.selectedStudentIds.delete(s.id));
    }

    // Update row checkbox DOM inputs and selected styling
    if (this.studentsTableBody) {
      const checkboxes = this.studentsTableBody.querySelectorAll('.student-row-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = isChecked;
        const row = cb.closest('tr');
        if (row) row.classList.toggle('is-selected', isChecked);
      });
    }

    this.updateBulkActionState(filteredStudents);
  }

  deselectAllStudents() {
    if (!this.selectedStudentIds || this.selectedStudentIds.size === 0) return;
    this.selectedStudentIds.clear();

    if (this.studentsTableBody) {
      const checkboxes = this.studentsTableBody.querySelectorAll('.student-row-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = false;
        const row = cb.closest('tr');
        if (row) row.classList.remove('is-selected');
      });
    }

    if (this.selectAllStudentsCheckbox) {
      this.selectAllStudentsCheckbox.checked = false;
      this.selectAllStudentsCheckbox.indeterminate = false;
    }

    this.updateBulkActionState();
  }

  deselectAllMessages() {
    if (!this.selectedInboxMessageIds || this.selectedInboxMessageIds.size === 0) return;
    this.selectedInboxMessageIds.clear();

    if (this.inboxList) {
      const checkboxes = this.inboxList.querySelectorAll('.inbox-row-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = false;
        const row = cb.closest('.inbox-row');
        if (row) row.classList.remove('is-selected');
      });
    }

    if (this.selectAllInboxCheckbox) {
      this.selectAllInboxCheckbox.checked = false;
      this.selectAllInboxCheckbox.indeterminate = false;
    }

    this.updateInboxBulkActionState();
  }

  updateBulkActionState(filteredStudents) {
    if (!filteredStudents) {
      const allStudents = store.getAllStudents();
      filteredStudents = allStudents.filter(student => {
        const query = this.studentSearchQuery;
        const matchesSearch = !query ||
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query) ||
          student.phone.toLowerCase().includes(query);

        const matchesCourse = this.studentCourseFilterVal === 'all' ||
          (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.includes(this.studentCourseFilterVal));

        const matchesStatus = this.studentStatusFilterVal === 'all' ||
          student.status === this.studentStatusFilterVal;

        return matchesSearch && matchesCourse && matchesStatus;
      });
    }

    if (this.selectAllStudentsCheckbox) {
      if (filteredStudents.length === 0) {
        this.selectAllStudentsCheckbox.checked = false;
        this.selectAllStudentsCheckbox.indeterminate = false;
      } else {
        const selectedVisibleCount = filteredStudents.filter(s => this.selectedStudentIds.has(s.id)).length;
        const allSelected = selectedVisibleCount === filteredStudents.length && filteredStudents.length > 0;
        const someSelected = selectedVisibleCount > 0 && selectedVisibleCount < filteredStudents.length;

        this.selectAllStudentsCheckbox.checked = allSelected;
        this.selectAllStudentsCheckbox.indeterminate = someSelected;
      }
    }

    if (this.btnBulkMarkCompleted) {
      const selectedCount = this.selectedStudentIds.size;
      const selectedStudents = Array.from(this.selectedStudentIds)
        .map(id => store.getStudentById(id))
        .filter(Boolean);
      const hasActiveStudent = selectedStudents.some(
        s => String(s?.status || '').toLowerCase() !== 'completed'
      );
      const hasCompletedStudent = selectedStudents.some(
        s => String(s?.status || '').toLowerCase() === 'completed'
      );
      const allCompleted = selectedStudents.length > 0 && !hasActiveStudent;

      this.btnBulkMarkCompleted.disabled = selectedCount === 0 || allCompleted;
      if (this.bulkMarkCompletedLabel) {
        this.bulkMarkCompletedLabel.textContent = 'Mark as Completed';
      }
      if (selectedCount === 0) {
        this.btnBulkMarkCompleted.title = 'Select students to mark as completed';
      } else if (allCompleted) {
        this.btnBulkMarkCompleted.title = 'Selected student(s) are already marked as completed';
      } else if (hasCompletedStudent) {
        this.btnBulkMarkCompleted.title = 'Mark as completed and merge completion data for all selected students';
      } else {
        this.btnBulkMarkCompleted.title = 'Mark selected students as Course Completed';
      }
    }

    if (this.btnStudentMoreActions) {
      const selectedCount = this.selectedStudentIds.size;
      this.btnStudentMoreActions.disabled = selectedCount === 0;
      if (selectedCount === 0) {
        this.studentMoreActionsMenu?.classList.remove('open');
        this.btnStudentMoreActions.setAttribute('aria-expanded', 'false');
      }
    }

    const currentSelectionCount = this.selectedStudentIds.size;
    if (this.labelMoreDownloadCert) {
      this.labelMoreDownloadCert.textContent = currentSelectionCount > 1 ? 'Download Certificates' : 'Download Certificate';
    }
    if (this.labelMoreChangeStatus) {
      this.labelMoreChangeStatus.textContent = 'Change Status';
    }
    if (this.labelMoreDeleteStudent) {
      this.labelMoreDeleteStudent.textContent = currentSelectionCount > 1 ? 'Delete Students' : 'Delete Student';
    }

    if (this.studentSelectionCount) {
      const selectedCount = this.selectedStudentIds.size;
      this.studentSelectionCount.textContent = selectedCount;
      this.studentSelectionCount.hidden = selectedCount === 0;
    }

    if (this.btnCreateBatch) {
      const hasSelectedStudents = this.selectedStudentIds.size > 0;
      this.btnCreateBatch.disabled = !hasSelectedStudents;
      if (!hasSelectedStudents) {
        this.batchActionMenu?.classList.remove('open');
        this.btnCreateBatch.setAttribute('aria-expanded', 'false');
      }
    }
  }

  handleBulkMarkCompleted(batchId = null, studentIds = null) {
    this.completionStudentIds = new Set(studentIds || this.selectedStudentIds);
    const selectedCount = this.completionStudentIds.size;
    if (selectedCount === 0) return;

    const targetStudents = Array.from(this.completionStudentIds)
      .map(id => store.getStudentById(id))
      .filter(Boolean);
    const hasActiveStudent = targetStudents.some(
      s => String(s?.status || '').toLowerCase() !== 'completed'
    );

    if (!batchId && targetStudents.length > 0 && !hasActiveStudent) {
      this.showToast('Already Completed', 'Selected student(s) are already marked as completed.', 'warning');
      return;
    }

    this.completingBatchId = batchId;
    this.completionSubmitted = false;
    this.completionForm.reset();
    [
      [this.completionStartMonthDropdown, this.completionStartMonthMenu, this.completionStartMonthDisplay, this.completionStartMonth, 'Month', this.completionStartMonthTrigger],
      [this.completionStartYearDropdown, this.completionStartYearMenu, this.completionStartYearDisplay, this.completionStartYear, 'Year', this.completionStartYearTrigger],
      [this.completionEndMonthDropdown, this.completionEndMonthMenu, this.completionEndMonthDisplay, this.completionEndMonth, 'Month', this.completionEndMonthTrigger],
      [this.completionEndYearDropdown, this.completionEndYearMenu, this.completionEndYearDisplay, this.completionEndYear, 'Year', this.completionEndYearTrigger]
    ].forEach(([container, menu, display, input, label, trigger]) => {
      this.setAdminDropdownValue(container, menu, display, input, '', label);
      trigger.classList.remove('input-error');
    });
    this.validateCompletionPeriodSelection();
    this.completionModalTitle.textContent = selectedCount === 1 ? 'Complete Student Course' : 'Complete Student Courses';

    const activeStudents = targetStudents.filter(s => String(s?.status || '').toLowerCase() !== 'completed');
    const completedStudents = targetStudents.filter(s => String(s?.status || '').toLowerCase() === 'completed');

    if (activeStudents.length > 0 && completedStudents.length > 0) {
      this.completionStudentCount.textContent = `These certificate details will complete ${activeStudents.length} active student(s) and be merged to ${completedStudents.length} already completed student(s).`;
    } else if (selectedCount === 1) {
      this.completionStudentCount.textContent = 'Enter the certificate details for the selected student.';
    } else {
      this.completionStudentCount.textContent = `These certificate details will be applied to all ${selectedCount} selected students.`;
    }

    this.openModal(this.completionModal);
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    window.setTimeout(() => {
      if (this.completionModal && this.completionModal.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    }, 50);
  }

  async handleCompletionSubmit(e) {
    e.preventDefault();
    const studentIds = Array.from(this.completionStudentIds);
    if (studentIds.length === 0) {
      this.closeModal(this.completionModal);
      return;
    }

    const startMonth = this.getCompletionPeriodValue(this.completionStartMonth, this.completionStartYear);
    const endMonth = this.getCompletionPeriodValue(this.completionEndMonth, this.completionEndYear);
    const issueDate = this.completionIssueDate.value;
    const grade = this.completionGrade.value.trim().toUpperCase();
    this.completionSubmitted = true;
    if (!this.validateCompletionDates()) {
      this.completionForm.querySelector('.input-error:not(:disabled)')?.focus();
      return;
    }

    const submitBtn = this.btnConfirmCompletion || this.completionForm?.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);
    if (this.btnCancelCompletion) this.btnCancelCompletion.disabled = true;
    if (this.btnCloseCompletionModal) this.btnCloseCompletionModal.disabled = true;

    try {
      const allStudentsBefore = store.getAllStudents();
      const activeCount = studentIds.filter(id => {
        const s = allStudentsBefore.find(item => item.id === id);
        return s && String(s.status || '').toLowerCase() !== 'completed';
      }).length;
      const completedCount = studentIds.length - activeCount;

      await store.bulkUpdateStudents(studentIds, {
        status: 'Completed',
        certificateCourseStartDate: `${startMonth}-01`,
        certificateCourseEndDate: `${endMonth}-01`,
        certificateIssueDate: issueDate,
        completionDate: `${endMonth}-01`,
        grade
      });
      const completedFromBatch = Boolean(this.completingBatchId);
      if (completedFromBatch) {
        const batch = store.getAllBatches().find(item => item.id === this.completingBatchId);
        if (batch) await store.saveBatch({ ...batch, status: 'Completed', completedAt: new Date().toISOString(), certificateIssueDate: issueDate, grade });
      }
      const shouldDownloadAfterCompletion = Boolean(this.pendingCertificateDownloadIds && this.pendingCertificateDownloadIds.length > 0);
      const downloadIds = shouldDownloadAfterCompletion ? [...this.pendingCertificateDownloadIds] : null;
      this.pendingCertificateDownloadIds = null;
      this.completingBatchId = null;
      this.completionStudentIds.clear();
      this.closeModal(this.completionModal);

      if (activeCount > 0 && completedCount > 0) {
        this.showToast('Course Completed', `Successfully completed ${activeCount} student(s) and merged completion data to ${completedCount} completed student(s). Certificates are now available.`, 'success');
      } else {
        this.showToast('Course Completed', `Successfully marked ${studentIds.length} student(s) as Completed. Certificates are now available.`, 'success');
      }

      if (!completedFromBatch) this.selectedStudentIds.clear();
      this.render();

      if (shouldDownloadAfterCompletion && downloadIds) {
        await this.executeCertificateDownload(downloadIds);
      }
    } catch (err) {
      console.error('[Completion Error]:', err);
      this.showToast('Completion Error', 'Failed to complete the course. Please try again.', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
      if (this.btnCancelCompletion) this.btnCancelCompletion.disabled = false;
      if (this.btnCloseCompletionModal) this.btnCloseCompletionModal.disabled = false;
    }
  }

  async handleMoreDownloadCertificates() {
    const selectedIds = Array.from(this.selectedStudentIds);
    if (selectedIds.length === 0) return;

    const students = selectedIds.map(id => store.getStudentById(id)).filter(Boolean);
    if (students.length === 0) return;

    // Check if any selected student is not completed
    const hasIncomplete = students.some(s => s.status !== 'Completed');

    if (hasIncomplete) {
      this.pendingCertificateDownloadIds = selectedIds;
      this.handleBulkMarkCompleted(null, selectedIds);
      this.completionModalTitle.textContent = selectedIds.length === 1 ? 'Complete Course & Download Certificate' : 'Complete Courses & Download Certificates';
      this.completionStudentCount.textContent = selectedIds.length === 1
        ? 'Enter the completion details before downloading the certificate.'
        : `These certificate details will be applied to all ${selectedIds.length} selected students before downloading.`;
    } else {
      await this.executeCertificateDownload(selectedIds);
    }
  }

  async executeCertificateDownload(studentIds) {
    const students = studentIds.map(id => store.getStudentById(id)).filter(Boolean);
    if (students.length === 0) return;

    if (students.length > 1 && typeof window.JSZip === 'undefined') {
      this.showToast('ZIP Library Loading', 'Compression library is loading. Please try again in a few seconds.', 'info');
      return;
    }

    const btn = this.btnStudentMoreActions;
    const originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i>`;
    }

    try {
      this.showToast('Generating Certificates', `Generating ${students.length} certificate(s)...`, 'info');

      let templateImg;
      try {
        templateImg = await loadCertificateImage('assets/diganta-certificate-template.jpg');
      } catch (e) {
        templateImg = await loadCertificateImage('https://ik.imagekit.io/d3ycnoiwd/academy/student-certificate/diganta-certificate-template.jpg');
      }

      if (students.length === 1) {
        const student = students[0];
        const course = store.getCourseById(student.courseId || student.enrolledCourseIds?.[0]);
        const batch = store.getAllBatches().find(b => (b.studentIds || []).includes(student.id)) || {};
        const pngBlob = await this.generateStudentCertificatePng(student, course, batch, templateImg);
        if (!pngBlob) throw new Error('Failed to generate PNG blob');

        const safeName = (student.name || student.fullName || 'student').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
        const safeId = String(student.id || '').replace(/[^a-zA-Z0-9_-]/g, '-');
        const filename = `Certificate-${safeId}-${safeName}.png`;

        const downloadUrl = URL.createObjectURL(pngBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadUrl);

        this.showToast('Download Complete', `Certificate downloaded for ${student.name}.`, 'success');
      } else {
        const zip = new window.JSZip();
        let successCount = 0;

        for (const student of students) {
          const course = store.getCourseById(student.courseId || student.enrolledCourseIds?.[0]);
          const batch = store.getAllBatches().find(b => (b.studentIds || []).includes(student.id)) || {};
          const pngBlob = await this.generateStudentCertificatePng(student, course, batch, templateImg);
          if (pngBlob) {
            successCount++;
            const safeName = (student.name || student.fullName || 'student').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
            const safeId = String(student.id || '').replace(/[^a-zA-Z0-9_-]/g, '-');
            zip.file(`Certificate-${safeId}-${safeName}.png`, pngBlob);
          }
        }

        const zipBlob = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });

        const filename = `Certificates-${students.length}-Students.zip`;
        const downloadUrl = URL.createObjectURL(zipBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadUrl);

        this.showToast('Download Complete', `Downloaded ${successCount} certificates in ZIP format.`, 'success');
      }
    } catch (err) {
      console.error('[Certificate Download Error]:', err);
      this.showToast('Download Error', 'Failed to generate certificate(s). Check console for details.', 'error');
    } finally {
      if (btn) {
        btn.disabled = this.selectedStudentIds.size === 0;
        btn.innerHTML = originalHtml;
      }
    }
  }

  openBulkStatusModal() {
    const selectedIds = Array.from(this.selectedStudentIds);
    const count = selectedIds.length;
    if (count === 0) return;

    this.bulkStatusModalTitle.textContent = count === 1 ? 'Change Student Status' : 'Change Student Statuses';
    this.bulkStatusModalSubtitle.textContent = count === 1
      ? 'Select a new status for the selected student.'
      : `Select a new status for all ${count} selected students.`;

    const firstStudent = store.getStudentById(selectedIds[0]);
    const initialStatus = (count === 1 && firstStudent?.status) ? firstStudent.status : 'Active';
    this.setAdminDropdownValue(
      this.bulkStatusDropdown,
      this.bulkStatusMenu,
      this.bulkStatusDisplay,
      this.bulkStatusSelect,
      initialStatus,
      initialStatus
    );

    this.openModal(this.bulkStatusModal);
  }

  async handleBulkStatusSubmit(e) {
    e.preventDefault();
    const studentIds = Array.from(this.selectedStudentIds);
    if (studentIds.length === 0) {
      this.closeModal(this.bulkStatusModal);
      return;
    }

    const newStatus = this.bulkStatusSelect.value;
    if (newStatus === 'Completed') {
      this.closeModal(this.bulkStatusModal);
      this.handleBulkMarkCompleted(null, studentIds);
      return;
    }

    const submitBtn = this.bulkStatusForm?.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);
    try {
      await store.bulkUpdateStudents(studentIds, { status: newStatus });
      this.closeModal(this.bulkStatusModal);
      this.showToast('Status Updated', `Successfully updated ${studentIds.length} student(s) to ${newStatus}.`, 'success');
      this.selectedStudentIds.clear();
      this.render();
    } catch (err) {
      this.showToast('Status Error', err.message || 'Failed to update status.', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  }

  handleMoreDeleteStudents() {
    const selectedIds = Array.from(this.selectedStudentIds);
    const count = selectedIds.length;
    if (count === 0) return;

    if (count === 1) {
      const student = store.getStudentById(selectedIds[0]);
      if (!student) return;
      this.promptConfirmation({
        title: 'Delete Student Record?',
        message: `Are you sure you want to delete "${student.name}" (ID: ${student.id})? This action cannot be undone.`,
        action: () => {
          this.selectedStudentIds.delete(student.id);
          store.deleteStudent(student.id);
          this.render();
          this.showToast('Student Deleted', `${student.name} was removed from the registry.`, 'info');
        }
      });
    } else {
      this.promptConfirmation({
        title: `Delete ${count} Students?`,
        message: `Are you sure you want to delete ${count} selected student records? This action cannot be undone.`,
        action: () => {
          store.bulkDeleteStudents(selectedIds);
          this.selectedStudentIds.clear();
          this.render();
          this.showToast('Students Deleted', `${count} students were removed from the registry.`, 'info');
        }
      });
    }
  }

  async generateStudentCertificatePng(student, course, batch = {}, templateImg) {
    const canvas = document.createElement('canvas');
    canvas.width = 3722;
    canvas.height = 2480;
    const ctx = canvas.getContext('2d');

    // Draw base certificate background
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

    // Set scaling transform from 1920x1280 design space to 3722x2480 output
    ctx.setTransform(canvas.width / 1920, 0, 0, canvas.height / 1280, 0, 0);

    const PHOTO_BOX = { x: 1525, y: 649, width: 227, height: 268 };
    const QR_BOX = { x: 390, y: 1058, size: 124 };

    // Serial & Issue Date
    const serial = student.certificateSerial || student.id || '';
    drawCertField(ctx, serial, 284, 533, 481, 34, 'left', 400);

    const issueDateStr = student.certificateIssueDate || batch?.certificateIssueDate || new Date().toISOString().slice(0, 10);
    drawCertField(ctx, formatDate(issueDateStr), 1640, 533, 200, 34, 'left', 400);

    // Student Name & Father's Name
    const studentName = student.name || student.fullName || '';
    drawCertField(ctx, studentName, 860, 642, 605);
    drawCertField(ctx, student.fatherName || '', 442, 704, 514);

    // Course Title & Duration
    const courseTitle = course?.title || student.courseName || '';
    const courseDuration = course?.duration || student.courseDuration || '';
    drawCertField(ctx, courseTitle, 355, 765, 1055);
    drawCertField(ctx, courseDuration, 583, 901, 326);

    // Course Period
    const startDate = student.certificateCourseStartDate || student.startDate;
    const endDate = student.certificateCourseEndDate || student.endDate || student.completionDate;
    const period = [formatMonthYear(startDate), formatMonthYear(endDate)].filter(Boolean).join(' - ');
    drawCertField(ctx, period, 1007, 901, 437, 33);

    // Grade
    const grade = student.grade || batch?.grade || 'A';
    drawCertField(ctx, grade, 706, 962, 252);

    // Student Photo (with border)
    if (student.photoUrl) {
      try {
        const photo = await loadCertificateImage(student.photoUrl);
        const scale = Math.max(PHOTO_BOX.width / photo.width, PHOTO_BOX.height / photo.height);
        const sw = PHOTO_BOX.width / scale;
        const sh = PHOTO_BOX.height / scale;
        ctx.drawImage(
          photo,
          (photo.width - sw) / 2,
          Math.max(0, (photo.height - sh) * 0.3),
          sw,
          sh,
          PHOTO_BOX.x,
          PHOTO_BOX.y,
          PHOTO_BOX.width,
          PHOTO_BOX.height
        );
        ctx.save();
        ctx.strokeStyle = '#168bbb';
        ctx.lineWidth = 3;
        ctx.strokeRect(
          PHOTO_BOX.x + 1.5,
          PHOTO_BOX.y + 1.5,
          PHOTO_BOX.width - 3,
          PHOTO_BOX.height - 3
        );
        ctx.restore();
      } catch (err) {
        console.warn('Could not load student photo for certificate:', err);
      }
    }

    // Verification QR Code
    if (window.QRious && student.id) {
      try {
        const qrCanvas = document.createElement('canvas');
        const verificationUrl = this.getCertificateVerificationUrl(student);
        new window.QRious({
          element: qrCanvas,
          value: verificationUrl,
          size: 512,
          level: 'H',
          foreground: '#111111',
          background: '#ffffff'
        });
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(QR_BOX.x - 5, QR_BOX.y - 5, QR_BOX.size + 10, QR_BOX.size + 10);
        ctx.drawImage(qrCanvas, QR_BOX.x, QR_BOX.y, QR_BOX.size, QR_BOX.size);
      } catch (err) {
        console.warn('Could not render QR code on certificate:', err);
      }
    }

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }

  async downloadBatchCertificatesZip(batchId) {
    const batch = store.getAllBatches().find(b => b.id === batchId);
    if (!batch) return;
    if (batch.status !== 'Completed') {
      this.showToast('Batch Not Completed', 'Please mark this batch as completed before downloading certificates.', 'warning');
      return;
    }
    const members = (batch.studentIds || []).map(id => store.getStudentById(id)).filter(Boolean);
    if (!members.length) {
      this.showToast('No Students', 'This batch does not have any students to generate certificates for.', 'warning');
      return;
    }

    if (typeof window.JSZip === 'undefined') {
      this.showToast('ZIP Library Loading', 'Compression library is loading. Please try again in a few seconds.', 'info');
      return;
    }

    const btn = document.querySelector(`[data-batch-action="download-certs"][data-batch-id="${CSS.escape(batchId)}"]`);
    const originalHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i>`;
    }

    try {
      let templateImg;
      try {
        templateImg = await loadCertificateImage('assets/diganta-certificate-template.jpg');
      } catch (e) {
        templateImg = await loadCertificateImage('https://ik.imagekit.io/d3ycnoiwd/academy/student-certificate/diganta-certificate-template.jpg');
      }

      const zip = new window.JSZip();
      let completedCount = 0;

      for (const student of members) {
        completedCount++;
        const course = store.getCourseById(student.courseId || student.enrolledCourseIds?.[0]);
        const pngBlob = await this.generateStudentCertificatePng(student, course, batch, templateImg);
        if (pngBlob) {
          const safeName = (student.name || student.fullName || 'student').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
          const safeId = String(student.id || '').replace(/[^a-zA-Z0-9_-]/g, '-');
          zip.file(`Certificate-${safeId}-${safeName}.png`, pngBlob);
        }
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const safeBatchName = (batch.name || 'batch').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
      const filename = `${safeBatchName}-Certificates.zip`;

      const downloadUrl = URL.createObjectURL(zipBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);

      this.showToast('Download Complete', `Successfully downloaded ${completedCount} certificate(s) in ZIP format.`, 'success');
    } catch (error) {
      console.error('[Download Batch Certificates Error]:', error);
      this.showToast('Download Error', 'Failed to generate certificates ZIP. Check browser console.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    }
  }

  // ==========================================================================
  // Toast Notifications
  // ==========================================================================
  showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
    if (type === 'info') iconClass = 'fa-solid fa-circle-info';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-msg">${escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close alert">&times;</button>
    `;

    this.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', removeToast);
    setTimeout(removeToast, 4000);
  }

  // ==========================================================================
  // Authentication Code (OTP) Timer & Renderer
  // ==========================================================================
  renderAuthCode() {
    if (!this.authCodeDigits || !this.authCountdownTimer) return;
    const token = store.getCachedAuthToken();
    if (!token) {
      this.authCodeDigits.textContent = '------';
      this.authCountdownTimer.textContent = this.authCodeError || 'Connecting…';
      if (this.authProgressFill) this.authProgressFill.style.width = '0%';
      if (!this.authCodeRefresh && Date.now() >= (this.authCodeRetryAt || 0)) {
        this.authCodeRefresh = store.getOrGenerateAuthToken()
          .then(() => { this.authCodeError = ''; this.authCodeRetryAt = 0; this.renderAuthCode(); })
          .catch(() => {
            this.authCodeRetryAt = Date.now() + 10000;
            this.authCodeError = 'Connection unavailable';
            this.authCountdownTimer.textContent = this.authCodeError;
          })
          .finally(() => { this.authCodeRefresh = null; });
      }
      return;
    }
    const now = Date.now();
    const remainingMs = Math.max(0, token.expiresAt - now);

    // Render individual 6 digit boxes
    const codeStr = String(token.code).padStart(6, '0');
    this.authCodeDigits.innerHTML = codeStr.split('').map(d => `<span>${escapeHtml(d)}</span>`).join('');

    // Format remaining time (HH:MM:SS)
    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    this.authCountdownTimer.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    if (this.authProgressFill) {
      const AUTH_DURATION = 5 * 60 * 60 * 1000;
      const percent = (remainingMs / AUTH_DURATION) * 100;
      const remainingPercent = Math.max(0, Math.min(100, percent));
      this.authProgressFill.style.width = `${remainingPercent}%`;
      this.authProgressFill.parentElement?.setAttribute('aria-valuenow', String(Math.round(remainingPercent)));
    }


  }

  startAuthCountdownTimer() {
    if (this.authInterval) clearInterval(this.authInterval);
    this.renderAuthCode();
    this.authInterval = setInterval(() => {
      this.renderAuthCode();
    }, 1000);
  }

  // ==========================================================================
  // Academy Settings Modal Methods
  // ==========================================================================
  openAcademySettingsModal() {
    if (!this.academySettingsModal) return;
    const profile = store.getAcademyProfile();
    const currentSlug = profile?.slug || (this.session?.email?.includes('poulami') ? 'poulami' : (this.session?.email?.includes('diganta') ? 'diganta' : (this.session?.email ? this.session.email.split('@')[0].replace(/[^a-z0-9]/g, '') : '')));

    if (this.settingsAcademyName) {
      this.settingsAcademyName.value = profile?.academyName || '';
    }
    if (this.settingsOwnerName) {
      this.settingsOwnerName.value = profile?.ownerName || this.session?.name || '';
    }
    if (this.settingsSubdomainSlug) {
      this.settingsSubdomainSlug.value = currentSlug;
    }
    if (this.settingsSlugPrefix) {
      const origin = (window.location.origin || 'https://academy.pixelsetu.com').replace(/^https?:\/\//, '');
      this.settingsSlugPrefix.textContent = `${origin}/a/`;
    }

    this.openModal(this.academySettingsModal);
  }

  closeAcademySettingsModal() {
    if (!this.academySettingsModal) return;
    this.closeModal(this.academySettingsModal);
  }

  // ==========================================================================
  // Onboarding Workflow & Tenant Account Status Gate
  // ==========================================================================
  checkOnboarding() {
    this.checkAccountStatus();
  }

  checkAccountStatus() {
    const profile = store.getAcademyProfile();
    const isConfigured = Boolean(profile && profile.academyName && profile.ownerName);

    if (!isConfigured) {
      if (this.accountOnHoldScreen) this.accountOnHoldScreen.style.display = 'none';
      this.openOnboardingModal();
      return;
    }

    const isSuperAdmin = Boolean(store.isSuperAdmin && store.ownerEmail === 'dasprantik76@gmail.com');
    const status = isSuperAdmin ? 'active' : (store.tenantStatus || 'pending');

    if (status !== 'active') {
      // Show Account on Hold Screen
      if (this.accountOnHoldScreen) {
        this.accountOnHoldScreen.style.display = 'flex';
        if (this.holdAcademyName) this.holdAcademyName.textContent = profile.academyName || 'Your Academy';
        const slug = profile.slug || '';
        const fullUrl = this.getPublicUrlForSlug(slug);
        if (this.holdSubdomainUrl) this.holdSubdomainUrl.textContent = fullUrl;
        if (this.holdOwnerName) this.holdOwnerName.textContent = profile.ownerName || this.session?.name || 'Administrator';
        if (this.holdOwnerEmail) this.holdOwnerEmail.textContent = store.ownerEmail || this.session?.email || '—';
        if (this.holdStatusBadge) {
          if (status === 'suspended') {
            this.holdStatusBadge.className = 'badge badge-inactive';
            this.holdStatusBadge.textContent = 'Account Suspended';
          } else {
            this.holdStatusBadge.className = 'badge badge-warning';
            this.holdStatusBadge.textContent = 'Pending Super Admin Approval';
          }
        }
      }
      // Hide active views & disable navigation tabs while on hold
      this.views.forEach(section => section.classList.remove('active'));
      this.navItems.forEach(item => {
        item.style.opacity = '0.35';
        item.style.pointerEvents = 'none';
      });
      this.updateSuperAdminState();
      return;
    }

    // Account is Active / Approved
    if (this.accountOnHoldScreen) this.accountOnHoldScreen.style.display = 'none';
    this.navItems.forEach(item => {
      item.style.opacity = '';
      item.style.pointerEvents = '';
    });

    // Super Admin Navigation
    this.updateSuperAdminState();
  }

  // ==========================================================================
  // Super Admin Platform Tenants Management
  // ==========================================================================
  async loadPlatformTenants() {
    if (!store.isSuperAdmin || store.ownerEmail !== 'dasprantik76@gmail.com') return;
    try {
      const res = await store.getAllTenants();
      if (res && res.success && Array.isArray(res.tenants)) {
        this.platformTenants = res.tenants;
        const total = this.platformTenants.length;
        const pending = this.platformTenants.filter(t => t.status === 'pending').length;
        const active = this.platformTenants.filter(t => t.status === 'active').length;

        if (this.statTotalTenants) this.statTotalTenants.textContent = total;
        if (this.statPendingTenants) this.statPendingTenants.textContent = pending;
        if (this.statActiveTenants) this.statActiveTenants.textContent = active;
        if (this.pillPendingCount) this.pillPendingCount.textContent = pending;

        if (this.pendingTenantsBadge) {
          this.pendingTenantsBadge.textContent = pending;
          this.pendingTenantsBadge.style.display = pending > 0 ? 'inline-block' : 'none';
        }

        this.renderTenantsTable();
      }
    } catch (e) {
      console.warn('[SuperAdmin] Failed to load tenants:', e);
    }
  }

  renderTenantsTable() {
    if (!this.tenantsTableBody || !Array.isArray(this.platformTenants)) return;

    const filter = this.tenantActiveFilter || 'all';
    const query = (this.tenantSearchQuery?.value || '').toLowerCase().trim();

    const filtered = this.platformTenants.filter(tenant => {
      if (filter !== 'all' && tenant.status !== filter) return false;
      if (query) {
        const target = `${tenant.academyName || ''} ${tenant.ownerName || ''} ${tenant.ownerEmail || ''} ${tenant.slug || ''}`.toLowerCase();
        if (!target.includes(query)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      this.tenantsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <i class="fa-solid fa-filter" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block; opacity: 0.5;"></i>
            No academy tenants found matching the selected filter.
          </td>
        </tr>
      `;
      return;
    }

    this.tenantsTableBody.innerHTML = filtered.map(t => {
      const isApproved = t.status === 'active';
      const isSuperAdminTenant = t.ownerEmail === 'dasprantik76@gmail.com';
      const isMainDiganta = t.ownerEmail === 'rcavirup@gmail.com';

      let statusBadgeHtml = '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Pending Review</span>';
      if (t.status === 'active') {
        statusBadgeHtml = '<span class="badge badge-active"><i class="fa-solid fa-circle-check"></i> Active</span>';
      } else if (t.status === 'suspended') {
        statusBadgeHtml = '<span class="badge badge-inactive"><i class="fa-solid fa-ban"></i> Suspended</span>';
      }

      const publicUrl = `https://${t.slug || 'academy'}.${this.getRootDomain()}`;
      const previewUrl = `/?academy=${encodeURIComponent(t.slug || '')}`;

      return `
        <tr data-email="${escapeHtml(t.ownerEmail)}">
          <td>
            <div style="font-weight: 700; color: #0f172a; font-size: 0.9375rem;">${escapeHtml(t.academyName || 'Untitled Academy')}</div>
            <div style="font-size: 0.8125rem; color: #64748b;">${escapeHtml(t.category || 'General Academy')}</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">ID Prefix: <code>${escapeHtml(t.studentIdPrefix || '—')}</code></div>
          </td>
          <td>
            <div style="font-weight: 600; color: #334155;">${escapeHtml(t.ownerName || '—')}</div>
            <div style="font-size: 0.8125rem; color: #64748b;">${escapeHtml(t.ownerEmail)}</div>
            ${t.phone ? `<div style="font-size: 0.75rem; color: #2563eb;"><i class="fa-solid fa-phone" style="font-size: 9px;"></i> ${escapeHtml(t.phone)}</div>` : ''}
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <code style="background: #e2e8f0; color: #1e40af; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${escapeHtml(t.slug || '—')}</code>
              <a href="${previewUrl}" target="_blank" title="Preview public website" style="color: #64748b; font-size: 0.85rem;"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">${escapeHtml(publicUrl)}</div>
          </td>
          <td>
            <div style="font-size: 0.8125rem; color: #334155;"><strong>${t.studentCount || 0}</strong> Students</div>
            <div style="font-size: 0.8125rem; color: #64748b;"><strong>${t.courseCount || 0}</strong> Courses</div>
          </td>
          <td>${statusBadgeHtml}</td>
          <td style="text-align: right;">
            <div style="display: flex; align-items: center; justify-content: flex-end; gap: 0.4rem; flex-wrap: wrap;">
              ${isSuperAdminTenant ? `
                <span class="badge badge-primary" style="padding: 0.3rem 0.65rem; font-size: 0.75rem;"><i class="fa-solid fa-crown"></i> Super Admin</span>
              ` : (isMainDiganta ? `
                <span class="badge badge-active" style="padding: 0.3rem 0.65rem; font-size: 0.75rem; background: #e0f2fe; color: #0284c7; border: 1px solid #bae6fd;"><i class="fa-solid fa-star"></i> Main Academy</span>
              ` : (!isApproved ? `
                <button type="button" class="btn btn-sm btn-approve-tenant" data-email="${escapeHtml(t.ownerEmail)}" data-name="${escapeHtml(t.academyName || '')}" style="background: #10b981; color: #fff; font-weight: 600; padding: 0.3rem 0.65rem;">
                  <i class="fa-solid fa-check"></i> Approve
                </button>
              ` : `
                <button type="button" class="btn btn-sm btn-hold-tenant" data-email="${escapeHtml(t.ownerEmail)}" data-name="${escapeHtml(t.academyName || '')}" style="background: #f1f5f9; color: #d97706; border: 1px solid #fde68a; font-weight: 600; padding: 0.3rem 0.65rem;">
                  <i class="fa-solid fa-pause"></i> Put on Hold
                </button>
              `))}
              <a href="${previewUrl}" target="_blank" class="btn btn-sm btn-outline" style="padding: 0.3rem 0.65rem;" title="Preview Site">
                <i class="fa-solid fa-eye"></i>
              </a>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    this.tenantsTableBody.querySelectorAll('.btn-approve-tenant').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        const name = btn.getAttribute('data-name');
        setButtonLoading(btn, true);
        await this.handleApproveTenant(email, name);
      });
    });

    this.tenantsTableBody.querySelectorAll('.btn-hold-tenant').forEach(btn => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-email');
        const name = btn.getAttribute('data-name');
        setButtonLoading(btn, true);
        await this.handleHoldTenant(email, name);
      });
    });
  }

  async handleApproveTenant(targetOwnerEmail, academyName) {
    try {
      const res = await store.updateTenantStatus(targetOwnerEmail, 'active');
      if (res && res.success) {
        this.showToast('Academy Approved!', `${academyName} has been approved. The tenant now has full access to their portal.`, 'success');
        await this.loadPlatformTenants();
      } else {
        this.showToast('Approval Failed', 'Could not update tenant approval status.', 'error');
      }
    } catch (e) {
      this.showToast('Approval Error', e.message || 'Network error updating tenant.', 'error');
    }
  }

  async handleHoldTenant(targetOwnerEmail, academyName) {
    try {
      const res = await store.updateTenantStatus(targetOwnerEmail, 'pending');
      if (res && res.success) {
        this.showToast('Account Put on Hold', `${academyName} is now on hold.`, 'info');
        await this.loadPlatformTenants();
      } else {
        this.showToast('Update Failed', 'Could not update tenant status.', 'error');
      }
    } catch (e) {
      this.showToast('Update Error', e.message || 'Network error updating tenant.', 'error');
    }
  }

  openOnboardingModal() {
    if (!this.onboardingModal) return;
    const userEmail = (this.session?.email || '').toLowerCase().trim();
    const defaultSlug = userEmail.includes('poulami')
      ? 'poulami'
      : (userEmail.includes('diganta') ? 'diganta' : (userEmail ? userEmail.split('@')[0].replace(/[^a-z0-9]/g, '') : ''));

    if (this.onboardingOwnerName && this.session && this.session.name && this.session.name !== 'Super Administrator') {
      this.onboardingOwnerName.value = this.session.name;
    }
    if (this.onboardingSubdomainSlug) {
      this.onboardingSubdomainSlug.value = defaultSlug;
    }
    if (this.onboardingSlugPrefix) {
      const origin = (window.location.origin || 'https://academy.pixelsetu.com').replace(/^https?:\/\//, '');
      this.onboardingSlugPrefix.textContent = `${origin}/a/`;
    }

    this.openModal(this.onboardingModal);
  }

  closeOnboardingModal() {
    if (!this.onboardingModal) return;
    this.closeModal(this.onboardingModal);
  }
}

// ==========================================================================
// Helper Utility Functions
// ==========================================================================
function getStatusBadgeClass(status) {
  switch (status) {
    case 'Active':
      return 'badge-active';
    case 'Inactive':
      return 'badge-inactive';
    case 'Completed':
      return 'badge-completed';
    default:
      return 'badge-category';
  }
}

function getStatusBadgeIcon(status) {
  return status === 'Completed'
    ? '<i class="fa-solid fa-check" style="font-size: 10px;"></i>'
    : '<i class="fa-solid fa-circle" style="font-size: 6px;"></i>';
}

const DISPLAY_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function formatDate(dateString) {
  if (!dateString) return '—';
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString) ? `${dateString}T00:00:00` : dateString;
  const date = new Date(normalizedDate);
  if (Number.isNaN(date.getTime())) return '—';
  return `${date.getDate()} ${DISPLAY_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

function formatMonthYear(dateString) {
  if (!dateString) return '';
  const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString) ? `${dateString}T00:00:00` : dateString;
  const date = new Date(normalizedDate);
  if (Number.isNaN(date.getTime())) return '';
  return `${DISPLAY_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

const certificateImageCache = new Map();

function loadCertificateImage(url) {
  if (!url) return Promise.reject(new Error('No image URL'));
  if (certificateImageCache.has(url)) {
    const cached = certificateImageCache.get(url);
    if (cached && cached.complete && cached.naturalWidth > 0) {
      return Promise.resolve(cached);
    }
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      certificateImageCache.set(url, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error('Failed to load image: ' + url));
    img.src = url;
  });
}

function drawCertField(ctx, value, x, y, width, size = 37, align = 'center', weight = 500) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return;
  ctx.save();
  ctx.fillStyle = '#111111';
  let currentSize = size;
  do {
    ctx.font = `${weight} ${currentSize--}px "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
  } while (ctx.measureText(text).width > width - 12 && currentSize > 15);
  ctx.textAlign = align;
  const textX = align === 'left' ? x : x + width / 2;
  ctx.fillText(text, textX, y, width - 12);
  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function formatMessageDate(dateString, timeFirst = false) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const dateText = `${date.getDate()} ${DISPLAY_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
  return timeFirst ? `${time} • ${dateText}` : `${dateText}, ${time}`;
}

const INBOX_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function formatInboxRowTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const isToday = now.getFullYear() === date.getFullYear() &&
                  now.getMonth() === date.getMonth() &&
                  now.getDate() === date.getDate();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (isToday && diffHours < 24 && diffHours >= 0) {
    const rawHours = date.getHours();
    const hours12 = rawHours % 12 === 0 ? 12 : rawHours % 12;
    const hh = String(hours12).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const period = rawHours >= 12 ? 'pm' : 'am';
    return `${hh}:${mm} ${period}`;
  }

  const day = date.getDate();
  const month = INBOX_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatAadhar(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 12);
  if (!digits) return '—';
  return (digits.match(/.{1,4}/g) || []).join('-');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseDuration(durationStr) {
  if (!durationStr) return { value: '', unit: 'Months' };
  const str = String(durationStr).trim();
  const match = str.match(/^(\d+(?:\.\d+)?)\s*(months?|years?)/i);
  if (match) {
    const val = match[1];
    const rawUnit = match[2].toLowerCase();
    const unit = rawUnit.startsWith('year') ? 'Years' : 'Months';
    return { value: val, unit };
  }
  const numOnly = parseFloat(str);
  if (!isNaN(numOnly)) {
    return { value: numOnly, unit: 'Months' };
  }
  return { value: '', unit: 'Months' };
}

function escapeQuotes(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '""');
}

function setButtonLoading(btn, isLoading, loadingText = '') {
  if (!btn) return;
  if (isLoading) {
    if (!btn.dataset.originalHtml) {
      btn.dataset.originalHtml = btn.innerHTML;
    }
    const rect = btn.getBoundingClientRect();
    if (rect.width > 0 && !btn.style.minWidth) {
      btn.style.minWidth = `${Math.ceil(rect.width)}px`;
    }
    if (rect.height > 0 && !btn.style.minHeight) {
      btn.style.minHeight = `${Math.ceil(rect.height)}px`;
    }
    btn.disabled = true;
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    btn.innerHTML = loadingText
      ? `<span class="btn-spinner" aria-hidden="true"></span> <span>${loadingText}</span>`
      : '<span class="btn-spinner" aria-hidden="true"></span>';
  } else {
    btn.disabled = false;
    btn.classList.remove('is-loading');
    btn.removeAttribute('aria-busy');
    if (btn.dataset.originalHtml) {
      btn.innerHTML = btn.dataset.originalHtml;
      delete btn.dataset.originalHtml;
    }
    btn.style.minWidth = '';
    btn.style.minHeight = '';
  }
}

// ==========================================================================
// Global Formatters & Input Validators
// ==========================================================================
function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : '')
    .join(' ');
}

function applyAutoCapitalization(inputElement) {
  if (!inputElement) return;

  inputElement.addEventListener('input', (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const original = e.target.value;

    // Capitalize first letter of every word
    const capitalized = original.replace(/\b[a-z]/g, char => char.toUpperCase());
    if (capitalized !== original) {
      e.target.value = capitalized;
      if (start !== null && end !== null) {
        e.target.setSelectionRange(start, end);
      }
    }
  });

  inputElement.addEventListener('blur', (e) => {
    if (e.target.value) {
      e.target.value = toTitleCase(e.target.value);
    }
  });
}

function setupPhoneInputValidation(phoneInput, errorElement) {
  if (!phoneInput) return;

  phoneInput.addEventListener('input', (e) => {
    // Filter non-digits and cap at exactly 10 digits
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    e.target.value = val;

    if (val.length > 0 && val.length < 10) {
      phoneInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = `Mobile number must be exactly 10 digits (${val.length}/10 entered).`;
        errorElement.style.display = 'block';
      }
    } else {
      phoneInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });

  phoneInput.addEventListener('blur', (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length > 0 && val.length !== 10) {
      phoneInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = 'Please enter a valid 10-digit mobile number.';
        errorElement.style.display = 'block';
      }
    } else if (val.length === 10) {
      phoneInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });
}

function setupPinCodeInputValidation(pinInput, errorElement) {
  if (!pinInput) return;

  pinInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 6) val = val.slice(0, 6);
    pinInput.value = val;

    if (val.length > 0 && val.length < 6) {
      pinInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = `Pin code must be exactly 6 digits (${val.length}/6 entered).`;
        errorElement.style.display = 'block';
      }
    } else {
      pinInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });

  pinInput.addEventListener('blur', (e) => {
    const val = pinInput.value.replace(/\D/g, '');
    if (val.length > 0 && val.length !== 6) {
      pinInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = 'Please enter a valid 6-digit pin code.';
        errorElement.style.display = 'block';
      }
    } else if (val.length === 6) {
      pinInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });
}

function setupAadharInputValidation(aadharInput, errorElement) {
  if (!aadharInput) return;

  aadharInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 12) val = val.slice(0, 12);
    aadharInput.value = val;

    if (val.length > 0 && val.length < 12) {
      aadharInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = `Aadhar number must be exactly 12 digits (${val.length}/12 entered).`;
        errorElement.style.display = 'block';
      }
    } else {
      aadharInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });

  aadharInput.addEventListener('blur', (e) => {
    const val = aadharInput.value.replace(/\D/g, '');
    if (val.length > 0 && val.length !== 12) {
      aadharInput.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = 'Please enter a valid 12-digit Aadhar number.';
        errorElement.style.display = 'block';
      }
    } else if (val.length === 12) {
      aadharInput.classList.remove('input-error');
      if (errorElement) errorElement.style.display = 'none';
    }
  });
}

// ==========================================================================
// App Initialization
// ==========================================================================
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new UIController();
  window.app = app;
});
