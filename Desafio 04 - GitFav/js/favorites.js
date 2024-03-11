import { githubUser } from "./GithubUser.js"

//classe que vai conter a lógica dos dados
export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.tbody = this.root.querySelector('table tbody')//Armazenando o tbody, armazenamos neste começo porque vamos usar ele em mais de uma função

    this.load()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')//armazenando o botão
    
    addButton.onclick = () => {//quando o botão receber um click, faça a seguinte função
      const { value } = this.root.querySelector('.search input')//pegando o valor inserido no input
      this.add(value)//chamando a função add e pasando o valor do input 
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [] //JSON.parse = transforme os dados do formato json para objeto | localStorage.getItem = busque no local storage
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))//no local storage acesse o @ e salve em formado de JSON strinf o array this entries
  }

  async add(username) {//async = função assincrona que retorna uma promessa, no caso o await e ele só prossegue após o retorno da promessa 
    try { //tente fazer esse código, se algo der errado faça o catch
      
      const userExists = this.entries.find(entry => entry.login === username)//.find = encontre no array, caso encontre retorna um objeto

      if(userExists) { //se userExists for verdadeiro existir, faça...
        throw new Error('Usuário já Cadastrado!')
      }      

      const user = await githubUser.search(username)
      
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')//caso a condição seja verdadeira, vomite o seguinte erro
      }

      this.entries = [user, ...this.entries]//em um novo array, insira o usuário add e "..."espalhe os usuários que já estavam no this.entries
      this.update()
      this.save()

    } catch(error) {//se acusar erro, faça...
        alert(error.message)
      }
    }

  delete(user) {
    const filteredEntries = this.entries //declarando um novo array para respeitar o principio de imutabilidade
    .filter(entry => entry.login !== user.login)//como é um array estamos usando o metodo filter que faz uma função para cada item do array, nessi caso está retornado verdadeiro ou falso para o if

    this.entries = filteredEntries //colocando o array filtrado dentro do antigo array, não estamos mudando apenas um dado, mas sim o array inteiro
    this.update()
    this.save()
  }
}

//classe que vai criar a visualização dos eventos HTML
export class favoritesView extends favorites {
  constructor(root) {
    super(root)

    this.update()
  }
    
  update() {

    this.noFavorites()
    this.removeAllTr()
    
    this.entries.forEach(user => { //forEach = para cada objeto, faça...
      const row = this.createRow() //chama função que cria uma linha e armazena na variável row
      row.querySelector('.user img').src = `https://github.com/${user.login}.png` //faz as alterações html para aquele usuário
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}/`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories p').textContent = user.public_repos
      row.querySelector('.followers p').textContent = user.followers

      row.querySelector('.remove').onclick = () => {//add uma função ao botão remover quando clicado nele
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if (isOk) {//se o retorno do alert for verdadeiro, chame a função para deletar o usuário e passe o objeto usuário por parametro
          this.delete(user)
        }
      }

      this.tbody.append(row) //append= add no tbody a linha criada
    })
  }

  createRow() {
    const tr = document.createElement('tr')//criando o tr pela DOM 

    tr.innerHTML = `
    <td class="user">
      <img src="https://github.com/maykbrito.png" alt="Imagem de Mayk Brito">
      <a href="https://github.com/maykbrito" target="_blank">
        <p>Mayk Brito</p>
        <span>/maykbrito</span>
      </a>
    </td>
    <td class="repositories">
      <p>123</p>
    </td>
    <td class="followers">
      <p>1234</p>
    </td>
    <td>
      <button class="remove">Remover</button>
    </td>
    `
    return tr //retornando o tr para que possamos usar essa estrutura para add os usuários a tabela
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')//pegando todos os tr
    .forEach(tr => {//por ser considerado um array like, podemos aplicar funções de array, nesse caso fizemos uma função que é o forEach que para cada tr vai aplicar a função remove
      tr.remove()
    })  
  }

  noFavorites() {
    const noFavorites = document.querySelector('.noFavorites')    

    if(this.entries.length == 0 && !noFavorites) {

      const noFavorites = document.createElement('div')
      noFavorites.className = 'noFavorites'
      noFavorites.innerHTML = `    
      <img src="assets/Estrela.svg" alt="Desenho de uma estrela com carinha">
      <p>Nenhum favorito ainda</p>     
      `    
      const container = document.querySelector('.table-container')
      container.append(noFavorites)      
    }else if(noFavorites) {
      noFavorites.remove()
    }
  }

}