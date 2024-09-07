import GetVid from "./GetVid"
import './styles/Upload.css'

function Upload() {

    return (
        <div className="upload-page">
            <div id='title-box'>
                Upload a video of your swing from the front and behind!
            </div>
            <div className="upload-body">
                <GetVid id='front-panel' swingType={'Front'} />
                <GetVid id='back-panel' swingType={'Back'} />
            </div>
        </div>
    )
}

export default Upload;