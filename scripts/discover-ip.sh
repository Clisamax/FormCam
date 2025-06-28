#!/bin/bash

echo "🔍 Descobrindo IP da máquina na rede local..."
echo ""

# Função para obter IP baseado no sistema operacional
get_local_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "IP não encontrado"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        hostname -I | awk '{print $1}' 2>/dev/null || echo "IP não encontrado"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        ipconfig | grep "IPv4" | head -1 | awk '{print $NF}' 2>/dev/null || echo "IP não encontrado"
    else
        echo "Sistema operacional não suportado"
    fi
}

# Obter IP local
LOCAL_IP=$(get_local_ip)

echo "📱 IP da sua máquina: $LOCAL_IP"
echo ""
echo "🌐 URLs para testar:"
echo "   • http://$LOCAL_IP:3338"
echo "   • http://localhost:3338 (apenas emulador)"
echo ""
echo "🔧 Configurações necessárias:"
echo "   1. Certifique-se de que o servidor está rodando na porta 3338"
echo "   2. O dispositivo físico deve estar na mesma rede Wi-Fi"
echo "   3. Desative temporariamente o firewall do computador"
echo "   4. Use a URL: http://$LOCAL_IP:3338 no app"
echo ""
echo "📋 Para testar se o servidor está acessível:"
echo "   curl -I http://$LOCAL_IP:3338"
echo ""
echo "✅ Se o curl retornar 200 OK, o servidor está acessível!" 