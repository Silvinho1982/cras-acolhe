
import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { Accessibility, ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Download, FileText, HeartHandshake, HelpCircle, Info, LockKeyhole, Menu, Printer, Search, ShieldCheck, Sparkles, TicketCheck, X
}
from 'lucide-react'
import { services } from './data/services'
import { serviceDocuments } from './data/documents'
import { getDemoRequests, saveDemoRequest } from './lib/demoStore'
import { downloadReceipt, printReceipt } from './lib/receipt'
import type { CadunicoStatus, CitizenRequest, RequestStatus, ServiceId } from './types'

const statusLabels: Record<RequestStatus, string> = { received: 'Solicitação recebida', review: 'Em triagem pela equipe', scheduled: 'Atendimento agendado', referred: 'Encaminhamento realizado', completed: 'Atendimento concluído' }


function Header() {
  return (
    <header className="mx-auto flex h-[78px] max-w-[1160px] items-center justify-between px-7">
      <Link to="/" className="flex items-center gap-[11px]">
        <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-[#e4f2e9] text-[#176b4d]">
          <HeartHandshake size={24} />
        </span>

        <span>
          <strong className="block font-['Manrope'] text-[17px] tracking-[-0.04em]">
            CRAS Acolhe
          </strong>
          <small className="mt-px block text-[11px] text-[#75857b]">
            Piripiri · Piauí
          </small>
        </span>
      </Link>

      
      <nav className="flex items-center gap-[30px] text-[13px] font-semibold text-[#52645a] max-[700px]:hidden">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-[#176b4d]"
        >
          Início
        </Link>

        <Link to="/#servicos" className="hover:text-[#176b4d]">
          Serviços
        </Link>

        <Link to="/#como-funciona" className="hover:text-[#176b4d]">
          Como funciona
        </Link>

        <Link
          className="flex items-center gap-2 rounded-[10px] bg-[#edf6ef] px-[15px] py-[11px] text-[#176b4d]"
          to="/acompanhar"
        >
          <Search size={16} />
          Acompanhar protocolo
        </Link>
      </nav>

      <button
        className="hidden border-0 bg-transparent text-[#176b4d] max-[700px]:block"
        aria-label="Abrir navegação"
      >
        <Menu />
      </button>
    </header>
  )
}


function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1160px] flex-col items-center gap-4 border-t border-[#e5ece7] px-7 py-8 text-center text-sm text-[#52645a] md:flex-row md:justify-between md:text-left">
      <div className="flex items-center gap-3">
        <span className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-[#e4f2e9] text-[#176b4d]">
          <HeartHandshake size={21} />
        </span>

        <div>
          <strong className="block font-['Manrope'] text-base text-[#20342a]">
            CRAS Acolhe
          </strong>
          <small className="block text-xs text-[#75857b]">
            Orientação com respeito e dignidade.
          </small>
        </div>
      </div>

      <p>Projeto piloto demonstrativo · Piripiri – PI</p>

      <p className="max-w-md text-xs leading-relaxed text-[#75857b]">
        Este ambiente utiliza dados fictícios. Não é um canal oficial da Prefeitura e não substitui o atendimento presencial.
      </p>
    </footer>
  )
}


function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="flex min-h-[34px] items-center justify-center gap-2 bg-[#fff2d8] px-4 py-2 text-center text-[11px] font-bold tracking-[0.045em] text-[#795316]">
        <Info size={15} className="shrink-0" />
        <span>
          AMBIENTE DE DEMONSTRAÇÃO — não informe dados pessoais reais.
        </span>
      </div>

      <Header />
      {children}
      <Footer />
    </>
  )
}

function Home() {
 const [showForm,setShowForm]=useState(false)
 const [selectedService,setSelectedService]=useState<ServiceId>('food')
 return <Shell><main>
  
<section className="mx-auto my-[44px] mb-[54px] grid min-h-[440px] max-w-[1104px] grid-cols-[1.05fr_.95fr] items-center gap-[45px] px-[26px] py-[35px] pb-[50px] max-[850px]:gap-[15px] max-[850px]:pt-[15px] max-[620px]:my-[20px] max-[620px]:mb-[25px] max-[620px]:flex max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-0 max-[620px]:px-[22px] max-[620px]:pt-[25px] max-[620px]:pb-[15px]">
  <div>
    <span className="inline-flex items-center gap-[7px] text-[10px] font-extrabold tracking-[0.13em] text-[#25805b]">
      <Sparkles size={14} />
      ACOLHIMENTO COMEÇA COM ESCUTA
    </span>

    <h1 className="mb-[17px] mt-[19px] max-w-[560px] font-['Manrope'] text-[clamp(42px,5.2vw,64px)] font-bold leading-[1.08] tracking-[-0.055em] text-[#203a2c] max-[620px]:text-[43px]">
      Encontrar ajuda deve ser <em className="not-italic text-[#21825a]">mais simples.</em>
    </h1>

    <p className="max-w-[490px] text-base leading-[1.75] text-[#64736a] max-[620px]:text-sm">
      Um primeiro passo para receber orientação sobre os serviços socioassistenciais disponíveis em Piripiri.
    </p>

    <div className="mt-[27px] flex flex-wrap items-center gap-3">
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[11px] border-0 bg-[#176b4d] px-[19px] text-[13px] font-bold text-white shadow-[0_7px_16px_#176b4d24] transition duration-200 hover:-translate-y-px hover:bg-[#10583e]"
        onClick={() => setShowForm(true)}
      >
        Iniciar pré-atendimento
        <ArrowRight size={18} />
      </button>

      <Link
        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[11px] bg-[#edf5ef] px-[19px] text-[13px] font-bold text-[#286347] transition duration-200 hover:bg-[#e1eee5]"
        to="/acompanhar"
      >
        Acompanhar solicitação
      </Link>
    </div>

    <div className="mt-[22px] flex items-center gap-2 text-[11px] text-[#648071]">
      <ShieldCheck size={17} className="shrink-0 text-[#21825a]" />
      Você pode buscar orientação mesmo sem NIS ou Cadastro Único.
    </div>
  </div>

  <div className="relative grid h-[355px] place-items-center max-[850px]:scale-90 max-[620px]:mb-[-25px] max-[620px]:mt-5 max-[620px]:h-[290px] max-[620px]:w-full max-[620px]:origin-top-center max-[620px]:scale-[0.86]">
    <div className="absolute right-[13%] top-[6%] h-[300px] w-[300px] rounded-full bg-[#e9f4ec] max-[620px]:right-[14%]" />

    <div className="absolute bottom-0 right-[4%] h-[220px] w-[220px] rounded-full border border-[#c7e1d0]" />

    <div className="relative z-[1] flex min-h-[270px] w-[285px] rotate-[-3deg] flex-col items-start justify-center rounded-[23px] bg-white p-7 shadow-[0_18px_50px_#244b3218] max-[620px]:w-[260px]">
      <div className="mb-[19px] grid h-[66px] w-[66px] place-items-center rounded-[21px] bg-[#e8f5ec] text-[#19744f]">
        <HeartHandshake size={36} />
      </div>

      <span className="text-[11px] text-[#789083]">
        Um espaço de acolhimento
      </span>

      <strong className="mt-[7px] font-['Manrope'] text-xl leading-[1.35] tracking-[-0.04em] text-[#244b35]">
        Você não precisa saber por onde começar. A gente orienta.
      </strong>

      <div className="mt-[17px] flex">
          <span className="mr-[-5px] grid h-[25px] w-[25px] place-items-center rounded-full border-2 border-white bg-[#d5eadb] text-xs text-[#287650]">♥</span>
          <span className="mr-[-5px] grid h-[25px] w-[25px] place-items-center rounded-full border-2 border-white bg-[#d5eadb] text-xs text-[#287650]">♡</span>
          <span className="grid h-[25px] w-[25px] place-items-center rounded-full border-2 border-white bg-[#d5eadb] text-xs text-[#287650]">✳</span>
        </div>
      </div>

      <div className="absolute bottom-7 left-[3%] z-[2] flex items-center gap-2 rounded-xl bg-white px-[15px] py-3 text-[11px] font-bold text-[#316d4e] shadow-[0_9px_30px_#244b3218] max-[620px]:bottom-[14px] max-[620px]:left-0">
        <CheckCircle2 size={18} />
        Orientação passo a passo
      </div>
    </div>
  </section>

  <section className="mx-auto mb-[92px] grid max-w-[1050px] grid-cols-3 gap-[18px] rounded-[17px] border border-[#e7eee8] bg-white px-[30px] py-6 max-[850px]:mx-5 max-[620px]:mb-[65px] max-[620px]:grid-cols-1 max-[620px]:gap-[17px] max-[620px]:px-[22px] max-[620px]:py-[19px]">
    <div className="flex items-center justify-center gap-[13px] max-[620px]:justify-start">
      <ShieldCheck className="h-[23px] w-[23px] shrink-0 text-[#27815b]" />
      <span>
        <b className="block text-xs">Atendimento humanizado</b>
        <small className="mt-[3px] block text-[10px] text-[#829087]">
          Respeito à sua história
        </small>
      </span>
    </div>

    <div className="flex items-center justify-center gap-[13px] max-[620px]:justify-start">
      <Accessibility className="h-[23px] w-[23px] shrink-0 text-[#27815b]" />
      <span>
        <b className="block text-xs">Acesso inclusivo</b>
        <small className="mt-[3px] block text-[10px] text-[#829087]">
          Sem exigir cadastro prévio
        </small>
      </span>
    </div>

    <div className="flex items-center justify-center gap-[13px] max-[620px]:justify-start">
      <LockKeyhole className="h-[23px] w-[23px] shrink-0 text-[#27815b]" />
      <span>
        <b className="block text-xs">Privacidade</b>
        <small className="mt-[3px] block text-[10px] text-[#829087]">
          Dados mínimos na demonstração
        </small>
      </span>
    </div>
  </section>
  
  <section
    id="servicos"
    className="mx-auto max-w-[1100px] px-[25px] pb-[92px] max-[620px]:px-[18px] max-[620px]:pb-[65px]"
  >
    <div className="mb-[35px] text-center max-[620px]:mb-[25px]">
      <span className="inline-flex items-center gap-[7px] text-[10px] font-extrabold tracking-[0.13em] text-[#25805b]">
        COMO PODEMOS AJUDAR
      </span>

      <h2 className="mb-2 mt-[10px] font-['Manrope'] text-[clamp(28px,3vw,37px)] font-bold tracking-[-0.055em] text-[#203a2c]">
        Qual orientação você procura?
      </h2>

      <p className="m-0 text-[13px] text-[#75837a]">
        Escolha um assunto para conhecer o caminho inicial de atendimento.
      </p>
    </div>

    <div className="grid grid-cols-4 gap-[14px] max-[850px]:grid-cols-2 max-[620px]:gap-[9px]">
      {services.map((s) => (
        <button
          className="flex min-h-[206px] cursor-pointer flex-col items-start rounded-[15px] border border-[#e7eee8] bg-white px-[19px] py-[21px] text-left transition duration-200 hover:-translate-y-[3px] hover:border-[#a9cfb5] hover:shadow-[0_12px_28px_#244b3210] max-[620px]:min-h-[205px] max-[620px]:px-[13px] max-[620px]:py-[15px]"
          key={s.id}
          onClick={() => {
            setSelectedService(s.id)
            setShowForm(true)
          }}
        >
          <span className="mb-[17px] text-[25px]">
            {s.icon}
          </span>

          <strong className="font-['Manrope'] text-sm leading-[1.3] text-[#294b37] max-[620px]:text-xs">
            {s.title}
          </strong>

          <small className="mt-[7px] text-[11px] leading-[1.55] text-[#7a8980] max-[620px]:text-[10px]">
            {s.description}
          </small>

          <span className="mt-auto flex items-center gap-[5px] pt-[17px] text-[10px] font-bold text-[#21825a]">
            Solicitar orientação
            <ArrowRight size={15} />
          </span>
        </button>
      ))}
    </div>
  </section>
  
<section
  id="como-funciona"
  className="mx-auto max-w-[1100px] px-[25px] pb-[92px] pt-1 max-[620px]:px-[18px] max-[620px]:pb-[65px]"
>
  <div className="mb-[35px] text-center max-[620px]:mb-[25px]">
    <span className="inline-flex items-center gap-[7px] text-[10px] font-extrabold tracking-[0.13em] text-[#25805b]">
      SIMPLES E ACESSÍVEL
    </span>

    <h2 className="mb-2 mt-[10px] font-['Manrope'] text-[clamp(28px,3vw,37px)] font-bold tracking-[-0.055em] text-[#203a2c]">
      Como funciona?
    </h2>

    <p className="m-0 text-[13px] text-[#75837a]">
      Você dá o primeiro passo. A equipe orienta os próximos.
    </p>
  </div>

  <div className="grid grid-cols-3 gap-[18px] max-[620px]:grid-cols-1 max-[620px]:gap-[10px]">
    <div className="relative min-h-[185px] rounded-[15px] bg-[#f0f7f2] px-[25px] py-[27px] max-[620px]:min-h-[150px]">
      <span className="absolute right-5 top-[18px] text-[11px] font-extrabold text-[#94b5a0]">
        01
      </span>

      <ClipboardList className="mb-[17px] h-[25px] w-[25px] text-[#25805b]" />

      <b className="block font-['Manrope'] text-[15px] text-[#294b37]">
        Conte o que precisa
      </b>

      <p className="mb-0 text-[11px] leading-[1.65] text-[#738279]">
        Escolha o serviço e informe apenas o necessário para iniciar.
      </p>
    </div>

    <div className="relative min-h-[185px] rounded-[15px] bg-[#f0f7f2] px-[25px] py-[27px] max-[620px]:min-h-[150px]">
      <span className="absolute right-5 top-[18px] text-[11px] font-extrabold text-[#94b5a0]">
        02
      </span>

      <TicketCheck className="mb-[17px] h-[25px] w-[25px] text-[#25805b]" />

      <b className="block font-['Manrope'] text-[15px] text-[#294b37]">
        Receba um protocolo
      </b>

      <p className="mb-0 text-[11px] leading-[1.65] text-[#738279]">
        Guarde o número para consultar sua solicitação nesta demonstração.
      </p>
    </div>

    <div className="relative min-h-[185px] rounded-[15px] bg-[#f0f7f2] px-[25px] py-[27px] max-[620px]:min-h-[150px]">
      <span className="absolute right-5 top-[18px] text-[11px] font-extrabold text-[#94b5a0]">
        03
      </span>

      <HeartHandshake className="mb-[17px] h-[25px] w-[25px] text-[#25805b]" />

      <b className="block font-['Manrope'] text-[15px] text-[#294b37]">
        Receba orientação
      </b>

      <p className="mb-0 text-[11px] leading-[1.65] text-[#738279]">
        A equipe do CRAS avalia o encaminhamento adequado.
      </p>
    </div>
  </div>
</section>

 <section className="mx-auto mb-[85px] flex max-w-[1050px] items-center justify-between gap-8 rounded-[20px] bg-[#eaf4ed] px-[42px] py-[35px] max-[850px]:mx-5 max-[620px]:mx-[18px] max-[620px]:mb-[60px] max-[620px]:px-[25px] max-[620px]:py-[25px]">
    <div>
      <span className="inline-flex items-center gap-[7px] text-[10px] font-extrabold tracking-[0.13em] text-[#25805b]">
        PRECISA DE AJUDA?
      </span>

      <h2 className="mb-2 mt-[10px] font-['Manrope'] text-[26px] font-bold tracking-[-0.055em] text-[#203a2c] max-[620px]:text-[23px]">
        Prefere conversar com alguém?
      </h2>

      <p className="mb-0 max-w-[650px] text-xs leading-[1.7] text-[#68796e]">
        O atendimento presencial continua sendo uma opção. A tecnologia não substitui a escuta e o acolhimento da equipe.
      </p>
    </div>

    <div className="grid h-[95px] w-[95px] shrink-0 place-items-center rounded-full bg-[#d6eadc] text-[#247b55] max-[620px]:hidden">
      <HeartHandshake size={48} />
    </div>
  </section>
 </main>{showForm && (
  <RequestModal
    initialService={selectedService}
    onClose={() => setShowForm(false)}
  />
)}</Shell>
}

function RequestModal({
  onClose,
  initialService
}: {
  onClose: () => void
  initialService: ServiceId
}) {
  const [service, setService] = useState<ServiceId>(initialService)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [cad, setCad] = useState<CadunicoStatus>('unknown')
  const [accepted, setAccepted] = useState(false)
  const [result, setResult] = useState<CitizenRequest | null>(null)
  const [error, setError] = useState('')

  const selected = services.find(s => s.id === service)!
  const documents = serviceDocuments[service]

  function submit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (name.trim().length < 3) {
      setError('Informe um nome com pelo menos 3 caracteres.')
      return
    }

    if (!accepted) {
      setError('Confirme que leu o aviso de privacidade da demonstração.')
      return
    }

    const req: CitizenRequest = {
      protocol: `CA-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      name: name.trim(),
      phone: phone.trim(),
      serviceId: service,
      cadunico: cad,
      unit: 'Unidade de referência a definir pela equipe',
      createdAt: new Date().toISOString(),
      status: 'received'
    }

    saveDemoRequest(req)
    setResult(req)
  }

  const resultService = result
    ? services.find(s => s.id === result.serviceId)!
    : null

  const resultDocuments = result
    ? serviceDocuments[result.serviceId]
    : null

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center overflow-auto bg-[#14251ccc] p-5"
      role="presentation"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <section
        className="relative max-h-[90vh] w-full max-w-[550px] overflow-y-auto rounded-[20px] bg-white p-[34px] shadow-[0_25px_80px_#071b1080] max-[620px]:p-[27px_21px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="absolute right-5 top-5 grid h-[34px] w-[34px] cursor-pointer place-items-center rounded-[10px] border-0 bg-[#f1f5f2] text-[#52685a]"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X />
        </button>

        {result && resultService && resultDocuments ? (
          <div className="success-state">
            <div className="success-icon">
              <CheckCircle2 size={38} />
            </div>

            <span className="eyebrow">
              PRÉ-ATENDIMENTO REGISTRADO NA DEMONSTRAÇÃO
            </span>

            <h2 id="modal-title">Seu primeiro passo foi dado.</h2>

            <p>
              Este protocolo é fictício e foi salvo somente neste navegador.
            </p>

            <div className="protocol-box">
              <small>SEU PROTOCOLO DE DEMONSTRAÇÃO</small>
              <strong>{result.protocol}</strong>

              <button
                className="text-button"
                onClick={() =>
                  navigator.clipboard?.writeText(result.protocol)
                }
              >
                Copiar protocolo
              </button>
            </div>

            <div className="guidance-box">
              <b>Orientação inicial</b>
              <p>{resultService.guidance}</p>
              <p>{resultService.cadunicoNote}</p>
            </div>

            <div className="documents-panel">
              <div className="documents-heading">
                <FileText size={20} />
                <b>Documentos para orientação</b>
              </div>

              <h4>Documentos recomendados</h4>
              <ul>
                {resultDocuments.recommended.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h4>Documentos relacionados ao serviço</h4>
              <ul>
                {resultDocuments.specific.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h4>Orientações adicionais</h4>
              <ul>
                {resultDocuments.notes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="receipt-actions">
              <button
                className="btn-primary full"
                onClick={() =>
                  downloadReceipt(result, resultService, resultDocuments)
                }
              >
                <Download size={17} />
                Baixar comprovante em PDF
              </button>

              <button
                className="btn-secondary full"
                onClick={() =>
                  printReceipt(result, resultService, resultDocuments)
                }
              >
                <Printer size={17} />
                Imprimir comprovante
              </button>
            </div>

            <p className="muted small">
              Para atendimento real, procure presencialmente a unidade de
              referência. Este protocolo não representa aprovação ou
              concessão de benefício.
            </p>

            <button className="btn-primary full" onClick={onClose}>
              Concluir <CheckCircle2 size={17} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-[7px] text-[10px] font-extrabold tracking-[0.13em] text-[#25805b]">
                PRÉ-ATENDIMENTO
              </span>
              <span className="text-[10px] text-[#87958b]">
                Etapa 1 de 1
              </span>
            </div>

            <h2
  id="modal-title"
    className="mb-[7px] mt-3 font-['Manrope'] text-[27px] tracking-[-0.04em] text-[#254331]"
  >
    Vamos começar com calma.
  </h2>

            <p className="mb-5 text-xs leading-[1.6] text-[#78867d]">
              Informe os dados mínimos para gerar um protocolo fictício de
              demonstração. Não use dados reais.
            </p>

            <form onSubmit={submit} className="grid gap-[14px]">
              <label className="grid gap-[7px] text-[11px] font-bold text-[#43594b]"></label>
              <label>
                Qual serviço você procura?

                <select
                  className="h-11 w-full rounded-[9px] border border-[#dfe8e1] bg-white px-3 text-xs text-[#304638] outline-none focus:border-[#65a981] focus:ring-[3px] focus:ring-[#e5f3e9]"
                  value={service}
                  onChange={e => setService(e.target.value as ServiceId)}
                >
                  {services.map(s => (
                    <option value={s.id} key={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex gap-[9px] rounded-[9px] bg-[#eff7f1] p-3 text-[10px] leading-[1.55] text-[#5e7666]">
                <Info size={17} className="shrink-0 text-[#28805a]" />
                <span>{selected.guidance}</span>
              </div>

              <div className="documents-panel">
                <div className="documents-heading">
                  <FileText size={20} />
                  <b>Documentos para este serviço</b>
                </div>

                <p>
                  Esta lista é orientativa. A equipe responsável confirmará
                  os documentos aplicáveis ao seu atendimento.
                </p>

                <h4>Documentos recomendados</h4>
                <ul>
                  {documents.recommended.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h4>Documentos relacionados ao serviço</h4>
                <ul>
                  {documents.specific.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h4>Orientações adicionais</h4>
                <ul>
                  {documents.notes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <label>
                Nome fictício para teste

                <input
                  className="h-11 w-full rounded-[9px] border border-[#dfe8e1] bg-white px-3 text-xs text-[#304638] outline-none focus:border-[#65a981] focus:ring-[3px] focus:ring-[#e5f3e9]"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex.: Maria da Silva (exemplo)"
                  autoComplete="off"
                />
              </label>

              <label className="grid gap-[7px] text-[11px] font-bold text-[#43594b]">
                Telefone fictício (opcional)

                <input
                  className="h-11 w-full rounded-[9px] border border-[#dfe8e1] bg-white px-3 text-xs text-[#304638] outline-none focus:border-[#65a981] focus:ring-[3px] focus:ring-[#e5f3e9]"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  inputMode="tel"
                  autoComplete="off"
                />
              </label>

              <fieldset className="flex flex-wrap gap-x-[17px] gap-y-2 rounded-[10px] border border-[#e4ece5] px-[13px] py-[11px]">
                <legend className="px-1 text-[11px] font-bold text-[#43594b]">
                  Você possui Cadastro Único?
                </legend>

                <label className="flex items-center gap-[5px] text-[11px] text-[#64746a]">
                  <input
                    type="radio"
                    checked={cad === 'yes'}
                    onChange={() => setCad('yes')}
                    className="accent-[#176b4d]"
                  />
                  Sim
                </label>

                <label className="flex items-center gap-[5px] text-[11px] text-[#64746a]">
                  <input
                    type="radio"
                    checked={cad === 'no'}
                    onChange={() => setCad('no')}
                    className="accent-[#176b4d]"
                  />
                  Não
                </label>

                <label className="flex items-center gap-[5px] text-[11px] text-[#64746a]">
                  <input
                    type="radio"
                    checked={cad === 'unknown'}
                    onChange={() => setCad('unknown')}
                    className="accent-[#176b4d]"
                  />
                  Não sei informar
                </label>
              </fieldset>

              <div className="flex items-start gap-[9px] text-[10px] leading-[1.5] text-[#718077]">
                <input
                  id="privacy"
                  type="checkbox"
                  checked={accepted}
                  onChange={e => setAccepted(e.target.checked)}
                  className="mt-0.5 accent-[#176b4d]"
                />

                <label htmlFor="privacy">
                  Entendi que este é um ambiente de demonstração e não devo
                  inserir dados pessoais verdadeiros.
                </label>
              </div>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#176b4d] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#12583f] focus:outline-none focus:ring-[3px] focus:ring-[#d5eadc]"
                type="submit"
              >
                Gerar protocolo fictício
                <ArrowRight size={17} />
              </button>
            </form>

            <p className="mt-[15px] flex items-center justify-center gap-[6px] text-center text-[9px] text-[#91a096]">
              <LockKeyhole size={13} className="shrink-0" />
              Nenhum CPF, NIS, documento ou relato sensível é solicitado.
            </p>
          </>
        )}
      </section>
    </div>
  )
}

function Track() {
 const [protocol,setProtocol]=useState('');const [found,setFound]=useState<CitizenRequest|null>(null);const [searched,setSearched]=useState(false)
 function search(e:FormEvent){e.preventDefault();const match=getDemoRequests().find(r=>r.protocol.toLowerCase()===protocol.trim().toLowerCase());setFound(match??null);setSearched(true)}
 return <Shell><main className="track-page"><Link to="/" className="back-link"><ArrowLeft size={16}/> Voltar ao início</Link><div className="track-card"><div className="track-icon"><Search size={28}/></div><span className="eyebrow">CONSULTA DE DEMONSTRAÇÃO</span><h1>Acompanhe sua solicitação</h1><p>Digite o protocolo gerado neste navegador para consultar o exemplo salvo.</p><form onSubmit={search} className="track-form"><label htmlFor="protocol">Número do protocolo</label><input id="protocol" value={protocol} onChange={e=>setProtocol(e.target.value)} placeholder="Ex.: CA-2026-ABC123" required/><button className="btn-primary full">Consultar protocolo <ArrowRight size={17}/></button></form>{searched&&<div className={found?'track-result':'not-found'}>{found?<><span className="status-pill"><CheckCircle2 size={15}/> {statusLabels[found.status]}</span><h3>{found.protocol}</h3><p>Serviço: {services.find(s=>s.id===found.serviceId)?.title}</p><p>Solicitante de teste: {found.name}</p><p>Registro: {new Date(found.createdAt).toLocaleString('pt-BR')}</p><small>Este registro existe somente no armazenamento local deste navegador.</small></>:<><HelpCircle/><b>Protocolo não encontrado</b><p>Confira o número e tente novamente no mesmo navegador em que criou o protocolo.</p></>}</div>}<div className="track-notice"><Info size={16}/> Esta consulta não acessa sistemas oficiais nem permite acompanhar solicitações reais.</div></div></main></Shell>
}


function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      if (pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    const targetId = decodeURIComponent(hash.substring(1))
    const target = document.getElementById(targetId)

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [pathname, hash])

  return null
}


export default function App() {
  return (
    <>
      <ScrollToHash />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acompanhar" element={<Track />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}

