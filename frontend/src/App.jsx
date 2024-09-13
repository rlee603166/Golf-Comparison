import Upload from './Upload'
import { useEffect, useState } from 'react';
import PoseView from './PoseView';
import Landing from './Landing';

import './styles/index.css';


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
      {!fetchAble ? (
          <>
            <Landing />
            <Upload 
              setProcessID={setProcessID} 
              setRoryID={setRoryID} 
              setDifference={setDifference}
              setBackVideo={setBackVideo}
              setFrontVideo={setFrontVideo}
              setFetchAble={setFetchAble}
            />
          </> 
        ): (
          <PoseView 
            frontVideo={frontVideo} 
            backVideo={backVideo}
            processID={processID}
            roryID={roryID}
            difference={difference}
            fetchAble={fetchAble}
            setFetchAble={setFetchAble}
          />
        )
      }
    </>
  );
}

export default App
