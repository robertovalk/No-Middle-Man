const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Configurações
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o banco de dados
const dbPath = path.resolve(__dirname, 'database', 'roofing.db');
const db = new sqlite3.Database(dbPath);

// Rota para receber o cadastro do contractor
// Rota para cadastrar Contractors
app.post('/api/register-contractor', (req, res) => {
    const { nome_empresa, telefone, numero_licenca, website, email_notificacao, senha } = req.body;

    const query = `INSERT INTO contractors (nome_empresa, telefone, numero_licenca, website, email_notificacao, senha) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(query, [nome_empresa, telefone, numero_licenca, website, email_notificacao, senha], function(err) {
        if (err) {
            console.error("Erro ao inserir no SQLite:", err.message);
            return res.status(500).json({ error: "Erro ao salvar no banco de dados." });
        }
        console.log(`Sucesso! Contractor ${nome_empresa} salvo com ID: ${this.lastID}`);
        res.status(200).json({ message: "Cadastro realizado com sucesso!" });
    });
});

// Ligar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});