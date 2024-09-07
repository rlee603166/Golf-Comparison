import GetVid from "./GetVid"
import './styles/Upload.css'

function Upload() {

    return (
        <div className="upload-page">
            Upload a video of your swing from the front and behind!
            <div className="upload-body">
                <GetVid id='front-panel' swingType={'front'} />
                <GetVid id='back-panel' swingType={'back'} />
            </div>
        </div>
    )
}

export default Upload;