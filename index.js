var express = require('express');
var http = require('http');
var vhost = require('vhost')
const db = require('./db')
const app = express()
const path = require('path')
app.engine("html", require('ejs').renderFile)
app.use(express.static(path.join(__dirname,"app")))
app.get("/", (req,res) => {
        res.render("inicio.html")
})
app.get("/api/invite", (req,res) => {
        res.redirect("https://discord.com/api/oauth2/authorize?client_id=862389674827448401&permissions=8&scope=bot%20applications.commands")
})

app.get("/api/suporte", (req,res) => {
        res.redirect("https://discord.gg/9yKbEyrdgm")
})

app.get("/api/perfil", (req,res) => {
        res.render("perfil.html")
})

app.get("/api/tos", (req,res) => {
        res.render("tos.html")
})

app.get("/api/vote", (req,res) => {
        res.redirect("https://top.gg/bot/862389674827448401/vote")
})

app.get("/api/topgg", (req,res) => {
        res.redirect("https://top.gg/bot/862389674827448401")
})

app.get("/comandos.mcat", async(req,res) => {
    const meuSet = new Set();
    const dayabase = await db.ref("comandos").once("value")
    if(!dayabase.val()) return res.render("ae.pola.html")
    const array = Object.keys(dayabase.val());
    
    array.forEach(async(e) => { 

        let infoMembro = {
            name:`${e}`,
            desc: dayabase.val()[`${e}`].desc,
            cat:dayabase.val()[`${e}`].categoria,       aliancas:dayabase.val()[`${e}`].aliases
        };
        meuSet.add(infoMembro)
    });
    let pe = Array.from(meuSet);
        res.render("comandos.html", {list:pe})
})

app.get("/api/tutorial", (req,res) => {
        res.redirect("https://top.gg/bot/862389674827448401")
})


app.get("/imagens/fotopreta.png", (req,res) => {
        res.redirect("https://mary.blacklight.net.br/imagens/fotopreta.png")
})

app.listen(3000)