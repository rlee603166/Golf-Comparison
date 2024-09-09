import { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import roryBack from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-back.mp4'


function PoseView({ player, width, height }) {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const [gif, setGif] = useState([]);
    const [currKps, setCurrKps] = useState([]);
    const [currEdges, setCurrEdges] = useState([]);
    const [currFrame, setCurrFrame] = useState(0);
    const [duration, setDuration] = useState(0);

    const vidRef = useRef(null);

    let url = `http://127.0.0.1:5000/predict/${player}`;


    useEffect(() => {
        fetchPrediction();
    }, [])

    useEffect(() => {
        const video = vidRef.current;
        
        if (video) {
            const handleLoadedMetadata = () => {
                setDuration(video.duration);
            };
    
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            
            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, []);
  
    const fetchPrediction = async () => {
        const response = await fetch(url)
        const data = await response.json()
        setGif(data);
        setCurrFrame(data[0]);
        setCurrEdges(data[0].edges);
        setCurrKps(data[0].keypoints);

        setDuration(data.length - 1);
    }

    useEffect(() => {
        if (!mountRef.current){ return };

        if (currKps.length > 5 && currEdges.length > 5) {
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
            }

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize( width - 50, height - 50 );
            mountRef.current.appendChild(renderer.domElement);

            rendererRef.current = renderer;

            const geometry = new THREE.SphereGeometry(0.05, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const scaleFactor = 3;

            currKps.forEach((kp) => {
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(kp[0] * scaleFactor, kp[1] * scaleFactor, 0);
                scene.add(sphere);
            });
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x0000ff
            });

            currEdges.forEach((edge) => {
                const points = [];
                points.push( new THREE.Vector3( edge[0][0] * scaleFactor, edge[0][1] * scaleFactor, 0 ) );
                points.push( new THREE.Vector3( edge[1][0] * scaleFactor, edge[1][1] * scaleFactor, 0 ) );

                const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );

                const line = new THREE.Line( lineGeometry, lineMaterial );
                scene.add( line );
            })

            const sphere = new THREE.Mesh(geometry, material);
            scene.add( sphere );

            const axesHelper = new THREE.AxesHelper( 5 );
            scene.add( axesHelper );
            
            camera.position.z = 5;
            const animate = function () {
                requestAnimationFrame(animate);
        
                renderer.render(scene, camera);
            };
        
            animate();

        }

        return () => {
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, [currKps, currEdges])

    const handleSlider = (e) => {
        const frame = e.target.value;
        setCurrFrame(gif[frame])
        setCurrKps(gif[frame].keypoints)
        setCurrEdges(gif[frame].edges)

        const video = vidRef.current;
        const time = (frame / duration) * video.duration;
        video.currentTime = time; 
    }

    return (
        <>
            <input 
                type='range'
                min='0'
                max={duration}
                step='1'
                onChange={handleSlider}
            />
            <div ref={mountRef} style={{ width: '100%', height: '500px' }}></div>
            <video ref={vidRef} src={roryFront} />
        </>
    );
}

export default PoseView;