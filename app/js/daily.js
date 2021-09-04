function pegar(){
  fetch("/api/daily",{
    method:"POST"
  }).then(a=>a.json())
  .then(a=>{
    document.getElementById("a").innerText = a.message;
  })
}
let dji = (async()=>{
  let lista = [
    "O mcoin era pra se chamar bitmarys, mas antes de lançar virou o mcoin",
    "Todo dia as 00:00 reseta a data do daily"
  ]
  let num= Math.floor(Math.random() *lista.length);
  console.dir(num)
  document.getElementById('aaa').innerHTML = "oi"
})
dji()