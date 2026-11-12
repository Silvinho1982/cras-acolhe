
import { jsPDF } from 'jspdf'
import type { CitizenRequest, ServiceOption } from '../types'
import type { ServiceDocuments } from '../data/documents'

function createReceipt(
  request: CitizenRequest,
  service: ServiceOption,
  documents: ServiceDocuments
) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 18
  const contentWidth = pageWidth - margin * 2
  let y = 20

  function checkPage(height = 10) {
    if (y + height > pageHeight - 22) {
      pdf.addPage()
      y = 20
    }
  }

  function writeTitle(text: string) {
    checkPage(12)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.text(text, margin, y)
    y += 8
  }

  function writeParagraph(text: string) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)

    const lines = pdf.splitTextToSize(text, contentWidth)
    checkPage(lines.length * 5 + 3)
    pdf.text(lines, margin, y)
    y += lines.length * 5 + 3
  }

  function writeList(items: string[]) {
    items.forEach((item) => {
      writeParagraph(`- ${item}`)
    })
  }

  // Cabeçalho
  pdf.setFillColor(23, 107, 77)
  pdf.rect(0, 0, pageWidth, 43, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(19)
  pdf.text('CRAS Acolhe', margin, 19)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.text('Orientação socioassistencial - Piripiri/PI', margin, 27)
  pdf.text('COMPROVANTE DE PRE-ATENDIMENTO', margin, 35)

  y = 55
  pdf.setTextColor(32, 52, 42)

  writeTitle('Dados do registro')

  writeParagraph(`Protocolo: ${request.protocol}`)
  writeParagraph(`Nome informado: ${request.name}`)
  writeParagraph(`Servico: ${service.title}`)
  writeParagraph(
    `Data: ${new Date(request.createdAt).toLocaleString('pt-BR')}`
  )
  writeParagraph('Situacao: Solicitacao recebida na demonstracao')

  y += 3
  writeTitle('Documentos recomendados')
  writeList(documents.recommended)

  y += 3
  writeTitle('Documentos relacionados ao servico')
  writeList(documents.specific)

  y += 3
  writeTitle('Orientacoes importantes')
  writeList(documents.notes)

  y += 4
  writeTitle('Aviso')
  writeParagraph(
    'Este comprovante pertence a um ambiente demonstrativo. ' +
    'O protocolo e ficticio, nao foi enviado a Prefeitura e nao representa ' +
    'concessao, aprovacao ou garantia de recebimento de beneficio.'
  )

  writeParagraph(
    'As listas documentais sao orientativas e devem ser confirmadas ' +
    'com a unidade de atendimento e conforme as regras oficiais aplicaveis.'
  )

  // Rodapé
  const pages = pdf.getNumberOfPages()

  for (let page = 1; page <= pages; page++) {
    pdf.setPage(page)
    pdf.setFontSize(8)
    pdf.setTextColor(110, 110, 110)
    pdf.text(
      'CRAS Acolhe - Projeto demonstrativo',
      margin,
      pageHeight - 10
    )
    pdf.text(
      `Pagina ${page} de ${pages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    )
  }

  return pdf
}

export function downloadReceipt(
  request: CitizenRequest,
  service: ServiceOption,
  documents: ServiceDocuments
) {
  const pdf = createReceipt(request, service, documents)

  pdf.save(`comprovante-${request.protocol}.pdf`)
}

export function printReceipt(
  request: CitizenRequest,
  service: ServiceOption,
  documents: ServiceDocuments
) {
  const pdf = createReceipt(request, service, documents)

  pdf.autoPrint()

  const url = pdf.output('bloburl')
  const printWindow = window.open(url, '_blank')

  if (!printWindow) {
    window.alert(
      'O navegador bloqueou a janela de impressao. Utilize o botao Baixar PDF.'
    )
  }
}
