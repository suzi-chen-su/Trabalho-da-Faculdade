# CONTROLLER - AUTENTICAÇÃO

from models.admin_model import verificar_admin


def realizar_login(email, senha):
    """
    Recebe os dados de login e solicita
    ao Model a validação do administrador.
    """

    if verificar_admin(email, senha):
        return {
            "sucesso": True,
            "mensagem": "Login realizado com sucesso!"
        }

    return {
        "sucesso": False,
        "mensagem": "E-mail ou senha inválidos."
    }