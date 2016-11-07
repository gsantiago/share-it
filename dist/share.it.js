(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ShareIt = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

require('object-assign-polyfill')

var ShareIt = module.exports = function(options) {
  var self = this;

  // Defaults
  var defaults = {
    specs: {
      width: 550,
      height: 350
    },
    target: '_blank',
    newTab: false
  };

  this.opts = Object.assign(defaults, options);

  // Constructor
  this.elements = [].slice.apply(document.querySelectorAll('[data-share]'));

  // Create a binded function for click handler
  this.clickHandlerBinded = this.clickHandler.bind(this)

  return {
    init: function() {
      self.clickElements();
    },
    destroy: function () {
      self.destroy();
    }
  };

};

ShareIt.prototype = {
  clickElements: function() {
    var self = this;

    self.elements.map(function(el) {
      el.addEventListener('click', self.clickHandlerBinded);
    });
  },
  clickHandler: function(e) {
    e.preventDefault();

    var url = this.getMediaUrl(e.target);

    window.open(encodeURI(url), this.opts.target, this.getSpecs(e.target));
  },
  destroy: function () {
    this.elements.map(function(el) {
      el.removeEventListener('click', this.clickHandlerBinded);
    }, this);
  },
  getSpecs: function(el) {
    var self = this;
    var specs = [];

    if (!self.opts.newTab) {
      Object.keys(self.opts.specs).map(function(spec) {
        var val = self.opts.specs[spec];

        if (el.hasAttribute('data-share-' + spec)) {
          specs.push(spec + '=' + el.getAttribute('data-share-' + spec));
        }
        else {
          specs.push(spec + '=' + val);
        }
      });
    }

    return specs.join(',');
  },
  getMediaUrl: function(el) {
    var url;
    var obj = {};
    var attrs = [].slice.call(el.attributes);
    var self = this;

    // Mapping the attributes of clicked element
    attrs.map(function(attr) {
      if (attr.name.toLowerCase().indexOf('data-share') >= 0) {
        // Mapping networks
        Object.keys(self.networks).map(function(net) {
          // Elememt has the attribute
          if (attr.name.toLowerCase().indexOf('data-share-' + net) >= 0) {
            var network = self.networks[net];

            // Set network url
            url = network.url;

            // Create object with etwork strings
            network.strings.map(function(s) {
              obj[s] = el.getAttribute('data-share-' + net + '-' + s) || '';
            });

            return;
          }
        });
      }
    });

    return this.supplant(url, obj);
  },
  supplant: function(url, o) {
    return url.replace(/{([^{}]*)}/g,function(a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  },
  networks: {
    'facebook': {
      url: 'http://www.facebook.com/sharer.php?s=100&p[url]={url}',
      strings: ['url']
    },
    'twitter': {
      url: 'https://twitter.com/share?url={url}&text={title}&via={via}&hashtags={hashtags}',
      strings: ['title', 'url', 'via', 'hashtags']
    },
    'google': {
      url: 'https://plus.google.com/share?url={url}',
      strings: ['url']
    },
    'pinterest': {
      url: 'https://pinterest.com/pin/create/bookmarklet/?media={img}&url={url}&is_video={is-video}&description={title}',
      strings: ['img', 'url', 'is-video', 'title']
    },
    'linkedin': {
      url: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={summary}&source={source}',
      strings: ['url', 'title', 'summary', 'source']
    },
    'buffer': {
      url: 'http://bufferapp.com/add?text={title}&url={url}',
      strings: ['title', 'url']
    },
    'tumblr': {
      url: 'https://www.tumblr.com/widgets/share/tool?canonicalUrl={url}&title={title}&caption={desc}',
      strings: ['url', 'title', 'desc']
    },
    'digg': {
      url: 'http://digg.com/submit?url={url}&title={title}',
      strings: ['url', 'title']
    },
    'su': {
      url: 'http://www.stumbleupon.com/submit?url={url}&title={title}',
      strings: ['url', 'title']
    },
    'delicious': {
      url: 'https://delicious.com/save?v=5&noui&jump=close&url={url}&title={title}',
      strings: ['url', 'title']
    },
    'reddit': {
      url: 'http://reddit.com/submit?url={url}&title={title}',
      strings: ['url', 'title']
    },
    'evernote': {
      url: 'http://www.evernote.com/clip.action?url={url}&title={title}',
      strings: ['url', 'title']
    },
    'wp': {
      url: 'http://wordpress.com/press-this.php?u={url}&t={title}&s={desc}&i={img}',
      strings: ['url', 'title', 'desc', 'img']
    },
    'pocket': {
      url: 'https://getpocket.com/save?url={url}&title={title}',
      strings: ['url', 'title']
    },
    'whatsapp': {
      url: 'whatsapp://send?text={text}',
      strings: ['text']
    }
  }
};

},{"object-assign-polyfill":2}],2:[function(require,module,exports){
/**
 * Object.assign() - Polyfill
 *
 * @ref https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */

'use strict';

(function() {
    if (typeof Object.assign != 'function') {
        (function () {
            Object.assign = function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var output = Object(target);
                for (var index = 1; index < arguments.length; index++) {
                    var source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (var nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }
})();

},{}]},{},[1])(1)
});