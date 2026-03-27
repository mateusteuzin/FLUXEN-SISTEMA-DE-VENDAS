import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir);
  if (!stat.isDirectory()) {
    callback(dir);
    return;
  }
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const wordsMap = {
  // --- NAVEGAÇÃO E MENU ---
  'relatorio': 'relatório', 'Relatorio': 'Relatório', 'relatorios': 'relatórios', 'Relatorios': 'Relatórios',
  'configuracao': 'configuração', 'Configuracao': 'Configuração', 'configuracoes': 'configurações', 'Configuracoes': 'Configurações',
  'historico': 'histórico', 'Historico': 'Histórico',
  'inicio': 'início', 'Inicio': 'Início',
  'proximo': 'próximo', 'Proximo': 'Próximo',
  'ultimo': 'último', 'Ultimo': 'Último',

  // --- FINANCEIRO E VENDAS ---
  'preco': 'preço', 'Preco': 'Preço', 'precos': 'preços', 'Precos': 'Preços',
  'cartao': 'cartão', 'Cartao': 'Cartão', 'cartoes': 'cartões', 'Cartoes': 'Cartões',
  'credito': 'crédito', 'Credito': 'Crédito',
  'debito': 'débito', 'Debito': 'Débito',
  'saida': 'saída', 'Saida': 'Saída', 'saidas': 'saídas', 'Saidas': 'Saídas',
  'balanco': 'balanço', 'Balanco': 'Balanço',
  'orcamento': 'orçamento', 'Orcamento': 'Orçamento', 'orcamentos': 'orçamentos', 'Orcamentos': 'Orçamentos',
  'transferencia': 'transferência', 'Transferencia': 'Transferência',
  'pago': 'pago', // ignore
  'servico': 'serviço', 'Servico': 'Serviço', 'servicos': 'serviços', 'Servicos': 'Serviços',

  // --- CADASTROS E DADOS ---
  'usuario': 'usuário', 'Usuario': 'Usuário', 'usuarios': 'usuários', 'Usuarios': 'Usuários',
  'descricao': 'descrição', 'Descricao': 'Descrição', 'descricoes': 'descrições', 'Descricoes': 'Descrições',
  'endereco': 'endereço', 'Endereco': 'Endereço',
  'codigo': 'código', 'Codigo': 'Código', 'codigos': 'códigos', 'Codigos': 'Códigos',
  'numero': 'número', 'Numero': 'Número', 'numeros': 'números', 'Numeros': 'Números',
  'atencao': 'atenção', 'Atencao': 'Atenção',
  'informacao': 'informação', 'Informacao': 'Informação', 'informacoes': 'informações', 'Informacoes': 'Informações',

  // --- STATUS E AÇÕES ---
  'acao': 'ação', 'Acao': 'Ação', 'acoes': 'ações', 'Acoes': 'Ações',
  'opcao': 'opção', 'Opcao': 'Opção', 'opcoes': 'opções', 'Opcoes': 'Opções',
  'concluido': 'concluído', 'Concluido': 'Concluído',
  'excluido': 'excluído', 'Excluido': 'Excluído',
  'edicao': 'edição', 'Edicao': 'Edição',
  'exclusao': 'exclusão', 'Exclusao': 'Exclusão',
  'situacao': 'situação', 'Situacao': 'Situação',
  'atualizacao': 'atualização', 'Atualizacao': 'Atualização',
  'funcao': 'função', 'Funcao': 'Função',
  'nao': 'não', 'Nao': 'Não', 'sao': 'são', 'Sao': 'São', 'ja': 'já', 'Ja': 'Já',
};

let processedFiles = 0;
let modifiedFiles = 0;

console.log("🚀 Iniciando Correção Global de Acentos...");

walk('./src', function(filePath) {
  // Foca em arquivos de código e ignora App.tsx para segurança total das rotas
  if ((filePath.endsWith('.tsx') || filePath.endsWith('.ts')) && 
      !filePath.includes('node_modules') && 
      !filePath.includes('App.tsx')) {
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    for (const [key, val] of Object.entries(wordsMap)) {
      /**
       * REGEX EXPLICADA:
       * (?<!import\s|from\s|const\s|function\s|<|@|\.|\/) -> Protege declarações técnicas e caminhos
       * \b(${key})\b -> Garante que mude a palavra exata (ex: não muda "usuarioID")
       * (?![a-zA-Z0-9_:=\/"'\(\.]) -> Garante que não é uma chave de objeto ou chamada de função
       */
      const regex = new RegExp(`(?<!import\\s|from\\s|const\\s|function\\s|<|@|\\.|\\/)\\b(${key})\\b(?![a-zA-Z0-9_:=\\/"'\\(\\.\\)])`, 'g');
      
      content = content.replace(regex, val);
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      modifiedFiles++;
      console.log(`✅ Texto Corrigido: ${filePath}`);
    }
    processedFiles++;
  }
});

console.log(`\n--- RESUMO FINAL ---`);
console.log(`Arquivos verificados: ${processedFiles}`);
console.log(`Arquivos com acentos corrigidos: ${modifiedFiles}`);
console.log(`\nLembre-se: O App.tsx foi ignorado por segurança. Se houver algo lá, mude manualmente.`);