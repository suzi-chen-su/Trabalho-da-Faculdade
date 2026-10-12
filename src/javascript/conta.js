$(document).ready(function() {
    
    // RECUPERAR USUÁRIO LOGADO
    

    const usuarioLogado =
        JSON.parse(
            localStorage.getItem('usuarioLogado')
        );


    // VERIFICAR LOGIN
    

    if (!usuarioLogado) {

        alert(
            'Você precisa estar logado para acessar sua conta.'
        );

        window.location.href = 'login.html';

        return;
    }

    
    // MÁSCARA DO CEP
    

    $('#account_cep').on('input', function() {

        let cep = $(this).val();

        // Remove tudo que não for número
        cep = cep.replace(/\D/g, '');

        // Limita para 8 números
        cep = cep.substring(0, 8);

        // Adiciona o hífen depois dos 5 primeiros números
        if (cep.length > 5) {
            cep = cep.substring(0, 5) + '-' + cep.substring(5);
        }

        // Coloca o valor formatado no campo
        $(this).val(cep);
    });


    
    // MOSTRAR DADOS DO USUÁRIO
    

    $('#account_name').val(
        usuarioLogado.nome || ''
    );

    $('#account_email').val(
        usuarioLogado.email || ''
    );

    $('#account_phone').val(
        usuarioLogado.telefone || ''
    );

    $('#account_cep').val(
        usuarioLogado.cep || ''
    );

    $('#account_city').val(
        usuarioLogado.cidade || ''
    );

    $('#account_state').val(
        usuarioLogado.estado || ''
    );

    $('#account_address').val(
        usuarioLogado.endereco || ''
    );

    $('#account_number').val(
        usuarioLogado.numero || ''
    );

    $('#account_complement').val(
        usuarioLogado.complemento || ''
    );


    
    // EDITAR DADOS
    

    $('#edit_account').on('click', function() {

        // Libera os campos

        $('#account_name').prop(
            'disabled',
            false
        );

        $('#account_email').prop(
            'disabled',
            false
        );

        $('#account_phone').prop(
            'disabled',
            false
        );

        $('#account_cep').prop(
            'disabled',
            false
        );

        $('#account_city').prop(
            'disabled',
            false
        );

        $('#account_state').prop(
            'disabled',
            false
        );        

        $('#account_address').prop(
            'disabled',
            false
        );

        $('#account_number').prop(
            'disabled',
            false
        );

        $('#account_complement').prop(
            'disabled',
            false
        );


        // Troca os botões

        $('#edit_account').hide();

        $('#save_account').show();

    }); 


    
    // SALVAR ALTERAÇÕES
    

    $('#save_account').on('click', async function() {

        // Recupera os novos dados

        const nome =
            $('#account_name').val().trim();

        const email =
            $('#account_email').val().trim();

        const telefone =
            $('#account_phone').val().trim();

        const cep =
            $('#account_cep').val().trim();

        const cidade =
            $('#account_city').val().trim();

        const estado =
            $('#account_state').val().trim().toUpperCase();            

        const endereco =
            $('#account_address').val().trim();

        const numero =
            $('#account_number').val().trim();

        const complemento =
            $('#account_complement').val().trim();


        
        // VALIDAÇÃO DO NOME
        

        if (nome.length < 3) {

            alert(
                'Informe um nome válido.'
            );

            $('#account_name').focus();

            return;
        }


        
        // VALIDAÇÃO DO E-MAIL
        

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValido.test(email)) {

            alert(
                'Informe um e-mail válido.'
            );

            $('#account_email').focus();

            return;
        }


        
        // VALIDAÇÃO DO TELEFONE
        

        const telefoneNumeros =
            telefone.replace(/\D/g, '');

        if (
            telefoneNumeros.length !== 10 &&
            telefoneNumeros.length !== 11
        ) {

            alert(
                'Informe um telefone válido.'
            );

            $('#account_phone').focus();

            return;
        }

        
        // VALIDAÇÃO DO CEP
        

        if (cep === '') {

            alert(
                'Informe seu CEP.'
            );

            $('#account_cep').focus();

            return;
        }

        const cepNumeros =
            cep.replace(/\D/g, '');

        if (cepNumeros.length !== 8) {

            alert(
                'Informe um CEP válido.'
            );

            $('#account_cep').focus();

            return;
        }
        

        // VALIDAÇÃO DA CIDADE
        

        if (cidade === '') {

            alert(
                'Informe sua cidade.'
            );

            $('#account_city').focus();

            return;
        }

        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(cidade)) {

            alert(
                'Informe uma cidade válida.'
            );

            $('#account_city').focus();

            return;
        }

        
        // VALIDAÇÃO DO ESTADO
        

        if (estado === '') {

            alert(
                'Informe seu estado.'
            );

            $('#account_state').focus();

            return;
        }

        if (!/^[A-Za-z]{2}$/.test(estado)) {

            alert(
                'Informe a sigla do estado com 2 letras. Ex.: SP.'
            );

            $('#account_state').focus();

            return;
        }        

        
        // VALIDAÇÃO DO ENDEREÇO
        

        if (endereco.length < 5) {

            alert(
                'Informe um endereço válido.'
            );

            $('#account_address').focus();

            return;
        }


        
        // VALIDAÇÃO DO NÚMERO
        

        if (numero === '') {

            alert(
                'Informe o número do endereço.'
            );

            $('#account_number').focus();

            return;
        }


        if (!/^\d+[A-Za-z]?$/.test(numero)) {

            alert(
                'Informe um número de endereço válido.'
            );

            $('#account_number').focus();

            return;
        }


        // ATUALIZAR USUÁRIO NO BANCO DE DADOS
        

        try {

            const resposta = await fetch(
                `http://127.0.0.1:5000/usuarios/${usuarioLogado.id}`,
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        nome: nome,
                        email: email,
                        telefone: telefone,
                        cep: cep,
                        cidade: cidade,
                        estado: estado,
                        endereco: endereco,
                        numero: numero,
                        complemento: complemento
                    })
                }
            );

            const resultado = await resposta.json();

            if (!resultado.sucesso) {

                alert(
                    resultado.mensagem ||
                    'Não foi possível atualizar seus dados.'
                );

                return;
            }

            
            // ATUALIZAR USUÁRIO LOGADO
            

            usuarioLogado.nome = nome;
            usuarioLogado.email = email;
            usuarioLogado.telefone = telefone;
            usuarioLogado.cep = cep;
            usuarioLogado.cidade = cidade;
            usuarioLogado.estado = estado;
            usuarioLogado.endereco = endereco;
            usuarioLogado.numero = numero;
            usuarioLogado.complemento = complemento;


            
            // ATUALIZAR LOCALSTORAGE

            localStorage.setItem(
                'usuarioLogado',
                JSON.stringify(usuarioLogado)
            );


            
            // BLOQUEAR OS CAMPOS NOVAMENTE
            

            $('.account-field input').prop(
                'disabled',
                true
            );


            // Troca os botões

            $('#save_account').hide();

            $('#edit_account').show();


            
            // MENSAGEM DE SUCESSO
            alert(
                'Dados atualizados com sucesso!'
            );

        } catch (erro) {

            console.error(
                'Erro ao atualizar usuário:',
                erro
            );

            alert(
                'Não foi possível atualizar seus dados. Verifique se o servidor está funcionando.'
            );

        }
        

        // BLOQUEAR OS CAMPOS NOVAMENTE
        

        $('.account-field input').prop(
            'disabled',
            true
        );


        // Troca os botões

        $('#save_account').hide();

        $('#edit_account').show();

        
        // MENSAGEM DE SUCESSO
        alert(
            'Dados atualizados com sucesso!'
        );

    });


    
    // MÁSCARA DE TELEFONE


    $('#account_phone').on(
        'input',
        function() {

            let valor = $(this).val();

            // Remove tudo que não for número

            valor = valor.replace(/\D/g, '');

            // Limita a 11 números

            valor = valor.substring(0, 11);


            // Celular

            if (valor.length > 10) {

                valor = valor.replace(
                    /^(\d{2})(\d{5})(\d{4}).*/,
                    '($1) $2-$3'
                );

            }

            // Telefone fixo

            else if (valor.length > 6) {

                valor = valor.replace(
                    /^(\d{2})(\d{4})(\d{0,4}).*/,
                    '($1) $2-$3'
                );

            }

            else if (valor.length > 2) {

                valor = valor.replace(
                    /^(\d{2})(\d+)/,
                    '($1) $2'
                );

            }


            $(this).val(valor);

        }
    );
    
    

});