'use strict';

var nconf = module.parent.require('nconf');

function transformDomain(domain) {
    return domain.split("/").reverse()[0]
}

function searchURL(req) {
    return 'https://www.bing.com/search?ensearch=1&q=site%3A' + encodeURIComponent(transformDomain(nconf.get('url'))) + '%20' + encodeURIComponent(req.params.term || req.query.term || '');
}

module.exports = {
    "init": function(data, callback) {
        data.router.route('/search/:term?').all(function(req, res, next) {
            res.redirect(301, searchURL(req));
            res.end();
        });
        data.router.route('/api/search/:term?').all(function(req, res, next) {
            res.status(308).json({
                external: searchURL(req)
            });
            res.end();
        });

        callback();
    },
    "dummy": function(data, callback) {
        callback(new Error('search redirect failed'));
    }
};
