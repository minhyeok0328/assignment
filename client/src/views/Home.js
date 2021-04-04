import { Component } from "../_core";
import { hubService } from "../services";
import { MainContent } from "../components/MainContent";
import { RankingContent } from "../components/RankingContent";
import { store } from "../store";

export class Home extends Component {

    stateInit () {
        return {
            mainContents: {},
            bestContents: [],
            loading: true,
        }
    }

    async componentDidMounted () {    
        const [ mainContents, bestContents ] = await Promise.all([
            hubService.getMainContents(),
            hubService.getBestContents(),
        ]);
        this.setState({ mainContents, bestContents, loading: false });
    }

    toggleFavorite = (item) => {
        const newFavorites = [ ...store.state.favorites ];
        const itemIndex = newFavorites.findIndex(v => v.idx === item.idx);
        if (itemIndex === -1) {
            newFavorites.push(item);
        } else {
            newFavorites.splice(itemIndex, 1);
        }
        store.commit('SET_FAVORITES', newFavorites);
    }

    async componentDidUpdate () {
        const { toggleFavorite } = this;
        const { mainContents, bestContents } = this.state;
        const { life = [], food = [], trip = [], culture = [] } = mainContents;

        const $life = this.el.querySelector('#life');
        const $food = this.el.querySelector('#food');
        const $trip = this.el.querySelector('#trip');
        const $culture = this.el.querySelector('#culture');
        const $ranking = this.el.querySelector('#ranking');

        new MainContent($life, { items: life, title: '라이프', toggleFavorite });
        new MainContent($food, { items: food, title: '푸드', toggleFavorite });
        new MainContent($trip, { items: trip, title: '여행', toggleFavorite });
        new MainContent($culture, { items: culture, title: '문화', toggleFavorite });
        new RankingContent($ranking, { items: bestContents, toggleFavorite });
    }

    template () {
        return `
            ${ this.state.loading ? `
                    <section class="main__section">로딩중입니다</section>
                ` : `
                <section id="life" class="main__section"></section>
                <section id="food" class="main__section"></section>
                <section id="trip" class="main__section"></section>
                <section id="culture" class="main__section"></section>
                <section id="ranking" class="main__section"></section>
            `}
        `
    }

}
