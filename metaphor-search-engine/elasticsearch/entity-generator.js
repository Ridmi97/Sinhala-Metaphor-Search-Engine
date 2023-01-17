'use strict'
const prettifiedData = require('../data/songs.json')
var fs = require('fs');

var singers_splits = [];
var lyricists_splits = [];
var composers_splits = [];
var albums_splits = [];
var source_domain_splits = [];
var target_domain_splits = [];
var titles_splits = [];

function collect_named_entities() {
    prettifiedData.forEach(song => {
        var singers = song.singers;
        if (singers) {
            singers.forEach(singer => {
                var splits = singer.trim().split(' ');
                splits.forEach(split => {
                    if (!singers_splits.includes(split.trim())) {
                        singers_splits.push(split.trim());
                    }
                });
            });
        }
        var lyricists = song.lyricist;
        if (lyricists) {
            var splits = lyricists.trim().split(' ');
            splits.forEach(split => {
                if (!lyricists_splits.includes(split.trim())) {
                    lyricists_splits.push(split.trim());
                }
            });
        }
        var composers = song.composer;
        if (composers) {
            var splits = composers.trim().split(' ');
            splits.forEach(split => {
                if (!composers_splits.includes(split.trim())) {
                    composers_splits.push(split.trim());
                }
            });
        }
        var albums = song.album;
        if (albums) {
            var splits = albums.trim().split(' ');
            splits.forEach(split => {
                if (!albums_splits.includes(split.trim())) {
                    albums_splits.push(split.trim());
                }
            });
        }
        var metaphors = song.metaphors;
        if (metaphors) {
            metaphors.forEach(metaphor => {
                var source_domain = metaphor.source_domain
                var splits = source_domain.trim().split(' ');
                splits.forEach(split => {
                    if (!source_domain_splits.includes(split.trim())) {
                        source_domain_splits.push(split.trim());
                    }
                });
            });
        }
        var metaphors = song.metaphors;
        if (metaphors) {
            metaphors.forEach(metaphor => {
                var target_domain = metaphor.target_domain
                var splits = target_domain.trim().split(' ');
                splits.forEach(split => {
                    if (!target_domain_splits.includes(split.trim())) {
                        target_domain_splits.push(split.trim());
                    }
                });
            });
        }
        var titles = song.title;
        if (titles) {
            var splits = titles.trim().split(' ');
            splits.forEach(split => {
                if (!titles_splits.includes(split.trim())) {
                    titles_splits.push(split.trim());
                }
            });
        }
    });

    var entities = {
        singers_splits,
        lyricists_splits,
        composers_splits,
        albums_splits,
        source_domain_splits,
        target_domain_splits,
        titles_splits
    }
    var jsonentities = JSON.stringify(entities);
    var fs = require('fs');
    fs.writeFile('../data/splited_entities.json', jsonentities, 'utf8', (error) => {console.log(error)});
}

collect_named_entities();