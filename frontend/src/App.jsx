import Upload from './Upload'
import VidSlider from './VidSlider';
import roryFront from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-front.mp4'
import roryBack from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-back.mp4'
import { useEffect, useState } from 'react';
import PoseView from './PoseView';
import Three from './Three'

function App() {
  const [gifData, setGifData] = useState([]);
  const [processID, setProcessID] = useState(null);
  let url = `http://127.0.0.1:5000/get/`;

  useEffect(() => {
    fetchPredictions(`${url}${processID}`);
  }, [processID]);

  const fetchPredictions = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    const predictions = data.prediction;
    setGifData(predictions);
  }

  return (
    <>
      {/* <Three /> */}
      <Upload setProcessID={setProcessID} />
      {gifData.length > 0 ? (
        <PoseView player='rory-front' width={window.innerWidth} height={window.innerHeight} gifData={gifData}  />
      ) : (null)}
      
      {/* <VidSlider videoFile={roryFront} />
      <VidSlider videoFile={roryBack} /> */}
    </>
  );
}

export default App
