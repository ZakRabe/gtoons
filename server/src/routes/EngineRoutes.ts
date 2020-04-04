import { EngineController } from '../controller/EngineController';
import { checkJwt } from '../middleware/checkJwt';

export const EngineRoutes = [
    {
        method: 'post',
        route: '/engine/initializeGame',
        controller: EngineController,
        action: 'initializeGame'
    },
    {
        method: 'post',
        route: '/engine/revealCard',
        controller: EngineController,
        action: 'revealCard'
    },
    {
        method: 'post',
        route: '/engine/removeCards',
        controller: EngineController,
        action: 'removeCards'
    },
    {
        method: 'post',
        route: '/engine/swapCard',
        controller: EngineController,
        action: 'swapCard'
    },
        // TURN ORDER
    {
        // Play 4 cards
        method: 'post',
        route: '/engine/phaseOne',
        controller: EngineController,
        action: 'phaseOne'
    },  
        // Reveal 4 cards
        // Remove up to 2 cards
    {
        // Play 3 cards
        method: 'post',
        route: '/engine/phaseTwo',
        controller: EngineController,
        action: 'phaseTwo'
    }
        // Reveal 2
        // Swap last card at the cost of 10 points
        // Reveal final card
        // Calculate winner
];
