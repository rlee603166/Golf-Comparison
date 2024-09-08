import { useEffect, useState } from "react";
import GetVid from "./GetVid"
import './styles/Upload.css'


function Upload() {
    const [front, setFront] = useState(null);
    const [back, setBack] = useState(null);
    const [frontGifUrl, setFrontGifUrl] = useState(null);
    const [backGifUrl, setBackGifUrl] = useState(null);
    const [frontURL, setFrontURL] = useState(null);
    const [backURL, setBackURL] = useState(null);

    const [frontTime, setFrontTime] = useState(0);   
    const [backTime, setBackTime] = useState(0);   

    const [frontSlider, setFrontSlider] = useState(false);
    const [backSlider, setBackSlider] = useState(false);

    const url = 'http://127.0.0.1:5000/';

    const handleClear = () => {
        setFront(null);
        setBack(null);
        setFrontGifUrl(null);
        setBackGifUrl(null);
        setFrontURL(null);
        setBackURL(null);
        setFrontTime(0);
        setBackTime(0);
        setFrontSlider(false);
        setBackSlider(false);
    }

    const handleSubmit = async () => {
        let upload_url = url + 'upload';
        console.log(upload_url)
        if (!front && !back) {
            alert("Please select a file first!");
            return;
        }
        const formData = new FormData();
        formData.append('file', front);
        formData.append('file', back);
        try {
            const response = await fetch(upload_url, {
                method: "POST",
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                setFrontGifUrl(data.gif_url[0]);
                setBackGifUrl(data.gif_url[1]);
            } else {
                alert("File upload failed.");
            }
        } catch (error) {
            console.log(error);
            alert("Error uploading file.");
        }
    }

    useEffect(() => {
        console.log(frontTime)
    }, [frontTime])    
    useEffect(() => {
        console.log(backTime)
    }, [backTime])

    return (
        <div className="upload-page">
            <p className='title-box'>Upload videos of you swing!</p>
            <div className="upload-body">
                <div className="getvid-card">
                    <GetVid
                        swingType='Front'
                        video={front}
                        setVid={setFront}
                        gifUrl={frontGifUrl}
                        setGifUrl={setFrontGifUrl}
                        vidURL={frontURL}
                        setVidURL={setFrontURL}
                        currentTime={frontTime} 
                        setCurrentTime={setFrontTime}
                        sliderBool={frontSlider}
                        setSliderBool={setFrontSlider}
                    />
                </div>
                <div className="getvid-card">
                    <GetVid
                        swingType='Back'
                        video={back}
                        setVid={setBack}
                        gifUrl={backGifUrl}
                        setGifUrl={setBackGifUrl}
                        vidURL={backURL}
                        setVidURL={setBackURL}
                        currentTime={backTime}
                        setCurrentTime={setBackTime}
                        sliderBool={backSlider}
                        setSliderBool={setBackSlider}
                    />
                </div>
            </div>
            <div id="buttons">
                <button className="submit" onClick={handleSubmit}>Submit</button>
                <button className="clear" onClick={handleClear}>Clear</button>
            </div>
        </div>
    )
}

export default Upload;