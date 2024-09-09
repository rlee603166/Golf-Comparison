import Upload from './Upload'
import VidSlider from './VidSlider';
import roryFront from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-front.mp4'
import roryBack from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-back.mp4'
import { useEffect, useState } from 'react';
import PoseView from './PoseView';

function App() {


  return (
    <>
      <PoseView player='rory-front' width={window.innerWidth} height={window.innerHeight} />
      {/* <Upload /> */}
      {/* <VidSlider videoFile={roryFront} />
      <VidSlider videoFile={roryBack} /> */}
    </>
  );
}

export default App
