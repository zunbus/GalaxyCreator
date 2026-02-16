let galaxy = {
    factions: [
        { name: 'Unexplored', color: '#0000' }
    ],
    stars: []
};

const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

let scale = 40;
let offsetX = 0;
let offsetY = 0;
const baseGridStep = 1;

const zoomInfo = document.getElementById('zoomInfo');

// Core data manipulation functions
function addFaction(name, color) {
    name = name.trim();
    if (!name) return;
    if (galaxy.factions.some(f => f.name === name)) return;
    galaxy.factions.push({ name, color });
    refreshFactionUI();
}

function addStar(name, description, faction, temperature, wx, wy, colorMode) {
    let color;
    if (colorMode === 'auto') {
        color = tempToColor(temperature);
    } else {
        color = colorMode;
    }

    const star = {
        id: crypto.randomUUID(),
        name,
        description,
        faction,
        temperature,
        color,
        x: wx,
        y: wy,
        radius: 0.2,
        planets: []
    };
    galaxy.stars.push(star);
    refreshSelectors();
    renderGalaxy();
    renderStructure();
    return star;
}

function deleteStarById(starId) {
    const idx = galaxy.stars.findIndex(s => s.id === starId);
    if (idx === -1) return;
    galaxy.stars.splice(idx, 1);
    refreshSelectors();
    renderStructure();
    renderGalaxy();
}

function addPlanet(starId, name, description) {
    const star = galaxy.stars.find(s => s.id === starId);
    if (!star) return;
    const planet = {
        id: crypto.randomUUID(),
        name,
        description,
        moons: [],
        locations: []
    };
    star.planets.push(planet);
    refreshSelectors();
    renderStructure();
    return planet;
}

function addMoon(planetId, name) {
    for (const star of galaxy.stars) {
        const planet = star.planets.find(p => p.id === planetId);
        if (planet) {
            const moon = { id: crypto.randomUUID(), name };
            planet.moons.push(moon);
            renderStructure();
            return moon;
        }
    }
}

function addLocation(planetId, name, description) {
    for (const star of galaxy.stars) {
        const planet = star.planets.find(p => p.id === planetId);
        if (planet) {
            const loc = { id: crypto.randomUUID(), name, description };
            planet.locations.push(loc);
            renderStructure();
            return loc;
        }
    }
}
