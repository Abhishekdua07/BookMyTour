// import { axios } from 'axios';
// import { showAlert } from './alert';
// import '@babel/polyfill';

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            // showAlert('success', 'Logged in successfully!');
            alert('Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);                           //refresh page after login to go to homepage after 1.5 sec
        }
    }
    catch (err) {
        // showAlert('error', err.response.data.message);
        alert(err.response.data.message);
    }
};

// const logout = async () => {
//     try {
//         const res = await ({
//             method: 'GET',
//             url: 'http://127.0.0.1:3000/api/v1/users/logout'
//         });
//         if ((res.data.status === 'success')) {
//             location.reload(true);
//         }
//     } catch (err) {
//         console.log(err);
//         alert('Error logging out! Try again.')
//     }
// };

const loginForm = document.querySelector('.form');
// const logOutBtn = document.querySelector('.nav__el--logout');

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    })
}

// if (logOutBtn) {
//     logOutBtn.addEventListener('click', logout);
// }

// document.querySelector('.form').addEventListener('submit', e => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     login(email, password);
// })

// document.querySelector('.nav__el--logout').addEventListener('click', logout());
