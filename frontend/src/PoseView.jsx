import { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import roryBack from '/Users/ryanlee/Golf-Comparison/backend/test-videos/rory-back.mp4'


function PoseView({ player, width, height }) {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const spheresRef = useRef([]);
    const linesRef = useRef([]);
    const [gif, setGif] = useState([]);
    const [duration, setDuration] = useState(0);

    const [currFrontKps, setCurrFrontKps] = useState([]);
    const [currFrontEdges, setCurrFrontEdges] = useState([]);
    const [currBackKps, setCurrBackKps] = useState([]);
    const [currBackEdges, setCurrBackEdges] = useState([]);

    const vidRef = useRef(null);

    const scaleFactor = 3;

    let url = `http://127.0.0.1:5000/get/03133c80-1548-489c-a716-d242a5d2ffb9`;

    // useEffect(() => {
    //     const video = vidRef.current;
        
    //     if (video) {
    //         const handleLoadedMetadata = () => {
    //             setDuration(video.duration);
    //         };
    
    //         video.addEventListener('loadedmetadata', handleLoadedMetadata);
            
    //         return () => {
    //             video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    //         };
    //     }
    // }, []);


    useEffect(() => {
        fetchPrediction();
    }, []);
  
    const fetchPrediction = async () => {
        const response = await fetch(url);
        const data = await response.json();
        const predictions = data.prediction;
        console.log(predictions.back_edges[0])
        setGif(predictions);
        setCurrBackEdges(predictions.back_edges);
        setCurrBackKps(predictions.back_kps);
        setCurrFrontEdges(predictions.front_edges);
        setCurrFrontKps(predictions.front_kps);
        setDuration(predictions.front_kps.length - 1);
    }

    const isValidPoint = (point) => {
        return Array.isArray(point) && point.length === 2 && !isNaN(point[0]) && !isNaN(point[1]);
    };

    useEffect(() => {
        if (!mountRef.current){ return };

        if (currFrontEdges.length > 5 && currFrontKps.length > 5) {
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
            sceneRef.current = scene;

            const geometry = new THREE.SphereGeometry(0.05, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

            currFrontKps.forEach((kp, index) => {
                if (isValidPoint(kp)) {
                    const sphere = new THREE.Mesh(geometry, material);
                    const z = currBackKps[index][0];
                    sphere.position.set(kp[0] * scaleFactor, kp[1] * scaleFactor, z * scaleFactor);
                    scene.add(sphere);
                    spheresRef.current.push(sphere);  // Store reference to spheres
                }   
            });
    
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
            currFrontEdges.forEach((edge, index) => {
                if (Array.isArray(edge) && edge.length === 2 && isValidPoint(edge[0]) && isValidPoint(edge[1])) {
                    const points = [];

                    const z = currBackEdges[index][0];
                    points.push(new THREE.Vector3(edge[0][0] * scaleFactor, edge[0][1] * scaleFactor, z[0] * scaleFactor));
                    points.push(new THREE.Vector3(edge[1][0] * scaleFactor, edge[1][1] * scaleFactor, z[1] * scaleFactor));
    
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    scene.add(line);
                    linesRef.current.push(line);  // Store reference to lines
                }
            });

            const sphere = new THREE.Mesh( geometry, material );
            scene.add( sphere );

            const axesHelper = new THREE.AxesHelper( 5 );
            scene.add( axesHelper );
            
            camera.position.z = 5;
            const animate = function () {
                requestAnimationFrame( animate );
        
                renderer.render(scene, camera);
            };
        
            animate();

        }

        return () => {
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, [width, height])

    // currBackEdges, currBackKps, currFrontEdges, currFrontKps

    const handleSlider = (e) => {
        const frameIndex = e.target.value;
        setCurrBackEdges(gif.back_edges[frameIndex]);
        setCurrBackKps(gif.back_kps[frameIndex]);
        setCurrFrontEdges(gif.front_edges[frameIndex]);
        setCurrFrontKps(gif.front_kps[frameIndex]);
        console.log(currBackEdges)
        // const video = vidRef.current;
        // const time = (frameIndex / duration) * video.duration;
        // video.currentTime = time; 

        currFrontKps.forEach((kp, i) => {
            if (spheresRef.current[i] && isValidPoint(kp)) {
                const z = currBackKps[i][0];
                spheresRef.current[i].position.set(kp[0] * 3, kp[1] * 3, z * scaleFactor);  // Update position
            }
        });

        currFrontEdges.forEach((edge, i) => {
            if (linesRef.current[i] && isValidPoint(edge[0]) && isValidPoint(edge[1])) {
                const z = currBackEdges[i];
                const points = [
                    new THREE.Vector3(edge[0][0] * 3, edge[0][1] * 3, z[0] * scaleFactor),
                    new THREE.Vector3(edge[1][0] * 3, edge[1][1] * 3, z[1] * scaleFactor),
                ];
                linesRef.current[i].geometry.setFromPoints(points);  // Update points
            }
        });
    }

    return (
        <>
            <input 
                type='range'
                min='1'
                max={duration || 100}
                step='1'
                onChange={handleSlider}
            />
            <div ref={mountRef} style={{ width: '100%', height: '500px' }}></div>
            {/* <video ref={vidRef} src={roryFront} /> */}
        </>
    );
}

export default PoseView;