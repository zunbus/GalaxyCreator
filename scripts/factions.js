function refreshFactionUI() {
    const factionSelect = document.getElementById('factionSelect');
    const factionList = document.getElementById('factionList');
    const starFactionSelect = document.getElementById('starFactionSelect');

    factionSelect.innerHTML = '';
    starFactionSelect.innerHTML = '';

    const emptyOptStar = document.createElement('option');
    emptyOptStar.value = '';
    emptyOptStar.textContent = 'None';
    starFactionSelect.appendChild(emptyOptStar);

    factionList.innerHTML = '';

    galaxy.factions.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.name;
        opt.textContent = f.name;
        factionSelect.appendChild(opt);

        const opt2 = document.createElement('option');
        opt2.value = f.name;
        opt2.textContent = f.name;
        starFactionSelect.appendChild(opt2);

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