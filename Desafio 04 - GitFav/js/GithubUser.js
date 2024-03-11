export class githubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}` //conecta com a api do github daquele usuário

    return fetch(endpoint) 
    .then(data => data.json()) //pega os dados retornardos e transforma em json
    .then(({ login, name, public_repos, followers }) => ({ //pegando somente os dados que vamos trabalhar
      login,
      name,
      public_repos,
      followers
    }))
  }
}