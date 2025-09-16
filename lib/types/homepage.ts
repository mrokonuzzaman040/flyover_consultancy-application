// Homepage data types

export interface IButtonAction {
  label: string;
  href?: string;
  isModal?: boolean;
}

export interface ISlide {
  _id: string;
  image: string;
  headline: string;
  sub: string;
  primary: IButtonAction;
  secondary: {
    label: string;
    href: string;
    isModal?: boolean;
  };
  order?: number;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFeature {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}

export interface IProcessStep {
  _id?: string;
  step: string;
  title: string;
  description: string;
}

export interface IService {
  _id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  sectionsMD: string[];
  features: IFeature[];
  benefits: string[];
  process: IProcessStep[];
  ctaLabel: string;
  ctaText: string;
  popular?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IDestination {
  _id: string;
  name: string;
  slug: string;
  country: string;
  flag: string;
  description: string;
  image: string;
  popular?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IWhyChooseUsFeature {
  _id: string;
  icon: string;
  title: string;
  description: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IStudyAbroadStep {
  _id: string;
  step: number;
  title: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISuccessStory {
  _id: string;
  storyId: string;
  rating: number;
  text: string;
  author: string;
  country: string;
  scholarship: string;
  year: string;
  avatar: string;
  flag: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface IInsight {
  _id: string;
  insightId: string;
  category: string;
  categoryColor: string;
  author: string;
  authorRole: string;
  readTime: string;
  publishDate: string;
  title: string;
  excerpt: string;
  image: string;
  featured: boolean;
  views: string;
  likes: string;
  createdAt: string;
  updatedAt: string;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPartner {
  _id: string;
  name: string;
  logo: string;
  website?: string;
  category: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAward {
  _id: string;
  title: string;
  description: string;
  year: string;
  organization: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStat {
  _id: string;
  icon: string;
  value: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOfficeHour {
  day: string;
  open: string;
  close: string;
}

export interface ISocial {
  platform: string;
  url: string;
}

export interface IContactInfo {
  _id: string;
  address: string;
  city: string;
  country: string;
  phones: string[];
  emails: string[];
  mapEmbedUrl: string;
  officeHours: IOfficeHour[];
  socials: ISocial[];
  createdAt: string;
  updatedAt: string;
}

export interface HomepageData {
  slides: ISlide[];
  services: IService[];
  destinations: IDestination[];
  whychooseusfeatures: IWhyChooseUsFeature[];
  studyabroadsteps: IStudyAbroadStep[];
  successStories: ISuccessStory[];
  insights: IInsight[];
  events: IEvent[];
  upcomingEvents: IEvent[];
  partners: IPartner[];
  awards: IAward[];
  stats: IStat[];
  contactInfo: IContactInfo | null;
}

export interface HomepageApiResponse {
  success: boolean;
  data: HomepageData;
  error?: string;
}