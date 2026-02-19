function refreshFactionUI() {
    const factionSelect = document.getElementById('factionSelect');
    const factionList = document.getElementById('factionList');
    const bodyFactionSelect = document.getElementById('bodyFactionSelect');

    factionSelect.innerHTML = '';
    bodyFactionSelect.innerHTML = '';

    const emptyOptBody = document.createElement('option');
    emptyOptBody.value = '';
    emptyOptBody.textContent = 'None';
    bodyFactionSelect.appendChild(emptyOptBody);

    factionList.innerHTML = '';

    galaxy.factions.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.textContent = f.name;
        factionSelect.appendChild(opt);

        const opt2 = document.createElement('option');
        opt2.value = f.name;
        opt2.textContent = f.name;
        bodyFactionSelect.appendChild(opt2);

        const row = document.createElement('div');
        row.className = 'faction-row';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = f.name;
        row.appendChild(nameSpan);

        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = f.color;
        colorInput.addEventListener('input', () => {
            f.color = colorInput.value;
            renderGalaxy();
        });
        row.appendChild(colorInput);

        factionList.appendChild(row);
    });

    refreshSelectors();
}

refreshFactionUI();
