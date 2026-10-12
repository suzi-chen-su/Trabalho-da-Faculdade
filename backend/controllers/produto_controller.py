# CONTROLLER - PRODUTO


from models.produto_model import (
    cadastrar_produto,
    buscar_produto_por_id,
    listar_produtos,
    atualizar_produto,
    alterar_status_produto,
    excluir_produto
)


# CADASTRAR PRODUTO


def realizar_cadastro_produto(
    nome,
    descricao,
    preco,
    imagem
):
    """
    Recebe os dados do produto
    e solicita ao Model o cadastro.
    """

    cadastrar_produto(
        nome,
        descricao,
        preco,
        imagem
    )

    return {
        "sucesso": True,
        "mensagem": "Produto cadastrado com sucesso!"
    }



# BUSCAR PRODUTO


def obter_produto(id_produto):
    """
    Busca um produto pelo ID.
    """

    produto = buscar_produto_por_id(
        id_produto
    )

    return produto



# LISTAR PRODUTOS


def obter_produtos():
    """
    Busca todos os produtos cadastrados.
    """

    produtos = listar_produtos()

    return produtos


# ATUALIZAR PRODUTO


def realizar_atualizacao_produto(
    id_produto,
    nome,
    descricao,
    preco,
    imagem
):
    """
    Recebe os dados alterados do produto
    e solicita ao Model a atualização.
    """

    produto = buscar_produto_por_id(
        id_produto
    )

    if not produto:
        return {
            "sucesso": False,
            "mensagem": "Produto não encontrado."
        }

    linhas_afetadas = atualizar_produto(
        id_produto,
        nome,
        descricao,
        preco,
        imagem
    )

    if linhas_afetadas > 0:

        return {
            "sucesso": True,
            "mensagem": "Produto atualizado com sucesso!"
        }

    return {
        "sucesso": False,
        "mensagem": "Não foi possível atualizar o produto."
    }


# ALTERAR STATUS DO PRODUTO


def realizar_alteracao_status_produto(
    id_produto,
    ativo
):
    """
    Recebe o ID do produto e o novo status
    e solicita ao Model a alteração.
    """

    produto = buscar_produto_por_id(
        id_produto
    )

    if not produto:
        return {
            "sucesso": False,
            "mensagem": "Produto não encontrado."
        }

    linhas_afetadas = alterar_status_produto(
        id_produto,
        ativo
    )

    if linhas_afetadas > 0:

        if ativo == 1:
            mensagem = "Produto ativado com sucesso!"
        else:
            mensagem = "Produto desativado com sucesso!"

        return {
            "sucesso": True,
            "mensagem": mensagem
        }

    return {
        "sucesso": False,
        "mensagem": "Não foi possível alterar o status do produto."
    }


# EXCLUIR PRODUTO


def realizar_exclusao_produto(id_produto):
    """
    Recebe o ID do produto
    e solicita ao Model a exclusão.
    """

    produto = buscar_produto_por_id(
        id_produto
    )

    if not produto:
        return {
            "sucesso": False,
            "mensagem": "Produto não encontrado."
        }

    linhas_afetadas = excluir_produto(
        id_produto
    )

    if linhas_afetadas > 0:
        return {
            "sucesso": True,
            "mensagem": "Produto excluído com sucesso!"
        }

    return {
        "sucesso": False,
        "mensagem": "Não foi possível excluir o produto."
    }