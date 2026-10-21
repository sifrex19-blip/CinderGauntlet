const isVisible=(obj,cam)=>{if(!obj||!cam)return false;const box=new THREE.Box3().setFromObject(obj);const frustum=new THREE.Frustum();cam.updateMatrixWorld();cam.projScreenMatrix=new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse);frustum.setFromProjectionMatrix(cam.projScreenMatrix);return frustum.intersectsBox(box)};

class BossGenerator {
    constructor(scene) { this.scene = scene; }
    
    // Helper for normalized phase progress (0 to 1)
    getPhaseProgress(boss) {
        if (!boss.a) return 0;
        const tn = boss.tn;
        if (boss.st === 'wind') return tn / boss.wl;
        if (boss.st === 'act') return (tn - boss.a.w) / boss.a.a;
        if (boss.st === 'rec') return (tn - (boss.a.w + boss.a.a)) / boss.a.r;
        return 0;
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
        return { 
            group, 
            update: (t, boss) => {
                const p = this.getPhaseProgress(boss);
                const state = boss.st;
                
                shards.forEach((s, i) => {
                    let currentDist = s.dist;
                    let intensity = 1;

                    if (state === 'wind') {
                        currentDist *= (1 - p * 0.6); // Contract shards during windup
                        core.material.emissiveIntensity = 2 + p * 10; // Core glows brighter
                    } else if (state === 'act') {
                        currentDist *= (1 + p * 2); // Explode shards during attack
                        core.material.emissiveIntensity = 10;
                    } else {
                        core.material.emissiveIntensity = 2;
                    }

                    s.mesh.position.x = Math.cos(t + s.angle) * currentDist;
                    s.mesh.position.z = Math.sin(t + s.angle) * currentDist;
                    s.mesh.position.y += Math.sin(t + i) * 0.01;
                });
            }
        };
    }
    createCinderGolem() {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 3), new THREE.MeshStandardMaterial({ color: 0x332211, roughness: 1 }));
        group.add(body);
        const veins = [];
        for(let i=0; i<10; i++) {
            const vein = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 5 }));
            vein.position.set((Math.random()-0.5)*3, (Math.random()-0.5)*4, (Math.random()-0.5)*3);
            group.add(vein);
            veins.push(vein);
        }
        return { 
            group, 
            update: (t, boss) => {
                const p = this.getPhaseProgress(boss);
                const state = boss.st;
                
                if (state === 'wind') {
                    group.position.y = -Math.sin(p * Math.PI) * 2; // Sink into ground
                } else if (state === 'act') {
                    group.position.y = 0; // Snap back up
                } else {
                    group.position.y += Math.sin(t * 2) * 0.005;
                }

                veins.forEach(v => { 
                    v.material.emissiveIntensity = (state === 'act') ? 20 : 1 + Math.sin(t * 3) * 0.5; 
                });
            }
        };
    }
    createVoidWeaver() {
        const group = new THREE.Group();
        const rings = [];
        for(let i=0; i<3; i++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(2 + i, 0.1, 16, 100), new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x4400aa, emissiveIntensity: 1 }));
            ring.rotation.x = Math.random() * Math.PI;
            group.add(ring);
            rings.push(ring);
        }
        return { 
            group, 
            update: (t, boss) => {
                const p = this.getPhaseProgress(boss);
                const state = boss.st;
                
                rings.forEach((r, i) => {
                    const speed = (state === 'act') ? 0.05 * (i+1) : 0.01 * (i+1);
                    r.rotation.y += speed;
                    r.rotation.z += speed * 0.5;
                    r.material.emissiveIntensity = (state === 'act') ? 10 : 1 + Math.sin(t * 2 + i) * 0.5;
                });
            }
        };
    }
}
