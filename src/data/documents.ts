
import type { ServiceId } from '../types'

export interface ServiceDocuments {
  recommended: string[]
  specific: string[]
  notes: string[]
}

export const serviceDocuments: Record<ServiceId, ServiceDocuments> = {
  food: {
    recommended: [
      'Documento de identificação, se disponível.',
      'CPF, se disponível.',
      'Comprovante de residência, se disponível.'
    ],
    specific: [
      'Informações sobre a composição familiar.',
      'Informações sobre a situação que motivou a procura por apoio alimentar.'
    ],
    notes: [
      'A equipe avaliará a situação conforme os critérios e a regulamentação municipal.',
      'Não ter Cadastro Único ou NIS não impede o acolhimento inicial.'
    ]
  },

  funeral: {
    recommended: [
      'Documento de identificação do familiar responsável, se disponível.',
      'CPF, se disponível.',
      'Comprovante de residência, se disponível.'
    ],
    specific: [
      'Documento relacionado ao falecimento, se disponível.',
      'Informações sobre as despesas ou necessidades relacionadas à situação.'
    ],
    notes: [
      'A equipe informará quais documentos são necessários conforme a regulamentação municipal.',
      'Procure o CRAS para orientação, mesmo que ainda não possua toda a documentação.'
    ]
  },

  travel: {
    recommended: [
      'Documento de identificação, se disponível.',
      'CPF, se disponível.',
      'Comprovante de residência, se disponível.'
    ],
    specific: [
      'Informações sobre a origem e o destino da viagem.',
      'Motivo do deslocamento e data pretendida, quando conhecida.',
      'Documentos que ajudem a contextualizar a necessidade, se disponíveis.'
    ],
    notes: [
      'A concessão de passagem depende dos critérios e procedimentos municipais.',
      'A lista definitiva será informada pela equipe responsável.'
    ]
  },

  elder: {
    recommended: [
      'Documento de identificação com data de nascimento.',
      'CPF, se disponível.',
      'Número do NIS, se possuir.'
    ],
    specific: [
      'Informações sobre a inscrição e a atualização no Cadastro Único.'
    ],
    notes: [
      'A Carteira da Pessoa Idosa possui critérios próprios de idade e renda.',
      'A equipe orientará sobre a situação cadastral e os canais oficiais de emissão.'
    ]
  },

  autism: {
    recommended: [
      'Documento de identificação da pessoa com TEA, se disponível.',
      'CPF, se disponível.',
      'Documento de identificação do responsável, quando aplicável.'
    ],
    specific: [
      'Relatório ou documentação exigida pelo órgão emissor, conforme as regras locais.'
    ],
    notes: [
      'Os documentos e procedimentos dependem do órgão responsável pela emissão da CIPTEA.',
      'Não envie laudos ou documentos médicos por este formulário demonstrativo.',
      'A documentação de saúde deve ser apresentada somente ao órgão competente, pelos canais apropriados.'
    ]
  },

  freepass: {
    recommended: [
      'Documento de identificação, se disponível.',
      'CPF, se disponível.',
      'Comprovante de residência, se disponível.'
    ],
    specific: [
      'Informações sobre a modalidade pretendida: intermunicipal ou interestadual.',
      'Documentação relacionada aos critérios do programa correspondente.'
    ],
    notes: [
      'O Passe Livre interestadual e o intermunicipal possuem regras diferentes.',
      'A equipe deverá confirmar os critérios e documentos junto ao órgão responsável.'
    ]
  },

  cadunico: {
    recommended: [
      'CPF ou Título de Eleitor do Responsável Familiar.',
      'Documentos de identificação dos demais integrantes da família.',
      'Comprovante de residência, preferencialmente recente, se disponível.'
    ],
    specific: [
      'Certidões de nascimento ou casamento, RG, CPF, carteira de trabalho ou outros documentos de identificação dos integrantes.',
      'Informações sobre trabalho, renda e escolaridade dos integrantes, quando disponíveis.'
    ],
    notes: [
      'A equipe responsável pelo Cadastro Único orientará sobre a documentação aplicável à composição familiar.',
      'A falta de algum documento não deve impedir a busca por orientação inicial.',
      'O cadastro e sua atualização são realizados por equipe autorizada, não por este portal.'
    ]
  },

  other: {
    recommended: [
      'Documento de identificação, se disponível.',
      'CPF, se disponível.'
    ],
    specific: [
      'Informações sobre o assunto para o qual deseja orientação.'
    ],
    notes: [
      'A equipe realizará o acolhimento inicial e indicará o atendimento adequado.',
      'Não é necessário apresentar todos os documentos antes de procurar orientação.'
    ]
  }
}
