// LOGIN DO USUÁRIO

$(document).ready(function() {

    $('#login_form').on('submit', async function(event) {

        event.preventDefault();

        
        // RECUPERAR DADOS DO FORMULÁRIO
        

        const email =
            $('#login_email').val().trim();

        const senha =
            $('#login_senha').val();

        
        // VALIDAR E-MAIL
        

        if (email === '') {

            alert(
                'Por favor, informe seu e-mail.'
            );

            $('#login_email').focus();

            return;
        }

        
        // VALIDAR SENHA
        

        if (senha === '') {

            alert(
                'Por favor, informe sua senha.'
            );

            $('#login_senha').focus();

            return;
        }

        
        // ENVIAR LOGIN PARA O BACK-END
        

        try {

            const resposta = await fetch(
                'http://127.0.0.1:5000/usuarios/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            );

            
            // CONVERTER RESPOSTA
            

            const resultado =
                await resposta.json();


            
            // LOGIN INVÁLIDO
            

            if (!resultado.sucesso) {

                alert(
                    resultado.mensagem
                );

                return;
            }


            
            // SALVAR USUÁRIO LOGADO
            localStorage.setItem(
                'usuarioLogado',
                JSON.stringify(resultado.usuario)
            );

            
            // LOGIN REALIZADO
            

            alert(
                'Login realizado com sucesso!'
            );


            // VERIFICAR PARA ONDE O USUÁRIO DEVE IR
            

            const voltarParaCheckout =
                sessionStorage.getItem(
                    'voltarParaCheckout'
                );

            
            // REDIRECIONAMENTO
            

            if (voltarParaCheckout === 'true') {

                sessionStorage.removeItem(
                    'voltarParaCheckout'
                );

                window.location.href =
                    'checkout.html';

            } else {

                window.location.href =
                    'index.html';

            }

        }

        
        // ERRO DE CONEXÃO
        

        catch (erro) {

            console.error(
                'Erro ao realizar login:',
                erro
            );

            alert(
                'Não foi possível conectar ao servidor. ' +
                'Verifique se o sistema está funcionando.'
            );

        }

    });

});