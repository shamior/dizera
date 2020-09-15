let printa = console.log
console.log = (e)=> {let hora = new Date(); printa(hora.toLocaleTimeString()+' >> ', e)}
let nomeDaJanelaFilha = 'nomezaoTop'
let wd = window.open('https://www.instagram.com', nomeDaJanelaFilha)
window.addEventListener('message', receiveMessage, false);
window.confirm = () => true
let regExSiteInsta = /https:\/\/instagram\.com|https:\/\/www\.instagram\.com/i
let relogaPerfis = false
let secondsToIniate = 120
let navegador = 0
let limiteAcoesPerfil = 80
const stringLimiteAcoes = 'LIMITE DE ACOES NO PERFIL ALCANÇADA'
const stringSemTarefas = 'TA SEM TAREFAS OPORA'
const stringResumo = 'RESUMO DO PERFIL'

const contagemPerfil = {
    "perfil": '',
    "numeroConfirmados": 0,
    "numeroPulados": 0,
    "total": 0
}

const listaDePerfis = []
document.querySelectorAll("#instagram_id option").forEach((element, index)=> listaDePerfis.push({'perfil': element.text, 'done': true, 'idx': index}))
listaDePerfis.shift()

const messageEventHandler = {
    "confirma": confirmaTarefa,
    "pula": pulaTarefa,
    "erroPerfil": ()=>{
        console.warn('Perfil selecionado no dizu esta diferente do perfil logado no instagram\nPausando tarefas...')
    },
    "logou": ()=>{
        let perfilLogado = getAvailableInstagram()
        console.log('=== Logado no perfil ' + perfilLogado.perfil + ' ===')
        let index = perfilLogado.idx
        console.log('=== Esperando ' + secondsToIniate  + ' segundos para iniciar tarefas neste perfil ===')
        window.setTimeout(selecionaInstagram, (secondsToIniate - 3) * 1000, index, true)
    },
    "erroAcharPerfil": ()=>{
        let perfilLogado = getAvailableInstagram()
        console.warn('Nao foi possivel achar o instagram ' + perfilLogado.perfil + ' nas suas contas salvas do instagram')
        logOut(perfilLogado, 'clicarEntrar')
    },
    "ban": ()=>{
        console.error('<<<<USUARIO ' + contagemPerfil.perfil + ' BANIDO>>>>')
        mostraTotalPerfil(stringResumo)
        if (relogaPerfis){
            logOut(perfilLogado, 'LogOut')
        }
    }
}

function receiveMessage(event){
    let data = event.data
    let func = messageEventHandler[data]
    func()
}

function init(nav=1){
    navegador = nav - 1
    deixaPerfisDisponiveis()
    window.setTimeout(selecionaInstagram, 4000, (navegador*5) + 1)
}


function getAvailableInstagram(){
    let tam = listaDePerfis.length
    for(let index = 0; index < tam; index++){
        if (!listaDePerfis[index].done) return listaDePerfis[index]
    }
    return null
}


function getSelectedInstagram(){
    let listaInstagram = document.querySelectorAll("#instagram_id option")
    let tam = listaInstagram.length
    for (let insta = 0; insta < tam; insta++){
        if (listaInstagram[insta].selected) return listaInstagram[insta]
    }
    return null
}

function selecionaInstagram(index){
    relogaPerfis = true
    document.querySelectorAll("#instagram_id option")[index].selected = true
    window.setTimeout(iniciaTarefas, 3000)
}

function iniciaTarefas(){
    console.log('=== Iniciando... ===')
    contagemPerfil.perfil = getSelectedInstagram().text
    document.querySelector('#iniciarTarefas').click()
    window.setTimeout(comunicaComOInsta, 7000, 0)
}

function comunicaComOInsta(turn=0){
    let comTarefas = document.querySelector('.marginT2.semTarefas.hide')
    let isLoading = document.querySelector('.loaderDiv').style.display == 'inline'
    if (isLoading){ //se estiver carregando proxima acao
        if (turn < 5){
            console.log('carregandooooo')
        }else {
            if (turn % 6 == 5){
                console.log('carregandooooo')
                document.querySelector('#iniciarTarefas').click()
            }
        }
        window.setTimeout(comunicaComOInsta, 4000, turn+1)
    }else if (comTarefas == null) { //ou seja, esta sem tarefas
        mostraTotalPerfil(stringSemTarefas)
        if (relogaPerfis){
            logOut(getAvailableInstagram(), 'LogOut')
        }
    }else{
        let objeto = {
            'perfil': contagemPerfil.perfil,
            'action': document.querySelector('.btn_light.cpointer.actionConectar p').textContent,
            'link': document.querySelector('#conectar_step_4').href
        }
        let badURL = regExSiteInsta.test(objeto.link) == false
        if(badURL){
            console.warn('-> BAD URL: ' + objeto.link + '\nPulando tarefa...')
            window.setTimeout(pulaTarefa, 2000)
        }else{
            wd.postMessage(objeto, 'https://www.instagram.com')
            jQuery("#conectar_step_5").removeClass('d-none')
        }
    }
}

function confirmaTarefa(){
    let botaoConfirmaTarefa = document.querySelector('#conectar_step_5 button')
    botaoConfirmaTarefa.click()
    contagemPerfil.numeroConfirmados++
    contagemPerfil.total++
    if (contagemPerfil.numeroConfirmados >= limiteAcoesPerfil){
        window.setTimeout(chegouLimite, 10000)
    }else{
        window.setTimeout(comunicaComOInsta, 13000, 0)
    }
}

function pulaTarefa(){
    let botaoPulaTarefa = document.querySelector('.btn-dizu.bg-orange.sombra.marginT1.Bradius5.pularTarefa button')
    botaoPulaTarefa.click()
    contagemPerfil.numeroPulados++
    window.setTimeout(comunicaComOInsta, 13000, 0)
}

function logOut(perfilAtual, action){
    perfilAtual.done = true
    let proxPerfil = getAvailableInstagram()
    if(proxPerfil == null){
        console.warn('===== ACABOU OS PERFIS =====')
    }else{
        printa('\n')
        console.log('=== Logando no perfil ' + proxPerfil.perfil + ' ===')
        let objeto = {
            'perfil': proxPerfil.perfil,
            'action': action,
            'link': 'https://www.instagram.com'
        }
        wd.postMessage(objeto, 'https://www.instagram.com')
    }
}

function deixaPerfisDisponiveis(){
    let tam = listaDePerfis.length
    let comecoLaco = navegador*5
    let fimLacoProposto = comecoLaco + 5
    let fimLaco = fimLacoProposto >= tam ? tam : fimLacoProposto
    for (let index = comecoLaco; index < fimLaco; index++){
        listaDePerfis[index].done = false
    }
}

function mostraTotalPerfil(string){
    let total = contagemPerfil.numeroConfirmados + contagemPerfil.numeroPulados
    let stringAcoes = ''
    stringAcoes += '========  '+string+'  ========'
    stringAcoes += '\n\nTOTAL CONFIRMADO ATE AGORA: ' + contagemPerfil.total
    stringAcoes += '\n\nPerfil: ' + contagemPerfil.perfil
    stringAcoes += '\nAcoes confirmadas: ' + contagemPerfil.numeroConfirmados
    stringAcoes += '\nAcoes puladas: ' + contagemPerfil.numeroPulados
    stringAcoes += '\nTotal: ' + total
    console.log(stringAcoes)
    contagemPerfil.perfil = ''
    contagemPerfil.numeroConfirmados = 0
    contagemPerfil.numeroPulados = 0
}

function chegouLimite(){
    mostraTotalPerfil(stringLimiteAcoes)
    if (relogaPerfis){
        logOut(getAvailableInstagram(), 'LogOut')
    }
}
