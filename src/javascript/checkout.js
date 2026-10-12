$(document).ready(function () {

    // RECUPERAR CARRINHO
    

    const cart =
        JSON.parse(localStorage.getItem('cart')) || [];

    const checkoutItems = $('#checkout_items');
    const checkoutTotal = $('#checkout_total strong');

    
    // VERIFICAR SE O CARRINHO ESTÁ VAZIO
    

    if (cart.length === 0) {

        checkoutItems.html(
            '<p>Seu carrinho está vazio.</p>'
        );

        checkoutTotal.text('R$ 0,00');

        return;
    }


    // MOSTRAR PRODUTOS DO CARRINHO
    

    let total = 0;
    let frete = 0;

    cart.forEach(function (item) {

        const preco = Number(item.price);
        const quantidade = Number(item.quantity);

        const subtotal = preco * quantidade;

        total += subtotal;


        checkoutItems.append(`
            <div class="checkout-item">

                <div>

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        ${quantidade} ×
                        R$ ${preco.toFixed(2).replace('.', ',')}
                    </span>

                </div>

                <strong>
                    R$ ${subtotal.toFixed(2).replace('.', ',')}
                </strong>

            </div>
        `);

    });


    // MOSTRAR TOTAL
    

    $('#checkout_subtotal strong').text(
        'R$ ' + total.toFixed(2).replace('.', ',')
    );

    $('#checkout_shipping_value').text(
        'R$ ' + frete.toFixed(2).replace('.', ',')
    );

    checkoutTotal.text(
        'R$ ' + (total + frete).toFixed(2).replace('.', ',')
    );


    // MÁSCARA DO TELEFONE
    

    $('#phone').on('input', function () {

        let valor = $(this).val();

        valor = valor.replace(/\D/g, '');

        valor = valor.substring(0, 11);


        if (valor.length > 10) {

            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{4})/,
                '($1) $2-$3'
            );

        } else if (valor.length > 6) {

            valor = valor.replace(
                /^(\d{2})(\d{4})(\d{0,4})/,
                '($1) $2-$3'
            );

        } else if (valor.length > 2) {

            valor = valor.replace(
                /^(\d{2})(\d+)/,
                '($1) $2'
            );

        }

        $(this).val(valor);

    });

    
    // MÁSCARA DO CEP
    

    $('#cep').on('input', function () {

        let valor = $(this).val();

        valor = valor.replace(/\D/g, '');

        valor = valor.substring(0, 8);

        if (valor.length > 5) {
            valor = valor.replace(
                /^(\d{5})(\d+)/,
                '$1-$2'
            );
        }

        $(this).val(valor);

    });

    
    // CALCULAR FRETE PELO CEP
    

    $('#cep').on('input', function () {

        const cep = $(this).val().replace(/\D/g, '');

        // CEP incompleto
        if (cep.length !== 8) {

            frete = 0;

            $('#shipping_value').text('R$ 0,00');

            $('#checkout_shipping_value').text('R$ 0,00');

            checkoutTotal.text(
                'R$ ' +
                total.toFixed(2).replace('.', ',')
            );

            return;
        }

        const faixa = Number(cep.substring(0, 5));

        if (faixa >= 1000 && faixa <= 19999) {
            frete = 10;
        } else if (faixa >= 20000 && faixa <= 39999) {
            frete = 15;
        } else if (faixa >= 40000 && faixa <= 65999) {
            frete = 25;
        } else if (faixa >= 66000 && faixa <= 69999) {
            frete = 30;
        } else if (faixa >= 70000 && faixa <= 79999) {
            frete = 20;
        } else if (faixa >= 80000 && faixa <= 99999) {
            frete = 18;
        } else {
            frete = 0;
        }

        // Mostrar frete
        $('#shipping_value').text(
            'R$ ' +
            frete.toFixed(2).replace('.', ',')
        );
        $('#checkout_shipping_value').text(
            'R$ ' +
            frete.toFixed(2).replace('.', ',')
        );

        // Atualizar total
        const totalComFrete = total + frete;

        checkoutTotal.text(
            'R$ ' +
            totalComFrete.toFixed(2).replace('.', ',')
        );

    });

    
    // CONFIRMAR PEDIDO
    

    $('#confirm_order').on('click', async function () {

        
        // PEGAR DADOS DO FORMULÁRIO
        

        const nome =
            $('#name').val().trim();

        const telefone =
            $('#phone').val().trim();

        const email =
            $('#email').val().trim();

        const cep =
            $('#cep').val().trim();

        const cidade =
            $('#city').val().trim();

        const estado =
            $('#state').val().trim().toUpperCase();

        const endereco =
            $('#address').val().trim();

        const numero =
            $('#number').val().trim();

        const complemento =
            $('#complement').val().trim();


        
        // VALIDAR NOME
        

        if (nome === '') {

            alert(
                'Por favor, informe seu nome.'
            );

            $('#name').focus();

            return;
        }


        if (nome.length < 3) {

            alert(
                'Por favor, informe seu nome completo.'
            );

            $('#name').focus();

            return;
        }


        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {

            alert(
                'O nome deve conter apenas letras.'
            );

            $('#name').focus();

            return;
        }


        
        // VALIDAR TELEFONE
        

        if (telefone === '') {

            alert(
                'Por favor, informe seu telefone.'
            );

            $('#phone').focus();

            return;
        }


        const telefoneNumeros =
            telefone.replace(/\D/g, '');


        if (
            telefoneNumeros.length !== 10 &&
            telefoneNumeros.length !== 11
        ) {

            alert(
                'Por favor, informe um telefone válido.'
            );

            $('#phone').focus();

            return;
        }


        
        // VALIDAR E-MAIL
        

        if (email === '') {

            alert(
                'Por favor, informe seu e-mail.'
            );

            $('#email').focus();

            return;
        }


        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailValido.test(email)) {

            alert(
                'Por favor, informe um e-mail válido.'
            );

            $('#email').focus();

            return;
        }

        
        // VALIDAR CEP
        

        if (cep === '') {

            alert(
                'Por favor, informe seu CEP.'
            );

            $('#cep').focus();

            return;
        }

        const cepNumeros =
            cep.replace(/\D/g, '');

        if (cepNumeros.length !== 8) {

            alert(
                'Por favor, informe um CEP válido.'
            );

            $('#cep').focus();

            return;
        }

        
        // VALIDAR CIDADE
        

        if (cidade === '') {

            alert(
                'Por favor, informe sua cidade.'
            );

            $('#city').focus();

            return;
        }

        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(cidade)) {

            alert(
                'Por favor, informe uma cidade válida.'
            );

            $('#city').focus();

            return;
        }

        
        // VALIDAR ESTADO
        

        if (estado === '') {

            alert(
                'Por favor, informe seu estado.'
            );

            $('#state').focus();

            return;
        }

        if (!/^[A-Za-z]{2}$/.test(estado)) {

            alert(
                'Informe a sigla do estado com 2 letras. Ex.: SP.'
            );

            $('#state').focus();

            return;
        }

        
        // VALIDAR ENDEREÇO
        

        if (endereco === '') {

            alert(
                'Por favor, informe seu endereço.'
            );

            $('#address').focus();

            return;
        }


        if (endereco.length < 5) {

            alert(
                'Por favor, informe um endereço válido.'
            );

            $('#address').focus();

            return;
        }

        
        // VALIDAR NÚMERO
        

        if (numero === '') {

            alert(
                'Por favor, informe o número do endereço.'
            );

            $('#number').focus();

            return;
        }


        if (!/^\d+[A-Za-z]?$/.test(numero)) {

            alert(
                'Informe um número de endereço válido.'
            );

            $('#number').focus();

            return;
        }

        // VALIDAR FORMA DE PAGAMENTO
        const pagamento = $('input[name="payment"]:checked').val();

        if (!pagamento) {
            alert('Por favor, selecione uma forma de pagamento.');
            $('#payment_method').focus();
            return;
        }

        let parcelas = null;

        if (pagamento === 'Cartão') {

            parcelas =
                $('input[name="installment"]:checked').val();

            if (!parcelas) {

                alert(
                    'Por favor, selecione a quantidade de parcelas.'
                );

                return;
            }
        }


        
        // RECUPERAR USUÁRIO LOGADO
        

        const usuarioLogado =
            JSON.parse(
                localStorage.getItem('usuarioLogado')
            );

        
        // SALVAR DADOS DO CLIENTE
        

        if (usuarioLogado) {

            usuarioLogado.nome = nome;
            usuarioLogado.email = email;
            usuarioLogado.telefone = telefone;
            usuarioLogado.cep = cep;
            usuarioLogado.cidade = cidade;
            usuarioLogado.estado = estado;
            usuarioLogado.endereco = endereco;
            usuarioLogado.numero = numero;
            usuarioLogado.complemento = complemento;


            localStorage.setItem(
                'usuarioLogado',
                JSON.stringify(usuarioLogado)
            );

        }


        
        // CRIAR PEDIDO
        

        const pedido = {

            usuario_id:
                usuarioLogado
                    ? usuarioLogado.id
                    : null,

            cliente: {
                nome: nome,
                telefone: telefone,
                email: email,
                cidade: cidade,
                estado: estado,
                endereco: endereco,
                numero: numero,
                cep: document.getElementById("cep").value,
                complemento: complemento
            },

            itens: cart.map(function (item) {

                return {

                    produto_id: item.id,

                    nome_produto: item.name,

                    preco: Number(item.price),

                    quantidade: Number(item.quantity),

                    subtotal:
                        Number(item.price) *
                        Number(item.quantity)

                };

            }),

            frete: Number(frete),

            total:
                Number(total) +
                Number(frete),

            forma_pagamento: pagamento,

            parcelas: parcelas
        };


        
        // ENVIAR PEDIDO PARA O BACKEND

        try {

            const resposta = await fetch(
                'http://127.0.0.1:5000/pedidos',
                {

                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(pedido)

                }
            );


            const resultado =
                await resposta.json();


            console.log(
                'Resposta do servidor:',
                resultado
            );

            
            // VERIFICAR RESULTADO
            

            if (
                !resposta.ok ||
                !resultado.sucesso
            ) {

                alert(
                    resultado.mensagem ||
                    resultado.erro ||
                    'Não foi possível realizar o pedido.'
                );

                return;
            }


            alert(
                'Pedido confirmado com sucesso! \n\n' +
                'Obrigada pela preferência, ' +
                nome +
                '!'
            );


            
            // LIMPAR CARRINHO
            localStorage.removeItem('cart');


            
            // VOLTAR PARA A PÁGINA INICIAL            
            window.location.href = 'index.html';


        } catch (erro) {

            console.error(
                'Erro ao enviar pedido:',
                erro
            );


            alert(
                'Não foi possível conectar ao servidor.'
            );

        }


        alert(
            'Pedido confirmado com sucesso! \n\n' +
            'Obrigada pela preferência, ' +
            nome +
            '!'
        );


        // LIMPAR CARRINHO   
        localStorage.removeItem('cart');


        // VOLTAR PARA A PÁGINA INICIAL
        window.location.href = 'index.html';

    });

    

// FORMA DE PAGAMENTO E PARCELAMENTO


$('input[name="payment"]').on('change', function () {

    const pagamento = $(this).val();

    if (pagamento === 'Cartão') {

        // Mostrar parcelamento
        $('#installments').slideDown();

        // Calcular valores das parcelas
        if (total + frete <= 10000) {
            $('#installments label').each(function () {

                const parcelas =
                    Number($(this).find('input').val());

                const valorParcela =
                    (total + frete) / parcelas;

                $(this)
                    .find('.installment-value')
                    .text(
                        'R$ ' +
                        valorParcela
                            .toFixed(2)
                            .replace('.', ',')
                    );
            });
        }

    } else {

        // Ocultar parcelamento
        $('#installments').slideUp();

        // Limpar seleção de parcela
        $('input[name="installment"]').prop(
            'checked',
            false
        );

    }

});

// VOLTAR ÀS COMPRAS


$('#back_to_shopping').on('click', function() {

    window.location.href = 'index.html';

});
    
});