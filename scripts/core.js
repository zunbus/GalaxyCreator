let galaxy = {
    factions: [
        { name: 'Unexplored', color: '#0000' }
    ],
    celestialBodies: []
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

function addCelestialBody(name, description, faction, temperature, wx, wy, colorMode, type) {
    let color;
    if (colorMode === 'auto') {
        color = tempToColor(temperature, type);
    } else {
        color = colorMode;
    }

    const body = {
        id: crypto.randomUUID(),
        name,
        description,
        faction,
        temperature,
        color,
        x: wx,
        y: wy,
        radius: type === 'blackhole' ? 0.25 : type === 'neutronstar' ? 0.15 : type === 'station' ? 0.12 : 0.2,
        type,
        planets: type !== 'station' ? [] : undefined
    };
    galaxy.celestialBodies.push(body);
    refreshSelectors();
    renderGalaxy();
    renderStructure();
    return body;
}

function deleteBodyById(bodyId) {
    const idx = galaxy.celestialBodies.findIndex(b => b.id === bodyId);
    if (idx === -1) return;
    galaxy.celestialBodies.splice(idx, 1);
    refreshSelectors();
    renderStructure();
    renderGalaxy();
}

function addPlanet(bodyId, name, description) {
    const body = galaxy.celestialBodies.find(b => b.id === bodyId && b.type !== 'station');
    if (!body) return;
    const planet = {
        id: crypto.randomUUID(),
        name,
        description,
        moons: [],
        locations: []
    };
    body.planets.push(planet);
    refreshSelectors();
    renderStructure();
    return planet;
}

function addMoon(planetId, name) {
    for (const body of galaxy.celestialBodies) {
        if (body.planets) {
            const planet = body.planets.find(p => p.id === planetId);
            if (planet) {
                const moon = { id: crypto.randomUUID(), name };
                planet.moons.push(moon);
                renderStructure();
                return moon;
            }
        }
    }
}

function addLocation(planetId, name, description) {
    for (const body of galaxy.celestialBodies) {
        if (body.planets) {
            const planet = body.planets.find(p => p.id === planetId);
            if (planet) {
                const loc = { id: crypto.randomUUID(), name, description };
                planet.locations.push(loc);
                renderStructure();
                return loc;
            }
        }
    }
}
