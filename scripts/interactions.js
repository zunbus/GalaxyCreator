canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldPos = screenToWorld(x, y);

    let clickedBody = null;
    for (const body of galaxy.celestialBodies) {
        const dx = worldPos.x - body.x;
        const dy = worldPos.y - body.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= body.radius * 1.5) {
            clickedBody = body;
            break;
        }
    }

    if (clickedBody) {
        renderGalaxy(clickedBody.id);
        showBodyInfo(clickedBody);
    }
});

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.classList.add('dragging');
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    canvas.classList.remove('dragging');
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    offsetX -= dx / scale;
    offsetY -= dy / scale;
    renderGalaxy();
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    const worldBefore = screenToWorld(mouseX, mouseY);

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    scale *= zoomFactor;
    scale = Math.max(5, Math.min(200, scale));

    const worldAfter = screenToWorld(mouseX, mouseY);
    offsetX += worldBefore.x - worldAfter.x;
    offsetY += worldBefore.y - worldAfter.y;

    renderGalaxy();
}, { passive: false });

document.getElementById('addBodyBtn').addEventListener('click', () => {
    const name = document.getElementById('bodyName').value.trim();
    const desc = document.getElementById('bodyDescription').value.trim();
    const faction = document.getElementById('bodyFactionSelect').value;
    const temp = parseInt(document.getElementById('bodyTemp').value, 10) || 5800;
    const wx = parseFloat(document.getElementById('bodyX').value) || 0;
    const wy = parseFloat(document.getElementById('bodyY').value)*-1 || 0;
    const colorMode = document.getElementById('bodyColorMode').value;
    const type = document.getElementById('bodyTypeSelect').value;

    if (!name) {
        alert('Name the celestial body.');
        return;
    }

    const body = addCelestialBody(name, desc, faction, temp, wx, wy, colorMode, type);
    showBodyInfo(body);

    document.getElementById('bodyName').value = '';
    document.getElementById('bodyDescription').value = '';
});

document.getElementById('addPlanetBtn').addEventListener('click', () => {
    const bodyId = document.getElementById('planetBodySelect').value;
    const name = document.getElementById('planetName').value.trim();
    const desc = document.getElementById('planetDescription').value.trim();

    if (!bodyId) {
        alert('Select a celestial body first.');
        return;
    }
    if (!name) {
        alert('Name the planet.');
        return;
    }

    addPlanet(bodyId, name, desc);
    document.getElementById('planetName').value = '';
    document.getElementById('planetDescription').value = '';

    const body = galaxy.celestialBodies.find(b => b.id === bodyId);
    if (body) showBodyInfo(body);
});

document.getElementById('addMoonBtn').addEventListener('click', () => {
    const planetId = document.getElementById('moonPlanetSelect').value;
    const name = document.getElementById('moonName').value.trim();

    if (!planetId) {
        alert('Add a planet first.');
        return;
    }
    if (!name) {
        alert('Name the moon.');
        return;
    }

    addMoon(planetId, name);
    document.getElementById('moonName').value = '';

    outer:
    for (const body of galaxy.celestialBodies) {
        if (body.planets) {
            for (const planet of body.planets) {
                if (planet.id === planetId) {
                    showBodyInfo(body);
                    break outer;
                }
            }
        }
    }
});

document.getElementById('addLocationBtn').addEventListener('click', () => {
    const planetId = document.getElementById('locationPlanetSelect').value;
    const name = document.getElementById('locationName').value.trim();
    const desc = document.getElementById('locationDescription').value.trim();

    if (!planetId) {
        alert('Add a planet first.');
        return;
    }
    if (!name) {
        alert('Name the planetary location.');
        return;
    }

    addLocation(planetId, name, desc);
    document.getElementById('locationName').value = '';
    document.getElementById('locationDescription').value = '';

    outer:
    for (const body of galaxy.celestialBodies) {
        if (body.planets) {
            for (const planet of body.planets) {
                if (planet.id === planetId) {
                    showBodyInfo(body);
                    break outer;
                }
            }
        }
    }
});

document.getElementById('deleteBodyBtn').addEventListener('click', () => {
    const select = document.getElementById('deleteBodySelect');
    const bodyId = select.value;
    if (!bodyId) {
        alert('No body to delete.');
        return;
    }
    const body = galaxy.celestialBodies.find(b => b.id === bodyId);
    const name = body ? body.name : '(unnamed)';
    const confirmed = confirm(`Are you sure to delete "${name}" and all its planets?`);
    if (!confirmed) return;

    deleteBodyById(bodyId);
    document.getElementById('infoContent').textContent =
        'The celestial body has been deleted.';
});

document.getElementById('addFactionBtn').addEventListener('click', () => {
    const name = document.getElementById('newFactionName').value.trim();
    const color = document.getElementById('newFactionColor').value || '#44aa88';
    if (!name) {
        alert('Name the faction.');
        return;
    }
    addFaction(name, color);
    document.getElementById('newFactionName').value = '';
});

document.getElementById('searchBtn').addEventListener('click', () => {
    const q = document.getElementById('searchStar').value.trim().toLowerCase();
    if (!q) return;

    const found = galaxy.celestialBodies.filter(b => (b.name || '').toLowerCase().includes(q));
    if (!found.length) {
        alert('Celestial body not found.');
        return;
    }

    const body = found[0];
    offsetX = body.x;
    offsetY = body.y;
    renderGalaxy(body.id);
    showBodyInfo(body);
});

document.getElementById('searchStar').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});
