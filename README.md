# BoneGuard — Diagnóstico Ósseo com Tecnologia da NASA

[![React Native](https://img.shields.io/badge/React%20Native-Expo%2051-blue?logo=react)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Axios](https://img.shields.io/badge/Axios-JWT%20Auth-purple)](https://axios-http.com)
[![ESLint](https://img.shields.io/badge/ESLint-Prettier-green)](https://eslint.org)

> **Global Solution FIAP 2026 — Turma 2TDSPS**

---

## O que é o BoneGuard?

Osteoporose afeta mais de **200 milhões de pessoas no mundo** — e a maioria não sabe que tem até a primeira fratura. O BoneGuard é um app de saúde preventiva que detecta o risco de osteoporose usando **IA de visão computacional** e **protocolos de saúde óssea desenvolvidos pela NASA** para monitorar astronautas em missão.

Astronautas perdem até **1% da densidade óssea por mês** em microgravidade. A NASA criou protocolos rigorosos de triagem para evitar fraturas em órbita — e nós adaptamos essa ciência para o diagnóstico preventivo acessível a qualquer pessoa.

---

## Demonstração

**Vídeo no YouTube (5 min):** [LINK_VIDEO]

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Login & Cadastro** | Autenticação com JWT, token armazenado com segurança no SecureStore |
| **Questionário de Risco** | 5 perguntas baseadas no protocolo NASA de triagem óssea |
| **Análise de Raio-X** | Upload via câmera ou galeria, análise por IA de visão computacional |
| **Diagnóstico personalizado** | Score de risco 0-100 com classificação BAIXO/MODERADO/ALTO |
| **Plano de saúde** | Exercícios e nutrição personalizados por nível de risco |
| **Histórico de evolução** | Acompanhe a evolução do score ao longo do tempo |

---

## Stack de tecnologias

```
React Native + Expo SDK 51    → App móvel multiplataforma
Expo Router (file-based)      → Navegação declarativa com proteção de rotas
TypeScript                    → Tipagem completa de ponta a ponta
Axios + JWT Interceptor       → Comunicação segura com os backends
Expo SecureStore              → Armazenamento criptografado do token
Expo ImagePicker              → Upload de radiografias
react-native-svg              → ScoreRing animado com SVG
ESLint + Prettier             → Código limpo e padronizado
```

---

## Arquitetura

```
boneguard-mobile/
├── app/                  # Telas (Expo Router file-based)
│   ├── (auth)/           # Login e Cadastro
│   ├── (tabs)/           # Home, Questionário, Plano, Perfil
│   ├── resultado.tsx     # Diagnóstico detalhado
│   └── upload-raio-x.tsx # Envio de radiografias
├── src/
│   ├── services/         # Camada de API (Axios + JWT)
│   ├── context/          # AuthContext com restauração de sessão
│   ├── hooks/            # useAvaliacoes com tratamento de erro
│   ├── components/       # Button, Input, Card, ScoreRing, Badge…
│   ├── styles/           # Design system (theme.ts)
│   └── types/            # Tipos TypeScript compartilhados
```

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go no celular (iOS ou Android)

### Instalação

```bash
cd boneguard-mobile
npm install
```

### Configuração das APIs

Crie um arquivo `.env` na raiz do projeto com os IPs dos backends:

```env
EXPO_PUBLIC_JAVA_API_URL=http://SEU_IP:8080
EXPO_PUBLIC_NET_API_URL=http://SEU_IP:5000
```

> Consulte `.env.example` para o modelo completo.

### Executar

```bash
npx expo start
```

Escaneie o QR code com o Expo Go ou rode no emulador.

---

## Equipe — 2TDSPS FIAP 2026

| Integrante | RM | Responsabilidade |
|---|---|---|
| Pedro Henrique da Silva | **RM 560393** | Mobile (React Native + Expo) |
| Lucas Borges de Souza | **RM 560027** | Back-end (Java + .NET) |
| Bruno Carlos Soares | **RM 559250** | IA + Arquitetura de sistema |

---

## Conexão com os backends

O BoneGuard se conecta a dois serviços:

| Serviço | Linguagem | Porta padrão | Responsabilidade |
|---|---|---|---|
| `boneguard-service` | Java Spring Boot | `8080` | Autenticação, pacientes, upload de raio-X |
| `management-service` | .NET | `5000` | CRUD de avaliações e planos de saúde |

---

## Decisões de segurança

- Token JWT armazenado via **Expo SecureStore** (criptografia nativa do dispositivo)
- Interceptor Axios com **logout automático em 401**
- Sessão restaurada do storage seguro ao reiniciar o app
- Validação de e-mail, senha mínima e campos obrigatórios em todos os formulários
- Tamanho máximo de 10MB para upload de radiografias

---

*Global Solution FIAP 2026 — Tecnologia que salva ossos, baseada na ciência que salva astronautas.*
