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
const pinNoteBtn = document.getElementById("pinNoteBtn");
const deleteNoteBtn = document.getElementById("deleteNoteBtn");
document.getElementById("viewAll").onclick = () => { currentFilter = 'all'; updateActiveNav("viewAll"); renderNotes(); };
document.getElementById("viewPinned").onclick = () => { currentFilter = 'pinned'; updateActiveNav("viewPinned"); renderNotes(); };

function updateActiveNav(id) {
    document.querySelectorAll(".nav-links li").forEach(li => li.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

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
        if (currentFilter === 'pinned') return n.isPinned;
        return true;
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
    
    deleteNoteBtn.style.display = note ? "block" : "none";
    pinNoteBtn.style.display = note ? "block" : "none";
    pinNoteBtn.style.color = (note && note.isPinned) ? "var(--accent-purple)" : "white";
    
    noteModal.classList.add("active");
}
document.getElementById("saveNoteBtn").onclick = async () => {
    const title = document.getElementById("modalTitle").value;
    const content = document.getElementById("modalContent").value;
    if(!content) return alert("Kuch toh likho!");

    const method = currentNoteId ? "PUT" : "POST";
    const url = currentNoteId ? `${API_URL}/${currentNoteId}` : API_URL;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title, content })
    });
    noteModal.classList.remove("active");
    fetchNotes();
};
deleteNoteBtn.onclick = async () => {
    if (!currentNoteId) return;
    if (!confirm("Bhai, pakka delete karna hai? Wapas nahi aayega!")) return;

    await fetch(`${API_URL}/${currentNoteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    noteModal.classList.remove("active");
    fetchNotes();
};
pinNoteBtn.onclick = async () => {
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