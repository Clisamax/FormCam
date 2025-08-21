# 📱 FormCam

Um aplicativo móvel desenvolvido com React Native e Expo para coleta de dados através de formulários e captura de imagens.

## �� Sobre o Projeto

O **FormCam** é uma aplicação móvel que permite aos usuários preencher formulários diversos e capturar imagens através da câmera do dispositivo. O app oferece uma interface intuitiva para coleta de dados em campo, com sistema de autenticação e sincronização com servidor.

## ✨ Funcionalidades

- 🔐 **Sistema de Autenticação**: Login e cadastro de usuários
- �� **Formulários Dinâmicos**: Múltiplos tipos de formulários
- 📷 **Captura de Imagens**: Integração com câmera do dispositivo
- �� **Sincronização**: Conexão com API para envio de dados
- 📱 **Interface Responsiva**: Suporte para iOS e Android
- 🔄 **Offline/Online**: Tratamento de conectividade

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento móvel
- **Expo** - Plataforma de desenvolvimento e build
- **TypeScript** - Tipagem estática
- **React Hook Form** - Gerenciamento de formulários
- **Expo Camera** - Captura de imagens
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local
- **Expo Router** - Navegação

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Rotas e layouts (Expo Router)
│   ├── (login)/           # Área de login e cadastro
│   ├── (auth)/            # Área autenticada
│   │   ├── forms/         # Formulários
│   │   └── camera/        # Componente de câmera
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizáveis
│   ├── button/
│   ├── input/
│   ├── inputDatePicker/
│   ├── inputPassword/
│   └── ...
├── context/               # Contextos React
│   └── auth.tsx          # Contexto de autenticação
├── services/              # Serviços externos
│   └── api.ts            # Configuração da API
├── @types/               # Definições de tipos TypeScript
├── utils/                # Utilitários
├── hooks/                # Custom hooks
├── constants/            # Constantes
└── styles/               # Estilos globais
```

##  Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Yarn ou npm
- Expo CLI
- iOS Simulator (para desenvolvimento iOS)
- Android Studio (para desenvolvimento Android)

### Instalação

1. **Clone o repositório**
```bash
git clone [URL_DO_REPOSITORIO]
cd FormCam
```

2. **Instale as dependências**
```bash
yarn install
# ou
npm install
```

3. **Execute o projeto**
```bash
# Desenvolvimento
yarn start

# iOS
yarn ios

# Android
yarn android

# Web
yarn web
```

## 📱 Funcionalidades Principais

### Sistema de Autenticação
- Login com SAP e senha
- Cadastro de novos usuários
- Sessão persistente com expiração automática
- Logout seguro

### Formulários Disponíveis
- **Home**: Formulário principal
- **Expedição**: Controle de expedição
- **Recepção**: Controle de recepção
- **Movimentação Interna**: Movimentações internas
- **Responsável**: Gestão de responsáveis
- **Ocorrência**: Registro de ocorrências
- **Revisão**: Formulário de revisão

### Captura de Imagens
- Interface de câmera em tela cheia
- Captura de fotos para documentos
- Integração com formulários

## ⚙️ Configuração

### Variáveis de Ambiente
O projeto utiliza a API em produção:
- **Base URL**: `https://maxcamapi-production.up.railway.app`

### Permissões
- **Câmera**: Para captura de imagens
- **Internet**: Para sincronização de dados
- **Armazenamento**: Para salvar dados localmente

## 📦 Scripts Disponíveis

```json
{
  "start": "expo start --dev-client",
  "start:tunnel": "expo start --dev-client --tunnel",
  "android": "expo run:android",
  "ios": "expo run:ios",
  "eas:build:ios": "eas build --profile development --platform ios",
  "web": "expo start --web",
  "test": "jest --watchAll"
}
```

## 🏗️ Arquitetura

### Layouts
O projeto utiliza uma estrutura de layouts organizada:
- **Layout Principal**: Providers globais
- **Layout de Login**: Interface para autenticação
- **Layout de Formulários**: Interface para formulários
- **Layout da Câmera**: Interface de câmera em tela cheia

### Context API
- **AuthContext**: Gerencia estado de autenticação
- **FormContext**: Gerencia estado dos formulários

### Componentes
Componentes reutilizáveis organizados por funcionalidade:
- Inputs customizados
- Botões
- Navegação
- Progresso

## 🔒 Segurança

- Autenticação via token JWT
- Expiração automática de sessão
- Validação de formulários
- Tratamento seguro de erros

## 📊 Status do Projeto

- ✅ Sistema de autenticação
- ✅ Formulários funcionais
- ✅ Integração com câmera
- ✅ Conexão com API
- ✅ Interface responsiva
- ✅ Tratamento de erros

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ‍💻 Desenvolvedor

**Clisamax Gomes**
- GitHub: [@clisamaxgomes](https://github.com/clisamaxgomes)

## 📞 Suporte

**Clisamax Gomes**
- (19) 998446622

Para suporte ou dúvidas, entre em contato através do GitHub ou email.

---

**FormCam** - Simplificando a coleta de dados em campo 📱✨

