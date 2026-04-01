const API_URL = "https://notesvault-ho8t.onrender.com/api/notes";
const token = localStorage.getItem("token");

if (!token) window.location.href = "index.html";

let allNotes = [];
let currentNoteId = null;
let currentFilter = 'all';

const notesGrid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const newNoteBtn = document.getElementById("newNoteBtn");
const logoutBtn = document.getElementById("logoutBtn");
const noteModal = document.getElementById("noteModal");
const menuDropdown = document.getElementById("menuDropdown");
const menuBtn = document.getElementById("menuBtn");

// Navigation
const setFilter = (filter, id) => {
    currentFilter = filter;
    document.querySelectorAll(".nav-links li").forEach(li => li.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    renderNotes();
};
document.getElementById("viewAll").onclick = () => setFilter('all', 'viewAll');
document.getElementById("viewPinned").onclick = () => setFilter('pinned', 'viewPinned');
document.getElementById("viewTrash").onclick = () => setFilter('trash', 'viewTrash');

// Dropdown Toggle
menuBtn.onclick = (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle("active");
};
window.onclick = () => menuDropdown.classList.remove("active");

async function fetchNotes() {
    try {
        const res = await fetch(API_URL, { headers: { "Authorization": `Bearer ${token}` } });
        allNotes = await res.json();
        renderNotes();
    } catch (err) { console.error(err); }
}

function renderNotes() {
    notesGrid.innerHTML = "";
    const query = searchInput.value.toLowerCase();
    
    const filtered = allNotes.filter(n => {
        const matchesSearch = (n.title && n.title.toLowerCase().includes(query)) || n.content.toLowerCase().includes(query);
        if (!matchesSearch) return false;
        if (currentFilter === 'trash') return n.isDeleted;
        if (currentFilter === 'pinned') return n.isPinned && !n.isDeleted;
        return !n.isDeleted;
    });

    filtered.forEach(note => {
        const card = document.createElement("div");
        card.classList.add("note-card");
        if (note.isPinned) card.classList.add("pinned-card");
        card.innerHTML = `${note.isPinned ? '<span class="pin-tag">📌 Pinned</span>' : ''}<h3>${note.title || 'Untitled'}</h3><p>${note.content}</p>`;
        card.onclick = () => openModal(note);
        notesGrid.appendChild(card);
    });
}

function openModal(note = null) {
    currentNoteId = note ? note._id : null;
    document.getElementById("modalTitle").value = note ? note.title || "" : "";
    document.getElementById("modalContent").value = note ? note.content : "";
    
    const deleteBtn = document.getElementById("deleteNoteBtn");
    const pinBtn = document.getElementById("pinNoteBtn");
    const saveBtn = document.getElementById("saveNoteBtn");

    if (note && note.isDeleted) {
        deleteBtn.innerHTML = "♻️ Restore Note";
        pinBtn.style.display = "none";
        saveBtn.style.display = "none";
    } else {
        deleteBtn.innerHTML = "🗑️ Move to Trash";
        deleteBtn.style.display = note ? "block" : "none";
        pinBtn.style.display = note ? "block" : "none";
        pinBtn.innerHTML = (note && note.isPinned) ? "📍 Unpin Note" : "📌 Pin Note";
        saveBtn.style.display = "block";
    }
    noteModal.classList.add("active");
}

document.getElementById("saveNoteBtn").onclick = async () => {
    const url = currentNoteId ? `${API_URL}/${currentNoteId}` : API_URL;
    await fetch(url, {
        method: currentNoteId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title: document.getElementById("modalTitle").value, content: document.getElementById("modalContent").value })
    });
    noteModal.classList.remove("active");
    fetchNotes();
};

document.getElementById("deleteNoteBtn").onclick = async () => {
    const note = allNotes.find(n => n._id === currentNoteId);
    const body = note.isDeleted ? { isDeleted: false, deletedAt: null } : { isDeleted: true, deletedAt: new Date() };
    await fetch(`${API_URL}/${currentNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body)
    });
    noteModal.classList.remove("active");
    fetchNotes();
};

document.getElementById("pinNoteBtn").onclick = async () => {
    const note = allNotes.find(n => n._id === currentNoteId);
    await fetch(`${API_URL}/${currentNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ isPinned: !note.isPinned })
    });
    noteModal.classList.remove("active");
    fetchNotes();
};

document.getElementById("closeModalBtn").onclick = () => noteModal.classList.remove("active");
newNoteBtn.onclick = () => openModal();
searchInput.oninput = renderNotes;
logoutBtn.onclick = () => { localStorage.removeItem("token"); window.location.href = "index.html"; };

fetchNotes();