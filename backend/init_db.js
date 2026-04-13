const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'roofing.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Apaga as tabelas antigas para criar as novas do zero
    db.run(`DROP TABLE IF EXISTS leads`);
    db.run(`DROP TABLE IF EXISTS contractors`);

    // Criando tabela de Empresas
    db.run(`CREATE TABLE contractors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_empresa TEXT NOT NULL,
        telefone TEXT,
        numero_licenca TEXT,
        website TEXT,
        email_notificacao TEXT UNIQUE NOT NULL,
        senha TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Criando tabela de Leads (AGORA COM A COLUNA EMAIL)
    db.run(`CREATE TABLE leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT,           -- Esta é a coluna que estava faltando!
        endereco TEXT,
        cep TEXT,
        telefone TEXT,
        area_sqft REAL,
        squares REAL,
        pitch_factor TEXT,
        contractor_id INTEGER, -- Importante para o seu Dashboard
        status TEXT DEFAULT 'pendente',
        data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contractor_id) REFERENCES contractors (id)
    )`);

    console.log("✅ BANCO DE DADOS RESETADO: Coluna 'email' adicionada com sucesso!");
});

db.close();