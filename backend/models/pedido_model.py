# MODEL - PEDIDO

from database.database import conectar


# ----- CADASTRAR PEDIDO -----


def cadastrar_pedido(
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
    Insere um novo pedido no banco de dados
    e cadastra os itens relacionados ao pedido.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    
    # ----- INSERIR PEDIDO -----
    

    cursor.execute("""
        INSERT INTO pedidos (
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
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
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
        "Pedido realizado"
    ))

    # ID do pedido criado
    id_pedido = cursor.lastrowid


    
    # ----- INSERIR ITENS DO PEDIDO -----
    

    for item in itens:

        cursor.execute("""
            INSERT INTO pedido_itens (
                pedido_id,
                produto_id,
                nome_produto,
                preco,
                quantidade,
                subtotal
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            id_pedido,
            item["produto_id"],
            item["nome_produto"],
            item["preco"],
            item["quantidade"],
            item["subtotal"]
        ))


    
    # SALVAR ALTERAÇÕES
    

    conexao.commit()

    conexao.close()

    return id_pedido



# ----- BUSCAR PEDIDO PELO ID -----


def buscar_pedido_por_id(id_pedido):
    conexao = conectar()
    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            id,
            usuario_id,
            nome_cliente,
            email_cliente,
            telefone_cliente,
            endereco,
            numero,
            cep,
            complemento,
            data_pedido,
            frete,
            total,
            forma_pagamento,
            parcelas,
            status
        FROM pedidos
        WHERE id = ?
    """, (id_pedido,))

    pedido = cursor.fetchone()

    conexao.close()

    return pedido



# ----- LISTAR PEDIDOS -----


def listar_pedidos():
    """
    Retorna todos os pedidos cadastrados.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            id,
            usuario_id,
            nome_cliente,
            email_cliente,
            telefone_cliente,
            endereco,
            numero,
            complemento,
            data_pedido,
            frete,
            total,
            forma_pagamento,
            parcelas,
            status
        FROM pedidos
        ORDER BY id DESC
    """)

    pedidos = cursor.fetchall()

    conexao.close()

    return pedidos


# ----- LISTAR ITENS DO PEDIDO -----


def listar_itens_pedido(id_pedido):
    """
    Retorna os itens de um pedido.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            id,
            pedido_id,
            produto_id,
            nome_produto,
            preco,
            quantidade,
            subtotal
        FROM pedido_itens
        WHERE pedido_id = ?
    """, (
        id_pedido,
    ))

    itens = cursor.fetchall()

    conexao.close()

    return itens


# ----- ALTERAR STATUS DO PEDIDO -----


def alterar_status_pedido(
    id_pedido,
    status
):
    """
    Altera o status de um pedido.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        UPDATE pedidos
        SET status = ?
        WHERE id = ?
    """, (
        status,
        id_pedido
    ))

    conexao.commit()

    linhas_afetadas = cursor.rowcount

    conexao.close()

    return linhas_afetadas


# ----- LISTAR PRODUTOS MAIS VENDIDOS -----


def listar_produtos_mais_vendidos():

    conexao = conectar()
    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            pedido_itens.produto_id,
            pedido_itens.nome_produto,
            SUM(pedido_itens.quantidade) AS quantidade_vendida

        FROM pedido_itens

        INNER JOIN pedidos
            ON pedido_itens.pedido_id = pedidos.id

        WHERE pedidos.status != 'Pedido cancelado'

        GROUP BY
            pedido_itens.produto_id,
            pedido_itens.nome_produto

        ORDER BY
            quantidade_vendida DESC
    """)

    produtos = cursor.fetchall()

    conexao.close()

    return produtos


# ----- CALCULAR FATURAMENTO DO MÊS -----

def calcular_faturamento_mes(ano, mes):

    conexao = conectar()
    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            COALESCE(SUM(total), 0) AS faturamento

        FROM pedidos

        WHERE
            strftime('%Y', data_pedido) = ?
            AND strftime('%m', data_pedido) = ?

            AND LOWER(
                TRIM(status)
            ) != 'pedido cancelado'

    """, (
        str(ano),
        f"{mes:02d}"
    ))

    resultado = cursor.fetchone()

    conexao.close()

    return resultado["faturamento"]