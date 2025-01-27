document.addEventListener('DOMContentLoaded', () => {
    fetch('/files')
        .then(response => response.text())
        .then(data => {
            document.getElementById('file-list').innerHTML = data;
        })
        .catch(error => console.error('Error fetching files:', error));
});
