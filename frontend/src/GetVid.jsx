import { useState, useEffect } from "react";
import './styles/GetVid.css';
import uploadImg from './assets/upload.png';

function GetVid ({ swingType }) {
    const [gifUrl, setGifUrl] = useState(null);
    const [vidURL, setVidURL] = useState(null);
    const [video, setVid] = useState(null);
    const url = 'http://127.0.0.1:5000/';

    
    const handleFileChange = (event) => {
        const video = event.target.files[0];
        setVid(video);
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
    
    const handleClear = (event) => {
        setVidURL(null);

    }

    const handleSubmit = async () => {
        let upload_url = url + 'upload';
        console.log(upload_url)
        if (!vidURL) {
            alert("Please select a file first!");
            return;
        }
        const formData = new FormData();
        formData.append('file', video);

        try {
            const response = await fetch(upload_url, {
                method: "POST",
                body: formData, 
            });
            if (response.ok) {
                const data = response.json();
                setGifUrl(data.gif_url);
            } else {
                alert("File upload failed.");
            }
        } catch (error) {
            console.log(error);
            alert("Error uploading file.");
        }
    }

    return (
        <>
            <div className="getvid">
                <h2 className='swing-head' >{swingType} side:</h2>
                <div className='previews'>
                    {vidURL ? (
                        <video className="video" src={vidURL} controls />
                    ) : (
                        <div id="rectangle">
                            <label htmlFor='inputTag'>
                                <img id='upload-img' src={uploadImg} />
                                <input id='inputTag' type='file' accept='video/mp4' onChange={handleFileChange} />
                            </label>
                        </div>
                    )}
                </div>
                <div id="buttons">
                    <button className="submit" onClick={handleSubmit}>Submit</button>
                    <button className="clear" onClick={handleClear}>Clear</button>
                </div>
                <div className="gif">
                    {gifUrl && (
                        <div>
                            <img src={gifUrl} alt='upload gif' />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default GetVid;