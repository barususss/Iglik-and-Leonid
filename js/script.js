document.addEventListener('DOMContentLoaded', function() {
    function getPosts() {
        return JSON.parse(localStorage.getItem('posts') || '[]');
    }
    function savePosts(posts) {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    const postsContainer = document.getElementById('posts');
    if (postsContainer) {
        const posts = getPosts();
        postsContainer.innerHTML = '';
        posts.forEach(post => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            const card = document.createElement('div');
            card.className = 'card post-card fade-in';
            if (post.image) {
                const img = document.createElement('img');
                img.src = post.image;
                img.className = 'card-img-top';
                img.alt = post.title;
                card.appendChild(img);
            }
            const body = document.createElement('div');
            body.className = 'card-body';
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = post.title;
            const preview = document.createElement('p');
            preview.className = 'card-text';
            preview.textContent = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
            const link = document.createElement('a');
            link.href = `post.html?id=${post.id}`;
            link.className = 'btn btn-primary';
            link.textContent = 'Читать дальше';
            body.appendChild(title);
            body.appendChild(preview);
            body.appendChild(link);
            card.appendChild(body);
            col.appendChild(card);
            postsContainer.appendChild(col);
        });
        return;
    }

    const postContent = document.getElementById('post-content');
    if (postContent) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
        const posts = getPosts();
        const post = posts.find(p => p.id === postId);
        if (post) {
            const wrapper = document.createElement('div');
            wrapper.className = 'fade-in';
            const titleEl = document.createElement('h2');
            titleEl.textContent = post.title;
            wrapper.appendChild(titleEl);
            if (post.image) {
                const img = document.createElement('img');
                img.src = post.image;
                img.className = 'img-fluid mb-3';
                img.alt = post.title;
                wrapper.appendChild(img);
            }
            const contentEl = document.createElement('p');
            contentEl.textContent = post.content;
            wrapper.appendChild(contentEl);

            const editBtn = document.createElement('button');
            editBtn.id = 'edit-btn';
            editBtn.className = 'btn btn-warning me-2';
            editBtn.textContent = 'Редактировать';
            editBtn.addEventListener('click', () => {
                window.location.href = `edit.html?id=${post.id}`;
            });
            const deleteBtn = document.createElement('button');
            deleteBtn.id = 'delete-btn';
            deleteBtn.className = 'btn btn-danger';
            deleteBtn.textContent = 'Удалить';
            deleteBtn.addEventListener('click', () => {
                if (confirm('Вы уверены, что хотите удалить этот пост?')) {
                    wrapper.classList.add('fade-out');
                    wrapper.addEventListener('animationend', () => {
                        const updated = posts.filter(p => p.id !== post.id);
                        savePosts(updated);
                        window.location.href = 'index.html';
                    });
                }
            });
            wrapper.appendChild(editBtn);
            wrapper.appendChild(deleteBtn);

            postContent.appendChild(wrapper);
        } else {
            postContent.innerHTML = '<p>Пост не найден.</p>';
        }
        return;
    }

    const form = document.getElementById('post-form');
    if (form) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get('id');
        const isEdit = Boolean(postId);
        if (isEdit) {
            const posts = getPosts();
            const post = posts.find(p => p.id === postId);
            if (post) {
                document.getElementById('title').value = post.title;
                document.getElementById('content').value = post.content;
                document.getElementById('image').value = post.image || '';
            }
        }
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('title').value.trim();
            const content = document.getElementById('content').value.trim();
            const image = document.getElementById('image').value.trim();
            if (!title || !content) {
                alert('Пожалуйста, заполните все обязательные поля.');
                return;
            }
            const posts = getPosts();
            if (isEdit) {
                const post = posts.find(p => p.id === postId);
                Object.assign(post, { title, content, image });
            } else {
                posts.push({ id: Date.now().toString(), title, content, image });
            }
            savePosts(posts);
            window.location.href = 'index.html';
        });
    }
});