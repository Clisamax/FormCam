# Conectividade de Rede - FormCam

## Visão Geral

O FormCam agora possui um sistema completo de verificação e gerenciamento de conectividade de rede, permitindo que o aplicativo funcione adequadamente com o banco de dados.

## 🔧 **Configurações Implementadas**

### **Permissões de Internet**

#### **Android (`app.json`)**
```json
"permissions": [
  "android.permission.CAMERA",
  "android.permission.INTERNET",
  "android.permission.ACCESS_NETWORK_STATE"
]
```

#### **iOS (`app.json`)**
```json
"infoPlist": {
  "NSCameraUsageDescription": "Este aplicativo precisa acessar a câmera para tirar fotos.",
  "NSAppTransportSecurity": {
    "NSAllowsArbitraryLoads": true,
    "NSExceptionDomains": {
      "localhost": {
        "NSExceptionAllowsInsecureHTTPLoads": true
      }
    }
  }
}
```

## 📡 **Componentes de Conectividade**

### **1. Hook `useNetworkStatus`**
- **Localização**: `src/hooks/useNetworkStatus.ts`
- **Função**: Monitora o status da conectividade em tempo real
- **Retorna**: 
  - `isConnected`: Se o dispositivo está conectado
  - `isInternetReachable`: Se a internet está acessível
  - `type`: Tipo de conexão (wifi, cellular, etc.)

### **2. Componente `NetworkStatus`**
- **Localização**: `src/components/NetworkStatus/NetworkStatus.tsx`
- **Função**: Mostra indicador visual do status da rede
- **Características**:
  - Aparece apenas quando há problemas de conectividade
  - Posicionado no topo da tela
  - Cores diferentes para diferentes status

### **3. Utilitários de Rede**
- **Localização**: `src/utils/networkUtils.ts`
- **Funções**:
  - `testNetworkConnectivity()`: Teste completo de conectividade
  - `checkInternetPermission()`: Verifica permissões
  - `getConnectionInfo()`: Informações detalhadas da conexão

### **4. Componente `NetworkTest`**
- **Localização**: `src/components/NetworkTest/NetworkTest.tsx`
- **Função**: Interface para testar conectividade manualmente
- **Recursos**:
  - Teste completo de conectividade
  - Informações detalhadas da rede
  - Tempo de resposta do servidor

## 🔄 **Melhorias na API**

### **Interceptors Implementados**

#### **Request Interceptor**
```typescript
api.interceptors.request.use(async (config) => {
  const netInfo = await NetInfo.fetch();
  
  if (!netInfo.isConnected) {
    throw new Error('Sem conexão com a internet');
  }
  
  return config;
});
```

#### **Response Interceptor**
```typescript
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Tempo limite excedido. Verifique sua conexão.');
    }
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
    // ... outros tratamentos
  }
);
```

## 🚀 **Como Usar**

### **Verificar Status da Rede**
```typescript
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const MyComponent = () => {
  const { isConnected, isInternetReachable, type } = useNetworkStatus();
  
  if (!isConnected) {
    return <Text>Sem conexão com a internet</Text>;
  }
  
  return <Text>Conectado via {type}</Text>;
};
```

### **Testar Conectividade Manualmente**
```typescript
import { testNetworkConnectivity } from '@/utils/networkUtils';

const testConnection = async () => {
  const result = await testNetworkConnectivity();
  
  if (result.isConnected && result.isInternetReachable && result.serverReachable) {
    console.log('✅ Conectividade OK');
  } else {
    console.log('❌ Problema:', result.error);
  }
};
```

### **Usar o Componente de Teste**
```typescript
import NetworkTest from '@/components/NetworkTest/NetworkTest';

// No seu componente
<NetworkTest />
```

## 📊 **Monitoramento Automático**

### **Indicador de Status**
- Aparece automaticamente no topo da tela quando há problemas
- Cores:
  - 🔴 **Vermelho**: Sem conexão ou internet não acessível
  - 🟢 **Verde**: Conectado e funcionando

### **Tratamento de Erros**
- **Timeout**: Aumentado para 10 segundos
- **Erros de Rede**: Mensagens específicas para cada tipo
- **Reconexão**: Monitoramento automático de mudanças de conectividade

## 🔍 **Testes Disponíveis**

### **1. Teste Básico de Conectividade**
- Verifica se o dispositivo está conectado à rede
- Testa se a internet está acessível

### **2. Teste de Servidor**
- Verifica se o servidor local (localhost:3338) está acessível
- Mede tempo de resposta

### **3. Informações Detalhadas**
- Tipo de conexão (Wi-Fi, Celular, etc.)
- Detalhes específicos da rede
- Status de permissões

## 🛠️ **Troubleshooting**

### **Problemas Comuns**

1. **"Sem conexão com a internet"**
   - Verifique se o Wi-Fi ou dados móveis estão ativos
   - Teste a conectividade com outros apps

2. **"Servidor não está acessível"**
   - Verifique se o servidor está rodando na porta 3338
   - Confirme se o endereço está correto

3. **"Tempo limite excedido"**
   - Verifique a qualidade da conexão
   - Tente novamente em alguns segundos

### **Logs de Debug**
```typescript
// Para debug detalhado
import NetInfo from '@react-native-community/netinfo';

NetInfo.addEventListener((state) => {
  console.log('Status da rede:', state);
});
```

## 📱 **Compatibilidade**

- ✅ **Android**: API 21+ (Android 5.0+)
- ✅ **iOS**: iOS 11+
- ✅ **Expo**: SDK 53+
- ✅ **React Native**: 0.79+

## 🔒 **Segurança**

- Permissões mínimas necessárias
- Tratamento seguro de erros
- Não expõe informações sensíveis
- Validação de conectividade antes das requisições