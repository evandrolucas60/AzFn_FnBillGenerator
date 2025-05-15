document.addEventListener("DOMContentLoaded", function() {
    // Define a data padrão para o campo de data (hoje)
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    document.getElementById('dataVencimento').value = dataFormatada;
});

async function gerarCodigoBarras() {
    // Obter os valores dos campos
    const dueDate = document.getElementById('dataVencimento').value;
    const value = document.getElementById('valor').value;
    
    // Validar os campos
    if (!dueDate || !valor) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Mostrar o loader e desabilitar o botão
    document.getElementById('loader').style.display = 'block';
    document.getElementById('resultContent').style.display = 'none';
    document.getElementById('gerarButton').disabled = true;
    
    try {
        // Chamar a API
        const response = await fetch('http://localhost:7147/api/barcode-generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dueDate: dueDate,
                value: parseFloat(value)
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Exibir o código de barras
        document.getElementById('barcodeImage').src = `data:image/png;base64,${data.imagemBase64}`;
        document.getElementById('barcodeText').textContent = data.barcode;
        
        // Mostrar o resultado
        document.getElementById('resultContent').style.display = 'block';
    } catch (error) {
        console.error('Erro ao gerar o código de barras:', error);
        alert('Erro ao gerar o código de barras. Verifique o console para mais detalhes.');
    } finally {
        // Ocultar o loader e habilitar o botão
        document.getElementById('loader').style.display = 'none';
        document.getElementById('gerarButton').disabled = false;
    }
}

// Função para validar o código de barras
async function validarCodigo() {
    const barcode = document.getElementById('barcodeText').innerText;
    
    if (!barcode) {
        alert('Nenhum código de barras para validar.');
        return;
    }
    // Chamar a API de validação
    const response = await fetch('http://localhost:7229/api/barcode-validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ barcode })
    });
    
    const result = await response.json();
    
    // Atualizar a UI com base no resultado da validação
    updateValidationUI(result);
    
}
function updateValidationUI(result){
    const barcodeResult = document.getElementById('barcodeText');
    
    // Limpar classes anteriores
    barcodeResult.classList.remove('barcode-valid', 'barcode-invalid');
    
    if (result.valido === true) {
        barcodeResult.classList.add('barcode-valid');
        
    } else {
        barcodeResult.classList.add('barcode-invalid');
    }
}