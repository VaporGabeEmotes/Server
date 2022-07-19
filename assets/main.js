//html element constants
const body = document.body;

const userIcon = document.querySelector('[data-selector="user-icon"]');

//user data
const userId = userIcon.dataset.userid;
const userName = userIcon.dataset.username;

//event listeners
document.addEventListener('click', () => {
    $('.menu-opened').slideToggle(400, () => {document.querySelector('.menu-opened').remove()});
});

userIcon.addEventListener('click', createUserDropdown);

//dynamic content functions
function createUserDropdown() {
    try {document.querySelector('.user-menu').remove();} catch{}
    let userMenuDiv = document.createElement('div');
    userMenuDiv.className='user-menu';
    userMenuDiv.innerHTML=`<div class="user-menu-container"><a href="/profile/${userId}" class="user-menu-profile-link">Profile</a> <a href="/u/${userName}" class="user-menu-emotes-link">My Emotes</a><div></div></div>`;

    body.appendChild(userMenuDiv);
    $('.user-menu').slideDown();
    setTimeout(() => {userMenuDiv.className='user-menu menu-opened'}, 400);
}