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
                    ${filesHTML || '<p>Нет файлов</p>'}
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = '<p>Ошибка при загрузке заметок</p>';
        console.error(error);
    }
}

window.onload = loadNotes;