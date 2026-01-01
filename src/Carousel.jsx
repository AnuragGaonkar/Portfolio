import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiAward, FiMaximize2, FiX } from 'react-icons/fi';
import './Carousel.css';

const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

function CarouselItem({ item, index, itemWidth, trackItemOffset, x, transition }) {
  const [isFull, setIsFull] = useState(false);
  const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <>
      <motion.div
        className="carousel-item"
        style={{ width: itemWidth, height: '100%', rotateY: rotateY }}
        transition={transition}
      >
        <div className="carousel-item-header">
          <span className="carousel-icon-container"><FiAward className="carousel-icon" /></span>
        </div>
        <div className="carousel-item-content">
          <div className="carousel-item-title">{item.title}</div>
          <p className="carousel-item-description">{item.description}</p>
          <button onClick={() => setIsFull(true)} className="cert-view-btn">
             View Image <FiMaximize2 style={{marginLeft: '5px'}} />
          </button>
        </div>
      </motion.div>

      {/* Fullscreen Certificate Image Overlay */}
      <AnimatePresence>
        {isFull && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="image-fullscreen-backdrop" 
            onClick={() => setIsFull(false)}
            style={{ zIndex: 11000 }}
          >
            <motion.img 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              src={item.link.replace('.pdf', '.jpg')} 
              className="image-fullscreen-content" 
              alt="Certificate" 
            />
            <button className="modal-close" onClick={() => setIsFull(false)} style={{top: '20px', right: '20px'}}><FiX /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Carousel({ items, baseWidth = 330, autoplay = true, autoplayDelay = 3500, loop = true }) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;
  const itemsForRender = useMemo(() => (!loop || items.length === 0 ? items : [items[items.length - 1], ...items, items[0]]), [items, loop]);
  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return;
    const timer = setInterval(() => setPosition(prev => prev + 1), autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, itemsForRender.length]);

  useEffect(() => {
    const startPos = loop ? 1 : 0;
    setPosition(startPos);
    x.set(-startPos * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  const handleAnimationComplete = () => {
    if (!loop) return;
    if (position === itemsForRender.length - 1) {
      setIsJumping(true); setPosition(1); x.set(-1 * trackItemOffset);
      requestAnimationFrame(() => setIsJumping(false));
    } else if (position === 0) {
      setIsJumping(true); setPosition(items.length); x.set(-items.length * trackItemOffset);
      requestAnimationFrame(() => setIsJumping(false));
    }
  };

  const activeIndex = loop ? (position - 1 + items.length) % items.length : position;

  return (
    <div className="carousel-container" style={{ width: `100%`, maxWidth: `${baseWidth}px`, height: '350px' }}>
      <motion.div
        className="carousel-track"
        style={{ width: itemWidth, gap: `${GAP}px`, perspective: 1000, x }}
        animate={{ x: -(position * trackItemOffset) }}
        transition={isJumping ? { duration: 0 } : SPRING_OPTIONS}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem key={index} item={item} index={index} itemWidth={itemWidth} trackItemOffset={trackItemOffset} x={x} transition={isJumping ? { duration: 0 } : SPRING_OPTIONS} />
        ))}
      </motion.div>
      <div className="carousel-indicators-container">
        <div className="carousel-indicators">
          {items.map((_, index) => (
            <div key={index} className={`carousel-indicator ${activeIndex === index ? 'active' : ''}`} onClick={() => setPosition(loop ? index + 1 : index)} />
          ))}
        </div>
      </div>
    </div>
  );
}