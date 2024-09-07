import { useState, useEffect } from "react";
import './styles/GetVid.css';

function UploadBody({ swingType, handleFileChange }) {
    
    return (
        <div id="rectangle">
            <label htmlFor='inputTag'>
                {swingType} side
                <input id='inputTag' type='file' accept='video/mp4' onChange={handleFileChange} />
            </label>
        </div>
    )
}


function GetVid ({ swingType }) {
    
    const [vidURL, setVidURL] = useState(null);
    
    const handleFileChange = (event) => {
        const video = event.target.files[0];
        console.log('Selected file: ', video);
        if (video && (video.type === 'video/mp4')) {
            try {
                const url = URL.createObjectURL(video);
                setVidURL(url);
            } catch (err) {
                console.error(err);
            }
        } else {
            console.log('File type not supported');
        }
    }
    
    const handleSubmit = (event) => {
        setVidURL(null);

    }

    return (
        <>
            <div className="getvid">
                <h2 className='swing-head' >{swingType} side:</h2>
                <div className='previews'>
                    {vidURL ? (
                        <div>
                            <video className="video" src={vidURL} controls />
                        </div>
                    ) : (
                        <UploadBody swingType={swingType} handleFileChange={handleFileChange} />
                    )}
                </div>
                <div className="buttons">
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </>
    );
}

export default GetVid;