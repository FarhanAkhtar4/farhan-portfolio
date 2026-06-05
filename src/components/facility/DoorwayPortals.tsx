'use client';

import DoorwayPortal from './DoorwayPortal';

const ROOM_SPACING = 40;

export default function DoorwayPortals() {
  const portals: {
    position: [number, number, number];
    targetRoomIndex: number;
    direction: 'forward' | 'backward';
  }[] = [];

  // Generate forward portals (between each room pair)
  for (let i = 0; i < 10; i++) {
    const roomZ = 30 - i * ROOM_SPACING;
    const portalZ = roomZ - ROOM_SPACING / 2;
    portals.push({
      position: [0, 4, portalZ],
      targetRoomIndex: i + 1,
      direction: 'forward',
    });
  }

  // Generate backward portals
  for (let i = 1; i < 11; i++) {
    const roomZ = 30 - i * ROOM_SPACING;
    const portalZ = roomZ + ROOM_SPACING / 2;
    portals.push({
      position: [0, 4, portalZ],
      targetRoomIndex: i - 1,
      direction: 'backward',
    });
  }

  return (
    <group>
      {portals.map((portal, i) => (
        <DoorwayPortal
          key={`portal-${i}`}
          position={portal.position}
          targetRoomIndex={portal.targetRoomIndex}
          direction={portal.direction}
        />
      ))}
    </group>
  );
}
