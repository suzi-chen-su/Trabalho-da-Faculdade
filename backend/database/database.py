# CONEXÃO COM O BANCO DE DADOS

import sqlite3
import os


# ----- CAMINHO DO BANCO DE DADOS -----


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATABASE = os.path.join(
    BASE_DIR,
    "delicia_cupcakes.db"
)



# ----- CONECTAR AO BANCO -----


def conectar():
    """
    Cria uma conexão com o banco de dados SQLite.
    """

    conexao = sqlite3.connect(DATABASE)

    # Permite acessar as colunas pelo nome
    conexao.row_factory = sqlite3.Row

    return conexao



# ----- CRIAR TABELAS -----


def criar_tabelas():
    """
    Cria as tabelas necessárias para a aplicação.
    """

    conexao = conectar()

    cursor = conexao.cursor()


    # TABELA DE USUÁRIOS
    

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            telefone TEXT NOT NULL,
            senha_hash TEXT NOT NULL,
            data_cadastro TIMESTAMP DEFAULT (datetime('now', '-3 hours'))
        )
    """)


    
    # TABELA DE PRODUTOS
    

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            preco REAL NOT NULL,
            imagem TEXT,
            ativo INTEGER DEFAULT 1
        )
    """)


    # TABELA DE PEDIDOS
    

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            nome_cliente TEXT NOT NULL,
            email_cliente TEXT NOT NULL,
            telefone_cliente TEXT NOT NULL,
            endereco TEXT NOT NULL,
            numero TEXT NOT NULL,
            complemento TEXT,
            data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            frete REAL NOT NULL DEFAULT 0,
            total REAL NOT NULL,
            forma_pagamento TEXT NOT NULL,
            parcelas INTEGER,
            status TEXT NOT NULL DEFAULT 'Pedido realizado',

            FOREIGN KEY (usuario_id)
                REFERENCES usuarios(id)
        )
    """)


    
    # TABELA DE ITENS DO PEDIDO
    

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pedido_itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER NOT NULL,
            produto_id INTEGER,
            nome_produto TEXT NOT NULL,
            preco REAL NOT NULL,
            quantidade INTEGER NOT NULL,
            subtotal REAL NOT NULL,

            FOREIGN KEY (pedido_id)
                REFERENCES pedidos(id),

            FOREIGN KEY (produto_id)
                REFERENCES produtos(id)
        )
    """)


    
    # SALVAR ALTERAÇÕES
    

    conexao.commit()

    conexao.close()