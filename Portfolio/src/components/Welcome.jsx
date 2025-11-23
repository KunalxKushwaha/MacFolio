import React, {useRef } from 'react';

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span key={i} className={className} style={{fontVariationSetting: `'wght' ${baseWeight}`}}>
            {char === ' '? '\u00A0': char}</span>
    ))
}

const Welcome = () => {

    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
  return (
    <section id='welcome'>
      <p ref={subtitleRef}> 
        {renderText("Hey, I'm Kunal! Welcome to my", 'text-3xl font-Georama', 100)}
      </p>
      <h1 ref={titleRef} className='mt-7'>
        {renderText("portfolio", 'text-9xl italic font-georama')}
      </h1>

      <div className='small-screen'>
        <p>This Poertfolio is Designed for Desktop/tablet Screens only.</p>
      </div>
    </section>
  )
}

export default Welcome
