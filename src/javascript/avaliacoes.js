$(document).ready(function () {

    let notaSelecionada = 0;

    
    // VERIFICAR USUÁRIO LOGADO
    
    const usuarioLogado =
        JSON.parse(
            localStorage.getItem('usuarioLogado')
        );

    
    // PRODUTO SELECIONADO PARA AVALIAÇÃO
    

    const produtoAtual =
        localStorage.getItem('produtoParaAvaliar');

    
    // VERIFICAR SE ESTÁ LOGADO
    

    if (!usuarioLogado) {

        $('#review_form').html(`
            <h3>Faça login para avaliar</h3>

            <p>
                Para avaliar um produto, você precisa
                estar conectado à sua conta.
            </p>

            <a href="login.html" class="btn-login-review">
                <i class="fa-solid fa-right-to-bracket"></i>
                Fazer login
            </a>
        `);

    }
    else if (produtoAtual) {

        $('#product_to_review').html(`
            <strong>
                 ${produtoAtual}
            </strong>
        `);
    }
    
    // SELECIONAR ESTRELAS
    

    $('.star').on('click', function () {

        notaSelecionada = Number(
            $(this).data('rating')
        );

        $('.star').removeClass('selected');

        $('.star').each(function () {

            const nota =
                Number($(this).data('rating'));

            if (nota <= notaSelecionada) {
                $(this).addClass('selected');
            }

        });

    });

    
    // ENVIAR AVALIAÇÃO
    

    $('#submit_review').on('click', function () {
        if (!usuarioLogado) {

            alert(
                'Você precisa estar logado para enviar uma avaliação.'
            );

            window.location.href = 'login.html';

            return;
        }

        
        // VERIFICAR PRODUTO NO MOMENTO DO ENVIO
        

        const produtoParaAvaliar =
            localStorage.getItem('produtoParaAvaliar');

        if (!produtoParaAvaliar) {

            alert(
                'Para avaliar um produto, acesse "Meus Pedidos" e selecione a compra que deseja avaliar.'
            );

            return;
        }

        
        // VALIDAR PRODUTO
        

        if (!produtoParaAvaliar) {

            alert(
                'Para avaliar um produto, acesse "Meus Pedidos" e selecione a compra que deseja avaliar.'
            );

            return;
        }

        const comentario =
            $('#review_comment').val().trim();

        
        // VALIDAR NOTA
        

        if (notaSelecionada === 0) {

            alert(
                'Por favor, selecione uma nota de 1 a 5 estrelas.'
            );

            return;
        }

        
        // VALIDAR COMENTÁRIO
        

        if (comentario === '') {

            alert(
                'Por favor, escreva um comentário.'
            );

            $('#review_comment').focus();

            return;
        }


        if (comentario.length < 5) {

            alert(
                'Sua avaliação deve ter pelo menos 5 caracteres.'
            );

            $('#review_comment').focus();

            return;
        }

        
        // RECUPERAR USUÁRIO LOGADO


        let nomeCliente = 'Cliente';


        if (usuarioLogado) {

            nomeCliente =
                usuarioLogado.nome || 'Cliente';

        }

        
        // CRIAR AVALIAÇÃO
        

        const avaliacao = {

            id: Date.now(),

            nome: nomeCliente,

            produto: produtoParaAvaliar,

            nota: notaSelecionada,

            comentario: comentario,

            data: new Date().toLocaleDateString('pt-BR')

        };

        
        // RECUPERAR AVALIAÇÕES EXISTENTES
        

        let avaliacoes =
            JSON.parse(
                localStorage.getItem('avaliacoes')
            ) || [];

        
        // ADICIONAR NOVA AVALIAÇÃO
        

        avaliacoes.push(avaliacao);


        
        // SALVAR
        localStorage.setItem(
            'avaliacoes',
            JSON.stringify(avaliacoes)
        );

        
        // LIMPAR FORMULÁRIO
        

        $('#review_comment').val('');

        notaSelecionada = 0;

        $('.star').removeClass('selected');

        // Limpar produto selecionado
        localStorage.removeItem('produtoParaAvaliar');

        $('#product_to_review').empty();


        alert(
            'Avaliação enviada com sucesso! ⭐'
        );


        
        // MOSTRAR AVALIAÇÕES
        carregarAvaliacoes();

    });


    
    // FUNÇÃO PARA MOSTRAR AVALIAÇÕES
    

    function carregarAvaliacoes() {

        const avaliacoes =
            JSON.parse(
                localStorage.getItem('avaliacoes')
            ) || [];


        const feedbacks =
            $('#user_feedbacks');

        feedbacks.empty();

        
        // CALCULAR MÉDIA DAS AVALIAÇÕES
        

        let media = 0;

        if (avaliacoes.length > 0) {

            let soma = 0;

            avaliacoes.forEach(function (avaliacao) {

                soma += Number(avaliacao.nota);

            });

            media = soma / avaliacoes.length;
        }

        
        // MOSTRAR MÉDIA
        

        $('#average_rating').text(
            media.toFixed(1).replace('.', ',')
        );

        
        // MOSTRAR QUANTIDADE
        

        $('#review_count').text(

            avaliacoes.length +
            (
                avaliacoes.length === 1
                    ? ' avaliação'
                    : ' avaliações'
            )

        );

        
        // MOSTRAR ESTRELAS DA MÉDIA
        

        let estrelasMedia = '';

        for (let i = 1; i <= 5; i++) {

            if (i <= Math.round(media)) {

                estrelasMedia += '★';

            } else {

                estrelasMedia += '☆';

            }

        }

        $('#average_stars').text(estrelasMedia);

        
        // MANTER OS CARDS FIXOS
        

        avaliacoes.forEach(function (avaliacao) {

            let estrelas = '';

            for (
                let i = 1;
                i <= 5;
                i++
            ) {

                if (i <= avaliacao.nota) {

                    estrelas += '★';

                } else {

                    estrelas += '☆';

                }

            }


            feedbacks.append(`

                <div class="feedback">

                    <div class="feedback-header">

                        <div class="feedback-user">

                            <i class="fa-solid fa-user"></i>

                            <strong>
                                ${avaliacao.nome}
                            </strong>

                        </div>

                        <div class="feedback-product">
                             ${avaliacao.produto}
                        </div>

                        <div class="feedback-stars">
                            ${estrelas}
                        </div>

                    </div>

                    <p class="feedback-comment">
                        ${avaliacao.comentario}
                    </p>

                    <small>
                        ${avaliacao.data}
                    </small>

                </div>

            `);

        });

    }


    // CARREGAR AVALIAÇÕES AO ABRIR A PÁGINA
    carregarAvaliacoes();

});