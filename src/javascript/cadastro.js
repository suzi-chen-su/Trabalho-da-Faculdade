$(document).ready(function() {

    $('#cadastro_form').on('submit', async function(event) {

        event.preventDefault();


        
        // PEGAR DADOS DO FORMULÁRIO
        

        const nome =
            $('#cadastro_nome').val().trim();

        const email =
            $('#cadastro_email').val().trim();

        const telefone =
            $('#cadastro_telefone').val().trim();

        const senha =
            $('#cadastro_senha').val();

        const confirmarSenha =
            $('#cadastro_confirmar_senha').val();


        
        // VALIDAR NOME
        

        if (nome === '') {

            alert('Por favor, informe seu nome.');

            $('#cadastro_nome').focus();

            return;
        }


        if (nome.length < 3) {

            alert(
                'Informe seu nome completo.'
            );

            $('#cadastro_nome').focus();

            return;
        }


        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {

            alert(
                'O nome deve conter apenas letras.'
            );

            $('#cadastro_nome').focus();

            return;
        }


        
        // VALIDAR E-MAIL
        

        if (email === '') {

            alert(
                'Por favor, informe seu e-mail.'
            );

            $('#cadastro_email').focus();

            return;
        }


        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailValido.test(email)) {

            alert(
                'Informe um e-mail válido.'
            );

            $('#cadastro_email').focus();

            return;
        }


        
        // VALIDAR TELEFONE
        

        const telefoneNumeros =
            telefone.replace(/\D/g, '');


        if (
            telefoneNumeros.length !== 10 &&
            telefoneNumeros.length !== 11
        ) {

            alert(
                'Informe um telefone válido.'
            );

            $('#cadastro_telefone').focus();

            return;
        }


        
        // VALIDAR SENHA
        

        if (senha.length < 6) {

            alert(
                'A senha deve possuir pelo menos 6 caracteres.'
            );

            $('#cadastro_senha').focus();

            return;
        }


        
        // CONFIRMAR SENHA
        

        if (senha !== confirmarSenha) {

            alert(
                'As senhas não são iguais.'
            );

            $('#cadastro_confirmar_senha').focus();

            return;
        }


        
        // ENVIAR PARA O BACK-END
        

        try {

            const resposta = await fetch(
                'http://127.0.0.1:5000/usuarios',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        nome: nome,
                        email: email,
                        telefone: telefone,
                        senha: senha
                    
                    })
                }
            );


            const resultado =
                await resposta.json();


            
            // CADASTRO REALIZADO
            

            if (resultado.sucesso) {

                alert(
                    'Cadastro realizado com sucesso! 🧁'
                );

                window.location.href =
                    'login.html';

            }


            
            // E-MAIL JÁ CADASTRADO
            

            else {

                alert(
                    resultado.mensagem
                );

                $('#cadastro_email').focus();

            }

        }

        
        // ERRO DE CONEXÃO
        

        catch (erro) {

            console.error(
                'Erro ao realizar cadastro:',
                erro
            );

            alert(
                'Não foi possível conectar ao servidor. Verifique se o sistema está funcionando.'
            );

        }

    });


    
    // MÁSCARA DE TELEFONE
    

    $('#cadastro_telefone').on(
        'input',
        function() {

            let valor = $(this).val();

            valor = valor.replace(/\D/g, '');

            valor = valor.substring(0, 11);


            if (valor.length > 10) {

                valor = valor.replace(
                    /^(\d{2})(\d{5})(\d{4}).*/,
                    '($1) $2-$3'
                );

            }

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