async function loadNotes() {
    const container = document.getElementById('notes-container');
    container.innerHTML = '';

    try {
        const response = await fetch('/api/note/');
        const notes = await response.json();

        notes.forEach(note => {
            console.log(note);

            const card = document.createElement('div');
            card.className = 'form-card';

            let filesHTML = '';
            if (note.files && note.files.length > 0) {
                filesHTML = '<ul>';
                note.files.forEach(f => {
                    filesHTML += `<li><a href="${f.url}" target="_blank">${f.name}</a></li>`;
                });
                filesHTML += '</ul>';
            }

            card.innerHTML = `
                <div class="content">
                    <div class="form-title">${note.name}</div>

                    <div class="form-group">
                        <label>Пользователь:</label>
                        <p>${note.user || '-'}</p>
                    </div>

                    <div class="form-group">
                        <label>Описание:</label>
                        <p>${note.description || '-'}</p>
                    </div>

                    <div class="form-group">
                        <label>Категория:</label>
                        <p>${note.category_name || '-'}</p>
                    </div>

                    <div class="form-group">
                        <label>Файлы:</label>
                        <div class="files-block">
                            ${filesHTML || '<p>Нет файлов</p>'}
                        </div>
                    </div>
                </div>

                <button
                    class="like-btn"
                    id="like-btn-${note.id}"
                    data-liked="${note.isliked}"
                    onclick="handleLikeClick(this, ${note.id})"
                >
                    <span class="like-icon">❤</span>
                    <span class="like-count">${note.likes_count}</span>
                </button>
            `;

            container.appendChild(card);

            const btn = document.getElementById(`like-btn-${note.id}`);
            applyInitialLikeStyle(btn);
        });

    } catch (error) {
        container.innerHTML = '<p>Ошибка при загрузке заметок</p>';
        console.error(error);
    }
}


function applyInitialLikeStyle(btn) {
    const isLiked = btn.dataset.liked === "true";

    const icon = btn.querySelector(".like-icon");

    if (isLiked) {
        btn.classList.add("liked");
        icon.textContent = "♥";
    } else {
        btn.classList.remove("liked");
        icon.textContent = "♡";
    }
}


function updateLikeBtn(btn, id) {
    let isLiked = btn.dataset.liked === "true";

    isLiked = !isLiked;
    btn.dataset.liked = isLiked;

    const icon = btn.querySelector(".like-icon");

    if (isLiked) {
        btn.classList.add("liked");
        icon.textContent = "♥";
    } else {
        btn.classList.remove("liked");
        icon.textContent = "♡";
    }

    const countEl = btn.querySelector(".like-count");
    let count = parseInt(countEl.textContent);

    countEl.textContent = isLiked ? count + 1 : count - 1;
}


async function handleLikeClick(btn, id) {
    updateLikeBtn(btn, id);

    try {
        await fetch(`/api/note/${id}/like/`);
    } catch (error) {
        console.error("Like request failed:", error);

        updateLikeBtn(btn, id);
    }
}

window.onload = loadNotes;