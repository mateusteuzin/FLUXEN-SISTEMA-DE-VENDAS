export type CustomerStatus = 'vip' | 'ativo' | 'em_risco';
export type SupplierStatus = 'homologado' | 'negociacao' | 'critico';
export type CategoryStatus = 'ativa' | 'sazonal' | 'nova';
export type ServiceStatus = 'ativo' | 'implantacao' | 'pausado';
export type QuoteStatus = 'rascunho' | 'enviado' | 'negociacao' | 'aprovado' | 'expirado';
export type ServiceOrderPriority = 'baixa' | 'media' | 'alta' | 'critica';
export type ServiceOrderStatus = 'aberta' | 'em_execucao' | 'aguardando' | 'concluida';
export type InvoiceStatus = 'rascunho' | 'emitida' | 'autorizada' | 'cancelada';
export type InvoiceType = 'nfe' | 'nfse';

export interface CustomerRecord {
  id: string;
  name: string;
  segment: string;
  city: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  lastOrderAt: string;
  totalSpent: number;
  openQuotes: number;
}

export interface SupplierRecord {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  leadTimeDays: number;
  rating: number;
  status: SupplierStatus;
}

export interface CategoryRecord {
  id: string;
  name: string;
  code: string;
  itemsCount: number;
  marginTarget: number;
  status: CategoryStatus;
}

export interface ServiceRecord {
  id: string;
  name: string;
  category: string;
  price: number;
  durationHours: number;
  slaHours: number;
  assignee: string;
  status: ServiceStatus;
  recurring: boolean;
}

export interface QuoteRecord {
  id: string;
  code: string;
  client: string;
  amount: number;
  status: QuoteStatus;
  validUntil: string;
  seller: string;
  channel: string;
  createdAt: string;
}

export interface ServiceOrderRecord {
  id: string;
  code: string;
  client: string;
  service: string;
  technician: string;
  priority: ServiceOrderPriority;
  status: ServiceOrderStatus;
  scheduledFor: string;
  amount: number;
}

export interface InvoiceRecord {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  series: string;
  type: InvoiceType;
}

export interface SystemSettingsRecord {
  companyName: string;
  companyDocument: string;
  supportEmail: string;
  supportPhone: string;
  quoteValidityDays: number;
  lowStockAlert: number;
  defaultPaymentTermDays: number;
  autoInvoice: boolean;
  sendWhatsAppReports: boolean;
  enableServiceSla: boolean;
  fiscalSeries: string;
  primaryWarehouse: string;
  commercialNotes: string;
}

export interface ErpModuleState {
  customers: CustomerRecord[];
  suppliers: SupplierRecord[];
  categories: CategoryRecord[];
  services: ServiceRecord[];
  quotes: QuoteRecord[];
  serviceOrders: ServiceOrderRecord[];
  invoices: InvoiceRecord[];
  settings: SystemSettingsRecord;
}

export interface CustomerPayload {
  name: string;
  segment: string;
  city: string;
  email: string;
  phone: string;
  status: CustomerStatus;
}

export interface SupplierPayload {
  name: string;
  category: string;
  contact: string;
  phone: string;
  leadTimeDays: number;
  rating: number;
  status: SupplierStatus;
}

export interface CategoryPayload {
  name: string;
  code: string;
  itemsCount: number;
  marginTarget: number;
  status: CategoryStatus;
}

export interface ServicePayload {
  name: string;
  category: string;
  price: number;
  durationHours: number;
  slaHours: number;
  assignee: string;
  status: ServiceStatus;
  recurring: boolean;
}

export interface QuotePayload {
  client: string;
  amount: number;
  seller: string;
  channel: string;
  validUntil: string;
  status: QuoteStatus;
}

export interface ServiceOrderPayload {
  client: string;
  service: string;
  technician: string;
  priority: ServiceOrderPriority;
  status: ServiceOrderStatus;
  scheduledFor: string;
  amount: number;
}

export interface InvoicePayload {
  client: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  series: string;
  type: InvoiceType;
}

const STORAGE_KEY = 'gestor-vendas-pro.erp-modules';

type PersistedErpModuleState = ErpModuleState & {
  __invoiceResetApplied?: boolean;
};

const isBrowser = () => typeof window !== 'undefined';

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `erp-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
};

const dateWithOffset = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const padCode = (value: number) => String(value).padStart(4, '0');

const readAllStates = (): Record<string, PersistedErpModuleState> => {
  if (!isBrowser()) return {};

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, PersistedErpModuleState>;
  } catch {
    return {};
  }
};

const writeAllStates = (state: Record<string, PersistedErpModuleState>) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const normalizePersistedState = (state: PersistedErpModuleState): PersistedErpModuleState => {
  if (state.__invoiceResetApplied) {
    return state;
  }

  return {
    ...state,
    invoices: [],
    __invoiceResetApplied: true,
  };
};

const buildSeedState = (): ErpModuleState => ({
  customers: [
    {
      id: createId(),
      name: 'Loja Centro Max',
      segment: 'Varejo',
      city: 'Sao Paulo',
      email: 'compras@centromax.com.br',
      phone: '(11) 99870-2201',
      status: 'vip',
      lastOrderAt: dateWithOffset(-2),
      totalSpent: 28450,
      openQuotes: 2,
    },
    {
      id: createId(),
      name: 'Clinica Vida Integrada',
      segment: 'Saude',
      city: 'Campinas',
      email: 'financeiro@vidaintegrada.com.br',
      phone: '(19) 99120-7612',
      status: 'ativo',
      lastOrderAt: dateWithOffset(-9),
      totalSpent: 16420,
      openQuotes: 1,
    },
    {
      id: createId(),
      name: 'Restaurante Ponto Nobre',
      segment: 'Food Service',
      city: 'Santos',
      email: 'operacao@pontonobre.com.br',
      phone: '(13) 98813-1044',
      status: 'ativo',
      lastOrderAt: dateWithOffset(-4),
      totalSpent: 11870,
      openQuotes: 0,
    },
    {
      id: createId(),
      name: 'Studio Bela Forma',
      segment: 'Servicos',
      city: 'Sao Bernardo',
      email: 'contato@belaforma.com.br',
      phone: '(11) 97452-8130',
      status: 'em_risco',
      lastOrderAt: dateWithOffset(-27),
      totalSpent: 6320,
      openQuotes: 1,
    },
  ],
  suppliers: [
    {
      id: createId(),
      name: 'Distribuidora Atlas',
      category: 'Acessorios',
      contact: 'Rafaela Monteiro',
      phone: '(11) 98901-2200',
      leadTimeDays: 3,
      rating: 4.8,
      status: 'homologado',
    },
    {
      id: createId(),
      name: 'Prime Tech Import',
      category: 'Eletronicos',
      contact: 'Anderson Leal',
      phone: '(21) 98210-5582',
      leadTimeDays: 7,
      rating: 4.5,
      status: 'homologado',
    },
    {
      id: createId(),
      name: 'Nova Embalagens',
      category: 'Suprimentos',
      contact: 'Paula Matos',
      phone: '(41) 98841-9941',
      leadTimeDays: 5,
      rating: 4.2,
      status: 'negociacao',
    },
    {
      id: createId(),
      name: 'Mercurio Fiscal',
      category: 'Servicos fiscais',
      contact: 'Bruno Couto',
      phone: '(31) 99232-7701',
      leadTimeDays: 10,
      rating: 3.7,
      status: 'critico',
    },
  ],
  categories: [
    {
      id: createId(),
      name: 'Linha Premium',
      code: 'PREM',
      itemsCount: 18,
      marginTarget: 32,
      status: 'ativa',
    },
    {
      id: createId(),
      name: 'Giro Rapido',
      code: 'GIRO',
      itemsCount: 26,
      marginTarget: 19,
      status: 'ativa',
    },
    {
      id: createId(),
      name: 'Sazonal',
      code: 'SAZO',
      itemsCount: 8,
      marginTarget: 24,
      status: 'sazonal',
    },
    {
      id: createId(),
      name: 'Novos Projetos',
      code: 'NEW',
      itemsCount: 5,
      marginTarget: 28,
      status: 'nova',
    },
  ],
  services: [
    {
      id: createId(),
      name: 'Instalacao assistida',
      category: 'Implementacao',
      price: 890,
      durationHours: 4,
      slaHours: 24,
      assignee: 'Equipe CS',
      status: 'ativo',
      recurring: false,
    },
    {
      id: createId(),
      name: 'Suporte premium',
      category: 'Suporte',
      price: 490,
      durationHours: 2,
      slaHours: 4,
      assignee: 'Suporte N2',
      status: 'ativo',
      recurring: true,
    },
    {
      id: createId(),
      name: 'Treinamento comercial',
      category: 'Capacitacao',
      price: 1250,
      durationHours: 6,
      slaHours: 48,
      assignee: 'Consultoria',
      status: 'implantacao',
      recurring: false,
    },
    {
      id: createId(),
      name: 'Auditoria fiscal',
      category: 'Backoffice',
      price: 1680,
      durationHours: 8,
      slaHours: 72,
      assignee: 'Fiscal',
      status: 'pausado',
      recurring: false,
    },
  ],
  quotes: [
    {
      id: createId(),
      code: 'ORC-0001',
      client: 'Loja Centro Max',
      amount: 12800,
      status: 'negociacao',
      validUntil: dateWithOffset(5),
      seller: 'Marina Souza',
      channel: 'WhatsApp',
      createdAt: dateWithOffset(-3),
    },
    {
      id: createId(),
      code: 'ORC-0002',
      client: 'Clinica Vida Integrada',
      amount: 9420,
      status: 'aprovado',
      validUntil: dateWithOffset(2),
      seller: 'Igor Lima',
      channel: 'Indicacao',
      createdAt: dateWithOffset(-6),
    },
    {
      id: createId(),
      code: 'ORC-0003',
      client: 'Studio Bela Forma',
      amount: 4180,
      status: 'enviado',
      validUntil: dateWithOffset(3),
      seller: 'Marina Souza',
      channel: 'Instagram',
      createdAt: dateWithOffset(-1),
    },
    {
      id: createId(),
      code: 'ORC-0004',
      client: 'Autopecas Prado',
      amount: 15100,
      status: 'rascunho',
      validUntil: dateWithOffset(9),
      seller: 'Joao Costa',
      channel: 'Outbound',
      createdAt: dateWithOffset(0),
    },
  ],
  serviceOrders: [
    {
      id: createId(),
      code: 'OS-0001',
      client: 'Loja Centro Max',
      service: 'Instalacao assistida',
      technician: 'Aline Rocha',
      priority: 'alta',
      status: 'em_execucao',
      scheduledFor: dateWithOffset(1),
      amount: 890,
    },
    {
      id: createId(),
      code: 'OS-0002',
      client: 'Clinica Vida Integrada',
      service: 'Suporte premium',
      technician: 'Vitor Braga',
      priority: 'media',
      status: 'aguardando',
      scheduledFor: dateWithOffset(0),
      amount: 490,
    },
    {
      id: createId(),
      code: 'OS-0003',
      client: 'Restaurante Ponto Nobre',
      service: 'Treinamento comercial',
      technician: 'Renata Melo',
      priority: 'critica',
      status: 'aberta',
      scheduledFor: dateWithOffset(2),
      amount: 1250,
    },
    {
      id: createId(),
      code: 'OS-0004',
      client: 'Studio Bela Forma',
      service: 'Auditoria fiscal',
      technician: 'Bruno Couto',
      priority: 'baixa',
      status: 'concluida',
      scheduledFor: dateWithOffset(-2),
      amount: 1680,
    },
  ],
  invoices: [],
  settings: {
    companyName: 'FLUXEN Sistema de Vendas',
    companyDocument: '12.345.678/0001-90',
    supportEmail: 'suporte@gestorvendaspro.com.br',
    supportPhone: '(11) 4000-2211',
    quoteValidityDays: 7,
    lowStockAlert: 5,
    defaultPaymentTermDays: 21,
    autoInvoice: true,
    sendWhatsAppReports: true,
    enableServiceSla: true,
    fiscalSeries: '1',
    primaryWarehouse: 'CD Principal',
    commercialNotes: 'Ambiente pronto para demonstracao comercial, onboarding e operacao diaria.',
  },
});

const updateState = (
  userId: string,
  updater: (current: ErpModuleState) => ErpModuleState,
) => {
  const states = readAllStates();
  const current = normalizePersistedState(states[userId] ?? buildSeedState());
  const next = normalizePersistedState(updater(current));
  states[userId] = next;
  writeAllStates(states);
  return next;
};

export const getErpModuleState = (userId: string): ErpModuleState => {
  const states = readAllStates();
  const current = normalizePersistedState(states[userId] ?? buildSeedState());

  if (!states[userId] || states[userId] !== current) {
    states[userId] = current;
    writeAllStates(states);
  }

  return current;
};

export const createCustomer = (userId: string, payload: CustomerPayload) => updateState(userId, (current) => ({
  ...current,
  customers: [
    {
      id: createId(),
      ...payload,
      lastOrderAt: new Date().toISOString(),
      totalSpent: 0,
      openQuotes: 0,
    },
    ...current.customers,
  ],
}));

export const createSupplier = (userId: string, payload: SupplierPayload) => updateState(userId, (current) => ({
  ...current,
  suppliers: [
    {
      id: createId(),
      ...payload,
    },
    ...current.suppliers,
  ],
}));

export const createCategory = (userId: string, payload: CategoryPayload) => updateState(userId, (current) => ({
  ...current,
  categories: [
    {
      id: createId(),
      ...payload,
    },
    ...current.categories,
  ],
}));

export const createService = (userId: string, payload: ServicePayload) => updateState(userId, (current) => ({
  ...current,
  services: [
    {
      id: createId(),
      ...payload,
    },
    ...current.services,
  ],
}));

export const createQuote = (userId: string, payload: QuotePayload) => updateState(userId, (current) => ({
  ...current,
  quotes: [
    {
      id: createId(),
      code: `ORC-${padCode(current.quotes.length + 1)}`,
      createdAt: new Date().toISOString(),
      ...payload,
    },
    ...current.quotes,
  ],
}));

export const updateQuoteStatus = (userId: string, quoteId: string, status: QuoteStatus) => updateState(userId, (current) => ({
  ...current,
  quotes: current.quotes.map((quote) => (
    quote.id === quoteId
      ? { ...quote, status }
      : quote
  )),
}));

export const createServiceOrder = (userId: string, payload: ServiceOrderPayload) => updateState(userId, (current) => ({
  ...current,
  serviceOrders: [
    {
      id: createId(),
      code: `OS-${padCode(current.serviceOrders.length + 1)}`,
      ...payload,
    },
    ...current.serviceOrders,
  ],
}));

export const updateServiceOrderStatus = (
  userId: string,
  orderId: string,
  status: ServiceOrderStatus,
) => updateState(userId, (current) => ({
  ...current,
  serviceOrders: current.serviceOrders.map((order) => (
    order.id === orderId
      ? { ...order, status }
      : order
  )),
}));

export const createInvoice = (userId: string, payload: InvoicePayload) => updateState(userId, (current) => ({
  ...current,
  invoices: [
    {
      id: createId(),
      number: String(20260000 + current.invoices.length + 1),
      ...payload,
    },
    ...current.invoices,
  ],
}));

export const updateInvoiceStatus = (userId: string, invoiceId: string, status: InvoiceStatus) => updateState(userId, (current) => ({
  ...current,
  invoices: current.invoices.map((invoice) => (
    invoice.id === invoiceId
      ? { ...invoice, status }
      : invoice
  )),
}));

export const saveSystemSettings = (
  userId: string,
  payload: SystemSettingsRecord,
) => updateState(userId, (current) => ({
  ...current,
  settings: payload,
}));
