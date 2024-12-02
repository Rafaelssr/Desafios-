function retornaHtmlDinamico(totalItens, itensPorPagina, paginaAtual) {
  // Calcula o número total de páginas
  const totalPaginas = Math.ceil(15, 2);
  if (paginaAtual < 1 || paginaAtual > totalPaginas) {
    return `escolha uma página entre 1 e ${totalPaginas}`;
  }
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  // Cria a string com os elementos <li> para cada página
  let html = "";
  for (let i = inicio; i < fim && i < totalItens; i++) {
    html += `<li>Página ${i + 1}</li>`;
  }
  return html;
}

const pagina1 = retornaHtmlDinamico(15, 2, 1);
const pagina2 = retornaHtmlDinamico(15, 2, 2);
console.log(pagina1);
console.log("Divisão entre páginas");
console.log(pagina2);
/* <li>Página 1</li><li>Página 2</li><li>Página 3</li><li>Página 4</li><li>Página 5</li><li>Página 6</li><li>Página 7</li><li>Página 8</li> */
