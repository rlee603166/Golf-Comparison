import React, {useState} from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const VideoToGif = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [gifUrl, setGifUrl] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    
    const ffmpeg = createFFmpeg({ log: true });
    
    const loadFFmpeg = async (url) => {
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
    };
    
    const handleFileChange = (event) => {
        setVideoFile(event.target.files[0]);
    };
    const convertToGif = async () => {
        // Write the .mp4 to the FFmpeg file system
        ffmpeg.FS("writeFile", "video1.mp4", await fetchFile(video));

        // Run the FFmpeg command-line tool, converting 
        // the .mp4 into .gif file
        await ffmpeg.run(
            "-i",
            "video1.mp4",
            "-t",
            "2.5",
            "-ss",
            "2.0",
            "-f",
            "gif",
            "out.gif"
        );
        // Read the .gif file back from the FFmpeg file system
        const data = ffmpeg.FS("readFile", "out.gif");
        const url = URL.createObjectURL(
            new Blob([data.buffer], { type: "image/gif" })
        );
        setGif(url);
    };

    return (
        <div>
            <h2>Convert MP4 to GIF</h2>
            <input type='file' accept='video/mp4' onChange={handleFileChange} />
            <button onClick={convertToGif} disabled={!videoFile || isConverting}>
                {isConverting ? 'Converting...' : 'Convert to GIF'}
            </button>
            {gifUrl && (
                <div>
                    <h3>GIF Preview:</h3>
                    <img src={gifUrl} alt="Converted GIF" />
                    <a href={gifUrl} download={"output.gif"}>Download GIF</a>
                </div>
            )}
        </div>
    );
}

export default VideoToGif;