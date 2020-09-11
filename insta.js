window.addEventListener('message', receiveMessage, false);
window.addEventListener('beforeunload', (event) =>{event.preventDefault(); event.returnValue= ''})
let nomeDaJanelaFilha = 'janelaoTop'
let janelaFilha = window.open('https://www.instagram.com', nomeDaJanelaFilha) // cria janela filha para nao ficar dando popup
let siteDoDizu = 'https://dizu.com.br/painel/conectar'
let regexPerfil = new RegExp()
let proxPerfil = ''

function receiveMessage(event){ //event listener
    let objeto = event.data //pega o objeto que vem pelo evento
    regexPerfil = new RegExp(objeto.perfil, 'i')
    if (objeto.action == 'Seguir'){ //se for seguir
        janelaFilha = window.open(objeto.link, nomeDaJanelaFilha) //atualiza a janela filha
        try{
            window.setTimeout(seguir, 10000) //manda seguir esperando 10 seg
        }catch (e){
            console.error(e.message)
            console.warn('Tetando seguir dinovo...')
            window.setTimeout(seguir, 10000)
        }
    }else if (objeto.action == 'Curtir'){ //se for curtir
        janelaFilha = window.open(objeto.link, nomeDaJanelaFilha)
        try{
            window.setTimeout(curtir, 10000) //manda curtir esperando 10 seg
        }catch (e){
            console.error(e.message)
            console.warn('Tetando curtir dinovo...')
            window.setTimeout(curtir, 10000)
        }
    }else if (objeto.action == 'LogOut'){
        proxPerfil = objeto.perfil
        window.setTimeout(logOut, 1000)
    }else if (objeto.action == 'clicarEntrar'){
        proxPerfil = objeto.perfil
        window.setTimeout(clicaEntrar, 1000)
    }else{
        console.log('nunca entre aqui')
    }
}

function seguir(){
    let pageNotAvailable = janelaFilha.document.getElementsByClassName('MCXLF')[0]
    let botaoSeguir = janelaFilha.document.getElementsByClassName('_5f5mN       jIbKX  _6VtSN     yZn4P   ')[0]
    let botaoSeguirSozinho = janelaFilha.document.getElementsByClassName('sqdOP  L3NKy   y3zKF     ')[0]
    let isPrivate = janelaFilha.document.getElementsByClassName('_4Kbb_ _54f4m')[0]
    let isPorno = janelaFilha.document
    .getElementsByClassName('error-container -cx-PRIVATE-ErrorPage__errorContainer -cx-PRIVATE-ErrorPage__errorContainer__')[0]
    let botaoSendMessage = janelaFilha.document.getElementsByClassName('fAR91 sqdOP  L3NKy _4pI4F   _8A5w5    ')[0]
    let pageNotLoaded = (botaoSeguir == null) && (botaoSeguirSozinho == null)
    pageNotLoaded = pageNotLoaded && (botaoSendMessage == null) && (isPrivate == null) && (isPorno == null)
    pageNotLoaded = pageNotLoaded && (pageNotAvailable == null)
    
    
    
    if (pageNotLoaded){
        window.setTimeout(seguir, 2000) //espera mais 2 segundos
        return
    }else{
        if (isPorno != null || isPrivate != null || botaoSendMessage != null || pageNotAvailable != null){
            window.setTimeout(mandaPularTarefa, 4000) //manda pular tarefa esperando 4 seg
        }else{ //entao da pra clicar
            let listaFotosPerfil = janelaFilha.document.getElementsByClassName('_6q-tv')
            let nomeDoPerfil = listaFotosPerfil[listaFotosPerfil.length - 1].alt.split(' ').pop()
            if(regexPerfil.test(nomeDoPerfil)){
                if (botaoSeguir != null){
                    botaoSeguir.click()
                }else{
                    botaoSeguirSozinho.click()
                }
                window.setTimeout(verifyBan, 3000)
            }else{
                window.opener.postMessage('erroPerfil', siteDoDizu)
            }
        }
    }
}

function curtir(){
    let pageNotAvailable = janelaFilha.document.getElementsByClassName('MCXLF')[0]
    let botaoCurtir = janelaFilha.document.getElementsByClassName('wpO6b ')[1]
    let isPrivate = janelaFilha.document.getElementsByClassName('_4Kbb_ _54f4m')[0]
    let isPorno = janelaFilha.document.getElementsByClassName('error-container -cx-PRIVATE-ErrorPage__errorContainer -cx-PRIVATE-ErrorPage__errorContainer__')[0]
    let pageNotLoaded = (botaoCurtir == null) && (isPorno == null) && (isPrivate == null) && (pageNotAvailable == null)
    
    if (pageNotLoaded){
        window.setTimeout(curtir, 2000)
        return
    }else{
        if (botaoCurtir != null){
            let listaFotosPerfil = janelaFilha.document.getElementsByClassName('_6q-tv')
            let nomeDoPerfil = listaFotosPerfil[listaFotosPerfil.length - 1].alt.split(' ').pop()
            if (regexPerfil.test(nomeDoPerfil)){
                botaoCurtir.click()
                window.setTimeout(verifyBan, 3000)
            }else{
                window.opener.postMessage('erroPerfil', siteDoDizu)
            }
        }else{
            window.setTimeout(mandaPularTarefa, 4000)
        }
    }
}

function mandaConfirmar(){
    window.opener.postMessage('confirma', siteDoDizu)
}

function mandaPularTarefa(){
    window.opener.postMessage('pula', siteDoDizu)
}

function logOut(){
    let avatar = janelaFilha.document.getElementsByClassName('_6q-tv')
    let botaoAvatar = avatar[avatar.length - 1]
    botaoAvatar.click()
    window.setTimeout(clicaSair, 4000)
}

function clicaSair(){
    let sair = janelaFilha.document.getElementsByClassName('_7UhW9   xLCgt      MMzan  KV-D4              fDxYl     ')
    let botaoSair = sair[sair.length - 1]
    botaoSair.click()
    window.setTimeout(clicaEntrar, 10000)
}

function clicaEntrar(){
    let listaPerfis = janelaFilha.document.getElementsByClassName('l9hKg')
    if (listaPerfis == null){
        window.setTimeout(clicaEntrar, 4000)
        console.warn('PERFIS NAO ENCONTRADO\nESPERANDO PERFIS....')
    }else{
        let id = -1
        let tam = listaPerfis.length
        for(let index = 0; index < tam; index++){
            if (listaPerfis[index].textContent == proxPerfil){
                id = index
                break
            }
        }
        if (id == -1){
            window.opener.postMessage('erroAcharPerfil', siteDoDizu)
        }else{
            let botao = janelaFilha.document.getElementsByClassName('sqdOP  L3NKy   y3zKF     ')[id]
            botao.click()
            window.opener.postMessage('logou', siteDoDizu)
        }
    }
}

function verifyBan(){
    let isBanned = janelaFilha.document.getElementsByClassName('piCib')[0] != null
    if (isBanned){
        window.opener.postMessage('ban', siteDoDizu)
    }else{
        window.setTimeout(mandaConfirmar, 4000)
    }
}
