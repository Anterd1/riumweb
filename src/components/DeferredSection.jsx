import React, { Suspense, useEffect, useRef, useState } from 'react';

const toneClasses = {
  dark: 'bg-[#101114]',
  blue: 'bg-[#5B72FF]',
  paper: 'bg-[#F2F0E9]',
  acid: 'bg-[#DFFF4F]',
};

const shimmerClasses = {
  dark: 'bg-white/10',
  blue: 'bg-white/20',
  paper: 'bg-black/10',
  acid: 'bg-black/10',
};

const SectionSkeleton = ({ minHeight = 640, tone = 'paper' }) => {
  const mobileMinHeight = Math.min(620, Math.max(420, Math.round(minHeight * .72)));

  return (
    <div
      className={`${toneClasses[tone] || toneClasses.paper} flex min-h-[var(--mobile-skeleton-height)] items-center py-16 sm:py-20 md:min-h-[var(--desktop-skeleton-height)] md:py-32`}
      style={{
        '--mobile-skeleton-height': `${mobileMinHeight}px`,
        '--desktop-skeleton-height': `${minHeight}px`,
      }}
      aria-hidden="true"
    >
      <div className="container mx-auto animate-pulse px-5 motion-reduce:animate-none sm:px-6">
        <div className={`mb-6 h-3 w-28 rounded-full sm:mb-8 sm:w-36 ${shimmerClasses[tone]}`} />
        <div className={`h-10 max-w-3xl rounded-xl sm:h-12 sm:rounded-2xl md:h-20 ${shimmerClasses[tone]}`} />
        <div className={`mt-3 h-10 max-w-2xl rounded-xl sm:mt-4 sm:h-12 sm:rounded-2xl md:h-20 ${shimmerClasses[tone]}`} />
        <div className="mt-10 grid grid-cols-3 gap-2 sm:mt-14 sm:gap-4">
          {[0, 1, 2].map((item) => (
            <div key={item} className={`h-24 rounded-xl sm:h-36 sm:rounded-[1.5rem] md:h-44 ${shimmerClasses[tone]}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DeferredSection = ({
  children,
  minHeight = 640,
  tone = 'paper',
  rootMargin = '700px 0px',
}) => {
  const placeholderRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return undefined;

    if (!('IntersectionObserver' in window)) {
      setShouldRender(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (placeholderRef.current) observer.observe(placeholderRef.current);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={placeholderRef}>
      {shouldRender ? (
        <Suspense fallback={<SectionSkeleton minHeight={minHeight} tone={tone} />}>
          {children}
        </Suspense>
      ) : (
        <SectionSkeleton minHeight={minHeight} tone={tone} />
      )}
    </div>
  );
};

export default DeferredSection;
