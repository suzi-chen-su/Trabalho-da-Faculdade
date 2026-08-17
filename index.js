// Seleciona o contêiner do carrinho e o botão de finalizar compra
const carrinhoContainer = document.getElementById("carrinho-container");
const finalizarCompraContainer = document.getElementById("finalizar-compra-container");

// Função para carregar os produtos do Local Storage
function carregarCarrinho() {
    // Recupera os itens do carrinho armazenados no Local Storage
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (carrinho.length === 0) {
        // Se o carrinho estiver vazio, exibe a mensagem
        carrinhoContainer.innerHTML = `
            <p class="carrinho-vazio">Seu carrinho está vazio. <a href="../produtos/produtos.html">Adicione produtos</a>.</p>
        `;
        // Esconde o botão de finalizar compra se o carrinho estiver vazio
        finalizarCompraContainer.style.display = "none";
        return;
    }

    // Monta os produtos no carrinho
    carrinhoContainer.innerHTML = carrinho
        .map((produto, index) => `
            <div class="produto-carrinho">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="produto-info">
                    <h2>${produto.nome}</h2>
                    <p>Preço: R$ ${produto.preco}</p>
                    <p>Quantidade: 
                        <button class="btn-quantidade" data-index="${index}" data-action="decrement">-</button>
                        ${produto.quantidade}
                        <button class="btn-quantidade" data-index="${index}" data-action="increment">+</button>
                    </p>
                </div>
            </div>
        `)
        .join("");

    // Exibe o botão de finalizar compra se o carrinho não estiver vazio
    finalizarCompraContainer.style.display = "block";

    // Adiciona eventos para os botões de quantidade
    document.querySelectorAll(".btn-quantidade").forEach(botao => {
        botao.addEventListener("click", alterarQuantidade);
    });
}

// Função para alterar a quantidade de um produto no carrinho
function alterarQuantidade(event) {
    const index = event.target.getAttribute("data-index");
    const action = event.target.getAttribute("data-action");
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (action === "increment") {
        // Incrementa a quantidade
        carrinho[index].quantidade += 1;
    } else if (action === "decrement") {
        // Decrementa a quantidade
        carrinho[index].quantidade -= 1;

        // Remove o item se a quantidade for 0
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }
    }

    // Atualiza o Local Storage
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // Recarrega o carrinho
    carregarCarrinho();
}

// Chama a função ao carregar a página
carregarCarrinho();