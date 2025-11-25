import Dock from '#components/Dock'
import Navbar from '#components/Navbar'
import Welcome from '#components/Welcome'
import React from 'react'
import { Draggable } from 'gsap/Draggable'
import gsap from 'gsap'
import { Terminal, Safari, Resume, Finder, TextFile, ImageWindow, Contact } from '#windows'
import Home from '#components/Home'
gsap.registerPlugin(Draggable);

const App = () => {
  return (
    <main>
      <Navbar/>
      <Welcome/>
      <Dock/>
      
      <Terminal/>
      <Safari/>
      <Resume/>
      <Finder/>
      <TextFile/>
      <ImageWindow/>
      <Contact/>
      <Home/>
    </main>
  )
}

export default App
