const CrmLeadsOrcamento = function() {
    
    /**
     * Gera e imprime relatório de orçamento em PDF usando jsPDF
     * @param {Object} dadosOrcamento - Dados do orçamento
     * @param {string} dadosOrcamento.nomeCliente - Nome do cliente
     * @param {string} dadosOrcamento.numeroproposta - Número da proposta
     * @param {string} dadosOrcamento.dataPropostas - Data da proposta
     * @param {string} dadosOrcamento.nomeEmpresa - Nome da empresa
     * @param {string} dadosOrcamento.enderecoEmpresa - Endereço da empresa
     * @param {string} dadosOrcamento.telefoneEmpresa - Telefone da empresa
     * @param {Array} dadosOrcamento.modulos - Lista de módulos do orçamento
     * @param {string} dadosOrcamento.modulos[].nome - Nome do módulo
     * @param {string} dadosOrcamento.modulos[].detalhes - Detalhes do módulo
     * @param {number} dadosOrcamento.modulos[].quantidade - Quantidade
     * @param {number} dadosOrcamento.modulos[].valorMensal - Valor mensal
     * @param {number} dadosOrcamento.modulos[].valorAdesao - Valor de adesão
     * @param {string} dadosOrcamento.observacoes - Observações da proposta
     * @param {string} dadosOrcamento.vendedor - Nome do vendedor
     * @param {string} dadosOrcamento.validadeProposta - Validade da proposta
     * @param {string} dadosOrcamento.prazoEntrega - Prazo de entrega
     * @param {string} dadosOrcamento.condicoesPagamento - Condições de pagamento
     * @param {string} dadosOrcamento.formasPagamento - Formas de pagamento
     * @param {string} dadosOrcamento.nomeLegal - Nome legal para assinatura
     * @param {string} dadosOrcamento.dataAssinatura - Data da assinatura
     */
    function gerarRelatorioOrcamento(dadosOrcamento) {
        // Importar jsPDF (assumindo que está disponível globalmente)
        const { jsPDF } = window.jspdf;
        
        if (!jsPDF) {
            console.error('jsPDF não está disponível. Certifique-se de incluir a biblioteca.');
            return;
        }
        
        // Criar nova instância do PDF
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Configurações gerais
        const margemEsquerda = 20;
        const margemDireita = 20;
        const margemSuperior = 20;
        const margemInferior = 20;
        const larguraPagina = 210; // A4 width
        const alturaPagina = 297; // A4 height
        const larguraUtil = larguraPagina - margemEsquerda - margemDireita;
        
        let posicaoY = margemSuperior;
        
        // Função para adicionar nova página se necessário
        function verificarNovaPagina(alturaConteudo) {
            if (posicaoY + alturaConteudo > alturaPagina - margemInferior) {
                doc.addPage();
                posicaoY = margemSuperior;
                return true;
            }
            return false;
        }
        
        // Função para desenhar linha horizontal
        function desenharLinha(y, largura = larguraUtil) {
            doc.setDrawColor(200, 200, 200);
            doc.line(margemEsquerda, y, margemEsquerda + largura, y);
        }
        
        // Cabeçalho da empresa
        function desenharCabecalho() {
            // Logo (simulado com retângulo azul)
            doc.setFillColor(0, 150, 200);
            doc.roundedRect(margemEsquerda, posicaoY, 30, 15, 3, 3, 'F');
            
            // Nome da empresa (lado direito)
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(dadosOrcamento.nomeEmpresa || 'Sua empresa', larguraPagina - margemDireita, posicaoY + 5, { align: 'right' });
            
            // Endereço da empresa
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(dadosOrcamento.enderecoEmpresa || 'Rua, 123', larguraPagina - margemDireita, posicaoY + 10, { align: 'right' });
            doc.text(dadosOrcamento.cidadeEmpresa || 'Cidade, Estado, 00000-000', larguraPagina - margemDireita, posicaoY + 14, { align: 'right' });
            doc.text(dadosOrcamento.telefoneEmpresa || '(55) 000-0000', larguraPagina - margemDireita, posicaoY + 18, { align: 'right' });
            
            posicaoY += 35;
        }
        
        // Informações do cliente e proposta
        function desenharInfoClienteProposta() {
            // Nome do cliente
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text(dadosOrcamento.nomeCliente || 'Nome Cliente', margemEsquerda, posicaoY);
            
            // Número da proposta (lado direito)
            doc.setFontSize(24);
            doc.text(dadosOrcamento.numeroProposta || '100', larguraPagina - margemDireita, posicaoY, { align: 'right' });
            
            // Label "Proposta N°"
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.text('Proposta N°', larguraPagina - margemDireita, posicaoY - 8, { align: 'right' });
            
            posicaoY += 10;
            
            // Data da proposta
            doc.setFontSize(10);
            doc.text(dadosOrcamento.dataProposta || 'Cidade, 18 de Março de 2025', larguraPagina - margemDireita, posicaoY, { align: 'right' });
            
            posicaoY += 15;
            
            // Texto introdutório
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.text('Apresentamos nossa proposta exclusiva para mobilizar o seu lar :)', margemEsquerda, posicaoY);
            
            posicaoY += 20;
            
            // Linha separadora
            desenharLinha(posicaoY);
            posicaoY += 10;
        }
        
        // Cabeçalho da tabela
        function desenharCabecalhoTabela() {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            
            // Cabeçalhos das colunas
            doc.text('Descrição', margemEsquerda, posicaoY);
            doc.text('Detalhes', margemEsquerda + 50, posicaoY);
            doc.text('Qtd', margemEsquerda + 120, posicaoY, { align: 'center' });
            doc.text('Preço unitário', margemEsquerda + 140, posicaoY, { align: 'center' });
            doc.text('Preço total', margemEsquerda + 170, posicaoY, { align: 'right' });
            
            posicaoY += 5;
            desenharLinha(posicaoY);
            posicaoY += 8;
        }
        
        // Itens da tabela
        function desenharItensTabela() {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            
            let subtotal = 0;
            
            dadosOrcamento.modulos.forEach((modulo, index) => {
                // Verificar se precisa de nova página
                verificarNovaPagina(25);
                
                // Nome do módulo
                doc.setFont('helvetica', 'bold');
                doc.text(modulo.nome, margemEsquerda, posicaoY);
                
                // Detalhes do módulo
                doc.setFont('helvetica', 'normal');
                doc.text(modulo.detalhes, margemEsquerda + 50, posicaoY);
                
                // Quantidade
                doc.text(modulo.quantidade.toString(), margemEsquerda + 120, posicaoY, { align: 'center' });
                
                // Valor unitário
                const valorUnitario = modulo.valorMensal || modulo.valorAdesao || 0;
                doc.text(`R$${valorUnitario.toFixed(2).replace('.', ',')}`, margemEsquerda + 140, posicaoY, { align: 'center' });
                
                // Valor total
                const valorTotal = valorUnitario * modulo.quantidade;
                doc.text(`R$${valorTotal.toFixed(2).replace('.', ',')}`, margemEsquerda + 170, posicaoY, { align: 'right' });
                
                subtotal += valorTotal;
                posicaoY += 12;
                
                // Linha separadora entre itens
                if (index < dadosOrcamento.modulos.length - 1) {
                    doc.setDrawColor(240, 240, 240);
                    doc.line(margemEsquerda, posicaoY - 2, margemEsquerda + larguraUtil, posicaoY - 2);
                }
            });
            
            return subtotal;
        }
        
        // Totalizadores
        function desenharTotalizadores(subtotal) {
            verificarNovaPagina(40);
            
            posicaoY += 5;
            desenharLinha(posicaoY);
            posicaoY += 10;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            
            // Subtotal
            doc.text('Subtotal', margemEsquerda + 120, posicaoY);
            doc.text(`R$${subtotal.toFixed(2).replace('.', ',')}`, margemEsquerda + 170, posicaoY, { align: 'right' });
            posicaoY += 8;
            
            // Frete
            const frete = dadosOrcamento.frete || 20.00;
            doc.text('Frete', margemEsquerda + 120, posicaoY);
            doc.text(`R$${frete.toFixed(2).replace('.', ',')}`, margemEsquerda + 170, posicaoY, { align: 'right' });
            posicaoY += 15;
            
            // Total final
            const total = subtotal + frete;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(`R$${total.toFixed(2).replace('.', ',')}`, margemEsquerda + 170, posicaoY, { align: 'right' });
            
            posicaoY += 20;
        }
        
        // Observações
        function desenharObservacoes() {
            verificarNovaPagina(60);
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text('Observações da Proposta', margemEsquerda, posicaoY);
            posicaoY += 8;
            
            // Fundo cinza para observações
            doc.setFillColor(245, 245, 245);
            doc.rect(margemEsquerda, posicaoY - 5, larguraUtil, 25, 'F');
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const observacoes = dadosOrcamento.observacoes || 'Não estão inclusos neste orçamento os granitos, vidros, espelhos, suportes para vidro, iluminação, instalações elétricas, decorações e pintura, exceto quando especificados no orçamento.';
            
            // Quebrar texto em múltiplas linhas
            const linhasObservacoes = doc.splitTextToSize(observacoes, larguraUtil - 10);
            doc.text(linhasObservacoes, margemEsquerda + 5, posicaoY);
            
            posicaoY += 35;
        }
        
        // Informações adicionais
        function desenharInformacoesAdicionais() {
            verificarNovaPagina(80);
            
            // Tabela de informações
            const infoHeight = 15;
            const infoY = posicaoY;
            
            // Fundo cinza para cabeçalhos
            doc.setFillColor(240, 240, 240);
            doc.rect(margemEsquerda, infoY, larguraUtil/2, infoHeight, 'F');
            doc.rect(margemEsquerda + larguraUtil/2, infoY, larguraUtil/2, infoHeight, 'F');
            
            // Bordas
            doc.setDrawColor(200, 200, 200);
            doc.rect(margemEsquerda, infoY, larguraUtil, infoHeight * 2);
            doc.line(margemEsquerda + larguraUtil/2, infoY, margemEsquerda + larguraUtil/2, infoY + infoHeight * 2);
            doc.line(margemEsquerda, infoY + infoHeight, margemEsquerda + larguraUtil, infoY + infoHeight);
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            
            // Primeira linha
            doc.text('Vendedor', margemEsquerda + 5, infoY + 8);
            doc.text(dadosOrcamento.vendedor || 'Rafael', margemEsquerda + 5, infoY + infoHeight + 8);
            
            doc.text('Validade da Proposta', margemEsquerda + larguraUtil/2 + 5, infoY + 8);
            doc.text(dadosOrcamento.validadeProposta || '7 dias', margemEsquerda + larguraUtil/2 + 5, infoY + infoHeight + 8);
            
            posicaoY += infoHeight * 2 + 10;
            
            // Segunda tabela
            doc.setFillColor(240, 240, 240);
            doc.rect(margemEsquerda, posicaoY, larguraUtil/2, infoHeight, 'F');
            doc.rect(margemEsquerda + larguraUtil/2, posicaoY, larguraUtil/2, infoHeight, 'F');
            
            doc.rect(margemEsquerda, posicaoY, larguraUtil, infoHeight * 2);
            doc.line(margemEsquerda + larguraUtil/2, posicaoY, margemEsquerda + larguraUtil/2, posicaoY + infoHeight * 2);
            doc.line(margemEsquerda, posicaoY + infoHeight, margemEsquerda + larguraUtil, posicaoY + infoHeight);
            
            doc.text('Prazo de Entrega', margemEsquerda + 5, posicaoY + 8);
            doc.text(dadosOrcamento.prazoEntrega || 'A combinar', margemEsquerda + 5, posicaoY + infoHeight + 8);
            
            doc.text('Cond. Pagamento', margemEsquerda + larguraUtil/2 + 5, posicaoY + 8);
            doc.text(dadosOrcamento.condicoesPagamento || 'A combinar', margemEsquerda + larguraUtil/2 + 5, posicaoY + infoHeight + 8);
            
            posicaoY += infoHeight * 2 + 15;
        }
        
        // Formas de pagamento
        function desenharFormasPagamento() {
            verificarNovaPagina(50);
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text('Formas de Pagamento', margemEsquerda, posicaoY);
            posicaoY += 8;
            
            // Fundo cinza
            doc.setFillColor(245, 245, 245);
            doc.rect(margemEsquerda, posicaoY - 5, larguraUtil, 30, 'F');
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            
            const formasPagamento = dadosOrcamento.formasPagamento || 
                '- Parcelamento em até 12 vezes no cartão sem acréscimos e sem entrada.\n' +
                '- Financiamento em até 48x pela Caixa Econômica.\n' +
                '- Desconto exclusivo de 5% para pagamento à vista.';
            
            const linhasFormas = formasPagamento.split('\n');
            linhasFormas.forEach((linha, index) => {
                doc.text(linha, margemEsquerda + 5, posicaoY + (index * 6));
            });
            
            posicaoY += 40;
        }
        
        // Área de assinatura
        function desenharAssinatura() {
            verificarNovaPagina(60);
            
            posicaoY += 20;
            
            // Linhas para assinatura
            const larguraAssinatura = 50;
            const espacoAssinatura = (larguraUtil - larguraAssinatura * 3) / 2;
            
            // Nome Legal
            doc.line(margemEsquerda, posicaoY, margemEsquerda + larguraAssinatura, posicaoY);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text('Nome Legal', margemEsquerda, posicaoY + 8);
            
            // Assinatura
            doc.line(margemEsquerda + larguraAssinatura + espacoAssinatura, posicaoY, 
                    margemEsquerda + larguraAssinatura * 2 + espacoAssinatura, posicaoY);
            doc.text('Assinatura', margemEsquerda + larguraAssinatura + espacoAssinatura, posicaoY + 8);
            
            // Data
            doc.line(margemEsquerda + larguraAssinatura * 2 + espacoAssinatura * 2, posicaoY, 
                    margemEsquerda + larguraUtil, posicaoY);
            doc.text('Data', margemEsquerda + larguraAssinatura * 2 + espacoAssinatura * 2, posicaoY + 8);
            
            // Simulação de assinatura (curva)
            if (dadosOrcamento.assinatura !== false) {
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(1);
                // Simular uma assinatura com curvas
                const assinaturaX = margemEsquerda + larguraAssinatura + espacoAssinatura + 10;
                const assinaturaY = posicaoY - 10;
                
                doc.line(assinaturaX, assinaturaY, assinaturaX + 20, assinaturaY - 5);
                doc.line(assinaturaX + 20, assinaturaY - 5, assinaturaX + 30, assinaturaY + 2);
                doc.line(assinaturaX + 15, assinaturaY - 2, assinaturaX + 25, assinaturaY - 8);
            }
        }
        
        // Executar todas as funções de desenho
        desenharCabecalho();
        desenharInfoClienteProposta();
        desenharCabecalhoTabela();
        const subtotal = desenharItensTabela();
        desenharTotalizadores(subtotal);
        desenharObservacoes();
        desenharInformacoesAdicionais();
        desenharFormasPagamento();
        desenharAssinatura();
        
        // Salvar o PDF
        const nomeArquivo = `Orcamento_${dadosOrcamento.numeroProposta || 'Proposta'}_${dadosOrcamento.nomeCliente || 'Cliente'}.pdf`;
        doc.save(nomeArquivo);
    }
    
    /**
     * Função principal para inicializar o módulo
     */
    function init() {
        // Exemplo de uso
        const dadosExemplo = {
            nomeCliente: 'Nome Cliente',
            numeroProposta: '100',
            dataProposta: 'Cidade, 18 de Março de 2025',
            nomeEmpresa: 'Sua empresa',
            enderecoEmpresa: 'Rua, 123',
            cidadeEmpresa: 'Cidade, Estado, 00000-000',
            telefoneEmpresa: '(55) 000-0000',
            modulos: [
                {
                    nome: 'Cozinha Sob Medida',
                    detalhes: 'Cozinha em MDF Branco com corretiças telescópicas',
                    quantidade: 1,
                    valorMensal: 0,
                    valorAdesao: 9850.00
                },
                {
                    nome: 'Armário Quarto',
                    detalhes: 'Armário com portas de correr',
                    quantidade: 1,
                    valorMensal: 0,
                    valorAdesao: 6850.00
                },
                {
                    nome: 'Banheiro Social',
                    detalhes: 'Banheiro com portas de vidro no armário aéreo',
                    quantidade: 2,
                    valorMensal: 0,
                    valorAdesao: 2890.00
                }
            ],
            frete: 20.00,
            observacoes: 'Não estão inclusos neste orçamento os granitos, vidros, espelhos, suportes para vidro, iluminação, instalações elétricas, decorações e pintura, exceto quando especificados no orçamento.',
            vendedor: 'Rafael',
            validadeProposta: '7 dias',
            prazoEntrega: 'A combinar',
            condicoesPagamento: 'A combinar',
            formasPagamento: '- Parcelamento em até 12 vezes no cartão sem acréscimos e sem entrada.\n- Financiamento em até 48x pela Caixa Econômica.\n- Desconto exclusivo de 5% para pagamento à vista.',
            nomeLegal: '',
            dataAssinatura: '',
            assinatura: true
        };
        
        // Expor função globalmente para uso externo
        window.CrmLeadsOrcamento = {
            gerar: gerarRelatorioOrcamento,
            exemplo: dadosExemplo
        };
        
        console.log('CrmLeadsOrcamento inicializado. Use window.CrmLeadsOrcamento.gerar(dados) para gerar relatórios.');
    }
    
    // Auto-inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Retornar objeto com métodos públicos
    return {
        gerar: gerarRelatorioOrcamento,
        init: init
    };
};

// Executar a função imediatamente
CrmLeadsOrcamento();

