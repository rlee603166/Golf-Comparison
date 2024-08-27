import { useState, useEffect } from "react";

function GetVid () {
    
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
    
    
    return (
        <>
            Hello World!
            <input type='file' accept='video/mp4' onChange={handleFileChange} />
            <div className='previews'>
                {vidURL && (
                    <div>
                        <h2>Video Preview:</h2>
                        <video src={vidURL} controls />
                    </div>
                )}
            </div>
        </>
    );
}

export default GetVid;