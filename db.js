let cooldown = 60;
let set = new Set()
let nome = "aaaaa"
async function connect(){

    if(set.has(nome))
        return global.connection;
        set.add(nome)
      setTimeout(()=>{
        set.delete(nome)
      },cooldown*1000)
let env = process.env
    const mysql = require("mysql2/promise");
    if(global.connection){
      global.connection.close()
    }
    const connection = await mysql.createConnection("mysql://"+env.mysql_name+":"+env.mysql_pass+"@"+env.mysql_host+":"+env.mysql_port+"/"+env.mysql_name+"");
    console.log("Conectou no MySQL!");
    
    global.connection = connection;
    return connection;
    
}
connect()

async function daily(member,quantidade,client){
  let {id} = member
  const sqls = {
    one:"SELECT * FROM members WHERE id=?",
    two:"UPDATE members SET saldo=?,`ultimodailydia`=?,`ultimodailymes`=? WHERE id=?"
  }
  let connection = await connect();
  let saldo = await getSaldo(member)
  let saldodps = saldo+Number(quantidade)
  let a = await connection.query(sqls.one,[id])
let b = a[0];
const data = new Date();
const dia = data.getDate();
const mes = data.getMonth();
if(!verifyUser({id})){
  let aaa = {code:201, message:"Pegue novamente o daily!"}
  return aaa;
}else{
let membro = b[0]
if(!membro)  {
   let data = new Date();
let ts = data.getTime();
  let sql = "INSERT INTO members(id,iniciomary) VALUES(?,?)"
  let sql2 = "INSERT INTO badges(userid) VALUES(?)"
  let aaa = await connection.query(sql,[id,ts])
let aaaa = await connection.query(sql2,[id])
   let aaaaa = {code:201, message:"Pegue novamente o daily! pq sim"}
  return aaaaa;
  }
if(membro.ultimodailydia == dia && membro.ultimodailymes == mes) {
  return {code:240, message:"Você já pegou o daily hoje, espere até amanhã pra pegar denovo!"};

}else{
connection.query(sqls.two,[saldodps,dia,mes,id])
client.channels.cache.get("881907525182697473").send(`${member.username}#${member.discriminator}(${member.id}) pegou o daily e ganhou ${quantidade} mcoins`)
  return {code:200,message:"Hoje você ganhou... "+quantidade+" mcoins, agora seu saldo é "+saldodps+" mcoins!"}
  
}
}
}
async function verifyUser({id}){
  let sql = "SELECT * FROM `members` WHERE id=?"
  let connection = await connect()
  let query = await connection.query(sql,[id])
  let [rows] = query[0]
  return await rows;
}
async function getSaldo(member){
  let {id}=member;
  let saldo = 0
  let verify = await verifyUser({id});
 // if(!verify) return null;
  let sql  = "SELECT * FROM `members` WHERE id=?";
  let sql1 = [id];
  const connection = await connect();
  let query = await connection.query(sql,sql1);
  let [rows] = query[0];
  if(!rows) return null;
  saldo=rows.saldo
return await Number(saldo);
}
async function createUser(member){
  let id = member.id;
  let verify = await verifyUser({id});
  if(verify) return false;
  const connection = await connect();
  let data = new Date();
let ts = data.getTime();
  let sql = "INSERT INTO members(id,iniciomary) VALUES(?,?)"
  let sql2 = "INSERT INTO badges(userid) VALUES(?)"
  let aaa = await connection.query(sql,[id,ts])
let aaaa = await connection.query(sql2,[id])
  return true;
}
module.exports = {daily,createUser,verifyUser}