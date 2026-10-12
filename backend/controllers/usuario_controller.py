# CONTROLLER - USUÁRIO


from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from models.usuario_model import (
    cadastrar_usuario,
    buscar_usuario_por_email,
    listar_usuarios,
    atualizar_usuario
)



# CADASTRAR USUÁRIO


def realizar_cadastro(nome, email, telefone, senha):
    """
    Recebe os dados do cadastro,
    verifica se o e-mail já existe
    e solicita ao Model o cadastro.
    """

    # Verifica se já existe um usuário
    usuario_existente = buscar_usuario_por_email(email)

    if usuario_existente:
        return {
            "sucesso": False,
            "mensagem": "Este e-mail já está cadastrado."
        }


    # Cria o hash da senha
    senha_hash = generate_password_hash(senha)


    # Envia os dados para o Model
    cadastrar_usuario(
        nome,
        email,
        telefone,
        senha_hash
    )


    return {
        "sucesso": True,
        "mensagem": "Cadastro realizado com sucesso!"
    }


 
# LISTAR USUÁRIOS


def obter_usuarios():
    """
    Busca todos os usuários cadastrados.
    """

    usuarios = listar_usuarios()

    return usuarios


# REALIZAR LOGIN DO USUÁRIO


def realizar_login_usuario(email, senha):
    """
    Verifica o e-mail e a senha do usuário.
    """

    usuario = buscar_usuario_por_email(email)

    # Usuário não encontrado
    if not usuario:
        return {
            "sucesso": False,
            "mensagem": "E-mail ou senha incorretos."
        }


    # Verifica a senha utilizando o hash
    senha_correta = check_password_hash(
        usuario["senha_hash"],
        senha
    )


    if not senha_correta:
        return {
            "sucesso": False,
            "mensagem": "E-mail ou senha incorretos."
        }


    return {
        "sucesso": True,
        "mensagem": "Login realizado com sucesso!",
        "usuario": {
            "id": usuario["id"],
            "nome": usuario["nome"],
            "email": usuario["email"],
            "telefone": usuario["telefone"],
            "cep": usuario["cep"],
            "cidade": usuario["cidade"],
            "estado": usuario["estado"],
            "endereco": usuario["endereco"],
            "numero": usuario["numero"],
            "complemento": usuario["complemento"]
        }
    }


# ATUALIZAR USUÁRIO


def realizar_atualizacao_usuario(
    id_usuario,
    nome,
    email,
    telefone,
    cep,
    cidade,
    estado,
    endereco,
    numero,
    complemento
):
    """
    Atualiza os dados de um usuário existente.
    """

    atualizar_usuario(
        id_usuario,
        nome,
        email,
        telefone,
        cep,
        cidade,
        estado,
        endereco,
        numero,
        complemento
    )

    return {
        "sucesso": True,
        "mensagem": "Dados atualizados com sucesso!"
    }