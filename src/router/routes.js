// src/router/routes.js
import StartPage from '../pages/StartPage.vue';
import TrainerSelectionPage from '../pages/TrainerSelectionPage.vue';
import TrainerCreationPage from '../pages/TrainerCreationPage.vue';
import TrainerInfoPage from '../pages/TrainerInfoPage.vue';
import PokemonCatchPage from '../pages/PokemonCatchPage.vue';

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
  }
];

export default routes;
