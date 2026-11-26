import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

interface Props {
  codigo: string
  descricao: string
}

// SVG em vez de canvas: funciona igual no navegador e nos testes com jsdom
export function QrCodePix({ codigo, descricao }: Props) {
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    QRCode.toString(codigo, { type: 'svg', margin: 1 }).then((resultado) => {
      if (!cancelado) {
        setSvg(resultado)
      }
    })

    return () => {
      cancelado = true
    }
  }, [codigo])

  if (svg === null) {
    return null
  }

  return (
    <img
      className="qrcode"
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
      alt={descricao}
      width={160}
      height={160}
    />
  )
}
