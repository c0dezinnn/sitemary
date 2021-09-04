const express = require('express');
const http = require('http');
const vhost = require('vhost')
const db = require('./db')
const app = express()
const path = require('path')
const fetch = require("node-fetch")
const ejs = require('ejs')
const fs = require('fs')
app.set('view engine', 'ejs');

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"public")))
      const { Client, User } = require('discord.js')
    const client = new Client()
    client.login(process.env.marytoken)
const DiscordOauth = require('oauth-discord');
const oauth = new DiscordOauth({
    version: "v8",
    client_id: '873616190247944203',
    client_secret: process.env.clientSECRET,
    redirect_uri: 'https://mary.blacklight.net.br/login',
});
client.on("ready",()=>{
  let user = client.user;
  let infos = 
{
name:user.username,
discrim:user.discriminator,
tag:user.tag,
avatar:user.avatarURL({format:"png",dinamic:true}),
prefix:"m.",
developers:['531997885760536577','700157765053841438'],
owner:["700157765053841438"],
urls:[
  {type:"main",url:"https://mary.blacklight.net.br"},
  {type:"daily",url:"https://mary.blacklight.net.br/daily"},
  {type:"dashboard",url:"https://mary.blacklight.net.br/dashboard"},
  {type:"dashboard",url:"https://mary.blacklight.net.br/dashboard"},
  {type:"support",url:"https://mary.blacklight.net.br/api/suporte"},
  {type:"invite",url:"https://mary.blacklight.net.br/api/invite"}
]
}
  
    fs.writeFileSync('app/js/infos.json', JSON.stringify(infos));
})

app.get("/login",(req,res)=>{
 if(!req.query.code) return res.redirect("https://discord.com/api/oauth2/authorize?client_id=873616190247944203&redirect_uri=https%3A%2F%2Fmary.blacklight.net.br%2Flogin&response_type=code&scope=identify%20email%20guilds");
  (async()=>{
 let token = await oauth.getToken({
    grant_type: 'authorization_code',
    code: req.query.code,
});

fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${token.token_type} ${token.access_token}`,
			},
		})
			.then(async result => result.json())
			.then(async response => {
      //  console.dir(response)
        if(response.message) return res.redirect("/login");
        	const { username, discriminator,mfa_enabled,avatar,id } = response;
          if(!mfa_enabled) return res.send(`Pra segurança do usuario, pra você fazer mudanças na dashboard, pegar daily favor, ative a verificação de duas etapas!`);
          
          res.cookie("code",token.access_token)    
          res.cookie("auth",token.token_type)
          res.cookie("hmmm",`${token.token_type} ${token.access_token}`)
          let membro = {}
          let midaumrefri = await client.users.fetch(id);
          let options = {};
          options.accessToken = token.access_token
          options.nick = `${midaumrefri.username}MB`
          if(req.cookies.page){
            if(req.cookies.page == 1){
              res.cookie("page",null).redirect("/daily")
            }else{
              if(req.cookies.page == 2){
                res.cookie("page",null).redirect("/dashboard")
              } else{
                ok({username})

              }
            }
          }else{
          ok({username})
          
          }
          function ok({username}){
            
          res.send(`Bem vindo(a) de volta, <strong>${username}</strong>,<br/>Agora tu pode acessar o <a href="/daily">daily</a> e a <a href="/dashboard">dashboard</a>!`);
          }
           
      })
  })()       
                                                           })                                      

app.engine("html", require('ejs').renderFile)
app.use(express.static(path.join(__dirname,"app")))
app.get("/", (req,res) => {

        res.render("inicio.html")
})

app.get("/api/invite", (req,res) => {
let url = "https://discord.com/api/oauth2/authorize?client_id=873616190247944203&permissions=8&redirect_uri=https%3A%2F%2Fmary.blacklight.net.br%2Fdashboard&scope=bot%20applications.commands"

if(req.query.guild_id) {
  url=`${url}&guild_id=${req.query.guild_id}`
}
  res.redirect(url)
})

app.get("/api/bugs", (req,res) => {
        res.redirect("https://github.com/doutorEstranho/marybot-opensource/issues")
})



app.get("/api/suporte", (req,res) => {
        res.redirect("https://discord.gg/9yKbEyrdgm")
})

app.get("/api/perfil", (req,res) => {
        res.render("perfil.html")
})

app.get("/dashboard", async (req,res) => {
  
        if(!req.cookies['code']) return res.cookie("page",2).redirect("/login");

fetch('https://discord.com/api/users/@me', {
			headers: {
				Authorization: `${req.cookies.hmmm}`,
			}//%- guildsComPerm -%
		})
			.then(result => result.json())
			.then(async response => {
        if(response.message) return res.cookie("page",2).redirect("/login")
        if(!response.id) return res.cookie("page",2).redirect("/login");
                const guilds = await fetch('https://discord.com/api/v9/users/@me/guilds', {
  headers: {
				Authorization: `${req.cookies.hmmm}`,
			}
}).then(r => r.json())
const guildsComPerm = guilds.filter(g => (BigInt(g.permissions) & 32n) == 32n)
        const { username, discriminator,mfa_enabled,avatar } = response;
if(!mfa_enabled) return res.render("erro.html",{erro:"Ative a v2e para entrar na dashboard"});
let guildz = '<link rel="stylesheet" href="/css/dashmain.css" media="screen">'
function addGuilds(info){guildz=`${guildz}${info}`}
guildsComPerm.map(e=>{
  //console.dir(e)
  addGuilds(`<div id="${e.id}" class="guildview">`)
  if(e.icon){
  addGuilds(`<img id="imgserver" src="https://cdn.discordapp.com/icons/${e.id}/${e.icon}.png" alt="Imagem">`)
  }else{
   addGuilds(`<img id="imgserver" src="https://cdn.discordapp.com/embed/avatars/1.png"  alt="Imagem"/>`)
  }
  
  addGuilds(`<spam id="name">${e.name}</spam>`)
if(client.guilds.cache.get(e.id)){
  addGuilds(`<a href="/guilds/${e.id}/configure"><button>Configurar</button></a>`)
} else {
  addGuilds(`<a href="/api/invite?guild_id=${e.id}"><button>Me adicione</button></a>`)
}
addGuilds(`</div>`)

  })
  res.render('dashboard.ejs', { guilds: guildsComPerm, cliente: client})

})
})
app.get("/guilds/:guildid/:page",async (req,res)=>{
  
  if(!req.cookies['code'])  return res.cookie("page",2).redirect("/login");
  const guilds = await fetch('https://discord.com/api/v9/users/@me/guilds', {
  headers: {
				Authorization: `${req.cookies.hmmm}`,
			}
}).then(r => r.json()) 



const thisserver = req.params.guildid

const guild = await client.guilds.cache.get(thisserver)
if(!guild) return res.redirect("/dashboard")
//console.dir(guild)
//console.log(guild.iconURL())
//console.log(guild.name)
res.render("dashboard/index.html",{server:{id:guild.id, name:`${guild.name}`, avatar: `${guild.iconURL()}` }})
//pq tinha 2?              

})

//assim?
// sim
//ta mas como vai fazer?
app.get("/added",(req,res)=>{
  if(!req.query.guild_id) return res.redirect("https://discord.com/oauth2/authorize?client_id=873616190247944203&permissions=8&redirect_uri=https%3A%2F%2Fmary.blacklight.net.br%2Fadded&response_type=code&scope=identify%20bot")
  res.redirect("/guilds/"+req.query.guild_id+"/configure")
})

app.get("/api/status", (req,res) => {
        res.redirect("https://stats.uptimerobot.com/Wmvm2HjqYK")
})


// usa o public pq tudo que tem nele aparece em tudo
app.get("/api/inh", (req,res) => {
        res.redirect("https://discord.com/api/oauth2/authorize?client_id=873616190247944203&permissions=8&redirect_uri=https%3A%2F%2Fmary.blacklight.net.br%2Fdashboard&scope=bot%20applications.commands")
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


app.get("/status.mcat",async(req,res)=>{
    res.render("status.html", {status})
})
app.get("/api/tutorial", (req,res) => {
        res.redirect("https://top.gg/bot/862389674827448401")
})


app.get("/imagens/fotopreta.png", (req,res) => {
        res.sendFile("https://mary.blacklight.net.br/imagens/fotopreta.png")
})

/* PERFIL */
app.get("/member/:id/perfil",async(req,res)=>{
  let {id} = req.params
  let ide = Number(id)
  if(isNaN(ide)){
    res.render("erro.html",{erro:"O membro está invalido!"})
  }else{
    ide=String(ide)
let a = ( async () => {
let aaa = await db.verifyUser({ide});
if(!aaa && !client.users.cache.get(ide)){

}else{
  let user = client.users.fetch(ide);
  let infos = {
    avatar:user.avatarURL({dinamic:true}),
    tag:user.tag
  }
  res.json(infos)
}
})
a()
  }
})
/* DAILY */
app.get("/daily",(req,res)=>{

if(!req.cookies['code'])  return res.cookie("page",1).redirect("/login");
fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${req.cookies.hmmm}`,
			},
		})
			.then(result => result.json())
			.then(response => {
        if(response.message)   return res.cookie("page",1).redirect("/login");
        const { username, discriminator,mfa_enabled,avatar } = response;
if(!mfa_enabled) return res.render("erro.html",{erro:"Ative a v2e pra pegar seu daily"});
res.render("daily.html")
      })
      
})

app.post("/api/daily",(req,res)=>{
if(!req.cookies['code']) return res.json({code:229,message:"Code inspired"});
const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${req.cookies.hmmm}`,
			},
		})
			.then(result => result.json())
			.then(response => {
        if(response.message) return res.json({code:230,message:"Invalid code"});
        const { username, discriminator,mfa_enabled,avatar,id } = response;
if(!mfa_enabled) return res.json({
  code:231,
  message:"Ative seu v2 pra pegar o daily!"
});
let quantidade = Math.floor(Math.random() * (4200-1000))+1000;

db.daily(response,quantidade,client).then(a=>{res.json(a)})
      })
})
app.listen(3000)