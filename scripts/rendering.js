function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    renderGalaxy();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function updateZoomInfo() {
    zoomInfo.textContent = `Zoom: ${(scale / 40).toFixed(2)}x, offset: (${offsetX.toFixed(1)}, ${offsetY.toFixed(1)})`;
}

function worldToScreen(wx, wy) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return {
        x: cx + (wx - offsetX) * scale,
        y: cy + (wy - offsetY) * scale
    };
}

function screenToWorld(sx, sy) {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    return {
        x: (sx - cx) / scale + offsetX,
        y: (sy - cy) / scale + offsetY
    };
}

function tempToColor(temp) {
    const t = Math.max(1000, Math.min(50000, temp || 5800));
    if (t < 3500) return '#ffb07c';
    if (t < 5500) return '#ffd29c';
    if (t < 7000) return '#fff4e5';
    if (t < 10000) return '#cfdfff';
    return '#9bb0ff';
}

function getFactionColor(factionName) {
    const f = galaxy.factions.find(f => f.name === factionName);
    return f ? f.color : '#44aa88';
}

function drawGrid() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const step = baseGridStep;

    const left = screenToWorld(0, 0).x;
    const right = screenToWorld(canvas.width, 0).x;
    const top = screenToWorld(0, 0).y;
    const bottom = screenToWorld(0, canvas.height).y;

    const startX = Math.floor(left / step) * step;
    const endX = Math.ceil(right / step) * step;
    const startY = Math.floor(top / step) * step; 
    const endY = Math.ceil(bottom / step) * step;

    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;

    for (let x = startX; x <= endX; x += step) {
        const sx = worldToScreen(x, 0).x;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, canvas.height);
        ctx.stroke();
    }

    for (let y = startY; y <= endY; y += step) {
        const sy = worldToScreen(0, y).y;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(canvas.width, sy);
        ctx.stroke();
    }

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1.5;
    const sx0 = worldToScreen(0, 0).x;
    ctx.beginPath();
    ctx.moveTo(sx0, 0);
    ctx.lineTo(sx0, canvas.height);
    ctx.stroke();
    const sy0 = worldToScreen(0, 0).y;
    ctx.beginPath();
    ctx.moveTo(0, sy0);
    ctx.lineTo(canvas.width, sy0);
    ctx.stroke();

    ctx.fillStyle = '#555';
    ctx.font = '10px Arial';
    for (let x = startX; x <= endX; x += 2 * step) {
        const pos = worldToScreen(x, 0);
        ctx.fillText(x.toString(), pos.x + 2, sy0 - 2);
    }
    for (let y = startY; y <= endY; y += 2 * step) {
        const pos = worldToScreen(0, y);
        ctx.fillText(y.toString()*-1, sx0 + 2, pos.y - 2);
    }

    ctx.restore();
}

function drawAllegianceLinks() {
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;

    const groups = {};
    for (const star of galaxy.stars) {
        const faction = (star.faction || '').trim();
        if (!faction) continue;
        if (!groups[faction]) groups[faction] = [];
        groups[faction].push(star);
    }

    for (const faction in groups) {
        const stars = groups[faction];
        if (stars.length < 2) continue;

        ctx.strokeStyle = getFactionColor(faction);

        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const a = stars[i];
                const b = stars[j];
                const sa = worldToScreen(a.x, a.y);
                const sb = worldToScreen(b.x, b.y);

                ctx.beginPath();
                ctx.moveTo(sa.x, sa.y);
                ctx.lineTo(sb.x, sb.y);
                ctx.stroke();
            }
        }
    }

    ctx.restore();
}

function renderGalaxy(highlightStarId = null) {
    drawGrid();
    drawAllegianceLinks();

    for (const star of galaxy.stars) {
        const pos = worldToScreen(star.x, star.y);
        const radiusPx = star.radius * scale * (highlightStarId === star.id ? 1.5 : 1);

        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = star.color;
        ctx.arc(pos.x, pos.y, radiusPx, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ddd';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(star.name || 'Unnamed', pos.x, pos.y - radiusPx - 4);
    }

    updateZoomInfo();
}

renderGalaxy();