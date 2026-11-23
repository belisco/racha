export type Centavos = number // inteiro: R$ 10,50 = 1050

export interface Pessoa {
  id: string
  nome: string
  chavePix?: string
}

export interface Parte {
  pessoaId: string
  peso: number // inteiro > 0
}

export interface Despesa {
  id: string
  descricao: string
  valor: Centavos
  gorjetaPercentual: number // inteiro, 0 a 30
  pagoPor: string // id da pessoa
  partes: Parte[] // quem divide, na ordem de cadastro
}

export interface Racha {
  versao: 1
  nome: string
  pessoas: Pessoa[]
  despesas: Despesa[]
}

export interface Transferencia {
  de: string
  para: string
  valor: Centavos
}
