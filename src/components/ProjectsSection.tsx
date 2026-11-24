import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  FolderOpen,
  Instagram,
  X,
} from 'lucide-react';
import {
  PortfolioFilterId,
  portfolioData,
  ProjectItem,
} from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

const INITIAL_GRID_LIMIT = 8;

function GridVideoCardMedia({
  src,
  shouldPlay,
}: {
  src: string;
  shouldPlay: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const attachRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      el.muted = true;
      el.defaultMuted = true;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    if (shouldPlay) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Ignore browser autoplay interruptions
        });
      }
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <video
      ref={attachRef}
      src={src}
      muted
      loop
      playsInline
      controls={false}
      disablePictureInPicture
      preload="metadata"
      className="h-full w-full bg-[#07070a] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
    />
  );
}

function LightboxVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const attachRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      el.muted = true;
      el.defaultMuted = true;
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
    return () => {
      video.pause();
    };
  }, [src]);

  return (
    <video
      ref={attachRef}
      key={src}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      disablePictureInPicture
      preload="auto"
      className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain"
    />
  );
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const stripTrackRef = useRef<HTMLDivElement | null>(null);
  const projectGridRef = useRef<HTMLDivElement | null>(null);
  const videoCardsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const visibleVideoIdsRef = useRef<Set<string>>(new Set());
  const touchStartXRef = useRef<number | null>(null);

  const [activeCategory, setActiveCategory] = useState<PortfolioFilterId>('all');
  const [showAllInOverview, setShowAllInOverview] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeGridVideoId, setActiveGridVideoId] = useState<string | null>(null);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { projectsSection } = portfolioData;

  const orderedAllItems = useMemo(() => {
    if (projectsSection.items.length <= INITIAL_GRID_LIMIT) {
      return projectsSection.items;
    }

    const buckets = new Map<string, ProjectItem[]>();
    for (const item of projectsSection.items) {
      const list = buckets.get(item.categoryId) || [];
      list.push(item);
      buckets.set(item.categoryId, list);
    }

    const roundRobin: ProjectItem[] = [];
    let added = true;
    let depth = 0;
    while (added) {
      added = false;
      for (const list of buckets.values()) {
        if (depth < list.length) {
          roundRobin.push(list[depth]);
          added = true;
        }
      }
      depth += 1;
    }

    return roundRobin;
  }, [projectsSection.items]);

  const photoItems = useMemo(
    () => projectsSection.items.filter((item) => item.mediaType === 'image'),
    [projectsSection.items]
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return orderedAllItems;
    }
    return projectsSection.items.filter(
      (item) => item.categoryId === activeCategory
    );
  }, [activeCategory, orderedAllItems, projectsSection.items]);

  const displayedItems = useMemo(() => {
    if (activeCategory === 'all' && !showAllInOverview) {
      return filteredItems.slice(0, INITIAL_GRID_LIMIT);
    }
    return filteredItems;
  }, [activeCategory, filteredItems, showAllInOverview]);

  const activeProject =
    activeIndex !== null && activeIndex >= 0 && activeIndex < filteredItems.length
      ? filteredItems[activeIndex]
      : null;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll-triggered heading reveal, card clipping/stagger, and horizontal gallery drift
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.children,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }

      if (stripTrackRef.current && window.innerWidth >= 768) {
        gsap.fromTo(
          stripTrackRef.current,
          { x: 40 },
          {
            x: -140,
            ease: 'none',
            scrollTrigger: {
              trigger: stripTrackRef.current,
              start: 'top 95%',
              end: 'bottom 10%',
              scrub: 1.2,
            },
          }
        );
      }

      const cards = projectGridRef.current?.querySelectorAll<HTMLElement>('.project-card-item');
      const grid = projectGridRef.current;
      if (cards?.length && grid) {
        const gridRect = grid.getBoundingClientRect();
        const centerX = gridRect.width / 2;
        const centerY = gridRect.height / 2;
        const radiusX = Math.min(gridRect.width * 0.38, 390);
        const radiusY = Math.min(gridRect.height * 0.2, 150);
        const depth = Math.min(420, gridRect.width * 0.42);
        const sequence = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: 'top 84%',
            end: 'bottom 54%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect();
          const cardX = cardRect.left - gridRect.left + cardRect.width / 2;
          const cardY = cardRect.top - gridRect.top + cardRect.height / 2;
          const startAngle = -Math.PI / 2 + (index / cards.length) * Math.PI * 2;
          const orbit = { angle: startAngle, reveal: 0 };
          const placeOnOrbit = () => {
            const angle = orbit.angle;
            const depthPhase = Math.sin(angle);
            gsap.set(card, {
              x: centerX + Math.cos(angle) * radiusX - cardX,
              y: centerY + Math.sin(angle) * radiusY - cardY,
              z: depthPhase * depth,
              rotationY: Math.cos(angle) * 58,
              rotationX: Math.sin(angle) * -12,
              rotationZ: Math.cos(angle) * 5,
              scale: 0.68 + (depthPhase + 1) * 0.12,
              opacity: orbit.reveal * (0.58 + (depthPhase + 1) * 0.18),
              filter: `blur(${(1 - (depthPhase + 1) / 2) * 3.5}px)`,
            });
          };

          placeOnOrbit();
          sequence.to(
            orbit,
            {
              angle: startAngle + Math.PI * 2,
              duration: 1.35,
              ease: 'none',
              onUpdate: placeOnOrbit,
            },
            index * 0.12
          );
          sequence.to(
            orbit,
            {
              reveal: 1,
              duration: 0.48,
              ease: 'none',
              onUpdate: placeOnOrbit,
            },
            index * 0.12
          );
          sequence.to(
            card,
            { opacity: 1, filter: 'blur(0px)', duration: 0.2, ease: 'power1.out' },
            index * 0.12
          );
          sequence.to(
            card,
            {
              x: 0,
              y: 0,
              z: 0,
              rotationY: 0,
              rotationX: 0,
              rotationZ: 0,
              scale: 1,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.76,
              ease: 'power3.inOut',
            },
            1.35 + index * 0.12
          );

          const mediaStage = card.querySelector<HTMLElement>('.project-media-reveal');
          if (mediaStage) {
            sequence.fromTo(
              mediaStage,
              { clipPath: 'inset(8% 0% 8% 0% round 14px)' },
              {
                clipPath: 'inset(0% 0% 0% 0% round 14px)',
                duration: 0.68,
                ease: 'power3.out',
              },
              1.52 + index * 0.12
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, activeCategory, showAllInOverview, displayedItems.length]);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [activeCategory, showAllInOverview, displayedItems.length]);

  // Pointer spotlight tracking for .card-spotlight
  const handleCardPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  // Video visibility observer — strictly 1 muted reel plays at a time
  const pickSingleVisibleVideo = useCallback(() => {
    if (prefersReducedMotion || activeIndex !== null) {
      setActiveGridVideoId(null);
      return;
    }

    if (hoveredVideoId && visibleVideoIdsRef.current.has(hoveredVideoId)) {
      setActiveGridVideoId(hoveredVideoId);
      return;
    }

    for (const item of displayedItems) {
      if (item.mediaType === 'video' && visibleVideoIdsRef.current.has(item.id)) {
        setActiveGridVideoId(item.id);
        return;
      }
    }

    setActiveGridVideoId(null);
  }, [activeIndex, displayedItems, hoveredVideoId, prefersReducedMotion]);

  useEffect(() => {
    visibleVideoIdsRef.current.clear();
    if (prefersReducedMotion || activeIndex !== null) {
      setActiveGridVideoId(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.videoId;
          if (!id) continue;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            visibleVideoIdsRef.current.add(id);
          } else {
            visibleVideoIdsRef.current.delete(id);
          }
        }
        pickSingleVisibleVideo();
      },
      { threshold: [0, 0.45, 0.8] }
    );

    for (const item of displayedItems) {
      if (item.mediaType === 'video') {
        const node = videoCardsRef.current.get(item.id);
        if (node) observer.observe(node);
      }
    }

    return () => {
      observer.disconnect();
      visibleVideoIdsRef.current.clear();
    };
  }, [activeIndex, displayedItems, pickSingleVisibleVideo, prefersReducedMotion]);

  useEffect(() => {
    pickSingleVisibleVideo();
  }, [hoveredVideoId, pickSingleVisibleVideo]);

  const registerVideoCardNode = useCallback(
    (id: string, node: HTMLButtonElement | null) => {
      if (node) videoCardsRef.current.set(id, node);
      else videoCardsRef.current.delete(id);
    },
    []
  );

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null || filteredItems.length <= 1) return prev;
      return (prev + 1) % filteredItems.length;
    });
  }, [filteredItems.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null || filteredItems.length <= 1) return prev;
      return (prev - 1 + filteredItems.length) % filteredItems.length;
    });
  }, [filteredItems.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === 'Escape') setActiveIndex(null);
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, handleNext, handlePrev]);

  const handleSelectCategory = (categoryId: PortfolioFilterId) => {
    setActiveCategory(categoryId);
    setActiveIndex(null);
    if (categoryId !== 'all') setShowAllInOverview(false);
  };

  const openLightboxForItem = (item: ProjectItem) => {
    const idxInFiltered = filteredItems.findIndex((i) => i.id === item.id);
    if (idxInFiltered >= 0) {
      setActiveIndex(idxInFiltered);
    } else {
      setActiveCategory('all');
      setShowAllInOverview(true);
      const idxInAll = orderedAllItems.findIndex((i) => i.id === item.id);
      setActiveIndex(idxInAll >= 0 ? idxInAll : 0);
    }
  };

  const activeCategoryLabel =
    projectsSection.categories.find((c) => c.id === activeCategory)?.label ||
    'Selected Category';

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-10 w-full overflow-hidden border-t border-white/5 px-5 py-24 md:px-12 lg:px-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Reference Section Heading */}
        <div
          ref={headingRef}
          className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <span className="block text-sm font-bold tracking-[0.2em] text-[#A31515] uppercase md:text-base">
              {projectsSection.kicker}
            </span>
            <h2 className="mt-2 text-5xl font-black tracking-tight text-white uppercase sm:text-6xl md:text-7xl">
              {projectsSection.title}
            </h2>
            <div className="mt-3 h-1.5 w-20 rounded-full bg-[#A31515]" />
          </div>
          <p className="max-w-md text-sm leading-relaxed text-gray-400 md:text-base">
            {projectsSection.subtitle}
          </p>
        </div>

        {/* Horizontal Scroll-Parallax Photography Filmstrip */}
        {photoItems.length > 0 && activeCategory === 'all' && !showAllInOverview && (
          <div className="mb-12 overflow-hidden rounded-3xl border border-white/8 bg-[#0b0a0e]/70 py-5">
            <div className="mb-3 flex items-center justify-between px-5">
              <span className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#FF7887] uppercase">
                Photography Filmstrip
              </span>
              <span className="font-mono text-[11px] text-gray-500">
                Click any frame to view full-screen
              </span>
            </div>
            <div
              ref={stripTrackRef}
              className="flex gap-4 overflow-x-auto px-5 pb-2 md:overflow-visible md:pb-0"
            >
              {photoItems.slice(0, 8).map((photo) => (
                <button
                  key={`strip-${photo.id}`}
                  type="button"
                  onClick={() => openLightboxForItem(photo)}
                  className="group relative aspect-[16/10] w-56 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#101012] sm:w-64 md:w-72"
                >
                  <img
                    src={photo.src}
                    alt={`${photo.category} — ${photo.title}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute bottom-2.5 left-3 font-mono text-[10px] tracking-[0.16em] text-gray-200 uppercase">
                    {photo.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Portfolio categories"
          className="mb-9 flex items-center gap-2.5 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
        >
          {projectsSection.categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => handleSelectCategory(cat.id)}
                className={`inline-flex min-h-[42px] shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                  isActive
                    ? 'glass-chip-red text-white shadow-[0_8px_22px_-10px_rgba(255,18,56,0.6)]'
                    : 'glass-chip text-gray-300 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isActive ? 'text-white/90' : 'text-gray-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Portfolio Grid */}
        {displayedItems.length > 0 ? (
          <div className="relative">
            <div className="red-halo" aria-hidden="true" />
            <div ref={projectGridRef} className="project-orbit-stage grid-blur relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
              {displayedItems.map((project, idx) => {
                const isVideo = project.mediaType === 'video';
                const shouldPlayVideo =
                  isVideo &&
                  !prefersReducedMotion &&
                  activeIndex === null &&
                  activeGridVideoId === project.id;

                const lightboxTargetIndex = filteredItems.findIndex(
                  (item) => item.id === project.id
                );

                return (
                  <button
                    key={project.id}
                    ref={
                      isVideo
                        ? (node) => registerVideoCardNode(project.id, node)
                        : undefined
                    }
                    data-video-id={isVideo ? project.id : undefined}
                    type="button"
                    onPointerMove={handleCardPointerMove}
                    onMouseEnter={
                      isVideo ? () => setHoveredVideoId(project.id) : undefined
                    }
                    onMouseLeave={
                      isVideo ? () => setHoveredVideoId(null) : undefined
                    }
                    onClick={() =>
                      setActiveIndex(
                        lightboxTargetIndex >= 0 ? lightboxTargetIndex : idx
                      )
                    }
                    className="project-card-item glass glass-grid-card group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl p-3 text-left focus-visible:outline-2 focus-visible:outline-[#D81E2F]"
                  >
                    <div className="card-spotlight" aria-hidden="true" />

                    {/* Media Frame */}
                    <div className="project-media-reveal relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#07070a]">
                      {isVideo ? (
                        <GridVideoCardMedia
                          src={project.src}
                          shouldPlay={shouldPlayVideo}
                        />
                      ) : (
                        <img
                          src={project.src}
                          alt={`${project.category} — ${project.title}`}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                      <span className="absolute top-3 left-3 font-mono text-xs font-bold tracking-widest text-white/80 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {isVideo && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.16em] text-[#FF7887] uppercase">
                          <Film className="h-3 w-3" />
                          <span>Silent Reel</span>
                        </span>
                      )}

                      <span className="glass-chip absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-200 transition-colors group-hover:border-[#D81E2F] group-hover:bg-[#D81E2F] group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Card Details — Clean Unboxed Typography */}
                    <div className="relative z-10 flex flex-1 flex-col justify-between px-2 pt-4 pb-2">
                      <div>
                        <p className="font-mono text-[11px] font-semibold tracking-[0.16em] text-[#FF7887] uppercase">
                          {project.category}
                        </p>
                        <h3 className="mt-1 line-clamp-1 text-base font-bold tracking-tight text-gray-100 transition-colors group-hover:text-white sm:text-lg">
                          {project.title}
                        </h3>
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-white/8 pt-3 font-mono text-[11px] text-gray-400 uppercase">
                        <span>{project.discipline}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.extension}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expand/Collapse Toggle */}
            {activeCategory === 'all' &&
              filteredItems.length > INITIAL_GRID_LIMIT && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllInOverview((prev) => !prev)}
                    className="glass-chip inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-7 py-2.5 text-xs font-bold tracking-wider text-gray-200 uppercase hover:text-white"
                  >
                    {showAllInOverview
                      ? 'Show Featured Grid (8)'
                      : `View All ${filteredItems.length} Works`}
                  </button>
                </div>
              )}
          </div>
        ) : (
          <div className="glass mx-auto max-w-2xl rounded-3xl p-8 text-center sm:p-10">
            <div className="glass-chip mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-[#FF7887]">
              <FolderOpen className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-bold tracking-tight text-white uppercase">
              No Files in {activeCategoryLabel}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
              {projectsSection.folderExists
                ? 'No supported image or video files were found in this category.'
                : 'Add photography and reel files under public/preetham/ to populate this gallery.'}
            </p>
            {activeCategory !== 'all' && projectsSection.items.length > 0 && (
              <button
                type="button"
                onClick={() => handleSelectCategory('all')}
                className="glass-red mt-6 inline-flex min-h-[42px] cursor-pointer items-center rounded-full px-6 py-2 text-xs font-bold tracking-wider text-white uppercase"
              >
                Show All Work
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Media Lightbox (Silent Muted Video, Keyboard & Touch Swipe) */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="glass relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close lightbox"
              onClick={() => setActiveIndex(null)}
              className="glass-chip absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="relative flex min-h-[260px] flex-1 items-center justify-center overflow-hidden border-b border-white/10 bg-[#07070a] p-3 sm:p-5"
              onTouchStart={(e) => {
                touchStartXRef.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                if (touchStartXRef.current === null) return;
                const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
                const delta = endX - touchStartXRef.current;
                touchStartXRef.current = null;
                if (Math.abs(delta) > 45) {
                  if (delta < 0) handleNext();
                  else handlePrev();
                }
              }}
            >
              {activeProject.mediaType === 'video' ? (
                <LightboxVideoPlayer src={activeProject.src} />
              ) : (
                <img
                  src={activeProject.src}
                  alt={`${activeProject.category} — ${activeProject.title}`}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain"
                />
              )}

              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous item"
                    onClick={handlePrev}
                    className="glass-chip absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next item"
                    onClick={handleNext}
                    className="glass-chip absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#FF7887] uppercase">
                  <span>{String((activeIndex ?? 0) + 1).padStart(2, '0')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProject.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-gray-400">{activeProject.extension}</span>
                </div>

                {filteredItems.length > 1 && (
                  <span className="font-mono text-xs text-gray-400 tabular-nums">
                    {(activeIndex ?? 0) + 1} / {filteredItems.length}
                  </span>
                )}
              </div>

              <h3
                id="project-modal-title"
                className="mt-2 text-xl font-black text-white sm:text-2xl"
              >
                {activeProject.title}
              </h3>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  onClick={() => setActiveIndex(null)}
                  className="glass-red inline-flex min-h-[42px] items-center gap-2 rounded-full px-6 py-2 text-xs font-bold tracking-wider text-white uppercase"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Book Similar Shoot</span>
                </a>
                <a
                  href={activeProject.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-chip inline-flex min-h-[42px] items-center gap-2 rounded-full px-6 py-2 text-xs font-bold tracking-wider text-gray-200 uppercase hover:text-white"
                >
                  <Instagram className="h-3.5 w-3.5 text-[#FF7887]" />
                  <span>View on Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
