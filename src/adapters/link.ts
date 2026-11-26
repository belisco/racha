const PREFIXO = '#r='

export const TAMANHO_MAXIMO_DO_LINK = 2000

// devolve o código depois de #r=, ou null quando a URL não traz um racha
export function lerCodigoDoLink(): string | null {
  const { hash } = window.location

  return hash.startsWith(PREFIXO) ? hash.slice(PREFIXO.length) : null
}

export function limparLink(): void {
  if (lerCodigoDoLink() === null) {
    return
  }

  const { pathname, search } = window.location
  window.history.replaceState(null, '', pathname + search)
}

export function montarLink(codigo: string): string {
  const { origin, pathname } = window.location

  return `${origin}${pathname}${PREFIXO}${codigo}`
}

export function linkEhLongo(link: string): boolean {
  return link.length > TAMANHO_MAXIMO_DO_LINK
}
