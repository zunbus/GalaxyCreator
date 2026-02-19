document.getElementById('saveJsonBtn').addEventListener('click', () => {
    const dataStr = JSON.stringify(galaxy, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'galaxy.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
});

document.getElementById('loadJsonInp').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            const obj = JSON.parse(ev.target.result);
            if (!obj || !Array.isArray(obj.celestialBodies)) {
                alert('Invalid file format.');
                return;
            }
            if (!Array.isArray(obj.factions)) {
                obj.factions = galaxy.factions;
            }
            galaxy = obj;
            refreshFactionUI();
            renderStructure();
            renderGalaxy();
            refreshSelectors();
        } catch (err) {
            alert('Error has occurred.');
            console.error(err);
        }
    };
    reader.readAsText(file);
});
