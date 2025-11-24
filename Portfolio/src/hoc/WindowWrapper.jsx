import useWindowStore from '#store/window.js'
import React, { useRef } from 'react'

const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const {fuosWindow, windows} = useWindowStore();
        const {isOpen, zIndex} = window[windowKey];
        const ref = useRef(null);

        return
    }
  return (
    <div>
      
    </div>
  )
}

export default WindowWrapper
