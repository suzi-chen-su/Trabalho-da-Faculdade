$(document).ready(function() {
    
    // CARREGAR PRODUTOS DO BANCO DE DADOS
    

    function carregarProdutos() {

        fetch('http://127.0.0.1:5000/produtos')

            .then(function(resposta) {

                if (!resposta.ok) {
                    throw new Error('Erro ao buscar produtos.');
                }

                return resposta.json();
            })

            .then(function(produtos) {

                const dishes = $('#dishes');

                dishes.empty();

                produtos.forEach(function(produto) {

                    // Mostrar somente produtos ativos
                    if (produto.ativo != 1) {
                        return;
                    }

                    const nomeArquivo = produto.imagem
                        ? produto.imagem.split('/').pop()
                        : '';

                    const imagem = nomeArquivo
                        ? `http://127.0.0.1:5000/imagens/${nomeArquivo}`
                        : '';

                    const preco = parseFloat(produto.preco);

                    const card = `
                        <div class="dish">

                            <button
                                type="button"
                                class="dish-heart favorite-btn"
                                data-name="${produto.nome}"
                            >
                                <i class="fa-solid fa-heart"></i>
                            </button>

                            <img
                                src="${imagem}"
                                class="dish-image"
                                alt="${produto.nome}"
                            >

                            <h3 class="dish-title">
                                ${produto.nome}
                            </h3>

                            <span class="dish-description">
                                ${produto.descricao}
                            </span>

                            <div class="dish-price">

                                <h4>
                                    R$ ${preco.toFixed(2).replace('.', ',')}
                                </h4>

                                <button
                                    type="button"
                                    class="btn-default add-to-cart"
                                    data-id="${produto.id}"
                                    data-name="${produto.nome}"
                                    data-price="${preco}"
                                >
                                    <i class="fa-solid fa-cart-shopping"></i>
                                </button>

                            </div>

                        </div>
                    `;

                    dishes.append(card);
                });

                carregarFavoritos();

            })

            .catch(function(erro) {

                console.error(
                    'Erro ao carregar produtos:',
                    erro
                );

                $('#dishes').html(`
                    <p>
                        Não foi possível carregar o cardápio.
                    </p>
                `);
            });
    }

    carregarProdutos();


    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x');
    });


    $('#mobile_nav_list .nav-item a').on('click', function () {
        $('#mobile_menu').removeClass('active');
        $('#mobile_btn').find('i').removeClass('fa-x');
    });

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {

        localStorage.setItem('cart', JSON.stringify(cart));

    }

    function updateCartCount() {

        let quantidadeTotal = 0;

        cart.forEach(function(item) {

            quantidadeTotal += item.quantity;

        });

        $('#cart_count').text(quantidadeTotal);

        $('#cart_count_mobile').text(quantidadeTotal);

    }

    
    // ADICIONAR PRODUTO AO CARRINHO
    

    $(document).on('click', '.add-to-cart', function () {

        const id = $(this).data('id');
        const nome = $(this).data('name');
        const preco = parseFloat($(this).data('price'));

        const produtoExistente = cart.find(function(item) {
            return item.id == id;
        });

        if (produtoExistente) {

            produtoExistente.quantity++;

        } else {

            cart.push({
                id: id,
                name: nome,
                price: preco,
                quantity: 1
            });

        }

        console.log('Carrinho:', cart);

        saveCart();
        updateCartCount();
        renderCart();
    });

    
    // AUMENTAR QUANTIDADE
    

    $(document).on('click', '.increase', function() {
        const index = $(this).data('index');
        cart[index].quantity++;
        saveCart();
        updateCartCount();
        renderCart();

    });

    
    // DIMINUIR QUANTIDADE
    

    $(document).on('click', '.decrease', function() {
        const index = $(this).data('index');


        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartCount();
        renderCart();
    });

    
    // REMOVER PRODUTO
    

    $(document).on('click', '.remove-item', function() {
        const index = $(this).data('index');
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCart();
    });

    
    // ABRIR CARRINHO
    

    $('.cart-btn').on('click', function() {
        $('#cart_container').addClass('active');
        renderCart();
    });


    // FECHAR CARRINHO
    

    $('#close_cart').on('click', function() {
        $('#cart_container').removeClass('active');

    });

    
    // FINALIZAR PEDIDO
    

    $('#checkout_btn').on('click', function() {

        if (cart.length === 0) {

            alert('Seu carrinho está vazio.');

            return;
        }

        
        // VERIFICAR SE O USUÁRIO JÁ ESTÁ LOGADO
        

        const usuarioLogado =
            localStorage.getItem('usuarioLogado');

        
        // USUÁRIO JÁ ESTÁ LOGADO
        

        if (usuarioLogado) {

            window.location.href =
                'checkout.html';

            return;
        }

        
        // USUÁRIO NÃO ESTÁ LOGADO
        

        sessionStorage.setItem(
            'voltarParaCheckout',
            'true'
        );

        window.location.href =
            'cadastro.html';

    });

    
    // MOSTRAR CARRINHO
    

    function renderCart() {
        const cartItems = $('#cart_items');
        cartItems.empty();


        // CARRINHO VAZIO
        

        if (cart.length === 0) {
            cartItems.html(
                '<p>Seu carrinho está vazio.</p>'
            );
            $('#cart_total strong').text('R$ 0,00');
            return;

        }


        let total = 0;


        
        // PRODUTOS
        

        cart.forEach(function(item, index) {
            const subtotal = item.price * item.quantity;
            total += subtotal;


            cartItems.append(`
                <div class="cart-item">
                    <div class="cart-item-info">

                        <span class="cart-item-name">
                            ${item.name}
                        </span>

                        <span class="cart-item-price">
                            R$ ${item.price.toFixed(2).replace('.', ',')}
                        </span>
                    </div>


                    <div class="cart-item-quantity">
                        <button 
                            class="quantity-btn decrease"
                            data-index="${index}">
                            -
                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button 
                            class="quantity-btn increase"
                            data-index="${index}">
                            +
                        </button>
                    </div>


                    <button 
                        class="remove-item"
                        data-index="${index}">

                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            `);

        });

        
        // TOTAL
        

        $('#cart_total strong').text(

            'R$ ' + total.toFixed(2).replace('.', ',')

        );

    }
    renderCart();
    updateCartCount();
});


// VERIFICAR USUÁRIO LOGADO


function verificarUsuarioLogado() {

    const usuarioLogado =
        JSON.parse(
            localStorage.getItem('usuarioLogado')
        );


    if (usuarioLogado) {

        
        // DESKTOP
        
        $('#user_logged')
            .text('Olá, ' + usuarioLogado.nome + '!');

        $('#logged_user_menu')
            .css('display', 'block');

        $('#user_menu .login-btn')
            .hide();


        
        // MOBILE
        

        $('#user_logged_mobile')
            .text('Olá, ' + usuarioLogado.nome + '!');

        $('#logged_user_menu_mobile')
            .css('display', 'block');

        $('#mobile_user_menu .login-btn')
            .hide();
    }

}


verificarUsuarioLogado();


// SAIR DA CONTA


$('#logout_btn, #logout_btn_mobile').on(
    'click',
    function() {

        const confirmar = confirm(
            'Deseja realmente sair da sua conta?'
        );

        if (!confirmar) {
            return;
        }

        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('produtoParaAvaliar');
        $('#review_form').html(`

            <h3>Faça login para avaliar</h3>

            <p>
                Para avaliar um produto, você precisa
                estar conectado à sua conta.
            </p>

            <a href="login.html" class="btn-default">
                Fazer login
            </a>

        `);

        // Desktop

        $('#logged_user_menu').hide();

        $('#user_menu .login-btn').show();


        // Mobile

        $('#logged_user_menu_mobile').hide();

        $('#mobile_user_menu .login-btn').show();


        // Fecha os menus

        $('#user_dropdown').hide();

        $('#user_dropdown_mobile').hide();

    }
);


// MENU DO USUÁRIO


$('#user_button').on('click', function(event) {

    event.stopPropagation();

    $('#user_dropdown').toggle();

});


$('#user_button_mobile').on('click', function(event) {

    event.stopPropagation();

    $('#user_dropdown_mobile').toggle();

});


// Fecha o menu quando clicar fora

$(document).on('click', function() {

    $('#user_dropdown').hide();

    $('#user_dropdown_mobile').hide();

});


// FAVORITOS


$(document).on('click', '.favorite-btn', function () {

    const botao = $(this);

    const produto = botao.data('name');

    // Recuperar favoritos existentes
    let favoritos =
        JSON.parse(
            localStorage.getItem('favoritos')
        ) || [];

    // Verificar se o produto já está favoritado
    const index =
        favoritos.indexOf(produto);

    if (index === -1) {

        // Adicionar aos favoritos
        favoritos.push(produto);

        botao.addClass('favorited');

    } else {

        // Remover dos favoritos
        favoritos.splice(index, 1);

        botao.removeClass('favorited');

    }

    // Salvar novamente
    localStorage.setItem(
        'favoritos',
        JSON.stringify(favoritos)
    );

});


// CARREGAR FAVORITOS AO ABRIR A PÁGINA


function carregarFavoritos() {

    const favoritos =
        JSON.parse(localStorage.getItem('favoritos')) || [];

    $('.favorite-btn').each(function () {

        const produto = $(this).data('name');

        if (favoritos.includes(produto)) {
            $(this).addClass('favorited');
        }
    });
}


// ITEM ATIVO DO MENU


$('.nav-item a').on('click', function () {

    $('.nav-item').removeClass('active');

    $(this).parent().addClass('active');

});

$(document).ready(function () {

    const params = new URLSearchParams(window.location.search);

    if (params.get('abrirCarrinho') === 'true') {
        $('#cart_container').addClass('active');
    }

});