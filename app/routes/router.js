
const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


router.get("/", function (req, res) {
    
    res.render("pages/formulario", {
        erros: [],
        valores: {
            nome: "",
            email: "",
            telefone: "",
            assunto: "",
            mensagem: ""
        },
        retorno: null
    });
});


router.post(
    "/formulario",

    body("nome")
        .isLength({ min: 3, max: 30 })
        .withMessage("Nome deve ter pelo menos 3 caracteres!"),

    body("email")
        .isEmail()
        .withMessage("Digite um e-mail válido!"),

    body("telefone")
        .isLength({ min: 10, max: 11 })
        .withMessage("Telefone deve ter 10 ou 11 caracteres!"),

    body("assunto")
        .isLength({ min: 3, max: 50 })
        .withMessage("Assunto deve ter entre 3 e 50 caracteres!"),

    body("mensagem")
        .isLength({ min: 10, max: 200 })
        .withMessage("Mensagem deve ter entre 10 e 200 caracteres!"),

    async function (req, res) {

        const erros = validationResult(req);

        
        if (!erros.isEmpty()) {
            return res.render("pages/formulario", {
                erros: erros.array(),
                valores: req.body,
                retorno: null
            });
        }

        
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_TO,
                replyTo: req.body.email,
                subject: req.body.assunto,
                text:
                    "Nome: " + req.body.nome +
                    "\nE-mail: " + req.body.email +
                    "\nTelefone: " + req.body.telefone +
                    "\nMensagem: " + req.body.mensagem
            });

            return res.render("pages/formulario", {
                erros: [],
                valores: req.body,
                retorno: "E-mail enviado com sucesso!"
            });

        } catch (erro) {
            console.log("Erro ao enviar e-mail:", erro);

           
            return res.render("pages/formulario", {
                erros: [],
                valores: req.body,
                retorno: "Não foi possível enviar o e-mail."
            });
        }
    }
);


module.exports = router;
