import Upload from './Upload'
import VidSlider from './VidSlider';
import roryFront from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-front.mp4'
import roryBack from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-back.mp4'
import { useEffect, useState } from 'react';
import PoseView from './PoseView';
import Three from './Three'

function App() {
  const [gifData, setGifData] = useState([]);

  let url = `http://127.0.0.1:5000/get/f51ec3f3-445b-4c2b-a089-50eff62fddfa`;

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    const response = await fetch(url);
    const data = await response.json();
    const predictions = data.prediction;
    setGifData(predictions);
  }

  return (
    <>
      {/* <Three /> */}
      {gifData ? (
        <PoseView player='rory-front' width={window.innerWidth} height={window.innerHeight} gifData={gifData}  />
      ) : (null)}
      
      {/* <Upload /> */}
      {/* <VidSlider videoFile={roryFront} />
      <VidSlider videoFile={roryBack} /> */}
    </>
  );
}

export default App
