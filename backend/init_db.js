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
    // ⚠️ Atenção: Isso apaga os dados atuais de contractors para resetar a estrutura
    db.run(`DROP TABLE IF EXISTS contractors`);

    // Tabela de Empresas (Contractors)
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

    // Tabela de Leads (Clientes da Calculadora)
    // Atualizada para bater com o seu formulário e dados técnicos do mapa
    db.run(`CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,              -- Nome do cliente (do formulário)
        endereco TEXT,          -- Endereço (capturado do geocoder)
        cep TEXT,               -- Zip Code (do formulário)
        telefone TEXT,          -- Telefone (do formulário)
        area_sqft REAL,         -- Área final calculada (com inclinação)
        squares REAL,           -- Valor em Roofing Squares
        pitch_factor TEXT,      -- Inclinação escolhida (ex: 1.08)
        contractor_id INTEGER,  -- ID da empresa escolhida (Etapa futura)
        status TEXT DEFAULT 'pendente',
        data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contractor_id) REFERENCES contractors (id)
    )`);

    console.log("✅ Tabelas de Contractors e Leads atualizadas com sucesso!");
});

// 4. Fecha a conexão após criar tudo
db.close();