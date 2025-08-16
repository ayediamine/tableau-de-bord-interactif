export type Vec3 = [number, number, number]

export const devices = {
  cameras: [
    { id: 'C-01', name: 'North Corner',  pos: [-12,  3.0,  10] as Vec3, yaw:  45, fov: 60 },
    { id: 'C-02', name: 'East Corner',   pos: [ 12,  3.0,  10] as Vec3, yaw: 135, fov: 60 },
    { id: 'C-03', name: 'South Corner',  pos: [ 12,  3.0, -10] as Vec3, yaw: 225, fov: 60 },
    { id: 'C-04', name: 'West Corner',   pos: [-12,  3.0, -10] as Vec3, yaw: 315, fov: 60 }
  ],
  doors: [
    { id: 'D-01', name: 'Main Door',     pos: [  0, 0.0,  -8] as Vec3, state: 'closed' },
    { id: 'D-02', name: 'Service Gate',  pos: [  8, 0.0,   0] as Vec3, state: 'open'   }
  ]
}
