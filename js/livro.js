class Livro {
  constructor(titulo, autor, editora, ano, isbn, categoria, descricao) {
    this.titulo = titulo;
    this.autor = autor;
    this.editora = editora;
    this.ano = ano;
    this.isbn = isbn;
    this.categoria = categoria;
    this.descricao = descricao;
  }

  exibirResumo() {
    return `${this.titulo} (${this.ano})\nAutor: ${this.autor}\nEditora: ${this.editora}\nCategoria: ${this.categoria}\nISBN: ${this.isbn}\n\n${this.descricao}`;
  }
}