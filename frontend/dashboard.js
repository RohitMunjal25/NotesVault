const API_URL = "https://notesvault-ho8t.onrender.com/api/notes";
const token = localStorage.getItem("token");
let allNotes = [];
let currentFilter = 'all'; 
document.getElementById("viewAll").onclick = () => { currentFilter = 'all'; updateActiveNav("viewAll"); renderNotes(); };
document.getElementById("viewPinned").onclick = () => { currentFilter = 'pinned'; updateActiveNav("viewPinned"); renderNotes(); };
document.getElementById("viewTrash").onclick = () => { currentFilter = 'trash'; updateActiveNav("viewTrash"); renderNotes(); };

function updateActiveNav(id) {
    document.querySelectorAll(".nav-links li").forEach(li => li.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function renderNotes() {
    const grid = document.getElementById("notesGrid");
    grid.innerHTML = "";

    let filtered = allNotes.filter(n => {
        if (currentFilter === 'trash') return n.isDeleted;
        if (currentFilter === 'pinned') return n.isPinned && !n.isDeleted;
        return !n.isDeleted;
    });

    filtered.forEach(note => {
        const card = document.createElement("div");
        card.classList.add("note-card");
        if (note.isPinned) card.classList.add("pinned-card");
        
        card.innerHTML = `
            ${note.isPinned ? '<span class="pin-tag">📌 Pinned</span>' : ''}
            <h3>${note.title || "Untitled"}</h3>
            <p>${note.content}</p>
        `;
        card.onclick = () => openModal(note);
        grid.appendChild(card);
    });
}
document.getElementById("deleteNoteBtn").onclick = async () => {
    if (!currentNoteId) return;
    
    const res = await fetch(`${API_URL}/${currentNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ isDeleted: true, deletedAt: new Date() })
    });

    if (res.ok) {
        document.getElementById("noteModal").classList.remove("active");
        fetchNotes();
    }
};
document.getElementById("pinNoteBtn").onclick = async () => {
    const note = allNotes.find(n => n._id === currentNoteId);
    const res = await fetch(`${API_URL}/${currentNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ isPinned: !note.isPinned })
    });
    if (res.ok) {
        document.getElementById("noteModal").classList.remove("active");
        fetchNotes();
    }
};