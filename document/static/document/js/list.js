let currentPage = 1;
const page_size = 5;

async function loadNotes(page = 1) {
    const container = document.getElementById('notes-container');

    try {
        const response = await fetch(`/api/note/?page=${page}`);
        if (!response.ok) throw new Error('Ошибка сети');

        const data = await response.json();

        container.innerHTML = '';

        const notes = data.results;

        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'form-card';

            const filesHTML = note.files && note.files.length > 0
                ? `<ul>${note.files.map(f => `<li><a href="${f.url}" target="_blank">${f.name}</a></li>`).join('')}</ul>`
                : '<p class="empty">Нет файлов</p>';

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

                <div class="card-footer">
                    <button
                        class="like-btn ${note.isliked ? 'liked' : ''}"
                        data-liked="${note.isliked}"
                        onclick="handleLikeClick(this, ${note.id})"
                    >
                        <span class="like-icon">${note.isliked ? '♥' : '♡'}</span>
                        <span class="like-count">${note.likes_count}</span>
                    </button>

                    <div class="views-block">
                        👁 ${note.views_count}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        renderPagination(data.next, data.previous);
        const pageId = document.getElementById("page-id");

        pageId.innerText = `${page}/${Math.ceil(data.count / page_size)}`;

    } catch (error) {
        container.innerHTML = '<p>Ошибка при загрузке заметок</p>';
        console.error(error);
    }
}

function renderPagination(nextUrl, prevUrl) {
    const controls = document.getElementById('pagination-controls');
    if (!controls) return;

    controls.innerHTML = '';

    if (prevUrl) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Назад';
        prevBtn.onclick = () => {
            currentPage--;
            loadNotes(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        controls.appendChild(prevBtn);
    }

    if (nextUrl) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Вперед →';
        nextBtn.onclick = () => {
            currentPage++;
            loadNotes(currentPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        controls.appendChild(nextBtn);
    }
}

function updateLikeUI(btn, isLiked) {
    const icon = btn.querySelector(".like-icon");
    const countEl = btn.querySelector(".like-count");

    let count = parseInt(countEl.textContent) || 0;

    btn.dataset.liked = isLiked;
    icon.textContent = isLiked ? "♥" : "♡";
    countEl.textContent = Math.max(0, isLiked ? count + 1 : count - 1);

    btn.classList.toggle("liked", isLiked);
}

async function handleLikeClick(btn, id) {
    const currentlyLiked = btn.dataset.liked === "true";

    updateLikeUI(btn, !currentlyLiked);

    try {
        const response = await fetch(`/api/note/${id}/like/`);
        if (!response.ok) throw new Error();
    } catch (error) {
        updateLikeUI(btn, currentlyLiked);
        console.error("Ошибка при лайке:", error);
    }
}

window.onload = () => loadNotes(currentPage);