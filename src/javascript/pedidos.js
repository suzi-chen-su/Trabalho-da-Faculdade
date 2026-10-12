$(document).ready(function () {

    console.log("1 - document.ready executado");


    // RECUPERAR USUÁRIO LOGADO
    

    const usuarioLogado =
        JSON.parse(
            localStorage.getItem("usuarioLogado")
        );

    console.log(
        "2 - usuário logado:",
        usuarioLogado
    );

    
    // VERIFICAR LOGIN
    

    if (!usuarioLogado) {

        alert(
            "Você precisa estar logado para visualizar seus pedidos."
        );

        window.location.href =
            "login.html";

        return;
    }

    
    // PEGAR ÁREA DOS PEDIDOS
    

    const ordersList =
        $("#orders_list");

    
    // CARREGAR PEDIDOS
    

    async function carregarPedidos() {

        console.log(
            "3 - carregando pedidos do banco..."
        );

        try {

            const resposta =
                await fetch(
                    "http://127.0.0.1:5000/pedidos"
                );


            const pedidos =
                await resposta.json();


            console.log(
                "4 - pedidos recebidos:",
                pedidos
            );


            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível carregar os pedidos."
                );

            }

            
            // FILTRAR PEDIDOS DO USUÁRIO LOGADO
            

            const meusPedidos =
                pedidos.filter(function (pedido) {

                    return (
                        pedido.usuario_id ===
                        usuarioLogado.id
                    );

                });


            console.log(
                "5 - meus pedidos:",
                meusPedidos
            );

            
            // VERIFICAR SE EXISTEM PEDIDOS
            

            if (meusPedidos.length === 0) {

                ordersList.html(`

                    <div class="no-orders">

                        <h2>
                            Você ainda não fez nenhum pedido. 
                        </h2>

                        <p>
                            Que tal escolher alguns cupcakes deliciosos?
                        </p>

                        <a
                            href="index.html"
                            class="btn-default"
                        >
                            Ver cupcakes
                        </a>

                    </div>

                `);

                return;
            }

            
            // LIMPAR LISTA
            

            ordersList.html("");

            
            // MOSTRAR PEDIDOS MAIS RECENTES PRIMEIRO
            

            meusPedidos.reverse();

            
            // CARREGAR CADA PEDIDO
            

            for (
                const pedido of meusPedidos
            ) {

                await mostrarPedido(pedido);

            }

        }

        catch (erro) {

            console.error(
                "Erro ao carregar pedidos:",
                erro
            );


            ordersList.html(`

                <div class="no-orders">

                    <h2>
                        Não foi possível carregar seus pedidos.
                    </h2>

                    <p>
                        Tente novamente mais tarde.
                    </p>

                </div>

            `);

        }

    }

    
    // MOSTRAR PEDIDO
    

    async function mostrarPedido(pedido) {

        let pedidoCompleto;


        try {

            const resposta =
                await fetch(
                    `http://127.0.0.1:5000/pedidos/${pedido.id}`
                );


            pedidoCompleto =
                await resposta.json();


            if (!resposta.ok) {

                console.error(
                    "Erro ao carregar detalhes do pedido:",
                    pedidoCompleto
                );

                return;
            }

        }

        catch (erro) {

            console.error(
                "Erro ao buscar detalhes:",
                erro
            );

            return;

        }

        
        // PRODUTOS
        

        let itensHTML = "";

            pedidoCompleto.itens.forEach(function (item) {

                const preco =
                    Number(item.preco).toFixed(2).replace(".", ",");

                const subtotal =
                    Number(item.subtotal).toFixed(2).replace(".", ",");

                const botaoAvaliacao =
                    pedidoCompleto.status === "Entregue"
                        ? `
                            <button type="button"
                                    class="btn-review-product"
                                    data-product="${item.nome_produto}">
                                ⭐ Avaliar produto
                            </button>
                        `
                        : "";

                itensHTML += `
                    <div class="order-item">

                        <div class="order-item-info">
                            <strong>${item.nome_produto}</strong>
                            <span>${item.quantidade} × R$ ${preco}</span>
                        </div>

                        <div class="order-item-actions">
                            <strong>R$ ${subtotal}</strong>

                            ${botaoAvaliacao}
                        </div>

                    </div>
                `;
            });


        
        // STATUS

        const statusHTML =
            criarStatusPedido(
                pedidoCompleto.status
            );


        
        // FRETE

        const frete =
            Number(
                pedidoCompleto.frete || 0
            )
            .toFixed(2)
            .replace(".", ",");

        
        // TOTAL

        const total =
            Number(
                pedidoCompleto.total
            )
            .toFixed(2)
            .replace(".", ",");


        // DATA

        const dataPedido =
            new Date(
                pedidoCompleto.data_pedido
            );


        const dataFormatada =
            dataPedido.toLocaleDateString(
                "pt-BR"
            );

        
        // PEDIDO
        

        ordersList.append(`

            <article class="order-card">

                <div class="order-header">

                    <div>

                        <h2>
                            Pedido #${pedidoCompleto.id}
                        </h2>

                        <span>
                            Data: ${dataFormatada}
                        </span>

                    </div>

                    <span class="order-status">
                        ${pedidoCompleto.status}
                    </span>

                </div>


                <!-- ======================================
                     ACOMPANHAMENTO DO PEDIDO
                     ====================================== -->

                <div class="order-tracking">

                    <h3>
                        Acompanhe seu pedido
                    </h3>

                    ${statusHTML}

                </div>


                <!-- ======================================
                     PRODUTOS
                     ====================================== -->

                <div class="order-items">

                    ${itensHTML}

                </div>


                <!-- ======================================
                     TOTAL
                     ====================================== -->

                <div class="order-total">

                    <div>

                        <span>
                            Frete:
                        </span>

                        <strong>
                            R$ ${frete}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Total:
                        </span>

                        <strong>
                            R$ ${total}
                        </strong>

                    </div>

                </div>

            </article>

        `);

    }


    
    // CRIAR ACOMPANHAMENTO DO PEDIDO
    

    function criarStatusPedido(status) {

        
        // PEDIDO CANCELADO
        

        if (
            status === "Pedido cancelado"
        ) {

            return `

                <div class="order-tracking cancelled">

                    <div class="tracking-step completed">

                        <div class="tracking-icon">
                            ✓
                        </div>

                        <span>
                            Pedido realizado
                        </span>

                    </div>


                    <div class="tracking-line"></div>


                    <div class="tracking-step cancelled">

                        <div class="tracking-icon">
                            ×
                        </div>

                        <span>
                            Pedido cancelado
                        </span>

                    </div>

                </div>

            `;

        }

        
        // DEFINIR ETAPA ATUAL
        

        const etapas = [

            "Pedido realizado",
            "Em preparação",
            "Saiu para entrega",
            "Entregue"

        ];


        const indiceAtual =
            etapas.indexOf(status);


        let html = `

            <div class="tracking-container">

        `;


        etapas.forEach(
            function (etapa, indice) {

                let classe =
                    "";


                if (
                    indice <
                    indiceAtual
                ) {

                    classe =
                        "completed";

                }


                else if (
                    indice ===
                    indiceAtual
                ) {

                    classe =
                        "current";

                }


                html += `

                    <div
                        class="tracking-step ${classe}"
                    >

                        <div class="tracking-icon">

                            ${
                                indice <
                                indiceAtual
                                    ? "✓"
                                    : indice ===
                                      indiceAtual
                                        ? "●"
                                        : ""
                            }

                        </div>

                        <span>
                            ${etapa}
                        </span>

                    </div>

                `;


                if (
                    indice <
                    etapas.length - 1
                ) {

                    html += `

                        <div
                            class="tracking-line ${
                                indice < indiceAtual
                                    ? "completed"
                                    : ""
                            }"
                        ></div>

                    `;

                }

            }
        );


        html += `

            </div>

        `;


        return html;

    }


    
    // BOTÃO AVALIAR PRODUTO
    

    $(document).on(
        "click",
        ".btn-review-product",
        function () {

            const produto =
                $(this).data("product");


            localStorage.setItem(
                "produtoParaAvaliar",
                produto
            );


            window.location.href =
                "index.html#review_form";

        }
    );


    // INICIAR
    carregarPedidos();

});

