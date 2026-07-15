// import { useGSAP } from '@gsap/react';
// import gsap from 'gsap';
// import React, {useRef } from 'react';

// const FONT_WEIGHTS = {
//     subtitle: {min: 100, max: 400, default: 100},
//     title: {min: 400, max: 900, default: 400}
// }

// const renderText = (text, className, baseWeight = 400) => {
//     return [...text].map((char, i) => (
//         <span key={i} className={className} style={{fontVariationSettings: `"wght" ${baseWeight}`}}>
//             {char === ' '? '\u00A0': char}</span>
//     ))
// }

// const setupTextHover = (container,type) => {
//     if(!container) return () => {};

//     const letters = container.querySelectorAll("span");
//     const {min, max, default: base} = FONT_WEIGHTS[type];

//     const animateLetter = (letter, weight, duration = 0.25) => {
//         return gsap.to(letter, {duration, ease: 'power2.out', fontVariationSettings: `"wght" ${weight}`});
//     };

//     const handleMouseMove = (e) => {
//         const {left} = container.getBoundingClientRect();

//         const mouseX = e.clientX - left;
//         letters.forEach((letter) => {
//             const {left: l, width: w} = letter.getBoundingClientRect();
//             const distance = Math.abs(mouseX - (l - left + w / 2));
//             const intensity = Math.exp(-(distance ** 2) / 20000);

//             animateLetter(letter, min + (max - min) * intensity);
//         });
//     };

//     const handleMouseLeave = () => letters.forEach((letter) => animateLetter(letter, base, 0.3))

//     container.addEventListener("mousemove", handleMouseMove);
//     container.addEventListener("mouseleave", handleMouseLeave);

//     return () => {
//         container.removeEventListener("mousemove", handleMouseMove);
//     container.removeEventListener("mouseleave", handleMouseLeave);
//     }
// }

// const Welcome = () => {

//     const titleRef = useRef(null);
//     const subtitleRef = useRef(null);
//     useGSAP(() => {
//         const titleCleanup = setupTextHover(titleRef.current, 'title');
//         const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");
//         return () => {
//             subtitleCleanup();
//             titleCleanup();
//         }
//     },[])
//   return (
//     <section id='welcome'>
//       <p ref={subtitleRef}> 
//         {renderText("Hey, I'm Kunal! Welcome to my", 'text-3xl font-georama', 100)}
//       </p>
//       <h1 ref={titleRef} className='mt-7'>
//         {renderText("portfolio", 'text-9xl italic font-georama')}
//       </h1>

//       <div className='small-screen'>
//         <p>This Poertfolio is Designed for Desktop/tablet Screens only.</p>
//       </div>
//     </section>
//   )
// }

// export default Welcome
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef } from 'react';

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 }
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span key={i} className={className} style={{ fontVariationSettings: `"wght" ${baseWeight}` }}>
            {char === ' ' ? '\u00A0' : char}</span>
    ))
}

const setupTextHover = (container, type) => {
    if (!container) return () => {};

    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, { duration, ease: 'power2.out', fontVariationSettings: `"wght" ${weight}` });
    };

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();

        const mouseX = e.clientX - left;
        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));
            const intensity = Math.exp(-(distance ** 2) / 20000);

            animateLetter(letter, min + (max - min) * intensity);
        });
    };

    const handleMouseLeave = () => letters.forEach((letter) => animateLetter(letter, base, 0.3))

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    }
}

// Staggered "type-on" entrance: letters rise + unblur while their variable
// weight ramps from hairline to resting weight, echoing the hover effect.
const runEntrance = (subtitleContainer, titleContainer, shineEl, reduceMotion) => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (!subtitleContainer || !titleContainer) return tl;

    const subLetters = subtitleContainer.querySelectorAll('span');
    const titleLetters = titleContainer.querySelectorAll('span');

    if (reduceMotion) {
        gsap.set([subLetters, titleLetters], { opacity: 0 });
        tl.to([subLetters, titleLetters], { opacity: 1, duration: 0.5, stagger: 0 });
        return tl;
    }

    gsap.set(subLetters, {
        opacity: 0, y: 14, filter: 'blur(6px)',
        fontVariationSettings: `"wght" ${FONT_WEIGHTS.subtitle.min}`
    });
    gsap.set(titleLetters, {
        opacity: 0, y: 46, rotate: () => gsap.utils.random(-6, 6), scale: 0.85,
        fontVariationSettings: `"wght" ${FONT_WEIGHTS.title.min}`
    });
    gsap.set(shineEl, { opacity: 0 });

    tl.to(subLetters, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        fontVariationSettings: `"wght" ${FONT_WEIGHTS.subtitle.default}`,
        duration: 0.6, stagger: 0.016
    })
    .to(titleLetters, {
        opacity: 1, y: 0, rotate: 0, scale: 1,
        fontVariationSettings: `"wght" ${FONT_WEIGHTS.title.default}`,
        duration: 0.85, stagger: 0.028, ease: 'back.out(1.6)'
    }, '-=0.35')
    .fromTo(shineEl,
        { xPercent: -130, opacity: 0.9 },
        { xPercent: 130, opacity: 0, duration: 1, ease: 'power1.inOut' },
        '-=0.15'
    );

    return tl;
}

// Soft ambient glow trailing the cursor across the section.
const setupAmbientGlow = (section, glow) => {
    if (!section || !glow) return () => {};

    const xTo = gsap.quickTo(glow, 'x', { duration: 0.9, ease: 'power3.out' });
    const yTo = gsap.quickTo(glow, 'y', { duration: 0.9, ease: 'power3.out' });

    const handleMove = (e) => {
        const { left, top } = section.getBoundingClientRect();
        xTo(e.clientX - left);
        yTo(e.clientY - top);
    };

    const handleEnter = () => gsap.to(glow, { opacity: 1, duration: 0.4 });
    const handleLeave = () => gsap.to(glow, { opacity: 0, duration: 0.6 });

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseenter', handleEnter);
    section.addEventListener('mouseleave', handleLeave);

    return () => {
        section.removeEventListener('mousemove', handleMove);
        section.removeEventListener('mouseenter', handleEnter);
        section.removeEventListener('mouseleave', handleLeave);
    }
}

// ...unchanged code above (FONT_WEIGHTS, renderText, setupTextHover, runEntrance, setupAmbientGlow)...

const Welcome = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const shineRef = useRef(null);
    const glowRef = useRef(null);

    useGSAP(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const entrance = runEntrance(subtitleRef.current, titleRef.current, shineRef.current, reduceMotion);

        let titleCleanup = () => {};
        let subtitleCleanup = () => {};
        let glowCleanup = () => {};

        entrance.eventCallback('onComplete', () => {
            titleCleanup = setupTextHover(titleRef.current, 'title');
            subtitleCleanup = setupTextHover(subtitleRef.current, 'subtitle');
            if (!reduceMotion) glowCleanup = setupAmbientGlow(sectionRef.current, glowRef.current);
        });

        return () => {
            entrance.kill();
            titleCleanup();
            subtitleCleanup();
            glowCleanup();
        }
    }, []);

    return (
        // No inline position/overflow/minHeight here anymore — centering and
        // stacking stay owned by your CSS (e.g. #welcome rules), so this
        // component doesn't fight the project-folders layout.
        <section id='welcome' ref={sectionRef}>
            <div
                ref={glowRef}
                aria-hidden="true"
                style={{
                    position: 'absolute', top: 0, left: 0, width: 420, height: 420,
                    marginLeft: -210, marginTop: -210, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.14), rgba(255,255,255,0) 70%)',
                    mixBlendMode: 'screen', pointerEvents: 'none', opacity: 0, zIndex: 0
                }}
            />

            <p ref={subtitleRef} style={{ position: 'relative', zIndex: 1 }}>
                {renderText("Hey, I'm Kunal! Welcome to my", 'text-3xl font-georama', 100)}
            </p>

            {/* overflow/position scoped to the h1 only — this is the one
               element that actually needs to clip the shine sweep */}
            <h1 ref={titleRef} className='mt-7' style={{ position: 'relative', overflow: 'hidden', zIndex: 1 }}>
                {renderText("portfolio", 'text-9xl italic font-georama')}
                <span
                    ref={shineRef}
                    aria-hidden="true"
                    style={{
                        position: 'absolute', top: 0, left: 0, width: '60%', height: '100%',
                        background: 'linear-gradient(75deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)',
                        mixBlendMode: 'overlay', pointerEvents: 'none', opacity: 0
                    }}
                />
            </h1>

            <div className='small-screen'>
                <p>This Poertfolio is Designed for Desktop/tablet Screens only.</p>
            </div>
        </section>
    )
}

export default Welcome