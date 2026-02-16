canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldPos = screenToWorld(x, y);

    let clickedStar = null;
    for (const star of galaxy.stars) {
        const dx = worldPos.x - star.x;
        const dy = worldPos.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= star.radius * 1.5) {
            clickedStar = star;
            break;
        }
    }

    if (clickedStar) {
        renderGalaxy(clickedStar.id);
        showStarInfo(clickedStar);
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


document.getElementById('addStarBtn').addEventListener('click', () => {
    const name = document.getElementById('starName').value.trim();
    const desc = document.getElementById('starDescription').value.trim();
    const faction = document.getElementById('starFactionSelect').value;
    const temp = parseInt(document.getElementById('starTemp').value, 10) || 5800;
    const wx = parseFloat(document.getElementById('starX').value) || 0;
    const wy = parseFloat(document.getElementById('starY').value)*-1 || 0;
    const colorMode = document.getElementById('starColorMode').value;

    if (!name) {
        alert('Name the star.');
        return;
    }

    const star = addStar(name, desc, faction, temp, wx, wy, colorMode);
    showStarInfo(star);

    document.getElementById('starName').value = '';
    document.getElementById('starDescription').value = '';
});

document.getElementById('addPlanetBtn').addEventListener('click', () => {
    const starId = document.getElementById('planetStarSelect').value;
    const name = document.getElementById('planetName').value.trim();
    const desc = document.getElementById('planetDescription').value.trim();

    if (!starId) {
        alert('Add a star first.');
        return;
    }
    if (!name) {
        alert('Name the planet.');
        return;
    }

    addPlanet(starId, name, desc);
    document.getElementById('planetName').value = '';
    document.getElementById('planetDescription').value = '';

    const star = galaxy.stars.find(s => s.id === starId);
    if (star) showStarInfo(star);
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
    for (const star of galaxy.stars) {
        for (const planet of star.planets) {
            if (planet.id === planetId) {
                showStarInfo(star);
                break outer;
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
    for (const star of galaxy.stars) {
        for (const planet of star.planets) {
            if (planet.id === planetId) {
                showStarInfo(star);
                break outer;
            }
        }
    }
});

document.getElementById('deleteStarBtn').addEventListener('click', () => {
    const select = document.getElementById('deleteStarSelect');
    const starId = select.value;
    if (!starId) {
        alert('No star to delete.');
        return;
    }
    const star = galaxy.stars.find(s => s.id === starId);
    const name = star ? star.name : '(bez nazwy)';
    const confirmed = confirm(`Are you sure to delete "${name}" and all its planets?`);
    if (!confirmed) return;

    deleteStarById(starId);
    document.getElementById('infoContent').textContent =
        'The star has been deleted.';
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

    const found = galaxy.stars.filter(s => (s.name || '').toLowerCase().includes(q));
    if (!found.length) {
        alert('Star not found.');
        return;
    }

    const star = found[0];
    offsetX = star.x;
    offsetY = star.y;
    renderGalaxy(star.id);
    showStarInfo(star);
});

document.getElementById('searchStar').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});
