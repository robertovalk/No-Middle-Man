const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// 1. Configurações
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Conexão com o banco de dados
const dbPath = path.resolve(__dirname, 'database', 'roofing.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ ERRO AO ABRIR O BANCO:", err.message);
    } else {
        console.log("✅ Conectado ao banco de dados SQLite");
    }
});

// 3. Rota de Cadastro
app.post('/api/cadastro-contractor', (req, res) => {
    const { nome_empresa, telefone, numero_licenca, email_notificacao, senha } = req.body;
    
    const query = `INSERT INTO contractors (nome_empresa, telefone, numero_licenca, email_notificacao, senha) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [nome_empresa, telefone, numero_licenca, email_notificacao, senha], function(err) {
        if (err) {
            console.error("❌ Erro no SQLite (Cadastro):", err.message);
            return res.status(500).json({ error: "Erro no banco: " + err.message });
        }
        console.log(`✅ Nova empresa cadastrada: ${nome_empresa}`);
        res.status(201).json({ message: "Cadastro realizado com sucesso!", id: this.lastID });
    });
});

// 4. NOVA ROTA: Login
app.post('/api/login-contractor', (req, res) => {
    const { email, senha } = req.body; 

    const query = `SELECT * FROM contractors WHERE email_notificacao = ? AND senha = ?`;

    db.get(query, [email, senha], (err, row) => {
        if (err) {
            console.error("❌ Erro no SQLite (Login):", err.message);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }

        if (row) {
            console.log(`✅ Login bem-sucedido: ${row.nome_empresa}`);
            res.status(200).json({ 
                message: "Login realizado!", 
                contractorId: row.id, 
                nome: row.nome_empresa 
            });
        } else {
            console.log(`⚠️ Tentativa de login inválida para: ${email}`);
            res.status(401).json({ error: "E-mail ou senha incorretos." });
        }
    });
});

// ==========================================
// 🚀 NOVA ROTA: Captura de Leads (Clientes da Calculadora)
// ==========================================
app.post('/api/leads', (req, res) => {
    // 1. Recebe os dados do formulário
    const { nome, email, endereco, cep, telefone, area_sqft, squares, pitch_factor } = req.body;

    // 2. Prepara o SQL com os nomes das colunas NOVAS (conforme seu init_db)
    const sql = `INSERT INTO leads (nome, endereco, cep, telefone, area_sqft, squares, pitch_factor) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    // 3. Executa a gravação
    db.run(sql, [nome, endereco, cep, telefone, area_sqft, squares, pitch_factor], function(err) {
        if (err) {
            console.error('❌ Erro no SQLite (Leads):', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log('✅ SUCESSO! Lead salvo com ID:', this.lastID);
        res.json({ success: true, id: this.lastID });
    });
});

// 5. Ligar o servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});