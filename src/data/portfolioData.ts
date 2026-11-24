import {
  categoryCounts,
  folderExists,
  items as scannedMediaItems,
  PreethamCategoryId,
} from 'virtual:preetham-media';

export type PortfolioFilterId = 'all' | PreethamCategoryId;

export interface CategoryFilterOption {
  id: PortfolioFilterId;
  label: string;
  count: number;
}

export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  filename: string;
  extension: string;
  categoryId: PreethamCategoryId;
  category: string;
  discipline: 'Photography' | 'Video Editing';
  mediaType: 'image' | 'video';
  src: string;
  instagramUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'Photography' | 'Video Editing';
  description: string;
  bookingLabel: string;
  featured?: boolean;
  deliverables: string[];
  focusNote: string;
}

export interface CreativeSkillItem {
  id: string;
  title: string;
  category: string;
  discipline: string;
  description: string;
  iconKey: 'trees' | 'bird' | 'camera' | 'film' | 'clapperboard' | 'sparkles';
}

export interface ToolStackItem {
  id: string;
  name: string;
  shortLabel: string;
  category: string;
  glowColor: string;
  iconKey: 'vn' | 'lightroom' | 'hypic' | 'photopea';
}

export interface PortfolioConfig {
  brand: {
    firstLetter: string;
    restName: string;
    fullName: string;
    ctaLabel: string;
  };
  introStatement: {
    words: string[];
    redWords: string[];
    fullStatement: string;
  };
  hero: {
    kicker: string;
    name: string;
    roleLeft: string;
    roleRight: string;
    fullRole: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    portraitImage: string;
    backgroundImage: string;
    portraitAlt: string;
  };
  metrics: Array<{
    id: string;
    value: number;
    suffix: string;
    label: string;
  }>;
  projectsSection: {
    kicker: string;
    title: string;
    subtitle: string;
    folderExists: boolean;
    categories: CategoryFilterOption[];
    items: ProjectItem[];
  };
  aboutSection: {
    kicker: string;
    title: string;
    leadParagraph: string;
    secondaryParagraph: string;
    portraitImage: string;
    portraitAlt: string;
    cardName: string;
    cardRole: string;
    coreTools: string[];
    focusAreas: string[];
    bookingNote: string;
  };
  servicesSection: {
    kicker: string;
    title: string;
    items: ServiceItem[];
  };
  skillsSection: {
    kicker: string;
    title: string;
    items: CreativeSkillItem[];
  };
  techStackSection: {
    kicker: string;
    title: string;
    items: ToolStackItem[];
  };
  contactSection: {
    kicker: string;
    title: string;
    bookingChannel: string;
    bookingNote: string;
    personalInstagram: {
      label: string;
      handle: string;
      url: string;
    };
    photographyInstagram: {
      label: string;
      handle: string;
      url: string;
    };
    socials: Array<{
      id: string;
      label: string;
      handle: string;
      url: string;
    }>;
  };
  endingSection: {
    counterTarget: number;
    kicker: string;
    replayLabel: string;
    copyright: string;
  };
}

const categoryMeta: Record<
  PreethamCategoryId,
  {
    label: string;
    shortLabel: string;
    discipline: 'Photography' | 'Video Editing';
    instagramUrl: string;
  }
> = {
  nature: {
    label: 'Nature Photography',
    shortLabel: 'Nature',
    discipline: 'Photography',
    instagramUrl: 'https://www.instagram.com/itzpreeth_clicks/',
  },
  wildlife: {
    label: 'Wildlife Photography',
    shortLabel: 'Wildlife',
    discipline: 'Photography',
    instagramUrl: 'https://www.instagram.com/itzpreeth_clicks/',
  },
  birds: {
    label: 'Bird Photography',
    shortLabel: 'Birds',
    discipline: 'Photography',
    instagramUrl: 'https://www.instagram.com/itzpreeth_clicks/',
  },
  portraits: {
    label: 'Portrait Photography',
    shortLabel: 'Portraits',
    discipline: 'Photography',
    instagramUrl: 'https://www.instagram.com/itzpreeth_clicks/',
  },
  travel: {
    label: 'Travel Photography',
    shortLabel: 'Travel',
    discipline: 'Photography',
    instagramUrl: 'https://www.instagram.com/itzpreeth_clicks/',
  },
  landscapes: {
    label: 'Landscape Photography',
    shortLabel: 'Landscapes',
    discipline: 'Photography',
    instagramUrl: 'https://www.instagram.com/itzpreeth_clicks/',
  },
  'instagram-reels': {
    label: 'Cinematic Reels',
    shortLabel: 'Reels',
    discipline: 'Video Editing',
    instagramUrl: 'https://www.instagram.com/itzpreethkmar/',
  },
};

const builtItems: ProjectItem[] = scannedMediaItems.map((media, idx) => {
  const meta = categoryMeta[media.categoryId];
  const cleanTitle =
    media.mediaType === 'image'
      ? `${meta.shortLabel} Frame ${String(idx + 1).padStart(2, '0')}`
      : `Cinematic Reel ${String(
          scannedMediaItems
            .slice(0, idx + 1)
            .filter((m) => m.mediaType === 'video').length
        ).padStart(2, '0')}`;

  return {
    id: media.id,
    index: String(idx + 1).padStart(2, '0'),
    title: cleanTitle,
    filename: media.filename,
    extension: media.extension,
    categoryId: media.categoryId,
    category: meta.label,
    discipline: meta.discipline,
    mediaType: media.mediaType,
    src: media.src,
    instagramUrl: meta.instagramUrl,
  };
});

const builtCategories: CategoryFilterOption[] = [
  { id: 'all', label: 'All Work', count: builtItems.length },
  { id: 'nature', label: 'Nature', count: categoryCounts.nature || 0 },
  { id: 'wildlife', label: 'Wildlife', count: categoryCounts.wildlife || 0 },
  { id: 'birds', label: 'Birds', count: categoryCounts.birds || 0 },
  { id: 'portraits', label: 'Portraits', count: categoryCounts.portraits || 0 },
  { id: 'travel', label: 'Travel', count: categoryCounts.travel || 0 },
  { id: 'landscapes', label: 'Landscapes', count: categoryCounts.landscapes || 0 },
  {
    id: 'instagram-reels',
    label: 'Cinematic Reels',
    count: categoryCounts['instagram-reels'] || 0,
  },
];

export const portfolioData: PortfolioConfig = {
  brand: {
    firstLetter: 'P',
    restName: 'REETHAM.',
    fullName: 'PREETHAM KUMAR',
    ctaLabel: "Let's Talk",
  },
  introStatement: {
    words: [
      'PREETHAM',
      'KUMAR',
      '—',
      'TURNING',
      'MOMENTS',
      'INTO',
      'VISUAL',
      'STORIES',
    ],
    redWords: ['PREETHAM', 'KUMAR', 'VISUAL', 'STORIES'],
    fullStatement: 'PREETHAM KUMAR — TURNING MOMENTS INTO VISUAL STORIES',
  },
  hero: {
    kicker: 'VISUAL STORYTELLER · PHOTOGRAPHER · VIDEO EDITOR',
    name: 'PREETHAM KUMAR',
    roleLeft: 'PHOTOGRAPHER',
    roleRight: 'VIDEO EDITOR',
    fullRole: 'Visual Storyteller | Photographer | Video Editor',
    intro:
      'Capturing nature, wildlife, birds, portraits, travel, and landscapes — and shaping moments into cinematic reels and visual stories.',
    primaryCta: 'Explore Work',
    secondaryCta: 'Book via DM',
    portraitImage: '/images/hero-person-cutout.png',
    backgroundImage: '/images/hero-bg-clean.png',
    portraitAlt: 'Portrait of Preetham Kumar in a black suit against a crimson backdrop',
  },
  metrics: [
    {
      id: 'works',
      value: builtItems.length,
      suffix: '',
      label: 'Featured Captures & Reels',
    },
    {
      id: 'genres',
      value: 6,
      suffix: '',
      label: 'Photography Genres',
    },
    {
      id: 'tools',
      value: 4,
      suffix: '',
      label: 'Core Creative Tools',
    },
  ],
  projectsSection: {
    kicker: 'Selected Work',
    title: 'PORTFOLIO.',
    subtitle:
      'Photography across nature, wildlife, birds, portraits, travel, and landscapes paired with silent cinematic Instagram Reels.',
    folderExists,
    categories: builtCategories,
    items: builtItems,
  },
  aboutSection: {
    kicker: 'Visual Storyteller · Photographer · Video Editor',
    title: 'ABOUT ME.',
    leadParagraph:
      "I'm Preetham Kumar — a visual storyteller, photographer, and video editor focused on expressive frames and cinematic short-form stories.",
    secondaryParagraph:
      'Across photography and video editing, I work with natural light, clean composition, and rhythmic pacing to turn everyday scenes, wildlife encounters, portraits, and travel moments into memorable visual work.',
    portraitImage: '/images/about-portrait.png',
    portraitAlt: 'Portrait of Preetham Kumar',
    cardName: 'Preetham Kumar',
    cardRole: 'Visual Storyteller',
    coreTools: ['VN Video Editor', 'Adobe Lightroom', 'Hypic', 'Photopea'],
    focusAreas: [
      'Nature Photography',
      'Wildlife Photography',
      'Bird Photography',
      'Portrait Photography',
      'Travel Photography',
      'Landscape Photography',
      'Cinematic Reels',
      'Travel Videos',
      'Event Highlights',
      'Cinematic Montages',
    ],
    bookingNote: 'Direct inquiries and bookings via Instagram DM (@itzpreethkmar / @itzpreeth_clicks)',
  },
  servicesSection: {
    kicker: 'What I Do',
    title: 'SERVICES.',
    items: [
      {
        id: 'professional-photography',
        title: 'Professional Photography',
        category: 'Photography',
        description:
          'Editorial and creative visual sessions with careful framing, natural light direction, and tonal grading.',
        bookingLabel: 'Instagram DM',
        featured: true,
        deliverables: ['Creative Direction', 'Color Grading', 'High-Res Delivery'],
        focusNote: 'Lightroom & Hypic Finishing',
      },
      {
        id: 'portrait-photography',
        title: 'Portrait Photography',
        category: 'Photography',
        description:
          'Expressive personal and creative portraits balanced for mood, skin tone accuracy, and composition.',
        bookingLabel: 'Instagram DM',
        deliverables: ['Natural Light Portraits', 'Tonal Retouching', 'Print-Ready Crops'],
        focusNote: 'Lightroom & Photopea',
      },
      {
        id: 'nature-wildlife-photography',
        title: 'Nature & Wildlife Photography',
        category: 'Photography',
        description:
          'Field captures of wildlife, birds, and natural habitats preserving raw texture, atmosphere, and detail.',
        bookingLabel: 'Instagram DM',
        deliverables: ['Nature Photography', 'Wildlife Photography', 'Bird Photography'],
        focusNote: 'Field Capture & Detail Grading',
      },
      {
        id: 'travel-photography',
        title: 'Travel & Landscape Photography',
        category: 'Photography',
        description:
          'Destination stories and expansive landscapes crafted to preserve depth, horizon light, and sense of place.',
        bookingLabel: 'Instagram DM',
        deliverables: ['Travel Documentation', 'Scenic Landscapes', 'Color Consistency'],
        focusNote: 'Lightroom Preset Grading',
      },
      {
        id: 'cinematic-video-editing',
        title: 'Cinematic Video Editing',
        category: 'Video Editing',
        description:
          'Atmospheric travel edits, cinematic montages, and visual storytelling sequences cut with smooth flow.',
        bookingLabel: 'Instagram DM',
        featured: true,
        deliverables: ['Travel Videos', 'Cinematic Montages', 'Color & Pacing'],
        focusNote: 'VN Video Editor',
      },
      {
        id: 'reels-shortform-editing',
        title: 'Reels & Short-Form Editing',
        category: 'Video Editing',
        description:
          'Vertical Instagram Reels and short-form social media edits shaped for crisp beat timing and visual impact.',
        bookingLabel: 'Instagram DM',
        deliverables: ['Cinematic Instagram Reels', 'Short-Form Verticals', 'Hook Pacing'],
        focusNote: 'VN Video Editor',
      },
      {
        id: 'event-video-editing',
        title: 'Event Video Editing',
        category: 'Video Editing',
        description:
          'Focused event highlight recaps and storytelling cuts built around key moments, transitions, and covers.',
        bookingLabel: 'Instagram DM',
        deliverables: ['Event Highlights', 'Storytelling Recaps', 'Cover Finishing'],
        focusNote: 'VN Video Editor & Photopea',
      },
    ],
  },
  skillsSection: {
    kicker: 'What I Work With',
    title: 'CREATIVE SKILLS.',
    items: [
      {
        id: 'skill-nature-wildlife',
        title: 'Nature & Wildlife Photography',
        category: 'Habitats · Wildlife · Field Detail',
        discipline: 'Photography',
        description:
          'Capturing natural habitats, organic textures, and candid wildlife moments with patience and clarity.',
        iconKey: 'trees',
      },
      {
        id: 'skill-bird-landscape',
        title: 'Bird & Landscape Photography',
        category: 'Avian Framing · Horizons · Light',
        discipline: 'Photography',
        description:
          'Framing avian subjects in detail alongside expansive landscapes shaped by natural light and depth.',
        iconKey: 'bird',
      },
      {
        id: 'skill-portrait-travel',
        title: 'Portrait & Travel Photography',
        category: 'Portraits · Travel Stories',
        discipline: 'Photography',
        description:
          'Creating expressive human portraits and authentic travel frames that preserve atmosphere and emotion.',
        iconKey: 'camera',
      },
      {
        id: 'skill-reels-shortform',
        title: 'Cinematic Reels & Short-Form',
        category: 'Vertical Video · Beat Pacing',
        discipline: 'Video Editing',
        description:
          'Editing Cinematic Instagram Reels and short-form social media videos with crisp pacing and transitions.',
        iconKey: 'film',
      },
      {
        id: 'skill-travel-montages',
        title: 'Travel Videos & Montages',
        category: 'Visual Continuity · Flow',
        discipline: 'Video Editing',
        description:
          'Turning journey footage into engaging travel videos and cinematic montages with smooth visual flow.',
        iconKey: 'clapperboard',
      },
      {
        id: 'skill-events-storytelling',
        title: 'Event Highlights & Storytelling',
        category: 'Recaps · Narrative Cuts',
        discipline: 'Post-Production',
        description:
          'Crafting event highlight reels and creative visual storytelling videos that keep viewers immersed.',
        iconKey: 'sparkles',
      },
    ],
  },
  techStackSection: {
    kicker: 'Editing & Color Workflow',
    title: 'TOOLS I USE.',
    items: [
      {
        id: 'tool-vn',
        name: 'VN Video\nEditor',
        shortLabel: 'VN',
        category: 'Video Editing',
        glowColor: '#D81E2F',
        iconKey: 'vn',
      },
      {
        id: 'tool-lightroom',
        name: 'Adobe\nLightroom',
        shortLabel: 'Lr',
        category: 'Color & Photo',
        glowColor: '#31A8FF',
        iconKey: 'lightroom',
      },
      {
        id: 'tool-hypic',
        name: 'Hypic',
        shortLabel: 'Hypic',
        category: 'Photo Retouching',
        glowColor: '#FF7887',
        iconKey: 'hypic',
      },
      {
        id: 'tool-photopea',
        name: 'Photopea',
        shortLabel: 'Ps',
        category: 'Design & Composite',
        glowColor: '#18A497',
        iconKey: 'photopea',
      },
    ],
  },
  contactSection: {
    kicker: 'Get In Touch',
    title: 'CONTACT.',
    bookingChannel: 'Instagram DM & Email',
    bookingNote: 'Reach out directly via Instagram DM or send an email brief for shoots and video editing.',
    personalInstagram: {
      label: 'Personal Instagram · Reels & Inquiries',
      handle: '@itzpreethkmar',
      url: 'https://www.instagram.com/itzpreethkmar/',
    },
    photographyInstagram: {
      label: 'Photography Instagram · @itzpreeth_clicks',
      handle: '@itzpreeth_clicks',
      url: 'https://www.instagram.com/itzpreeth_clicks/',
    },
    socials: [
      {
        id: 'ig-personal',
        label: 'Instagram · @itzpreethkmar',
        handle: '@itzpreethkmar',
        url: 'https://www.instagram.com/itzpreethkmar/',
      },
      {
        id: 'ig-photo',
        label: 'Photography · @itzpreeth_clicks',
        handle: '@itzpreeth_clicks',
        url: 'https://www.instagram.com/itzpreeth_clicks/',
      },
    ],
  },
  endingSection: {
    counterTarget: 100,
    kicker: 'Visual Storyteller · Photographer · Video Editor',
    replayLabel: 'Back to Top',
    copyright: '© 2026 PREETHAM KUMAR. ALL RIGHTS RESERVED.',
  },
};
