const submitBtn = document.getElementById("submit-btn");

submitBtn.addEventListener("click", async function(event) {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const fileInput = document.getElementById("files");
    const files = fileInput.files;
    const date = document.getElementById("date").value;

    if (!name || name.length < 3) {
        alert("Название должно быть минимум 3 символа");
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('date', date);

    for (let i = 0; i < files.length; i++) {
        formData.append('files_upload', files[i]);
    }

    console.log(formData);

    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch("/api/note/", {
            method: "POST",
            body: formData,
            headers: {
                'X-CSRFToken': csrftoken,
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Успех:', data);
            document.getElementById("name").value = '';
            document.getElementById("description").value = '';
            document.getElementById("files").value = '';
        } else {
            console.error('Ошибка:', data);
            alert('Ошибка: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error('Ошибка сети:', error);
        alert('Ошибка соединения');
    }
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}