import Upload from './Upload'
import { useEffect, useState } from 'react';
import PoseView from './PoseView';
import VidSlider from './VidSlider';

import roryFront from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-front.mp4'
import roryBack from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-back.mp4'


function App() {
  const [processID, setProcessID] = useState(null);
  const [gifData, setGifData] = useState([]);
  const [roryID, setRoryID] = useState(null);
  const [roryGif, setRoryGif] = useState([]);
  const [difference, setDifference] = useState(0);
  const [fetchAble, setFetchAble] = useState(false);

  const [frontVideo, setFrontVideo] = useState(0);
  const [backVideo, setBackVideo] = useState(0);

  return (
    <>
      {/* <Three /> */}
      {!fetchAble ? (
          <Upload 
            setProcessID={setProcessID} 
            setRoryID={setRoryID} 
            setDifference={setDifference}
            setBackVideo={setBackVideo}
            setFrontVideo={setFrontVideo}
            setFetchAble={setFetchAble}
          /> 
        ): (
          <PoseView 
            frontVideo={frontVideo} 
            backVideo={backVideo}
            processID={processID}
            roryID={roryID}
            difference={difference}
            fetchAble={fetchAble}
          />
        )
      }
    </>
  );
}

export default App
