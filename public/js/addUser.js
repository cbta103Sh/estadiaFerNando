 function togglePasswordVisibility() { 
     const passwordInput = document.getElementById('pass');
     const passwordButton = document.querySelector('.input-group-append');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                
     if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordButton.textContent = 'Ocultar';
    } else {
        passwordInput.type = 'password';
        passwordButton.textContent = 'Ver';
    }
}
