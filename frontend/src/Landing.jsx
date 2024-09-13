import logo from './assets/logo.png';
import background from './assets/rory-back.jpg';
import roryFront from './assets/rory-front.png'
import './styles/Landing.css';

function Landing() {
    
    return (
        <>
            <div className="heading">
                <img className="logo" src={logo} />
                <p className='title' >Rory Rater</p>
            </div>
            <div className='image-container'>
                <img className='rory-background' src={background} />
                <div className='text-container'>
                    <p className='animated-text one'>Upgrade your swing</p>
                    <p className='animated-text two'>Leveraging AI</p>
                </div>
                <img className='rory-background overlay' src={roryFront} />
            </div>
            <div className='body'>
                <div className='words'>
                    <h1>Compare with Rory!</h1>
                    <p>Just upload a video from the front and back views</p>
                </div>
                <div className="example"></div>
            </div>
        </>
    );
}

export default Landing;