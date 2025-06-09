import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { format } from 'date-fns';
import API_ENDPOINTS from '../config/api';
import TreeSummary from './TreeSummary';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const gridCols = 6;
const gridRows = 6;
const tileSize = 4;
const groundColors = ['#447F03', '#6ec90a'];

const emotionTreeConfigs = {
  joy: { 
    scale: 1.2,
    treeModel: 'cherry', 
    objectName: null 
  },
  trust: { 
    scale: 2,
    treeModel: 'oak_tree', 
    objectName: null
  },
  fear: { 
    scale: 0.7,
    treeModel: 'cypress', 
    objectName: null
  },
  surprise: { 
    scale: 0.5,
    treeModel: 'poplar', 
    objectName: null
  },
  sadness: { 
    scale: 0.4,
    treeModel: 'dead', 
    objectName: null,
    color:'#964B00',
  },
  disgust: { 
    scale: 2.0,
    treeModel: 'cactus', 
    objectName: null
  },
  anger: { 
    scale: 0.6,
    treeModel: 'maple_tree', 
    objectName: null
  },
  anticipation: { 
    scale: 0.35,
    treeModel: 'orange_tree', 
    objectName: null
  },
  neutral: { 
    scale: 0.7,
    treeModel: 'pine2', 
    objectName: null
  }
};

const modelConfigs = {
  pine2: { 
    path: '/model/pine2.glb', 
    name: 'Pine Tree',
    scale: 0.015,
    groundOffset: 0 
  },
  oak_tree: { 
    path: '/model/oak_tree.glb', 
    name: 'Oak Tree',
    scale: 0.4,
    groundOffset: 0
  },
  cypress:{
    path: '/model/cypress.glb', 
    name: 'Cypress Tree',
    scale: 0.5,
    groundOffset: 0
  },
  birch_tree: { 
    path: '/model/birch_tree.glb', 
    name: 'Birch Tree',
    scale: 0.2,
    groundOffset: 0
  },
  cactus: { 
    path: '/model/cactus.glb', 
    name: 'Cactus',
    scale: 3,
    groundOffset: 1.5 
  },
  maple_tree: { 
    path: '/model/twisted_tree.glb', 
    name: 'Maple Tree',
    scale: 0.5,
    groundOffset: 0
  },
  tree: { 
    path: '/model/tree.glb', 
    name: 'Evergreen Tree',
    scale: 0.7,
    groundOffset: 0
  },
  cherry: { 
    path: '/model/cherry.glb', 
    name: 'Cherry Blossom',
    scale: 10.0,
    groundOffset: 0
  },
  poplar: { 
    path: '/model/poplar.glb', 
    name: 'Poplar',
    scale: 0.8,
    groundOffset: -1
  },
  dead: { 
    path: '/model/dead_tree.glb', 
    name: 'Dead Tree',
    scale: 1.0,
    groundOffset: 0
  },
  orange_tree: { 
    path: '/model/orange_tree.glb', 
    name: 'Orange Tree',
    scale: 1.0,
    groundOffset: 0
  },
  
  pebble1: {
    path: '/model/pebble.glb',
    name: 'Pebble 1',
    scale: 0.7,
    groundOffset: -0.1
  },
  pebble2: {
    path: '/model/grass2.glb',
    name: 'Pebble 2',
    scale: 1.3,
    groundOffset: -0.05
  },
  
  grass1: {
    path: '/model/grass1.glb',
    name: 'Grass 1',
    scale: .8,
    groundOffset: 0
  },
  grass2: {
    path: '/model/grass2.glb',
    name: 'Grass 2',
    scale: 1.6,
    groundOffset: 0
  }
};

const Month3DView = ({ isDarkMode, data, viewType, onDateSelect, onTreeSelect, currentDate }) => {
  const mountRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const cameraRef = useRef();
  const controlsRef = useRef();
  const containerRef = useRef();
  const [loadedModels, setLoadedModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTree, setSelectedTree] = useState(null);
  const [hoveredTree, setHoveredTree] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  
  useEffect(() => {
    const loader = new GLTFLoader();
    const requiredModels = new Set();
    
    
    Object.values(emotionTreeConfigs).forEach(config => {
      if (config.treeModel) {
        requiredModels.add(config.treeModel);
      }
    });
    
    
    requiredModels.add('pebble1');
    requiredModels.add('pebble2');
    requiredModels.add('grass1');
    requiredModels.add('grass2');

    let loadedCount = 0;
    const totalModels = requiredModels.size;

    const loadModel = (modelKey) => {
      const config = modelConfigs[modelKey];
      if (!config) return Promise.resolve();

      return new Promise((resolve, reject) => {
        loader.load(
          config.path,
          (gltf) => {
            setLoadedModels(prev => ({
              ...prev,
              [modelKey]: { gltf }
            }));
            loadedCount++;
            if (loadedCount === totalModels) {
              setLoading(false);
            }
            resolve();
          },
          undefined,
          (error) => {
            console.error(`Error loading model ${modelKey}:`, error);
            reject(error);
          }
        );
      });
    };

    Promise.all(Array.from(requiredModels).map(loadModel))
      .catch(error => {
        console.error('Error loading models:', error);
        setLoading(false);
      });
  }, []);

  
  const processEmotionData = () => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      emotion: item.emotion,
      createdAt: format(new Date(item.createdAt), 'yyyy-MM-dd'),
      emailSubject: item.emailSubject
    }));
  };

  const emotionLogs = processEmotionData();

  
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;

      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mountRef.current || loading || Object.keys(loadedModels).length === 0 || !currentDate) {
      return;
    }

    mountRef.current.innerHTML = '';

    const scene = new THREE.Scene();
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 800);
    
    setupLights(scene, !isDarkMode);
    createGradientSky(scene, !isDarkMode);
    if (isDarkMode) {
      addFireflies(scene);
    }
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    scene.background = createCanvasGradient(!isDarkMode);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 3;
    controls.minPolarAngle = Math.PI / 4;

    const { cols, rows, tileSize } = getGridDimensions();
    const centerX = (cols * tileSize) / 2 - tileSize / 2;
    const centerZ = (rows * tileSize) / 2 - tileSize / 2;
    controls.target.set(centerX, 0, centerZ);
    controlsRef.current = controls;

    
    const mudTexture = createMudTexture();
    const mudGeometry = new THREE.BoxGeometry(
      cols * tileSize,
      4,
      rows * tileSize
    );
    const mudMaterial = new THREE.MeshPhongMaterial({ 
      map: mudTexture,
      color: '#964B00',
      side: THREE.DoubleSide
    });
    const mudGround = new THREE.Mesh(mudGeometry, mudMaterial);
    mudGround.position.set(
      centerX,
      -2.2,
      centerZ
    );
    mudGround.receiveShadow = true;
    scene.add(mudGround);

    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const color = groundColors[(row + col) % 2];
        const tileGeo = new THREE.BoxGeometry(tileSize, 0.3, tileSize);
        const tileMat = new THREE.MeshPhongMaterial({ color });
        const tile = new THREE.Mesh(tileGeo, tileMat);
        tile.position.set(col * tileSize, 0, row * tileSize);
        tile.receiveShadow = true;
        scene.add(tile);
        
        addDecorations(scene, col, row);

        
        let tileDate;
        const baseDate = new Date(currentDate);
        
        switch (viewType) {
          case 'day':
            tileDate = baseDate;
            break;
          case 'week':
            const weekStart = new Date(baseDate);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            tileDate = new Date(weekStart);
            tileDate.setDate(weekStart.getDate() + col);
            break;
          case 'month':
            const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
            const startingDay = monthStart.getDay();
            const dayNumber = row * 6 + col - startingDay + 1;
            tileDate = new Date(monthStart);
            tileDate.setDate(dayNumber);
            break;
        }

        
        if (tileDate && !isNaN(tileDate.getTime())) {
          createDateLabel(
            tileDate,
            {
              x: col * tileSize,
              y: 0.2,
              z: row * tileSize
            },
            scene
          );
        }
      }
    }

    
    const positionedData = calculateDataPositions(data, viewType);

    
    positionedData.forEach(log => {
      const emotionConfig = emotionTreeConfigs[log.emotion] || emotionTreeConfigs.neutral;
      const treeMesh = getTreeMeshForEmotion(log.emotion, emotionConfig);
      
      if (!treeMesh) return;

      treeMesh.traverse((child) => {
        if (child.isMesh && child.material) {
          const material = child.material.clone();
          child.material = material;
          child.castShadow = true;
        }
      });
      
      const { position } = log;
      treeMesh.position.set(position.col * tileSize, 0, position.row * tileSize);
      
      const modelConfig = modelConfigs[emotionConfig.treeModel];
      const finalScale = emotionConfig.scale * (modelConfig ? modelConfig.scale : 1.0);
      treeMesh.scale.setScalar(finalScale);
      
      const groundOffset = modelConfig ? modelConfig.groundOffset : 0;
      treeMesh.position.y = groundOffset;
      
      treeMesh.userData = { log };
      
      scene.add(treeMesh);
    });

    
    camera.position.set(17, 18, 17);
    camera.lookAt(centerX, 0, centerZ);

    
    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleMouseClick);

    let frameId;
    const animate = () => {
      if (isDarkMode) animateFireflies(scene);
      controls.update();
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.clear();
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('click', handleMouseClick);
        mountRef.current.innerHTML = '';
      }
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [data, loadedModels, loading, isDarkMode, viewType, currentDate]);

  const createFallbackTree = () => {
    const treeGroup = new THREE.Group();
    
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: '#8b4513' });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    
    const foliageGeometry = new THREE.ConeGeometry(0.5, 1, 8);
    const foliageMaterial = new THREE.MeshPhongMaterial({ color: '#228b22' });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    
    treeGroup.add(trunk);
    treeGroup.add(foliage);
    
    return treeGroup;
  };

  const getTreeMeshForEmotion = (emotion, emotionConfig) => {
    const modelData = loadedModels[emotionConfig.treeModel];
    if (!modelData) return null;

    let treeMesh;
    
    if (emotionConfig.objectName) {
      let foundObject = null;
      modelData.gltf.scene.traverse((child) => {
        if (child.name === emotionConfig.objectName && child.isMesh) {
          foundObject = child;
        }
      });
      treeMesh = foundObject ? foundObject.clone() : modelData.gltf.scene.clone();
    } else {
      treeMesh = modelData.gltf.scene.clone();
    }

    return treeMesh;
  };

  const getDecorationMesh = (modelKey) => {
    const modelData = loadedModels[modelKey];
    if (!modelData) return null;
    return modelData.gltf.scene.clone();
  };

  const createSun = (scene) => {
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.9
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.set(20, 30, -20);
    scene.add(sun);

    
    const sunGlowGeometry = new THREE.SphereGeometry(2.5, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.3
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    sunGlow.position.copy(sun.position);
    scene.add(sunGlow);
  };

  const createMoon = (scene) => {
    const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(-20, 25, -15);
    scene.add(moon);

    
    const moonGlowGeometry = new THREE.SphereGeometry(2, 32, 32);
    const moonGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2
    });
    const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial);
    moonGlow.position.copy(moon.position);
    scene.add(moonGlow);
  };

  const setupLights = (scene, isDay) => {
    const lightsToRemove = [];
    scene.traverse((child) => {
      if (child.isLight && child.name !== 'firefly-light') {
        lightsToRemove.push(child);
      }
    });
    lightsToRemove.forEach(light => scene.remove(light));

    if (isDay) {
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);
    
      
      const sunLight = new THREE.DirectionalLight(0xffffcc, 1.5);
      sunLight.position.set(20, 30, -20);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      scene.add(sunLight);
    
      
      const warmLight = new THREE.PointLight(0xffcc88, 1, 100);
      warmLight.position.set(-10, 15, 10);
      scene.add(warmLight);

      
      createSun(scene);
    } else {
      
      const ambientLight = new THREE.AmbientLight(0x6699ff, 0.4);
      scene.add(ambientLight);
    
      
      const moonLight = new THREE.DirectionalLight(0x9999ff, 0.8);
      moonLight.position.set(-20, 25, -15);
      moonLight.castShadow = true;
      scene.add(moonLight);
    
      
      const warmLight = new THREE.PointLight(0xffaa44, 0.6, 50);
      warmLight.position.set(-10, 12, 15);
      scene.add(warmLight);
      
      
      const fillLight = new THREE.PointLight(0x88bbff, 0.4, 80);
      fillLight.position.set(20, 10, -5);
      scene.add(fillLight);

      
      createMoon(scene);
    }
  };

  const createGradientSky = (scene, isDay) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
  
    const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    if (isDay) {
      gradient.addColorStop(0, '#87CEEB'); 
      gradient.addColorStop(0.5, '#B0E0E6'); 
      gradient.addColorStop(1, '#E0F7FF'); 
    } else {
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(0.5, '#16213e');
      gradient.addColorStop(1, '#0f3460');
    }
  
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  
    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.SphereGeometry(500, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      depthWrite: false
    });
  
    const sky = new THREE.Mesh(geometry, material);
    sky.name = 'sky';
    scene.add(sky);
  };
  
  const addFireflies = (scene) => {
    const fireflyCount = 30;
    const fireflies = new THREE.Group();
  
    for (let i = 0; i < fireflyCount; i++) {
      const geometry = new THREE.SphereGeometry(0.08, 8, 8);
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffff88,
        transparent: true,
        opacity: 0.8
      });
      const firefly = new THREE.Mesh(geometry, material);
  
      firefly.position.set(
        Math.random() * 25 - 2.5,
        Math.random() * 8 + 1,
        Math.random() * 25 - 2.5
      );
      
      firefly.userData = {
        angle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        radius: 0.5 + Math.random() * 1.5,
        baseY: firefly.position.y,
        verticalSpeed: 0.004 + Math.random() * 0.006,
        verticalOffset: Math.random() * Math.PI * 2,
        originalX: firefly.position.x,
        originalZ: firefly.position.z
      };
  
      fireflies.add(firefly);
    }
  
    fireflies.name = 'fireflies';
    scene.add(fireflies);
  };
  
  const animateFireflies = (scene) => {
    const fireflies = scene.getObjectByName('fireflies');
    if (!fireflies) return;
  
    const time = Date.now() * 0.002;
  
    fireflies.children.forEach((firefly, index) => {
      const userData = firefly.userData;
      
      userData.angle += userData.speed;
      
      firefly.position.x = userData.originalX + Math.cos(userData.angle) * userData.radius;
      firefly.position.z = userData.originalZ + Math.sin(userData.angle) * userData.radius;
      
      firefly.position.y = userData.baseY + Math.sin(time * userData.verticalSpeed + userData.verticalOffset) * 0.5;
      
      const opacity = 0.6 + Math.sin(time * 2 + index) * 0.3;
      firefly.material.opacity = Math.max(0.3, opacity);
    });
  };

  const createCanvasGradient = (isDay) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
  
    const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    if (isDay) {
      gradient.addColorStop(0, '#ffd6e8');
      gradient.addColorStop(1, '#9f8eff');
    } else {
      gradient.addColorStop(0, '#4a6fa5');
      gradient.addColorStop(1, '#2c3e50');
    }
  
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  
    return new THREE.CanvasTexture(canvas);
  };

  const addDecorations = (scene, col, row) => {
    const tileX = col * tileSize;
    const tileZ = row * tileSize;
    const cornerDistance = tileSize * 0.35; 
    
    
    const corners = [
      { x: tileX  , z: tileZ  -row/col }, 
      { x: tileX + row/col , z: tileZ  - col/row }, 
      { x: tileX -col/row, z: tileZ -row/col }, 
      { x: tileX  , z: tileZ - row/col }  
    ];
    
    
    const decorations = [ 'grass2','grass2', 'peebl1', 'grass2'];
    
    corners.forEach((corner, index) => {
      const decorationType = decorations[index];
      const decorationMesh = getDecorationMesh(decorationType);
      
      if (!decorationMesh) return;
      
      decorationMesh.position.set(
        corner.x,
        modelConfigs[decorationType].groundOffset,
        corner.z
      );
      
      
      decorationMesh.rotation.y = Math.random() * Math.PI * 2;
      
      
      const scale = modelConfigs[decorationType].scale * (0.9 + Math.random() * 0.2);
      decorationMesh.scale.setScalar(scale);
      
      scene.add(decorationMesh);
    });
  };
  
  const createMudTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    
    ctx.fillStyle = '#5C4033';
    ctx.fillRect(0, 0, 512, 512);

    
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 3;
      const color = Math.random() > 0.5 ? '#4B3621' : '#8B4513';
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  };

  const handleMouseMove = (event) => {
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    let foundTree = null;
    for (const intersect of intersects) {
      let obj = intersect.object;
      while (obj && !obj.userData.log) {
        obj = obj.parent;
      }
      if (obj && obj.userData.log) {
        foundTree = obj;
        
        const vector = foundTree.position.clone();
        vector.y += 2; 
        vector.project(cameraRef.current);
        
        const x = (vector.x * 0.5 + 0.5) * rect.width;
        const y = (-vector.y * 0.5 + 0.5) * rect.height;
        
        setPopupPosition({ x, y });
        break;
      }
    }

    setHoveredTree(foundTree);
  };

  const handleMouseClick = (event) => {
    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

    for (const intersect of intersects) {
      let obj = intersect.object;
      while (obj && !obj.userData.log) {
        obj = obj.parent;
      }
      if (obj && obj.userData.log) {
        onTreeSelect(obj.userData.log);
        break;
      }
    }
  };

  const getGridDimensions = () => {
    
    return {
      cols: 6,
      rows: 6,
      tileSize: 4
    };
  };

  
  const calculateDataPositions = (data, viewType) => {
    if (!data) return [];
    
    switch (viewType) {
      case 'day':
        
        return data.map((log, index) => ({
          ...log,
          position: {
            row: 2, 
            col: Math.min(index, 5) 
          }
        }));
      
      case 'week':
        
        return data.map(log => {
          const date = new Date(log.createdAt);
          const dayOfWeek = date.getDay(); 
          const timeOfDay = date.getHours();
          return {
            ...log,
            position: {
              row: Math.floor(timeOfDay / 4), 
              col: Math.min(dayOfWeek, 5) 
            }
          };
        });
      
      case 'month':
        
        return data.map(log => {
          const date = new Date(log.createdAt);
          const day = date.getDate();
          const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const startingDay = firstDayOfMonth.getDay();
          const position = day + startingDay - 1;
          return {
            ...log,
            position: {
              row: Math.floor(position / 6),
              col: position % 6
            }
          };
        });
      
      default:
        return data;
    }
  };

  const createDateLabel = (date, position, scene) => {
    const formattedDate = format(date, 'dd/MM/yyyy');
    
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    
    ctx.font = '20px Arial';
    ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    
    ctx.fillText(formattedDate, canvas.width / 2, canvas.height / 2);
    
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    
    const planeGeometry = new THREE.PlaneGeometry(1.5, 0.4);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const textPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    
    
    textPlane.position.set(
      position.x,
      position.y + 0.2,
      position.z - (tileSize / 2) + 0.3
    );
    
    
    textPlane.rotation.x = -Math.PI / 2;
    
    scene.add(textPlane);
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-lg">Loading 3D Forest of Emotions...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[80vh] m-auto">
      <div ref={mountRef} className="w-full h-full rounded-lg overflow-hidden" />
      
      <div className="absolute top-3 left-3 bg-white/90 p-3 rounded-lg text-sm max-w-[200px] shadow-md">
        <div className="font-bold mb-2 text-gray-900">Forest of Emotions</div>
        <div className="text-gray-700 leading-relaxed">
          Each tree represents an emotional moment with decorative elements at the four corners of every tile.
        </div>
      </div>

      {hoveredTree && (
        <div 
          className="absolute bg-white/95 p-3 rounded-lg text-sm max-w-[300px] text-center shadow-lg pointer-events-none z-50"
          style={{
            left: popupPosition.x,
            top: popupPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-bold mb-1 text-gray-900">
            {hoveredTree.userData.log.emailSubject}
          </div>
          <div className="text-gray-600">
            Emotion: {hoveredTree.userData.log.emotion}
          </div>
          <div className="text-gray-600">
            Date: {hoveredTree.userData.log.createdAt}
          </div>
        </div>
      )}
    </div>
  );
};

export default Month3DView;