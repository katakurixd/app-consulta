class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for (let i in this) {
            if(this[i] === undefined || this[i]==="" || this[i] ===null){
                return false
            }
        }
        return true
    }
}

class BD{
    constructor(){
        let ID = localStorage.getItem('id')
        if(ID === null){
            localStorage.setItem('id',0)
        }
    }

    getProximoID(){
        let proximoID = localStorage.getItem('id')
        return parseInt(proximoID)+1
    }

    gravar(d){
        let id = this.getProximoID()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        let despesas = Array()
        let id = localStorage.getItem('id')
        for(let i = 1; i<=id; i++ ){
            let despesa = JSON.parse(localStorage.getItem(i))
            if(despesa ===null){
                continue
            }else{
                despesa.id = i
                despesas.push(despesa)
            }
        }
        return despesas
    }

    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        console.log(despesa)
        console.log(despesasFiltradas)
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano===despesa.ano )
        }
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes===despesa.mes )
        }
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia===despesa.dia )
        }
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo===despesa.tipo )
        }
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao===despesa.descricao )
        }
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor===despesa.valor )
        }
        console.log(despesasFiltradas)
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}
let bd = new BD()


function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    
    if(despesa.validarDados()){ 
        bd.gravar(despesa)
        document.getElementById('titulo').className = 'modal-header text-success'
        document.getElementById('exampleModalLabel').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('mensagem').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('botaoVoltar').className = 'btn btn-success'
        document.getElementById('botaoVoltar').innerHTML = 'Voltar'
        $('#modalRegistraDespesa').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    }else{
        document.getElementById('titulo').className = 'modal-header text-danger'
        document.getElementById('exampleModalLabel').innerHTML = 'Erro na gravação'
        document.getElementById('mensagem').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'
        document.getElementById('botaoVoltar').className = 'btn btn-danger'
        document.getElementById('botaoVoltar').innerHTML = 'Voltar e corrigir'
        $('#modalRegistraDespesa').modal('show')
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }
    listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    /*
    <tr>
        <td>15/03/2018</td>
        <td>Alimentação</td>
        <td>Compras do mês</td>
        <td>444.75</td>
    </tr>
    */
   //Percorrer array despesas
   despesas.forEach(function(d){
       //Criando a linha
       let linha = listaDespesas.insertRow()
       //Criando as colunas
       linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

       switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
       }

       linha.insertCell(1).innerHTML = d.tipo
       linha.insertCell(2).innerHTML = d.descricao
       linha.insertCell(3).innerHTML = d.valor

       let btn = document.createElement('button')
       btn.className = 'btn btn-danger'
       btn.innerHTML = 'X'
       btn.id = `id_despesa_${d.id}`
       btn.onclick = function(){
           let id = this.id.replace('id_despesa_', '')
           bd.remover(id)
           window.location.reload()
       }
       linha.insertCell(4).append(btn)
   })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    
    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)
    carregaListaDespesas(despesas, true)
}