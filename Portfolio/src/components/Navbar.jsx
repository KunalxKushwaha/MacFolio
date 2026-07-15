import { navIcons, navLinks } from '#constants';
import React, { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useWindowStore from '#store/window';

const Navbar = () => {

  const { openWindow } = useWindowStore();
  const [now, setNow] = useState(() => dayjs());

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const timeRef = useRef(null);
  const iconRefs = useRef(new Map());

  // Actually tick — previously this rendered once with a frozen timestamp.
  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  // Soft tick transition whenever the displayed label changes,
  // instead of the text just snapping to the new value.
  const prevLabel = useRef(now.format('ddd MMM D h:mm A'));
  const label = now.format('ddd MMM D h:mm A');

  useGSAP(() => {
    if (label !== prevLabel.current && timeRef.current) {
      gsap.fromTo(timeRef.current,
        { y: -6, opacity: 0.3 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
      prevLabel.current = label;
    }
  }, [label]);

  // Boot sequence: menu bar drops in once, left side then right side,
  // like the OS chrome loading before anything else.
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (leftRef.current) {
      tl.from(leftRef.current.children, {
        y: -18, opacity: 0, duration: 0.5, stagger: 0.06
      });
    }
    if (rightRef.current) {
      tl.from(rightRef.current.querySelectorAll('li, time'), {
        y: -18, opacity: 0, duration: 0.5, stagger: 0.05
      }, '-=0.35');
    }
  }, []);

  // Authentic macOS menu-click "flash": a brief invert highlight
  // before the window opens, rather than an instant, silent state change.
  const flashMenu = (e, type) => {
    const target = e.currentTarget;
    gsap.timeline()
      .to(target, { backgroundColor: 'rgba(255,255,255,0.9)', color: '#000', duration: 0.08 })
      .to(target, { backgroundColor: 'rgba(255,255,255,0)', color: 'inherit', duration: 0.25, delay: 0.05 })
      .call(() => openWindow(type), null, 0.08);
  };

  const wiggleIcon = (id) => {
    const el = iconRefs.current.get(id);
    if (!el) return;
    gsap.timeline()
      .to(el, { rotate: -12, scale: 1.15, duration: 0.08, ease: 'power1.out' })
      .to(el, { rotate: 10, duration: 0.08, ease: 'power1.inOut' })
      .to(el, { rotate: 0, scale: 1, duration: 0.18, ease: 'power2.out' });
  };

  return (
    <nav>
      <div ref={leftRef}>
        <img src="/images/logo.svg" alt="logo" />
        <p className="font-mac text-[16px] font-bold tracking-tight">Kunal's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={(e) => flashMenu(e, type)} style={{ borderRadius: 4 }}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div ref={rightRef}>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}
              ref={(el) => { if (el) iconRefs.current.set(id, el); }}
              onMouseEnter={() => wiggleIcon(id)}>
              <img src={img} className="icon-hover" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>

        <time ref={timeRef} style={{ display: 'inline-block' }}>{label}</time>
      </div>
    </nav>
  )
}

export default Navbar