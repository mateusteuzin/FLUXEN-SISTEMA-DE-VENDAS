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
  'nao': 'não', 'Nao': 'Não', 'sao': 'são', 'Sao': 'São', 'ja': 'já', 'Ja': 'Já',
  'acao': 'ação', 'Acao': 'Ação', 'acoes': 'ações', 'Acoes': 'Ações',
  'opcao': 'opção', 'Opcao': 'Opção', 'opcoes': 'opções', 'Opcoes': 'Opções',
  'configuracao': 'configuração', 'Configuracao': 'Configuração', 
  'configuracoes': 'configurações', 'Configuracoes': 'Configurações',
  'relatorio': 'relatório', 'Relatorio': 'Relatório', 'relatorios': 'relatórios', 'Relatorios': 'Relatórios',
  'usuario': 'usuário', 'Usuario': 'Usuário', 'usuarios': 'usuários', 'Usuarios': 'Usuários',
  'preco': 'preço', 'Preco': 'Preço', 'precos': 'preços', 'Precos': 'Preços',
  'descricao': 'descrição', 'Descricao': 'Descrição', 'descricoes': 'descrições', 'Descricoes': 'Descrições',
  'servico': 'serviço', 'Servico': 'Serviço', 'servicos': 'serviços', 'Servicos': 'Serviços',
  'concluido': 'concluído', 'Concluido': 'Concluído',
  'excluido': 'excluído', 'Excluido': 'Excluído',
  'proximo': 'próximo', 'Proximo': 'Próximo',
  'ultimo': 'último', 'Ultimo': 'Último',
};

let processedFiles = 0;
let modifiedFiles = 0;

console.log("🚀 Iniciando limpeza de acentos (Versão Blindada)...");

walk('./src', function(filePath) {
  if ((filePath.endsWith('.tsx') || filePath.endsWith('.ts')) && !filePath.includes('node_modules')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    for (const [key, val] of Object.entries(wordsMap)) {
      // REGEX ULTRA-PROTEGIDA:
      // 1. (?<!import\s|from\s|const\s|function\s|<) -> Não mexe se for import, declaração de função ou tag de componente.
      // 2. (?!['"/]) -> Não mexe se for parte de um caminho de arquivo.
      const regex = new RegExp(`(?<!import\\s|from\\s|const\\s|function\\s|<|\\/|@)(${key})(?![a-zA-Z0-9_:=\\/"'\\(])`, 'g');
      
      content = content.replace(regex, (match, p1, offset, string) => {
        // Verifica se a palavra está dentro de um caminho de importação (ex: "@/pages/...")
        const lineStart = string.lastIndexOf('\n', offset) + 1;
        const line = string.substring(lineStart, string.indexOf('\n', offset));
        if (line.includes('import') || line.includes('@/') || line.includes('./')) {
            return match; // Mantém o original
        }
        return val;
      });
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      modifiedFiles++;
      console.log(`✅ Ajustado: ${filePath}`);
    }
    processedFiles++;
  }
});

console.log(`\n--- Resumo ---`);
console.log(`Arquivos processados: ${processedFiles}`);
console.log(`Arquivos com texto corrigido: ${modifiedFiles}`);