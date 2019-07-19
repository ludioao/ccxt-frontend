<template>
    <div>
        <h1>Oportunidades</h1>

        <form class="row">
            <div class="col-lg-4">
                <label>Pairs:</label>
                <select class="form-control mt-2" multiple name="pairs[]" id="pairs" v-model="pairs">
                    <option v-for="(pairLabel, pair) in availableOptions.pairs" :value="pair" v-html="pairLabel"></option>
                </select>
            </div>
            <div class="col-lg-4">
                <label>Exchanges:</label>
                <select class="form-control mt-2" multiple name="exchanges[]" id="exchanges" v-model="exchanges">
                    <option v-for="(exchangeLabel, exchange) in availableOptions.exchanges" :value="exchange" v-html="exchangeLabel"></option>
                </select>
            </div>
        </form>


        <span v-for="(book, key) in books">{{ key }}</span>

        <div class="table-responsive">
            <table class="table">
                <thead>
                <tr>
                    <th class="border-top-0">Exc 1</th>
                    <th class="border-top-0">Pair</th>
                    <th class="border-top-0">Last</th>
                    <th class="border-top-0">Ask</th>
                    <th class="border-top-0"><i class="fa fa-arrow-right"></i></th>
                    <th class="border-top-0">Exc 2</th>
                    <th class="border-top-0">Pair</th>
                    <th class="border-top-0">Last</th>
                    <th class="border-top-0">Bid</th>
                    <th class="border-top-0"><i class="fa fa-equals"></i></th>
                    <th class="border-top-0">Qty</th>
                    <th class="border-top-0">Brute Diff</th>
                    <th class="border-top-0">Liquid Diff</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="">
                    <td>Mercado Bitcoin</td>
                    <td>BTC/BRL</td>
                    <td>10449.32</td>
                    <td><strong>10540.74</strong></td>
                    <td class="border-top-0"><i class="fa fa-arrow-right"></i></td>
                    <td>Yobit</td>
                    <td>BTC/USD</td>
                    <td>10901.1</td>
                    <td><strong>10901.1</strong></td>
                    <td class="border-top-0"><i class="fa fa-equals"></i></td>
                    <td>0.00087278</td>
                    <td>+3.410
                        %
                    </td>
                    <td><span class="badge badge-boxed badge-success">+2.510%</span></td>
                </tr>
                </tbody>
            </table>

        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import ccxt from 'ccxt';

    export default {
        data() {
                return {
                    listOpportunities: [], // Oportunidades processadas
                    pairs: [], // Pares selecionados
                    exchanges: [], // Exchanges selecionadas
                    availableOptions: {
                        pairs: [],
                        exchanges: []
                    },
                    books: []
                }
        },
        mounted() {
            // load available options
            this.loadAvailableOptions();
            setInterval(function() {
                this.loadOpportunities();
            }.bind(this), 5000);

        },
        methods: {
            /**
             * Carregar as opçõies disponiveis de exchanges e pares
             */
            loadAvailableOptions: function () {
                var vm = this;
                axios.get('http://5d311ed945e2b00014d939c9.mockapi.io/api/v1/availableOptions')
                    .then((response) => {
                        console.log(response.data);
                        vm.availableOptions = response.data[0];
                    })
                    .catch((err) => {
                        alert('falha ao carregar opcoes disponiveis');
                        console.error(err);
                    });
            },
            /**
             * Load Oportunidaes
             */
            loadOpportunities: function() {
                var vm = this;
                console.log('carreguei');
                if (!this.pairs.length || !this.exchanges.length)
                    return;

                this.exchanges.forEach(function(key, value) {
                    var currExchange = key;
                    vm.pairs.forEach(function(key, value) {
                        vm.loadOrderBook(currExchange, key, vm.availableOptions.pairs[key]);
                    });
                    console.log(key, value)
                })
            },

            /**
             * Carrega o book de ordens
             * @param exchange
             * @param pair
             */
            loadOrderBook: async function(exchangeId, pair, pairLabel) {
                var vm = this;
                var exchangeClass = ccxt[exchangeId];
                const proxy = 'https://cors-anywhere.herokuapp.com/';
                var exchange = new exchangeClass({ 'proxy': proxy });
                var response = await exchange.fetchOrderBook(pairLabel)
                    .then((response) => {
                        console.log(response)
                    }).catch((err) => console.error(err));
            }

        }

    }
</script>
