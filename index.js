(async () => {
	const presets = ["default", "contact", "egypt", "checkerboard", "forest", "goaland", "yavapai", 
	    "goldmine", "threetowers", "poison", "arches", "tron", "japan", "dream", "volcano", "starry",
	    "osiris"];
	const preset = presets[Math.floor(Math.random() * presets.length)];
	env.setAttribute("environment", "preset", new URLSearchParams(location.search).get("env") || preset);

	await when(env.hasLoaded, env, "loaded");
	const { skyColor, horizonColor, groundColor } = env.components.environment.data;
	const canvases = [
	    makeEnvMapCanvas(skyColor, horizonColor),
	    makeEnvMapCanvas(skyColor, horizonColor),

	    makeEnvMapCanvas(skyColor),
	    makeEnvMapCanvas(groundColor),

	    makeEnvMapCanvas(skyColor, horizonColor),
	    makeEnvMapCanvas(skyColor, horizonColor)
	];

	await when(logo.object3DMap.mesh, logo, "model-loaded");
    const em = new THREE.CubeTexture(canvases);
    em.needsUpdate = true;
    logo.object3D.traverse(obj => {
        if (!obj.material) return;
        obj.material.envMap = em;
    });

	function makeEnvMapCanvas(topColor, bottomColor) {
	    if (!bottomColor) { bottomColor = topColor; }
	    const map = document.createElement("canvas");
	    const size = 64;
	    map.width = map.height = size;
	    const ctx = map.getContext("2d");
	    const gradient = ctx.createLinearGradient(0, 0, 0, size);
	    gradient.addColorStop(0, topColor);
	    gradient.addColorStop(1, bottomColor);
	    ctx.fillStyle = gradient;
	    ctx.fillRect(0, 0, size, size);
	    return map;
	}

	function when(ready, obj, eventName) {
	    if (ready) return Promise.resolve();
	    return new Promise(resolve => obj.addEventListener(eventName, resolve));
	}
})();
