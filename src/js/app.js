import 'bootstrap';
import './../scss/app.scss';
import './ui/common.js';

import Vue from 'vue';


Vue.component(
    'opportunities-listing',
    require('./components/OpportunitiesListing.vue').default
);


new Vue({
	el: '#app',
});
