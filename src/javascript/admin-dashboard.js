// PROTEÇÃO DO DASHBOARD ADMINISTRATIVO //

const adminLogado = localStorage.getItem("adminLogado");


// VERIFICAR AUTENTICAÇÃO //


if (adminLogado !== "true") {

    window.location.href = "admin-login.html";

}


// BOTÃO SAIR //


const logoutButton =
    document.getElementById("logout_button");

    logoutButton.addEventListener("click", function () {

        // Remove a autenticação do administrador
        localStorage.removeItem("adminLogado");

        // Volta para a tela de login
        window.location.href = "admin-login.html";

    });



// CARREGAR USUÁRIOS //


async function carregarUsuarios() {

    try {

        const resposta = await fetch(
            "http://127.0.0.1:5000/usuarios"
        );


        const usuarios =
            await resposta.json();


        const tabela =
            document.getElementById(
                "users_table_body"
            );


        // Limpa a tabela
        tabela.innerHTML = "";


        
        // VERIFICAR SE EXISTEM USUÁRIOS //
        

        if (usuarios.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="5">
                        Nenhum usuário cadastrado.
                    </td>
                </tr>
            `;

            return;
        }


        
        // ADICIONAR USUÁRIOS NA TABELA //
        

        usuarios.forEach(function(usuario) {

            const linha =
                document.createElement("tr");


            linha.innerHTML = `

                <td>
                    ${usuario.id}
                </td>

                <td>
                    ${usuario.nome}
                </td>

                <td>
                    ${usuario.email}
                </td>

                <td>
                    ${usuario.telefone}
                </td>

                <td>
                    ${usuario.data_cadastro}
                </td>

            `;


            tabela.appendChild(linha);

        });


        
        // ATUALIZAR TOTAL DE USUÁRIOS //
        

        const totalUsuarios =
            document.getElementById(
                "total_users"
            );


        totalUsuarios.textContent =
            usuarios.length;

    }


    catch (erro) {

        console.error(
            "Erro ao carregar usuários:",
            erro
        );

        alert(
            "Não foi possível carregar os usuários."
        );

    }

}


// CARREGAR PRODUTOS //


async function carregarProdutos() {

    try {

        const resposta = await fetch(
            "http://127.0.0.1:5000/produtos"
        );

        const produtos =
            await resposta.json();

        const tabela =
            document.getElementById(
                "products_table_body"
            );

        tabela.innerHTML = "";

        
        // ATUALIZAR TOTAL DE PRODUTOS //
        

        const totalProdutos =
            document.getElementById("total_products");

        totalProdutos.textContent =
            produtos.length;


        
        // CASO NÃO EXISTAM PRODUTOS //
        

        if (produtos.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="7">
                        Nenhum produto cadastrado.
                    </td>
                </tr>
            `;

            return;
        }


        
        // PREENCHER TABELA //
        

        produtos.forEach(function(produto) {

            const linha =
                document.createElement("tr");

            const status =
                produto.ativo === 1
                    ? "Ativo"
                    : "Inativo";

            linha.innerHTML = `
                <td>${produto.id}</td>

                <td>${produto.nome}</td>

                <td>${produto.descricao}</td>

                <td>
                    R$ ${Number(produto.preco)
                        .toFixed(2)
                        .replace(".", ",")}
                </td>

                <td>
                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}"
                        class="produto_imagem"
                    >
                </td>

                <td>
                    <span class="${produto.ativo === 1 ? 'status_ativo' : 'status_inativo'}">
                        ${status}
                    </span>
                </td>

                

                <td>

                    <button
                        class="editar_produto_button"
                        data-id="${produto.id}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="alterar_status_button"
                        data-id="${produto.id}"
                    >
                        ${produto.ativo === 1 ? "Desativar" : "Ativar"}
                    </button>

                    <button
                        type="button"
                        class="excluir_produto_button"
                        data-id="${produto.id}"
                    >
                        Excluir
                    </button>

                </td>
            `;

            
            // BOTÃO EDITAR PRODUTO
            

            const botaoEditar =
                linha.querySelector(
                    ".editar_produto_button"
                );

            botaoEditar.addEventListener(
                "click",
                function () {

                    // Preencher ID
                    document.getElementById(
                        "edit_product_id"
                    ).value = produto.id;


                    // Preencher nome
                    document.getElementById(
                        "edit_product_name"
                    ).value = produto.nome;


                    // Preencher descrição
                    document.getElementById(
                        "edit_product_description"
                    ).value = produto.descricao;


                    // Preencher preço
                    document.getElementById(
                        "edit_product_price"
                    ).value = produto.preco;


                    // Mostrar formulário
                    const formularioEdicao =
                        document.getElementById(
                            "edit_product_section"
                        );

                    formularioEdicao.style.display =
                        "block";


                    // Rolar até o formulário
                    formularioEdicao.scrollIntoView({
                        behavior: "smooth"
                    });

                }
            );

            
            // BOTÃO ALTERAR STATUS DO PRODUTO //
            

            const botaoStatus =
                linha.querySelector(
                    ".alterar_status_button"
                );

            botaoStatus.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();

                    console.log("BOTÃO DE STATUS CLICADO");

                    const novoStatus =
                        produto.ativo === 1
                            ? 0
                            : 1;

                    try {

                        const resposta = await fetch(
                            `http://127.0.0.1:5000/produtos/${produto.id}/status`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({
                                    ativo: novoStatus
                                })
                            }
                        );

                        const resultado =
                            await resposta.json();


                        
                        // SE DEU CERTO //
                        

                        if (resultado.sucesso) {

                            // Mostra a mensagem
                            statusProductMessage.textContent =
                                resultado.mensagem;

                            statusProductMessage.style.display =
                                "block";

                            statusProductMessage.style.backgroundColor =
                                "#e8f7ec";

                            statusProductMessage.style.borderColor =
                                "#b7dfc1";

                            statusProductMessage.style.color =
                                "#26733a";


                            
                            // ATUALIZA O PRODUTO NA LINHA //
                            

                            produto.ativo = novoStatus;


                            const statusProduto =
                                linha.querySelector(
                                    "span"
                                );


                            if (produto.ativo === 1) {

                                statusProduto.textContent =
                                    "Ativo";

                                statusProduto.className =
                                    "status_ativo";

                                botaoStatus.textContent =
                                    "Desativar";

                            } else {

                                statusProduto.textContent =
                                    "Inativo";

                                statusProduto.className =
                                    "status_inativo";

                                botaoStatus.textContent =
                                    "Ativar";
                            }


                            
                            // ESCONDER MENSAGEM DEPOIS DE 3 SEGUNDOS
                            

                            setTimeout(function () {

                                statusProductMessage.style.display =
                                    "none";

                                statusProductMessage.textContent =
                                    "";

                            }, 3000);

                        }


                        
                        // SE DEU ERRO
                        

                        else {

                            statusProductMessage.textContent =
                                resultado.mensagem;

                            statusProductMessage.style.display =
                                "block";

                            statusProductMessage.style.backgroundColor =
                                "#fdeaea";

                            statusProductMessage.style.borderColor =
                                "#e0b4b4";

                            statusProductMessage.style.color =
                                "#a33a3a";

                        }

                    }


                    catch (erro) {

                        console.error(
                            "Erro ao alterar status do produto:",
                            erro
                        );

                        statusProductMessage.textContent =
                            "Não foi possível alterar o status do produto.";

                        statusProductMessage.style.display =
                            "block";

                        statusProductMessage.style.backgroundColor =
                            "#fdeaea";

                        statusProductMessage.style.borderColor =
                            "#e0b4b4";

                        statusProductMessage.style.color =
                            "#a33a3a";

                    }

                }
            );

            
            // EXCLUIR PRODUTO //
            

            const botaoExcluir =
                linha.querySelector(
                    ".excluir_produto_button"
                );

            botaoExcluir.addEventListener(
                "click",
                async function(event) {

                    event.preventDefault();

                    const confirmar =
                        confirm(
                            "Tem certeza que deseja excluir este produto?"
                        );

                    if (!confirmar) {
                        return;
                    }

                    try {

                        const resposta =
                            await fetch(
                                `http://127.0.0.1:5000/produtos/${produto.id}`,
                                {
                                    method: "DELETE"
                                }
                            );

                        const resultado =
                            await resposta.json();

                        if (resultado.sucesso) {

                            statusProductMessage.textContent =
                                resultado.mensagem;

                            statusProductMessage.style.display =
                                "block";

                            await carregarProdutos();

                        } else {

                            statusProductMessage.textContent =
                                resultado.mensagem;

                            statusProductMessage.style.display =
                                "block";

                            statusProductMessage.style.backgroundColor =
                                "#fdeaea";

                            statusProductMessage.style.borderColor =
                                "#e0b4b4";

                            statusProductMessage.style.color =
                                "#a33a3a";
                        }

                    } catch (erro) {

                        console.error(
                            "Erro ao excluir produto:",
                            erro
                        );

                        statusProductMessage.textContent =
                            "Não foi possível excluir o produto.";

                        statusProductMessage.style.display =
                            "block";

                        statusProductMessage.style.backgroundColor =
                            "#fdeaea";

                        statusProductMessage.style.borderColor =
                            "#e0b4b4";

                        statusProductMessage.style.color =
                            "#a33a3a";
                    }
                }
            );

            tabela.appendChild(linha);
            

        });


    }

    catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

        alert(
            "Não foi possível carregar os produtos."
        );

    }
}


// CARREGAR VENDAS //


async function carregarVendas() {

    console.log("CARREGAR VENDAS FOI CHAMADO");

    try {

        const resposta = await fetch(
            "http://127.0.0.1:5000/pedidos"
        );

        console.log("RESPOSTA VENDAS:", resposta);

        const pedidos = await resposta.json();

        console.log("PEDIDOS PARA CALCULAR VENDAS:", pedidos);

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar as vendas."
            );
        }
        

        
        // ELEMENTO DA TABELA
        

        const tabela =
            document.getElementById(
                "sales_table_body"
            );


        
        // LIMPAR TABELA
    

        if (tabela) {

            tabela.innerHTML = "";

        }


        // DATA ATUAL
        

        const agora =
            new Date();

        const mesAtual =
            agora.getMonth();

        const anoAtual =
            agora.getFullYear();


        
        // CALCULAR VENDAS DO MÊS ATUAL e PEDIDOS CANCELADOS NÃO SÃO CONTABILIZADOS
        

        const totalVendas =
            pedidos.reduce(
                function (soma, pedido) {

                    const status =
                        String(
                            pedido.status || ""
                        )
                        .trim()
                        .toLowerCase();


                    // Não contabilizar pedidos cancelados
                    if (
                        status ===
                        "pedido cancelado"
                    ) {

                        return soma;

                    }


                    // Verificar a data do pedido
                    const dataPedido =
                        new Date(
                            pedido.data_pedido
                        );


                    const mesPedido =
                        dataPedido.getMonth();

                    const anoPedido =
                        dataPedido.getFullYear();


                    // Somente pedidos do mês e ano atuais
                    if (
                        mesPedido !== mesAtual ||
                        anoPedido !== anoAtual
                    ) {

                        return soma;

                    }


                    return soma +
                        Number(
                            pedido.total || 0
                        );

                },
                0
            );


        
        // FORMATAR TOTAL //
        

        const totalVendasFormatado =
            totalVendas
                .toFixed(2)
                .replace(".", ",");


        
        // ATUALIZAR CARD "VENDAS"
        

        const totalSales =
            document.getElementById(
                "total_sales"
            );


        if (totalSales) {

            totalSales.textContent =
                `R$ ${totalVendasFormatado}`;

        }


        
        // CASO A TABELA NÃO EXISTA

        if (!tabela) {

            return;

        }


        // CASO NÃO EXISTAM PEDIDOS
        

        if (pedidos.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="5">
                        Nenhuma venda realizada.
                    </td>
                </tr>
            `;

            return;

        }


        
        // PREENCHER TABELA //
        

        pedidos.forEach(
            function (venda) {

                const linha =
                    document.createElement(
                        "tr"
                    );

                
                // DATA //
                

                const dataVenda =
                    new Date(
                        venda.data_pedido
                    );


                const dataFormatada =
                    dataVenda.toLocaleDateString(
                        "pt-BR"
                    );


                
                // TOTAL
                

                const totalFormatado =
                    Number(
                        venda.total || 0
                    )
                    .toFixed(2)
                    .replace(".", ",");


                
                // STATUS
                

                const status =
                    String(
                        venda.status || ""
                    )
                    .trim()
                    .toLowerCase();


                const pedidoCancelado =
                    status ===
                    "pedido cancelado";


                
                // CRIAR LINHA
                

                linha.innerHTML = `

                    <td>
                        <strong>
                            #${venda.id}
                        </strong>
                    </td>


                    <td>
                        ${venda.nome_cliente}
                    </td>


                    <td>
                        ${dataFormatada}
                    </td>


                    <td>
                        ${venda.forma_pagamento}

                        ${
                            venda.parcelas
                                ? `
                                    <br>
                                    <small>
                                        ${venda.parcelas}x
                                    </small>
                                  `
                                : ""
                        }
                    </td>


                    <td>

                        ${
                            pedidoCancelado

                                ? `
                                    <strong>
                                        <s>
                                            R$ ${totalFormatado}
                                        </s>
                                    </strong>

                                    <br>

                                    <small
                                        class="status_venda_cancelada"
                                    >
                                        Pedido cancelado
                                    </small>
                                  `

                                : `
                                    <strong>
                                        R$ ${totalFormatado}
                                    </strong>
                                  `
                        }

                    </td>

                `;


                tabela.appendChild(
                    linha
                );

            }
        );

    }


    catch (erro) {

        console.error(
            "Erro ao carregar vendas:",
            erro
        );


        const totalSales =
            document.getElementById(
                "total_sales"
            );


        if (totalSales) {

            totalSales.textContent =
                "R$ 0,00";

        }


        const tabela =
            document.getElementById(
                "sales_table_body"
            );


        if (tabela) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="5">
                        Não foi possível carregar as vendas.
                    </td>
                </tr>
            `;

        }

    }

}


// CADASTRAR NOVO PRODUTO


const novoProdutoButton =
    document.getElementById(
        "novo_produto_button"
    );

const newProductSection =
    document.getElementById(
        "new_product_section"
    );

const cancelNewProductButton =
    document.getElementById(
        "cancel_new_product_button"
    );



// ABRIR FORMULÁRIO

novoProdutoButton.addEventListener(
    "click",
    function () {

        newProductSection.style.display =
            "block";

        newProductSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);



// CANCELAR CADASTRO


cancelNewProductButton.addEventListener(
    "click",
    function () {

        newProductSection.style.display =
            "none";

    }
);


// FORMULÁRIO DE NOVO PRODUTO


const newProductForm =
    document.getElementById(
        "new_product_form"
    );

const newProductMessage =
    document.getElementById(
        "new_product_message"
    );



// CADASTRAR PRODUTO


newProductForm.addEventListener(
    "submit",
    async function (event) {

        // Impede o formulário de recarregar a página
        event.preventDefault();

        
        // PEGAR OS DADOS DO FORMULÁRIO
        

        const nome =
            document.getElementById(
                "new_product_name"
            ).value;

        const descricao =
            document.getElementById(
                "new_product_description"
            ).value;

        const preco =
            document.getElementById(
                "new_product_price"
            ).value;

        const imagemInput =
            document.getElementById(
                "new_product_image"
            );

        const imagem =
            imagemInput.files[0];

        
        // VALIDAR IMAGEM
        

        if (!imagem) {

            newProductMessage.textContent =
                "Selecione uma imagem para o produto.";

            newProductMessage.style.display =
                "block";

            newProductMessage.style.backgroundColor =
                "#fdeaea";

            newProductMessage.style.borderColor =
                "#e0b4b4";

            newProductMessage.style.color =
                "#a33a3a";

            return;
        }


        // ENVIAR PARA O BACKEND
        

        try {

            const dadosFormulario =
                new FormData();

            dadosFormulario.append(
                "nome",
                nome
            );

            dadosFormulario.append(
                "descricao",
                descricao
            );

            dadosFormulario.append(
                "preco",
                preco
            );

            dadosFormulario.append(
                "imagem",
                imagem
            );


            const resposta = await fetch(
                "http://127.0.0.1:5000/produtos",
                {
                    method: "POST",

                    body: dadosFormulario
                }
            );


            const resultado =
                await resposta.json();


            
            // CADASTRO REALIZADO
            

            if (resultado.sucesso) {

                newProductMessage.textContent =
                    resultado.mensagem;

                newProductMessage.style.display =
                    "block";

                newProductMessage.style.backgroundColor =
                    "#e8f7ec";

                newProductMessage.style.borderColor =
                    "#b7dfc1";

                newProductMessage.style.color =
                    "#26733a";


                // Limpa o formulário
                newProductForm.reset();


                // Atualiza a tabela de produtos
                await carregarProdutos();


                // Fecha o formulário depois de 3 segundos
                setTimeout(function () {

                    newProductSection.style.display =
                        "none";

                    newProductMessage.style.display =
                        "none";

                    newProductMessage.textContent =
                        "";

                }, 3000);

            }


            
            // ERRO NO CADASTRO
            

            else {

                newProductMessage.textContent =
                    resultado.mensagem;

                newProductMessage.style.display =
                    "block";

                newProductMessage.style.backgroundColor =
                    "#fdeaea";

                newProductMessage.style.borderColor =
                    "#e0b4b4";

                newProductMessage.style.color =
                    "#a33a3a";

            }

        }


        catch (erro) {

            console.error(
                "Erro ao cadastrar produto:",
                erro
            );

            newProductMessage.textContent =
                "Não foi possível conectar ao servidor.";

            newProductMessage.style.display =
                "block";

            newProductMessage.style.backgroundColor =
                "#fdeaea";

            newProductMessage.style.borderColor =
                "#e0b4b4";

            newProductMessage.style.color =
                "#a33a3a";

        }

    }
);


// BOTÃO GERENCIAR PRODUTOS //


const verProdutosButton =
    document.getElementById(
        "ver_produtos_button"
    );

const productsSection =
    document.getElementById(
        "products_section"
    );

const statusProductMessage =
    document.getElementById(
        "status_product_message"
    );

const fecharProdutosButton =
    document.getElementById(
        "fechar_produtos_button"
    );


// BOTÃO CANCELAR EDIÇÃO


const cancelarEdicaoButton =
    document.getElementById(
        "cancel_edit_button"
    );

const formularioEdicao =
    document.getElementById(
        "edit_product_section"
    );

cancelarEdicaoButton.addEventListener(
    "click",
    function () {

        formularioEdicao.style.display =
            "none";

    }
);


verProdutosButton.addEventListener(
    "click",
    async function () {

        productsSection.style.display =
            "block";

        await carregarProdutos();

        productsSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);



// BOTÃO FECHAR PRODUTOS //


fecharProdutosButton.addEventListener(
    "click",
    function () {

        productsSection.style.display =
            "none";

    }
);


// EXECUTAR AO ABRIR O DASHBOARD //


carregarUsuarios();
carregarProdutos();
carregarPedidos();
carregarVendas();


// BOTÃO VER PEDIDOS //


const verPedidosButton =
    document.getElementById(
        "ver_pedidos_button"
    );

const ordersSection =
    document.getElementById(
        "orders_section"
    );

const fecharPedidosButton =
    document.getElementById(
        "fechar_pedidos_button"
    );


verPedidosButton.addEventListener(
    "click",
    function () {

        ordersSection.style.display =
            "block";

        ordersSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);



// BOTÃO FECHAR PEDIDOS //


fecharPedidosButton.addEventListener(
    "click",
    function () {

        ordersSection.style.display =
            "none";

    }
);


// BOTÃO FECHAR DETALHES DO PEDIDO //


const fecharDetalhesPedidoButton =
    document.getElementById(
        "fechar_detalhes_pedido_button"
    );


const orderDetailsSection =
    document.getElementById(
        "order_details_section"
    );


fecharDetalhesPedidoButton.addEventListener(
    "click",
    function () {

        orderDetailsSection.style.display =
            "none";

    }
);


// ID DO PEDIDO SELECIONADO


let pedidoSelecionadoId = null;


// CARREGAR DETALHES DO PEDIDO //


async function carregarDetalhesPedido(idPedido) {

    pedidoSelecionadoId = idPedido;

    try {

        const resposta =
            await fetch(
                `http://127.0.0.1:5000/pedidos/${idPedido}`
            );


        const pedido =
            await resposta.json();


        // VERIFICAR SE O PEDIDO FOI ENCONTRADO
        

        if (!resposta.ok) {

            console.error(
                "Erro ao carregar pedido:",
                pedido
            );

            alert(
                pedido.mensagem ||
                "Não foi possível carregar os detalhes do pedido."
            );

            return;
        }

        
        // PEGAR A SEÇÃO DE DETALHES
        

        const detalhes =
            document.getElementById(
                "order_details_content"
            );

        
        // FORMATAR TOTAL
        

        const totalFormatado =
            Number(pedido.total)
                .toFixed(2)
                .replace(".", ",");


        // FORMATAR FRETE
        

        const freteFormatado =
            Number(pedido.frete)
                .toFixed(2)
                .replace(".", ",");

        
        // FORMATAR DATA
        

        const dataPedido =
            new Date(
                pedido.data_pedido
            );


        const dataFormatada =
            dataPedido.toLocaleDateString(
                "pt-BR"
            );

        
        // MONTAR INFORMAÇÕES DO PEDIDO
        

        let html = `

            <!-- ==========================================
                CABEÇALHO DO PEDIDO
                ========================================== -->

            <div class="pedido_cabecalho">

                <div>

                    <h3>
                        Pedido #${pedido.id}
                    </h3>

                    <p>
                        ${dataFormatada}
                    </p>

                </div>

                <span class="status_pedido status_${pedido.status
                    .toLowerCase()
                    .replaceAll(" ", "_")
                    .replaceAll("ã", "a")
                    .replaceAll("ç", "c")
                    .replaceAll("í", "i")}"
                >
                    ${pedido.status}
                </span>

            </div>


            <!-- ==========================================
                DADOS DO CLIENTE
                ========================================== -->

            <div class="pedido_bloco">

                <h3>
                    Dados do cliente
                </h3>

                <div class="pedido_dados">

                    <div class="pedido_dado">

                        <strong>
                            Nome
                        </strong>

                        <span>
                            ${pedido.nome_cliente}
                        </span>

                    </div>


                    <div class="pedido_dado">

                        <strong>
                            E-mail
                        </strong>

                        <span>
                            ${pedido.email_cliente}
                        </span>

                    </div>


                    <div class="pedido_dado">

                        <strong>
                            Telefone
                        </strong>

                        <span>
                            ${pedido.telefone_cliente}
                        </span>

                    </div>


                    <div class="pedido_dado">

                        <strong>
                            Endereço
                        </strong>

                        <span>
                            ${pedido.endereco},
                            ${pedido.numero}
                        </span>

                    </div>

                    <div class="pedido_dado">
                        <strong>CEP</strong>
                        <span>${pedido.cep || "Não informado"}</span>
                    </div>


                    <div class="pedido_dado">

                        <strong>
                            Complemento
                        </strong>

                        <span>
                            ${pedido.complemento || "Não informado"}
                        </span>

                    </div>

                </div>

            </div>


            <!-- ==========================================
                DADOS DA COMPRA
                ========================================== -->

            <div class="pedido_bloco">

                <h3>
                    Dados da compra
                </h3>

                <div class="pedido_produtos">

            <!-- ==========================================
                    INFORMAÇÕES DO PEDIDO
            ========================================== -->

                <div class="pedido_compra_cabecalho">

                    <div class="pedido_dado">

                        <strong>
                            Número do pedido
                        </strong>

                        <span>
                            #${pedido.id}
                        </span>

                    </div>


                    <div class="pedido_dado">

                        <strong>
                            Data do pedido
                        </strong>

                        <span>
                            ${dataFormatada}
                        </span>

                    </div>


                    <div class="pedido_dado">

                        <strong>
                            Forma de pagamento
                        </strong>

                        <span>
                            ${pedido.forma_pagamento}
                        </span>

                    </div>


                    <div class="pedido_dado">

                        <strong>
                            Parcelas
                        </strong>

                        <span>
                            ${
                                pedido.parcelas
                                    ? pedido.parcelas + "x"
                                    : "Não se aplica"
                            }
                        </span>

                    </div>

                </div>

            
        `;


        
        // ADICIONAR PRODUTOS //
        

        pedido.itens.forEach(function(item) {

            const precoFormatado =
                Number(item.preco)
                    .toFixed(2)
                    .replace(".", ",");


            const subtotalFormatado =
                Number(item.subtotal)
                    .toFixed(2)
                    .replace(".", ",");


            html += `

                <div class="pedido_produto">

                    <div class="pedido_produto_nome">

                        <span>
                            Produto
                        </span>

                        <strong>
                            ${item.nome_produto}
                        </strong>

                    </div>


                    <div class="pedido_produto_quantidade">

                        <span>
                            Quantidade
                        </span>

                        <strong>
                            ${item.quantidade}
                        </strong>

                    </div>


                    <div class="pedido_produto_preco">

                        <span>
                            Preço
                        </span>

                        <strong>
                            R$ ${precoFormatado}
                        </strong>

                    </div>


                    <div class="pedido_produto_subtotal">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            R$ ${subtotalFormatado}
                        </strong>

                    </div>

                </div>

            `;

        });


        
        // RESUMO DA COMPRA
        

        const subtotalProdutos =
            pedido.itens.reduce(
                function(soma, item) {

                    return soma +
                        Number(item.subtotal);

                },
                0
            );


        const subtotalProdutosFormatado =
            subtotalProdutos
                .toFixed(2)
                .replace(".", ",");


        html += `

                </div>


                <!-- ==========================================
                    RESUMO FINANCEIRO
                    ========================================== -->

                <div class="pedido_resumo_compra">

                    <div class="pedido_resumo_linha">

                        <span>
                            Subtotal dos produtos
                        </span>

                        <strong>
                            R$ ${subtotalProdutosFormatado}
                        </strong>

                    </div>


                    <div class="pedido_resumo_linha">

                        <span>
                            Frete
                        </span>

                        <strong>
                            R$ ${freteFormatado}
                        </strong>

                    </div>


                    <div class="pedido_total">

                        <span>
                            Total do pedido
                        </span>

                        <strong>
                            R$ ${totalFormatado}
                        </strong>

                    </div>

                </div>

            </div>

        `;


        detalhes.innerHTML =
            html;

        
        // SELECIONAR STATUS ATUAL DO PEDIDO
        

        const statusPedido =
            document.getElementById(
                "status_pedido"
            );

        statusPedido.value =
            pedido.status;


        
        // MOSTRAR SEÇÃO
        

        const detalhesSection =
            document.getElementById(
                "order_details_section"
            );


        detalhesSection.style.display =
            "block";


        detalhesSection.scrollIntoView({
            behavior: "smooth"
        });

    }

    catch (erro) {

        console.error(
            "Erro ao carregar detalhes do pedido:",
            erro
        );

        alert(
            "Não foi possível carregar os detalhes do pedido."
        );

    }

}


// SALVAR STATUS DO PEDIDO //


const salvarStatusPedidoButton =
    document.getElementById(
        "salvar_status_pedido_button"
    );

const statusPedidoMessage =
    document.getElementById(
        "status_pedido_message"
    );


salvarStatusPedidoButton.addEventListener(
    "click",
    async function () {

        const statusPedido =
            document.getElementById(
                "status_pedido"
            ).value;


        
        // VERIFICAR SE EXISTE UM PEDIDO SELECIONADO
        

        if (!pedidoSelecionadoId) {

            statusPedidoMessage.textContent =
                "Nenhum pedido selecionado.";

            statusPedidoMessage.style.display =
                "block";

            statusPedidoMessage.style.color =
                "red";

            return;
        }

        
        // MOSTRAR MENSAGEM
        

        statusPedidoMessage.textContent =
            "Salvando status...";

        statusPedidoMessage.style.display =
            "block";

        statusPedidoMessage.style.color =
            "black";


        try {

            
            // ENVIAR NOVO STATUS PARA O BACKEND
            

            const resposta =
                await fetch(
                    `http://127.0.0.1:5000/pedidos/${pedidoSelecionadoId}/status`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            status: statusPedido
                        })
                    }
                );


            const resultado =
                await resposta.json();


            console.log(
                "RESPOSTA DO SERVIDOR:",
                resultado
            );


            // VERIFICAR RESULTADO
            

            if (!resposta.ok || !resultado.sucesso) {

                statusPedidoMessage.textContent =
                    resultado.mensagem ||
                    "Não foi possível alterar o status.";

                statusPedidoMessage.style.display =
                    "block";

                statusPedidoMessage.style.color =
                    "red";

                return;
            }

            
            // STATUS ALTERADO COM SUCESSO
            

            statusPedidoMessage.textContent =
                resultado.mensagem;

            statusPedidoMessage.style.display =
                "block";

            statusPedidoMessage.style.color =
                "green";


            
            // ATUALIZAR TABELA DE PEDIDOS            
            await carregarPedidos();

        }

        catch (erro) {

            console.error(
                "Erro ao alterar status do pedido:",
                erro
            );

            statusPedidoMessage.textContent =
                "Não foi possível alterar o status do pedido.";

            statusPedidoMessage.style.display =
                "block";

            statusPedidoMessage.style.color =
                "red";

        }

    }
);


// BOTÃO VER USUÁRIOS //


const verUsuariosButton =
    document.getElementById("ver_usuarios_button");

const usersSection =
    document.getElementById("users_section");

const fecharUsuariosButton =
    document.getElementById("fechar_usuarios_button");


verUsuariosButton.addEventListener("click", async function () {

    // Mostra a seção de usuários
    usersSection.style.display = "block";

    // Carrega os usuários do banco
    await carregarUsuarios();

    // Rola a página até a tabela
    usersSection.scrollIntoView({
        behavior: "smooth"
    });

});


// BOTÃO FECHAR USUÁRIOS //


fecharUsuariosButton.addEventListener(
    "click",
    function () {

        usersSection.style.display = "none";

    }
);


// SALVAR ALTERAÇÕES DO PRODUTO //


const formularioSalvarProduto =
    document.getElementById(
        "edit_product_form"
    );

const mensagemEdicao =
    document.getElementById(
        "edit_product_message"
    );

formularioSalvarProduto.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const idProduto =
            document.getElementById(
                "edit_product_id"
            ).value;

        const nome =
            document.getElementById(
                "edit_product_name"
            ).value;

        const descricao =
            document.getElementById(
                "edit_product_description"
            ).value;

        const preco =
            document.getElementById(
                "edit_product_price"
            ).value;

        const imagemInput =
            document.getElementById(
                "edit_product_image"
            );

        const imagem =
            imagemInput.files[0];



        mensagemEdicao.textContent =
            "Salvando alterações...";

        mensagemEdicao.style.display =
            "block";

        mensagemEdicao.style.color =
            "black";

        
        // VALIDAR DADOS DO PRODUTO
        

        if (nome.trim() === "") {

            mensagemEdicao.textContent =
                "Informe o nome do produto.";

            mensagemEdicao.style.display =
                "block";

            mensagemEdicao.style.color =
                "red";

            return;
        }


        if (descricao.trim() === "") {

            mensagemEdicao.textContent =
                "Informe a descrição do produto.";

            mensagemEdicao.style.display =
                "block";

            mensagemEdicao.style.color =
                "red";

            return;
        }


        if (preco === "" || Number(preco) <= 0) {

            mensagemEdicao.textContent =
                "Informe um preço maior que zero.";

            mensagemEdicao.style.display =
                "block";

            mensagemEdicao.style.color =
                "red";

            return;
        }



        try {

            const dadosFormulario =
                new FormData();

            dadosFormulario.append(
                "nome",
                nome
            );

            dadosFormulario.append(
                "descricao",
                descricao
            );

            dadosFormulario.append(
                "preco",
                preco
            );


            // Só envia a imagem se uma nova imagem
            // tiver sido selecionada
            if (imagem) {

                dadosFormulario.append(
                    "imagem",
                    imagem
                );

            }


            const resposta = await fetch(
                `http://127.0.0.1:5000/produtos/${idProduto}`,
                {
                    method: "PUT",

                    body: dadosFormulario
                }
            );


            const resultado =
                await resposta.json();


            if (resultado.sucesso) {

                mensagemEdicao.textContent =
                    resultado.mensagem;

                mensagemEdicao.style.display =
                    "block";

                await carregarProdutos();


                // Fechar o formulário depois de 3 segundos

                setTimeout(function () {

                    formularioEdicao.style.display =
                        "none";

                    mensagemEdicao.style.display =
                        "none";

                    mensagemEdicao.textContent =
                        "";

                    productsSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }, 3000);

            }
            else {

                mensagemEdicao.textContent =
                    resultado.mensagem;

                mensagemEdicao.style.color =
                    "red";

            }

        }

        catch (erro) {

            console.error(
                "Erro ao atualizar produto:",
                erro
            );

            mensagemEdicao.textContent =
                "Não foi possível atualizar o produto.";

            mensagemEdicao.style.color =
                "red";

        }

    }
);


// CARREGAR PEDIDOS //


async function carregarPedidos() {
    console.log("CARREGAR PEDIDOS FOI CHAMADO");
    try {

        const resposta = await fetch(
            "http://127.0.0.1:5000/pedidos"
        );
        console.log("RESPOSTA RECEBIDA:", resposta);


        const pedidos =
            await resposta.json();
        console.log("PEDIDOS RECEBIDOS:", pedidos);


        const tabela =
            document.getElementById(
                "orders_table_body"
            );


        // Limpa a tabela
        tabela.innerHTML = "";


        
        // ATUALIZAR TOTAL DE PEDIDOS
        

        const totalPedidos =
            document.getElementById(
                "total_orders"
            );


        totalPedidos.textContent =
            pedidos.length;


        
        // CASO NÃO EXISTAM PEDIDOS

        if (pedidos.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="7">
                        Nenhum pedido realizado.
                    </td>
                </tr>
            `;

            return;
        }

        
        // PREENCHER TABELA
        

        pedidos.forEach(function(pedido) {

            const linha =
                document.createElement("tr");

            
            // FORMATAR DATA
            

            const dataPedido =
                new Date(
                    pedido.data_pedido
                );


            const dataFormatada =
                dataPedido.toLocaleDateString(
                    "pt-BR"
                );

            
            // FORMATAR TOTAL

            const totalFormatado =
                Number(pedido.total)
                    .toFixed(2)
                    .replace(".", ",");


            linha.innerHTML = `

                <td>
                    <strong>#${pedido.id}</strong>
                </td>

                <td>
                    ${pedido.nome_cliente}
                </td>

                <td>
                    ${dataFormatada}
                </td>

                <td>
                    <strong>
                        R$ ${totalFormatado}
                    </strong>
                </td>

                <td>
                    ${pedido.forma_pagamento}
                    ${
                        pedido.parcelas
                            ? `<br><small>${pedido.parcelas}x</small>`
                            : ""
                    }
                </td>

                <td>
                    <span class="status_pedido status_${pedido.status
                        .toLowerCase()
                        .replaceAll(" ", "_")
                        .replaceAll("ã", "a")
                        .replaceAll("ç", "c")
                        .replaceAll("í", "i")}"
                    >
                        ${pedido.status}
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        class="ver_pedido_button"
                        data-id="${pedido.id}"
                    >
                        Ver detalhes
                    </button>

                </td>

            `;

            
            // BOTÃO VER PEDIDO
            

            const botaoVerPedido =
                linha.querySelector(
                    ".ver_pedido_button"
                );


            botaoVerPedido.addEventListener(
                "click",
                function () {

                    const idPedido =
                        this.getAttribute(
                            "data-id"
                        );


                    carregarDetalhesPedido(
                        idPedido
                    );

                }
            );


            tabela.appendChild(linha);

        });


    }

    catch (erro) {

        console.error(
            "Erro ao carregar pedidos:",
            erro
        );


        alert(
            "Não foi possível carregar os pedidos."
        );

    }


// BOTÃO VER VENDAS //


const verVendasButton =
    document.getElementById(
        "ver_vendas_button"
    );

const salesSection =
    document.getElementById(
        "sales_section"
    );

const fecharVendasButton =
    document.getElementById(
        "fechar_vendas_button"
    );


verVendasButton.addEventListener(
    "click",
    async function () {

        salesSection.style.display =
            "block";

        configurarSeletorAnos();

        configurarSeletorMes();

        const mesAtual =
            Number(
                document.getElementById(
                    "monthly_sales_month"
                ).value
            );

        const anoAtual =
            Number(
                document.getElementById(
                    "monthly_sales_year"
                ).value
            );

        await carregarVendas();

        await carregarProdutosMaisVendidos();

        await carregarFaturamentoMes(
            mesAtual,
            anoAtual
        );

        salesSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// CARREGAR VENDAS DO MÊS ATUAL //


async function carregarVendasMesAtual() {

    try {

        const resposta =
            await fetch(
                "http://127.0.0.1:5000/faturamento-mes"
            );

        const dados =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar as vendas do mês."
            );

        }

        const valor =
            Number(
                dados.faturamento
            );

        const valorFormatado =
            valor
                .toFixed(2)
                .replace(".", ",");

        document.getElementById(
            "total_sales"
        ).textContent =
            `R$ ${valorFormatado}`;

    } catch (erro) {

        console.error(
            "Erro ao carregar vendas do mês:",
            erro
        );

        document.getElementById(
            "total_sales"
        ).textContent =
            "R$ 0,00";

    }

}


// BOTÃO FECHAR VENDAS //


fecharVendasButton.addEventListener(
    "click",
    function () {

        salesSection.style.display =
            "none";

    }
);





// CARREGAR FATURAMENTO DO MÊS //


async function carregarFaturamentoMes(
    mes,
    ano
) {

    try {

        const resposta =
            await fetch(
                `http://127.0.0.1:5000/faturamento-mes?ano=${ano}&mes=${mes}`
            );

        const dados =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o faturamento do mês."
            );

        }

        const valor =
            Number(
                dados.faturamento
            );

        const valorFormatado =
            valor
                .toFixed(2)
                .replace(".", ",");

        document.getElementById(
            "monthly_sales_value"
        ).textContent =
            `R$ ${valorFormatado}`;

        const data =
            new Date(
                dados.ano,
                dados.mes - 1
            );

        const mesFormatado =
            data.toLocaleDateString(
                "pt-BR",
                {
                    month: "long",
                    year: "numeric"
                }
            );

        document.getElementById(
            "monthly_sales_label"
        ).textContent =
            `Faturamento de ${mesFormatado}:`;

    } catch (erro) {

        console.error(
            "Erro ao carregar faturamento do mês:",
            erro
        );

        document.getElementById(
            "monthly_sales_value"
        ).textContent =
            "R$ 0,00";

    }

}


// CONFIGURAR SELETOR DE ANOS


function configurarSeletorAnos() {

    const seletorAno =
        document.getElementById(
            "monthly_sales_year"
        );

    const anoAtual =
        new Date().getFullYear();

    for (
        let ano = anoAtual;
        ano >= anoAtual - 5;
        ano--
    ) {

        const opcao =
            document.createElement(
                "option"
            );

        opcao.value = ano;
        opcao.textContent = ano;

        seletorAno.appendChild(
            opcao
        );

    }

}


// CONFIGURAR SELETOR DE MÊS //


function configurarSeletorMes() {

    const seletorMes =
        document.getElementById(
            "monthly_sales_month"
        );

    const mesAtual =
        new Date().getMonth() + 1;

    seletorMes.value =
        mesAtual;

}


// ALTERAÇÃO DO FILTRO DE FATURAMENTO //


const seletorMes =
    document.getElementById(
        "monthly_sales_month"
    );

const seletorAno =
    document.getElementById(
        "monthly_sales_year"
    );

seletorMes.addEventListener(
    "change",
    function () {

        carregarFaturamentoMes(
            Number(seletorMes.value),
            Number(seletorAno.value)
        );

    }
);

seletorAno.addEventListener(
    "change",
    function () {

        carregarFaturamentoMes(
            Number(seletorMes.value),
            Number(seletorAno.value)
        );

    }
);



// CARREGAR PRODUTOS MAIS VENDIDOS //


async function carregarProdutosMaisVendidos() {

    try {

        const resposta =
            await fetch(
                "http://127.0.0.1:5000/produtos-mais-vendidos"
            );


        const produtos =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar os produtos mais vendidos."
            );

        }


        const tabela =
            document.getElementById(
                "best_selling_table_body"
            );

        
        // LIMPAR TABELA
        tabela.innerHTML = "";

        
        // CASO NÃO EXISTAM PRODUTOS
        

        if (produtos.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="3">
                        Nenhum produto vendido.
                    </td>
                </tr>
            `;

            return;

        }

        
        // PREENCHER TABELA
        

        produtos.forEach(
            function (produto) {

                const linha =
                    document.createElement(
                        "tr"
                    );


                linha.innerHTML = `

                    <td>
                        <strong>
                            #${produto.produto_id}
                        </strong>
                    </td>


                    <td>
                        ${produto.nome_produto}
                    </td>


                    <td>
                        <strong>
                            ${produto.quantidade_vendida}
                        </strong>
                    </td>

                `;


                tabela.appendChild(
                    linha
                );

            }
        );

    }


    catch (erro) {

        console.error(
            "Erro ao carregar produtos mais vendidos:",
            erro
        );


        alert(
            "Não foi possível carregar os produtos mais vendidos."
        );

    }

}

}