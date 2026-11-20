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
      className="h-full w-full bg-[#060204] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
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
        playPromise.catch(() => {
          // Ignore autoplay restriction if triggered off-gesture
        });
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
      className="max-h-[65vh] w-auto max-w-full rounded-sm object-contain"
    />
  );
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
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

  // Build balanced initial 4x2 overview when viewing "All" (up to 8 cards across categories),
  // or full list when expanded or viewing a specific category.
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

    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects-header-reveal',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
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

      gsap.utils.toArray<HTMLElement>('.project-card-item').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 70, scale: 0.94, rotateX: 5 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 66%',
              scrub: 1,
            },
          }
        );

        const media = card.querySelector<HTMLElement>('img, video');
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -3, scale: 1.09 },
            {
              yPercent: 3,
              scale: 1.06,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 100%',
                end: 'bottom 0%',
                scrub: 1.2,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, activeCategory, showAllInOverview, displayedItems.length]);

  // Refresh GSAP ScrollTrigger positions when filter or expanded view changes section height
  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [activeCategory, showAllInOverview, displayedItems.length]);

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

  // Observe visible video cards in viewport; allow strictly one video to play at a time
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
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            visibleVideoIdsRef.current.add(id);
          } else {
            visibleVideoIdsRef.current.delete(id);
          }
        }
        pickSingleVisibleVideo();
      },
      { threshold: [0, 0.5, 0.8] }
    );

    for (const item of displayedItems) {
      if (item.mediaType === 'video') {
        const node = videoCardsRef.current.get(item.id);
        if (node) {
          observer.observe(node);
        }
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
      if (node) {
        videoCardsRef.current.set(id, node);
      } else {
        videoCardsRef.current.delete(id);
      }
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
      if (e.key === 'Escape') {
        setActiveIndex(null);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, handleNext, handlePrev]);

  const handleSelectCategory = (categoryId: PortfolioFilterId) => {
    setActiveCategory(categoryId);
    setActiveIndex(null);
    if (categoryId !== 'all') {
      setShowAllInOverview(false);
    }
  };

  const activeCategoryLabel =
    projectsSection.categories.find((c) => c.id === activeCategory)?.label ||
    'Selected Category';

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-20 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="projects-header-reveal font-mono text-xs font-medium tracking-[0.26em] text-[#f43f5e] uppercase">
              {projectsSection.kicker}
            </p>
            <h2 className="projects-header-reveal mt-2 font-display text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
              {projectsSection.title.replace('.', '')}
              <span className="text-[#f43f5e]">.</span>
            </h2>
          </div>
          <p className="projects-header-reveal max-w-md text-sm leading-relaxed text-white/60">
            {projectsSection.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Portfolio categories"
          className="projects-header-reveal mb-8 flex items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
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
                className={`inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-2 rounded-md border px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-all ${
                  isActive
                    ? 'border-[#f43f5e]/80 bg-[#e11d48]/20 text-white shadow-[0_0_20px_-6px_rgba(244,63,94,0.6)]'
                    : 'border-white/12 bg-[#12050a]/75 text-white/65 hover:border-[#f43f5e]/45 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] tabular-nums ${
                    isActive ? 'text-[#fda4af]' : 'text-white/40'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Media Grid or Graceful Empty State */}
        {displayedItems.length > 0 ? (
          <>
            <div className="projects-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    className="project-card-item luminous-card group flex cursor-pointer flex-col overflow-hidden rounded-xl text-left focus-visible:outline-2 focus-visible:outline-[#ff2e63]"
                  >
                    {/* Preview Frame — preserves original 16:10 proportions */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#ff3b62]/15 bg-[#0c0307]">
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

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0408] via-transparent to-transparent opacity-70" />
                      <span className="absolute top-3 left-3 font-mono text-xs font-semibold tracking-widest text-white/75">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {isVideo && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded border border-[#ff3b62]/35 bg-black/70 px-2 py-0.5 font-mono text-[10px] tracking-[0.15em] text-[#fda4af] uppercase">
                          <Film className="h-3 w-3" />
                          <span>Reel</span>
                        </span>
                      )}

                      <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/50 text-white/70 transition-all duration-200 group-hover:border-[#f43f5e]/60 group-hover:bg-[#e11d48]/30 group-hover:text-white">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    {/* Card Body — factual category & filename only */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.16em] text-[#fb7185] uppercase">
                          {project.category}
                        </p>
                        <h3 className="mt-1.5 line-clamp-1 font-display text-base font-bold tracking-tight text-white transition-colors group-hover:text-[#fda4af] sm:text-lg">
                          {project.title}
                        </h3>
                      </div>

                      <p className="mt-4 border-t border-white/8 pt-3 font-mono text-[11px] text-white/50 uppercase">
                        {isVideo ? `Video · ${project.extension}` : `Photo · ${project.extension}`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expand/Collapse toggle when All has more than 8 items */}
            {activeCategory === 'all' &&
              filteredItems.length > INITIAL_GRID_LIMIT && (
                <div className="mt-9 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllInOverview((prev) => !prev)}
                    className="inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-md border border-[#ff3b62]/35 bg-[#16060d]/85 px-6 py-2 font-mono text-xs font-semibold tracking-[0.16em] text-white uppercase transition-colors hover:border-[#f43f5e] hover:bg-[#e11d48]/20"
                  >
                    {showAllInOverview
                      ? 'Show Featured Grid (8)'
                      : `View All ${filteredItems.length} Items`}
                  </button>
                </div>
              )}
          </>
        ) : (
          <div className="projects-grid luminous-card mx-auto max-w-2xl rounded-2xl p-8 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#ff3b62]/35 bg-[#e11d48]/15 text-[#fb7185]">
              <FolderOpen className="h-5 w-5" />
            </div>

            {!projectsSection.folderExists ? (
              <>
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white uppercase">
                  Local Media Folder Not Found
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                  Add your photography and reel files under{' '}
                  <span className="font-mono text-[#fda4af]">public/preetham/</span>{' '}
                  in the expected category subfolders to populate this gallery
                  automatically.
                </p>
                <p className="mt-4 font-mono text-[11px] leading-relaxed text-white/45">
                  PHOTOGRAPHY/nature · wildlife · birds · potraits · travel ·
                  landscape &nbsp;|&nbsp; VIDEOGRAPHY/instagram-reels
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white uppercase">
                  No Files in {activeCategoryLabel}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/65 sm:text-sm">
                  No supported image or video files were found in this folder yet.
                </p>
                {activeCategory !== 'all' && projectsSection.items.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className="crimson-cta mt-6 inline-flex min-h-[40px] cursor-pointer items-center rounded-md px-5 py-2 text-xs font-bold tracking-[0.14em] text-white uppercase"
                  >
                    Show All Media
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Preserved & Enhanced Fullscreen Lightbox */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-5"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="luminous-card relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#ff2e63]/40 bg-[#0d0408]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close lightbox"
              onClick={() => setActiveIndex(null)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-black/70 text-white/85 transition-colors hover:border-[#f43f5e] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Fullscreen Media Stage with Prev/Next & Swipe */}
            <div
              className="relative flex min-h-[260px] flex-1 items-center justify-center overflow-hidden border-b border-[#ff3b62]/20 bg-[#060204] p-2 sm:p-4"
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
                  className="max-h-[65vh] w-auto max-w-full rounded-sm object-contain"
                />
              )}

              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous item"
                    onClick={handlePrev}
                    className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/65 text-white/85 transition-colors hover:border-[#f43f5e] hover:bg-black/90 hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next item"
                    onClick={handleNext}
                    className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/65 text-white/85 transition-colors hover:border-[#f43f5e] hover:bg-black/90 hover:text-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Metadata & Actions */}
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#fb7185] uppercase">
                  <span>{String((activeIndex ?? 0) + 1).padStart(2, '0')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProject.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-white/55">{activeProject.extension}</span>
                </div>

                {filteredItems.length > 1 && (
                  <span className="font-mono text-[11px] text-white/45 tabular-nums">
                    {(activeIndex ?? 0) + 1} / {filteredItems.length}
                  </span>
                )}
              </div>

              <h3
                id="project-modal-title"
                className="mt-2 font-display text-xl font-extrabold text-white sm:text-2xl"
              >
                {activeProject.title}
              </h3>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  onClick={() => setActiveIndex(null)}
                  className="crimson-cta inline-flex min-h-[42px] items-center gap-2 rounded-md px-5 py-2 text-xs font-bold tracking-wider text-white uppercase"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Book via Instagram DM</span>
                </a>
                <a
                  href={activeProject.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-2 text-xs font-bold tracking-wider text-white/85 uppercase transition-colors hover:border-[#f43f5e] hover:text-white"
                >
                  <Instagram className="h-3.5 w-3.5" />
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
