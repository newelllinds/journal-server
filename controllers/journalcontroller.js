const express = require('express');
const router = express.Router();
const validateSession = require('../middleware/validate-session'); //imports the validate-session middleware and assigns it a variable called validateSession
const Journal = require('../db').import('../models/journal');


router.get('/practice', validateSession, function(req,res) 
{ //injects the validateSession variable as a middleware function in the '/practice' route in the journalcontroller. It will check to see if the incoming request has a token for this specific route.
    res.send("This is a practice route!");
});

/* *****************
*** JOURNAL CREATE ***
******************** */
router.post('/create', validateSession, (req, res) => {
    const journalEntry = {
        title: req.body.journal.title,
        date: req.body.journal.date,
        entry: req.body.journal.entry,
        owner: req.user.id
    }
    Journal.create(journalEntry)
        .then(journal => res.status(200).json(journal))
        .catch(err => res.status(500).json({ error: err }))
});

/* *****************
*** GET ALL ENTRIES ***
******************** */
router.get("/", (req, res) => {
    Journal.findAll()
        .then(journals => res.status(200).json(journals))
        .catch(err => res.status(500).json({ error: err }))
});

/* *****************
*** GET ENTRIES BY USER ***
******************** */
router.get("/mine", validateSession, (req, res) => {
    let userid = req.user.id
    Journal.findAll({
        where: { owner: userid } //looking at ID in the owner column in the database to find the journal entries that correlate wih that specific user ID we extrapolated from the validateSession middleware function
    })
        .then(journals => res.status(200).json(journals))
        .catch(err => res.status(500).json({ error: err }))
});

/* *****************
*** GET ENTRIES BY TITLE ***
******************** */
router.get('/:title', function (req, res) {
    let title = req.params.title;

    Journal.findAll({
        where: { title: title }
    })
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({ error: err }))
});


router.put("/update/:entryId", validateSession, function (req, res) { //put = update
    const updateJournalEntry = {
        title: req.body.journal.title,
        date: req.body.journal.date,
        entry: req.body.journal.entry,
    };

const query = { where: { id: req.params.entryId, owner: req.user.id } };

Journal.update(updateJournalEntry, query) //first argument contains an object holdigng the new value, second arguement tells sequelize where to place the new data if a match is found
    .then((journals) => res.status(200).json(journals))
    .catch((err) => res.status(500).json({ error: err }));
});

router.delete("/delete/:id", validateSession, function (req, res) {
    const query = { where: { id: req.params.id, owner: req.user.id } }; //params points to the URL

    Journal.destroy(query) //.destroy() is a sequelize method to remove an item from a database - query tells Sequelize what to look for in trying to find an item to delete. If nothing matches, nothing is done.
        .then(() => res.status(200).json({ message: "Journal Entry Removed" }))
        .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;

// router.get('/about', function(req, res) {
//     res.send("This is the challenge route!");
// });