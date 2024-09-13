import { useEffect, useRef, useState } from "react";
import SwingView from "./SwingView";
import App from "./App";
import './styles/Upload.css'
import roryFront from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-front.mp4'
import roryBack from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-back.mp4'
import './styles/PoseView.css'

function PoseView({ processID, roryID, difference, fetchAble, setFetchAble }) {
    const videoRefFrontRory = useRef(null);
    const videoRefBackRory = useRef(null);
    const videoRefFront = useRef(null);
    const videoRefBack = useRef(null);

    const [frontVideo, setFrontVideo] = useState(null);
    const [backVideo, setBackVideo] = useState(null);

    const [gifData, setGifData] = useState([]);
    const [RoryGifData, setRoryGifData] = useState([]);

    const [gifDuration, setGifDuration] = useState(0);
    const [roryGifDuration, setRoryGifDuration] = useState(0);

    const [videoFrontDuration, setVideoFrontDuration] = useState(0);
    const [videoBackDuration, setVideoBackDuration] = useState(0);
    const [roryDuration, setRoryDuration] = useState(0);

    const [frameIndex, setFrameIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [roryLoading, setRoryLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth * 0.33,
        height: window.innerHeight * 0.9
    })

    let rory_difference = 0.010000999999999927;
    let sean_difference = 0.1499999999999999;
    let url = `http://127.0.0.1:5000/get/`;

    useEffect(() => {
        if (fetchAble) {
            fetchPredictions();
            fetchRory();
            loadLocalVideos();
        }

    }, [fetchAble]);
  
    const fetchPredictions = async () => {
        try {
            const response = await fetch(`${url}${processID}`);
            const data = await response.json();
            const predictions = data.prediction;
            setGifData(predictions);
            setGifDuration(predictions.back_kps.length - 1);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            console.log(isLoading);
        }
    }
    const fetchRory = async () => {
        try {
            const rory_response = await fetch(`${url}${roryID}`);
            const rory_data = await rory_response.json();
            const rory_predictions = rory_data.prediction;
            setRoryGifData(rory_predictions);
            setRoryGifDuration(rory_predictions.back_kps.length - 1);
        } catch (error) {
            console.log(error);
        } finally {
            setRoryLoading(false);
            console.log(roryLoading);
        }
    }
    
    const handleSliderChange = (e) => {
        const frame = parseFloat(e.target.value);
        setFrameIndex(frame);
        const roryTime = (frame / roryGifDuration) * roryDuration;
        const userTime = (frame / gifDuration) * videoFrontDuration;

        videoRefFrontRory.current.currentTime = roryTime + rory_difference;
        videoRefBackRory.current.currentTime = roryTime;
        videoRefFront.current.currentTime = userTime + difference;
        videoRefBack.current.currentTime = userTime;
    };
  
    useEffect(() => {
        const videoFrontRory = videoRefFrontRory.current;
        const videoFront = videoRefFront.current;
        const handleLoadedMetadata = () => {
            setRoryDuration(videoFrontRory.duration);
        };
        const handleLoadedMetadataF = () => {
            setVideoFrontDuration(videoFront.duration);
        };        

        videoFrontRory.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoFront.addEventListener('loadedmetadata', handleLoadedMetadataF);

        return () => {
            videoFrontRory.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoFront.removeEventListener('loadedmetadata', handleLoadedMetadataF);
        };
    }, []);
  
    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth * 0.3,
                height: window.innerHeight * 0.95
            });
        }
        
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    const loadLocalVideos = () => {
        const localFront = localStorage.getItem('frontUrl');
        const localBack = localStorage.getItem('backUrl');

        if (localFront) setFrontVideo(localFront);
        if (localBack) setBackVideo(localBack);
    }

    const handleClick = () => {
        setFetchAble(false)
    }


    return (
        <div className="pose-view">
            <div className="swing-views">            
                <SwingView
                    width={dimensions.width}
                    height={dimensions.height}
                    gifData={gifData}
                    videoRefFront={videoRefFront}
                    videoRefBack={videoRefBack}
                    videoFront={frontVideo}
                    videoBack={backVideo}
                    frameIndex={frameIndex}
                    isLoading={isLoading}
                    isLeft={true}
                />
                <SwingView
                    width={dimensions.width}
                    height={dimensions.height}
                    gifData={RoryGifData}
                    videoRefFront={videoRefFrontRory}
                    videoRefBack={videoRefBackRory}
                    videoFront={roryFront}
                    videoBack={roryBack}
                    frameIndex={frameIndex}
                    isLoading={roryLoading}
                    isLeft={false}
                />
            </div>
            <div className="controls">
                <input 
                    type="range" 
                    min="0" 
                    max={roryGifDuration} 
                    step="1"
                    onChange={handleSliderChange}
                    value={frameIndex}
                    style={{ width: '15vw' }}
                />
                <button className="reupload" onClick={handleClick}>New</button>
            </div>
        </div>
    );
}

export default PoseView;