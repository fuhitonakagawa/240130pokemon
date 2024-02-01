import StartPage from '../pages/StartPage.vue';
import TrainerSelectionPage from '../pages/TrainerSelectionPage.vue';
import TrainerCreationPage from '../pages/TrainerCreationPage.vue';
import TrainerInfoPage from '../pages/TrainerInfoPage.vue';
import PokemonCatchPage from '../pages/PokemonCatchPage.vue';
import BattlePage from '../pages/BattlePage.vue';
import TemaBattle from '../pages/TeamBattle.vue';

const routes = [
  {
    path: '/',
    name: 'StartPage',
    component: StartPage
  },
  {
    path: '/trainer-selection',
    name: 'TrainerSelectionPage',
    component: TrainerSelectionPage
  },
  {
    path: '/trainer-creation',
    name: 'TrainerCreationPage',
    component: TrainerCreationPage
  },
  {
    path: '/trainer-info/:trainerName',
    name: 'TrainerInfoPage',
    component: TrainerInfoPage
  },
  {
    path: '/pokemon-catch/:trainerName',
    name: 'PokemonCatchPage',
    component: PokemonCatchPage
  },
  {
    path: '/battle/:trainerName/:pokemonName',
    name: 'BattlePage',
    component: BattlePage,
    props: true
  },
  {
    path: '/battle/:trainerName/team',
    name: 'TeamBattle',
    component: TemaBattle,
    props: true
  },
];

export default routes;
