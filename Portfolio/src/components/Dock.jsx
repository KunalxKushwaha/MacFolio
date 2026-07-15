import { dockApps } from '#constants';
import React, { useRef } from 'react'
import { Tooltip } from 'react-tooltip';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useWindowStore from '#store/window.js';

const Dock = () => {

    const { openWindow, closeWindow, windows } = useWindowStore();
    const dockRef = useRef(null);
    const iconRefs = useRef(new Map());
    const dotRefs = useRef(new Map());

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");

        // Wake-up entrance: icons rise into place with a light overshoot,
        // rippling left-to-right so the dock feels like it's "booting up".
        gsap.from(icons, {
            y: 36, opacity: 0, scale: 0.6,
            duration: 0.55, stagger: 0.045,
            ease: "back.out(2.2)"
        });

        const animateIcons = (mouseX) => {
            const { left } = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const { left: iconLeft, width } = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);

                const intensity = Math.exp(-(distance ** 2.6) / 20000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    duration: 0.2,
                    y: -15 * intensity,
                    ease: "power1.out"
                });
            });
        };

        const handleMouseMove = (e) => {
            const { left } = dock.getBoundingClientRect();
            animateIcons(e.clientX - left);
        };

        const resetIcons = () => icons.forEach((icon) => gsap.to(icon, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power1.out"
        }));

        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', resetIcons);

        return () => {
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', resetIcons);
        }

    }, []);

    // Classic launch bounce — a quick squash-and-leap on the icon that was clicked.
    const bounceIcon = (id) => {
        const icon = iconRefs.current.get(id);
        if (!icon) return;

        gsap.timeline()
            .to(icon, { scaleY: 0.82, scaleX: 1.12, y: 4, duration: 0.09, ease: "power1.in" })
            .to(icon, { y: -26, scaleX: 1, scaleY: 1, duration: 0.28, ease: "power2.out" })
            .to(icon, { y: 0, duration: 0.35, ease: "bounce.out" });
    };

    // "Can't open" shake — a small refusal cue for disabled apps instead of doing nothing.
    const shakeIcon = (id) => {
        const icon = iconRefs.current.get(id);
        if (!icon) return;

        gsap.timeline()
            .to(icon, { x: -6, duration: 0.08, ease: "power1.inOut" })
            .to(icon, { x: 6, duration: 0.08, ease: "power1.inOut" })
            .to(icon, { x: -4, duration: 0.08, ease: "power1.inOut" })
            .to(icon, { x: 0, duration: 0.08, ease: "power1.inOut" });
    };

    // Running-app dot pops with a little overshoot when a window opens,
    // and shrinks away when it closes — rather than just toggling visibility.
    const popDot = (id, isOpening) => {
        const dot = dotRefs.current.get(id);
        if (!dot) return;

        if (isOpening) {
            gsap.fromTo(dot,
                { scale: 0, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(3)" }
            );
        } else {
            gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2, ease: "power1.in" });
        }
    };

    const toggleApp = (app) => {
        if (!app.canOpen) {
            shakeIcon(app.id);
            return;
        }

        const window = windows[app.id];

        if (!window) {
            console.error(`Windows not found for the app: ${app.id}`);
            return;
        }

        bounceIcon(app.id);

        if (window.isOpen) {
            closeWindow(app.id);
            popDot(app.id, false);
        } else {
            openWindow(app.id);
            popDot(app.id, true);
        }
    }

    return (
        <section id='dock'>
            <div ref={dockRef} className='dock-container'>
                {dockApps.map(({ id, name, icon, canOpen }) => (
                    <div key={id} className='relative flex justify-center'>
                        <button type='button' className='dock-icon'
                            ref={(el) => { if (el) iconRefs.current.set(id, el); }}
                            aria-label={name} data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={() => toggleApp({ id, canOpen })}>
                            <img src={`/images/${icon}`} alt={name}
                                loading='lazy'
                                className={canOpen ? "" : 'opacity-60'} />
                        </button>

                        <span
                            ref={(el) => { if (el) dotRefs.current.set(id, el); }}
                            aria-hidden="true"
                            style={{
                                position: 'absolute', bottom: -6, width: 5, height: 5,
                                borderRadius: '50%', background: 'currentColor',
                                opacity: windows[id]?.isOpen ? 1 : 0,
                                transform: windows[id]?.isOpen ? 'scale(1)' : 'scale(0)'
                            }}
                        />
                    </div>
                ))}
                <Tooltip id="dock-tooltip" place="top" className='tooltip' />
            </div>
        </section>
    )
}

export default Dock