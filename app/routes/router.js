const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator")
const nodemailer = require("nodemailer");

router.get("/", function (req, res) {
  res.render("pages/formulario", { "erros": null, "valores": {"nome":"","email":"","telefone":"","assunto":"","mensagem":""} ,"retorno":null });
});

router.post(
    "/formulario",
    body("nome").isLength({min: 3, max: 30})
    .withMessage("Nome deve ter pelo menos 3 caracteres!"),
    body("email").isEmail(),
    body("telefone").isLength({min: 10, max:11}),
    body("assunto").isLength({min:3, max:50}),
    body("mensagem").isLength({min:10, max:200}),
    function(req, res){
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/formulario", {"erros": erros, "valores":req.body, "retorno":null});

        }
         return res.render("pages/formulario", {"erros": null, "valores":req.body, "retorno":req.body});
    }
)


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});




transporter.verify(function(erro, sucesso){
    if (erro){
        console.log("Erro na conexão", erro);
    }else{
        console.log("Conexão com o Gmail funcionando!")
    }
});



module.exports = router;