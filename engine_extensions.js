const isVisible=(obj,cam)=>{if(!obj||!cam)return false;const box=new THREE.Box3().setFromObject(obj);const frustum=new THREE.Frustum();cam.updateMatrixWorld();cam.projScreenMatrix=new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);frustum.setFromProjectionMatrix(cam.projScreenMatrix);return frustum.intersectsBox(box)};

class BossGenerator {
    constructor(scene) { this.scene = scene; }
    createObsidianSentinel() {
        const group = new THREE.Group();
        const core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 2 }));
        group.add(core);
        const shards = [];
        for(let i=0; i<20; i++) {
            const shard = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.2, 0), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0, metalness: 1 }));
            shard.position.set((Math.random()-0.5)*5, (Math.random()-0.5)*5, (Math.random()-0.5)*5);
            group.add(shard);
            shards.push({mesh: shard, angle: Math.random() * Math.PI * 2, dist: 2 + Math.random() * 2});
        }
        return { group, update: (t) => {
            shards.forEach((s, i) => {
                s.mesh.position.x = Math.cos(t + s.angle) * s.dist;
                s.mesh.position.z = Math.sin(t + s.angle) * s.dist;
                s.mesh.position.y += Math.sin(t + i) * 0.01;
            });
        }};
    }
}
