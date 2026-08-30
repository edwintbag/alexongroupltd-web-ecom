import type { Job } from '@/types';

/**
 * No vacancies are stated in the supplied documents, so this list is empty
 * on purpose and the careers page renders its "No current vacancies" state
 * with the talent network form. Do not add invented roles.
 */
export const jobs: Job[] = [];

export const getJob = (slug: string) => jobs.find((j) => j.slug === slug);

/** Departments reflect the five service lines printed on the banner. */
export const departments = [
  'Production & Yard',
  'Construction',
  'Plant & Machinery',
  'Logistics & Fleet',
  'Water Supply',
  'Sales & Administration',
] as const;

export const cultureValues = [
  { title: 'Built on trust', body: 'The company line is also the hiring standard. Work that holds up is work you can put your name to.' },
  { title: 'Trained on the machine', body: 'Operators, masons and drivers learn on the plant they will run, alongside people who already run it.' },
  { title: 'One yard, five trades', body: 'Production, construction, plant, water and logistics sit on the same site — you see the whole project, not one slice.' },
  { title: 'Local by design', body: 'Alexon hires and builds in Ugunja and the wider region. Careers here do not require leaving home.' },
] as const;
