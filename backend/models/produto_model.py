# ----- MODEL - PRODUTO -----

from database.database import conectar

import os
from werkzeug.utils import secure_filename


# ----- CADASTRAR PRODUTO -----


def cadastrar_produto(nome, descricao, preco, imagem):
    """
    Salva a imagem na pasta src/images
    e insere o novo produto no banco de dados.
    """

    # Caminho da pasta src/images
    pasta_imagens = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "src",
            "images"
        )
    )

    # Cria a pasta caso ela não exista
    os.makedirs(
        pasta_imagens,
        exist_ok=True
    )

    # Protege o nome do arquivo
    nome_arquivo = secure_filename(
        imagem.filename
    )

    # Caminho completo onde a imagem será salva
    caminho_imagem = os.path.join(
        pasta_imagens,
        nome_arquivo
    )

    # Salva a imagem no computador
    imagem.save(
        caminho_imagem
    )

    # Caminho que será armazenado no banco
    caminho_banco = (
        "src/images/"
        + nome_arquivo
    )

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        INSERT INTO produtos (
            nome,
            descricao,
            preco,
            imagem
        )
        VALUES (?, ?, ?, ?)
    """, (
        nome,
        descricao,
        preco,
        caminho_banco
    ))

    conexao.commit()

    conexao.close()



# ----- BUSCAR PRODUTO PELO ID -----

def buscar_produto_por_id(id_produto):
    """
    Busca um produto utilizando seu ID.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            id,
            nome,
            descricao,
            preco,
            imagem,
            ativo            
        FROM produtos
        WHERE id = ?
    """, (id_produto,))

    produto = cursor.fetchone()

    conexao.close()

    return produto


# ----- LISTAR PRODUTOS -----


def listar_produtos():
    """
    Retorna todos os produtos cadastrados.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            id,
            nome,
            descricao,
            preco,
            imagem,
            ativo
        FROM produtos
        ORDER BY id DESC
    """)

    produtos = cursor.fetchall()

    conexao.close()

    return produtos


# ----- ATUALIZAR PRODUTO -----

def atualizar_produto(
    id_produto,
    nome,
    descricao,
    preco,
    imagem
):
    """
    Atualiza os dados de um produto.

    Se uma nova imagem for enviada,
    ela será salva na pasta src/images
    e seu caminho será atualizado no banco.

    Se nenhuma nova imagem for enviada,
    a imagem atual será mantida.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    # Busca a imagem atual do produto
    cursor.execute("""
        SELECT imagem
        FROM produtos
        WHERE id = ?
    """, (id_produto,))

    produto = cursor.fetchone()

    if not produto:
        conexao.close()
        return 0

    imagem_atual = produto["imagem"]

    # Se uma nova imagem foi enviada
    if imagem:

        pasta_imagens = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__),
                "..",
                "..",
                "src",
                "images"
            )
        )

        os.makedirs(
            pasta_imagens,
            exist_ok=True
        )

        nome_arquivo = secure_filename(
            imagem.filename
        )

        caminho_imagem = os.path.join(
            pasta_imagens,
            nome_arquivo
        )

        imagem.save(
            caminho_imagem
        )

        caminho_banco = (
            "src/images/"
            + nome_arquivo
        )

    else:

        # Mantém a imagem que já estava cadastrada
        caminho_banco = imagem_atual

    cursor.execute("""
        UPDATE produtos
        SET
            nome = ?,
            descricao = ?,
            preco = ?,
            imagem = ?
        WHERE id = ?
    """, (
        nome,
        descricao,
        preco,
        caminho_banco,
        id_produto
    ))

    conexao.commit()

    linhas_afetadas = cursor.rowcount

    conexao.close()

    return linhas_afetadas


# ----- ALTERAR STATUS DO PRODUTO -----

def alterar_status_produto(id_produto, ativo):
    """
    Altera o status de um produto.
    
    ativo = 1 → produto ativo
    ativo = 0 → produto inativo
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        UPDATE produtos
        SET ativo = ?
        WHERE id = ?
    """, (
        ativo,
        id_produto
    ))

    conexao.commit()

    linhas_afetadas = cursor.rowcount

    conexao.close()

    return linhas_afetadas


# ----- EXCLUIR PRODUTO -----


def excluir_produto(id_produto):
    """
    Exclui um produto utilizando seu ID.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        DELETE FROM produtos
        WHERE id = ?
    """, (
        id_produto,
    ))

    conexao.commit()

    linhas_afetadas = cursor.rowcount

    conexao.close()

    return linhas_afetadas