function renderStructure() {
    const container = document.getElementById('structureView');
    container.innerHTML = '';

    galaxy.celestialBodies.forEach(body => {
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'star-item';

        const icons = {
            star: '★',
            blackhole: '⚫',
            neutronstar: '⚪',
            binary: '⭐',
            station: '🚀'
        };

        const title = document.createElement('div');
        title.className = 'list-title';
        title.textContent = `${icons[body.type] || '★'} ${body.name || 'Unnamed'} (${body.type.replace(/([A-Z])/g, ' $1').trim()}) (${body.faction || 'No allegiance'}) [${body.x.toFixed(1)}, ${body.y.toFixed(1)}]`;
        title.onclick = () => {
            renderGalaxy(body.id);
            showBodyInfo(body);
        };
        bodyDiv.appendChild(title);

        if (body.planets) {
            body.planets.forEach(planet => {
                const planetDiv = document.createElement('div');
                planetDiv.className = 'planet-item';
                planetDiv.innerHTML = `🪐 <strong>${planet.name}</strong>`;

                const moonsText = planet.moons.map(m => m.name).join(', ') || 'no moons';
                const locText = planet.locations.map(l => l.name).join(', ') || 'no planetary locations';

                const info = document.createElement('div');
                info.style.fontSize = '11px';
                info.style.marginTop = '2px';
                info.innerHTML = `Moons: ${moonsText}<br/>Planetary Locations: ${locText}`;
                planetDiv.appendChild(info);

                bodyDiv.appendChild(planetDiv);
            });
        }

        container.appendChild(bodyDiv);
    });
}

function showBodyInfo(body) {
    const info = document.getElementById('infoContent');
    let html = `<strong>${body.type.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${body.name || 'Unnamed'}<br/>`;
    html += `Type: ${body.type.replace(/([A-Z])/g, ' $1').toUpperCase()}<br/>`;
    html += `Allegiance: ${body.faction || 'none'}<br/>`;
    html += `Temperature: ${body.temperature || 'not set'} K<br/>`;
    html += `Position: (${body.x.toFixed(2)}, ${body.y.toFixed(2)})<br/>`;
    html += `Color: <span style="color:${body.color};">${body.color}</span><br/>`;
    html += `Description: ${body.description || 'none'}<br/><br/>`;

    if (!body.planets || !body.planets.length) {
        html += body.type === 'station' ? 'Interstellar stations cannot have planets.' : 'No planets in this system.';
    } else {
        body.planets.forEach(planet => {
            html += `<strong>Planets:</strong> ${planet.name}<br/>`;
            html += `Description: ${planet.description || 'empty'}<br/>`;
            html += `Moons: ${planet.moons.length ? planet.moons.map(m => m.name).join(', ') : 'none'}<br/>`;
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
    const planetBodySelect = document.getElementById('planetBodySelect');
    const moonPlanetSelect = document.getElementById('moonPlanetSelect');
    const locationPlanetSelect = document.getElementById('locationPlanetSelect');
    const bodyFactionSelect = document.getElementById('bodyFactionSelect');
    const deleteBodySelect = document.getElementById('deleteBodySelect');

    planetBodySelect.innerHTML = '';
    moonPlanetSelect.innerHTML = '';
    locationPlanetSelect.innerHTML = '';
    deleteBodySelect.innerHTML = '';

    galaxy.celestialBodies.forEach(body => {
        const opt = document.createElement('option');
        opt.value = body.id;
        opt.textContent = `${body.name || 'Unnamed'} (${body.type})`;
        planetBodySelect.appendChild(opt);

        const optDel = opt.cloneNode(true);
        deleteBodySelect.appendChild(optDel);
    });

    galaxy.celestialBodies.forEach(body => {
        if (body.planets) {
            body.planets.forEach(planet => {
                const label = `${body.name || 'Unnamed'} – ${planet.name}`;
                const opt1 = document.createElement('option');
                opt1.value = planet.id;
                opt1.textContent = label;
                moonPlanetSelect.appendChild(opt1);

                const opt2 = opt1.cloneNode(true);
                locationPlanetSelect.appendChild(opt2);
            });
        }
    });

    bodyFactionSelect.innerHTML = '';
    const emptyOpt = document.createElement('option');
    emptyOpt.value = '';
    emptyOpt.textContent = 'None';
    bodyFactionSelect.appendChild(emptyOpt);

    galaxy.factions.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.textContent = f.name;
        bodyFactionSelect.appendChild(opt);
    });
}

document.getElementById("loadJsonInp").addEventListener("change", e => {
    const name = e.target.files.length ? e.target.files[0].name : "No file selected";
    document.getElementById("fileName").textContent = name;
});

renderStructure();
refreshSelectors();
