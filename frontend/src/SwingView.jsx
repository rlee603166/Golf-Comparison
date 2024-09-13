import { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './styles/SwingView.css';

function SwingView({ width, height, gifData, videoRefFront, videoRefBack, videoFront, videoBack, frameIndex, isLoading, isLeft }) {
    const mountRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const spheresRef = useRef([]);
    const linesRef = useRef([]);
    const [gif, setGif] = useState([]);
    const [backDuration, setBackDuration] = useState(0);

    const [currFrontKps, setCurrFrontKps] = useState([]);
    const [currBackKps, setCurrBackKps] = useState([]);

    const scaleFactor = 3;

    const edges = [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 4],
        [0, 5],
        [0, 6],
        [5, 7],
        [7, 9],
        [6, 8],
        [8, 10],
        [5, 6],
        [5, 11],
        [6, 12],
        [11, 12],
        [11, 13],
        [13, 15],
        [12, 14],
        [14, 16]
    ];

    useEffect(() => {
        if (gifData && !isLoading) {
            setGif(gifData);
            console.log(gifData);
        }
    }, [gifData, isLoading])

    useEffect(() => {
        if (gif !== undefined && gif !== null && !isLoading) {
            console.log(gif);
            setCurrBackKps(gif.back_kps[0]);
            setCurrFrontKps(gif.front_kps[0]);
        }
    }, [gif]);
    

    useEffect(() => {
        if (!mountRef.current){ return };

        if (currFrontKps && currFrontKps.length > 5) {
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
            }

            const scene = new THREE.Scene();
            scene.background = new THREE.Color( 0xa0a0a0 );
            scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.set(0, 0.5, 1.5);
            cameraRef.current = camera;
            const renderer = new THREE.WebGLRenderer({ antialias: true });

            const render = () => {

                renderer.render( scene, camera );
        
            }

            renderer.setSize( width - 50, height - 50 );
            mountRef.current.appendChild(renderer.domElement);

            const controls = new OrbitControls( camera, renderer.domElement );
            controls.addEventListener( 'change', render );
            controls.target.set(0, 0.5, 0);
            controls.minDistance = 0.05;
            controls.maxDistance = 3;
            controls.enablePan = false;
            controls.enableZoom = true;

            rendererRef.current = renderer;
            sceneRef.current = scene;

            const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
            hemiLight.position.set( 0, 20, 0 );
            scene.add( hemiLight );

            const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
            dirLight.position.set( - 3, 10, - 10 );
            dirLight.castShadow = true;
            dirLight.shadow.camera.top = 2;
            dirLight.shadow.camera.bottom = - 2;
            dirLight.shadow.camera.left = - 2;
            dirLight.shadow.camera.right = 2;
            dirLight.shadow.camera.near = 0.1;
            dirLight.shadow.camera.far = 40;
            scene.add( dirLight );


            const size = 5;
            const divisions = 10;

            const gridHelper = new THREE.GridHelper( size, divisions );
            scene.add( gridHelper );

            const animate = function () {
                requestAnimationFrame( animate );
                controls.update();
                renderer.render(scene, camera);
            };
        
            animate();

        }

        
        return () => {
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, [gifData]);

    useEffect(() => {
        if (!rendererRef.current || !sceneRef.current || !currBackKps.length || !currFrontKps.length) return;

        const scene = sceneRef.current;

        spheresRef.current.forEach(sphere => scene.remove(sphere));
        linesRef.current.forEach(line => scene.remove(line));

        spheresRef.current = [];
        linesRef.current = [];

        const geometry = new THREE.SphereGeometry(0.015, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: '#ffffff'});

        currFrontKps.forEach((kp, index) => {
            const sphere = new THREE.Mesh(geometry, material);
            const z = currBackKps[index][0];
            sphere.position.set(kp[0], kp[1], z);
            scene.add(sphere);
            spheresRef.current.push(sphere);
        });
        
        const lineMaterial = new THREE.LineBasicMaterial({ color: '#000000' });

        edges.forEach((edge, index)=> {
            const points = [

                new THREE.Vector3(currFrontKps[edge[0]][0], currFrontKps[edge[0]][1], currBackKps[edge[0]][0]),
                new THREE.Vector3(currFrontKps[edge[1]][0], currFrontKps[edge[1]][1], currBackKps[edge[1]][0])
            ]

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            linesRef.current.push(line);
        })

    }, [currFrontKps, currBackKps])

    useEffect(() => {
        if (rendererRef.current && cameraRef.current) {
            const renderer = rendererRef.current;
            const camera = cameraRef.current;
      
            // Update camera aspect ratio
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
      
            // Resize renderer
            renderer.setSize(width, height);
        }
    }, [width, height, isLoading])
    // currBackEdges, currBackKps, currFrontEdges, currFrontKps

    useEffect(() => {
        if (gif && !isLoading) {
            setCurrBackKps(gif.back_kps[frameIndex]);
            setCurrFrontKps(gif.front_kps[frameIndex]);
        }
    }, [frameIndex])



    return (
        <div className="swing-view">
            {isLeft && (
                <div className="videos">
                    <div className="video-container">
                        <video 
                            ref={videoRefFront} 
                            src={videoFront} 
                            width="600" 
                            style={{ display: 'block', marginBottom: '10px' }} 
                        />
                    </div>
                    <div className="video-container">
                        <video 
                            ref={videoRefBack} 
                            src={videoBack} 
                            width="600"
                            style={{ display: 'block', marginBottom: '10px' }} 
                        />
                    </div>
                </div>
            )}
            <div className='three' >
                <div ref={mountRef} style={{ width: `${width}`, height: `${height}` }}></div>
            </div>
            {!isLeft && (
                <div className="videos">
                    <div className="video-container">
                        <video 
                            ref={videoRefFront} 
                            src={videoFront} 
                            width="600" 
                            style={{ display: 'block', marginBottom: '10px' }} 
                        />
                    </div>
                    <div className="video-container">
                        <video 
                            ref={videoRefBack} 
                            src={videoBack} 
                            width="600"
                            style={{ display: 'block', marginBottom: '10px' }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SwingView;