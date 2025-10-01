// Pega os elementos da DOM que serão manipulados
const startScreen = document.getElementById('start-screen');
const challengesScreen = document.getElementById('challenges-screen');
const blogScreen = document.getElementById('blog-screen');
const startForm = document.getElementById('start-form');
const headerSubtitle = document.getElementById('header-subtitle');
const scoreDisplay = document.getElementById('score-display');
const completeButtons = document.querySelectorAll('.complete-btn');
const resetButton = document.getElementById('reset-btn');
const avancarButton = document.getElementById('avancar-btn');
const homeLink = document.getElementById('home-link');
const blogLink = document.getElementById('blog-link');

// Novos elementos para o modal de mensagens (agora genérico)
const messageModal = document.getElementById('message-modal');
const modalTitle = document.getElementById('modal-title');
const messageText = document.getElementById('message-text');
const closeModalBtn = document.getElementById('close-modal-btn');
const goToStartBtn = document.getElementById('go-to-start-btn');

let score = 0; // Variável para armazenar a pontuação
let completedChallengesCount = 0; // Contador de desafios concluídos
const totalChallenges = completeButtons.length; // Total de desafios
let userName = ''; // Variável para armazenar o nome do usuário

// Adiciona um canvas para as partículas e obtém o contexto 2D
const particlesCanvas = document.createElement('canvas');
particlesCanvas.id = 'particles-canvas';
particlesCanvas.style.position = 'fixed';
particlesCanvas.style.top = '0';
particlesCanvas.style.left = '0';
particlesCanvas.style.pointerEvents = 'none'; // Permite cliques através do canvas
particlesCanvas.style.zIndex = '1000'; // Garante que esteja acima de outros elementos
document.body.appendChild(particlesCanvas);
const ctx = particlesCanvas.getContext('2d');
let particles = [];
const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'];

// Função para ajustar o tamanho do canvas para a tela inteira
function setCanvasSize() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
}

// Chama a função para definir o tamanho inicial
setCanvasSize();

// Atualiza o tamanho do canvas quando a janela for redimensionada
window.addEventListener('resize', setCanvasSize);

// Classe para representar uma partícula individual
class Particle {
    constructor(x, y, size, color, velocity) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1; // Transparência inicial
    }

    // Método para desenhar a partícula no canvas
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Método para atualizar a posição da partícula
    update() {
        this.velocity.y += 0.05; // Adiciona gravidade
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01; // Fade out
        this.size *= 0.99; // Diminui o tamanho
    }
}

// Função para criar partículas em uma posição específica
function createParticles(x, y) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 5 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const velocity = {
            x: Math.cos(angle) * (Math.random() * 5 + 1),
            y: Math.sin(angle) * (Math.random() * 5 + 1)
        };
        particles.push(new Particle(x, y, size, color, velocity));
    }
}

// Loop de animação
function animateParticles() {
    ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        // Remove partículas que saíram da tela ou desapareceram
        if (particles[i].alpha <= 0 || particles[i].size < 1) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animateParticles);
}

// Inicia o loop de animação
animateParticles();

// Função para mostrar a tela correta e esconder as outras
function showScreen(screenId) {
    startScreen.classList.add('hidden');
    challengesScreen.classList.add('hidden');
    blogScreen.classList.add('hidden');
    
    if (screenId === 'start') {
        startScreen.classList.remove('hidden');
        headerSubtitle.textContent = 'Sua Gincana de Bem-Estar';
    } else if (screenId === 'challenges') {
        challengesScreen.classList.remove('hidden');
        headerSubtitle.textContent = `Sua Gincana de Bem-Estar, ${userName}!`;
    } else if (screenId === 'blog') {
        blogScreen.classList.remove('hidden');
        headerSubtitle.textContent = 'Sobre a Gincana';
    }
}

// Função para exibir o modal de mensagem
function showMessage(title, text) {
    modalTitle.textContent = title;
    messageText.textContent = text;
    messageModal.classList.remove('hidden');
}

// Função para resetar a gincana para o estado inicial
function resetGincana() {
    // Reseta a pontuação e o contador
    score = 0;
    completedChallengesCount = 0;
    scoreDisplay.textContent = score;

    // Reabilita todos os botões "Concluir" e restaura suas cores e texto
    completeButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove('bg-gray-400', 'cursor-not-allowed');
        button.classList.add('bg-blue-500', 'hover:bg-blue-600');
        button.textContent = 'Concluir';
    });
    
    // Garante que o modal de mensagens está escondido
    messageModal.classList.add('hidden');

    // Mantém na tela de desafios
    showScreen('challenges');
}

// Adiciona um ouvinte de evento para o formulário de início
startForm.addEventListener('submit', function(event) {
    // Previne o comportamento padrão de recarregar a página
    event.preventDefault();

    // Pega o valor do campo de nome
    userName = document.getElementById('nome').value;

    // Mostra a tela de desafios
    showScreen('challenges');
});

// Adiciona um ouvinte de evento para cada botão "Concluir"
completeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Se o botão já estiver desativado, não faz nada
        if (button.disabled) {
            return;
        }

        // Pega o valor dos pontos do atributo data-points
        const points = parseInt(button.dataset.points);
        
        // Adiciona os pontos à pontuação
        score += points;
        
        // Atualiza o display da pontuação
        scoreDisplay.textContent = score;

        // Desativa o botão e muda sua cor para indicar que foi concluído
        button.disabled = true;
        button.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        button.classList.add('bg-gray-400', 'cursor-not-allowed');
        button.textContent = 'Concluído';
        
        // Incrementa o contador de desafios concluídos
        completedChallengesCount++;

        // AQUI ESTÁ A NOVA LÓGICA: Cria a animação de partículas na posição do botão
        const rect = button.getBoundingClientRect();
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
});

// Adiciona um ouvinte de evento para o novo botão "Avançar"
avancarButton.addEventListener('click', function() {
    if (completedChallengesCount === totalChallenges) {
        // Mensagem de parabéns se todos os desafios foram concluídos
        showMessage(
            "Parabéns!",
            `Você concluiu todos os desafios, ${userName}! Sua pontuação final é ${score}. Continue assim!`
        );
    } else {
        // Mensagem de incentivo se nem todos os desafios foram concluídos
        showMessage(
            "Continue Assim!",
            `Você ainda não concluiu todos os desafios. Complete-os para alcançar a pontuação máxima!`
        );
    }
});

// Adiciona um ouvinte de evento para o botão "Fechar" do modal de mensagens
closeModalBtn.addEventListener('click', function() {
    messageModal.classList.add('hidden');
});

// Adiciona um ouvinte de evento para o novo botão "Voltar ao Início"
goToStartBtn.addEventListener('click', function() {
    // Agora, este botão volta ao início
    resetGincana();
    showScreen('start');
    document.getElementById('nome').value = '';
});

// Adiciona um ouvinte de evento para o botão "Resetar Gincana"
resetButton.addEventListener('click', function() {
    resetGincana();
});

// Adiciona os ouvintes de evento para os links de navegação
homeLink.addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    showScreen('start');
});

blogLink.addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do link
    showScreen('blog');
});
