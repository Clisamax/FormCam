# 🔧 Solução para Problemas de Conectividade com API

## 🚨 Problema Identificado

O dispositivo físico não consegue enviar requisições para a API porque estava configurada para usar `localhost:3338`, que só funciona no emulador.

## ✅ Solução Implementada

### 1. **Detecção Automática de Ambiente**
- O app agora detecta automaticamente se está rodando no dispositivo físico ou emulador
- No emulador: usa `http://localhost:3338`
- No dispositivo físico: usa `http://192.168.0.16:3338` (IP da sua máquina)

### 2. **Configurações Atualizadas**

#### **Arquivo: `src/services/api.ts`**
```typescript
// Detecção automática de ambiente
const isPhysicalDevice = () => {
    return Platform.OS === 'ios' ? !__DEV__ : !__DEV__;
};

// URL base dinâmica
const getBaseURL = async (): Promise<string> => {
    const PORT = '3338';
    
    if (isPhysicalDevice()) {
        // No dispositivo físico, usa o IP da máquina
        const localIP = await getLocalIP();
        return `http://${localIP}:${PORT}`;
    }
    
    // No emulador, usa localhost
    return `http://localhost:${PORT}`;
};
```

#### **Arquivo: `app.json`**
```json
"NSAppTransportSecurity": {
    "NSAllowsArbitraryLoads": true,
    "NSExceptionDomains": {
        "localhost": {
            "NSExceptionAllowsInsecureHTTPLoads": true
        },
        "192.168.0.16": {
            "NSExceptionAllowsInsecureHTTPLoads": true
        }
    }
}
```

## 🛠️ Como Testar

### 1. **Verificar se o Servidor está Acessível**
```bash
# Execute este comando no terminal
curl -I http://192.168.0.16:3338
```

**Resposta esperada:**
```
HTTP/1.1 200 OK
```

### 2. **Usar o Componente de Teste de Rede**
- Acesse a tela: `/(auth)/network-test`
- O componente irá testar automaticamente a conectividade
- Mostrará IPs descobertos e status da conexão

### 3. **Verificar Logs do App**
- Abra o console do Expo/React Native
- Procure por mensagens de erro de rede
- Verifique se está usando o IP correto

## 🔍 Diagnóstico de Problemas

### **Problema: "Servidor não está acessível"**

**Possíveis causas:**
1. **Servidor não está rodando**
   ```bash
   # Verifique se o servidor está rodando na porta 3338
   lsof -i :3338
   ```

2. **Firewall bloqueando**
   - Desative temporariamente o firewall do macOS
   - Vá em: Sistema > Preferências > Segurança e Privacidade > Firewall

3. **Dispositivo não está na mesma rede**
   - Certifique-se de que o iPhone e o Mac estão conectados na mesma rede Wi-Fi
   - Verifique se não há rede corporativa bloqueando

4. **IP incorreto**
   - Execute: `./scripts/discover-ip.sh`
   - Atualize o IP no arquivo `src/services/api.ts`

### **Problema: "Erro de certificado SSL"**

**Solução:**
- O app já está configurado para aceitar conexões HTTP locais
- Verifique se o `app.json` tem as configurações corretas

### **Problema: "Timeout"**

**Possíveis causas:**
1. Rede lenta
2. Servidor sobrecarregado
3. Firewall bloqueando

## 📱 Testando no Dispositivo Físico

### 1. **Compilar e Instalar**
```bash
# Para iOS
expo run:ios --device

# Para Android
expo run:android
```

### 2. **Verificar Conectividade**
- Abra o app no dispositivo físico
- Acesse a tela de teste de rede
- Verifique se todos os status estão "✅ Conectado"

### 3. **Testar Login**
- Tente fazer login no app
- Verifique se as requisições estão funcionando

## 🔄 Atualizações Necessárias

### **Se o IP da sua máquina mudar:**
1. Execute: `./scripts/discover-ip.sh`
2. Atualize o IP em `src/services/api.ts`
3. Atualize o IP em `app.json`
4. Recompile o app

### **Se mudar de rede:**
1. Verifique se o novo IP está nas configurações
2. Execute o teste de conectividade
3. Atualize as configurações se necessário

## 📋 Checklist de Verificação

- [ ] Servidor rodando na porta 3338
- [ ] Dispositivo e computador na mesma rede Wi-Fi
- [ ] Firewall desativado temporariamente
- [ ] IP correto configurado (192.168.0.16)
- [ ] Configurações de segurança atualizadas no app.json
- [ ] App recompilado com as novas configurações
- [ ] Teste de conectividade executado
- [ ] Login funcionando no dispositivo físico

## 🆘 Ainda com Problemas?

1. **Execute o diagnóstico completo:**
   ```bash
   ./scripts/discover-ip.sh
   curl -I http://192.168.0.16:3338
   ```

2. **Verifique os logs do servidor:**
   - Certifique-se de que o servidor está aceitando conexões externas
   - Verifique se não há restrições de CORS

3. **Teste com ferramentas externas:**
   - Use o Postman ou Insomnia para testar a API
   - Verifique se a API responde corretamente

4. **Contate o suporte:**
   - Forneça os logs de erro
   - Inclua o resultado do teste de conectividade 