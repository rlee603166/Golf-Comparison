import Upload from './Upload'
import { useEffect, useState } from 'react';
import PoseView from './PoseView';
import Landing from './Landing';
import Playground from './Playground';

import './styles/index.css';


function App() {
  const [processID, setProcessID] = useState(null);
  const [difference, setDifference] = useState(0);
  const [fetchAble, setFetchAble] = useState(false);

  const [frontVideo, setFrontVideo] = useState(0);
  const [backVideo, setBackVideo] = useState(0);

  const [playground, setPlayground] = useState(false);


  return (
    <>
      {!playground && (
        !fetchAble ? (
          <>
            <Landing setPlayground={setPlayground} />
            <Upload 
              setProcessID={setProcessID} 
              setDifference={setDifference}
              setBackVideo={setBackVideo}
              setFrontVideo={setFrontVideo}
              setFetchAble={setFetchAble}
            />
          </>
        ) : (
          <PoseView 
            frontVideo={frontVideo} 
            backVideo={backVideo}
            processID={processID}
            difference={difference}
            fetchAble={fetchAble}
            setFetchAble={setFetchAble}
          />
        )
      )}
      {playground && (
        <Playground setPlayground={setPlayground}/>
      )}
    </>
  );
}

export default App
