let token = null;

function signup() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/signup', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password})})
    .then(r=>r.json()).then(d=>alert(d.error||'Signed up!'));}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password})})
    .then(r=>r.json()).then(d=>{ if(d.token){ token=d.token; document.getElementById('create').style.display='block'; loadPosts(); } else alert(d.error); });
}

function createPost() {
  const content = document.getElementById('content').value;
  fetch('/posts', {method:'POST', headers:{'Content-Type':'application/json', 'Authorization': token}, body: JSON.stringify({content})})
    .then(r=>r.json()).then(d=>{ if(!d.error){ document.getElementById('content').value=''; loadPosts(); } else alert(d.error); });
}

function loadPosts() {
  fetch('/posts').then(r=>r.json()).then(showPosts);
}

function showPosts(list) {
  const div = document.getElementById('posts');
  div.innerHTML = '';
  list.slice().reverse().forEach(p=>{
    const el = document.createElement('div');
    el.className='post';
    el.textContent = `${p.username}: ${p.content}`;
    div.appendChild(el);
  });
}
