export const navigation = [
  { label: "Start Here", href: "/start-here" },
  { label: "Resources", href: "/resources" },
  { label: "Work With Me", href: "/#work-with-me" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const brand = {
  name: "Bayzicks",
  tagline: "The digital world, made simple.",
  description: "Helping beginners make sense of digital careers, one useful starting point at a time.",
  hero: {
    eyebrow: "YOUR DIGITAL CAREER STARTS WITH THE BASICS",
    description: "Bayzicks helps beginners make sense of remote work, freelancing, digital marketing and tech, starting with the basics.",
  },
  purpose: "Bayzicks was created to make the digital world easier to understand for people starting from scratch.",
};

export const foundations = [
  { id: "roles", title: "Roles", icon: "roles", description: "Understand different digital careers and what the work actually involves.", color: "peach" },
  { id: "skills", title: "Skills", icon: "skills", description: "Find the skills that matter, including the ones you can start learning today.", color: "sage" },
  { id: "tools", title: "Tools", icon: "tools", description: "Get familiar with the everyday tools people use for digital work.", color: "lavender" },
  { id: "learning-paths", title: "Learning paths", icon: "paths", description: "Know what to learn first and how to build on it, step by step.", color: "sand" },
  { id: "opportunities", title: "Opportunities", icon: "opportunities", description: "Explore freelancing, remote employment and where to look for work.", color: "blue" },
] as const;

export type ResourceCategory = "Career Guides" | "Freelancing" | "Remote Work" | "Digital Marketing" | "Tools & Templates";
export type ResourceCover = { src: string; alt: string; width: number; height: number; preview?: boolean };
export type Resource = {
  slug: string;
  title: string;
  category: ResourceCategory;
  description: string;
  format: string;
  status: "featured" | "available" | "planned";
  theme: "forest" | "sage" | "sand";
  cover?: ResourceCover;
};

// Replace this single object with the approved cover to update every guide visual.
export const guideCover: ResourceCover = { src: "/images/digital-careers-guide.svg", alt: "Cover preview of the Bayzicks Digital Careers Field Guide, with connected paths representing career possibilities.", width: 480, height: 640, preview: true };

export const resourceCategories: ResourceCategory[] = ["Career Guides", "Freelancing", "Remote Work", "Digital Marketing", "Tools & Templates"];
export const resources: Resource[] = [
  { slug: "digital-careers-field-guide", title: "The Digital Careers Field Guide", category: "Career Guides", description: "A beginner-friendly introduction to roles, skills, tools and your next steps.", format: "PDF GUIDE", status: "featured", theme: "forest", cover: guideCover },
  { slug: "first-freelance-toolkit", title: "Your first freelance toolkit", category: "Freelancing", description: "A practical resource for understanding the basics of working for yourself.", format: "PLANNED RESOURCE", status: "planned", theme: "sage" },
  { slug: "remote-work-checklist", title: "The remote-work checklist", category: "Remote Work", description: "A starting point for exploring remote roles and getting yourself ready.", format: "PLANNED RESOURCE", status: "planned", theme: "sand" },
];

// Each resource has an allowlisted ID, tag and signup source. Add new lead magnets here.
export const leadMagnets = {
  "digital-careers-field-guide": { title: "The Digital Careers Field Guide", tag: "digital-careers-field-guide" },
} as const;
export type LeadMagnetId = keyof typeof leadMagnets;
export const signupSources = ["homepage", "instagram-guide", "resources", "start-here", "about"] as const;
export type SignupSource = typeof signupSources[number];

export const faqItems = [
  { question: "Is Bayzicks only for people who want to work in tech?", answer: "Not at all. Digital work also includes writing, marketing, design, customer support, virtual assistance and more. Bayzicks helps you understand a range of paths, not just coding." },
  { question: "What if I’m starting completely from scratch?", answer: "You’re in the right place. The resources explain terms as they come up and don’t assume a technical background. Start with an overview, then focus on one role that interests you." },
  { question: "Is the career guide free?", answer: "Yes. The Digital Careers Field Guide is a free resource. Requesting it also signs you up for occasional Bayzicks emails. You can unsubscribe at any time." },
  { question: "What happens after I enter my email?", answer: "When delivery is connected, Mailchimp sends an email with your guide’s download link. You may first receive an email to confirm your address. If this site is in preview mode, the form clearly tells you that no subscription or email has been sent." },
  { question: "How do I choose where to start?", answer: "Look at the work behind a job title. Pick one role that matches something you enjoy, try a small beginner project, and use what you learn to decide your next step. You don’t need to choose your entire career today." },
];

export const contactTopics = ["General question", "Resource question", "Website feedback", "Something else"] as const;
export const collaborationCategories = ["Sponsored or affiliate partnership", "Product review", "Co-created resource", "Newsletter or community feature", "Something else"] as const;

export const careerPaths = [
  { id: "marketing", title: "Digital marketing", icon: "Megaphone", summary: "Help a business reach the right people online.", work: "Plan content, write campaigns, understand an audience and review what’s working.", skills: ["Clear communication", "Content planning", "Basic analytics"], tools: "Canva, Google Analytics and email marketing tools", firstStep: "Choose a small business you know and sketch a one-week content plan. Explain who each post is for and what it should help them do." },
  { id: "assistance", title: "Virtual assistance", icon: "CalendarDays", summary: "Keep the everyday work of a person or business organised.", work: "Manage schedules, inboxes, research, documents and other administrative tasks.", skills: ["Organisation", "Written communication", "Attention to detail"], tools: "Google Workspace, Notion and scheduling tools", firstStep: "Build a simple weekly task tracker and a sample meeting agenda. Practice organising a busy week into clear priorities." },
  { id: "design", title: "Design & content", icon: "PenTool", summary: "Make ideas easier to understand through words and visuals.", work: "Write useful content, create graphics or design digital experiences.", skills: ["Visual communication", "Writing", "Taking feedback"], tools: "Canva, Figma and collaborative document tools", firstStep: "Take a topic you understand and turn it into a short article or three-slide explainer. Ask someone what they understood from it." },
  { id: "technology", title: "Tech & development", icon: "Code2", summary: "Build, test or support the technology people use.", work: "Create websites, test software, solve technical problems or help people use a product.", skills: ["Problem-solving", "Logical thinking", "Learning by doing"], tools: "VS Code, GitHub and browser developer tools", firstStep: "Try a beginner HTML and CSS lesson, then make a small personal page. Notice whether you enjoy figuring out how it works." },
  { id: "data", title: "Data & analytics", icon: "ChartNoAxesCombined", summary: "Use information to answer questions and support decisions.", work: "Organise data, spot patterns and explain findings in a way others can use.", skills: ["Spreadsheet basics", "Curiosity", "Explaining findings"], tools: "Google Sheets, Excel and data visualisation tools", firstStep: "Use a spreadsheet to track something familiar, such as weekly spending. Make a chart and write down one useful observation." },
  { id: "support", title: "Customer support", icon: "MessagesSquare", summary: "Help customers solve problems and use a service.", work: "Answer questions, explain features and pass on feedback to a team.", skills: ["Listening", "Patient communication", "Research"], tools: "Help-desk platforms, knowledge bases and chat tools", firstStep: "Pick a product you use and write clear answers to five common beginner questions. Practice explaining without jargon." },
] as const;
