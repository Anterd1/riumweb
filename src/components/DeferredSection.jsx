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

const SectionSkeleton = ({ minHeight = 640, tone = 'paper' }) => (
  <div
    className={`${toneClasses[tone] || toneClasses.paper} flex items-center py-24 md:py-32`}
    style={{ minHeight }}
    aria-hidden="true"
  >
    <div className="container mx-auto animate-pulse px-6">
      <div className={`mb-8 h-3 w-36 rounded-full ${shimmerClasses[tone]}`} />
      <div className={`h-12 max-w-3xl rounded-2xl md:h-20 ${shimmerClasses[tone]}`} />
      <div className={`mt-4 h-12 max-w-2xl rounded-2xl md:h-20 ${shimmerClasses[tone]}`} />
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className={`h-44 rounded-[1.5rem] ${shimmerClasses[tone]}`} />
        ))}
      </div>
    </div>
  </div>
);

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
