const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 1. Define onde o banco será salvo
const dbPath = path.resolve(__dirname, 'database', 'roofing.db');

// 2. Abre a conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao abrir o banco:", err.message);
    } else {
        console.log("Conectado ao banco de dados SQLite.");
    }
});

// 3. Cria as tabelas
db.serialize(() => {
    // Dropamos para atualizar a estrutura com os campos do seu print
    db.run(`DROP TABLE IF EXISTS contractors`);

    db.run(`CREATE TABLE IF NOT EXISTS contractors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_empresa TEXT NOT NULL,
        telefone TEXT,
        numero_licenca TEXT,
        website TEXT,
        email_notificacao TEXT UNIQUE NOT NULL,
        senha TEXT,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_nome TEXT,
        cliente_email TEXT,
        endereco TEXT,
        medicao_area REAL,
        orcamento_estimado REAL,
        status TEXT DEFAULT 'pendente',
        data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log("Tabelas atualizadas com sucesso!");
});

// 4. Fecha a conexão após criar tudo
db.close();