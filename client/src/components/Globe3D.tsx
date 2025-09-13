import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export function Globe3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const earthRef = useRef<THREE.Object3D>();
  const atmosphereRef = useRef<THREE.Object3D>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const isMouseDownRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cameraControlsRef = useRef({
    phi: Math.PI / 2,
    theta: 0,
    radius: 5,
    targetPhi: Math.PI / 2,
    targetTheta: 0,
    targetRadius: 5
  });
  const earthRotationRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    const sizeToContainer = () => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      camera.aspect = rect.width / rect.height || 1;
      camera.updateProjectionMatrix();
      renderer.setSize(rect.width, rect.height, false);
    };

    sizeToContainer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const updateCameraPosition = () => {
      const controls = cameraControlsRef.current;
      const x = controls.radius * Math.sin(controls.phi) * Math.cos(controls.theta);
      const y = controls.radius * Math.cos(controls.phi);
      const z = controls.radius * Math.sin(controls.phi) * Math.sin(controls.theta);
      
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    };
    updateCameraPosition();

    const createEarth = () => {
      // Fallback Earth - only used if GLB model fails to load
      const geometry = new THREE.SphereGeometry(2.25, 64, 32);
      
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;
      
      // More realistic ocean gradient
      const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
      oceanGradient.addColorStop(0, '#0066cc');
      oceanGradient.addColorStop(0.5, '#004499');
      oceanGradient.addColorStop(1, '#002266');
      ctx.fillStyle = oceanGradient;
      ctx.fillRect(0, 0, 2048, 1024);
      
      // More realistic continent shapes and colors
      const continents = [
        // North America
        { x: 200, y: 200, w: 400, h: 250, color: '#2d5016' },
        { x: 250, y: 150, w: 300, h: 150, color: '#3a6b1c' },
        
        // South America  
        { x: 350, y: 450, w: 200, h: 350, color: '#1f3d0f' },
        { x: 400, y: 500, w: 150, h: 250, color: '#4a7c2a' },
        
        // Africa
        { x: 900, y: 250, w: 250, h: 450, color: '#8B4513' },
        { x: 950, y: 200, w: 200, h: 400, color: '#A0522D' },
        
        // Europe
        { x: 850, y: 150, w: 200, h: 120, color: '#228B22' },
        
        // Asia
        { x: 1100, y: 100, w: 600, h: 350, color: '#2F4F2F' },
        { x: 1200, y: 200, w: 400, h: 200, color: '#8FBC8F' },
        
        // Australia
        { x: 1400, y: 600, w: 200, h: 120, color: '#CD853F' },
        
        // Ice caps
        { x: 0, y: 0, w: 2048, h: 80, color: '#F0F8FF' },
        { x: 0, y: 944, w: 2048, h: 80, color: '#F0F8FF' }
      ];
      
      continents.forEach(continent => {
        ctx.fillStyle = continent.color;
        ctx.beginPath();
        ctx.roundRect(continent.x, continent.y, continent.w, continent.h, 20);
        ctx.fill();
        
        // Add some texture
        ctx.fillStyle = continent.color + '60';
        ctx.beginPath();
        ctx.roundRect(continent.x + 15, continent.y + 15, continent.w - 30, continent.h - 30, 15);
        ctx.fill();
      });
      
      // Add cloud layer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const radius = 30 + Math.random() * 80;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      
      const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.6, // Reduced for more reflection and brightness
        metalness: 0.0,
        envMapIntensity: 2.0 // Increased from 1.0 to 2.0 for more brightness
      });
      
      const earth = new THREE.Mesh(geometry, material);
      scene.add(earth);
      earthRef.current = earth;
    };

    createEarth();

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/api/models/Earth_1_12756.glb', // Using the specific Earth model from public folder
      (gltf) => {
        const model = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const targetRadius = 2.25; // Increased to match new Earth size
        const scaleFactor = targetRadius / (maxAxis / 2);
        model.scale.multiplyScalar(scaleFactor);
        
        const box2 = new THREE.Box3().setFromObject(model);
        const center = box2.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.Material | THREE.Material[];
            const fixMat = (m: THREE.Material) => {
              if ((m as any).roughness !== undefined) (m as any).roughness = 0.6; // Reduced for more brightness
              if ((m as any).metalness !== undefined) (m as any).metalness = 0.0;
              if ((m as any).envMapIntensity !== undefined) (m as any).envMapIntensity = 2.0; // Increased for brightness
              m.transparent = false;
              m.side = THREE.FrontSide;
              m.needsUpdate = true;
            };
            if (Array.isArray(mat)) mat.forEach(fixMat); 
            else if (mat) fixMat(mat);
          }
        });
        
        if (earthRef.current) scene.remove(earthRef.current);
        scene.add(model);
        earthRef.current = model;
      },
      undefined,
      (error) => {
        console.warn('GLB loading failed, using fallback Earth:', error);
      }
    );

    // Simple atmosphere - consistent blue glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.7, 64, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 1.8);
          gl_FragColor = vec4(0.3, 0.6, 1.0, intensity * 0.8);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    atmosphereRef.current = atmosphere;

    // Brighter lighting specifically for the Earth
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4); // Increased from 0.8 to 1.4
    scene.add(ambientLight);

    // Main light - stronger illumination for the Earth
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0); // Increased from 1.2 to 2.0
    mainLight.position.set(2, 2, 2);
    scene.add(mainLight);

    // Secondary fill light - brighter to eliminate any dullness
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased from 0.6 to 1.2
    fillLight.position.set(-2, 1, -1);
    scene.add(fillLight);

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDownRef.current = true;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isMouseDownRef.current) {
        const deltaX = event.clientX - mouseRef.current.x;
        const deltaY = event.clientY - mouseRef.current.y;

        cameraControlsRef.current.targetTheta += deltaX * 0.01;
        cameraControlsRef.current.targetPhi += deltaY * 0.01;
        
        cameraControlsRef.current.targetPhi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraControlsRef.current.targetPhi));

        mouseRef.current.x = event.clientX;
        mouseRef.current.y = event.clientY;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraControlsRef.current.targetRadius += event.deltaY * 0.01;
      cameraControlsRef.current.targetRadius = Math.max(2, Math.min(10, cameraControlsRef.current.targetRadius));
    };

    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    canvasRef.current.addEventListener('wheel', handleWheel);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', sizeToContainer);

    const animate = () => {
      requestAnimationFrame(animate);

      earthRotationRef.current += 0.002;
      if (earthRef.current) {
        earthRef.current.rotation.y = earthRotationRef.current;
      }

      const controls = cameraControlsRef.current;
      controls.phi += (controls.targetPhi - controls.phi) * 0.05;
      controls.theta += (controls.targetTheta - controls.theta) * 0.05;
      controls.radius += (controls.targetRadius - controls.radius) * 0.05;

      updateCameraPosition();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
        canvasRef.current.removeEventListener('wheel', handleWheel);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', sizeToContainer);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="rounded-full shadow-globe cursor-grab active:cursor-grabbing"
      data-testid="canvas-globe"
    />
  );
}
