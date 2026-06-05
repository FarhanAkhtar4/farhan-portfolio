---
Task ID: 1
Agent: full-stack-developer
Task: Major enhancement - add 3D portals, mouse look, particles, clickable doors, stat animations

Work Log:
- Created DoorwayPortal.tsx with clickable semi-transparent glowing portal planes, pulsing animation, arrow cones, and direction labels
- Created DoorwayPortals.tsx wrapper that generates forward/backward portals between all adjacent room pairs
- Created ParticleField.tsx with 800 floating particles (300 on mobile) using additive blending, drifting downward with reset
- Modified CameraController.tsx: added pointer drag tracking (pointerdown/move/up) with horizontal ±0.3rad and vertical ±0.15rad clamping, smooth lerp back to center when not dragging, offset applied as rotational offset to lookAt direction
- Modified EntryRoom.tsx: added onClick handler to door inset mesh that calls useFacilityStore directly, pointer hover glow effect via emissiveIntensity, "CLICK TO ENTER" billboard that hides after entry
- Modified CommandCenterRoom.tsx: replaced static stat panels with StatCounter component using useState + useFrame count-up animation (ease-out cubic over 2 seconds), animates 22%, 6+, 11+, 100%
- Modified ProjectVaultRoom.tsx: added expandedProject state, onClick on each tile group toggles selection, selected tile glows brighter, expanded detail panel appears at [0, 4, 6] with title, description, highlights, tags, category, and CLOSE button; fade-in animation via useState
- Modified Scene.tsx: added BackgroundStars (500 Points in 150-300 distance sphere), ParticleField integration, DoorwayPortals integration
- Modified FacilityExperience.tsx: added AdaptiveDpr pixelated and AdaptiveEvents from drei for adaptive performance

Stage Summary:
- All 8 enhancement features implemented
- Lint passing with 0 errors
- Dev server compiling successfully
- All new files have 'use client' directive
- No THREE objects created in render (using useRef/useMemo patterns)
- No Three.js objects used as React children (all use geometry={} props or JSX elements)
