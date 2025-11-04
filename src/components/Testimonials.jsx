import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechVision',
    content: 'Working with this agency transformed our brand completely. Their strategic approach and creative execution exceeded all expectations, driving growth and engagement.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Marketing Director, GrowthCo',
    content: 'The ROI we achieved through their campaigns was phenomenal. They truly understand digital marketing and deliver tangible results every single time.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Founder, StyleHub',
    content: 'From concept to execution, they were professional, creative, and incredibly responsive. Our online sales increased by a staggering 200% in just one quarter!',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'VP Marketing, InnovateLabs',
    content: 'Their team brought fresh perspectives and innovative solutions to every challenge we faced. I highly recommend their services to any business looking to scale.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 5,
    name: 'Jessica Williams',
    role: 'Product Manager, NexGen',
    content: 'The user experience design they delivered was intuitive and beautiful. Our customer satisfaction scores have never been higher. An absolute pleasure to work with.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 6,
    name: 'Chris Martinez',
    role: 'CTO, DataStream',
    content: 'Their technical expertise in web development is second to none. They built a scalable and secure platform that has become the backbone of our operations.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const Testimonials = () => {
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < testimonials.length - itemsPerPage;

  const scroll = (direction) => {
    let newIndex = currentIndex;
    if (direction === 'left' && canScrollLeft) {
      newIndex = Math.max(0, currentIndex - 1);
    } else if (direction === 'right' && canScrollRight) {
      newIndex = Math.min(testimonials.length - itemsPerPage, currentIndex + 1);
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      if (scrollContainerRef.current) {
        const card = scrollContainerRef.current.children[newIndex];
        if(card) {
          scrollContainerRef.current.scrollTo({
            left: card.offsetLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  };

  return (
    <section id="testimonials" className="py-24 bg-[#0C0D0D] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight uppercase max-w-lg">
            People who <span className="text-accent-purple">changed</span> how they do business
          </h2>
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-3 rounded-full bg-[#1E1E2A] border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-3 rounded-full bg-[#1E1E2A] border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div
          ref={scrollContainerRef}
          // Removed -mx-6 and adjusted card width for proper alignment with px-6 on parent
          className="flex flex-nowrap gap-8 pb-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              // Adjusting width to be responsive to the parent's padding
              className="flex-shrink-0 w-[calc(100%-48px)] md:w-[calc(50%-16px)] snap-start"
            >
              <div className="bg-[#1E1E2A] p-8 rounded-2xl h-full flex flex-col border border-white/10">
                <div className="flex items-center mb-6">
                  <img className="w-12 h-12 rounded-full mr-4 object-cover" alt={testimonial.name} src={testimonial.avatar} />
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end md:hidden">
          <div className="flex gap-4">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-3 rounded-full bg-[#1E1E2A] border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-3 rounded-full bg-[#1E1E2A] border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;