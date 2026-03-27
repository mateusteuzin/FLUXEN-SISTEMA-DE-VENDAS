export interface AppUser {
  id: string;
  email: string;
}

export interface AppSession {
  user: AppUser;
}

export interface EmpresaRecord {
  id: string;
  user_id: string;
  nome: string;
  created_at: string;
  updated_at: string;
}

export interface ProdutoRecord {
  id: string;
  user_id: string;
  nome: string;
  preco: number;
  quantidade: number;
  created_at: string;
  updated_at: string;
}

export type CaixaFormaPagamento = 'dinheiro' | 'pix' | 'debito' | 'credito';
export type CaixaOrigem = 'manual' | 'venda';

export interface CaixaRecord {
  id: string;
  user_id: string;
  tipo: 'entrada' | 'saida' | 'sangria';
  valor: number;
  descricao: string | null;
  origem: CaixaOrigem | null;
  categoria: string | null;
  forma_pagamento: CaixaFormaPagamento | null;
  produto_id: string | null;
  produto_nome: string | null;
  quantidade: number | null;
  taxa_percentual: number | null;
  valor_bruto: number | null;
  valor_taxa: number | null;
  created_at: string;
}

export interface VendaRecord {
  id: string;
  user_id: string;
  total: number;
  forma_pagamento: CaixaFormaPagamento | null;
  taxa_percentual: number | null;
  valor_taxa: number | null;
  valor_liquido: number | null;
  created_at: string;
}

export interface VendaItemRecord {
  id: string;
  venda_id: string;
  produto_id: string;
  produto_nome: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface VendaComItens extends VendaRecord {
  venda_itens: VendaItemRecord[];
}

interface LocalUserRecord extends AppUser {
  password: string;
  created_at: string;
}

interface LocalDb {
  users: LocalUserRecord[];
  empresa: EmpresaRecord[];
  produtos: ProdutoRecord[];
  caixa: CaixaRecord[];
  vendas: VendaRecord[];
  venda_itens: VendaItemRecord[];
}

interface LocalSaleInput {
  produto: {
    id: string;
    nome: string;
    preco: number;
  };
  qtd: number;
}

interface LocalSalePaymentInput {
  forma_pagamento: CaixaFormaPagamento;
  taxa_percentual: number;
}

interface ProdutoPayload {
  nome: string;
  preco: number;
  quantidade: number;
}

interface CaixaPayload {
  tipo: CaixaRecord['tipo'];
  valor: number;
  descricao: string | null;
  origem?: CaixaOrigem | null;
  categoria?: string | null;
  forma_pagamento?: CaixaFormaPagamento | null;
  produto_id?: string | null;
  produto_nome?: string | null;
  quantidade?: number | null;
  taxa_percentual?: number | null;
  valor_bruto?: number | null;
  valor_taxa?: number | null;
}

const DB_KEY = 'loja-simples-facil.local-db';
const SESSION_KEY = 'loja-simples-facil.local-session';

const emptyDb = (): LocalDb => ({
  users: [],
  empresa: [],
  produtos: [],
  caixa: [],
  vendas: [],
  venda_itens: [],
});

const isBrowser = () => typeof window !== 'undefined';

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `local-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const sortByCreatedAtDesc = <T extends { created_at: string }>(items: T[]) =>
  [...items].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

const isSameDay = (value: string) => {
  const current = new Date();
  const compare = new Date(value);

  return current.getFullYear() === compare.getFullYear()
    && current.getMonth() === compare.getMonth()
    && current.getDate() === compare.getDate();
};

const readDb = (): LocalDb => {
  if (!isBrowser()) return emptyDb();

  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) return emptyDb();

  try {
    return { ...emptyDb(), ...JSON.parse(raw) } as LocalDb;
  } catch {
    return emptyDb();
  }
};

const writeDb = (db: LocalDb) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const writeSession = (session: AppSession | null) => {
  if (!isBrowser()) return;

  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

const ensureEmpresa = (db: LocalDb, userId: string) => {
  const existing = db.empresa.find((item) => item.user_id === userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const empresa: EmpresaRecord = {
    id: generateId(),
    user_id: userId,
    nome: 'Minha Empresa',
    created_at: now,
    updated_at: now,
  };

  db.empresa.push(empresa);
  return empresa;
};

export const getLocalSession = (): AppSession | null => {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppSession;
  } catch {
    return null;
  }
};

export const signInLocal = (email: string, password: string): AppSession => {
  const db = readDb();
  const normalizedEmail = normalizeEmail(email);
  const user = db.users.find(
    (item) => item.email === normalizedEmail && item.password === password,
  );

  if (!user) {
    throw new Error('Email ou senha invalidos.');
  }

  const session: AppSession = {
    user: {
      id: user.id,
      email: user.email,
    },
  };

  writeSession(session);
  return session;
};

export const signUpLocal = (email: string, password: string): AppSession => {
  const db = readDb();
  const normalizedEmail = normalizeEmail(email);
  const exists = db.users.some((item) => item.email === normalizedEmail);

  if (exists) {
    throw new Error('Ja existe uma conta com esse email.');
  }

  const now = new Date().toISOString();
  const user: LocalUserRecord = {
    id: generateId(),
    email: normalizedEmail,
    password,
    created_at: now,
  };

  db.users.push(user);
  ensureEmpresa(db, user.id);
  writeDb(db);

  const session: AppSession = {
    user: {
      id: user.id,
      email: user.email,
    },
  };

  writeSession(session);
  return session;
};

export const signOutLocal = () => {
  writeSession(null);
};

export const getLocalEmpresaNome = (userId: string) => {
  const db = readDb();
  const empresa = ensureEmpresa(db, userId);
  writeDb(db);
  return empresa.nome;
};

export const listLocalProdutos = (userId: string) => {
  const db = readDb();

  return [...db.produtos]
    .filter((item) => item.user_id === userId)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
};

export const saveLocalProduto = (
  userId: string,
  payload: ProdutoPayload,
  editId?: string,
) => {
  const db = readDb();
  const now = new Date().toISOString();

  if (editId) {
    const index = db.produtos.findIndex((item) => item.id === editId && item.user_id === userId);
    if (index === -1) throw new Error('Produto nao encontrado.');

    db.produtos[index] = {
      ...db.produtos[index],
      ...payload,
      updated_at: now,
    };
  } else {
    db.produtos.push({
      id: generateId(),
      user_id: userId,
      ...payload,
      created_at: now,
      updated_at: now,
    });
  }

  writeDb(db);
};

export const deleteLocalProduto = (userId: string, id: string) => {
  const db = readDb();
  db.produtos = db.produtos.filter((item) => !(item.user_id === userId && item.id === id));
  writeDb(db);
};

export const listLocalCaixaEntries = (userId: string) => {
  const db = readDb();
  return sortByCreatedAtDesc(
    db.caixa.filter((item) => item.user_id === userId),
  ).slice(0, 50);
};

export const addLocalCaixaEntry = (userId: string, payload: CaixaPayload) => {
  const db = readDb();
  db.caixa.push({
    id: generateId(),
    user_id: userId,
    origem: payload.origem ?? 'manual',
    categoria: payload.categoria ?? null,
    forma_pagamento: payload.forma_pagamento ?? null,
    produto_id: payload.produto_id ?? null,
    produto_nome: payload.produto_nome ?? null,
    quantidade: payload.quantidade ?? null,
    taxa_percentual: payload.taxa_percentual ?? null,
    valor_bruto: payload.valor_bruto ?? payload.valor,
    valor_taxa: payload.valor_taxa ?? 0,
    tipo: payload.tipo,
    valor: payload.valor,
    descricao: payload.descricao,
    created_at: new Date().toISOString(),
  });
  writeDb(db);
};

export const listLocalVendasHoje = (userId: string): VendaComItens[] => {
  const db = readDb();

  return sortByCreatedAtDesc(
    db.vendas.filter((item) => item.user_id === userId && isSameDay(item.created_at)),
  ).map((venda) => ({
    ...venda,
    venda_itens: db.venda_itens.filter((item) => item.venda_id === venda.id),
  }));
};

export const listLocalVendasPorData = (userId: string, dateISO: string): VendaComItens[] => {
  const db = readDb();
  // dateISO is YYYY-MM-DD
  return sortByCreatedAtDesc(
    db.vendas.filter((item) => item.user_id === userId && item.created_at.startsWith(dateISO)),
  ).map((venda) => ({
    ...venda,
    venda_itens: db.venda_itens.filter((item) => item.venda_id === venda.id),
  }));
};

export const listLocalVendas = (userId: string) => {
  const db = readDb();
  return sortByCreatedAtDesc(
    db.vendas.filter((item) => item.user_id === userId),
  );
};

export const listLocalVendasComItens = (userId: string): VendaComItens[] => {
  const db = readDb();

  return sortByCreatedAtDesc(
    db.vendas.filter((item) => item.user_id === userId),
  ).map((venda) => ({
    ...venda,
    venda_itens: db.venda_itens.filter((item) => item.venda_id === venda.id),
  }));
};

export const listLocalVendaTimeline = (userId: string) => {
  const db = readDb();
  const vendaDateById = new Map(
    db.vendas
      .filter((item) => item.user_id === userId)
      .map((item) => [item.id, item.created_at] as const),
  );

  return db.venda_itens.flatMap((item) => {
    const createdAt = vendaDateById.get(item.venda_id);
    if (!createdAt) return [];

    return [{
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      created_at: createdAt,
    }];
  });
};

export const finalizeLocalVenda = (userId: string, cart: LocalSaleInput[]) => {
  finalizeLocalVendaComPagamento(userId, cart, {
    forma_pagamento: 'pix',
    taxa_percentual: 0,
  });
};

export const finalizeLocalVendaComPagamento = (
  userId: string,
  cart: LocalSaleInput[],
  payment: LocalSalePaymentInput,
) => {
  if (cart.length === 0) {
    throw new Error('Adicione pelo menos um item a venda.');
  }

  const db = readDb();

  for (const cartItem of cart) {
    const produto = db.produtos.find(
      (item) => item.user_id === userId && item.id === cartItem.produto.id,
    );

    if (!produto) {
      throw new Error('Produto nao encontrado.');
    }

    if (cartItem.qtd > produto.quantidade) {
      throw new Error(`Estoque insuficiente para ${produto.nome}.`);
    }
  }

  const createdAt = new Date().toISOString();
  const vendaId = generateId();
  let totalBruto = 0;

  const itens = cart.map((cartItem) => {
    const produto = db.produtos.find(
      (item) => item.user_id === userId && item.id === cartItem.produto.id,
    );

    if (!produto) {
      throw new Error('Produto nao encontrado.');
    }

    const subtotal = Number(produto.preco) * cartItem.qtd;
    totalBruto += subtotal;

    return {
      id: generateId(),
      venda_id: vendaId,
      produto_id: produto.id,
      produto_nome: produto.nome,
      quantidade: cartItem.qtd,
      preco_unitario: Number(produto.preco),
      subtotal,
    } satisfies VendaItemRecord;
  });

  db.produtos = db.produtos.map((produto) => {
    const cartItem = cart.find((item) => item.produto.id === produto.id);
    if (!cartItem || produto.user_id !== userId) return produto;

    return {
      ...produto,
      quantidade: produto.quantidade - cartItem.qtd,
      updated_at: createdAt,
    };
  });

  db.vendas.push({
    id: vendaId,
    user_id: userId,
    total: totalBruto,
    forma_pagamento: payment.forma_pagamento,
    taxa_percentual: payment.taxa_percentual,
    valor_taxa: Number((totalBruto * payment.taxa_percentual / 100).toFixed(2)),
    valor_liquido: Number((totalBruto - (totalBruto * payment.taxa_percentual / 100)).toFixed(2)),
    created_at: createdAt,
  });

  const valorTaxa = Number((totalBruto * payment.taxa_percentual / 100).toFixed(2));
  const valorLiquido = Number((totalBruto - valorTaxa).toFixed(2));

  db.venda_itens.push(...itens);
  db.caixa.push({
    id: generateId(),
    user_id: userId,
    tipo: 'entrada',
    valor: valorLiquido,
    descricao: `Venda #${vendaId.slice(0, 8)}`,
    origem: 'venda',
    categoria: 'venda',
    forma_pagamento: payment.forma_pagamento,
    produto_id: null,
    produto_nome: null,
    quantidade: null,
    taxa_percentual: payment.taxa_percentual,
    valor_bruto: totalBruto,
    valor_taxa: valorTaxa,
    created_at: createdAt,
  });

  writeDb(db);
};

export const updateLocalVendaComPagamento = (
  userId: string,
  vendaId: string,
  newCart: LocalSaleInput[],
  payment: LocalSalePaymentInput,
) => {
  if (newCart.length === 0) {
    throw new Error('Adicione pelo menos um item à venda.');
  }

  const db = readDb();
  
  const oldItens = db.venda_itens.filter(item => item.venda_id === vendaId);

  // Restore stock of old items
  for (const oldItem of oldItens) {
    const produto = db.produtos.find(p => p.id === oldItem.produto_id && p.user_id === userId);
    if (produto) {
      produto.quantidade += oldItem.quantidade;
    }
  }

  // Deduct stock of new items
  for (const cartItem of newCart) {
    const produto = db.produtos.find(
      (item) => item.user_id === userId && item.id === cartItem.produto.id,
    );

    if (!produto) throw new Error(`Produto não encontrado: ${cartItem.produto.nome}`);
    if (cartItem.qtd > produto.quantidade) throw new Error(`Estoque insuficiente para ${produto.nome}.`);
    
    produto.quantidade -= cartItem.qtd;
  }

  // Update sale record
  const vendaIndex = db.vendas.findIndex(v => v.id === vendaId && v.user_id === userId);
  if (vendaIndex === -1) throw new Error('Venda não encontrada');

  let totalBruto = 0;
  
  const newItens: VendaItemRecord[] = newCart.map((cartItem) => {
    const produto = db.produtos.find(item => item.user_id === userId && item.id === cartItem.produto.id)!;
    const subtotal = Number(produto.preco) * cartItem.qtd;
    totalBruto += subtotal;

    return {
      id: generateId(),
      venda_id: vendaId,
      produto_id: produto.id,
      produto_nome: produto.nome,
      quantidade: cartItem.qtd,
      preco_unitario: Number(produto.preco),
      subtotal,
    };
  });

  const valorTaxa = Number((totalBruto * payment.taxa_percentual / 100).toFixed(2));
  const valorLiquido = Number((totalBruto - valorTaxa).toFixed(2));

  db.vendas[vendaIndex] = {
    ...db.vendas[vendaIndex],
    total: totalBruto,
    forma_pagamento: payment.forma_pagamento,
    taxa_percentual: payment.taxa_percentual,
    valor_taxa: valorTaxa,
    valor_liquido: valorLiquido,
  };

  // Replace items
  db.venda_itens = db.venda_itens.filter(item => item.venda_id !== vendaId);
  db.venda_itens.push(...newItens);

  // Find associated caixa entry and update
  const descricaoVenda = `Venda #${vendaId.slice(0, 8)}`;
  const caixaIndex = db.caixa.findIndex(c => c.user_id === userId && c.descricao === descricaoVenda);
  
  if (caixaIndex !== -1) {
    db.caixa[caixaIndex] = {
      ...db.caixa[caixaIndex],
      valor: valorLiquido,
      forma_pagamento: payment.forma_pagamento,
      taxa_percentual: payment.taxa_percentual,
      valor_bruto: totalBruto,
      valor_taxa: valorTaxa,
    };
  }

  writeDb(db);
};

export const getLocalDashboardStats = (userId: string) => {
  const db = readDb();
  const caixa = db.caixa.filter((item) => item.user_id === userId);
  const produtos = db.produtos.filter((item) => item.user_id === userId);
  const vendasHoje = db.vendas.filter((item) => item.user_id === userId && isSameDay(item.created_at));

  const saldo = caixa.reduce((acc, item) => (
    item.tipo === 'entrada' ? acc + Number(item.valor) : acc - Number(item.valor)
  ), 0);

  const totalHoje = vendasHoje.reduce((acc, item) => acc + Number(item.total), 0);

  return {
    saldo,
    produtos: produtos.length,
    vendasHoje: vendasHoje.length,
    totalHoje,
  };
};
