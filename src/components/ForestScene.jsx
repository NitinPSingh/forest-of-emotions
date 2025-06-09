import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ForestScene = ({ emotion }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // Sky blue background
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Camera position
    camera.position.z = 5;
    camera.position.y = 2;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Add fog based on emotion
    const fogColor = new THREE.Color(0xffffff);
    const fogDensity = emotion === 'sad' ? 0.1 : 0.05;
    scene.fog = new THREE.FogExp2(fogColor, fogDensity);

    // Create trees
    const createTree = (x, z) => {
      const treeGroup = new THREE.Group();

      // Tree trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
      const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 1;
      treeGroup.add(trunk);

      // Tree top
      const topGeometry = new THREE.ConeGeometry(1, 2, 8);
      const topMaterial = new THREE.MeshPhongMaterial({ 
        color: emotion === 'joy' ? 0x90EE90 : 0x228B22 
      });
      const top = new THREE.Mesh(topGeometry, topMaterial);
      top.position.y = 2.5;
      treeGroup.add(top);

      treeGroup.position.set(x, 0, z);
      return treeGroup;
    };

    // Add multiple trees
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 20 - 10;
      const z = Math.random() * 20 - 10;
      const tree = createTree(x, z);
      scene.add(tree);
    }

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      renderer.dispose();
    };
  }, [emotion]);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ForestScene; 