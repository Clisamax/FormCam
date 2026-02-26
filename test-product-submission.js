const axios = require('axios');

// Teste de envio de produto - Simulando o formato que o frontend envia para o backend
async function testProductSubmission() {
    const apiUrl = 'https://formcamapi-production.up.railway.app';
    
    const testData = {
        uuid: `test-uuid-${Date.now()}`,
        occurrence_date: '15-01-2024', // Formato DD-MM-YYYY conforme exigido pelo backend (convertido pelo frontend)
        product: '12345678',
        quantity: 10,
        name_of_responsible: 'João Silva',
        unit: 'caixa'
    };

    try {
        console.log('Enviando dados:', testData);
        
        const response = await axios.post(`${apiUrl}/api/v1/products`, testData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Sucesso:', response.status);
        console.log('Resposta:', response.data);
        
    } catch (error) {
        if (error.response) {
            console.log('❌ Erro HTTP:', error.response.status);
            console.log('Dados do erro:', error.response.data);
        } else {
            console.log('❌ Erro de conexão:', error.message);
        }
    }
}

testProductSubmission();
