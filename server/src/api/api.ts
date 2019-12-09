import { Express, Request, Response } from 'express'

export const init = (app: Express) => {
  // An api endpoint that returns a short list of items
  app.get('/api/cards', (req: Request, res: Response) => {
    var list = [
      "card1", "card2", "card3"
    ];
    res.json(list);
    console.log('Sent list of cards');
  });


}
