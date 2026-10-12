# CONTROLLER - PEDIDO

from models.pedido_model import (
    cadastrar_pedido,
    buscar_pedido_por_id,
    listar_pedidos,
    listar_itens_pedido,
    alterar_status_pedido,
    listar_produtos_mais_vendidos,
    calcular_faturamento_mes
)


# CADASTRAR PEDIDO


def realizar_cadastro_pedido(
    usuario_id,
    nome_cliente,
    email_cliente,
    telefone_cliente,
    endereco,
    numero,
    cep,
    complemento,
    frete,
    total,
    forma_pagamento,
    parcelas,
    itens
):
    """
    Recebe os dados do pedido
    e solicita ao Model o cadastro.
    """

    id_pedido = cadastrar_pedido(
        usuario_id,
        nome_cliente,
        email_cliente,
        telefone_cliente,
        endereco,
        numero,
        cep,
        complemento,
        frete,
        total,
        forma_pagamento,
        parcelas,
        itens
    )

    return {
        "sucesso": True,
        "mensagem": "Pedido cadastrado com sucesso!",
        "id": id_pedido
    }


# BUSCAR PEDIDO


def obter_pedido(id_pedido):
    """
    Busca um pedido pelo ID.
    """

    pedido = buscar_pedido_por_id(
        id_pedido
    )

    return pedido



# LISTAR PEDIDOS


def obter_pedidos():
    """
    Busca todos os pedidos cadastrados.
    """

    pedidos = listar_pedidos()

    return pedidos



# LISTAR ITENS DO PEDIDO


def obter_itens_pedido(id_pedido):
    """
    Busca os itens de um pedido.
    """

    itens = listar_itens_pedido(
        id_pedido
    )

    return itens



# ALTERAR STATUS DO PEDIDO


def realizar_alteracao_status_pedido(
    id_pedido,
    status
):
    """
    Recebe o ID do pedido e o novo status
    e solicita ao Model a alteração.
    """

    pedido = buscar_pedido_por_id(
        id_pedido
    )

    if not pedido:
        return {
            "sucesso": False,
            "mensagem": "Pedido não encontrado."
        }


    linhas_afetadas = alterar_status_pedido(
        id_pedido,
        status
    )


    if linhas_afetadas > 0:

        return {
            "sucesso": True,
            "mensagem": "Status do pedido atualizado com sucesso!"
        }


    return {
        "sucesso": False,
        "mensagem": "Não foi possível alterar o status do pedido."
    }


# OBTER PRODUTOS MAIS VENDIDOS


def obter_produtos_mais_vendidos():

    return listar_produtos_mais_vendidos()


# OBTER FATURAMENTO DO MÊS


def obter_faturamento_mes(ano, mes):

    return calcular_faturamento_mes(
        ano,
        mes
    )