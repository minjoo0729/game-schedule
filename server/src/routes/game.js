const express = require('express');
const GameModel = require('../models/game');

const router = express.Router();

class GameDB {
    static _inst_;
    static getInst = () => {
        if ( !GameDB._inst_ ) GameDB._inst_ = new GameDB();
        return GameDB._inst_;
    }

    constructor() { console.log("[Game-DB] DB Init Completed"); }

    selectItems = async ( count, search ) => {
        try {
            if (count === 0) return { success: true, data: [] };

            const findArguments = search === "" ? {} : {$or: [ { title: { "$regex": search } }, {date: { "$regex": search } }, {time: { "$regex": search } }, {score: { "$regex": search } }, { memo: { "$regex": search } } ]};
            const res = await GameModel.find(findArguments).sort({'createdAt': -1}).limit(count).exec();
            return { success: true, data: res };
        } catch (e) {
            console.log(`[Game-DB] Select Error: ${ e }`);
            return { success: false, data: `DB Error - ${ e }` };
        }
    }

    insertItem = async ( item ) => {
        const { title, date, time, score, memo } = item;
        try {
            const newItem = new GameModel({ title, date, time, score, memo });
            const res = await newItem.save();
            return true;
        } catch (e) {
            console.log(`[Game-DB] Insert Error: ${ e }`);
            return false;
        }
    }

    deleteItem = async ( id ) => {
        try {
            const ODeleteFiler = { _id: id };
            const res = await GameModel.deleteOne(ODeleteFiler);
            return true;
        } catch (e) {
            console.log(`[Game-DB] Delete Error: ${ e }`);
            return false;
        }
    }

    editItem = async ( id, item ) => {
        const { title, date, time, score, memo } = item;
        try {
            const OEditFiler = { _id: id };
            const res = await GameModel.updateOne(OEditFiler, { $set: { title: title, date: date, time: time, score: score, memo: memo } });
            return true;
        } catch (e) {
            console.log(`[Game-DB] Update Error: ${ e }`);
            return false;
        }
    }
}

const gameDBInst = GameDB.getInst();

router.get('/getGame', async (req, res) => {
    try {
        const requestCount = parseInt(req.query.count);
        const searchString = req.query.search;
        const dbRes = await gameDBInst.selectItems(requestCount, searchString);
        if (dbRes.success) return res.status(200).json(dbRes.data);
        else return res.status(500).json({ error: dbRes.data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/addGame', async (req, res) => {
   try {
       const { title, date, time, score, memo } = req.body;
       const addResult = await gameDBInst.insertItem({ title, date, time, score, memo });
       if (!addResult) return res.status(500).json({ error: dbRes.data })
       else return res.status(200).json({ isOK: true });
   } catch (e) {
       return res.status(500).json({ error: e });
   }
});

router.post('/deleteGame', async (req, res) => {
    try {
        const { id } = req.body;
        const deleteResult = await gameDBInst.deleteItem(id);
        if (!deleteResult) return res.status(500).json({ error: "No item deleted" })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

router.put('/editGame', async (req, res) => {
    try {
        const { id, title, date, time, score, memo } = req.body;
        const editResult = await gameDBInst.editItem(id, { title, date, time, score, memo });
        if (!editResult) return res.status(500).json({ error: "No item edited" })
        else return res.status(200).json({ isOK: true });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;