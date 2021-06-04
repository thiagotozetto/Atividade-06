let jogo;

const elementos = {
  telaEscolha: document.getElementById('escolha'),
  telaInicial: document.getElementById('inicial'),
  telaCadastro: document.getElementById('formulario-cadastro'),
  telaJogo: document.getElementById('jogo'),
  telaMensagem: document.querySelector('.mensagem'),
  textoMensagem: document.querySelector('.mensagem .texto'),
  telaMensagemDica: document.querySelector('.mensagem-dica'),
  textoMensagemDica: document.querySelector('.mensagem-dica .texto'),
  teclado: document.querySelector('.teclado'),
  palavra: document.querySelector('.palavra'),
  botoes: {
    jogar: document.querySelector('.botao-jogar'),
    cadastrar: document.querySelector('.botao-cadastrar'),
    cadastrarPalavra: document.querySelector('.botao-cadastrar-palavra'),
    voltar1: document.querySelector('.botao-voltar1'),
    voltar2: document.querySelector('.botao-voltar2'),
    facil: document.querySelector('.botao-facil'),
    medio: document.querySelector('.botao-medio'),
    dificil: document.querySelector('.botao-dificil'),
    reiniciar: document.querySelector('.reiniciar'),
  },
  boneco: [
    document.querySelector('.boneco-cabeca'),
    document.querySelector('.boneco-corpo'),
    document.querySelector('.boneco-braco-esquerdo'),
    document.querySelector('.boneco-braco-direito'),
    document.querySelector('.boneco-perna-esquerda'),
    document.querySelector('.boneco-perna-direita'),
  ],
};

const palavras = {
  facil: [
    { palavra: 'Anciã', dica: 'Algo antigo' },
    { palavra: 'Noite', dica: 'É escuro'},
    { palavra: 'Série', dica: 'Possui temporadas' },
  ],
  medio: [
    { palavra: 'Cônjuge', dica: 'Companheiro(a) da relação' },
    { palavra: 'Exceção', dica: 'Diferente da regra' },
    { palavra: 'Caráter', dica: 'Característica sobre alguém' },
  ],
  dificil: [
    { palavra: 'Concepção', dica: 'Ponto de vista sobre algo' },
    { palavra: 'Essencial', dica: 'Necessário para algo' },
    { palavra: 'Propósito', dica: 'Função sobre algo' },
  ],
};

const novoJogo = () => {
  jogo = {
    dificuldade: undefined,
    palavra: {
      original: undefined,
      dica: undefined,
      semAcentos: undefined,
      tamanho: undefined,
    },
    acertos: undefined,
    jogadas: [],
    chances: 6,
    definirPalavra: function (palavra, dica) {
      this.palavra.original = palavra;
      this.palavra.dica = dica;
      this.palavra.tamanho = palavra.length;
      this.acertos = '';
      this.palavra.semAcentos = this.palavra.original.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      for (let i = 0; i < this.palavra.tamanho; i++) {
        this.acertos += ' ';
      }
    },
    jogar: function (letraJogada) {
      let acertou = false;
      for (let i = 0; i < this.palavra.tamanho; i++) {
        const letra = this.palavra.semAcentos[i].toLowerCase();
        if (letra === letraJogada.toLowerCase()) {
          acertou = true;
          this.acertos = replace(this.acertos, i, this.palavra.original[i]);
        }
      }
      if (!acertou) {
        this.chances--;
      }
      return acertou;
    },
    getDica: function () {
      return this.palavra.dica;
    },
    ganhou: function () {
      return !this.acertos.includes(' ');
    },
    perdeu: function () {
      return this.chances <= 0;
    },
    acabou: function () {
      return this.ganhou() || this.perdeu();
    },
  };

  elementos.telaEscolha.style.display = 'flex';
  elementos.telaInicial.style.display = 'none';
  elementos.telaCadastro.style.display = 'none';
  elementos.telaJogo.style.display = 'none';
  elementos.telaMensagem.style.display = 'none';
  elementos.telaMensagemDica.style.display = 'none';
  elementos.telaMensagem.classList.remove('mensagem-vitoria');
  elementos.telaMensagem.classList.remove('mensagem-derrota');
  for (const parte of elementos.boneco) {
    parte.classList.remove('escondido');
    parte.classList.add('escondido');
  }

  criarTeclado();
};

const criarTeclado = () => {
  const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  elementos.teclado.textContent = '';
  for (const letra of letras) {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(letra.toUpperCase()));
    button.classList.add(`botao-${letra}`);

    elementos.teclado.appendChild(button);

    button.addEventListener('click', () => {
      if (!jogo.jogadas.includes(letra) && !jogo.acabou()) {
        const acertou = jogo.jogar(letra);
        jogo.jogadas.push(letra);
        button.classList.add(acertou ? 'certo' : 'errado');
        mostrarPalavra();

        if (!acertou) {
          mostrarErro();
        }

        if (jogo.ganhou()) {
          mostrarMensagem(true);
        } else if (jogo.perdeu()) {
          mostrarMensagem(false);
        }
      }
    });
  }
};

const mostrarErro = () => {
  const parte = elementos.boneco[5 - jogo.chances];
  parte.classList.remove('escondido');
};

const mostrarMensagem = vitoria => {
  const mensagem = vitoria ? '<p>Parabéns!</p><p>Você GANHOU!</p>' : '<p>Que pena!</p><p>Você PERDEU!</p>';
  elementos.textoMensagem.innerHTML = mensagem;
  elementos.telaMensagem.style.display = 'flex';
  elementos.telaMensagemDica.style.display = 'none';
  elementos.telaMensagem.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);
};

const sortearPalavra = () => {
  const i = Math.floor(Math.random() * palavras[jogo.dificuldade].length);
  const palavra = palavras[jogo.dificuldade][i].palavra;
  const dica = palavras[jogo.dificuldade][i].dica;
  jogo.definirPalavra(palavra, dica);

  return jogo.palavra.original;
};

const mostrarPalavra = () => {
  elementos.palavra.textContent = '';
  for (let i = 0; i < jogo.acertos.length; i++) {
    const letra = jogo.acertos[i].toUpperCase();
    elementos.palavra.innerHTML += `<div class="letra-${i}">${letra}</div>`;
  }
};

const iniciarJogo = dificuldade => {
  jogo.dificuldade = dificuldade;
  elementos.telaInicial.style.display = 'none';
  elementos.telaJogo.style.display = 'flex';

  sortearPalavra();
  mostrarPalavra();
  mostrarDica(jogo.getDica());
};

const replace = (str, i, newChar) => str.substring(0, i) + newChar + str.substring(i + 1);

const escolherDificuldade = () => {
  elementos.telaEscolha.style.display = 'none';
  elementos.telaInicial.style.display = 'flex';
};

const formularioCadastro = () => {
  elementos.telaEscolha.style.display = 'none';
  elementos.telaCadastro.style.display = 'flex';
};

const cadastrarPalavra = () => {
  var dificuldade = document.getElementById('dificuldade').value;
  var palavra = document.getElementById('palavra').value;
  var dica = document.getElementById('dica').value;

  if (palavra !== '' && dica !== '') {
    palavras[dificuldade].push({
      palavra,
      dica,
    });

    document.getElementById('dificuldade').value = 'facil';
    document.getElementById('palavra').value = '';
    document.getElementById('dica').value = '';

    alert('Palavra Cadastrada!');
  } else {
    alert('Preencha todos os campos!');
  }
};

const mostrarDica = dica => {
  const mensagem = '<p>' + dica + '</p>';
  elementos.textoMensagemDica.innerHTML = mensagem;
  elementos.telaMensagemDica.style.display = 'flex';
};

elementos.botoes.jogar.addEventListener('click', () => escolherDificuldade());
elementos.botoes.cadastrar.addEventListener('click', () => formularioCadastro());
elementos.botoes.cadastrarPalavra.addEventListener('click', () => cadastrarPalavra());
elementos.botoes.voltar1.addEventListener('click', () => novoJogo());
elementos.botoes.voltar2.addEventListener('click', () => novoJogo());

elementos.botoes.facil.addEventListener('click', () => iniciarJogo('facil'));
elementos.botoes.medio.addEventListener('click', () => iniciarJogo('medio'));
elementos.botoes.dificil.addEventListener('click', () => iniciarJogo('dificil'));

elementos.botoes.reiniciar.addEventListener('click', () => novoJogo());

novoJogo();
