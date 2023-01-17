'use strict'

const express = require('express');
const router = express.Router();

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

var keywords = require("../../data/keywords.json");
var named_entities = require("../../data/splited_entities.json");

router.post('/', async function (req, res) {
    var query = req.body.query;
    var query_words = query.trim().split(" ");
    var removing_query_words = [];

    var size = 100;

    var field_type = '';

    var boost_of_singers = 1;
    var boost_of_title = 1;
    var boost_of_composer = 1;
    var boost_of_lyricist = 1;
    var boost_of_album = 1;
    var boost_of_year = 1;
    var boost_of_metaphor = 1;
    var boost_of_source_word = 1;
    var boost_of_target_word = 1;
    var sorting = 0;
    var range = 0;
    var sort_method = [];

    field_type = 'cross_fields';
    query_words.forEach(word => {
        word = word.replace('ගේ', '');
        word = word.replace('යන්ගේ', '');
        if (named_entities.singers_splits.includes(word)) {
            boost_of_singers = boost_of_singers + 1;
        }
        if (named_entities.lyricists_splits.includes(word)) {
            boost_of_lyricist = boost_of_lyricist + 1;
        }
        if (named_entities.composers_splits.includes(word)) {
            boost_of_composer = boost_of_composer + 1;
        }
        if (named_entities.albums_splits.includes(word)) {
            boost_of_album = boost_of_album + 1;
        }
        if (named_entities.source_domain_splits.includes(word)) {
            boost_of_source_word = boost_of_source_word + 1;
        }
        if (named_entities.target_domain_splits.includes(word)) {
            boost_of_target_word = boost_of_target_word + 1;
        }
        if (named_entities.titles_splits.includes(word)) {
            boost_of_title = boost_of_title + 1;
        }


        if (keywords.singers.includes(word)) {
            boost_of_singers = boost_of_singers + 1;
            removing_query_words.push(word);
        }
        if (keywords.lyricist.includes(word)) {
            boost_of_lyricist = boost_of_lyricist + 1;
            removing_query_words.push(word);
        }
        if (keywords.composer.includes(word)) {
            boost_of_composer = boost_of_composer + 1;
            removing_query_words.push(word);
        }
        if (keywords.album.includes(word)) {
            boost_of_album = boost_of_album + 1;
            removing_query_words.push(word);
        }
        if (keywords.year.includes(word)) {
            boost_of_year = boost_of_year + 1;
            removing_query_words.push(word);
        }
        if (keywords.metaphor.includes(word)) {
            boost_of_metaphor = boost_of_metaphor + 1;
            removing_query_words.push(word);
        }
        if (keywords.songs.includes(word)) {
            removing_query_words.push(word);
        }
        if (!isNaN(word)) {
            range = parseInt(word);
            removing_query_words.push(word);
        }
    });
        

    removing_query_words.forEach(word => {
        query = query.replace(word, '');
    });

    var result = await client.search({
        index: 'sinhala_songs',
        body: {
            size : size,
            _source: {
                includes: ["title", "singers", "lyricist", "composer", "album", "year","metaphors.target_domain","metaphors.source_domain"]
            },
            query: {
                multi_match: {
                    query: query.trim(),
                    fields: [`singers^${boost_of_singers}`, `title^${boost_of_title}`, `lyricist^${boost_of_lyricist}`,
                    `composer^${boost_of_composer}`, `album^${boost_of_album}`, `year^${boost_of_year}`, `metaphors.target_domain^${boost_of_target_word}`,
                    `metaphors.source_domain^${boost_of_source_word}`],
                    operator: "or",
                    type: field_type
                }
            }
        }
    });
    console.log(result.body)
    res.send({
        hits: result.body.hits.hits
    });
});

module.exports = router;