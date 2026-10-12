# ..... APLICAÇÃO - DELÍCIA DE CUPCAKES .....

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

import os

from controllers.auth_controller import realizar_login

from controllers.usuario_controller import (
    realizar_cadastro,
    realizar_login_usuario,
    obter_usuarios,
    realizar_atualizacao_usuario
)

from controllers.produto_controller import (
    realizar_cadastro_produto,
    obter_produtos,
    realizar_atualizacao_produto,
    realizar_alteracao_status_produto,
    realizar_exclusao_produto
)

from controllers.pedido_controller import (
    realizar_cadastro_pedido,
    obter_pedidos,
    obter_pedido,
    obter_itens_pedido,
    realizar_alteracao_status_pedido,
    obter_produtos_mais_vendidos,
    obter_faturamento_mes
)


app = Flask(__name__)

CORS(app)


# ..... SERVIR IMAGENS DOS PRODUTOS .....


@app.route("/imagens/<nome_arquivo>")
def servir_imagem(nome_arquivo):

    pasta_imagens = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "src",
            "images"
        )
    )

    return send_from_directory(
        pasta_imagens,
        nome_arquivo
    )


# ..... ROTA DE LOGIN DO ADMINISTRADOR .....

@app.route("/admin/login", methods=["POST"])
def admin_login():

    dados = request.get_json()

    email = dados.get("email")
    senha = dados.get("senha")

    resultado = realizar_login(email, senha)

    return jsonify(resultado)


# ..... ROTA DE CADASTRO DE USUÁRIO .....

@app.route("/usuarios", methods=["POST"])
def cadastrar_novo_usuario():

    dados = request.get_json()

    nome = dados.get("nome")
    email = dados.get("email")
    telefone = dados.get("telefone")
    senha = dados.get("senha")

    resultado = realizar_cadastro(
        nome,
        email,
        telefone,
        senha
    )

    return jsonify(resultado)


# ..... ROTA DE LOGIN DO USUÁRIO .....

@app.route("/usuarios/login", methods=["POST"])
def login_usuario():

    dados = request.get_json()

    email = dados.get("email")
    senha = dados.get("senha")

    resultado = realizar_login_usuario(
        email,
        senha
    )

    return jsonify(resultado)


# ..... ATUALIZAR USUÁRIO .....

@app.route("/usuarios/<int:id_usuario>", methods=["PUT"])
def atualizar_usuario_cadastrado(id_usuario):

    dados = request.get_json()

    nome = dados.get("nome")
    email = dados.get("email")
    telefone = dados.get("telefone")
    cep = dados.get("cep")
    cidade = dados.get("cidade")
    estado = dados.get("estado")
    endereco = dados.get("endereco")
    numero = dados.get("numero")
    complemento = dados.get("complemento")

    resultado = realizar_atualizacao_usuario(
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

    return jsonify(resultado)


# ..... LISTAR USUÁRIOS .....

@app.route("/usuarios", methods=["GET"])
def listar_usuarios_cadastrados():

    usuarios = obter_usuarios()

    lista_usuarios = []

    for usuario in usuarios:

        lista_usuarios.append({
            "id": usuario["id"],
            "nome": usuario["nome"],
            "email": usuario["email"],
            "telefone": usuario["telefone"],
            "data_cadastro": usuario["data_cadastro"]
        })

    return jsonify(lista_usuarios)
    


# ..... CADASTRAR PRODUTO .....

@app.route("/produtos", methods=["POST"])
def cadastrar_novo_produto():

    nome = request.form.get("nome")
    descricao = request.form.get("descricao")
    preco = request.form.get("preco")

    imagem = request.files.get("imagem")

    if not imagem:
        return jsonify({
            "sucesso": False,
            "mensagem": "Imagem não enviada."
        })

    resultado = realizar_cadastro_produto(
        nome,
        descricao,
        preco,
        imagem
    )

    return jsonify(resultado)


# ..... LISTAR PRODUTOS .....

@app.route("/produtos", methods=["GET"])
def listar_produtos_cadastrados():

    produtos = obter_produtos()

    lista_produtos = []

    for produto in produtos:

        lista_produtos.append({
            "id": produto["id"],
            "nome": produto["nome"],
            "descricao": produto["descricao"],
            "preco": produto["preco"],
            "imagem": produto["imagem"],
            "ativo": produto["ativo"],
            "data_cadastro": produto["data_cadastro"]
        })

    return jsonify(lista_produtos)


# ..... ATUALIZAR PRODUTO .....

@app.route("/produtos/<int:id_produto>", methods=["PUT"])
def atualizar_produto_cadastrado(id_produto):

    nome = request.form.get("nome")
    descricao = request.form.get("descricao")
    preco = request.form.get("preco")
    imagem = request.files.get("imagem")

    resultado = realizar_atualizacao_produto(
        id_produto,
        nome,
        descricao,
        preco,
        imagem
    )

    return jsonify(resultado)


# ..... ALTERAR STATUS DO PRODUTO .....

@app.route("/produtos/<int:id_produto>/status", methods=["PUT"])
def alterar_status_produto_cadastrado(id_produto):

    dados = request.get_json()

    ativo = dados.get("ativo")

    resultado = realizar_alteracao_status_produto(
        id_produto,
        ativo
    )

    return jsonify(resultado)


# ..... EXCLUIR PRODUTO .....

@app.route("/produtos/<int:id_produto>", methods=["DELETE"])
def excluir_produto_cadastrado(id_produto):

    resultado = realizar_exclusao_produto(
        id_produto
    )

    return jsonify(resultado)


# ..... CADASTRAR PEDIDO .....

@app.route("/pedidos", methods=["POST"])
def cadastrar_novo_pedido():

    dados = request.get_json()

    if not dados:
        return jsonify({
            "sucesso": False,
            "mensagem": "Nenhum dado foi enviado."
        })


    cliente = dados.get("cliente")
    itens = dados.get("itens")


    if not cliente:
        return jsonify({
            "sucesso": False,
            "mensagem": "Os dados do cliente são obrigatórios."
        })


    if not itens:
        return jsonify({
            "sucesso": False,
            "mensagem": "O pedido precisa possuir pelo menos um item."
        })


    usuario_id = dados.get("usuario_id")

    nome_cliente = cliente.get("nome")
    email_cliente = cliente.get("email")
    telefone_cliente = cliente.get("telefone")
    endereco = cliente.get("endereco")
    numero = cliente.get("numero")
    cep = cliente.get("cep")
    complemento = cliente.get("complemento")

    frete = dados.get("frete", 0)
    total = dados.get("total", 0)

    forma_pagamento = dados.get("forma_pagamento")
    parcelas = dados.get("parcelas")


    resultado = realizar_cadastro_pedido(
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


    return jsonify(resultado)


# ..... LISTAR PEDIDOS .....


@app.route("/pedidos", methods=["GET"])
def listar_pedidos_cadastrados():

    pedidos = obter_pedidos()

    lista_pedidos = []


    for pedido in pedidos:

        lista_pedidos.append({

            "id": pedido["id"],
            "usuario_id": pedido["usuario_id"],
            "nome_cliente": pedido["nome_cliente"],
            "email_cliente": pedido["email_cliente"],
            "telefone_cliente": pedido["telefone_cliente"],
            "endereco": pedido["endereco"],
            "numero": pedido["numero"],
            "complemento": pedido["complemento"],
            "data_pedido": pedido["data_pedido"],
            "frete": pedido["frete"],
            "total": pedido["total"],
            "forma_pagamento": pedido["forma_pagamento"],
            "parcelas": pedido["parcelas"],
            "status": pedido["status"]

        })


    return jsonify(lista_pedidos)


# ..... BUSCAR PEDIDO .....


@app.route("/pedidos/<int:id_pedido>", methods=["GET"])
def buscar_pedido_cadastrado(id_pedido):

    pedido = obter_pedido(
        id_pedido
    )


    if not pedido:

        return jsonify({
            "sucesso": False,
            "mensagem": "Pedido não encontrado."
        })


    itens = obter_itens_pedido(
        id_pedido
    )


    lista_itens = []


    for item in itens:

        lista_itens.append({

            "id": item["id"],
            "pedido_id": item["pedido_id"],
            "produto_id": item["produto_id"],
            "nome_produto": item["nome_produto"],
            "preco": item["preco"],
            "quantidade": item["quantidade"],
            "subtotal": item["subtotal"]

        })


    resultado = {

        "id": pedido["id"],
        "usuario_id": pedido["usuario_id"],
        "nome_cliente": pedido["nome_cliente"],
        "email_cliente": pedido["email_cliente"],
        "telefone_cliente": pedido["telefone_cliente"],
        "endereco": pedido["endereco"],
        "numero": pedido["numero"],
        "cep": pedido["cep"],
        "complemento": pedido["complemento"],
        "data_pedido": pedido["data_pedido"],
        "frete": pedido["frete"],
        "total": pedido["total"],
        "forma_pagamento": pedido["forma_pagamento"],
        "parcelas": pedido["parcelas"],
        "status": pedido["status"],
        "itens": lista_itens

    }


    return jsonify(resultado)


# ..... ALTERAR STATUS DO PEDIDO .....


@app.route("/pedidos/<int:id_pedido>/status", methods=["PUT"])
def alterar_status_pedido_cadastrado(id_pedido):

    dados = request.get_json()

    if not dados:

        return jsonify({
            "sucesso": False,
            "mensagem": "Nenhum dado foi enviado."
        })


    status = dados.get("status")


    if not status:

        return jsonify({
            "sucesso": False,
            "mensagem": "O status é obrigatório."
        })


    resultado = realizar_alteracao_status_pedido(
        id_pedido,
        status
    )


    return jsonify(resultado)


# ..... PRODUTOS MAIS VENDIDOS .....

@app.route("/produtos-mais-vendidos", methods=["GET"])
def listar_produtos_mais_vendidos_cadastrados():

    produtos = obter_produtos_mais_vendidos()

    lista_produtos = []

    for produto in produtos:

        lista_produtos.append({
            "produto_id": produto["produto_id"],
            "nome_produto": produto["nome_produto"],
            "quantidade_vendida": produto["quantidade_vendida"]
        })

    return jsonify(lista_produtos)


# ..... FATURAMENTO DO MÊS .....
 

@app.route("/faturamento-mes", methods=["GET"])
def consultar_faturamento_mes():

    from datetime import datetime

    data_atual = datetime.now()

    ano = request.args.get(
        "ano",
        default=data_atual.year,
        type=int
    )

    mes = request.args.get(
        "mes",
        default=data_atual.month,
        type=int
    )

    faturamento = obter_faturamento_mes(
        ano,
        mes
    )

    return jsonify({
        "ano": ano,
        "mes": mes,
        "faturamento": faturamento
    })

# ..... INICIAR SERVIDOR .....

if __name__ == "__main__":
    app.run(debug=True)
