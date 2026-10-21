class BossGenerator {
    constructor(scene) {
        this.scene = scene;
    }
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
    createCinderGolem() {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3), new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 1 }));
        group.add(body);
        for(let i=0; i<10; i++) {
            const vein = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 5 }));
            vein.position.set((Math.random()-0.5)*3, (Math.random()-0.5)*4, (Math.random()-0.5)*3);
            group.add(vein);
        }
        return { group, update: (t) => { group.position.y += Math.sin(t * 2) * 0.005; }};
    }
    createVoidWeaver() {
        const group = new THREE.Group();
        const rings = [];
        for(let i=0; i<3; i++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(2 + i, 0.1, 16, 100), new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x4400aa }));
            ring.rotation.x = Math.random() * Math.PI;
            group.add(ring);
            rings.push(ring);
        }
        return { group, update: (t) => {
            rings.forEach((r, i) => { r.rotation.y += 0.01 * (i+1); r.rotation.z += 0.005; });
        }};
    }
}
