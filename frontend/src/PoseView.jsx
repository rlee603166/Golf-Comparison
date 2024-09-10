import { useEffect, useState, useRef } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three-addons';


function PoseView({ player, width, height, gifData }) {
    const mountRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const spheresRef = useRef([]);
    const linesRef = useRef([]);
    const [gif, setGif] = useState([]);
    const [duration, setDuration] = useState(0);

    const [currFrontKps, setCurrFrontKps] = useState([]);
    const [currBackKps, setCurrBackKps] = useState([]);

    const vidRef = useRef(null);

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
        if (gifData && Array.isArray(gifData.back_kps) && gifData.back_kps.length > 0 
            && Array.isArray(gifData.front_kps) && gifData.front_kps.length > 0) {
            
            setGif(gifData);
            setCurrBackKps(gifData.back_kps[0]);
            setCurrFrontKps(gifData.front_kps[0]);
            setDuration(gifData.back_kps.length - 1);
        } else {
            console.error('Invalid gifData: Missing or malformed back_kps or front_kps');
        }
    }, [gifData]);
    

    useEffect(() => {
        if (!mountRef.current){ return };

        if (currFrontKps && currFrontKps.length > 5) {
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
            }

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.set(0, 1, 2);
            const renderer = new THREE.WebGLRenderer();

            const render = () => {

                renderer.render( scene, camera );
        
            }

            renderer.setSize( width - 50, height - 50 );
            mountRef.current.appendChild(renderer.domElement);

            const controls = new OrbitControls( camera, renderer.domElement );
            controls.addEventListener( 'change', render );
            controls.minDistance = 0.05;
            controls.maxDistance = 3;
            controls.enablePan = false;
            controls.enableZoom = true;

            rendererRef.current = renderer;
            sceneRef.current = scene;

            // currFrontKps.forEach((kp, index) => {
            //     const sphere = new THREE.Mesh(geometry, material);
            //     const z = currBackKps[index][0];
            //     // sphere.position.set(kp[0] * scaleFactor, kp[1] * scaleFactor, z * scaleFactor);
            //     sphere.position.set(kp[0], kp[1], z);
            //     scene.add(sphere);
            //     spheresRef.current.push(sphere);
            // });
    
            // const lineMaterial = new THREE.LineBasicMaterial({ color: '#A9A9A9' });

            // edges.forEach((edge, index)=> {
            //     const points = [

            //         new THREE.Vector3(currFrontKps[edge[0]][0], currFrontKps[edge[0]][1], currBackKps[edge[0]][0]),
            //         new THREE.Vector3(currFrontKps[edge[1]][0], currFrontKps[edge[1]][1], currBackKps[edge[1]][0])
            //     ]

            //     const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            //     const line = new THREE.Line(lineGeometry, lineMaterial);
            //     scene.add(line);
            //     linesRef.current.push(line);
            // })

            const light = new THREE.DirectionalLight( 0xffffff, 3 );
            light.position.set( 1, 1, 1 ).normalize();
            scene.add( light );

            const axesHelper = new THREE.AxesHelper( 5 );
            scene.add( axesHelper );

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
        
        const lineMaterial = new THREE.LineBasicMaterial({ color: '#A9A9A9' });

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

    // currBackEdges, currBackKps, currFrontEdges, currFrontKps

    const handleSlider = (e) => {
        const frameIndex = e.target.value;
        setCurrBackKps(gifData.back_kps[frameIndex]);
        setCurrFrontKps(gifData.front_kps[frameIndex]);
        // const video = vidRef.current;
        // const time = (frameIndex / duration) * video.duration;
        // video.currentTime = time; 
        // console.log(currFrontKps);
        // currFrontKps.forEach((kp, i) => {
        //     const z = currBackKps[i][0];
        //     spheresRef.current[i].position.set(kp[0], kp[1], z);
        //     // spheresRef.current[i].position.set(kp[0] * 3, kp[1] * 3, z * scaleFactor);
        // });

        // edges.forEach((edge, i) => {
        //     // const z = currBackKps[edge[]];
        //     console.log(edge);
        //     const points = [
        //         new THREE.Vector3(currFrontKps[edge[0]][0], currFrontKps[edge[0]][1], currBackKps[edge[0]][0]),
        //         new THREE.Vector3(currFrontKps[edge[1]][0] , currFrontKps[edge[1]][1], currBackKps[edge[1]][0])
        //     ];
        //     linesRef.current[i].geometry.setFromPoints(points);  // Update points
        // });
    }



    return (
        <>
            <input 
                type='range'
                min='1'
                max={duration}
                step='1'
                onChange={handleSlider}
            />
            <div ref={mountRef} style={{ width: '100%', height: '500px' }}></div>
            {/* <video ref={vidRef} src={roryFront} /> */}
        </>
    );
}

export default PoseView;