let encryptedImageData = '';
const messageElement = document.getElementById('errorMessage');

let currentZoom = 1;
// Função para ler o arquivo txt
async function loadEncryptedData() {
try {
//const response = await fetch('imagem.txt');
const response = await fetch('https://raw.githubusercontent.com/VictorFRamos/loveflix-maiara-e-victor/refs/heads/main/imagem.txt');
if (!response.ok) {
    throw new Error('Erro ao carregar o arquivo');
}
encryptedImageData = await response.text();
//messageElement.textContent = 'Arquivo carregado com sucesso!';
// messageElement.className = 'success';
} catch (error) {
messageElement.textContent = 'Erro ao carregar o arquivo: ' + error.message;
messageElement.className = 'error';
}
}

// Carrega o arquivo assim que a página é aberta
window.onload = loadEncryptedData;

// Permite usar a tecla Enter para submeter o código
document.getElementById('codeInput').addEventListener('keypress', function(e) {
if (e.key === 'Enter') {
decryptAndShowImage();
}
});

function decryptAndShowImage() {
const code = document.getElementById('codeInput').value;
const messageElement = document.getElementById('errorMessage');
const imageContainer = document.getElementById('imageContainer');

if (!encryptedImageData) {
messageElement.textContent = 'Arquivo de imagem não encontrado';
messageElement.className = 'error';
return;
}

if (code.trim() === '') {
messageElement.textContent = 'Por favor, digite um código';
messageElement.className = 'error';
return;
}

try {
// Tenta descriptografar a imagem usando o código fornecido
const decryptedData = CryptoJS.AES.decrypt(encryptedImageData, code).toString(CryptoJS.enc.Utf8);

if (decryptedData) {
    // Verifica se o resultado é uma string base64 válida
    if (decryptedData.startsWith('data:image')) {
        // Se a descriptografia for bem-sucedida, exibe a imagem
        imageContainer.innerHTML = `
                <img src="${decryptedData}" alt="Imagem descriptografada" onclick="openZoom(this.src)">
                <div class="zoom-controls" style="display: block;">
                    <span class="btn btn-dark" onclick="openZoom('${decryptedData}')">
                       <i class="fa-solid fa-magnifying-glass-plus"></i>
                    </span>
                </div>
            `;
        //messageElement.className = 'success';
        //messageElement.textContent = 'Imagem descriptografada com sucesso!';
    } else {
        throw new Error('Código incorreto');
    }
} else {
    throw new Error('Código incorreto');
}
} catch (error) {
messageElement.className = 'error';
messageElement.textContent = 'Código incorreto ou arquivo inválido';
imageContainer.innerHTML = '';
}
}

function openZoom(imageSrc) {
    const modal = document.getElementById('zoomModal');
    const zoomImage = document.getElementById('zoomImage');
    zoomImage.src = imageSrc;
    modal.style.display = 'block';
    currentZoom = 1;
    updateZoomIndicator();
    
    // Resetar o tamanho da imagem
    zoomImage.style.transform = `scale(${currentZoom})`;
}

function closeZoom() {
    const modal = document.getElementById('zoomModal');
    modal.style.display = 'none';
}

function adjustZoom(factor) {
    currentZoom *= factor;
    // Limitar o zoom entre 0.5 e 3
    currentZoom = Math.max(0.5, Math.min(3, currentZoom));
    
    const zoomImage = document.getElementById('zoomImage');
    zoomImage.style.transform = `scale(${currentZoom})`;
    updateZoomIndicator();
}

function updateZoomIndicator() {
    const indicator = document.querySelector('.zoom-indicator');
    indicator.textContent = `Zoom: ${Math.round(currentZoom * 100)}%`;
}

// Fechar o modal ao clicar fora da imagem
window.onclick = function(event) {
    const modal = document.getElementById('zoomModal');
    if (event.target == modal) {
        closeZoom();
    }
}