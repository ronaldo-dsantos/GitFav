import { githubUser } from "./GithubUser.js"

export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.tbody = this.root.querySelector('table tbody')

    this.load()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value) 
    }
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [] 
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try { 
      
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) { 
        throw new Error('Usuário já Cadastrado!')
      }      

      const user = await githubUser.search(username)
      
      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
        alert(error.message)
      }
    }

  delete(user) {
    const filteredEntries = this.entries 
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries 
    this.update()
    this.save()
  }
}

export class favoritesView extends favorites {
  constructor(root) {
    super(root)

    this.update()
  }
    
  update() {

    this.noFavorites()
    this.removeAllTr()
    
    this.entries.forEach(user => { 
      const row = this.createRow() 
      row.querySelector('.user img').src = `https://github.com/${user.login}.png` 
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}/`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories p').textContent = user.public_repos
      row.querySelector('.followers p').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row) 
    })
  }

  createRow() {
    const tr = document.createElement('tr')

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
    return tr 
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
    .forEach(tr => {
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