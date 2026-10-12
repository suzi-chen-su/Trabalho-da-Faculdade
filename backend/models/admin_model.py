# MODEL - ADMINISTRADOR

ADMIN_EMAIL = "admin@deliciadecupcakes.com"
ADMIN_SENHA = "Admin123"


def verificar_admin(email, senha):
    """
    Verifica se o e-mail e a senha
    pertencem ao administrador.
    """

    if email == ADMIN_EMAIL and senha == ADMIN_SENHA:
        return True

    return False