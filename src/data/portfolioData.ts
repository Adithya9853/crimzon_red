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
  deliverables: string[];
  focusNote: string;
}

export interface CreativeSkillItem {
  id: string;
  title: string;
  description: string;
  iconKey: 'trees' | 'bird' | 'camera' | 'film' | 'clapperboard' | 'sparkles';
}

export interface ToolStackItem {
  id: string;
  name: string;
  category: string;
  iconKey: 'vn' | 'lightroom' | 'hypic' | 'photopea';
}

export interface PortfolioConfig {
  brand: {
    monogram: string;
    name: string;
    ctaLabel: string;
  };
  introStatement: {
    prefix: string;
    highlightOne: string;
    middle: string;
    highlightTwo: string;
    bridge: string;
    highlightThree: string;
  };
  hero: {
    kicker: string;
    name: string;
    role: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    portraitImage: string;
    backgroundImage: string;
    portraitAlt: string;
  };
  metrics: Array<{
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
    photographyFocus: string[];
    videoEditingFocus: string[];
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

/**
 * CENTRAL PORTFOLIO CONFIGURATION — PREETHAM KUMAR
 * Stage 1: Photography & Video Editing identity, categories, tools, and Instagram booking.
 * Hero images (/images/hero-person-cutout.png, /images/hero-bg-clean.png) and
 * About portrait (/images/about-portrait.png) remain preserved.
 */
export const portfolioData: PortfolioConfig = {
  brand: {
    monogram: 'PK',
    name: 'PREETHAM KUMAR',
    ctaLabel: 'BOOK VIA DM',
  },
  introStatement: {
    prefix: 'THE',
    highlightOne: 'CREATOR',
    middle: 'WHO TURNS',
    highlightTwo: 'MOMENTS',
    bridge: 'INTO',
    highlightThree: 'VISUAL STORIES',
  },
  hero: {
    kicker: 'PHOTOGRAPHY · VIDEO EDITING · VISUAL STORYTELLING',
    name: 'PREETHAM KUMAR',
    role: 'Visual Storyteller | Photographer | Video Editor',
    intro:
      'Capturing nature, wildlife, birds, portraits, travel, and landscapes — and shaping moments into cinematic reels, montages, and visual stories.',
    primaryCta: 'EXPLORE MY WORK',
    secondaryCta: 'BOOK VIA INSTAGRAM DM',
    portraitImage: '/images/hero-person-cutout.png',
    backgroundImage: '/images/hero-bg-clean.png',
    portraitAlt: 'Cinematic portrait of Preetham Kumar with crimson rim lighting',
  },
  metrics: [
    { value: 6, suffix: '', label: 'PHOTOGRAPHY GENRES' },
    { value: 6, suffix: '', label: 'VIDEO EDITING FORMATS' },
    { value: 4, suffix: '', label: 'CORE CREATIVE TOOLS' },
  ],
  projectsSection: (() => {
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
        label: 'Instagram Reels',
        shortLabel: 'Reels',
        discipline: 'Video Editing',
        instagramUrl: 'https://www.instagram.com/itzpreethkmar/',
      },
    };

    const items: ProjectItem[] = scannedMediaItems.map((media, idx) => {
      const meta = categoryMeta[media.categoryId];
      const cleanTitle =
        media.mediaType === 'image'
          ? `${meta.shortLabel} Study ${String(idx + 1).padStart(2, '0')}`
          : media.title
              .replace(/^WhatsApp\s+Video\s*/i, 'Reel ')
              .replace(/\s+\d{1,2}(\.\d{1,2})?\s*(AM|PM)$/i, '');
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

    const categories: CategoryFilterOption[] = [
      { id: 'all', label: 'All', count: items.length },
      { id: 'nature', label: 'Nature', count: categoryCounts.nature || 0 },
      { id: 'wildlife', label: 'Wildlife', count: categoryCounts.wildlife || 0 },
      { id: 'birds', label: 'Birds', count: categoryCounts.birds || 0 },
      { id: 'portraits', label: 'Portraits', count: categoryCounts.portraits || 0 },
      { id: 'travel', label: 'Travel', count: categoryCounts.travel || 0 },
      { id: 'landscapes', label: 'Landscapes', count: categoryCounts.landscapes || 0 },
      {
        id: 'instagram-reels',
        label: 'Reels',
        count: categoryCounts['instagram-reels'] || 0,
      },
    ];

    return {
      kicker: 'SELECTED WORK',
      title: 'PORTFOLIO.',
      subtitle:
        'Photography across six genres alongside muted cinematic Instagram Reels.',
      folderExists,
      categories,
      items,
    };
  })(),
  aboutSection: {
    kicker: 'CREATIVE PROFILE',
    title: 'ABOUT ME.',
    leadParagraph:
      "I'm Preetham Kumar — a visual storyteller, photographer, and video editor focused on expressive frames and cinematic short-form stories.",
    secondaryParagraph:
      'Across photography and video editing, I work with natural light, clean composition, and rhythmic pacing to turn everyday scenes, wildlife encounters, portraits, and travel moments into memorable visual work.',
    portraitImage: '/images/about-portrait.png',
    portraitAlt: 'Portrait of Preetham Kumar',
    cardName: 'PREETHAM KUMAR',
    cardRole: 'VISUAL STORYTELLER · PHOTO & VIDEO',
    coreTools: ['VN Video Editor', 'Adobe Lightroom', 'Hypic', 'Photopea'],
    photographyFocus: [
      'Nature Photography',
      'Wildlife Photography',
      'Bird Photography',
      'Portrait Photography',
      'Travel Photography',
      'Landscape Photography',
    ],
    videoEditingFocus: [
      'Cinematic Instagram Reels',
      'Travel Videos',
      'Event Highlights',
      'Short-form Social Media Videos',
      'Cinematic Montages',
      'Creative Visual Storytelling Videos',
    ],
    bookingNote: 'Direct inquiries and bookings via Instagram DM (@itzpreethkmar / @itzpreeth_clicks)',
  },
  servicesSection: {
    kicker: 'PHOTOGRAPHY & VIDEO EDITING',
    title: 'SERVICES.',
    items: [
      {
        id: 'nature-wildlife-bird-photo',
        title: 'Nature, Wildlife & Bird Photography',
        category: 'Photography',
        description:
          'Outdoor photography focused on wildlife, birds, and natural landscapes with careful tonal finishing.',
        bookingLabel: 'Instagram DM',
        deliverables: ['Nature Photography', 'Wildlife Photography', 'Bird Photography'],
        focusNote: 'Color graded in Adobe Lightroom & Hypic',
      },
      {
        id: 'portrait-travel-landscape-photo',
        title: 'Portrait, Travel & Landscape Photography',
        category: 'Photography',
        description:
          'Personal portraits, travel documentation, and scenic landscape compositions tailored to mood and light.',
        bookingLabel: 'Instagram DM',
        deliverables: ['Portrait Photography', 'Travel Photography', 'Landscape Photography'],
        focusNote: 'Retouching & finishing in Lightroom & Photopea',
      },
      {
        id: 'cinematic-reels-shortform',
        title: 'Cinematic Instagram Reels & Short-Form Videos',
        category: 'Video Editing',
        description:
          'Scroll-stopping vertical reels and short-form social media edits crafted for clean rhythm and impact.',
        bookingLabel: 'Instagram DM',
        deliverables: [
          'Cinematic Instagram Reels',
          'Short-form Social Media Videos',
          'Rhythmic Cut Pacing',
        ],
        focusNote: 'Edited in VN Video Editor',
      },
      {
        id: 'travel-videos-montages',
        title: 'Travel Videos & Cinematic Montages',
        category: 'Video Editing',
        description:
          'Atmospheric travel edits and cinematic montages that bring destination footage together seamlessly.',
        bookingLabel: 'Instagram DM',
        deliverables: ['Travel Videos', 'Cinematic Montages', 'Visual Continuity'],
        focusNote: 'Edited in VN Video Editor',
      },
      {
        id: 'event-highlights-storytelling',
        title: 'Event Highlights & Visual Storytelling Videos',
        category: 'Video Editing',
        description:
          'Focused event highlight recaps and creative visual storytelling edits shaped around key moments.',
        bookingLabel: 'Instagram DM',
        deliverables: [
          'Event Highlights',
          'Creative Visual Storytelling Videos',
          'Cover & Thumbnail Finishing',
        ],
        focusNote: 'Edited in VN Video Editor & Photopea',
      },
    ],
  },
  skillsSection: {
    kicker: 'CREATIVE DISCIPLINES',
    title: 'WHAT I DO.',
    items: [
      {
        id: 'skill-nature-wildlife',
        title: 'Nature & Wildlife Photography',
        description:
          'Capturing natural habitats, organic textures, and candid wildlife moments with patience and clarity.',
        iconKey: 'trees',
      },
      {
        id: 'skill-bird-landscape',
        title: 'Bird & Landscape Photography',
        description:
          'Framing avian subjects in detail alongside expansive landscapes shaped by natural light and depth.',
        iconKey: 'bird',
      },
      {
        id: 'skill-portrait-travel',
        title: 'Portrait & Travel Photography',
        description:
          'Creating expressive human portraits and authentic travel frames that preserve atmosphere and emotion.',
        iconKey: 'camera',
      },
      {
        id: 'skill-reels-shortform',
        title: 'Cinematic Reels & Short-Form',
        description:
          'Editing Cinematic Instagram Reels and short-form social media videos with crisp pacing and transitions.',
        iconKey: 'film',
      },
      {
        id: 'skill-travel-montages',
        title: 'Travel Videos & Montages',
        description:
          'Turning journey footage into engaging travel videos and cinematic montages with smooth visual flow.',
        iconKey: 'clapperboard',
      },
      {
        id: 'skill-events-storytelling',
        title: 'Event Highlights & Storytelling',
        description:
          'Crafting event highlight reels and creative visual storytelling videos that keep viewers immersed.',
        iconKey: 'sparkles',
      },
    ],
  },
  techStackSection: {
    kicker: 'EDITING WORKFLOW',
    title: 'TOOLS I USE.',
    items: [
      { id: 'tool-vn', name: 'VN Video Editor', category: 'Video Editing', iconKey: 'vn' },
      { id: 'tool-lightroom', name: 'Adobe Lightroom', category: 'Color & Photo', iconKey: 'lightroom' },
      { id: 'tool-hypic', name: 'Hypic', category: 'Photo Retouching', iconKey: 'hypic' },
      { id: 'tool-photopea', name: 'Photopea', category: 'Design & Composite', iconKey: 'photopea' },
    ],
  },
  contactSection: {
    kicker: 'BOOKINGS & COLLABORATIONS',
    title: 'CONTACT.',
    bookingChannel: 'Instagram DM',
    bookingNote: 'Send a direct message on Instagram with your shoot or video editing details.',
    personalInstagram: {
      label: 'Personal Instagram',
      handle: '@itzpreethkmar',
      url: 'https://www.instagram.com/itzpreethkmar/',
    },
    photographyInstagram: {
      label: 'Photography Instagram',
      handle: '@itzpreeth_clicks',
      url: 'https://www.instagram.com/itzpreeth_clicks/',
    },
    socials: [
      {
        label: 'Personal · @itzpreethkmar',
        handle: '@itzpreethkmar',
        url: 'https://www.instagram.com/itzpreethkmar/',
      },
      {
        label: 'Photography · @itzpreeth_clicks',
        handle: '@itzpreeth_clicks',
        url: 'https://www.instagram.com/itzpreeth_clicks/',
      },
    ],
  },
  endingSection: {
    counterTarget: 100,
    kicker: 'PHOTOGRAPHY · VIDEO EDITING · VISUAL STORYTELLING',
    replayLabel: 'BACK TO TOP',
    copyright: '© 2026 PREETHAM KUMAR. ALL RIGHTS RESERVED.',
  },
};
