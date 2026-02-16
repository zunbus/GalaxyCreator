
function collapse(btn) {
    const section = btn.closest('.sidebar-section');
    section.classList.toggle('collapsed');
    btn.textContent = section.classList.contains('collapsed') ? '➕' : '➖';
}

document.querySelectorAll('.sidebar-section .toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        collapse(btn);
    });
    collapse(btn);
});


const sidebar = document.getElementById('sidebar');
let draggedSection = null;

sidebar.addEventListener('dragstart', (e) => {
    const section = e.target.closest('.sidebar-section');
    if (!section) return;
    draggedSection = section;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', section.dataset.sectionId || '');
});

sidebar.addEventListener('dragover', (e) => {
    e.preventDefault();
    const section = e.target.closest('.sidebar-section');
    if (!section || section === draggedSection) return;

    const rect = section.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const halfway = rect.height / 2;

    if (offset > halfway) {
        section.classList.add('drag-over');
        section.style.borderTop = '';
        section.style.borderBottom = '2px solid #2d7dd2';
    } else {
        section.classList.add('drag-over');
        section.style.borderBottom = '';
        section.style.borderTop = '2px solid #2d7dd2';
    }
});

sidebar.addEventListener('dragleave', (e) => {
    const section = e.target.closest('.sidebar-section');
    if (!section) return;
    section.classList.remove('drag-over');
    section.style.borderTop = '';
    section.style.borderBottom = '';
});

sidebar.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = e.target.closest('.sidebar-section');
    if (!draggedSection || !target || draggedSection === target) return;

    const rect = target.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    const halfway = rect.height / 2;

    target.classList.remove('drag-over');
    target.style.borderTop = '';
    target.style.borderBottom = '';

    if (offset > halfway) {
        sidebar.insertBefore(draggedSection, target.nextSibling);
    } else {
        sidebar.insertBefore(draggedSection, target);
    }
    draggedSection = null;
});

sidebar.addEventListener('dragend', () => {
    document.querySelectorAll('.sidebar-section').forEach(sec => {
        sec.classList.remove('drag-over');
        sec.style.borderTop = '';
        sec.style.borderBottom = '';
    });
    draggedSection = null;
});


const structureWrapper = document.getElementById('structureWrapper');
const structureResizer = document.getElementById('structureResizer');
let isResizingStructure = false;
let startYStructure = 0;
let startHeightStructure = 0;

structureResizer.addEventListener('mousedown', (e) => {
    isResizingStructure = true;
    startYStructure = e.clientY;
    startHeightStructure = structureWrapper.getBoundingClientRect().height;
    document.body.style.cursor = 'ns-resize';
});

window.addEventListener('mousemove', (e) => {
    if (!isResizingStructure) return;
    const dy = e.clientY - startYStructure;
    let newHeight = startHeightStructure + dy;
    newHeight = Math.max(80, Math.min(400, newHeight));
    structureWrapper.style.height = newHeight + 'px';
});

window.addEventListener('mouseup', () => {
    if (isResizingStructure) {
        isResizingStructure = false;
        document.body.style.cursor = '';
    }
});





