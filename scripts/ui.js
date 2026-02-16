function renderStructure() {
    const container = document.getElementById('structureView');
    container.innerHTML = '';

    galaxy.stars.forEach(star => {
        const starDiv = document.createElement('div');
        starDiv.className = 'star-item';

        const title = document.createElement('div');
        title.className = 'list-title';
        title.textContent =
            `★ ${star.name || 'Unnamed'} (${star.faction || 'No allegiance'}) [${star.x.toFixed(1)}, ${star.y.toFixed(1)}]`;
        title.onclick = () => {
            renderGalaxy(star.id);
            showStarInfo(star);
        };
        starDiv.appendChild(title);

        star.planets.forEach(planet => {
            const planetDiv = document.createElement('div');
            planetDiv.className = 'planet-item';
            planetDiv.innerHTML = `🪐 <strong>${planet.name}</strong>`;

            const moonsText = planet.moons.map(m => m.name).join(', ') || 'no moons';
            const locText = planet.locations.map(l => l.name).join(', ') || 'no planetary locations';

            const info = document.createElement('div');
            info.style.fontSize = '11px';
            info.style.marginTop = '2px';
            info.innerHTML =
                `Moons: ${moonsText}<br/>` +
                `Planetary Locations: ${locText}`;
            planetDiv.appendChild(info);

            starDiv.appendChild(planetDiv);
        });

        container.appendChild(starDiv);
    });
}

function showStarInfo(star) {
    const info = document.getElementById('infoContent');
    let html = `<strong>Star:</strong> ${star.name || 'Unnamed'}<br/>`;
    html += `Allegiance: ${star.faction || 'none'}<br/>`;
    html += `Temperature: ${star.temperature || 'not set'} K<br/>`;
    html += `Position: (${star.x.toFixed(2)}, ${star.y.toFixed(2)})<br/>`;
    html += `Color: <span style="color:${star.color};">${star.color}</span><br/>`;
    html += `Description: ${star.description || 'none'}<br/><br/>`;

    if (!star.planets.length) {
        html += 'No planets in this system.';
    } else {
        star.planets.forEach(planet => {
            html += `<strong>Planets:</strong> ${planet.name}<br/>`;
            html += `Description: ${planet.description || 'empty'}<br/>`;
            html += `Moons: ${
                planet.moons.length
                    ? planet.moons.map(m => m.name).join(', ')
                    : 'none'
            }<br/>`;
            html += 'Planetary Locations:<br/>';
            if (!planet.locations.length) {
                html += '– none<br/>';
            } else {
                planet.locations.forEach(loc => {
                    html += `– <em>${loc.name}</em>: ${loc.description || 'no description'}<br/>`;
                });
            }
            html += '<br/>';
        });
    }

    info.innerHTML = html;
}

function refreshSelectors() {
    const planetStarSelect = document.getElementById('planetStarSelect');
    const moonPlanetSelect = document.getElementById('moonPlanetSelect');
    const locationPlanetSelect = document.getElementById('locationPlanetSelect');
    const starFactionSelect = document.getElementById('starFactionSelect');
    const deleteStarSelect = document.getElementById('deleteStarSelect');

    planetStarSelect.innerHTML = '';
    moonPlanetSelect.innerHTML = '';
    locationPlanetSelect.innerHTML = '';
    deleteStarSelect.innerHTML = '';

    galaxy.stars.forEach(star => {
        const opt = document.createElement('option');
        opt.value = star.id;
        opt.textContent = star.name || 'Unnamed';
        planetStarSelect.appendChild(opt);

        const optDel = opt.cloneNode(true);
        deleteStarSelect.appendChild(optDel);
    });

    galaxy.stars.forEach(star => {
        star.planets.forEach(planet => {
            const label = `${star.name || 'Unnamed'} – ${planet.name}`;
            const opt1 = document.createElement('option');
            opt1.value = planet.id;
            opt1.textContent = label;
            moonPlanetSelect.appendChild(opt1);

            const opt2 = opt1.cloneNode(true);
            locationPlanetSelect.appendChild(opt2);
        });
    });

    starFactionSelect.innerHTML = '';
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = 'None';
    starFactionSelect.appendChild(emptyOpt);

    galaxy.factions.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.textContent = f.name;
        starFactionSelect.appendChild(opt);
    });
}

document.getElementById("loadJsonInp").addEventListener("change", e => {
    const name = e.target.files.length ? e.target.files[0].name : "No file selected";
    document.getElementById("fileName").textContent = name;
});


renderStructure();