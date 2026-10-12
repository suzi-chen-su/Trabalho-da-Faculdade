# ----- MODEL - USUÁRIO -----


from database.database import conectar
from datetime import datetime, timedelta


# ----- CADASTRAR USUÁRIO -----


# ----- CADASTRAR USUÁRIO -----


def cadastrar_usuario(nome, email, telefone, senha_hash):
    """
    Insere um novo usuário no banco de dados.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    data_cadastro = datetime.utcnow() - timedelta(hours=3)

    cursor.execute("""
        INSERT INTO usuarios (
            nome,
            email,
            telefone,
            senha_hash,
            data_cadastro
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        nome,
        email,
        telefone,
        senha_hash,
        data_cadastro.strftime("%Y-%m-%d %H:%M:%S")
    ))

    conexao.commit()

    conexao.close()



# ----- BUSCAR USUÁRIO PELO E-MAIL -----

def buscar_usuario_por_email(email):
    """
    Busca um usuário cadastrado utilizando o e-mail.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            id,
            nome,
            email,
            telefone,
            senha_hash,
            cep,
            cidade,
            estado,
            endereco,
            numero,
            complemento,
            data_cadastro
        FROM usuarios
        WHERE email = ?
    """, (email,))

    usuario = cursor.fetchone()

    conexao.close()

    return usuario



# ----- LISTAR TODOS OS USUÁRIOS -----


def listar_usuarios():
    """
    Retorna todos os usuários cadastrados.
    """

    conexao = conectar()

    cursor = conexao.cursor()

    cursor.execute("""
        SELECT
            id,
            nome,
            email,
            telefone,
            data_cadastro
        FROM usuarios
        ORDER BY id DESC
    """)

    usuarios = cursor.fetchall()

    conexao.close()

    return usuarios

# ----- Atualizar USUÁRIOS -----

def atualizar_usuario(
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
    conexao = conectar()
    cursor = conexao.cursor()

    cursor.execute("""
        UPDATE usuarios
        SET
            nome = ?,
            email = ?,
            telefone = ?,
            cep = ?,
            cidade = ?,
            estado = ?,
            endereco = ?,
            numero = ?,
            complemento = ?
        WHERE id = ?
    """, (
        nome,
        email,
        telefone,
        cep,
        cidade,
        estado,
        endereco,
        numero,
        complemento,
        id_usuario
    ))

    conexao.commit()
    conexao.close()