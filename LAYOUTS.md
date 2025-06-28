# Estrutura de Layouts do FormCam

## Visão Geral

O projeto FormCam agora possui uma estrutura de layouts organizada que permite diferentes tipos de interface dependendo da funcionalidade:

## Estrutura de Pastas e Layouts

### 📁 `src/app/_layout.tsx` (Layout Principal)
- **Função**: Layout raiz que fornece providers globais (Auth, Form)
- **Características**: 
  - Carrega fontes
  - Fornece AuthProvider e FormProvider
  - Não define interface visual

### 📁 `src/app/(login)/_layout.tsx` (Layout de Login)
- **Função**: Layout padrão com header e footer
- **Características**:
  - Header com logo FormCam
  - Área central para conteúdo
  - Footer com créditos
- **Usado por**: Todas as páginas de login e cadastro

### 📁 `src/app/(auth)/_layout.tsx` (Layout de Autenticação)
- **Função**: Layout intermediário para área autenticada
- **Características**: Container simples com flex: 1

### 📁 `src/app/(auth)/forms/_layout.tsx` (Layout de Formulários)
- **Função**: Layout padrão com header e footer
- **Características**:
  - Header com logo FormCam
  - Área central para formulários
  - Footer com créditos
- **Usado por**: Todas as páginas de formulários (home, expedição, recepção, etc.)

### 📁 `src/app/(auth)/camera/_layout.tsx` (Layout da Câmera)
- **Função**: Layout de tela inteira para câmera
- **Características**:
  - Tela cheia sem header/footer
  - Fundo preto
  - Otimizado para captura de fotos
- **Usado por**: Componente de câmera

## Rotas Disponíveis

### 🔐 Área de Login (`/(login)`)
- `/login` - Página de login
- `/cadastro` - Página de cadastro
- `/cadastroFinal` - Finalização de cadastro

### 📋 Área de Formulários (`/(auth)/forms`)
- `/home` - Página inicial com formulário principal
- `/expedicao` - Formulário de expedição
- `/recepcao` - Formulário de recepção
- `/movInterna` - Formulário de movimentação interna
- `/responsavel` - Formulário de responsável
- `/ocorrencia` - Formulário de ocorrência
- `/revisao` - Formulário de revisão

### 📷 Área da Câmera (`/(auth)/camera`)
- `/` - Componente de câmera em tela cheia

## Como Usar

### Para acessar a câmera:
```typescript
import { router } from 'expo-router';

// Navegar para a câmera
router.push('/(auth)/camera');
```

### Para voltar da câmera:
```typescript
// Voltar para a página anterior
router.back();

// Ou navegar para uma página específica
router.push('/(auth)/forms/home');
```

## Benefícios da Nova Estrutura

1. **Separação de Responsabilidades**: Cada área tem seu próprio layout
2. **Flexibilidade**: A câmera pode usar tela cheia sem interferir nos formulários
3. **Manutenibilidade**: Mudanças em um layout não afetam outros
4. **Performance**: Layouts são carregados apenas quando necessário
5. **UX Consistente**: Formulários mantêm interface consistente, câmera tem interface otimizada

## Exemplo de Uso

```typescript
// Na página home, adicionar botão para câmera
<Button
  title="Câmera"
  onPress={() => router.push('/(auth)/camera')}
  iconName="camera"
/>
``` 