// All editable copy lives here. Components only render it.

// Transparent cutout (background removed, person untouched). Original kept alongside: 'Warm Portrait with Elephant Pendant.png'
import photo from '../assets/portrait.png'

export const profile = {
  name: 'Kennedy Njoroge',
  location: 'Nairobi, Kenya',
  email: 'kennedynjoroge29@gmail.com',
  phone: '+254 705 314 562',
  phoneRaw: '+254705314562',
  // contact cards: `copy` copies that text, `url` opens in a new tab
  contacts: [
    { icon: 'mail', label: 'Email', value: 'kennedynjoroge29@gmail.com', copy: 'kennedynjoroge29@gmail.com', color: 'var(--amber)' },
    { icon: 'phone', label: 'Phone', value: '+254 705 314 562', copy: '+254705314562', color: 'var(--teal)' },
    { icon: 'github', label: 'GitHub', value: 'github.com/kente001', url: 'https://github.com/kente001', color: 'var(--violet)' },
    { icon: 'linkedin', label: 'LinkedIn', value: 'in/kennedy-njoroge', url: 'https://www.linkedin.com/in/kennedy-njoroge-027b6216a/', color: 'var(--blue)' },
  ],
  photo,
}

export const navLinks = ['about', 'skills', 'tools', 'work', 'experience', 'contact']

export const stats = [
  { label: 'Scale', icon: 'db', color: 'var(--blue)', num: '100M+', cap: 'rows of data worked through' },
  { label: 'Scope', icon: 'table', color: 'var(--teal)', num: '2', cap: 'businesses, as the only analyst' },
  { label: 'Built', icon: 'layers', color: 'var(--violet)', num: '1', cap: 'data warehouse, from scratch' },
  { label: 'Focus', icon: 'target', color: 'var(--amber)', num: '1 by 1', cap: 'every customer read on their own', live: true },
]

// tags: a name found in LOGOS renders with its logo, anything else is plain text
export const skills = [
  { icon: 'db', color: 'var(--blue)', title: 'Getting answers from big data', body: 'Pulling clear answers out of very large datasets, and catching the errors before they reach a report.', tags: ['PostgreSQL', 'MySQL', 'DuckDB'] },
  { icon: 'users', color: 'var(--teal)', title: 'Understanding customers', body: 'Why customers stay, drift or leave, read one customer at a time instead of as one big average.', tags: ['retention', 'churn', 'segmentation'] },
  { icon: 'shield', color: 'var(--red)', live: true, title: 'Spotting fraud and abuse', body: "Finding usage that doesn't add up before it quietly costs the business real money.", tags: ['anomaly checks', 'revenue protection'] },
  { icon: 'bars', color: 'var(--amber)', title: 'Dashboards people use', body: 'Reports and dashboards built for the people who make decisions, not for other analysts.', tags: ['Power BI', 'Excel', 'Looker Studio'] },
  { icon: 'layers', color: 'var(--violet)', title: 'Building data pipelines', body: 'Setting up the flow that moves and cleans data automatically, every day. Foundational, from a personal project.', tags: ['dbt', 'Airflow', 'Docker'] },
  { icon: 'chat', color: 'var(--green)', title: 'Making it land', body: 'Turning a finding into a short, plain story that leads to a decision.', tags: ['Python', 'clear reports'] },
]

export const tools = ['Python', 'pandas', 'NumPy', 'PostgreSQL', 'MySQL', 'DuckDB', 'Power BI', 'Excel', 'Looker Studio', 'dbt', 'Airflow', 'Docker']

// viz: which chart/visual sits beside the story
export const projects = [
  {
    id: 'profile', viz: 'profile', color: 'var(--teal)', icon: 'users',
    domain: 'Customers · churn', title: 'Every customer has their own normal',
    body: 'Most businesses call a customer "lost" after a fixed number of days, or judge them by the group they belong to. But a daily buyer who goes quiet for a week is a bigger worry than a monthly buyer who does the same.',
    foundLabel: 'What I did',
    found: 'I read each customer by their own buying habit. That shows who has stopped acting like themselves early enough to win them back, which a group average never shows.',
  },
  {
    id: 'bias', viz: 'bias', color: 'var(--blue)', icon: 'scale',
    domain: 'Customers · retention', title: 'The program that looked like a win',
    body: 'Customers in a premium program stayed much longer than everyone else, so the obvious plan was to spend more on it. First I checked whether they were simply better customers to begin with.',
    foundLabel: 'What I found',
    found: 'They were. Compared fairly, like with like, most of the gap disappeared, and the budget went where it would actually help.',
  },
  {
    id: 'capacity', viz: 'capacity', color: 'var(--amber)', icon: 'phone',
    domain: 'Operations · call centre', title: 'Missed calls, missed customers',
    body: 'People said the call centre missed "a few" calls. I counted how many calls came in each hour against how many the team could actually take.',
    foundLabel: 'What I found',
    found: 'At peak hours the calls outran the team, and the people we missed were mostly new customers trying to sign up.',
    mode: 'Calls per hour', caption: 'Above the dashed line, calls go unanswered.',
  },
  {
    id: 'fraud', viz: 'fraud', color: 'var(--red)', icon: 'shield', live: true,
    domain: 'Revenue · fraud', title: "Usage that didn't add up",
    body: 'A handful of accounts were using the service in ways the pricing never allowed for. Hidden among thousands of normal accounts, they made no noise.',
    foundLabel: 'What I did',
    found: 'I built checks that flag these accounts automatically, so they get reviewed before the losses grow.',
    mode: "Use vs. what the plan allows", caption: 'Each bar is one account. The red ones are far past their plan.',
  },
  {
    id: 'warehouse', viz: 'flow', color: 'var(--violet)', icon: 'layers',
    domain: 'Personal project · data engineering', title: 'A data warehouse, built from scratch',
    body: 'To understand the whole journey data takes, I built one end to end: raw data comes in, gets cleaned in layers, and ends up ready for reports.',
    foundLabel: 'The point',
    found: 'It runs itself every day, and it stops on its own if the data fails a quality check, so bad numbers never reach a report.',
    tags: ['MySQL', 'dbt', 'Airflow', 'Docker'],
    mode: 'How the data flows',
  },
]

export const flowSteps = [
  { k: '#93a1b3', name: 'Raw', text: 'Data as it arrives' },
  { k: '#c98a4b', name: 'Bronze', text: 'Stored safely, untouched' },
  { k: '#b9c4d2', name: 'Silver', text: 'Cleaned and checked' },
  { k: '#f0c040', name: 'Gold', text: 'Ready for reports', run: true },
]

export const jobs = [
  { when: 'Jan 2026 – Present', title: 'Growth & Retention Analyst', org: 'Ahadi Wireless (Konnect)', body: 'The only analyst across two businesses, an internet provider and a water delivery service. I own the customer, revenue and operations analysis, from checking the data to the reports management acts on.' },
  { when: 'Earlier', title: 'Data Visualization Associate', org: 'Sao Paint', body: 'Cleaned and analysed data, and built dashboards in Power BI and Looker Studio for teams across the business.' },
  { when: 'Internship', title: 'Data Analyst', org: 'Excelerate', body: 'Collected and cleaned data, explored it for insights, and presented the findings to technical and non-technical audiences.' },
]

export const background = 'Background: BSc Microbiology, University of Kabianga. A scientist who changed fields and kept the habit of testing what everyone assumes.'
