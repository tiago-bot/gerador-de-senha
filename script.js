const senhas = []; // Array para armazenar senhas geradas

function gerarSenha() {
    // Definir conjuntos de caracteres para cada tipo de senha
    const caracteres = {
        numeros: "0123456789",
        "letras-numeros": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        "letras-numeros-caracteres": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-+"
    };

    // Obter tipo, tamanho da senha e nome do site digitado
    const tipoSenha = document.getElementById("tipo-senha").value;
    const tamanhoSenha = parseInt(document.getElementById("tamanho-senha").value);
    const nomeSiteInput = document.getElementById("nome-site");
    const nomeSite = nomeSiteInput.value.trim(); // Obtém o valor e remove espaços em branco extras

    const conjuntoCaracteres = caracteres[tipoSenha];

    // Gerar senha aleatória
    let senha = "";
    for (let i = 0; i < tamanhoSenha; i++) {
        const indiceAleatorio = Math.floor(Math.random() * conjuntoCaracteres.length);
        senha += conjuntoCaracteres.charAt(indiceAleatorio);
    }

    // Exibir senha gerada
    const senhaInput = document.getElementById("senha");
    senhaInput.value = senha;
    senhaInput.setAttribute("data-original-value", senha); // Armazenar o valor original da senha para referência
    senhaInput.type = "text"; // Oculta a senha

    // Limpar campo de nome do site após a geração de senha
    nomeSiteInput.value = "";

    // Adicionar senha gerada ao histórico
    senhas.push({
        tipo: tipoSenha,
        tamanho: tamanhoSenha,
        nomeSite: nomeSite, // Adiciona o nome do site ao objeto de senha
        senha: senha,
    });

    // Salvar histórico de senhas no armazenamento local
    localStorage.setItem("senhaSalva", JSON.stringify(senhas));

    // Atualizar lista de histórico de senhas
    atualizarHistoricoSenhas();
}

function copiarSenha(senha) {
    // Copiar senha para área de transferência
    navigator.clipboard.writeText(senha);

    // Exibir mensagem de sucesso
    alert("Senha copiada para a área de transferência!");
}

function atualizarHistoricoSenhas() {
    // Limpar lista de histórico
    const listaSenhas = document.getElementById("lista-senhas");
    listaSenhas.innerHTML = "";

    // Adicionar cada senha do histórico à lista
    for (let i = 0; i < senhas.length; i++) {
        const senha = senhas[i];
        const itemLista = document.createElement("li");
        const textoSenha = document.createElement("span"); // Elemento para exibir a senha sem input
        const textoSite = document.createElement("span"); // Elemento para exibir o nome do site
        const botaoExcluir = document.createElement("button"); // Botão para excluir a senha
        const botaoCopiar = document.createElement("button"); // Botão para copiar a senha
        const botaoMostrar = document.createElement("button"); // Botão para mostrar/ocultar a senha
        botaoExcluir.innerHTML = '<i class="bi bi-trash"></i>'; // Ícone de lixeira
        botaoCopiar.innerHTML = '<i class="bi bi-clipboard"></i>'; // Ícone de copiar
        botaoMostrar.innerHTML = '<i class="bi bi-eye"></i>'; // Ícone do olho

        // Evento de clique para excluir a senha
        botaoExcluir.addEventListener("click", function() {
            if (confirm("Tem certeza de que deseja excluir esta senha?")) {
                senhas.splice(i, 1);
                localStorage.setItem("senhaSalva", JSON.stringify(senhas));
                atualizarHistoricoSenhas();
            }
        });

        // Evento de clique para copiar a senha
        botaoCopiar.addEventListener("click", function() {
            copiarSenha(senha.senha);
        });

        // Evento de clique para mostrar/ocultar a senha
        let senhaOculta = true;
        textoSenha.textContent = senha.senha.replace(/./g, "*"); // Exibir senha oculta inicialmente
        botaoMostrar.addEventListener("click", function() {
            if (senhaOculta) {
                textoSenha.textContent = senha.senha; // Mostrar a senha
                botaoMostrar.innerHTML = '<i class="bi bi-eye-slash"></i>'; // Ícone do olho fechado
            } else {
                textoSenha.textContent = senha.senha.replace(/./g, "*"); // Ocultar a senha
                botaoMostrar.innerHTML = '<i class="bi bi-eye"></i>'; // Ícone do olho aberto
            }
            senhaOculta = !senhaOculta; // Alternar entre mostrar e ocultar
        });

        // Define o texto do site
        textoSite.textContent = senha.nomeSite;

        // Adiciona os elementos à lista
        itemLista.appendChild(document.createTextNode(`${senha.tipo} - ${senha.tamanho} caracteres para `));
        itemLista.appendChild(textoSite);
        itemLista.appendChild(document.createTextNode(": "));
        itemLista.appendChild(textoSenha);
        itemLista.appendChild(botaoMostrar);
        itemLista.appendChild(botaoExcluir);
        itemLista.appendChild(botaoCopiar);
        listaSenhas.appendChild(itemLista);
    }
}

function exportarHistoricoPDF() {
    // Verifica se há senhas para exportar
    if (senhas.length === 0) {
        alert("Não há histórico de senhas para exportar.");
        return;
    }

    // Criar o conteúdo do PDF
    let conteudoPDF = "Histórico de senhas\n\n";
    for (const senha of senhas) {
        conteudoPDF += `${senha.tipo} - ${senha.tamanho} caracteres para ${senha.nomeSite}: ${senha.senha}\n`;
    }

    // Criar um novo documento PDF
    const pdf = new jsPDF();
    pdf.text(conteudoPDF, 10, 10);

    // Criar um link temporário e clicá-lo para iniciar o download
    const url = pdf.output("datauristring");
    const a = document.createElement("a");
    a.href = url;
    a.download = "historico_senhas.pdf"; // Nome do arquivo PDF
    a.click();

    // Liberar o objeto URL criado
    URL.revokeObjectURL(url);
}

function limparHistorico() {
    // Confirmar com o usuário
    const confirmacao = confirm("Deseja realmente limpar o histórico de senhas?");

    if (confirmacao) {
        // Limpar histórico de senhas
        localStorage.removeItem("senhaSalva");
        senhas.length = 0;

        // Atualizar lista de histórico
        atualizarHistoricoSenhas();
    }
}


// Atualizar histórico de senhas ao carregar a página
atualizarHistoricoSenhas();
