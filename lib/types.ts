export interface FormData {
  // Client Info
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;

  // Platform Access Confirmations
  titleCaptureAccess: boolean;
  ghlAccess: boolean;
  wordpressAccess: boolean;

  // OpenAI
  openaiApiKey: string;
  needsOpenaiHelp: boolean;

  // WordPress
  wordpressUrl: string;

  // Branding
  primaryColor: string;
  secondaryColor: string;
  logo: FileData | null;

  // Documents
  samplePdf: FileData | null;
  additionalDocs: FileData[];

  // Other
  calendlyLink: string;
  notes: string;
}

export interface FileData {
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface StepConfig {
  id: string;
  type: 'welcome' | 'text' | 'email' | 'phone' | 'password' | 'url' | 'color' | 'file' | 'multifile' | 'textarea' | 'choice' | 'review' | 'thankyou' | 'instruction';
  question?: string;
  description?: string;
  field?: keyof FormData;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  accept?: string;
  choices?: { label: string; value: string | boolean }[];
  email?: string;
  platforms?: string[];
}

export const ADMIN_EMAIL = 'mohammad@aigrowthadvisor.ai';

export const initialFormData: FormData = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  titleCaptureAccess: false,
  ghlAccess: false,
  wordpressAccess: false,
  openaiApiKey: '',
  needsOpenaiHelp: false,
  wordpressUrl: '',
  primaryColor: '#1E40AF',
  secondaryColor: '#3B82F6',
  logo: null,
  samplePdf: null,
  additionalDocs: [],
  calendlyLink: '',
  notes: '',
};

export const formSteps: StepConfig[] = [
  {
    id: 'welcome',
    type: 'welcome',
    question: 'Welcome to Cloud Title Onboarding',
    description: 'Let\'s get you set up for your AI Chatbot & Title Quote Engine project. This will take about 3-5 minutes.',
  },
  {
    id: 'companyName',
    type: 'text',
    question: 'What is your company name?',
    field: 'companyName',
    required: true,
    placeholder: 'Cloud Title',
  },
  {
    id: 'contactPerson',
    type: 'text',
    question: 'Who is the main contact for this project?',
    field: 'contactPerson',
    required: true,
    placeholder: 'John Doe',
  },
  {
    id: 'email',
    type: 'email',
    question: 'What\'s your email address?',
    description: 'We\'ll use this to send project updates and deliverables.',
    field: 'email',
    required: true,
    placeholder: 'john@cloudtitle.com',
  },
  {
    id: 'phone',
    type: 'phone',
    question: 'What\'s your phone number?',
    field: 'phone',
    required: true,
    placeholder: '(555) 123-4567',
  },
  {
    id: 'platformAccess',
    type: 'instruction',
    question: 'Grant us access to your platforms',
    description: 'Please add our team member to the following platforms so we can set up your chatbot:',
    email: ADMIN_EMAIL,
    platforms: [
      'Title Capture - Add as team member',
      'GoHighLevel - Add as agency admin (for snapshot import)',
      'WordPress - Add as administrator',
    ],
  },
  {
    id: 'titleCaptureAccess',
    type: 'choice',
    question: 'Have you added us to Title Capture?',
    description: `Please add ${ADMIN_EMAIL} as a team member to your Title Capture account.`,
    field: 'titleCaptureAccess',
    choices: [
      { label: 'Yes, I\'ve added the team member', value: true },
      { label: 'I\'ll do this later', value: false },
    ],
  },
  {
    id: 'ghlAccess',
    type: 'choice',
    question: 'Have you added us to GoHighLevel?',
    description: `Please add ${ADMIN_EMAIL} as an agency admin so we can import snapshots and customize your setup.`,
    field: 'ghlAccess',
    choices: [
      { label: 'Yes, I\'ve added the admin', value: true },
      { label: 'I\'ll do this later', value: false },
    ],
  },
  {
    id: 'wordpressUrl',
    type: 'url',
    question: 'What is your WordPress site URL?',
    field: 'wordpressUrl',
    required: true,
    placeholder: 'https://cloudtitle.com',
  },
  {
    id: 'wordpressAccess',
    type: 'choice',
    question: 'Have you added us to WordPress?',
    description: `Please add ${ADMIN_EMAIL} as an administrator to your WordPress site.`,
    field: 'wordpressAccess',
    choices: [
      { label: 'Yes, I\'ve added the admin', value: true },
      { label: 'I\'ll do this later', value: false },
    ],
  },
  {
    id: 'needsOpenaiHelp',
    type: 'choice',
    question: 'Do you have an OpenAI API Key?',
    description: 'Required for the AI chatbot functionality.',
    field: 'needsOpenaiHelp',
    choices: [
      { label: 'Yes, I have one', value: false },
      { label: 'No, I need help setting one up', value: true },
    ],
  },
  {
    id: 'openaiApiKey',
    type: 'text',
    question: 'Please enter your OpenAI API Key',
    description: 'Get this from platform.openai.com → API Keys',
    field: 'openaiApiKey',
    required: false,
    placeholder: 'sk-xxxxxxxxxxxxx',
  },
  {
    id: 'brandColors',
    type: 'color',
    question: 'What are your brand colors?',
    description: 'We\'ll use these for the chatbot widget and PDF branding.',
  },
  {
    id: 'logo',
    type: 'file',
    question: 'Upload your company logo (Optional)',
    description: 'PNG or SVG format recommended. This will appear on PDFs and the chat widget.',
    field: 'logo',
    required: false,
    accept: 'image/png,image/svg+xml,image/jpeg',
  },
  {
    id: 'samplePdf',
    type: 'file',
    question: 'Upload a sample Title Capture PDF',
    description: 'We\'ll match the layout and styling of your current quotes.',
    field: 'samplePdf',
    required: true,
    accept: 'application/pdf',
  },
  {
    id: 'additionalDocs',
    type: 'multifile',
    question: 'Upload any additional documents (Optional)',
    description: 'FAQ documents, Safe Listing Program info, JV/Franchise info, Fee Structure documents',
    field: 'additionalDocs',
    required: false,
    accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    id: 'calendlyLink',
    type: 'url',
    question: 'Do you have a Calendly scheduling link? (Optional)',
    description: 'For JV/Franchise inquiry scheduling.',
    field: 'calendlyLink',
    required: false,
    placeholder: 'https://calendly.com/your-link',
  },
  {
    id: 'notes',
    type: 'textarea',
    question: 'Any additional notes or instructions?',
    description: 'Anything else we should know about your project.',
    field: 'notes',
    required: false,
    placeholder: 'Type your notes here...',
  },
  {
    id: 'review',
    type: 'review',
    question: 'Review your information',
    description: 'Please make sure everything looks correct before submitting.',
  },
  {
    id: 'thankyou',
    type: 'thankyou',
    question: 'Thank you!',
    description: 'Your onboarding information has been submitted successfully. We\'ll be in touch shortly to kick off your project.',
  },
];
