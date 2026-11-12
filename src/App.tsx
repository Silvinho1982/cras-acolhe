
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  HeartHandshake,
  HelpCircle,
  Info,
  LockKeyhole,
  Menu,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  X
} from 'lucide-react'
import { services } from './data/services'
import { serviceDocuments } from './data/documents'
import { getDemoRequests, saveDemoRequest } from './lib/demoStore'
import { downloadReceipt, printReceipt } from './lib/receipt'
import type { CadunicoStatus, CitizenRequest, RequestStatus, ServiceId } from './types'

const statusLabels: Record<RequestStatus, string> = { received: 'Solicitação recebida', review: 'Em triagem pela equipe', scheduled: 'Atendimento agendado', referred: 'Encaminhamento realizado', completed: 'Atendimento concluído' }

function Header() {
  return <header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><HeartHandshake size={24}/></span><span><strong>CRAS Acolhe</strong><small>Piripiri · Piauí</small></span></Link><nav><a href="#como-funciona">Como funciona</a><a href="#servicos">Serviços</a><Link className="nav-track" to="/acompanhar"><Search size={16}/> Acompanhar protocolo</Link></nav><button className="mobile-menu" aria-label="Abrir navegação"><Menu/></button></header>
}
function Footer() { return <footer className="footer"><div className="footer-brand"><span className="brand-mark"><HeartHandshake size={21}/></span><div><b>CRAS Acolhe</b><small>Orientação com respeito e dignidade.</small></div></div><p>Projeto piloto demonstrativo · Piripiri – PI</p><p className="footer-note">Este ambiente utiliza dados fictícios. Não é um canal oficial da Prefeitura e não substitui o atendimento presencial.</p></footer> }
function Shell({children}:{children:ReactNode}) { return <><div className="demo-banner"><Info size={15}/> AMBIENTE DE DEMONSTRAÇÃO — não informe dados pessoais reais.</div><Header/>{children}<Footer/></> }
function Home() {
 const [showForm,setShowForm]=useState(false)
 const [selectedService,setSelectedService]=useState<ServiceId>('food')
 return <Shell><main>
  <section className="hero"><div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> ACOLHIMENTO COMEÇA COM ESCUTA</span><h1>Encontrar ajuda deve ser <em>mais simples.</em></h1><p>Um primeiro passo para receber orientação sobre os serviços socioassistenciais disponíveis em Piripiri.</p><div className="hero-actions"><button className="btn-primary" onClick={()=>setShowForm(true)}>Iniciar pré-atendimento <ArrowRight size={18}/></button><Link className="btn-secondary" to="/acompanhar">Acompanhar solicitação</Link></div><div className="hero-assurance"><ShieldCheck size={17}/> Você pode buscar orientação mesmo sem NIS ou Cadastro Único.</div></div><div className="hero-art"><div className="art-circle circle-one"/><div className="art-circle circle-two"/><div className="welcome-card"><div className="welcome-icon"><HeartHandshake size={36}/></div><span>Um espaço de acolhimento</span><strong>Você não precisa saber por onde começar. A gente orienta.</strong><div className="welcome-people"><span>♥</span><span>♡</span><span>✳</span></div></div><div className="floating-note"><CheckCircle2 size={18}/> Orientação passo a passo</div></div></section>
  <section className="trust-strip"><div><ShieldCheck/><span><b>Atendimento humanizado</b><small>Respeito à sua história</small></span></div><div><Accessibility/><span><b>Acesso inclusivo</b><small>Sem exigir cadastro prévio</small></span></div><div><LockKeyhole/><span><b>Privacidade</b><small>Dados mínimos na demonstração</small></span></div></section>
  <section className="section" id="servicos"><div className="section-heading"><span className="eyebrow">COMO PODEMOS AJUDAR</span><h2>Qual orientação você procura?</h2><p>Escolha um assunto para conhecer o caminho inicial de atendimento.</p></div><div className="service-grid">{services.map(s=><button
  className="service-card"
  key={s.id}
  onClick={() => {
    setSelectedService(s.id)
    setShowForm(true)
  }}
><span className="service-emoji">{s.icon}</span><strong>{s.title}</strong><small>{s.description}</small><span className="card-link">Solicitar orientação <ArrowRight size={15}/></span></button>)}</div></section>
  <section className="how-section" id="como-funciona"><div className="section-heading"><span className="eyebrow">SIMPLES E ACESSÍVEL</span><h2>Como funciona?</h2><p>Você dá o primeiro passo. A equipe orienta os próximos.</p></div><div className="steps"><div className="step"><span>01</span><ClipboardList/><b>Conte o que precisa</b><p>Escolha o serviço e informe apenas o necessário para iniciar.</p></div><div className="step"><span>02</span><TicketCheck/><b>Receba um protocolo</b><p>Guarde o número para consultar sua solicitação nesta demonstração.</p></div><div className="step"><span>03</span><HeartHandshake/><b>Receba orientação</b><p>A equipe do CRAS avalia o encaminhamento adequado.</p></div></div></section>
  <section className="help-callout"><div><span className="eyebrow">PRECISA DE AJUDA?</span><h2>Prefere conversar com alguém?</h2><p>O atendimento presencial continua sendo uma opção. A tecnologia não substitui a escuta e o acolhimento da equipe.</p></div><div className="callout-icon"><HeartHandshake size={48}/></div></section>
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
      className="modal-backdrop"
      role="presentation"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close"
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
            <div className="modal-kicker">
              <span className="eyebrow">PRÉ-ATENDIMENTO</span>
              <span className="step-count">Etapa 1 de 1</span>
            </div>

            <h2 id="modal-title">Vamos começar com calma.</h2>

            <p className="modal-intro">
              Informe os dados mínimos para gerar um protocolo fictício de
              demonstração. Não use dados reais.
            </p>

            <form onSubmit={submit} className="request-form">
              <label>
                Qual serviço você procura?

                <select
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

              <div className="inline-guidance">
                <Info size={17} />
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
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex.: Maria da Silva (exemplo)"
                  autoComplete="off"
                />
              </label>

              <label>
                Telefone fictício (opcional)

                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  inputMode="tel"
                  autoComplete="off"
                />
              </label>

              <fieldset>
                <legend>Você possui Cadastro Único?</legend>

                <label className="radio-line">
                  <input
                    type="radio"
                    checked={cad === 'yes'}
                    onChange={() => setCad('yes')}
                  />
                  Sim
                </label>

                <label className="radio-line">
                  <input
                    type="radio"
                    checked={cad === 'no'}
                    onChange={() => setCad('no')}
                  />
                  Não
                </label>

                <label className="radio-line">
                  <input
                    type="radio"
                    checked={cad === 'unknown'}
                    onChange={() => setCad('unknown')}
                  />
                  Não sei informar
                </label>
              </fieldset>

              <div className="privacy-check">
                <input
                  id="privacy"
                  type="checkbox"
                  checked={accepted}
                  onChange={e => setAccepted(e.target.checked)}
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

              <button className="btn-primary full" type="submit">
                Gerar protocolo fictício <ArrowRight size={17} />
              </button>
            </form>

            <p className="modal-footnote">
              <LockKeyhole size={13} />
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
export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/acompanhar" element={<Track/>}/><Route path="*" element={<Home/>}/></Routes>}
