// ...existing code...

// Referências para os novos elementos
const btnValidarCodigo = document.getElementById('btn-validar-codigo');
const validationMessage = document.getElementById('validation-message');

// Modificar a função existente que gera o código de barras para habilitar o botão de validação
function gerarCodigoDeBarras() {
    // ...existing code...
    
    // Após gerar o código de barras com sucesso, habilitar o botão de validação
    btnValidarCodigo.disabled = false;
    
    // Limpar mensagem e classes de validação anterior
    clearValidationState();
    
    // ...existing code...
}

// Limpar estado de validação
function clearValidationState() {
    const barcodeResult = document.getElementById('barcode-result');
    barcodeResult.classList.remove('barcode-valid', 'barcode-invalid');
    validationMessage.textContent = '';
    validationMessage.classList.remove('validation-valid', 'validation-invalid');
}

// Adicionar evento de clique ao botão de validação
btnValidarCodigo.addEventListener('click', validarCodigoDeBarras);

// Função para validar o código de barras


// Função para atualizar a UI com o resultado da validação
function updateValidationUI(result) {
    const barcodeResult = document.getElementById('barcode-result');
    
    // Limpar classes anteriores
    barcodeResult.classList.remove('barcode-valid', 'barcode-invalid');
    validationMessage.classList.remove('validation-valid', 'validation-invalid');
    
    if (result === true) {
        barcodeResult.classList.add('barcode-valid');
        validationMessage.textContent = 'Código de barras válido!';
        validationMessage.classList.add('validation-valid');
    } else {
        barcodeResult.classList.add('barcode-invalid');
        validationMessage.textContent = 'Código de barras inválido!';
        validationMessage.classList.add('validation-invalid');
    }
}

// ...existing code...