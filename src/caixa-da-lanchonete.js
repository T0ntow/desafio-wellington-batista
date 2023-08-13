class CaixaDaLanchonete {
    constructor() {
        this.cardapio = new Cardapio();
        this.formasDePagamento = new FormasDePagamento();
    }

    calcularValorDaCompra(metodoDePagamento, itens) {
        if (!this.formasDePagamento.verificarFormaDePagamento(metodoDePagamento)) {
            return 'Forma de pagamento inválida.';
        }

        if (itens.length === 0) {
            return 'Não há itens no carrinho de compra!';
        }

        let total = 0;
        const itensSelecionados = {};
        const itensPrincipais = [];
        const itensExtras = [];

        for (const item of itens) {
            const [codigo, quantidade] = item.split(',');
            const itemMenu = this.cardapio.buscarItemPorCodigo(codigo.trim());
            
            if (itemMenu) {
                if (!itemMenu.descricao.includes('(extra ')) {
                    itensPrincipais.push(itemMenu);
                } else {
                    itensExtras.push(itemMenu);
                }

                if (!quantidade) {
                    return "insira a quantidade do item"
                }

                const descricaoItem = itemMenu.descricao;
                itensSelecionados[descricaoItem] = (itensSelecionados[descricaoItem] || 0) + parseInt(quantidade);
                total += itemMenu.valor * parseInt(quantidade);
            } else {
                console.log("Item inválido!");
            }
        }

        const erroItensExtras = this.verificarItensExtras(itensPrincipais, itensExtras);
        if (erroItensExtras) {
            return erroItensExtras;
        }

        if (total === 0) {
            return 'Quantidade inválida!';
        }

        return `Total a pagar (${metodoDePagamento}): R$ ${total.toFixed(2)}`;
    }

    verificarItensExtras(itensPrincipais, itensExtras) {
        for (const extra of itensExtras) {
            if (extra.codigo.includes('chantily') && !itensPrincipais.some(principal => principal.codigo.includes('cafe'))) {
                return "Item extra (chantily) não pode ser pedido sem o principal (café)."
            } else if (extra.codigo.includes('queijo') && !itensPrincipais.some(principal => principal.codigo.includes('sanduiche'))) {
                return "Item extra (queijo) não pode ser pedido sem o principal (sanduíche)."
            }
        }
        return null;
    }
}


class Cardapio {
    constructor() {
        this.itens = [
            { codigo: 'cafe', descricao: 'Café', valor: 3.00 },
            { codigo: 'chantily', descricao: 'Chantily (extra do Café)', valor: 1.50 },
            { codigo: 'suco', descricao: 'Suco Natural', valor: 6.20 },
            { codigo: 'sanduiche', descricao: 'Sanduíche', valor: 6.50 },
            { codigo: 'queijo', descricao: 'Queijo (extra do Sanduíche)', valor: 2.00 },
            { codigo: 'salgado', descricao: 'Salgado', valor: 7.25 },
            { codigo: 'combo1', descricao: '1 Suco e 1 Sanduíche', valor: 9.50 },
            { codigo: 'combo2', descricao: '1 Café e 1 Sanduíche', valor: 7.50 }
        ];
    }

    buscarItemPorCodigo(codigo) {
        return this.itens.find(item => item.codigo === codigo);
    }

    exibirCardapio() {
        console.log('Código   Descrição                     Valor');
        console.log('--------------------------------------------');
        this.itens.forEach(item => {
            console.log(`${item.codigo.padEnd(15)}${item.descricao.padEnd(30)}R$ ${item.valor.toFixed(2)}`);
        });
    }
}

class FormasDePagamento {
    constructor() {
        this.formas = ['dinheiro', 'debito', 'credito'];
    }

    verificarFormaDePagamento(forma) {
        return this.formas.includes(forma);
    }

    exibirFormasDisponiveis() {
        console.log('Formas de Pagamento Disponíveis:');
        this.formas.forEach(forma => {
            console.log(`- ${forma}`);
        });
    }
}

const caixaLanchonete = new CaixaDaLanchonete();
const valorTotal = caixaLanchonete.calcularValorDaCompra('credito', ['chantily,1']);
console.log(valorTotal);