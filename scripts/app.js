// Obtém o ID da receita a partir da URL
function obterIdDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// Carrega as receitas a partir do arquivo JSON
async function carregarReceitas() {
  try {
    const resposta = await fetch('db.json');
    if (!resposta.ok) throw new Error('Erro ao carregar receitas');
    const dados = await resposta.json();
    return dados.receitas;
  } catch (error) {
    console.error('Erro ao carregar receitas:', error);
    return [];
  }
}

// Cria os cards dinamicamente na home
async function criarCards(filtro = "") {
  const container = document.getElementById("area-cards");
  
  if (!container) return;
  
  container.innerHTML = ""; // Limpa os cards anteriores

  try {
    const receitas = await carregarReceitas();
    const receitasFiltradas = receitas.filter(item =>
      item.titulo.toLowerCase().includes(filtro.toLowerCase())
    );

    if (receitasFiltradas.length === 0) {
      container.innerHTML = '<div class="col-12 text-center py-4"><p>Nenhuma receita encontrada</p></div>';
      return;
    }

    receitasFiltradas.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4 mb-4";

      const card = document.createElement("div");
      card.className = "card h-100";

      card.innerHTML = `
        <img src="${item.imagem}" alt="${item.titulo}" class="card-img-top" />
        <div class="card-body d-flex flex-column">
          <h3 class="card-title">${item.titulo}</h3>
          <p class="card-text">${item.descricao}</p>
          <a href="detalhes.html?id=${item.id}" class="btn btn-outline-warning mt-auto">Ver Receita</a>
        </div>
      `;

      col.appendChild(card);
      container.appendChild(col);
    });
  } catch (error) {
    console.error('Erro ao criar cards:', error);
    container.innerHTML = '<div class="col-12 text-center py-4"><p>Erro ao carregar receitas</p></div>';
  }
}

// Mostra os detalhes da receita na página de detalhes
async function mostrarDetalhesReceita() {
  const id = obterIdDaUrl();
  const container = document.getElementById("detalhes-receita");
  
  if (!container) return;
  
  container.innerHTML = "<p>Carregando receita...</p>";

  try {
    const receitas = await carregarReceitas();
    const receita = receitas.find(item => item.id === id);

    if (receita) {
      container.innerHTML = `
        <img src="${receita.imagem}" alt="${receita.titulo}" class="receita-img" />
        <h1>${receita.titulo}</h1>
        <p class="meta">Por ${receita.autor} • ${receita.data}</p>
        <p class="conteudo">${receita.conteudo}</p>
        ${receita.dica ? `<div class="dica"><strong>Dica:</strong> ${receita.dica}</div>` : ''}
      `;
    } else {
      container.innerHTML = "<p>Receita não encontrada.</p>";
    }
  } catch (error) {
    console.error('Erro ao mostrar detalhes:', error);
    container.innerHTML = "<p>Erro ao carregar a receita.</p>";
  }
}

// Cria o carrossel de destaques com receitas
async function criarCarrossel() {
  const container = document.getElementById("carousel-inner");
  
  if (!container) return;

  try {
    const receitas = await carregarReceitas();
    const destaques = receitas.slice(0, 5);

    if (destaques.length === 0) {
      container.innerHTML = '<div class="carousel-item active"><div class="d-block w-100 bg-light" style="height: 400px;"></div></div>';
      return;
    }

    destaques.forEach((item, index) => {
      const activeClass = index === 0 ? "active" : "";
      const slide = document.createElement("div");
      slide.className = `carousel-item ${activeClass}`;
      slide.innerHTML = `
        <img src="${item.imagem}" class="d-block w-100 rounded" style="height: 400px; object-fit: cover;" alt="${item.titulo}">
        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
          <h5>${item.titulo}</h5>
          <p>${item.descricao}</p>
          <a href="detalhes.html?id=${item.id}" class="btn btn-outline-light">Ver Receita</a>
        </div>
      `;
      container.appendChild(slide);
    });

    // Inicializa o carrossel manualmente se necessário
    const carousel = new bootstrap.Carousel(document.getElementById('carouselReceitas'));
  } catch (error) {
    console.error('Erro ao criar carrossel:', error);
    container.innerHTML = '<div class="carousel-item active"><div class="d-block w-100 bg-light" style="height: 400px;"></div></div>';
  }
}

// Configura a busca
function configurarBusca() {
  const input = document.getElementById("campo-busca");
  if (input) {
    input.addEventListener("input", () => {
      criarCards(input.value);
    });
  }
}

// Inicializa as funções corretas com base na página
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById("area-cards")) {
    criarCards();
    criarCarrossel();
    configurarBusca();
  } 
  else if (document.getElementById("detalhes-receita")) {
    mostrarDetalhesReceita();
  }
  
  // Debug - verifica se as receitas estão sendo carregadas
  carregarReceitas().then(receitas => {
    console.log('Receitas carregadas:', receitas);
  });
});