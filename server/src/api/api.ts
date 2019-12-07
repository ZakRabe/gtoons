
export const init = (app: any) => {
  // An api endpoint that returns a short list of items
  app.get('/api/cards', (req: any, res: any) => {
    var list = [
      "card1", "card2", "card3"
    ];
    res.json(list);
    console.log('Sent list of cards');
  });
}

