import '@babel/polyfill';
import logout from './login';

// DOM ELEMENTS
// const loginForm = document.querySelector('.form');
const logOutBtn = document.querySelector('.nav__el--logout');
// VALUES
// const email = document.getElementById('email').value;
// const password = document.getElementById('password').value;

// if (loginForm)
//     loginForm.addEventListener('submit', e => {
//         e.preventDefault();
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;
//         login(email, password);
//     });

if (logOutBtn) logOutBtn.addEventListener('click', logout)