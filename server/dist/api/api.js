"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = (app) => {
    // An api endpoint that returns a short list of items
    app.get('/api/cards', (req, res) => {
        var list = [
            "card1", "card2", "card3"
        ];
        res.json(list);
        console.log('Sent list of cards');
    });
};
//# sourceMappingURL=api.js.map