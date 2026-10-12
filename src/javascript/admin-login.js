// LOGIN DO ADMINISTRADOR

const formularioLogin = document.getElementById("admin_login_form");

const mensagemLogin = document.getElementById("login_message");


// CARREGAR E-MAIL SALVO


const emailSalvo = localStorage.getItem("adminEmail");

if (emailSalvo) {
    document.getElementById("admin_email").value = emailSalvo;
}


// ENVIO DO FORMULÁRIO


formularioLogin.addEventListener("submit", async function (event) {

    // Impede o navegador de recarregar a página
    event.preventDefault();


    // Pega os valores digitados
    const email = document.getElementById("admin_email").value;
    const senha = document.getElementById("admin_senha").value;


    // Limpa mensagem anterior
    mensagemLogin.textContent = "";


    try {

        // Envia os dados para o servidor Python
        const resposta = await fetch(
            "http://127.0.0.1:5000/admin/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );


        // Converte a resposta para JSON
        const resultado = await resposta.json();

        
        // LOGIN BEM-SUCEDIDO
        

        if (resultado.sucesso) {

            // Salva somente o e-mail do administrador
            localStorage.setItem("adminEmail", email);

            // Guarda informação de que o administrador
            // está autenticado
            localStorage.setItem("adminLogado", "true");

            mensagemLogin.textContent = resultado.mensagem;
            mensagemLogin.style.color = "green";


            // Aguarda um pequeno instante para
            // mostrar a mensagem e depois redireciona
            setTimeout(function () {

                window.location.href = "admin-dashboard.html";

            }, 800);

        }

        
        // LOGIN INCORRETO
        

        else {

            mensagemLogin.textContent = resultado.mensagem;

            mensagemLogin.style.color = "red";

        }

    }

    catch (erro) {

        console.error("Erro ao realizar login:", erro);

        mensagemLogin.textContent =
            "Não foi possível conectar ao servidor.";

        mensagemLogin.style.color = "red";

    }

});