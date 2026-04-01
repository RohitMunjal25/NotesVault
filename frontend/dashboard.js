const API_URL = "https://notesvault-ho8t.onrender.com/api/notes";
const token = localStorage.getItem("token");

// 1. Auth Check (Sabse Pehle)
if (!token) {
    window.location.href = "index.html";
}

let allNotes = [];
let currentNoteId = null;
let currentFilter = 'all';

// 2. Selectors
const notesGrid = document.getElementById("notesGrid");
const searchInput = document.getElementById("searchInput");
const newNoteBtn = document.getElementById("newNoteBtn");
const logoutBtn = document.getElementById("logoutBtn");
const noteModal = document.getElementById("noteModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const deleteNoteBtn = document.getElementById("deleteNoteBtn");
const pinNoteBtn = document.getElementById("pinNoteBtn");

// 3. Logout Logic (FIXED)
logoutBtn.onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
};

// 4. Fetching Logic
async function fetchNotes() {
    try {
        const res = await fetch(API_URL, { 
            headers: { "Authorization": `Bearer ${token}` } 
        });
        if (!res.ok) throw new Error("Token expired");
        allNotes = await res.json();
        renderNotes();
    } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        window.location.href = "index.html";
    }
}

// 5. Sidebar Navigation
document.getElementById("viewAll").onclick = () => { currentFilter = 'all'; updateActiveNav("viewAll"); renderNotes(); };
document.getElementById("viewPinned").onclick = () => { currentFilter = 'pinned'; updateActiveNav("viewPinned"); renderNotes(); };
document.getElementById("viewTrash").onclick = () => { currentFilter = 'trash'; updateActiveNav("viewTrash"); renderNotes(); };

function updateActiveNav(id) {
    document.querySelectorAll(".nav-links li").forEach(li => li.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// 6. Rendering Logic
function renderNotes() {
    notesGrid.innerHTML = "";
    const query = searchInput.value.toLowerCase();

    let filtered = allNotes.filter(n => {
        const matchesSearch = (n.title && n.title.toLowerCase().includes(query)) || (n.content && n.content.toLowerCase().includes(query));
        if (!matchesSearch) return false;

        if (currentFilter === 'trash') return n.isDeleted;
        if (currentFilter === 'pinned') return n.isPinned && !n.isDeleted;
        return !n.isDeleted;
    });

    if (filtered.length === 0) {
        notesGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-dim); margin-top: 2rem;">No notes found.</p>`;
        return;
    }

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
        notesGrid.appendChild(card);
    });
}

// 7. Modal Function (FIXED for Create/Edit)
function openModal(note = null) {
    if (note) {
        currentNoteId = note._id;
        modalTitle.value = note.title || "";
        modalContent.value = note.content || "";
        
        deleteNoteBtn.style.display = "block";
        if (note.isDeleted) {
            deleteNoteBtn.innerHTML = "♻️ Restore";
            saveNoteBtn.style.display = "none";
            pinNoteBtn.style.display = "none";
        } else {
            deleteNoteBtn.innerHTML = "🗑️";
            saveNoteBtn.style.display = "block";
            pinNoteBtn.style.display = "block";
            pinNoteBtn.style.color = note.isPinned ? "var(--accent-purple)" : "white";
        }
    } else {
        // Naya Note
        currentNoteId = null;
        modalTitle.value = "";
        modalContent.value = "";
        deleteNoteBtn.style.display = "none";
        saveNoteBtn.style.display = "block";
        pinNoteBtn.style.display = "none";
    }
    noteModal.classList.add("active");
}

// 8. Event Listeners for Buttons
newNoteBtn.onclick = () => openModal(); // Create button fix
closeModalBtn.onclick = () => noteModal.classList.remove("active");

saveNoteBtn.onclick = async () => {
    const title = modalTitle.value.trim();
    const content = modalContent.value.trim();
    if (!content) return alert("Content toh likho bhai!");

    const method = currentNoteId ? "PUT" : "POST";
    const url = currentNoteId ? `${API_URL}/${currentNoteId}` : API_URL;

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ title, content })
    });

    if (res.ok) {
        noteModal.classList.remove("active");
        fetchNotes();
    }
};

deleteNoteBtn.onclick = async () => {
    if (!currentNoteId) return;
    const note = allNotes.find(n => n._id === currentNoteId);
    
    // Toggle Trash logic
    const body = note.isDeleted ? { isDeleted: false, deletedAt: null } : { isDeleted: true, deletedAt: new Date() };

    const res = await fetch(`${API_URL}/${currentNoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        noteModal.classList.remove("active");
        fetchNotes();
    }
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

searchInput.oninput = renderNotes;
fetchNotes();