import WindowControls from '#components/WindowControls'
import WindowWrapper from '#hoc/WindowWrapper'
import React from 'react'

const Safari = () => {
  return (
    <>
      <div id='window-header'>
        <WindowControls />
      </div>
    </>
  )
}

const SafariWindow = WindowWrapper(Safari, "safari")

export default SafariWindow
