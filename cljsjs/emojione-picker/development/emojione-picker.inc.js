(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EmojionePicker = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = React;

var _react2 = _interopRequireDefault(_react);

var _emojione = require('emojione');

var _emojione2 = _interopRequireDefault(_emojione);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Emoji = _react2.default.createClass({
  displayName: 'Emoji',

  propTypes: {
    onKeyUp: _react2.default.PropTypes.func,
    onClick: _react2.default.PropTypes.func,
    ariaLabel: _react2.default.PropTypes.string,
    name: _react2.default.PropTypes.string,
    shortname: _react2.default.PropTypes.string,
    title: _react2.default.PropTypes.string,
    role: _react2.default.PropTypes.string
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    // avoid rerendering the Emoji component if the shortname hasn't changed
    return nextProps.shortname !== this.props.shortname;
  },

  createMarkup: function createMarkup() {
    return { __html: _emojione2.default.shortnameToImage(this.props.shortname) };
  },

  render: function render() {
    return _react2.default.createElement('div', {
      onKeyUp: this.props.onKeyUp,
      onClick: this.props.onClick,
      tabIndex: '0',
      className: 'emoji',
      'aria-label': this.props.ariaLabel,
      title: this.props.name,
      role: this.props.role,
      dangerouslySetInnerHTML: this.createMarkup()
    });
  }
});

module.exports = Emoji;
},{"emojione":6,"react":undefined}],2:[function(require,module,exports){
"use strict";

var _react = React;

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modifier = _react2.default.createClass({
  displayName: "Modifier",

  propTypes: {
    onKeyUp: _react2.default.PropTypes.func,
    onClick: _react2.default.PropTypes.func,
    active: _react2.default.PropTypes.bool,
    hex: _react2.default.PropTypes.string
  },

  render: function render() {
    return _react2.default.createElement("a", {
      onKeyUp: this.props.onKeyUp,
      onClick: this.props.onClick,
      className: this.props.active ? "modifier active" : "modifier",
      style: { background: this.props.hex }
    });
  }
});

module.exports = Modifier;
},{"react":undefined}],3:[function(require,module,exports){
'use strict';

var _react = React;

var _react2 = _interopRequireDefault(_react);

var _modifier = require('./modifier');

var _modifier2 = _interopRequireDefault(_modifier);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modifiers = _react2.default.createClass({
  displayName: 'Modifiers',

  propTypes: {
    onChange: _react2.default.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      active: 0,
      modifiers: {
        0: '#FFDE5C',
        1: '#FFE1BB',
        2: '#FFD0A9',
        3: '#D7A579',
        4: '#B57D52',
        5: '#8B6858'
      }
    };
  },

  render: function render() {
    var _this = this;

    var list = [];
    var onChange = this.props.onChange;

    (0, _each2.default)(this.props.modifiers, function (hex, index) {
      list.push(_react2.default.createElement(
        'li',
        { key: index },
        _react2.default.createElement(_modifier2.default, { hex: hex, active: _this.props.active === index, onClick: function onClick() {
            onChange(index);
          } })
      ));
    });

    return _react2.default.createElement(
      'ol',
      { className: 'modifiers' },
      list
    );
  }
});

module.exports = Modifiers;
},{"./modifier":2,"lodash/each":101,"react":undefined}],4:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = React;

var _react2 = _interopRequireDefault(_react);

var _emoji = require('./emoji');

var _emoji2 = _interopRequireDefault(_emoji);

var _modifiers = require('./modifiers');

var _modifiers2 = _interopRequireDefault(_modifiers);

var _emoji3 = require('emojione/emoji.json');

var _emoji4 = _interopRequireDefault(_emoji3);

var _emojione = require('emojione');

var _emojione2 = _interopRequireDefault(_emojione);

var _store = require('store');

var _store2 = _interopRequireDefault(_store);

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _compact = require('lodash/compact');

var _compact2 = _interopRequireDefault(_compact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Picker = _react2.default.createClass({
  displayName: 'Picker',

  propTypes: {
    emojione: _react2.default.PropTypes.shape({
      imageType: _react2.default.PropTypes.string,
      sprites: _react2.default.PropTypes.bool,
      imagePathSVGSprites: _react2.default.PropTypes.string
    }),
    search: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.bool, _react2.default.PropTypes.string]),
    onChange: _react2.default.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      search: '',
      categories: {
        people: {
          title: 'People',
          emoji: 'smile'
        },
        nature: {
          title: 'Nature',
          emoji: 'hamster'
        },
        food: {
          title: 'Food & Drink',
          emoji: 'pizza'
        },
        activity: {
          title: 'Activity',
          emoji: 'soccer'
        },
        travel: {
          title: 'Travel & Places',
          emoji: 'earth_americas'
        },
        objects: {
          title: 'Objects',
          emoji: 'bulb'
        },
        symbols: {
          title: 'Symbols',
          emoji: 'clock9'
        },
        flags: {
          title: 'Flags',
          emoji: 'flag_gb'
        }
      }
    };
  },

  getInitialState: function getInitialState() {
    return {
      modifier: _store2.default.get('emoji-modifier') || 0,
      rendered: 0,
      category: false,
      term: this.props.search !== true ? this.props.search : ""
    };
  },

  componentWillMount: function componentWillMount() {
    (0, _each2.default)(this.props.emojione, function (value, key) {
      _emojione2.default[key] = value;
    });
    this.setState({ emojis: this.emojisFromStrategy(_emoji4.default) });
  },

  componentDidMount: function componentDidMount() {
    this.refs.grandlist.addEventListener('scroll', this.updateActiveCategory);
    this.updateActiveCategory();
  },

  componentWillUnmount: function componentWillUnmount() {
    this.refs.grandlist.removeEventListener('scroll', this.updateActiveCategory);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.search != nextProps.search) {
      this.setState({ term: this.props.search });
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var _this = this;

    if (this.state.rendered < Object.keys(this.props.categories).length) {
      setTimeout(function () {
        if (_this.isMounted()) {
          _this.setState({ rendered: _this.state.rendered + 1 });
        }
      }, 0);
    }
  },

  updateSearchTerm: function updateSearchTerm() {
    this.setState({ term: this.refs.search.value });
  },

  updateActiveModifier: function updateActiveModifier(modifier) {
    this.setState({ modifier: modifier });
    _store2.default.set('emoji-modifier', modifier);
  },

  emojisFromStrategy: function emojisFromStrategy(strategy) {
    var emojis = {};

    // categorise and nest emoji
    // sort ensures that modifiers appear unmodified keys
    var keys = Object.keys(strategy);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        var value = strategy[key];

        // skip unknown categories
        if (value.category !== 'modifier') {
          if (!emojis[value.category]) emojis[value.category] = {};
          var match = key.match(/(.*?)_tone(.*?)$/);

          if (match) {
            // this check is to stop the plugin from failing in the case that the
            // emoji strategy miscategorizes tones - which was the case here:
            // https://github.com/Ranks/emojione/pull/330
            var unmodifiedEmojiExists = !!emojis[value.category][match[1]];
            if (unmodifiedEmojiExists) {
              emojis[value.category][match[1]][match[2]] = value;
            }
          } else {
            emojis[value.category][key] = [value];
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return emojis;
  },

  updateActiveCategory: (0, _throttle2.default)(function () {
    var _this2 = this;

    var scrollTop = this.refs.grandlist.scrollTop;
    var padding = 10;
    var selected = 'people';

    if (this.state.category) {
      selected = this.state.category;
    }

    (0, _each2.default)(this.props.categories, function (details, category) {
      if (_this2.refs[category] && scrollTop >= _this2.refs[category].offsetTop - padding) {
        selected = category;
      }
    });

    if (this.state.category != selected) {
      this.setState({ category: selected });
    }
  }, 100),

  jumpToCategory: function jumpToCategory(name) {
    var offsetTop = this.refs[name].offsetTop;
    var padding = 5;
    this.refs.grandlist.scrollTop = offsetTop - padding;
  },

  renderCategories: function renderCategories() {
    var _this3 = this;

    var headers = [];
    var jumpToCategory = this.jumpToCategory;

    (0, _each2.default)(this.props.categories, function (details, key) {
      headers.push(_react2.default.createElement(
        'li',
        { key: key, className: _this3.state.category === key ? "active" : "" },
        _react2.default.createElement(_emoji2.default, {
          id: key,
          role: 'menuitem',
          'aria-label': key + ' category',
          shortname: ':' + details.emoji + ':',
          onClick: function onClick(e) {
            jumpToCategory(key);
          },
          onKeyUp: function onKeyUp(e) {
            e.preventDefault();
            if (e.which === 13 || e.which === 32) {
              jumpToCategory(key);
            }
          }
        })
      ));
    });

    return headers;
  },

  renderEmojis: function renderEmojis() {
    var _this4 = this;

    var sections = [];
    var _props = this.props;
    var onChange = _props.onChange;
    var search = _props.search;
    var _state = this.state;
    var term = _state.term;
    var modifier = _state.modifier;

    var i = 0;

    // render emoji in category sized chunks to help prevent UI lockup
    (0, _each2.default)(this.props.categories, function (category, key) {
      var list = _this4.state.emojis[key];
      if (list && Object.keys(list).length && i < _this4.state.rendered) {
        list = (0, _map2.default)(list, function (data) {
          var modified = modifier && data[modifier] ? data[modifier] : data[0];

          if (!search || !term || modified.keywords.some(function (keyword) {
            return new RegExp('^' + term).test(keyword);
          })) {

            return _react2.default.createElement(
              'li',
              { key: modified.unicode },
              _react2.default.createElement(_emoji2.default, _extends({}, modified, {
                ariaLabel: modified.name,
                role: 'option',
                onClick: function onClick(e) {
                  onChange(modified);
                },
                onKeyUp: function onKeyUp(e) {
                  e.preventDefault();
                  if (e.which === 13 || e.which === 32) {
                    onChange(modified);
                  }
                }
              }))
            );
          }
        });

        if ((0, _compact2.default)(list).length) {
          sections.push(_react2.default.createElement(
            'div',
            { className: 'emoji-category', key: key, ref: key },
            _react2.default.createElement(
              'h2',
              { ref: category.title, tabIndex: '0', className: 'emoji-category-header' },
              category.title
            ),
            _react2.default.createElement(
              'ul',
              { className: 'emoji-category-list' },
              list
            )
          ));
        }

        i++;
      }
    });

    return sections;
  },

  renderModifiers: function renderModifiers() {
    // we hide the color tone modifiers when searching to reduce clutter
    if (!this.state.term) {
      return _react2.default.createElement(_modifiers2.default, { active: this.state.modifier, onChange: this.updateActiveModifier });
    }
  },

  renderSearchInput: function renderSearchInput() {
    if (this.props.search === true) {
      return _react2.default.createElement(
        'div',
        { className: 'emoji-search-wrapper' },
        _react2.default.createElement('input', {
          className: 'emoji-search',
          type: 'search',
          placeholder: 'Search...',
          ref: 'search',
          onChange: this.updateSearchTerm,
          autoFocus: true
        })
      );
    }
  },

  setFocus: function setFocus(e) {
    if (e.target.id === "flags") {
      this.refs[this.state.category].children[0].focus();
    }
  },

  render: function render() {
    var classes = 'emoji-dialog';
    if (this.props.search === true) classes += ' with-search';

    return _react2.default.createElement(
      'div',
      { className: classes, role: 'dialog' },
      _react2.default.createElement(
        'header',
        { className: 'emoji-dialog-header', role: 'menu' },
        _react2.default.createElement(
          'ul',
          { onBlur: this.setFocus },
          this.renderCategories()
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'emoji-grandlist', ref: 'grandlist', role: 'listbox' },
        this.renderModifiers(),
        this.renderSearchInput(),
        this.renderEmojis()
      )
    );
  }
});

module.exports = Picker;
},{"./emoji":1,"./modifiers":3,"emojione":6,"emojione/emoji.json":5,"lodash/compact":99,"lodash/each":101,"lodash/map":118,"lodash/throttle":122,"react":undefined,"store":125}],5:[function(require,module,exports){
module.exports={"grinning":{"unicode":"1f600","unicode_alternates":"","name":"grinning face","shortname":":grinning:","category":"people","emoji_order":"1","aliases":[],"aliases_ascii":[],"keywords":["happy","smiley","emotion","emotion"]},"grimacing":{"unicode":"1f62c","unicode_alternates":"","name":"grimacing face","shortname":":grimacing:","category":"people","emoji_order":"2","aliases":[],"aliases_ascii":[],"keywords":["silly","smiley","emotion","emotion","selfie","selfie"]},"grin":{"unicode":"1f601","unicode_alternates":"","name":"grinning face with smiling eyes","shortname":":grin:","category":"people","emoji_order":"3","aliases":[],"aliases_ascii":[],"keywords":["happy","silly","smiley","emotion","emotion","good","good","selfie","selfie"]},"joy":{"unicode":"1f602","unicode_alternates":"","name":"face with tears of joy","shortname":":joy:","category":"people","emoji_order":"4","aliases":[],"aliases_ascii":[":')",":'-)"],"keywords":["happy","silly","smiley","cry","laugh","laugh","emotion","emotion","sarcastic","sarcastic"]},"smiley":{"unicode":"1f603","unicode_alternates":"","name":"smiling face with open mouth","shortname":":smiley:","category":"people","emoji_order":"5","aliases":[],"aliases_ascii":[":D",":-D","=D"],"keywords":["happy","smiley","emotion","emotion","good","good"]},"smile":{"unicode":"1f604","unicode_alternates":"","name":"smiling face with open mouth and smiling eyes","shortname":":smile:","category":"people","emoji_order":"6","aliases":[],"aliases_ascii":[],"keywords":["happy","smiley","emotion","emotion"]},"sweat_smile":{"unicode":"1f605","unicode_alternates":"","name":"smiling face with open mouth and cold sweat","shortname":":sweat_smile:","category":"people","emoji_order":"7","aliases":[],"aliases_ascii":["':)","':-)","'=)","':D","':-D","'=D"],"keywords":["smiley","workout","sweat","emotion","emotion"]},"laughing":{"unicode":"1f606","unicode_alternates":"","name":"smiling face with open mouth and tightly-closed eyes","shortname":":laughing:","category":"people","emoji_order":"8","aliases":[":satisfied:"],"aliases_ascii":[">:)",">;)",">:-)",">=)"],"keywords":["happy","smiley","laugh","laugh","emotion","emotion"]},"innocent":{"unicode":"1f607","unicode_alternates":"","name":"smiling face with halo","shortname":":innocent:","category":"people","emoji_order":"9","aliases":[],"aliases_ascii":["O:-)","0:-3","0:3","0:-)","0:)","0;^)","O:)","O;-)","O=)","0;-)","O:-3","O:3"],"keywords":["smiley","emotion","emotion"]},"wink":{"unicode":"1f609","unicode_alternates":"","name":"winking face","shortname":":wink:","category":"people","emoji_order":"10","aliases":[],"aliases_ascii":[";)",";-)","*-)","*)",";-]",";]",";D",";^)"],"keywords":["silly","smiley","emotion","emotion"]},"blush":{"unicode":"1f60a","unicode_alternates":"","name":"smiling face with smiling eyes","shortname":":blush:","category":"people","emoji_order":"11","aliases":[],"aliases_ascii":[],"keywords":["happy","smiley","emotion","emotion","good","good","beautiful","beautiful"]},"slight_smile":{"unicode":"1f642","unicode_alternates":"","name":"slightly smiling face","shortname":":slight_smile:","category":"people","emoji_order":"12","aliases":[":slightly_smiling_face:"],"aliases_ascii":[":)",":-)","=]","=)",":]"],"keywords":["happy","smiley"]},"upside_down":{"unicode":"1f643","unicode_alternates":"","name":"upside-down face","shortname":":upside_down:","category":"people","emoji_order":"13","aliases":[":upside_down_face:"],"aliases_ascii":[],"keywords":["silly","smiley","sarcastic","sarcastic"]},"relaxed":{"unicode":"263a","unicode_alternates":"263a-fe0f","name":"white smiling face","shortname":":relaxed:","category":"people","emoji_order":"14","aliases":[],"aliases_ascii":[],"keywords":["happy","smiley"]},"yum":{"unicode":"1f60b","unicode_alternates":"","name":"face savouring delicious food","shortname":":yum:","category":"people","emoji_order":"15","aliases":[],"aliases_ascii":[],"keywords":["happy","silly","smiley","emotion","emotion","sarcastic","sarcastic","good","good"]},"relieved":{"unicode":"1f60c","unicode_alternates":"","name":"relieved face","shortname":":relieved:","category":"people","emoji_order":"16","aliases":[],"aliases_ascii":[],"keywords":["smiley","emotion","emotion"]},"heart_eyes":{"unicode":"1f60d","unicode_alternates":"","name":"smiling face with heart-shaped eyes","shortname":":heart_eyes:","category":"people","emoji_order":"17","aliases":[],"aliases_ascii":[],"keywords":["happy","smiley","love","sex","heart eyes","emotion","emotion","beautiful","beautiful"]},"kissing_heart":{"unicode":"1f618","unicode_alternates":"","name":"face throwing a kiss","shortname":":kissing_heart:","category":"people","emoji_order":"18","aliases":[],"aliases_ascii":[":*",":-*","=*",":^*"],"keywords":["smiley","love","sexy"]},"kissing":{"unicode":"1f617","unicode_alternates":"","name":"kissing face","shortname":":kissing:","category":"people","emoji_order":"19","aliases":[],"aliases_ascii":[],"keywords":["smiley","sexy"]},"kissing_smiling_eyes":{"unicode":"1f619","unicode_alternates":"","name":"kissing face with smiling eyes","shortname":":kissing_smiling_eyes:","category":"people","emoji_order":"20","aliases":[],"aliases_ascii":[],"keywords":["smiley","sexy"]},"kissing_closed_eyes":{"unicode":"1f61a","unicode_alternates":"","name":"kissing face with closed eyes","shortname":":kissing_closed_eyes:","category":"people","emoji_order":"21","aliases":[],"aliases_ascii":[],"keywords":["smiley","sexy"]},"stuck_out_tongue_winking_eye":{"unicode":"1f61c","unicode_alternates":"","name":"face with stuck-out tongue and winking eye","shortname":":stuck_out_tongue_winking_eye:","category":"people","emoji_order":"22","aliases":[],"aliases_ascii":[">:P","X-P","x-p"],"keywords":["happy","smiley","emotion","emotion","parties","parties"]},"stuck_out_tongue_closed_eyes":{"unicode":"1f61d","unicode_alternates":"","name":"face with stuck-out tongue and tightly-closed eyes","shortname":":stuck_out_tongue_closed_eyes:","category":"people","emoji_order":"23","aliases":[],"aliases_ascii":[],"keywords":["happy","smiley","emotion","emotion"]},"stuck_out_tongue":{"unicode":"1f61b","unicode_alternates":"","name":"face with stuck-out tongue","shortname":":stuck_out_tongue:","category":"people","emoji_order":"24","aliases":[],"aliases_ascii":[":P",":-P","=P",":-p",":p","=p",":-\u00de",":\u00de",":\u00fe",":-\u00fe",":-b",":b","d:"],"keywords":["smiley","sex","emotion","emotion"]},"money_mouth":{"unicode":"1f911","unicode_alternates":"","name":"money-mouth face","shortname":":money_mouth:","category":"people","emoji_order":"25","aliases":[":money_mouth_face:"],"aliases_ascii":[],"keywords":["smiley","win","win","money","money","emotion","emotion","boys night","boys night"]},"nerd":{"unicode":"1f913","unicode_alternates":"","name":"nerd face","shortname":":nerd:","category":"people","emoji_order":"26","aliases":[":nerd_face:"],"aliases_ascii":[],"keywords":["smiley","glasses"]},"sunglasses":{"unicode":"1f60e","unicode_alternates":"","name":"smiling face with sunglasses","shortname":":sunglasses:","category":"people","emoji_order":"27","aliases":[],"aliases_ascii":["B-)","B)","8)","8-)","B-D","8-D"],"keywords":["silly","smiley","emojione","glasses","boys night","boys night"]},"hugging":{"unicode":"1f917","unicode_alternates":"","name":"hugging face","shortname":":hugging:","category":"people","emoji_order":"28","aliases":[":hugging_face:"],"aliases_ascii":[],"keywords":["smiley","hug","thank you"]},"smirk":{"unicode":"1f60f","unicode_alternates":"","name":"smirking face","shortname":":smirk:","category":"people","emoji_order":"29","aliases":[],"aliases_ascii":[],"keywords":["silly","smiley","sexy","sarcastic","sarcastic"]},"no_mouth":{"unicode":"1f636","unicode_alternates":"","name":"face without mouth","shortname":":no_mouth:","category":"people","emoji_order":"30","aliases":[],"aliases_ascii":[":-X",":X",":-#",":#","=X","=x",":x",":-x","=#"],"keywords":["mad","smiley","neutral","emotion","emotion"]},"neutral_face":{"unicode":"1f610","unicode_alternates":"","name":"neutral face","shortname":":neutral_face:","category":"people","emoji_order":"31","aliases":[],"aliases_ascii":[],"keywords":["mad","smiley","shrug","neutral","emotion","emotion"]},"expressionless":{"unicode":"1f611","unicode_alternates":"","name":"expressionless face","shortname":":expressionless:","category":"people","emoji_order":"32","aliases":[],"aliases_ascii":["-_-","-__-","-___-"],"keywords":["mad","smiley","neutral","emotion","emotion"]},"unamused":{"unicode":"1f612","unicode_alternates":"","name":"unamused face","shortname":":unamused:","category":"people","emoji_order":"33","aliases":[],"aliases_ascii":[],"keywords":["sad","mad","smiley","tired","emotion","emotion"]},"rolling_eyes":{"unicode":"1f644","unicode_alternates":"","name":"face with rolling eyes","shortname":":rolling_eyes:","category":"people","emoji_order":"34","aliases":[":face_with_rolling_eyes:"],"aliases_ascii":[],"keywords":["mad","smiley","rolling eyes","emotion","emotion","sarcastic","sarcastic"]},"thinking":{"unicode":"1f914","unicode_alternates":"","name":"thinking face","shortname":":thinking:","category":"people","emoji_order":"35","aliases":[":thinking_face:"],"aliases_ascii":[],"keywords":["smiley","thinking","boys night","boys night"]},"flushed":{"unicode":"1f633","unicode_alternates":"","name":"flushed face","shortname":":flushed:","category":"people","emoji_order":"36","aliases":[],"aliases_ascii":[":$","=$"],"keywords":["smiley","emotion","emotion","omg","omg"]},"disappointed":{"unicode":"1f61e","unicode_alternates":"","name":"disappointed face","shortname":":disappointed:","category":"people","emoji_order":"37","aliases":[],"aliases_ascii":[">:[",":-(",":(",":-[",":[","=("],"keywords":["sad","smiley","tired","emotion","emotion"]},"worried":{"unicode":"1f61f","unicode_alternates":"","name":"worried face","shortname":":worried:","category":"people","emoji_order":"38","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","emotion","emotion"]},"angry":{"unicode":"1f620","unicode_alternates":"","name":"angry face","shortname":":angry:","category":"people","emoji_order":"39","aliases":[],"aliases_ascii":[">:(",">:-(",":@"],"keywords":["mad","smiley","emotion","emotion"]},"rage":{"unicode":"1f621","unicode_alternates":"","name":"pouting face","shortname":":rage:","category":"people","emoji_order":"40","aliases":[],"aliases_ascii":[],"keywords":["mad","smiley","angry","emotion","emotion"]},"pensive":{"unicode":"1f614","unicode_alternates":"","name":"pensive face","shortname":":pensive:","category":"people","emoji_order":"41","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","emotion","emotion","rip","rip"]},"confused":{"unicode":"1f615","unicode_alternates":"","name":"confused face","shortname":":confused:","category":"people","emoji_order":"42","aliases":[],"aliases_ascii":[">:\\",">:\/",":-\/",":-.",":\/",":\\","=\/","=\\",":L","=L"],"keywords":["smiley","surprised","emotion","emotion"]},"slight_frown":{"unicode":"1f641","unicode_alternates":"","name":"slightly frowning face","shortname":":slight_frown:","category":"people","emoji_order":"43","aliases":[":slightly_frowning_face:"],"aliases_ascii":[],"keywords":["sad","smiley","emotion","emotion"]},"frowning2":{"unicode":"2639","unicode_alternates":"2639-fe0f","name":"white frowning face","shortname":":frowning2:","category":"people","emoji_order":"44","aliases":[":white_frowning_face:"],"aliases_ascii":[],"keywords":["sad","smiley","emotion","emotion"]},"persevere":{"unicode":"1f623","unicode_alternates":"","name":"persevering face","shortname":":persevere:","category":"people","emoji_order":"45","aliases":[],"aliases_ascii":[">.<"],"keywords":["sad","smiley","angry","emotion","emotion"]},"confounded":{"unicode":"1f616","unicode_alternates":"","name":"confounded face","shortname":":confounded:","category":"people","emoji_order":"46","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","angry","emotion","emotion"]},"tired_face":{"unicode":"1f62b","unicode_alternates":"","name":"tired face","shortname":":tired_face:","category":"people","emoji_order":"47","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","tired","emotion","emotion"]},"weary":{"unicode":"1f629","unicode_alternates":"","name":"weary face","shortname":":weary:","category":"people","emoji_order":"48","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","tired","stressed","emotion","emotion"]},"triumph":{"unicode":"1f624","unicode_alternates":"","name":"face with look of triumph","shortname":":triumph:","category":"people","emoji_order":"49","aliases":[],"aliases_ascii":[],"keywords":["mad","smiley","angry","emotion","emotion","steam","steam"]},"open_mouth":{"unicode":"1f62e","unicode_alternates":"","name":"face with open mouth","shortname":":open_mouth:","category":"people","emoji_order":"50","aliases":[],"aliases_ascii":[":-O",":O",":-o",":o","O_O",">:O"],"keywords":["smiley","surprised","wow","wow","emotion","emotion"]},"scream":{"unicode":"1f631","unicode_alternates":"","name":"face screaming in fear","shortname":":scream:","category":"people","emoji_order":"51","aliases":[],"aliases_ascii":[],"keywords":["smiley","surprised","wow","wow","emotion","emotion","omg","omg"]},"fearful":{"unicode":"1f628","unicode_alternates":"","name":"fearful face","shortname":":fearful:","category":"people","emoji_order":"52","aliases":[],"aliases_ascii":["D:"],"keywords":["smiley","surprised","emotion","emotion"]},"cold_sweat":{"unicode":"1f630","unicode_alternates":"","name":"face with open mouth and cold sweat","shortname":":cold_sweat:","category":"people","emoji_order":"53","aliases":[],"aliases_ascii":[],"keywords":["smiley","sweat","emotion","emotion"]},"hushed":{"unicode":"1f62f","unicode_alternates":"","name":"hushed face","shortname":":hushed:","category":"people","emoji_order":"54","aliases":[],"aliases_ascii":[],"keywords":["smiley","surprised","wow","wow"]},"frowning":{"unicode":"1f626","unicode_alternates":"","name":"frowning face with open mouth","shortname":":frowning:","category":"people","emoji_order":"55","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","surprised","emotion","emotion"]},"anguished":{"unicode":"1f627","unicode_alternates":"","name":"anguished face","shortname":":anguished:","category":"people","emoji_order":"56","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","surprised","emotion","emotion"]},"cry":{"unicode":"1f622","unicode_alternates":"","name":"crying face","shortname":":cry:","category":"people","emoji_order":"57","aliases":[],"aliases_ascii":[":'(",":'-(",";(",";-("],"keywords":["sad","smiley","cry","emotion","emotion","rip","rip","heartbreak","heartbreak"]},"disappointed_relieved":{"unicode":"1f625","unicode_alternates":"","name":"disappointed but relieved face","shortname":":disappointed_relieved:","category":"people","emoji_order":"58","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","stressed","sweat","cry","emotion","emotion"]},"sleepy":{"unicode":"1f62a","unicode_alternates":"","name":"sleepy face","shortname":":sleepy:","category":"people","emoji_order":"59","aliases":[],"aliases_ascii":[],"keywords":["smiley","sick","emotion","emotion"]},"sweat":{"unicode":"1f613","unicode_alternates":"","name":"face with cold sweat","shortname":":sweat:","category":"people","emoji_order":"60","aliases":[],"aliases_ascii":["':(","':-(","'=("],"keywords":["sad","smiley","stressed","sweat","emotion","emotion"]},"sob":{"unicode":"1f62d","unicode_alternates":"","name":"loudly crying face","shortname":":sob:","category":"people","emoji_order":"61","aliases":[],"aliases_ascii":[],"keywords":["sad","smiley","cry","emotion","emotion","heartbreak","heartbreak"]},"dizzy_face":{"unicode":"1f635","unicode_alternates":"","name":"dizzy face","shortname":":dizzy_face:","category":"people","emoji_order":"62","aliases":[],"aliases_ascii":["#-)","#)","%-)","%)","X)","X-)"],"keywords":["smiley","surprised","dead","wow","wow","emotion","emotion","omg","omg"]},"astonished":{"unicode":"1f632","unicode_alternates":"","name":"astonished face","shortname":":astonished:","category":"people","emoji_order":"63","aliases":[],"aliases_ascii":[],"keywords":["smiley","surprised","wow","wow","emotion","emotion","omg","omg"]},"zipper_mouth":{"unicode":"1f910","unicode_alternates":"","name":"zipper-mouth face","shortname":":zipper_mouth:","category":"people","emoji_order":"64","aliases":[":zipper_mouth_face:"],"aliases_ascii":[],"keywords":["mad","smiley"]},"mask":{"unicode":"1f637","unicode_alternates":"","name":"face with medical mask","shortname":":mask:","category":"people","emoji_order":"65","aliases":[],"aliases_ascii":[],"keywords":["smiley","dead","health","sick"]},"thermometer_face":{"unicode":"1f912","unicode_alternates":"","name":"face with thermometer","shortname":":thermometer_face:","category":"people","emoji_order":"66","aliases":[":face_with_thermometer:"],"aliases_ascii":[],"keywords":["smiley","health","sick","emotion","emotion"]},"head_bandage":{"unicode":"1f915","unicode_alternates":"","name":"face with head-bandage","shortname":":head_bandage:","category":"people","emoji_order":"67","aliases":[":face_with_head_bandage:"],"aliases_ascii":[],"keywords":["smiley","health","sick","emotion","emotion"]},"sleeping":{"unicode":"1f634","unicode_alternates":"","name":"sleeping face","shortname":":sleeping:","category":"people","emoji_order":"68","aliases":[],"aliases_ascii":[],"keywords":["smiley","tired","emotion","emotion","goodnight","goodnight"]},"zzz":{"unicode":"1f4a4","unicode_alternates":"","name":"sleeping symbol","shortname":":zzz:","category":"people","emoji_order":"69","aliases":[],"aliases_ascii":[],"keywords":["tired","goodnight","goodnight"]},"poop":{"unicode":"1f4a9","unicode_alternates":"","name":"pile of poo","shortname":":poop:","category":"people","emoji_order":"70","aliases":[":shit:",":hankey:",":poo:"],"aliases_ascii":[],"keywords":["bathroom","shit","sol","sol","diarrhea","diarrhea"]},"smiling_imp":{"unicode":"1f608","unicode_alternates":"","name":"smiling face with horns","shortname":":smiling_imp:","category":"people","emoji_order":"71","aliases":[],"aliases_ascii":[],"keywords":["silly","smiley","angry","monster","devil","devil","boys night","boys night"]},"imp":{"unicode":"1f47f","unicode_alternates":"","name":"imp","shortname":":imp:","category":"people","emoji_order":"72","aliases":[],"aliases_ascii":[],"keywords":["smiley","monster","devil","devil","wth","wth"]},"japanese_ogre":{"unicode":"1f479","unicode_alternates":"","name":"japanese ogre","shortname":":japanese_ogre:","category":"people","emoji_order":"73","aliases":[],"aliases_ascii":[],"keywords":["monster"]},"japanese_goblin":{"unicode":"1f47a","unicode_alternates":"","name":"japanese goblin","shortname":":japanese_goblin:","category":"people","emoji_order":"74","aliases":[],"aliases_ascii":[],"keywords":["angry","monster"]},"skull":{"unicode":"1f480","unicode_alternates":"","name":"skull","shortname":":skull:","category":"people","emoji_order":"75","aliases":[":skeleton:"],"aliases_ascii":[],"keywords":["dead","halloween","skull"]},"ghost":{"unicode":"1f47b","unicode_alternates":"","name":"ghost","shortname":":ghost:","category":"people","emoji_order":"76","aliases":[],"aliases_ascii":[],"keywords":["holidays","halloween","monster"]},"alien":{"unicode":"1f47d","unicode_alternates":"","name":"extraterrestrial alien","shortname":":alien:","category":"people","emoji_order":"77","aliases":[],"aliases_ascii":[],"keywords":["space","monster","alien","scientology","scientology"]},"robot":{"unicode":"1f916","unicode_alternates":"","name":"robot face","shortname":":robot:","category":"people","emoji_order":"78","aliases":[":robot_face:"],"aliases_ascii":[],"keywords":["monster","robot"]},"smiley_cat":{"unicode":"1f63a","unicode_alternates":"","name":"smiling cat face with open mouth","shortname":":smiley_cat:","category":"people","emoji_order":"79","aliases":[],"aliases_ascii":[],"keywords":["happy","cat","cat","animal","animal"]},"smile_cat":{"unicode":"1f638","unicode_alternates":"","name":"grinning cat face with smiling eyes","shortname":":smile_cat:","category":"people","emoji_order":"80","aliases":[],"aliases_ascii":[],"keywords":["happy","cat","cat","animal","animal"]},"joy_cat":{"unicode":"1f639","unicode_alternates":"","name":"cat face with tears of joy","shortname":":joy_cat:","category":"people","emoji_order":"81","aliases":[],"aliases_ascii":[],"keywords":["happy","silly","cry","laugh","laugh","cat","cat","animal","animal","sarcastic","sarcastic"]},"heart_eyes_cat":{"unicode":"1f63b","unicode_alternates":"","name":"smiling cat face with heart-shaped eyes","shortname":":heart_eyes_cat:","category":"people","emoji_order":"82","aliases":[],"aliases_ascii":[],"keywords":["heart eyes","cat","cat","animal","animal","beautiful","beautiful"]},"smirk_cat":{"unicode":"1f63c","unicode_alternates":"","name":"cat face with wry smile","shortname":":smirk_cat:","category":"people","emoji_order":"83","aliases":[],"aliases_ascii":[],"keywords":["cat","cat","animal","animal"]},"kissing_cat":{"unicode":"1f63d","unicode_alternates":"","name":"kissing cat face with closed eyes","shortname":":kissing_cat:","category":"people","emoji_order":"84","aliases":[],"aliases_ascii":[],"keywords":["cat","cat","animal","animal"]},"scream_cat":{"unicode":"1f640","unicode_alternates":"","name":"weary cat face","shortname":":scream_cat:","category":"people","emoji_order":"85","aliases":[],"aliases_ascii":[],"keywords":["cat","cat","animal","animal"]},"crying_cat_face":{"unicode":"1f63f","unicode_alternates":"","name":"crying cat face","shortname":":crying_cat_face:","category":"people","emoji_order":"86","aliases":[],"aliases_ascii":[],"keywords":["cry","cat","cat","animal","animal"]},"pouting_cat":{"unicode":"1f63e","unicode_alternates":"","name":"pouting cat face","shortname":":pouting_cat:","category":"people","emoji_order":"87","aliases":[],"aliases_ascii":[],"keywords":["cat","cat","animal","animal"]},"raised_hands":{"unicode":"1f64c","unicode_alternates":"","name":"person raising both hands in celebration","shortname":":raised_hands:","category":"people","emoji_order":"88","aliases":[],"aliases_ascii":[],"keywords":["body","hands","diversity","diversity","perfect","perfect","good","good","parties","parties"]},"clap":{"unicode":"1f44f","unicode_alternates":"","name":"clapping hands sign","shortname":":clap:","category":"people","emoji_order":"89","aliases":[],"aliases_ascii":[],"keywords":["body","hands","win","win","diversity","diversity","good","good","beautiful","beautiful"]},"wave":{"unicode":"1f44b","unicode_alternates":"","name":"waving hand sign","shortname":":wave:","category":"people","emoji_order":"90","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","diversity","diversity"]},"thumbsup":{"unicode":"1f44d","unicode_alternates":"","name":"thumbs up sign","shortname":":thumbsup:","category":"people","emoji_order":"91","aliases":[":+1:",":thumbup:"],"aliases_ascii":[],"keywords":["body","hands","hi","luck","thank you","diversity","diversity","perfect","perfect","good","good","beautiful","beautiful"]},"thumbsdown":{"unicode":"1f44e","unicode_alternates":"","name":"thumbs down sign","shortname":":thumbsdown:","category":"people","emoji_order":"92","aliases":[":-1:",":thumbdown:"],"aliases_ascii":[],"keywords":["body","hands","diversity","diversity"]},"punch":{"unicode":"1f44a","unicode_alternates":"","name":"fisted hand sign","shortname":":punch:","category":"people","emoji_order":"93","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","fist bump","diversity","diversity","boys night","boys night"]},"fist":{"unicode":"270a","unicode_alternates":"","name":"raised fist","shortname":":fist:","category":"people","emoji_order":"94","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","fist bump","diversity","diversity","condolence","condolence"]},"v":{"unicode":"270c","unicode_alternates":"270c-fe0f","name":"victory hand","shortname":":v:","category":"people","emoji_order":"95","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","thank you","peace","peace","diversity","diversity","girls night","girls night"]},"ok_hand":{"unicode":"1f44c","unicode_alternates":"","name":"ok hand sign","shortname":":ok_hand:","category":"people","emoji_order":"96","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","diversity","diversity","perfect","perfect","good","good","beautiful","beautiful"]},"raised_hand":{"unicode":"270b","unicode_alternates":"","name":"raised hand","shortname":":raised_hand:","category":"people","emoji_order":"97","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","diversity","diversity","girls night","girls night"]},"open_hands":{"unicode":"1f450","unicode_alternates":"","name":"open hands sign","shortname":":open_hands:","category":"people","emoji_order":"98","aliases":[],"aliases_ascii":[],"keywords":["body","hands","diversity","diversity","condolence","condolence"]},"muscle":{"unicode":"1f4aa","unicode_alternates":"","name":"flexed biceps","shortname":":muscle:","category":"people","emoji_order":"99","aliases":[],"aliases_ascii":[],"keywords":["body","hands","workout","flex","win","win","diversity","diversity","feminist","feminist","boys night","boys night"]},"pray":{"unicode":"1f64f","unicode_alternates":"","name":"person with folded hands","shortname":":pray:","category":"people","emoji_order":"100","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","luck","thank you","pray","pray","diversity","diversity","scientology","scientology"]},"point_up":{"unicode":"261d","unicode_alternates":"261d-fe0f","name":"white up pointing index","shortname":":point_up:","category":"people","emoji_order":"101","aliases":[],"aliases_ascii":[],"keywords":["body","hands","emojione","diversity","diversity"]},"point_up_2":{"unicode":"1f446","unicode_alternates":"","name":"white up pointing backhand index","shortname":":point_up_2:","category":"people","emoji_order":"102","aliases":[],"aliases_ascii":[],"keywords":["body","hands","diversity","diversity"]},"point_down":{"unicode":"1f447","unicode_alternates":"","name":"white down pointing backhand index","shortname":":point_down:","category":"people","emoji_order":"103","aliases":[],"aliases_ascii":[],"keywords":["body","hands","diversity","diversity"]},"point_left":{"unicode":"1f448","unicode_alternates":"","name":"white left pointing backhand index","shortname":":point_left:","category":"people","emoji_order":"104","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","diversity","diversity"]},"point_right":{"unicode":"1f449","unicode_alternates":"","name":"white right pointing backhand index","shortname":":point_right:","category":"people","emoji_order":"105","aliases":[],"aliases_ascii":[],"keywords":["body","hands","hi","diversity","diversity"]},"middle_finger":{"unicode":"1f595","unicode_alternates":"","name":"reversed hand with middle finger extended","shortname":":middle_finger:","category":"people","emoji_order":"106","aliases":[":reversed_hand_with_middle_finger_extended:"],"aliases_ascii":[],"keywords":["body","hands","middle finger","diversity","diversity"]},"hand_splayed":{"unicode":"1f590","unicode_alternates":"1f590-fe0f","name":"raised hand with fingers splayed","shortname":":hand_splayed:","category":"people","emoji_order":"107","aliases":[":raised_hand_with_fingers_splayed:"],"aliases_ascii":[],"keywords":["body","hands","hi","diversity","diversity"]},"metal":{"unicode":"1f918","unicode_alternates":"","name":"sign of the horns","shortname":":metal:","category":"people","emoji_order":"108","aliases":[":sign_of_the_horns:"],"aliases_ascii":[],"keywords":["body","hands","hi","diversity","diversity","boys night","boys night","parties","parties"]},"vulcan":{"unicode":"1f596","unicode_alternates":"","name":"raised hand with part between middle and ring fingers","shortname":":vulcan:","category":"people","emoji_order":"109","aliases":[":raised_hand_with_part_between_middle_and_ring_fingers:"],"aliases_ascii":[],"keywords":["body","hands","hi","diversity","diversity"]},"writing_hand":{"unicode":"270d","unicode_alternates":"270d-fe0f","name":"writing hand","shortname":":writing_hand:","category":"people","emoji_order":"110","aliases":[],"aliases_ascii":[],"keywords":["body","hands","write","diversity","diversity"]},"nail_care":{"unicode":"1f485","unicode_alternates":"","name":"nail polish","shortname":":nail_care:","category":"people","emoji_order":"111","aliases":[],"aliases_ascii":[],"keywords":["women","body","hands","nailpolish","diversity","diversity","girls night","girls night"]},"lips":{"unicode":"1f444","unicode_alternates":"","name":"mouth","shortname":":lips:","category":"people","emoji_order":"112","aliases":[],"aliases_ascii":[],"keywords":["women","body","sexy","lip"]},"tongue":{"unicode":"1f445","unicode_alternates":"","name":"tongue","shortname":":tongue:","category":"people","emoji_order":"113","aliases":[],"aliases_ascii":[],"keywords":["body","sexy","lip"]},"ear":{"unicode":"1f442","unicode_alternates":"","name":"ear","shortname":":ear:","category":"people","emoji_order":"114","aliases":[],"aliases_ascii":[],"keywords":["body","diversity","diversity"]},"nose":{"unicode":"1f443","unicode_alternates":"","name":"nose","shortname":":nose:","category":"people","emoji_order":"115","aliases":[],"aliases_ascii":[],"keywords":["body","diversity","diversity"]},"eye":{"unicode":"1f441","unicode_alternates":"1f441-fe0f","name":"eye","shortname":":eye:","category":"people","emoji_order":"116","aliases":[],"aliases_ascii":[],"keywords":["body","eyes"]},"eyes":{"unicode":"1f440","unicode_alternates":"","name":"eyes","shortname":":eyes:","category":"people","emoji_order":"117","aliases":[],"aliases_ascii":[],"keywords":["body","eyes"]},"bust_in_silhouette":{"unicode":"1f464","unicode_alternates":"","name":"bust in silhouette","shortname":":bust_in_silhouette:","category":"people","emoji_order":"118","aliases":[],"aliases_ascii":[],"keywords":["people"]},"busts_in_silhouette":{"unicode":"1f465","unicode_alternates":"","name":"busts in silhouette","shortname":":busts_in_silhouette:","category":"people","emoji_order":"119","aliases":[],"aliases_ascii":[],"keywords":["people"]},"speaking_head":{"unicode":"1f5e3","unicode_alternates":"1f5e3-fe0f","name":"speaking head in silhouette","shortname":":speaking_head:","category":"people","emoji_order":"120","aliases":[":speaking_head_in_silhouette:"],"aliases_ascii":[],"keywords":["people","talk"]},"baby":{"unicode":"1f476","unicode_alternates":"","name":"baby","shortname":":baby:","category":"people","emoji_order":"121","aliases":[],"aliases_ascii":[],"keywords":["people","baby","diversity","diversity"]},"boy":{"unicode":"1f466","unicode_alternates":"","name":"boy","shortname":":boy:","category":"people","emoji_order":"122","aliases":[],"aliases_ascii":[],"keywords":["people","baby","diversity","diversity"]},"girl":{"unicode":"1f467","unicode_alternates":"","name":"girl","shortname":":girl:","category":"people","emoji_order":"123","aliases":[],"aliases_ascii":[],"keywords":["people","women","baby","diversity","diversity"]},"man":{"unicode":"1f468","unicode_alternates":"","name":"man","shortname":":man:","category":"people","emoji_order":"124","aliases":[],"aliases_ascii":[],"keywords":["people","men","sex","diversity","diversity","selfie","selfie","boys night","boys night"]},"woman":{"unicode":"1f469","unicode_alternates":"","name":"woman","shortname":":woman:","category":"people","emoji_order":"125","aliases":[],"aliases_ascii":[],"keywords":["people","women","sex","diversity","diversity","feminist","feminist","selfie","selfie","girls night","girls night"]},"person_with_blond_hair":{"unicode":"1f471","unicode_alternates":"","name":"person with blond hair","shortname":":person_with_blond_hair:","category":"people","emoji_order":"126","aliases":[],"aliases_ascii":[],"keywords":["people","men","diversity","diversity"]},"older_man":{"unicode":"1f474","unicode_alternates":"","name":"older man","shortname":":older_man:","category":"people","emoji_order":"127","aliases":[],"aliases_ascii":[],"keywords":["people","men","old people","diversity","diversity"]},"older_woman":{"unicode":"1f475","unicode_alternates":"","name":"older woman","shortname":":older_woman:","category":"people","emoji_order":"128","aliases":[":grandma:"],"aliases_ascii":[],"keywords":["people","old people","diversity","diversity"]},"man_with_gua_pi_mao":{"unicode":"1f472","unicode_alternates":"","name":"man with gua pi mao","shortname":":man_with_gua_pi_mao:","category":"people","emoji_order":"129","aliases":[],"aliases_ascii":[],"keywords":["people","hat","men","diversity","diversity"]},"man_with_turban":{"unicode":"1f473","unicode_alternates":"","name":"man with turban","shortname":":man_with_turban:","category":"people","emoji_order":"130","aliases":[],"aliases_ascii":[],"keywords":["people","hat","diversity","diversity"]},"cop":{"unicode":"1f46e","unicode_alternates":"","name":"police officer","shortname":":cop:","category":"people","emoji_order":"131","aliases":[],"aliases_ascii":[],"keywords":["people","hat","men","diversity","diversity","job","job","police","police","911","911"]},"construction_worker":{"unicode":"1f477","unicode_alternates":"","name":"construction worker","shortname":":construction_worker:","category":"people","emoji_order":"132","aliases":[],"aliases_ascii":[],"keywords":["people","hat","men","diversity","diversity","job","job"]},"guardsman":{"unicode":"1f482","unicode_alternates":"","name":"guardsman","shortname":":guardsman:","category":"people","emoji_order":"133","aliases":[],"aliases_ascii":[],"keywords":["people","hat","men","diversity","diversity","job","job"]},"spy":{"unicode":"1f575","unicode_alternates":"1f575-fe0f","name":"sleuth or spy","shortname":":spy:","category":"people","emoji_order":"134","aliases":[":sleuth_or_spy:"],"aliases_ascii":[],"keywords":["people","hat","men","glasses","diversity","diversity","job","job"]},"santa":{"unicode":"1f385","unicode_alternates":"","name":"father christmas","shortname":":santa:","category":"people","emoji_order":"135","aliases":[],"aliases_ascii":[],"keywords":["people","hat","winter","holidays","christmas","diversity","diversity","santa","santa"]},"angel":{"unicode":"1f47c","unicode_alternates":"","name":"baby angel","shortname":":angel:","category":"people","emoji_order":"136","aliases":[],"aliases_ascii":[],"keywords":["people","diversity","diversity","omg","omg"]},"princess":{"unicode":"1f478","unicode_alternates":"","name":"princess","shortname":":princess:","category":"people","emoji_order":"137","aliases":[],"aliases_ascii":[],"keywords":["people","women","diversity","diversity","beautiful","beautiful","girls night","girls night"]},"bride_with_veil":{"unicode":"1f470","unicode_alternates":"","name":"bride with veil","shortname":":bride_with_veil:","category":"people","emoji_order":"138","aliases":[],"aliases_ascii":[],"keywords":["people","wedding","women","diversity","diversity"]},"walking":{"unicode":"1f6b6","unicode_alternates":"","name":"pedestrian","shortname":":walking:","category":"people","emoji_order":"139","aliases":[],"aliases_ascii":[],"keywords":["people","men","diversity","diversity"]},"runner":{"unicode":"1f3c3","unicode_alternates":"","name":"runner","shortname":":runner:","category":"people","emoji_order":"140","aliases":[],"aliases_ascii":[],"keywords":["people","men","diversity","diversity","boys night","boys night","run","run"]},"dancer":{"unicode":"1f483","unicode_alternates":"","name":"dancer","shortname":":dancer:","category":"people","emoji_order":"141","aliases":[],"aliases_ascii":[],"keywords":["people","women","sexy","diversity","diversity","girls night","girls night","dance","dance"]},"dancers":{"unicode":"1f46f","unicode_alternates":"","name":"woman with bunny ears","shortname":":dancers:","category":"people","emoji_order":"142","aliases":[],"aliases_ascii":[],"keywords":["people","women","sexy","girls night","girls night","boys night","boys night","parties","parties","dance","dance"]},"couple":{"unicode":"1f46b","unicode_alternates":"","name":"man and woman holding hands","shortname":":couple:","category":"people","emoji_order":"143","aliases":[],"aliases_ascii":[],"keywords":["people","sex","creationism","creationism"]},"two_men_holding_hands":{"unicode":"1f46c","unicode_alternates":"","name":"two men holding hands","shortname":":two_men_holding_hands:","category":"people","emoji_order":"144","aliases":[],"aliases_ascii":[],"keywords":["people","gay","men","sex","lgbt","lgbt"]},"two_women_holding_hands":{"unicode":"1f46d","unicode_alternates":"","name":"two women holding hands","shortname":":two_women_holding_hands:","category":"people","emoji_order":"145","aliases":[],"aliases_ascii":[],"keywords":["people","women","sex","lgbt","lgbt","lesbian","lesbian","girls night","girls night"]},"bow":{"unicode":"1f647","unicode_alternates":"","name":"person bowing deeply","shortname":":bow:","category":"people","emoji_order":"146","aliases":[],"aliases_ascii":[],"keywords":["people","pray","pray","diversity","diversity"]},"information_desk_person":{"unicode":"1f481","unicode_alternates":"","name":"information desk person","shortname":":information_desk_person:","category":"people","emoji_order":"147","aliases":[],"aliases_ascii":[],"keywords":["people","women","diversity","diversity"]},"no_good":{"unicode":"1f645","unicode_alternates":"","name":"face with no good gesture","shortname":":no_good:","category":"people","emoji_order":"148","aliases":[],"aliases_ascii":[],"keywords":["people","women","diversity","diversity","girls night","girls night"]},"ok_woman":{"unicode":"1f646","unicode_alternates":"","name":"face with ok gesture","shortname":":ok_woman:","category":"people","emoji_order":"149","aliases":[],"aliases_ascii":["*\\0\/*","\\0\/","*\\O\/*","\\O\/"],"keywords":["people","women","diversity","diversity"]},"raising_hand":{"unicode":"1f64b","unicode_alternates":"","name":"happy person raising one hand","shortname":":raising_hand:","category":"people","emoji_order":"150","aliases":[],"aliases_ascii":[],"keywords":["people","women","diversity","diversity"]},"person_with_pouting_face":{"unicode":"1f64e","unicode_alternates":"","name":"person with pouting face","shortname":":person_with_pouting_face:","category":"people","emoji_order":"151","aliases":[],"aliases_ascii":[],"keywords":["people","women","diversity","diversity"]},"person_frowning":{"unicode":"1f64d","unicode_alternates":"","name":"person frowning","shortname":":person_frowning:","category":"people","emoji_order":"152","aliases":[],"aliases_ascii":[],"keywords":["people","women","diversity","diversity"]},"haircut":{"unicode":"1f487","unicode_alternates":"","name":"haircut","shortname":":haircut:","category":"people","emoji_order":"153","aliases":[],"aliases_ascii":[],"keywords":["people","women","diversity","diversity"]},"massage":{"unicode":"1f486","unicode_alternates":"","name":"face massage","shortname":":massage:","category":"people","emoji_order":"154","aliases":[],"aliases_ascii":[],"keywords":["people","women","diversity","diversity"]},"couple_with_heart":{"unicode":"1f491","unicode_alternates":"","name":"couple with heart","shortname":":couple_with_heart:","category":"people","emoji_order":"155","aliases":[],"aliases_ascii":[],"keywords":["people","love","sex"]},"couple_ww":{"unicode":"1f469-2764-1f469","unicode_alternates":"1f469-200d-2764-fe0f-200d-1f469","name":"couple (woman,woman)","shortname":":couple_ww:","category":"people","emoji_order":"156","aliases":[":couple_with_heart_ww:"],"aliases_ascii":[],"keywords":["people","women","love","sex","lgbt","lgbt"]},"couple_mm":{"unicode":"1f468-2764-1f468","unicode_alternates":"1f468-200d-2764-fe0f-200d-1f468","name":"couple (man,man)","shortname":":couple_mm:","category":"people","emoji_order":"157","aliases":[":couple_with_heart_mm:"],"aliases_ascii":[],"keywords":["people","gay","men","love","sex","lgbt","lgbt"]},"couplekiss":{"unicode":"1f48f","unicode_alternates":"","name":"kiss","shortname":":couplekiss:","category":"people","emoji_order":"158","aliases":[],"aliases_ascii":[],"keywords":["people","love","sex"]},"kiss_ww":{"unicode":"1f469-2764-1f48b-1f469","unicode_alternates":"1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","name":"kiss (woman,woman)","shortname":":kiss_ww:","category":"people","emoji_order":"159","aliases":[":couplekiss_ww:"],"aliases_ascii":[],"keywords":["people","women","love","sex","lgbt","lgbt","lesbian","lesbian"]},"kiss_mm":{"unicode":"1f468-2764-1f48b-1f468","unicode_alternates":"1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","name":"kiss (man,man)","shortname":":kiss_mm:","category":"people","emoji_order":"160","aliases":[":couplekiss_mm:"],"aliases_ascii":[],"keywords":["people","gay","men","love","sex","lgbt","lgbt"]},"family":{"unicode":"1f46a","unicode_alternates":"","name":"family","shortname":":family:","category":"people","emoji_order":"161","aliases":[],"aliases_ascii":[],"keywords":["people","family","baby"]},"family_mwg":{"unicode":"1f468-1f469-1f467","unicode_alternates":"1f468-200d-1f469-200d-1f467","name":"family (man,woman,girl)","shortname":":family_mwg:","category":"people","emoji_order":"162","aliases":[],"aliases_ascii":[],"keywords":["people","family","baby"]},"family_mwgb":{"unicode":"1f468-1f469-1f467-1f466","unicode_alternates":"1f468-200d-1f469-200d-1f467-200d-1f466","name":"family (man,woman,girl,boy)","shortname":":family_mwgb:","category":"people","emoji_order":"163","aliases":[],"aliases_ascii":[],"keywords":["people","family","baby"]},"family_mwbb":{"unicode":"1f468-1f469-1f466-1f466","unicode_alternates":"1f468-200d-1f469-200d-1f466-200d-1f466","name":"family (man,woman,boy,boy)","shortname":":family_mwbb:","category":"people","emoji_order":"164","aliases":[],"aliases_ascii":[],"keywords":["people","family","baby"]},"family_mwgg":{"unicode":"1f468-1f469-1f467-1f467","unicode_alternates":"1f468-200d-1f469-200d-1f467-200d-1f467","name":"family (man,woman,girl,girl)","shortname":":family_mwgg:","category":"people","emoji_order":"165","aliases":[],"aliases_ascii":[],"keywords":["people","family","baby"]},"family_wwb":{"unicode":"1f469-1f469-1f466","unicode_alternates":"1f469-200d-1f469-200d-1f466","name":"family (woman,woman,boy)","shortname":":family_wwb:","category":"people","emoji_order":"166","aliases":[],"aliases_ascii":[],"keywords":["people","family","women","baby","lgbt","lgbt","lesbian","lesbian"]},"family_wwg":{"unicode":"1f469-1f469-1f467","unicode_alternates":"1f469-200d-1f469-200d-1f467","name":"family (woman,woman,girl)","shortname":":family_wwg:","category":"people","emoji_order":"167","aliases":[],"aliases_ascii":[],"keywords":["people","family","women","baby","lgbt","lgbt","lesbian","lesbian"]},"family_wwgb":{"unicode":"1f469-1f469-1f467-1f466","unicode_alternates":"1f469-200d-1f469-200d-1f467-200d-1f466","name":"family (woman,woman,girl,boy)","shortname":":family_wwgb:","category":"people","emoji_order":"168","aliases":[],"aliases_ascii":[],"keywords":["people","family","women","baby","lgbt","lgbt","lesbian","lesbian"]},"family_wwbb":{"unicode":"1f469-1f469-1f466-1f466","unicode_alternates":"1f469-200d-1f469-200d-1f466-200d-1f466","name":"family (woman,woman,boy,boy)","shortname":":family_wwbb:","category":"people","emoji_order":"169","aliases":[],"aliases_ascii":[],"keywords":["people","family","women","baby","lgbt","lgbt","lesbian","lesbian"]},"family_wwgg":{"unicode":"1f469-1f469-1f467-1f467","unicode_alternates":"1f469-200d-1f469-200d-1f467-200d-1f467","name":"family (woman,woman,girl,girl)","shortname":":family_wwgg:","category":"people","emoji_order":"170","aliases":[],"aliases_ascii":[],"keywords":["people","family","women","baby","lgbt","lgbt","lesbian","lesbian"]},"family_mmb":{"unicode":"1f468-1f468-1f466","unicode_alternates":"1f468-200d-1f468-200d-1f466","name":"family (man,man,boy)","shortname":":family_mmb:","category":"people","emoji_order":"171","aliases":[],"aliases_ascii":[],"keywords":["people","gay","family","men","baby","lgbt","lgbt"]},"family_mmg":{"unicode":"1f468-1f468-1f467","unicode_alternates":"1f468-200d-1f468-200d-1f467","name":"family (man,man,girl)","shortname":":family_mmg:","category":"people","emoji_order":"172","aliases":[],"aliases_ascii":[],"keywords":["people","gay","family","men","baby","lgbt","lgbt"]},"family_mmgb":{"unicode":"1f468-1f468-1f467-1f466","unicode_alternates":"1f468-200d-1f468-200d-1f467-200d-1f466","name":"family (man,man,girl,boy)","shortname":":family_mmgb:","category":"people","emoji_order":"173","aliases":[],"aliases_ascii":[],"keywords":["people","gay","family","men","baby","lgbt","lgbt"]},"family_mmbb":{"unicode":"1f468-1f468-1f466-1f466","unicode_alternates":"1f468-200d-1f468-200d-1f466-200d-1f466","name":"family (man,man,boy,boy)","shortname":":family_mmbb:","category":"people","emoji_order":"174","aliases":[],"aliases_ascii":[],"keywords":["people","gay","family","men","baby","lgbt","lgbt"]},"family_mmgg":{"unicode":"1f468-1f468-1f467-1f467","unicode_alternates":"1f468-200d-1f468-200d-1f467-200d-1f467","name":"family (man,man,girl,girl)","shortname":":family_mmgg:","category":"people","emoji_order":"175","aliases":[],"aliases_ascii":[],"keywords":["people","gay","family","men","baby","lgbt","lgbt"]},"womans_clothes":{"unicode":"1f45a","unicode_alternates":"","name":"womans clothes","shortname":":womans_clothes:","category":"people","emoji_order":"176","aliases":[],"aliases_ascii":[],"keywords":["women","fashion"]},"shirt":{"unicode":"1f455","unicode_alternates":"","name":"t-shirt","shortname":":shirt:","category":"people","emoji_order":"177","aliases":[],"aliases_ascii":[],"keywords":["fashion"]},"jeans":{"unicode":"1f456","unicode_alternates":"","name":"jeans","shortname":":jeans:","category":"people","emoji_order":"178","aliases":[],"aliases_ascii":[],"keywords":["fashion"]},"necktie":{"unicode":"1f454","unicode_alternates":"","name":"necktie","shortname":":necktie:","category":"people","emoji_order":"179","aliases":[],"aliases_ascii":[],"keywords":["fashion"]},"dress":{"unicode":"1f457","unicode_alternates":"","name":"dress","shortname":":dress:","category":"people","emoji_order":"180","aliases":[],"aliases_ascii":[],"keywords":["women","fashion","sexy","girls night","girls night"]},"bikini":{"unicode":"1f459","unicode_alternates":"","name":"bikini","shortname":":bikini:","category":"people","emoji_order":"181","aliases":[],"aliases_ascii":[],"keywords":["women","fashion","sexy","vacation","tropical","swim"]},"kimono":{"unicode":"1f458","unicode_alternates":"","name":"kimono","shortname":":kimono:","category":"people","emoji_order":"182","aliases":[],"aliases_ascii":[],"keywords":["fashion"]},"lipstick":{"unicode":"1f484","unicode_alternates":"","name":"lipstick","shortname":":lipstick:","category":"people","emoji_order":"183","aliases":[],"aliases_ascii":[],"keywords":["object","women","fashion","sexy","lip"]},"kiss":{"unicode":"1f48b","unicode_alternates":"","name":"kiss mark","shortname":":kiss:","category":"people","emoji_order":"184","aliases":[],"aliases_ascii":[],"keywords":["women","love","sexy","lip","beautiful","beautiful","girls night","girls night"]},"footprints":{"unicode":"1f463","unicode_alternates":"","name":"footprints","shortname":":footprints:","category":"people","emoji_order":"185","aliases":[],"aliases_ascii":[],"keywords":[]},"high_heel":{"unicode":"1f460","unicode_alternates":"","name":"high-heeled shoe","shortname":":high_heel:","category":"people","emoji_order":"186","aliases":[],"aliases_ascii":[],"keywords":["women","fashion","shoe","sexy","accessories","girls night","girls night"]},"sandal":{"unicode":"1f461","unicode_alternates":"","name":"womans sandal","shortname":":sandal:","category":"people","emoji_order":"187","aliases":[],"aliases_ascii":[],"keywords":["fashion","shoe","accessories"]},"boot":{"unicode":"1f462","unicode_alternates":"","name":"womans boots","shortname":":boot:","category":"people","emoji_order":"188","aliases":[],"aliases_ascii":[],"keywords":["women","fashion","shoe","sexy","accessories"]},"mans_shoe":{"unicode":"1f45e","unicode_alternates":"","name":"mans shoe","shortname":":mans_shoe:","category":"people","emoji_order":"189","aliases":[],"aliases_ascii":[],"keywords":["fashion","shoe","accessories"]},"athletic_shoe":{"unicode":"1f45f","unicode_alternates":"","name":"athletic shoe","shortname":":athletic_shoe:","category":"people","emoji_order":"190","aliases":[],"aliases_ascii":[],"keywords":["fashion","shoe","accessories","boys night","boys night"]},"womans_hat":{"unicode":"1f452","unicode_alternates":"","name":"womans hat","shortname":":womans_hat:","category":"people","emoji_order":"191","aliases":[],"aliases_ascii":[],"keywords":["women","fashion","accessories"]},"tophat":{"unicode":"1f3a9","unicode_alternates":"","name":"top hat","shortname":":tophat:","category":"people","emoji_order":"192","aliases":[],"aliases_ascii":[],"keywords":["hat","fashion","accessories"]},"helmet_with_cross":{"unicode":"26d1","unicode_alternates":"26d1-fe0f","name":"helmet with white cross","shortname":":helmet_with_cross:","category":"people","emoji_order":"193","aliases":[":helmet_with_white_cross:"],"aliases_ascii":[],"keywords":["object","hat","accessories","job","job"]},"mortar_board":{"unicode":"1f393","unicode_alternates":"","name":"graduation cap","shortname":":mortar_board:","category":"people","emoji_order":"194","aliases":[],"aliases_ascii":[],"keywords":["hat","office","accessories"]},"crown":{"unicode":"1f451","unicode_alternates":"","name":"crown","shortname":":crown:","category":"people","emoji_order":"195","aliases":[],"aliases_ascii":[],"keywords":["object","gem","accessories"]},"school_satchel":{"unicode":"1f392","unicode_alternates":"","name":"school satchel","shortname":":school_satchel:","category":"people","emoji_order":"196","aliases":[],"aliases_ascii":[],"keywords":["bag","fashion","office","vacation","accessories"]},"pouch":{"unicode":"1f45d","unicode_alternates":"","name":"pouch","shortname":":pouch:","category":"people","emoji_order":"197","aliases":[],"aliases_ascii":[],"keywords":["bag","women","fashion","accessories"]},"purse":{"unicode":"1f45b","unicode_alternates":"","name":"purse","shortname":":purse:","category":"people","emoji_order":"198","aliases":[],"aliases_ascii":[],"keywords":["bag","women","fashion","accessories","money","money"]},"handbag":{"unicode":"1f45c","unicode_alternates":"","name":"handbag","shortname":":handbag:","category":"people","emoji_order":"199","aliases":[],"aliases_ascii":[],"keywords":["bag","women","fashion","vacation","accessories"]},"briefcase":{"unicode":"1f4bc","unicode_alternates":"","name":"briefcase","shortname":":briefcase:","category":"people","emoji_order":"200","aliases":[],"aliases_ascii":[],"keywords":["bag","work","accessories","nutcase","nutcase","job","job"]},"eyeglasses":{"unicode":"1f453","unicode_alternates":"","name":"eyeglasses","shortname":":eyeglasses:","category":"people","emoji_order":"201","aliases":[],"aliases_ascii":[],"keywords":["fashion","glasses","accessories"]},"dark_sunglasses":{"unicode":"1f576","unicode_alternates":"1f576-fe0f","name":"dark sunglasses","shortname":":dark_sunglasses:","category":"people","emoji_order":"202","aliases":[],"aliases_ascii":[],"keywords":["fashion","glasses","accessories"]},"ring":{"unicode":"1f48d","unicode_alternates":"","name":"ring","shortname":":ring:","category":"people","emoji_order":"203","aliases":[],"aliases_ascii":[],"keywords":["wedding","object","fashion","gem","accessories"]},"closed_umbrella":{"unicode":"1f302","unicode_alternates":"","name":"closed umbrella","shortname":":closed_umbrella:","category":"people","emoji_order":"204","aliases":[],"aliases_ascii":[],"keywords":["object","sky","rain","accessories"]},"dog":{"unicode":"1f436","unicode_alternates":"","name":"dog face","shortname":":dog:","category":"nature","emoji_order":"205","aliases":[],"aliases_ascii":[],"keywords":["dog","dog","pug","pug","animal","animal"]},"cat":{"unicode":"1f431","unicode_alternates":"","name":"cat face","shortname":":cat:","category":"nature","emoji_order":"206","aliases":[],"aliases_ascii":[],"keywords":["halloween","vagina","cat","cat","animal","animal"]},"mouse":{"unicode":"1f42d","unicode_alternates":"","name":"mouse face","shortname":":mouse:","category":"nature","emoji_order":"207","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"hamster":{"unicode":"1f439","unicode_alternates":"","name":"hamster face","shortname":":hamster:","category":"nature","emoji_order":"208","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"rabbit":{"unicode":"1f430","unicode_alternates":"","name":"rabbit face","shortname":":rabbit:","category":"nature","emoji_order":"209","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"bear":{"unicode":"1f43b","unicode_alternates":"","name":"bear face","shortname":":bear:","category":"nature","emoji_order":"210","aliases":[],"aliases_ascii":[],"keywords":["wildlife","roar","animal","animal"]},"panda_face":{"unicode":"1f43c","unicode_alternates":"","name":"panda face","shortname":":panda_face:","category":"nature","emoji_order":"211","aliases":[],"aliases_ascii":[],"keywords":["wildlife","roar","animal","animal"]},"koala":{"unicode":"1f428","unicode_alternates":"","name":"koala","shortname":":koala:","category":"nature","emoji_order":"212","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"tiger":{"unicode":"1f42f","unicode_alternates":"","name":"tiger face","shortname":":tiger:","category":"nature","emoji_order":"213","aliases":[],"aliases_ascii":[],"keywords":["wildlife","roar","cat","cat","animal","animal"]},"lion_face":{"unicode":"1f981","unicode_alternates":"","name":"lion face","shortname":":lion_face:","category":"nature","emoji_order":"214","aliases":[":lion:"],"aliases_ascii":[],"keywords":["wildlife","roar","cat","cat","animal","animal"]},"cow":{"unicode":"1f42e","unicode_alternates":"","name":"cow face","shortname":":cow:","category":"nature","emoji_order":"215","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"pig":{"unicode":"1f437","unicode_alternates":"","name":"pig face","shortname":":pig:","category":"nature","emoji_order":"216","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"pig_nose":{"unicode":"1f43d","unicode_alternates":"","name":"pig nose","shortname":":pig_nose:","category":"nature","emoji_order":"217","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"frog":{"unicode":"1f438","unicode_alternates":"","name":"frog face","shortname":":frog:","category":"nature","emoji_order":"218","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"octopus":{"unicode":"1f419","unicode_alternates":"","name":"octopus","shortname":":octopus:","category":"nature","emoji_order":"219","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"monkey_face":{"unicode":"1f435","unicode_alternates":"","name":"monkey face","shortname":":monkey_face:","category":"nature","emoji_order":"220","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"see_no_evil":{"unicode":"1f648","unicode_alternates":"","name":"see-no-evil monkey","shortname":":see_no_evil:","category":"nature","emoji_order":"221","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"hear_no_evil":{"unicode":"1f649","unicode_alternates":"","name":"hear-no-evil monkey","shortname":":hear_no_evil:","category":"nature","emoji_order":"222","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"speak_no_evil":{"unicode":"1f64a","unicode_alternates":"","name":"speak-no-evil monkey","shortname":":speak_no_evil:","category":"nature","emoji_order":"223","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"monkey":{"unicode":"1f412","unicode_alternates":"","name":"monkey","shortname":":monkey:","category":"nature","emoji_order":"224","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"chicken":{"unicode":"1f414","unicode_alternates":"","name":"chicken","shortname":":chicken:","category":"nature","emoji_order":"225","aliases":[],"aliases_ascii":[],"keywords":["animal","animal","chicken","chicken"]},"penguin":{"unicode":"1f427","unicode_alternates":"","name":"penguin","shortname":":penguin:","category":"nature","emoji_order":"226","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"bird":{"unicode":"1f426","unicode_alternates":"","name":"bird","shortname":":bird:","category":"nature","emoji_order":"227","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"baby_chick":{"unicode":"1f424","unicode_alternates":"","name":"baby chick","shortname":":baby_chick:","category":"nature","emoji_order":"228","aliases":[],"aliases_ascii":[],"keywords":["animal","animal","chicken","chicken"]},"hatching_chick":{"unicode":"1f423","unicode_alternates":"","name":"hatching chick","shortname":":hatching_chick:","category":"nature","emoji_order":"229","aliases":[],"aliases_ascii":[],"keywords":["animal","animal","chicken","chicken"]},"hatched_chick":{"unicode":"1f425","unicode_alternates":"","name":"front-facing baby chick","shortname":":hatched_chick:","category":"nature","emoji_order":"230","aliases":[],"aliases_ascii":[],"keywords":["animal","animal","chicken","chicken"]},"wolf":{"unicode":"1f43a","unicode_alternates":"","name":"wolf face","shortname":":wolf:","category":"nature","emoji_order":"231","aliases":[],"aliases_ascii":[],"keywords":["wildlife","roar","animal","animal"]},"boar":{"unicode":"1f417","unicode_alternates":"","name":"boar","shortname":":boar:","category":"nature","emoji_order":"232","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"horse":{"unicode":"1f434","unicode_alternates":"","name":"horse face","shortname":":horse:","category":"nature","emoji_order":"233","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"unicorn":{"unicode":"1f984","unicode_alternates":"","name":"unicorn face","shortname":":unicorn:","category":"nature","emoji_order":"234","aliases":[":unicorn_face:"],"aliases_ascii":[],"keywords":["animal","animal"]},"bee":{"unicode":"1f41d","unicode_alternates":"","name":"honeybee","shortname":":bee:","category":"nature","emoji_order":"235","aliases":[],"aliases_ascii":[],"keywords":["insects","animal","animal"]},"bug":{"unicode":"1f41b","unicode_alternates":"","name":"bug","shortname":":bug:","category":"nature","emoji_order":"236","aliases":[],"aliases_ascii":[],"keywords":["insects","animal","animal"]},"snail":{"unicode":"1f40c","unicode_alternates":"","name":"snail","shortname":":snail:","category":"nature","emoji_order":"237","aliases":[],"aliases_ascii":[],"keywords":["insects","animal","animal"]},"beetle":{"unicode":"1f41e","unicode_alternates":"","name":"lady beetle","shortname":":beetle:","category":"nature","emoji_order":"238","aliases":[],"aliases_ascii":[],"keywords":["insects","animal","animal"]},"ant":{"unicode":"1f41c","unicode_alternates":"","name":"ant","shortname":":ant:","category":"nature","emoji_order":"239","aliases":[],"aliases_ascii":[],"keywords":["insects","animal","animal"]},"spider":{"unicode":"1f577","unicode_alternates":"1f577-fe0f","name":"spider","shortname":":spider:","category":"nature","emoji_order":"240","aliases":[],"aliases_ascii":[],"keywords":["insects","halloween","animal","animal"]},"scorpion":{"unicode":"1f982","unicode_alternates":"","name":"scorpion","shortname":":scorpion:","category":"nature","emoji_order":"241","aliases":[],"aliases_ascii":[],"keywords":["insects","reptile","reptile","animal","animal"]},"crab":{"unicode":"1f980","unicode_alternates":"","name":"crab","shortname":":crab:","category":"nature","emoji_order":"242","aliases":[],"aliases_ascii":[],"keywords":["tropical","animal","animal"]},"snake":{"unicode":"1f40d","unicode_alternates":"","name":"snake","shortname":":snake:","category":"nature","emoji_order":"243","aliases":[],"aliases_ascii":[],"keywords":["wildlife","reptile","reptile","animal","animal","creationism","creationism"]},"turtle":{"unicode":"1f422","unicode_alternates":"","name":"turtle","shortname":":turtle:","category":"nature","emoji_order":"244","aliases":[],"aliases_ascii":[],"keywords":["wildlife","reptile","reptile","animal","animal"]},"tropical_fish":{"unicode":"1f420","unicode_alternates":"","name":"tropical fish","shortname":":tropical_fish:","category":"nature","emoji_order":"245","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"fish":{"unicode":"1f41f","unicode_alternates":"","name":"fish","shortname":":fish:","category":"nature","emoji_order":"246","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"blowfish":{"unicode":"1f421","unicode_alternates":"","name":"blowfish","shortname":":blowfish:","category":"nature","emoji_order":"247","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"dolphin":{"unicode":"1f42c","unicode_alternates":"","name":"dolphin","shortname":":dolphin:","category":"nature","emoji_order":"248","aliases":[],"aliases_ascii":[],"keywords":["wildlife","tropical","animal","animal"]},"whale":{"unicode":"1f433","unicode_alternates":"","name":"spouting whale","shortname":":whale:","category":"nature","emoji_order":"249","aliases":[],"aliases_ascii":[],"keywords":["wildlife","tropical","whales","whales","animal","animal"]},"whale2":{"unicode":"1f40b","unicode_alternates":"","name":"whale","shortname":":whale2:","category":"nature","emoji_order":"250","aliases":[],"aliases_ascii":[],"keywords":["wildlife","tropical","whales","whales","animal","animal"]},"crocodile":{"unicode":"1f40a","unicode_alternates":"","name":"crocodile","shortname":":crocodile:","category":"nature","emoji_order":"251","aliases":[],"aliases_ascii":[],"keywords":["wildlife","reptile","reptile","animal","animal"]},"leopard":{"unicode":"1f406","unicode_alternates":"","name":"leopard","shortname":":leopard:","category":"nature","emoji_order":"252","aliases":[],"aliases_ascii":[],"keywords":["wildlife","roar","animal","animal"]},"tiger2":{"unicode":"1f405","unicode_alternates":"","name":"tiger","shortname":":tiger2:","category":"nature","emoji_order":"253","aliases":[],"aliases_ascii":[],"keywords":["wildlife","roar","animal","animal"]},"water_buffalo":{"unicode":"1f403","unicode_alternates":"","name":"water buffalo","shortname":":water_buffalo:","category":"nature","emoji_order":"254","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"ox":{"unicode":"1f402","unicode_alternates":"","name":"ox","shortname":":ox:","category":"nature","emoji_order":"255","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"cow2":{"unicode":"1f404","unicode_alternates":"","name":"cow","shortname":":cow2:","category":"nature","emoji_order":"256","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"dromedary_camel":{"unicode":"1f42a","unicode_alternates":"","name":"dromedary camel","shortname":":dromedary_camel:","category":"nature","emoji_order":"257","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"camel":{"unicode":"1f42b","unicode_alternates":"","name":"bactrian camel","shortname":":camel:","category":"nature","emoji_order":"258","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal","hump day","hump day"]},"elephant":{"unicode":"1f418","unicode_alternates":"","name":"elephant","shortname":":elephant:","category":"nature","emoji_order":"259","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"goat":{"unicode":"1f410","unicode_alternates":"","name":"goat","shortname":":goat:","category":"nature","emoji_order":"260","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"ram":{"unicode":"1f40f","unicode_alternates":"","name":"ram","shortname":":ram:","category":"nature","emoji_order":"261","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"sheep":{"unicode":"1f411","unicode_alternates":"","name":"sheep","shortname":":sheep:","category":"nature","emoji_order":"262","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"racehorse":{"unicode":"1f40e","unicode_alternates":"","name":"horse","shortname":":racehorse:","category":"nature","emoji_order":"263","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"pig2":{"unicode":"1f416","unicode_alternates":"","name":"pig","shortname":":pig2:","category":"nature","emoji_order":"264","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"rat":{"unicode":"1f400","unicode_alternates":"","name":"rat","shortname":":rat:","category":"nature","emoji_order":"265","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"mouse2":{"unicode":"1f401","unicode_alternates":"","name":"mouse","shortname":":mouse2:","category":"nature","emoji_order":"266","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"rooster":{"unicode":"1f413","unicode_alternates":"","name":"rooster","shortname":":rooster:","category":"nature","emoji_order":"267","aliases":[],"aliases_ascii":[],"keywords":["animal","animal"]},"turkey":{"unicode":"1f983","unicode_alternates":"","name":"turkey","shortname":":turkey:","category":"nature","emoji_order":"268","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"dove":{"unicode":"1f54a","unicode_alternates":"1f54a-fe0f","name":"dove of peace","shortname":":dove:","category":"nature","emoji_order":"269","aliases":[":dove_of_peace:"],"aliases_ascii":[],"keywords":["animal","animal"]},"dog2":{"unicode":"1f415","unicode_alternates":"","name":"dog","shortname":":dog2:","category":"nature","emoji_order":"270","aliases":[],"aliases_ascii":[],"keywords":["dog","dog","pug","pug","animal","animal"]},"poodle":{"unicode":"1f429","unicode_alternates":"","name":"poodle","shortname":":poodle:","category":"nature","emoji_order":"271","aliases":[],"aliases_ascii":[],"keywords":["dog","dog","animal","animal"]},"cat2":{"unicode":"1f408","unicode_alternates":"","name":"cat","shortname":":cat2:","category":"nature","emoji_order":"272","aliases":[],"aliases_ascii":[],"keywords":["halloween","cat","cat","animal","animal"]},"rabbit2":{"unicode":"1f407","unicode_alternates":"","name":"rabbit","shortname":":rabbit2:","category":"nature","emoji_order":"273","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"chipmunk":{"unicode":"1f43f","unicode_alternates":"1f43f-fe0f","name":"chipmunk","shortname":":chipmunk:","category":"nature","emoji_order":"274","aliases":[],"aliases_ascii":[],"keywords":["wildlife","animal","animal"]},"feet":{"unicode":"1f43e","unicode_alternates":"","name":"paw prints","shortname":":feet:","category":"nature","emoji_order":"275","aliases":[":paw_prints:"],"aliases_ascii":[],"keywords":["animal","animal"]},"dragon":{"unicode":"1f409","unicode_alternates":"","name":"dragon","shortname":":dragon:","category":"nature","emoji_order":"276","aliases":[],"aliases_ascii":[],"keywords":["roar","reptile","reptile","animal","animal"]},"dragon_face":{"unicode":"1f432","unicode_alternates":"","name":"dragon face","shortname":":dragon_face:","category":"nature","emoji_order":"277","aliases":[],"aliases_ascii":[],"keywords":["roar","monster","reptile","reptile","animal","animal"]},"cactus":{"unicode":"1f335","unicode_alternates":"","name":"cactus","shortname":":cactus:","category":"nature","emoji_order":"278","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","trees","trees"]},"christmas_tree":{"unicode":"1f384","unicode_alternates":"","name":"christmas tree","shortname":":christmas_tree:","category":"nature","emoji_order":"279","aliases":[],"aliases_ascii":[],"keywords":["plant","holidays","christmas","trees","trees"]},"evergreen_tree":{"unicode":"1f332","unicode_alternates":"","name":"evergreen tree","shortname":":evergreen_tree:","category":"nature","emoji_order":"280","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","holidays","christmas","camp","trees","trees"]},"deciduous_tree":{"unicode":"1f333","unicode_alternates":"","name":"deciduous tree","shortname":":deciduous_tree:","category":"nature","emoji_order":"281","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","camp","trees","trees"]},"palm_tree":{"unicode":"1f334","unicode_alternates":"","name":"palm tree","shortname":":palm_tree:","category":"nature","emoji_order":"282","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","tropical","trees","trees"]},"seedling":{"unicode":"1f331","unicode_alternates":"","name":"seedling","shortname":":seedling:","category":"nature","emoji_order":"283","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","leaf","leaf"]},"herb":{"unicode":"1f33f","unicode_alternates":"","name":"herb","shortname":":herb:","category":"nature","emoji_order":"284","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","leaf","leaf"]},"shamrock":{"unicode":"2618","unicode_alternates":"2618-fe0f","name":"shamrock","shortname":":shamrock:","category":"nature","emoji_order":"285","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","luck","leaf","leaf"]},"four_leaf_clover":{"unicode":"1f340","unicode_alternates":"","name":"four leaf clover","shortname":":four_leaf_clover:","category":"nature","emoji_order":"286","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","luck","leaf","leaf","sol","sol"]},"bamboo":{"unicode":"1f38d","unicode_alternates":"","name":"pine decoration","shortname":":bamboo:","category":"nature","emoji_order":"287","aliases":[],"aliases_ascii":[],"keywords":["nature","plant"]},"tanabata_tree":{"unicode":"1f38b","unicode_alternates":"","name":"tanabata tree","shortname":":tanabata_tree:","category":"nature","emoji_order":"288","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","trees","trees"]},"leaves":{"unicode":"1f343","unicode_alternates":"","name":"leaf fluttering in wind","shortname":":leaves:","category":"nature","emoji_order":"289","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","leaf","leaf"]},"fallen_leaf":{"unicode":"1f342","unicode_alternates":"","name":"fallen leaf","shortname":":fallen_leaf:","category":"nature","emoji_order":"290","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","leaf","leaf"]},"maple_leaf":{"unicode":"1f341","unicode_alternates":"","name":"maple leaf","shortname":":maple_leaf:","category":"nature","emoji_order":"291","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","leaf","leaf"]},"ear_of_rice":{"unicode":"1f33e","unicode_alternates":"","name":"ear of rice","shortname":":ear_of_rice:","category":"nature","emoji_order":"292","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","leaf","leaf"]},"hibiscus":{"unicode":"1f33a","unicode_alternates":"","name":"hibiscus","shortname":":hibiscus:","category":"nature","emoji_order":"293","aliases":[],"aliases_ascii":[],"keywords":["nature","flower","plant","tropical"]},"sunflower":{"unicode":"1f33b","unicode_alternates":"","name":"sunflower","shortname":":sunflower:","category":"nature","emoji_order":"294","aliases":[],"aliases_ascii":[],"keywords":["nature","flower","plant"]},"rose":{"unicode":"1f339","unicode_alternates":"","name":"rose","shortname":":rose:","category":"nature","emoji_order":"295","aliases":[],"aliases_ascii":[],"keywords":["nature","flower","plant","rip","rip","condolence","condolence","beautiful","beautiful"]},"tulip":{"unicode":"1f337","unicode_alternates":"","name":"tulip","shortname":":tulip:","category":"nature","emoji_order":"296","aliases":[],"aliases_ascii":[],"keywords":["nature","flower","plant","vagina","girls night","girls night"]},"blossom":{"unicode":"1f33c","unicode_alternates":"","name":"blossom","shortname":":blossom:","category":"nature","emoji_order":"297","aliases":[],"aliases_ascii":[],"keywords":["nature","flower","plant"]},"cherry_blossom":{"unicode":"1f338","unicode_alternates":"","name":"cherry blossom","shortname":":cherry_blossom:","category":"nature","emoji_order":"298","aliases":[],"aliases_ascii":[],"keywords":["nature","flower","plant","tropical"]},"bouquet":{"unicode":"1f490","unicode_alternates":"","name":"bouquet","shortname":":bouquet:","category":"nature","emoji_order":"299","aliases":[],"aliases_ascii":[],"keywords":["nature","flower","plant","rip","rip","condolence","condolence"]},"mushroom":{"unicode":"1f344","unicode_alternates":"","name":"mushroom","shortname":":mushroom:","category":"nature","emoji_order":"300","aliases":[],"aliases_ascii":[],"keywords":["nature","plant","drugs","drugs"]},"chestnut":{"unicode":"1f330","unicode_alternates":"","name":"chestnut","shortname":":chestnut:","category":"nature","emoji_order":"301","aliases":[],"aliases_ascii":[],"keywords":["nature","plant"]},"jack_o_lantern":{"unicode":"1f383","unicode_alternates":"","name":"jack-o-lantern","shortname":":jack_o_lantern:","category":"nature","emoji_order":"302","aliases":[],"aliases_ascii":[],"keywords":["holidays","halloween"]},"shell":{"unicode":"1f41a","unicode_alternates":"","name":"spiral shell","shortname":":shell:","category":"nature","emoji_order":"303","aliases":[],"aliases_ascii":[],"keywords":[]},"spider_web":{"unicode":"1f578","unicode_alternates":"1f578-fe0f","name":"spider web","shortname":":spider_web:","category":"nature","emoji_order":"304","aliases":[],"aliases_ascii":[],"keywords":["halloween"]},"earth_americas":{"unicode":"1f30e","unicode_alternates":"","name":"earth globe americas","shortname":":earth_americas:","category":"nature","emoji_order":"305","aliases":[],"aliases_ascii":[],"keywords":["map","vacation","globe","globe"]},"earth_africa":{"unicode":"1f30d","unicode_alternates":"","name":"earth globe europe-africa","shortname":":earth_africa:","category":"nature","emoji_order":"306","aliases":[],"aliases_ascii":[],"keywords":["map","vacation","globe","globe"]},"earth_asia":{"unicode":"1f30f","unicode_alternates":"","name":"earth globe asia-australia","shortname":":earth_asia:","category":"nature","emoji_order":"307","aliases":[],"aliases_ascii":[],"keywords":["map","vacation","globe","globe"]},"full_moon":{"unicode":"1f315","unicode_alternates":"","name":"full moon symbol","shortname":":full_moon:","category":"nature","emoji_order":"308","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"waning_gibbous_moon":{"unicode":"1f316","unicode_alternates":"","name":"waning gibbous moon symbol","shortname":":waning_gibbous_moon:","category":"nature","emoji_order":"309","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"last_quarter_moon":{"unicode":"1f317","unicode_alternates":"","name":"last quarter moon symbol","shortname":":last_quarter_moon:","category":"nature","emoji_order":"310","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"waning_crescent_moon":{"unicode":"1f318","unicode_alternates":"","name":"waning crescent moon symbol","shortname":":waning_crescent_moon:","category":"nature","emoji_order":"311","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"new_moon":{"unicode":"1f311","unicode_alternates":"","name":"new moon symbol","shortname":":new_moon:","category":"nature","emoji_order":"312","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"waxing_crescent_moon":{"unicode":"1f312","unicode_alternates":"","name":"waxing crescent moon symbol","shortname":":waxing_crescent_moon:","category":"nature","emoji_order":"313","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"first_quarter_moon":{"unicode":"1f313","unicode_alternates":"","name":"first quarter moon symbol","shortname":":first_quarter_moon:","category":"nature","emoji_order":"314","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"waxing_gibbous_moon":{"unicode":"1f314","unicode_alternates":"","name":"waxing gibbous moon symbol","shortname":":waxing_gibbous_moon:","category":"nature","emoji_order":"315","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"new_moon_with_face":{"unicode":"1f31a","unicode_alternates":"","name":"new moon with face","shortname":":new_moon_with_face:","category":"nature","emoji_order":"316","aliases":[],"aliases_ascii":[],"keywords":["space","sky","goodnight","goodnight","moon","moon"]},"full_moon_with_face":{"unicode":"1f31d","unicode_alternates":"","name":"full moon with face","shortname":":full_moon_with_face:","category":"nature","emoji_order":"317","aliases":[],"aliases_ascii":[],"keywords":["space","sky","goodnight","goodnight","moon","moon"]},"first_quarter_moon_with_face":{"unicode":"1f31b","unicode_alternates":"","name":"first quarter moon with face","shortname":":first_quarter_moon_with_face:","category":"nature","emoji_order":"318","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"last_quarter_moon_with_face":{"unicode":"1f31c","unicode_alternates":"","name":"last quarter moon with face","shortname":":last_quarter_moon_with_face:","category":"nature","emoji_order":"319","aliases":[],"aliases_ascii":[],"keywords":["space","sky","moon","moon"]},"sun_with_face":{"unicode":"1f31e","unicode_alternates":"","name":"sun with face","shortname":":sun_with_face:","category":"nature","emoji_order":"320","aliases":[],"aliases_ascii":[],"keywords":["sky","day","sun","hump day","hump day","morning","morning"]},"crescent_moon":{"unicode":"1f319","unicode_alternates":"","name":"crescent moon","shortname":":crescent_moon:","category":"nature","emoji_order":"321","aliases":[],"aliases_ascii":[],"keywords":["space","sky","goodnight","goodnight","moon","moon"]},"star":{"unicode":"2b50","unicode_alternates":"2b50-fe0f","name":"white medium star","shortname":":star:","category":"nature","emoji_order":"322","aliases":[],"aliases_ascii":[],"keywords":["space","sky","star"]},"star2":{"unicode":"1f31f","unicode_alternates":"","name":"glowing star","shortname":":star2:","category":"nature","emoji_order":"323","aliases":[],"aliases_ascii":[],"keywords":["space","sky","star"]},"dizzy":{"unicode":"1f4ab","unicode_alternates":"","name":"dizzy symbol","shortname":":dizzy:","category":"nature","emoji_order":"324","aliases":[],"aliases_ascii":[],"keywords":["star","symbol"]},"sparkles":{"unicode":"2728","unicode_alternates":"","name":"sparkles","shortname":":sparkles:","category":"nature","emoji_order":"325","aliases":[],"aliases_ascii":[],"keywords":["star","girls night","girls night"]},"comet":{"unicode":"2604","unicode_alternates":"2604-fe0f","name":"comet","shortname":":comet:","category":"nature","emoji_order":"326","aliases":[],"aliases_ascii":[],"keywords":["space","sky"]},"sunny":{"unicode":"2600","unicode_alternates":"2600-fe0f","name":"black sun with rays","shortname":":sunny:","category":"nature","emoji_order":"327","aliases":[],"aliases_ascii":[],"keywords":["weather","sky","day","sun","hot","hot","morning","morning"]},"white_sun_small_cloud":{"unicode":"1f324","unicode_alternates":"1f324-fe0f","name":"white sun with small cloud","shortname":":white_sun_small_cloud:","category":"nature","emoji_order":"328","aliases":[":white_sun_with_small_cloud:"],"aliases_ascii":[],"keywords":["weather","sky","cloud","sun"]},"partly_sunny":{"unicode":"26c5","unicode_alternates":"26c5-fe0f","name":"sun behind cloud","shortname":":partly_sunny:","category":"nature","emoji_order":"329","aliases":[],"aliases_ascii":[],"keywords":["weather","sky","cloud","sun"]},"white_sun_cloud":{"unicode":"1f325","unicode_alternates":"1f325-fe0f","name":"white sun behind cloud","shortname":":white_sun_cloud:","category":"nature","emoji_order":"330","aliases":[":white_sun_behind_cloud:"],"aliases_ascii":[],"keywords":["weather","sky","cloud","cold","sun"]},"white_sun_rain_cloud":{"unicode":"1f326","unicode_alternates":"1f326-fe0f","name":"white sun behind cloud with rain","shortname":":white_sun_rain_cloud:","category":"nature","emoji_order":"331","aliases":[":white_sun_behind_cloud_with_rain:"],"aliases_ascii":[],"keywords":["weather","sky","cloud","cold","rain","sun"]},"cloud":{"unicode":"2601","unicode_alternates":"2601-fe0f","name":"cloud","shortname":":cloud:","category":"nature","emoji_order":"332","aliases":[],"aliases_ascii":[],"keywords":["weather","sky","cloud","cold","rain"]},"cloud_rain":{"unicode":"1f327","unicode_alternates":"1f327-fe0f","name":"cloud with rain","shortname":":cloud_rain:","category":"nature","emoji_order":"333","aliases":[":cloud_with_rain:"],"aliases_ascii":[],"keywords":["weather","winter","sky","cloud","cold","rain"]},"thunder_cloud_rain":{"unicode":"26c8","unicode_alternates":"26c8-fe0f","name":"thunder cloud and rain","shortname":":thunder_cloud_rain:","category":"nature","emoji_order":"334","aliases":[":thunder_cloud_and_rain:"],"aliases_ascii":[],"keywords":["weather","sky","cloud","cold","rain"]},"cloud_lightning":{"unicode":"1f329","unicode_alternates":"1f329-fe0f","name":"cloud with lightning","shortname":":cloud_lightning:","category":"nature","emoji_order":"335","aliases":[":cloud_with_lightning:"],"aliases_ascii":[],"keywords":["weather","sky","cloud","cold","rain"]},"zap":{"unicode":"26a1","unicode_alternates":"26a1-fe0f","name":"high voltage sign","shortname":":zap:","category":"nature","emoji_order":"336","aliases":[],"aliases_ascii":[],"keywords":["weather","sky","diarrhea","diarrhea"]},"fire":{"unicode":"1f525","unicode_alternates":"","name":"fire","shortname":":fire:","category":"nature","emoji_order":"337","aliases":[":flame:"],"aliases_ascii":[],"keywords":["wth","wth","hot","hot"]},"boom":{"unicode":"1f4a5","unicode_alternates":"","name":"collision symbol","shortname":":boom:","category":"nature","emoji_order":"338","aliases":[],"aliases_ascii":[],"keywords":["symbol","blast","blast"]},"snowflake":{"unicode":"2744","unicode_alternates":"2744-fe0f","name":"snowflake","shortname":":snowflake:","category":"nature","emoji_order":"339","aliases":[],"aliases_ascii":[],"keywords":["weather","winter","sky","holidays","cold","snow","snow"]},"cloud_snow":{"unicode":"1f328","unicode_alternates":"1f328-fe0f","name":"cloud with snow","shortname":":cloud_snow:","category":"nature","emoji_order":"340","aliases":[":cloud_with_snow:"],"aliases_ascii":[],"keywords":["weather","winter","sky","cloud","cold","snow","snow"]},"snowman2":{"unicode":"2603","unicode_alternates":"2603-fe0f","name":"snowman","shortname":":snowman2:","category":"nature","emoji_order":"341","aliases":[],"aliases_ascii":[],"keywords":["weather","winter","holidays","christmas","cold","snow","snow"]},"snowman":{"unicode":"26c4","unicode_alternates":"26c4-fe0f","name":"snowman without snow","shortname":":snowman:","category":"nature","emoji_order":"342","aliases":[],"aliases_ascii":[],"keywords":["weather","winter","holidays","cold","snow","snow"]},"wind_blowing_face":{"unicode":"1f32c","unicode_alternates":"1f32c-fe0f","name":"wind blowing face","shortname":":wind_blowing_face:","category":"nature","emoji_order":"343","aliases":[],"aliases_ascii":[],"keywords":["weather","cold"]},"dash":{"unicode":"1f4a8","unicode_alternates":"","name":"dash symbol","shortname":":dash:","category":"nature","emoji_order":"344","aliases":[],"aliases_ascii":[],"keywords":["cloud","cold","smoking","smoking"]},"cloud_tornado":{"unicode":"1f32a","unicode_alternates":"1f32a-fe0f","name":"cloud with tornado","shortname":":cloud_tornado:","category":"nature","emoji_order":"345","aliases":[":cloud_with_tornado:"],"aliases_ascii":[],"keywords":["weather","sky","cold"]},"fog":{"unicode":"1f32b","unicode_alternates":"1f32b-fe0f","name":"fog","shortname":":fog:","category":"nature","emoji_order":"346","aliases":[],"aliases_ascii":[],"keywords":["weather","sky","cold"]},"umbrella2":{"unicode":"2602","unicode_alternates":"2602-fe0f","name":"umbrella","shortname":":umbrella2:","category":"nature","emoji_order":"347","aliases":[],"aliases_ascii":[],"keywords":["weather","object","sky","cold"]},"umbrella":{"unicode":"2614","unicode_alternates":"2614-fe0f","name":"umbrella with rain drops","shortname":":umbrella:","category":"nature","emoji_order":"348","aliases":[],"aliases_ascii":[],"keywords":["weather","sky","cold","rain"]},"droplet":{"unicode":"1f4a7","unicode_alternates":"","name":"droplet","shortname":":droplet:","category":"nature","emoji_order":"349","aliases":[],"aliases_ascii":[],"keywords":["weather","sky","rain"]},"sweat_drops":{"unicode":"1f4a6","unicode_alternates":"","name":"splashing sweat symbol","shortname":":sweat_drops:","category":"nature","emoji_order":"350","aliases":[],"aliases_ascii":[],"keywords":["rain","stressed","sweat"]},"ocean":{"unicode":"1f30a","unicode_alternates":"","name":"water wave","shortname":":ocean:","category":"nature","emoji_order":"351","aliases":[],"aliases_ascii":[],"keywords":["weather","boat","tropical","swim"]},"green_apple":{"unicode":"1f34f","unicode_alternates":"","name":"green apple","shortname":":green_apple:","category":"food","emoji_order":"352","aliases":[],"aliases_ascii":[],"keywords":["fruit","food"]},"apple":{"unicode":"1f34e","unicode_alternates":"","name":"red apple","shortname":":apple:","category":"food","emoji_order":"353","aliases":[],"aliases_ascii":[],"keywords":["fruit","food","creationism","creationism"]},"pear":{"unicode":"1f350","unicode_alternates":"","name":"pear","shortname":":pear:","category":"food","emoji_order":"354","aliases":[],"aliases_ascii":[],"keywords":["fruit","food"]},"tangerine":{"unicode":"1f34a","unicode_alternates":"","name":"tangerine","shortname":":tangerine:","category":"food","emoji_order":"355","aliases":[],"aliases_ascii":[],"keywords":["fruit","food"]},"lemon":{"unicode":"1f34b","unicode_alternates":"","name":"lemon","shortname":":lemon:","category":"food","emoji_order":"356","aliases":[],"aliases_ascii":[],"keywords":["fruit","food"]},"banana":{"unicode":"1f34c","unicode_alternates":"","name":"banana","shortname":":banana:","category":"food","emoji_order":"357","aliases":[],"aliases_ascii":[],"keywords":["fruit","penis","food"]},"watermelon":{"unicode":"1f349","unicode_alternates":"","name":"watermelon","shortname":":watermelon:","category":"food","emoji_order":"358","aliases":[],"aliases_ascii":[],"keywords":["fruit","food"]},"grapes":{"unicode":"1f347","unicode_alternates":"","name":"grapes","shortname":":grapes:","category":"food","emoji_order":"359","aliases":[],"aliases_ascii":[],"keywords":["fruit","food"]},"strawberry":{"unicode":"1f353","unicode_alternates":"","name":"strawberry","shortname":":strawberry:","category":"food","emoji_order":"360","aliases":[],"aliases_ascii":[],"keywords":["fruit","food"]},"melon":{"unicode":"1f348","unicode_alternates":"","name":"melon","shortname":":melon:","category":"food","emoji_order":"361","aliases":[],"aliases_ascii":[],"keywords":["fruit","boobs","food"]},"cherries":{"unicode":"1f352","unicode_alternates":"","name":"cherries","shortname":":cherries:","category":"food","emoji_order":"362","aliases":[],"aliases_ascii":[],"keywords":["fruit","food"]},"peach":{"unicode":"1f351","unicode_alternates":"","name":"peach","shortname":":peach:","category":"food","emoji_order":"363","aliases":[],"aliases_ascii":[],"keywords":["fruit","butt","food"]},"pineapple":{"unicode":"1f34d","unicode_alternates":"","name":"pineapple","shortname":":pineapple:","category":"food","emoji_order":"364","aliases":[],"aliases_ascii":[],"keywords":["fruit","food","tropical"]},"tomato":{"unicode":"1f345","unicode_alternates":"","name":"tomato","shortname":":tomato:","category":"food","emoji_order":"365","aliases":[],"aliases_ascii":[],"keywords":["fruit","vegetables","food"]},"eggplant":{"unicode":"1f346","unicode_alternates":"","name":"aubergine","shortname":":eggplant:","category":"food","emoji_order":"366","aliases":[],"aliases_ascii":[],"keywords":["vegetables","penis","food"]},"hot_pepper":{"unicode":"1f336","unicode_alternates":"1f336-fe0f","name":"hot pepper","shortname":":hot_pepper:","category":"food","emoji_order":"367","aliases":[],"aliases_ascii":[],"keywords":["vegetables","food"]},"corn":{"unicode":"1f33d","unicode_alternates":"","name":"ear of maize","shortname":":corn:","category":"food","emoji_order":"368","aliases":[],"aliases_ascii":[],"keywords":["vegetables","food"]},"sweet_potato":{"unicode":"1f360","unicode_alternates":"","name":"roasted sweet potato","shortname":":sweet_potato:","category":"food","emoji_order":"369","aliases":[],"aliases_ascii":[],"keywords":["vegetables","food"]},"honey_pot":{"unicode":"1f36f","unicode_alternates":"","name":"honey pot","shortname":":honey_pot:","category":"food","emoji_order":"370","aliases":[],"aliases_ascii":[],"keywords":["food","vagina"]},"bread":{"unicode":"1f35e","unicode_alternates":"","name":"bread","shortname":":bread:","category":"food","emoji_order":"371","aliases":[],"aliases_ascii":[],"keywords":["food"]},"cheese":{"unicode":"1f9c0","unicode_alternates":"","name":"cheese wedge","shortname":":cheese:","category":"food","emoji_order":"372","aliases":[":cheese_wedge:"],"aliases_ascii":[],"keywords":["food"]},"poultry_leg":{"unicode":"1f357","unicode_alternates":"","name":"poultry leg","shortname":":poultry_leg:","category":"food","emoji_order":"373","aliases":[],"aliases_ascii":[],"keywords":["food","holidays"]},"meat_on_bone":{"unicode":"1f356","unicode_alternates":"","name":"meat on bone","shortname":":meat_on_bone:","category":"food","emoji_order":"374","aliases":[],"aliases_ascii":[],"keywords":["food"]},"fried_shrimp":{"unicode":"1f364","unicode_alternates":"","name":"fried shrimp","shortname":":fried_shrimp:","category":"food","emoji_order":"375","aliases":[],"aliases_ascii":[],"keywords":["food"]},"cooking":{"unicode":"1f373","unicode_alternates":"","name":"cooking","shortname":":cooking:","category":"food","emoji_order":"376","aliases":[],"aliases_ascii":[],"keywords":["food"]},"hamburger":{"unicode":"1f354","unicode_alternates":"","name":"hamburger","shortname":":hamburger:","category":"food","emoji_order":"377","aliases":[],"aliases_ascii":[],"keywords":["america","food"]},"fries":{"unicode":"1f35f","unicode_alternates":"","name":"french fries","shortname":":fries:","category":"food","emoji_order":"378","aliases":[],"aliases_ascii":[],"keywords":["america","food"]},"hotdog":{"unicode":"1f32d","unicode_alternates":"","name":"hot dog","shortname":":hotdog:","category":"food","emoji_order":"379","aliases":[":hot_dog:"],"aliases_ascii":[],"keywords":["america","food"]},"pizza":{"unicode":"1f355","unicode_alternates":"","name":"slice of pizza","shortname":":pizza:","category":"food","emoji_order":"380","aliases":[],"aliases_ascii":[],"keywords":["italian","food","boys night","boys night"]},"spaghetti":{"unicode":"1f35d","unicode_alternates":"","name":"spaghetti","shortname":":spaghetti:","category":"food","emoji_order":"381","aliases":[],"aliases_ascii":[],"keywords":["noodles","pasta","italian","food"]},"taco":{"unicode":"1f32e","unicode_alternates":"","name":"taco","shortname":":taco:","category":"food","emoji_order":"382","aliases":[],"aliases_ascii":[],"keywords":["food","mexican","vagina"]},"burrito":{"unicode":"1f32f","unicode_alternates":"","name":"burrito","shortname":":burrito:","category":"food","emoji_order":"383","aliases":[],"aliases_ascii":[],"keywords":["food","mexican"]},"ramen":{"unicode":"1f35c","unicode_alternates":"","name":"steaming bowl","shortname":":ramen:","category":"food","emoji_order":"384","aliases":[],"aliases_ascii":[],"keywords":["noodles","ramen","japan","food"]},"stew":{"unicode":"1f372","unicode_alternates":"","name":"pot of food","shortname":":stew:","category":"food","emoji_order":"385","aliases":[],"aliases_ascii":[],"keywords":["food","steam","steam"]},"fish_cake":{"unicode":"1f365","unicode_alternates":"","name":"fish cake with swirl design","shortname":":fish_cake:","category":"food","emoji_order":"386","aliases":[],"aliases_ascii":[],"keywords":["sushi","food"]},"sushi":{"unicode":"1f363","unicode_alternates":"","name":"sushi","shortname":":sushi:","category":"food","emoji_order":"387","aliases":[],"aliases_ascii":[],"keywords":["sushi","japan","food"]},"bento":{"unicode":"1f371","unicode_alternates":"","name":"bento box","shortname":":bento:","category":"food","emoji_order":"388","aliases":[],"aliases_ascii":[],"keywords":["object","sushi","japan","food"]},"curry":{"unicode":"1f35b","unicode_alternates":"","name":"curry and rice","shortname":":curry:","category":"food","emoji_order":"389","aliases":[],"aliases_ascii":[],"keywords":["food"]},"rice_ball":{"unicode":"1f359","unicode_alternates":"","name":"rice ball","shortname":":rice_ball:","category":"food","emoji_order":"390","aliases":[],"aliases_ascii":[],"keywords":["sushi","japan","food"]},"rice":{"unicode":"1f35a","unicode_alternates":"","name":"cooked rice","shortname":":rice:","category":"food","emoji_order":"391","aliases":[],"aliases_ascii":[],"keywords":["sushi","japan","food"]},"rice_cracker":{"unicode":"1f358","unicode_alternates":"","name":"rice cracker","shortname":":rice_cracker:","category":"food","emoji_order":"392","aliases":[],"aliases_ascii":[],"keywords":["sushi","food"]},"oden":{"unicode":"1f362","unicode_alternates":"","name":"oden","shortname":":oden:","category":"food","emoji_order":"393","aliases":[],"aliases_ascii":[],"keywords":["food"]},"dango":{"unicode":"1f361","unicode_alternates":"","name":"dango","shortname":":dango:","category":"food","emoji_order":"394","aliases":[],"aliases_ascii":[],"keywords":["food"]},"shaved_ice":{"unicode":"1f367","unicode_alternates":"","name":"shaved ice","shortname":":shaved_ice:","category":"food","emoji_order":"395","aliases":[],"aliases_ascii":[],"keywords":["food"]},"ice_cream":{"unicode":"1f368","unicode_alternates":"","name":"ice cream","shortname":":ice_cream:","category":"food","emoji_order":"396","aliases":[],"aliases_ascii":[],"keywords":["food"]},"icecream":{"unicode":"1f366","unicode_alternates":"","name":"soft ice cream","shortname":":icecream:","category":"food","emoji_order":"397","aliases":[],"aliases_ascii":[],"keywords":["food"]},"cake":{"unicode":"1f370","unicode_alternates":"","name":"shortcake","shortname":":cake:","category":"food","emoji_order":"398","aliases":[],"aliases_ascii":[],"keywords":["food"]},"birthday":{"unicode":"1f382","unicode_alternates":"","name":"birthday cake","shortname":":birthday:","category":"food","emoji_order":"399","aliases":[],"aliases_ascii":[],"keywords":["birthday","food","parties","parties"]},"custard":{"unicode":"1f36e","unicode_alternates":"","name":"custard","shortname":":custard:","category":"food","emoji_order":"400","aliases":[":pudding:",":flan:"],"aliases_ascii":[],"keywords":["food"]},"candy":{"unicode":"1f36c","unicode_alternates":"","name":"candy","shortname":":candy:","category":"food","emoji_order":"401","aliases":[],"aliases_ascii":[],"keywords":["food","halloween"]},"lollipop":{"unicode":"1f36d","unicode_alternates":"","name":"lollipop","shortname":":lollipop:","category":"food","emoji_order":"402","aliases":[],"aliases_ascii":[],"keywords":["food","halloween"]},"chocolate_bar":{"unicode":"1f36b","unicode_alternates":"","name":"chocolate bar","shortname":":chocolate_bar:","category":"food","emoji_order":"403","aliases":[],"aliases_ascii":[],"keywords":["food","halloween"]},"popcorn":{"unicode":"1f37f","unicode_alternates":"","name":"popcorn","shortname":":popcorn:","category":"food","emoji_order":"404","aliases":[],"aliases_ascii":[],"keywords":["food","parties","parties"]},"doughnut":{"unicode":"1f369","unicode_alternates":"","name":"doughnut","shortname":":doughnut:","category":"food","emoji_order":"405","aliases":[],"aliases_ascii":[],"keywords":["food"]},"cookie":{"unicode":"1f36a","unicode_alternates":"","name":"cookie","shortname":":cookie:","category":"food","emoji_order":"406","aliases":[],"aliases_ascii":[],"keywords":["food","vagina"]},"beer":{"unicode":"1f37a","unicode_alternates":"","name":"beer mug","shortname":":beer:","category":"food","emoji_order":"407","aliases":[],"aliases_ascii":[],"keywords":["drink","beer","alcohol","parties","parties"]},"beers":{"unicode":"1f37b","unicode_alternates":"","name":"clinking beer mugs","shortname":":beers:","category":"food","emoji_order":"408","aliases":[],"aliases_ascii":[],"keywords":["drink","cheers","beer","alcohol","thank you","boys night","boys night","parties","parties"]},"wine_glass":{"unicode":"1f377","unicode_alternates":"","name":"wine glass","shortname":":wine_glass:","category":"food","emoji_order":"409","aliases":[],"aliases_ascii":[],"keywords":["drink","italian","alcohol","girls night","girls night","parties","parties"]},"cocktail":{"unicode":"1f378","unicode_alternates":"","name":"cocktail glass","shortname":":cocktail:","category":"food","emoji_order":"410","aliases":[],"aliases_ascii":[],"keywords":["drink","cocktail","alcohol","girls night","girls night","parties","parties"]},"tropical_drink":{"unicode":"1f379","unicode_alternates":"","name":"tropical drink","shortname":":tropical_drink:","category":"food","emoji_order":"411","aliases":[],"aliases_ascii":[],"keywords":["drink","cocktail","tropical","alcohol"]},"champagne":{"unicode":"1f37e","unicode_alternates":"","name":"bottle with popping cork","shortname":":champagne:","category":"food","emoji_order":"412","aliases":[":bottle_with_popping_cork:"],"aliases_ascii":[],"keywords":["drink","cheers","alcohol","parties","parties"]},"sake":{"unicode":"1f376","unicode_alternates":"","name":"sake bottle and cup","shortname":":sake:","category":"food","emoji_order":"413","aliases":[],"aliases_ascii":[],"keywords":["drink","japan","sake","alcohol","girls night","girls night"]},"tea":{"unicode":"1f375","unicode_alternates":"","name":"teacup without handle","shortname":":tea:","category":"food","emoji_order":"414","aliases":[],"aliases_ascii":[],"keywords":["drink","japan","caffeine","steam","steam","morning","morning"]},"coffee":{"unicode":"2615","unicode_alternates":"2615-fe0f","name":"hot beverage","shortname":":coffee:","category":"food","emoji_order":"415","aliases":[],"aliases_ascii":[],"keywords":["drink","caffeine","steam","steam","morning","morning"]},"baby_bottle":{"unicode":"1f37c","unicode_alternates":"","name":"baby bottle","shortname":":baby_bottle:","category":"food","emoji_order":"416","aliases":[],"aliases_ascii":[],"keywords":["drink","object","food","baby"]},"fork_and_knife":{"unicode":"1f374","unicode_alternates":"","name":"fork and knife","shortname":":fork_and_knife:","category":"food","emoji_order":"417","aliases":[],"aliases_ascii":[],"keywords":["object","weapon","food"]},"fork_knife_plate":{"unicode":"1f37d","unicode_alternates":"1f37d-fe0f","name":"fork and knife with plate","shortname":":fork_knife_plate:","category":"food","emoji_order":"418","aliases":[":fork_and_knife_with_plate:"],"aliases_ascii":[],"keywords":["object","food"]},"soccer":{"unicode":"26bd","unicode_alternates":"26bd-fe0f","name":"soccer ball","shortname":":soccer:","category":"activity","emoji_order":"419","aliases":[],"aliases_ascii":[],"keywords":["game","ball","sport","soccer","football"]},"basketball":{"unicode":"1f3c0","unicode_alternates":"","name":"basketball and hoop","shortname":":basketball:","category":"activity","emoji_order":"420","aliases":[],"aliases_ascii":[],"keywords":["game","ball","sport","basketball"]},"football":{"unicode":"1f3c8","unicode_alternates":"","name":"american football","shortname":":football:","category":"activity","emoji_order":"421","aliases":[],"aliases_ascii":[],"keywords":["america","game","ball","sport","football"]},"baseball":{"unicode":"26be","unicode_alternates":"26be-fe0f","name":"baseball","shortname":":baseball:","category":"activity","emoji_order":"422","aliases":[],"aliases_ascii":[],"keywords":["game","ball","sport","baseball"]},"tennis":{"unicode":"1f3be","unicode_alternates":"","name":"tennis racquet and ball","shortname":":tennis:","category":"activity","emoji_order":"423","aliases":[],"aliases_ascii":[],"keywords":["game","ball","sport","tennis"]},"volleyball":{"unicode":"1f3d0","unicode_alternates":"","name":"volleyball","shortname":":volleyball:","category":"activity","emoji_order":"424","aliases":[],"aliases_ascii":[],"keywords":["game","ball","sport","volleyball"]},"rugby_football":{"unicode":"1f3c9","unicode_alternates":"","name":"rugby football","shortname":":rugby_football:","category":"activity","emoji_order":"425","aliases":[],"aliases_ascii":[],"keywords":["game","sport","football"]},"8ball":{"unicode":"1f3b1","unicode_alternates":"","name":"billiards","shortname":":8ball:","category":"activity","emoji_order":"426","aliases":[],"aliases_ascii":[],"keywords":["game","ball","sport","billiards","luck","boys night","boys night"]},"golf":{"unicode":"26f3","unicode_alternates":"26f3-fe0f","name":"flag in hole","shortname":":golf:","category":"activity","emoji_order":"427","aliases":[],"aliases_ascii":[],"keywords":["game","ball","vacation","sport","golf","golf"]},"golfer":{"unicode":"1f3cc","unicode_alternates":"1f3cc-fe0f","name":"golfer","shortname":":golfer:","category":"activity","emoji_order":"428","aliases":[],"aliases_ascii":[],"keywords":["men","game","ball","vacation","sport","golf","golf"]},"ping_pong":{"unicode":"1f3d3","unicode_alternates":"","name":"table tennis paddle and ball","shortname":":ping_pong:","category":"activity","emoji_order":"429","aliases":[":table_tennis:"],"aliases_ascii":[],"keywords":["game","ball","sport","ping pong"]},"badminton":{"unicode":"1f3f8","unicode_alternates":"","name":"badminton racquet","shortname":":badminton:","category":"activity","emoji_order":"430","aliases":[],"aliases_ascii":[],"keywords":["game","sport","badminton"]},"hockey":{"unicode":"1f3d2","unicode_alternates":"","name":"ice hockey stick and puck","shortname":":hockey:","category":"activity","emoji_order":"431","aliases":[],"aliases_ascii":[],"keywords":["game","sport","hockey"]},"field_hockey":{"unicode":"1f3d1","unicode_alternates":"","name":"field hockey stick and ball","shortname":":field_hockey:","category":"activity","emoji_order":"432","aliases":[],"aliases_ascii":[],"keywords":["ball","sport","hockey"]},"cricket":{"unicode":"1f3cf","unicode_alternates":"","name":"cricket bat and ball","shortname":":cricket:","category":"activity","emoji_order":"433","aliases":[":cricket_bat_ball:"],"aliases_ascii":[],"keywords":["ball","sport","cricket"]},"ski":{"unicode":"1f3bf","unicode_alternates":"","name":"ski and ski boot","shortname":":ski:","category":"activity","emoji_order":"434","aliases":[],"aliases_ascii":[],"keywords":["cold","sport","skiing"]},"skier":{"unicode":"26f7","unicode_alternates":"26f7-fe0f","name":"skier","shortname":":skier:","category":"activity","emoji_order":"435","aliases":[],"aliases_ascii":[],"keywords":["hat","vacation","cold","sport","skiing"]},"snowboarder":{"unicode":"1f3c2","unicode_alternates":"","name":"snowboarder","shortname":":snowboarder:","category":"activity","emoji_order":"436","aliases":[],"aliases_ascii":[],"keywords":["hat","vacation","cold","sport","snowboarding"]},"ice_skate":{"unicode":"26f8","unicode_alternates":"26f8-fe0f","name":"ice skate","shortname":":ice_skate:","category":"activity","emoji_order":"437","aliases":[],"aliases_ascii":[],"keywords":["cold","sport","ice skating"]},"bow_and_arrow":{"unicode":"1f3f9","unicode_alternates":"","name":"bow and arrow","shortname":":bow_and_arrow:","category":"activity","emoji_order":"438","aliases":[":archery:"],"aliases_ascii":[],"keywords":["weapon","sport"]},"fishing_pole_and_fish":{"unicode":"1f3a3","unicode_alternates":"","name":"fishing pole and fish","shortname":":fishing_pole_and_fish:","category":"activity","emoji_order":"439","aliases":[],"aliases_ascii":[],"keywords":["vacation","sport","fishing"]},"rowboat":{"unicode":"1f6a3","unicode_alternates":"","name":"rowboat","shortname":":rowboat:","category":"activity","emoji_order":"440","aliases":[],"aliases_ascii":[],"keywords":["men","workout","sport","rowing","diversity","diversity"]},"swimmer":{"unicode":"1f3ca","unicode_alternates":"","name":"swimmer","shortname":":swimmer:","category":"activity","emoji_order":"441","aliases":[],"aliases_ascii":[],"keywords":["workout","sport","swim","diversity","diversity"]},"surfer":{"unicode":"1f3c4","unicode_alternates":"","name":"surfer","shortname":":surfer:","category":"activity","emoji_order":"442","aliases":[],"aliases_ascii":[],"keywords":["men","vacation","tropical","sport","diversity","diversity"]},"bath":{"unicode":"1f6c0","unicode_alternates":"","name":"bath","shortname":":bath:","category":"activity","emoji_order":"443","aliases":[],"aliases_ascii":[],"keywords":["bathroom","tired","diversity","diversity","steam","steam"]},"basketball_player":{"unicode":"26f9","unicode_alternates":"26f9-fe0f","name":"person with ball","shortname":":basketball_player:","category":"activity","emoji_order":"444","aliases":[":person_with_ball:"],"aliases_ascii":[],"keywords":["men","game","ball","sport","basketball","diversity","diversity"]},"lifter":{"unicode":"1f3cb","unicode_alternates":"1f3cb-fe0f","name":"weight lifter","shortname":":lifter:","category":"activity","emoji_order":"445","aliases":[":weight_lifter:"],"aliases_ascii":[],"keywords":["men","workout","flex","sport","weight lifting","win","win","diversity","diversity"]},"bicyclist":{"unicode":"1f6b4","unicode_alternates":"","name":"bicyclist","shortname":":bicyclist:","category":"activity","emoji_order":"446","aliases":[],"aliases_ascii":[],"keywords":["men","workout","sport","bike","diversity","diversity"]},"mountain_bicyclist":{"unicode":"1f6b5","unicode_alternates":"","name":"mountain bicyclist","shortname":":mountain_bicyclist:","category":"activity","emoji_order":"447","aliases":[],"aliases_ascii":[],"keywords":["men","sport","bike","diversity","diversity"]},"horse_racing":{"unicode":"1f3c7","unicode_alternates":"","name":"horse racing","shortname":":horse_racing:","category":"activity","emoji_order":"448","aliases":[],"aliases_ascii":[],"keywords":["men","sport","horse racing"]},"levitate":{"unicode":"1f574","unicode_alternates":"1f574-fe0f","name":"man in business suit levitating","shortname":":levitate:","category":"activity","emoji_order":"449","aliases":[":man_in_business_suit_levitating:"],"aliases_ascii":[],"keywords":["men","job","job"]},"trophy":{"unicode":"1f3c6","unicode_alternates":"","name":"trophy","shortname":":trophy:","category":"activity","emoji_order":"450","aliases":[],"aliases_ascii":[],"keywords":["object","game","award","win","win","perfect","perfect","parties","parties"]},"running_shirt_with_sash":{"unicode":"1f3bd","unicode_alternates":"","name":"running shirt with sash","shortname":":running_shirt_with_sash:","category":"activity","emoji_order":"451","aliases":[],"aliases_ascii":[],"keywords":["award"]},"medal":{"unicode":"1f3c5","unicode_alternates":"","name":"sports medal","shortname":":medal:","category":"activity","emoji_order":"452","aliases":[":sports_medal:"],"aliases_ascii":[],"keywords":["object","award","sport","win","win","perfect","perfect"]},"military_medal":{"unicode":"1f396","unicode_alternates":"1f396-fe0f","name":"military medal","shortname":":military_medal:","category":"activity","emoji_order":"453","aliases":[],"aliases_ascii":[],"keywords":["object","award","win","win"]},"reminder_ribbon":{"unicode":"1f397","unicode_alternates":"1f397-fe0f","name":"reminder ribbon","shortname":":reminder_ribbon:","category":"activity","emoji_order":"454","aliases":[],"aliases_ascii":[],"keywords":["award"]},"rosette":{"unicode":"1f3f5","unicode_alternates":"1f3f5-fe0f","name":"rosette","shortname":":rosette:","category":"activity","emoji_order":"455","aliases":[],"aliases_ascii":[],"keywords":["tropical"]},"ticket":{"unicode":"1f3ab","unicode_alternates":"","name":"ticket","shortname":":ticket:","category":"activity","emoji_order":"456","aliases":[],"aliases_ascii":[],"keywords":["theatre","movie","parties","parties"]},"tickets":{"unicode":"1f39f","unicode_alternates":"1f39f-fe0f","name":"admission tickets","shortname":":tickets:","category":"activity","emoji_order":"457","aliases":[":admission_tickets:"],"aliases_ascii":[],"keywords":["theatre","movie","parties","parties"]},"performing_arts":{"unicode":"1f3ad","unicode_alternates":"","name":"performing arts","shortname":":performing_arts:","category":"activity","emoji_order":"458","aliases":[],"aliases_ascii":[],"keywords":["theatre","movie"]},"art":{"unicode":"1f3a8","unicode_alternates":"","name":"artist palette","shortname":":art:","category":"activity","emoji_order":"459","aliases":[],"aliases_ascii":[],"keywords":[]},"circus_tent":{"unicode":"1f3aa","unicode_alternates":"","name":"circus tent","shortname":":circus_tent:","category":"activity","emoji_order":"460","aliases":[],"aliases_ascii":[],"keywords":["circus tent"]},"microphone":{"unicode":"1f3a4","unicode_alternates":"","name":"microphone","shortname":":microphone:","category":"activity","emoji_order":"461","aliases":[],"aliases_ascii":[],"keywords":["instruments"]},"headphones":{"unicode":"1f3a7","unicode_alternates":"","name":"headphone","shortname":":headphones:","category":"activity","emoji_order":"462","aliases":[],"aliases_ascii":[],"keywords":["instruments"]},"musical_score":{"unicode":"1f3bc","unicode_alternates":"","name":"musical score","shortname":":musical_score:","category":"activity","emoji_order":"463","aliases":[],"aliases_ascii":[],"keywords":["instruments"]},"musical_keyboard":{"unicode":"1f3b9","unicode_alternates":"","name":"musical keyboard","shortname":":musical_keyboard:","category":"activity","emoji_order":"464","aliases":[],"aliases_ascii":[],"keywords":["instruments"]},"saxophone":{"unicode":"1f3b7","unicode_alternates":"","name":"saxophone","shortname":":saxophone:","category":"activity","emoji_order":"465","aliases":[],"aliases_ascii":[],"keywords":["instruments"]},"trumpet":{"unicode":"1f3ba","unicode_alternates":"","name":"trumpet","shortname":":trumpet:","category":"activity","emoji_order":"466","aliases":[],"aliases_ascii":[],"keywords":["instruments"]},"guitar":{"unicode":"1f3b8","unicode_alternates":"","name":"guitar","shortname":":guitar:","category":"activity","emoji_order":"467","aliases":[],"aliases_ascii":[],"keywords":["instruments"]},"violin":{"unicode":"1f3bb","unicode_alternates":"","name":"violin","shortname":":violin:","category":"activity","emoji_order":"468","aliases":[],"aliases_ascii":[],"keywords":["instruments","sarcastic","sarcastic"]},"clapper":{"unicode":"1f3ac","unicode_alternates":"","name":"clapper board","shortname":":clapper:","category":"activity","emoji_order":"469","aliases":[],"aliases_ascii":[],"keywords":["movie"]},"video_game":{"unicode":"1f3ae","unicode_alternates":"","name":"video game","shortname":":video_game:","category":"activity","emoji_order":"470","aliases":[],"aliases_ascii":[],"keywords":["electronics","game","boys night","boys night"]},"space_invader":{"unicode":"1f47e","unicode_alternates":"","name":"alien monster","shortname":":space_invader:","category":"activity","emoji_order":"471","aliases":[],"aliases_ascii":[],"keywords":["monster","alien"]},"dart":{"unicode":"1f3af","unicode_alternates":"","name":"direct hit","shortname":":dart:","category":"activity","emoji_order":"472","aliases":[],"aliases_ascii":[],"keywords":["game","sport","boys night","boys night"]},"game_die":{"unicode":"1f3b2","unicode_alternates":"","name":"game die","shortname":":game_die:","category":"activity","emoji_order":"473","aliases":[],"aliases_ascii":[],"keywords":["object","game","boys night","boys night"]},"slot_machine":{"unicode":"1f3b0","unicode_alternates":"","name":"slot machine","shortname":":slot_machine:","category":"activity","emoji_order":"474","aliases":[],"aliases_ascii":[],"keywords":["game","boys night","boys night"]},"bowling":{"unicode":"1f3b3","unicode_alternates":"","name":"bowling","shortname":":bowling:","category":"activity","emoji_order":"475","aliases":[],"aliases_ascii":[],"keywords":["game","ball","sport","boys night","boys night"]},"red_car":{"unicode":"1f697","unicode_alternates":"","name":"automobile","shortname":":red_car:","category":"travel","emoji_order":"476","aliases":[],"aliases_ascii":[],"keywords":["transportation","car","travel"]},"taxi":{"unicode":"1f695","unicode_alternates":"","name":"taxi","shortname":":taxi:","category":"travel","emoji_order":"477","aliases":[],"aliases_ascii":[],"keywords":["transportation","car","travel"]},"blue_car":{"unicode":"1f699","unicode_alternates":"","name":"recreational vehicle","shortname":":blue_car:","category":"travel","emoji_order":"478","aliases":[],"aliases_ascii":[],"keywords":["transportation","car","travel"]},"bus":{"unicode":"1f68c","unicode_alternates":"","name":"bus","shortname":":bus:","category":"travel","emoji_order":"479","aliases":[],"aliases_ascii":[],"keywords":["transportation","bus","office"]},"trolleybus":{"unicode":"1f68e","unicode_alternates":"","name":"trolleybus","shortname":":trolleybus:","category":"travel","emoji_order":"480","aliases":[],"aliases_ascii":[],"keywords":["transportation","bus","travel"]},"race_car":{"unicode":"1f3ce","unicode_alternates":"1f3ce-fe0f","name":"racing car","shortname":":race_car:","category":"travel","emoji_order":"481","aliases":[":racing_car:"],"aliases_ascii":[],"keywords":["transportation","car"]},"police_car":{"unicode":"1f693","unicode_alternates":"","name":"police car","shortname":":police_car:","category":"travel","emoji_order":"482","aliases":[],"aliases_ascii":[],"keywords":["transportation","car","police","police","911","911"]},"ambulance":{"unicode":"1f691","unicode_alternates":"","name":"ambulance","shortname":":ambulance:","category":"travel","emoji_order":"483","aliases":[],"aliases_ascii":[],"keywords":["transportation","911","911"]},"fire_engine":{"unicode":"1f692","unicode_alternates":"","name":"fire engine","shortname":":fire_engine:","category":"travel","emoji_order":"484","aliases":[],"aliases_ascii":[],"keywords":["transportation","truck","911","911"]},"minibus":{"unicode":"1f690","unicode_alternates":"","name":"minibus","shortname":":minibus:","category":"travel","emoji_order":"485","aliases":[],"aliases_ascii":[],"keywords":["transportation","bus"]},"truck":{"unicode":"1f69a","unicode_alternates":"","name":"delivery truck","shortname":":truck:","category":"travel","emoji_order":"486","aliases":[],"aliases_ascii":[],"keywords":["transportation","truck"]},"articulated_lorry":{"unicode":"1f69b","unicode_alternates":"","name":"articulated lorry","shortname":":articulated_lorry:","category":"travel","emoji_order":"487","aliases":[],"aliases_ascii":[],"keywords":["transportation","truck"]},"tractor":{"unicode":"1f69c","unicode_alternates":"","name":"tractor","shortname":":tractor:","category":"travel","emoji_order":"488","aliases":[],"aliases_ascii":[],"keywords":["transportation"]},"motorcycle":{"unicode":"1f3cd","unicode_alternates":"1f3cd-fe0f","name":"racing motorcycle","shortname":":motorcycle:","category":"travel","emoji_order":"489","aliases":[":racing_motorcycle:"],"aliases_ascii":[],"keywords":["transportation","travel","bike"]},"bike":{"unicode":"1f6b2","unicode_alternates":"","name":"bicycle","shortname":":bike:","category":"travel","emoji_order":"490","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","bike"]},"rotating_light":{"unicode":"1f6a8","unicode_alternates":"","name":"police cars revolving light","shortname":":rotating_light:","category":"travel","emoji_order":"491","aliases":[],"aliases_ascii":[],"keywords":["transportation","object","police","police","911","911"]},"oncoming_police_car":{"unicode":"1f694","unicode_alternates":"","name":"oncoming police car","shortname":":oncoming_police_car:","category":"travel","emoji_order":"492","aliases":[],"aliases_ascii":[],"keywords":["transportation","car","police","police","911","911"]},"oncoming_bus":{"unicode":"1f68d","unicode_alternates":"","name":"oncoming bus","shortname":":oncoming_bus:","category":"travel","emoji_order":"493","aliases":[],"aliases_ascii":[],"keywords":["transportation","bus","travel"]},"oncoming_automobile":{"unicode":"1f698","unicode_alternates":"","name":"oncoming automobile","shortname":":oncoming_automobile:","category":"travel","emoji_order":"494","aliases":[],"aliases_ascii":[],"keywords":["transportation","car","travel"]},"oncoming_taxi":{"unicode":"1f696","unicode_alternates":"","name":"oncoming taxi","shortname":":oncoming_taxi:","category":"travel","emoji_order":"495","aliases":[],"aliases_ascii":[],"keywords":["transportation","car","travel"]},"aerial_tramway":{"unicode":"1f6a1","unicode_alternates":"","name":"aerial tramway","shortname":":aerial_tramway:","category":"travel","emoji_order":"496","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"mountain_cableway":{"unicode":"1f6a0","unicode_alternates":"","name":"mountain cableway","shortname":":mountain_cableway:","category":"travel","emoji_order":"497","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"suspension_railway":{"unicode":"1f69f","unicode_alternates":"","name":"suspension railway","shortname":":suspension_railway:","category":"travel","emoji_order":"498","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"railway_car":{"unicode":"1f683","unicode_alternates":"","name":"railway car","shortname":":railway_car:","category":"travel","emoji_order":"499","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"train":{"unicode":"1f68b","unicode_alternates":"","name":"tram car","shortname":":train:","category":"travel","emoji_order":"500","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"monorail":{"unicode":"1f69d","unicode_alternates":"","name":"monorail","shortname":":monorail:","category":"travel","emoji_order":"501","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train","vacation"]},"bullettrain_side":{"unicode":"1f684","unicode_alternates":"","name":"high-speed train","shortname":":bullettrain_side:","category":"travel","emoji_order":"502","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"bullettrain_front":{"unicode":"1f685","unicode_alternates":"","name":"high-speed train with bullet nose","shortname":":bullettrain_front:","category":"travel","emoji_order":"503","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"light_rail":{"unicode":"1f688","unicode_alternates":"","name":"light rail","shortname":":light_rail:","category":"travel","emoji_order":"504","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"mountain_railway":{"unicode":"1f69e","unicode_alternates":"","name":"mountain railway","shortname":":mountain_railway:","category":"travel","emoji_order":"505","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"steam_locomotive":{"unicode":"1f682","unicode_alternates":"","name":"steam locomotive","shortname":":steam_locomotive:","category":"travel","emoji_order":"506","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train","steam","steam"]},"train2":{"unicode":"1f686","unicode_alternates":"","name":"train","shortname":":train2:","category":"travel","emoji_order":"507","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"metro":{"unicode":"1f687","unicode_alternates":"","name":"metro","shortname":":metro:","category":"travel","emoji_order":"508","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"tram":{"unicode":"1f68a","unicode_alternates":"","name":"tram","shortname":":tram:","category":"travel","emoji_order":"509","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"station":{"unicode":"1f689","unicode_alternates":"","name":"station","shortname":":station:","category":"travel","emoji_order":"510","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","train"]},"helicopter":{"unicode":"1f681","unicode_alternates":"","name":"helicopter","shortname":":helicopter:","category":"travel","emoji_order":"511","aliases":[],"aliases_ascii":[],"keywords":["transportation","plane","travel","fly","fly"]},"airplane_small":{"unicode":"1f6e9","unicode_alternates":"1f6e9-fe0f","name":"small airplane","shortname":":airplane_small:","category":"travel","emoji_order":"512","aliases":[":small_airplane:"],"aliases_ascii":[],"keywords":["transportation","plane","travel","vacation","fly","fly"]},"airplane":{"unicode":"2708","unicode_alternates":"2708-fe0f","name":"airplane","shortname":":airplane:","category":"travel","emoji_order":"513","aliases":[],"aliases_ascii":[],"keywords":["transportation","plane","travel","vacation","fly","fly"]},"airplane_departure":{"unicode":"1f6eb","unicode_alternates":"","name":"airplane departure","shortname":":airplane_departure:","category":"travel","emoji_order":"514","aliases":[],"aliases_ascii":[],"keywords":["transportation","plane","travel","vacation","fly","fly"]},"airplane_arriving":{"unicode":"1f6ec","unicode_alternates":"","name":"airplane arriving","shortname":":airplane_arriving:","category":"travel","emoji_order":"515","aliases":[],"aliases_ascii":[],"keywords":["transportation","plane","travel","vacation","fly","fly"]},"sailboat":{"unicode":"26f5","unicode_alternates":"26f5-fe0f","name":"sailboat","shortname":":sailboat:","category":"travel","emoji_order":"516","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","boat","vacation"]},"motorboat":{"unicode":"1f6e5","unicode_alternates":"1f6e5-fe0f","name":"motorboat","shortname":":motorboat:","category":"travel","emoji_order":"517","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","boat"]},"speedboat":{"unicode":"1f6a4","unicode_alternates":"","name":"speedboat","shortname":":speedboat:","category":"travel","emoji_order":"518","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","boat","vacation","tropical"]},"ferry":{"unicode":"26f4","unicode_alternates":"26f4-fe0f","name":"ferry","shortname":":ferry:","category":"travel","emoji_order":"519","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","boat","vacation"]},"cruise_ship":{"unicode":"1f6f3","unicode_alternates":"1f6f3-fe0f","name":"passenger ship","shortname":":cruise_ship:","category":"travel","emoji_order":"520","aliases":[":passenger_ship:"],"aliases_ascii":[],"keywords":["transportation","travel","boat","vacation"]},"rocket":{"unicode":"1f680","unicode_alternates":"","name":"rocket","shortname":":rocket:","category":"travel","emoji_order":"521","aliases":[],"aliases_ascii":[],"keywords":["transportation","object","space","fly","fly","blast","blast"]},"satellite_orbital":{"unicode":"1f6f0","unicode_alternates":"1f6f0-fe0f","name":"satellite","shortname":":satellite_orbital:","category":"travel","emoji_order":"522","aliases":[],"aliases_ascii":[],"keywords":["object"]},"seat":{"unicode":"1f4ba","unicode_alternates":"","name":"seat","shortname":":seat:","category":"travel","emoji_order":"523","aliases":[],"aliases_ascii":[],"keywords":["transportation","object","travel","vacation"]},"anchor":{"unicode":"2693","unicode_alternates":"2693-fe0f","name":"anchor","shortname":":anchor:","category":"travel","emoji_order":"524","aliases":[],"aliases_ascii":[],"keywords":["object","travel","boat","vacation"]},"construction":{"unicode":"1f6a7","unicode_alternates":"","name":"construction sign","shortname":":construction:","category":"travel","emoji_order":"525","aliases":[],"aliases_ascii":[],"keywords":["object"]},"fuelpump":{"unicode":"26fd","unicode_alternates":"26fd-fe0f","name":"fuel pump","shortname":":fuelpump:","category":"travel","emoji_order":"526","aliases":[],"aliases_ascii":[],"keywords":["object","gas pump"]},"busstop":{"unicode":"1f68f","unicode_alternates":"","name":"bus stop","shortname":":busstop:","category":"travel","emoji_order":"527","aliases":[],"aliases_ascii":[],"keywords":["object"]},"vertical_traffic_light":{"unicode":"1f6a6","unicode_alternates":"","name":"vertical traffic light","shortname":":vertical_traffic_light:","category":"travel","emoji_order":"528","aliases":[],"aliases_ascii":[],"keywords":["object","stop light"]},"traffic_light":{"unicode":"1f6a5","unicode_alternates":"","name":"horizontal traffic light","shortname":":traffic_light:","category":"travel","emoji_order":"529","aliases":[],"aliases_ascii":[],"keywords":["object","stop light"]},"checkered_flag":{"unicode":"1f3c1","unicode_alternates":"","name":"chequered flag","shortname":":checkered_flag:","category":"travel","emoji_order":"530","aliases":[],"aliases_ascii":[],"keywords":["object"]},"ship":{"unicode":"1f6a2","unicode_alternates":"","name":"ship","shortname":":ship:","category":"travel","emoji_order":"531","aliases":[],"aliases_ascii":[],"keywords":["transportation","travel","boat","vacation"]},"ferris_wheel":{"unicode":"1f3a1","unicode_alternates":"","name":"ferris wheel","shortname":":ferris_wheel:","category":"travel","emoji_order":"532","aliases":[],"aliases_ascii":[],"keywords":["places","vacation","ferris wheel"]},"roller_coaster":{"unicode":"1f3a2","unicode_alternates":"","name":"roller coaster","shortname":":roller_coaster:","category":"travel","emoji_order":"533","aliases":[],"aliases_ascii":[],"keywords":["places","vacation","roller coaster"]},"carousel_horse":{"unicode":"1f3a0","unicode_alternates":"","name":"carousel horse","shortname":":carousel_horse:","category":"travel","emoji_order":"534","aliases":[],"aliases_ascii":[],"keywords":["places","object","vacation","roller coaster","carousel"]},"construction_site":{"unicode":"1f3d7","unicode_alternates":"1f3d7-fe0f","name":"building construction","shortname":":construction_site:","category":"travel","emoji_order":"535","aliases":[":building_construction:"],"aliases_ascii":[],"keywords":["building","crane"]},"foggy":{"unicode":"1f301","unicode_alternates":"","name":"foggy","shortname":":foggy:","category":"travel","emoji_order":"536","aliases":[],"aliases_ascii":[],"keywords":["places","building","sky","travel","vacation"]},"tokyo_tower":{"unicode":"1f5fc","unicode_alternates":"","name":"tokyo tower","shortname":":tokyo_tower:","category":"travel","emoji_order":"537","aliases":[],"aliases_ascii":[],"keywords":["places","travel","vacation","eiffel tower"]},"factory":{"unicode":"1f3ed","unicode_alternates":"","name":"factory","shortname":":factory:","category":"travel","emoji_order":"538","aliases":[],"aliases_ascii":[],"keywords":["places","building","travel","steam","steam"]},"fountain":{"unicode":"26f2","unicode_alternates":"26f2-fe0f","name":"fountain","shortname":":fountain:","category":"travel","emoji_order":"539","aliases":[],"aliases_ascii":[],"keywords":["travel","vacation"]},"rice_scene":{"unicode":"1f391","unicode_alternates":"","name":"moon viewing ceremony","shortname":":rice_scene:","category":"travel","emoji_order":"540","aliases":[],"aliases_ascii":[],"keywords":["places","space","sky","travel"]},"mountain":{"unicode":"26f0","unicode_alternates":"26f0-fe0f","name":"mountain","shortname":":mountain:","category":"travel","emoji_order":"541","aliases":[],"aliases_ascii":[],"keywords":["places","travel","vacation","camp"]},"mountain_snow":{"unicode":"1f3d4","unicode_alternates":"1f3d4-fe0f","name":"snow capped mountain","shortname":":mountain_snow:","category":"travel","emoji_order":"542","aliases":[":snow_capped_mountain:"],"aliases_ascii":[],"keywords":["places","travel","vacation","cold","camp"]},"mount_fuji":{"unicode":"1f5fb","unicode_alternates":"","name":"mount fuji","shortname":":mount_fuji:","category":"travel","emoji_order":"543","aliases":[],"aliases_ascii":[],"keywords":["places","travel","vacation","cold","camp"]},"volcano":{"unicode":"1f30b","unicode_alternates":"","name":"volcano","shortname":":volcano:","category":"travel","emoji_order":"544","aliases":[],"aliases_ascii":[],"keywords":["places","tropical"]},"japan":{"unicode":"1f5fe","unicode_alternates":"","name":"silhouette of japan","shortname":":japan:","category":"travel","emoji_order":"545","aliases":[],"aliases_ascii":[],"keywords":["places","travel","map","vacation","tropical"]},"camping":{"unicode":"1f3d5","unicode_alternates":"1f3d5-fe0f","name":"camping","shortname":":camping:","category":"travel","emoji_order":"546","aliases":[],"aliases_ascii":[],"keywords":["places","travel","vacation","camp"]},"tent":{"unicode":"26fa","unicode_alternates":"26fa-fe0f","name":"tent","shortname":":tent:","category":"travel","emoji_order":"547","aliases":[],"aliases_ascii":[],"keywords":["places","travel","vacation","camp"]},"park":{"unicode":"1f3de","unicode_alternates":"1f3de-fe0f","name":"national park","shortname":":park:","category":"travel","emoji_order":"548","aliases":[":national_park:"],"aliases_ascii":[],"keywords":["travel","vacation","park","camp"]},"motorway":{"unicode":"1f6e3","unicode_alternates":"1f6e3-fe0f","name":"motorway","shortname":":motorway:","category":"travel","emoji_order":"549","aliases":[],"aliases_ascii":[],"keywords":["travel","vacation","camp"]},"railway_track":{"unicode":"1f6e4","unicode_alternates":"1f6e4-fe0f","name":"railway track","shortname":":railway_track:","category":"travel","emoji_order":"550","aliases":[":railroad_track:"],"aliases_ascii":[],"keywords":["travel","train","vacation"]},"sunrise":{"unicode":"1f305","unicode_alternates":"","name":"sunrise","shortname":":sunrise:","category":"travel","emoji_order":"551","aliases":[],"aliases_ascii":[],"keywords":["places","sky","travel","vacation","tropical","day","sun","hump day","hump day","morning","morning"]},"sunrise_over_mountains":{"unicode":"1f304","unicode_alternates":"","name":"sunrise over mountains","shortname":":sunrise_over_mountains:","category":"travel","emoji_order":"552","aliases":[],"aliases_ascii":[],"keywords":["places","sky","travel","vacation","day","sun","camp","morning","morning"]},"desert":{"unicode":"1f3dc","unicode_alternates":"1f3dc-fe0f","name":"desert","shortname":":desert:","category":"travel","emoji_order":"553","aliases":[],"aliases_ascii":[],"keywords":["places","travel","vacation","hot","hot"]},"beach":{"unicode":"1f3d6","unicode_alternates":"1f3d6-fe0f","name":"beach with umbrella","shortname":":beach:","category":"travel","emoji_order":"554","aliases":[":beach_with_umbrella:"],"aliases_ascii":[],"keywords":["places","travel","vacation","tropical","beach","swim"]},"island":{"unicode":"1f3dd","unicode_alternates":"1f3dd-fe0f","name":"desert island","shortname":":island:","category":"travel","emoji_order":"555","aliases":[":desert_island:"],"aliases_ascii":[],"keywords":["places","travel","vacation","tropical","beach","swim"]},"city_sunset":{"unicode":"1f307","unicode_alternates":"","name":"sunset over buildings","shortname":":city_sunset:","category":"travel","emoji_order":"556","aliases":[":city_sunrise:"],"aliases_ascii":[],"keywords":["places","building","sky","vacation"]},"city_dusk":{"unicode":"1f306","unicode_alternates":"","name":"cityscape at dusk","shortname":":city_dusk:","category":"travel","emoji_order":"557","aliases":[],"aliases_ascii":[],"keywords":["places","building"]},"cityscape":{"unicode":"1f3d9","unicode_alternates":"1f3d9-fe0f","name":"cityscape","shortname":":cityscape:","category":"travel","emoji_order":"558","aliases":[],"aliases_ascii":[],"keywords":["places","building","vacation"]},"night_with_stars":{"unicode":"1f303","unicode_alternates":"","name":"night with stars","shortname":":night_with_stars:","category":"travel","emoji_order":"559","aliases":[],"aliases_ascii":[],"keywords":["places","building","sky","vacation","goodnight","goodnight"]},"bridge_at_night":{"unicode":"1f309","unicode_alternates":"","name":"bridge at night","shortname":":bridge_at_night:","category":"travel","emoji_order":"560","aliases":[],"aliases_ascii":[],"keywords":["places","travel","vacation","goodnight","goodnight"]},"milky_way":{"unicode":"1f30c","unicode_alternates":"","name":"milky way","shortname":":milky_way:","category":"travel","emoji_order":"561","aliases":[],"aliases_ascii":[],"keywords":["places","space","sky","travel","vacation"]},"stars":{"unicode":"1f320","unicode_alternates":"","name":"shooting star","shortname":":stars:","category":"travel","emoji_order":"562","aliases":[],"aliases_ascii":[],"keywords":["space"]},"sparkler":{"unicode":"1f387","unicode_alternates":"","name":"firework sparkler","shortname":":sparkler:","category":"travel","emoji_order":"563","aliases":[],"aliases_ascii":[],"keywords":["parties","parties"]},"fireworks":{"unicode":"1f386","unicode_alternates":"","name":"fireworks","shortname":":fireworks:","category":"travel","emoji_order":"564","aliases":[],"aliases_ascii":[],"keywords":["parties","parties"]},"rainbow":{"unicode":"1f308","unicode_alternates":"","name":"rainbow","shortname":":rainbow:","category":"travel","emoji_order":"565","aliases":[],"aliases_ascii":[],"keywords":["weather","gay","sky","rain"]},"homes":{"unicode":"1f3d8","unicode_alternates":"1f3d8-fe0f","name":"house buildings","shortname":":homes:","category":"travel","emoji_order":"566","aliases":[":house_buildings:"],"aliases_ascii":[],"keywords":["places","building","house"]},"european_castle":{"unicode":"1f3f0","unicode_alternates":"","name":"european castle","shortname":":european_castle:","category":"travel","emoji_order":"567","aliases":[],"aliases_ascii":[],"keywords":["places","building","travel","vacation"]},"japanese_castle":{"unicode":"1f3ef","unicode_alternates":"","name":"japanese castle","shortname":":japanese_castle:","category":"travel","emoji_order":"568","aliases":[],"aliases_ascii":[],"keywords":["places","building","travel","vacation"]},"stadium":{"unicode":"1f3df","unicode_alternates":"1f3df-fe0f","name":"stadium","shortname":":stadium:","category":"travel","emoji_order":"569","aliases":[],"aliases_ascii":[],"keywords":["places","building","travel","vacation","boys night","boys night"]},"statue_of_liberty":{"unicode":"1f5fd","unicode_alternates":"","name":"statue of liberty","shortname":":statue_of_liberty:","category":"travel","emoji_order":"570","aliases":[],"aliases_ascii":[],"keywords":["places","america","travel","vacation","statue of liberty","free speech","free speech"]},"house":{"unicode":"1f3e0","unicode_alternates":"","name":"house building","shortname":":house:","category":"travel","emoji_order":"571","aliases":[],"aliases_ascii":[],"keywords":["places","building","house"]},"house_with_garden":{"unicode":"1f3e1","unicode_alternates":"","name":"house with garden","shortname":":house_with_garden:","category":"travel","emoji_order":"572","aliases":[],"aliases_ascii":[],"keywords":["places","building","house"]},"house_abandoned":{"unicode":"1f3da","unicode_alternates":"1f3da-fe0f","name":"derelict house building","shortname":":house_abandoned:","category":"travel","emoji_order":"573","aliases":[":derelict_house_building:"],"aliases_ascii":[],"keywords":["places","building","house"]},"office":{"unicode":"1f3e2","unicode_alternates":"","name":"office building","shortname":":office:","category":"travel","emoji_order":"574","aliases":[],"aliases_ascii":[],"keywords":["places","building","work"]},"department_store":{"unicode":"1f3ec","unicode_alternates":"","name":"department store","shortname":":department_store:","category":"travel","emoji_order":"575","aliases":[],"aliases_ascii":[],"keywords":["places","building"]},"post_office":{"unicode":"1f3e3","unicode_alternates":"","name":"japanese post office","shortname":":post_office:","category":"travel","emoji_order":"576","aliases":[],"aliases_ascii":[],"keywords":["places","building","post office"]},"european_post_office":{"unicode":"1f3e4","unicode_alternates":"","name":"european post office","shortname":":european_post_office:","category":"travel","emoji_order":"577","aliases":[],"aliases_ascii":[],"keywords":["places","building","post office"]},"hospital":{"unicode":"1f3e5","unicode_alternates":"","name":"hospital","shortname":":hospital:","category":"travel","emoji_order":"578","aliases":[],"aliases_ascii":[],"keywords":["places","building","health","911","911"]},"bank":{"unicode":"1f3e6","unicode_alternates":"","name":"bank","shortname":":bank:","category":"travel","emoji_order":"579","aliases":[],"aliases_ascii":[],"keywords":["places","building"]},"hotel":{"unicode":"1f3e8","unicode_alternates":"","name":"hotel","shortname":":hotel:","category":"travel","emoji_order":"580","aliases":[],"aliases_ascii":[],"keywords":["places","building","vacation"]},"convenience_store":{"unicode":"1f3ea","unicode_alternates":"","name":"convenience store","shortname":":convenience_store:","category":"travel","emoji_order":"581","aliases":[],"aliases_ascii":[],"keywords":["places","building"]},"school":{"unicode":"1f3eb","unicode_alternates":"","name":"school","shortname":":school:","category":"travel","emoji_order":"582","aliases":[],"aliases_ascii":[],"keywords":["places","building"]},"love_hotel":{"unicode":"1f3e9","unicode_alternates":"","name":"love hotel","shortname":":love_hotel:","category":"travel","emoji_order":"583","aliases":[],"aliases_ascii":[],"keywords":["places","building","love"]},"wedding":{"unicode":"1f492","unicode_alternates":"","name":"wedding","shortname":":wedding:","category":"travel","emoji_order":"584","aliases":[],"aliases_ascii":[],"keywords":["places","wedding","building","love","parties","parties"]},"classical_building":{"unicode":"1f3db","unicode_alternates":"1f3db-fe0f","name":"classical building","shortname":":classical_building:","category":"travel","emoji_order":"585","aliases":[],"aliases_ascii":[],"keywords":["places","building","travel","vacation"]},"church":{"unicode":"26ea","unicode_alternates":"26ea-fe0f","name":"church","shortname":":church:","category":"travel","emoji_order":"586","aliases":[],"aliases_ascii":[],"keywords":["places","wedding","religion","building","condolence","condolence"]},"mosque":{"unicode":"1f54c","unicode_alternates":"","name":"mosque","shortname":":mosque:","category":"travel","emoji_order":"587","aliases":[],"aliases_ascii":[],"keywords":["places","religion","building","vacation","condolence","condolence"]},"synagogue":{"unicode":"1f54d","unicode_alternates":"","name":"synagogue","shortname":":synagogue:","category":"travel","emoji_order":"588","aliases":[],"aliases_ascii":[],"keywords":["places","religion","building","travel","vacation","condolence","condolence"]},"kaaba":{"unicode":"1f54b","unicode_alternates":"","name":"kaaba","shortname":":kaaba:","category":"travel","emoji_order":"589","aliases":[],"aliases_ascii":[],"keywords":["places","religion","building","condolence","condolence"]},"shinto_shrine":{"unicode":"26e9","unicode_alternates":"26e9-fe0f","name":"shinto shrine","shortname":":shinto_shrine:","category":"travel","emoji_order":"590","aliases":[],"aliases_ascii":[],"keywords":["places","building","travel","vacation"]},"watch":{"unicode":"231a","unicode_alternates":"231a-fe0f","name":"watch","shortname":":watch:","category":"objects","emoji_order":"591","aliases":[],"aliases_ascii":[],"keywords":["electronics","time"]},"iphone":{"unicode":"1f4f1","unicode_alternates":"","name":"mobile phone","shortname":":iphone:","category":"objects","emoji_order":"592","aliases":[],"aliases_ascii":[],"keywords":["electronics","phone","selfie","selfie"]},"calling":{"unicode":"1f4f2","unicode_alternates":"","name":"mobile phone with rightwards arrow at left","shortname":":calling:","category":"objects","emoji_order":"593","aliases":[],"aliases_ascii":[],"keywords":["electronics","phone","selfie","selfie"]},"computer":{"unicode":"1f4bb","unicode_alternates":"","name":"personal computer","shortname":":computer:","category":"objects","emoji_order":"594","aliases":[],"aliases_ascii":[],"keywords":["electronics","work","office"]},"keyboard":{"unicode":"2328","unicode_alternates":"2328-fe0f","name":"keyboard","shortname":":keyboard:","category":"objects","emoji_order":"595","aliases":[],"aliases_ascii":[],"keywords":["electronics","work","office"]},"desktop":{"unicode":"1f5a5","unicode_alternates":"1f5a5-fe0f","name":"desktop computer","shortname":":desktop:","category":"objects","emoji_order":"596","aliases":[":desktop_computer:"],"aliases_ascii":[],"keywords":["electronics","work"]},"printer":{"unicode":"1f5a8","unicode_alternates":"1f5a8-fe0f","name":"printer","shortname":":printer:","category":"objects","emoji_order":"597","aliases":[],"aliases_ascii":[],"keywords":["electronics","work","office"]},"mouse_three_button":{"unicode":"1f5b1","unicode_alternates":"1f5b1-fe0f","name":"three button mouse","shortname":":mouse_three_button:","category":"objects","emoji_order":"598","aliases":[":three_button_mouse:"],"aliases_ascii":[],"keywords":["electronics","work","game","office"]},"trackball":{"unicode":"1f5b2","unicode_alternates":"1f5b2-fe0f","name":"trackball","shortname":":trackball:","category":"objects","emoji_order":"599","aliases":[],"aliases_ascii":[],"keywords":["electronics","work","game","office"]},"joystick":{"unicode":"1f579","unicode_alternates":"1f579-fe0f","name":"joystick","shortname":":joystick:","category":"objects","emoji_order":"600","aliases":[],"aliases_ascii":[],"keywords":["electronics","game","boys night","boys night"]},"compression":{"unicode":"1f5dc","unicode_alternates":"1f5dc-fe0f","name":"compression","shortname":":compression:","category":"objects","emoji_order":"601","aliases":[],"aliases_ascii":[],"keywords":[]},"minidisc":{"unicode":"1f4bd","unicode_alternates":"","name":"minidisc","shortname":":minidisc:","category":"objects","emoji_order":"602","aliases":[],"aliases_ascii":[],"keywords":["electronics"]},"floppy_disk":{"unicode":"1f4be","unicode_alternates":"","name":"floppy disk","shortname":":floppy_disk:","category":"objects","emoji_order":"603","aliases":[],"aliases_ascii":[],"keywords":["electronics","office"]},"cd":{"unicode":"1f4bf","unicode_alternates":"","name":"optical disc","shortname":":cd:","category":"objects","emoji_order":"604","aliases":[],"aliases_ascii":[],"keywords":["electronics"]},"dvd":{"unicode":"1f4c0","unicode_alternates":"","name":"dvd","shortname":":dvd:","category":"objects","emoji_order":"605","aliases":[],"aliases_ascii":[],"keywords":["electronics"]},"vhs":{"unicode":"1f4fc","unicode_alternates":"","name":"videocassette","shortname":":vhs:","category":"objects","emoji_order":"606","aliases":[],"aliases_ascii":[],"keywords":["electronics"]},"camera":{"unicode":"1f4f7","unicode_alternates":"","name":"camera","shortname":":camera:","category":"objects","emoji_order":"607","aliases":[],"aliases_ascii":[],"keywords":["electronics","camera","selfie","selfie"]},"camera_with_flash":{"unicode":"1f4f8","unicode_alternates":"","name":"camera with flash","shortname":":camera_with_flash:","category":"objects","emoji_order":"608","aliases":[],"aliases_ascii":[],"keywords":["electronics","camera"]},"video_camera":{"unicode":"1f4f9","unicode_alternates":"","name":"video camera","shortname":":video_camera:","category":"objects","emoji_order":"609","aliases":[],"aliases_ascii":[],"keywords":["electronics","camera","movie"]},"movie_camera":{"unicode":"1f3a5","unicode_alternates":"","name":"movie camera","shortname":":movie_camera:","category":"objects","emoji_order":"610","aliases":[],"aliases_ascii":[],"keywords":["object","camera","movie"]},"projector":{"unicode":"1f4fd","unicode_alternates":"1f4fd-fe0f","name":"film projector","shortname":":projector:","category":"objects","emoji_order":"611","aliases":[":film_projector:"],"aliases_ascii":[],"keywords":["object","camera","movie"]},"film_frames":{"unicode":"1f39e","unicode_alternates":"1f39e-fe0f","name":"film frames","shortname":":film_frames:","category":"objects","emoji_order":"612","aliases":[],"aliases_ascii":[],"keywords":["object","camera","movie"]},"telephone_receiver":{"unicode":"1f4de","unicode_alternates":"","name":"telephone receiver","shortname":":telephone_receiver:","category":"objects","emoji_order":"613","aliases":[],"aliases_ascii":[],"keywords":["electronics","phone"]},"telephone":{"unicode":"260e","unicode_alternates":"260e-fe0f","name":"black telephone","shortname":":telephone:","category":"objects","emoji_order":"614","aliases":[],"aliases_ascii":[],"keywords":["electronics","phone"]},"pager":{"unicode":"1f4df","unicode_alternates":"","name":"pager","shortname":":pager:","category":"objects","emoji_order":"615","aliases":[],"aliases_ascii":[],"keywords":["electronics","work"]},"fax":{"unicode":"1f4e0","unicode_alternates":"","name":"fax machine","shortname":":fax:","category":"objects","emoji_order":"616","aliases":[],"aliases_ascii":[],"keywords":["electronics","work","office"]},"tv":{"unicode":"1f4fa","unicode_alternates":"","name":"television","shortname":":tv:","category":"objects","emoji_order":"617","aliases":[],"aliases_ascii":[],"keywords":["electronics"]},"radio":{"unicode":"1f4fb","unicode_alternates":"","name":"radio","shortname":":radio:","category":"objects","emoji_order":"618","aliases":[],"aliases_ascii":[],"keywords":["electronics"]},"microphone2":{"unicode":"1f399","unicode_alternates":"1f399-fe0f","name":"studio microphone","shortname":":microphone2:","category":"objects","emoji_order":"619","aliases":[":studio_microphone:"],"aliases_ascii":[],"keywords":["electronics","object"]},"level_slider":{"unicode":"1f39a","unicode_alternates":"1f39a-fe0f","name":"level slider","shortname":":level_slider:","category":"objects","emoji_order":"620","aliases":[],"aliases_ascii":[],"keywords":[]},"control_knobs":{"unicode":"1f39b","unicode_alternates":"1f39b-fe0f","name":"control knobs","shortname":":control_knobs:","category":"objects","emoji_order":"621","aliases":[],"aliases_ascii":[],"keywords":["time"]},"stopwatch":{"unicode":"23f1","unicode_alternates":"23f1-fe0f","name":"stopwatch","shortname":":stopwatch:","category":"objects","emoji_order":"622","aliases":[],"aliases_ascii":[],"keywords":["electronics","time"]},"timer":{"unicode":"23f2","unicode_alternates":"23f2-fe0f","name":"timer clock","shortname":":timer:","category":"objects","emoji_order":"623","aliases":[":timer_clock:"],"aliases_ascii":[],"keywords":["object","time"]},"alarm_clock":{"unicode":"23f0","unicode_alternates":"","name":"alarm clock","shortname":":alarm_clock:","category":"objects","emoji_order":"624","aliases":[],"aliases_ascii":[],"keywords":["object","time"]},"clock":{"unicode":"1f570","unicode_alternates":"1f570-fe0f","name":"mantlepiece clock","shortname":":clock:","category":"objects","emoji_order":"625","aliases":[":mantlepiece_clock:"],"aliases_ascii":[],"keywords":["object","time"]},"hourglass_flowing_sand":{"unicode":"23f3","unicode_alternates":"","name":"hourglass with flowing sand","shortname":":hourglass_flowing_sand:","category":"objects","emoji_order":"626","aliases":[],"aliases_ascii":[],"keywords":["object","time"]},"hourglass":{"unicode":"231b","unicode_alternates":"231b-fe0f","name":"hourglass","shortname":":hourglass:","category":"objects","emoji_order":"627","aliases":[],"aliases_ascii":[],"keywords":["object","time"]},"satellite":{"unicode":"1f4e1","unicode_alternates":"","name":"satellite antenna","shortname":":satellite:","category":"objects","emoji_order":"628","aliases":[],"aliases_ascii":[],"keywords":["object"]},"battery":{"unicode":"1f50b","unicode_alternates":"","name":"battery","shortname":":battery:","category":"objects","emoji_order":"629","aliases":[],"aliases_ascii":[],"keywords":["object"]},"electric_plug":{"unicode":"1f50c","unicode_alternates":"","name":"electric plug","shortname":":electric_plug:","category":"objects","emoji_order":"630","aliases":[],"aliases_ascii":[],"keywords":["electronics"]},"bulb":{"unicode":"1f4a1","unicode_alternates":"","name":"electric light bulb","shortname":":bulb:","category":"objects","emoji_order":"631","aliases":[],"aliases_ascii":[],"keywords":["object","science"]},"flashlight":{"unicode":"1f526","unicode_alternates":"","name":"electric torch","shortname":":flashlight:","category":"objects","emoji_order":"632","aliases":[],"aliases_ascii":[],"keywords":["electronics","object"]},"candle":{"unicode":"1f56f","unicode_alternates":"1f56f-fe0f","name":"candle","shortname":":candle:","category":"objects","emoji_order":"633","aliases":[],"aliases_ascii":[],"keywords":["object"]},"wastebasket":{"unicode":"1f5d1","unicode_alternates":"1f5d1-fe0f","name":"wastebasket","shortname":":wastebasket:","category":"objects","emoji_order":"634","aliases":[],"aliases_ascii":[],"keywords":["object","work"]},"oil":{"unicode":"1f6e2","unicode_alternates":"1f6e2-fe0f","name":"oil drum","shortname":":oil:","category":"objects","emoji_order":"635","aliases":[":oil_drum:"],"aliases_ascii":[],"keywords":["object"]},"money_with_wings":{"unicode":"1f4b8","unicode_alternates":"","name":"money with wings","shortname":":money_with_wings:","category":"objects","emoji_order":"636","aliases":[],"aliases_ascii":[],"keywords":["money","money","boys night","boys night"]},"dollar":{"unicode":"1f4b5","unicode_alternates":"","name":"banknote with dollar sign","shortname":":dollar:","category":"objects","emoji_order":"637","aliases":[],"aliases_ascii":[],"keywords":["money","money"]},"yen":{"unicode":"1f4b4","unicode_alternates":"","name":"banknote with yen sign","shortname":":yen:","category":"objects","emoji_order":"638","aliases":[],"aliases_ascii":[],"keywords":["money","money"]},"euro":{"unicode":"1f4b6","unicode_alternates":"","name":"banknote with euro sign","shortname":":euro:","category":"objects","emoji_order":"639","aliases":[],"aliases_ascii":[],"keywords":["money","money"]},"pound":{"unicode":"1f4b7","unicode_alternates":"","name":"banknote with pound sign","shortname":":pound:","category":"objects","emoji_order":"640","aliases":[],"aliases_ascii":[],"keywords":["money","money"]},"moneybag":{"unicode":"1f4b0","unicode_alternates":"","name":"money bag","shortname":":moneybag:","category":"objects","emoji_order":"641","aliases":[],"aliases_ascii":[],"keywords":["bag","award","money","money"]},"credit_card":{"unicode":"1f4b3","unicode_alternates":"","name":"credit card","shortname":":credit_card:","category":"objects","emoji_order":"642","aliases":[],"aliases_ascii":[],"keywords":["object","money","money","boys night","boys night"]},"gem":{"unicode":"1f48e","unicode_alternates":"","name":"gem stone","shortname":":gem:","category":"objects","emoji_order":"643","aliases":[],"aliases_ascii":[],"keywords":["object","gem"]},"scales":{"unicode":"2696","unicode_alternates":"2696-fe0f","name":"scales","shortname":":scales:","category":"objects","emoji_order":"644","aliases":[],"aliases_ascii":[],"keywords":["object"]},"wrench":{"unicode":"1f527","unicode_alternates":"","name":"wrench","shortname":":wrench:","category":"objects","emoji_order":"645","aliases":[],"aliases_ascii":[],"keywords":["object","tool"]},"hammer":{"unicode":"1f528","unicode_alternates":"","name":"hammer","shortname":":hammer:","category":"objects","emoji_order":"646","aliases":[],"aliases_ascii":[],"keywords":["object","tool","weapon"]},"hammer_pick":{"unicode":"2692","unicode_alternates":"2692-fe0f","name":"hammer and pick","shortname":":hammer_pick:","category":"objects","emoji_order":"647","aliases":[":hammer_and_pick:"],"aliases_ascii":[],"keywords":["object","tool","weapon"]},"tools":{"unicode":"1f6e0","unicode_alternates":"1f6e0-fe0f","name":"hammer and wrench","shortname":":tools:","category":"objects","emoji_order":"648","aliases":[":hammer_and_wrench:"],"aliases_ascii":[],"keywords":["object","tool"]},"pick":{"unicode":"26cf","unicode_alternates":"26cf-fe0f","name":"pick","shortname":":pick:","category":"objects","emoji_order":"649","aliases":[],"aliases_ascii":[],"keywords":["object","tool","weapon"]},"nut_and_bolt":{"unicode":"1f529","unicode_alternates":"","name":"nut and bolt","shortname":":nut_and_bolt:","category":"objects","emoji_order":"650","aliases":[],"aliases_ascii":[],"keywords":["object","tool","nutcase","nutcase"]},"gear":{"unicode":"2699","unicode_alternates":"2699-fe0f","name":"gear","shortname":":gear:","category":"objects","emoji_order":"651","aliases":[],"aliases_ascii":[],"keywords":["object","tool"]},"chains":{"unicode":"26d3","unicode_alternates":"26d3-fe0f","name":"chains","shortname":":chains:","category":"objects","emoji_order":"652","aliases":[],"aliases_ascii":[],"keywords":["object","tool"]},"gun":{"unicode":"1f52b","unicode_alternates":"","name":"pistol","shortname":":gun:","category":"objects","emoji_order":"653","aliases":[],"aliases_ascii":[],"keywords":["object","weapon","dead","gun","sarcastic","sarcastic"]},"bomb":{"unicode":"1f4a3","unicode_alternates":"","name":"bomb","shortname":":bomb:","category":"objects","emoji_order":"654","aliases":[],"aliases_ascii":[],"keywords":["object","weapon","dead","blast","blast"]},"knife":{"unicode":"1f52a","unicode_alternates":"","name":"hocho","shortname":":knife:","category":"objects","emoji_order":"655","aliases":[],"aliases_ascii":[],"keywords":["object","weapon"]},"dagger":{"unicode":"1f5e1","unicode_alternates":"1f5e1-fe0f","name":"dagger knife","shortname":":dagger:","category":"objects","emoji_order":"656","aliases":[":dagger_knife:"],"aliases_ascii":[],"keywords":["object","weapon"]},"crossed_swords":{"unicode":"2694","unicode_alternates":"2694-fe0f","name":"crossed swords","shortname":":crossed_swords:","category":"objects","emoji_order":"657","aliases":[],"aliases_ascii":[],"keywords":["object","weapon"]},"shield":{"unicode":"1f6e1","unicode_alternates":"1f6e1-fe0f","name":"shield","shortname":":shield:","category":"objects","emoji_order":"658","aliases":[],"aliases_ascii":[],"keywords":["object"]},"smoking":{"unicode":"1f6ac","unicode_alternates":"","name":"smoking symbol","shortname":":smoking:","category":"objects","emoji_order":"659","aliases":[],"aliases_ascii":[],"keywords":["symbol","drugs","drugs","smoking","smoking"]},"skull_crossbones":{"unicode":"2620","unicode_alternates":"2620-fe0f","name":"skull and crossbones","shortname":":skull_crossbones:","category":"objects","emoji_order":"660","aliases":[":skull_and_crossbones:"],"aliases_ascii":[],"keywords":["symbol","dead","skull"]},"coffin":{"unicode":"26b0","unicode_alternates":"26b0-fe0f","name":"coffin","shortname":":coffin:","category":"objects","emoji_order":"661","aliases":[],"aliases_ascii":[],"keywords":["object","dead","rip","rip"]},"urn":{"unicode":"26b1","unicode_alternates":"26b1-fe0f","name":"funeral urn","shortname":":urn:","category":"objects","emoji_order":"662","aliases":[":funeral_urn:"],"aliases_ascii":[],"keywords":["object","dead","rip","rip"]},"amphora":{"unicode":"1f3fa","unicode_alternates":"","name":"amphora","shortname":":amphora:","category":"objects","emoji_order":"663","aliases":[],"aliases_ascii":[],"keywords":["object"]},"crystal_ball":{"unicode":"1f52e","unicode_alternates":"","name":"crystal ball","shortname":":crystal_ball:","category":"objects","emoji_order":"664","aliases":[],"aliases_ascii":[],"keywords":["object","ball"]},"prayer_beads":{"unicode":"1f4ff","unicode_alternates":"","name":"prayer beads","shortname":":prayer_beads:","category":"objects","emoji_order":"665","aliases":[],"aliases_ascii":[],"keywords":["object","rosary"]},"barber":{"unicode":"1f488","unicode_alternates":"","name":"barber pole","shortname":":barber:","category":"objects","emoji_order":"666","aliases":[],"aliases_ascii":[],"keywords":["object"]},"alembic":{"unicode":"2697","unicode_alternates":"2697-fe0f","name":"alembic","shortname":":alembic:","category":"objects","emoji_order":"667","aliases":[],"aliases_ascii":[],"keywords":["object","science"]},"telescope":{"unicode":"1f52d","unicode_alternates":"","name":"telescope","shortname":":telescope:","category":"objects","emoji_order":"668","aliases":[],"aliases_ascii":[],"keywords":["object","space","science"]},"microscope":{"unicode":"1f52c","unicode_alternates":"","name":"microscope","shortname":":microscope:","category":"objects","emoji_order":"669","aliases":[],"aliases_ascii":[],"keywords":["object","science"]},"hole":{"unicode":"1f573","unicode_alternates":"1f573-fe0f","name":"hole","shortname":":hole:","category":"objects","emoji_order":"670","aliases":[],"aliases_ascii":[],"keywords":["object"]},"pill":{"unicode":"1f48a","unicode_alternates":"","name":"pill","shortname":":pill:","category":"objects","emoji_order":"671","aliases":[],"aliases_ascii":[],"keywords":["object","health","drugs","drugs"]},"syringe":{"unicode":"1f489","unicode_alternates":"","name":"syringe","shortname":":syringe:","category":"objects","emoji_order":"672","aliases":[],"aliases_ascii":[],"keywords":["object","weapon","health","drugs","drugs"]},"thermometer":{"unicode":"1f321","unicode_alternates":"1f321-fe0f","name":"thermometer","shortname":":thermometer:","category":"objects","emoji_order":"673","aliases":[],"aliases_ascii":[],"keywords":["object","science","health","hot","hot"]},"label":{"unicode":"1f3f7","unicode_alternates":"1f3f7-fe0f","name":"label","shortname":":label:","category":"objects","emoji_order":"674","aliases":[],"aliases_ascii":[],"keywords":["object"]},"bookmark":{"unicode":"1f516","unicode_alternates":"","name":"bookmark","shortname":":bookmark:","category":"objects","emoji_order":"675","aliases":[],"aliases_ascii":[],"keywords":["object","book"]},"toilet":{"unicode":"1f6bd","unicode_alternates":"","name":"toilet","shortname":":toilet:","category":"objects","emoji_order":"676","aliases":[],"aliases_ascii":[],"keywords":["object","bathroom"]},"shower":{"unicode":"1f6bf","unicode_alternates":"","name":"shower","shortname":":shower:","category":"objects","emoji_order":"677","aliases":[],"aliases_ascii":[],"keywords":["object","bathroom"]},"bathtub":{"unicode":"1f6c1","unicode_alternates":"","name":"bathtub","shortname":":bathtub:","category":"objects","emoji_order":"678","aliases":[],"aliases_ascii":[],"keywords":["object","bathroom","tired","steam","steam"]},"key":{"unicode":"1f511","unicode_alternates":"","name":"key","shortname":":key:","category":"objects","emoji_order":"679","aliases":[],"aliases_ascii":[],"keywords":["object","lock"]},"key2":{"unicode":"1f5dd","unicode_alternates":"1f5dd-fe0f","name":"old key","shortname":":key2:","category":"objects","emoji_order":"680","aliases":[":old_key:"],"aliases_ascii":[],"keywords":["object","lock"]},"couch":{"unicode":"1f6cb","unicode_alternates":"1f6cb-fe0f","name":"couch and lamp","shortname":":couch:","category":"objects","emoji_order":"681","aliases":[":couch_and_lamp:"],"aliases_ascii":[],"keywords":["object"]},"sleeping_accommodation":{"unicode":"1f6cc","unicode_alternates":"","name":"sleeping accommodation","shortname":":sleeping_accommodation:","category":"objects","emoji_order":"682","aliases":[],"aliases_ascii":[],"keywords":["tired"]},"bed":{"unicode":"1f6cf","unicode_alternates":"1f6cf-fe0f","name":"bed","shortname":":bed:","category":"objects","emoji_order":"683","aliases":[],"aliases_ascii":[],"keywords":["object","tired"]},"door":{"unicode":"1f6aa","unicode_alternates":"","name":"door","shortname":":door:","category":"objects","emoji_order":"684","aliases":[],"aliases_ascii":[],"keywords":["object"]},"bellhop":{"unicode":"1f6ce","unicode_alternates":"1f6ce-fe0f","name":"bellhop bell","shortname":":bellhop:","category":"objects","emoji_order":"685","aliases":[":bellhop_bell:"],"aliases_ascii":[],"keywords":["object"]},"frame_photo":{"unicode":"1f5bc","unicode_alternates":"1f5bc-fe0f","name":"frame with picture","shortname":":frame_photo:","category":"objects","emoji_order":"686","aliases":[":frame_with_picture:"],"aliases_ascii":[],"keywords":["travel","vacation"]},"map":{"unicode":"1f5fa","unicode_alternates":"1f5fa-fe0f","name":"world map","shortname":":map:","category":"objects","emoji_order":"687","aliases":[":world_map:"],"aliases_ascii":[],"keywords":["travel","map","vacation"]},"beach_umbrella":{"unicode":"26f1","unicode_alternates":"26f1-fe0f","name":"umbrella on ground","shortname":":beach_umbrella:","category":"objects","emoji_order":"688","aliases":[":umbrella_on_ground:"],"aliases_ascii":[],"keywords":["travel","vacation","tropical"]},"moyai":{"unicode":"1f5ff","unicode_alternates":"","name":"moyai","shortname":":moyai:","category":"objects","emoji_order":"689","aliases":[],"aliases_ascii":[],"keywords":["travel","vacation"]},"shopping_bags":{"unicode":"1f6cd","unicode_alternates":"1f6cd-fe0f","name":"shopping bags","shortname":":shopping_bags:","category":"objects","emoji_order":"690","aliases":[],"aliases_ascii":[],"keywords":["object","birthday","parties","parties"]},"balloon":{"unicode":"1f388","unicode_alternates":"","name":"balloon","shortname":":balloon:","category":"objects","emoji_order":"691","aliases":[],"aliases_ascii":[],"keywords":["object","birthday","good","good","parties","parties"]},"flags":{"unicode":"1f38f","unicode_alternates":"","name":"carp streamer","shortname":":flags:","category":"objects","emoji_order":"692","aliases":[],"aliases_ascii":[],"keywords":["object","japan"]},"ribbon":{"unicode":"1f380","unicode_alternates":"","name":"ribbon","shortname":":ribbon:","category":"objects","emoji_order":"693","aliases":[],"aliases_ascii":[],"keywords":["object","gift","birthday"]},"gift":{"unicode":"1f381","unicode_alternates":"","name":"wrapped present","shortname":":gift:","category":"objects","emoji_order":"694","aliases":[],"aliases_ascii":[],"keywords":["object","gift","birthday","holidays","christmas","parties","parties"]},"confetti_ball":{"unicode":"1f38a","unicode_alternates":"","name":"confetti ball","shortname":":confetti_ball:","category":"objects","emoji_order":"695","aliases":[],"aliases_ascii":[],"keywords":["object","birthday","holidays","cheers","girls night","girls night","boys night","boys night","parties","parties"]},"tada":{"unicode":"1f389","unicode_alternates":"","name":"party popper","shortname":":tada:","category":"objects","emoji_order":"696","aliases":[],"aliases_ascii":[],"keywords":["object","birthday","holidays","cheers","good","good","girls night","girls night","boys night","boys night","parties","parties"]},"dolls":{"unicode":"1f38e","unicode_alternates":"","name":"japanese dolls","shortname":":dolls:","category":"objects","emoji_order":"697","aliases":[],"aliases_ascii":[],"keywords":["people","japan"]},"wind_chime":{"unicode":"1f390","unicode_alternates":"","name":"wind chime","shortname":":wind_chime:","category":"objects","emoji_order":"698","aliases":[],"aliases_ascii":[],"keywords":["object","japan"]},"crossed_flags":{"unicode":"1f38c","unicode_alternates":"","name":"crossed flags","shortname":":crossed_flags:","category":"objects","emoji_order":"699","aliases":[],"aliases_ascii":[],"keywords":["object","japan"]},"izakaya_lantern":{"unicode":"1f3ee","unicode_alternates":"","name":"izakaya lantern","shortname":":izakaya_lantern:","category":"objects","emoji_order":"700","aliases":[],"aliases_ascii":[],"keywords":["object","japan"]},"envelope":{"unicode":"2709","unicode_alternates":"2709-fe0f","name":"envelope","shortname":":envelope:","category":"objects","emoji_order":"701","aliases":[],"aliases_ascii":[],"keywords":["object","office","write"]},"envelope_with_arrow":{"unicode":"1f4e9","unicode_alternates":"","name":"envelope with downwards arrow above","shortname":":envelope_with_arrow:","category":"objects","emoji_order":"702","aliases":[],"aliases_ascii":[],"keywords":["object","office"]},"incoming_envelope":{"unicode":"1f4e8","unicode_alternates":"","name":"incoming envelope","shortname":":incoming_envelope:","category":"objects","emoji_order":"703","aliases":[],"aliases_ascii":[],"keywords":["object"]},"e-mail":{"unicode":"1f4e7","unicode_alternates":"","name":"e-mail symbol","shortname":":e-mail:","category":"objects","emoji_order":"704","aliases":[":email:"],"aliases_ascii":[],"keywords":["office"]},"love_letter":{"unicode":"1f48c","unicode_alternates":"","name":"love letter","shortname":":love_letter:","category":"objects","emoji_order":"705","aliases":[],"aliases_ascii":[],"keywords":["object"]},"postbox":{"unicode":"1f4ee","unicode_alternates":"","name":"postbox","shortname":":postbox:","category":"objects","emoji_order":"706","aliases":[],"aliases_ascii":[],"keywords":["object"]},"mailbox_closed":{"unicode":"1f4ea","unicode_alternates":"","name":"closed mailbox with lowered flag","shortname":":mailbox_closed:","category":"objects","emoji_order":"707","aliases":[],"aliases_ascii":[],"keywords":["object","office"]},"mailbox":{"unicode":"1f4eb","unicode_alternates":"","name":"closed mailbox with raised flag","shortname":":mailbox:","category":"objects","emoji_order":"708","aliases":[],"aliases_ascii":[],"keywords":["object"]},"mailbox_with_mail":{"unicode":"1f4ec","unicode_alternates":"","name":"open mailbox with raised flag","shortname":":mailbox_with_mail:","category":"objects","emoji_order":"709","aliases":[],"aliases_ascii":[],"keywords":["object"]},"mailbox_with_no_mail":{"unicode":"1f4ed","unicode_alternates":"","name":"open mailbox with lowered flag","shortname":":mailbox_with_no_mail:","category":"objects","emoji_order":"710","aliases":[],"aliases_ascii":[],"keywords":["object"]},"package":{"unicode":"1f4e6","unicode_alternates":"","name":"package","shortname":":package:","category":"objects","emoji_order":"711","aliases":[],"aliases_ascii":[],"keywords":["object","gift","office"]},"postal_horn":{"unicode":"1f4ef","unicode_alternates":"","name":"postal horn","shortname":":postal_horn:","category":"objects","emoji_order":"712","aliases":[],"aliases_ascii":[],"keywords":["object"]},"inbox_tray":{"unicode":"1f4e5","unicode_alternates":"","name":"inbox tray","shortname":":inbox_tray:","category":"objects","emoji_order":"713","aliases":[],"aliases_ascii":[],"keywords":["work","office"]},"outbox_tray":{"unicode":"1f4e4","unicode_alternates":"","name":"outbox tray","shortname":":outbox_tray:","category":"objects","emoji_order":"714","aliases":[],"aliases_ascii":[],"keywords":["work","office"]},"scroll":{"unicode":"1f4dc","unicode_alternates":"","name":"scroll","shortname":":scroll:","category":"objects","emoji_order":"715","aliases":[],"aliases_ascii":[],"keywords":["object","office"]},"page_with_curl":{"unicode":"1f4c3","unicode_alternates":"","name":"page with curl","shortname":":page_with_curl:","category":"objects","emoji_order":"716","aliases":[],"aliases_ascii":[],"keywords":["office","write"]},"bookmark_tabs":{"unicode":"1f4d1","unicode_alternates":"","name":"bookmark tabs","shortname":":bookmark_tabs:","category":"objects","emoji_order":"717","aliases":[],"aliases_ascii":[],"keywords":["office","write"]},"bar_chart":{"unicode":"1f4ca","unicode_alternates":"","name":"bar chart","shortname":":bar_chart:","category":"objects","emoji_order":"718","aliases":[],"aliases_ascii":[],"keywords":["work","office"]},"chart_with_upwards_trend":{"unicode":"1f4c8","unicode_alternates":"","name":"chart with upwards trend","shortname":":chart_with_upwards_trend:","category":"objects","emoji_order":"719","aliases":[],"aliases_ascii":[],"keywords":["work","office"]},"chart_with_downwards_trend":{"unicode":"1f4c9","unicode_alternates":"","name":"chart with downwards trend","shortname":":chart_with_downwards_trend:","category":"objects","emoji_order":"720","aliases":[],"aliases_ascii":[],"keywords":["work","office"]},"page_facing_up":{"unicode":"1f4c4","unicode_alternates":"","name":"page facing up","shortname":":page_facing_up:","category":"objects","emoji_order":"721","aliases":[],"aliases_ascii":[],"keywords":["work","office","write"]},"date":{"unicode":"1f4c5","unicode_alternates":"","name":"calendar","shortname":":date:","category":"objects","emoji_order":"722","aliases":[],"aliases_ascii":[],"keywords":["object","office"]},"calendar":{"unicode":"1f4c6","unicode_alternates":"","name":"tear-off calendar","shortname":":calendar:","category":"objects","emoji_order":"723","aliases":[],"aliases_ascii":[],"keywords":["object","office"]},"calendar_spiral":{"unicode":"1f5d3","unicode_alternates":"1f5d3-fe0f","name":"spiral calendar pad","shortname":":calendar_spiral:","category":"objects","emoji_order":"724","aliases":[":spiral_calendar_pad:"],"aliases_ascii":[],"keywords":["object","office"]},"card_index":{"unicode":"1f4c7","unicode_alternates":"","name":"card index","shortname":":card_index:","category":"objects","emoji_order":"725","aliases":[],"aliases_ascii":[],"keywords":["object","work","office"]},"card_box":{"unicode":"1f5c3","unicode_alternates":"1f5c3-fe0f","name":"card file box","shortname":":card_box:","category":"objects","emoji_order":"726","aliases":[":card_file_box:"],"aliases_ascii":[],"keywords":["object","work","office"]},"ballot_box":{"unicode":"1f5f3","unicode_alternates":"1f5f3-fe0f","name":"ballot box with ballot","shortname":":ballot_box:","category":"objects","emoji_order":"727","aliases":[":ballot_box_with_ballot:"],"aliases_ascii":[],"keywords":["object","office"]},"file_cabinet":{"unicode":"1f5c4","unicode_alternates":"1f5c4-fe0f","name":"file cabinet","shortname":":file_cabinet:","category":"objects","emoji_order":"728","aliases":[],"aliases_ascii":[],"keywords":["object","work","office"]},"clipboard":{"unicode":"1f4cb","unicode_alternates":"","name":"clipboard","shortname":":clipboard:","category":"objects","emoji_order":"729","aliases":[],"aliases_ascii":[],"keywords":["object","work","office","write"]},"notepad_spiral":{"unicode":"1f5d2","unicode_alternates":"1f5d2-fe0f","name":"spiral note pad","shortname":":notepad_spiral:","category":"objects","emoji_order":"730","aliases":[":spiral_note_pad:"],"aliases_ascii":[],"keywords":["work","office","write"]},"file_folder":{"unicode":"1f4c1","unicode_alternates":"","name":"file folder","shortname":":file_folder:","category":"objects","emoji_order":"731","aliases":[],"aliases_ascii":[],"keywords":["work","office"]},"open_file_folder":{"unicode":"1f4c2","unicode_alternates":"","name":"open file folder","shortname":":open_file_folder:","category":"objects","emoji_order":"732","aliases":[],"aliases_ascii":[],"keywords":["work","office"]},"dividers":{"unicode":"1f5c2","unicode_alternates":"1f5c2-fe0f","name":"card index dividers","shortname":":dividers:","category":"objects","emoji_order":"733","aliases":[":card_index_dividers:"],"aliases_ascii":[],"keywords":["work","office"]},"newspaper2":{"unicode":"1f5de","unicode_alternates":"1f5de-fe0f","name":"rolled-up newspaper","shortname":":newspaper2:","category":"objects","emoji_order":"734","aliases":[":rolled_up_newspaper:"],"aliases_ascii":[],"keywords":["office","write"]},"newspaper":{"unicode":"1f4f0","unicode_alternates":"","name":"newspaper","shortname":":newspaper:","category":"objects","emoji_order":"735","aliases":[],"aliases_ascii":[],"keywords":["office","write"]},"notebook":{"unicode":"1f4d3","unicode_alternates":"","name":"notebook","shortname":":notebook:","category":"objects","emoji_order":"736","aliases":[],"aliases_ascii":[],"keywords":["object","office","write"]},"closed_book":{"unicode":"1f4d5","unicode_alternates":"","name":"closed book","shortname":":closed_book:","category":"objects","emoji_order":"737","aliases":[],"aliases_ascii":[],"keywords":["object","office","write","book"]},"green_book":{"unicode":"1f4d7","unicode_alternates":"","name":"green book","shortname":":green_book:","category":"objects","emoji_order":"738","aliases":[],"aliases_ascii":[],"keywords":["object","office","book"]},"blue_book":{"unicode":"1f4d8","unicode_alternates":"","name":"blue book","shortname":":blue_book:","category":"objects","emoji_order":"739","aliases":[],"aliases_ascii":[],"keywords":["object","office","write","book"]},"orange_book":{"unicode":"1f4d9","unicode_alternates":"","name":"orange book","shortname":":orange_book:","category":"objects","emoji_order":"740","aliases":[],"aliases_ascii":[],"keywords":["object","office","write","book"]},"notebook_with_decorative_cover":{"unicode":"1f4d4","unicode_alternates":"","name":"notebook with decorative cover","shortname":":notebook_with_decorative_cover:","category":"objects","emoji_order":"741","aliases":[],"aliases_ascii":[],"keywords":["object","office","write"]},"ledger":{"unicode":"1f4d2","unicode_alternates":"","name":"ledger","shortname":":ledger:","category":"objects","emoji_order":"742","aliases":[],"aliases_ascii":[],"keywords":["object","office","write"]},"books":{"unicode":"1f4da","unicode_alternates":"","name":"books","shortname":":books:","category":"objects","emoji_order":"743","aliases":[],"aliases_ascii":[],"keywords":["object","office","write","book"]},"book":{"unicode":"1f4d6","unicode_alternates":"","name":"open book","shortname":":book:","category":"objects","emoji_order":"744","aliases":[],"aliases_ascii":[],"keywords":["object","office","write","book"]},"link":{"unicode":"1f517","unicode_alternates":"","name":"link symbol","shortname":":link:","category":"objects","emoji_order":"745","aliases":[],"aliases_ascii":[],"keywords":["symbol","office"]},"paperclip":{"unicode":"1f4ce","unicode_alternates":"","name":"paperclip","shortname":":paperclip:","category":"objects","emoji_order":"746","aliases":[],"aliases_ascii":[],"keywords":["object","work","office"]},"paperclips":{"unicode":"1f587","unicode_alternates":"1f587-fe0f","name":"linked paperclips","shortname":":paperclips:","category":"objects","emoji_order":"747","aliases":[":linked_paperclips:"],"aliases_ascii":[],"keywords":["object","work","office"]},"scissors":{"unicode":"2702","unicode_alternates":"2702-fe0f","name":"black scissors","shortname":":scissors:","category":"objects","emoji_order":"748","aliases":[],"aliases_ascii":[],"keywords":["object","tool","weapon","office"]},"triangular_ruler":{"unicode":"1f4d0","unicode_alternates":"","name":"triangular ruler","shortname":":triangular_ruler:","category":"objects","emoji_order":"749","aliases":[],"aliases_ascii":[],"keywords":["object","tool","office"]},"straight_ruler":{"unicode":"1f4cf","unicode_alternates":"","name":"straight ruler","shortname":":straight_ruler:","category":"objects","emoji_order":"750","aliases":[],"aliases_ascii":[],"keywords":["object","tool","office"]},"pushpin":{"unicode":"1f4cc","unicode_alternates":"","name":"pushpin","shortname":":pushpin:","category":"objects","emoji_order":"751","aliases":[],"aliases_ascii":[],"keywords":["object","office"]},"round_pushpin":{"unicode":"1f4cd","unicode_alternates":"","name":"round pushpin","shortname":":round_pushpin:","category":"objects","emoji_order":"752","aliases":[],"aliases_ascii":[],"keywords":["object","office"]},"triangular_flag_on_post":{"unicode":"1f6a9","unicode_alternates":"","name":"triangular flag on post","shortname":":triangular_flag_on_post:","category":"objects","emoji_order":"753","aliases":[],"aliases_ascii":[],"keywords":["object"]},"flag_white":{"unicode":"1f3f3","unicode_alternates":"1f3f3-fe0f","name":"waving white flag","shortname":":flag_white:","category":"objects","emoji_order":"754","aliases":[":waving_white_flag:"],"aliases_ascii":[],"keywords":["object"]},"flag_black":{"unicode":"1f3f4","unicode_alternates":"","name":"waving black flag","shortname":":flag_black:","category":"objects","emoji_order":"755","aliases":[":waving_black_flag:"],"aliases_ascii":[],"keywords":["object"]},"closed_lock_with_key":{"unicode":"1f510","unicode_alternates":"","name":"closed lock with key","shortname":":closed_lock_with_key:","category":"objects","emoji_order":"756","aliases":[],"aliases_ascii":[],"keywords":["object","lock"]},"lock":{"unicode":"1f512","unicode_alternates":"","name":"lock","shortname":":lock:","category":"objects","emoji_order":"757","aliases":[],"aliases_ascii":[],"keywords":["object","lock"]},"unlock":{"unicode":"1f513","unicode_alternates":"","name":"open lock","shortname":":unlock:","category":"objects","emoji_order":"758","aliases":[],"aliases_ascii":[],"keywords":["object","lock"]},"lock_with_ink_pen":{"unicode":"1f50f","unicode_alternates":"","name":"lock with ink pen","shortname":":lock_with_ink_pen:","category":"objects","emoji_order":"759","aliases":[],"aliases_ascii":[],"keywords":["object","lock"]},"pen_ballpoint":{"unicode":"1f58a","unicode_alternates":"1f58a-fe0f","name":"lower left ballpoint pen","shortname":":pen_ballpoint:","category":"objects","emoji_order":"760","aliases":[":lower_left_ballpoint_pen:"],"aliases_ascii":[],"keywords":["object","office","write"]},"pen_fountain":{"unicode":"1f58b","unicode_alternates":"1f58b-fe0f","name":"lower left fountain pen","shortname":":pen_fountain:","category":"objects","emoji_order":"761","aliases":[":lower_left_fountain_pen:"],"aliases_ascii":[],"keywords":["object","office","write"]},"black_nib":{"unicode":"2712","unicode_alternates":"2712-fe0f","name":"black nib","shortname":":black_nib:","category":"objects","emoji_order":"762","aliases":[],"aliases_ascii":[],"keywords":["object","office","write"]},"pencil":{"unicode":"1f4dd","unicode_alternates":"","name":"memo","shortname":":pencil:","category":"objects","emoji_order":"763","aliases":[],"aliases_ascii":[],"keywords":["work","office","write"]},"pencil2":{"unicode":"270f","unicode_alternates":"270f-fe0f","name":"pencil","shortname":":pencil2:","category":"objects","emoji_order":"764","aliases":[],"aliases_ascii":[],"keywords":["object","office","write"]},"crayon":{"unicode":"1f58d","unicode_alternates":"1f58d-fe0f","name":"lower left crayon","shortname":":crayon:","category":"objects","emoji_order":"765","aliases":[":lower_left_crayon:"],"aliases_ascii":[],"keywords":["object","office","write"]},"paintbrush":{"unicode":"1f58c","unicode_alternates":"1f58c-fe0f","name":"lower left paintbrush","shortname":":paintbrush:","category":"objects","emoji_order":"766","aliases":[":lower_left_paintbrush:"],"aliases_ascii":[],"keywords":["object","office","write"]},"mag":{"unicode":"1f50d","unicode_alternates":"","name":"left-pointing magnifying glass","shortname":":mag:","category":"objects","emoji_order":"767","aliases":[],"aliases_ascii":[],"keywords":["object"]},"mag_right":{"unicode":"1f50e","unicode_alternates":"","name":"right-pointing magnifying glass","shortname":":mag_right:","category":"objects","emoji_order":"768","aliases":[],"aliases_ascii":[],"keywords":["object"]},"heart":{"unicode":"2764","unicode_alternates":"2764-fe0f","name":"heavy black heart","shortname":":heart:","category":"symbols","emoji_order":"769","aliases":[],"aliases_ascii":["<3"],"keywords":["love","symbol","parties","parties"]},"yellow_heart":{"unicode":"1f49b","unicode_alternates":"","name":"yellow heart","shortname":":yellow_heart:","category":"symbols","emoji_order":"770","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"green_heart":{"unicode":"1f49a","unicode_alternates":"","name":"green heart","shortname":":green_heart:","category":"symbols","emoji_order":"771","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"blue_heart":{"unicode":"1f499","unicode_alternates":"","name":"blue heart","shortname":":blue_heart:","category":"symbols","emoji_order":"772","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"purple_heart":{"unicode":"1f49c","unicode_alternates":"","name":"purple heart","shortname":":purple_heart:","category":"symbols","emoji_order":"773","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"broken_heart":{"unicode":"1f494","unicode_alternates":"","name":"broken heart","shortname":":broken_heart:","category":"symbols","emoji_order":"774","aliases":[],"aliases_ascii":["<\/3"],"keywords":["love","symbol","heartbreak","heartbreak"]},"heart_exclamation":{"unicode":"2763","unicode_alternates":"2763-fe0f","name":"heavy heart exclamation mark ornament","shortname":":heart_exclamation:","category":"symbols","emoji_order":"775","aliases":[":heavy_heart_exclamation_mark_ornament:"],"aliases_ascii":[],"keywords":["love","symbol"]},"two_hearts":{"unicode":"1f495","unicode_alternates":"","name":"two hearts","shortname":":two_hearts:","category":"symbols","emoji_order":"776","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"revolving_hearts":{"unicode":"1f49e","unicode_alternates":"","name":"revolving hearts","shortname":":revolving_hearts:","category":"symbols","emoji_order":"777","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"heartbeat":{"unicode":"1f493","unicode_alternates":"","name":"beating heart","shortname":":heartbeat:","category":"symbols","emoji_order":"778","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"heartpulse":{"unicode":"1f497","unicode_alternates":"","name":"growing heart","shortname":":heartpulse:","category":"symbols","emoji_order":"779","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"sparkling_heart":{"unicode":"1f496","unicode_alternates":"","name":"sparkling heart","shortname":":sparkling_heart:","category":"symbols","emoji_order":"780","aliases":[],"aliases_ascii":[],"keywords":["love","symbol","girls night","girls night"]},"cupid":{"unicode":"1f498","unicode_alternates":"","name":"heart with arrow","shortname":":cupid:","category":"symbols","emoji_order":"781","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"gift_heart":{"unicode":"1f49d","unicode_alternates":"","name":"heart with ribbon","shortname":":gift_heart:","category":"symbols","emoji_order":"782","aliases":[],"aliases_ascii":[],"keywords":["love","symbol","condolence","condolence"]},"heart_decoration":{"unicode":"1f49f","unicode_alternates":"","name":"heart decoration","shortname":":heart_decoration:","category":"symbols","emoji_order":"783","aliases":[],"aliases_ascii":[],"keywords":["love","symbol"]},"peace":{"unicode":"262e","unicode_alternates":"262e-fe0f","name":"peace symbol","shortname":":peace:","category":"symbols","emoji_order":"784","aliases":[":peace_symbol:"],"aliases_ascii":[],"keywords":["symbol","peace","peace","drugs","drugs"]},"cross":{"unicode":"271d","unicode_alternates":"271d-fe0f","name":"latin cross","shortname":":cross:","category":"symbols","emoji_order":"785","aliases":[":latin_cross:"],"aliases_ascii":[],"keywords":["religion","symbol"]},"star_and_crescent":{"unicode":"262a","unicode_alternates":"262a-fe0f","name":"star and crescent","shortname":":star_and_crescent:","category":"symbols","emoji_order":"786","aliases":[],"aliases_ascii":[],"keywords":["religion","symbol"]},"om_symbol":{"unicode":"1f549","unicode_alternates":"1f549-fe0f","name":"om symbol","shortname":":om_symbol:","category":"symbols","emoji_order":"787","aliases":[],"aliases_ascii":[],"keywords":["religion","symbol"]},"wheel_of_dharma":{"unicode":"2638","unicode_alternates":"2638-fe0f","name":"wheel of dharma","shortname":":wheel_of_dharma:","category":"symbols","emoji_order":"788","aliases":[],"aliases_ascii":[],"keywords":["religion","symbol"]},"star_of_david":{"unicode":"2721","unicode_alternates":"2721-fe0f","name":"star of david","shortname":":star_of_david:","category":"symbols","emoji_order":"789","aliases":[],"aliases_ascii":[],"keywords":["religion","jew","star","symbol"]},"six_pointed_star":{"unicode":"1f52f","unicode_alternates":"","name":"six pointed star with middle dot","shortname":":six_pointed_star:","category":"symbols","emoji_order":"790","aliases":[],"aliases_ascii":[],"keywords":["religion","jew","star","symbol"]},"menorah":{"unicode":"1f54e","unicode_alternates":"","name":"menorah with nine branches","shortname":":menorah:","category":"symbols","emoji_order":"791","aliases":[],"aliases_ascii":[],"keywords":["religion","object","jew","symbol","holidays"]},"yin_yang":{"unicode":"262f","unicode_alternates":"262f-fe0f","name":"yin yang","shortname":":yin_yang:","category":"symbols","emoji_order":"792","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"orthodox_cross":{"unicode":"2626","unicode_alternates":"2626-fe0f","name":"orthodox cross","shortname":":orthodox_cross:","category":"symbols","emoji_order":"793","aliases":[],"aliases_ascii":[],"keywords":["religion","symbol"]},"place_of_worship":{"unicode":"1f6d0","unicode_alternates":"","name":"place of worship","shortname":":place_of_worship:","category":"symbols","emoji_order":"794","aliases":[":worship_symbol:"],"aliases_ascii":[],"keywords":["religion","symbol","pray","pray"]},"ophiuchus":{"unicode":"26ce","unicode_alternates":"","name":"ophiuchus","shortname":":ophiuchus:","category":"symbols","emoji_order":"795","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"aries":{"unicode":"2648","unicode_alternates":"2648-fe0f","name":"aries","shortname":":aries:","category":"symbols","emoji_order":"796","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"taurus":{"unicode":"2649","unicode_alternates":"2649-fe0f","name":"taurus","shortname":":taurus:","category":"symbols","emoji_order":"797","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"gemini":{"unicode":"264a","unicode_alternates":"264a-fe0f","name":"gemini","shortname":":gemini:","category":"symbols","emoji_order":"798","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"cancer":{"unicode":"264b","unicode_alternates":"264b-fe0f","name":"cancer","shortname":":cancer:","category":"symbols","emoji_order":"799","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"leo":{"unicode":"264c","unicode_alternates":"264c-fe0f","name":"leo","shortname":":leo:","category":"symbols","emoji_order":"800","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"virgo":{"unicode":"264d","unicode_alternates":"264d-fe0f","name":"virgo","shortname":":virgo:","category":"symbols","emoji_order":"801","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"libra":{"unicode":"264e","unicode_alternates":"264e-fe0f","name":"libra","shortname":":libra:","category":"symbols","emoji_order":"802","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"scorpius":{"unicode":"264f","unicode_alternates":"264f-fe0f","name":"scorpius","shortname":":scorpius:","category":"symbols","emoji_order":"803","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"sagittarius":{"unicode":"2650","unicode_alternates":"2650-fe0f","name":"sagittarius","shortname":":sagittarius:","category":"symbols","emoji_order":"804","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"capricorn":{"unicode":"2651","unicode_alternates":"2651-fe0f","name":"capricorn","shortname":":capricorn:","category":"symbols","emoji_order":"805","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"aquarius":{"unicode":"2652","unicode_alternates":"2652-fe0f","name":"aquarius","shortname":":aquarius:","category":"symbols","emoji_order":"806","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"pisces":{"unicode":"2653","unicode_alternates":"2653-fe0f","name":"pisces","shortname":":pisces:","category":"symbols","emoji_order":"807","aliases":[],"aliases_ascii":[],"keywords":["zodiac","symbol"]},"id":{"unicode":"1f194","unicode_alternates":"","name":"squared id","shortname":":id:","category":"symbols","emoji_order":"808","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"atom":{"unicode":"269b","unicode_alternates":"269b-fe0f","name":"atom symbol","shortname":":atom:","category":"symbols","emoji_order":"809","aliases":[":atom_symbol:"],"aliases_ascii":[],"keywords":["symbol","science"]},"u7a7a":{"unicode":"1f233","unicode_alternates":"","name":"squared cjk unified ideograph-7a7a","shortname":":u7a7a:","category":"symbols","emoji_order":"810","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"u5272":{"unicode":"1f239","unicode_alternates":"","name":"squared cjk unified ideograph-5272","shortname":":u5272:","category":"symbols","emoji_order":"811","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"radioactive":{"unicode":"2622","unicode_alternates":"2622-fe0f","name":"radioactive sign","shortname":":radioactive:","category":"symbols","emoji_order":"812","aliases":[":radioactive_sign:"],"aliases_ascii":[],"keywords":["symbol","science"]},"biohazard":{"unicode":"2623","unicode_alternates":"2623-fe0f","name":"biohazard sign","shortname":":biohazard:","category":"symbols","emoji_order":"813","aliases":[":biohazard_sign:"],"aliases_ascii":[],"keywords":["symbol","science"]},"mobile_phone_off":{"unicode":"1f4f4","unicode_alternates":"","name":"mobile phone off","shortname":":mobile_phone_off:","category":"symbols","emoji_order":"814","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"vibration_mode":{"unicode":"1f4f3","unicode_alternates":"","name":"vibration mode","shortname":":vibration_mode:","category":"symbols","emoji_order":"815","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"u6709":{"unicode":"1f236","unicode_alternates":"","name":"squared cjk unified ideograph-6709","shortname":":u6709:","category":"symbols","emoji_order":"816","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"u7121":{"unicode":"1f21a","unicode_alternates":"1f21a-fe0f","name":"squared cjk unified ideograph-7121","shortname":":u7121:","category":"symbols","emoji_order":"817","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"u7533":{"unicode":"1f238","unicode_alternates":"","name":"squared cjk unified ideograph-7533","shortname":":u7533:","category":"symbols","emoji_order":"818","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"u55b6":{"unicode":"1f23a","unicode_alternates":"","name":"squared cjk unified ideograph-55b6","shortname":":u55b6:","category":"symbols","emoji_order":"819","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"u6708":{"unicode":"1f237","unicode_alternates":"1f237-fe0f","name":"squared cjk unified ideograph-6708","shortname":":u6708:","category":"symbols","emoji_order":"820","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"eight_pointed_black_star":{"unicode":"2734","unicode_alternates":"2734-fe0f","name":"eight pointed black star","shortname":":eight_pointed_black_star:","category":"symbols","emoji_order":"821","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"vs":{"unicode":"1f19a","unicode_alternates":"","name":"squared vs","shortname":":vs:","category":"symbols","emoji_order":"822","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"accept":{"unicode":"1f251","unicode_alternates":"","name":"circled ideograph accept","shortname":":accept:","category":"symbols","emoji_order":"823","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"white_flower":{"unicode":"1f4ae","unicode_alternates":"","name":"white flower","shortname":":white_flower:","category":"symbols","emoji_order":"824","aliases":[],"aliases_ascii":[],"keywords":["flower","symbol"]},"ideograph_advantage":{"unicode":"1f250","unicode_alternates":"","name":"circled ideograph advantage","shortname":":ideograph_advantage:","category":"symbols","emoji_order":"825","aliases":[],"aliases_ascii":[],"keywords":["japan","symbol"]},"secret":{"unicode":"3299","unicode_alternates":"3299-fe0f","name":"circled ideograph secret","shortname":":secret:","category":"symbols","emoji_order":"826","aliases":[],"aliases_ascii":[],"keywords":["japan","symbol"]},"congratulations":{"unicode":"3297","unicode_alternates":"3297-fe0f","name":"circled ideograph congratulation","shortname":":congratulations:","category":"symbols","emoji_order":"827","aliases":[],"aliases_ascii":[],"keywords":["japan","symbol"]},"u5408":{"unicode":"1f234","unicode_alternates":"","name":"squared cjk unified ideograph-5408","shortname":":u5408:","category":"symbols","emoji_order":"828","aliases":[],"aliases_ascii":[],"keywords":["japan","symbol"]},"u6e80":{"unicode":"1f235","unicode_alternates":"","name":"squared cjk unified ideograph-6e80","shortname":":u6e80:","category":"symbols","emoji_order":"829","aliases":[],"aliases_ascii":[],"keywords":["japan","symbol"]},"u7981":{"unicode":"1f232","unicode_alternates":"","name":"squared cjk unified ideograph-7981","shortname":":u7981:","category":"symbols","emoji_order":"830","aliases":[],"aliases_ascii":[],"keywords":["japan","symbol"]},"a":{"unicode":"1f170","unicode_alternates":"","name":"negative squared latin capital letter a","shortname":":a:","category":"symbols","emoji_order":"831","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"b":{"unicode":"1f171","unicode_alternates":"","name":"negative squared latin capital letter b","shortname":":b:","category":"symbols","emoji_order":"832","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"ab":{"unicode":"1f18e","unicode_alternates":"","name":"negative squared ab","shortname":":ab:","category":"symbols","emoji_order":"833","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"cl":{"unicode":"1f191","unicode_alternates":"","name":"squared cl","shortname":":cl:","category":"symbols","emoji_order":"834","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"o2":{"unicode":"1f17e","unicode_alternates":"","name":"negative squared latin capital letter o","shortname":":o2:","category":"symbols","emoji_order":"835","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"sos":{"unicode":"1f198","unicode_alternates":"","name":"squared sos","shortname":":sos:","category":"symbols","emoji_order":"836","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"no_entry":{"unicode":"26d4","unicode_alternates":"26d4-fe0f","name":"no entry","shortname":":no_entry:","category":"symbols","emoji_order":"837","aliases":[],"aliases_ascii":[],"keywords":["symbol","circle","circle"]},"name_badge":{"unicode":"1f4db","unicode_alternates":"","name":"name badge","shortname":":name_badge:","category":"symbols","emoji_order":"838","aliases":[],"aliases_ascii":[],"keywords":["work"]},"no_entry_sign":{"unicode":"1f6ab","unicode_alternates":"","name":"no entry sign","shortname":":no_entry_sign:","category":"symbols","emoji_order":"839","aliases":[],"aliases_ascii":[],"keywords":["symbol","circle","circle"]},"x":{"unicode":"274c","unicode_alternates":"","name":"cross mark","shortname":":x:","category":"symbols","emoji_order":"840","aliases":[],"aliases_ascii":[],"keywords":["symbol","sol","sol"]},"o":{"unicode":"2b55","unicode_alternates":"2b55-fe0f","name":"heavy large circle","shortname":":o:","category":"symbols","emoji_order":"841","aliases":[],"aliases_ascii":[],"keywords":["symbol","circle","circle"]},"anger":{"unicode":"1f4a2","unicode_alternates":"","name":"anger symbol","shortname":":anger:","category":"symbols","emoji_order":"842","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"hotsprings":{"unicode":"2668","unicode_alternates":"2668-fe0f","name":"hot springs","shortname":":hotsprings:","category":"symbols","emoji_order":"843","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"no_pedestrians":{"unicode":"1f6b7","unicode_alternates":"","name":"no pedestrians","shortname":":no_pedestrians:","category":"symbols","emoji_order":"844","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"do_not_litter":{"unicode":"1f6af","unicode_alternates":"","name":"do not litter symbol","shortname":":do_not_litter:","category":"symbols","emoji_order":"845","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"no_bicycles":{"unicode":"1f6b3","unicode_alternates":"","name":"no bicycles","shortname":":no_bicycles:","category":"symbols","emoji_order":"846","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"non-potable_water":{"unicode":"1f6b1","unicode_alternates":"","name":"non-potable water symbol","shortname":":non-potable_water:","category":"symbols","emoji_order":"847","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"underage":{"unicode":"1f51e","unicode_alternates":"","name":"no one under eighteen symbol","shortname":":underage:","category":"symbols","emoji_order":"848","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"no_mobile_phones":{"unicode":"1f4f5","unicode_alternates":"","name":"no mobile phones","shortname":":no_mobile_phones:","category":"symbols","emoji_order":"849","aliases":[],"aliases_ascii":[],"keywords":["symbol","phone"]},"exclamation":{"unicode":"2757","unicode_alternates":"2757-fe0f","name":"heavy exclamation mark symbol","shortname":":exclamation:","category":"symbols","emoji_order":"850","aliases":[],"aliases_ascii":[],"keywords":["symbol","punctuation"]},"grey_exclamation":{"unicode":"2755","unicode_alternates":"","name":"white exclamation mark ornament","shortname":":grey_exclamation:","category":"symbols","emoji_order":"851","aliases":[],"aliases_ascii":[],"keywords":["symbol","punctuation"]},"question":{"unicode":"2753","unicode_alternates":"","name":"black question mark ornament","shortname":":question:","category":"symbols","emoji_order":"852","aliases":[],"aliases_ascii":[],"keywords":["symbol","punctuation","wth","wth"]},"grey_question":{"unicode":"2754","unicode_alternates":"","name":"white question mark ornament","shortname":":grey_question:","category":"symbols","emoji_order":"853","aliases":[],"aliases_ascii":[],"keywords":["symbol","punctuation"]},"bangbang":{"unicode":"203c","unicode_alternates":"203c-fe0f","name":"double exclamation mark","shortname":":bangbang:","category":"symbols","emoji_order":"854","aliases":[],"aliases_ascii":[],"keywords":["symbol","punctuation"]},"interrobang":{"unicode":"2049","unicode_alternates":"2049-fe0f","name":"exclamation question mark","shortname":":interrobang:","category":"symbols","emoji_order":"855","aliases":[],"aliases_ascii":[],"keywords":["symbol","punctuation"]},"100":{"unicode":"1f4af","unicode_alternates":"","name":"hundred points symbol","shortname":":100:","category":"symbols","emoji_order":"856","aliases":[],"aliases_ascii":[],"keywords":["symbol","wow","wow","win","win","perfect","perfect","parties","parties"]},"low_brightness":{"unicode":"1f505","unicode_alternates":"","name":"low brightness symbol","shortname":":low_brightness:","category":"symbols","emoji_order":"857","aliases":[],"aliases_ascii":[],"keywords":["symbol","sun"]},"high_brightness":{"unicode":"1f506","unicode_alternates":"","name":"high brightness symbol","shortname":":high_brightness:","category":"symbols","emoji_order":"858","aliases":[],"aliases_ascii":[],"keywords":["symbol","sun"]},"trident":{"unicode":"1f531","unicode_alternates":"","name":"trident emblem","shortname":":trident:","category":"symbols","emoji_order":"859","aliases":[],"aliases_ascii":[],"keywords":["object","symbol"]},"fleur-de-lis":{"unicode":"269c","unicode_alternates":"269c-fe0f","name":"fleur-de-lis","shortname":":fleur-de-lis:","category":"symbols","emoji_order":"860","aliases":[],"aliases_ascii":[],"keywords":["object","symbol"]},"part_alternation_mark":{"unicode":"303d","unicode_alternates":"303d-fe0f","name":"part alternation mark","shortname":":part_alternation_mark:","category":"symbols","emoji_order":"861","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"warning":{"unicode":"26a0","unicode_alternates":"26a0-fe0f","name":"warning sign","shortname":":warning:","category":"symbols","emoji_order":"862","aliases":[],"aliases_ascii":[],"keywords":["symbol","punctuation"]},"children_crossing":{"unicode":"1f6b8","unicode_alternates":"","name":"children crossing","shortname":":children_crossing:","category":"symbols","emoji_order":"863","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"beginner":{"unicode":"1f530","unicode_alternates":"","name":"japanese symbol for beginner","shortname":":beginner:","category":"symbols","emoji_order":"864","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"recycle":{"unicode":"267b","unicode_alternates":"267b-fe0f","name":"black universal recycling symbol","shortname":":recycle:","category":"symbols","emoji_order":"865","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"u6307":{"unicode":"1f22f","unicode_alternates":"1f22f-fe0f","name":"squared cjk unified ideograph-6307","shortname":":u6307:","category":"symbols","emoji_order":"866","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"chart":{"unicode":"1f4b9","unicode_alternates":"","name":"chart with upwards trend and yen sign","shortname":":chart:","category":"symbols","emoji_order":"867","aliases":[],"aliases_ascii":[],"keywords":["symbol","money","money"]},"sparkle":{"unicode":"2747","unicode_alternates":"2747-fe0f","name":"sparkle","shortname":":sparkle:","category":"symbols","emoji_order":"868","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"eight_spoked_asterisk":{"unicode":"2733","unicode_alternates":"2733-fe0f","name":"eight spoked asterisk","shortname":":eight_spoked_asterisk:","category":"symbols","emoji_order":"869","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"negative_squared_cross_mark":{"unicode":"274e","unicode_alternates":"","name":"negative squared cross mark","shortname":":negative_squared_cross_mark:","category":"symbols","emoji_order":"870","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"white_check_mark":{"unicode":"2705","unicode_alternates":"","name":"white heavy check mark","shortname":":white_check_mark:","category":"symbols","emoji_order":"871","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"diamond_shape_with_a_dot_inside":{"unicode":"1f4a0","unicode_alternates":"","name":"diamond shape with a dot inside","shortname":":diamond_shape_with_a_dot_inside:","category":"symbols","emoji_order":"872","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"cyclone":{"unicode":"1f300","unicode_alternates":"","name":"cyclone","shortname":":cyclone:","category":"symbols","emoji_order":"873","aliases":[],"aliases_ascii":[],"keywords":["symbol","drugs","drugs"]},"loop":{"unicode":"27bf","unicode_alternates":"","name":"double curly loop","shortname":":loop:","category":"symbols","emoji_order":"874","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"globe_with_meridians":{"unicode":"1f310","unicode_alternates":"","name":"globe with meridians","shortname":":globe_with_meridians:","category":"symbols","emoji_order":"875","aliases":[],"aliases_ascii":[],"keywords":["symbol","globe","globe"]},"m":{"unicode":"24c2","unicode_alternates":"24c2-fe0f","name":"circled latin capital letter m","shortname":":m:","category":"symbols","emoji_order":"876","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"atm":{"unicode":"1f3e7","unicode_alternates":"","name":"automated teller machine","shortname":":atm:","category":"symbols","emoji_order":"877","aliases":[],"aliases_ascii":[],"keywords":["electronics","symbol","money","money"]},"sa":{"unicode":"1f202","unicode_alternates":"1f202-fe0f","name":"squared katakana sa","shortname":":sa:","category":"symbols","emoji_order":"878","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"passport_control":{"unicode":"1f6c2","unicode_alternates":"","name":"passport control","shortname":":passport_control:","category":"symbols","emoji_order":"879","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"customs":{"unicode":"1f6c3","unicode_alternates":"","name":"customs","shortname":":customs:","category":"symbols","emoji_order":"880","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"baggage_claim":{"unicode":"1f6c4","unicode_alternates":"","name":"baggage claim","shortname":":baggage_claim:","category":"symbols","emoji_order":"881","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"left_luggage":{"unicode":"1f6c5","unicode_alternates":"","name":"left luggage","shortname":":left_luggage:","category":"symbols","emoji_order":"882","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"wheelchair":{"unicode":"267f","unicode_alternates":"267f-fe0f","name":"wheelchair symbol","shortname":":wheelchair:","category":"symbols","emoji_order":"883","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"no_smoking":{"unicode":"1f6ad","unicode_alternates":"","name":"no smoking symbol","shortname":":no_smoking:","category":"symbols","emoji_order":"884","aliases":[],"aliases_ascii":[],"keywords":["symbol","smoking","smoking"]},"wc":{"unicode":"1f6be","unicode_alternates":"","name":"water closet","shortname":":wc:","category":"symbols","emoji_order":"885","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"parking":{"unicode":"1f17f","unicode_alternates":"1f17f-fe0f","name":"negative squared latin capital letter p","shortname":":parking:","category":"symbols","emoji_order":"886","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"potable_water":{"unicode":"1f6b0","unicode_alternates":"","name":"potable water symbol","shortname":":potable_water:","category":"symbols","emoji_order":"887","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"mens":{"unicode":"1f6b9","unicode_alternates":"","name":"mens symbol","shortname":":mens:","category":"symbols","emoji_order":"888","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"womens":{"unicode":"1f6ba","unicode_alternates":"","name":"womens symbol","shortname":":womens:","category":"symbols","emoji_order":"889","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"baby_symbol":{"unicode":"1f6bc","unicode_alternates":"","name":"baby symbol","shortname":":baby_symbol:","category":"symbols","emoji_order":"890","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"restroom":{"unicode":"1f6bb","unicode_alternates":"","name":"restroom","shortname":":restroom:","category":"symbols","emoji_order":"891","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"put_litter_in_its_place":{"unicode":"1f6ae","unicode_alternates":"","name":"put litter in its place symbol","shortname":":put_litter_in_its_place:","category":"symbols","emoji_order":"892","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"cinema":{"unicode":"1f3a6","unicode_alternates":"","name":"cinema","shortname":":cinema:","category":"symbols","emoji_order":"893","aliases":[],"aliases_ascii":[],"keywords":["symbol","camera","movie"]},"signal_strength":{"unicode":"1f4f6","unicode_alternates":"","name":"antenna with bars","shortname":":signal_strength:","category":"symbols","emoji_order":"894","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"koko":{"unicode":"1f201","unicode_alternates":"","name":"squared katakana koko","shortname":":koko:","category":"symbols","emoji_order":"895","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"ng":{"unicode":"1f196","unicode_alternates":"","name":"squared ng","shortname":":ng:","category":"symbols","emoji_order":"896","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"ok":{"unicode":"1f197","unicode_alternates":"","name":"squared ok","shortname":":ok:","category":"symbols","emoji_order":"897","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"up":{"unicode":"1f199","unicode_alternates":"","name":"squared up with exclamation mark","shortname":":up:","category":"symbols","emoji_order":"898","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"cool":{"unicode":"1f192","unicode_alternates":"","name":"squared cool","shortname":":cool:","category":"symbols","emoji_order":"899","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"new":{"unicode":"1f195","unicode_alternates":"","name":"squared new","shortname":":new:","category":"symbols","emoji_order":"900","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"free":{"unicode":"1f193","unicode_alternates":"","name":"squared free","shortname":":free:","category":"symbols","emoji_order":"901","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"zero":{"unicode":"0030-20e3","unicode_alternates":"0030-fe0f-20e3","name":"keycap digit zero","shortname":":zero:","category":"symbols","emoji_order":"902","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"one":{"unicode":"0031-20e3","unicode_alternates":"0031-fe0f-20e3","name":"keycap digit one","shortname":":one:","category":"symbols","emoji_order":"903","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"two":{"unicode":"0032-20e3","unicode_alternates":"0032-fe0f-20e3","name":"keycap digit two","shortname":":two:","category":"symbols","emoji_order":"904","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"three":{"unicode":"0033-20e3","unicode_alternates":"0033-fe0f-20e3","name":"keycap digit three","shortname":":three:","category":"symbols","emoji_order":"905","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"four":{"unicode":"0034-20e3","unicode_alternates":"0034-fe0f-20e3","name":"keycap digit four","shortname":":four:","category":"symbols","emoji_order":"906","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"five":{"unicode":"0035-20e3","unicode_alternates":"0035-fe0f-20e3","name":"keycap digit five","shortname":":five:","category":"symbols","emoji_order":"907","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"six":{"unicode":"0036-20e3","unicode_alternates":"0036-fe0f-20e3","name":"keycap digit six","shortname":":six:","category":"symbols","emoji_order":"908","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"seven":{"unicode":"0037-20e3","unicode_alternates":"0037-fe0f-20e3","name":"keycap digit seven","shortname":":seven:","category":"symbols","emoji_order":"909","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"eight":{"unicode":"0038-20e3","unicode_alternates":"0038-fe0f-20e3","name":"keycap digit eight","shortname":":eight:","category":"symbols","emoji_order":"910","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"nine":{"unicode":"0039-20e3","unicode_alternates":"0039-fe0f-20e3","name":"keycap digit nine","shortname":":nine:","category":"symbols","emoji_order":"911","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"keycap_ten":{"unicode":"1f51f","unicode_alternates":"","name":"keycap ten","shortname":":keycap_ten:","category":"symbols","emoji_order":"912","aliases":[],"aliases_ascii":[],"keywords":["number","math","symbol"]},"1234":{"unicode":"1f522","unicode_alternates":"","name":"input symbol for numbers","shortname":":1234:","category":"symbols","emoji_order":"913","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"arrow_forward":{"unicode":"25b6","unicode_alternates":"25b6-fe0f","name":"black right-pointing triangle","shortname":":arrow_forward:","category":"symbols","emoji_order":"914","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol","triangle","triangle"]},"pause_button":{"unicode":"23f8","unicode_alternates":"23f8-fe0f","name":"double vertical bar","shortname":":pause_button:","category":"symbols","emoji_order":"915","aliases":[":double_vertical_bar:"],"aliases_ascii":[],"keywords":["symbol"]},"play_pause":{"unicode":"23ef","unicode_alternates":"23ef-fe0f","name":"black right-pointing double triangle with double vertical bar","shortname":":play_pause:","category":"symbols","emoji_order":"916","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"stop_button":{"unicode":"23f9","unicode_alternates":"23f9-fe0f","name":"black square for stop","shortname":":stop_button:","category":"symbols","emoji_order":"917","aliases":[],"aliases_ascii":[],"keywords":["symbol","square","square"]},"record_button":{"unicode":"23fa","unicode_alternates":"23fa-fe0f","name":"black circle for record","shortname":":record_button:","category":"symbols","emoji_order":"918","aliases":[],"aliases_ascii":[],"keywords":["symbol","circle","circle"]},"track_next":{"unicode":"23ed","unicode_alternates":"23ed-fe0f","name":"black right-pointing double triangle with vertical bar","shortname":":track_next:","category":"symbols","emoji_order":"919","aliases":[":next_track:"],"aliases_ascii":[],"keywords":["arrow","symbol"]},"track_previous":{"unicode":"23ee","unicode_alternates":"23ee-fe0f","name":"black left-pointing double triangle with vertical bar","shortname":":track_previous:","category":"symbols","emoji_order":"920","aliases":[":previous_track:"],"aliases_ascii":[],"keywords":["arrow","symbol"]},"fast_forward":{"unicode":"23e9","unicode_alternates":"","name":"black right-pointing double triangle","shortname":":fast_forward:","category":"symbols","emoji_order":"921","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"rewind":{"unicode":"23ea","unicode_alternates":"","name":"black left-pointing double triangle","shortname":":rewind:","category":"symbols","emoji_order":"922","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"twisted_rightwards_arrows":{"unicode":"1f500","unicode_alternates":"","name":"twisted rightwards arrows","shortname":":twisted_rightwards_arrows:","category":"symbols","emoji_order":"923","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"repeat":{"unicode":"1f501","unicode_alternates":"","name":"clockwise rightwards and leftwards open circle arrows","shortname":":repeat:","category":"symbols","emoji_order":"924","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"repeat_one":{"unicode":"1f502","unicode_alternates":"","name":"clockwise rightwards and leftwards open circle arrows with circled one overlay","shortname":":repeat_one:","category":"symbols","emoji_order":"925","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_backward":{"unicode":"25c0","unicode_alternates":"25c0-fe0f","name":"black left-pointing triangle","shortname":":arrow_backward:","category":"symbols","emoji_order":"926","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol","triangle","triangle"]},"arrow_up_small":{"unicode":"1f53c","unicode_alternates":"","name":"up-pointing small red triangle","shortname":":arrow_up_small:","category":"symbols","emoji_order":"927","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol","triangle","triangle"]},"arrow_down_small":{"unicode":"1f53d","unicode_alternates":"","name":"down-pointing small red triangle","shortname":":arrow_down_small:","category":"symbols","emoji_order":"928","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol","triangle","triangle"]},"arrow_double_up":{"unicode":"23eb","unicode_alternates":"","name":"black up-pointing double triangle","shortname":":arrow_double_up:","category":"symbols","emoji_order":"929","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_double_down":{"unicode":"23ec","unicode_alternates":"","name":"black down-pointing double triangle","shortname":":arrow_double_down:","category":"symbols","emoji_order":"930","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_right":{"unicode":"27a1","unicode_alternates":"27a1-fe0f","name":"black rightwards arrow","shortname":":arrow_right:","category":"symbols","emoji_order":"931","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_left":{"unicode":"2b05","unicode_alternates":"2b05-fe0f","name":"leftwards black arrow","shortname":":arrow_left:","category":"symbols","emoji_order":"932","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_up":{"unicode":"2b06","unicode_alternates":"2b06-fe0f","name":"upwards black arrow","shortname":":arrow_up:","category":"symbols","emoji_order":"933","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_down":{"unicode":"2b07","unicode_alternates":"2b07-fe0f","name":"downwards black arrow","shortname":":arrow_down:","category":"symbols","emoji_order":"934","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_upper_right":{"unicode":"2197","unicode_alternates":"2197-fe0f","name":"north east arrow","shortname":":arrow_upper_right:","category":"symbols","emoji_order":"935","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_lower_right":{"unicode":"2198","unicode_alternates":"2198-fe0f","name":"south east arrow","shortname":":arrow_lower_right:","category":"symbols","emoji_order":"936","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_lower_left":{"unicode":"2199","unicode_alternates":"2199-fe0f","name":"south west arrow","shortname":":arrow_lower_left:","category":"symbols","emoji_order":"937","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_upper_left":{"unicode":"2196","unicode_alternates":"2196-fe0f","name":"north west arrow","shortname":":arrow_upper_left:","category":"symbols","emoji_order":"938","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_up_down":{"unicode":"2195","unicode_alternates":"2195-fe0f","name":"up down arrow","shortname":":arrow_up_down:","category":"symbols","emoji_order":"939","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"left_right_arrow":{"unicode":"2194","unicode_alternates":"2194-fe0f","name":"left right arrow","shortname":":left_right_arrow:","category":"symbols","emoji_order":"940","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrows_counterclockwise":{"unicode":"1f504","unicode_alternates":"","name":"anticlockwise downwards and upwards open circle arrows","shortname":":arrows_counterclockwise:","category":"symbols","emoji_order":"941","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_right_hook":{"unicode":"21aa","unicode_alternates":"21aa-fe0f","name":"rightwards arrow with hook","shortname":":arrow_right_hook:","category":"symbols","emoji_order":"942","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"leftwards_arrow_with_hook":{"unicode":"21a9","unicode_alternates":"21a9-fe0f","name":"leftwards arrow with hook","shortname":":leftwards_arrow_with_hook:","category":"symbols","emoji_order":"943","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_heading_up":{"unicode":"2934","unicode_alternates":"2934-fe0f","name":"arrow pointing rightwards then curving upwards","shortname":":arrow_heading_up:","category":"symbols","emoji_order":"944","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"arrow_heading_down":{"unicode":"2935","unicode_alternates":"2935-fe0f","name":"arrow pointing rightwards then curving downwards","shortname":":arrow_heading_down:","category":"symbols","emoji_order":"945","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"hash":{"unicode":"0023-20e3","unicode_alternates":"0023-fe0f-20e3","name":"keycap number sign","shortname":":hash:","category":"symbols","emoji_order":"946","aliases":[],"aliases_ascii":[],"keywords":["number","symbol"]},"asterisk":{"unicode":"002a-20e3","unicode_alternates":"002a-fe0f-20e3","name":"keycap asterisk","shortname":":asterisk:","category":"symbols","emoji_order":"947","aliases":[":keycap_asterisk:"],"aliases_ascii":[],"keywords":["symbol"]},"information_source":{"unicode":"2139","unicode_alternates":"2139-fe0f","name":"information source","shortname":":information_source:","category":"symbols","emoji_order":"948","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"abc":{"unicode":"1f524","unicode_alternates":"","name":"input symbol for latin letters","shortname":":abc:","category":"symbols","emoji_order":"949","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"abcd":{"unicode":"1f521","unicode_alternates":"","name":"input symbol for latin small letters","shortname":":abcd:","category":"symbols","emoji_order":"950","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"capital_abcd":{"unicode":"1f520","unicode_alternates":"","name":"input symbol for latin capital letters","shortname":":capital_abcd:","category":"symbols","emoji_order":"951","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"symbols":{"unicode":"1f523","unicode_alternates":"","name":"input symbol for symbols","shortname":":symbols:","category":"symbols","emoji_order":"952","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"musical_note":{"unicode":"1f3b5","unicode_alternates":"","name":"musical note","shortname":":musical_note:","category":"symbols","emoji_order":"953","aliases":[],"aliases_ascii":[],"keywords":["instruments","symbol"]},"notes":{"unicode":"1f3b6","unicode_alternates":"","name":"multiple musical notes","shortname":":notes:","category":"symbols","emoji_order":"954","aliases":[],"aliases_ascii":[],"keywords":["instruments","symbol"]},"wavy_dash":{"unicode":"3030","unicode_alternates":"3030-fe0f","name":"wavy dash","shortname":":wavy_dash:","category":"symbols","emoji_order":"955","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"curly_loop":{"unicode":"27b0","unicode_alternates":"","name":"curly loop","shortname":":curly_loop:","category":"symbols","emoji_order":"956","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"heavy_check_mark":{"unicode":"2714","unicode_alternates":"2714-fe0f","name":"heavy check mark","shortname":":heavy_check_mark:","category":"symbols","emoji_order":"957","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"arrows_clockwise":{"unicode":"1f503","unicode_alternates":"","name":"clockwise downwards and upwards open circle arrows","shortname":":arrows_clockwise:","category":"symbols","emoji_order":"958","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"heavy_plus_sign":{"unicode":"2795","unicode_alternates":"","name":"heavy plus sign","shortname":":heavy_plus_sign:","category":"symbols","emoji_order":"959","aliases":[],"aliases_ascii":[],"keywords":["math","symbol"]},"heavy_minus_sign":{"unicode":"2796","unicode_alternates":"","name":"heavy minus sign","shortname":":heavy_minus_sign:","category":"symbols","emoji_order":"960","aliases":[],"aliases_ascii":[],"keywords":["math","symbol"]},"heavy_division_sign":{"unicode":"2797","unicode_alternates":"","name":"heavy division sign","shortname":":heavy_division_sign:","category":"symbols","emoji_order":"961","aliases":[],"aliases_ascii":[],"keywords":["math","symbol"]},"heavy_multiplication_x":{"unicode":"2716","unicode_alternates":"2716-fe0f","name":"heavy multiplication x","shortname":":heavy_multiplication_x:","category":"symbols","emoji_order":"962","aliases":[],"aliases_ascii":[],"keywords":["math","symbol"]},"heavy_dollar_sign":{"unicode":"1f4b2","unicode_alternates":"","name":"heavy dollar sign","shortname":":heavy_dollar_sign:","category":"symbols","emoji_order":"963","aliases":[],"aliases_ascii":[],"keywords":["math","symbol","money","money"]},"currency_exchange":{"unicode":"1f4b1","unicode_alternates":"","name":"currency exchange","shortname":":currency_exchange:","category":"symbols","emoji_order":"964","aliases":[],"aliases_ascii":[],"keywords":["symbol","money","money"]},"copyright":{"unicode":"00a9","unicode_alternates":"00a9-fe0f","name":"copyright sign","shortname":":copyright:","category":"symbols","emoji_order":"965","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"registered":{"unicode":"00ae","unicode_alternates":"00ae-fe0f","name":"registered sign","shortname":":registered:","category":"symbols","emoji_order":"966","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"tm":{"unicode":"2122","unicode_alternates":"2122-fe0f","name":"trade mark sign","shortname":":tm:","category":"symbols","emoji_order":"967","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"end":{"unicode":"1f51a","unicode_alternates":"","name":"end with leftwards arrow above","shortname":":end:","category":"symbols","emoji_order":"968","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"back":{"unicode":"1f519","unicode_alternates":"","name":"back with leftwards arrow above","shortname":":back:","category":"symbols","emoji_order":"969","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"on":{"unicode":"1f51b","unicode_alternates":"","name":"on with exclamation mark with left right arrow abo","shortname":":on:","category":"symbols","emoji_order":"970","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"top":{"unicode":"1f51d","unicode_alternates":"","name":"top with upwards arrow above","shortname":":top:","category":"symbols","emoji_order":"971","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"soon":{"unicode":"1f51c","unicode_alternates":"","name":"soon with rightwards arrow above","shortname":":soon:","category":"symbols","emoji_order":"972","aliases":[],"aliases_ascii":[],"keywords":["arrow","symbol"]},"ballot_box_with_check":{"unicode":"2611","unicode_alternates":"2611-fe0f","name":"ballot box with check","shortname":":ballot_box_with_check:","category":"symbols","emoji_order":"973","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"radio_button":{"unicode":"1f518","unicode_alternates":"","name":"radio button","shortname":":radio_button:","category":"symbols","emoji_order":"974","aliases":[],"aliases_ascii":[],"keywords":["symbol","circle","circle"]},"white_circle":{"unicode":"26aa","unicode_alternates":"26aa-fe0f","name":"medium white circle","shortname":":white_circle:","category":"symbols","emoji_order":"975","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","circle","circle"]},"black_circle":{"unicode":"26ab","unicode_alternates":"26ab-fe0f","name":"medium black circle","shortname":":black_circle:","category":"symbols","emoji_order":"976","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","circle","circle"]},"red_circle":{"unicode":"1f534","unicode_alternates":"","name":"large red circle","shortname":":red_circle:","category":"symbols","emoji_order":"977","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","circle","circle"]},"large_blue_circle":{"unicode":"1f535","unicode_alternates":"","name":"large blue circle","shortname":":large_blue_circle:","category":"symbols","emoji_order":"978","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","circle","circle"]},"small_orange_diamond":{"unicode":"1f538","unicode_alternates":"","name":"small orange diamond","shortname":":small_orange_diamond:","category":"symbols","emoji_order":"979","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol"]},"small_blue_diamond":{"unicode":"1f539","unicode_alternates":"","name":"small blue diamond","shortname":":small_blue_diamond:","category":"symbols","emoji_order":"980","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol"]},"large_orange_diamond":{"unicode":"1f536","unicode_alternates":"","name":"large orange diamond","shortname":":large_orange_diamond:","category":"symbols","emoji_order":"981","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol"]},"large_blue_diamond":{"unicode":"1f537","unicode_alternates":"","name":"large blue diamond","shortname":":large_blue_diamond:","category":"symbols","emoji_order":"982","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol"]},"small_red_triangle":{"unicode":"1f53a","unicode_alternates":"","name":"up-pointing red triangle","shortname":":small_red_triangle:","category":"symbols","emoji_order":"983","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","triangle","triangle"]},"black_small_square":{"unicode":"25aa","unicode_alternates":"25aa-fe0f","name":"black small square","shortname":":black_small_square:","category":"symbols","emoji_order":"984","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"white_small_square":{"unicode":"25ab","unicode_alternates":"25ab-fe0f","name":"white small square","shortname":":white_small_square:","category":"symbols","emoji_order":"985","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"black_large_square":{"unicode":"2b1b","unicode_alternates":"2b1b-fe0f","name":"black large square","shortname":":black_large_square:","category":"symbols","emoji_order":"986","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"white_large_square":{"unicode":"2b1c","unicode_alternates":"2b1c-fe0f","name":"white large square","shortname":":white_large_square:","category":"symbols","emoji_order":"987","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"small_red_triangle_down":{"unicode":"1f53b","unicode_alternates":"","name":"down-pointing red triangle","shortname":":small_red_triangle_down:","category":"symbols","emoji_order":"988","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","triangle","triangle"]},"black_medium_square":{"unicode":"25fc","unicode_alternates":"25fc-fe0f","name":"black medium square","shortname":":black_medium_square:","category":"symbols","emoji_order":"989","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"white_medium_square":{"unicode":"25fb","unicode_alternates":"25fb-fe0f","name":"white medium square","shortname":":white_medium_square:","category":"symbols","emoji_order":"990","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"black_medium_small_square":{"unicode":"25fe","unicode_alternates":"25fe-fe0f","name":"black medium small square","shortname":":black_medium_small_square:","category":"symbols","emoji_order":"991","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"white_medium_small_square":{"unicode":"25fd","unicode_alternates":"25fd-fe0f","name":"white medium small square","shortname":":white_medium_small_square:","category":"symbols","emoji_order":"992","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"black_square_button":{"unicode":"1f532","unicode_alternates":"","name":"black square button","shortname":":black_square_button:","category":"symbols","emoji_order":"993","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"white_square_button":{"unicode":"1f533","unicode_alternates":"","name":"white square button","shortname":":white_square_button:","category":"symbols","emoji_order":"994","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","square","square"]},"speaker":{"unicode":"1f508","unicode_alternates":"","name":"speaker","shortname":":speaker:","category":"symbols","emoji_order":"995","aliases":[],"aliases_ascii":[],"keywords":["alarm","symbol"]},"sound":{"unicode":"1f509","unicode_alternates":"","name":"speaker with one sound wave","shortname":":sound:","category":"symbols","emoji_order":"996","aliases":[],"aliases_ascii":[],"keywords":["alarm","symbol"]},"loud_sound":{"unicode":"1f50a","unicode_alternates":"","name":"speaker with three sound waves","shortname":":loud_sound:","category":"symbols","emoji_order":"997","aliases":[],"aliases_ascii":[],"keywords":["alarm","symbol"]},"mute":{"unicode":"1f507","unicode_alternates":"","name":"speaker with cancellation stroke","shortname":":mute:","category":"symbols","emoji_order":"998","aliases":[],"aliases_ascii":[],"keywords":["alarm","symbol"]},"mega":{"unicode":"1f4e3","unicode_alternates":"","name":"cheering megaphone","shortname":":mega:","category":"symbols","emoji_order":"999","aliases":[],"aliases_ascii":[],"keywords":["object","sport"]},"loudspeaker":{"unicode":"1f4e2","unicode_alternates":"","name":"public address loudspeaker","shortname":":loudspeaker:","category":"symbols","emoji_order":"1000","aliases":[],"aliases_ascii":[],"keywords":["object","alarm","symbol"]},"bell":{"unicode":"1f514","unicode_alternates":"","name":"bell","shortname":":bell:","category":"symbols","emoji_order":"1001","aliases":[],"aliases_ascii":[],"keywords":["object","alarm","symbol"]},"no_bell":{"unicode":"1f515","unicode_alternates":"","name":"bell with cancellation stroke","shortname":":no_bell:","category":"symbols","emoji_order":"1002","aliases":[],"aliases_ascii":[],"keywords":["alarm","symbol"]},"black_joker":{"unicode":"1f0cf","unicode_alternates":"","name":"playing card black joker","shortname":":black_joker:","category":"symbols","emoji_order":"1003","aliases":[],"aliases_ascii":[],"keywords":["object","symbol","game"]},"mahjong":{"unicode":"1f004","unicode_alternates":"1f004-fe0f","name":"mahjong tile red dragon","shortname":":mahjong:","category":"symbols","emoji_order":"1004","aliases":[],"aliases_ascii":[],"keywords":["object","symbol","game"]},"spades":{"unicode":"2660","unicode_alternates":"2660-fe0f","name":"black spade suit","shortname":":spades:","category":"symbols","emoji_order":"1005","aliases":[],"aliases_ascii":[],"keywords":["symbol","game"]},"clubs":{"unicode":"2663","unicode_alternates":"2663-fe0f","name":"black club suit","shortname":":clubs:","category":"symbols","emoji_order":"1006","aliases":[],"aliases_ascii":[],"keywords":["symbol","game"]},"hearts":{"unicode":"2665","unicode_alternates":"2665-fe0f","name":"black heart suit","shortname":":hearts:","category":"symbols","emoji_order":"1007","aliases":[],"aliases_ascii":[],"keywords":["love","symbol","game"]},"diamonds":{"unicode":"2666","unicode_alternates":"2666-fe0f","name":"black diamond suit","shortname":":diamonds:","category":"symbols","emoji_order":"1008","aliases":[],"aliases_ascii":[],"keywords":["shapes","symbol","game"]},"flower_playing_cards":{"unicode":"1f3b4","unicode_alternates":"","name":"flower playing cards","shortname":":flower_playing_cards:","category":"symbols","emoji_order":"1009","aliases":[],"aliases_ascii":[],"keywords":["object","symbol"]},"thought_balloon":{"unicode":"1f4ad","unicode_alternates":"","name":"thought balloon","shortname":":thought_balloon:","category":"symbols","emoji_order":"1010","aliases":[],"aliases_ascii":[],"keywords":["symbol"]},"anger_right":{"unicode":"1f5ef","unicode_alternates":"1f5ef-fe0f","name":"right anger bubble","shortname":":anger_right:","category":"symbols","emoji_order":"1011","aliases":[":right_anger_bubble:"],"aliases_ascii":[],"keywords":["symbol"]},"speech_balloon":{"unicode":"1f4ac","unicode_alternates":"","name":"speech balloon","shortname":":speech_balloon:","category":"symbols","emoji_order":"1012","aliases":[],"aliases_ascii":[],"keywords":["symbol","free speech","free speech"]},"clock1":{"unicode":"1f550","unicode_alternates":"","name":"clock face one oclock","shortname":":clock1:","category":"symbols","emoji_order":"1013","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock2":{"unicode":"1f551","unicode_alternates":"","name":"clock face two oclock","shortname":":clock2:","category":"symbols","emoji_order":"1014","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock3":{"unicode":"1f552","unicode_alternates":"","name":"clock face three oclock","shortname":":clock3:","category":"symbols","emoji_order":"1015","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock4":{"unicode":"1f553","unicode_alternates":"","name":"clock face four oclock","shortname":":clock4:","category":"symbols","emoji_order":"1016","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock5":{"unicode":"1f554","unicode_alternates":"","name":"clock face five oclock","shortname":":clock5:","category":"symbols","emoji_order":"1017","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock6":{"unicode":"1f555","unicode_alternates":"","name":"clock face six oclock","shortname":":clock6:","category":"symbols","emoji_order":"1018","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock7":{"unicode":"1f556","unicode_alternates":"","name":"clock face seven oclock","shortname":":clock7:","category":"symbols","emoji_order":"1019","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock8":{"unicode":"1f557","unicode_alternates":"","name":"clock face eight oclock","shortname":":clock8:","category":"symbols","emoji_order":"1020","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock9":{"unicode":"1f558","unicode_alternates":"","name":"clock face nine oclock","shortname":":clock9:","category":"symbols","emoji_order":"1021","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock10":{"unicode":"1f559","unicode_alternates":"","name":"clock face ten oclock","shortname":":clock10:","category":"symbols","emoji_order":"1022","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock11":{"unicode":"1f55a","unicode_alternates":"","name":"clock face eleven oclock","shortname":":clock11:","category":"symbols","emoji_order":"1023","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock12":{"unicode":"1f55b","unicode_alternates":"","name":"clock face twelve oclock","shortname":":clock12:","category":"symbols","emoji_order":"1024","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock130":{"unicode":"1f55c","unicode_alternates":"","name":"clock face one-thirty","shortname":":clock130:","category":"symbols","emoji_order":"1025","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock230":{"unicode":"1f55d","unicode_alternates":"","name":"clock face two-thirty","shortname":":clock230:","category":"symbols","emoji_order":"1026","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock330":{"unicode":"1f55e","unicode_alternates":"","name":"clock face three-thirty","shortname":":clock330:","category":"symbols","emoji_order":"1027","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock430":{"unicode":"1f55f","unicode_alternates":"","name":"clock face four-thirty","shortname":":clock430:","category":"symbols","emoji_order":"1028","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock530":{"unicode":"1f560","unicode_alternates":"","name":"clock face five-thirty","shortname":":clock530:","category":"symbols","emoji_order":"1029","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock630":{"unicode":"1f561","unicode_alternates":"","name":"clock face six-thirty","shortname":":clock630:","category":"symbols","emoji_order":"1030","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock730":{"unicode":"1f562","unicode_alternates":"","name":"clock face seven-thirty","shortname":":clock730:","category":"symbols","emoji_order":"1031","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock830":{"unicode":"1f563","unicode_alternates":"","name":"clock face eight-thirty","shortname":":clock830:","category":"symbols","emoji_order":"1032","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock930":{"unicode":"1f564","unicode_alternates":"","name":"clock face nine-thirty","shortname":":clock930:","category":"symbols","emoji_order":"1033","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock1030":{"unicode":"1f565","unicode_alternates":"","name":"clock face ten-thirty","shortname":":clock1030:","category":"symbols","emoji_order":"1034","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock1130":{"unicode":"1f566","unicode_alternates":"","name":"clock face eleven-thirty","shortname":":clock1130:","category":"symbols","emoji_order":"1035","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"clock1230":{"unicode":"1f567","unicode_alternates":"","name":"clock face twelve-thirty","shortname":":clock1230:","category":"symbols","emoji_order":"1036","aliases":[],"aliases_ascii":[],"keywords":["symbol","time"]},"eye_in_speech_bubble":{"unicode":"1f441-1f5e8","unicode_alternates":"1f441-200d-1f5e8","name":"eye in speech bubble","shortname":":eye_in_speech_bubble:","category":"symbols","emoji_order":"1037","aliases":[],"aliases_ascii":[],"keywords":["object","symbol","eyes","talk"]},"flag_ac":{"unicode":"1f1e6-1f1e8","unicode_alternates":"","name":"ascension","shortname":":flag_ac:","category":"flags","emoji_order":"1038","aliases":[":ac:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_af":{"unicode":"1f1e6-1f1eb","unicode_alternates":"","name":"afghanistan","shortname":":flag_af:","category":"flags","emoji_order":"1039","aliases":[":af:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_al":{"unicode":"1f1e6-1f1f1","unicode_alternates":"","name":"albania","shortname":":flag_al:","category":"flags","emoji_order":"1040","aliases":[":al:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_dz":{"unicode":"1f1e9-1f1ff","unicode_alternates":"","name":"algeria","shortname":":flag_dz:","category":"flags","emoji_order":"1041","aliases":[":dz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ad":{"unicode":"1f1e6-1f1e9","unicode_alternates":"","name":"andorra","shortname":":flag_ad:","category":"flags","emoji_order":"1042","aliases":[":ad:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ao":{"unicode":"1f1e6-1f1f4","unicode_alternates":"","name":"angola","shortname":":flag_ao:","category":"flags","emoji_order":"1043","aliases":[":ao:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ai":{"unicode":"1f1e6-1f1ee","unicode_alternates":"","name":"anguilla","shortname":":flag_ai:","category":"flags","emoji_order":"1044","aliases":[":ai:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ag":{"unicode":"1f1e6-1f1ec","unicode_alternates":"","name":"antigua and barbuda","shortname":":flag_ag:","category":"flags","emoji_order":"1045","aliases":[":ag:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ar":{"unicode":"1f1e6-1f1f7","unicode_alternates":"","name":"argentina","shortname":":flag_ar:","category":"flags","emoji_order":"1046","aliases":[":ar:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_am":{"unicode":"1f1e6-1f1f2","unicode_alternates":"","name":"armenia","shortname":":flag_am:","category":"flags","emoji_order":"1047","aliases":[":am:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_aw":{"unicode":"1f1e6-1f1fc","unicode_alternates":"","name":"aruba","shortname":":flag_aw:","category":"flags","emoji_order":"1048","aliases":[":aw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_au":{"unicode":"1f1e6-1f1fa","unicode_alternates":"","name":"australia","shortname":":flag_au:","category":"flags","emoji_order":"1049","aliases":[":au:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_at":{"unicode":"1f1e6-1f1f9","unicode_alternates":"","name":"austria","shortname":":flag_at:","category":"flags","emoji_order":"1050","aliases":[":at:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_az":{"unicode":"1f1e6-1f1ff","unicode_alternates":"","name":"azerbaijan","shortname":":flag_az:","category":"flags","emoji_order":"1051","aliases":[":az:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bs":{"unicode":"1f1e7-1f1f8","unicode_alternates":"","name":"the bahamas","shortname":":flag_bs:","category":"flags","emoji_order":"1052","aliases":[":bs:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bh":{"unicode":"1f1e7-1f1ed","unicode_alternates":"","name":"bahrain","shortname":":flag_bh:","category":"flags","emoji_order":"1053","aliases":[":bh:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bd":{"unicode":"1f1e7-1f1e9","unicode_alternates":"","name":"bangladesh","shortname":":flag_bd:","category":"flags","emoji_order":"1054","aliases":[":bd:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bb":{"unicode":"1f1e7-1f1e7","unicode_alternates":"","name":"barbados","shortname":":flag_bb:","category":"flags","emoji_order":"1055","aliases":[":bb:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_by":{"unicode":"1f1e7-1f1fe","unicode_alternates":"","name":"belarus","shortname":":flag_by:","category":"flags","emoji_order":"1056","aliases":[":by:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_be":{"unicode":"1f1e7-1f1ea","unicode_alternates":"","name":"belgium","shortname":":flag_be:","category":"flags","emoji_order":"1057","aliases":[":be:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bz":{"unicode":"1f1e7-1f1ff","unicode_alternates":"","name":"belize","shortname":":flag_bz:","category":"flags","emoji_order":"1058","aliases":[":bz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bj":{"unicode":"1f1e7-1f1ef","unicode_alternates":"","name":"benin","shortname":":flag_bj:","category":"flags","emoji_order":"1059","aliases":[":bj:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bm":{"unicode":"1f1e7-1f1f2","unicode_alternates":"","name":"bermuda","shortname":":flag_bm:","category":"flags","emoji_order":"1060","aliases":[":bm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bt":{"unicode":"1f1e7-1f1f9","unicode_alternates":"","name":"bhutan","shortname":":flag_bt:","category":"flags","emoji_order":"1061","aliases":[":bt:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bo":{"unicode":"1f1e7-1f1f4","unicode_alternates":"","name":"bolivia","shortname":":flag_bo:","category":"flags","emoji_order":"1062","aliases":[":bo:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ba":{"unicode":"1f1e7-1f1e6","unicode_alternates":"","name":"bosnia and herzegovina","shortname":":flag_ba:","category":"flags","emoji_order":"1063","aliases":[":ba:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bw":{"unicode":"1f1e7-1f1fc","unicode_alternates":"","name":"botswana","shortname":":flag_bw:","category":"flags","emoji_order":"1064","aliases":[":bw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_br":{"unicode":"1f1e7-1f1f7","unicode_alternates":"","name":"brazil","shortname":":flag_br:","category":"flags","emoji_order":"1065","aliases":[":br:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bn":{"unicode":"1f1e7-1f1f3","unicode_alternates":"","name":"brunei","shortname":":flag_bn:","category":"flags","emoji_order":"1066","aliases":[":bn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bg":{"unicode":"1f1e7-1f1ec","unicode_alternates":"","name":"bulgaria","shortname":":flag_bg:","category":"flags","emoji_order":"1067","aliases":[":bg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bf":{"unicode":"1f1e7-1f1eb","unicode_alternates":"","name":"burkina faso","shortname":":flag_bf:","category":"flags","emoji_order":"1068","aliases":[":bf:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bi":{"unicode":"1f1e7-1f1ee","unicode_alternates":"","name":"burundi","shortname":":flag_bi:","category":"flags","emoji_order":"1069","aliases":[":bi:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cv":{"unicode":"1f1e8-1f1fb","unicode_alternates":"","name":"cape verde","shortname":":flag_cv:","category":"flags","emoji_order":"1070","aliases":[":cv:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_kh":{"unicode":"1f1f0-1f1ed","unicode_alternates":"","name":"cambodia","shortname":":flag_kh:","category":"flags","emoji_order":"1071","aliases":[":kh:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cm":{"unicode":"1f1e8-1f1f2","unicode_alternates":"","name":"cameroon","shortname":":flag_cm:","category":"flags","emoji_order":"1072","aliases":[":cm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ca":{"unicode":"1f1e8-1f1e6","unicode_alternates":"","name":"canada","shortname":":flag_ca:","category":"flags","emoji_order":"1073","aliases":[":ca:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ky":{"unicode":"1f1f0-1f1fe","unicode_alternates":"","name":"cayman islands","shortname":":flag_ky:","category":"flags","emoji_order":"1074","aliases":[":ky:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cf":{"unicode":"1f1e8-1f1eb","unicode_alternates":"","name":"central african republic","shortname":":flag_cf:","category":"flags","emoji_order":"1075","aliases":[":cf:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_td":{"unicode":"1f1f9-1f1e9","unicode_alternates":"","name":"chad","shortname":":flag_td:","category":"flags","emoji_order":"1076","aliases":[":td:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cl":{"unicode":"1f1e8-1f1f1","unicode_alternates":"","name":"chile","shortname":":flag_cl:","category":"flags","emoji_order":"1077","aliases":[":chile:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cn":{"unicode":"1f1e8-1f1f3","unicode_alternates":"","name":"china","shortname":":flag_cn:","category":"flags","emoji_order":"1078","aliases":[":cn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_co":{"unicode":"1f1e8-1f1f4","unicode_alternates":"","name":"colombia","shortname":":flag_co:","category":"flags","emoji_order":"1079","aliases":[":co:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_km":{"unicode":"1f1f0-1f1f2","unicode_alternates":"","name":"the comoros","shortname":":flag_km:","category":"flags","emoji_order":"1080","aliases":[":km:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cg":{"unicode":"1f1e8-1f1ec","unicode_alternates":"","name":"the republic of the congo","shortname":":flag_cg:","category":"flags","emoji_order":"1081","aliases":[":cg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cd":{"unicode":"1f1e8-1f1e9","unicode_alternates":"","name":"the democratic republic of the congo","shortname":":flag_cd:","category":"flags","emoji_order":"1082","aliases":[":congo:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cr":{"unicode":"1f1e8-1f1f7","unicode_alternates":"","name":"costa rica","shortname":":flag_cr:","category":"flags","emoji_order":"1083","aliases":[":cr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_hr":{"unicode":"1f1ed-1f1f7","unicode_alternates":"","name":"croatia","shortname":":flag_hr:","category":"flags","emoji_order":"1084","aliases":[":hr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cu":{"unicode":"1f1e8-1f1fa","unicode_alternates":"","name":"cuba","shortname":":flag_cu:","category":"flags","emoji_order":"1085","aliases":[":cu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cy":{"unicode":"1f1e8-1f1fe","unicode_alternates":"","name":"cyprus","shortname":":flag_cy:","category":"flags","emoji_order":"1086","aliases":[":cy:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cz":{"unicode":"1f1e8-1f1ff","unicode_alternates":"","name":"the czech republic","shortname":":flag_cz:","category":"flags","emoji_order":"1087","aliases":[":cz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_dk":{"unicode":"1f1e9-1f1f0","unicode_alternates":"","name":"denmark","shortname":":flag_dk:","category":"flags","emoji_order":"1088","aliases":[":dk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_dj":{"unicode":"1f1e9-1f1ef","unicode_alternates":"","name":"djibouti","shortname":":flag_dj:","category":"flags","emoji_order":"1089","aliases":[":dj:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_dm":{"unicode":"1f1e9-1f1f2","unicode_alternates":"","name":"dominica","shortname":":flag_dm:","category":"flags","emoji_order":"1090","aliases":[":dm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_do":{"unicode":"1f1e9-1f1f4","unicode_alternates":"","name":"the dominican republic","shortname":":flag_do:","category":"flags","emoji_order":"1091","aliases":[":do:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ec":{"unicode":"1f1ea-1f1e8","unicode_alternates":"","name":"ecuador","shortname":":flag_ec:","category":"flags","emoji_order":"1092","aliases":[":ec:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_eg":{"unicode":"1f1ea-1f1ec","unicode_alternates":"","name":"egypt","shortname":":flag_eg:","category":"flags","emoji_order":"1093","aliases":[":eg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sv":{"unicode":"1f1f8-1f1fb","unicode_alternates":"","name":"el salvador","shortname":":flag_sv:","category":"flags","emoji_order":"1094","aliases":[":sv:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gq":{"unicode":"1f1ec-1f1f6","unicode_alternates":"","name":"equatorial guinea","shortname":":flag_gq:","category":"flags","emoji_order":"1095","aliases":[":gq:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_er":{"unicode":"1f1ea-1f1f7","unicode_alternates":"","name":"eritrea","shortname":":flag_er:","category":"flags","emoji_order":"1096","aliases":[":er:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ee":{"unicode":"1f1ea-1f1ea","unicode_alternates":"","name":"estonia","shortname":":flag_ee:","category":"flags","emoji_order":"1097","aliases":[":ee:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_et":{"unicode":"1f1ea-1f1f9","unicode_alternates":"","name":"ethiopia","shortname":":flag_et:","category":"flags","emoji_order":"1098","aliases":[":et:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_fk":{"unicode":"1f1eb-1f1f0","unicode_alternates":"","name":"falkland islands","shortname":":flag_fk:","category":"flags","emoji_order":"1099","aliases":[":fk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_fo":{"unicode":"1f1eb-1f1f4","unicode_alternates":"","name":"faroe islands","shortname":":flag_fo:","category":"flags","emoji_order":"1100","aliases":[":fo:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_fj":{"unicode":"1f1eb-1f1ef","unicode_alternates":"","name":"fiji","shortname":":flag_fj:","category":"flags","emoji_order":"1101","aliases":[":fj:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_fi":{"unicode":"1f1eb-1f1ee","unicode_alternates":"","name":"finland","shortname":":flag_fi:","category":"flags","emoji_order":"1102","aliases":[":fi:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_fr":{"unicode":"1f1eb-1f1f7","unicode_alternates":"","name":"france","shortname":":flag_fr:","category":"flags","emoji_order":"1103","aliases":[":fr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pf":{"unicode":"1f1f5-1f1eb","unicode_alternates":"","name":"french polynesia","shortname":":flag_pf:","category":"flags","emoji_order":"1104","aliases":[":pf:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ga":{"unicode":"1f1ec-1f1e6","unicode_alternates":"","name":"gabon","shortname":":flag_ga:","category":"flags","emoji_order":"1105","aliases":[":ga:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gm":{"unicode":"1f1ec-1f1f2","unicode_alternates":"","name":"the gambia","shortname":":flag_gm:","category":"flags","emoji_order":"1106","aliases":[":gm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ge":{"unicode":"1f1ec-1f1ea","unicode_alternates":"","name":"georgia","shortname":":flag_ge:","category":"flags","emoji_order":"1107","aliases":[":ge:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_de":{"unicode":"1f1e9-1f1ea","unicode_alternates":"","name":"germany","shortname":":flag_de:","category":"flags","emoji_order":"1108","aliases":[":de:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gh":{"unicode":"1f1ec-1f1ed","unicode_alternates":"","name":"ghana","shortname":":flag_gh:","category":"flags","emoji_order":"1109","aliases":[":gh:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gi":{"unicode":"1f1ec-1f1ee","unicode_alternates":"","name":"gibraltar","shortname":":flag_gi:","category":"flags","emoji_order":"1110","aliases":[":gi:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gr":{"unicode":"1f1ec-1f1f7","unicode_alternates":"","name":"greece","shortname":":flag_gr:","category":"flags","emoji_order":"1111","aliases":[":gr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gl":{"unicode":"1f1ec-1f1f1","unicode_alternates":"","name":"greenland","shortname":":flag_gl:","category":"flags","emoji_order":"1112","aliases":[":gl:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gd":{"unicode":"1f1ec-1f1e9","unicode_alternates":"","name":"grenada","shortname":":flag_gd:","category":"flags","emoji_order":"1113","aliases":[":gd:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gu":{"unicode":"1f1ec-1f1fa","unicode_alternates":"","name":"guam","shortname":":flag_gu:","category":"flags","emoji_order":"1114","aliases":[":gu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gt":{"unicode":"1f1ec-1f1f9","unicode_alternates":"","name":"guatemala","shortname":":flag_gt:","category":"flags","emoji_order":"1115","aliases":[":gt:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gn":{"unicode":"1f1ec-1f1f3","unicode_alternates":"","name":"guinea","shortname":":flag_gn:","category":"flags","emoji_order":"1116","aliases":[":gn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gw":{"unicode":"1f1ec-1f1fc","unicode_alternates":"","name":"guinea-bissau","shortname":":flag_gw:","category":"flags","emoji_order":"1117","aliases":[":gw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gy":{"unicode":"1f1ec-1f1fe","unicode_alternates":"","name":"guyana","shortname":":flag_gy:","category":"flags","emoji_order":"1118","aliases":[":gy:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ht":{"unicode":"1f1ed-1f1f9","unicode_alternates":"","name":"haiti","shortname":":flag_ht:","category":"flags","emoji_order":"1119","aliases":[":ht:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_hn":{"unicode":"1f1ed-1f1f3","unicode_alternates":"","name":"honduras","shortname":":flag_hn:","category":"flags","emoji_order":"1120","aliases":[":hn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_hk":{"unicode":"1f1ed-1f1f0","unicode_alternates":"","name":"hong kong","shortname":":flag_hk:","category":"flags","emoji_order":"1121","aliases":[":hk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_hu":{"unicode":"1f1ed-1f1fa","unicode_alternates":"","name":"hungary","shortname":":flag_hu:","category":"flags","emoji_order":"1122","aliases":[":hu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_is":{"unicode":"1f1ee-1f1f8","unicode_alternates":"","name":"iceland","shortname":":flag_is:","category":"flags","emoji_order":"1123","aliases":[":is:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_in":{"unicode":"1f1ee-1f1f3","unicode_alternates":"","name":"india","shortname":":flag_in:","category":"flags","emoji_order":"1124","aliases":[":in:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_id":{"unicode":"1f1ee-1f1e9","unicode_alternates":"","name":"indonesia","shortname":":flag_id:","category":"flags","emoji_order":"1125","aliases":[":indonesia:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ir":{"unicode":"1f1ee-1f1f7","unicode_alternates":"","name":"iran","shortname":":flag_ir:","category":"flags","emoji_order":"1126","aliases":[":ir:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_iq":{"unicode":"1f1ee-1f1f6","unicode_alternates":"","name":"iraq","shortname":":flag_iq:","category":"flags","emoji_order":"1127","aliases":[":iq:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ie":{"unicode":"1f1ee-1f1ea","unicode_alternates":"","name":"ireland","shortname":":flag_ie:","category":"flags","emoji_order":"1128","aliases":[":ie:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_il":{"unicode":"1f1ee-1f1f1","unicode_alternates":"","name":"israel","shortname":":flag_il:","category":"flags","emoji_order":"1129","aliases":[":il:"],"aliases_ascii":[],"keywords":["jew","country","flag","flag"]},"flag_it":{"unicode":"1f1ee-1f1f9","unicode_alternates":"","name":"italy","shortname":":flag_it:","category":"flags","emoji_order":"1130","aliases":[":it:"],"aliases_ascii":[],"keywords":["italian","country","flag","flag"]},"flag_ci":{"unicode":"1f1e8-1f1ee","unicode_alternates":"","name":"c\u00f4te d\u2019ivoire","shortname":":flag_ci:","category":"flags","emoji_order":"1131","aliases":[":ci:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_jm":{"unicode":"1f1ef-1f1f2","unicode_alternates":"","name":"jamaica","shortname":":flag_jm:","category":"flags","emoji_order":"1132","aliases":[":jm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_jp":{"unicode":"1f1ef-1f1f5","unicode_alternates":"","name":"japan","shortname":":flag_jp:","category":"flags","emoji_order":"1133","aliases":[":jp:"],"aliases_ascii":[],"keywords":["japan","country","flag","flag"]},"flag_je":{"unicode":"1f1ef-1f1ea","unicode_alternates":"","name":"jersey","shortname":":flag_je:","category":"flags","emoji_order":"1134","aliases":[":je:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_jo":{"unicode":"1f1ef-1f1f4","unicode_alternates":"","name":"jordan","shortname":":flag_jo:","category":"flags","emoji_order":"1135","aliases":[":jo:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_kz":{"unicode":"1f1f0-1f1ff","unicode_alternates":"","name":"kazakhstan","shortname":":flag_kz:","category":"flags","emoji_order":"1136","aliases":[":kz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ke":{"unicode":"1f1f0-1f1ea","unicode_alternates":"","name":"kenya","shortname":":flag_ke:","category":"flags","emoji_order":"1137","aliases":[":ke:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ki":{"unicode":"1f1f0-1f1ee","unicode_alternates":"","name":"kiribati","shortname":":flag_ki:","category":"flags","emoji_order":"1138","aliases":[":ki:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_xk":{"unicode":"1f1fd-1f1f0","unicode_alternates":"","name":"kosovo","shortname":":flag_xk:","category":"flags","emoji_order":"1139","aliases":[":xk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_kw":{"unicode":"1f1f0-1f1fc","unicode_alternates":"","name":"kuwait","shortname":":flag_kw:","category":"flags","emoji_order":"1140","aliases":[":kw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_kg":{"unicode":"1f1f0-1f1ec","unicode_alternates":"","name":"kyrgyzstan","shortname":":flag_kg:","category":"flags","emoji_order":"1141","aliases":[":kg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_la":{"unicode":"1f1f1-1f1e6","unicode_alternates":"","name":"laos","shortname":":flag_la:","category":"flags","emoji_order":"1142","aliases":[":la:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_lv":{"unicode":"1f1f1-1f1fb","unicode_alternates":"","name":"latvia","shortname":":flag_lv:","category":"flags","emoji_order":"1143","aliases":[":lv:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_lb":{"unicode":"1f1f1-1f1e7","unicode_alternates":"","name":"lebanon","shortname":":flag_lb:","category":"flags","emoji_order":"1144","aliases":[":lb:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ls":{"unicode":"1f1f1-1f1f8","unicode_alternates":"","name":"lesotho","shortname":":flag_ls:","category":"flags","emoji_order":"1145","aliases":[":ls:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_lr":{"unicode":"1f1f1-1f1f7","unicode_alternates":"","name":"liberia","shortname":":flag_lr:","category":"flags","emoji_order":"1146","aliases":[":lr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ly":{"unicode":"1f1f1-1f1fe","unicode_alternates":"","name":"libya","shortname":":flag_ly:","category":"flags","emoji_order":"1147","aliases":[":ly:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_li":{"unicode":"1f1f1-1f1ee","unicode_alternates":"","name":"liechtenstein","shortname":":flag_li:","category":"flags","emoji_order":"1148","aliases":[":li:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_lt":{"unicode":"1f1f1-1f1f9","unicode_alternates":"","name":"lithuania","shortname":":flag_lt:","category":"flags","emoji_order":"1149","aliases":[":lt:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_lu":{"unicode":"1f1f1-1f1fa","unicode_alternates":"","name":"luxembourg","shortname":":flag_lu:","category":"flags","emoji_order":"1150","aliases":[":lu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mo":{"unicode":"1f1f2-1f1f4","unicode_alternates":"","name":"macau","shortname":":flag_mo:","category":"flags","emoji_order":"1151","aliases":[":mo:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mk":{"unicode":"1f1f2-1f1f0","unicode_alternates":"","name":"macedonia","shortname":":flag_mk:","category":"flags","emoji_order":"1152","aliases":[":mk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mg":{"unicode":"1f1f2-1f1ec","unicode_alternates":"","name":"madagascar","shortname":":flag_mg:","category":"flags","emoji_order":"1153","aliases":[":mg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mw":{"unicode":"1f1f2-1f1fc","unicode_alternates":"","name":"malawi","shortname":":flag_mw:","category":"flags","emoji_order":"1154","aliases":[":mw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_my":{"unicode":"1f1f2-1f1fe","unicode_alternates":"","name":"malaysia","shortname":":flag_my:","category":"flags","emoji_order":"1155","aliases":[":my:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mv":{"unicode":"1f1f2-1f1fb","unicode_alternates":"","name":"maldives","shortname":":flag_mv:","category":"flags","emoji_order":"1156","aliases":[":mv:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ml":{"unicode":"1f1f2-1f1f1","unicode_alternates":"","name":"mali","shortname":":flag_ml:","category":"flags","emoji_order":"1157","aliases":[":ml:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mt":{"unicode":"1f1f2-1f1f9","unicode_alternates":"","name":"malta","shortname":":flag_mt:","category":"flags","emoji_order":"1158","aliases":[":mt:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mh":{"unicode":"1f1f2-1f1ed","unicode_alternates":"","name":"the marshall islands","shortname":":flag_mh:","category":"flags","emoji_order":"1159","aliases":[":mh:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mr":{"unicode":"1f1f2-1f1f7","unicode_alternates":"","name":"mauritania","shortname":":flag_mr:","category":"flags","emoji_order":"1160","aliases":[":mr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mu":{"unicode":"1f1f2-1f1fa","unicode_alternates":"","name":"mauritius","shortname":":flag_mu:","category":"flags","emoji_order":"1161","aliases":[":mu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mx":{"unicode":"1f1f2-1f1fd","unicode_alternates":"","name":"mexico","shortname":":flag_mx:","category":"flags","emoji_order":"1162","aliases":[":mx:"],"aliases_ascii":[],"keywords":["country","mexican","flag","flag"]},"flag_fm":{"unicode":"1f1eb-1f1f2","unicode_alternates":"","name":"micronesia","shortname":":flag_fm:","category":"flags","emoji_order":"1163","aliases":[":fm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_md":{"unicode":"1f1f2-1f1e9","unicode_alternates":"","name":"moldova","shortname":":flag_md:","category":"flags","emoji_order":"1164","aliases":[":md:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mc":{"unicode":"1f1f2-1f1e8","unicode_alternates":"","name":"monaco","shortname":":flag_mc:","category":"flags","emoji_order":"1165","aliases":[":mc:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mn":{"unicode":"1f1f2-1f1f3","unicode_alternates":"","name":"mongolia","shortname":":flag_mn:","category":"flags","emoji_order":"1166","aliases":[":mn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_me":{"unicode":"1f1f2-1f1ea","unicode_alternates":"","name":"montenegro","shortname":":flag_me:","category":"flags","emoji_order":"1167","aliases":[":me:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ms":{"unicode":"1f1f2-1f1f8","unicode_alternates":"","name":"montserrat","shortname":":flag_ms:","category":"flags","emoji_order":"1168","aliases":[":ms:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ma":{"unicode":"1f1f2-1f1e6","unicode_alternates":"","name":"morocco","shortname":":flag_ma:","category":"flags","emoji_order":"1169","aliases":[":ma:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mz":{"unicode":"1f1f2-1f1ff","unicode_alternates":"","name":"mozambique","shortname":":flag_mz:","category":"flags","emoji_order":"1170","aliases":[":mz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mm":{"unicode":"1f1f2-1f1f2","unicode_alternates":"","name":"myanmar","shortname":":flag_mm:","category":"flags","emoji_order":"1171","aliases":[":mm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_na":{"unicode":"1f1f3-1f1e6","unicode_alternates":"","name":"namibia","shortname":":flag_na:","category":"flags","emoji_order":"1172","aliases":[":na:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_nr":{"unicode":"1f1f3-1f1f7","unicode_alternates":"","name":"nauru","shortname":":flag_nr:","category":"flags","emoji_order":"1173","aliases":[":nr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_np":{"unicode":"1f1f3-1f1f5","unicode_alternates":"","name":"nepal","shortname":":flag_np:","category":"flags","emoji_order":"1174","aliases":[":np:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_nl":{"unicode":"1f1f3-1f1f1","unicode_alternates":"","name":"the netherlands","shortname":":flag_nl:","category":"flags","emoji_order":"1175","aliases":[":nl:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_nc":{"unicode":"1f1f3-1f1e8","unicode_alternates":"","name":"new caledonia","shortname":":flag_nc:","category":"flags","emoji_order":"1176","aliases":[":nc:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_nz":{"unicode":"1f1f3-1f1ff","unicode_alternates":"","name":"new zealand","shortname":":flag_nz:","category":"flags","emoji_order":"1177","aliases":[":nz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ni":{"unicode":"1f1f3-1f1ee","unicode_alternates":"","name":"nicaragua","shortname":":flag_ni:","category":"flags","emoji_order":"1178","aliases":[":ni:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ne":{"unicode":"1f1f3-1f1ea","unicode_alternates":"","name":"niger","shortname":":flag_ne:","category":"flags","emoji_order":"1179","aliases":[":ne:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ng":{"unicode":"1f1f3-1f1ec","unicode_alternates":"","name":"nigeria","shortname":":flag_ng:","category":"flags","emoji_order":"1180","aliases":[":nigeria:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_nu":{"unicode":"1f1f3-1f1fa","unicode_alternates":"","name":"niue","shortname":":flag_nu:","category":"flags","emoji_order":"1181","aliases":[":nu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_kp":{"unicode":"1f1f0-1f1f5","unicode_alternates":"","name":"north korea","shortname":":flag_kp:","category":"flags","emoji_order":"1182","aliases":[":kp:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_no":{"unicode":"1f1f3-1f1f4","unicode_alternates":"","name":"norway","shortname":":flag_no:","category":"flags","emoji_order":"1183","aliases":[":no:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_om":{"unicode":"1f1f4-1f1f2","unicode_alternates":"","name":"oman","shortname":":flag_om:","category":"flags","emoji_order":"1184","aliases":[":om:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pk":{"unicode":"1f1f5-1f1f0","unicode_alternates":"","name":"pakistan","shortname":":flag_pk:","category":"flags","emoji_order":"1185","aliases":[":pk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pw":{"unicode":"1f1f5-1f1fc","unicode_alternates":"","name":"palau","shortname":":flag_pw:","category":"flags","emoji_order":"1186","aliases":[":pw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ps":{"unicode":"1f1f5-1f1f8","unicode_alternates":"","name":"palestinian authority","shortname":":flag_ps:","category":"flags","emoji_order":"1187","aliases":[":ps:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pa":{"unicode":"1f1f5-1f1e6","unicode_alternates":"","name":"panama","shortname":":flag_pa:","category":"flags","emoji_order":"1188","aliases":[":pa:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pg":{"unicode":"1f1f5-1f1ec","unicode_alternates":"","name":"papua new guinea","shortname":":flag_pg:","category":"flags","emoji_order":"1189","aliases":[":pg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_py":{"unicode":"1f1f5-1f1fe","unicode_alternates":"","name":"paraguay","shortname":":flag_py:","category":"flags","emoji_order":"1190","aliases":[":py:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pe":{"unicode":"1f1f5-1f1ea","unicode_alternates":"","name":"peru","shortname":":flag_pe:","category":"flags","emoji_order":"1191","aliases":[":pe:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ph":{"unicode":"1f1f5-1f1ed","unicode_alternates":"","name":"the philippines","shortname":":flag_ph:","category":"flags","emoji_order":"1192","aliases":[":ph:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pl":{"unicode":"1f1f5-1f1f1","unicode_alternates":"","name":"poland","shortname":":flag_pl:","category":"flags","emoji_order":"1193","aliases":[":pl:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pt":{"unicode":"1f1f5-1f1f9","unicode_alternates":"","name":"portugal","shortname":":flag_pt:","category":"flags","emoji_order":"1194","aliases":[":pt:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pr":{"unicode":"1f1f5-1f1f7","unicode_alternates":"","name":"puerto rico","shortname":":flag_pr:","category":"flags","emoji_order":"1195","aliases":[":pr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_qa":{"unicode":"1f1f6-1f1e6","unicode_alternates":"","name":"qatar","shortname":":flag_qa:","category":"flags","emoji_order":"1196","aliases":[":qa:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ro":{"unicode":"1f1f7-1f1f4","unicode_alternates":"","name":"romania","shortname":":flag_ro:","category":"flags","emoji_order":"1197","aliases":[":ro:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ru":{"unicode":"1f1f7-1f1fa","unicode_alternates":"","name":"russia","shortname":":flag_ru:","category":"flags","emoji_order":"1198","aliases":[":ru:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_rw":{"unicode":"1f1f7-1f1fc","unicode_alternates":"","name":"rwanda","shortname":":flag_rw:","category":"flags","emoji_order":"1199","aliases":[":rw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sh":{"unicode":"1f1f8-1f1ed","unicode_alternates":"","name":"saint helena","shortname":":flag_sh:","category":"flags","emoji_order":"1200","aliases":[":sh:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_kn":{"unicode":"1f1f0-1f1f3","unicode_alternates":"","name":"saint kitts and nevis","shortname":":flag_kn:","category":"flags","emoji_order":"1201","aliases":[":kn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_lc":{"unicode":"1f1f1-1f1e8","unicode_alternates":"","name":"saint lucia","shortname":":flag_lc:","category":"flags","emoji_order":"1202","aliases":[":lc:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_vc":{"unicode":"1f1fb-1f1e8","unicode_alternates":"","name":"saint vincent and the grenadines","shortname":":flag_vc:","category":"flags","emoji_order":"1203","aliases":[":vc:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ws":{"unicode":"1f1fc-1f1f8","unicode_alternates":"","name":"samoa","shortname":":flag_ws:","category":"flags","emoji_order":"1204","aliases":[":ws:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sm":{"unicode":"1f1f8-1f1f2","unicode_alternates":"","name":"san marino","shortname":":flag_sm:","category":"flags","emoji_order":"1205","aliases":[":sm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_st":{"unicode":"1f1f8-1f1f9","unicode_alternates":"","name":"s\u00e3o tom\u00e9 and pr\u00edncipe","shortname":":flag_st:","category":"flags","emoji_order":"1206","aliases":[":st:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sa":{"unicode":"1f1f8-1f1e6","unicode_alternates":"","name":"saudi arabia","shortname":":flag_sa:","category":"flags","emoji_order":"1207","aliases":[":saudiarabia:",":saudi:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sn":{"unicode":"1f1f8-1f1f3","unicode_alternates":"","name":"senegal","shortname":":flag_sn:","category":"flags","emoji_order":"1208","aliases":[":sn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_rs":{"unicode":"1f1f7-1f1f8","unicode_alternates":"","name":"serbia","shortname":":flag_rs:","category":"flags","emoji_order":"1209","aliases":[":rs:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sc":{"unicode":"1f1f8-1f1e8","unicode_alternates":"","name":"the seychelles","shortname":":flag_sc:","category":"flags","emoji_order":"1210","aliases":[":sc:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sl":{"unicode":"1f1f8-1f1f1","unicode_alternates":"","name":"sierra leone","shortname":":flag_sl:","category":"flags","emoji_order":"1211","aliases":[":sl:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sg":{"unicode":"1f1f8-1f1ec","unicode_alternates":"","name":"singapore","shortname":":flag_sg:","category":"flags","emoji_order":"1212","aliases":[":sg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sk":{"unicode":"1f1f8-1f1f0","unicode_alternates":"","name":"slovakia","shortname":":flag_sk:","category":"flags","emoji_order":"1213","aliases":[":sk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_si":{"unicode":"1f1f8-1f1ee","unicode_alternates":"","name":"slovenia","shortname":":flag_si:","category":"flags","emoji_order":"1214","aliases":[":si:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sb":{"unicode":"1f1f8-1f1e7","unicode_alternates":"","name":"the solomon islands","shortname":":flag_sb:","category":"flags","emoji_order":"1215","aliases":[":sb:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_so":{"unicode":"1f1f8-1f1f4","unicode_alternates":"","name":"somalia","shortname":":flag_so:","category":"flags","emoji_order":"1216","aliases":[":so:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_za":{"unicode":"1f1ff-1f1e6","unicode_alternates":"","name":"south africa","shortname":":flag_za:","category":"flags","emoji_order":"1217","aliases":[":za:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_kr":{"unicode":"1f1f0-1f1f7","unicode_alternates":"","name":"korea","shortname":":flag_kr:","category":"flags","emoji_order":"1218","aliases":[":kr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_es":{"unicode":"1f1ea-1f1f8","unicode_alternates":"","name":"spain","shortname":":flag_es:","category":"flags","emoji_order":"1219","aliases":[":es:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_lk":{"unicode":"1f1f1-1f1f0","unicode_alternates":"","name":"sri lanka","shortname":":flag_lk:","category":"flags","emoji_order":"1220","aliases":[":lk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sd":{"unicode":"1f1f8-1f1e9","unicode_alternates":"","name":"sudan","shortname":":flag_sd:","category":"flags","emoji_order":"1221","aliases":[":sd:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sr":{"unicode":"1f1f8-1f1f7","unicode_alternates":"","name":"suriname","shortname":":flag_sr:","category":"flags","emoji_order":"1222","aliases":[":sr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sz":{"unicode":"1f1f8-1f1ff","unicode_alternates":"","name":"swaziland","shortname":":flag_sz:","category":"flags","emoji_order":"1223","aliases":[":sz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_se":{"unicode":"1f1f8-1f1ea","unicode_alternates":"","name":"sweden","shortname":":flag_se:","category":"flags","emoji_order":"1224","aliases":[":se:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ch":{"unicode":"1f1e8-1f1ed","unicode_alternates":"","name":"switzerland","shortname":":flag_ch:","category":"flags","emoji_order":"1225","aliases":[":ch:"],"aliases_ascii":[],"keywords":["country","neutral","flag","flag"]},"flag_sy":{"unicode":"1f1f8-1f1fe","unicode_alternates":"","name":"syria","shortname":":flag_sy:","category":"flags","emoji_order":"1226","aliases":[":sy:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tw":{"unicode":"1f1f9-1f1fc","unicode_alternates":"","name":"the republic of china","shortname":":flag_tw:","category":"flags","emoji_order":"1227","aliases":[":tw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tj":{"unicode":"1f1f9-1f1ef","unicode_alternates":"","name":"tajikistan","shortname":":flag_tj:","category":"flags","emoji_order":"1228","aliases":[":tj:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tz":{"unicode":"1f1f9-1f1ff","unicode_alternates":"","name":"tanzania","shortname":":flag_tz:","category":"flags","emoji_order":"1229","aliases":[":tz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_th":{"unicode":"1f1f9-1f1ed","unicode_alternates":"","name":"thailand","shortname":":flag_th:","category":"flags","emoji_order":"1230","aliases":[":th:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tl":{"unicode":"1f1f9-1f1f1","unicode_alternates":"","name":"timor-leste","shortname":":flag_tl:","category":"flags","emoji_order":"1231","aliases":[":tl:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tg":{"unicode":"1f1f9-1f1ec","unicode_alternates":"","name":"togo","shortname":":flag_tg:","category":"flags","emoji_order":"1232","aliases":[":tg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_to":{"unicode":"1f1f9-1f1f4","unicode_alternates":"","name":"tonga","shortname":":flag_to:","category":"flags","emoji_order":"1233","aliases":[":to:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tt":{"unicode":"1f1f9-1f1f9","unicode_alternates":"","name":"trinidad and tobago","shortname":":flag_tt:","category":"flags","emoji_order":"1234","aliases":[":tt:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tn":{"unicode":"1f1f9-1f1f3","unicode_alternates":"","name":"tunisia","shortname":":flag_tn:","category":"flags","emoji_order":"1235","aliases":[":tn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tr":{"unicode":"1f1f9-1f1f7","unicode_alternates":"","name":"turkey","shortname":":flag_tr:","category":"flags","emoji_order":"1236","aliases":[":tr:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tm":{"unicode":"1f1f9-1f1f2","unicode_alternates":"","name":"turkmenistan","shortname":":flag_tm:","category":"flags","emoji_order":"1237","aliases":[":turkmenistan:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tv":{"unicode":"1f1f9-1f1fb","unicode_alternates":"","name":"tuvalu","shortname":":flag_tv:","category":"flags","emoji_order":"1238","aliases":[":tuvalu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ug":{"unicode":"1f1fa-1f1ec","unicode_alternates":"","name":"uganda","shortname":":flag_ug:","category":"flags","emoji_order":"1239","aliases":[":ug:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ua":{"unicode":"1f1fa-1f1e6","unicode_alternates":"","name":"ukraine","shortname":":flag_ua:","category":"flags","emoji_order":"1240","aliases":[":ua:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ae":{"unicode":"1f1e6-1f1ea","unicode_alternates":"","name":"the united arab emirates","shortname":":flag_ae:","category":"flags","emoji_order":"1241","aliases":[":ae:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gb":{"unicode":"1f1ec-1f1e7","unicode_alternates":"","name":"great britain","shortname":":flag_gb:","category":"flags","emoji_order":"1242","aliases":[":gb:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_us":{"unicode":"1f1fa-1f1f8","unicode_alternates":"","name":"united states","shortname":":flag_us:","category":"flags","emoji_order":"1243","aliases":[":us:"],"aliases_ascii":[],"keywords":["america","country","flag","flag"]},"flag_vi":{"unicode":"1f1fb-1f1ee","unicode_alternates":"","name":"u.s. virgin islands","shortname":":flag_vi:","category":"flags","emoji_order":"1244","aliases":[":vi:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_uy":{"unicode":"1f1fa-1f1fe","unicode_alternates":"","name":"uruguay","shortname":":flag_uy:","category":"flags","emoji_order":"1245","aliases":[":uy:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_uz":{"unicode":"1f1fa-1f1ff","unicode_alternates":"","name":"uzbekistan","shortname":":flag_uz:","category":"flags","emoji_order":"1246","aliases":[":uz:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_vu":{"unicode":"1f1fb-1f1fa","unicode_alternates":"","name":"vanuatu","shortname":":flag_vu:","category":"flags","emoji_order":"1247","aliases":[":vu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_va":{"unicode":"1f1fb-1f1e6","unicode_alternates":"","name":"the vatican city","shortname":":flag_va:","category":"flags","emoji_order":"1248","aliases":[":va:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ve":{"unicode":"1f1fb-1f1ea","unicode_alternates":"","name":"venezuela","shortname":":flag_ve:","category":"flags","emoji_order":"1249","aliases":[":ve:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_vn":{"unicode":"1f1fb-1f1f3","unicode_alternates":"","name":"vietnam","shortname":":flag_vn:","category":"flags","emoji_order":"1250","aliases":[":vn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_wf":{"unicode":"1f1fc-1f1eb","unicode_alternates":"","name":"wallis and futuna","shortname":":flag_wf:","category":"flags","emoji_order":"1251","aliases":[":wf:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_eh":{"unicode":"1f1ea-1f1ed","unicode_alternates":"","name":"western sahara","shortname":":flag_eh:","category":"flags","emoji_order":"1252","aliases":[":eh:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ye":{"unicode":"1f1fe-1f1ea","unicode_alternates":"","name":"yemen","shortname":":flag_ye:","category":"flags","emoji_order":"1253","aliases":[":ye:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_zm":{"unicode":"1f1ff-1f1f2","unicode_alternates":"","name":"zambia","shortname":":flag_zm:","category":"flags","emoji_order":"1254","aliases":[":zm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_zw":{"unicode":"1f1ff-1f1fc","unicode_alternates":"","name":"zimbabwe","shortname":":flag_zw:","category":"flags","emoji_order":"1255","aliases":[":zw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_re":{"unicode":"1f1f7-1f1ea","unicode_alternates":"","name":"r\u00e9union","shortname":":flag_re:","category":"flags","emoji_order":"1256","aliases":[":re:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ax":{"unicode":"1f1e6-1f1fd","unicode_alternates":"","name":"\u00e5land islands","shortname":":flag_ax:","category":"flags","emoji_order":"1257","aliases":[":ax:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ta":{"unicode":"1f1f9-1f1e6","unicode_alternates":"","name":"tristan da cunha","shortname":":flag_ta:","category":"flags","emoji_order":"1258","aliases":[":ta:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_io":{"unicode":"1f1ee-1f1f4","unicode_alternates":"","name":"british indian ocean territory","shortname":":flag_io:","category":"flags","emoji_order":"1259","aliases":[":io:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bq":{"unicode":"1f1e7-1f1f6","unicode_alternates":"","name":"caribbean netherlands","shortname":":flag_bq:","category":"flags","emoji_order":"1260","aliases":[":bq:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cx":{"unicode":"1f1e8-1f1fd","unicode_alternates":"","name":"christmas island","shortname":":flag_cx:","category":"flags","emoji_order":"1261","aliases":[":cx:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cc":{"unicode":"1f1e8-1f1e8","unicode_alternates":"","name":"cocos (keeling) islands","shortname":":flag_cc:","category":"flags","emoji_order":"1262","aliases":[":cc:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gg":{"unicode":"1f1ec-1f1ec","unicode_alternates":"","name":"guernsey","shortname":":flag_gg:","category":"flags","emoji_order":"1263","aliases":[":gg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_im":{"unicode":"1f1ee-1f1f2","unicode_alternates":"","name":"isle of man","shortname":":flag_im:","category":"flags","emoji_order":"1264","aliases":[":im:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_yt":{"unicode":"1f1fe-1f1f9","unicode_alternates":"","name":"mayotte","shortname":":flag_yt:","category":"flags","emoji_order":"1265","aliases":[":yt:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_nf":{"unicode":"1f1f3-1f1eb","unicode_alternates":"","name":"norfolk island","shortname":":flag_nf:","category":"flags","emoji_order":"1266","aliases":[":nf:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pn":{"unicode":"1f1f5-1f1f3","unicode_alternates":"","name":"pitcairn","shortname":":flag_pn:","category":"flags","emoji_order":"1267","aliases":[":pn:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bl":{"unicode":"1f1e7-1f1f1","unicode_alternates":"","name":"saint barth\u00e9lemy","shortname":":flag_bl:","category":"flags","emoji_order":"1268","aliases":[":bl:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_pm":{"unicode":"1f1f5-1f1f2","unicode_alternates":"","name":"saint pierre and miquelon","shortname":":flag_pm:","category":"flags","emoji_order":"1269","aliases":[":pm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gs":{"unicode":"1f1ec-1f1f8","unicode_alternates":"","name":"south georgia","shortname":":flag_gs:","category":"flags","emoji_order":"1270","aliases":[":gs:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tk":{"unicode":"1f1f9-1f1f0","unicode_alternates":"","name":"tokelau","shortname":":flag_tk:","category":"flags","emoji_order":"1271","aliases":[":tk:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_bv":{"unicode":"1f1e7-1f1fb","unicode_alternates":"","name":"bouvet island","shortname":":flag_bv:","category":"flags","emoji_order":"1272","aliases":[":bv:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_hm":{"unicode":"1f1ed-1f1f2","unicode_alternates":"","name":"heard island and mcdonald islands","shortname":":flag_hm:","category":"flags","emoji_order":"1273","aliases":[":hm:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sj":{"unicode":"1f1f8-1f1ef","unicode_alternates":"","name":"svalbard and jan mayen","shortname":":flag_sj:","category":"flags","emoji_order":"1274","aliases":[":sj:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_um":{"unicode":"1f1fa-1f1f2","unicode_alternates":"","name":"united states minor outlying islands","shortname":":flag_um:","category":"flags","emoji_order":"1275","aliases":[":um:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ic":{"unicode":"1f1ee-1f1e8","unicode_alternates":"","name":"canary islands","shortname":":flag_ic:","category":"flags","emoji_order":"1276","aliases":[":ic:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ea":{"unicode":"1f1ea-1f1e6","unicode_alternates":"","name":"ceuta, melilla","shortname":":flag_ea:","category":"flags","emoji_order":"1277","aliases":[":ea:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cp":{"unicode":"1f1e8-1f1f5","unicode_alternates":"","name":"clipperton island","shortname":":flag_cp:","category":"flags","emoji_order":"1278","aliases":[":cp:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_dg":{"unicode":"1f1e9-1f1ec","unicode_alternates":"","name":"diego garcia","shortname":":flag_dg:","category":"flags","emoji_order":"1279","aliases":[":dg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_as":{"unicode":"1f1e6-1f1f8","unicode_alternates":"","name":"american samoa","shortname":":flag_as:","category":"flags","emoji_order":"1280","aliases":[":as:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_aq":{"unicode":"1f1e6-1f1f6","unicode_alternates":"","name":"antarctica","shortname":":flag_aq:","category":"flags","emoji_order":"1281","aliases":[":aq:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_vg":{"unicode":"1f1fb-1f1ec","unicode_alternates":"","name":"british virgin islands","shortname":":flag_vg:","category":"flags","emoji_order":"1282","aliases":[":vg:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ck":{"unicode":"1f1e8-1f1f0","unicode_alternates":"","name":"cook islands","shortname":":flag_ck:","category":"flags","emoji_order":"1283","aliases":[":ck:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_cw":{"unicode":"1f1e8-1f1fc","unicode_alternates":"","name":"cura\u00e7ao","shortname":":flag_cw:","category":"flags","emoji_order":"1284","aliases":[":cw:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_eu":{"unicode":"1f1ea-1f1fa","unicode_alternates":"","name":"european union","shortname":":flag_eu:","category":"flags","emoji_order":"1285","aliases":[":eu:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gf":{"unicode":"1f1ec-1f1eb","unicode_alternates":"","name":"french guiana","shortname":":flag_gf:","category":"flags","emoji_order":"1286","aliases":[":gf:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tf":{"unicode":"1f1f9-1f1eb","unicode_alternates":"","name":"french southern territories","shortname":":flag_tf:","category":"flags","emoji_order":"1287","aliases":[":tf:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_gp":{"unicode":"1f1ec-1f1f5","unicode_alternates":"","name":"guadeloupe","shortname":":flag_gp:","category":"flags","emoji_order":"1288","aliases":[":gp:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mq":{"unicode":"1f1f2-1f1f6","unicode_alternates":"","name":"martinique","shortname":":flag_mq:","category":"flags","emoji_order":"1289","aliases":[":mq:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mp":{"unicode":"1f1f2-1f1f5","unicode_alternates":"","name":"northern mariana islands","shortname":":flag_mp:","category":"flags","emoji_order":"1290","aliases":[":mp:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_sx":{"unicode":"1f1f8-1f1fd","unicode_alternates":"","name":"sint maarten","shortname":":flag_sx:","category":"flags","emoji_order":"1291","aliases":[":sx:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_ss":{"unicode":"1f1f8-1f1f8","unicode_alternates":"","name":"south sudan","shortname":":flag_ss:","category":"flags","emoji_order":"1292","aliases":[":ss:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_tc":{"unicode":"1f1f9-1f1e8","unicode_alternates":"","name":"turks and caicos islands","shortname":":flag_tc:","category":"flags","emoji_order":"1293","aliases":[":tc:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"flag_mf":{"unicode":"1f1f2-1f1eb","unicode_alternates":"","name":"saint martin","shortname":":flag_mf:","category":"flags","emoji_order":"1294","aliases":[":mf:"],"aliases_ascii":[],"keywords":["country","flag","flag"]},"raised_hands_tone1":{"unicode":"1f64c-1f3fb","unicode_alternates":"","name":"person raising both hands in celebration tone 1","shortname":":raised_hands_tone1:","category":"people","emoji_order":"1295","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hands_tone2":{"unicode":"1f64c-1f3fc","unicode_alternates":"","name":"person raising both hands in celebration tone 2","shortname":":raised_hands_tone2:","category":"people","emoji_order":"1296","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hands_tone3":{"unicode":"1f64c-1f3fd","unicode_alternates":"","name":"person raising both hands in celebration tone 3","shortname":":raised_hands_tone3:","category":"people","emoji_order":"1297","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hands_tone4":{"unicode":"1f64c-1f3fe","unicode_alternates":"","name":"person raising both hands in celebration tone 4","shortname":":raised_hands_tone4:","category":"people","emoji_order":"1298","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hands_tone5":{"unicode":"1f64c-1f3ff","unicode_alternates":"","name":"person raising both hands in celebration tone 5","shortname":":raised_hands_tone5:","category":"people","emoji_order":"1299","aliases":[],"aliases_ascii":[],"keywords":[]},"clap_tone1":{"unicode":"1f44f-1f3fb","unicode_alternates":"","name":"clapping hands sign tone 1","shortname":":clap_tone1:","category":"people","emoji_order":"1300","aliases":[],"aliases_ascii":[],"keywords":[]},"clap_tone2":{"unicode":"1f44f-1f3fc","unicode_alternates":"","name":"clapping hands sign tone 2","shortname":":clap_tone2:","category":"people","emoji_order":"1301","aliases":[],"aliases_ascii":[],"keywords":[]},"clap_tone3":{"unicode":"1f44f-1f3fd","unicode_alternates":"","name":"clapping hands sign tone 3","shortname":":clap_tone3:","category":"people","emoji_order":"1302","aliases":[],"aliases_ascii":[],"keywords":[]},"clap_tone4":{"unicode":"1f44f-1f3fe","unicode_alternates":"","name":"clapping hands sign tone 4","shortname":":clap_tone4:","category":"people","emoji_order":"1303","aliases":[],"aliases_ascii":[],"keywords":[]},"clap_tone5":{"unicode":"1f44f-1f3ff","unicode_alternates":"","name":"clapping hands sign tone 5","shortname":":clap_tone5:","category":"people","emoji_order":"1304","aliases":[],"aliases_ascii":[],"keywords":[]},"wave_tone1":{"unicode":"1f44b-1f3fb","unicode_alternates":"","name":"waving hand sign tone 1","shortname":":wave_tone1:","category":"people","emoji_order":"1305","aliases":[],"aliases_ascii":[],"keywords":[]},"wave_tone2":{"unicode":"1f44b-1f3fc","unicode_alternates":"","name":"waving hand sign tone 2","shortname":":wave_tone2:","category":"people","emoji_order":"1306","aliases":[],"aliases_ascii":[],"keywords":[]},"wave_tone3":{"unicode":"1f44b-1f3fd","unicode_alternates":"","name":"waving hand sign tone 3","shortname":":wave_tone3:","category":"people","emoji_order":"1307","aliases":[],"aliases_ascii":[],"keywords":[]},"wave_tone4":{"unicode":"1f44b-1f3fe","unicode_alternates":"","name":"waving hand sign tone 4","shortname":":wave_tone4:","category":"people","emoji_order":"1308","aliases":[],"aliases_ascii":[],"keywords":[]},"wave_tone5":{"unicode":"1f44b-1f3ff","unicode_alternates":"","name":"waving hand sign tone 5","shortname":":wave_tone5:","category":"people","emoji_order":"1309","aliases":[],"aliases_ascii":[],"keywords":[]},"thumbsup_tone1":{"unicode":"1f44d-1f3fb","unicode_alternates":"","name":"thumbs up sign tone 1","shortname":":thumbsup_tone1:","category":"people","emoji_order":"1310","aliases":[":+1_tone1:",":thumbup_tone1:"],"aliases_ascii":[],"keywords":[]},"thumbsup_tone2":{"unicode":"1f44d-1f3fc","unicode_alternates":"","name":"thumbs up sign tone 2","shortname":":thumbsup_tone2:","category":"people","emoji_order":"1311","aliases":[":+1_tone2:",":thumbup_tone2:"],"aliases_ascii":[],"keywords":[]},"thumbsup_tone3":{"unicode":"1f44d-1f3fd","unicode_alternates":"","name":"thumbs up sign tone 3","shortname":":thumbsup_tone3:","category":"people","emoji_order":"1312","aliases":[":+1_tone3:",":thumbup_tone3:"],"aliases_ascii":[],"keywords":[]},"thumbsup_tone4":{"unicode":"1f44d-1f3fe","unicode_alternates":"","name":"thumbs up sign tone 4","shortname":":thumbsup_tone4:","category":"people","emoji_order":"1313","aliases":[":+1_tone4:",":thumbup_tone4:"],"aliases_ascii":[],"keywords":[]},"thumbsup_tone5":{"unicode":"1f44d-1f3ff","unicode_alternates":"","name":"thumbs up sign tone 5","shortname":":thumbsup_tone5:","category":"people","emoji_order":"1314","aliases":[":+1_tone5:",":thumbup_tone5:"],"aliases_ascii":[],"keywords":[]},"thumbsdown_tone1":{"unicode":"1f44e-1f3fb","unicode_alternates":"","name":"thumbs down sign tone 1","shortname":":thumbsdown_tone1:","category":"people","emoji_order":"1315","aliases":[":-1_tone1:",":thumbdown_tone1:"],"aliases_ascii":[],"keywords":[]},"thumbsdown_tone2":{"unicode":"1f44e-1f3fc","unicode_alternates":"","name":"thumbs down sign tone 2","shortname":":thumbsdown_tone2:","category":"people","emoji_order":"1316","aliases":[":-1_tone2:",":thumbdown_tone2:"],"aliases_ascii":[],"keywords":[]},"thumbsdown_tone3":{"unicode":"1f44e-1f3fd","unicode_alternates":"","name":"thumbs down sign tone 3","shortname":":thumbsdown_tone3:","category":"people","emoji_order":"1317","aliases":[":-1_tone3:",":thumbdown_tone3:"],"aliases_ascii":[],"keywords":[]},"thumbsdown_tone4":{"unicode":"1f44e-1f3fe","unicode_alternates":"","name":"thumbs down sign tone 4","shortname":":thumbsdown_tone4:","category":"people","emoji_order":"1318","aliases":[":-1_tone4:",":thumbdown_tone4:"],"aliases_ascii":[],"keywords":[]},"thumbsdown_tone5":{"unicode":"1f44e-1f3ff","unicode_alternates":"","name":"thumbs down sign tone 5","shortname":":thumbsdown_tone5:","category":"people","emoji_order":"1319","aliases":[":-1_tone5:",":thumbdown_tone5:"],"aliases_ascii":[],"keywords":[]},"punch_tone1":{"unicode":"1f44a-1f3fb","unicode_alternates":"","name":"fisted hand sign tone 1","shortname":":punch_tone1:","category":"people","emoji_order":"1320","aliases":[],"aliases_ascii":[],"keywords":[]},"punch_tone2":{"unicode":"1f44a-1f3fc","unicode_alternates":"","name":"fisted hand sign tone 2","shortname":":punch_tone2:","category":"people","emoji_order":"1321","aliases":[],"aliases_ascii":[],"keywords":[]},"punch_tone3":{"unicode":"1f44a-1f3fd","unicode_alternates":"","name":"fisted hand sign tone 3","shortname":":punch_tone3:","category":"people","emoji_order":"1322","aliases":[],"aliases_ascii":[],"keywords":[]},"punch_tone4":{"unicode":"1f44a-1f3fe","unicode_alternates":"","name":"fisted hand sign tone 4","shortname":":punch_tone4:","category":"people","emoji_order":"1323","aliases":[],"aliases_ascii":[],"keywords":[]},"punch_tone5":{"unicode":"1f44a-1f3ff","unicode_alternates":"","name":"fisted hand sign tone 5","shortname":":punch_tone5:","category":"people","emoji_order":"1324","aliases":[],"aliases_ascii":[],"keywords":[]},"fist_tone1":{"unicode":"270a-1f3fb","unicode_alternates":"","name":"raised fist tone 1","shortname":":fist_tone1:","category":"people","emoji_order":"1325","aliases":[],"aliases_ascii":[],"keywords":[]},"fist_tone2":{"unicode":"270a-1f3fc","unicode_alternates":"","name":"raised fist tone 2","shortname":":fist_tone2:","category":"people","emoji_order":"1326","aliases":[],"aliases_ascii":[],"keywords":[]},"fist_tone3":{"unicode":"270a-1f3fd","unicode_alternates":"","name":"raised fist tone 3","shortname":":fist_tone3:","category":"people","emoji_order":"1327","aliases":[],"aliases_ascii":[],"keywords":[]},"fist_tone4":{"unicode":"270a-1f3fe","unicode_alternates":"","name":"raised fist tone 4","shortname":":fist_tone4:","category":"people","emoji_order":"1328","aliases":[],"aliases_ascii":[],"keywords":[]},"fist_tone5":{"unicode":"270a-1f3ff","unicode_alternates":"","name":"raised fist tone 5","shortname":":fist_tone5:","category":"people","emoji_order":"1329","aliases":[],"aliases_ascii":[],"keywords":[]},"v_tone1":{"unicode":"270c-1f3fb","unicode_alternates":"","name":"victory hand tone 1","shortname":":v_tone1:","category":"people","emoji_order":"1330","aliases":[],"aliases_ascii":[],"keywords":[]},"v_tone2":{"unicode":"270c-1f3fc","unicode_alternates":"","name":"victory hand tone 2","shortname":":v_tone2:","category":"people","emoji_order":"1331","aliases":[],"aliases_ascii":[],"keywords":[]},"v_tone3":{"unicode":"270c-1f3fd","unicode_alternates":"","name":"victory hand tone 3","shortname":":v_tone3:","category":"people","emoji_order":"1332","aliases":[],"aliases_ascii":[],"keywords":[]},"v_tone4":{"unicode":"270c-1f3fe","unicode_alternates":"","name":"victory hand tone 4","shortname":":v_tone4:","category":"people","emoji_order":"1333","aliases":[],"aliases_ascii":[],"keywords":[]},"v_tone5":{"unicode":"270c-1f3ff","unicode_alternates":"","name":"victory hand tone 5","shortname":":v_tone5:","category":"people","emoji_order":"1334","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_hand_tone1":{"unicode":"1f44c-1f3fb","unicode_alternates":"","name":"ok hand sign tone 1","shortname":":ok_hand_tone1:","category":"people","emoji_order":"1335","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_hand_tone2":{"unicode":"1f44c-1f3fc","unicode_alternates":"","name":"ok hand sign tone 2","shortname":":ok_hand_tone2:","category":"people","emoji_order":"1336","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_hand_tone3":{"unicode":"1f44c-1f3fd","unicode_alternates":"","name":"ok hand sign tone 3","shortname":":ok_hand_tone3:","category":"people","emoji_order":"1337","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_hand_tone4":{"unicode":"1f44c-1f3fe","unicode_alternates":"","name":"ok hand sign tone 4","shortname":":ok_hand_tone4:","category":"people","emoji_order":"1338","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_hand_tone5":{"unicode":"1f44c-1f3ff","unicode_alternates":"","name":"ok hand sign tone 5","shortname":":ok_hand_tone5:","category":"people","emoji_order":"1339","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hand_tone1":{"unicode":"270b-1f3fb","unicode_alternates":"","name":"raised hand tone 1","shortname":":raised_hand_tone1:","category":"people","emoji_order":"1340","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hand_tone2":{"unicode":"270b-1f3fc","unicode_alternates":"","name":"raised hand tone 2","shortname":":raised_hand_tone2:","category":"people","emoji_order":"1341","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hand_tone3":{"unicode":"270b-1f3fd","unicode_alternates":"","name":"raised hand tone 3","shortname":":raised_hand_tone3:","category":"people","emoji_order":"1342","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hand_tone4":{"unicode":"270b-1f3fe","unicode_alternates":"","name":"raised hand tone 4","shortname":":raised_hand_tone4:","category":"people","emoji_order":"1343","aliases":[],"aliases_ascii":[],"keywords":[]},"raised_hand_tone5":{"unicode":"270b-1f3ff","unicode_alternates":"","name":"raised hand tone 5","shortname":":raised_hand_tone5:","category":"people","emoji_order":"1344","aliases":[],"aliases_ascii":[],"keywords":[]},"open_hands_tone1":{"unicode":"1f450-1f3fb","unicode_alternates":"","name":"open hands sign tone 1","shortname":":open_hands_tone1:","category":"people","emoji_order":"1345","aliases":[],"aliases_ascii":[],"keywords":[]},"open_hands_tone2":{"unicode":"1f450-1f3fc","unicode_alternates":"","name":"open hands sign tone 2","shortname":":open_hands_tone2:","category":"people","emoji_order":"1346","aliases":[],"aliases_ascii":[],"keywords":[]},"open_hands_tone3":{"unicode":"1f450-1f3fd","unicode_alternates":"","name":"open hands sign tone 3","shortname":":open_hands_tone3:","category":"people","emoji_order":"1347","aliases":[],"aliases_ascii":[],"keywords":[]},"open_hands_tone4":{"unicode":"1f450-1f3fe","unicode_alternates":"","name":"open hands sign tone 4","shortname":":open_hands_tone4:","category":"people","emoji_order":"1348","aliases":[],"aliases_ascii":[],"keywords":[]},"open_hands_tone5":{"unicode":"1f450-1f3ff","unicode_alternates":"","name":"open hands sign tone 5","shortname":":open_hands_tone5:","category":"people","emoji_order":"1349","aliases":[],"aliases_ascii":[],"keywords":[]},"muscle_tone1":{"unicode":"1f4aa-1f3fb","unicode_alternates":"","name":"flexed biceps tone 1","shortname":":muscle_tone1:","category":"people","emoji_order":"1350","aliases":[],"aliases_ascii":[],"keywords":[]},"muscle_tone2":{"unicode":"1f4aa-1f3fc","unicode_alternates":"","name":"flexed biceps tone 2","shortname":":muscle_tone2:","category":"people","emoji_order":"1351","aliases":[],"aliases_ascii":[],"keywords":[]},"muscle_tone3":{"unicode":"1f4aa-1f3fd","unicode_alternates":"","name":"flexed biceps tone 3","shortname":":muscle_tone3:","category":"people","emoji_order":"1352","aliases":[],"aliases_ascii":[],"keywords":[]},"muscle_tone4":{"unicode":"1f4aa-1f3fe","unicode_alternates":"","name":"flexed biceps tone 4","shortname":":muscle_tone4:","category":"people","emoji_order":"1353","aliases":[],"aliases_ascii":[],"keywords":[]},"muscle_tone5":{"unicode":"1f4aa-1f3ff","unicode_alternates":"","name":"flexed biceps tone 5","shortname":":muscle_tone5:","category":"people","emoji_order":"1354","aliases":[],"aliases_ascii":[],"keywords":[]},"pray_tone1":{"unicode":"1f64f-1f3fb","unicode_alternates":"","name":"person with folded hands tone 1","shortname":":pray_tone1:","category":"people","emoji_order":"1355","aliases":[],"aliases_ascii":[],"keywords":[]},"pray_tone2":{"unicode":"1f64f-1f3fc","unicode_alternates":"","name":"person with folded hands tone 2","shortname":":pray_tone2:","category":"people","emoji_order":"1356","aliases":[],"aliases_ascii":[],"keywords":[]},"pray_tone3":{"unicode":"1f64f-1f3fd","unicode_alternates":"","name":"person with folded hands tone 3","shortname":":pray_tone3:","category":"people","emoji_order":"1357","aliases":[],"aliases_ascii":[],"keywords":[]},"pray_tone4":{"unicode":"1f64f-1f3fe","unicode_alternates":"","name":"person with folded hands tone 4","shortname":":pray_tone4:","category":"people","emoji_order":"1358","aliases":[],"aliases_ascii":[],"keywords":[]},"pray_tone5":{"unicode":"1f64f-1f3ff","unicode_alternates":"","name":"person with folded hands tone 5","shortname":":pray_tone5:","category":"people","emoji_order":"1359","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_tone1":{"unicode":"261d-1f3fb","unicode_alternates":"","name":"white up pointing index tone 1","shortname":":point_up_tone1:","category":"people","emoji_order":"1360","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_tone2":{"unicode":"261d-1f3fc","unicode_alternates":"","name":"white up pointing index tone 2","shortname":":point_up_tone2:","category":"people","emoji_order":"1361","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_tone3":{"unicode":"261d-1f3fd","unicode_alternates":"","name":"white up pointing index tone 3","shortname":":point_up_tone3:","category":"people","emoji_order":"1362","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_tone4":{"unicode":"261d-1f3fe","unicode_alternates":"","name":"white up pointing index tone 4","shortname":":point_up_tone4:","category":"people","emoji_order":"1363","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_tone5":{"unicode":"261d-1f3ff","unicode_alternates":"","name":"white up pointing index tone 5","shortname":":point_up_tone5:","category":"people","emoji_order":"1364","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_2_tone1":{"unicode":"1f446-1f3fb","unicode_alternates":"","name":"white up pointing backhand index tone 1","shortname":":point_up_2_tone1:","category":"people","emoji_order":"1365","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_2_tone2":{"unicode":"1f446-1f3fc","unicode_alternates":"","name":"white up pointing backhand index tone 2","shortname":":point_up_2_tone2:","category":"people","emoji_order":"1366","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_2_tone3":{"unicode":"1f446-1f3fd","unicode_alternates":"","name":"white up pointing backhand index tone 3","shortname":":point_up_2_tone3:","category":"people","emoji_order":"1367","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_2_tone4":{"unicode":"1f446-1f3fe","unicode_alternates":"","name":"white up pointing backhand index tone 4","shortname":":point_up_2_tone4:","category":"people","emoji_order":"1368","aliases":[],"aliases_ascii":[],"keywords":[]},"point_up_2_tone5":{"unicode":"1f446-1f3ff","unicode_alternates":"","name":"white up pointing backhand index tone 5","shortname":":point_up_2_tone5:","category":"people","emoji_order":"1369","aliases":[],"aliases_ascii":[],"keywords":[]},"point_down_tone1":{"unicode":"1f447-1f3fb","unicode_alternates":"","name":"white down pointing backhand index tone 1","shortname":":point_down_tone1:","category":"people","emoji_order":"1370","aliases":[],"aliases_ascii":[],"keywords":[]},"point_down_tone2":{"unicode":"1f447-1f3fc","unicode_alternates":"","name":"white down pointing backhand index tone 2","shortname":":point_down_tone2:","category":"people","emoji_order":"1371","aliases":[],"aliases_ascii":[],"keywords":[]},"point_down_tone3":{"unicode":"1f447-1f3fd","unicode_alternates":"","name":"white down pointing backhand index tone 3","shortname":":point_down_tone3:","category":"people","emoji_order":"1372","aliases":[],"aliases_ascii":[],"keywords":[]},"point_down_tone4":{"unicode":"1f447-1f3fe","unicode_alternates":"","name":"white down pointing backhand index tone 4","shortname":":point_down_tone4:","category":"people","emoji_order":"1373","aliases":[],"aliases_ascii":[],"keywords":[]},"point_down_tone5":{"unicode":"1f447-1f3ff","unicode_alternates":"","name":"white down pointing backhand index tone 5","shortname":":point_down_tone5:","category":"people","emoji_order":"1374","aliases":[],"aliases_ascii":[],"keywords":[]},"point_left_tone1":{"unicode":"1f448-1f3fb","unicode_alternates":"","name":"white left pointing backhand index tone 1","shortname":":point_left_tone1:","category":"people","emoji_order":"1375","aliases":[],"aliases_ascii":[],"keywords":[]},"point_left_tone2":{"unicode":"1f448-1f3fc","unicode_alternates":"","name":"white left pointing backhand index tone 2","shortname":":point_left_tone2:","category":"people","emoji_order":"1376","aliases":[],"aliases_ascii":[],"keywords":[]},"point_left_tone3":{"unicode":"1f448-1f3fd","unicode_alternates":"","name":"white left pointing backhand index tone 3","shortname":":point_left_tone3:","category":"people","emoji_order":"1377","aliases":[],"aliases_ascii":[],"keywords":[]},"point_left_tone4":{"unicode":"1f448-1f3fe","unicode_alternates":"","name":"white left pointing backhand index tone 4","shortname":":point_left_tone4:","category":"people","emoji_order":"1378","aliases":[],"aliases_ascii":[],"keywords":[]},"point_left_tone5":{"unicode":"1f448-1f3ff","unicode_alternates":"","name":"white left pointing backhand index tone 5","shortname":":point_left_tone5:","category":"people","emoji_order":"1379","aliases":[],"aliases_ascii":[],"keywords":[]},"point_right_tone1":{"unicode":"1f449-1f3fb","unicode_alternates":"","name":"white right pointing backhand index tone 1","shortname":":point_right_tone1:","category":"people","emoji_order":"1380","aliases":[],"aliases_ascii":[],"keywords":[]},"point_right_tone2":{"unicode":"1f449-1f3fc","unicode_alternates":"","name":"white right pointing backhand index tone 2","shortname":":point_right_tone2:","category":"people","emoji_order":"1381","aliases":[],"aliases_ascii":[],"keywords":[]},"point_right_tone3":{"unicode":"1f449-1f3fd","unicode_alternates":"","name":"white right pointing backhand index tone 3","shortname":":point_right_tone3:","category":"people","emoji_order":"1382","aliases":[],"aliases_ascii":[],"keywords":[]},"point_right_tone4":{"unicode":"1f449-1f3fe","unicode_alternates":"","name":"white right pointing backhand index tone 4","shortname":":point_right_tone4:","category":"people","emoji_order":"1383","aliases":[],"aliases_ascii":[],"keywords":[]},"point_right_tone5":{"unicode":"1f449-1f3ff","unicode_alternates":"","name":"white right pointing backhand index tone 5","shortname":":point_right_tone5:","category":"people","emoji_order":"1384","aliases":[],"aliases_ascii":[],"keywords":[]},"middle_finger_tone1":{"unicode":"1f595-1f3fb","unicode_alternates":"","name":"reversed hand with middle finger extended tone 1","shortname":":middle_finger_tone1:","category":"people","emoji_order":"1385","aliases":[":reversed_hand_with_middle_finger_extended_tone1:"],"aliases_ascii":[],"keywords":[]},"middle_finger_tone2":{"unicode":"1f595-1f3fc","unicode_alternates":"","name":"reversed hand with middle finger extended tone 2","shortname":":middle_finger_tone2:","category":"people","emoji_order":"1386","aliases":[":reversed_hand_with_middle_finger_extended_tone2:"],"aliases_ascii":[],"keywords":[]},"middle_finger_tone3":{"unicode":"1f595-1f3fd","unicode_alternates":"","name":"reversed hand with middle finger extended tone 3","shortname":":middle_finger_tone3:","category":"people","emoji_order":"1387","aliases":[":reversed_hand_with_middle_finger_extended_tone3:"],"aliases_ascii":[],"keywords":[]},"middle_finger_tone4":{"unicode":"1f595-1f3fe","unicode_alternates":"","name":"reversed hand with middle finger extended tone 4","shortname":":middle_finger_tone4:","category":"people","emoji_order":"1388","aliases":[":reversed_hand_with_middle_finger_extended_tone4:"],"aliases_ascii":[],"keywords":[]},"middle_finger_tone5":{"unicode":"1f595-1f3ff","unicode_alternates":"","name":"reversed hand with middle finger extended tone 5","shortname":":middle_finger_tone5:","category":"people","emoji_order":"1389","aliases":[":reversed_hand_with_middle_finger_extended_tone5:"],"aliases_ascii":[],"keywords":[]},"hand_splayed_tone1":{"unicode":"1f590-1f3fb","unicode_alternates":"","name":"raised hand with fingers splayed tone 1","shortname":":hand_splayed_tone1:","category":"people","emoji_order":"1390","aliases":[":raised_hand_with_fingers_splayed_tone1:"],"aliases_ascii":[],"keywords":[]},"hand_splayed_tone2":{"unicode":"1f590-1f3fc","unicode_alternates":"","name":"raised hand with fingers splayed tone 2","shortname":":hand_splayed_tone2:","category":"people","emoji_order":"1391","aliases":[":raised_hand_with_fingers_splayed_tone2:"],"aliases_ascii":[],"keywords":[]},"hand_splayed_tone3":{"unicode":"1f590-1f3fd","unicode_alternates":"","name":"raised hand with fingers splayed tone 3","shortname":":hand_splayed_tone3:","category":"people","emoji_order":"1392","aliases":[":raised_hand_with_fingers_splayed_tone3:"],"aliases_ascii":[],"keywords":[]},"hand_splayed_tone4":{"unicode":"1f590-1f3fe","unicode_alternates":"","name":"raised hand with fingers splayed tone 4","shortname":":hand_splayed_tone4:","category":"people","emoji_order":"1393","aliases":[":raised_hand_with_fingers_splayed_tone4:"],"aliases_ascii":[],"keywords":[]},"hand_splayed_tone5":{"unicode":"1f590-1f3ff","unicode_alternates":"","name":"raised hand with fingers splayed tone 5","shortname":":hand_splayed_tone5:","category":"people","emoji_order":"1394","aliases":[":raised_hand_with_fingers_splayed_tone5:"],"aliases_ascii":[],"keywords":[]},"metal_tone1":{"unicode":"1f918-1f3fb","unicode_alternates":"","name":"sign of the horns tone 1","shortname":":metal_tone1:","category":"people","emoji_order":"1395","aliases":[":sign_of_the_horns_tone1:"],"aliases_ascii":[],"keywords":[]},"metal_tone2":{"unicode":"1f918-1f3fc","unicode_alternates":"","name":"sign of the horns tone 2","shortname":":metal_tone2:","category":"people","emoji_order":"1396","aliases":[":sign_of_the_horns_tone2:"],"aliases_ascii":[],"keywords":[]},"metal_tone3":{"unicode":"1f918-1f3fd","unicode_alternates":"","name":"sign of the horns tone 3","shortname":":metal_tone3:","category":"people","emoji_order":"1397","aliases":[":sign_of_the_horns_tone3:"],"aliases_ascii":[],"keywords":[]},"metal_tone4":{"unicode":"1f918-1f3fe","unicode_alternates":"","name":"sign of the horns tone 4","shortname":":metal_tone4:","category":"people","emoji_order":"1398","aliases":[":sign_of_the_horns_tone4:"],"aliases_ascii":[],"keywords":[]},"metal_tone5":{"unicode":"1f918-1f3ff","unicode_alternates":"","name":"sign of the horns tone 5","shortname":":metal_tone5:","category":"people","emoji_order":"1399","aliases":[":sign_of_the_horns_tone5:"],"aliases_ascii":[],"keywords":[]},"vulcan_tone1":{"unicode":"1f596-1f3fb","unicode_alternates":"","name":"raised hand with part between middle and ring fingers tone 1","shortname":":vulcan_tone1:","category":"people","emoji_order":"1400","aliases":[":raised_hand_with_part_between_middle_and_ring_fingers_tone1:"],"aliases_ascii":[],"keywords":[]},"vulcan_tone2":{"unicode":"1f596-1f3fc","unicode_alternates":"","name":"raised hand with part between middle and ring fingers tone 2","shortname":":vulcan_tone2:","category":"people","emoji_order":"1401","aliases":[":raised_hand_with_part_between_middle_and_ring_fingers_tone2:"],"aliases_ascii":[],"keywords":[]},"vulcan_tone3":{"unicode":"1f596-1f3fd","unicode_alternates":"","name":"raised hand with part between middle and ring fingers tone 3","shortname":":vulcan_tone3:","category":"people","emoji_order":"1402","aliases":[":raised_hand_with_part_between_middle_and_ring_fingers_tone3:"],"aliases_ascii":[],"keywords":[]},"vulcan_tone4":{"unicode":"1f596-1f3fe","unicode_alternates":"","name":"raised hand with part between middle and ring fingers tone 4","shortname":":vulcan_tone4:","category":"people","emoji_order":"1403","aliases":[":raised_hand_with_part_between_middle_and_ring_fingers_tone4:"],"aliases_ascii":[],"keywords":[]},"vulcan_tone5":{"unicode":"1f596-1f3ff","unicode_alternates":"","name":"raised hand with part between middle and ring fingers tone 5","shortname":":vulcan_tone5:","category":"people","emoji_order":"1404","aliases":[":raised_hand_with_part_between_middle_and_ring_fingers_tone5:"],"aliases_ascii":[],"keywords":[]},"writing_hand_tone1":{"unicode":"270d-1f3fb","unicode_alternates":"","name":"writing hand tone 1","shortname":":writing_hand_tone1:","category":"people","emoji_order":"1405","aliases":[],"aliases_ascii":[],"keywords":[]},"writing_hand_tone2":{"unicode":"270d-1f3fc","unicode_alternates":"","name":"writing hand tone 2","shortname":":writing_hand_tone2:","category":"people","emoji_order":"1406","aliases":[],"aliases_ascii":[],"keywords":[]},"writing_hand_tone3":{"unicode":"270d-1f3fd","unicode_alternates":"","name":"writing hand tone 3","shortname":":writing_hand_tone3:","category":"people","emoji_order":"1407","aliases":[],"aliases_ascii":[],"keywords":[]},"writing_hand_tone4":{"unicode":"270d-1f3fe","unicode_alternates":"","name":"writing hand tone 4","shortname":":writing_hand_tone4:","category":"people","emoji_order":"1408","aliases":[],"aliases_ascii":[],"keywords":[]},"writing_hand_tone5":{"unicode":"270d-1f3ff","unicode_alternates":"","name":"writing hand tone 5","shortname":":writing_hand_tone5:","category":"people","emoji_order":"1409","aliases":[],"aliases_ascii":[],"keywords":[]},"nail_care_tone1":{"unicode":"1f485-1f3fb","unicode_alternates":"","name":"nail polish tone 1","shortname":":nail_care_tone1:","category":"people","emoji_order":"1410","aliases":[],"aliases_ascii":[],"keywords":[]},"nail_care_tone2":{"unicode":"1f485-1f3fc","unicode_alternates":"","name":"nail polish tone 2","shortname":":nail_care_tone2:","category":"people","emoji_order":"1411","aliases":[],"aliases_ascii":[],"keywords":[]},"nail_care_tone3":{"unicode":"1f485-1f3fd","unicode_alternates":"","name":"nail polish tone 3","shortname":":nail_care_tone3:","category":"people","emoji_order":"1412","aliases":[],"aliases_ascii":[],"keywords":[]},"nail_care_tone4":{"unicode":"1f485-1f3fe","unicode_alternates":"","name":"nail polish tone 4","shortname":":nail_care_tone4:","category":"people","emoji_order":"1413","aliases":[],"aliases_ascii":[],"keywords":[]},"nail_care_tone5":{"unicode":"1f485-1f3ff","unicode_alternates":"","name":"nail polish tone 5","shortname":":nail_care_tone5:","category":"people","emoji_order":"1414","aliases":[],"aliases_ascii":[],"keywords":[]},"ear_tone1":{"unicode":"1f442-1f3fb","unicode_alternates":"","name":"ear tone 1","shortname":":ear_tone1:","category":"people","emoji_order":"1415","aliases":[],"aliases_ascii":[],"keywords":[]},"ear_tone2":{"unicode":"1f442-1f3fc","unicode_alternates":"","name":"ear tone 2","shortname":":ear_tone2:","category":"people","emoji_order":"1416","aliases":[],"aliases_ascii":[],"keywords":[]},"ear_tone3":{"unicode":"1f442-1f3fd","unicode_alternates":"","name":"ear tone 3","shortname":":ear_tone3:","category":"people","emoji_order":"1417","aliases":[],"aliases_ascii":[],"keywords":[]},"ear_tone4":{"unicode":"1f442-1f3fe","unicode_alternates":"","name":"ear tone 4","shortname":":ear_tone4:","category":"people","emoji_order":"1418","aliases":[],"aliases_ascii":[],"keywords":[]},"ear_tone5":{"unicode":"1f442-1f3ff","unicode_alternates":"","name":"ear tone 5","shortname":":ear_tone5:","category":"people","emoji_order":"1419","aliases":[],"aliases_ascii":[],"keywords":[]},"nose_tone1":{"unicode":"1f443-1f3fb","unicode_alternates":"","name":"nose tone 1","shortname":":nose_tone1:","category":"people","emoji_order":"1420","aliases":[],"aliases_ascii":[],"keywords":[]},"nose_tone2":{"unicode":"1f443-1f3fc","unicode_alternates":"","name":"nose tone 2","shortname":":nose_tone2:","category":"people","emoji_order":"1421","aliases":[],"aliases_ascii":[],"keywords":[]},"nose_tone3":{"unicode":"1f443-1f3fd","unicode_alternates":"","name":"nose tone 3","shortname":":nose_tone3:","category":"people","emoji_order":"1422","aliases":[],"aliases_ascii":[],"keywords":[]},"nose_tone4":{"unicode":"1f443-1f3fe","unicode_alternates":"","name":"nose tone 4","shortname":":nose_tone4:","category":"people","emoji_order":"1423","aliases":[],"aliases_ascii":[],"keywords":[]},"nose_tone5":{"unicode":"1f443-1f3ff","unicode_alternates":"","name":"nose tone 5","shortname":":nose_tone5:","category":"people","emoji_order":"1424","aliases":[],"aliases_ascii":[],"keywords":[]},"baby_tone1":{"unicode":"1f476-1f3fb","unicode_alternates":"","name":"baby tone 1","shortname":":baby_tone1:","category":"people","emoji_order":"1425","aliases":[],"aliases_ascii":[],"keywords":[]},"baby_tone2":{"unicode":"1f476-1f3fc","unicode_alternates":"","name":"baby tone 2","shortname":":baby_tone2:","category":"people","emoji_order":"1426","aliases":[],"aliases_ascii":[],"keywords":[]},"baby_tone3":{"unicode":"1f476-1f3fd","unicode_alternates":"","name":"baby tone 3","shortname":":baby_tone3:","category":"people","emoji_order":"1427","aliases":[],"aliases_ascii":[],"keywords":[]},"baby_tone4":{"unicode":"1f476-1f3fe","unicode_alternates":"","name":"baby tone 4","shortname":":baby_tone4:","category":"people","emoji_order":"1428","aliases":[],"aliases_ascii":[],"keywords":[]},"baby_tone5":{"unicode":"1f476-1f3ff","unicode_alternates":"","name":"baby tone 5","shortname":":baby_tone5:","category":"people","emoji_order":"1429","aliases":[],"aliases_ascii":[],"keywords":[]},"boy_tone1":{"unicode":"1f466-1f3fb","unicode_alternates":"","name":"boy tone 1","shortname":":boy_tone1:","category":"people","emoji_order":"1430","aliases":[],"aliases_ascii":[],"keywords":[]},"boy_tone2":{"unicode":"1f466-1f3fc","unicode_alternates":"","name":"boy tone 2","shortname":":boy_tone2:","category":"people","emoji_order":"1431","aliases":[],"aliases_ascii":[],"keywords":[]},"boy_tone3":{"unicode":"1f466-1f3fd","unicode_alternates":"","name":"boy tone 3","shortname":":boy_tone3:","category":"people","emoji_order":"1432","aliases":[],"aliases_ascii":[],"keywords":[]},"boy_tone4":{"unicode":"1f466-1f3fe","unicode_alternates":"","name":"boy tone 4","shortname":":boy_tone4:","category":"people","emoji_order":"1433","aliases":[],"aliases_ascii":[],"keywords":[]},"boy_tone5":{"unicode":"1f466-1f3ff","unicode_alternates":"","name":"boy tone 5","shortname":":boy_tone5:","category":"people","emoji_order":"1434","aliases":[],"aliases_ascii":[],"keywords":[]},"girl_tone1":{"unicode":"1f467-1f3fb","unicode_alternates":"","name":"girl tone 1","shortname":":girl_tone1:","category":"people","emoji_order":"1435","aliases":[],"aliases_ascii":[],"keywords":[]},"girl_tone2":{"unicode":"1f467-1f3fc","unicode_alternates":"","name":"girl tone 2","shortname":":girl_tone2:","category":"people","emoji_order":"1436","aliases":[],"aliases_ascii":[],"keywords":[]},"girl_tone3":{"unicode":"1f467-1f3fd","unicode_alternates":"","name":"girl tone 3","shortname":":girl_tone3:","category":"people","emoji_order":"1437","aliases":[],"aliases_ascii":[],"keywords":[]},"girl_tone4":{"unicode":"1f467-1f3fe","unicode_alternates":"","name":"girl tone 4","shortname":":girl_tone4:","category":"people","emoji_order":"1438","aliases":[],"aliases_ascii":[],"keywords":[]},"girl_tone5":{"unicode":"1f467-1f3ff","unicode_alternates":"","name":"girl tone 5","shortname":":girl_tone5:","category":"people","emoji_order":"1439","aliases":[],"aliases_ascii":[],"keywords":[]},"man_tone1":{"unicode":"1f468-1f3fb","unicode_alternates":"","name":"man tone 1","shortname":":man_tone1:","category":"people","emoji_order":"1440","aliases":[],"aliases_ascii":[],"keywords":[]},"man_tone2":{"unicode":"1f468-1f3fc","unicode_alternates":"","name":"man tone 2","shortname":":man_tone2:","category":"people","emoji_order":"1441","aliases":[],"aliases_ascii":[],"keywords":[]},"man_tone3":{"unicode":"1f468-1f3fd","unicode_alternates":"","name":"man tone 3","shortname":":man_tone3:","category":"people","emoji_order":"1442","aliases":[],"aliases_ascii":[],"keywords":[]},"man_tone4":{"unicode":"1f468-1f3fe","unicode_alternates":"","name":"man tone 4","shortname":":man_tone4:","category":"people","emoji_order":"1443","aliases":[],"aliases_ascii":[],"keywords":[]},"man_tone5":{"unicode":"1f468-1f3ff","unicode_alternates":"","name":"man tone 5","shortname":":man_tone5:","category":"people","emoji_order":"1444","aliases":[],"aliases_ascii":[],"keywords":[]},"woman_tone1":{"unicode":"1f469-1f3fb","unicode_alternates":"","name":"woman tone 1","shortname":":woman_tone1:","category":"people","emoji_order":"1445","aliases":[],"aliases_ascii":[],"keywords":[]},"woman_tone2":{"unicode":"1f469-1f3fc","unicode_alternates":"","name":"woman tone 2","shortname":":woman_tone2:","category":"people","emoji_order":"1446","aliases":[],"aliases_ascii":[],"keywords":[]},"woman_tone3":{"unicode":"1f469-1f3fd","unicode_alternates":"","name":"woman tone 3","shortname":":woman_tone3:","category":"people","emoji_order":"1447","aliases":[],"aliases_ascii":[],"keywords":[]},"woman_tone4":{"unicode":"1f469-1f3fe","unicode_alternates":"","name":"woman tone 4","shortname":":woman_tone4:","category":"people","emoji_order":"1448","aliases":[],"aliases_ascii":[],"keywords":[]},"woman_tone5":{"unicode":"1f469-1f3ff","unicode_alternates":"","name":"woman tone 5","shortname":":woman_tone5:","category":"people","emoji_order":"1449","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_blond_hair_tone1":{"unicode":"1f471-1f3fb","unicode_alternates":"","name":"person with blond hair tone 1","shortname":":person_with_blond_hair_tone1:","category":"people","emoji_order":"1450","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_blond_hair_tone2":{"unicode":"1f471-1f3fc","unicode_alternates":"","name":"person with blond hair tone 2","shortname":":person_with_blond_hair_tone2:","category":"people","emoji_order":"1451","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_blond_hair_tone3":{"unicode":"1f471-1f3fd","unicode_alternates":"","name":"person with blond hair tone 3","shortname":":person_with_blond_hair_tone3:","category":"people","emoji_order":"1452","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_blond_hair_tone4":{"unicode":"1f471-1f3fe","unicode_alternates":"","name":"person with blond hair tone 4","shortname":":person_with_blond_hair_tone4:","category":"people","emoji_order":"1453","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_blond_hair_tone5":{"unicode":"1f471-1f3ff","unicode_alternates":"","name":"person with blond hair tone 5","shortname":":person_with_blond_hair_tone5:","category":"people","emoji_order":"1454","aliases":[],"aliases_ascii":[],"keywords":[]},"older_man_tone1":{"unicode":"1f474-1f3fb","unicode_alternates":"","name":"older man tone 1","shortname":":older_man_tone1:","category":"people","emoji_order":"1455","aliases":[],"aliases_ascii":[],"keywords":[]},"older_man_tone2":{"unicode":"1f474-1f3fc","unicode_alternates":"","name":"older man tone 2","shortname":":older_man_tone2:","category":"people","emoji_order":"1456","aliases":[],"aliases_ascii":[],"keywords":[]},"older_man_tone3":{"unicode":"1f474-1f3fd","unicode_alternates":"","name":"older man tone 3","shortname":":older_man_tone3:","category":"people","emoji_order":"1457","aliases":[],"aliases_ascii":[],"keywords":[]},"older_man_tone4":{"unicode":"1f474-1f3fe","unicode_alternates":"","name":"older man tone 4","shortname":":older_man_tone4:","category":"people","emoji_order":"1458","aliases":[],"aliases_ascii":[],"keywords":[]},"older_man_tone5":{"unicode":"1f474-1f3ff","unicode_alternates":"","name":"older man tone 5","shortname":":older_man_tone5:","category":"people","emoji_order":"1459","aliases":[],"aliases_ascii":[],"keywords":[]},"older_woman_tone1":{"unicode":"1f475-1f3fb","unicode_alternates":"","name":"older woman tone 1","shortname":":older_woman_tone1:","category":"people","emoji_order":"1460","aliases":[":grandma_tone1:"],"aliases_ascii":[],"keywords":[]},"older_woman_tone2":{"unicode":"1f475-1f3fc","unicode_alternates":"","name":"older woman tone 2","shortname":":older_woman_tone2:","category":"people","emoji_order":"1461","aliases":[":grandma_tone2:"],"aliases_ascii":[],"keywords":[]},"older_woman_tone3":{"unicode":"1f475-1f3fd","unicode_alternates":"","name":"older woman tone 3","shortname":":older_woman_tone3:","category":"people","emoji_order":"1462","aliases":[":grandma_tone3:"],"aliases_ascii":[],"keywords":[]},"older_woman_tone4":{"unicode":"1f475-1f3fe","unicode_alternates":"","name":"older woman tone 4","shortname":":older_woman_tone4:","category":"people","emoji_order":"1463","aliases":[":grandma_tone4:"],"aliases_ascii":[],"keywords":[]},"older_woman_tone5":{"unicode":"1f475-1f3ff","unicode_alternates":"","name":"older woman tone 5","shortname":":older_woman_tone5:","category":"people","emoji_order":"1464","aliases":[":grandma_tone5:"],"aliases_ascii":[],"keywords":[]},"man_with_gua_pi_mao_tone1":{"unicode":"1f472-1f3fb","unicode_alternates":"","name":"man with gua pi mao tone 1","shortname":":man_with_gua_pi_mao_tone1:","category":"people","emoji_order":"1465","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_gua_pi_mao_tone2":{"unicode":"1f472-1f3fc","unicode_alternates":"","name":"man with gua pi mao tone 2","shortname":":man_with_gua_pi_mao_tone2:","category":"people","emoji_order":"1466","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_gua_pi_mao_tone3":{"unicode":"1f472-1f3fd","unicode_alternates":"","name":"man with gua pi mao tone 3","shortname":":man_with_gua_pi_mao_tone3:","category":"people","emoji_order":"1467","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_gua_pi_mao_tone4":{"unicode":"1f472-1f3fe","unicode_alternates":"","name":"man with gua pi mao tone 4","shortname":":man_with_gua_pi_mao_tone4:","category":"people","emoji_order":"1468","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_gua_pi_mao_tone5":{"unicode":"1f472-1f3ff","unicode_alternates":"","name":"man with gua pi mao tone 5","shortname":":man_with_gua_pi_mao_tone5:","category":"people","emoji_order":"1469","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_turban_tone1":{"unicode":"1f473-1f3fb","unicode_alternates":"","name":"man with turban tone 1","shortname":":man_with_turban_tone1:","category":"people","emoji_order":"1470","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_turban_tone2":{"unicode":"1f473-1f3fc","unicode_alternates":"","name":"man with turban tone 2","shortname":":man_with_turban_tone2:","category":"people","emoji_order":"1471","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_turban_tone3":{"unicode":"1f473-1f3fd","unicode_alternates":"","name":"man with turban tone 3","shortname":":man_with_turban_tone3:","category":"people","emoji_order":"1472","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_turban_tone4":{"unicode":"1f473-1f3fe","unicode_alternates":"","name":"man with turban tone 4","shortname":":man_with_turban_tone4:","category":"people","emoji_order":"1473","aliases":[],"aliases_ascii":[],"keywords":[]},"man_with_turban_tone5":{"unicode":"1f473-1f3ff","unicode_alternates":"","name":"man with turban tone 5","shortname":":man_with_turban_tone5:","category":"people","emoji_order":"1474","aliases":[],"aliases_ascii":[],"keywords":[]},"cop_tone1":{"unicode":"1f46e-1f3fb","unicode_alternates":"","name":"police officer tone 1","shortname":":cop_tone1:","category":"people","emoji_order":"1475","aliases":[],"aliases_ascii":[],"keywords":[]},"cop_tone2":{"unicode":"1f46e-1f3fc","unicode_alternates":"","name":"police officer tone 2","shortname":":cop_tone2:","category":"people","emoji_order":"1476","aliases":[],"aliases_ascii":[],"keywords":[]},"cop_tone3":{"unicode":"1f46e-1f3fd","unicode_alternates":"","name":"police officer tone 3","shortname":":cop_tone3:","category":"people","emoji_order":"1477","aliases":[],"aliases_ascii":[],"keywords":[]},"cop_tone4":{"unicode":"1f46e-1f3fe","unicode_alternates":"","name":"police officer tone 4","shortname":":cop_tone4:","category":"people","emoji_order":"1478","aliases":[],"aliases_ascii":[],"keywords":[]},"cop_tone5":{"unicode":"1f46e-1f3ff","unicode_alternates":"","name":"police officer tone 5","shortname":":cop_tone5:","category":"people","emoji_order":"1479","aliases":[],"aliases_ascii":[],"keywords":[]},"construction_worker_tone1":{"unicode":"1f477-1f3fb","unicode_alternates":"","name":"construction worker tone 1","shortname":":construction_worker_tone1:","category":"people","emoji_order":"1480","aliases":[],"aliases_ascii":[],"keywords":[]},"construction_worker_tone2":{"unicode":"1f477-1f3fc","unicode_alternates":"","name":"construction worker tone 2","shortname":":construction_worker_tone2:","category":"people","emoji_order":"1481","aliases":[],"aliases_ascii":[],"keywords":[]},"construction_worker_tone3":{"unicode":"1f477-1f3fd","unicode_alternates":"","name":"construction worker tone 3","shortname":":construction_worker_tone3:","category":"people","emoji_order":"1482","aliases":[],"aliases_ascii":[],"keywords":[]},"construction_worker_tone4":{"unicode":"1f477-1f3fe","unicode_alternates":"","name":"construction worker tone 4","shortname":":construction_worker_tone4:","category":"people","emoji_order":"1483","aliases":[],"aliases_ascii":[],"keywords":[]},"construction_worker_tone5":{"unicode":"1f477-1f3ff","unicode_alternates":"","name":"construction worker tone 5","shortname":":construction_worker_tone5:","category":"people","emoji_order":"1484","aliases":[],"aliases_ascii":[],"keywords":[]},"guardsman_tone1":{"unicode":"1f482-1f3fb","unicode_alternates":"","name":"guardsman tone 1","shortname":":guardsman_tone1:","category":"people","emoji_order":"1485","aliases":[],"aliases_ascii":[],"keywords":[]},"guardsman_tone2":{"unicode":"1f482-1f3fc","unicode_alternates":"","name":"guardsman tone 2","shortname":":guardsman_tone2:","category":"people","emoji_order":"1486","aliases":[],"aliases_ascii":[],"keywords":[]},"guardsman_tone3":{"unicode":"1f482-1f3fd","unicode_alternates":"","name":"guardsman tone 3","shortname":":guardsman_tone3:","category":"people","emoji_order":"1487","aliases":[],"aliases_ascii":[],"keywords":[]},"guardsman_tone4":{"unicode":"1f482-1f3fe","unicode_alternates":"","name":"guardsman tone 4","shortname":":guardsman_tone4:","category":"people","emoji_order":"1488","aliases":[],"aliases_ascii":[],"keywords":[]},"guardsman_tone5":{"unicode":"1f482-1f3ff","unicode_alternates":"","name":"guardsman tone 5","shortname":":guardsman_tone5:","category":"people","emoji_order":"1489","aliases":[],"aliases_ascii":[],"keywords":[]},"santa_tone1":{"unicode":"1f385-1f3fb","unicode_alternates":"","name":"father christmas tone 1","shortname":":santa_tone1:","category":"people","emoji_order":"1490","aliases":[],"aliases_ascii":[],"keywords":[]},"santa_tone2":{"unicode":"1f385-1f3fc","unicode_alternates":"","name":"father christmas tone 2","shortname":":santa_tone2:","category":"people","emoji_order":"1491","aliases":[],"aliases_ascii":[],"keywords":[]},"santa_tone3":{"unicode":"1f385-1f3fd","unicode_alternates":"","name":"father christmas tone 3","shortname":":santa_tone3:","category":"people","emoji_order":"1492","aliases":[],"aliases_ascii":[],"keywords":[]},"santa_tone4":{"unicode":"1f385-1f3fe","unicode_alternates":"","name":"father christmas tone 4","shortname":":santa_tone4:","category":"people","emoji_order":"1493","aliases":[],"aliases_ascii":[],"keywords":[]},"santa_tone5":{"unicode":"1f385-1f3ff","unicode_alternates":"","name":"father christmas tone 5","shortname":":santa_tone5:","category":"people","emoji_order":"1494","aliases":[],"aliases_ascii":[],"keywords":[]},"angel_tone1":{"unicode":"1f47c-1f3fb","unicode_alternates":"","name":"baby angel tone 1","shortname":":angel_tone1:","category":"people","emoji_order":"1495","aliases":[],"aliases_ascii":[],"keywords":[]},"angel_tone2":{"unicode":"1f47c-1f3fc","unicode_alternates":"","name":"baby angel tone 2","shortname":":angel_tone2:","category":"people","emoji_order":"1496","aliases":[],"aliases_ascii":[],"keywords":[]},"angel_tone3":{"unicode":"1f47c-1f3fd","unicode_alternates":"","name":"baby angel tone 3","shortname":":angel_tone3:","category":"people","emoji_order":"1497","aliases":[],"aliases_ascii":[],"keywords":[]},"angel_tone4":{"unicode":"1f47c-1f3fe","unicode_alternates":"","name":"baby angel tone 4","shortname":":angel_tone4:","category":"people","emoji_order":"1498","aliases":[],"aliases_ascii":[],"keywords":[]},"angel_tone5":{"unicode":"1f47c-1f3ff","unicode_alternates":"","name":"baby angel tone 5","shortname":":angel_tone5:","category":"people","emoji_order":"1499","aliases":[],"aliases_ascii":[],"keywords":[]},"princess_tone1":{"unicode":"1f478-1f3fb","unicode_alternates":"","name":"princess tone 1","shortname":":princess_tone1:","category":"people","emoji_order":"1500","aliases":[],"aliases_ascii":[],"keywords":[]},"princess_tone2":{"unicode":"1f478-1f3fc","unicode_alternates":"","name":"princess tone 2","shortname":":princess_tone2:","category":"people","emoji_order":"1501","aliases":[],"aliases_ascii":[],"keywords":[]},"princess_tone3":{"unicode":"1f478-1f3fd","unicode_alternates":"","name":"princess tone 3","shortname":":princess_tone3:","category":"people","emoji_order":"1502","aliases":[],"aliases_ascii":[],"keywords":[]},"princess_tone4":{"unicode":"1f478-1f3fe","unicode_alternates":"","name":"princess tone 4","shortname":":princess_tone4:","category":"people","emoji_order":"1503","aliases":[],"aliases_ascii":[],"keywords":[]},"princess_tone5":{"unicode":"1f478-1f3ff","unicode_alternates":"","name":"princess tone 5","shortname":":princess_tone5:","category":"people","emoji_order":"1504","aliases":[],"aliases_ascii":[],"keywords":[]},"bride_with_veil_tone1":{"unicode":"1f470-1f3fb","unicode_alternates":"","name":"bride with veil tone 1","shortname":":bride_with_veil_tone1:","category":"people","emoji_order":"1505","aliases":[],"aliases_ascii":[],"keywords":[]},"bride_with_veil_tone2":{"unicode":"1f470-1f3fc","unicode_alternates":"","name":"bride with veil tone 2","shortname":":bride_with_veil_tone2:","category":"people","emoji_order":"1506","aliases":[],"aliases_ascii":[],"keywords":[]},"bride_with_veil_tone3":{"unicode":"1f470-1f3fd","unicode_alternates":"","name":"bride with veil tone 3","shortname":":bride_with_veil_tone3:","category":"people","emoji_order":"1507","aliases":[],"aliases_ascii":[],"keywords":[]},"bride_with_veil_tone4":{"unicode":"1f470-1f3fe","unicode_alternates":"","name":"bride with veil tone 4","shortname":":bride_with_veil_tone4:","category":"people","emoji_order":"1508","aliases":[],"aliases_ascii":[],"keywords":[]},"bride_with_veil_tone5":{"unicode":"1f470-1f3ff","unicode_alternates":"","name":"bride with veil tone 5","shortname":":bride_with_veil_tone5:","category":"people","emoji_order":"1509","aliases":[],"aliases_ascii":[],"keywords":[]},"walking_tone1":{"unicode":"1f6b6-1f3fb","unicode_alternates":"","name":"pedestrian tone 1","shortname":":walking_tone1:","category":"people","emoji_order":"1510","aliases":[],"aliases_ascii":[],"keywords":[]},"walking_tone2":{"unicode":"1f6b6-1f3fc","unicode_alternates":"","name":"pedestrian tone 2","shortname":":walking_tone2:","category":"people","emoji_order":"1511","aliases":[],"aliases_ascii":[],"keywords":[]},"walking_tone3":{"unicode":"1f6b6-1f3fd","unicode_alternates":"","name":"pedestrian tone 3","shortname":":walking_tone3:","category":"people","emoji_order":"1512","aliases":[],"aliases_ascii":[],"keywords":[]},"walking_tone4":{"unicode":"1f6b6-1f3fe","unicode_alternates":"","name":"pedestrian tone 4","shortname":":walking_tone4:","category":"people","emoji_order":"1513","aliases":[],"aliases_ascii":[],"keywords":[]},"walking_tone5":{"unicode":"1f6b6-1f3ff","unicode_alternates":"","name":"pedestrian tone 5","shortname":":walking_tone5:","category":"people","emoji_order":"1514","aliases":[],"aliases_ascii":[],"keywords":[]},"runner_tone1":{"unicode":"1f3c3-1f3fb","unicode_alternates":"","name":"runner tone 1","shortname":":runner_tone1:","category":"people","emoji_order":"1515","aliases":[],"aliases_ascii":[],"keywords":[]},"runner_tone2":{"unicode":"1f3c3-1f3fc","unicode_alternates":"","name":"runner tone 2","shortname":":runner_tone2:","category":"people","emoji_order":"1516","aliases":[],"aliases_ascii":[],"keywords":[]},"runner_tone3":{"unicode":"1f3c3-1f3fd","unicode_alternates":"","name":"runner tone 3","shortname":":runner_tone3:","category":"people","emoji_order":"1517","aliases":[],"aliases_ascii":[],"keywords":[]},"runner_tone4":{"unicode":"1f3c3-1f3fe","unicode_alternates":"","name":"runner tone 4","shortname":":runner_tone4:","category":"people","emoji_order":"1518","aliases":[],"aliases_ascii":[],"keywords":[]},"runner_tone5":{"unicode":"1f3c3-1f3ff","unicode_alternates":"","name":"runner tone 5","shortname":":runner_tone5:","category":"people","emoji_order":"1519","aliases":[],"aliases_ascii":[],"keywords":[]},"dancer_tone1":{"unicode":"1f483-1f3fb","unicode_alternates":"","name":"dancer tone 1","shortname":":dancer_tone1:","category":"people","emoji_order":"1520","aliases":[],"aliases_ascii":[],"keywords":[]},"dancer_tone2":{"unicode":"1f483-1f3fc","unicode_alternates":"","name":"dancer tone 2","shortname":":dancer_tone2:","category":"people","emoji_order":"1521","aliases":[],"aliases_ascii":[],"keywords":[]},"dancer_tone3":{"unicode":"1f483-1f3fd","unicode_alternates":"","name":"dancer tone 3","shortname":":dancer_tone3:","category":"people","emoji_order":"1522","aliases":[],"aliases_ascii":[],"keywords":[]},"dancer_tone4":{"unicode":"1f483-1f3fe","unicode_alternates":"","name":"dancer tone 4","shortname":":dancer_tone4:","category":"people","emoji_order":"1523","aliases":[],"aliases_ascii":[],"keywords":[]},"dancer_tone5":{"unicode":"1f483-1f3ff","unicode_alternates":"","name":"dancer tone 5","shortname":":dancer_tone5:","category":"people","emoji_order":"1524","aliases":[],"aliases_ascii":[],"keywords":[]},"bow_tone1":{"unicode":"1f647-1f3fb","unicode_alternates":"","name":"person bowing deeply tone 1","shortname":":bow_tone1:","category":"people","emoji_order":"1525","aliases":[],"aliases_ascii":[],"keywords":[]},"bow_tone2":{"unicode":"1f647-1f3fc","unicode_alternates":"","name":"person bowing deeply tone 2","shortname":":bow_tone2:","category":"people","emoji_order":"1526","aliases":[],"aliases_ascii":[],"keywords":[]},"bow_tone3":{"unicode":"1f647-1f3fd","unicode_alternates":"","name":"person bowing deeply tone 3","shortname":":bow_tone3:","category":"people","emoji_order":"1527","aliases":[],"aliases_ascii":[],"keywords":[]},"bow_tone4":{"unicode":"1f647-1f3fe","unicode_alternates":"","name":"person bowing deeply tone 4","shortname":":bow_tone4:","category":"people","emoji_order":"1528","aliases":[],"aliases_ascii":[],"keywords":[]},"bow_tone5":{"unicode":"1f647-1f3ff","unicode_alternates":"","name":"person bowing deeply tone 5","shortname":":bow_tone5:","category":"people","emoji_order":"1529","aliases":[],"aliases_ascii":[],"keywords":[]},"information_desk_person_tone1":{"unicode":"1f481-1f3fb","unicode_alternates":"","name":"information desk person tone 1","shortname":":information_desk_person_tone1:","category":"people","emoji_order":"1530","aliases":[],"aliases_ascii":[],"keywords":[]},"information_desk_person_tone2":{"unicode":"1f481-1f3fc","unicode_alternates":"","name":"information desk person tone 2","shortname":":information_desk_person_tone2:","category":"people","emoji_order":"1531","aliases":[],"aliases_ascii":[],"keywords":[]},"information_desk_person_tone3":{"unicode":"1f481-1f3fd","unicode_alternates":"","name":"information desk person tone 3","shortname":":information_desk_person_tone3:","category":"people","emoji_order":"1532","aliases":[],"aliases_ascii":[],"keywords":[]},"information_desk_person_tone4":{"unicode":"1f481-1f3fe","unicode_alternates":"","name":"information desk person tone 4","shortname":":information_desk_person_tone4:","category":"people","emoji_order":"1533","aliases":[],"aliases_ascii":[],"keywords":[]},"information_desk_person_tone5":{"unicode":"1f481-1f3ff","unicode_alternates":"","name":"information desk person tone 5","shortname":":information_desk_person_tone5:","category":"people","emoji_order":"1534","aliases":[],"aliases_ascii":[],"keywords":[]},"no_good_tone1":{"unicode":"1f645-1f3fb","unicode_alternates":"","name":"face with no good gesture tone 1","shortname":":no_good_tone1:","category":"people","emoji_order":"1535","aliases":[],"aliases_ascii":[],"keywords":[]},"no_good_tone2":{"unicode":"1f645-1f3fc","unicode_alternates":"","name":"face with no good gesture tone 2","shortname":":no_good_tone2:","category":"people","emoji_order":"1536","aliases":[],"aliases_ascii":[],"keywords":[]},"no_good_tone3":{"unicode":"1f645-1f3fd","unicode_alternates":"","name":"face with no good gesture tone 3","shortname":":no_good_tone3:","category":"people","emoji_order":"1537","aliases":[],"aliases_ascii":[],"keywords":[]},"no_good_tone4":{"unicode":"1f645-1f3fe","unicode_alternates":"","name":"face with no good gesture tone 4","shortname":":no_good_tone4:","category":"people","emoji_order":"1538","aliases":[],"aliases_ascii":[],"keywords":[]},"no_good_tone5":{"unicode":"1f645-1f3ff","unicode_alternates":"","name":"face with no good gesture tone 5","shortname":":no_good_tone5:","category":"people","emoji_order":"1539","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_woman_tone1":{"unicode":"1f646-1f3fb","unicode_alternates":"","name":"face with ok gesture tone1","shortname":":ok_woman_tone1:","category":"people","emoji_order":"1540","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_woman_tone2":{"unicode":"1f646-1f3fc","unicode_alternates":"","name":"face with ok gesture tone2","shortname":":ok_woman_tone2:","category":"people","emoji_order":"1541","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_woman_tone3":{"unicode":"1f646-1f3fd","unicode_alternates":"","name":"face with ok gesture tone3","shortname":":ok_woman_tone3:","category":"people","emoji_order":"1542","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_woman_tone4":{"unicode":"1f646-1f3fe","unicode_alternates":"","name":"face with ok gesture tone4","shortname":":ok_woman_tone4:","category":"people","emoji_order":"1543","aliases":[],"aliases_ascii":[],"keywords":[]},"ok_woman_tone5":{"unicode":"1f646-1f3ff","unicode_alternates":"","name":"face with ok gesture tone5","shortname":":ok_woman_tone5:","category":"people","emoji_order":"1544","aliases":[],"aliases_ascii":[],"keywords":[]},"raising_hand_tone1":{"unicode":"1f64b-1f3fb","unicode_alternates":"","name":"happy person raising one hand tone1","shortname":":raising_hand_tone1:","category":"people","emoji_order":"1545","aliases":[],"aliases_ascii":[],"keywords":[]},"raising_hand_tone2":{"unicode":"1f64b-1f3fc","unicode_alternates":"","name":"happy person raising one hand tone2","shortname":":raising_hand_tone2:","category":"people","emoji_order":"1546","aliases":[],"aliases_ascii":[],"keywords":[]},"raising_hand_tone3":{"unicode":"1f64b-1f3fd","unicode_alternates":"","name":"happy person raising one hand tone3","shortname":":raising_hand_tone3:","category":"people","emoji_order":"1547","aliases":[],"aliases_ascii":[],"keywords":[]},"raising_hand_tone4":{"unicode":"1f64b-1f3fe","unicode_alternates":"","name":"happy person raising one hand tone4","shortname":":raising_hand_tone4:","category":"people","emoji_order":"1548","aliases":[],"aliases_ascii":[],"keywords":[]},"raising_hand_tone5":{"unicode":"1f64b-1f3ff","unicode_alternates":"","name":"happy person raising one hand tone5","shortname":":raising_hand_tone5:","category":"people","emoji_order":"1549","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_pouting_face_tone1":{"unicode":"1f64e-1f3fb","unicode_alternates":"","name":"person with pouting face tone1","shortname":":person_with_pouting_face_tone1:","category":"people","emoji_order":"1550","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_pouting_face_tone2":{"unicode":"1f64e-1f3fc","unicode_alternates":"","name":"person with pouting face tone2","shortname":":person_with_pouting_face_tone2:","category":"people","emoji_order":"1551","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_pouting_face_tone3":{"unicode":"1f64e-1f3fd","unicode_alternates":"","name":"person with pouting face tone3","shortname":":person_with_pouting_face_tone3:","category":"people","emoji_order":"1552","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_pouting_face_tone4":{"unicode":"1f64e-1f3fe","unicode_alternates":"","name":"person with pouting face tone4","shortname":":person_with_pouting_face_tone4:","category":"people","emoji_order":"1553","aliases":[],"aliases_ascii":[],"keywords":[]},"person_with_pouting_face_tone5":{"unicode":"1f64e-1f3ff","unicode_alternates":"","name":"person with pouting face tone5","shortname":":person_with_pouting_face_tone5:","category":"people","emoji_order":"1554","aliases":[],"aliases_ascii":[],"keywords":[]},"person_frowning_tone1":{"unicode":"1f64d-1f3fb","unicode_alternates":"","name":"person frowning tone 1","shortname":":person_frowning_tone1:","category":"people","emoji_order":"1555","aliases":[],"aliases_ascii":[],"keywords":[]},"person_frowning_tone2":{"unicode":"1f64d-1f3fc","unicode_alternates":"","name":"person frowning tone 2","shortname":":person_frowning_tone2:","category":"people","emoji_order":"1556","aliases":[],"aliases_ascii":[],"keywords":[]},"person_frowning_tone3":{"unicode":"1f64d-1f3fd","unicode_alternates":"","name":"person frowning tone 3","shortname":":person_frowning_tone3:","category":"people","emoji_order":"1557","aliases":[],"aliases_ascii":[],"keywords":[]},"person_frowning_tone4":{"unicode":"1f64d-1f3fe","unicode_alternates":"","name":"person frowning tone 4","shortname":":person_frowning_tone4:","category":"people","emoji_order":"1558","aliases":[],"aliases_ascii":[],"keywords":[]},"person_frowning_tone5":{"unicode":"1f64d-1f3ff","unicode_alternates":"","name":"person frowning tone 5","shortname":":person_frowning_tone5:","category":"people","emoji_order":"1559","aliases":[],"aliases_ascii":[],"keywords":[]},"haircut_tone1":{"unicode":"1f487-1f3fb","unicode_alternates":"","name":"haircut tone 1","shortname":":haircut_tone1:","category":"people","emoji_order":"1560","aliases":[],"aliases_ascii":[],"keywords":[]},"haircut_tone2":{"unicode":"1f487-1f3fc","unicode_alternates":"","name":"haircut tone 2","shortname":":haircut_tone2:","category":"people","emoji_order":"1561","aliases":[],"aliases_ascii":[],"keywords":[]},"haircut_tone3":{"unicode":"1f487-1f3fd","unicode_alternates":"","name":"haircut tone 3","shortname":":haircut_tone3:","category":"people","emoji_order":"1562","aliases":[],"aliases_ascii":[],"keywords":[]},"haircut_tone4":{"unicode":"1f487-1f3fe","unicode_alternates":"","name":"haircut tone 4","shortname":":haircut_tone4:","category":"people","emoji_order":"1563","aliases":[],"aliases_ascii":[],"keywords":[]},"haircut_tone5":{"unicode":"1f487-1f3ff","unicode_alternates":"","name":"haircut tone 5","shortname":":haircut_tone5:","category":"people","emoji_order":"1564","aliases":[],"aliases_ascii":[],"keywords":[]},"massage_tone1":{"unicode":"1f486-1f3fb","unicode_alternates":"","name":"face massage tone 1","shortname":":massage_tone1:","category":"people","emoji_order":"1565","aliases":[],"aliases_ascii":[],"keywords":[]},"massage_tone2":{"unicode":"1f486-1f3fc","unicode_alternates":"","name":"face massage tone 2","shortname":":massage_tone2:","category":"people","emoji_order":"1566","aliases":[],"aliases_ascii":[],"keywords":[]},"massage_tone3":{"unicode":"1f486-1f3fd","unicode_alternates":"","name":"face massage tone 3","shortname":":massage_tone3:","category":"people","emoji_order":"1567","aliases":[],"aliases_ascii":[],"keywords":[]},"massage_tone4":{"unicode":"1f486-1f3fe","unicode_alternates":"","name":"face massage tone 4","shortname":":massage_tone4:","category":"people","emoji_order":"1568","aliases":[],"aliases_ascii":[],"keywords":[]},"massage_tone5":{"unicode":"1f486-1f3ff","unicode_alternates":"","name":"face massage tone 5","shortname":":massage_tone5:","category":"people","emoji_order":"1569","aliases":[],"aliases_ascii":[],"keywords":[]},"rowboat_tone1":{"unicode":"1f6a3-1f3fb","unicode_alternates":"","name":"rowboat tone 1","shortname":":rowboat_tone1:","category":"activity","emoji_order":"1570","aliases":[],"aliases_ascii":[],"keywords":[]},"rowboat_tone2":{"unicode":"1f6a3-1f3fc","unicode_alternates":"","name":"rowboat tone 2","shortname":":rowboat_tone2:","category":"activity","emoji_order":"1571","aliases":[],"aliases_ascii":[],"keywords":[]},"rowboat_tone3":{"unicode":"1f6a3-1f3fd","unicode_alternates":"","name":"rowboat tone 3","shortname":":rowboat_tone3:","category":"activity","emoji_order":"1572","aliases":[],"aliases_ascii":[],"keywords":[]},"rowboat_tone4":{"unicode":"1f6a3-1f3fe","unicode_alternates":"","name":"rowboat tone 4","shortname":":rowboat_tone4:","category":"activity","emoji_order":"1573","aliases":[],"aliases_ascii":[],"keywords":[]},"rowboat_tone5":{"unicode":"1f6a3-1f3ff","unicode_alternates":"","name":"rowboat tone 5","shortname":":rowboat_tone5:","category":"activity","emoji_order":"1574","aliases":[],"aliases_ascii":[],"keywords":[]},"swimmer_tone1":{"unicode":"1f3ca-1f3fb","unicode_alternates":"","name":"swimmer tone 1","shortname":":swimmer_tone1:","category":"activity","emoji_order":"1575","aliases":[],"aliases_ascii":[],"keywords":[]},"swimmer_tone2":{"unicode":"1f3ca-1f3fc","unicode_alternates":"","name":"swimmer tone 2","shortname":":swimmer_tone2:","category":"activity","emoji_order":"1576","aliases":[],"aliases_ascii":[],"keywords":[]},"swimmer_tone3":{"unicode":"1f3ca-1f3fd","unicode_alternates":"","name":"swimmer tone 3","shortname":":swimmer_tone3:","category":"activity","emoji_order":"1577","aliases":[],"aliases_ascii":[],"keywords":[]},"swimmer_tone4":{"unicode":"1f3ca-1f3fe","unicode_alternates":"","name":"swimmer tone 4","shortname":":swimmer_tone4:","category":"activity","emoji_order":"1578","aliases":[],"aliases_ascii":[],"keywords":[]},"swimmer_tone5":{"unicode":"1f3ca-1f3ff","unicode_alternates":"","name":"swimmer tone 5","shortname":":swimmer_tone5:","category":"activity","emoji_order":"1579","aliases":[],"aliases_ascii":[],"keywords":[]},"surfer_tone1":{"unicode":"1f3c4-1f3fb","unicode_alternates":"","name":"surfer tone 1","shortname":":surfer_tone1:","category":"activity","emoji_order":"1580","aliases":[],"aliases_ascii":[],"keywords":[]},"surfer_tone2":{"unicode":"1f3c4-1f3fc","unicode_alternates":"","name":"surfer tone 2","shortname":":surfer_tone2:","category":"activity","emoji_order":"1581","aliases":[],"aliases_ascii":[],"keywords":[]},"surfer_tone3":{"unicode":"1f3c4-1f3fd","unicode_alternates":"","name":"surfer tone 3","shortname":":surfer_tone3:","category":"activity","emoji_order":"1582","aliases":[],"aliases_ascii":[],"keywords":[]},"surfer_tone4":{"unicode":"1f3c4-1f3fe","unicode_alternates":"","name":"surfer tone 4","shortname":":surfer_tone4:","category":"activity","emoji_order":"1583","aliases":[],"aliases_ascii":[],"keywords":[]},"surfer_tone5":{"unicode":"1f3c4-1f3ff","unicode_alternates":"","name":"surfer tone 5","shortname":":surfer_tone5:","category":"activity","emoji_order":"1584","aliases":[],"aliases_ascii":[],"keywords":[]},"bath_tone1":{"unicode":"1f6c0-1f3fb","unicode_alternates":"","name":"bath tone 1","shortname":":bath_tone1:","category":"activity","emoji_order":"1585","aliases":[],"aliases_ascii":[],"keywords":[]},"bath_tone2":{"unicode":"1f6c0-1f3fc","unicode_alternates":"","name":"bath tone 2","shortname":":bath_tone2:","category":"activity","emoji_order":"1586","aliases":[],"aliases_ascii":[],"keywords":[]},"bath_tone3":{"unicode":"1f6c0-1f3fd","unicode_alternates":"","name":"bath tone 3","shortname":":bath_tone3:","category":"activity","emoji_order":"1587","aliases":[],"aliases_ascii":[],"keywords":[]},"bath_tone4":{"unicode":"1f6c0-1f3fe","unicode_alternates":"","name":"bath tone 4","shortname":":bath_tone4:","category":"activity","emoji_order":"1588","aliases":[],"aliases_ascii":[],"keywords":[]},"bath_tone5":{"unicode":"1f6c0-1f3ff","unicode_alternates":"","name":"bath tone 5","shortname":":bath_tone5:","category":"activity","emoji_order":"1589","aliases":[],"aliases_ascii":[],"keywords":[]},"basketball_player_tone1":{"unicode":"26f9-1f3fb","unicode_alternates":"","name":"person with ball tone 1","shortname":":basketball_player_tone1:","category":"activity","emoji_order":"1590","aliases":[":person_with_ball_tone1:"],"aliases_ascii":[],"keywords":[]},"basketball_player_tone2":{"unicode":"26f9-1f3fc","unicode_alternates":"","name":"person with ball tone 2","shortname":":basketball_player_tone2:","category":"activity","emoji_order":"1591","aliases":[":person_with_ball_tone2:"],"aliases_ascii":[],"keywords":[]},"basketball_player_tone3":{"unicode":"26f9-1f3fd","unicode_alternates":"","name":"person with ball tone 3","shortname":":basketball_player_tone3:","category":"activity","emoji_order":"1592","aliases":[":person_with_ball_tone3:"],"aliases_ascii":[],"keywords":[]},"basketball_player_tone4":{"unicode":"26f9-1f3fe","unicode_alternates":"","name":"person with ball tone 4","shortname":":basketball_player_tone4:","category":"activity","emoji_order":"1593","aliases":[":person_with_ball_tone4:"],"aliases_ascii":[],"keywords":[]},"basketball_player_tone5":{"unicode":"26f9-1f3ff","unicode_alternates":"","name":"person with ball tone 5","shortname":":basketball_player_tone5:","category":"activity","emoji_order":"1594","aliases":[":person_with_ball_tone5:"],"aliases_ascii":[],"keywords":[]},"lifter_tone1":{"unicode":"1f3cb-1f3fb","unicode_alternates":"","name":"weight lifter tone 1","shortname":":lifter_tone1:","category":"activity","emoji_order":"1595","aliases":[":weight_lifter_tone1:"],"aliases_ascii":[],"keywords":[]},"lifter_tone2":{"unicode":"1f3cb-1f3fc","unicode_alternates":"","name":"weight lifter tone 2","shortname":":lifter_tone2:","category":"activity","emoji_order":"1596","aliases":[":weight_lifter_tone2:"],"aliases_ascii":[],"keywords":[]},"lifter_tone3":{"unicode":"1f3cb-1f3fd","unicode_alternates":"","name":"weight lifter tone 3","shortname":":lifter_tone3:","category":"activity","emoji_order":"1597","aliases":[":weight_lifter_tone3:"],"aliases_ascii":[],"keywords":[]},"lifter_tone4":{"unicode":"1f3cb-1f3fe","unicode_alternates":"","name":"weight lifter tone 4","shortname":":lifter_tone4:","category":"activity","emoji_order":"1598","aliases":[":weight_lifter_tone4:"],"aliases_ascii":[],"keywords":[]},"lifter_tone5":{"unicode":"1f3cb-1f3ff","unicode_alternates":"","name":"weight lifter tone 5","shortname":":lifter_tone5:","category":"activity","emoji_order":"1599","aliases":[":weight_lifter_tone5:"],"aliases_ascii":[],"keywords":[]},"bicyclist_tone1":{"unicode":"1f6b4-1f3fb","unicode_alternates":"","name":"bicyclist tone 1","shortname":":bicyclist_tone1:","category":"activity","emoji_order":"1600","aliases":[],"aliases_ascii":[],"keywords":[]},"bicyclist_tone2":{"unicode":"1f6b4-1f3fc","unicode_alternates":"","name":"bicyclist tone 2","shortname":":bicyclist_tone2:","category":"activity","emoji_order":"1601","aliases":[],"aliases_ascii":[],"keywords":[]},"bicyclist_tone3":{"unicode":"1f6b4-1f3fd","unicode_alternates":"","name":"bicyclist tone 3","shortname":":bicyclist_tone3:","category":"activity","emoji_order":"1602","aliases":[],"aliases_ascii":[],"keywords":[]},"bicyclist_tone4":{"unicode":"1f6b4-1f3fe","unicode_alternates":"","name":"bicyclist tone 4","shortname":":bicyclist_tone4:","category":"activity","emoji_order":"1603","aliases":[],"aliases_ascii":[],"keywords":[]},"bicyclist_tone5":{"unicode":"1f6b4-1f3ff","unicode_alternates":"","name":"bicyclist tone 5","shortname":":bicyclist_tone5:","category":"activity","emoji_order":"1604","aliases":[],"aliases_ascii":[],"keywords":[]},"mountain_bicyclist_tone1":{"unicode":"1f6b5-1f3fb","unicode_alternates":"","name":"mountain bicyclist tone 1","shortname":":mountain_bicyclist_tone1:","category":"activity","emoji_order":"1605","aliases":[],"aliases_ascii":[],"keywords":[]},"mountain_bicyclist_tone2":{"unicode":"1f6b5-1f3fc","unicode_alternates":"","name":"mountain bicyclist tone 2","shortname":":mountain_bicyclist_tone2:","category":"activity","emoji_order":"1606","aliases":[],"aliases_ascii":[],"keywords":[]},"mountain_bicyclist_tone3":{"unicode":"1f6b5-1f3fd","unicode_alternates":"","name":"mountain bicyclist tone 3","shortname":":mountain_bicyclist_tone3:","category":"activity","emoji_order":"1607","aliases":[],"aliases_ascii":[],"keywords":[]},"mountain_bicyclist_tone4":{"unicode":"1f6b5-1f3fe","unicode_alternates":"","name":"mountain bicyclist tone 4","shortname":":mountain_bicyclist_tone4:","category":"activity","emoji_order":"1608","aliases":[],"aliases_ascii":[],"keywords":[]},"mountain_bicyclist_tone5":{"unicode":"1f6b5-1f3ff","unicode_alternates":"","name":"mountain bicyclist tone 5","shortname":":mountain_bicyclist_tone5:","category":"activity","emoji_order":"1609","aliases":[],"aliases_ascii":[],"keywords":[]},"horse_racing_tone1":{"unicode":"1f3c7-1f3fb","unicode_alternates":"","name":"horse racing tone 1","shortname":":horse_racing_tone1:","category":"activity","emoji_order":"1610","aliases":[],"aliases_ascii":[],"keywords":[]},"horse_racing_tone2":{"unicode":"1f3c7-1f3fc","unicode_alternates":"","name":"horse racing tone 2","shortname":":horse_racing_tone2:","category":"activity","emoji_order":"1611","aliases":[],"aliases_ascii":[],"keywords":[]},"horse_racing_tone3":{"unicode":"1f3c7-1f3fd","unicode_alternates":"","name":"horse racing tone 3","shortname":":horse_racing_tone3:","category":"activity","emoji_order":"1612","aliases":[],"aliases_ascii":[],"keywords":[]},"horse_racing_tone4":{"unicode":"1f3c7-1f3fe","unicode_alternates":"","name":"horse racing tone 4","shortname":":horse_racing_tone4:","category":"activity","emoji_order":"1613","aliases":[],"aliases_ascii":[],"keywords":[]},"horse_racing_tone5":{"unicode":"1f3c7-1f3ff","unicode_alternates":"","name":"horse racing tone 5","shortname":":horse_racing_tone5:","category":"activity","emoji_order":"1614","aliases":[],"aliases_ascii":[],"keywords":[]},"spy_tone1":{"unicode":"1f575-1f3fb","unicode_alternates":"","name":"sleuth or spy tone 1","shortname":":spy_tone1:","category":"people","emoji_order":"1615","aliases":[":sleuth_or_spy_tone1:"],"aliases_ascii":[],"keywords":[]},"spy_tone2":{"unicode":"1f575-1f3fc","unicode_alternates":"","name":"sleuth or spy tone 2","shortname":":spy_tone2:","category":"people","emoji_order":"1616","aliases":[":sleuth_or_spy_tone2:"],"aliases_ascii":[],"keywords":[]},"spy_tone3":{"unicode":"1f575-1f3fd","unicode_alternates":"","name":"sleuth or spy tone 3","shortname":":spy_tone3:","category":"people","emoji_order":"1617","aliases":[":sleuth_or_spy_tone3:"],"aliases_ascii":[],"keywords":[]},"spy_tone4":{"unicode":"1f575-1f3fe","unicode_alternates":"","name":"sleuth or spy tone 4","shortname":":spy_tone4:","category":"people","emoji_order":"1618","aliases":[":sleuth_or_spy_tone4:"],"aliases_ascii":[],"keywords":[]},"spy_tone5":{"unicode":"1f575-1f3ff","unicode_alternates":"","name":"sleuth or spy tone 5","shortname":":spy_tone5:","category":"people","emoji_order":"1619","aliases":[":sleuth_or_spy_tone5:"],"aliases_ascii":[],"keywords":[]},"tone1":{"unicode":"1f3fb","unicode_alternates":"","name":"emoji modifier Fitzpatrick type-1-2","shortname":":tone1:","category":"modifier","emoji_order":"1620","aliases":[],"aliases_ascii":[],"keywords":[]},"tone2":{"unicode":"1f3fc","unicode_alternates":"","name":"emoji modifier Fitzpatrick type-3","shortname":":tone2:","category":"modifier","emoji_order":"1621","aliases":[],"aliases_ascii":[],"keywords":[]},"tone3":{"unicode":"1f3fd","unicode_alternates":"","name":"emoji modifier Fitzpatrick type-4","shortname":":tone3:","category":"modifier","emoji_order":"1622","aliases":[],"aliases_ascii":[],"keywords":[]},"tone4":{"unicode":"1f3fe","unicode_alternates":"","name":"emoji modifier Fitzpatrick type-5","shortname":":tone4:","category":"modifier","emoji_order":"1623","aliases":[],"aliases_ascii":[],"keywords":[]},"tone5":{"unicode":"1f3ff","unicode_alternates":"","name":"emoji modifier Fitzpatrick type-6","shortname":":tone5:","category":"modifier","emoji_order":"1624","aliases":[],"aliases_ascii":[],"keywords":[]},"prince_tone1":{"unicode":"1f934-1f3fb","unicode_alternates":"","name":"prince tone 1","shortname":":prince_tone1:","category":"people","emoji_order":"10000","aliases":[],"aliases_ascii":[],"keywords":[]},"prince_tone2":{"unicode":"1f934-1f3fc","unicode_alternates":"","name":"prince tone 2","shortname":":prince_tone2:","category":"people","emoji_order":"10001","aliases":[],"aliases_ascii":[],"keywords":[]},"prince_tone3":{"unicode":"1f934-1f3fd","unicode_alternates":"","name":"prince tone 3","shortname":":prince_tone3:","category":"people","emoji_order":"10002","aliases":[],"aliases_ascii":[],"keywords":[]},"prince_tone4":{"unicode":"1f934-1f3fe","unicode_alternates":"","name":"prince tone 4","shortname":":prince_tone4:","category":"people","emoji_order":"10003","aliases":[],"aliases_ascii":[],"keywords":[]},"prince_tone5":{"unicode":"1f934-1f3ff","unicode_alternates":"","name":"prince tone 5","shortname":":prince_tone5:","category":"people","emoji_order":"10004","aliases":[],"aliases_ascii":[],"keywords":[]},"mrs_claus_tone1":{"unicode":"1f936-1f3fb","unicode_alternates":"","name":"mother christmas tone 1","shortname":":mrs_claus_tone1:","category":"people","emoji_order":"10005","aliases":[":mother_christmas_tone1:"],"aliases_ascii":[],"keywords":[]},"mrs_claus_tone2":{"unicode":"1f936-1f3fc","unicode_alternates":"","name":"mother christmas tone 2","shortname":":mrs_claus_tone2:","category":"people","emoji_order":"10006","aliases":[":mother_christmas_tone2:"],"aliases_ascii":[],"keywords":[]},"mrs_claus_tone3":{"unicode":"1f936-1f3fd","unicode_alternates":"","name":"mother christmas tone 3","shortname":":mrs_claus_tone3:","category":"people","emoji_order":"10007","aliases":[":mother_christmas_tone3:"],"aliases_ascii":[],"keywords":[]},"mrs_claus_tone4":{"unicode":"1f936-1f3fe","unicode_alternates":"","name":"mother christmas tone 4","shortname":":mrs_claus_tone4:","category":"people","emoji_order":"10008","aliases":[":mother_christmas_tone4:"],"aliases_ascii":[],"keywords":[]},"mrs_claus_tone5":{"unicode":"1f936-1f3ff","unicode_alternates":"","name":"mother christmas tone 5","shortname":":mrs_claus_tone5:","category":"people","emoji_order":"10009","aliases":[":mother_christmas_tone5:"],"aliases_ascii":[],"keywords":[]},"man_in_tuxedo_tone1":{"unicode":"1f935-1f3fb","unicode_alternates":"","name":"man in tuxedo tone 1","shortname":":man_in_tuxedo_tone1:","category":"people","emoji_order":"10010","aliases":[":tuxedo_tone1:"],"aliases_ascii":[],"keywords":[]},"man_in_tuxedo_tone2":{"unicode":"1f935-1f3fc","unicode_alternates":"","name":"man in tuxedo tone 2","shortname":":man_in_tuxedo_tone2:","category":"people","emoji_order":"10011","aliases":[":tuxedo_tone2:"],"aliases_ascii":[],"keywords":[]},"man_in_tuxedo_tone3":{"unicode":"1f935-1f3fd","unicode_alternates":"","name":"man in tuxedo tone 3","shortname":":man_in_tuxedo_tone3:","category":"people","emoji_order":"10012","aliases":[":tuxedo_tone3:"],"aliases_ascii":[],"keywords":[]},"man_in_tuxedo_tone4":{"unicode":"1f935-1f3fe","unicode_alternates":"","name":"man in tuxedo tone 4","shortname":":man_in_tuxedo_tone4:","category":"people","emoji_order":"10013","aliases":[":tuxedo_tone4:"],"aliases_ascii":[],"keywords":[]},"man_in_tuxedo_tone5":{"unicode":"1f935-1f3ff","unicode_alternates":"","name":"man in tuxedo tone 5","shortname":":man_in_tuxedo_tone5:","category":"people","emoji_order":"10014","aliases":[":tuxedo_tone5:"],"aliases_ascii":[],"keywords":[]},"shrug_tone1":{"unicode":"1f937-1f3fb","unicode_alternates":"","name":"shrug tone 1","shortname":":shrug_tone1:","category":"people","emoji_order":"10015","aliases":[],"aliases_ascii":[],"keywords":[]},"shrug_tone2":{"unicode":"1f937-1f3fc","unicode_alternates":"","name":"shrug tone 2","shortname":":shrug_tone2:","category":"people","emoji_order":"10016","aliases":[],"aliases_ascii":[],"keywords":[]},"shrug_tone3":{"unicode":"1f937-1f3fd","unicode_alternates":"","name":"shrug tone 3","shortname":":shrug_tone3:","category":"people","emoji_order":"10017","aliases":[],"aliases_ascii":[],"keywords":[]},"shrug_tone4":{"unicode":"1f937-1f3fe","unicode_alternates":"","name":"shrug tone 4","shortname":":shrug_tone4:","category":"people","emoji_order":"10018","aliases":[],"aliases_ascii":[],"keywords":[]},"shrug_tone5":{"unicode":"1f937-1f3ff","unicode_alternates":"","name":"shrug tone 5","shortname":":shrug_tone5:","category":"people","emoji_order":"10019","aliases":[],"aliases_ascii":[],"keywords":[]},"face_palm_tone1":{"unicode":"1f926-1f3fb","unicode_alternates":"","name":"face palm tone 1","shortname":":face_palm_tone1:","category":"people","emoji_order":"10020","aliases":[":facepalm_tone1:"],"aliases_ascii":[],"keywords":[]},"face_palm_tone2":{"unicode":"1f926-1f3fc","unicode_alternates":"","name":"face palm tone 2","shortname":":face_palm_tone2:","category":"people","emoji_order":"10021","aliases":[":facepalm_tone2:"],"aliases_ascii":[],"keywords":[]},"face_palm_tone3":{"unicode":"1f926-1f3fd","unicode_alternates":"","name":"face palm tone 3","shortname":":face_palm_tone3:","category":"people","emoji_order":"10022","aliases":[":facepalm_tone3:"],"aliases_ascii":[],"keywords":[]},"face_palm_tone4":{"unicode":"1f926-1f3fe","unicode_alternates":"","name":"face palm tone 4","shortname":":face_palm_tone4:","category":"people","emoji_order":"10023","aliases":[":facepalm_tone4:"],"aliases_ascii":[],"keywords":[]},"face_palm_tone5":{"unicode":"1f926-1f3ff","unicode_alternates":"","name":"face palm tone 5","shortname":":face_palm_tone5:","category":"people","emoji_order":"10024","aliases":[":facepalm_tone5:"],"aliases_ascii":[],"keywords":[]},"pregnant_woman_tone1":{"unicode":"1f930-1f3fb","unicode_alternates":"","name":"pregnant woman tone 1","shortname":":pregnant_woman_tone1:","category":"people","emoji_order":"10025","aliases":[":expecting_woman_tone1:"],"aliases_ascii":[],"keywords":[]},"pregnant_woman_tone2":{"unicode":"1f930-1f3fc","unicode_alternates":"","name":"pregnant woman tone 2","shortname":":pregnant_woman_tone2:","category":"people","emoji_order":"10026","aliases":[":expecting_woman_tone2:"],"aliases_ascii":[],"keywords":[]},"pregnant_woman_tone3":{"unicode":"1f930-1f3fd","unicode_alternates":"","name":"pregnant woman tone 3","shortname":":pregnant_woman_tone3:","category":"people","emoji_order":"10027","aliases":[":expecting_woman_tone3:"],"aliases_ascii":[],"keywords":[]},"pregnant_woman_tone4":{"unicode":"1f930-1f3fe","unicode_alternates":"","name":"pregnant woman tone 4","shortname":":pregnant_woman_tone4:","category":"people","emoji_order":"10028","aliases":[":expecting_woman_tone4:"],"aliases_ascii":[],"keywords":[]},"pregnant_woman_tone5":{"unicode":"1f930-1f3ff","unicode_alternates":"","name":"pregnant woman tone 5","shortname":":pregnant_woman_tone5:","category":"people","emoji_order":"10029","aliases":[":expecting_woman_tone5:"],"aliases_ascii":[],"keywords":[]},"man_dancing_tone1":{"unicode":"1f57a-1f3fb","unicode_alternates":"","name":"man dancing tone 1","shortname":":man_dancing_tone1:","category":"activity","emoji_order":"10030","aliases":[":male_dancer_tone1:"],"aliases_ascii":[],"keywords":[]},"man_dancing_tone2":{"unicode":"1f57a-1f3fc","unicode_alternates":"","name":"man dancing tone 2","shortname":":man_dancing_tone2:","category":"activity","emoji_order":"10031","aliases":[":male_dancer_tone2:"],"aliases_ascii":[],"keywords":[]},"man_dancing_tone3":{"unicode":"1f57a-1f3fd","unicode_alternates":"","name":"man dancing tone 3","shortname":":man_dancing_tone3:","category":"activity","emoji_order":"10032","aliases":[":male_dancer_tone3:"],"aliases_ascii":[],"keywords":[]},"man_dancing_tone4":{"unicode":"1f57a-1f3fe","unicode_alternates":"","name":"man dancing tone 4","shortname":":man_dancing_tone4:","category":"activity","emoji_order":"10033","aliases":[":male_dancer_tone4:"],"aliases_ascii":[],"keywords":[]},"man_dancing_tone5":{"unicode":"1f57a-1f3ff","unicode_alternates":"","name":"man dancing tone 5","shortname":":man_dancing_tone5:","category":"activity","emoji_order":"10034","aliases":[":male_dancer_tone5:"],"aliases_ascii":[],"keywords":[]},"selfie_tone1":{"unicode":"1f933-1f3fb","unicode_alternates":"","name":"selfie tone 1","shortname":":selfie_tone1:","category":"people","emoji_order":"10035","aliases":[],"aliases_ascii":[],"keywords":[]},"selfie_tone2":{"unicode":"1f933-1f3fc","unicode_alternates":"","name":"selfie tone 2","shortname":":selfie_tone2:","category":"people","emoji_order":"10036","aliases":[],"aliases_ascii":[],"keywords":[]},"selfie_tone3":{"unicode":"1f933-1f3fd","unicode_alternates":"","name":"selfie tone 3","shortname":":selfie_tone3:","category":"people","emoji_order":"10037","aliases":[],"aliases_ascii":[],"keywords":[]},"selfie_tone4":{"unicode":"1f933-1f3fe","unicode_alternates":"","name":"selfie tone 4","shortname":":selfie_tone4:","category":"people","emoji_order":"10038","aliases":[],"aliases_ascii":[],"keywords":[]},"selfie_tone5":{"unicode":"1f933-1f3ff","unicode_alternates":"","name":"selfie tone 5","shortname":":selfie_tone5:","category":"people","emoji_order":"10039","aliases":[],"aliases_ascii":[],"keywords":[]},"fingers_crossed_tone1":{"unicode":"1f91e-1f3fb","unicode_alternates":"","name":"hand with index and middle fingers crossed tone 1","shortname":":fingers_crossed_tone1:","category":"people","emoji_order":"10040","aliases":[":hand_with_index_and_middle_fingers_crossed_tone1:"],"aliases_ascii":[],"keywords":[]},"fingers_crossed_tone2":{"unicode":"1f91e-1f3fc","unicode_alternates":"","name":"hand with index and middle fingers crossed tone 2","shortname":":fingers_crossed_tone2:","category":"people","emoji_order":"10041","aliases":[":hand_with_index_and_middle_fingers_crossed_tone2:"],"aliases_ascii":[],"keywords":[]},"fingers_crossed_tone3":{"unicode":"1f91e-1f3fd","unicode_alternates":"","name":"hand with index and middle fingers crossed tone 3","shortname":":fingers_crossed_tone3:","category":"people","emoji_order":"10042","aliases":[":hand_with_index_and_middle_fingers_crossed_tone3:"],"aliases_ascii":[],"keywords":[]},"fingers_crossed_tone4":{"unicode":"1f91e-1f3fe","unicode_alternates":"","name":"hand with index and middle fingers crossed tone 4","shortname":":fingers_crossed_tone4:","category":"people","emoji_order":"10043","aliases":[":hand_with_index_and_middle_fingers_crossed_tone4:"],"aliases_ascii":[],"keywords":[]},"fingers_crossed_tone5":{"unicode":"1f91e-1f3ff","unicode_alternates":"","name":"hand with index and middle fingers crossed tone 5","shortname":":fingers_crossed_tone5:","category":"people","emoji_order":"10044","aliases":[":hand_with_index_and_middle_fingers_crossed_tone5:"],"aliases_ascii":[],"keywords":[]},"call_me_tone1":{"unicode":"1f919-1f3fb","unicode_alternates":"","name":"call me hand tone 1","shortname":":call_me_tone1:","category":"people","emoji_order":"10045","aliases":[":call_me_hand_tone1:"],"aliases_ascii":[],"keywords":[]},"call_me_tone2":{"unicode":"1f919-1f3fc","unicode_alternates":"","name":"call me hand tone 2","shortname":":call_me_tone2:","category":"people","emoji_order":"10046","aliases":[":call_me_hand_tone2:"],"aliases_ascii":[],"keywords":[]},"call_me_tone3":{"unicode":"1f919-1f3fd","unicode_alternates":"","name":"call me hand tone 3","shortname":":call_me_tone3:","category":"people","emoji_order":"10047","aliases":[":call_me_hand_tone3:"],"aliases_ascii":[],"keywords":[]},"call_me_tone4":{"unicode":"1f919-1f3fe","unicode_alternates":"","name":"call me hand tone 4","shortname":":call_me_tone4:","category":"people","emoji_order":"10048","aliases":[":call_me_hand_tone4:"],"aliases_ascii":[],"keywords":[]},"call_me_tone5":{"unicode":"1f919-1f3ff","unicode_alternates":"","name":"call me hand tone 5","shortname":":call_me_tone5:","category":"people","emoji_order":"10049","aliases":[":call_me_hand_tone5:"],"aliases_ascii":[],"keywords":[]},"left_facing_fist_tone1":{"unicode":"1f91b-1f3fb","unicode_alternates":"","name":"left facing fist tone 1","shortname":":left_facing_fist_tone1:","category":"people","emoji_order":"10050","aliases":[":left_fist_tone1:"],"aliases_ascii":[],"keywords":[]},"left_facing_fist_tone2":{"unicode":"1f91b-1f3fc","unicode_alternates":"","name":"left facing fist tone 2","shortname":":left_facing_fist_tone2:","category":"people","emoji_order":"10051","aliases":[":left_fist_tone2:"],"aliases_ascii":[],"keywords":[]},"left_facing_fist_tone3":{"unicode":"1f91b-1f3fd","unicode_alternates":"","name":"left facing fist tone 3","shortname":":left_facing_fist_tone3:","category":"people","emoji_order":"10052","aliases":[":left_fist_tone3:"],"aliases_ascii":[],"keywords":[]},"left_facing_fist_tone4":{"unicode":"1f91b-1f3fe","unicode_alternates":"","name":"left facing fist tone 4","shortname":":left_facing_fist_tone4:","category":"people","emoji_order":"10053","aliases":[":left_fist_tone4:"],"aliases_ascii":[],"keywords":[]},"left_facing_fist_tone5":{"unicode":"1f91b-1f3ff","unicode_alternates":"","name":"left facing fist tone 5","shortname":":left_facing_fist_tone5:","category":"people","emoji_order":"10054","aliases":[":left_fist_tone5:"],"aliases_ascii":[],"keywords":[]},"right_facing_fist_tone1":{"unicode":"1f91c-1f3fb","unicode_alternates":"","name":"right facing fist tone 1","shortname":":right_facing_fist_tone1:","category":"people","emoji_order":"10055","aliases":[":right_fist_tone1:"],"aliases_ascii":[],"keywords":[]},"right_facing_fist_tone2":{"unicode":"1f91c-1f3fc","unicode_alternates":"","name":"right facing fist tone 2","shortname":":right_facing_fist_tone2:","category":"people","emoji_order":"10056","aliases":[":right_fist_tone2:"],"aliases_ascii":[],"keywords":[]},"right_facing_fist_tone3":{"unicode":"1f91c-1f3fd","unicode_alternates":"","name":"right facing fist tone 3","shortname":":right_facing_fist_tone3:","category":"people","emoji_order":"10057","aliases":[":right_fist_tone3:"],"aliases_ascii":[],"keywords":[]},"right_facing_fist_tone4":{"unicode":"1f91c-1f3fe","unicode_alternates":"","name":"right facing fist tone 4","shortname":":right_facing_fist_tone4:","category":"people","emoji_order":"10058","aliases":[":right_fist_tone4:"],"aliases_ascii":[],"keywords":[]},"right_facing_fist_tone5":{"unicode":"1f91c-1f3ff","unicode_alternates":"","name":"right facing fist tone 5","shortname":":right_facing_fist_tone5:","category":"people","emoji_order":"10059","aliases":[":right_fist_tone5:"],"aliases_ascii":[],"keywords":[]},"raised_back_of_hand_tone1":{"unicode":"1f91a-1f3fb","unicode_alternates":"","name":"raised back of hand tone 1","shortname":":raised_back_of_hand_tone1:","category":"people","emoji_order":"10060","aliases":[":back_of_hand_tone1:"],"aliases_ascii":[],"keywords":[]},"raised_back_of_hand_tone2":{"unicode":"1f91a-1f3fc","unicode_alternates":"","name":"raised back of hand tone 2","shortname":":raised_back_of_hand_tone2:","category":"people","emoji_order":"10061","aliases":[":back_of_hand_tone2:"],"aliases_ascii":[],"keywords":[]},"raised_back_of_hand_tone3":{"unicode":"1f91a-1f3fd","unicode_alternates":"","name":"raised back of hand tone 3","shortname":":raised_back_of_hand_tone3:","category":"people","emoji_order":"10062","aliases":[":back_of_hand_tone3:"],"aliases_ascii":[],"keywords":[]},"raised_back_of_hand_tone4":{"unicode":"1f91a-1f3fe","unicode_alternates":"","name":"raised back of hand tone 4","shortname":":raised_back_of_hand_tone4:","category":"people","emoji_order":"10063","aliases":[":back_of_hand_tone4:"],"aliases_ascii":[],"keywords":[]},"raised_back_of_hand_tone5":{"unicode":"1f91a-1f3ff","unicode_alternates":"","name":"raised back of hand tone 5","shortname":":raised_back_of_hand_tone5:","category":"people","emoji_order":"10064","aliases":[":back_of_hand_tone5:"],"aliases_ascii":[],"keywords":[]},"handshake_tone1":{"unicode":"1f91d-1f3fb","unicode_alternates":"","name":"handshake tone 1","shortname":":handshake_tone1:","category":"people","emoji_order":"10065","aliases":[":shaking_hands_tone1:"],"aliases_ascii":[],"keywords":[]},"handshake_tone2":{"unicode":"1f91d-1f3fc","unicode_alternates":"","name":"handshake tone 2","shortname":":handshake_tone2:","category":"people","emoji_order":"10066","aliases":[":shaking_hands_tone2:"],"aliases_ascii":[],"keywords":[]},"handshake_tone3":{"unicode":"1f91d-1f3fd","unicode_alternates":"","name":"handshake tone 3","shortname":":handshake_tone3:","category":"people","emoji_order":"10067","aliases":[":shaking_hands_tone3:"],"aliases_ascii":[],"keywords":[]},"handshake_tone4":{"unicode":"1f91d-1f3fe","unicode_alternates":"","name":"handshake tone 4","shortname":":handshake_tone4:","category":"people","emoji_order":"10068","aliases":[":shaking_hands_tone4:"],"aliases_ascii":[],"keywords":[]},"handshake_tone5":{"unicode":"1f91d-1f3ff","unicode_alternates":"","name":"handshake tone 5","shortname":":handshake_tone5:","category":"people","emoji_order":"10069","aliases":[":shaking_hands_tone5:"],"aliases_ascii":[],"keywords":[]},"cartwheel_tone1":{"unicode":"1f938-1f3fb","unicode_alternates":"","name":"person doing cartwheel tone 1","shortname":":cartwheel_tone1:","category":"activity","emoji_order":"10070","aliases":[":person_doing_cartwheel_tone1:"],"aliases_ascii":[],"keywords":[]},"cartwheel_tone2":{"unicode":"1f938-1f3fc","unicode_alternates":"","name":"person doing cartwheel tone 2","shortname":":cartwheel_tone2:","category":"activity","emoji_order":"10071","aliases":[":person_doing_cartwheel_tone2:"],"aliases_ascii":[],"keywords":[]},"cartwheel_tone3":{"unicode":"1f938-1f3fd","unicode_alternates":"","name":"person doing cartwheel tone 3","shortname":":cartwheel_tone3:","category":"activity","emoji_order":"10072","aliases":[":person_doing_cartwheel_tone3:"],"aliases_ascii":[],"keywords":[]},"cartwheel_tone4":{"unicode":"1f938-1f3fe","unicode_alternates":"","name":"person doing cartwheel tone 4","shortname":":cartwheel_tone4:","category":"activity","emoji_order":"10073","aliases":[":person_doing_cartwheel_tone4:"],"aliases_ascii":[],"keywords":[]},"cartwheel_tone5":{"unicode":"1f938-1f3ff","unicode_alternates":"","name":"person doing cartwheel tone 5","shortname":":cartwheel_tone5:","category":"activity","emoji_order":"10074","aliases":[":person_doing_cartwheel_tone5:"],"aliases_ascii":[],"keywords":[]},"wrestlers_tone1":{"unicode":"1f93c-1f3fb","unicode_alternates":"","name":"wrestlers tone 1","shortname":":wrestlers_tone1:","category":"activity","emoji_order":"10080","aliases":[":wrestling_tone1:"],"aliases_ascii":[],"keywords":[]},"wrestlers_tone2":{"unicode":"1f93c-1f3fc","unicode_alternates":"","name":"wrestlers tone 2","shortname":":wrestlers_tone2:","category":"activity","emoji_order":"10081","aliases":[":wrestling_tone2:"],"aliases_ascii":[],"keywords":[]},"wrestlers_tone3":{"unicode":"1f93c-1f3fd","unicode_alternates":"","name":"wrestlers tone 3","shortname":":wrestlers_tone3:","category":"activity","emoji_order":"10082","aliases":[":wrestling_tone3:"],"aliases_ascii":[],"keywords":[]},"wrestlers_tone4":{"unicode":"1f93c-1f3fe","unicode_alternates":"","name":"wrestlers tone 4","shortname":":wrestlers_tone4:","category":"activity","emoji_order":"10083","aliases":[":wrestling_tone4:"],"aliases_ascii":[],"keywords":[]},"wrestlers_tone5":{"unicode":"1f93c-1f3ff","unicode_alternates":"","name":"wrestlers tone 5","shortname":":wrestlers_tone5:","category":"activity","emoji_order":"10084","aliases":[":wrestling_tone5:"],"aliases_ascii":[],"keywords":[]},"water_polo_tone1":{"unicode":"1f93d-1f3fb","unicode_alternates":"","name":"water polo tone 1","shortname":":water_polo_tone1:","category":"activity","emoji_order":"10085","aliases":[],"aliases_ascii":[],"keywords":[]},"water_polo_tone2":{"unicode":"1f93d-1f3fc","unicode_alternates":"","name":"water polo tone 2","shortname":":water_polo_tone2:","category":"activity","emoji_order":"10086","aliases":[],"aliases_ascii":[],"keywords":[]},"water_polo_tone3":{"unicode":"1f93d-1f3fd","unicode_alternates":"","name":"water polo tone 3","shortname":":water_polo_tone3:","category":"activity","emoji_order":"10087","aliases":[],"aliases_ascii":[],"keywords":[]},"water_polo_tone4":{"unicode":"1f93d-1f3fe","unicode_alternates":"","name":"water polo tone 4","shortname":":water_polo_tone4:","category":"activity","emoji_order":"10088","aliases":[],"aliases_ascii":[],"keywords":[]},"water_polo_tone5":{"unicode":"1f93d-1f3ff","unicode_alternates":"","name":"water polo tone 5","shortname":":water_polo_tone5:","category":"activity","emoji_order":"10089","aliases":[],"aliases_ascii":[],"keywords":[]},"handball_tone1":{"unicode":"1f93e-1f3fb","unicode_alternates":"","name":"handball tone 1","shortname":":handball_tone1:","category":"activity","emoji_order":"10090","aliases":[],"aliases_ascii":[],"keywords":[]},"handball_tone2":{"unicode":"1f93e-1f3fc","unicode_alternates":"","name":"handball tone 2","shortname":":handball_tone2:","category":"activity","emoji_order":"10091","aliases":[],"aliases_ascii":[],"keywords":[]},"handball_tone3":{"unicode":"1f93e-1f3fd","unicode_alternates":"","name":"handball tone 3","shortname":":handball_tone3:","category":"activity","emoji_order":"10092","aliases":[],"aliases_ascii":[],"keywords":[]},"handball_tone4":{"unicode":"1f93e-1f3fe","unicode_alternates":"","name":"handball tone 4","shortname":":handball_tone4:","category":"activity","emoji_order":"10093","aliases":[],"aliases_ascii":[],"keywords":[]},"handball_tone5":{"unicode":"1f93e-1f3ff","unicode_alternates":"","name":"handball tone 5","shortname":":handball_tone5:","category":"activity","emoji_order":"10094","aliases":[],"aliases_ascii":[],"keywords":[]},"juggling_tone1":{"unicode":"1f939-1f3fb","unicode_alternates":"","name":"juggling tone 1","shortname":":juggling_tone1:","category":"activity","emoji_order":"10095","aliases":[":juggler_tone1:"],"aliases_ascii":[],"keywords":[]},"juggling_tone2":{"unicode":"1f939-1f3fc","unicode_alternates":"","name":"juggling tone 2","shortname":":juggling_tone2:","category":"activity","emoji_order":"10096","aliases":[":juggler_tone2:"],"aliases_ascii":[],"keywords":[]},"juggling_tone3":{"unicode":"1f939-1f3fd","unicode_alternates":"","name":"juggling tone 3","shortname":":juggling_tone3:","category":"activity","emoji_order":"10097","aliases":[":juggler_tone3:"],"aliases_ascii":[],"keywords":[]},"juggling_tone4":{"unicode":"1f939-1f3fe","unicode_alternates":"","name":"juggling tone 4","shortname":":juggling_tone4:","category":"activity","emoji_order":"10098","aliases":[":juggler_tone4:"],"aliases_ascii":[],"keywords":[]},"juggling_tone5":{"unicode":"1f939-1f3ff","unicode_alternates":"","name":"juggling tone 5","shortname":":juggling_tone5:","category":"activity","emoji_order":"10099","aliases":[":juggler_tone5:"],"aliases_ascii":[],"keywords":[]},"speech_left":{"unicode":"1f5e8","unicode_alternates":"1f5e8-fe0f","name":"left speech bubble","shortname":":speech_left:","category":"symbols","emoji_order":"10100","aliases":[":left_speech_bubble:"],"aliases_ascii":[],"keywords":[]},"eject":{"unicode":"23cf","unicode_alternates":"23cf-fe0f","name":"eject symbol","shortname":":eject:","category":"symbols","emoji_order":"10101","aliases":[":eject_symbol:"],"aliases_ascii":[],"keywords":[]},"gay_pride_flag":{"unicode":"1f3f3-1f308","unicode_alternates":"","name":"gay_pride_flag","shortname":":gay_pride_flag:","category":"extras","emoji_order":"10102","aliases":[":rainbow_flag:"],"aliases_ascii":[],"keywords":[]},"cowboy":{"unicode":"1f920","unicode_alternates":"","name":"face with cowboy hat","shortname":":cowboy:","category":"people","emoji_order":"10103","aliases":[":face_with_cowboy_hat:"],"aliases_ascii":[],"keywords":[]},"clown":{"unicode":"1f921","unicode_alternates":"","name":"clown face","shortname":":clown:","category":"people","emoji_order":"10104","aliases":[":clown_face:"],"aliases_ascii":[],"keywords":[]},"nauseated_face":{"unicode":"1f922","unicode_alternates":"","name":"nauseated face","shortname":":nauseated_face:","category":"people","emoji_order":"10105","aliases":[":sick:"],"aliases_ascii":[],"keywords":[]},"rofl":{"unicode":"1f923","unicode_alternates":"","name":"rolling on the floor laughing","shortname":":rofl:","category":"people","emoji_order":"10106","aliases":[":rolling_on_the_floor_laughing:"],"aliases_ascii":[],"keywords":[]},"drooling_face":{"unicode":"1f924","unicode_alternates":"","name":"drooling face","shortname":":drooling_face:","category":"people","emoji_order":"10107","aliases":[":drool:"],"aliases_ascii":[],"keywords":[]},"lying_face":{"unicode":"1f925","unicode_alternates":"","name":"lying face","shortname":":lying_face:","category":"people","emoji_order":"10108","aliases":[":liar:"],"aliases_ascii":[],"keywords":[]},"sneezing_face":{"unicode":"1f927","unicode_alternates":"","name":"sneezing face","shortname":":sneezing_face:","category":"people","emoji_order":"10109","aliases":[":sneeze:"],"aliases_ascii":[],"keywords":[]},"prince":{"unicode":"1f934","unicode_alternates":"","name":"prince","shortname":":prince:","category":"people","emoji_order":"10110","aliases":[],"aliases_ascii":[],"keywords":[]},"man_in_tuxedo":{"unicode":"1f935","unicode_alternates":"","name":"man in tuxedo","shortname":":man_in_tuxedo:","category":"people","emoji_order":"10111","aliases":[],"aliases_ascii":[],"keywords":[]},"mrs_claus":{"unicode":"1f936","unicode_alternates":"","name":"mother christmas","shortname":":mrs_claus:","category":"people","emoji_order":"10112","aliases":[":mother_christmas:"],"aliases_ascii":[],"keywords":[]},"face_palm":{"unicode":"1f926","unicode_alternates":"","name":"face palm","shortname":":face_palm:","category":"people","emoji_order":"10113","aliases":[":facepalm:"],"aliases_ascii":[],"keywords":[]},"shrug":{"unicode":"1f937","unicode_alternates":"","name":"shrug","shortname":":shrug:","category":"people","emoji_order":"10114","aliases":[],"aliases_ascii":[],"keywords":[]},"pregnant_woman":{"unicode":"1f930","unicode_alternates":"","name":"pregnant woman","shortname":":pregnant_woman:","category":"people","emoji_order":"10115","aliases":[":expecting_woman:"],"aliases_ascii":[],"keywords":[]},"selfie":{"unicode":"1f933","unicode_alternates":"","name":"selfie","shortname":":selfie:","category":"people","emoji_order":"10116","aliases":[],"aliases_ascii":[],"keywords":[]},"man_dancing":{"unicode":"1f57a","unicode_alternates":"","name":"man dancing","shortname":":man_dancing:","category":"people","emoji_order":"10117","aliases":[":male_dancer:"],"aliases_ascii":[],"keywords":[]},"call_me":{"unicode":"1f919","unicode_alternates":"","name":"call me hand","shortname":":call_me:","category":"people","emoji_order":"10118","aliases":[":call_me_hand:"],"aliases_ascii":[],"keywords":[]},"raised_back_of_hand":{"unicode":"1f91a","unicode_alternates":"","name":"raised back of hand","shortname":":raised_back_of_hand:","category":"people","emoji_order":"10119","aliases":[":back_of_hand:"],"aliases_ascii":[],"keywords":[]},"left_facing_fist":{"unicode":"1f91b","unicode_alternates":"","name":"left-facing fist","shortname":":left_facing_fist:","category":"people","emoji_order":"10120","aliases":[":left_fist:"],"aliases_ascii":[],"keywords":[]},"right_facing_fist":{"unicode":"1f91c","unicode_alternates":"","name":"right-facing fist","shortname":":right_facing_fist:","category":"people","emoji_order":"10121","aliases":[":right_fist:"],"aliases_ascii":[],"keywords":[]},"handshake":{"unicode":"1f91d","unicode_alternates":"","name":"handshake","shortname":":handshake:","category":"people","emoji_order":"10122","aliases":[":shaking_hands:"],"aliases_ascii":[],"keywords":[]},"fingers_crossed":{"unicode":"1f91e","unicode_alternates":"","name":"hand with first and index finger crossed","shortname":":fingers_crossed:","category":"people","emoji_order":"10123","aliases":[":hand_with_index_and_middle_finger_crossed:"],"aliases_ascii":[],"keywords":[]},"black_heart":{"unicode":"1f5a4","unicode_alternates":"","name":"black heart","shortname":":black_heart:","category":"symbols","emoji_order":"10124","aliases":[],"aliases_ascii":[],"keywords":[]},"eagle":{"unicode":"1f985","unicode_alternates":"","name":"eagle","shortname":":eagle:","category":"nature","emoji_order":"10125","aliases":[],"aliases_ascii":[],"keywords":[]},"duck":{"unicode":"1f986","unicode_alternates":"","name":"duck","shortname":":duck:","category":"nature","emoji_order":"10126","aliases":[],"aliases_ascii":[],"keywords":[]},"bat":{"unicode":"1f987","unicode_alternates":"","name":"bat","shortname":":bat:","category":"nature","emoji_order":"10127","aliases":[],"aliases_ascii":[],"keywords":[]},"shark":{"unicode":"1f988","unicode_alternates":"","name":"shark","shortname":":shark:","category":"nature","emoji_order":"10128","aliases":[],"aliases_ascii":[],"keywords":[]},"owl":{"unicode":"1f989","unicode_alternates":"","name":"owl","shortname":":owl:","category":"nature","emoji_order":"10129","aliases":[],"aliases_ascii":[],"keywords":[]},"fox":{"unicode":"1f98a","unicode_alternates":"","name":"fox face","shortname":":fox:","category":"nature","emoji_order":"10130","aliases":[":fox_face:"],"aliases_ascii":[],"keywords":[]},"butterfly":{"unicode":"1f98b","unicode_alternates":"","name":"butterfly","shortname":":butterfly:","category":"nature","emoji_order":"10131","aliases":[],"aliases_ascii":[],"keywords":[]},"deer":{"unicode":"1f98c","unicode_alternates":"","name":"deer","shortname":":deer:","category":"nature","emoji_order":"10132","aliases":[],"aliases_ascii":[],"keywords":[]},"gorilla":{"unicode":"1f98d","unicode_alternates":"","name":"gorilla","shortname":":gorilla:","category":"nature","emoji_order":"10133","aliases":[],"aliases_ascii":[],"keywords":[]},"lizard":{"unicode":"1f98e","unicode_alternates":"","name":"lizard","shortname":":lizard:","category":"nature","emoji_order":"10134","aliases":[],"aliases_ascii":[],"keywords":[]},"rhino":{"unicode":"1f98f","unicode_alternates":"","name":"rhinoceros","shortname":":rhino:","category":"nature","emoji_order":"10135","aliases":[":rhinoceros:"],"aliases_ascii":[],"keywords":[]},"wilted_rose":{"unicode":"1f940","unicode_alternates":"","name":"wilted flower","shortname":":wilted_rose:","category":"nature","emoji_order":"10136","aliases":[":wilted_flower:"],"aliases_ascii":[],"keywords":[]},"croissant":{"unicode":"1f950","unicode_alternates":"","name":"croissant","shortname":":croissant:","category":"food","emoji_order":"10137","aliases":[],"aliases_ascii":[],"keywords":[]},"avocado":{"unicode":"1f951","unicode_alternates":"","name":"avocado","shortname":":avocado:","category":"food","emoji_order":"10138","aliases":[],"aliases_ascii":[],"keywords":[]},"cucumber":{"unicode":"1f952","unicode_alternates":"","name":"cucumber","shortname":":cucumber:","category":"food","emoji_order":"10139","aliases":[],"aliases_ascii":[],"keywords":[]},"bacon":{"unicode":"1f953","unicode_alternates":"","name":"bacon","shortname":":bacon:","category":"food","emoji_order":"10140","aliases":[],"aliases_ascii":[],"keywords":["pig"]},"potato":{"unicode":"1f954","unicode_alternates":"","name":"potato","shortname":":potato:","category":"food","emoji_order":"10141","aliases":[],"aliases_ascii":[],"keywords":[]},"carrot":{"unicode":"1f955","unicode_alternates":"","name":"carrot","shortname":":carrot:","category":"food","emoji_order":"10142","aliases":[],"aliases_ascii":[],"keywords":[]},"french_bread":{"unicode":"1f956","unicode_alternates":"","name":"baguette bread","shortname":":french_bread:","category":"food","emoji_order":"10143","aliases":[":baguette_bread:"],"aliases_ascii":[],"keywords":[]},"salad":{"unicode":"1f957","unicode_alternates":"","name":"green salad","shortname":":salad:","category":"food","emoji_order":"10144","aliases":[":green_salad:"],"aliases_ascii":[],"keywords":[]},"shallow_pan_of_food":{"unicode":"1f958","unicode_alternates":"","name":"shallow pan of food","shortname":":shallow_pan_of_food:","category":"food","emoji_order":"10145","aliases":[":paella:"],"aliases_ascii":[],"keywords":["pan of food"]},"stuffed_flatbread":{"unicode":"1f959","unicode_alternates":"","name":"stuffed flatbread","shortname":":stuffed_flatbread:","category":"food","emoji_order":"10146","aliases":[":stuffed_pita:"],"aliases_ascii":[],"keywords":[]},"champagne_glass":{"unicode":"1f942","unicode_alternates":"","name":"clinking glasses","shortname":":champagne_glass:","category":"food","emoji_order":"10147","aliases":[":clinking_glass:"],"aliases_ascii":[],"keywords":[]},"tumbler_glass":{"unicode":"1f943","unicode_alternates":"","name":"tumbler glass","shortname":":tumbler_glass:","category":"food","emoji_order":"10148","aliases":[":whisky:"],"aliases_ascii":[],"keywords":["booze"]},"spoon":{"unicode":"1f944","unicode_alternates":"","name":"spoon","shortname":":spoon:","category":"food","emoji_order":"10149","aliases":[],"aliases_ascii":[],"keywords":[]},"octagonal_sign":{"unicode":"1f6d1","unicode_alternates":"","name":"octagonal sign","shortname":":octagonal_sign:","category":"symbols","emoji_order":"10150","aliases":[":stop_sign:"],"aliases_ascii":[],"keywords":[]},"shopping_cart":{"unicode":"1f6d2","unicode_alternates":"","name":"shopping trolley","shortname":":shopping_cart:","category":"objects","emoji_order":"10151","aliases":[":shopping_trolley:"],"aliases_ascii":[],"keywords":[]},"scooter":{"unicode":"1f6f4","unicode_alternates":"","name":"scooter","shortname":":scooter:","category":"travel","emoji_order":"10152","aliases":[],"aliases_ascii":[],"keywords":[]},"motor_scooter":{"unicode":"1f6f5","unicode_alternates":"","name":"motor scooter","shortname":":motor_scooter:","category":"travel","emoji_order":"10153","aliases":[":motorbike:"],"aliases_ascii":[],"keywords":["moped"]},"canoe":{"unicode":"1f6f6","unicode_alternates":"","name":"canoe","shortname":":canoe:","category":"travel","emoji_order":"10154","aliases":[":kayak:"],"aliases_ascii":[],"keywords":[]},"cartwheel":{"unicode":"1f938","unicode_alternates":"","name":"person doing cartwheel","shortname":":cartwheel:","category":"activity","emoji_order":"10155","aliases":[":person_doing_cartwheel:"],"aliases_ascii":[],"keywords":[]},"juggling":{"unicode":"1f939","unicode_alternates":"","name":"juggling","shortname":":juggling:","category":"activity","emoji_order":"10156","aliases":[":juggler:"],"aliases_ascii":[],"keywords":[]},"wrestlers":{"unicode":"1f93c","unicode_alternates":"","name":"wrestlers","shortname":":wrestlers:","category":"activity","emoji_order":"10157","aliases":[":wrestling:"],"aliases_ascii":[],"keywords":[]},"boxing_glove":{"unicode":"1f94a","unicode_alternates":"","name":"boxing glove","shortname":":boxing_glove:","category":"activity","emoji_order":"10158","aliases":[":boxing_gloves:"],"aliases_ascii":[],"keywords":[]},"martial_arts_uniform":{"unicode":"1f94b","unicode_alternates":"","name":"martial arts uniform","shortname":":martial_arts_uniform:","category":"activity","emoji_order":"10159","aliases":[":karate_uniform:"],"aliases_ascii":[],"keywords":[]},"water_polo":{"unicode":"1f93d","unicode_alternates":"","name":"water polo","shortname":":water_polo:","category":"activity","emoji_order":"10160","aliases":[],"aliases_ascii":[],"keywords":[]},"handball":{"unicode":"1f93e","unicode_alternates":"","name":"handball","shortname":":handball:","category":"activity","emoji_order":"10161","aliases":[],"aliases_ascii":[],"keywords":[]},"goal":{"unicode":"1f945","unicode_alternates":"","name":"goal net","shortname":":goal:","category":"activity","emoji_order":"10162","aliases":[":goal_net:"],"aliases_ascii":[],"keywords":[]},"fencer":{"unicode":"1f93a","unicode_alternates":"","name":"fencer","shortname":":fencer:","category":"activity","emoji_order":"10163","aliases":[":fencing:"],"aliases_ascii":[],"keywords":[]},"first_place":{"unicode":"1f947","unicode_alternates":"","name":"first place medal","shortname":":first_place:","category":"activity","emoji_order":"10164","aliases":[":first_place_medal:"],"aliases_ascii":[],"keywords":[]},"second_place":{"unicode":"1f948","unicode_alternates":"","name":"second place medal","shortname":":second_place:","category":"activity","emoji_order":"10165","aliases":[":second_place_medal:"],"aliases_ascii":[],"keywords":[]},"third_place":{"unicode":"1f949","unicode_alternates":"","name":"third place medal","shortname":":third_place:","category":"activity","emoji_order":"10166","aliases":[":third_place_medal:"],"aliases_ascii":[],"keywords":[]},"drum":{"unicode":"1f941","unicode_alternates":"","name":"drum with drumsticks","shortname":":drum:","category":"activity","emoji_order":"10167","aliases":[":drum_with_drumsticks:"],"aliases_ascii":[],"keywords":[]},"shrimp":{"unicode":"1f990","unicode_alternates":"","name":"shrimp","shortname":":shrimp:","category":"nature","emoji_order":"10168","aliases":[],"aliases_ascii":[],"keywords":[]},"squid":{"unicode":"1f991","unicode_alternates":"","name":"squid","shortname":":squid:","category":"nature","emoji_order":"10169","aliases":[],"aliases_ascii":[],"keywords":[]},"egg":{"unicode":"1f95a","unicode_alternates":"","name":"egg","shortname":":egg:","category":"food","emoji_order":"10170","aliases":[],"aliases_ascii":[],"keywords":[]},"milk":{"unicode":"1f95b","unicode_alternates":"","name":"glass of milk","shortname":":milk:","category":"food","emoji_order":"10171","aliases":[":glass_of_milk:"],"aliases_ascii":[],"keywords":[]},"peanuts":{"unicode":"1f95c","unicode_alternates":"","name":"peanuts","shortname":":peanuts:","category":"food","emoji_order":"10172","aliases":[":shelled_peanut:"],"aliases_ascii":[],"keywords":[]},"kiwi":{"unicode":"1f95d","unicode_alternates":"","name":"kiwifruit","shortname":":kiwi:","category":"food","emoji_order":"10173","aliases":[":kiwifruit:"],"aliases_ascii":[],"keywords":[]},"pancakes":{"unicode":"1f95e","unicode_alternates":"","name":"pancakes","shortname":":pancakes:","category":"food","emoji_order":"10174","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_z":{"unicode":"1f1ff","unicode_alternates":"","name":"regional indicator symbol letter z","shortname":":regional_indicator_z:","category":"regional","emoji_order":"10177","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_y":{"unicode":"1f1fe","unicode_alternates":"","name":"regional indicator symbol letter y","shortname":":regional_indicator_y:","category":"regional","emoji_order":"10178","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_x":{"unicode":"1f1fd","unicode_alternates":"","name":"regional indicator symbol letter x","shortname":":regional_indicator_x:","category":"regional","emoji_order":"10179","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_w":{"unicode":"1f1fc","unicode_alternates":"","name":"regional indicator symbol letter w","shortname":":regional_indicator_w:","category":"regional","emoji_order":"10180","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_v":{"unicode":"1f1fb","unicode_alternates":"","name":"regional indicator symbol letter v","shortname":":regional_indicator_v:","category":"regional","emoji_order":"10181","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_u":{"unicode":"1f1fa","unicode_alternates":"","name":"regional indicator symbol letter u","shortname":":regional_indicator_u:","category":"regional","emoji_order":"10182","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_t":{"unicode":"1f1f9","unicode_alternates":"","name":"regional indicator symbol letter t","shortname":":regional_indicator_t:","category":"regional","emoji_order":"10183","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_s":{"unicode":"1f1f8","unicode_alternates":"","name":"regional indicator symbol letter s","shortname":":regional_indicator_s:","category":"regional","emoji_order":"10184","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_r":{"unicode":"1f1f7","unicode_alternates":"","name":"regional indicator symbol letter r","shortname":":regional_indicator_r:","category":"regional","emoji_order":"10185","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_q":{"unicode":"1f1f6","unicode_alternates":"","name":"regional indicator symbol letter q","shortname":":regional_indicator_q:","category":"regional","emoji_order":"10186","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_p":{"unicode":"1f1f5","unicode_alternates":"","name":"regional indicator symbol letter p","shortname":":regional_indicator_p:","category":"regional","emoji_order":"10187","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_o":{"unicode":"1f1f4","unicode_alternates":"","name":"regional indicator symbol letter o","shortname":":regional_indicator_o:","category":"regional","emoji_order":"10188","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_n":{"unicode":"1f1f3","unicode_alternates":"","name":"regional indicator symbol letter n","shortname":":regional_indicator_n:","category":"regional","emoji_order":"10189","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_m":{"unicode":"1f1f2","unicode_alternates":"","name":"regional indicator symbol letter m","shortname":":regional_indicator_m:","category":"regional","emoji_order":"10190","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_l":{"unicode":"1f1f1","unicode_alternates":"","name":"regional indicator symbol letter l","shortname":":regional_indicator_l:","category":"regional","emoji_order":"10191","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_k":{"unicode":"1f1f0","unicode_alternates":"","name":"regional indicator symbol letter k","shortname":":regional_indicator_k:","category":"regional","emoji_order":"10192","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_j":{"unicode":"1f1ef","unicode_alternates":"","name":"regional indicator symbol letter j","shortname":":regional_indicator_j:","category":"regional","emoji_order":"10193","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_i":{"unicode":"1f1ee","unicode_alternates":"","name":"regional indicator symbol letter i","shortname":":regional_indicator_i:","category":"regional","emoji_order":"10194","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_h":{"unicode":"1f1ed","unicode_alternates":"","name":"regional indicator symbol letter h","shortname":":regional_indicator_h:","category":"regional","emoji_order":"10195","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_g":{"unicode":"1f1ec","unicode_alternates":"","name":"regional indicator symbol letter g","shortname":":regional_indicator_g:","category":"regional","emoji_order":"10196","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_f":{"unicode":"1f1eb","unicode_alternates":"","name":"regional indicator symbol letter f","shortname":":regional_indicator_f:","category":"regional","emoji_order":"10197","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_e":{"unicode":"1f1ea","unicode_alternates":"","name":"regional indicator symbol letter e","shortname":":regional_indicator_e:","category":"regional","emoji_order":"10198","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_d":{"unicode":"1f1e9","unicode_alternates":"","name":"regional indicator symbol letter d","shortname":":regional_indicator_d:","category":"regional","emoji_order":"10199","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_c":{"unicode":"1f1e8","unicode_alternates":"","name":"regional indicator symbol letter c","shortname":":regional_indicator_c:","category":"regional","emoji_order":"10200","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_b":{"unicode":"1f1e7","unicode_alternates":"","name":"regional indicator symbol letter b","shortname":":regional_indicator_b:","category":"regional","emoji_order":"10201","aliases":[],"aliases_ascii":[],"keywords":[]},"regional_indicator_a":{"unicode":"1f1e6","unicode_alternates":"","name":"regional indicator symbol letter a","shortname":":regional_indicator_a:","category":"regional","emoji_order":"10202","aliases":[],"aliases_ascii":[],"keywords":[]}}
},{}],6:[function(require,module,exports){
/* jshint maxerr: 10000 */
/* jslint unused: true */
/* jshint shadow: true */
/* jshint -W075 */
(function(ns){
    // this list must be ordered from largest length of the value array, index 0, to the shortest
    ns.emojioneList = {":kiss_ww:":{"unicode":["1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","1f469-2764-1f48b-1f469"],"isCanonical": true},":couplekiss_ww:":{"unicode":["1f469-200d-2764-fe0f-200d-1f48b-200d-1f469","1f469-2764-1f48b-1f469"],"isCanonical": false},":kiss_mm:":{"unicode":["1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","1f468-2764-1f48b-1f468"],"isCanonical": true},":couplekiss_mm:":{"unicode":["1f468-200d-2764-fe0f-200d-1f48b-200d-1f468","1f468-2764-1f48b-1f468"],"isCanonical": false},":family_mmbb:":{"unicode":["1f468-200d-1f468-200d-1f466-200d-1f466","1f468-1f468-1f466-1f466"],"isCanonical": true},":family_mmgb:":{"unicode":["1f468-200d-1f468-200d-1f467-200d-1f466","1f468-1f468-1f467-1f466"],"isCanonical": true},":family_mmgg:":{"unicode":["1f468-200d-1f468-200d-1f467-200d-1f467","1f468-1f468-1f467-1f467"],"isCanonical": true},":family_mwbb:":{"unicode":["1f468-200d-1f469-200d-1f466-200d-1f466","1f468-1f469-1f466-1f466"],"isCanonical": true},":family_mwgb:":{"unicode":["1f468-200d-1f469-200d-1f467-200d-1f466","1f468-1f469-1f467-1f466"],"isCanonical": true},":family_mwgg:":{"unicode":["1f468-200d-1f469-200d-1f467-200d-1f467","1f468-1f469-1f467-1f467"],"isCanonical": true},":family_wwbb:":{"unicode":["1f469-200d-1f469-200d-1f466-200d-1f466","1f469-1f469-1f466-1f466"],"isCanonical": true},":family_wwgb:":{"unicode":["1f469-200d-1f469-200d-1f467-200d-1f466","1f469-1f469-1f467-1f466"],"isCanonical": true},":family_wwgg:":{"unicode":["1f469-200d-1f469-200d-1f467-200d-1f467","1f469-1f469-1f467-1f467"],"isCanonical": true},":couple_ww:":{"unicode":["1f469-200d-2764-fe0f-200d-1f469","1f469-2764-1f469"],"isCanonical": true},":couple_with_heart_ww:":{"unicode":["1f469-200d-2764-fe0f-200d-1f469","1f469-2764-1f469"],"isCanonical": false},":couple_mm:":{"unicode":["1f468-200d-2764-fe0f-200d-1f468","1f468-2764-1f468"],"isCanonical": true},":couple_with_heart_mm:":{"unicode":["1f468-200d-2764-fe0f-200d-1f468","1f468-2764-1f468"],"isCanonical": false},":family_mmb:":{"unicode":["1f468-200d-1f468-200d-1f466","1f468-1f468-1f466"],"isCanonical": true},":family_mmg:":{"unicode":["1f468-200d-1f468-200d-1f467","1f468-1f468-1f467"],"isCanonical": true},":family_mwg:":{"unicode":["1f468-200d-1f469-200d-1f467","1f468-1f469-1f467"],"isCanonical": true},":family_wwb:":{"unicode":["1f469-200d-1f469-200d-1f466","1f469-1f469-1f466"],"isCanonical": true},":family_wwg:":{"unicode":["1f469-200d-1f469-200d-1f467","1f469-1f469-1f467"],"isCanonical": true},":eye_in_speech_bubble:":{"unicode":["1f441-200d-1f5e8","1f441-1f5e8"],"isCanonical": true},":hash:":{"unicode":["0023-fe0f-20e3","0023-20e3"],"isCanonical": true},":zero:":{"unicode":["0030-fe0f-20e3","0030-20e3"],"isCanonical": true},":one:":{"unicode":["0031-fe0f-20e3","0031-20e3"],"isCanonical": true},":two:":{"unicode":["0032-fe0f-20e3","0032-20e3"],"isCanonical": true},":three:":{"unicode":["0033-fe0f-20e3","0033-20e3"],"isCanonical": true},":four:":{"unicode":["0034-fe0f-20e3","0034-20e3"],"isCanonical": true},":five:":{"unicode":["0035-fe0f-20e3","0035-20e3"],"isCanonical": true},":six:":{"unicode":["0036-fe0f-20e3","0036-20e3"],"isCanonical": true},":seven:":{"unicode":["0037-fe0f-20e3","0037-20e3"],"isCanonical": true},":eight:":{"unicode":["0038-fe0f-20e3","0038-20e3"],"isCanonical": true},":nine:":{"unicode":["0039-fe0f-20e3","0039-20e3"],"isCanonical": true},":asterisk:":{"unicode":["002a-fe0f-20e3","002a-20e3"],"isCanonical": true},":keycap_asterisk:":{"unicode":["002a-fe0f-20e3","002a-20e3"],"isCanonical": false},":handball_tone5:":{"unicode":["1f93e-1f3ff"],"isCanonical": true},":handball_tone4:":{"unicode":["1f93e-1f3fe"],"isCanonical": true},":handball_tone3:":{"unicode":["1f93e-1f3fd"],"isCanonical": true},":handball_tone2:":{"unicode":["1f93e-1f3fc"],"isCanonical": true},":handball_tone1:":{"unicode":["1f93e-1f3fb"],"isCanonical": true},":water_polo_tone5:":{"unicode":["1f93d-1f3ff"],"isCanonical": true},":water_polo_tone4:":{"unicode":["1f93d-1f3fe"],"isCanonical": true},":water_polo_tone3:":{"unicode":["1f93d-1f3fd"],"isCanonical": true},":water_polo_tone2:":{"unicode":["1f93d-1f3fc"],"isCanonical": true},":water_polo_tone1:":{"unicode":["1f93d-1f3fb"],"isCanonical": true},":wrestlers_tone5:":{"unicode":["1f93c-1f3ff"],"isCanonical": true},":wrestling_tone5:":{"unicode":["1f93c-1f3ff"],"isCanonical": false},":wrestlers_tone4:":{"unicode":["1f93c-1f3fe"],"isCanonical": true},":wrestling_tone4:":{"unicode":["1f93c-1f3fe"],"isCanonical": false},":wrestlers_tone3:":{"unicode":["1f93c-1f3fd"],"isCanonical": true},":wrestling_tone3:":{"unicode":["1f93c-1f3fd"],"isCanonical": false},":wrestlers_tone2:":{"unicode":["1f93c-1f3fc"],"isCanonical": true},":wrestling_tone2:":{"unicode":["1f93c-1f3fc"],"isCanonical": false},":wrestlers_tone1:":{"unicode":["1f93c-1f3fb"],"isCanonical": true},":wrestling_tone1:":{"unicode":["1f93c-1f3fb"],"isCanonical": false},":juggling_tone5:":{"unicode":["1f939-1f3ff"],"isCanonical": true},":juggler_tone5:":{"unicode":["1f939-1f3ff"],"isCanonical": false},":juggling_tone4:":{"unicode":["1f939-1f3fe"],"isCanonical": true},":juggler_tone4:":{"unicode":["1f939-1f3fe"],"isCanonical": false},":juggling_tone3:":{"unicode":["1f939-1f3fd"],"isCanonical": true},":juggler_tone3:":{"unicode":["1f939-1f3fd"],"isCanonical": false},":juggling_tone2:":{"unicode":["1f939-1f3fc"],"isCanonical": true},":juggler_tone2:":{"unicode":["1f939-1f3fc"],"isCanonical": false},":juggling_tone1:":{"unicode":["1f939-1f3fb"],"isCanonical": true},":juggler_tone1:":{"unicode":["1f939-1f3fb"],"isCanonical": false},":cartwheel_tone5:":{"unicode":["1f938-1f3ff"],"isCanonical": true},":person_doing_cartwheel_tone5:":{"unicode":["1f938-1f3ff"],"isCanonical": false},":cartwheel_tone4:":{"unicode":["1f938-1f3fe"],"isCanonical": true},":person_doing_cartwheel_tone4:":{"unicode":["1f938-1f3fe"],"isCanonical": false},":cartwheel_tone3:":{"unicode":["1f938-1f3fd"],"isCanonical": true},":person_doing_cartwheel_tone3:":{"unicode":["1f938-1f3fd"],"isCanonical": false},":cartwheel_tone2:":{"unicode":["1f938-1f3fc"],"isCanonical": true},":person_doing_cartwheel_tone2:":{"unicode":["1f938-1f3fc"],"isCanonical": false},":cartwheel_tone1:":{"unicode":["1f938-1f3fb"],"isCanonical": true},":person_doing_cartwheel_tone1:":{"unicode":["1f938-1f3fb"],"isCanonical": false},":shrug_tone5:":{"unicode":["1f937-1f3ff"],"isCanonical": true},":shrug_tone4:":{"unicode":["1f937-1f3fe"],"isCanonical": true},":shrug_tone3:":{"unicode":["1f937-1f3fd"],"isCanonical": true},":shrug_tone2:":{"unicode":["1f937-1f3fc"],"isCanonical": true},":shrug_tone1:":{"unicode":["1f937-1f3fb"],"isCanonical": true},":mrs_claus_tone5:":{"unicode":["1f936-1f3ff"],"isCanonical": true},":mother_christmas_tone5:":{"unicode":["1f936-1f3ff"],"isCanonical": false},":mrs_claus_tone4:":{"unicode":["1f936-1f3fe"],"isCanonical": true},":mother_christmas_tone4:":{"unicode":["1f936-1f3fe"],"isCanonical": false},":mrs_claus_tone3:":{"unicode":["1f936-1f3fd"],"isCanonical": true},":mother_christmas_tone3:":{"unicode":["1f936-1f3fd"],"isCanonical": false},":mrs_claus_tone2:":{"unicode":["1f936-1f3fc"],"isCanonical": true},":mother_christmas_tone2:":{"unicode":["1f936-1f3fc"],"isCanonical": false},":mrs_claus_tone1:":{"unicode":["1f936-1f3fb"],"isCanonical": true},":mother_christmas_tone1:":{"unicode":["1f936-1f3fb"],"isCanonical": false},":man_in_tuxedo_tone5:":{"unicode":["1f935-1f3ff"],"isCanonical": true},":tuxedo_tone5:":{"unicode":["1f935-1f3ff"],"isCanonical": false},":man_in_tuxedo_tone4:":{"unicode":["1f935-1f3fe"],"isCanonical": true},":tuxedo_tone4:":{"unicode":["1f935-1f3fe"],"isCanonical": false},":man_in_tuxedo_tone3:":{"unicode":["1f935-1f3fd"],"isCanonical": true},":tuxedo_tone3:":{"unicode":["1f935-1f3fd"],"isCanonical": false},":man_in_tuxedo_tone2:":{"unicode":["1f935-1f3fc"],"isCanonical": true},":tuxedo_tone2:":{"unicode":["1f935-1f3fc"],"isCanonical": false},":man_in_tuxedo_tone1:":{"unicode":["1f935-1f3fb"],"isCanonical": true},":tuxedo_tone1:":{"unicode":["1f935-1f3fb"],"isCanonical": false},":prince_tone5:":{"unicode":["1f934-1f3ff"],"isCanonical": true},":prince_tone4:":{"unicode":["1f934-1f3fe"],"isCanonical": true},":prince_tone3:":{"unicode":["1f934-1f3fd"],"isCanonical": true},":prince_tone2:":{"unicode":["1f934-1f3fc"],"isCanonical": true},":prince_tone1:":{"unicode":["1f934-1f3fb"],"isCanonical": true},":selfie_tone5:":{"unicode":["1f933-1f3ff"],"isCanonical": true},":selfie_tone4:":{"unicode":["1f933-1f3fe"],"isCanonical": true},":selfie_tone3:":{"unicode":["1f933-1f3fd"],"isCanonical": true},":selfie_tone2:":{"unicode":["1f933-1f3fc"],"isCanonical": true},":selfie_tone1:":{"unicode":["1f933-1f3fb"],"isCanonical": true},":pregnant_woman_tone5:":{"unicode":["1f930-1f3ff"],"isCanonical": true},":expecting_woman_tone5:":{"unicode":["1f930-1f3ff"],"isCanonical": false},":pregnant_woman_tone4:":{"unicode":["1f930-1f3fe"],"isCanonical": true},":expecting_woman_tone4:":{"unicode":["1f930-1f3fe"],"isCanonical": false},":pregnant_woman_tone3:":{"unicode":["1f930-1f3fd"],"isCanonical": true},":expecting_woman_tone3:":{"unicode":["1f930-1f3fd"],"isCanonical": false},":pregnant_woman_tone2:":{"unicode":["1f930-1f3fc"],"isCanonical": true},":expecting_woman_tone2:":{"unicode":["1f930-1f3fc"],"isCanonical": false},":pregnant_woman_tone1:":{"unicode":["1f930-1f3fb"],"isCanonical": true},":expecting_woman_tone1:":{"unicode":["1f930-1f3fb"],"isCanonical": false},":face_palm_tone5:":{"unicode":["1f926-1f3ff"],"isCanonical": true},":facepalm_tone5:":{"unicode":["1f926-1f3ff"],"isCanonical": false},":face_palm_tone4:":{"unicode":["1f926-1f3fe"],"isCanonical": true},":facepalm_tone4:":{"unicode":["1f926-1f3fe"],"isCanonical": false},":face_palm_tone3:":{"unicode":["1f926-1f3fd"],"isCanonical": true},":facepalm_tone3:":{"unicode":["1f926-1f3fd"],"isCanonical": false},":face_palm_tone2:":{"unicode":["1f926-1f3fc"],"isCanonical": true},":facepalm_tone2:":{"unicode":["1f926-1f3fc"],"isCanonical": false},":face_palm_tone1:":{"unicode":["1f926-1f3fb"],"isCanonical": true},":facepalm_tone1:":{"unicode":["1f926-1f3fb"],"isCanonical": false},":fingers_crossed_tone5:":{"unicode":["1f91e-1f3ff"],"isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone5:":{"unicode":["1f91e-1f3ff"],"isCanonical": false},":fingers_crossed_tone4:":{"unicode":["1f91e-1f3fe"],"isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone4:":{"unicode":["1f91e-1f3fe"],"isCanonical": false},":fingers_crossed_tone3:":{"unicode":["1f91e-1f3fd"],"isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone3:":{"unicode":["1f91e-1f3fd"],"isCanonical": false},":fingers_crossed_tone2:":{"unicode":["1f91e-1f3fc"],"isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone2:":{"unicode":["1f91e-1f3fc"],"isCanonical": false},":fingers_crossed_tone1:":{"unicode":["1f91e-1f3fb"],"isCanonical": true},":hand_with_index_and_middle_fingers_crossed_tone1:":{"unicode":["1f91e-1f3fb"],"isCanonical": false},":handshake_tone5:":{"unicode":["1f91d-1f3ff"],"isCanonical": true},":shaking_hands_tone5:":{"unicode":["1f91d-1f3ff"],"isCanonical": false},":handshake_tone4:":{"unicode":["1f91d-1f3fe"],"isCanonical": true},":shaking_hands_tone4:":{"unicode":["1f91d-1f3fe"],"isCanonical": false},":handshake_tone3:":{"unicode":["1f91d-1f3fd"],"isCanonical": true},":shaking_hands_tone3:":{"unicode":["1f91d-1f3fd"],"isCanonical": false},":handshake_tone2:":{"unicode":["1f91d-1f3fc"],"isCanonical": true},":shaking_hands_tone2:":{"unicode":["1f91d-1f3fc"],"isCanonical": false},":handshake_tone1:":{"unicode":["1f91d-1f3fb"],"isCanonical": true},":shaking_hands_tone1:":{"unicode":["1f91d-1f3fb"],"isCanonical": false},":right_facing_fist_tone5:":{"unicode":["1f91c-1f3ff"],"isCanonical": true},":right_fist_tone5:":{"unicode":["1f91c-1f3ff"],"isCanonical": false},":right_facing_fist_tone4:":{"unicode":["1f91c-1f3fe"],"isCanonical": true},":right_fist_tone4:":{"unicode":["1f91c-1f3fe"],"isCanonical": false},":right_facing_fist_tone3:":{"unicode":["1f91c-1f3fd"],"isCanonical": true},":right_fist_tone3:":{"unicode":["1f91c-1f3fd"],"isCanonical": false},":right_facing_fist_tone2:":{"unicode":["1f91c-1f3fc"],"isCanonical": true},":right_fist_tone2:":{"unicode":["1f91c-1f3fc"],"isCanonical": false},":right_facing_fist_tone1:":{"unicode":["1f91c-1f3fb"],"isCanonical": true},":right_fist_tone1:":{"unicode":["1f91c-1f3fb"],"isCanonical": false},":left_facing_fist_tone5:":{"unicode":["1f91b-1f3ff"],"isCanonical": true},":left_fist_tone5:":{"unicode":["1f91b-1f3ff"],"isCanonical": false},":left_facing_fist_tone4:":{"unicode":["1f91b-1f3fe"],"isCanonical": true},":left_fist_tone4:":{"unicode":["1f91b-1f3fe"],"isCanonical": false},":left_facing_fist_tone3:":{"unicode":["1f91b-1f3fd"],"isCanonical": true},":left_fist_tone3:":{"unicode":["1f91b-1f3fd"],"isCanonical": false},":left_facing_fist_tone2:":{"unicode":["1f91b-1f3fc"],"isCanonical": true},":left_fist_tone2:":{"unicode":["1f91b-1f3fc"],"isCanonical": false},":left_facing_fist_tone1:":{"unicode":["1f91b-1f3fb"],"isCanonical": true},":left_fist_tone1:":{"unicode":["1f91b-1f3fb"],"isCanonical": false},":raised_back_of_hand_tone5:":{"unicode":["1f91a-1f3ff"],"isCanonical": true},":back_of_hand_tone5:":{"unicode":["1f91a-1f3ff"],"isCanonical": false},":raised_back_of_hand_tone4:":{"unicode":["1f91a-1f3fe"],"isCanonical": true},":back_of_hand_tone4:":{"unicode":["1f91a-1f3fe"],"isCanonical": false},":raised_back_of_hand_tone3:":{"unicode":["1f91a-1f3fd"],"isCanonical": true},":back_of_hand_tone3:":{"unicode":["1f91a-1f3fd"],"isCanonical": false},":raised_back_of_hand_tone2:":{"unicode":["1f91a-1f3fc"],"isCanonical": true},":back_of_hand_tone2:":{"unicode":["1f91a-1f3fc"],"isCanonical": false},":raised_back_of_hand_tone1:":{"unicode":["1f91a-1f3fb"],"isCanonical": true},":back_of_hand_tone1:":{"unicode":["1f91a-1f3fb"],"isCanonical": false},":call_me_tone5:":{"unicode":["1f919-1f3ff"],"isCanonical": true},":call_me_hand_tone5:":{"unicode":["1f919-1f3ff"],"isCanonical": false},":call_me_tone4:":{"unicode":["1f919-1f3fe"],"isCanonical": true},":call_me_hand_tone4:":{"unicode":["1f919-1f3fe"],"isCanonical": false},":call_me_tone3:":{"unicode":["1f919-1f3fd"],"isCanonical": true},":call_me_hand_tone3:":{"unicode":["1f919-1f3fd"],"isCanonical": false},":call_me_tone2:":{"unicode":["1f919-1f3fc"],"isCanonical": true},":call_me_hand_tone2:":{"unicode":["1f919-1f3fc"],"isCanonical": false},":call_me_tone1:":{"unicode":["1f919-1f3fb"],"isCanonical": true},":call_me_hand_tone1:":{"unicode":["1f919-1f3fb"],"isCanonical": false},":metal_tone5:":{"unicode":["1f918-1f3ff"],"isCanonical": true},":sign_of_the_horns_tone5:":{"unicode":["1f918-1f3ff"],"isCanonical": false},":metal_tone4:":{"unicode":["1f918-1f3fe"],"isCanonical": true},":sign_of_the_horns_tone4:":{"unicode":["1f918-1f3fe"],"isCanonical": false},":metal_tone3:":{"unicode":["1f918-1f3fd"],"isCanonical": true},":sign_of_the_horns_tone3:":{"unicode":["1f918-1f3fd"],"isCanonical": false},":metal_tone2:":{"unicode":["1f918-1f3fc"],"isCanonical": true},":sign_of_the_horns_tone2:":{"unicode":["1f918-1f3fc"],"isCanonical": false},":metal_tone1:":{"unicode":["1f918-1f3fb"],"isCanonical": true},":sign_of_the_horns_tone1:":{"unicode":["1f918-1f3fb"],"isCanonical": false},":bath_tone5:":{"unicode":["1f6c0-1f3ff"],"isCanonical": true},":bath_tone4:":{"unicode":["1f6c0-1f3fe"],"isCanonical": true},":bath_tone3:":{"unicode":["1f6c0-1f3fd"],"isCanonical": true},":bath_tone2:":{"unicode":["1f6c0-1f3fc"],"isCanonical": true},":bath_tone1:":{"unicode":["1f6c0-1f3fb"],"isCanonical": true},":walking_tone5:":{"unicode":["1f6b6-1f3ff"],"isCanonical": true},":walking_tone4:":{"unicode":["1f6b6-1f3fe"],"isCanonical": true},":walking_tone3:":{"unicode":["1f6b6-1f3fd"],"isCanonical": true},":walking_tone2:":{"unicode":["1f6b6-1f3fc"],"isCanonical": true},":walking_tone1:":{"unicode":["1f6b6-1f3fb"],"isCanonical": true},":mountain_bicyclist_tone5:":{"unicode":["1f6b5-1f3ff"],"isCanonical": true},":mountain_bicyclist_tone4:":{"unicode":["1f6b5-1f3fe"],"isCanonical": true},":mountain_bicyclist_tone3:":{"unicode":["1f6b5-1f3fd"],"isCanonical": true},":mountain_bicyclist_tone2:":{"unicode":["1f6b5-1f3fc"],"isCanonical": true},":mountain_bicyclist_tone1:":{"unicode":["1f6b5-1f3fb"],"isCanonical": true},":bicyclist_tone5:":{"unicode":["1f6b4-1f3ff"],"isCanonical": true},":bicyclist_tone4:":{"unicode":["1f6b4-1f3fe"],"isCanonical": true},":bicyclist_tone3:":{"unicode":["1f6b4-1f3fd"],"isCanonical": true},":bicyclist_tone2:":{"unicode":["1f6b4-1f3fc"],"isCanonical": true},":bicyclist_tone1:":{"unicode":["1f6b4-1f3fb"],"isCanonical": true},":rowboat_tone5:":{"unicode":["1f6a3-1f3ff"],"isCanonical": true},":rowboat_tone4:":{"unicode":["1f6a3-1f3fe"],"isCanonical": true},":rowboat_tone3:":{"unicode":["1f6a3-1f3fd"],"isCanonical": true},":rowboat_tone2:":{"unicode":["1f6a3-1f3fc"],"isCanonical": true},":rowboat_tone1:":{"unicode":["1f6a3-1f3fb"],"isCanonical": true},":pray_tone5:":{"unicode":["1f64f-1f3ff"],"isCanonical": true},":pray_tone4:":{"unicode":["1f64f-1f3fe"],"isCanonical": true},":pray_tone3:":{"unicode":["1f64f-1f3fd"],"isCanonical": true},":pray_tone2:":{"unicode":["1f64f-1f3fc"],"isCanonical": true},":pray_tone1:":{"unicode":["1f64f-1f3fb"],"isCanonical": true},":person_with_pouting_face_tone5:":{"unicode":["1f64e-1f3ff"],"isCanonical": true},":person_with_pouting_face_tone4:":{"unicode":["1f64e-1f3fe"],"isCanonical": true},":person_with_pouting_face_tone3:":{"unicode":["1f64e-1f3fd"],"isCanonical": true},":person_with_pouting_face_tone2:":{"unicode":["1f64e-1f3fc"],"isCanonical": true},":person_with_pouting_face_tone1:":{"unicode":["1f64e-1f3fb"],"isCanonical": true},":person_frowning_tone5:":{"unicode":["1f64d-1f3ff"],"isCanonical": true},":person_frowning_tone4:":{"unicode":["1f64d-1f3fe"],"isCanonical": true},":person_frowning_tone3:":{"unicode":["1f64d-1f3fd"],"isCanonical": true},":person_frowning_tone2:":{"unicode":["1f64d-1f3fc"],"isCanonical": true},":person_frowning_tone1:":{"unicode":["1f64d-1f3fb"],"isCanonical": true},":raised_hands_tone5:":{"unicode":["1f64c-1f3ff"],"isCanonical": true},":raised_hands_tone4:":{"unicode":["1f64c-1f3fe"],"isCanonical": true},":raised_hands_tone3:":{"unicode":["1f64c-1f3fd"],"isCanonical": true},":raised_hands_tone2:":{"unicode":["1f64c-1f3fc"],"isCanonical": true},":raised_hands_tone1:":{"unicode":["1f64c-1f3fb"],"isCanonical": true},":raising_hand_tone5:":{"unicode":["1f64b-1f3ff"],"isCanonical": true},":raising_hand_tone4:":{"unicode":["1f64b-1f3fe"],"isCanonical": true},":raising_hand_tone3:":{"unicode":["1f64b-1f3fd"],"isCanonical": true},":raising_hand_tone2:":{"unicode":["1f64b-1f3fc"],"isCanonical": true},":raising_hand_tone1:":{"unicode":["1f64b-1f3fb"],"isCanonical": true},":bow_tone5:":{"unicode":["1f647-1f3ff"],"isCanonical": true},":bow_tone4:":{"unicode":["1f647-1f3fe"],"isCanonical": true},":bow_tone3:":{"unicode":["1f647-1f3fd"],"isCanonical": true},":bow_tone2:":{"unicode":["1f647-1f3fc"],"isCanonical": true},":bow_tone1:":{"unicode":["1f647-1f3fb"],"isCanonical": true},":ok_woman_tone5:":{"unicode":["1f646-1f3ff"],"isCanonical": true},":ok_woman_tone4:":{"unicode":["1f646-1f3fe"],"isCanonical": true},":ok_woman_tone3:":{"unicode":["1f646-1f3fd"],"isCanonical": true},":ok_woman_tone2:":{"unicode":["1f646-1f3fc"],"isCanonical": true},":ok_woman_tone1:":{"unicode":["1f646-1f3fb"],"isCanonical": true},":no_good_tone5:":{"unicode":["1f645-1f3ff"],"isCanonical": true},":no_good_tone4:":{"unicode":["1f645-1f3fe"],"isCanonical": true},":no_good_tone3:":{"unicode":["1f645-1f3fd"],"isCanonical": true},":no_good_tone2:":{"unicode":["1f645-1f3fc"],"isCanonical": true},":no_good_tone1:":{"unicode":["1f645-1f3fb"],"isCanonical": true},":vulcan_tone5:":{"unicode":["1f596-1f3ff"],"isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone5:":{"unicode":["1f596-1f3ff"],"isCanonical": false},":vulcan_tone4:":{"unicode":["1f596-1f3fe"],"isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone4:":{"unicode":["1f596-1f3fe"],"isCanonical": false},":vulcan_tone3:":{"unicode":["1f596-1f3fd"],"isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone3:":{"unicode":["1f596-1f3fd"],"isCanonical": false},":vulcan_tone2:":{"unicode":["1f596-1f3fc"],"isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone2:":{"unicode":["1f596-1f3fc"],"isCanonical": false},":vulcan_tone1:":{"unicode":["1f596-1f3fb"],"isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers_tone1:":{"unicode":["1f596-1f3fb"],"isCanonical": false},":middle_finger_tone5:":{"unicode":["1f595-1f3ff"],"isCanonical": true},":reversed_hand_with_middle_finger_extended_tone5:":{"unicode":["1f595-1f3ff"],"isCanonical": false},":middle_finger_tone4:":{"unicode":["1f595-1f3fe"],"isCanonical": true},":reversed_hand_with_middle_finger_extended_tone4:":{"unicode":["1f595-1f3fe"],"isCanonical": false},":middle_finger_tone3:":{"unicode":["1f595-1f3fd"],"isCanonical": true},":reversed_hand_with_middle_finger_extended_tone3:":{"unicode":["1f595-1f3fd"],"isCanonical": false},":middle_finger_tone2:":{"unicode":["1f595-1f3fc"],"isCanonical": true},":reversed_hand_with_middle_finger_extended_tone2:":{"unicode":["1f595-1f3fc"],"isCanonical": false},":middle_finger_tone1:":{"unicode":["1f595-1f3fb"],"isCanonical": true},":reversed_hand_with_middle_finger_extended_tone1:":{"unicode":["1f595-1f3fb"],"isCanonical": false},":hand_splayed_tone5:":{"unicode":["1f590-1f3ff"],"isCanonical": true},":raised_hand_with_fingers_splayed_tone5:":{"unicode":["1f590-1f3ff"],"isCanonical": false},":hand_splayed_tone4:":{"unicode":["1f590-1f3fe"],"isCanonical": true},":raised_hand_with_fingers_splayed_tone4:":{"unicode":["1f590-1f3fe"],"isCanonical": false},":hand_splayed_tone3:":{"unicode":["1f590-1f3fd"],"isCanonical": true},":raised_hand_with_fingers_splayed_tone3:":{"unicode":["1f590-1f3fd"],"isCanonical": false},":hand_splayed_tone2:":{"unicode":["1f590-1f3fc"],"isCanonical": true},":raised_hand_with_fingers_splayed_tone2:":{"unicode":["1f590-1f3fc"],"isCanonical": false},":hand_splayed_tone1:":{"unicode":["1f590-1f3fb"],"isCanonical": true},":raised_hand_with_fingers_splayed_tone1:":{"unicode":["1f590-1f3fb"],"isCanonical": false},":man_dancing_tone5:":{"unicode":["1f57a-1f3ff"],"isCanonical": true},":male_dancer_tone5:":{"unicode":["1f57a-1f3ff"],"isCanonical": false},":man_dancing_tone4:":{"unicode":["1f57a-1f3fe"],"isCanonical": true},":male_dancer_tone4:":{"unicode":["1f57a-1f3fe"],"isCanonical": false},":man_dancing_tone3:":{"unicode":["1f57a-1f3fd"],"isCanonical": true},":male_dancer_tone3:":{"unicode":["1f57a-1f3fd"],"isCanonical": false},":man_dancing_tone2:":{"unicode":["1f57a-1f3fc"],"isCanonical": true},":male_dancer_tone2:":{"unicode":["1f57a-1f3fc"],"isCanonical": false},":man_dancing_tone1:":{"unicode":["1f57a-1f3fb"],"isCanonical": true},":male_dancer_tone1:":{"unicode":["1f57a-1f3fb"],"isCanonical": false},":spy_tone5:":{"unicode":["1f575-1f3ff"],"isCanonical": true},":sleuth_or_spy_tone5:":{"unicode":["1f575-1f3ff"],"isCanonical": false},":spy_tone4:":{"unicode":["1f575-1f3fe"],"isCanonical": true},":sleuth_or_spy_tone4:":{"unicode":["1f575-1f3fe"],"isCanonical": false},":spy_tone3:":{"unicode":["1f575-1f3fd"],"isCanonical": true},":sleuth_or_spy_tone3:":{"unicode":["1f575-1f3fd"],"isCanonical": false},":spy_tone2:":{"unicode":["1f575-1f3fc"],"isCanonical": true},":sleuth_or_spy_tone2:":{"unicode":["1f575-1f3fc"],"isCanonical": false},":spy_tone1:":{"unicode":["1f575-1f3fb"],"isCanonical": true},":sleuth_or_spy_tone1:":{"unicode":["1f575-1f3fb"],"isCanonical": false},":muscle_tone5:":{"unicode":["1f4aa-1f3ff"],"isCanonical": true},":muscle_tone4:":{"unicode":["1f4aa-1f3fe"],"isCanonical": true},":muscle_tone3:":{"unicode":["1f4aa-1f3fd"],"isCanonical": true},":muscle_tone2:":{"unicode":["1f4aa-1f3fc"],"isCanonical": true},":muscle_tone1:":{"unicode":["1f4aa-1f3fb"],"isCanonical": true},":haircut_tone5:":{"unicode":["1f487-1f3ff"],"isCanonical": true},":haircut_tone4:":{"unicode":["1f487-1f3fe"],"isCanonical": true},":haircut_tone3:":{"unicode":["1f487-1f3fd"],"isCanonical": true},":haircut_tone2:":{"unicode":["1f487-1f3fc"],"isCanonical": true},":haircut_tone1:":{"unicode":["1f487-1f3fb"],"isCanonical": true},":massage_tone5:":{"unicode":["1f486-1f3ff"],"isCanonical": true},":massage_tone4:":{"unicode":["1f486-1f3fe"],"isCanonical": true},":massage_tone3:":{"unicode":["1f486-1f3fd"],"isCanonical": true},":massage_tone2:":{"unicode":["1f486-1f3fc"],"isCanonical": true},":massage_tone1:":{"unicode":["1f486-1f3fb"],"isCanonical": true},":nail_care_tone5:":{"unicode":["1f485-1f3ff"],"isCanonical": true},":nail_care_tone4:":{"unicode":["1f485-1f3fe"],"isCanonical": true},":nail_care_tone3:":{"unicode":["1f485-1f3fd"],"isCanonical": true},":nail_care_tone2:":{"unicode":["1f485-1f3fc"],"isCanonical": true},":nail_care_tone1:":{"unicode":["1f485-1f3fb"],"isCanonical": true},":dancer_tone5:":{"unicode":["1f483-1f3ff"],"isCanonical": true},":dancer_tone4:":{"unicode":["1f483-1f3fe"],"isCanonical": true},":dancer_tone3:":{"unicode":["1f483-1f3fd"],"isCanonical": true},":dancer_tone2:":{"unicode":["1f483-1f3fc"],"isCanonical": true},":dancer_tone1:":{"unicode":["1f483-1f3fb"],"isCanonical": true},":guardsman_tone5:":{"unicode":["1f482-1f3ff"],"isCanonical": true},":guardsman_tone4:":{"unicode":["1f482-1f3fe"],"isCanonical": true},":guardsman_tone3:":{"unicode":["1f482-1f3fd"],"isCanonical": true},":guardsman_tone2:":{"unicode":["1f482-1f3fc"],"isCanonical": true},":guardsman_tone1:":{"unicode":["1f482-1f3fb"],"isCanonical": true},":information_desk_person_tone5:":{"unicode":["1f481-1f3ff"],"isCanonical": true},":information_desk_person_tone4:":{"unicode":["1f481-1f3fe"],"isCanonical": true},":information_desk_person_tone3:":{"unicode":["1f481-1f3fd"],"isCanonical": true},":information_desk_person_tone2:":{"unicode":["1f481-1f3fc"],"isCanonical": true},":information_desk_person_tone1:":{"unicode":["1f481-1f3fb"],"isCanonical": true},":angel_tone5:":{"unicode":["1f47c-1f3ff"],"isCanonical": true},":angel_tone4:":{"unicode":["1f47c-1f3fe"],"isCanonical": true},":angel_tone3:":{"unicode":["1f47c-1f3fd"],"isCanonical": true},":angel_tone2:":{"unicode":["1f47c-1f3fc"],"isCanonical": true},":angel_tone1:":{"unicode":["1f47c-1f3fb"],"isCanonical": true},":princess_tone5:":{"unicode":["1f478-1f3ff"],"isCanonical": true},":princess_tone4:":{"unicode":["1f478-1f3fe"],"isCanonical": true},":princess_tone3:":{"unicode":["1f478-1f3fd"],"isCanonical": true},":princess_tone2:":{"unicode":["1f478-1f3fc"],"isCanonical": true},":princess_tone1:":{"unicode":["1f478-1f3fb"],"isCanonical": true},":construction_worker_tone5:":{"unicode":["1f477-1f3ff"],"isCanonical": true},":construction_worker_tone4:":{"unicode":["1f477-1f3fe"],"isCanonical": true},":construction_worker_tone3:":{"unicode":["1f477-1f3fd"],"isCanonical": true},":construction_worker_tone2:":{"unicode":["1f477-1f3fc"],"isCanonical": true},":construction_worker_tone1:":{"unicode":["1f477-1f3fb"],"isCanonical": true},":baby_tone5:":{"unicode":["1f476-1f3ff"],"isCanonical": true},":baby_tone4:":{"unicode":["1f476-1f3fe"],"isCanonical": true},":baby_tone3:":{"unicode":["1f476-1f3fd"],"isCanonical": true},":baby_tone2:":{"unicode":["1f476-1f3fc"],"isCanonical": true},":baby_tone1:":{"unicode":["1f476-1f3fb"],"isCanonical": true},":older_woman_tone5:":{"unicode":["1f475-1f3ff"],"isCanonical": true},":grandma_tone5:":{"unicode":["1f475-1f3ff"],"isCanonical": false},":older_woman_tone4:":{"unicode":["1f475-1f3fe"],"isCanonical": true},":grandma_tone4:":{"unicode":["1f475-1f3fe"],"isCanonical": false},":older_woman_tone3:":{"unicode":["1f475-1f3fd"],"isCanonical": true},":grandma_tone3:":{"unicode":["1f475-1f3fd"],"isCanonical": false},":older_woman_tone2:":{"unicode":["1f475-1f3fc"],"isCanonical": true},":grandma_tone2:":{"unicode":["1f475-1f3fc"],"isCanonical": false},":older_woman_tone1:":{"unicode":["1f475-1f3fb"],"isCanonical": true},":grandma_tone1:":{"unicode":["1f475-1f3fb"],"isCanonical": false},":older_man_tone5:":{"unicode":["1f474-1f3ff"],"isCanonical": true},":older_man_tone4:":{"unicode":["1f474-1f3fe"],"isCanonical": true},":older_man_tone3:":{"unicode":["1f474-1f3fd"],"isCanonical": true},":older_man_tone2:":{"unicode":["1f474-1f3fc"],"isCanonical": true},":older_man_tone1:":{"unicode":["1f474-1f3fb"],"isCanonical": true},":man_with_turban_tone5:":{"unicode":["1f473-1f3ff"],"isCanonical": true},":man_with_turban_tone4:":{"unicode":["1f473-1f3fe"],"isCanonical": true},":man_with_turban_tone3:":{"unicode":["1f473-1f3fd"],"isCanonical": true},":man_with_turban_tone2:":{"unicode":["1f473-1f3fc"],"isCanonical": true},":man_with_turban_tone1:":{"unicode":["1f473-1f3fb"],"isCanonical": true},":man_with_gua_pi_mao_tone5:":{"unicode":["1f472-1f3ff"],"isCanonical": true},":man_with_gua_pi_mao_tone4:":{"unicode":["1f472-1f3fe"],"isCanonical": true},":man_with_gua_pi_mao_tone3:":{"unicode":["1f472-1f3fd"],"isCanonical": true},":man_with_gua_pi_mao_tone2:":{"unicode":["1f472-1f3fc"],"isCanonical": true},":man_with_gua_pi_mao_tone1:":{"unicode":["1f472-1f3fb"],"isCanonical": true},":person_with_blond_hair_tone5:":{"unicode":["1f471-1f3ff"],"isCanonical": true},":person_with_blond_hair_tone4:":{"unicode":["1f471-1f3fe"],"isCanonical": true},":person_with_blond_hair_tone3:":{"unicode":["1f471-1f3fd"],"isCanonical": true},":person_with_blond_hair_tone2:":{"unicode":["1f471-1f3fc"],"isCanonical": true},":person_with_blond_hair_tone1:":{"unicode":["1f471-1f3fb"],"isCanonical": true},":bride_with_veil_tone5:":{"unicode":["1f470-1f3ff"],"isCanonical": true},":bride_with_veil_tone4:":{"unicode":["1f470-1f3fe"],"isCanonical": true},":bride_with_veil_tone3:":{"unicode":["1f470-1f3fd"],"isCanonical": true},":bride_with_veil_tone2:":{"unicode":["1f470-1f3fc"],"isCanonical": true},":bride_with_veil_tone1:":{"unicode":["1f470-1f3fb"],"isCanonical": true},":cop_tone5:":{"unicode":["1f46e-1f3ff"],"isCanonical": true},":cop_tone4:":{"unicode":["1f46e-1f3fe"],"isCanonical": true},":cop_tone3:":{"unicode":["1f46e-1f3fd"],"isCanonical": true},":cop_tone2:":{"unicode":["1f46e-1f3fc"],"isCanonical": true},":cop_tone1:":{"unicode":["1f46e-1f3fb"],"isCanonical": true},":woman_tone5:":{"unicode":["1f469-1f3ff"],"isCanonical": true},":woman_tone4:":{"unicode":["1f469-1f3fe"],"isCanonical": true},":woman_tone3:":{"unicode":["1f469-1f3fd"],"isCanonical": true},":woman_tone2:":{"unicode":["1f469-1f3fc"],"isCanonical": true},":woman_tone1:":{"unicode":["1f469-1f3fb"],"isCanonical": true},":man_tone5:":{"unicode":["1f468-1f3ff"],"isCanonical": true},":man_tone4:":{"unicode":["1f468-1f3fe"],"isCanonical": true},":man_tone3:":{"unicode":["1f468-1f3fd"],"isCanonical": true},":man_tone2:":{"unicode":["1f468-1f3fc"],"isCanonical": true},":man_tone1:":{"unicode":["1f468-1f3fb"],"isCanonical": true},":girl_tone5:":{"unicode":["1f467-1f3ff"],"isCanonical": true},":girl_tone4:":{"unicode":["1f467-1f3fe"],"isCanonical": true},":girl_tone3:":{"unicode":["1f467-1f3fd"],"isCanonical": true},":girl_tone2:":{"unicode":["1f467-1f3fc"],"isCanonical": true},":girl_tone1:":{"unicode":["1f467-1f3fb"],"isCanonical": true},":boy_tone5:":{"unicode":["1f466-1f3ff"],"isCanonical": true},":boy_tone4:":{"unicode":["1f466-1f3fe"],"isCanonical": true},":boy_tone3:":{"unicode":["1f466-1f3fd"],"isCanonical": true},":boy_tone2:":{"unicode":["1f466-1f3fc"],"isCanonical": true},":boy_tone1:":{"unicode":["1f466-1f3fb"],"isCanonical": true},":open_hands_tone5:":{"unicode":["1f450-1f3ff"],"isCanonical": true},":open_hands_tone4:":{"unicode":["1f450-1f3fe"],"isCanonical": true},":open_hands_tone3:":{"unicode":["1f450-1f3fd"],"isCanonical": true},":open_hands_tone2:":{"unicode":["1f450-1f3fc"],"isCanonical": true},":open_hands_tone1:":{"unicode":["1f450-1f3fb"],"isCanonical": true},":clap_tone5:":{"unicode":["1f44f-1f3ff"],"isCanonical": true},":clap_tone4:":{"unicode":["1f44f-1f3fe"],"isCanonical": true},":clap_tone3:":{"unicode":["1f44f-1f3fd"],"isCanonical": true},":clap_tone2:":{"unicode":["1f44f-1f3fc"],"isCanonical": true},":clap_tone1:":{"unicode":["1f44f-1f3fb"],"isCanonical": true},":thumbsdown_tone5:":{"unicode":["1f44e-1f3ff"],"isCanonical": true},":-1_tone5:":{"unicode":["1f44e-1f3ff"],"isCanonical": false},":thumbdown_tone5:":{"unicode":["1f44e-1f3ff"],"isCanonical": false},":thumbsdown_tone4:":{"unicode":["1f44e-1f3fe"],"isCanonical": true},":-1_tone4:":{"unicode":["1f44e-1f3fe"],"isCanonical": false},":thumbdown_tone4:":{"unicode":["1f44e-1f3fe"],"isCanonical": false},":thumbsdown_tone3:":{"unicode":["1f44e-1f3fd"],"isCanonical": true},":-1_tone3:":{"unicode":["1f44e-1f3fd"],"isCanonical": false},":thumbdown_tone3:":{"unicode":["1f44e-1f3fd"],"isCanonical": false},":thumbsdown_tone2:":{"unicode":["1f44e-1f3fc"],"isCanonical": true},":-1_tone2:":{"unicode":["1f44e-1f3fc"],"isCanonical": false},":thumbdown_tone2:":{"unicode":["1f44e-1f3fc"],"isCanonical": false},":thumbsdown_tone1:":{"unicode":["1f44e-1f3fb"],"isCanonical": true},":-1_tone1:":{"unicode":["1f44e-1f3fb"],"isCanonical": false},":thumbdown_tone1:":{"unicode":["1f44e-1f3fb"],"isCanonical": false},":thumbsup_tone5:":{"unicode":["1f44d-1f3ff"],"isCanonical": true},":+1_tone5:":{"unicode":["1f44d-1f3ff"],"isCanonical": false},":thumbup_tone5:":{"unicode":["1f44d-1f3ff"],"isCanonical": false},":thumbsup_tone4:":{"unicode":["1f44d-1f3fe"],"isCanonical": true},":+1_tone4:":{"unicode":["1f44d-1f3fe"],"isCanonical": false},":thumbup_tone4:":{"unicode":["1f44d-1f3fe"],"isCanonical": false},":thumbsup_tone3:":{"unicode":["1f44d-1f3fd"],"isCanonical": true},":+1_tone3:":{"unicode":["1f44d-1f3fd"],"isCanonical": false},":thumbup_tone3:":{"unicode":["1f44d-1f3fd"],"isCanonical": false},":thumbsup_tone2:":{"unicode":["1f44d-1f3fc"],"isCanonical": true},":+1_tone2:":{"unicode":["1f44d-1f3fc"],"isCanonical": false},":thumbup_tone2:":{"unicode":["1f44d-1f3fc"],"isCanonical": false},":thumbsup_tone1:":{"unicode":["1f44d-1f3fb"],"isCanonical": true},":+1_tone1:":{"unicode":["1f44d-1f3fb"],"isCanonical": false},":thumbup_tone1:":{"unicode":["1f44d-1f3fb"],"isCanonical": false},":ok_hand_tone5:":{"unicode":["1f44c-1f3ff"],"isCanonical": true},":ok_hand_tone4:":{"unicode":["1f44c-1f3fe"],"isCanonical": true},":ok_hand_tone3:":{"unicode":["1f44c-1f3fd"],"isCanonical": true},":ok_hand_tone2:":{"unicode":["1f44c-1f3fc"],"isCanonical": true},":ok_hand_tone1:":{"unicode":["1f44c-1f3fb"],"isCanonical": true},":wave_tone5:":{"unicode":["1f44b-1f3ff"],"isCanonical": true},":wave_tone4:":{"unicode":["1f44b-1f3fe"],"isCanonical": true},":wave_tone3:":{"unicode":["1f44b-1f3fd"],"isCanonical": true},":wave_tone2:":{"unicode":["1f44b-1f3fc"],"isCanonical": true},":wave_tone1:":{"unicode":["1f44b-1f3fb"],"isCanonical": true},":punch_tone5:":{"unicode":["1f44a-1f3ff"],"isCanonical": true},":punch_tone4:":{"unicode":["1f44a-1f3fe"],"isCanonical": true},":punch_tone3:":{"unicode":["1f44a-1f3fd"],"isCanonical": true},":punch_tone2:":{"unicode":["1f44a-1f3fc"],"isCanonical": true},":punch_tone1:":{"unicode":["1f44a-1f3fb"],"isCanonical": true},":point_right_tone5:":{"unicode":["1f449-1f3ff"],"isCanonical": true},":point_right_tone4:":{"unicode":["1f449-1f3fe"],"isCanonical": true},":point_right_tone3:":{"unicode":["1f449-1f3fd"],"isCanonical": true},":point_right_tone2:":{"unicode":["1f449-1f3fc"],"isCanonical": true},":point_right_tone1:":{"unicode":["1f449-1f3fb"],"isCanonical": true},":point_left_tone5:":{"unicode":["1f448-1f3ff"],"isCanonical": true},":point_left_tone4:":{"unicode":["1f448-1f3fe"],"isCanonical": true},":point_left_tone3:":{"unicode":["1f448-1f3fd"],"isCanonical": true},":point_left_tone2:":{"unicode":["1f448-1f3fc"],"isCanonical": true},":point_left_tone1:":{"unicode":["1f448-1f3fb"],"isCanonical": true},":point_down_tone5:":{"unicode":["1f447-1f3ff"],"isCanonical": true},":point_down_tone4:":{"unicode":["1f447-1f3fe"],"isCanonical": true},":point_down_tone3:":{"unicode":["1f447-1f3fd"],"isCanonical": true},":point_down_tone2:":{"unicode":["1f447-1f3fc"],"isCanonical": true},":point_down_tone1:":{"unicode":["1f447-1f3fb"],"isCanonical": true},":point_up_2_tone5:":{"unicode":["1f446-1f3ff"],"isCanonical": true},":point_up_2_tone4:":{"unicode":["1f446-1f3fe"],"isCanonical": true},":point_up_2_tone3:":{"unicode":["1f446-1f3fd"],"isCanonical": true},":point_up_2_tone2:":{"unicode":["1f446-1f3fc"],"isCanonical": true},":point_up_2_tone1:":{"unicode":["1f446-1f3fb"],"isCanonical": true},":nose_tone5:":{"unicode":["1f443-1f3ff"],"isCanonical": true},":nose_tone4:":{"unicode":["1f443-1f3fe"],"isCanonical": true},":nose_tone3:":{"unicode":["1f443-1f3fd"],"isCanonical": true},":nose_tone2:":{"unicode":["1f443-1f3fc"],"isCanonical": true},":nose_tone1:":{"unicode":["1f443-1f3fb"],"isCanonical": true},":ear_tone5:":{"unicode":["1f442-1f3ff"],"isCanonical": true},":ear_tone4:":{"unicode":["1f442-1f3fe"],"isCanonical": true},":ear_tone3:":{"unicode":["1f442-1f3fd"],"isCanonical": true},":ear_tone2:":{"unicode":["1f442-1f3fc"],"isCanonical": true},":ear_tone1:":{"unicode":["1f442-1f3fb"],"isCanonical": true},":gay_pride_flag:":{"unicode":["1f3f3-1f308"],"isCanonical": true},":rainbow_flag:":{"unicode":["1f3f3-1f308"],"isCanonical": false},":lifter_tone5:":{"unicode":["1f3cb-1f3ff"],"isCanonical": true},":weight_lifter_tone5:":{"unicode":["1f3cb-1f3ff"],"isCanonical": false},":lifter_tone4:":{"unicode":["1f3cb-1f3fe"],"isCanonical": true},":weight_lifter_tone4:":{"unicode":["1f3cb-1f3fe"],"isCanonical": false},":lifter_tone3:":{"unicode":["1f3cb-1f3fd"],"isCanonical": true},":weight_lifter_tone3:":{"unicode":["1f3cb-1f3fd"],"isCanonical": false},":lifter_tone2:":{"unicode":["1f3cb-1f3fc"],"isCanonical": true},":weight_lifter_tone2:":{"unicode":["1f3cb-1f3fc"],"isCanonical": false},":lifter_tone1:":{"unicode":["1f3cb-1f3fb"],"isCanonical": true},":weight_lifter_tone1:":{"unicode":["1f3cb-1f3fb"],"isCanonical": false},":swimmer_tone5:":{"unicode":["1f3ca-1f3ff"],"isCanonical": true},":swimmer_tone4:":{"unicode":["1f3ca-1f3fe"],"isCanonical": true},":swimmer_tone3:":{"unicode":["1f3ca-1f3fd"],"isCanonical": true},":swimmer_tone2:":{"unicode":["1f3ca-1f3fc"],"isCanonical": true},":swimmer_tone1:":{"unicode":["1f3ca-1f3fb"],"isCanonical": true},":horse_racing_tone5:":{"unicode":["1f3c7-1f3ff"],"isCanonical": true},":horse_racing_tone4:":{"unicode":["1f3c7-1f3fe"],"isCanonical": true},":horse_racing_tone3:":{"unicode":["1f3c7-1f3fd"],"isCanonical": true},":horse_racing_tone2:":{"unicode":["1f3c7-1f3fc"],"isCanonical": true},":horse_racing_tone1:":{"unicode":["1f3c7-1f3fb"],"isCanonical": true},":surfer_tone5:":{"unicode":["1f3c4-1f3ff"],"isCanonical": true},":surfer_tone4:":{"unicode":["1f3c4-1f3fe"],"isCanonical": true},":surfer_tone3:":{"unicode":["1f3c4-1f3fd"],"isCanonical": true},":surfer_tone2:":{"unicode":["1f3c4-1f3fc"],"isCanonical": true},":surfer_tone1:":{"unicode":["1f3c4-1f3fb"],"isCanonical": true},":runner_tone5:":{"unicode":["1f3c3-1f3ff"],"isCanonical": true},":runner_tone4:":{"unicode":["1f3c3-1f3fe"],"isCanonical": true},":runner_tone3:":{"unicode":["1f3c3-1f3fd"],"isCanonical": true},":runner_tone2:":{"unicode":["1f3c3-1f3fc"],"isCanonical": true},":runner_tone1:":{"unicode":["1f3c3-1f3fb"],"isCanonical": true},":santa_tone5:":{"unicode":["1f385-1f3ff"],"isCanonical": true},":santa_tone4:":{"unicode":["1f385-1f3fe"],"isCanonical": true},":santa_tone3:":{"unicode":["1f385-1f3fd"],"isCanonical": true},":santa_tone2:":{"unicode":["1f385-1f3fc"],"isCanonical": true},":santa_tone1:":{"unicode":["1f385-1f3fb"],"isCanonical": true},":flag_zw:":{"unicode":["1f1ff-1f1fc"],"isCanonical": true},":zw:":{"unicode":["1f1ff-1f1fc"],"isCanonical": false},":flag_zm:":{"unicode":["1f1ff-1f1f2"],"isCanonical": true},":zm:":{"unicode":["1f1ff-1f1f2"],"isCanonical": false},":flag_za:":{"unicode":["1f1ff-1f1e6"],"isCanonical": true},":za:":{"unicode":["1f1ff-1f1e6"],"isCanonical": false},":flag_yt:":{"unicode":["1f1fe-1f1f9"],"isCanonical": true},":yt:":{"unicode":["1f1fe-1f1f9"],"isCanonical": false},":flag_ye:":{"unicode":["1f1fe-1f1ea"],"isCanonical": true},":ye:":{"unicode":["1f1fe-1f1ea"],"isCanonical": false},":flag_xk:":{"unicode":["1f1fd-1f1f0"],"isCanonical": true},":xk:":{"unicode":["1f1fd-1f1f0"],"isCanonical": false},":flag_ws:":{"unicode":["1f1fc-1f1f8"],"isCanonical": true},":ws:":{"unicode":["1f1fc-1f1f8"],"isCanonical": false},":flag_wf:":{"unicode":["1f1fc-1f1eb"],"isCanonical": true},":wf:":{"unicode":["1f1fc-1f1eb"],"isCanonical": false},":flag_vu:":{"unicode":["1f1fb-1f1fa"],"isCanonical": true},":vu:":{"unicode":["1f1fb-1f1fa"],"isCanonical": false},":flag_vn:":{"unicode":["1f1fb-1f1f3"],"isCanonical": true},":vn:":{"unicode":["1f1fb-1f1f3"],"isCanonical": false},":flag_vi:":{"unicode":["1f1fb-1f1ee"],"isCanonical": true},":vi:":{"unicode":["1f1fb-1f1ee"],"isCanonical": false},":flag_vg:":{"unicode":["1f1fb-1f1ec"],"isCanonical": true},":vg:":{"unicode":["1f1fb-1f1ec"],"isCanonical": false},":flag_ve:":{"unicode":["1f1fb-1f1ea"],"isCanonical": true},":ve:":{"unicode":["1f1fb-1f1ea"],"isCanonical": false},":flag_vc:":{"unicode":["1f1fb-1f1e8"],"isCanonical": true},":vc:":{"unicode":["1f1fb-1f1e8"],"isCanonical": false},":flag_va:":{"unicode":["1f1fb-1f1e6"],"isCanonical": true},":va:":{"unicode":["1f1fb-1f1e6"],"isCanonical": false},":flag_uz:":{"unicode":["1f1fa-1f1ff"],"isCanonical": true},":uz:":{"unicode":["1f1fa-1f1ff"],"isCanonical": false},":flag_uy:":{"unicode":["1f1fa-1f1fe"],"isCanonical": true},":uy:":{"unicode":["1f1fa-1f1fe"],"isCanonical": false},":flag_us:":{"unicode":["1f1fa-1f1f8"],"isCanonical": true},":us:":{"unicode":["1f1fa-1f1f8"],"isCanonical": false},":flag_um:":{"unicode":["1f1fa-1f1f2"],"isCanonical": true},":um:":{"unicode":["1f1fa-1f1f2"],"isCanonical": false},":flag_ug:":{"unicode":["1f1fa-1f1ec"],"isCanonical": true},":ug:":{"unicode":["1f1fa-1f1ec"],"isCanonical": false},":flag_ua:":{"unicode":["1f1fa-1f1e6"],"isCanonical": true},":ua:":{"unicode":["1f1fa-1f1e6"],"isCanonical": false},":flag_tz:":{"unicode":["1f1f9-1f1ff"],"isCanonical": true},":tz:":{"unicode":["1f1f9-1f1ff"],"isCanonical": false},":flag_tw:":{"unicode":["1f1f9-1f1fc"],"isCanonical": true},":tw:":{"unicode":["1f1f9-1f1fc"],"isCanonical": false},":flag_tv:":{"unicode":["1f1f9-1f1fb"],"isCanonical": true},":tuvalu:":{"unicode":["1f1f9-1f1fb"],"isCanonical": false},":flag_tt:":{"unicode":["1f1f9-1f1f9"],"isCanonical": true},":tt:":{"unicode":["1f1f9-1f1f9"],"isCanonical": false},":flag_tr:":{"unicode":["1f1f9-1f1f7"],"isCanonical": true},":tr:":{"unicode":["1f1f9-1f1f7"],"isCanonical": false},":flag_to:":{"unicode":["1f1f9-1f1f4"],"isCanonical": true},":to:":{"unicode":["1f1f9-1f1f4"],"isCanonical": false},":flag_tn:":{"unicode":["1f1f9-1f1f3"],"isCanonical": true},":tn:":{"unicode":["1f1f9-1f1f3"],"isCanonical": false},":flag_tm:":{"unicode":["1f1f9-1f1f2"],"isCanonical": true},":turkmenistan:":{"unicode":["1f1f9-1f1f2"],"isCanonical": false},":flag_tl:":{"unicode":["1f1f9-1f1f1"],"isCanonical": true},":tl:":{"unicode":["1f1f9-1f1f1"],"isCanonical": false},":flag_tk:":{"unicode":["1f1f9-1f1f0"],"isCanonical": true},":tk:":{"unicode":["1f1f9-1f1f0"],"isCanonical": false},":flag_tj:":{"unicode":["1f1f9-1f1ef"],"isCanonical": true},":tj:":{"unicode":["1f1f9-1f1ef"],"isCanonical": false},":flag_th:":{"unicode":["1f1f9-1f1ed"],"isCanonical": true},":th:":{"unicode":["1f1f9-1f1ed"],"isCanonical": false},":flag_tg:":{"unicode":["1f1f9-1f1ec"],"isCanonical": true},":tg:":{"unicode":["1f1f9-1f1ec"],"isCanonical": false},":flag_tf:":{"unicode":["1f1f9-1f1eb"],"isCanonical": true},":tf:":{"unicode":["1f1f9-1f1eb"],"isCanonical": false},":flag_td:":{"unicode":["1f1f9-1f1e9"],"isCanonical": true},":td:":{"unicode":["1f1f9-1f1e9"],"isCanonical": false},":flag_tc:":{"unicode":["1f1f9-1f1e8"],"isCanonical": true},":tc:":{"unicode":["1f1f9-1f1e8"],"isCanonical": false},":flag_ta:":{"unicode":["1f1f9-1f1e6"],"isCanonical": true},":ta:":{"unicode":["1f1f9-1f1e6"],"isCanonical": false},":flag_sz:":{"unicode":["1f1f8-1f1ff"],"isCanonical": true},":sz:":{"unicode":["1f1f8-1f1ff"],"isCanonical": false},":flag_sy:":{"unicode":["1f1f8-1f1fe"],"isCanonical": true},":sy:":{"unicode":["1f1f8-1f1fe"],"isCanonical": false},":flag_sx:":{"unicode":["1f1f8-1f1fd"],"isCanonical": true},":sx:":{"unicode":["1f1f8-1f1fd"],"isCanonical": false},":flag_sv:":{"unicode":["1f1f8-1f1fb"],"isCanonical": true},":sv:":{"unicode":["1f1f8-1f1fb"],"isCanonical": false},":flag_st:":{"unicode":["1f1f8-1f1f9"],"isCanonical": true},":st:":{"unicode":["1f1f8-1f1f9"],"isCanonical": false},":flag_ss:":{"unicode":["1f1f8-1f1f8"],"isCanonical": true},":ss:":{"unicode":["1f1f8-1f1f8"],"isCanonical": false},":flag_sr:":{"unicode":["1f1f8-1f1f7"],"isCanonical": true},":sr:":{"unicode":["1f1f8-1f1f7"],"isCanonical": false},":flag_so:":{"unicode":["1f1f8-1f1f4"],"isCanonical": true},":so:":{"unicode":["1f1f8-1f1f4"],"isCanonical": false},":flag_sn:":{"unicode":["1f1f8-1f1f3"],"isCanonical": true},":sn:":{"unicode":["1f1f8-1f1f3"],"isCanonical": false},":flag_sm:":{"unicode":["1f1f8-1f1f2"],"isCanonical": true},":sm:":{"unicode":["1f1f8-1f1f2"],"isCanonical": false},":flag_sl:":{"unicode":["1f1f8-1f1f1"],"isCanonical": true},":sl:":{"unicode":["1f1f8-1f1f1"],"isCanonical": false},":flag_sk:":{"unicode":["1f1f8-1f1f0"],"isCanonical": true},":sk:":{"unicode":["1f1f8-1f1f0"],"isCanonical": false},":flag_sj:":{"unicode":["1f1f8-1f1ef"],"isCanonical": true},":sj:":{"unicode":["1f1f8-1f1ef"],"isCanonical": false},":flag_si:":{"unicode":["1f1f8-1f1ee"],"isCanonical": true},":si:":{"unicode":["1f1f8-1f1ee"],"isCanonical": false},":flag_sh:":{"unicode":["1f1f8-1f1ed"],"isCanonical": true},":sh:":{"unicode":["1f1f8-1f1ed"],"isCanonical": false},":flag_sg:":{"unicode":["1f1f8-1f1ec"],"isCanonical": true},":sg:":{"unicode":["1f1f8-1f1ec"],"isCanonical": false},":flag_se:":{"unicode":["1f1f8-1f1ea"],"isCanonical": true},":se:":{"unicode":["1f1f8-1f1ea"],"isCanonical": false},":flag_sd:":{"unicode":["1f1f8-1f1e9"],"isCanonical": true},":sd:":{"unicode":["1f1f8-1f1e9"],"isCanonical": false},":flag_sc:":{"unicode":["1f1f8-1f1e8"],"isCanonical": true},":sc:":{"unicode":["1f1f8-1f1e8"],"isCanonical": false},":flag_sb:":{"unicode":["1f1f8-1f1e7"],"isCanonical": true},":sb:":{"unicode":["1f1f8-1f1e7"],"isCanonical": false},":flag_sa:":{"unicode":["1f1f8-1f1e6"],"isCanonical": true},":saudiarabia:":{"unicode":["1f1f8-1f1e6"],"isCanonical": false},":saudi:":{"unicode":["1f1f8-1f1e6"],"isCanonical": false},":flag_rw:":{"unicode":["1f1f7-1f1fc"],"isCanonical": true},":rw:":{"unicode":["1f1f7-1f1fc"],"isCanonical": false},":flag_ru:":{"unicode":["1f1f7-1f1fa"],"isCanonical": true},":ru:":{"unicode":["1f1f7-1f1fa"],"isCanonical": false},":flag_rs:":{"unicode":["1f1f7-1f1f8"],"isCanonical": true},":rs:":{"unicode":["1f1f7-1f1f8"],"isCanonical": false},":flag_ro:":{"unicode":["1f1f7-1f1f4"],"isCanonical": true},":ro:":{"unicode":["1f1f7-1f1f4"],"isCanonical": false},":flag_re:":{"unicode":["1f1f7-1f1ea"],"isCanonical": true},":re:":{"unicode":["1f1f7-1f1ea"],"isCanonical": false},":flag_qa:":{"unicode":["1f1f6-1f1e6"],"isCanonical": true},":qa:":{"unicode":["1f1f6-1f1e6"],"isCanonical": false},":flag_py:":{"unicode":["1f1f5-1f1fe"],"isCanonical": true},":py:":{"unicode":["1f1f5-1f1fe"],"isCanonical": false},":flag_pw:":{"unicode":["1f1f5-1f1fc"],"isCanonical": true},":pw:":{"unicode":["1f1f5-1f1fc"],"isCanonical": false},":flag_pt:":{"unicode":["1f1f5-1f1f9"],"isCanonical": true},":pt:":{"unicode":["1f1f5-1f1f9"],"isCanonical": false},":flag_ps:":{"unicode":["1f1f5-1f1f8"],"isCanonical": true},":ps:":{"unicode":["1f1f5-1f1f8"],"isCanonical": false},":flag_pr:":{"unicode":["1f1f5-1f1f7"],"isCanonical": true},":pr:":{"unicode":["1f1f5-1f1f7"],"isCanonical": false},":flag_pn:":{"unicode":["1f1f5-1f1f3"],"isCanonical": true},":pn:":{"unicode":["1f1f5-1f1f3"],"isCanonical": false},":flag_pm:":{"unicode":["1f1f5-1f1f2"],"isCanonical": true},":pm:":{"unicode":["1f1f5-1f1f2"],"isCanonical": false},":flag_pl:":{"unicode":["1f1f5-1f1f1"],"isCanonical": true},":pl:":{"unicode":["1f1f5-1f1f1"],"isCanonical": false},":flag_pk:":{"unicode":["1f1f5-1f1f0"],"isCanonical": true},":pk:":{"unicode":["1f1f5-1f1f0"],"isCanonical": false},":flag_ph:":{"unicode":["1f1f5-1f1ed"],"isCanonical": true},":ph:":{"unicode":["1f1f5-1f1ed"],"isCanonical": false},":flag_pg:":{"unicode":["1f1f5-1f1ec"],"isCanonical": true},":pg:":{"unicode":["1f1f5-1f1ec"],"isCanonical": false},":flag_pf:":{"unicode":["1f1f5-1f1eb"],"isCanonical": true},":pf:":{"unicode":["1f1f5-1f1eb"],"isCanonical": false},":flag_pe:":{"unicode":["1f1f5-1f1ea"],"isCanonical": true},":pe:":{"unicode":["1f1f5-1f1ea"],"isCanonical": false},":flag_pa:":{"unicode":["1f1f5-1f1e6"],"isCanonical": true},":pa:":{"unicode":["1f1f5-1f1e6"],"isCanonical": false},":flag_om:":{"unicode":["1f1f4-1f1f2"],"isCanonical": true},":om:":{"unicode":["1f1f4-1f1f2"],"isCanonical": false},":flag_nz:":{"unicode":["1f1f3-1f1ff"],"isCanonical": true},":nz:":{"unicode":["1f1f3-1f1ff"],"isCanonical": false},":flag_nu:":{"unicode":["1f1f3-1f1fa"],"isCanonical": true},":nu:":{"unicode":["1f1f3-1f1fa"],"isCanonical": false},":flag_nr:":{"unicode":["1f1f3-1f1f7"],"isCanonical": true},":nr:":{"unicode":["1f1f3-1f1f7"],"isCanonical": false},":flag_np:":{"unicode":["1f1f3-1f1f5"],"isCanonical": true},":np:":{"unicode":["1f1f3-1f1f5"],"isCanonical": false},":flag_no:":{"unicode":["1f1f3-1f1f4"],"isCanonical": true},":no:":{"unicode":["1f1f3-1f1f4"],"isCanonical": false},":flag_nl:":{"unicode":["1f1f3-1f1f1"],"isCanonical": true},":nl:":{"unicode":["1f1f3-1f1f1"],"isCanonical": false},":flag_ni:":{"unicode":["1f1f3-1f1ee"],"isCanonical": true},":ni:":{"unicode":["1f1f3-1f1ee"],"isCanonical": false},":flag_ng:":{"unicode":["1f1f3-1f1ec"],"isCanonical": true},":nigeria:":{"unicode":["1f1f3-1f1ec"],"isCanonical": false},":flag_nf:":{"unicode":["1f1f3-1f1eb"],"isCanonical": true},":nf:":{"unicode":["1f1f3-1f1eb"],"isCanonical": false},":flag_ne:":{"unicode":["1f1f3-1f1ea"],"isCanonical": true},":ne:":{"unicode":["1f1f3-1f1ea"],"isCanonical": false},":flag_nc:":{"unicode":["1f1f3-1f1e8"],"isCanonical": true},":nc:":{"unicode":["1f1f3-1f1e8"],"isCanonical": false},":flag_na:":{"unicode":["1f1f3-1f1e6"],"isCanonical": true},":na:":{"unicode":["1f1f3-1f1e6"],"isCanonical": false},":flag_mz:":{"unicode":["1f1f2-1f1ff"],"isCanonical": true},":mz:":{"unicode":["1f1f2-1f1ff"],"isCanonical": false},":flag_my:":{"unicode":["1f1f2-1f1fe"],"isCanonical": true},":my:":{"unicode":["1f1f2-1f1fe"],"isCanonical": false},":flag_mx:":{"unicode":["1f1f2-1f1fd"],"isCanonical": true},":mx:":{"unicode":["1f1f2-1f1fd"],"isCanonical": false},":flag_mw:":{"unicode":["1f1f2-1f1fc"],"isCanonical": true},":mw:":{"unicode":["1f1f2-1f1fc"],"isCanonical": false},":flag_mv:":{"unicode":["1f1f2-1f1fb"],"isCanonical": true},":mv:":{"unicode":["1f1f2-1f1fb"],"isCanonical": false},":flag_mu:":{"unicode":["1f1f2-1f1fa"],"isCanonical": true},":mu:":{"unicode":["1f1f2-1f1fa"],"isCanonical": false},":flag_mt:":{"unicode":["1f1f2-1f1f9"],"isCanonical": true},":mt:":{"unicode":["1f1f2-1f1f9"],"isCanonical": false},":flag_ms:":{"unicode":["1f1f2-1f1f8"],"isCanonical": true},":ms:":{"unicode":["1f1f2-1f1f8"],"isCanonical": false},":flag_mr:":{"unicode":["1f1f2-1f1f7"],"isCanonical": true},":mr:":{"unicode":["1f1f2-1f1f7"],"isCanonical": false},":flag_mq:":{"unicode":["1f1f2-1f1f6"],"isCanonical": true},":mq:":{"unicode":["1f1f2-1f1f6"],"isCanonical": false},":flag_mp:":{"unicode":["1f1f2-1f1f5"],"isCanonical": true},":mp:":{"unicode":["1f1f2-1f1f5"],"isCanonical": false},":flag_mo:":{"unicode":["1f1f2-1f1f4"],"isCanonical": true},":mo:":{"unicode":["1f1f2-1f1f4"],"isCanonical": false},":flag_mn:":{"unicode":["1f1f2-1f1f3"],"isCanonical": true},":mn:":{"unicode":["1f1f2-1f1f3"],"isCanonical": false},":flag_mm:":{"unicode":["1f1f2-1f1f2"],"isCanonical": true},":mm:":{"unicode":["1f1f2-1f1f2"],"isCanonical": false},":flag_ml:":{"unicode":["1f1f2-1f1f1"],"isCanonical": true},":ml:":{"unicode":["1f1f2-1f1f1"],"isCanonical": false},":flag_mk:":{"unicode":["1f1f2-1f1f0"],"isCanonical": true},":mk:":{"unicode":["1f1f2-1f1f0"],"isCanonical": false},":flag_mh:":{"unicode":["1f1f2-1f1ed"],"isCanonical": true},":mh:":{"unicode":["1f1f2-1f1ed"],"isCanonical": false},":flag_mg:":{"unicode":["1f1f2-1f1ec"],"isCanonical": true},":mg:":{"unicode":["1f1f2-1f1ec"],"isCanonical": false},":flag_mf:":{"unicode":["1f1f2-1f1eb"],"isCanonical": true},":mf:":{"unicode":["1f1f2-1f1eb"],"isCanonical": false},":flag_me:":{"unicode":["1f1f2-1f1ea"],"isCanonical": true},":me:":{"unicode":["1f1f2-1f1ea"],"isCanonical": false},":flag_md:":{"unicode":["1f1f2-1f1e9"],"isCanonical": true},":md:":{"unicode":["1f1f2-1f1e9"],"isCanonical": false},":flag_mc:":{"unicode":["1f1f2-1f1e8"],"isCanonical": true},":mc:":{"unicode":["1f1f2-1f1e8"],"isCanonical": false},":flag_ma:":{"unicode":["1f1f2-1f1e6"],"isCanonical": true},":ma:":{"unicode":["1f1f2-1f1e6"],"isCanonical": false},":flag_ly:":{"unicode":["1f1f1-1f1fe"],"isCanonical": true},":ly:":{"unicode":["1f1f1-1f1fe"],"isCanonical": false},":flag_lv:":{"unicode":["1f1f1-1f1fb"],"isCanonical": true},":lv:":{"unicode":["1f1f1-1f1fb"],"isCanonical": false},":flag_lu:":{"unicode":["1f1f1-1f1fa"],"isCanonical": true},":lu:":{"unicode":["1f1f1-1f1fa"],"isCanonical": false},":flag_lt:":{"unicode":["1f1f1-1f1f9"],"isCanonical": true},":lt:":{"unicode":["1f1f1-1f1f9"],"isCanonical": false},":flag_ls:":{"unicode":["1f1f1-1f1f8"],"isCanonical": true},":ls:":{"unicode":["1f1f1-1f1f8"],"isCanonical": false},":flag_lr:":{"unicode":["1f1f1-1f1f7"],"isCanonical": true},":lr:":{"unicode":["1f1f1-1f1f7"],"isCanonical": false},":flag_lk:":{"unicode":["1f1f1-1f1f0"],"isCanonical": true},":lk:":{"unicode":["1f1f1-1f1f0"],"isCanonical": false},":flag_li:":{"unicode":["1f1f1-1f1ee"],"isCanonical": true},":li:":{"unicode":["1f1f1-1f1ee"],"isCanonical": false},":flag_lc:":{"unicode":["1f1f1-1f1e8"],"isCanonical": true},":lc:":{"unicode":["1f1f1-1f1e8"],"isCanonical": false},":flag_lb:":{"unicode":["1f1f1-1f1e7"],"isCanonical": true},":lb:":{"unicode":["1f1f1-1f1e7"],"isCanonical": false},":flag_la:":{"unicode":["1f1f1-1f1e6"],"isCanonical": true},":la:":{"unicode":["1f1f1-1f1e6"],"isCanonical": false},":flag_kz:":{"unicode":["1f1f0-1f1ff"],"isCanonical": true},":kz:":{"unicode":["1f1f0-1f1ff"],"isCanonical": false},":flag_ky:":{"unicode":["1f1f0-1f1fe"],"isCanonical": true},":ky:":{"unicode":["1f1f0-1f1fe"],"isCanonical": false},":flag_kw:":{"unicode":["1f1f0-1f1fc"],"isCanonical": true},":kw:":{"unicode":["1f1f0-1f1fc"],"isCanonical": false},":flag_kr:":{"unicode":["1f1f0-1f1f7"],"isCanonical": true},":kr:":{"unicode":["1f1f0-1f1f7"],"isCanonical": false},":flag_kp:":{"unicode":["1f1f0-1f1f5"],"isCanonical": true},":kp:":{"unicode":["1f1f0-1f1f5"],"isCanonical": false},":flag_kn:":{"unicode":["1f1f0-1f1f3"],"isCanonical": true},":kn:":{"unicode":["1f1f0-1f1f3"],"isCanonical": false},":flag_km:":{"unicode":["1f1f0-1f1f2"],"isCanonical": true},":km:":{"unicode":["1f1f0-1f1f2"],"isCanonical": false},":flag_ki:":{"unicode":["1f1f0-1f1ee"],"isCanonical": true},":ki:":{"unicode":["1f1f0-1f1ee"],"isCanonical": false},":flag_kh:":{"unicode":["1f1f0-1f1ed"],"isCanonical": true},":kh:":{"unicode":["1f1f0-1f1ed"],"isCanonical": false},":flag_kg:":{"unicode":["1f1f0-1f1ec"],"isCanonical": true},":kg:":{"unicode":["1f1f0-1f1ec"],"isCanonical": false},":flag_ke:":{"unicode":["1f1f0-1f1ea"],"isCanonical": true},":ke:":{"unicode":["1f1f0-1f1ea"],"isCanonical": false},":flag_jp:":{"unicode":["1f1ef-1f1f5"],"isCanonical": true},":jp:":{"unicode":["1f1ef-1f1f5"],"isCanonical": false},":flag_jo:":{"unicode":["1f1ef-1f1f4"],"isCanonical": true},":jo:":{"unicode":["1f1ef-1f1f4"],"isCanonical": false},":flag_jm:":{"unicode":["1f1ef-1f1f2"],"isCanonical": true},":jm:":{"unicode":["1f1ef-1f1f2"],"isCanonical": false},":flag_je:":{"unicode":["1f1ef-1f1ea"],"isCanonical": true},":je:":{"unicode":["1f1ef-1f1ea"],"isCanonical": false},":flag_it:":{"unicode":["1f1ee-1f1f9"],"isCanonical": true},":it:":{"unicode":["1f1ee-1f1f9"],"isCanonical": false},":flag_is:":{"unicode":["1f1ee-1f1f8"],"isCanonical": true},":is:":{"unicode":["1f1ee-1f1f8"],"isCanonical": false},":flag_ir:":{"unicode":["1f1ee-1f1f7"],"isCanonical": true},":ir:":{"unicode":["1f1ee-1f1f7"],"isCanonical": false},":flag_iq:":{"unicode":["1f1ee-1f1f6"],"isCanonical": true},":iq:":{"unicode":["1f1ee-1f1f6"],"isCanonical": false},":flag_io:":{"unicode":["1f1ee-1f1f4"],"isCanonical": true},":io:":{"unicode":["1f1ee-1f1f4"],"isCanonical": false},":flag_in:":{"unicode":["1f1ee-1f1f3"],"isCanonical": true},":in:":{"unicode":["1f1ee-1f1f3"],"isCanonical": false},":flag_im:":{"unicode":["1f1ee-1f1f2"],"isCanonical": true},":im:":{"unicode":["1f1ee-1f1f2"],"isCanonical": false},":flag_il:":{"unicode":["1f1ee-1f1f1"],"isCanonical": true},":il:":{"unicode":["1f1ee-1f1f1"],"isCanonical": false},":flag_ie:":{"unicode":["1f1ee-1f1ea"],"isCanonical": true},":ie:":{"unicode":["1f1ee-1f1ea"],"isCanonical": false},":flag_id:":{"unicode":["1f1ee-1f1e9"],"isCanonical": true},":indonesia:":{"unicode":["1f1ee-1f1e9"],"isCanonical": false},":flag_ic:":{"unicode":["1f1ee-1f1e8"],"isCanonical": true},":ic:":{"unicode":["1f1ee-1f1e8"],"isCanonical": false},":flag_hu:":{"unicode":["1f1ed-1f1fa"],"isCanonical": true},":hu:":{"unicode":["1f1ed-1f1fa"],"isCanonical": false},":flag_ht:":{"unicode":["1f1ed-1f1f9"],"isCanonical": true},":ht:":{"unicode":["1f1ed-1f1f9"],"isCanonical": false},":flag_hr:":{"unicode":["1f1ed-1f1f7"],"isCanonical": true},":hr:":{"unicode":["1f1ed-1f1f7"],"isCanonical": false},":flag_hn:":{"unicode":["1f1ed-1f1f3"],"isCanonical": true},":hn:":{"unicode":["1f1ed-1f1f3"],"isCanonical": false},":flag_hm:":{"unicode":["1f1ed-1f1f2"],"isCanonical": true},":hm:":{"unicode":["1f1ed-1f1f2"],"isCanonical": false},":flag_hk:":{"unicode":["1f1ed-1f1f0"],"isCanonical": true},":hk:":{"unicode":["1f1ed-1f1f0"],"isCanonical": false},":flag_gy:":{"unicode":["1f1ec-1f1fe"],"isCanonical": true},":gy:":{"unicode":["1f1ec-1f1fe"],"isCanonical": false},":flag_gw:":{"unicode":["1f1ec-1f1fc"],"isCanonical": true},":gw:":{"unicode":["1f1ec-1f1fc"],"isCanonical": false},":flag_gu:":{"unicode":["1f1ec-1f1fa"],"isCanonical": true},":gu:":{"unicode":["1f1ec-1f1fa"],"isCanonical": false},":flag_gt:":{"unicode":["1f1ec-1f1f9"],"isCanonical": true},":gt:":{"unicode":["1f1ec-1f1f9"],"isCanonical": false},":flag_gs:":{"unicode":["1f1ec-1f1f8"],"isCanonical": true},":gs:":{"unicode":["1f1ec-1f1f8"],"isCanonical": false},":flag_gr:":{"unicode":["1f1ec-1f1f7"],"isCanonical": true},":gr:":{"unicode":["1f1ec-1f1f7"],"isCanonical": false},":flag_gq:":{"unicode":["1f1ec-1f1f6"],"isCanonical": true},":gq:":{"unicode":["1f1ec-1f1f6"],"isCanonical": false},":flag_gp:":{"unicode":["1f1ec-1f1f5"],"isCanonical": true},":gp:":{"unicode":["1f1ec-1f1f5"],"isCanonical": false},":flag_gn:":{"unicode":["1f1ec-1f1f3"],"isCanonical": true},":gn:":{"unicode":["1f1ec-1f1f3"],"isCanonical": false},":flag_gm:":{"unicode":["1f1ec-1f1f2"],"isCanonical": true},":gm:":{"unicode":["1f1ec-1f1f2"],"isCanonical": false},":flag_gl:":{"unicode":["1f1ec-1f1f1"],"isCanonical": true},":gl:":{"unicode":["1f1ec-1f1f1"],"isCanonical": false},":flag_gi:":{"unicode":["1f1ec-1f1ee"],"isCanonical": true},":gi:":{"unicode":["1f1ec-1f1ee"],"isCanonical": false},":flag_gh:":{"unicode":["1f1ec-1f1ed"],"isCanonical": true},":gh:":{"unicode":["1f1ec-1f1ed"],"isCanonical": false},":flag_gg:":{"unicode":["1f1ec-1f1ec"],"isCanonical": true},":gg:":{"unicode":["1f1ec-1f1ec"],"isCanonical": false},":flag_gf:":{"unicode":["1f1ec-1f1eb"],"isCanonical": true},":gf:":{"unicode":["1f1ec-1f1eb"],"isCanonical": false},":flag_ge:":{"unicode":["1f1ec-1f1ea"],"isCanonical": true},":ge:":{"unicode":["1f1ec-1f1ea"],"isCanonical": false},":flag_gd:":{"unicode":["1f1ec-1f1e9"],"isCanonical": true},":gd:":{"unicode":["1f1ec-1f1e9"],"isCanonical": false},":flag_gb:":{"unicode":["1f1ec-1f1e7"],"isCanonical": true},":gb:":{"unicode":["1f1ec-1f1e7"],"isCanonical": false},":flag_ga:":{"unicode":["1f1ec-1f1e6"],"isCanonical": true},":ga:":{"unicode":["1f1ec-1f1e6"],"isCanonical": false},":flag_fr:":{"unicode":["1f1eb-1f1f7"],"isCanonical": true},":fr:":{"unicode":["1f1eb-1f1f7"],"isCanonical": false},":flag_fo:":{"unicode":["1f1eb-1f1f4"],"isCanonical": true},":fo:":{"unicode":["1f1eb-1f1f4"],"isCanonical": false},":flag_fm:":{"unicode":["1f1eb-1f1f2"],"isCanonical": true},":fm:":{"unicode":["1f1eb-1f1f2"],"isCanonical": false},":flag_fk:":{"unicode":["1f1eb-1f1f0"],"isCanonical": true},":fk:":{"unicode":["1f1eb-1f1f0"],"isCanonical": false},":flag_fj:":{"unicode":["1f1eb-1f1ef"],"isCanonical": true},":fj:":{"unicode":["1f1eb-1f1ef"],"isCanonical": false},":flag_fi:":{"unicode":["1f1eb-1f1ee"],"isCanonical": true},":fi:":{"unicode":["1f1eb-1f1ee"],"isCanonical": false},":flag_eu:":{"unicode":["1f1ea-1f1fa"],"isCanonical": true},":eu:":{"unicode":["1f1ea-1f1fa"],"isCanonical": false},":flag_et:":{"unicode":["1f1ea-1f1f9"],"isCanonical": true},":et:":{"unicode":["1f1ea-1f1f9"],"isCanonical": false},":flag_es:":{"unicode":["1f1ea-1f1f8"],"isCanonical": true},":es:":{"unicode":["1f1ea-1f1f8"],"isCanonical": false},":flag_er:":{"unicode":["1f1ea-1f1f7"],"isCanonical": true},":er:":{"unicode":["1f1ea-1f1f7"],"isCanonical": false},":flag_eh:":{"unicode":["1f1ea-1f1ed"],"isCanonical": true},":eh:":{"unicode":["1f1ea-1f1ed"],"isCanonical": false},":flag_eg:":{"unicode":["1f1ea-1f1ec"],"isCanonical": true},":eg:":{"unicode":["1f1ea-1f1ec"],"isCanonical": false},":flag_ee:":{"unicode":["1f1ea-1f1ea"],"isCanonical": true},":ee:":{"unicode":["1f1ea-1f1ea"],"isCanonical": false},":flag_ec:":{"unicode":["1f1ea-1f1e8"],"isCanonical": true},":ec:":{"unicode":["1f1ea-1f1e8"],"isCanonical": false},":flag_ea:":{"unicode":["1f1ea-1f1e6"],"isCanonical": true},":ea:":{"unicode":["1f1ea-1f1e6"],"isCanonical": false},":flag_dz:":{"unicode":["1f1e9-1f1ff"],"isCanonical": true},":dz:":{"unicode":["1f1e9-1f1ff"],"isCanonical": false},":flag_do:":{"unicode":["1f1e9-1f1f4"],"isCanonical": true},":do:":{"unicode":["1f1e9-1f1f4"],"isCanonical": false},":flag_dm:":{"unicode":["1f1e9-1f1f2"],"isCanonical": true},":dm:":{"unicode":["1f1e9-1f1f2"],"isCanonical": false},":flag_dk:":{"unicode":["1f1e9-1f1f0"],"isCanonical": true},":dk:":{"unicode":["1f1e9-1f1f0"],"isCanonical": false},":flag_dj:":{"unicode":["1f1e9-1f1ef"],"isCanonical": true},":dj:":{"unicode":["1f1e9-1f1ef"],"isCanonical": false},":flag_dg:":{"unicode":["1f1e9-1f1ec"],"isCanonical": true},":dg:":{"unicode":["1f1e9-1f1ec"],"isCanonical": false},":flag_de:":{"unicode":["1f1e9-1f1ea"],"isCanonical": true},":de:":{"unicode":["1f1e9-1f1ea"],"isCanonical": false},":flag_cz:":{"unicode":["1f1e8-1f1ff"],"isCanonical": true},":cz:":{"unicode":["1f1e8-1f1ff"],"isCanonical": false},":flag_cy:":{"unicode":["1f1e8-1f1fe"],"isCanonical": true},":cy:":{"unicode":["1f1e8-1f1fe"],"isCanonical": false},":flag_cx:":{"unicode":["1f1e8-1f1fd"],"isCanonical": true},":cx:":{"unicode":["1f1e8-1f1fd"],"isCanonical": false},":flag_cw:":{"unicode":["1f1e8-1f1fc"],"isCanonical": true},":cw:":{"unicode":["1f1e8-1f1fc"],"isCanonical": false},":flag_cv:":{"unicode":["1f1e8-1f1fb"],"isCanonical": true},":cv:":{"unicode":["1f1e8-1f1fb"],"isCanonical": false},":flag_cu:":{"unicode":["1f1e8-1f1fa"],"isCanonical": true},":cu:":{"unicode":["1f1e8-1f1fa"],"isCanonical": false},":flag_cr:":{"unicode":["1f1e8-1f1f7"],"isCanonical": true},":cr:":{"unicode":["1f1e8-1f1f7"],"isCanonical": false},":flag_cp:":{"unicode":["1f1e8-1f1f5"],"isCanonical": true},":cp:":{"unicode":["1f1e8-1f1f5"],"isCanonical": false},":flag_co:":{"unicode":["1f1e8-1f1f4"],"isCanonical": true},":co:":{"unicode":["1f1e8-1f1f4"],"isCanonical": false},":flag_cn:":{"unicode":["1f1e8-1f1f3"],"isCanonical": true},":cn:":{"unicode":["1f1e8-1f1f3"],"isCanonical": false},":flag_cm:":{"unicode":["1f1e8-1f1f2"],"isCanonical": true},":cm:":{"unicode":["1f1e8-1f1f2"],"isCanonical": false},":flag_cl:":{"unicode":["1f1e8-1f1f1"],"isCanonical": true},":chile:":{"unicode":["1f1e8-1f1f1"],"isCanonical": false},":flag_ck:":{"unicode":["1f1e8-1f1f0"],"isCanonical": true},":ck:":{"unicode":["1f1e8-1f1f0"],"isCanonical": false},":flag_ci:":{"unicode":["1f1e8-1f1ee"],"isCanonical": true},":ci:":{"unicode":["1f1e8-1f1ee"],"isCanonical": false},":flag_ch:":{"unicode":["1f1e8-1f1ed"],"isCanonical": true},":ch:":{"unicode":["1f1e8-1f1ed"],"isCanonical": false},":flag_cg:":{"unicode":["1f1e8-1f1ec"],"isCanonical": true},":cg:":{"unicode":["1f1e8-1f1ec"],"isCanonical": false},":flag_cf:":{"unicode":["1f1e8-1f1eb"],"isCanonical": true},":cf:":{"unicode":["1f1e8-1f1eb"],"isCanonical": false},":flag_cd:":{"unicode":["1f1e8-1f1e9"],"isCanonical": true},":congo:":{"unicode":["1f1e8-1f1e9"],"isCanonical": false},":flag_cc:":{"unicode":["1f1e8-1f1e8"],"isCanonical": true},":cc:":{"unicode":["1f1e8-1f1e8"],"isCanonical": false},":flag_ca:":{"unicode":["1f1e8-1f1e6"],"isCanonical": true},":ca:":{"unicode":["1f1e8-1f1e6"],"isCanonical": false},":flag_bz:":{"unicode":["1f1e7-1f1ff"],"isCanonical": true},":bz:":{"unicode":["1f1e7-1f1ff"],"isCanonical": false},":flag_by:":{"unicode":["1f1e7-1f1fe"],"isCanonical": true},":by:":{"unicode":["1f1e7-1f1fe"],"isCanonical": false},":flag_bw:":{"unicode":["1f1e7-1f1fc"],"isCanonical": true},":bw:":{"unicode":["1f1e7-1f1fc"],"isCanonical": false},":flag_bv:":{"unicode":["1f1e7-1f1fb"],"isCanonical": true},":bv:":{"unicode":["1f1e7-1f1fb"],"isCanonical": false},":flag_bt:":{"unicode":["1f1e7-1f1f9"],"isCanonical": true},":bt:":{"unicode":["1f1e7-1f1f9"],"isCanonical": false},":flag_bs:":{"unicode":["1f1e7-1f1f8"],"isCanonical": true},":bs:":{"unicode":["1f1e7-1f1f8"],"isCanonical": false},":flag_br:":{"unicode":["1f1e7-1f1f7"],"isCanonical": true},":br:":{"unicode":["1f1e7-1f1f7"],"isCanonical": false},":flag_bq:":{"unicode":["1f1e7-1f1f6"],"isCanonical": true},":bq:":{"unicode":["1f1e7-1f1f6"],"isCanonical": false},":flag_bo:":{"unicode":["1f1e7-1f1f4"],"isCanonical": true},":bo:":{"unicode":["1f1e7-1f1f4"],"isCanonical": false},":flag_bn:":{"unicode":["1f1e7-1f1f3"],"isCanonical": true},":bn:":{"unicode":["1f1e7-1f1f3"],"isCanonical": false},":flag_bm:":{"unicode":["1f1e7-1f1f2"],"isCanonical": true},":bm:":{"unicode":["1f1e7-1f1f2"],"isCanonical": false},":flag_bl:":{"unicode":["1f1e7-1f1f1"],"isCanonical": true},":bl:":{"unicode":["1f1e7-1f1f1"],"isCanonical": false},":flag_bj:":{"unicode":["1f1e7-1f1ef"],"isCanonical": true},":bj:":{"unicode":["1f1e7-1f1ef"],"isCanonical": false},":flag_bi:":{"unicode":["1f1e7-1f1ee"],"isCanonical": true},":bi:":{"unicode":["1f1e7-1f1ee"],"isCanonical": false},":flag_bh:":{"unicode":["1f1e7-1f1ed"],"isCanonical": true},":bh:":{"unicode":["1f1e7-1f1ed"],"isCanonical": false},":flag_bg:":{"unicode":["1f1e7-1f1ec"],"isCanonical": true},":bg:":{"unicode":["1f1e7-1f1ec"],"isCanonical": false},":flag_bf:":{"unicode":["1f1e7-1f1eb"],"isCanonical": true},":bf:":{"unicode":["1f1e7-1f1eb"],"isCanonical": false},":flag_be:":{"unicode":["1f1e7-1f1ea"],"isCanonical": true},":be:":{"unicode":["1f1e7-1f1ea"],"isCanonical": false},":flag_bd:":{"unicode":["1f1e7-1f1e9"],"isCanonical": true},":bd:":{"unicode":["1f1e7-1f1e9"],"isCanonical": false},":flag_bb:":{"unicode":["1f1e7-1f1e7"],"isCanonical": true},":bb:":{"unicode":["1f1e7-1f1e7"],"isCanonical": false},":flag_ba:":{"unicode":["1f1e7-1f1e6"],"isCanonical": true},":ba:":{"unicode":["1f1e7-1f1e6"],"isCanonical": false},":flag_az:":{"unicode":["1f1e6-1f1ff"],"isCanonical": true},":az:":{"unicode":["1f1e6-1f1ff"],"isCanonical": false},":flag_ax:":{"unicode":["1f1e6-1f1fd"],"isCanonical": true},":ax:":{"unicode":["1f1e6-1f1fd"],"isCanonical": false},":flag_aw:":{"unicode":["1f1e6-1f1fc"],"isCanonical": true},":aw:":{"unicode":["1f1e6-1f1fc"],"isCanonical": false},":flag_au:":{"unicode":["1f1e6-1f1fa"],"isCanonical": true},":au:":{"unicode":["1f1e6-1f1fa"],"isCanonical": false},":flag_at:":{"unicode":["1f1e6-1f1f9"],"isCanonical": true},":at:":{"unicode":["1f1e6-1f1f9"],"isCanonical": false},":flag_as:":{"unicode":["1f1e6-1f1f8"],"isCanonical": true},":as:":{"unicode":["1f1e6-1f1f8"],"isCanonical": false},":flag_ar:":{"unicode":["1f1e6-1f1f7"],"isCanonical": true},":ar:":{"unicode":["1f1e6-1f1f7"],"isCanonical": false},":flag_aq:":{"unicode":["1f1e6-1f1f6"],"isCanonical": true},":aq:":{"unicode":["1f1e6-1f1f6"],"isCanonical": false},":flag_ao:":{"unicode":["1f1e6-1f1f4"],"isCanonical": true},":ao:":{"unicode":["1f1e6-1f1f4"],"isCanonical": false},":flag_am:":{"unicode":["1f1e6-1f1f2"],"isCanonical": true},":am:":{"unicode":["1f1e6-1f1f2"],"isCanonical": false},":flag_al:":{"unicode":["1f1e6-1f1f1"],"isCanonical": true},":al:":{"unicode":["1f1e6-1f1f1"],"isCanonical": false},":flag_ai:":{"unicode":["1f1e6-1f1ee"],"isCanonical": true},":ai:":{"unicode":["1f1e6-1f1ee"],"isCanonical": false},":flag_ag:":{"unicode":["1f1e6-1f1ec"],"isCanonical": true},":ag:":{"unicode":["1f1e6-1f1ec"],"isCanonical": false},":flag_af:":{"unicode":["1f1e6-1f1eb"],"isCanonical": true},":af:":{"unicode":["1f1e6-1f1eb"],"isCanonical": false},":flag_ae:":{"unicode":["1f1e6-1f1ea"],"isCanonical": true},":ae:":{"unicode":["1f1e6-1f1ea"],"isCanonical": false},":flag_ad:":{"unicode":["1f1e6-1f1e9"],"isCanonical": true},":ad:":{"unicode":["1f1e6-1f1e9"],"isCanonical": false},":flag_ac:":{"unicode":["1f1e6-1f1e8"],"isCanonical": true},":ac:":{"unicode":["1f1e6-1f1e8"],"isCanonical": false},":mahjong:":{"unicode":["1f004-fe0f","1f004"],"isCanonical": true},":parking:":{"unicode":["1f17f-fe0f","1f17f"],"isCanonical": true},":sa:":{"unicode":["1f202-fe0f","1f202"],"isCanonical": true},":u7121:":{"unicode":["1f21a-fe0f","1f21a"],"isCanonical": true},":u6307:":{"unicode":["1f22f-fe0f","1f22f"],"isCanonical": true},":u6708:":{"unicode":["1f237-fe0f","1f237"],"isCanonical": true},":film_frames:":{"unicode":["1f39e-fe0f","1f39e"],"isCanonical": true},":tickets:":{"unicode":["1f39f-fe0f","1f39f"],"isCanonical": true},":admission_tickets:":{"unicode":["1f39f-fe0f","1f39f"],"isCanonical": false},":lifter:":{"unicode":["1f3cb-fe0f","1f3cb"],"isCanonical": true},":weight_lifter:":{"unicode":["1f3cb-fe0f","1f3cb"],"isCanonical": false},":golfer:":{"unicode":["1f3cc-fe0f","1f3cc"],"isCanonical": true},":motorcycle:":{"unicode":["1f3cd-fe0f","1f3cd"],"isCanonical": true},":racing_motorcycle:":{"unicode":["1f3cd-fe0f","1f3cd"],"isCanonical": false},":race_car:":{"unicode":["1f3ce-fe0f","1f3ce"],"isCanonical": true},":racing_car:":{"unicode":["1f3ce-fe0f","1f3ce"],"isCanonical": false},":military_medal:":{"unicode":["1f396-fe0f","1f396"],"isCanonical": true},":reminder_ribbon:":{"unicode":["1f397-fe0f","1f397"],"isCanonical": true},":hot_pepper:":{"unicode":["1f336-fe0f","1f336"],"isCanonical": true},":cloud_rain:":{"unicode":["1f327-fe0f","1f327"],"isCanonical": true},":cloud_with_rain:":{"unicode":["1f327-fe0f","1f327"],"isCanonical": false},":cloud_snow:":{"unicode":["1f328-fe0f","1f328"],"isCanonical": true},":cloud_with_snow:":{"unicode":["1f328-fe0f","1f328"],"isCanonical": false},":cloud_lightning:":{"unicode":["1f329-fe0f","1f329"],"isCanonical": true},":cloud_with_lightning:":{"unicode":["1f329-fe0f","1f329"],"isCanonical": false},":cloud_tornado:":{"unicode":["1f32a-fe0f","1f32a"],"isCanonical": true},":cloud_with_tornado:":{"unicode":["1f32a-fe0f","1f32a"],"isCanonical": false},":fog:":{"unicode":["1f32b-fe0f","1f32b"],"isCanonical": true},":wind_blowing_face:":{"unicode":["1f32c-fe0f","1f32c"],"isCanonical": true},":chipmunk:":{"unicode":["1f43f-fe0f","1f43f"],"isCanonical": true},":spider:":{"unicode":["1f577-fe0f","1f577"],"isCanonical": true},":spider_web:":{"unicode":["1f578-fe0f","1f578"],"isCanonical": true},":thermometer:":{"unicode":["1f321-fe0f","1f321"],"isCanonical": true},":microphone2:":{"unicode":["1f399-fe0f","1f399"],"isCanonical": true},":studio_microphone:":{"unicode":["1f399-fe0f","1f399"],"isCanonical": false},":level_slider:":{"unicode":["1f39a-fe0f","1f39a"],"isCanonical": true},":control_knobs:":{"unicode":["1f39b-fe0f","1f39b"],"isCanonical": true},":flag_white:":{"unicode":["1f3f3-fe0f","1f3f3"],"isCanonical": true},":waving_white_flag:":{"unicode":["1f3f3-fe0f","1f3f3"],"isCanonical": false},":rosette:":{"unicode":["1f3f5-fe0f","1f3f5"],"isCanonical": true},":label:":{"unicode":["1f3f7-fe0f","1f3f7"],"isCanonical": true},":projector:":{"unicode":["1f4fd-fe0f","1f4fd"],"isCanonical": true},":film_projector:":{"unicode":["1f4fd-fe0f","1f4fd"],"isCanonical": false},":om_symbol:":{"unicode":["1f549-fe0f","1f549"],"isCanonical": true},":dove:":{"unicode":["1f54a-fe0f","1f54a"],"isCanonical": true},":dove_of_peace:":{"unicode":["1f54a-fe0f","1f54a"],"isCanonical": false},":candle:":{"unicode":["1f56f-fe0f","1f56f"],"isCanonical": true},":clock:":{"unicode":["1f570-fe0f","1f570"],"isCanonical": true},":mantlepiece_clock:":{"unicode":["1f570-fe0f","1f570"],"isCanonical": false},":hole:":{"unicode":["1f573-fe0f","1f573"],"isCanonical": true},":dark_sunglasses:":{"unicode":["1f576-fe0f","1f576"],"isCanonical": true},":joystick:":{"unicode":["1f579-fe0f","1f579"],"isCanonical": true},":paperclips:":{"unicode":["1f587-fe0f","1f587"],"isCanonical": true},":linked_paperclips:":{"unicode":["1f587-fe0f","1f587"],"isCanonical": false},":pen_ballpoint:":{"unicode":["1f58a-fe0f","1f58a"],"isCanonical": true},":lower_left_ballpoint_pen:":{"unicode":["1f58a-fe0f","1f58a"],"isCanonical": false},":pen_fountain:":{"unicode":["1f58b-fe0f","1f58b"],"isCanonical": true},":lower_left_fountain_pen:":{"unicode":["1f58b-fe0f","1f58b"],"isCanonical": false},":paintbrush:":{"unicode":["1f58c-fe0f","1f58c"],"isCanonical": true},":lower_left_paintbrush:":{"unicode":["1f58c-fe0f","1f58c"],"isCanonical": false},":crayon:":{"unicode":["1f58d-fe0f","1f58d"],"isCanonical": true},":lower_left_crayon:":{"unicode":["1f58d-fe0f","1f58d"],"isCanonical": false},":desktop:":{"unicode":["1f5a5-fe0f","1f5a5"],"isCanonical": true},":desktop_computer:":{"unicode":["1f5a5-fe0f","1f5a5"],"isCanonical": false},":printer:":{"unicode":["1f5a8-fe0f","1f5a8"],"isCanonical": true},":trackball:":{"unicode":["1f5b2-fe0f","1f5b2"],"isCanonical": true},":frame_photo:":{"unicode":["1f5bc-fe0f","1f5bc"],"isCanonical": true},":frame_with_picture:":{"unicode":["1f5bc-fe0f","1f5bc"],"isCanonical": false},":dividers:":{"unicode":["1f5c2-fe0f","1f5c2"],"isCanonical": true},":card_index_dividers:":{"unicode":["1f5c2-fe0f","1f5c2"],"isCanonical": false},":card_box:":{"unicode":["1f5c3-fe0f","1f5c3"],"isCanonical": true},":card_file_box:":{"unicode":["1f5c3-fe0f","1f5c3"],"isCanonical": false},":file_cabinet:":{"unicode":["1f5c4-fe0f","1f5c4"],"isCanonical": true},":wastebasket:":{"unicode":["1f5d1-fe0f","1f5d1"],"isCanonical": true},":notepad_spiral:":{"unicode":["1f5d2-fe0f","1f5d2"],"isCanonical": true},":spiral_note_pad:":{"unicode":["1f5d2-fe0f","1f5d2"],"isCanonical": false},":calendar_spiral:":{"unicode":["1f5d3-fe0f","1f5d3"],"isCanonical": true},":spiral_calendar_pad:":{"unicode":["1f5d3-fe0f","1f5d3"],"isCanonical": false},":compression:":{"unicode":["1f5dc-fe0f","1f5dc"],"isCanonical": true},":key2:":{"unicode":["1f5dd-fe0f","1f5dd"],"isCanonical": true},":old_key:":{"unicode":["1f5dd-fe0f","1f5dd"],"isCanonical": false},":newspaper2:":{"unicode":["1f5de-fe0f","1f5de"],"isCanonical": true},":rolled_up_newspaper:":{"unicode":["1f5de-fe0f","1f5de"],"isCanonical": false},":dagger:":{"unicode":["1f5e1-fe0f","1f5e1"],"isCanonical": true},":dagger_knife:":{"unicode":["1f5e1-fe0f","1f5e1"],"isCanonical": false},":speaking_head:":{"unicode":["1f5e3-fe0f","1f5e3"],"isCanonical": true},":speaking_head_in_silhouette:":{"unicode":["1f5e3-fe0f","1f5e3"],"isCanonical": false},":speech_left:":{"unicode":["1f5e8-fe0f","1f5e8"],"isCanonical": true},":left_speech_bubble:":{"unicode":["1f5e8-fe0f","1f5e8"],"isCanonical": false},":anger_right:":{"unicode":["1f5ef-fe0f","1f5ef"],"isCanonical": true},":right_anger_bubble:":{"unicode":["1f5ef-fe0f","1f5ef"],"isCanonical": false},":ballot_box:":{"unicode":["1f5f3-fe0f","1f5f3"],"isCanonical": true},":ballot_box_with_ballot:":{"unicode":["1f5f3-fe0f","1f5f3"],"isCanonical": false},":map:":{"unicode":["1f5fa-fe0f","1f5fa"],"isCanonical": true},":world_map:":{"unicode":["1f5fa-fe0f","1f5fa"],"isCanonical": false},":tools:":{"unicode":["1f6e0-fe0f","1f6e0"],"isCanonical": true},":hammer_and_wrench:":{"unicode":["1f6e0-fe0f","1f6e0"],"isCanonical": false},":shield:":{"unicode":["1f6e1-fe0f","1f6e1"],"isCanonical": true},":oil:":{"unicode":["1f6e2-fe0f","1f6e2"],"isCanonical": true},":oil_drum:":{"unicode":["1f6e2-fe0f","1f6e2"],"isCanonical": false},":satellite_orbital:":{"unicode":["1f6f0-fe0f","1f6f0"],"isCanonical": true},":fork_knife_plate:":{"unicode":["1f37d-fe0f","1f37d"],"isCanonical": true},":fork_and_knife_with_plate:":{"unicode":["1f37d-fe0f","1f37d"],"isCanonical": false},":eye:":{"unicode":["1f441-fe0f","1f441"],"isCanonical": true},":levitate:":{"unicode":["1f574-fe0f","1f574"],"isCanonical": true},":man_in_business_suit_levitating:":{"unicode":["1f574-fe0f","1f574"],"isCanonical": false},":spy:":{"unicode":["1f575-fe0f","1f575"],"isCanonical": true},":sleuth_or_spy:":{"unicode":["1f575-fe0f","1f575"],"isCanonical": false},":hand_splayed:":{"unicode":["1f590-fe0f","1f590"],"isCanonical": true},":raised_hand_with_fingers_splayed:":{"unicode":["1f590-fe0f","1f590"],"isCanonical": false},":mountain_snow:":{"unicode":["1f3d4-fe0f","1f3d4"],"isCanonical": true},":snow_capped_mountain:":{"unicode":["1f3d4-fe0f","1f3d4"],"isCanonical": false},":camping:":{"unicode":["1f3d5-fe0f","1f3d5"],"isCanonical": true},":beach:":{"unicode":["1f3d6-fe0f","1f3d6"],"isCanonical": true},":beach_with_umbrella:":{"unicode":["1f3d6-fe0f","1f3d6"],"isCanonical": false},":construction_site:":{"unicode":["1f3d7-fe0f","1f3d7"],"isCanonical": true},":building_construction:":{"unicode":["1f3d7-fe0f","1f3d7"],"isCanonical": false},":homes:":{"unicode":["1f3d8-fe0f","1f3d8"],"isCanonical": true},":house_buildings:":{"unicode":["1f3d8-fe0f","1f3d8"],"isCanonical": false},":cityscape:":{"unicode":["1f3d9-fe0f","1f3d9"],"isCanonical": true},":house_abandoned:":{"unicode":["1f3da-fe0f","1f3da"],"isCanonical": true},":derelict_house_building:":{"unicode":["1f3da-fe0f","1f3da"],"isCanonical": false},":classical_building:":{"unicode":["1f3db-fe0f","1f3db"],"isCanonical": true},":desert:":{"unicode":["1f3dc-fe0f","1f3dc"],"isCanonical": true},":island:":{"unicode":["1f3dd-fe0f","1f3dd"],"isCanonical": true},":desert_island:":{"unicode":["1f3dd-fe0f","1f3dd"],"isCanonical": false},":park:":{"unicode":["1f3de-fe0f","1f3de"],"isCanonical": true},":national_park:":{"unicode":["1f3de-fe0f","1f3de"],"isCanonical": false},":stadium:":{"unicode":["1f3df-fe0f","1f3df"],"isCanonical": true},":couch:":{"unicode":["1f6cb-fe0f","1f6cb"],"isCanonical": true},":couch_and_lamp:":{"unicode":["1f6cb-fe0f","1f6cb"],"isCanonical": false},":shopping_bags:":{"unicode":["1f6cd-fe0f","1f6cd"],"isCanonical": true},":bellhop:":{"unicode":["1f6ce-fe0f","1f6ce"],"isCanonical": true},":bellhop_bell:":{"unicode":["1f6ce-fe0f","1f6ce"],"isCanonical": false},":bed:":{"unicode":["1f6cf-fe0f","1f6cf"],"isCanonical": true},":motorway:":{"unicode":["1f6e3-fe0f","1f6e3"],"isCanonical": true},":railway_track:":{"unicode":["1f6e4-fe0f","1f6e4"],"isCanonical": true},":railroad_track:":{"unicode":["1f6e4-fe0f","1f6e4"],"isCanonical": false},":motorboat:":{"unicode":["1f6e5-fe0f","1f6e5"],"isCanonical": true},":airplane_small:":{"unicode":["1f6e9-fe0f","1f6e9"],"isCanonical": true},":small_airplane:":{"unicode":["1f6e9-fe0f","1f6e9"],"isCanonical": false},":cruise_ship:":{"unicode":["1f6f3-fe0f","1f6f3"],"isCanonical": true},":passenger_ship:":{"unicode":["1f6f3-fe0f","1f6f3"],"isCanonical": false},":white_sun_small_cloud:":{"unicode":["1f324-fe0f","1f324"],"isCanonical": true},":white_sun_with_small_cloud:":{"unicode":["1f324-fe0f","1f324"],"isCanonical": false},":white_sun_cloud:":{"unicode":["1f325-fe0f","1f325"],"isCanonical": true},":white_sun_behind_cloud:":{"unicode":["1f325-fe0f","1f325"],"isCanonical": false},":white_sun_rain_cloud:":{"unicode":["1f326-fe0f","1f326"],"isCanonical": true},":white_sun_behind_cloud_with_rain:":{"unicode":["1f326-fe0f","1f326"],"isCanonical": false},":mouse_three_button:":{"unicode":["1f5b1-fe0f","1f5b1"],"isCanonical": true},":three_button_mouse:":{"unicode":["1f5b1-fe0f","1f5b1"],"isCanonical": false},":point_up_tone1:":{"unicode":["261d-1f3fb"],"isCanonical": true},":point_up_tone2:":{"unicode":["261d-1f3fc"],"isCanonical": true},":point_up_tone3:":{"unicode":["261d-1f3fd"],"isCanonical": true},":point_up_tone4:":{"unicode":["261d-1f3fe"],"isCanonical": true},":point_up_tone5:":{"unicode":["261d-1f3ff"],"isCanonical": true},":v_tone1:":{"unicode":["270c-1f3fb"],"isCanonical": true},":v_tone2:":{"unicode":["270c-1f3fc"],"isCanonical": true},":v_tone3:":{"unicode":["270c-1f3fd"],"isCanonical": true},":v_tone4:":{"unicode":["270c-1f3fe"],"isCanonical": true},":v_tone5:":{"unicode":["270c-1f3ff"],"isCanonical": true},":fist_tone1:":{"unicode":["270a-1f3fb"],"isCanonical": true},":fist_tone2:":{"unicode":["270a-1f3fc"],"isCanonical": true},":fist_tone3:":{"unicode":["270a-1f3fd"],"isCanonical": true},":fist_tone4:":{"unicode":["270a-1f3fe"],"isCanonical": true},":fist_tone5:":{"unicode":["270a-1f3ff"],"isCanonical": true},":raised_hand_tone1:":{"unicode":["270b-1f3fb"],"isCanonical": true},":raised_hand_tone2:":{"unicode":["270b-1f3fc"],"isCanonical": true},":raised_hand_tone3:":{"unicode":["270b-1f3fd"],"isCanonical": true},":raised_hand_tone4:":{"unicode":["270b-1f3fe"],"isCanonical": true},":raised_hand_tone5:":{"unicode":["270b-1f3ff"],"isCanonical": true},":writing_hand_tone1:":{"unicode":["270d-1f3fb"],"isCanonical": true},":writing_hand_tone2:":{"unicode":["270d-1f3fc"],"isCanonical": true},":writing_hand_tone3:":{"unicode":["270d-1f3fd"],"isCanonical": true},":writing_hand_tone4:":{"unicode":["270d-1f3fe"],"isCanonical": true},":writing_hand_tone5:":{"unicode":["270d-1f3ff"],"isCanonical": true},":basketball_player_tone1:":{"unicode":["26f9-1f3fb"],"isCanonical": true},":person_with_ball_tone1:":{"unicode":["26f9-1f3fb"],"isCanonical": false},":basketball_player_tone2:":{"unicode":["26f9-1f3fc"],"isCanonical": true},":person_with_ball_tone2:":{"unicode":["26f9-1f3fc"],"isCanonical": false},":basketball_player_tone3:":{"unicode":["26f9-1f3fd"],"isCanonical": true},":person_with_ball_tone3:":{"unicode":["26f9-1f3fd"],"isCanonical": false},":basketball_player_tone4:":{"unicode":["26f9-1f3fe"],"isCanonical": true},":person_with_ball_tone4:":{"unicode":["26f9-1f3fe"],"isCanonical": false},":basketball_player_tone5:":{"unicode":["26f9-1f3ff"],"isCanonical": true},":person_with_ball_tone5:":{"unicode":["26f9-1f3ff"],"isCanonical": false},":copyright:":{"unicode":["00a9-fe0f","00a9"],"isCanonical": true},":registered:":{"unicode":["00ae-fe0f","00ae"],"isCanonical": true},":bangbang:":{"unicode":["203c-fe0f","203c"],"isCanonical": true},":interrobang:":{"unicode":["2049-fe0f","2049"],"isCanonical": true},":tm:":{"unicode":["2122-fe0f","2122"],"isCanonical": true},":information_source:":{"unicode":["2139-fe0f","2139"],"isCanonical": true},":left_right_arrow:":{"unicode":["2194-fe0f","2194"],"isCanonical": true},":arrow_up_down:":{"unicode":["2195-fe0f","2195"],"isCanonical": true},":arrow_upper_left:":{"unicode":["2196-fe0f","2196"],"isCanonical": true},":arrow_upper_right:":{"unicode":["2197-fe0f","2197"],"isCanonical": true},":arrow_lower_right:":{"unicode":["2198-fe0f","2198"],"isCanonical": true},":arrow_lower_left:":{"unicode":["2199-fe0f","2199"],"isCanonical": true},":leftwards_arrow_with_hook:":{"unicode":["21a9-fe0f","21a9"],"isCanonical": true},":arrow_right_hook:":{"unicode":["21aa-fe0f","21aa"],"isCanonical": true},":watch:":{"unicode":["231a-fe0f","231a"],"isCanonical": true},":hourglass:":{"unicode":["231b-fe0f","231b"],"isCanonical": true},":m:":{"unicode":["24c2-fe0f","24c2"],"isCanonical": true},":black_small_square:":{"unicode":["25aa-fe0f","25aa"],"isCanonical": true},":white_small_square:":{"unicode":["25ab-fe0f","25ab"],"isCanonical": true},":arrow_forward:":{"unicode":["25b6-fe0f","25b6"],"isCanonical": true},":arrow_backward:":{"unicode":["25c0-fe0f","25c0"],"isCanonical": true},":white_medium_square:":{"unicode":["25fb-fe0f","25fb"],"isCanonical": true},":black_medium_square:":{"unicode":["25fc-fe0f","25fc"],"isCanonical": true},":white_medium_small_square:":{"unicode":["25fd-fe0f","25fd"],"isCanonical": true},":black_medium_small_square:":{"unicode":["25fe-fe0f","25fe"],"isCanonical": true},":sunny:":{"unicode":["2600-fe0f","2600"],"isCanonical": true},":cloud:":{"unicode":["2601-fe0f","2601"],"isCanonical": true},":telephone:":{"unicode":["260e-fe0f","260e"],"isCanonical": true},":ballot_box_with_check:":{"unicode":["2611-fe0f","2611"],"isCanonical": true},":umbrella:":{"unicode":["2614-fe0f","2614"],"isCanonical": true},":coffee:":{"unicode":["2615-fe0f","2615"],"isCanonical": true},":point_up:":{"unicode":["261d-fe0f","261d"],"isCanonical": true},":relaxed:":{"unicode":["263a-fe0f","263a"],"isCanonical": true},":aries:":{"unicode":["2648-fe0f","2648"],"isCanonical": true},":taurus:":{"unicode":["2649-fe0f","2649"],"isCanonical": true},":gemini:":{"unicode":["264a-fe0f","264a"],"isCanonical": true},":cancer:":{"unicode":["264b-fe0f","264b"],"isCanonical": true},":leo:":{"unicode":["264c-fe0f","264c"],"isCanonical": true},":virgo:":{"unicode":["264d-fe0f","264d"],"isCanonical": true},":libra:":{"unicode":["264e-fe0f","264e"],"isCanonical": true},":scorpius:":{"unicode":["264f-fe0f","264f"],"isCanonical": true},":sagittarius:":{"unicode":["2650-fe0f","2650"],"isCanonical": true},":capricorn:":{"unicode":["2651-fe0f","2651"],"isCanonical": true},":aquarius:":{"unicode":["2652-fe0f","2652"],"isCanonical": true},":pisces:":{"unicode":["2653-fe0f","2653"],"isCanonical": true},":spades:":{"unicode":["2660-fe0f","2660"],"isCanonical": true},":clubs:":{"unicode":["2663-fe0f","2663"],"isCanonical": true},":hearts:":{"unicode":["2665-fe0f","2665"],"isCanonical": true},":diamonds:":{"unicode":["2666-fe0f","2666"],"isCanonical": true},":hotsprings:":{"unicode":["2668-fe0f","2668"],"isCanonical": true},":recycle:":{"unicode":["267b-fe0f","267b"],"isCanonical": true},":wheelchair:":{"unicode":["267f-fe0f","267f"],"isCanonical": true},":anchor:":{"unicode":["2693-fe0f","2693"],"isCanonical": true},":warning:":{"unicode":["26a0-fe0f","26a0"],"isCanonical": true},":zap:":{"unicode":["26a1-fe0f","26a1"],"isCanonical": true},":white_circle:":{"unicode":["26aa-fe0f","26aa"],"isCanonical": true},":black_circle:":{"unicode":["26ab-fe0f","26ab"],"isCanonical": true},":soccer:":{"unicode":["26bd-fe0f","26bd"],"isCanonical": true},":baseball:":{"unicode":["26be-fe0f","26be"],"isCanonical": true},":snowman:":{"unicode":["26c4-fe0f","26c4"],"isCanonical": true},":partly_sunny:":{"unicode":["26c5-fe0f","26c5"],"isCanonical": true},":no_entry:":{"unicode":["26d4-fe0f","26d4"],"isCanonical": true},":church:":{"unicode":["26ea-fe0f","26ea"],"isCanonical": true},":fountain:":{"unicode":["26f2-fe0f","26f2"],"isCanonical": true},":golf:":{"unicode":["26f3-fe0f","26f3"],"isCanonical": true},":sailboat:":{"unicode":["26f5-fe0f","26f5"],"isCanonical": true},":tent:":{"unicode":["26fa-fe0f","26fa"],"isCanonical": true},":fuelpump:":{"unicode":["26fd-fe0f","26fd"],"isCanonical": true},":scissors:":{"unicode":["2702-fe0f","2702"],"isCanonical": true},":airplane:":{"unicode":["2708-fe0f","2708"],"isCanonical": true},":envelope:":{"unicode":["2709-fe0f","2709"],"isCanonical": true},":v:":{"unicode":["270c-fe0f","270c"],"isCanonical": true},":pencil2:":{"unicode":["270f-fe0f","270f"],"isCanonical": true},":black_nib:":{"unicode":["2712-fe0f","2712"],"isCanonical": true},":heavy_check_mark:":{"unicode":["2714-fe0f","2714"],"isCanonical": true},":heavy_multiplication_x:":{"unicode":["2716-fe0f","2716"],"isCanonical": true},":eight_spoked_asterisk:":{"unicode":["2733-fe0f","2733"],"isCanonical": true},":eight_pointed_black_star:":{"unicode":["2734-fe0f","2734"],"isCanonical": true},":snowflake:":{"unicode":["2744-fe0f","2744"],"isCanonical": true},":sparkle:":{"unicode":["2747-fe0f","2747"],"isCanonical": true},":exclamation:":{"unicode":["2757-fe0f","2757"],"isCanonical": true},":heart:":{"unicode":["2764-fe0f","2764"],"isCanonical": true},":arrow_right:":{"unicode":["27a1-fe0f","27a1"],"isCanonical": true},":arrow_heading_up:":{"unicode":["2934-fe0f","2934"],"isCanonical": true},":arrow_heading_down:":{"unicode":["2935-fe0f","2935"],"isCanonical": true},":arrow_left:":{"unicode":["2b05-fe0f","2b05"],"isCanonical": true},":arrow_up:":{"unicode":["2b06-fe0f","2b06"],"isCanonical": true},":arrow_down:":{"unicode":["2b07-fe0f","2b07"],"isCanonical": true},":black_large_square:":{"unicode":["2b1b-fe0f","2b1b"],"isCanonical": true},":white_large_square:":{"unicode":["2b1c-fe0f","2b1c"],"isCanonical": true},":star:":{"unicode":["2b50-fe0f","2b50"],"isCanonical": true},":o:":{"unicode":["2b55-fe0f","2b55"],"isCanonical": true},":wavy_dash:":{"unicode":["3030-fe0f","3030"],"isCanonical": true},":part_alternation_mark:":{"unicode":["303d-fe0f","303d"],"isCanonical": true},":congratulations:":{"unicode":["3297-fe0f","3297"],"isCanonical": true},":secret:":{"unicode":["3299-fe0f","3299"],"isCanonical": true},":cross:":{"unicode":["271d-fe0f","271d"],"isCanonical": true},":latin_cross:":{"unicode":["271d-fe0f","271d"],"isCanonical": false},":keyboard:":{"unicode":["2328-fe0f","2328"],"isCanonical": true},":writing_hand:":{"unicode":["270d-fe0f","270d"],"isCanonical": true},":eject:":{"unicode":["23cf-fe0f","23cf"],"isCanonical": true},":eject_symbol:":{"unicode":["23cf-fe0f","23cf"],"isCanonical": false},":track_next:":{"unicode":["23ed-fe0f","23ed"],"isCanonical": true},":next_track:":{"unicode":["23ed-fe0f","23ed"],"isCanonical": false},":track_previous:":{"unicode":["23ee-fe0f","23ee"],"isCanonical": true},":previous_track:":{"unicode":["23ee-fe0f","23ee"],"isCanonical": false},":play_pause:":{"unicode":["23ef-fe0f","23ef"],"isCanonical": true},":stopwatch:":{"unicode":["23f1-fe0f","23f1"],"isCanonical": true},":timer:":{"unicode":["23f2-fe0f","23f2"],"isCanonical": true},":timer_clock:":{"unicode":["23f2-fe0f","23f2"],"isCanonical": false},":pause_button:":{"unicode":["23f8-fe0f","23f8"],"isCanonical": true},":double_vertical_bar:":{"unicode":["23f8-fe0f","23f8"],"isCanonical": false},":stop_button:":{"unicode":["23f9-fe0f","23f9"],"isCanonical": true},":record_button:":{"unicode":["23fa-fe0f","23fa"],"isCanonical": true},":umbrella2:":{"unicode":["2602-fe0f","2602"],"isCanonical": true},":snowman2:":{"unicode":["2603-fe0f","2603"],"isCanonical": true},":comet:":{"unicode":["2604-fe0f","2604"],"isCanonical": true},":shamrock:":{"unicode":["2618-fe0f","2618"],"isCanonical": true},":skull_crossbones:":{"unicode":["2620-fe0f","2620"],"isCanonical": true},":skull_and_crossbones:":{"unicode":["2620-fe0f","2620"],"isCanonical": false},":radioactive:":{"unicode":["2622-fe0f","2622"],"isCanonical": true},":radioactive_sign:":{"unicode":["2622-fe0f","2622"],"isCanonical": false},":biohazard:":{"unicode":["2623-fe0f","2623"],"isCanonical": true},":biohazard_sign:":{"unicode":["2623-fe0f","2623"],"isCanonical": false},":orthodox_cross:":{"unicode":["2626-fe0f","2626"],"isCanonical": true},":star_and_crescent:":{"unicode":["262a-fe0f","262a"],"isCanonical": true},":peace:":{"unicode":["262e-fe0f","262e"],"isCanonical": true},":peace_symbol:":{"unicode":["262e-fe0f","262e"],"isCanonical": false},":yin_yang:":{"unicode":["262f-fe0f","262f"],"isCanonical": true},":wheel_of_dharma:":{"unicode":["2638-fe0f","2638"],"isCanonical": true},":frowning2:":{"unicode":["2639-fe0f","2639"],"isCanonical": true},":white_frowning_face:":{"unicode":["2639-fe0f","2639"],"isCanonical": false},":hammer_pick:":{"unicode":["2692-fe0f","2692"],"isCanonical": true},":hammer_and_pick:":{"unicode":["2692-fe0f","2692"],"isCanonical": false},":crossed_swords:":{"unicode":["2694-fe0f","2694"],"isCanonical": true},":scales:":{"unicode":["2696-fe0f","2696"],"isCanonical": true},":alembic:":{"unicode":["2697-fe0f","2697"],"isCanonical": true},":gear:":{"unicode":["2699-fe0f","2699"],"isCanonical": true},":atom:":{"unicode":["269b-fe0f","269b"],"isCanonical": true},":atom_symbol:":{"unicode":["269b-fe0f","269b"],"isCanonical": false},":fleur-de-lis:":{"unicode":["269c-fe0f","269c"],"isCanonical": true},":coffin:":{"unicode":["26b0-fe0f","26b0"],"isCanonical": true},":urn:":{"unicode":["26b1-fe0f","26b1"],"isCanonical": true},":funeral_urn:":{"unicode":["26b1-fe0f","26b1"],"isCanonical": false},":thunder_cloud_rain:":{"unicode":["26c8-fe0f","26c8"],"isCanonical": true},":thunder_cloud_and_rain:":{"unicode":["26c8-fe0f","26c8"],"isCanonical": false},":pick:":{"unicode":["26cf-fe0f","26cf"],"isCanonical": true},":helmet_with_cross:":{"unicode":["26d1-fe0f","26d1"],"isCanonical": true},":helmet_with_white_cross:":{"unicode":["26d1-fe0f","26d1"],"isCanonical": false},":chains:":{"unicode":["26d3-fe0f","26d3"],"isCanonical": true},":shinto_shrine:":{"unicode":["26e9-fe0f","26e9"],"isCanonical": true},":mountain:":{"unicode":["26f0-fe0f","26f0"],"isCanonical": true},":beach_umbrella:":{"unicode":["26f1-fe0f","26f1"],"isCanonical": true},":umbrella_on_ground:":{"unicode":["26f1-fe0f","26f1"],"isCanonical": false},":ferry:":{"unicode":["26f4-fe0f","26f4"],"isCanonical": true},":skier:":{"unicode":["26f7-fe0f","26f7"],"isCanonical": true},":ice_skate:":{"unicode":["26f8-fe0f","26f8"],"isCanonical": true},":basketball_player:":{"unicode":["26f9-fe0f","26f9"],"isCanonical": true},":person_with_ball:":{"unicode":["26f9-fe0f","26f9"],"isCanonical": false},":star_of_david:":{"unicode":["2721-fe0f","2721"],"isCanonical": true},":heart_exclamation:":{"unicode":["2763-fe0f","2763"],"isCanonical": true},":heavy_heart_exclamation_mark_ornament:":{"unicode":["2763-fe0f","2763"],"isCanonical": false},":third_place:":{"unicode":["1f949"],"isCanonical": true},":third_place_medal:":{"unicode":["1f949"],"isCanonical": false},":second_place:":{"unicode":["1f948"],"isCanonical": true},":second_place_medal:":{"unicode":["1f948"],"isCanonical": false},":first_place:":{"unicode":["1f947"],"isCanonical": true},":first_place_medal:":{"unicode":["1f947"],"isCanonical": false},":fencer:":{"unicode":["1f93a"],"isCanonical": true},":fencing:":{"unicode":["1f93a"],"isCanonical": false},":goal:":{"unicode":["1f945"],"isCanonical": true},":goal_net:":{"unicode":["1f945"],"isCanonical": false},":handball:":{"unicode":["1f93e"],"isCanonical": true},":regional_indicator_z:":{"unicode":["1f1ff"],"isCanonical": true},":water_polo:":{"unicode":["1f93d"],"isCanonical": true},":martial_arts_uniform:":{"unicode":["1f94b"],"isCanonical": true},":karate_uniform:":{"unicode":["1f94b"],"isCanonical": false},":boxing_glove:":{"unicode":["1f94a"],"isCanonical": true},":boxing_gloves:":{"unicode":["1f94a"],"isCanonical": false},":wrestlers:":{"unicode":["1f93c"],"isCanonical": true},":wrestling:":{"unicode":["1f93c"],"isCanonical": false},":juggling:":{"unicode":["1f939"],"isCanonical": true},":juggler:":{"unicode":["1f939"],"isCanonical": false},":cartwheel:":{"unicode":["1f938"],"isCanonical": true},":person_doing_cartwheel:":{"unicode":["1f938"],"isCanonical": false},":canoe:":{"unicode":["1f6f6"],"isCanonical": true},":kayak:":{"unicode":["1f6f6"],"isCanonical": false},":motor_scooter:":{"unicode":["1f6f5"],"isCanonical": true},":motorbike:":{"unicode":["1f6f5"],"isCanonical": false},":scooter:":{"unicode":["1f6f4"],"isCanonical": true},":shopping_cart:":{"unicode":["1f6d2"],"isCanonical": true},":shopping_trolley:":{"unicode":["1f6d2"],"isCanonical": false},":black_joker:":{"unicode":["1f0cf"],"isCanonical": true},":a:":{"unicode":["1f170"],"isCanonical": true},":b:":{"unicode":["1f171"],"isCanonical": true},":o2:":{"unicode":["1f17e"],"isCanonical": true},":octagonal_sign:":{"unicode":["1f6d1"],"isCanonical": true},":stop_sign:":{"unicode":["1f6d1"],"isCanonical": false},":ab:":{"unicode":["1f18e"],"isCanonical": true},":cl:":{"unicode":["1f191"],"isCanonical": true},":regional_indicator_y:":{"unicode":["1f1fe"],"isCanonical": true},":cool:":{"unicode":["1f192"],"isCanonical": true},":free:":{"unicode":["1f193"],"isCanonical": true},":id:":{"unicode":["1f194"],"isCanonical": true},":new:":{"unicode":["1f195"],"isCanonical": true},":ng:":{"unicode":["1f196"],"isCanonical": true},":ok:":{"unicode":["1f197"],"isCanonical": true},":sos:":{"unicode":["1f198"],"isCanonical": true},":spoon:":{"unicode":["1f944"],"isCanonical": true},":up:":{"unicode":["1f199"],"isCanonical": true},":vs:":{"unicode":["1f19a"],"isCanonical": true},":champagne_glass:":{"unicode":["1f942"],"isCanonical": true},":clinking_glass:":{"unicode":["1f942"],"isCanonical": false},":tumbler_glass:":{"unicode":["1f943"],"isCanonical": true},":whisky:":{"unicode":["1f943"],"isCanonical": false},":koko:":{"unicode":["1f201"],"isCanonical": true},":stuffed_flatbread:":{"unicode":["1f959"],"isCanonical": true},":stuffed_pita:":{"unicode":["1f959"],"isCanonical": false},":u7981:":{"unicode":["1f232"],"isCanonical": true},":u7a7a:":{"unicode":["1f233"],"isCanonical": true},":u5408:":{"unicode":["1f234"],"isCanonical": true},":u6e80:":{"unicode":["1f235"],"isCanonical": true},":u6709:":{"unicode":["1f236"],"isCanonical": true},":shallow_pan_of_food:":{"unicode":["1f958"],"isCanonical": true},":paella:":{"unicode":["1f958"],"isCanonical": false},":u7533:":{"unicode":["1f238"],"isCanonical": true},":u5272:":{"unicode":["1f239"],"isCanonical": true},":salad:":{"unicode":["1f957"],"isCanonical": true},":green_salad:":{"unicode":["1f957"],"isCanonical": false},":u55b6:":{"unicode":["1f23a"],"isCanonical": true},":ideograph_advantage:":{"unicode":["1f250"],"isCanonical": true},":accept:":{"unicode":["1f251"],"isCanonical": true},":cyclone:":{"unicode":["1f300"],"isCanonical": true},":french_bread:":{"unicode":["1f956"],"isCanonical": true},":baguette_bread:":{"unicode":["1f956"],"isCanonical": false},":foggy:":{"unicode":["1f301"],"isCanonical": true},":closed_umbrella:":{"unicode":["1f302"],"isCanonical": true},":night_with_stars:":{"unicode":["1f303"],"isCanonical": true},":sunrise_over_mountains:":{"unicode":["1f304"],"isCanonical": true},":sunrise:":{"unicode":["1f305"],"isCanonical": true},":city_dusk:":{"unicode":["1f306"],"isCanonical": true},":carrot:":{"unicode":["1f955"],"isCanonical": true},":city_sunset:":{"unicode":["1f307"],"isCanonical": true},":city_sunrise:":{"unicode":["1f307"],"isCanonical": false},":rainbow:":{"unicode":["1f308"],"isCanonical": true},":potato:":{"unicode":["1f954"],"isCanonical": true},":bridge_at_night:":{"unicode":["1f309"],"isCanonical": true},":ocean:":{"unicode":["1f30a"],"isCanonical": true},":volcano:":{"unicode":["1f30b"],"isCanonical": true},":milky_way:":{"unicode":["1f30c"],"isCanonical": true},":earth_asia:":{"unicode":["1f30f"],"isCanonical": true},":new_moon:":{"unicode":["1f311"],"isCanonical": true},":bacon:":{"unicode":["1f953"],"isCanonical": true},":first_quarter_moon:":{"unicode":["1f313"],"isCanonical": true},":waxing_gibbous_moon:":{"unicode":["1f314"],"isCanonical": true},":full_moon:":{"unicode":["1f315"],"isCanonical": true},":crescent_moon:":{"unicode":["1f319"],"isCanonical": true},":first_quarter_moon_with_face:":{"unicode":["1f31b"],"isCanonical": true},":star2:":{"unicode":["1f31f"],"isCanonical": true},":cucumber:":{"unicode":["1f952"],"isCanonical": true},":stars:":{"unicode":["1f320"],"isCanonical": true},":chestnut:":{"unicode":["1f330"],"isCanonical": true},":avocado:":{"unicode":["1f951"],"isCanonical": true},":seedling:":{"unicode":["1f331"],"isCanonical": true},":palm_tree:":{"unicode":["1f334"],"isCanonical": true},":cactus:":{"unicode":["1f335"],"isCanonical": true},":tulip:":{"unicode":["1f337"],"isCanonical": true},":cherry_blossom:":{"unicode":["1f338"],"isCanonical": true},":rose:":{"unicode":["1f339"],"isCanonical": true},":hibiscus:":{"unicode":["1f33a"],"isCanonical": true},":sunflower:":{"unicode":["1f33b"],"isCanonical": true},":blossom:":{"unicode":["1f33c"],"isCanonical": true},":corn:":{"unicode":["1f33d"],"isCanonical": true},":croissant:":{"unicode":["1f950"],"isCanonical": true},":ear_of_rice:":{"unicode":["1f33e"],"isCanonical": true},":herb:":{"unicode":["1f33f"],"isCanonical": true},":four_leaf_clover:":{"unicode":["1f340"],"isCanonical": true},":maple_leaf:":{"unicode":["1f341"],"isCanonical": true},":fallen_leaf:":{"unicode":["1f342"],"isCanonical": true},":leaves:":{"unicode":["1f343"],"isCanonical": true},":mushroom:":{"unicode":["1f344"],"isCanonical": true},":tomato:":{"unicode":["1f345"],"isCanonical": true},":eggplant:":{"unicode":["1f346"],"isCanonical": true},":grapes:":{"unicode":["1f347"],"isCanonical": true},":melon:":{"unicode":["1f348"],"isCanonical": true},":watermelon:":{"unicode":["1f349"],"isCanonical": true},":tangerine:":{"unicode":["1f34a"],"isCanonical": true},":wilted_rose:":{"unicode":["1f940"],"isCanonical": true},":wilted_flower:":{"unicode":["1f940"],"isCanonical": false},":banana:":{"unicode":["1f34c"],"isCanonical": true},":pineapple:":{"unicode":["1f34d"],"isCanonical": true},":apple:":{"unicode":["1f34e"],"isCanonical": true},":green_apple:":{"unicode":["1f34f"],"isCanonical": true},":peach:":{"unicode":["1f351"],"isCanonical": true},":cherries:":{"unicode":["1f352"],"isCanonical": true},":strawberry:":{"unicode":["1f353"],"isCanonical": true},":rhino:":{"unicode":["1f98f"],"isCanonical": true},":rhinoceros:":{"unicode":["1f98f"],"isCanonical": false},":hamburger:":{"unicode":["1f354"],"isCanonical": true},":pizza:":{"unicode":["1f355"],"isCanonical": true},":meat_on_bone:":{"unicode":["1f356"],"isCanonical": true},":lizard:":{"unicode":["1f98e"],"isCanonical": true},":poultry_leg:":{"unicode":["1f357"],"isCanonical": true},":rice_cracker:":{"unicode":["1f358"],"isCanonical": true},":rice_ball:":{"unicode":["1f359"],"isCanonical": true},":gorilla:":{"unicode":["1f98d"],"isCanonical": true},":rice:":{"unicode":["1f35a"],"isCanonical": true},":curry:":{"unicode":["1f35b"],"isCanonical": true},":deer:":{"unicode":["1f98c"],"isCanonical": true},":ramen:":{"unicode":["1f35c"],"isCanonical": true},":spaghetti:":{"unicode":["1f35d"],"isCanonical": true},":bread:":{"unicode":["1f35e"],"isCanonical": true},":fries:":{"unicode":["1f35f"],"isCanonical": true},":butterfly:":{"unicode":["1f98b"],"isCanonical": true},":sweet_potato:":{"unicode":["1f360"],"isCanonical": true},":dango:":{"unicode":["1f361"],"isCanonical": true},":fox:":{"unicode":["1f98a"],"isCanonical": true},":fox_face:":{"unicode":["1f98a"],"isCanonical": false},":oden:":{"unicode":["1f362"],"isCanonical": true},":sushi:":{"unicode":["1f363"],"isCanonical": true},":owl:":{"unicode":["1f989"],"isCanonical": true},":fried_shrimp:":{"unicode":["1f364"],"isCanonical": true},":fish_cake:":{"unicode":["1f365"],"isCanonical": true},":shark:":{"unicode":["1f988"],"isCanonical": true},":icecream:":{"unicode":["1f366"],"isCanonical": true},":bat:":{"unicode":["1f987"],"isCanonical": true},":shaved_ice:":{"unicode":["1f367"],"isCanonical": true},":regional_indicator_x:":{"unicode":["1f1fd"],"isCanonical": true},":ice_cream:":{"unicode":["1f368"],"isCanonical": true},":duck:":{"unicode":["1f986"],"isCanonical": true},":doughnut:":{"unicode":["1f369"],"isCanonical": true},":eagle:":{"unicode":["1f985"],"isCanonical": true},":cookie:":{"unicode":["1f36a"],"isCanonical": true},":black_heart:":{"unicode":["1f5a4"],"isCanonical": true},":chocolate_bar:":{"unicode":["1f36b"],"isCanonical": true},":candy:":{"unicode":["1f36c"],"isCanonical": true},":lollipop:":{"unicode":["1f36d"],"isCanonical": true},":custard:":{"unicode":["1f36e"],"isCanonical": true},":pudding:":{"unicode":["1f36e"],"isCanonical": false},":flan:":{"unicode":["1f36e"],"isCanonical": false},":honey_pot:":{"unicode":["1f36f"],"isCanonical": true},":fingers_crossed:":{"unicode":["1f91e"],"isCanonical": true},":hand_with_index_and_middle_finger_crossed:":{"unicode":["1f91e"],"isCanonical": false},":cake:":{"unicode":["1f370"],"isCanonical": true},":bento:":{"unicode":["1f371"],"isCanonical": true},":stew:":{"unicode":["1f372"],"isCanonical": true},":handshake:":{"unicode":["1f91d"],"isCanonical": true},":shaking_hands:":{"unicode":["1f91d"],"isCanonical": false},":cooking:":{"unicode":["1f373"],"isCanonical": true},":fork_and_knife:":{"unicode":["1f374"],"isCanonical": true},":tea:":{"unicode":["1f375"],"isCanonical": true},":sake:":{"unicode":["1f376"],"isCanonical": true},":wine_glass:":{"unicode":["1f377"],"isCanonical": true},":cocktail:":{"unicode":["1f378"],"isCanonical": true},":tropical_drink:":{"unicode":["1f379"],"isCanonical": true},":beer:":{"unicode":["1f37a"],"isCanonical": true},":beers:":{"unicode":["1f37b"],"isCanonical": true},":ribbon:":{"unicode":["1f380"],"isCanonical": true},":gift:":{"unicode":["1f381"],"isCanonical": true},":birthday:":{"unicode":["1f382"],"isCanonical": true},":jack_o_lantern:":{"unicode":["1f383"],"isCanonical": true},":left_facing_fist:":{"unicode":["1f91b"],"isCanonical": true},":left_fist:":{"unicode":["1f91b"],"isCanonical": false},":right_facing_fist:":{"unicode":["1f91c"],"isCanonical": true},":right_fist:":{"unicode":["1f91c"],"isCanonical": false},":christmas_tree:":{"unicode":["1f384"],"isCanonical": true},":santa:":{"unicode":["1f385"],"isCanonical": true},":fireworks:":{"unicode":["1f386"],"isCanonical": true},":raised_back_of_hand:":{"unicode":["1f91a"],"isCanonical": true},":back_of_hand:":{"unicode":["1f91a"],"isCanonical": false},":sparkler:":{"unicode":["1f387"],"isCanonical": true},":balloon:":{"unicode":["1f388"],"isCanonical": true},":tada:":{"unicode":["1f389"],"isCanonical": true},":confetti_ball:":{"unicode":["1f38a"],"isCanonical": true},":tanabata_tree:":{"unicode":["1f38b"],"isCanonical": true},":crossed_flags:":{"unicode":["1f38c"],"isCanonical": true},":call_me:":{"unicode":["1f919"],"isCanonical": true},":call_me_hand:":{"unicode":["1f919"],"isCanonical": false},":bamboo:":{"unicode":["1f38d"],"isCanonical": true},":man_dancing:":{"unicode":["1f57a"],"isCanonical": true},":male_dancer:":{"unicode":["1f57a"],"isCanonical": false},":dolls:":{"unicode":["1f38e"],"isCanonical": true},":selfie:":{"unicode":["1f933"],"isCanonical": true},":flags:":{"unicode":["1f38f"],"isCanonical": true},":pregnant_woman:":{"unicode":["1f930"],"isCanonical": true},":expecting_woman:":{"unicode":["1f930"],"isCanonical": false},":wind_chime:":{"unicode":["1f390"],"isCanonical": true},":face_palm:":{"unicode":["1f926"],"isCanonical": true},":facepalm:":{"unicode":["1f926"],"isCanonical": false},":shrug:":{"unicode":["1f937"],"isCanonical": true},":rice_scene:":{"unicode":["1f391"],"isCanonical": true},":school_satchel:":{"unicode":["1f392"],"isCanonical": true},":mortar_board:":{"unicode":["1f393"],"isCanonical": true},":carousel_horse:":{"unicode":["1f3a0"],"isCanonical": true},":ferris_wheel:":{"unicode":["1f3a1"],"isCanonical": true},":roller_coaster:":{"unicode":["1f3a2"],"isCanonical": true},":fishing_pole_and_fish:":{"unicode":["1f3a3"],"isCanonical": true},":microphone:":{"unicode":["1f3a4"],"isCanonical": true},":movie_camera:":{"unicode":["1f3a5"],"isCanonical": true},":cinema:":{"unicode":["1f3a6"],"isCanonical": true},":headphones:":{"unicode":["1f3a7"],"isCanonical": true},":mrs_claus:":{"unicode":["1f936"],"isCanonical": true},":mother_christmas:":{"unicode":["1f936"],"isCanonical": false},":art:":{"unicode":["1f3a8"],"isCanonical": true},":man_in_tuxedo:":{"unicode":["1f935"],"isCanonical": true},":tophat:":{"unicode":["1f3a9"],"isCanonical": true},":circus_tent:":{"unicode":["1f3aa"],"isCanonical": true},":prince:":{"unicode":["1f934"],"isCanonical": true},":ticket:":{"unicode":["1f3ab"],"isCanonical": true},":clapper:":{"unicode":["1f3ac"],"isCanonical": true},":performing_arts:":{"unicode":["1f3ad"],"isCanonical": true},":sneezing_face:":{"unicode":["1f927"],"isCanonical": true},":sneeze:":{"unicode":["1f927"],"isCanonical": false},":video_game:":{"unicode":["1f3ae"],"isCanonical": true},":dart:":{"unicode":["1f3af"],"isCanonical": true},":slot_machine:":{"unicode":["1f3b0"],"isCanonical": true},":8ball:":{"unicode":["1f3b1"],"isCanonical": true},":game_die:":{"unicode":["1f3b2"],"isCanonical": true},":bowling:":{"unicode":["1f3b3"],"isCanonical": true},":flower_playing_cards:":{"unicode":["1f3b4"],"isCanonical": true},":lying_face:":{"unicode":["1f925"],"isCanonical": true},":liar:":{"unicode":["1f925"],"isCanonical": false},":musical_note:":{"unicode":["1f3b5"],"isCanonical": true},":notes:":{"unicode":["1f3b6"],"isCanonical": true},":saxophone:":{"unicode":["1f3b7"],"isCanonical": true},":drooling_face:":{"unicode":["1f924"],"isCanonical": true},":drool:":{"unicode":["1f924"],"isCanonical": false},":guitar:":{"unicode":["1f3b8"],"isCanonical": true},":musical_keyboard:":{"unicode":["1f3b9"],"isCanonical": true},":trumpet:":{"unicode":["1f3ba"],"isCanonical": true},":rofl:":{"unicode":["1f923"],"isCanonical": true},":rolling_on_the_floor_laughing:":{"unicode":["1f923"],"isCanonical": false},":violin:":{"unicode":["1f3bb"],"isCanonical": true},":musical_score:":{"unicode":["1f3bc"],"isCanonical": true},":running_shirt_with_sash:":{"unicode":["1f3bd"],"isCanonical": true},":nauseated_face:":{"unicode":["1f922"],"isCanonical": true},":sick:":{"unicode":["1f922"],"isCanonical": false},":tennis:":{"unicode":["1f3be"],"isCanonical": true},":ski:":{"unicode":["1f3bf"],"isCanonical": true},":basketball:":{"unicode":["1f3c0"],"isCanonical": true},":checkered_flag:":{"unicode":["1f3c1"],"isCanonical": true},":clown:":{"unicode":["1f921"],"isCanonical": true},":clown_face:":{"unicode":["1f921"],"isCanonical": false},":snowboarder:":{"unicode":["1f3c2"],"isCanonical": true},":runner:":{"unicode":["1f3c3"],"isCanonical": true},":surfer:":{"unicode":["1f3c4"],"isCanonical": true},":trophy:":{"unicode":["1f3c6"],"isCanonical": true},":football:":{"unicode":["1f3c8"],"isCanonical": true},":swimmer:":{"unicode":["1f3ca"],"isCanonical": true},":house:":{"unicode":["1f3e0"],"isCanonical": true},":house_with_garden:":{"unicode":["1f3e1"],"isCanonical": true},":office:":{"unicode":["1f3e2"],"isCanonical": true},":post_office:":{"unicode":["1f3e3"],"isCanonical": true},":hospital:":{"unicode":["1f3e5"],"isCanonical": true},":bank:":{"unicode":["1f3e6"],"isCanonical": true},":atm:":{"unicode":["1f3e7"],"isCanonical": true},":hotel:":{"unicode":["1f3e8"],"isCanonical": true},":love_hotel:":{"unicode":["1f3e9"],"isCanonical": true},":convenience_store:":{"unicode":["1f3ea"],"isCanonical": true},":school:":{"unicode":["1f3eb"],"isCanonical": true},":department_store:":{"unicode":["1f3ec"],"isCanonical": true},":cowboy:":{"unicode":["1f920"],"isCanonical": true},":face_with_cowboy_hat:":{"unicode":["1f920"],"isCanonical": false},":factory:":{"unicode":["1f3ed"],"isCanonical": true},":izakaya_lantern:":{"unicode":["1f3ee"],"isCanonical": true},":japanese_castle:":{"unicode":["1f3ef"],"isCanonical": true},":european_castle:":{"unicode":["1f3f0"],"isCanonical": true},":snail:":{"unicode":["1f40c"],"isCanonical": true},":snake:":{"unicode":["1f40d"],"isCanonical": true},":racehorse:":{"unicode":["1f40e"],"isCanonical": true},":sheep:":{"unicode":["1f411"],"isCanonical": true},":monkey:":{"unicode":["1f412"],"isCanonical": true},":chicken:":{"unicode":["1f414"],"isCanonical": true},":boar:":{"unicode":["1f417"],"isCanonical": true},":elephant:":{"unicode":["1f418"],"isCanonical": true},":octopus:":{"unicode":["1f419"],"isCanonical": true},":shell:":{"unicode":["1f41a"],"isCanonical": true},":bug:":{"unicode":["1f41b"],"isCanonical": true},":ant:":{"unicode":["1f41c"],"isCanonical": true},":bee:":{"unicode":["1f41d"],"isCanonical": true},":beetle:":{"unicode":["1f41e"],"isCanonical": true},":fish:":{"unicode":["1f41f"],"isCanonical": true},":tropical_fish:":{"unicode":["1f420"],"isCanonical": true},":blowfish:":{"unicode":["1f421"],"isCanonical": true},":turtle:":{"unicode":["1f422"],"isCanonical": true},":hatching_chick:":{"unicode":["1f423"],"isCanonical": true},":baby_chick:":{"unicode":["1f424"],"isCanonical": true},":hatched_chick:":{"unicode":["1f425"],"isCanonical": true},":bird:":{"unicode":["1f426"],"isCanonical": true},":penguin:":{"unicode":["1f427"],"isCanonical": true},":koala:":{"unicode":["1f428"],"isCanonical": true},":poodle:":{"unicode":["1f429"],"isCanonical": true},":camel:":{"unicode":["1f42b"],"isCanonical": true},":dolphin:":{"unicode":["1f42c"],"isCanonical": true},":mouse:":{"unicode":["1f42d"],"isCanonical": true},":cow:":{"unicode":["1f42e"],"isCanonical": true},":tiger:":{"unicode":["1f42f"],"isCanonical": true},":rabbit:":{"unicode":["1f430"],"isCanonical": true},":cat:":{"unicode":["1f431"],"isCanonical": true},":dragon_face:":{"unicode":["1f432"],"isCanonical": true},":whale:":{"unicode":["1f433"],"isCanonical": true},":horse:":{"unicode":["1f434"],"isCanonical": true},":monkey_face:":{"unicode":["1f435"],"isCanonical": true},":dog:":{"unicode":["1f436"],"isCanonical": true},":pig:":{"unicode":["1f437"],"isCanonical": true},":frog:":{"unicode":["1f438"],"isCanonical": true},":hamster:":{"unicode":["1f439"],"isCanonical": true},":wolf:":{"unicode":["1f43a"],"isCanonical": true},":bear:":{"unicode":["1f43b"],"isCanonical": true},":panda_face:":{"unicode":["1f43c"],"isCanonical": true},":pig_nose:":{"unicode":["1f43d"],"isCanonical": true},":feet:":{"unicode":["1f43e"],"isCanonical": true},":paw_prints:":{"unicode":["1f43e"],"isCanonical": false},":eyes:":{"unicode":["1f440"],"isCanonical": true},":ear:":{"unicode":["1f442"],"isCanonical": true},":nose:":{"unicode":["1f443"],"isCanonical": true},":lips:":{"unicode":["1f444"],"isCanonical": true},":tongue:":{"unicode":["1f445"],"isCanonical": true},":point_up_2:":{"unicode":["1f446"],"isCanonical": true},":point_down:":{"unicode":["1f447"],"isCanonical": true},":point_left:":{"unicode":["1f448"],"isCanonical": true},":point_right:":{"unicode":["1f449"],"isCanonical": true},":punch:":{"unicode":["1f44a"],"isCanonical": true},":wave:":{"unicode":["1f44b"],"isCanonical": true},":ok_hand:":{"unicode":["1f44c"],"isCanonical": true},":thumbsup:":{"unicode":["1f44d"],"isCanonical": true},":+1:":{"unicode":["1f44d"],"isCanonical": false},":thumbup:":{"unicode":["1f44d"],"isCanonical": false},":thumbsdown:":{"unicode":["1f44e"],"isCanonical": true},":-1:":{"unicode":["1f44e"],"isCanonical": false},":thumbdown:":{"unicode":["1f44e"],"isCanonical": false},":clap:":{"unicode":["1f44f"],"isCanonical": true},":open_hands:":{"unicode":["1f450"],"isCanonical": true},":crown:":{"unicode":["1f451"],"isCanonical": true},":womans_hat:":{"unicode":["1f452"],"isCanonical": true},":eyeglasses:":{"unicode":["1f453"],"isCanonical": true},":necktie:":{"unicode":["1f454"],"isCanonical": true},":shirt:":{"unicode":["1f455"],"isCanonical": true},":jeans:":{"unicode":["1f456"],"isCanonical": true},":dress:":{"unicode":["1f457"],"isCanonical": true},":kimono:":{"unicode":["1f458"],"isCanonical": true},":bikini:":{"unicode":["1f459"],"isCanonical": true},":womans_clothes:":{"unicode":["1f45a"],"isCanonical": true},":purse:":{"unicode":["1f45b"],"isCanonical": true},":handbag:":{"unicode":["1f45c"],"isCanonical": true},":pouch:":{"unicode":["1f45d"],"isCanonical": true},":mans_shoe:":{"unicode":["1f45e"],"isCanonical": true},":athletic_shoe:":{"unicode":["1f45f"],"isCanonical": true},":high_heel:":{"unicode":["1f460"],"isCanonical": true},":sandal:":{"unicode":["1f461"],"isCanonical": true},":boot:":{"unicode":["1f462"],"isCanonical": true},":footprints:":{"unicode":["1f463"],"isCanonical": true},":bust_in_silhouette:":{"unicode":["1f464"],"isCanonical": true},":boy:":{"unicode":["1f466"],"isCanonical": true},":girl:":{"unicode":["1f467"],"isCanonical": true},":man:":{"unicode":["1f468"],"isCanonical": true},":woman:":{"unicode":["1f469"],"isCanonical": true},":family:":{"unicode":["1f46a"],"isCanonical": true},":couple:":{"unicode":["1f46b"],"isCanonical": true},":cop:":{"unicode":["1f46e"],"isCanonical": true},":dancers:":{"unicode":["1f46f"],"isCanonical": true},":bride_with_veil:":{"unicode":["1f470"],"isCanonical": true},":person_with_blond_hair:":{"unicode":["1f471"],"isCanonical": true},":man_with_gua_pi_mao:":{"unicode":["1f472"],"isCanonical": true},":man_with_turban:":{"unicode":["1f473"],"isCanonical": true},":older_man:":{"unicode":["1f474"],"isCanonical": true},":older_woman:":{"unicode":["1f475"],"isCanonical": true},":grandma:":{"unicode":["1f475"],"isCanonical": false},":baby:":{"unicode":["1f476"],"isCanonical": true},":construction_worker:":{"unicode":["1f477"],"isCanonical": true},":princess:":{"unicode":["1f478"],"isCanonical": true},":japanese_ogre:":{"unicode":["1f479"],"isCanonical": true},":japanese_goblin:":{"unicode":["1f47a"],"isCanonical": true},":ghost:":{"unicode":["1f47b"],"isCanonical": true},":angel:":{"unicode":["1f47c"],"isCanonical": true},":alien:":{"unicode":["1f47d"],"isCanonical": true},":space_invader:":{"unicode":["1f47e"],"isCanonical": true},":imp:":{"unicode":["1f47f"],"isCanonical": true},":skull:":{"unicode":["1f480"],"isCanonical": true},":skeleton:":{"unicode":["1f480"],"isCanonical": false},":card_index:":{"unicode":["1f4c7"],"isCanonical": true},":information_desk_person:":{"unicode":["1f481"],"isCanonical": true},":guardsman:":{"unicode":["1f482"],"isCanonical": true},":dancer:":{"unicode":["1f483"],"isCanonical": true},":lipstick:":{"unicode":["1f484"],"isCanonical": true},":nail_care:":{"unicode":["1f485"],"isCanonical": true},":ledger:":{"unicode":["1f4d2"],"isCanonical": true},":massage:":{"unicode":["1f486"],"isCanonical": true},":notebook:":{"unicode":["1f4d3"],"isCanonical": true},":haircut:":{"unicode":["1f487"],"isCanonical": true},":notebook_with_decorative_cover:":{"unicode":["1f4d4"],"isCanonical": true},":barber:":{"unicode":["1f488"],"isCanonical": true},":closed_book:":{"unicode":["1f4d5"],"isCanonical": true},":syringe:":{"unicode":["1f489"],"isCanonical": true},":book:":{"unicode":["1f4d6"],"isCanonical": true},":pill:":{"unicode":["1f48a"],"isCanonical": true},":green_book:":{"unicode":["1f4d7"],"isCanonical": true},":kiss:":{"unicode":["1f48b"],"isCanonical": true},":blue_book:":{"unicode":["1f4d8"],"isCanonical": true},":love_letter:":{"unicode":["1f48c"],"isCanonical": true},":orange_book:":{"unicode":["1f4d9"],"isCanonical": true},":ring:":{"unicode":["1f48d"],"isCanonical": true},":books:":{"unicode":["1f4da"],"isCanonical": true},":gem:":{"unicode":["1f48e"],"isCanonical": true},":name_badge:":{"unicode":["1f4db"],"isCanonical": true},":couplekiss:":{"unicode":["1f48f"],"isCanonical": true},":scroll:":{"unicode":["1f4dc"],"isCanonical": true},":bouquet:":{"unicode":["1f490"],"isCanonical": true},":pencil:":{"unicode":["1f4dd"],"isCanonical": true},":couple_with_heart:":{"unicode":["1f491"],"isCanonical": true},":telephone_receiver:":{"unicode":["1f4de"],"isCanonical": true},":wedding:":{"unicode":["1f492"],"isCanonical": true},":pager:":{"unicode":["1f4df"],"isCanonical": true},":fax:":{"unicode":["1f4e0"],"isCanonical": true},":heartbeat:":{"unicode":["1f493"],"isCanonical": true},":satellite:":{"unicode":["1f4e1"],"isCanonical": true},":loudspeaker:":{"unicode":["1f4e2"],"isCanonical": true},":broken_heart:":{"unicode":["1f494"],"isCanonical": true},":mega:":{"unicode":["1f4e3"],"isCanonical": true},":outbox_tray:":{"unicode":["1f4e4"],"isCanonical": true},":two_hearts:":{"unicode":["1f495"],"isCanonical": true},":inbox_tray:":{"unicode":["1f4e5"],"isCanonical": true},":package:":{"unicode":["1f4e6"],"isCanonical": true},":sparkling_heart:":{"unicode":["1f496"],"isCanonical": true},":e-mail:":{"unicode":["1f4e7"],"isCanonical": true},":email:":{"unicode":["1f4e7"],"isCanonical": false},":incoming_envelope:":{"unicode":["1f4e8"],"isCanonical": true},":heartpulse:":{"unicode":["1f497"],"isCanonical": true},":envelope_with_arrow:":{"unicode":["1f4e9"],"isCanonical": true},":mailbox_closed:":{"unicode":["1f4ea"],"isCanonical": true},":cupid:":{"unicode":["1f498"],"isCanonical": true},":mailbox:":{"unicode":["1f4eb"],"isCanonical": true},":postbox:":{"unicode":["1f4ee"],"isCanonical": true},":blue_heart:":{"unicode":["1f499"],"isCanonical": true},":newspaper:":{"unicode":["1f4f0"],"isCanonical": true},":iphone:":{"unicode":["1f4f1"],"isCanonical": true},":green_heart:":{"unicode":["1f49a"],"isCanonical": true},":calling:":{"unicode":["1f4f2"],"isCanonical": true},":vibration_mode:":{"unicode":["1f4f3"],"isCanonical": true},":yellow_heart:":{"unicode":["1f49b"],"isCanonical": true},":mobile_phone_off:":{"unicode":["1f4f4"],"isCanonical": true},":signal_strength:":{"unicode":["1f4f6"],"isCanonical": true},":purple_heart:":{"unicode":["1f49c"],"isCanonical": true},":camera:":{"unicode":["1f4f7"],"isCanonical": true},":video_camera:":{"unicode":["1f4f9"],"isCanonical": true},":gift_heart:":{"unicode":["1f49d"],"isCanonical": true},":tv:":{"unicode":["1f4fa"],"isCanonical": true},":radio:":{"unicode":["1f4fb"],"isCanonical": true},":revolving_hearts:":{"unicode":["1f49e"],"isCanonical": true},":vhs:":{"unicode":["1f4fc"],"isCanonical": true},":arrows_clockwise:":{"unicode":["1f503"],"isCanonical": true},":heart_decoration:":{"unicode":["1f49f"],"isCanonical": true},":loud_sound:":{"unicode":["1f50a"],"isCanonical": true},":battery:":{"unicode":["1f50b"],"isCanonical": true},":diamond_shape_with_a_dot_inside:":{"unicode":["1f4a0"],"isCanonical": true},":electric_plug:":{"unicode":["1f50c"],"isCanonical": true},":mag:":{"unicode":["1f50d"],"isCanonical": true},":bulb:":{"unicode":["1f4a1"],"isCanonical": true},":mag_right:":{"unicode":["1f50e"],"isCanonical": true},":lock_with_ink_pen:":{"unicode":["1f50f"],"isCanonical": true},":anger:":{"unicode":["1f4a2"],"isCanonical": true},":closed_lock_with_key:":{"unicode":["1f510"],"isCanonical": true},":key:":{"unicode":["1f511"],"isCanonical": true},":bomb:":{"unicode":["1f4a3"],"isCanonical": true},":lock:":{"unicode":["1f512"],"isCanonical": true},":unlock:":{"unicode":["1f513"],"isCanonical": true},":zzz:":{"unicode":["1f4a4"],"isCanonical": true},":bell:":{"unicode":["1f514"],"isCanonical": true},":bookmark:":{"unicode":["1f516"],"isCanonical": true},":boom:":{"unicode":["1f4a5"],"isCanonical": true},":link:":{"unicode":["1f517"],"isCanonical": true},":radio_button:":{"unicode":["1f518"],"isCanonical": true},":sweat_drops:":{"unicode":["1f4a6"],"isCanonical": true},":back:":{"unicode":["1f519"],"isCanonical": true},":end:":{"unicode":["1f51a"],"isCanonical": true},":droplet:":{"unicode":["1f4a7"],"isCanonical": true},":on:":{"unicode":["1f51b"],"isCanonical": true},":soon:":{"unicode":["1f51c"],"isCanonical": true},":dash:":{"unicode":["1f4a8"],"isCanonical": true},":top:":{"unicode":["1f51d"],"isCanonical": true},":underage:":{"unicode":["1f51e"],"isCanonical": true},":poop:":{"unicode":["1f4a9"],"isCanonical": true},":shit:":{"unicode":["1f4a9"],"isCanonical": false},":hankey:":{"unicode":["1f4a9"],"isCanonical": false},":poo:":{"unicode":["1f4a9"],"isCanonical": false},":keycap_ten:":{"unicode":["1f51f"],"isCanonical": true},":muscle:":{"unicode":["1f4aa"],"isCanonical": true},":capital_abcd:":{"unicode":["1f520"],"isCanonical": true},":abcd:":{"unicode":["1f521"],"isCanonical": true},":dizzy:":{"unicode":["1f4ab"],"isCanonical": true},":1234:":{"unicode":["1f522"],"isCanonical": true},":symbols:":{"unicode":["1f523"],"isCanonical": true},":speech_balloon:":{"unicode":["1f4ac"],"isCanonical": true},":abc:":{"unicode":["1f524"],"isCanonical": true},":fire:":{"unicode":["1f525"],"isCanonical": true},":flame:":{"unicode":["1f525"],"isCanonical": false},":white_flower:":{"unicode":["1f4ae"],"isCanonical": true},":flashlight:":{"unicode":["1f526"],"isCanonical": true},":wrench:":{"unicode":["1f527"],"isCanonical": true},":100:":{"unicode":["1f4af"],"isCanonical": true},":hammer:":{"unicode":["1f528"],"isCanonical": true},":nut_and_bolt:":{"unicode":["1f529"],"isCanonical": true},":moneybag:":{"unicode":["1f4b0"],"isCanonical": true},":knife:":{"unicode":["1f52a"],"isCanonical": true},":gun:":{"unicode":["1f52b"],"isCanonical": true},":currency_exchange:":{"unicode":["1f4b1"],"isCanonical": true},":crystal_ball:":{"unicode":["1f52e"],"isCanonical": true},":heavy_dollar_sign:":{"unicode":["1f4b2"],"isCanonical": true},":six_pointed_star:":{"unicode":["1f52f"],"isCanonical": true},":credit_card:":{"unicode":["1f4b3"],"isCanonical": true},":beginner:":{"unicode":["1f530"],"isCanonical": true},":trident:":{"unicode":["1f531"],"isCanonical": true},":yen:":{"unicode":["1f4b4"],"isCanonical": true},":black_square_button:":{"unicode":["1f532"],"isCanonical": true},":white_square_button:":{"unicode":["1f533"],"isCanonical": true},":dollar:":{"unicode":["1f4b5"],"isCanonical": true},":red_circle:":{"unicode":["1f534"],"isCanonical": true},":large_blue_circle:":{"unicode":["1f535"],"isCanonical": true},":money_with_wings:":{"unicode":["1f4b8"],"isCanonical": true},":large_orange_diamond:":{"unicode":["1f536"],"isCanonical": true},":large_blue_diamond:":{"unicode":["1f537"],"isCanonical": true},":chart:":{"unicode":["1f4b9"],"isCanonical": true},":small_orange_diamond:":{"unicode":["1f538"],"isCanonical": true},":small_blue_diamond:":{"unicode":["1f539"],"isCanonical": true},":seat:":{"unicode":["1f4ba"],"isCanonical": true},":small_red_triangle:":{"unicode":["1f53a"],"isCanonical": true},":small_red_triangle_down:":{"unicode":["1f53b"],"isCanonical": true},":computer:":{"unicode":["1f4bb"],"isCanonical": true},":arrow_up_small:":{"unicode":["1f53c"],"isCanonical": true},":briefcase:":{"unicode":["1f4bc"],"isCanonical": true},":arrow_down_small:":{"unicode":["1f53d"],"isCanonical": true},":clock1:":{"unicode":["1f550"],"isCanonical": true},":minidisc:":{"unicode":["1f4bd"],"isCanonical": true},":clock2:":{"unicode":["1f551"],"isCanonical": true},":floppy_disk:":{"unicode":["1f4be"],"isCanonical": true},":clock3:":{"unicode":["1f552"],"isCanonical": true},":cd:":{"unicode":["1f4bf"],"isCanonical": true},":clock4:":{"unicode":["1f553"],"isCanonical": true},":dvd:":{"unicode":["1f4c0"],"isCanonical": true},":clock5:":{"unicode":["1f554"],"isCanonical": true},":clock6:":{"unicode":["1f555"],"isCanonical": true},":file_folder:":{"unicode":["1f4c1"],"isCanonical": true},":clock7:":{"unicode":["1f556"],"isCanonical": true},":clock8:":{"unicode":["1f557"],"isCanonical": true},":open_file_folder:":{"unicode":["1f4c2"],"isCanonical": true},":clock9:":{"unicode":["1f558"],"isCanonical": true},":clock10:":{"unicode":["1f559"],"isCanonical": true},":page_with_curl:":{"unicode":["1f4c3"],"isCanonical": true},":clock11:":{"unicode":["1f55a"],"isCanonical": true},":clock12:":{"unicode":["1f55b"],"isCanonical": true},":page_facing_up:":{"unicode":["1f4c4"],"isCanonical": true},":mount_fuji:":{"unicode":["1f5fb"],"isCanonical": true},":tokyo_tower:":{"unicode":["1f5fc"],"isCanonical": true},":date:":{"unicode":["1f4c5"],"isCanonical": true},":statue_of_liberty:":{"unicode":["1f5fd"],"isCanonical": true},":japan:":{"unicode":["1f5fe"],"isCanonical": true},":calendar:":{"unicode":["1f4c6"],"isCanonical": true},":moyai:":{"unicode":["1f5ff"],"isCanonical": true},":grin:":{"unicode":["1f601"],"isCanonical": true},":joy:":{"unicode":["1f602"],"isCanonical": true},":smiley:":{"unicode":["1f603"],"isCanonical": true},":chart_with_upwards_trend:":{"unicode":["1f4c8"],"isCanonical": true},":smile:":{"unicode":["1f604"],"isCanonical": true},":sweat_smile:":{"unicode":["1f605"],"isCanonical": true},":chart_with_downwards_trend:":{"unicode":["1f4c9"],"isCanonical": true},":laughing:":{"unicode":["1f606"],"isCanonical": true},":satisfied:":{"unicode":["1f606"],"isCanonical": false},":wink:":{"unicode":["1f609"],"isCanonical": true},":bar_chart:":{"unicode":["1f4ca"],"isCanonical": true},":blush:":{"unicode":["1f60a"],"isCanonical": true},":yum:":{"unicode":["1f60b"],"isCanonical": true},":clipboard:":{"unicode":["1f4cb"],"isCanonical": true},":relieved:":{"unicode":["1f60c"],"isCanonical": true},":heart_eyes:":{"unicode":["1f60d"],"isCanonical": true},":pushpin:":{"unicode":["1f4cc"],"isCanonical": true},":smirk:":{"unicode":["1f60f"],"isCanonical": true},":unamused:":{"unicode":["1f612"],"isCanonical": true},":round_pushpin:":{"unicode":["1f4cd"],"isCanonical": true},":sweat:":{"unicode":["1f613"],"isCanonical": true},":pensive:":{"unicode":["1f614"],"isCanonical": true},":paperclip:":{"unicode":["1f4ce"],"isCanonical": true},":confounded:":{"unicode":["1f616"],"isCanonical": true},":kissing_heart:":{"unicode":["1f618"],"isCanonical": true},":straight_ruler:":{"unicode":["1f4cf"],"isCanonical": true},":kissing_closed_eyes:":{"unicode":["1f61a"],"isCanonical": true},":stuck_out_tongue_winking_eye:":{"unicode":["1f61c"],"isCanonical": true},":triangular_ruler:":{"unicode":["1f4d0"],"isCanonical": true},":stuck_out_tongue_closed_eyes:":{"unicode":["1f61d"],"isCanonical": true},":disappointed:":{"unicode":["1f61e"],"isCanonical": true},":bookmark_tabs:":{"unicode":["1f4d1"],"isCanonical": true},":angry:":{"unicode":["1f620"],"isCanonical": true},":rage:":{"unicode":["1f621"],"isCanonical": true},":cry:":{"unicode":["1f622"],"isCanonical": true},":persevere:":{"unicode":["1f623"],"isCanonical": true},":triumph:":{"unicode":["1f624"],"isCanonical": true},":disappointed_relieved:":{"unicode":["1f625"],"isCanonical": true},":fearful:":{"unicode":["1f628"],"isCanonical": true},":weary:":{"unicode":["1f629"],"isCanonical": true},":sleepy:":{"unicode":["1f62a"],"isCanonical": true},":tired_face:":{"unicode":["1f62b"],"isCanonical": true},":sob:":{"unicode":["1f62d"],"isCanonical": true},":cold_sweat:":{"unicode":["1f630"],"isCanonical": true},":scream:":{"unicode":["1f631"],"isCanonical": true},":astonished:":{"unicode":["1f632"],"isCanonical": true},":flushed:":{"unicode":["1f633"],"isCanonical": true},":dizzy_face:":{"unicode":["1f635"],"isCanonical": true},":mask:":{"unicode":["1f637"],"isCanonical": true},":smile_cat:":{"unicode":["1f638"],"isCanonical": true},":joy_cat:":{"unicode":["1f639"],"isCanonical": true},":smiley_cat:":{"unicode":["1f63a"],"isCanonical": true},":heart_eyes_cat:":{"unicode":["1f63b"],"isCanonical": true},":smirk_cat:":{"unicode":["1f63c"],"isCanonical": true},":kissing_cat:":{"unicode":["1f63d"],"isCanonical": true},":pouting_cat:":{"unicode":["1f63e"],"isCanonical": true},":crying_cat_face:":{"unicode":["1f63f"],"isCanonical": true},":scream_cat:":{"unicode":["1f640"],"isCanonical": true},":no_good:":{"unicode":["1f645"],"isCanonical": true},":ok_woman:":{"unicode":["1f646"],"isCanonical": true},":bow:":{"unicode":["1f647"],"isCanonical": true},":see_no_evil:":{"unicode":["1f648"],"isCanonical": true},":hear_no_evil:":{"unicode":["1f649"],"isCanonical": true},":speak_no_evil:":{"unicode":["1f64a"],"isCanonical": true},":raising_hand:":{"unicode":["1f64b"],"isCanonical": true},":raised_hands:":{"unicode":["1f64c"],"isCanonical": true},":person_frowning:":{"unicode":["1f64d"],"isCanonical": true},":person_with_pouting_face:":{"unicode":["1f64e"],"isCanonical": true},":pray:":{"unicode":["1f64f"],"isCanonical": true},":rocket:":{"unicode":["1f680"],"isCanonical": true},":railway_car:":{"unicode":["1f683"],"isCanonical": true},":bullettrain_side:":{"unicode":["1f684"],"isCanonical": true},":bullettrain_front:":{"unicode":["1f685"],"isCanonical": true},":metro:":{"unicode":["1f687"],"isCanonical": true},":station:":{"unicode":["1f689"],"isCanonical": true},":bus:":{"unicode":["1f68c"],"isCanonical": true},":busstop:":{"unicode":["1f68f"],"isCanonical": true},":ambulance:":{"unicode":["1f691"],"isCanonical": true},":fire_engine:":{"unicode":["1f692"],"isCanonical": true},":police_car:":{"unicode":["1f693"],"isCanonical": true},":taxi:":{"unicode":["1f695"],"isCanonical": true},":red_car:":{"unicode":["1f697"],"isCanonical": true},":blue_car:":{"unicode":["1f699"],"isCanonical": true},":truck:":{"unicode":["1f69a"],"isCanonical": true},":ship:":{"unicode":["1f6a2"],"isCanonical": true},":speedboat:":{"unicode":["1f6a4"],"isCanonical": true},":traffic_light:":{"unicode":["1f6a5"],"isCanonical": true},":construction:":{"unicode":["1f6a7"],"isCanonical": true},":rotating_light:":{"unicode":["1f6a8"],"isCanonical": true},":triangular_flag_on_post:":{"unicode":["1f6a9"],"isCanonical": true},":door:":{"unicode":["1f6aa"],"isCanonical": true},":no_entry_sign:":{"unicode":["1f6ab"],"isCanonical": true},":smoking:":{"unicode":["1f6ac"],"isCanonical": true},":no_smoking:":{"unicode":["1f6ad"],"isCanonical": true},":bike:":{"unicode":["1f6b2"],"isCanonical": true},":walking:":{"unicode":["1f6b6"],"isCanonical": true},":mens:":{"unicode":["1f6b9"],"isCanonical": true},":womens:":{"unicode":["1f6ba"],"isCanonical": true},":restroom:":{"unicode":["1f6bb"],"isCanonical": true},":baby_symbol:":{"unicode":["1f6bc"],"isCanonical": true},":toilet:":{"unicode":["1f6bd"],"isCanonical": true},":wc:":{"unicode":["1f6be"],"isCanonical": true},":bath:":{"unicode":["1f6c0"],"isCanonical": true},":metal:":{"unicode":["1f918"],"isCanonical": true},":sign_of_the_horns:":{"unicode":["1f918"],"isCanonical": false},":grinning:":{"unicode":["1f600"],"isCanonical": true},":innocent:":{"unicode":["1f607"],"isCanonical": true},":smiling_imp:":{"unicode":["1f608"],"isCanonical": true},":sunglasses:":{"unicode":["1f60e"],"isCanonical": true},":neutral_face:":{"unicode":["1f610"],"isCanonical": true},":expressionless:":{"unicode":["1f611"],"isCanonical": true},":confused:":{"unicode":["1f615"],"isCanonical": true},":kissing:":{"unicode":["1f617"],"isCanonical": true},":kissing_smiling_eyes:":{"unicode":["1f619"],"isCanonical": true},":stuck_out_tongue:":{"unicode":["1f61b"],"isCanonical": true},":worried:":{"unicode":["1f61f"],"isCanonical": true},":frowning:":{"unicode":["1f626"],"isCanonical": true},":anguished:":{"unicode":["1f627"],"isCanonical": true},":grimacing:":{"unicode":["1f62c"],"isCanonical": true},":open_mouth:":{"unicode":["1f62e"],"isCanonical": true},":hushed:":{"unicode":["1f62f"],"isCanonical": true},":sleeping:":{"unicode":["1f634"],"isCanonical": true},":no_mouth:":{"unicode":["1f636"],"isCanonical": true},":helicopter:":{"unicode":["1f681"],"isCanonical": true},":steam_locomotive:":{"unicode":["1f682"],"isCanonical": true},":train2:":{"unicode":["1f686"],"isCanonical": true},":light_rail:":{"unicode":["1f688"],"isCanonical": true},":tram:":{"unicode":["1f68a"],"isCanonical": true},":oncoming_bus:":{"unicode":["1f68d"],"isCanonical": true},":trolleybus:":{"unicode":["1f68e"],"isCanonical": true},":minibus:":{"unicode":["1f690"],"isCanonical": true},":oncoming_police_car:":{"unicode":["1f694"],"isCanonical": true},":oncoming_taxi:":{"unicode":["1f696"],"isCanonical": true},":oncoming_automobile:":{"unicode":["1f698"],"isCanonical": true},":articulated_lorry:":{"unicode":["1f69b"],"isCanonical": true},":tractor:":{"unicode":["1f69c"],"isCanonical": true},":monorail:":{"unicode":["1f69d"],"isCanonical": true},":mountain_railway:":{"unicode":["1f69e"],"isCanonical": true},":suspension_railway:":{"unicode":["1f69f"],"isCanonical": true},":mountain_cableway:":{"unicode":["1f6a0"],"isCanonical": true},":aerial_tramway:":{"unicode":["1f6a1"],"isCanonical": true},":rowboat:":{"unicode":["1f6a3"],"isCanonical": true},":vertical_traffic_light:":{"unicode":["1f6a6"],"isCanonical": true},":put_litter_in_its_place:":{"unicode":["1f6ae"],"isCanonical": true},":do_not_litter:":{"unicode":["1f6af"],"isCanonical": true},":potable_water:":{"unicode":["1f6b0"],"isCanonical": true},":non-potable_water:":{"unicode":["1f6b1"],"isCanonical": true},":no_bicycles:":{"unicode":["1f6b3"],"isCanonical": true},":bicyclist:":{"unicode":["1f6b4"],"isCanonical": true},":mountain_bicyclist:":{"unicode":["1f6b5"],"isCanonical": true},":no_pedestrians:":{"unicode":["1f6b7"],"isCanonical": true},":children_crossing:":{"unicode":["1f6b8"],"isCanonical": true},":shower:":{"unicode":["1f6bf"],"isCanonical": true},":bathtub:":{"unicode":["1f6c1"],"isCanonical": true},":passport_control:":{"unicode":["1f6c2"],"isCanonical": true},":customs:":{"unicode":["1f6c3"],"isCanonical": true},":baggage_claim:":{"unicode":["1f6c4"],"isCanonical": true},":left_luggage:":{"unicode":["1f6c5"],"isCanonical": true},":earth_africa:":{"unicode":["1f30d"],"isCanonical": true},":earth_americas:":{"unicode":["1f30e"],"isCanonical": true},":globe_with_meridians:":{"unicode":["1f310"],"isCanonical": true},":waxing_crescent_moon:":{"unicode":["1f312"],"isCanonical": true},":waning_gibbous_moon:":{"unicode":["1f316"],"isCanonical": true},":last_quarter_moon:":{"unicode":["1f317"],"isCanonical": true},":waning_crescent_moon:":{"unicode":["1f318"],"isCanonical": true},":new_moon_with_face:":{"unicode":["1f31a"],"isCanonical": true},":last_quarter_moon_with_face:":{"unicode":["1f31c"],"isCanonical": true},":full_moon_with_face:":{"unicode":["1f31d"],"isCanonical": true},":sun_with_face:":{"unicode":["1f31e"],"isCanonical": true},":evergreen_tree:":{"unicode":["1f332"],"isCanonical": true},":deciduous_tree:":{"unicode":["1f333"],"isCanonical": true},":lemon:":{"unicode":["1f34b"],"isCanonical": true},":pear:":{"unicode":["1f350"],"isCanonical": true},":baby_bottle:":{"unicode":["1f37c"],"isCanonical": true},":horse_racing:":{"unicode":["1f3c7"],"isCanonical": true},":rugby_football:":{"unicode":["1f3c9"],"isCanonical": true},":european_post_office:":{"unicode":["1f3e4"],"isCanonical": true},":rat:":{"unicode":["1f400"],"isCanonical": true},":mouse2:":{"unicode":["1f401"],"isCanonical": true},":ox:":{"unicode":["1f402"],"isCanonical": true},":water_buffalo:":{"unicode":["1f403"],"isCanonical": true},":cow2:":{"unicode":["1f404"],"isCanonical": true},":tiger2:":{"unicode":["1f405"],"isCanonical": true},":leopard:":{"unicode":["1f406"],"isCanonical": true},":rabbit2:":{"unicode":["1f407"],"isCanonical": true},":cat2:":{"unicode":["1f408"],"isCanonical": true},":dragon:":{"unicode":["1f409"],"isCanonical": true},":crocodile:":{"unicode":["1f40a"],"isCanonical": true},":whale2:":{"unicode":["1f40b"],"isCanonical": true},":ram:":{"unicode":["1f40f"],"isCanonical": true},":goat:":{"unicode":["1f410"],"isCanonical": true},":rooster:":{"unicode":["1f413"],"isCanonical": true},":dog2:":{"unicode":["1f415"],"isCanonical": true},":pig2:":{"unicode":["1f416"],"isCanonical": true},":dromedary_camel:":{"unicode":["1f42a"],"isCanonical": true},":busts_in_silhouette:":{"unicode":["1f465"],"isCanonical": true},":two_men_holding_hands:":{"unicode":["1f46c"],"isCanonical": true},":two_women_holding_hands:":{"unicode":["1f46d"],"isCanonical": true},":thought_balloon:":{"unicode":["1f4ad"],"isCanonical": true},":euro:":{"unicode":["1f4b6"],"isCanonical": true},":pound:":{"unicode":["1f4b7"],"isCanonical": true},":mailbox_with_mail:":{"unicode":["1f4ec"],"isCanonical": true},":mailbox_with_no_mail:":{"unicode":["1f4ed"],"isCanonical": true},":postal_horn:":{"unicode":["1f4ef"],"isCanonical": true},":no_mobile_phones:":{"unicode":["1f4f5"],"isCanonical": true},":twisted_rightwards_arrows:":{"unicode":["1f500"],"isCanonical": true},":repeat:":{"unicode":["1f501"],"isCanonical": true},":repeat_one:":{"unicode":["1f502"],"isCanonical": true},":arrows_counterclockwise:":{"unicode":["1f504"],"isCanonical": true},":low_brightness:":{"unicode":["1f505"],"isCanonical": true},":high_brightness:":{"unicode":["1f506"],"isCanonical": true},":mute:":{"unicode":["1f507"],"isCanonical": true},":sound:":{"unicode":["1f509"],"isCanonical": true},":no_bell:":{"unicode":["1f515"],"isCanonical": true},":microscope:":{"unicode":["1f52c"],"isCanonical": true},":telescope:":{"unicode":["1f52d"],"isCanonical": true},":clock130:":{"unicode":["1f55c"],"isCanonical": true},":clock230:":{"unicode":["1f55d"],"isCanonical": true},":clock330:":{"unicode":["1f55e"],"isCanonical": true},":clock430:":{"unicode":["1f55f"],"isCanonical": true},":clock530:":{"unicode":["1f560"],"isCanonical": true},":clock630:":{"unicode":["1f561"],"isCanonical": true},":clock730:":{"unicode":["1f562"],"isCanonical": true},":clock830:":{"unicode":["1f563"],"isCanonical": true},":clock930:":{"unicode":["1f564"],"isCanonical": true},":clock1030:":{"unicode":["1f565"],"isCanonical": true},":clock1130:":{"unicode":["1f566"],"isCanonical": true},":clock1230:":{"unicode":["1f567"],"isCanonical": true},":speaker:":{"unicode":["1f508"],"isCanonical": true},":train:":{"unicode":["1f68b"],"isCanonical": true},":medal:":{"unicode":["1f3c5"],"isCanonical": true},":sports_medal:":{"unicode":["1f3c5"],"isCanonical": false},":flag_black:":{"unicode":["1f3f4"],"isCanonical": true},":waving_black_flag:":{"unicode":["1f3f4"],"isCanonical": false},":camera_with_flash:":{"unicode":["1f4f8"],"isCanonical": true},":sleeping_accommodation:":{"unicode":["1f6cc"],"isCanonical": true},":middle_finger:":{"unicode":["1f595"],"isCanonical": true},":reversed_hand_with_middle_finger_extended:":{"unicode":["1f595"],"isCanonical": false},":vulcan:":{"unicode":["1f596"],"isCanonical": true},":raised_hand_with_part_between_middle_and_ring_fingers:":{"unicode":["1f596"],"isCanonical": false},":slight_frown:":{"unicode":["1f641"],"isCanonical": true},":slightly_frowning_face:":{"unicode":["1f641"],"isCanonical": false},":slight_smile:":{"unicode":["1f642"],"isCanonical": true},":slightly_smiling_face:":{"unicode":["1f642"],"isCanonical": false},":airplane_departure:":{"unicode":["1f6eb"],"isCanonical": true},":airplane_arriving:":{"unicode":["1f6ec"],"isCanonical": true},":tone1:":{"unicode":["1f3fb"],"isCanonical": true},":tone2:":{"unicode":["1f3fc"],"isCanonical": true},":tone3:":{"unicode":["1f3fd"],"isCanonical": true},":tone4:":{"unicode":["1f3fe"],"isCanonical": true},":tone5:":{"unicode":["1f3ff"],"isCanonical": true},":upside_down:":{"unicode":["1f643"],"isCanonical": true},":upside_down_face:":{"unicode":["1f643"],"isCanonical": false},":money_mouth:":{"unicode":["1f911"],"isCanonical": true},":money_mouth_face:":{"unicode":["1f911"],"isCanonical": false},":nerd:":{"unicode":["1f913"],"isCanonical": true},":nerd_face:":{"unicode":["1f913"],"isCanonical": false},":hugging:":{"unicode":["1f917"],"isCanonical": true},":hugging_face:":{"unicode":["1f917"],"isCanonical": false},":rolling_eyes:":{"unicode":["1f644"],"isCanonical": true},":face_with_rolling_eyes:":{"unicode":["1f644"],"isCanonical": false},":thinking:":{"unicode":["1f914"],"isCanonical": true},":thinking_face:":{"unicode":["1f914"],"isCanonical": false},":zipper_mouth:":{"unicode":["1f910"],"isCanonical": true},":zipper_mouth_face:":{"unicode":["1f910"],"isCanonical": false},":thermometer_face:":{"unicode":["1f912"],"isCanonical": true},":face_with_thermometer:":{"unicode":["1f912"],"isCanonical": false},":head_bandage:":{"unicode":["1f915"],"isCanonical": true},":face_with_head_bandage:":{"unicode":["1f915"],"isCanonical": false},":robot:":{"unicode":["1f916"],"isCanonical": true},":robot_face:":{"unicode":["1f916"],"isCanonical": false},":lion_face:":{"unicode":["1f981"],"isCanonical": true},":lion:":{"unicode":["1f981"],"isCanonical": false},":unicorn:":{"unicode":["1f984"],"isCanonical": true},":unicorn_face:":{"unicode":["1f984"],"isCanonical": false},":scorpion:":{"unicode":["1f982"],"isCanonical": true},":crab:":{"unicode":["1f980"],"isCanonical": true},":turkey:":{"unicode":["1f983"],"isCanonical": true},":cheese:":{"unicode":["1f9c0"],"isCanonical": true},":cheese_wedge:":{"unicode":["1f9c0"],"isCanonical": false},":hotdog:":{"unicode":["1f32d"],"isCanonical": true},":hot_dog:":{"unicode":["1f32d"],"isCanonical": false},":taco:":{"unicode":["1f32e"],"isCanonical": true},":burrito:":{"unicode":["1f32f"],"isCanonical": true},":popcorn:":{"unicode":["1f37f"],"isCanonical": true},":champagne:":{"unicode":["1f37e"],"isCanonical": true},":bottle_with_popping_cork:":{"unicode":["1f37e"],"isCanonical": false},":bow_and_arrow:":{"unicode":["1f3f9"],"isCanonical": true},":archery:":{"unicode":["1f3f9"],"isCanonical": false},":amphora:":{"unicode":["1f3fa"],"isCanonical": true},":place_of_worship:":{"unicode":["1f6d0"],"isCanonical": true},":worship_symbol:":{"unicode":["1f6d0"],"isCanonical": false},":kaaba:":{"unicode":["1f54b"],"isCanonical": true},":mosque:":{"unicode":["1f54c"],"isCanonical": true},":synagogue:":{"unicode":["1f54d"],"isCanonical": true},":menorah:":{"unicode":["1f54e"],"isCanonical": true},":prayer_beads:":{"unicode":["1f4ff"],"isCanonical": true},":cricket:":{"unicode":["1f3cf"],"isCanonical": true},":cricket_bat_ball:":{"unicode":["1f3cf"],"isCanonical": false},":volleyball:":{"unicode":["1f3d0"],"isCanonical": true},":field_hockey:":{"unicode":["1f3d1"],"isCanonical": true},":hockey:":{"unicode":["1f3d2"],"isCanonical": true},":ping_pong:":{"unicode":["1f3d3"],"isCanonical": true},":table_tennis:":{"unicode":["1f3d3"],"isCanonical": false},":badminton:":{"unicode":["1f3f8"],"isCanonical": true},":drum:":{"unicode":["1f941"],"isCanonical": true},":drum_with_drumsticks:":{"unicode":["1f941"],"isCanonical": false},":shrimp:":{"unicode":["1f990"],"isCanonical": true},":squid:":{"unicode":["1f991"],"isCanonical": true},":egg:":{"unicode":["1f95a"],"isCanonical": true},":milk:":{"unicode":["1f95b"],"isCanonical": true},":glass_of_milk:":{"unicode":["1f95b"],"isCanonical": false},":peanuts:":{"unicode":["1f95c"],"isCanonical": true},":shelled_peanut:":{"unicode":["1f95c"],"isCanonical": false},":kiwi:":{"unicode":["1f95d"],"isCanonical": true},":kiwifruit:":{"unicode":["1f95d"],"isCanonical": false},":pancakes:":{"unicode":["1f95e"],"isCanonical": true},":regional_indicator_w:":{"unicode":["1f1fc"],"isCanonical": true},":regional_indicator_v:":{"unicode":["1f1fb"],"isCanonical": true},":regional_indicator_u:":{"unicode":["1f1fa"],"isCanonical": true},":regional_indicator_t:":{"unicode":["1f1f9"],"isCanonical": true},":regional_indicator_s:":{"unicode":["1f1f8"],"isCanonical": true},":regional_indicator_r:":{"unicode":["1f1f7"],"isCanonical": true},":regional_indicator_q:":{"unicode":["1f1f6"],"isCanonical": true},":regional_indicator_p:":{"unicode":["1f1f5"],"isCanonical": true},":regional_indicator_o:":{"unicode":["1f1f4"],"isCanonical": true},":regional_indicator_n:":{"unicode":["1f1f3"],"isCanonical": true},":regional_indicator_m:":{"unicode":["1f1f2"],"isCanonical": true},":regional_indicator_l:":{"unicode":["1f1f1"],"isCanonical": true},":regional_indicator_k:":{"unicode":["1f1f0"],"isCanonical": true},":regional_indicator_j:":{"unicode":["1f1ef"],"isCanonical": true},":regional_indicator_i:":{"unicode":["1f1ee"],"isCanonical": true},":regional_indicator_h:":{"unicode":["1f1ed"],"isCanonical": true},":regional_indicator_g:":{"unicode":["1f1ec"],"isCanonical": true},":regional_indicator_f:":{"unicode":["1f1eb"],"isCanonical": true},":regional_indicator_e:":{"unicode":["1f1ea"],"isCanonical": true},":regional_indicator_d:":{"unicode":["1f1e9"],"isCanonical": true},":regional_indicator_c:":{"unicode":["1f1e8"],"isCanonical": true},":regional_indicator_b:":{"unicode":["1f1e7"],"isCanonical": true},":regional_indicator_a:":{"unicode":["1f1e6"],"isCanonical": true},":fast_forward:":{"unicode":["23e9"],"isCanonical": true},":rewind:":{"unicode":["23ea"],"isCanonical": true},":arrow_double_up:":{"unicode":["23eb"],"isCanonical": true},":arrow_double_down:":{"unicode":["23ec"],"isCanonical": true},":alarm_clock:":{"unicode":["23f0"],"isCanonical": true},":hourglass_flowing_sand:":{"unicode":["23f3"],"isCanonical": true},":ophiuchus:":{"unicode":["26ce"],"isCanonical": true},":white_check_mark:":{"unicode":["2705"],"isCanonical": true},":fist:":{"unicode":["270a"],"isCanonical": true},":raised_hand:":{"unicode":["270b"],"isCanonical": true},":sparkles:":{"unicode":["2728"],"isCanonical": true},":x:":{"unicode":["274c"],"isCanonical": true},":negative_squared_cross_mark:":{"unicode":["274e"],"isCanonical": true},":question:":{"unicode":["2753"],"isCanonical": true},":grey_question:":{"unicode":["2754"],"isCanonical": true},":grey_exclamation:":{"unicode":["2755"],"isCanonical": true},":heavy_plus_sign:":{"unicode":["2795"],"isCanonical": true},":heavy_minus_sign:":{"unicode":["2796"],"isCanonical": true},":heavy_division_sign:":{"unicode":["2797"],"isCanonical": true},":curly_loop:":{"unicode":["27b0"],"isCanonical": true},":loop:":{"unicode":["27bf"],"isCanonical": true}};
    // ns.shortnames = Object.keys(ns.emojioneList).map(function(emoji) {
    //     return emoji.replace(/[+]/g, "\\$&");
    // }).join('|');
    var tmpShortNames = [],
        emoji;
    for (emoji in ns.emojioneList) {
        if (!ns.emojioneList.hasOwnProperty(emoji)) continue;
        tmpShortNames.push(emoji.replace(/[+]/g, "\\$&"));
    }
    ns.shortnames = tmpShortNames.join('|');
    ns.asciiList = {
        '<3':'2764',
        '</3':'1f494',
        ':\')':'1f602',
        ':\'-)':'1f602',
        ':D':'1f603',
        ':-D':'1f603',
        '=D':'1f603',
        ':)':'1f642',
        ':-)':'1f642',
        '=]':'1f642',
        '=)':'1f642',
        ':]':'1f642',
        '\':)':'1f605',
        '\':-)':'1f605',
        '\'=)':'1f605',
        '\':D':'1f605',
        '\':-D':'1f605',
        '\'=D':'1f605',
        '>:)':'1f606',
        '>;)':'1f606',
        '>:-)':'1f606',
        '>=)':'1f606',
        ';)':'1f609',
        ';-)':'1f609',
        '*-)':'1f609',
        '*)':'1f609',
        ';-]':'1f609',
        ';]':'1f609',
        ';D':'1f609',
        ';^)':'1f609',
        '\':(':'1f613',
        '\':-(':'1f613',
        '\'=(':'1f613',
        ':*':'1f618',
        ':-*':'1f618',
        '=*':'1f618',
        ':^*':'1f618',
        '>:P':'1f61c',
        'X-P':'1f61c',
        'x-p':'1f61c',
        '>:[':'1f61e',
        ':-(':'1f61e',
        ':(':'1f61e',
        ':-[':'1f61e',
        ':[':'1f61e',
        '=(':'1f61e',
        '>:(':'1f620',
        '>:-(':'1f620',
        ':@':'1f620',
        ':\'(':'1f622',
        ':\'-(':'1f622',
        ';(':'1f622',
        ';-(':'1f622',
        '>.<':'1f623',
        'D:':'1f628',
        ':$':'1f633',
        '=$':'1f633',
        '#-)':'1f635',
        '#)':'1f635',
        '%-)':'1f635',
        '%)':'1f635',
        'X)':'1f635',
        'X-)':'1f635',
        '*\\0/*':'1f646',
        '\\0/':'1f646',
        '*\\O/*':'1f646',
        '\\O/':'1f646',
        'O:-)':'1f607',
        '0:-3':'1f607',
        '0:3':'1f607',
        '0:-)':'1f607',
        '0:)':'1f607',
        '0;^)':'1f607',
        'O:)':'1f607',
        'O;-)':'1f607',
        'O=)':'1f607',
        '0;-)':'1f607',
        'O:-3':'1f607',
        'O:3':'1f607',
        'B-)':'1f60e',
        'B)':'1f60e',
        '8)':'1f60e',
        '8-)':'1f60e',
        'B-D':'1f60e',
        '8-D':'1f60e',
        '-_-':'1f611',
        '-__-':'1f611',
        '-___-':'1f611',
        '>:\\':'1f615',
        '>:/':'1f615',
        ':-/':'1f615',
        ':-.':'1f615',
        ':/':'1f615',
        ':\\':'1f615',
        '=/':'1f615',
        '=\\':'1f615',
        ':L':'1f615',
        '=L':'1f615',
        ':P':'1f61b',
        ':-P':'1f61b',
        '=P':'1f61b',
        ':-p':'1f61b',
        ':p':'1f61b',
        '=p':'1f61b',
        ':-Þ':'1f61b',
        ':Þ':'1f61b',
        ':þ':'1f61b',
        ':-þ':'1f61b',
        ':-b':'1f61b',
        ':b':'1f61b',
        'd:':'1f61b',
        ':-O':'1f62e',
        ':O':'1f62e',
        ':-o':'1f62e',
        ':o':'1f62e',
        'O_O':'1f62e',
        '>:O':'1f62e',
        ':-X':'1f636',
        ':X':'1f636',
        ':-#':'1f636',
        ':#':'1f636',
        '=X':'1f636',
        '=x':'1f636',
        ':x':'1f636',
        ':-x':'1f636',
        '=#':'1f636'
    };
    ns.asciiRegexp = '(\\<3|&lt;3|\\<\\/3|&lt;\\/3|\\:\'\\)|\\:\'\\-\\)|\\:D|\\:\\-D|\\=D|\\:\\)|\\:\\-\\)|\\=\\]|\\=\\)|\\:\\]|\'\\:\\)|\'\\:\\-\\)|\'\\=\\)|\'\\:D|\'\\:\\-D|\'\\=D|\\>\\:\\)|&gt;\\:\\)|\\>;\\)|&gt;;\\)|\\>\\:\\-\\)|&gt;\\:\\-\\)|\\>\\=\\)|&gt;\\=\\)|;\\)|;\\-\\)|\\*\\-\\)|\\*\\)|;\\-\\]|;\\]|;D|;\\^\\)|\'\\:\\(|\'\\:\\-\\(|\'\\=\\(|\\:\\*|\\:\\-\\*|\\=\\*|\\:\\^\\*|\\>\\:P|&gt;\\:P|X\\-P|x\\-p|\\>\\:\\[|&gt;\\:\\[|\\:\\-\\(|\\:\\(|\\:\\-\\[|\\:\\[|\\=\\(|\\>\\:\\(|&gt;\\:\\(|\\>\\:\\-\\(|&gt;\\:\\-\\(|\\:@|\\:\'\\(|\\:\'\\-\\(|;\\(|;\\-\\(|\\>\\.\\<|&gt;\\.&lt;|D\\:|\\:\\$|\\=\\$|#\\-\\)|#\\)|%\\-\\)|%\\)|X\\)|X\\-\\)|\\*\\\\0\\/\\*|\\\\0\\/|\\*\\\\O\\/\\*|\\\\O\\/|O\\:\\-\\)|0\\:\\-3|0\\:3|0\\:\\-\\)|0\\:\\)|0;\\^\\)|O\\:\\-\\)|O\\:\\)|O;\\-\\)|O\\=\\)|0;\\-\\)|O\\:\\-3|O\\:3|B\\-\\)|B\\)|8\\)|8\\-\\)|B\\-D|8\\-D|\\-_\\-|\\-__\\-|\\-___\\-|\\>\\:\\\\|&gt;\\:\\\\|\\>\\:\\/|&gt;\\:\\/|\\:\\-\\/|\\:\\-\\.|\\:\\/|\\:\\\\|\\=\\/|\\=\\\\|\\:L|\\=L|\\:P|\\:\\-P|\\=P|\\:\\-p|\\:p|\\=p|\\:\\-Þ|\\:\\-&THORN;|\\:Þ|\\:&THORN;|\\:þ|\\:&thorn;|\\:\\-þ|\\:\\-&thorn;|\\:\\-b|\\:b|d\\:|\\:\\-O|\\:O|\\:\\-o|\\:o|O_O|\\>\\:O|&gt;\\:O|\\:\\-X|\\:X|\\:\\-#|\\:#|\\=X|\\=x|\\:x|\\:\\-x|\\=#)';
    // javascript escapes here must be ordered from largest length to shortest
    ns.unicodeRegexp = '(\\uD83D\\uDC69\\u200D\\u2764\\uFE0F\\u200D\\uD83D\\uDC8B\\u200D\\uD83D\\uDC69|\\uD83D\\uDC68\\u200D\\u2764\\uFE0F\\u200D\\uD83D\\uDC8B\\u200D\\uD83D\\uDC68|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC67|\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC67|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66\\u200D\\uD83D\\uDC66|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC66|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67\\u200D\\uD83D\\uDC67|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC66\\u200D\\uD83D\\uDC66|\\uD83D\\uDC68\\u200D\\u2764\\uFE0F\\u200D\\uD83D\\uDC68|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC67|\\uD83D\\uDC68\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC66|\\uD83D\\uDC69\\u200D\\uD83D\\uDC69\\u200D\\uD83D\\uDC67|\\uD83D\\uDC69\\u200D\\u2764\\uFE0F\\u200D\\uD83D\\uDC69|\\uD83D\\uDC68\\u200D\\uD83D\\uDC68\\u200D\\uD83D\\uDC66|\\uD83D\\uDC41\\u200D\\uD83D\\uDDE8|\\uD83C\\uDDE6\\uD83C\\uDDE9|\\uD83C\\uDDE6\\uD83C\\uDDEA|\\uD83C\\uDDE6\\uD83C\\uDDEB|\\uD83C\\uDDE6\\uD83C\\uDDEC|\\uD83C\\uDDE6\\uD83C\\uDDEE|\\uD83C\\uDDE6\\uD83C\\uDDF1|\\uD83C\\uDDE6\\uD83C\\uDDF2|\\uD83C\\uDDE6\\uD83C\\uDDF4|\\uD83C\\uDDE6\\uD83C\\uDDF6|\\uD83C\\uDDE6\\uD83C\\uDDF7|\\uD83C\\uDDE6\\uD83C\\uDDF8|\\uD83E\\uDD18\\uD83C\\uDFFF|\\uD83E\\uDD18\\uD83C\\uDFFE|\\uD83E\\uDD18\\uD83C\\uDFFD|\\uD83E\\uDD18\\uD83C\\uDFFC|\\uD83E\\uDD18\\uD83C\\uDFFB|\\uD83D\\uDEC0\\uD83C\\uDFFF|\\uD83D\\uDEC0\\uD83C\\uDFFE|\\uD83D\\uDEC0\\uD83C\\uDFFD|\\uD83D\\uDEC0\\uD83C\\uDFFC|\\uD83D\\uDEC0\\uD83C\\uDFFB|\\uD83D\\uDEB6\\uD83C\\uDFFF|\\uD83D\\uDEB6\\uD83C\\uDFFE|\\uD83D\\uDEB6\\uD83C\\uDFFD|\\uD83D\\uDEB6\\uD83C\\uDFFC|\\uD83D\\uDEB6\\uD83C\\uDFFB|\\uD83D\\uDEB5\\uD83C\\uDFFF|\\uD83D\\uDEB5\\uD83C\\uDFFE|\\uD83D\\uDEB5\\uD83C\\uDFFD|\\uD83D\\uDEB5\\uD83C\\uDFFC|\\uD83D\\uDEB5\\uD83C\\uDFFB|\\uD83D\\uDEB4\\uD83C\\uDFFF|\\uD83D\\uDEB4\\uD83C\\uDFFE|\\uD83D\\uDEB4\\uD83C\\uDFFD|\\uD83D\\uDEB4\\uD83C\\uDFFC|\\uD83D\\uDEB4\\uD83C\\uDFFB|\\uD83D\\uDEA3\\uD83C\\uDFFF|\\uD83D\\uDEA3\\uD83C\\uDFFE|\\uD83D\\uDEA3\\uD83C\\uDFFD|\\uD83D\\uDEA3\\uD83C\\uDFFC|\\uD83D\\uDEA3\\uD83C\\uDFFB|\\uD83D\\uDE4F\\uD83C\\uDFFF|\\uD83D\\uDE4F\\uD83C\\uDFFE|\\uD83D\\uDE4F\\uD83C\\uDFFD|\\uD83D\\uDE4F\\uD83C\\uDFFC|\\uD83D\\uDE4F\\uD83C\\uDFFB|\\uD83D\\uDE4E\\uD83C\\uDFFF|\\uD83D\\uDE4E\\uD83C\\uDFFE|\\uD83D\\uDE4E\\uD83C\\uDFFD|\\uD83D\\uDE4E\\uD83C\\uDFFC|\\uD83D\\uDE4E\\uD83C\\uDFFB|\\uD83D\\uDE4D\\uD83C\\uDFFF|\\uD83D\\uDE4D\\uD83C\\uDFFE|\\uD83D\\uDE4D\\uD83C\\uDFFD|\\uD83D\\uDE4D\\uD83C\\uDFFC|\\uD83D\\uDE4D\\uD83C\\uDFFB|\\uD83D\\uDE4C\\uD83C\\uDFFF|\\uD83D\\uDE4C\\uD83C\\uDFFE|\\uD83D\\uDE4C\\uD83C\\uDFFD|\\uD83D\\uDE4C\\uD83C\\uDFFC|\\uD83D\\uDE4C\\uD83C\\uDFFB|\\uD83D\\uDE4B\\uD83C\\uDFFF|\\uD83D\\uDE4B\\uD83C\\uDFFE|\\uD83D\\uDE4B\\uD83C\\uDFFD|\\uD83D\\uDE4B\\uD83C\\uDFFC|\\uD83D\\uDE4B\\uD83C\\uDFFB|\\uD83D\\uDE47\\uD83C\\uDFFF|\\uD83D\\uDE47\\uD83C\\uDFFE|\\uD83D\\uDE47\\uD83C\\uDFFD|\\uD83D\\uDE47\\uD83C\\uDFFC|\\uD83D\\uDE47\\uD83C\\uDFFB|\\uD83D\\uDE46\\uD83C\\uDFFF|\\uD83D\\uDE46\\uD83C\\uDFFE|\\uD83D\\uDE46\\uD83C\\uDFFD|\\uD83D\\uDE46\\uD83C\\uDFFC|\\uD83D\\uDE46\\uD83C\\uDFFB|\\uD83D\\uDE45\\uD83C\\uDFFF|\\uD83D\\uDE45\\uD83C\\uDFFE|\\uD83D\\uDE45\\uD83C\\uDFFD|\\uD83D\\uDE45\\uD83C\\uDFFC|\\uD83D\\uDE45\\uD83C\\uDFFB|\\uD83D\\uDD96\\uD83C\\uDFFF|\\uD83D\\uDD96\\uD83C\\uDFFE|\\uD83D\\uDD96\\uD83C\\uDFFD|\\uD83D\\uDD96\\uD83C\\uDFFC|\\uD83D\\uDD96\\uD83C\\uDFFB|\\uD83D\\uDD95\\uD83C\\uDFFF|\\uD83D\\uDD95\\uD83C\\uDFFE|\\uD83D\\uDD95\\uD83C\\uDFFD|\\uD83D\\uDD95\\uD83C\\uDFFC|\\uD83D\\uDD95\\uD83C\\uDFFB|\\uD83D\\uDD90\\uD83C\\uDFFF|\\uD83D\\uDD90\\uD83C\\uDFFE|\\uD83D\\uDD90\\uD83C\\uDFFD|\\uD83D\\uDD90\\uD83C\\uDFFC|\\uD83D\\uDD90\\uD83C\\uDFFB|\\uD83D\\uDD75\\uD83C\\uDFFF|\\uD83D\\uDD75\\uD83C\\uDFFE|\\uD83D\\uDD75\\uD83C\\uDFFD|\\uD83D\\uDD75\\uD83C\\uDFFC|\\uD83D\\uDD75\\uD83C\\uDFFB|\\uD83D\\uDCAA\\uD83C\\uDFFF|\\uD83D\\uDCAA\\uD83C\\uDFFE|\\uD83D\\uDCAA\\uD83C\\uDFFD|\\uD83D\\uDCAA\\uD83C\\uDFFC|\\uD83D\\uDCAA\\uD83C\\uDFFB|\\uD83D\\uDC87\\uD83C\\uDFFF|\\uD83D\\uDC87\\uD83C\\uDFFE|\\uD83D\\uDC87\\uD83C\\uDFFD|\\uD83D\\uDC87\\uD83C\\uDFFC|\\uD83D\\uDC87\\uD83C\\uDFFB|\\uD83D\\uDC86\\uD83C\\uDFFF|\\uD83D\\uDC86\\uD83C\\uDFFE|\\uD83D\\uDC86\\uD83C\\uDFFD|\\uD83D\\uDC86\\uD83C\\uDFFC|\\uD83D\\uDC86\\uD83C\\uDFFB|\\uD83D\\uDC85\\uD83C\\uDFFF|\\uD83D\\uDC85\\uD83C\\uDFFE|\\uD83D\\uDC85\\uD83C\\uDFFD|\\uD83D\\uDC85\\uD83C\\uDFFC|\\uD83D\\uDC85\\uD83C\\uDFFB|\\uD83D\\uDC83\\uD83C\\uDFFF|\\uD83D\\uDC83\\uD83C\\uDFFE|\\uD83D\\uDC83\\uD83C\\uDFFD|\\uD83D\\uDC83\\uD83C\\uDFFC|\\uD83D\\uDC83\\uD83C\\uDFFB|\\uD83D\\uDC82\\uD83C\\uDFFF|\\uD83D\\uDC82\\uD83C\\uDFFE|\\uD83D\\uDC82\\uD83C\\uDFFD|\\uD83D\\uDC82\\uD83C\\uDFFC|\\uD83D\\uDC82\\uD83C\\uDFFB|\\uD83D\\uDC81\\uD83C\\uDFFF|\\uD83D\\uDC81\\uD83C\\uDFFE|\\uD83D\\uDC81\\uD83C\\uDFFD|\\uD83D\\uDC81\\uD83C\\uDFFC|\\uD83D\\uDC81\\uD83C\\uDFFB|\\uD83D\\uDC7C\\uD83C\\uDFFF|\\uD83D\\uDC7C\\uD83C\\uDFFE|\\uD83D\\uDC7C\\uD83C\\uDFFD|\\uD83D\\uDC7C\\uD83C\\uDFFC|\\uD83D\\uDC7C\\uD83C\\uDFFB|\\uD83D\\uDC78\\uD83C\\uDFFF|\\uD83D\\uDC78\\uD83C\\uDFFE|\\uD83D\\uDC78\\uD83C\\uDFFD|\\uD83D\\uDC78\\uD83C\\uDFFC|\\uD83D\\uDC78\\uD83C\\uDFFB|\\uD83D\\uDC77\\uD83C\\uDFFF|\\uD83D\\uDC77\\uD83C\\uDFFE|\\uD83D\\uDC77\\uD83C\\uDFFD|\\uD83D\\uDC77\\uD83C\\uDFFC|\\uD83D\\uDC77\\uD83C\\uDFFB|\\uD83D\\uDC76\\uD83C\\uDFFF|\\uD83D\\uDC76\\uD83C\\uDFFE|\\uD83D\\uDC76\\uD83C\\uDFFD|\\uD83D\\uDC76\\uD83C\\uDFFC|\\uD83D\\uDC76\\uD83C\\uDFFB|\\uD83D\\uDC75\\uD83C\\uDFFF|\\uD83D\\uDC75\\uD83C\\uDFFE|\\uD83D\\uDC75\\uD83C\\uDFFD|\\uD83D\\uDC75\\uD83C\\uDFFC|\\uD83D\\uDC75\\uD83C\\uDFFB|\\uD83D\\uDC74\\uD83C\\uDFFF|\\uD83D\\uDC74\\uD83C\\uDFFE|\\uD83D\\uDC74\\uD83C\\uDFFD|\\uD83D\\uDC74\\uD83C\\uDFFC|\\uD83D\\uDC74\\uD83C\\uDFFB|\\uD83D\\uDC73\\uD83C\\uDFFF|\\uD83D\\uDC73\\uD83C\\uDFFE|\\uD83D\\uDC73\\uD83C\\uDFFD|\\uD83D\\uDC73\\uD83C\\uDFFC|\\uD83D\\uDC73\\uD83C\\uDFFB|\\uD83D\\uDC72\\uD83C\\uDFFF|\\uD83D\\uDC72\\uD83C\\uDFFE|\\uD83D\\uDC72\\uD83C\\uDFFD|\\uD83D\\uDC72\\uD83C\\uDFFC|\\uD83D\\uDC72\\uD83C\\uDFFB|\\uD83D\\uDC71\\uD83C\\uDFFF|\\uD83D\\uDC71\\uD83C\\uDFFE|\\uD83D\\uDC71\\uD83C\\uDFFD|\\uD83D\\uDC71\\uD83C\\uDFFC|\\uD83D\\uDC71\\uD83C\\uDFFB|\\uD83D\\uDC70\\uD83C\\uDFFF|\\uD83D\\uDC70\\uD83C\\uDFFE|\\uD83D\\uDC70\\uD83C\\uDFFD|\\uD83D\\uDC70\\uD83C\\uDFFC|\\uD83D\\uDC70\\uD83C\\uDFFB|\\uD83D\\uDC6E\\uD83C\\uDFFF|\\uD83D\\uDC6E\\uD83C\\uDFFE|\\uD83D\\uDC6E\\uD83C\\uDFFD|\\uD83D\\uDC6E\\uD83C\\uDFFC|\\uD83D\\uDC6E\\uD83C\\uDFFB|\\uD83D\\uDC69\\uD83C\\uDFFF|\\uD83D\\uDC69\\uD83C\\uDFFE|\\uD83D\\uDC69\\uD83C\\uDFFD|\\uD83D\\uDC69\\uD83C\\uDFFC|\\uD83D\\uDC69\\uD83C\\uDFFB|\\uD83D\\uDC68\\uD83C\\uDFFF|\\uD83D\\uDC68\\uD83C\\uDFFE|\\uD83D\\uDC68\\uD83C\\uDFFD|\\uD83D\\uDC68\\uD83C\\uDFFC|\\uD83D\\uDC68\\uD83C\\uDFFB|\\uD83D\\uDC67\\uD83C\\uDFFF|\\uD83D\\uDC67\\uD83C\\uDFFE|\\uD83D\\uDC67\\uD83C\\uDFFD|\\uD83D\\uDC67\\uD83C\\uDFFC|\\uD83D\\uDC67\\uD83C\\uDFFB|\\uD83D\\uDC66\\uD83C\\uDFFF|\\uD83D\\uDC66\\uD83C\\uDFFE|\\uD83D\\uDC66\\uD83C\\uDFFD|\\uD83D\\uDC66\\uD83C\\uDFFC|\\uD83D\\uDC66\\uD83C\\uDFFB|\\uD83D\\uDC50\\uD83C\\uDFFF|\\uD83D\\uDC50\\uD83C\\uDFFE|\\uD83D\\uDC50\\uD83C\\uDFFD|\\uD83D\\uDC50\\uD83C\\uDFFC|\\uD83D\\uDC50\\uD83C\\uDFFB|\\uD83D\\uDC4F\\uD83C\\uDFFF|\\uD83D\\uDC4F\\uD83C\\uDFFE|\\uD83D\\uDC4F\\uD83C\\uDFFD|\\uD83D\\uDC4F\\uD83C\\uDFFC|\\uD83D\\uDC4F\\uD83C\\uDFFB|\\uD83D\\uDC4E\\uD83C\\uDFFF|\\uD83D\\uDC4E\\uD83C\\uDFFE|\\uD83D\\uDC4E\\uD83C\\uDFFD|\\uD83D\\uDC4E\\uD83C\\uDFFC|\\uD83D\\uDC4E\\uD83C\\uDFFB|\\uD83D\\uDC4D\\uD83C\\uDFFF|\\uD83D\\uDC4D\\uD83C\\uDFFE|\\uD83D\\uDC4D\\uD83C\\uDFFD|\\uD83D\\uDC4D\\uD83C\\uDFFC|\\uD83D\\uDC4D\\uD83C\\uDFFB|\\uD83D\\uDC4C\\uD83C\\uDFFF|\\uD83D\\uDC4C\\uD83C\\uDFFE|\\uD83D\\uDC4C\\uD83C\\uDFFD|\\uD83D\\uDC4C\\uD83C\\uDFFC|\\uD83D\\uDC4C\\uD83C\\uDFFB|\\uD83D\\uDC4B\\uD83C\\uDFFF|\\uD83D\\uDC4B\\uD83C\\uDFFE|\\uD83D\\uDC4B\\uD83C\\uDFFD|\\uD83D\\uDC4B\\uD83C\\uDFFC|\\uD83D\\uDC4B\\uD83C\\uDFFB|\\uD83D\\uDC4A\\uD83C\\uDFFF|\\uD83D\\uDC4A\\uD83C\\uDFFE|\\uD83D\\uDC4A\\uD83C\\uDFFD|\\uD83D\\uDC4A\\uD83C\\uDFFC|\\uD83D\\uDC4A\\uD83C\\uDFFB|\\uD83D\\uDC49\\uD83C\\uDFFF|\\uD83D\\uDC49\\uD83C\\uDFFE|\\uD83D\\uDC49\\uD83C\\uDFFD|\\uD83D\\uDC49\\uD83C\\uDFFC|\\uD83D\\uDC49\\uD83C\\uDFFB|\\uD83D\\uDC48\\uD83C\\uDFFF|\\uD83D\\uDC48\\uD83C\\uDFFE|\\uD83D\\uDC48\\uD83C\\uDFFD|\\uD83D\\uDC48\\uD83C\\uDFFC|\\uD83D\\uDC48\\uD83C\\uDFFB|\\uD83D\\uDC47\\uD83C\\uDFFF|\\uD83D\\uDC47\\uD83C\\uDFFE|\\uD83D\\uDC47\\uD83C\\uDFFD|\\uD83D\\uDC47\\uD83C\\uDFFC|\\uD83D\\uDC47\\uD83C\\uDFFB|\\uD83D\\uDC46\\uD83C\\uDFFF|\\uD83D\\uDC46\\uD83C\\uDFFE|\\uD83D\\uDC46\\uD83C\\uDFFD|\\uD83D\\uDC46\\uD83C\\uDFFC|\\uD83D\\uDC46\\uD83C\\uDFFB|\\uD83D\\uDC43\\uD83C\\uDFFF|\\uD83D\\uDC43\\uD83C\\uDFFE|\\uD83D\\uDC43\\uD83C\\uDFFD|\\uD83D\\uDC43\\uD83C\\uDFFC|\\uD83D\\uDC43\\uD83C\\uDFFB|\\uD83D\\uDC42\\uD83C\\uDFFF|\\uD83D\\uDC42\\uD83C\\uDFFE|\\uD83D\\uDC42\\uD83C\\uDFFD|\\uD83D\\uDC42\\uD83C\\uDFFC|\\uD83D\\uDC42\\uD83C\\uDFFB|\\uD83C\\uDFCB\\uD83C\\uDFFF|\\uD83C\\uDFCB\\uD83C\\uDFFE|\\uD83C\\uDFCB\\uD83C\\uDFFD|\\uD83C\\uDFCB\\uD83C\\uDFFC|\\uD83C\\uDFCB\\uD83C\\uDFFB|\\uD83C\\uDFCA\\uD83C\\uDFFF|\\uD83C\\uDFCA\\uD83C\\uDFFE|\\uD83C\\uDFCA\\uD83C\\uDFFD|\\uD83C\\uDFCA\\uD83C\\uDFFC|\\uD83C\\uDFCA\\uD83C\\uDFFB|\\uD83C\\uDFC7\\uD83C\\uDFFF|\\uD83C\\uDFC7\\uD83C\\uDFFE|\\uD83C\\uDFC7\\uD83C\\uDFFD|\\uD83C\\uDFC7\\uD83C\\uDFFC|\\uD83C\\uDFC7\\uD83C\\uDFFB|\\uD83C\\uDFC4\\uD83C\\uDFFF|\\uD83C\\uDFC4\\uD83C\\uDFFE|\\uD83C\\uDFC4\\uD83C\\uDFFD|\\uD83C\\uDFC4\\uD83C\\uDFFC|\\uD83C\\uDFC4\\uD83C\\uDFFB|\\uD83C\\uDFC3\\uD83C\\uDFFF|\\uD83C\\uDFC3\\uD83C\\uDFFE|\\uD83C\\uDFC3\\uD83C\\uDFFD|\\uD83C\\uDFC3\\uD83C\\uDFFC|\\uD83C\\uDFC3\\uD83C\\uDFFB|\\uD83C\\uDF85\\uD83C\\uDFFF|\\uD83C\\uDF85\\uD83C\\uDFFE|\\uD83C\\uDF85\\uD83C\\uDFFD|\\uD83C\\uDF85\\uD83C\\uDFFC|\\uD83C\\uDF85\\uD83C\\uDFFB|\\uD83C\\uDDFF\\uD83C\\uDDFC|\\uD83C\\uDDFF\\uD83C\\uDDF2|\\uD83C\\uDDFF\\uD83C\\uDDE6|\\uD83C\\uDDFE\\uD83C\\uDDF9|\\uD83C\\uDDFE\\uD83C\\uDDEA|\\uD83C\\uDDFD\\uD83C\\uDDF0|\\uD83C\\uDDFC\\uD83C\\uDDF8|\\uD83C\\uDDFC\\uD83C\\uDDEB|\\uD83C\\uDDFB\\uD83C\\uDDFA|\\uD83C\\uDDFB\\uD83C\\uDDF3|\\uD83C\\uDDFB\\uD83C\\uDDEE|\\uD83C\\uDDFB\\uD83C\\uDDEC|\\uD83C\\uDDFB\\uD83C\\uDDEA|\\uD83C\\uDDFB\\uD83C\\uDDE8|\\uD83C\\uDDFB\\uD83C\\uDDE6|\\uD83C\\uDDFA\\uD83C\\uDDFF|\\uD83C\\uDDFA\\uD83C\\uDDFE|\\uD83C\\uDDFA\\uD83C\\uDDF8|\\uD83C\\uDDFA\\uD83C\\uDDF2|\\uD83C\\uDDFA\\uD83C\\uDDEC|\\uD83C\\uDDFA\\uD83C\\uDDE6|\\uD83C\\uDDF9\\uD83C\\uDDFF|\\uD83C\\uDDF9\\uD83C\\uDDFC|\\uD83C\\uDDF9\\uD83C\\uDDFB|\\uD83C\\uDDF9\\uD83C\\uDDF9|\\uD83C\\uDDF9\\uD83C\\uDDF7|\\uD83C\\uDDF9\\uD83C\\uDDF4|\\uD83C\\uDDF9\\uD83C\\uDDF3|\\uD83C\\uDDF9\\uD83C\\uDDF2|\\uD83C\\uDDF9\\uD83C\\uDDF1|\\uD83C\\uDDF9\\uD83C\\uDDF0|\\uD83C\\uDDF9\\uD83C\\uDDEF|\\uD83C\\uDDF9\\uD83C\\uDDED|\\uD83C\\uDDF9\\uD83C\\uDDEC|\\uD83C\\uDDF9\\uD83C\\uDDEB|\\uD83C\\uDDE6\\uD83C\\uDDE8|\\uD83C\\uDDF9\\uD83C\\uDDE8|\\uD83C\\uDDF9\\uD83C\\uDDE6|\\uD83C\\uDDF8\\uD83C\\uDDFF|\\uD83C\\uDDF8\\uD83C\\uDDFE|\\uD83C\\uDDF8\\uD83C\\uDDFD|\\uD83C\\uDDF8\\uD83C\\uDDFB|\\uD83C\\uDDF8\\uD83C\\uDDF9|\\uD83C\\uDDF8\\uD83C\\uDDF8|\\uD83C\\uDDF8\\uD83C\\uDDF7|\\uD83C\\uDDF8\\uD83C\\uDDF4|\\uD83C\\uDDF8\\uD83C\\uDDF3|\\uD83C\\uDDF8\\uD83C\\uDDF2|\\uD83C\\uDDF8\\uD83C\\uDDF1|\\uD83C\\uDDF8\\uD83C\\uDDF0|\\uD83C\\uDDF8\\uD83C\\uDDEF|\\uD83C\\uDDF8\\uD83C\\uDDEE|\\uD83C\\uDDF8\\uD83C\\uDDED|\\uD83C\\uDDF8\\uD83C\\uDDEC|\\uD83C\\uDDF8\\uD83C\\uDDEA|\\uD83C\\uDDF8\\uD83C\\uDDE9|\\uD83C\\uDDF8\\uD83C\\uDDE8|\\uD83C\\uDDF8\\uD83C\\uDDE7|\\uD83C\\uDDF8\\uD83C\\uDDE6|\\uD83C\\uDDF7\\uD83C\\uDDFC|\\uD83C\\uDDF7\\uD83C\\uDDFA|\\uD83C\\uDDF7\\uD83C\\uDDF8|\\uD83C\\uDDF7\\uD83C\\uDDF4|\\uD83C\\uDDF7\\uD83C\\uDDEA|\\uD83C\\uDDF6\\uD83C\\uDDE6|\\uD83C\\uDDF5\\uD83C\\uDDFE|\\uD83C\\uDDF5\\uD83C\\uDDFC|\\uD83C\\uDDF5\\uD83C\\uDDF9|\\uD83C\\uDDF5\\uD83C\\uDDF8|\\uD83C\\uDDF5\\uD83C\\uDDF7|\\uD83C\\uDDF5\\uD83C\\uDDF3|\\uD83C\\uDDF5\\uD83C\\uDDF2|\\uD83C\\uDDF5\\uD83C\\uDDF1|\\uD83C\\uDDF5\\uD83C\\uDDF0|\\uD83C\\uDDF5\\uD83C\\uDDED|\\uD83C\\uDDF5\\uD83C\\uDDEC|\\uD83C\\uDDF5\\uD83C\\uDDEB|\\uD83C\\uDDF5\\uD83C\\uDDEA|\\uD83C\\uDDF5\\uD83C\\uDDE6|\\uD83C\\uDDF4\\uD83C\\uDDF2|\\uD83C\\uDDF3\\uD83C\\uDDFF|\\uD83C\\uDDF3\\uD83C\\uDDFA|\\uD83C\\uDDF3\\uD83C\\uDDF7|\\uD83C\\uDDF3\\uD83C\\uDDF5|\\uD83C\\uDDF3\\uD83C\\uDDF4|\\uD83C\\uDDF3\\uD83C\\uDDF1|\\uD83C\\uDDF3\\uD83C\\uDDEE|\\uD83C\\uDDF3\\uD83C\\uDDEC|\\uD83C\\uDDF3\\uD83C\\uDDEB|\\uD83C\\uDDF3\\uD83C\\uDDEA|\\uD83C\\uDDF3\\uD83C\\uDDE8|\\uD83C\\uDDF3\\uD83C\\uDDE6|\\uD83C\\uDDF2\\uD83C\\uDDFF|\\uD83C\\uDDF2\\uD83C\\uDDFE|\\uD83C\\uDDF2\\uD83C\\uDDFD|\\uD83C\\uDDF2\\uD83C\\uDDFC|\\uD83C\\uDDF2\\uD83C\\uDDFB|\\uD83C\\uDDF2\\uD83C\\uDDFA|\\uD83C\\uDDF2\\uD83C\\uDDF9|\\uD83C\\uDDF2\\uD83C\\uDDF8|\\uD83C\\uDDF2\\uD83C\\uDDF7|\\uD83C\\uDDF2\\uD83C\\uDDF6|\\uD83C\\uDDF2\\uD83C\\uDDF5|\\uD83C\\uDDF2\\uD83C\\uDDF4|\\uD83C\\uDDF2\\uD83C\\uDDF3|\\uD83C\\uDDF2\\uD83C\\uDDF2|\\uD83C\\uDDF2\\uD83C\\uDDF1|\\uD83C\\uDDF2\\uD83C\\uDDF0|\\uD83C\\uDDF2\\uD83C\\uDDED|\\uD83C\\uDDF2\\uD83C\\uDDEC|\\uD83C\\uDDF2\\uD83C\\uDDEB|\\uD83C\\uDDF2\\uD83C\\uDDEA|\\uD83C\\uDDF2\\uD83C\\uDDE9|\\uD83C\\uDDF2\\uD83C\\uDDE8|\\uD83C\\uDDF2\\uD83C\\uDDE6|\\uD83C\\uDDF1\\uD83C\\uDDFE|\\uD83C\\uDDF1\\uD83C\\uDDFB|\\uD83C\\uDDF1\\uD83C\\uDDFA|\\uD83C\\uDDF1\\uD83C\\uDDF9|\\uD83C\\uDDF1\\uD83C\\uDDF8|\\uD83C\\uDDF1\\uD83C\\uDDF7|\\uD83C\\uDDF1\\uD83C\\uDDF0|\\uD83C\\uDDF1\\uD83C\\uDDEE|\\uD83C\\uDDF1\\uD83C\\uDDE8|\\uD83C\\uDDF1\\uD83C\\uDDE7|\\uD83C\\uDDF1\\uD83C\\uDDE6|\\uD83C\\uDDF0\\uD83C\\uDDFF|\\uD83C\\uDDF0\\uD83C\\uDDFE|\\uD83C\\uDDF0\\uD83C\\uDDFC|\\uD83C\\uDDF0\\uD83C\\uDDF7|\\uD83C\\uDDF0\\uD83C\\uDDF5|\\uD83C\\uDDF0\\uD83C\\uDDF3|\\uD83C\\uDDF0\\uD83C\\uDDF2|\\uD83C\\uDDF0\\uD83C\\uDDEE|\\uD83C\\uDDF0\\uD83C\\uDDED|\\uD83C\\uDDF0\\uD83C\\uDDEC|\\uD83C\\uDDF0\\uD83C\\uDDEA|\\uD83C\\uDDEF\\uD83C\\uDDF5|\\uD83C\\uDDEF\\uD83C\\uDDF4|\\uD83C\\uDDEF\\uD83C\\uDDF2|\\uD83C\\uDDEF\\uD83C\\uDDEA|\\uD83C\\uDDEE\\uD83C\\uDDF9|\\uD83C\\uDDEE\\uD83C\\uDDF8|\\uD83C\\uDDEE\\uD83C\\uDDF7|\\uD83C\\uDDEE\\uD83C\\uDDF6|\\uD83C\\uDDEE\\uD83C\\uDDF4|\\uD83C\\uDDEE\\uD83C\\uDDF3|\\uD83C\\uDDEE\\uD83C\\uDDF2|\\uD83C\\uDDEE\\uD83C\\uDDF1|\\uD83C\\uDDEE\\uD83C\\uDDEA|\\uD83C\\uDDEE\\uD83C\\uDDE9|\\uD83C\\uDDEE\\uD83C\\uDDE8|\\uD83C\\uDDED\\uD83C\\uDDFA|\\uD83C\\uDDED\\uD83C\\uDDF9|\\uD83C\\uDDED\\uD83C\\uDDF7|\\uD83C\\uDDED\\uD83C\\uDDF3|\\uD83C\\uDDED\\uD83C\\uDDF2|\\uD83C\\uDDED\\uD83C\\uDDF0|\\uD83C\\uDDEC\\uD83C\\uDDFE|\\uD83C\\uDDEC\\uD83C\\uDDFC|\\uD83C\\uDDEC\\uD83C\\uDDFA|\\uD83C\\uDDEC\\uD83C\\uDDF9|\\uD83C\\uDDEC\\uD83C\\uDDF8|\\uD83C\\uDDEC\\uD83C\\uDDF7|\\uD83C\\uDDEC\\uD83C\\uDDF6|\\uD83C\\uDDEC\\uD83C\\uDDF5|\\uD83C\\uDDEC\\uD83C\\uDDF3|\\uD83C\\uDDEC\\uD83C\\uDDF2|\\uD83C\\uDDEC\\uD83C\\uDDF1|\\uD83C\\uDDEC\\uD83C\\uDDEE|\\uD83C\\uDDEC\\uD83C\\uDDED|\\uD83C\\uDDEC\\uD83C\\uDDEC|\\uD83C\\uDDEC\\uD83C\\uDDEB|\\uD83C\\uDDEC\\uD83C\\uDDEA|\\uD83C\\uDDEC\\uD83C\\uDDE9|\\uD83C\\uDDEC\\uD83C\\uDDE7|\\uD83C\\uDDEC\\uD83C\\uDDE6|\\uD83C\\uDDEB\\uD83C\\uDDF7|\\uD83C\\uDDEB\\uD83C\\uDDF4|\\uD83C\\uDDEB\\uD83C\\uDDF2|\\uD83C\\uDDEB\\uD83C\\uDDF0|\\uD83C\\uDDEB\\uD83C\\uDDEF|\\uD83C\\uDDEB\\uD83C\\uDDEE|\\uD83C\\uDDEA\\uD83C\\uDDFA|\\uD83C\\uDDEA\\uD83C\\uDDF9|\\uD83C\\uDDEA\\uD83C\\uDDF8|\\uD83C\\uDDEA\\uD83C\\uDDF7|\\uD83C\\uDDEA\\uD83C\\uDDED|\\uD83C\\uDDEA\\uD83C\\uDDEC|\\uD83C\\uDDEA\\uD83C\\uDDEA|\\uD83C\\uDDEA\\uD83C\\uDDE8|\\uD83C\\uDDEA\\uD83C\\uDDE6|\\uD83C\\uDDE9\\uD83C\\uDDFF|\\uD83C\\uDDE9\\uD83C\\uDDF4|\\uD83C\\uDDE9\\uD83C\\uDDF2|\\uD83C\\uDDE9\\uD83C\\uDDF0|\\uD83C\\uDDE9\\uD83C\\uDDEF|\\uD83C\\uDDE9\\uD83C\\uDDEC|\\uD83C\\uDDE9\\uD83C\\uDDEA|\\uD83C\\uDDE8\\uD83C\\uDDFF|\\uD83C\\uDDE8\\uD83C\\uDDFE|\\uD83C\\uDDE8\\uD83C\\uDDFD|\\uD83C\\uDDE8\\uD83C\\uDDFC|\\uD83C\\uDDE8\\uD83C\\uDDFB|\\uD83C\\uDDE8\\uD83C\\uDDFA|\\uD83C\\uDDE8\\uD83C\\uDDF7|\\uD83C\\uDDE8\\uD83C\\uDDF5|\\uD83C\\uDDE8\\uD83C\\uDDF4|\\uD83C\\uDDE8\\uD83C\\uDDF3|\\uD83C\\uDDE8\\uD83C\\uDDF2|\\uD83C\\uDDE8\\uD83C\\uDDF1|\\uD83C\\uDDE8\\uD83C\\uDDF0|\\uD83C\\uDDE8\\uD83C\\uDDEE|\\uD83C\\uDDE8\\uD83C\\uDDED|\\uD83C\\uDDE8\\uD83C\\uDDEC|\\uD83C\\uDDE8\\uD83C\\uDDEB|\\uD83C\\uDDE8\\uD83C\\uDDE9|\\uD83C\\uDDE8\\uD83C\\uDDE8|\\uD83C\\uDDE8\\uD83C\\uDDE6|\\uD83C\\uDDE7\\uD83C\\uDDFF|\\uD83C\\uDDE7\\uD83C\\uDDFE|\\uD83C\\uDDE7\\uD83C\\uDDFC|\\uD83C\\uDDE7\\uD83C\\uDDFB|\\uD83C\\uDDE7\\uD83C\\uDDF9|\\uD83C\\uDDE7\\uD83C\\uDDF8|\\uD83C\\uDDE7\\uD83C\\uDDF7|\\uD83C\\uDDE7\\uD83C\\uDDF6|\\uD83C\\uDDE7\\uD83C\\uDDF4|\\uD83C\\uDDE7\\uD83C\\uDDF3|\\uD83C\\uDDE7\\uD83C\\uDDF2|\\uD83C\\uDDE7\\uD83C\\uDDF1|\\uD83C\\uDDE7\\uD83C\\uDDEF|\\uD83C\\uDDE7\\uD83C\\uDDEE|\\uD83C\\uDDE7\\uD83C\\uDDED|\\uD83C\\uDDE7\\uD83C\\uDDEC|\\uD83C\\uDDE7\\uD83C\\uDDEB|\\uD83C\\uDDE7\\uD83C\\uDDEA|\\uD83C\\uDDE7\\uD83C\\uDDE9|\\uD83C\\uDDE7\\uD83C\\uDDE7|\\uD83C\\uDDE7\\uD83C\\uDDE6|\\uD83C\\uDDE6\\uD83C\\uDDFF|\\uD83C\\uDDE6\\uD83C\\uDDFD|\\uD83C\\uDDE6\\uD83C\\uDDFC|\\uD83C\\uDDE6\\uD83C\\uDDFA|\\uD83C\\uDDE6\\uD83C\\uDDF9|\\uD83C\\uDDF9\\uD83C\\uDDE9|\\uD83D\\uDDE1\\uFE0F|\\u26F9\\uD83C\\uDFFF|\\u26F9\\uD83C\\uDFFE|\\u26F9\\uD83C\\uDFFD|\\u26F9\\uD83C\\uDFFC|\\u26F9\\uD83C\\uDFFB|\\u270D\\uD83C\\uDFFF|\\u270D\\uD83C\\uDFFE|\\u270D\\uD83C\\uDFFD|\\u270D\\uD83C\\uDFFC|\\u270D\\uD83C\\uDFFB|\\uD83C\\uDC04\\uFE0F|\\uD83C\\uDD7F\\uFE0F|\\uD83C\\uDE02\\uFE0F|\\uD83C\\uDE1A\\uFE0F|\\uD83C\\uDE2F\\uFE0F|\\uD83C\\uDE37\\uFE0F|\\uD83C\\uDF9E\\uFE0F|\\uD83C\\uDF9F\\uFE0F|\\uD83C\\uDFCB\\uFE0F|\\uD83C\\uDFCC\\uFE0F|\\uD83C\\uDFCD\\uFE0F|\\uD83C\\uDFCE\\uFE0F|\\uD83C\\uDF96\\uFE0F|\\uD83C\\uDF97\\uFE0F|\\uD83C\\uDF36\\uFE0F|\\uD83C\\uDF27\\uFE0F|\\uD83C\\uDF28\\uFE0F|\\uD83C\\uDF29\\uFE0F|\\uD83C\\uDF2A\\uFE0F|\\uD83C\\uDF2B\\uFE0F|\\uD83C\\uDF2C\\uFE0F|\\uD83D\\uDC3F\\uFE0F|\\uD83D\\uDD77\\uFE0F|\\uD83D\\uDD78\\uFE0F|\\uD83C\\uDF21\\uFE0F|\\uD83C\\uDF99\\uFE0F|\\uD83C\\uDF9A\\uFE0F|\\uD83C\\uDF9B\\uFE0F|\\uD83C\\uDFF3\\uFE0F|\\uD83C\\uDFF5\\uFE0F|\\uD83C\\uDFF7\\uFE0F|\\uD83D\\uDCFD\\uFE0F|\\uD83D\\uDD49\\uFE0F|\\uD83D\\uDD4A\\uFE0F|\\uD83D\\uDD6F\\uFE0F|\\uD83D\\uDD70\\uFE0F|\\uD83D\\uDD73\\uFE0F|\\uD83D\\uDD76\\uFE0F|\\uD83D\\uDD79\\uFE0F|\\uD83D\\uDD87\\uFE0F|\\uD83D\\uDD8A\\uFE0F|\\uD83D\\uDD8B\\uFE0F|\\uD83D\\uDD8C\\uFE0F|\\uD83D\\uDD8D\\uFE0F|\\uD83D\\uDDA5\\uFE0F|\\uD83D\\uDDA8\\uFE0F|\\uD83D\\uDDB2\\uFE0F|\\uD83D\\uDDBC\\uFE0F|\\uD83D\\uDDC2\\uFE0F|\\uD83D\\uDDC3\\uFE0F|\\uD83D\\uDDC4\\uFE0F|\\uD83D\\uDDD1\\uFE0F|\\uD83D\\uDDD2\\uFE0F|\\uD83D\\uDDD3\\uFE0F|\\uD83D\\uDDDC\\uFE0F|\\uD83D\\uDDDD\\uFE0F|\\uD83D\\uDDDE\\uFE0F|\\u270B\\uD83C\\uDFFF|\\uD83D\\uDDE3\\uFE0F|\\uD83D\\uDDEF\\uFE0F|\\uD83D\\uDDF3\\uFE0F|\\uD83D\\uDDFA\\uFE0F|\\uD83D\\uDEE0\\uFE0F|\\uD83D\\uDEE1\\uFE0F|\\uD83D\\uDEE2\\uFE0F|\\uD83D\\uDEF0\\uFE0F|\\uD83C\\uDF7D\\uFE0F|\\uD83D\\uDC41\\uFE0F|\\uD83D\\uDD74\\uFE0F|\\uD83D\\uDD75\\uFE0F|\\uD83D\\uDD90\\uFE0F|\\uD83C\\uDFD4\\uFE0F|\\uD83C\\uDFD5\\uFE0F|\\uD83C\\uDFD6\\uFE0F|\\uD83C\\uDFD7\\uFE0F|\\uD83C\\uDFD8\\uFE0F|\\uD83C\\uDFD9\\uFE0F|\\uD83C\\uDFDA\\uFE0F|\\uD83C\\uDFDB\\uFE0F|\\uD83C\\uDFDC\\uFE0F|\\uD83C\\uDFDD\\uFE0F|\\uD83C\\uDFDE\\uFE0F|\\uD83C\\uDFDF\\uFE0F|\\uD83D\\uDECB\\uFE0F|\\uD83D\\uDECD\\uFE0F|\\uD83D\\uDECE\\uFE0F|\\uD83D\\uDECF\\uFE0F|\\uD83D\\uDEE3\\uFE0F|\\uD83D\\uDEE4\\uFE0F|\\uD83D\\uDEE5\\uFE0F|\\uD83D\\uDEE9\\uFE0F|\\uD83D\\uDEF3\\uFE0F|\\uD83C\\uDF24\\uFE0F|\\uD83C\\uDF25\\uFE0F|\\uD83C\\uDF26\\uFE0F|\\uD83D\\uDDB1\\uFE0F|\\u261D\\uD83C\\uDFFB|\\u261D\\uD83C\\uDFFC|\\u261D\\uD83C\\uDFFD|\\u261D\\uD83C\\uDFFE|\\u261D\\uD83C\\uDFFF|\\u270C\\uD83C\\uDFFB|\\u270C\\uD83C\\uDFFC|\\u270C\\uD83C\\uDFFD|\\u270C\\uD83C\\uDFFE|\\u270C\\uD83C\\uDFFF|\\u270A\\uD83C\\uDFFB|\\u270A\\uD83C\\uDFFC|\\u270A\\uD83C\\uDFFD|\\u270A\\uD83C\\uDFFE|\\u270A\\uD83C\\uDFFF|\\u270B\\uD83C\\uDFFB|\\u270B\\uD83C\\uDFFC|\\u270B\\uD83C\\uDFFD|\\u270B\\uD83C\\uDFFE|4\\uFE0F\\u20E3|9\\uFE0F\\u20E3|0\\uFE0F\\u20E3|1\\uFE0F\\u20E3|2\\uFE0F\\u20E3|3\\uFE0F\\u20E3|#\\uFE0F\\u20E3|5\\uFE0F\\u20E3|6\\uFE0F\\u20E3|7\\uFE0F\\u20E3|8\\uFE0F\\u20E3|\\*\\uFE0F\\u20E3|\\u00A9\\uFE0F|\\u00AE\\uFE0F|\\u203C\\uFE0F|\\u2049\\uFE0F|\\u2122\\uFE0F|\\u2139\\uFE0F|\\u2194\\uFE0F|\\u2195\\uFE0F|\\u2196\\uFE0F|\\u2197\\uFE0F|\\u2198\\uFE0F|\\u2199\\uFE0F|\\u21A9\\uFE0F|\\u21AA\\uFE0F|\\u231A\\uFE0F|\\u231B\\uFE0F|\\u24C2\\uFE0F|\\u25AA\\uFE0F|\\u25AB\\uFE0F|\\u25B6\\uFE0F|\\u25C0\\uFE0F|\\u25FB\\uFE0F|\\u25FC\\uFE0F|\\u25FD\\uFE0F|\\u25FE\\uFE0F|\\u2600\\uFE0F|\\u2601\\uFE0F|\\u260E\\uFE0F|\\u2611\\uFE0F|\\u2614\\uFE0F|\\u2615\\uFE0F|\\u261D\\uFE0F|\\u263A\\uFE0F|\\u2648\\uFE0F|\\u2649\\uFE0F|\\u264A\\uFE0F|\\u264B\\uFE0F|\\u264C\\uFE0F|\\u264D\\uFE0F|\\u264E\\uFE0F|\\u264F\\uFE0F|\\u2650\\uFE0F|\\u2651\\uFE0F|\\u2652\\uFE0F|\\u2653\\uFE0F|\\u2660\\uFE0F|\\u2663\\uFE0F|\\u2665\\uFE0F|\\u2666\\uFE0F|\\u2668\\uFE0F|\\u267B\\uFE0F|\\u267F\\uFE0F|\\u2693\\uFE0F|\\u26A0\\uFE0F|\\u26A1\\uFE0F|\\u26AA\\uFE0F|\\u26AB\\uFE0F|\\u26BD\\uFE0F|\\u26BE\\uFE0F|\\u26C4\\uFE0F|\\u26C5\\uFE0F|\\u26D4\\uFE0F|\\u26EA\\uFE0F|\\u26F2\\uFE0F|\\u26F3\\uFE0F|\\u26F5\\uFE0F|\\u26FA\\uFE0F|\\u26FD\\uFE0F|\\u2702\\uFE0F|\\u2708\\uFE0F|\\u2709\\uFE0F|\\u270C\\uFE0F|\\u270F\\uFE0F|\\u2712\\uFE0F|\\u2714\\uFE0F|\\u2716\\uFE0F|\\u2733\\uFE0F|\\u2734\\uFE0F|\\u2744\\uFE0F|\\u2747\\uFE0F|\\u2757\\uFE0F|\\u2764\\uFE0F|\\u27A1\\uFE0F|\\u2934\\uFE0F|\\u2935\\uFE0F|\\u2B05\\uFE0F|\\u2B06\\uFE0F|\\u2B07\\uFE0F|\\u2B1B\\uFE0F|\\u2B1C\\uFE0F|\\u2B50\\uFE0F|\\u2B55\\uFE0F|\\u3030\\uFE0F|\\u303D\\uFE0F|\\u3297\\uFE0F|\\u3299\\uFE0F|\\u271D\\uFE0F|\\u2328\\uFE0F|\\u270D\\uFE0F|\\u23ED\\uFE0F|\\u23EE\\uFE0F|\\u23EF\\uFE0F|\\u23F1\\uFE0F|\\u23F2\\uFE0F|\\u23F8\\uFE0F|\\u23F9\\uFE0F|\\u23FA\\uFE0F|\\u2602\\uFE0F|\\u2603\\uFE0F|\\u2604\\uFE0F|\\u2618\\uFE0F|\\u2620\\uFE0F|\\u2622\\uFE0F|\\u2623\\uFE0F|\\u2626\\uFE0F|\\u262A\\uFE0F|\\u262E\\uFE0F|\\u262F\\uFE0F|\\u2638\\uFE0F|\\u2639\\uFE0F|\\u2692\\uFE0F|\\u2694\\uFE0F|\\u2696\\uFE0F|\\u2697\\uFE0F|\\u2699\\uFE0F|\\u269B\\uFE0F|\\u269C\\uFE0F|\\u26B0\\uFE0F|\\u26B1\\uFE0F|\\u26C8\\uFE0F|\\u26CF\\uFE0F|\\u26D1\\uFE0F|\\u26D3\\uFE0F|\\u26E9\\uFE0F|\\u26F0\\uFE0F|\\u26F1\\uFE0F|\\u26F4\\uFE0F|\\u26F7\\uFE0F|\\u26F8\\uFE0F|\\u26F9\\uFE0F|\\u2721\\uFE0F|\\u2763\\uFE0F|\\uD83C\\uDCCF|\\uD83C\\uDD70|\\uD83C\\uDD71|\\uD83C\\uDD7E|\\uD83C\\uDD8E|\\uD83C\\uDD91|\\uD83C\\uDD92|\\uD83C\\uDD93|\\uD83C\\uDD94|\\uD83C\\uDD95|\\uD83C\\uDD96|\\uD83C\\uDD97|\\uD83C\\uDD98|\\uD83C\\uDD99|\\uD83C\\uDD9A|\\uD83C\\uDE01|\\uD83C\\uDE32|\\uD83C\\uDE33|\\uD83C\\uDE34|\\uD83C\\uDE35|\\uD83C\\uDE36|\\uD83C\\uDE38|\\uD83C\\uDE39|\\uD83C\\uDE3A|\\uD83C\\uDE50|\\uD83C\\uDE51|\\uD83C\\uDF00|\\uD83C\\uDF01|\\uD83C\\uDF02|\\uD83C\\uDF03|\\uD83C\\uDF04|\\uD83C\\uDF05|\\uD83C\\uDF06|\\uD83C\\uDF07|\\uD83C\\uDF08|\\uD83C\\uDF09|\\uD83C\\uDF0A|\\uD83C\\uDF0B|\\uD83C\\uDF0C|\\uD83C\\uDF0F|\\uD83C\\uDF11|\\uD83C\\uDF13|\\uD83C\\uDF14|\\uD83C\\uDF15|\\uD83C\\uDF19|\\uD83C\\uDF1B|\\uD83C\\uDF1F|\\uD83C\\uDF20|\\uD83C\\uDF30|\\uD83C\\uDF31|\\uD83C\\uDF34|\\uD83C\\uDF35|\\uD83C\\uDF37|\\uD83C\\uDF38|\\uD83C\\uDF39|\\uD83C\\uDF3A|\\uD83C\\uDF3B|\\uD83C\\uDF3C|\\uD83C\\uDF3D|\\uD83C\\uDF3E|\\uD83C\\uDF3F|\\uD83C\\uDF40|\\uD83C\\uDF41|\\uD83C\\uDF42|\\uD83C\\uDF43|\\uD83C\\uDF44|\\uD83C\\uDF45|\\uD83C\\uDF46|\\uD83C\\uDF47|\\uD83C\\uDF48|\\uD83C\\uDF49|\\uD83C\\uDF4A|\\uD83C\\uDF4C|\\uD83C\\uDF4D|\\uD83C\\uDF4E|\\uD83C\\uDF4F|\\uD83C\\uDF51|\\uD83C\\uDF52|\\uD83C\\uDF53|\\uD83C\\uDF54|\\uD83C\\uDF55|\\uD83C\\uDF56|\\uD83C\\uDF57|\\uD83C\\uDF58|\\uD83C\\uDF59|\\uD83C\\uDF5A|\\uD83C\\uDF5B|\\uD83C\\uDF5C|\\uD83C\\uDF5D|\\uD83C\\uDF5E|\\uD83C\\uDF5F|\\uD83C\\uDF60|\\uD83C\\uDF61|\\uD83C\\uDF62|\\uD83C\\uDF63|\\uD83C\\uDF64|\\uD83C\\uDF65|\\uD83C\\uDF66|\\uD83C\\uDF67|\\uD83C\\uDF68|\\uD83C\\uDF69|\\uD83C\\uDF6A|\\uD83C\\uDF6B|\\uD83C\\uDF6C|\\uD83C\\uDF6D|\\uD83C\\uDF6E|\\uD83C\\uDF6F|\\uD83C\\uDF70|\\uD83C\\uDF71|\\uD83C\\uDF72|\\uD83C\\uDF73|\\uD83C\\uDF74|\\uD83C\\uDF75|\\uD83C\\uDF76|\\uD83C\\uDF77|\\uD83C\\uDF78|\\uD83C\\uDF79|\\uD83C\\uDF7A|\\uD83C\\uDF7B|\\uD83C\\uDF80|\\uD83C\\uDF81|\\uD83C\\uDF82|\\uD83C\\uDF83|\\uD83C\\uDF84|\\uD83C\\uDF85|\\uD83C\\uDF86|\\uD83C\\uDF87|\\uD83C\\uDF88|\\uD83C\\uDF89|\\uD83C\\uDF8A|\\uD83C\\uDF8B|\\uD83C\\uDF8C|\\uD83C\\uDF8D|\\uD83C\\uDF8E|\\uD83C\\uDF8F|\\uD83C\\uDF90|\\uD83C\\uDF91|\\uD83C\\uDF92|\\uD83C\\uDF93|\\uD83C\\uDFA0|\\uD83C\\uDFA1|\\uD83C\\uDFA2|\\uD83C\\uDFA3|\\uD83C\\uDFA4|\\uD83C\\uDFA5|\\uD83C\\uDFA6|\\uD83C\\uDFA7|\\uD83C\\uDFA8|\\uD83C\\uDFA9|\\uD83C\\uDFAA|\\uD83C\\uDFAB|\\uD83C\\uDFAC|\\uD83C\\uDFAD|\\uD83C\\uDFAE|\\uD83C\\uDFAF|\\uD83C\\uDFB0|\\uD83C\\uDFB1|\\uD83C\\uDFB2|\\uD83C\\uDFB3|\\uD83C\\uDFB4|\\uD83C\\uDFB5|\\uD83C\\uDFB6|\\uD83C\\uDFB7|\\uD83C\\uDFB8|\\uD83C\\uDFB9|\\uD83C\\uDFBA|\\uD83C\\uDFBB|\\uD83C\\uDFBC|\\uD83C\\uDFBD|\\uD83C\\uDFBE|\\uD83C\\uDFBF|\\uD83C\\uDFC0|\\uD83C\\uDFC1|\\uD83C\\uDFC2|\\uD83C\\uDFC3|\\uD83C\\uDFC4|\\uD83C\\uDFC6|\\uD83C\\uDFC8|\\uD83C\\uDFCA|\\uD83C\\uDFE0|\\uD83D\\uDDB1|\\uD83C\\uDFE2|\\uD83C\\uDFE3|\\uD83C\\uDFE5|\\uD83C\\uDFE6|\\uD83C\\uDFE7|\\uD83C\\uDFE8|\\uD83C\\uDFE9|\\uD83C\\uDFEA|\\uD83C\\uDFEB|\\uD83C\\uDFEC|\\uD83C\\uDFED|\\uD83C\\uDFEE|\\uD83C\\uDFEF|\\uD83C\\uDFF0|\\uD83D\\uDC0C|\\uD83D\\uDC0D|\\uD83D\\uDC0E|\\uD83D\\uDC11|\\uD83D\\uDC12|\\uD83D\\uDC14|\\uD83D\\uDC17|\\uD83D\\uDC18|\\uD83D\\uDC19|\\uD83D\\uDC1A|\\uD83D\\uDC1B|\\uD83D\\uDC1C|\\uD83D\\uDC1D|\\uD83D\\uDC1E|\\uD83D\\uDC1F|\\uD83D\\uDC20|\\uD83D\\uDC21|\\uD83D\\uDC22|\\uD83D\\uDC23|\\uD83D\\uDC24|\\uD83D\\uDC25|\\uD83D\\uDC26|\\uD83D\\uDC27|\\uD83D\\uDC28|\\uD83D\\uDC29|\\uD83D\\uDC2B|\\uD83D\\uDC2C|\\uD83D\\uDC2D|\\uD83D\\uDC2E|\\uD83D\\uDC2F|\\uD83D\\uDC30|\\uD83D\\uDC31|\\uD83D\\uDC32|\\uD83D\\uDC33|\\uD83D\\uDC34|\\uD83D\\uDC35|\\uD83D\\uDC36|\\uD83D\\uDC37|\\uD83D\\uDC38|\\uD83D\\uDC39|\\uD83D\\uDC3A|\\uD83D\\uDC3B|\\uD83D\\uDC3C|\\uD83D\\uDC3D|\\uD83D\\uDC3E|\\uD83D\\uDC40|\\uD83D\\uDC42|\\uD83D\\uDC43|\\uD83D\\uDC44|\\uD83D\\uDC45|\\uD83D\\uDC46|\\uD83D\\uDC47|\\uD83D\\uDC48|\\uD83D\\uDC49|\\uD83D\\uDC4A|\\uD83D\\uDC4B|\\uD83D\\uDC4C|\\uD83D\\uDC4D|\\uD83D\\uDC4E|\\uD83D\\uDC4F|\\uD83D\\uDC50|\\uD83D\\uDC51|\\uD83D\\uDC52|\\uD83D\\uDC53|\\uD83D\\uDC54|\\uD83D\\uDC55|\\uD83D\\uDC56|\\uD83D\\uDC57|\\uD83D\\uDC58|\\uD83D\\uDC59|\\uD83D\\uDC5A|\\uD83D\\uDC5B|\\uD83D\\uDC5C|\\uD83D\\uDC5D|\\uD83D\\uDC5E|\\uD83D\\uDC5F|\\uD83D\\uDC60|\\uD83D\\uDC61|\\uD83D\\uDC62|\\uD83D\\uDC63|\\uD83D\\uDC64|\\uD83D\\uDC66|\\uD83D\\uDC67|\\uD83D\\uDC68|\\uD83D\\uDC69|\\uD83D\\uDC6A|\\uD83D\\uDC6B|\\uD83D\\uDC6E|\\uD83D\\uDC6F|\\uD83D\\uDC70|\\uD83D\\uDC71|\\uD83D\\uDC72|\\uD83D\\uDC73|\\uD83D\\uDC74|\\uD83D\\uDC75|\\uD83D\\uDC76|\\uD83D\\uDC77|\\uD83D\\uDC78|\\uD83D\\uDC79|\\uD83D\\uDC7A|\\uD83D\\uDC7B|\\uD83D\\uDC7C|\\uD83D\\uDC7D|\\uD83D\\uDC7E|\\uD83D\\uDC7F|\\uD83D\\uDC80|\\uD83D\\uDCC7|\\uD83D\\uDC81|\\uD83D\\uDC82|\\uD83D\\uDC83|\\uD83D\\uDC84|\\uD83D\\uDC85|\\uD83D\\uDCD2|\\uD83D\\uDC86|\\uD83D\\uDCD3|\\uD83D\\uDC87|\\uD83D\\uDCD4|\\uD83D\\uDC88|\\uD83D\\uDCD5|\\uD83D\\uDC89|\\uD83D\\uDCD6|\\uD83D\\uDC8A|\\uD83D\\uDCD7|\\uD83D\\uDC8B|\\uD83D\\uDCD8|\\uD83D\\uDC8C|\\uD83D\\uDCD9|\\uD83D\\uDC8D|\\uD83D\\uDCDA|\\uD83D\\uDC8E|\\uD83D\\uDCDB|\\uD83D\\uDC8F|\\uD83D\\uDCDC|\\uD83D\\uDC90|\\uD83D\\uDCDD|\\uD83D\\uDC91|\\uD83D\\uDCDE|\\uD83D\\uDC92|\\uD83D\\uDCDF|\\uD83D\\uDCE0|\\uD83D\\uDC93|\\uD83D\\uDCE1|\\uD83D\\uDCE2|\\uD83D\\uDC94|\\uD83D\\uDCE3|\\uD83D\\uDCE4|\\uD83D\\uDC95|\\uD83D\\uDCE5|\\uD83D\\uDCE6|\\uD83D\\uDC96|\\uD83D\\uDCE7|\\uD83D\\uDCE8|\\uD83D\\uDC97|\\uD83D\\uDCE9|\\uD83D\\uDCEA|\\uD83D\\uDC98|\\uD83D\\uDCEB|\\uD83D\\uDCEE|\\uD83D\\uDC99|\\uD83D\\uDCF0|\\uD83D\\uDCF1|\\uD83D\\uDC9A|\\uD83D\\uDCF2|\\uD83D\\uDCF3|\\uD83D\\uDC9B|\\uD83D\\uDCF4|\\uD83D\\uDCF6|\\uD83D\\uDC9C|\\uD83D\\uDCF7|\\uD83D\\uDCF9|\\uD83D\\uDC9D|\\uD83D\\uDCFA|\\uD83D\\uDCFB|\\uD83D\\uDC9E|\\uD83D\\uDCFC|\\uD83D\\uDD03|\\uD83D\\uDC9F|\\uD83D\\uDD0A|\\uD83D\\uDD0B|\\uD83D\\uDCA0|\\uD83D\\uDD0C|\\uD83D\\uDD0D|\\uD83D\\uDCA1|\\uD83D\\uDD0E|\\uD83D\\uDD0F|\\uD83D\\uDCA2|\\uD83D\\uDD10|\\uD83D\\uDD11|\\uD83D\\uDCA3|\\uD83D\\uDD12|\\uD83D\\uDD13|\\uD83D\\uDCA4|\\uD83D\\uDD14|\\uD83D\\uDD16|\\uD83D\\uDCA5|\\uD83D\\uDD17|\\uD83D\\uDD18|\\uD83D\\uDCA6|\\uD83D\\uDD19|\\uD83D\\uDD1A|\\uD83D\\uDCA7|\\uD83D\\uDD1B|\\uD83D\\uDD1C|\\uD83D\\uDCA8|\\uD83D\\uDD1D|\\uD83D\\uDD1E|\\uD83D\\uDCA9|\\uD83D\\uDD1F|\\uD83D\\uDCAA|\\uD83D\\uDD20|\\uD83D\\uDD21|\\uD83D\\uDCAB|\\uD83D\\uDD22|\\uD83D\\uDD23|\\uD83D\\uDCAC|\\uD83D\\uDD24|\\uD83D\\uDD25|\\uD83D\\uDCAE|\\uD83D\\uDD26|\\uD83D\\uDD27|\\uD83D\\uDCAF|\\uD83D\\uDD28|\\uD83D\\uDD29|\\uD83D\\uDCB0|\\uD83D\\uDD2A|\\uD83D\\uDD2B|\\uD83D\\uDCB1|\\uD83D\\uDD2E|\\uD83D\\uDCB2|\\uD83D\\uDD2F|\\uD83D\\uDCB3|\\uD83D\\uDD30|\\uD83D\\uDD31|\\uD83D\\uDCB4|\\uD83D\\uDD32|\\uD83D\\uDD33|\\uD83D\\uDCB5|\\uD83D\\uDD34|\\uD83D\\uDD35|\\uD83D\\uDCB8|\\uD83D\\uDD36|\\uD83D\\uDD37|\\uD83D\\uDCB9|\\uD83D\\uDD38|\\uD83D\\uDD39|\\uD83D\\uDCBA|\\uD83D\\uDD3A|\\uD83D\\uDD3B|\\uD83D\\uDCBB|\\uD83D\\uDD3C|\\uD83D\\uDCBC|\\uD83D\\uDD3D|\\uD83D\\uDD50|\\uD83D\\uDCBD|\\uD83D\\uDD51|\\uD83D\\uDCBE|\\uD83D\\uDD52|\\uD83D\\uDCBF|\\uD83D\\uDD53|\\uD83D\\uDCC0|\\uD83D\\uDD54|\\uD83D\\uDD55|\\uD83D\\uDCC1|\\uD83D\\uDD56|\\uD83D\\uDD57|\\uD83D\\uDCC2|\\uD83D\\uDD58|\\uD83D\\uDD59|\\uD83D\\uDCC3|\\uD83D\\uDD5A|\\uD83D\\uDD5B|\\uD83D\\uDCC4|\\uD83D\\uDDFB|\\uD83D\\uDDFC|\\uD83D\\uDCC5|\\uD83D\\uDDFD|\\uD83D\\uDDFE|\\uD83D\\uDCC6|\\uD83D\\uDDFF|\\uD83D\\uDE01|\\uD83D\\uDE02|\\uD83D\\uDE03|\\uD83D\\uDCC8|\\uD83D\\uDE04|\\uD83D\\uDE05|\\uD83D\\uDCC9|\\uD83D\\uDE06|\\uD83D\\uDE09|\\uD83D\\uDCCA|\\uD83D\\uDE0A|\\uD83D\\uDE0B|\\uD83D\\uDCCB|\\uD83D\\uDE0C|\\uD83D\\uDE0D|\\uD83D\\uDCCC|\\uD83D\\uDE0F|\\uD83D\\uDE12|\\uD83D\\uDCCD|\\uD83D\\uDE13|\\uD83D\\uDE14|\\uD83D\\uDCCE|\\uD83D\\uDE16|\\uD83D\\uDE18|\\uD83D\\uDCCF|\\uD83D\\uDE1A|\\uD83D\\uDE1C|\\uD83D\\uDCD0|\\uD83D\\uDE1D|\\uD83D\\uDE1E|\\uD83D\\uDCD1|\\uD83D\\uDE20|\\uD83D\\uDE21|\\uD83D\\uDE22|\\uD83D\\uDE23|\\uD83D\\uDE24|\\uD83D\\uDE25|\\uD83D\\uDE28|\\uD83D\\uDE29|\\uD83D\\uDE2A|\\uD83D\\uDE2B|\\uD83D\\uDE2D|\\uD83D\\uDE30|\\uD83D\\uDE31|\\uD83D\\uDE32|\\uD83D\\uDE33|\\uD83D\\uDE35|\\uD83D\\uDE37|\\uD83D\\uDE38|\\uD83D\\uDE39|\\uD83D\\uDE3A|\\uD83D\\uDE3B|\\uD83D\\uDE3C|\\uD83D\\uDE3D|\\uD83D\\uDE3E|\\uD83D\\uDE3F|\\uD83D\\uDE40|\\uD83D\\uDE45|\\uD83D\\uDE46|\\uD83D\\uDE47|\\uD83D\\uDE48|\\uD83D\\uDE49|\\uD83D\\uDE4A|\\uD83D\\uDE4B|\\uD83D\\uDE4C|\\uD83D\\uDE4D|\\uD83D\\uDE4E|\\uD83D\\uDE4F|\\uD83D\\uDE80|\\uD83D\\uDE83|\\uD83D\\uDE84|\\uD83D\\uDE85|\\uD83D\\uDE87|\\uD83D\\uDE89|\\uD83D\\uDE8C|\\uD83D\\uDE8F|\\uD83D\\uDE91|\\uD83D\\uDE92|\\uD83D\\uDE93|\\uD83D\\uDE95|\\uD83D\\uDE97|\\uD83D\\uDE99|\\uD83D\\uDE9A|\\uD83D\\uDEA2|\\uD83D\\uDEA4|\\uD83D\\uDEA5|\\uD83D\\uDEA7|\\uD83D\\uDEA8|\\uD83D\\uDEA9|\\uD83D\\uDEAA|\\uD83D\\uDEAB|\\uD83D\\uDEAC|\\uD83D\\uDEAD|\\uD83D\\uDEB2|\\uD83D\\uDEB6|\\uD83D\\uDEB9|\\uD83D\\uDEBA|\\uD83D\\uDEBB|\\uD83D\\uDEBC|\\uD83D\\uDEBD|\\uD83D\\uDEBE|\\uD83D\\uDEC0|\\uD83E\\uDD18|\\uD83D\\uDE00|\\uD83D\\uDE07|\\uD83D\\uDE08|\\uD83D\\uDE0E|\\uD83D\\uDE10|\\uD83D\\uDE11|\\uD83D\\uDE15|\\uD83D\\uDE17|\\uD83D\\uDE19|\\uD83D\\uDE1B|\\uD83D\\uDE1F|\\uD83D\\uDE26|\\uD83D\\uDE27|\\uD83D\\uDE2C|\\uD83D\\uDE2E|\\uD83D\\uDE2F|\\uD83D\\uDE34|\\uD83D\\uDE36|\\uD83D\\uDE81|\\uD83D\\uDE82|\\uD83D\\uDE86|\\uD83D\\uDE88|\\uD83D\\uDE8A|\\uD83D\\uDE8D|\\uD83D\\uDE8E|\\uD83D\\uDE90|\\uD83D\\uDE94|\\uD83D\\uDE96|\\uD83D\\uDE98|\\uD83D\\uDE9B|\\uD83D\\uDE9C|\\uD83D\\uDE9D|\\uD83D\\uDE9E|\\uD83D\\uDE9F|\\uD83D\\uDEA0|\\uD83D\\uDEA1|\\uD83D\\uDEA3|\\uD83D\\uDEA6|\\uD83D\\uDEAE|\\uD83D\\uDEAF|\\uD83D\\uDEB0|\\uD83D\\uDEB1|\\uD83D\\uDEB3|\\uD83D\\uDEB4|\\uD83D\\uDEB5|\\uD83D\\uDEB7|\\uD83D\\uDEB8|\\uD83D\\uDEBF|\\uD83D\\uDEC1|\\uD83D\\uDEC2|\\uD83D\\uDEC3|\\uD83D\\uDEC4|\\uD83D\\uDEC5|\\uD83C\\uDF0D|\\uD83C\\uDF0E|\\uD83C\\uDF10|\\uD83C\\uDF12|\\uD83C\\uDF16|\\uD83C\\uDF17|\\uD83C\\uDF18|\\uD83C\\uDF1A|\\uD83C\\uDF1C|\\uD83C\\uDF1D|\\uD83C\\uDF1E|\\uD83C\\uDF32|\\uD83C\\uDF33|\\uD83C\\uDF4B|\\uD83C\\uDF50|\\uD83C\\uDF7C|\\uD83C\\uDFC7|\\uD83C\\uDFC9|\\uD83C\\uDFE4|\\uD83D\\uDC00|\\uD83D\\uDC01|\\uD83D\\uDC02|\\uD83D\\uDC03|\\uD83D\\uDC04|\\uD83D\\uDC05|\\uD83D\\uDC06|\\uD83D\\uDC07|\\uD83D\\uDC08|\\uD83D\\uDC09|\\uD83D\\uDC0A|\\uD83D\\uDC0B|\\uD83D\\uDC0F|\\uD83D\\uDC10|\\uD83D\\uDC13|\\uD83D\\uDC15|\\uD83D\\uDC16|\\uD83D\\uDC2A|\\uD83D\\uDC65|\\uD83D\\uDC6C|\\uD83D\\uDC6D|\\uD83D\\uDCAD|\\uD83D\\uDCB6|\\uD83D\\uDCB7|\\uD83D\\uDCEC|\\uD83D\\uDCED|\\uD83D\\uDCEF|\\uD83D\\uDCF5|\\uD83D\\uDD00|\\uD83D\\uDD01|\\uD83D\\uDD02|\\uD83D\\uDD04|\\uD83D\\uDD05|\\uD83D\\uDD06|\\uD83D\\uDD07|\\uD83D\\uDD09|\\uD83D\\uDD15|\\uD83D\\uDD2C|\\uD83D\\uDD2D|\\uD83D\\uDD5C|\\uD83D\\uDD5D|\\uD83D\\uDD5E|\\uD83D\\uDD5F|\\uD83D\\uDD60|\\uD83D\\uDD61|\\uD83D\\uDD62|\\uD83D\\uDD63|\\uD83D\\uDD64|\\uD83D\\uDD65|\\uD83D\\uDD66|\\uD83D\\uDD67|\\uD83D\\uDD08|\\uD83D\\uDE8B|\\uD83C\\uDFC5|\\uD83C\\uDFF4|\\uD83D\\uDCF8|\\uD83D\\uDECC|\\uD83D\\uDD95|\\uD83D\\uDD96|\\uD83D\\uDE41|\\uD83D\\uDE42|\\uD83D\\uDEEB|\\uD83D\\uDEEC|\\uD83C\\uDFFB|\\uD83C\\uDFFC|\\uD83C\\uDFFD|\\uD83C\\uDFFE|\\uD83C\\uDFFF|\\uD83D\\uDE43|\\uD83E\\uDD11|\\uD83E\\uDD13|\\uD83E\\uDD17|\\uD83D\\uDE44|\\uD83E\\uDD14|\\uD83E\\uDD10|\\uD83E\\uDD12|\\uD83E\\uDD15|\\uD83E\\uDD16|\\uD83E\\uDD81|\\uD83E\\uDD84|\\uD83E\\uDD82|\\uD83E\\uDD80|\\uD83E\\uDD83|\\uD83E\\uDDC0|\\uD83C\\uDF2D|\\uD83C\\uDF2E|\\uD83C\\uDF2F|\\uD83C\\uDF7F|\\uD83C\\uDF7E|\\uD83C\\uDFF9|\\uD83C\\uDFFA|\\uD83D\\uDED0|\\uD83D\\uDD4B|\\uD83D\\uDD4C|\\uD83D\\uDD4D|\\uD83D\\uDD4E|\\uD83D\\uDCFF|\\uD83C\\uDFCF|\\uD83C\\uDFD0|\\uD83C\\uDFD1|\\uD83C\\uDFD2|\\uD83C\\uDFD3|\\uD83C\\uDFF8|\\uD83C\\uDF26|\\uD83C\\uDF25|\\uD83C\\uDF24|\\uD83D\\uDEF3|\\uD83D\\uDEE9|\\uD83D\\uDEE5|\\uD83D\\uDEE4|\\uD83D\\uDEE3|\\uD83D\\uDECF|\\uD83D\\uDECE|\\uD83D\\uDECD|\\uD83D\\uDECB|\\uD83C\\uDFDF|\\uD83C\\uDFDE|\\uD83C\\uDFDD|\\uD83C\\uDFDC|\\uD83C\\uDFDB|\\uD83C\\uDFDA|\\uD83C\\uDFD9|\\uD83C\\uDFD8|\\uD83C\\uDFD7|\\uD83C\\uDFD6|\\uD83C\\uDFD5|\\uD83C\\uDFD4|\\uD83D\\uDD90|\\uD83D\\uDD75|\\uD83D\\uDD74|\\uD83D\\uDC41|\\uD83C\\uDF7D|\\uD83D\\uDEF0|\\uD83D\\uDEE2|\\uD83D\\uDEE1|\\uD83D\\uDEE0|\\uD83D\\uDDFA|\\uD83D\\uDDF3|\\uD83D\\uDDEF|\\uD83D\\uDDE3|\\uD83D\\uDDE1|\\uD83D\\uDDDE|\\uD83D\\uDDDD|\\uD83D\\uDDDC|\\uD83D\\uDDD3|\\uD83D\\uDDD2|\\uD83D\\uDDD1|\\uD83D\\uDDC4|\\uD83D\\uDDC3|\\uD83D\\uDDC2|\\uD83D\\uDDBC|\\uD83D\\uDDB2|\\uD83D\\uDDA8|\\uD83D\\uDDA5|\\uD83D\\uDD8D|\\uD83D\\uDD8C|\\uD83D\\uDD8B|\\uD83D\\uDD8A|\\uD83D\\uDD87|\\uD83D\\uDD79|\\uD83D\\uDD76|\\uD83D\\uDD73|\\uD83D\\uDD70|\\uD83D\\uDD6F|\\uD83D\\uDD4A|\\uD83D\\uDD49|\\uD83D\\uDCFD|\\uD83C\\uDFF7|\\uD83C\\uDFF5|\\uD83C\\uDFF3|\\uD83C\\uDF9B|\\uD83C\\uDF9A|\\uD83C\\uDF99|\\uD83C\\uDF21|\\uD83D\\uDD78|\\uD83D\\uDD77|\\uD83D\\uDC3F|\\uD83C\\uDF2C|\\uD83C\\uDF2B|\\uD83C\\uDF2A|\\uD83C\\uDF29|\\uD83C\\uDF28|\\uD83C\\uDF27|\\uD83C\\uDF36|\\uD83C\\uDF97|\\uD83C\\uDF96|\\uD83C\\uDFCE|\\uD83C\\uDFCD|\\uD83C\\uDFCC|\\uD83C\\uDFCB|\\uD83C\\uDF9F|\\uD83C\\uDF9E|\\uD83C\\uDE37|\\uD83C\\uDE2F|\\uD83C\\uDE1A|\\uD83C\\uDE02|\\uD83C\\uDD7F|\\uD83C\\uDC04|\\uD83C\\uDFE1|\\u2714|\\u2733|\\u2734|\\u2744|\\u2747|\\u2757|\\u2764|\\u27A1|\\u2934|\\u2935|\\u2B05|\\u2B06|\\u2B07|\\u2B1B|\\u2B1C|\\u2B50|\\u2B55|\\u3030|\\u303D|\\u3297|\\u3299|\\u2712|\\u270F|\\u270C|\\u2709|\\u2708|\\u2702|\\u26FD|\\u26FA|\\u26F5|\\u26F3|\\u26F2|\\u26EA|\\u26D4|\\u26C5|\\u26C4|\\u26BE|\\u26BD|\\u26AB|\\u26AA|\\u26A1|\\u26A0|\\u2693|\\u267F|\\u267B|\\u2668|\\u2666|\\u2665|\\u2663|\\u2660|\\u2653|\\u2652|\\u2651|\\u271D|\\u2650|\\u264F|\\u264E|\\u264D|\\u264C|\\u264B|\\u264A|\\u2649|\\u2648|\\u263A|\\u261D|\\u2615|\\u2614|\\u2611|\\u2328|\\u260E|\\u2601|\\u2600|\\u25FE|\\u25FD|\\u25FC|\\u25FB|\\u25C0|\\u25B6|\\u25AB|\\u25AA|\\u24C2|\\u2716|\\u231A|\\u21AA|\\u21A9|\\u2199|\\u2198|\\u2197|\\u2196|\\u2195|\\u2194|\\u2139|\\u2122|\\u270D|\\u2049|\\u203C|\\u00AE|\\u00A9|\\u27BF|\\u27B0|\\u2797|\\u2796|\\u2795|\\u2755|\\u2754|\\u2753|\\u274E|\\u274C|\\u2728|\\u270B|\\u270A|\\u2705|\\u26CE|\\u23F3|\\u23F0|\\u23EC|\\u23ED|\\u23EE|\\u23EF|\\u23F1|\\u23F2|\\u23F8|\\u23F9|\\u23FA|\\u2602|\\u2603|\\u2604|\\u2618|\\u2620|\\u2622|\\u2623|\\u2626|\\u262A|\\u262E|\\u262F|\\u2638|\\u2639|\\u2692|\\u2694|\\u2696|\\u2697|\\u2699|\\u269B|\\u269C|\\u26B0|\\u26B1|\\u26C8|\\u26CF|\\u26D1|\\u26D3|\\u26E9|\\u26F0|\\u26F1|\\u26F4|\\u26F7|\\u26F8|\\u26F9|\\u2721|\\u2763|\\u23EB|\\u23EA|\\u23E9|\\u231B|\\uD83E\\uDD19\\uD83C\\uDFFE|\\uD83E\\uDD34\\uD83C\\uDFFB|\\uD83E\\uDD34\\uD83C\\uDFFE|\\uD83E\\uDD34\\uD83C\\uDFFF|\\uD83E\\uDD36\\uD83C\\uDFFB|\\uD83E\\uDD36\\uD83C\\uDFFC|\\uD83E\\uDD36\\uD83C\\uDFFD|\\uD83E\\uDD36\\uD83C\\uDFFE|\\uD83E\\uDD36\\uD83C\\uDFFF|\\uD83E\\uDD35\\uD83C\\uDFFB|\\uD83E\\uDD35\\uD83C\\uDFFC|\\uD83E\\uDD35\\uD83C\\uDFFD|\\uD83E\\uDD35\\uD83C\\uDFFE|\\uD83E\\uDD35\\uD83C\\uDFFF|\\uD83E\\uDD37\\uD83C\\uDFFB|\\uD83E\\uDD37\\uD83C\\uDFFC|\\uD83E\\uDD37\\uD83C\\uDFFD|\\uD83E\\uDD37\\uD83C\\uDFFE|\\uD83E\\uDD37\\uD83C\\uDFFF|\\uD83E\\uDD26\\uD83C\\uDFFB|\\uD83E\\uDD26\\uD83C\\uDFFC|\\uD83E\\uDD26\\uD83C\\uDFFD|\\uD83E\\uDD26\\uD83C\\uDFFE|\\uD83E\\uDD26\\uD83C\\uDFFF|\\uD83E\\uDD30\\uD83C\\uDFFB|\\uD83E\\uDD30\\uD83C\\uDFFC|\\uD83E\\uDD30\\uD83C\\uDFFD|\\uD83E\\uDD30\\uD83C\\uDFFE|\\uD83E\\uDD30\\uD83C\\uDFFF|\\uD83D\\uDD7A\\uD83C\\uDFFB|\\uD83D\\uDD7A\\uD83C\\uDFFC|\\uD83D\\uDD7A\\uD83C\\uDFFD|\\uD83D\\uDD7A\\uD83C\\uDFFE|\\uD83D\\uDD7A\\uD83C\\uDFFF|\\uD83E\\uDD33\\uD83C\\uDFFB|\\uD83E\\uDD33\\uD83C\\uDFFC|\\uD83E\\uDD33\\uD83C\\uDFFD|\\uD83E\\uDD33\\uD83C\\uDFFE|\\uD83E\\uDD33\\uD83C\\uDFFF|\\uD83E\\uDD1E\\uD83C\\uDFFB|\\uD83E\\uDD1E\\uD83C\\uDFFC|\\uD83E\\uDD1E\\uD83C\\uDFFD|\\uD83E\\uDD1E\\uD83C\\uDFFE|\\uD83E\\uDD1E\\uD83C\\uDFFF|\\uD83E\\uDD19\\uD83C\\uDFFB|\\uD83E\\uDD19\\uD83C\\uDFFC|\\uD83E\\uDD19\\uD83C\\uDFFD|\\uD83E\\uDD34\\uD83C\\uDFFD|\\uD83E\\uDD19\\uD83C\\uDFFF|\\uD83E\\uDD1B\\uD83C\\uDFFB|\\uD83E\\uDD1B\\uD83C\\uDFFC|\\uD83E\\uDD1B\\uD83C\\uDFFD|\\uD83E\\uDD1B\\uD83C\\uDFFE|\\uD83E\\uDD1B\\uD83C\\uDFFF|\\uD83E\\uDD1C\\uD83C\\uDFFB|\\uD83E\\uDD1C\\uD83C\\uDFFC|\\uD83E\\uDD1C\\uD83C\\uDFFD|\\uD83E\\uDD1C\\uD83C\\uDFFE|\\uD83E\\uDD1C\\uD83C\\uDFFF|\\uD83E\\uDD1A\\uD83C\\uDFFB|\\uD83E\\uDD1A\\uD83C\\uDFFC|\\uD83E\\uDD1A\\uD83C\\uDFFD|\\uD83E\\uDD1A\\uD83C\\uDFFE|\\uD83E\\uDD1A\\uD83C\\uDFFF|\\uD83E\\uDD1D\\uD83C\\uDFFB|\\uD83E\\uDD1D\\uD83C\\uDFFC|\\uD83E\\uDD1D\\uD83C\\uDFFD|\\uD83E\\uDD1D\\uD83C\\uDFFE|\\uD83E\\uDD1D\\uD83C\\uDFFF|\\uD83E\\uDD38\\uD83C\\uDFFB|\\uD83E\\uDD38\\uD83C\\uDFFC|\\uD83E\\uDD38\\uD83C\\uDFFD|\\uD83E\\uDD38\\uD83C\\uDFFE|\\uD83E\\uDD38\\uD83C\\uDFFF|\\uD83E\\uDD3C\\uD83C\\uDFFC|\\uD83E\\uDD3C\\uD83C\\uDFFB|\\uD83E\\uDD3C\\uD83C\\uDFFD|\\uD83E\\uDD3C\\uD83C\\uDFFE|\\uD83E\\uDD3C\\uD83C\\uDFFF|\\uD83E\\uDD3D\\uD83C\\uDFFB|\\uD83E\\uDD3D\\uD83C\\uDFFC|\\uD83E\\uDD3D\\uD83C\\uDFFD|\\uD83E\\uDD3D\\uD83C\\uDFFE|\\uD83E\\uDD3D\\uD83C\\uDFFF|\\uD83E\\uDD3E\\uD83C\\uDFFB|\\uD83E\\uDD3E\\uD83C\\uDFFC|\\uD83E\\uDD3E\\uD83C\\uDFFD|\\uD83E\\uDD3E\\uD83C\\uDFFE|\\uD83E\\uDD3E\\uD83C\\uDFFF|\\uD83E\\uDD39\\uD83C\\uDFFB|\\uD83E\\uDD39\\uD83C\\uDFFC|\\uD83E\\uDD39\\uD83C\\uDFFD|\\uD83E\\uDD39\\uD83C\\uDFFE|\\uD83E\\uDD39\\uD83C\\uDFFF|\\uD83E\\uDD34\\uD83C\\uDFFC|\\uD83E\\uDD49|\\uD83E\\uDD48|\\uD83E\\uDD47|\\uD83E\\uDD3A|\\uD83E\\uDD45|\\uD83E\\uDD3E|\\uD83C\\uDDFF|\\uD83E\\uDD3D|\\uD83E\\uDD4B|\\uD83E\\uDD4A|\\uD83E\\uDD3C|\\uD83E\\uDD39|\\uD83E\\uDD38|\\uD83D\\uDEF6|\\uD83D\\uDEF5|\\uD83D\\uDEF4|\\uD83D\\uDED2|\\uD83D\\uDED1|\\uD83C\\uDDFE|\\uD83E\\uDD44|\\uD83E\\uDD42|\\uD83E\\uDD43|\\uD83E\\uDD59|\\uD83E\\uDD58|\\uD83E\\uDD57|\\uD83E\\uDD56|\\uD83E\\uDD55|\\uD83E\\uDD54|\\uD83E\\uDD53|\\uD83E\\uDD52|\\uD83E\\uDD51|\\uD83E\\uDD50|\\uD83E\\uDD40|\\uD83E\\uDD8F|\\uD83E\\uDD8E|\\uD83E\\uDD8D|\\uD83E\\uDD8C|\\uD83E\\uDD8B|\\uD83E\\uDD8A|\\uD83E\\uDD89|\\uD83E\\uDD88|\\uD83E\\uDD87|\\uD83C\\uDDFD|\\uD83E\\uDD86|\\uD83E\\uDD85|\\uD83D\\uDDA4|\\uD83E\\uDD1E|\\uD83E\\uDD1D|\\uD83E\\uDD1B|\\uD83E\\uDD1C|\\uD83E\\uDD1A|\\uD83E\\uDD19|\\uD83D\\uDD7A|\\uD83E\\uDD33|\\uD83E\\uDD30|\\uD83E\\uDD26|\\uD83E\\uDD37|\\uD83E\\uDD36|\\uD83E\\uDD35|\\uD83E\\uDD34|\\uD83E\\uDD27|\\uD83E\\uDD25|\\uD83E\\uDD24|\\uD83E\\uDD23|\\uD83E\\uDD22|\\uD83E\\uDD21|\\uD83E\\uDD20|\\uD83E\\uDD41|\\uD83E\\uDD90|\\uD83E\\uDD91|\\uD83E\\uDD5A|\\uD83E\\uDD5B|\\uD83E\\uDD5C|\\uD83E\\uDD5D|\\uD83E\\uDD5E|\\uD83C\\uDDFC|\\uD83C\\uDDFB|\\uD83C\\uDDFA|\\uD83C\\uDDF9|\\uD83C\\uDDF8|\\uD83C\\uDDF7|\\uD83C\\uDDF6|\\uD83C\\uDDF5|\\uD83C\\uDDF4|\\uD83C\\uDDF3|\\uD83C\\uDDF2|\\uD83C\\uDDF1|\\uD83C\\uDDF0|\\uD83C\\uDDEF|\\uD83C\\uDDEE|\\uD83C\\uDDED|\\uD83C\\uDDEC|\\uD83C\\uDDEB|\\uD83C\\uDDEA|\\uD83C\\uDDE9|\\uD83C\\uDDE8|\\uD83C\\uDDE7|\\uD83C\\uDDE6|\\uD83C\\uDF26|\\uD83C\\uDF25|\\uD83C\\uDF24|\\uD83D\\uDEF3|\\uD83D\\uDEE9|\\uD83D\\uDEE5|\\uD83D\\uDEE4|\\uD83D\\uDEE3|\\uD83D\\uDECF|\\uD83D\\uDECE|\\uD83D\\uDECD|\\uD83D\\uDECB|\\uD83C\\uDFDF|\\uD83C\\uDFDE|\\uD83C\\uDFDD|\\uD83C\\uDFDC|\\uD83C\\uDFDB|\\uD83C\\uDFDA|\\uD83C\\uDFD9|\\uD83C\\uDFD8|\\uD83C\\uDFD7|\\uD83C\\uDFD6|\\uD83C\\uDFD5|\\uD83C\\uDFD4|\\uD83D\\uDD90|\\uD83D\\uDD75|\\uD83D\\uDD74|\\uD83D\\uDC41|\\uD83C\\uDF7D|\\uD83D\\uDDB1|\\uD83D\\uDEF0|\\uD83D\\uDEE2|\\uD83D\\uDEE1|\\uD83D\\uDEE0|\\uD83D\\uDDFA|\\uD83D\\uDDF3|\\uD83D\\uDDEF|\\uD83D\\uDDE8|\\uD83D\\uDDE3|\\uD83D\\uDDE1|\\uD83D\\uDDDE|\\uD83D\\uDDDD|\\uD83D\\uDDDC|\\uD83D\\uDDD3|\\uD83D\\uDDD2|\\uD83D\\uDDD1|\\uD83D\\uDDC4|\\uD83D\\uDDC3|\\uD83D\\uDDC2|\\uD83D\\uDDBC|\\uD83D\\uDDB2|\\uD83D\\uDDA8|\\uD83D\\uDDA5|\\uD83D\\uDD8D|\\uD83D\\uDD8C|\\uD83D\\uDD8B|\\uD83D\\uDD8A|\\uD83D\\uDD87|\\uD83D\\uDD79|\\uD83D\\uDD76|\\uD83D\\uDD73|\\uD83D\\uDD70|\\uD83D\\uDD6F|\\uD83D\\uDD4A|\\uD83D\\uDD49|\\uD83D\\uDCFD|\\uD83C\\uDFF7|\\uD83C\\uDFF5|\\uD83C\\uDFF3|\\uD83C\\uDF9B|\\uD83C\\uDF9A|\\uD83C\\uDF99|\\uD83C\\uDF21|\\uD83D\\uDD78|\\uD83D\\uDD77|\\uD83D\\uDC3F|\\uD83C\\uDF2C|\\uD83C\\uDF2B|\\uD83C\\uDF2A|\\uD83C\\uDF29|\\uD83C\\uDF28|\\uD83C\\uDF27|\\uD83C\\uDF36|\\uD83C\\uDF97|\\uD83C\\uDF96|\\uD83C\\uDFCE|\\uD83C\\uDFCD|\\uD83C\\uDFCC|\\uD83C\\uDFCB|\\uD83C\\uDF9F|\\uD83C\\uDF9E|\\uD83C\\uDE37|\\uD83C\\uDE2F|\\uD83C\\uDE1A|\\uD83C\\uDE02|\\uD83C\\uDD7F|\\uD83C\\uDC04|\\u25C0|\\u2B05|\\u2B07|\\u2B1B|\\u2B1C|\\u2B50|\\u2B55|\\u3030|\\u303D|\\u3297|\\u3299|\\u2935|\\u2934|\\u27A1|\\u2764|\\u2757|\\u2747|\\u2744|\\u2734|\\u2733|\\u2716|\\u2714|\\u2712|\\u270F|\\u270C|\\u2709|\\u2708|\\u2702|\\u26FD|\\u26FA|\\u26F5|\\u26F3|\\u26F2|\\u26EA|\\u26D4|\\u26C5|\\u26C4|\\u26BE|\\u26BD|\\u26AB|\\u26AA|\\u26A1|\\u26A0|\\u271D|\\u2693|\\u267F|\\u267B|\\u2668|\\u2666|\\u2665|\\u2663|\\u2660|\\u2653|\\u2652|\\u2651|\\u2650|\\u264F|\\u264E|\\u2328|\\u264D|\\u264C|\\u264B|\\u264A|\\u2649|\\u2648|\\u263A|\\u261D|\\u2615|\\u2614|\\u2611|\\u260E|\\u2601|\\u2600|\\u25FE|\\u25FD|\\u25FC|\\u25FB|\\u2B06|\\u25B6|\\u25AB|\\u24C2|\\u231B|\\u231A|\\u21AA|\\u270D|\\u21A9|\\u2199|\\u2198|\\u2197|\\u2196|\\u2195|\\u2194|\\u2139|\\u2122|\\u2049|\\u203C|\\u00AE|\\u00A9|\\u2763|\\u2721|\\u26F9|\\u26F8|\\u26F7|\\u26F4|\\u26F1|\\u26F0|\\u26E9|\\u23CF|\\u23ED|\\u23EE|\\u23EF|\\u23F1|\\u23F2|\\u23F8|\\u23F9|\\u23FA|\\u2602|\\u2603|\\u2604|\\u2618|\\u2620|\\u2622|\\u2623|\\u2626|\\u262A|\\u262E|\\u262F|\\u2638|\\u2639|\\u2692|\\u2694|\\u2696|\\u2697|\\u2699|\\u269B|\\u269C|\\u26B0|\\u26B1|\\u26C8|\\u26CF|\\u26D1|\\u26D3|\\u25AA)';
    ns.jsEscapeMap = {"\uD83D\uDC69\u2764\uD83D\uDC8B\uD83D\uDC69":"1f469-2764-1f48b-1f469","\uD83D\uDC68\u2764\uD83D\uDC8B\uD83D\uDC68":"1f468-2764-1f48b-1f468","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC66\uD83D\uDC66":"1f468-1f468-1f466-1f466","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC67\uD83D\uDC66":"1f468-1f468-1f467-1f466","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC67\uD83D\uDC67":"1f468-1f468-1f467-1f467","\uD83D\uDC68\uD83D\uDC69\uD83D\uDC66\uD83D\uDC66":"1f468-1f469-1f466-1f466","\uD83D\uDC68\uD83D\uDC69\uD83D\uDC67\uD83D\uDC66":"1f468-1f469-1f467-1f466","\uD83D\uDC68\uD83D\uDC69\uD83D\uDC67\uD83D\uDC67":"1f468-1f469-1f467-1f467","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC66\uD83D\uDC66":"1f469-1f469-1f466-1f466","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC67\uD83D\uDC66":"1f469-1f469-1f467-1f466","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC67\uD83D\uDC67":"1f469-1f469-1f467-1f467","\uD83D\uDC69\u2764\uD83D\uDC69":"1f469-2764-1f469","\uD83D\uDC68\u2764\uD83D\uDC68":"1f468-2764-1f468","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC66":"1f468-1f468-1f466","\uD83D\uDC68\uD83D\uDC68\uD83D\uDC67":"1f468-1f468-1f467","\uD83D\uDC68\uD83D\uDC69\uD83D\uDC67":"1f468-1f469-1f467","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC66":"1f469-1f469-1f466","\uD83D\uDC69\uD83D\uDC69\uD83D\uDC67":"1f469-1f469-1f467","\uD83D\uDC41\uD83D\uDDE8":"1f441-1f5e8","#\u20E3":"0023-20e3","0\u20E3":"0030-20e3","1\u20E3":"0031-20e3","2\u20E3":"0032-20e3","3\u20E3":"0033-20e3","4\u20E3":"0034-20e3","5\u20E3":"0035-20e3","6\u20E3":"0036-20e3","7\u20E3":"0037-20e3","8\u20E3":"0038-20e3","9\u20E3":"0039-20e3","*\u20E3":"002a-20e3","\uD83E\uDD3E\uD83C\uDFFF":"1f93e-1f3ff","\uD83E\uDD3E\uD83C\uDFFE":"1f93e-1f3fe","\uD83E\uDD3E\uD83C\uDFFD":"1f93e-1f3fd","\uD83E\uDD3E\uD83C\uDFFC":"1f93e-1f3fc","\uD83E\uDD3E\uD83C\uDFFB":"1f93e-1f3fb","\uD83E\uDD3D\uD83C\uDFFF":"1f93d-1f3ff","\uD83E\uDD3D\uD83C\uDFFE":"1f93d-1f3fe","\uD83E\uDD3D\uD83C\uDFFD":"1f93d-1f3fd","\uD83E\uDD3D\uD83C\uDFFC":"1f93d-1f3fc","\uD83E\uDD3D\uD83C\uDFFB":"1f93d-1f3fb","\uD83E\uDD3C\uD83C\uDFFF":"1f93c-1f3ff","\uD83E\uDD3C\uD83C\uDFFE":"1f93c-1f3fe","\uD83E\uDD3C\uD83C\uDFFD":"1f93c-1f3fd","\uD83E\uDD3C\uD83C\uDFFC":"1f93c-1f3fc","\uD83E\uDD3C\uD83C\uDFFB":"1f93c-1f3fb","\uD83E\uDD39\uD83C\uDFFF":"1f939-1f3ff","\uD83E\uDD39\uD83C\uDFFE":"1f939-1f3fe","\uD83E\uDD39\uD83C\uDFFD":"1f939-1f3fd","\uD83E\uDD39\uD83C\uDFFC":"1f939-1f3fc","\uD83E\uDD39\uD83C\uDFFB":"1f939-1f3fb","\uD83E\uDD38\uD83C\uDFFF":"1f938-1f3ff","\uD83E\uDD38\uD83C\uDFFE":"1f938-1f3fe","\uD83E\uDD38\uD83C\uDFFD":"1f938-1f3fd","\uD83E\uDD38\uD83C\uDFFC":"1f938-1f3fc","\uD83E\uDD38\uD83C\uDFFB":"1f938-1f3fb","\uD83E\uDD37\uD83C\uDFFF":"1f937-1f3ff","\uD83E\uDD37\uD83C\uDFFE":"1f937-1f3fe","\uD83E\uDD37\uD83C\uDFFD":"1f937-1f3fd","\uD83E\uDD37\uD83C\uDFFC":"1f937-1f3fc","\uD83E\uDD37\uD83C\uDFFB":"1f937-1f3fb","\uD83E\uDD36\uD83C\uDFFF":"1f936-1f3ff","\uD83E\uDD36\uD83C\uDFFE":"1f936-1f3fe","\uD83E\uDD36\uD83C\uDFFD":"1f936-1f3fd","\uD83E\uDD36\uD83C\uDFFC":"1f936-1f3fc","\uD83E\uDD36\uD83C\uDFFB":"1f936-1f3fb","\uD83E\uDD35\uD83C\uDFFF":"1f935-1f3ff","\uD83E\uDD35\uD83C\uDFFE":"1f935-1f3fe","\uD83E\uDD35\uD83C\uDFFD":"1f935-1f3fd","\uD83E\uDD35\uD83C\uDFFC":"1f935-1f3fc","\uD83E\uDD35\uD83C\uDFFB":"1f935-1f3fb","\uD83E\uDD34\uD83C\uDFFF":"1f934-1f3ff","\uD83E\uDD34\uD83C\uDFFE":"1f934-1f3fe","\uD83E\uDD34\uD83C\uDFFD":"1f934-1f3fd","\uD83E\uDD34\uD83C\uDFFC":"1f934-1f3fc","\uD83E\uDD34\uD83C\uDFFB":"1f934-1f3fb","\uD83E\uDD33\uD83C\uDFFF":"1f933-1f3ff","\uD83E\uDD33\uD83C\uDFFE":"1f933-1f3fe","\uD83E\uDD33\uD83C\uDFFD":"1f933-1f3fd","\uD83E\uDD33\uD83C\uDFFC":"1f933-1f3fc","\uD83E\uDD33\uD83C\uDFFB":"1f933-1f3fb","\uD83E\uDD30\uD83C\uDFFF":"1f930-1f3ff","\uD83E\uDD30\uD83C\uDFFE":"1f930-1f3fe","\uD83E\uDD30\uD83C\uDFFD":"1f930-1f3fd","\uD83E\uDD30\uD83C\uDFFC":"1f930-1f3fc","\uD83E\uDD30\uD83C\uDFFB":"1f930-1f3fb","\uD83E\uDD26\uD83C\uDFFF":"1f926-1f3ff","\uD83E\uDD26\uD83C\uDFFE":"1f926-1f3fe","\uD83E\uDD26\uD83C\uDFFD":"1f926-1f3fd","\uD83E\uDD26\uD83C\uDFFC":"1f926-1f3fc","\uD83E\uDD26\uD83C\uDFFB":"1f926-1f3fb","\uD83E\uDD1E\uD83C\uDFFF":"1f91e-1f3ff","\uD83E\uDD1E\uD83C\uDFFE":"1f91e-1f3fe","\uD83E\uDD1E\uD83C\uDFFD":"1f91e-1f3fd","\uD83E\uDD1E\uD83C\uDFFC":"1f91e-1f3fc","\uD83E\uDD1E\uD83C\uDFFB":"1f91e-1f3fb","\uD83E\uDD1D\uD83C\uDFFF":"1f91d-1f3ff","\uD83E\uDD1D\uD83C\uDFFE":"1f91d-1f3fe","\uD83E\uDD1D\uD83C\uDFFD":"1f91d-1f3fd","\uD83E\uDD1D\uD83C\uDFFC":"1f91d-1f3fc","\uD83E\uDD1D\uD83C\uDFFB":"1f91d-1f3fb","\uD83E\uDD1C\uD83C\uDFFF":"1f91c-1f3ff","\uD83E\uDD1C\uD83C\uDFFE":"1f91c-1f3fe","\uD83E\uDD1C\uD83C\uDFFD":"1f91c-1f3fd","\uD83E\uDD1C\uD83C\uDFFC":"1f91c-1f3fc","\uD83E\uDD1C\uD83C\uDFFB":"1f91c-1f3fb","\uD83E\uDD1B\uD83C\uDFFF":"1f91b-1f3ff","\uD83E\uDD1B\uD83C\uDFFE":"1f91b-1f3fe","\uD83E\uDD1B\uD83C\uDFFD":"1f91b-1f3fd","\uD83E\uDD1B\uD83C\uDFFC":"1f91b-1f3fc","\uD83E\uDD1B\uD83C\uDFFB":"1f91b-1f3fb","\uD83E\uDD1A\uD83C\uDFFF":"1f91a-1f3ff","\uD83E\uDD1A\uD83C\uDFFE":"1f91a-1f3fe","\uD83E\uDD1A\uD83C\uDFFD":"1f91a-1f3fd","\uD83E\uDD1A\uD83C\uDFFC":"1f91a-1f3fc","\uD83E\uDD1A\uD83C\uDFFB":"1f91a-1f3fb","\uD83E\uDD19\uD83C\uDFFF":"1f919-1f3ff","\uD83E\uDD19\uD83C\uDFFE":"1f919-1f3fe","\uD83E\uDD19\uD83C\uDFFD":"1f919-1f3fd","\uD83E\uDD19\uD83C\uDFFC":"1f919-1f3fc","\uD83E\uDD19\uD83C\uDFFB":"1f919-1f3fb","\uD83E\uDD18\uD83C\uDFFF":"1f918-1f3ff","\uD83E\uDD18\uD83C\uDFFE":"1f918-1f3fe","\uD83E\uDD18\uD83C\uDFFD":"1f918-1f3fd","\uD83E\uDD18\uD83C\uDFFC":"1f918-1f3fc","\uD83E\uDD18\uD83C\uDFFB":"1f918-1f3fb","\uD83D\uDEC0\uD83C\uDFFF":"1f6c0-1f3ff","\uD83D\uDEC0\uD83C\uDFFE":"1f6c0-1f3fe","\uD83D\uDEC0\uD83C\uDFFD":"1f6c0-1f3fd","\uD83D\uDEC0\uD83C\uDFFC":"1f6c0-1f3fc","\uD83D\uDEC0\uD83C\uDFFB":"1f6c0-1f3fb","\uD83D\uDEB6\uD83C\uDFFF":"1f6b6-1f3ff","\uD83D\uDEB6\uD83C\uDFFE":"1f6b6-1f3fe","\uD83D\uDEB6\uD83C\uDFFD":"1f6b6-1f3fd","\uD83D\uDEB6\uD83C\uDFFC":"1f6b6-1f3fc","\uD83D\uDEB6\uD83C\uDFFB":"1f6b6-1f3fb","\uD83D\uDEB5\uD83C\uDFFF":"1f6b5-1f3ff","\uD83D\uDEB5\uD83C\uDFFE":"1f6b5-1f3fe","\uD83D\uDEB5\uD83C\uDFFD":"1f6b5-1f3fd","\uD83D\uDEB5\uD83C\uDFFC":"1f6b5-1f3fc","\uD83D\uDEB5\uD83C\uDFFB":"1f6b5-1f3fb","\uD83D\uDEB4\uD83C\uDFFF":"1f6b4-1f3ff","\uD83D\uDEB4\uD83C\uDFFE":"1f6b4-1f3fe","\uD83D\uDEB4\uD83C\uDFFD":"1f6b4-1f3fd","\uD83D\uDEB4\uD83C\uDFFC":"1f6b4-1f3fc","\uD83D\uDEB4\uD83C\uDFFB":"1f6b4-1f3fb","\uD83D\uDEA3\uD83C\uDFFF":"1f6a3-1f3ff","\uD83D\uDEA3\uD83C\uDFFE":"1f6a3-1f3fe","\uD83D\uDEA3\uD83C\uDFFD":"1f6a3-1f3fd","\uD83D\uDEA3\uD83C\uDFFC":"1f6a3-1f3fc","\uD83D\uDEA3\uD83C\uDFFB":"1f6a3-1f3fb","\uD83D\uDE4F\uD83C\uDFFF":"1f64f-1f3ff","\uD83D\uDE4F\uD83C\uDFFE":"1f64f-1f3fe","\uD83D\uDE4F\uD83C\uDFFD":"1f64f-1f3fd","\uD83D\uDE4F\uD83C\uDFFC":"1f64f-1f3fc","\uD83D\uDE4F\uD83C\uDFFB":"1f64f-1f3fb","\uD83D\uDE4E\uD83C\uDFFF":"1f64e-1f3ff","\uD83D\uDE4E\uD83C\uDFFE":"1f64e-1f3fe","\uD83D\uDE4E\uD83C\uDFFD":"1f64e-1f3fd","\uD83D\uDE4E\uD83C\uDFFC":"1f64e-1f3fc","\uD83D\uDE4E\uD83C\uDFFB":"1f64e-1f3fb","\uD83D\uDE4D\uD83C\uDFFF":"1f64d-1f3ff","\uD83D\uDE4D\uD83C\uDFFE":"1f64d-1f3fe","\uD83D\uDE4D\uD83C\uDFFD":"1f64d-1f3fd","\uD83D\uDE4D\uD83C\uDFFC":"1f64d-1f3fc","\uD83D\uDE4D\uD83C\uDFFB":"1f64d-1f3fb","\uD83D\uDE4C\uD83C\uDFFF":"1f64c-1f3ff","\uD83D\uDE4C\uD83C\uDFFE":"1f64c-1f3fe","\uD83D\uDE4C\uD83C\uDFFD":"1f64c-1f3fd","\uD83D\uDE4C\uD83C\uDFFC":"1f64c-1f3fc","\uD83D\uDE4C\uD83C\uDFFB":"1f64c-1f3fb","\uD83D\uDE4B\uD83C\uDFFF":"1f64b-1f3ff","\uD83D\uDE4B\uD83C\uDFFE":"1f64b-1f3fe","\uD83D\uDE4B\uD83C\uDFFD":"1f64b-1f3fd","\uD83D\uDE4B\uD83C\uDFFC":"1f64b-1f3fc","\uD83D\uDE4B\uD83C\uDFFB":"1f64b-1f3fb","\uD83D\uDE47\uD83C\uDFFF":"1f647-1f3ff","\uD83D\uDE47\uD83C\uDFFE":"1f647-1f3fe","\uD83D\uDE47\uD83C\uDFFD":"1f647-1f3fd","\uD83D\uDE47\uD83C\uDFFC":"1f647-1f3fc","\uD83D\uDE47\uD83C\uDFFB":"1f647-1f3fb","\uD83D\uDE46\uD83C\uDFFF":"1f646-1f3ff","\uD83D\uDE46\uD83C\uDFFE":"1f646-1f3fe","\uD83D\uDE46\uD83C\uDFFD":"1f646-1f3fd","\uD83D\uDE46\uD83C\uDFFC":"1f646-1f3fc","\uD83D\uDE46\uD83C\uDFFB":"1f646-1f3fb","\uD83D\uDE45\uD83C\uDFFF":"1f645-1f3ff","\uD83D\uDE45\uD83C\uDFFE":"1f645-1f3fe","\uD83D\uDE45\uD83C\uDFFD":"1f645-1f3fd","\uD83D\uDE45\uD83C\uDFFC":"1f645-1f3fc","\uD83D\uDE45\uD83C\uDFFB":"1f645-1f3fb","\uD83D\uDD96\uD83C\uDFFF":"1f596-1f3ff","\uD83D\uDD96\uD83C\uDFFE":"1f596-1f3fe","\uD83D\uDD96\uD83C\uDFFD":"1f596-1f3fd","\uD83D\uDD96\uD83C\uDFFC":"1f596-1f3fc","\uD83D\uDD96\uD83C\uDFFB":"1f596-1f3fb","\uD83D\uDD95\uD83C\uDFFF":"1f595-1f3ff","\uD83D\uDD95\uD83C\uDFFE":"1f595-1f3fe","\uD83D\uDD95\uD83C\uDFFD":"1f595-1f3fd","\uD83D\uDD95\uD83C\uDFFC":"1f595-1f3fc","\uD83D\uDD95\uD83C\uDFFB":"1f595-1f3fb","\uD83D\uDD90\uD83C\uDFFF":"1f590-1f3ff","\uD83D\uDD90\uD83C\uDFFE":"1f590-1f3fe","\uD83D\uDD90\uD83C\uDFFD":"1f590-1f3fd","\uD83D\uDD90\uD83C\uDFFC":"1f590-1f3fc","\uD83D\uDD90\uD83C\uDFFB":"1f590-1f3fb","\uD83D\uDD7A\uD83C\uDFFF":"1f57a-1f3ff","\uD83D\uDD7A\uD83C\uDFFE":"1f57a-1f3fe","\uD83D\uDD7A\uD83C\uDFFD":"1f57a-1f3fd","\uD83D\uDD7A\uD83C\uDFFC":"1f57a-1f3fc","\uD83D\uDD7A\uD83C\uDFFB":"1f57a-1f3fb","\uD83D\uDD75\uD83C\uDFFF":"1f575-1f3ff","\uD83D\uDD75\uD83C\uDFFE":"1f575-1f3fe","\uD83D\uDD75\uD83C\uDFFD":"1f575-1f3fd","\uD83D\uDD75\uD83C\uDFFC":"1f575-1f3fc","\uD83D\uDD75\uD83C\uDFFB":"1f575-1f3fb","\uD83D\uDCAA\uD83C\uDFFF":"1f4aa-1f3ff","\uD83D\uDCAA\uD83C\uDFFE":"1f4aa-1f3fe","\uD83D\uDCAA\uD83C\uDFFD":"1f4aa-1f3fd","\uD83D\uDCAA\uD83C\uDFFC":"1f4aa-1f3fc","\uD83D\uDCAA\uD83C\uDFFB":"1f4aa-1f3fb","\uD83D\uDC87\uD83C\uDFFF":"1f487-1f3ff","\uD83D\uDC87\uD83C\uDFFE":"1f487-1f3fe","\uD83D\uDC87\uD83C\uDFFD":"1f487-1f3fd","\uD83D\uDC87\uD83C\uDFFC":"1f487-1f3fc","\uD83D\uDC87\uD83C\uDFFB":"1f487-1f3fb","\uD83D\uDC86\uD83C\uDFFF":"1f486-1f3ff","\uD83D\uDC86\uD83C\uDFFE":"1f486-1f3fe","\uD83D\uDC86\uD83C\uDFFD":"1f486-1f3fd","\uD83D\uDC86\uD83C\uDFFC":"1f486-1f3fc","\uD83D\uDC86\uD83C\uDFFB":"1f486-1f3fb","\uD83D\uDC85\uD83C\uDFFF":"1f485-1f3ff","\uD83D\uDC85\uD83C\uDFFE":"1f485-1f3fe","\uD83D\uDC85\uD83C\uDFFD":"1f485-1f3fd","\uD83D\uDC85\uD83C\uDFFC":"1f485-1f3fc","\uD83D\uDC85\uD83C\uDFFB":"1f485-1f3fb","\uD83D\uDC83\uD83C\uDFFF":"1f483-1f3ff","\uD83D\uDC83\uD83C\uDFFE":"1f483-1f3fe","\uD83D\uDC83\uD83C\uDFFD":"1f483-1f3fd","\uD83D\uDC83\uD83C\uDFFC":"1f483-1f3fc","\uD83D\uDC83\uD83C\uDFFB":"1f483-1f3fb","\uD83D\uDC82\uD83C\uDFFF":"1f482-1f3ff","\uD83D\uDC82\uD83C\uDFFE":"1f482-1f3fe","\uD83D\uDC82\uD83C\uDFFD":"1f482-1f3fd","\uD83D\uDC82\uD83C\uDFFC":"1f482-1f3fc","\uD83D\uDC82\uD83C\uDFFB":"1f482-1f3fb","\uD83D\uDC81\uD83C\uDFFF":"1f481-1f3ff","\uD83D\uDC81\uD83C\uDFFE":"1f481-1f3fe","\uD83D\uDC81\uD83C\uDFFD":"1f481-1f3fd","\uD83D\uDC81\uD83C\uDFFC":"1f481-1f3fc","\uD83D\uDC81\uD83C\uDFFB":"1f481-1f3fb","\uD83D\uDC7C\uD83C\uDFFF":"1f47c-1f3ff","\uD83D\uDC7C\uD83C\uDFFE":"1f47c-1f3fe","\uD83D\uDC7C\uD83C\uDFFD":"1f47c-1f3fd","\uD83D\uDC7C\uD83C\uDFFC":"1f47c-1f3fc","\uD83D\uDC7C\uD83C\uDFFB":"1f47c-1f3fb","\uD83D\uDC78\uD83C\uDFFF":"1f478-1f3ff","\uD83D\uDC78\uD83C\uDFFE":"1f478-1f3fe","\uD83D\uDC78\uD83C\uDFFD":"1f478-1f3fd","\uD83D\uDC78\uD83C\uDFFC":"1f478-1f3fc","\uD83D\uDC78\uD83C\uDFFB":"1f478-1f3fb","\uD83D\uDC77\uD83C\uDFFF":"1f477-1f3ff","\uD83D\uDC77\uD83C\uDFFE":"1f477-1f3fe","\uD83D\uDC77\uD83C\uDFFD":"1f477-1f3fd","\uD83D\uDC77\uD83C\uDFFC":"1f477-1f3fc","\uD83D\uDC77\uD83C\uDFFB":"1f477-1f3fb","\uD83D\uDC76\uD83C\uDFFF":"1f476-1f3ff","\uD83D\uDC76\uD83C\uDFFE":"1f476-1f3fe","\uD83D\uDC76\uD83C\uDFFD":"1f476-1f3fd","\uD83D\uDC76\uD83C\uDFFC":"1f476-1f3fc","\uD83D\uDC76\uD83C\uDFFB":"1f476-1f3fb","\uD83D\uDC75\uD83C\uDFFF":"1f475-1f3ff","\uD83D\uDC75\uD83C\uDFFE":"1f475-1f3fe","\uD83D\uDC75\uD83C\uDFFD":"1f475-1f3fd","\uD83D\uDC75\uD83C\uDFFC":"1f475-1f3fc","\uD83D\uDC75\uD83C\uDFFB":"1f475-1f3fb","\uD83D\uDC74\uD83C\uDFFF":"1f474-1f3ff","\uD83D\uDC74\uD83C\uDFFE":"1f474-1f3fe","\uD83D\uDC74\uD83C\uDFFD":"1f474-1f3fd","\uD83D\uDC74\uD83C\uDFFC":"1f474-1f3fc","\uD83D\uDC74\uD83C\uDFFB":"1f474-1f3fb","\uD83D\uDC73\uD83C\uDFFF":"1f473-1f3ff","\uD83D\uDC73\uD83C\uDFFE":"1f473-1f3fe","\uD83D\uDC73\uD83C\uDFFD":"1f473-1f3fd","\uD83D\uDC73\uD83C\uDFFC":"1f473-1f3fc","\uD83D\uDC73\uD83C\uDFFB":"1f473-1f3fb","\uD83D\uDC72\uD83C\uDFFF":"1f472-1f3ff","\uD83D\uDC72\uD83C\uDFFE":"1f472-1f3fe","\uD83D\uDC72\uD83C\uDFFD":"1f472-1f3fd","\uD83D\uDC72\uD83C\uDFFC":"1f472-1f3fc","\uD83D\uDC72\uD83C\uDFFB":"1f472-1f3fb","\uD83D\uDC71\uD83C\uDFFF":"1f471-1f3ff","\uD83D\uDC71\uD83C\uDFFE":"1f471-1f3fe","\uD83D\uDC71\uD83C\uDFFD":"1f471-1f3fd","\uD83D\uDC71\uD83C\uDFFC":"1f471-1f3fc","\uD83D\uDC71\uD83C\uDFFB":"1f471-1f3fb","\uD83D\uDC70\uD83C\uDFFF":"1f470-1f3ff","\uD83D\uDC70\uD83C\uDFFE":"1f470-1f3fe","\uD83D\uDC70\uD83C\uDFFD":"1f470-1f3fd","\uD83D\uDC70\uD83C\uDFFC":"1f470-1f3fc","\uD83D\uDC70\uD83C\uDFFB":"1f470-1f3fb","\uD83D\uDC6E\uD83C\uDFFF":"1f46e-1f3ff","\uD83D\uDC6E\uD83C\uDFFE":"1f46e-1f3fe","\uD83D\uDC6E\uD83C\uDFFD":"1f46e-1f3fd","\uD83D\uDC6E\uD83C\uDFFC":"1f46e-1f3fc","\uD83D\uDC6E\uD83C\uDFFB":"1f46e-1f3fb","\uD83D\uDC69\uD83C\uDFFF":"1f469-1f3ff","\uD83D\uDC69\uD83C\uDFFE":"1f469-1f3fe","\uD83D\uDC69\uD83C\uDFFD":"1f469-1f3fd","\uD83D\uDC69\uD83C\uDFFC":"1f469-1f3fc","\uD83D\uDC69\uD83C\uDFFB":"1f469-1f3fb","\uD83D\uDC68\uD83C\uDFFF":"1f468-1f3ff","\uD83D\uDC68\uD83C\uDFFE":"1f468-1f3fe","\uD83D\uDC68\uD83C\uDFFD":"1f468-1f3fd","\uD83D\uDC68\uD83C\uDFFC":"1f468-1f3fc","\uD83D\uDC68\uD83C\uDFFB":"1f468-1f3fb","\uD83D\uDC67\uD83C\uDFFF":"1f467-1f3ff","\uD83D\uDC67\uD83C\uDFFE":"1f467-1f3fe","\uD83D\uDC67\uD83C\uDFFD":"1f467-1f3fd","\uD83D\uDC67\uD83C\uDFFC":"1f467-1f3fc","\uD83D\uDC67\uD83C\uDFFB":"1f467-1f3fb","\uD83D\uDC66\uD83C\uDFFF":"1f466-1f3ff","\uD83D\uDC66\uD83C\uDFFE":"1f466-1f3fe","\uD83D\uDC66\uD83C\uDFFD":"1f466-1f3fd","\uD83D\uDC66\uD83C\uDFFC":"1f466-1f3fc","\uD83D\uDC66\uD83C\uDFFB":"1f466-1f3fb","\uD83D\uDC50\uD83C\uDFFF":"1f450-1f3ff","\uD83D\uDC50\uD83C\uDFFE":"1f450-1f3fe","\uD83D\uDC50\uD83C\uDFFD":"1f450-1f3fd","\uD83D\uDC50\uD83C\uDFFC":"1f450-1f3fc","\uD83D\uDC50\uD83C\uDFFB":"1f450-1f3fb","\uD83D\uDC4F\uD83C\uDFFF":"1f44f-1f3ff","\uD83D\uDC4F\uD83C\uDFFE":"1f44f-1f3fe","\uD83D\uDC4F\uD83C\uDFFD":"1f44f-1f3fd","\uD83D\uDC4F\uD83C\uDFFC":"1f44f-1f3fc","\uD83D\uDC4F\uD83C\uDFFB":"1f44f-1f3fb","\uD83D\uDC4E\uD83C\uDFFF":"1f44e-1f3ff","\uD83D\uDC4E\uD83C\uDFFE":"1f44e-1f3fe","\uD83D\uDC4E\uD83C\uDFFD":"1f44e-1f3fd","\uD83D\uDC4E\uD83C\uDFFC":"1f44e-1f3fc","\uD83D\uDC4E\uD83C\uDFFB":"1f44e-1f3fb","\uD83D\uDC4D\uD83C\uDFFF":"1f44d-1f3ff","\uD83D\uDC4D\uD83C\uDFFE":"1f44d-1f3fe","\uD83D\uDC4D\uD83C\uDFFD":"1f44d-1f3fd","\uD83D\uDC4D\uD83C\uDFFC":"1f44d-1f3fc","\uD83D\uDC4D\uD83C\uDFFB":"1f44d-1f3fb","\uD83D\uDC4C\uD83C\uDFFF":"1f44c-1f3ff","\uD83D\uDC4C\uD83C\uDFFE":"1f44c-1f3fe","\uD83D\uDC4C\uD83C\uDFFD":"1f44c-1f3fd","\uD83D\uDC4C\uD83C\uDFFC":"1f44c-1f3fc","\uD83D\uDC4C\uD83C\uDFFB":"1f44c-1f3fb","\uD83D\uDC4B\uD83C\uDFFF":"1f44b-1f3ff","\uD83D\uDC4B\uD83C\uDFFE":"1f44b-1f3fe","\uD83D\uDC4B\uD83C\uDFFD":"1f44b-1f3fd","\uD83D\uDC4B\uD83C\uDFFC":"1f44b-1f3fc","\uD83D\uDC4B\uD83C\uDFFB":"1f44b-1f3fb","\uD83D\uDC4A\uD83C\uDFFF":"1f44a-1f3ff","\uD83D\uDC4A\uD83C\uDFFE":"1f44a-1f3fe","\uD83D\uDC4A\uD83C\uDFFD":"1f44a-1f3fd","\uD83D\uDC4A\uD83C\uDFFC":"1f44a-1f3fc","\uD83D\uDC4A\uD83C\uDFFB":"1f44a-1f3fb","\uD83D\uDC49\uD83C\uDFFF":"1f449-1f3ff","\uD83D\uDC49\uD83C\uDFFE":"1f449-1f3fe","\uD83D\uDC49\uD83C\uDFFD":"1f449-1f3fd","\uD83D\uDC49\uD83C\uDFFC":"1f449-1f3fc","\uD83D\uDC49\uD83C\uDFFB":"1f449-1f3fb","\uD83D\uDC48\uD83C\uDFFF":"1f448-1f3ff","\uD83D\uDC48\uD83C\uDFFE":"1f448-1f3fe","\uD83D\uDC48\uD83C\uDFFD":"1f448-1f3fd","\uD83D\uDC48\uD83C\uDFFC":"1f448-1f3fc","\uD83D\uDC48\uD83C\uDFFB":"1f448-1f3fb","\uD83D\uDC47\uD83C\uDFFF":"1f447-1f3ff","\uD83D\uDC47\uD83C\uDFFE":"1f447-1f3fe","\uD83D\uDC47\uD83C\uDFFD":"1f447-1f3fd","\uD83D\uDC47\uD83C\uDFFC":"1f447-1f3fc","\uD83D\uDC47\uD83C\uDFFB":"1f447-1f3fb","\uD83D\uDC46\uD83C\uDFFF":"1f446-1f3ff","\uD83D\uDC46\uD83C\uDFFE":"1f446-1f3fe","\uD83D\uDC46\uD83C\uDFFD":"1f446-1f3fd","\uD83D\uDC46\uD83C\uDFFC":"1f446-1f3fc","\uD83D\uDC46\uD83C\uDFFB":"1f446-1f3fb","\uD83D\uDC43\uD83C\uDFFF":"1f443-1f3ff","\uD83D\uDC43\uD83C\uDFFE":"1f443-1f3fe","\uD83D\uDC43\uD83C\uDFFD":"1f443-1f3fd","\uD83D\uDC43\uD83C\uDFFC":"1f443-1f3fc","\uD83D\uDC43\uD83C\uDFFB":"1f443-1f3fb","\uD83D\uDC42\uD83C\uDFFF":"1f442-1f3ff","\uD83D\uDC42\uD83C\uDFFE":"1f442-1f3fe","\uD83D\uDC42\uD83C\uDFFD":"1f442-1f3fd","\uD83D\uDC42\uD83C\uDFFC":"1f442-1f3fc","\uD83D\uDC42\uD83C\uDFFB":"1f442-1f3fb","\uD83C\uDFF3\uD83C\uDF08":"1f3f3-1f308","\uD83C\uDFCB\uD83C\uDFFF":"1f3cb-1f3ff","\uD83C\uDFCB\uD83C\uDFFE":"1f3cb-1f3fe","\uD83C\uDFCB\uD83C\uDFFD":"1f3cb-1f3fd","\uD83C\uDFCB\uD83C\uDFFC":"1f3cb-1f3fc","\uD83C\uDFCB\uD83C\uDFFB":"1f3cb-1f3fb","\uD83C\uDFCA\uD83C\uDFFF":"1f3ca-1f3ff","\uD83C\uDFCA\uD83C\uDFFE":"1f3ca-1f3fe","\uD83C\uDFCA\uD83C\uDFFD":"1f3ca-1f3fd","\uD83C\uDFCA\uD83C\uDFFC":"1f3ca-1f3fc","\uD83C\uDFCA\uD83C\uDFFB":"1f3ca-1f3fb","\uD83C\uDFC7\uD83C\uDFFF":"1f3c7-1f3ff","\uD83C\uDFC7\uD83C\uDFFE":"1f3c7-1f3fe","\uD83C\uDFC7\uD83C\uDFFD":"1f3c7-1f3fd","\uD83C\uDFC7\uD83C\uDFFC":"1f3c7-1f3fc","\uD83C\uDFC7\uD83C\uDFFB":"1f3c7-1f3fb","\uD83C\uDFC4\uD83C\uDFFF":"1f3c4-1f3ff","\uD83C\uDFC4\uD83C\uDFFE":"1f3c4-1f3fe","\uD83C\uDFC4\uD83C\uDFFD":"1f3c4-1f3fd","\uD83C\uDFC4\uD83C\uDFFC":"1f3c4-1f3fc","\uD83C\uDFC4\uD83C\uDFFB":"1f3c4-1f3fb","\uD83C\uDFC3\uD83C\uDFFF":"1f3c3-1f3ff","\uD83C\uDFC3\uD83C\uDFFE":"1f3c3-1f3fe","\uD83C\uDFC3\uD83C\uDFFD":"1f3c3-1f3fd","\uD83C\uDFC3\uD83C\uDFFC":"1f3c3-1f3fc","\uD83C\uDFC3\uD83C\uDFFB":"1f3c3-1f3fb","\uD83C\uDF85\uD83C\uDFFF":"1f385-1f3ff","\uD83C\uDF85\uD83C\uDFFE":"1f385-1f3fe","\uD83C\uDF85\uD83C\uDFFD":"1f385-1f3fd","\uD83C\uDF85\uD83C\uDFFC":"1f385-1f3fc","\uD83C\uDF85\uD83C\uDFFB":"1f385-1f3fb","\uD83C\uDDFF\uD83C\uDDFC":"1f1ff-1f1fc","\uD83C\uDDFF\uD83C\uDDF2":"1f1ff-1f1f2","\uD83C\uDDFF\uD83C\uDDE6":"1f1ff-1f1e6","\uD83C\uDDFE\uD83C\uDDF9":"1f1fe-1f1f9","\uD83C\uDDFE\uD83C\uDDEA":"1f1fe-1f1ea","\uD83C\uDDFD\uD83C\uDDF0":"1f1fd-1f1f0","\uD83C\uDDFC\uD83C\uDDF8":"1f1fc-1f1f8","\uD83C\uDDFC\uD83C\uDDEB":"1f1fc-1f1eb","\uD83C\uDDFB\uD83C\uDDFA":"1f1fb-1f1fa","\uD83C\uDDFB\uD83C\uDDF3":"1f1fb-1f1f3","\uD83C\uDDFB\uD83C\uDDEE":"1f1fb-1f1ee","\uD83C\uDDFB\uD83C\uDDEC":"1f1fb-1f1ec","\uD83C\uDDFB\uD83C\uDDEA":"1f1fb-1f1ea","\uD83C\uDDFB\uD83C\uDDE8":"1f1fb-1f1e8","\uD83C\uDDFB\uD83C\uDDE6":"1f1fb-1f1e6","\uD83C\uDDFA\uD83C\uDDFF":"1f1fa-1f1ff","\uD83C\uDDFA\uD83C\uDDFE":"1f1fa-1f1fe","\uD83C\uDDFA\uD83C\uDDF8":"1f1fa-1f1f8","\uD83C\uDDFA\uD83C\uDDF2":"1f1fa-1f1f2","\uD83C\uDDFA\uD83C\uDDEC":"1f1fa-1f1ec","\uD83C\uDDFA\uD83C\uDDE6":"1f1fa-1f1e6","\uD83C\uDDF9\uD83C\uDDFF":"1f1f9-1f1ff","\uD83C\uDDF9\uD83C\uDDFC":"1f1f9-1f1fc","\uD83C\uDDF9\uD83C\uDDFB":"1f1f9-1f1fb","\uD83C\uDDF9\uD83C\uDDF9":"1f1f9-1f1f9","\uD83C\uDDF9\uD83C\uDDF7":"1f1f9-1f1f7","\uD83C\uDDF9\uD83C\uDDF4":"1f1f9-1f1f4","\uD83C\uDDF9\uD83C\uDDF3":"1f1f9-1f1f3","\uD83C\uDDF9\uD83C\uDDF2":"1f1f9-1f1f2","\uD83C\uDDF9\uD83C\uDDF1":"1f1f9-1f1f1","\uD83C\uDDF9\uD83C\uDDF0":"1f1f9-1f1f0","\uD83C\uDDF9\uD83C\uDDEF":"1f1f9-1f1ef","\uD83C\uDDF9\uD83C\uDDED":"1f1f9-1f1ed","\uD83C\uDDF9\uD83C\uDDEC":"1f1f9-1f1ec","\uD83C\uDDF9\uD83C\uDDEB":"1f1f9-1f1eb","\uD83C\uDDF9\uD83C\uDDE9":"1f1f9-1f1e9","\uD83C\uDDF9\uD83C\uDDE8":"1f1f9-1f1e8","\uD83C\uDDF9\uD83C\uDDE6":"1f1f9-1f1e6","\uD83C\uDDF8\uD83C\uDDFF":"1f1f8-1f1ff","\uD83C\uDDF8\uD83C\uDDFE":"1f1f8-1f1fe","\uD83C\uDDF8\uD83C\uDDFD":"1f1f8-1f1fd","\uD83C\uDDF8\uD83C\uDDFB":"1f1f8-1f1fb","\uD83C\uDDF8\uD83C\uDDF9":"1f1f8-1f1f9","\uD83C\uDDF8\uD83C\uDDF8":"1f1f8-1f1f8","\uD83C\uDDF8\uD83C\uDDF7":"1f1f8-1f1f7","\uD83C\uDDF8\uD83C\uDDF4":"1f1f8-1f1f4","\uD83C\uDDF8\uD83C\uDDF3":"1f1f8-1f1f3","\uD83C\uDDF8\uD83C\uDDF2":"1f1f8-1f1f2","\uD83C\uDDF8\uD83C\uDDF1":"1f1f8-1f1f1","\uD83C\uDDF8\uD83C\uDDF0":"1f1f8-1f1f0","\uD83C\uDDF8\uD83C\uDDEF":"1f1f8-1f1ef","\uD83C\uDDF8\uD83C\uDDEE":"1f1f8-1f1ee","\uD83C\uDDF8\uD83C\uDDED":"1f1f8-1f1ed","\uD83C\uDDF8\uD83C\uDDEC":"1f1f8-1f1ec","\uD83C\uDDF8\uD83C\uDDEA":"1f1f8-1f1ea","\uD83C\uDDF8\uD83C\uDDE9":"1f1f8-1f1e9","\uD83C\uDDF8\uD83C\uDDE8":"1f1f8-1f1e8","\uD83C\uDDF8\uD83C\uDDE7":"1f1f8-1f1e7","\uD83C\uDDF8\uD83C\uDDE6":"1f1f8-1f1e6","\uD83C\uDDF7\uD83C\uDDFC":"1f1f7-1f1fc","\uD83C\uDDF7\uD83C\uDDFA":"1f1f7-1f1fa","\uD83C\uDDF7\uD83C\uDDF8":"1f1f7-1f1f8","\uD83C\uDDF7\uD83C\uDDF4":"1f1f7-1f1f4","\uD83C\uDDF7\uD83C\uDDEA":"1f1f7-1f1ea","\uD83C\uDDF6\uD83C\uDDE6":"1f1f6-1f1e6","\uD83C\uDDF5\uD83C\uDDFE":"1f1f5-1f1fe","\uD83C\uDDF5\uD83C\uDDFC":"1f1f5-1f1fc","\uD83C\uDDF5\uD83C\uDDF9":"1f1f5-1f1f9","\uD83C\uDDF5\uD83C\uDDF8":"1f1f5-1f1f8","\uD83C\uDDF5\uD83C\uDDF7":"1f1f5-1f1f7","\uD83C\uDDF5\uD83C\uDDF3":"1f1f5-1f1f3","\uD83C\uDDF5\uD83C\uDDF2":"1f1f5-1f1f2","\uD83C\uDDF5\uD83C\uDDF1":"1f1f5-1f1f1","\uD83C\uDDF5\uD83C\uDDF0":"1f1f5-1f1f0","\uD83C\uDDF5\uD83C\uDDED":"1f1f5-1f1ed","\uD83C\uDDF5\uD83C\uDDEC":"1f1f5-1f1ec","\uD83C\uDDF5\uD83C\uDDEB":"1f1f5-1f1eb","\uD83C\uDDF5\uD83C\uDDEA":"1f1f5-1f1ea","\uD83C\uDDF5\uD83C\uDDE6":"1f1f5-1f1e6","\uD83C\uDDF4\uD83C\uDDF2":"1f1f4-1f1f2","\uD83C\uDDF3\uD83C\uDDFF":"1f1f3-1f1ff","\uD83C\uDDF3\uD83C\uDDFA":"1f1f3-1f1fa","\uD83C\uDDF3\uD83C\uDDF7":"1f1f3-1f1f7","\uD83C\uDDF3\uD83C\uDDF5":"1f1f3-1f1f5","\uD83C\uDDF3\uD83C\uDDF4":"1f1f3-1f1f4","\uD83C\uDDF3\uD83C\uDDF1":"1f1f3-1f1f1","\uD83C\uDDF3\uD83C\uDDEE":"1f1f3-1f1ee","\uD83C\uDDF3\uD83C\uDDEC":"1f1f3-1f1ec","\uD83C\uDDF3\uD83C\uDDEB":"1f1f3-1f1eb","\uD83C\uDDF3\uD83C\uDDEA":"1f1f3-1f1ea","\uD83C\uDDF3\uD83C\uDDE8":"1f1f3-1f1e8","\uD83C\uDDF3\uD83C\uDDE6":"1f1f3-1f1e6","\uD83C\uDDF2\uD83C\uDDFF":"1f1f2-1f1ff","\uD83C\uDDF2\uD83C\uDDFE":"1f1f2-1f1fe","\uD83C\uDDF2\uD83C\uDDFD":"1f1f2-1f1fd","\uD83C\uDDF2\uD83C\uDDFC":"1f1f2-1f1fc","\uD83C\uDDF2\uD83C\uDDFB":"1f1f2-1f1fb","\uD83C\uDDF2\uD83C\uDDFA":"1f1f2-1f1fa","\uD83C\uDDF2\uD83C\uDDF9":"1f1f2-1f1f9","\uD83C\uDDF2\uD83C\uDDF8":"1f1f2-1f1f8","\uD83C\uDDF2\uD83C\uDDF7":"1f1f2-1f1f7","\uD83C\uDDF2\uD83C\uDDF6":"1f1f2-1f1f6","\uD83C\uDDF2\uD83C\uDDF5":"1f1f2-1f1f5","\uD83C\uDDF2\uD83C\uDDF4":"1f1f2-1f1f4","\uD83C\uDDF2\uD83C\uDDF3":"1f1f2-1f1f3","\uD83C\uDDF2\uD83C\uDDF2":"1f1f2-1f1f2","\uD83C\uDDF2\uD83C\uDDF1":"1f1f2-1f1f1","\uD83C\uDDF2\uD83C\uDDF0":"1f1f2-1f1f0","\uD83C\uDDF2\uD83C\uDDED":"1f1f2-1f1ed","\uD83C\uDDF2\uD83C\uDDEC":"1f1f2-1f1ec","\uD83C\uDDF2\uD83C\uDDEB":"1f1f2-1f1eb","\uD83C\uDDF2\uD83C\uDDEA":"1f1f2-1f1ea","\uD83C\uDDF2\uD83C\uDDE9":"1f1f2-1f1e9","\uD83C\uDDF2\uD83C\uDDE8":"1f1f2-1f1e8","\uD83C\uDDF2\uD83C\uDDE6":"1f1f2-1f1e6","\uD83C\uDDF1\uD83C\uDDFE":"1f1f1-1f1fe","\uD83C\uDDF1\uD83C\uDDFB":"1f1f1-1f1fb","\uD83C\uDDF1\uD83C\uDDFA":"1f1f1-1f1fa","\uD83C\uDDF1\uD83C\uDDF9":"1f1f1-1f1f9","\uD83C\uDDF1\uD83C\uDDF8":"1f1f1-1f1f8","\uD83C\uDDF1\uD83C\uDDF7":"1f1f1-1f1f7","\uD83C\uDDF1\uD83C\uDDF0":"1f1f1-1f1f0","\uD83C\uDDF1\uD83C\uDDEE":"1f1f1-1f1ee","\uD83C\uDDF1\uD83C\uDDE8":"1f1f1-1f1e8","\uD83C\uDDF1\uD83C\uDDE7":"1f1f1-1f1e7","\uD83C\uDDF1\uD83C\uDDE6":"1f1f1-1f1e6","\uD83C\uDDF0\uD83C\uDDFF":"1f1f0-1f1ff","\uD83C\uDDF0\uD83C\uDDFE":"1f1f0-1f1fe","\uD83C\uDDF0\uD83C\uDDFC":"1f1f0-1f1fc","\uD83C\uDDF0\uD83C\uDDF7":"1f1f0-1f1f7","\uD83C\uDDF0\uD83C\uDDF5":"1f1f0-1f1f5","\uD83C\uDDF0\uD83C\uDDF3":"1f1f0-1f1f3","\uD83C\uDDF0\uD83C\uDDF2":"1f1f0-1f1f2","\uD83C\uDDF0\uD83C\uDDEE":"1f1f0-1f1ee","\uD83C\uDDF0\uD83C\uDDED":"1f1f0-1f1ed","\uD83C\uDDF0\uD83C\uDDEC":"1f1f0-1f1ec","\uD83C\uDDF0\uD83C\uDDEA":"1f1f0-1f1ea","\uD83C\uDDEF\uD83C\uDDF5":"1f1ef-1f1f5","\uD83C\uDDEF\uD83C\uDDF4":"1f1ef-1f1f4","\uD83C\uDDEF\uD83C\uDDF2":"1f1ef-1f1f2","\uD83C\uDDEF\uD83C\uDDEA":"1f1ef-1f1ea","\uD83C\uDDEE\uD83C\uDDF9":"1f1ee-1f1f9","\uD83C\uDDEE\uD83C\uDDF8":"1f1ee-1f1f8","\uD83C\uDDEE\uD83C\uDDF7":"1f1ee-1f1f7","\uD83C\uDDEE\uD83C\uDDF6":"1f1ee-1f1f6","\uD83C\uDDEE\uD83C\uDDF4":"1f1ee-1f1f4","\uD83C\uDDEE\uD83C\uDDF3":"1f1ee-1f1f3","\uD83C\uDDEE\uD83C\uDDF2":"1f1ee-1f1f2","\uD83C\uDDEE\uD83C\uDDF1":"1f1ee-1f1f1","\uD83C\uDDEE\uD83C\uDDEA":"1f1ee-1f1ea","\uD83C\uDDEE\uD83C\uDDE9":"1f1ee-1f1e9","\uD83C\uDDEE\uD83C\uDDE8":"1f1ee-1f1e8","\uD83C\uDDED\uD83C\uDDFA":"1f1ed-1f1fa","\uD83C\uDDED\uD83C\uDDF9":"1f1ed-1f1f9","\uD83C\uDDED\uD83C\uDDF7":"1f1ed-1f1f7","\uD83C\uDDED\uD83C\uDDF3":"1f1ed-1f1f3","\uD83C\uDDED\uD83C\uDDF2":"1f1ed-1f1f2","\uD83C\uDDED\uD83C\uDDF0":"1f1ed-1f1f0","\uD83C\uDDEC\uD83C\uDDFE":"1f1ec-1f1fe","\uD83C\uDDEC\uD83C\uDDFC":"1f1ec-1f1fc","\uD83C\uDDEC\uD83C\uDDFA":"1f1ec-1f1fa","\uD83C\uDDEC\uD83C\uDDF9":"1f1ec-1f1f9","\uD83C\uDDEC\uD83C\uDDF8":"1f1ec-1f1f8","\uD83C\uDDEC\uD83C\uDDF7":"1f1ec-1f1f7","\uD83C\uDDEC\uD83C\uDDF6":"1f1ec-1f1f6","\uD83C\uDDEC\uD83C\uDDF5":"1f1ec-1f1f5","\uD83C\uDDEC\uD83C\uDDF3":"1f1ec-1f1f3","\uD83C\uDDEC\uD83C\uDDF2":"1f1ec-1f1f2","\uD83C\uDDEC\uD83C\uDDF1":"1f1ec-1f1f1","\uD83C\uDDEC\uD83C\uDDEE":"1f1ec-1f1ee","\uD83C\uDDEC\uD83C\uDDED":"1f1ec-1f1ed","\uD83C\uDDEC\uD83C\uDDEC":"1f1ec-1f1ec","\uD83C\uDDEC\uD83C\uDDEB":"1f1ec-1f1eb","\uD83C\uDDEC\uD83C\uDDEA":"1f1ec-1f1ea","\uD83C\uDDEC\uD83C\uDDE9":"1f1ec-1f1e9","\uD83C\uDDEC\uD83C\uDDE7":"1f1ec-1f1e7","\uD83C\uDDEC\uD83C\uDDE6":"1f1ec-1f1e6","\uD83C\uDDEB\uD83C\uDDF7":"1f1eb-1f1f7","\uD83C\uDDEB\uD83C\uDDF4":"1f1eb-1f1f4","\uD83C\uDDEB\uD83C\uDDF2":"1f1eb-1f1f2","\uD83C\uDDEB\uD83C\uDDF0":"1f1eb-1f1f0","\uD83C\uDDEB\uD83C\uDDEF":"1f1eb-1f1ef","\uD83C\uDDEB\uD83C\uDDEE":"1f1eb-1f1ee","\uD83C\uDDEA\uD83C\uDDFA":"1f1ea-1f1fa","\uD83C\uDDEA\uD83C\uDDF9":"1f1ea-1f1f9","\uD83C\uDDEA\uD83C\uDDF8":"1f1ea-1f1f8","\uD83C\uDDEA\uD83C\uDDF7":"1f1ea-1f1f7","\uD83C\uDDEA\uD83C\uDDED":"1f1ea-1f1ed","\uD83C\uDDEA\uD83C\uDDEC":"1f1ea-1f1ec","\uD83C\uDDEA\uD83C\uDDEA":"1f1ea-1f1ea","\uD83C\uDDEA\uD83C\uDDE8":"1f1ea-1f1e8","\uD83C\uDDEA\uD83C\uDDE6":"1f1ea-1f1e6","\uD83C\uDDE9\uD83C\uDDFF":"1f1e9-1f1ff","\uD83C\uDDE9\uD83C\uDDF4":"1f1e9-1f1f4","\uD83C\uDDE9\uD83C\uDDF2":"1f1e9-1f1f2","\uD83C\uDDE9\uD83C\uDDF0":"1f1e9-1f1f0","\uD83C\uDDE9\uD83C\uDDEF":"1f1e9-1f1ef","\uD83C\uDDE9\uD83C\uDDEC":"1f1e9-1f1ec","\uD83C\uDDE9\uD83C\uDDEA":"1f1e9-1f1ea","\uD83C\uDDE8\uD83C\uDDFF":"1f1e8-1f1ff","\uD83C\uDDE8\uD83C\uDDFE":"1f1e8-1f1fe","\uD83C\uDDE8\uD83C\uDDFD":"1f1e8-1f1fd","\uD83C\uDDE8\uD83C\uDDFC":"1f1e8-1f1fc","\uD83C\uDDE8\uD83C\uDDFB":"1f1e8-1f1fb","\uD83C\uDDE8\uD83C\uDDFA":"1f1e8-1f1fa","\uD83C\uDDE8\uD83C\uDDF7":"1f1e8-1f1f7","\uD83C\uDDE8\uD83C\uDDF5":"1f1e8-1f1f5","\uD83C\uDDE8\uD83C\uDDF4":"1f1e8-1f1f4","\uD83C\uDDE8\uD83C\uDDF3":"1f1e8-1f1f3","\uD83C\uDDE8\uD83C\uDDF2":"1f1e8-1f1f2","\uD83C\uDDE8\uD83C\uDDF1":"1f1e8-1f1f1","\uD83C\uDDE8\uD83C\uDDF0":"1f1e8-1f1f0","\uD83C\uDDE8\uD83C\uDDEE":"1f1e8-1f1ee","\uD83C\uDDE8\uD83C\uDDED":"1f1e8-1f1ed","\uD83C\uDDE8\uD83C\uDDEC":"1f1e8-1f1ec","\uD83C\uDDE8\uD83C\uDDEB":"1f1e8-1f1eb","\uD83C\uDDE8\uD83C\uDDE9":"1f1e8-1f1e9","\uD83C\uDDE8\uD83C\uDDE8":"1f1e8-1f1e8","\uD83C\uDDE8\uD83C\uDDE6":"1f1e8-1f1e6","\uD83C\uDDE7\uD83C\uDDFF":"1f1e7-1f1ff","\uD83C\uDDE7\uD83C\uDDFE":"1f1e7-1f1fe","\uD83C\uDDE7\uD83C\uDDFC":"1f1e7-1f1fc","\uD83C\uDDE7\uD83C\uDDFB":"1f1e7-1f1fb","\uD83C\uDDE7\uD83C\uDDF9":"1f1e7-1f1f9","\uD83C\uDDE7\uD83C\uDDF8":"1f1e7-1f1f8","\uD83C\uDDE7\uD83C\uDDF7":"1f1e7-1f1f7","\uD83C\uDDE7\uD83C\uDDF6":"1f1e7-1f1f6","\uD83C\uDDE7\uD83C\uDDF4":"1f1e7-1f1f4","\uD83C\uDDE7\uD83C\uDDF3":"1f1e7-1f1f3","\uD83C\uDDE7\uD83C\uDDF2":"1f1e7-1f1f2","\uD83C\uDDE7\uD83C\uDDF1":"1f1e7-1f1f1","\uD83C\uDDE7\uD83C\uDDEF":"1f1e7-1f1ef","\uD83C\uDDE7\uD83C\uDDEE":"1f1e7-1f1ee","\uD83C\uDDE7\uD83C\uDDED":"1f1e7-1f1ed","\uD83C\uDDE7\uD83C\uDDEC":"1f1e7-1f1ec","\uD83C\uDDE7\uD83C\uDDEB":"1f1e7-1f1eb","\uD83C\uDDE7\uD83C\uDDEA":"1f1e7-1f1ea","\uD83C\uDDE7\uD83C\uDDE9":"1f1e7-1f1e9","\uD83C\uDDE7\uD83C\uDDE7":"1f1e7-1f1e7","\uD83C\uDDE7\uD83C\uDDE6":"1f1e7-1f1e6","\uD83C\uDDE6\uD83C\uDDFF":"1f1e6-1f1ff","\uD83C\uDDE6\uD83C\uDDFD":"1f1e6-1f1fd","\uD83C\uDDE6\uD83C\uDDFC":"1f1e6-1f1fc","\uD83C\uDDE6\uD83C\uDDFA":"1f1e6-1f1fa","\uD83C\uDDE6\uD83C\uDDF9":"1f1e6-1f1f9","\uD83C\uDDE6\uD83C\uDDF8":"1f1e6-1f1f8","\uD83C\uDDE6\uD83C\uDDF7":"1f1e6-1f1f7","\uD83C\uDDE6\uD83C\uDDF6":"1f1e6-1f1f6","\uD83C\uDDE6\uD83C\uDDF4":"1f1e6-1f1f4","\uD83C\uDDE6\uD83C\uDDF2":"1f1e6-1f1f2","\uD83C\uDDE6\uD83C\uDDF1":"1f1e6-1f1f1","\uD83C\uDDE6\uD83C\uDDEE":"1f1e6-1f1ee","\uD83C\uDDE6\uD83C\uDDEC":"1f1e6-1f1ec","\uD83C\uDDE6\uD83C\uDDEB":"1f1e6-1f1eb","\uD83C\uDDE6\uD83C\uDDEA":"1f1e6-1f1ea","\uD83C\uDDE6\uD83C\uDDE9":"1f1e6-1f1e9","\uD83C\uDDE6\uD83C\uDDE8":"1f1e6-1f1e8","\uD83C\uDC04":"1f004","\uD83C\uDD7F":"1f17f","\uD83C\uDE02":"1f202","\uD83C\uDE1A":"1f21a","\uD83C\uDE2F":"1f22f","\uD83C\uDE37":"1f237","\uD83C\uDF9E":"1f39e","\uD83C\uDF9F":"1f39f","\uD83C\uDFCB":"1f3cb","\uD83C\uDFCC":"1f3cc","\uD83C\uDFCD":"1f3cd","\uD83C\uDFCE":"1f3ce","\uD83C\uDF96":"1f396","\uD83C\uDF97":"1f397","\uD83C\uDF36":"1f336","\uD83C\uDF27":"1f327","\uD83C\uDF28":"1f328","\uD83C\uDF29":"1f329","\uD83C\uDF2A":"1f32a","\uD83C\uDF2B":"1f32b","\uD83C\uDF2C":"1f32c","\uD83D\uDC3F":"1f43f","\uD83D\uDD77":"1f577","\uD83D\uDD78":"1f578","\uD83C\uDF21":"1f321","\uD83C\uDF99":"1f399","\uD83C\uDF9A":"1f39a","\uD83C\uDF9B":"1f39b","\uD83C\uDFF3":"1f3f3","\uD83C\uDFF5":"1f3f5","\uD83C\uDFF7":"1f3f7","\uD83D\uDCFD":"1f4fd","\uD83D\uDD49":"1f549","\uD83D\uDD4A":"1f54a","\uD83D\uDD6F":"1f56f","\uD83D\uDD70":"1f570","\uD83D\uDD73":"1f573","\uD83D\uDD76":"1f576","\uD83D\uDD79":"1f579","\uD83D\uDD87":"1f587","\uD83D\uDD8A":"1f58a","\uD83D\uDD8B":"1f58b","\uD83D\uDD8C":"1f58c","\uD83D\uDD8D":"1f58d","\uD83D\uDDA5":"1f5a5","\uD83D\uDDA8":"1f5a8","\uD83D\uDDB2":"1f5b2","\uD83D\uDDBC":"1f5bc","\uD83D\uDDC2":"1f5c2","\uD83D\uDDC3":"1f5c3","\uD83D\uDDC4":"1f5c4","\uD83D\uDDD1":"1f5d1","\uD83D\uDDD2":"1f5d2","\uD83D\uDDD3":"1f5d3","\uD83D\uDDDC":"1f5dc","\uD83D\uDDDD":"1f5dd","\uD83D\uDDDE":"1f5de","\uD83D\uDDE1":"1f5e1","\uD83D\uDDE3":"1f5e3","\uD83D\uDDE8":"1f5e8","\uD83D\uDDEF":"1f5ef","\uD83D\uDDF3":"1f5f3","\uD83D\uDDFA":"1f5fa","\uD83D\uDEE0":"1f6e0","\uD83D\uDEE1":"1f6e1","\uD83D\uDEE2":"1f6e2","\uD83D\uDEF0":"1f6f0","\uD83C\uDF7D":"1f37d","\uD83D\uDC41":"1f441","\uD83D\uDD74":"1f574","\uD83D\uDD75":"1f575","\uD83D\uDD90":"1f590","\uD83C\uDFD4":"1f3d4","\uD83C\uDFD5":"1f3d5","\uD83C\uDFD6":"1f3d6","\uD83C\uDFD7":"1f3d7","\uD83C\uDFD8":"1f3d8","\uD83C\uDFD9":"1f3d9","\uD83C\uDFDA":"1f3da","\uD83C\uDFDB":"1f3db","\uD83C\uDFDC":"1f3dc","\uD83C\uDFDD":"1f3dd","\uD83C\uDFDE":"1f3de","\uD83C\uDFDF":"1f3df","\uD83D\uDECB":"1f6cb","\uD83D\uDECD":"1f6cd","\uD83D\uDECE":"1f6ce","\uD83D\uDECF":"1f6cf","\uD83D\uDEE3":"1f6e3","\uD83D\uDEE4":"1f6e4","\uD83D\uDEE5":"1f6e5","\uD83D\uDEE9":"1f6e9","\uD83D\uDEF3":"1f6f3","\uD83C\uDF24":"1f324","\uD83C\uDF25":"1f325","\uD83C\uDF26":"1f326","\uD83D\uDDB1":"1f5b1","\u261D\uD83C\uDFFB":"261d-1f3fb","\u261D\uD83C\uDFFC":"261d-1f3fc","\u261D\uD83C\uDFFD":"261d-1f3fd","\u261D\uD83C\uDFFE":"261d-1f3fe","\u261D\uD83C\uDFFF":"261d-1f3ff","\u270C\uD83C\uDFFB":"270c-1f3fb","\u270C\uD83C\uDFFC":"270c-1f3fc","\u270C\uD83C\uDFFD":"270c-1f3fd","\u270C\uD83C\uDFFE":"270c-1f3fe","\u270C\uD83C\uDFFF":"270c-1f3ff","\u270A\uD83C\uDFFB":"270a-1f3fb","\u270A\uD83C\uDFFC":"270a-1f3fc","\u270A\uD83C\uDFFD":"270a-1f3fd","\u270A\uD83C\uDFFE":"270a-1f3fe","\u270A\uD83C\uDFFF":"270a-1f3ff","\u270B\uD83C\uDFFB":"270b-1f3fb","\u270B\uD83C\uDFFC":"270b-1f3fc","\u270B\uD83C\uDFFD":"270b-1f3fd","\u270B\uD83C\uDFFE":"270b-1f3fe","\u270B\uD83C\uDFFF":"270b-1f3ff","\u270D\uD83C\uDFFB":"270d-1f3fb","\u270D\uD83C\uDFFC":"270d-1f3fc","\u270D\uD83C\uDFFD":"270d-1f3fd","\u270D\uD83C\uDFFE":"270d-1f3fe","\u270D\uD83C\uDFFF":"270d-1f3ff","\u26F9\uD83C\uDFFB":"26f9-1f3fb","\u26F9\uD83C\uDFFC":"26f9-1f3fc","\u26F9\uD83C\uDFFD":"26f9-1f3fd","\u26F9\uD83C\uDFFE":"26f9-1f3fe","\u26F9\uD83C\uDFFF":"26f9-1f3ff","\u00A9":"00a9","\u00AE":"00ae","\u203C":"203c","\u2049":"2049","\u2122":"2122","\u2139":"2139","\u2194":"2194","\u2195":"2195","\u2196":"2196","\u2197":"2197","\u2198":"2198","\u2199":"2199","\u21A9":"21a9","\u21AA":"21aa","\u231A":"231a","\u231B":"231b","\u24C2":"24c2","\u25AA":"25aa","\u25AB":"25ab","\u25B6":"25b6","\u25C0":"25c0","\u25FB":"25fb","\u25FC":"25fc","\u25FD":"25fd","\u25FE":"25fe","\u2600":"2600","\u2601":"2601","\u260E":"260e","\u2611":"2611","\u2614":"2614","\u2615":"2615","\u261D":"261d","\u263A":"263a","\u2648":"2648","\u2649":"2649","\u264A":"264a","\u264B":"264b","\u264C":"264c","\u264D":"264d","\u264E":"264e","\u264F":"264f","\u2650":"2650","\u2651":"2651","\u2652":"2652","\u2653":"2653","\u2660":"2660","\u2663":"2663","\u2665":"2665","\u2666":"2666","\u2668":"2668","\u267B":"267b","\u267F":"267f","\u2693":"2693","\u26A0":"26a0","\u26A1":"26a1","\u26AA":"26aa","\u26AB":"26ab","\u26BD":"26bd","\u26BE":"26be","\u26C4":"26c4","\u26C5":"26c5","\u26D4":"26d4","\u26EA":"26ea","\u26F2":"26f2","\u26F3":"26f3","\u26F5":"26f5","\u26FA":"26fa","\u26FD":"26fd","\u2702":"2702","\u2708":"2708","\u2709":"2709","\u270C":"270c","\u270F":"270f","\u2712":"2712","\u2714":"2714","\u2716":"2716","\u2733":"2733","\u2734":"2734","\u2744":"2744","\u2747":"2747","\u2757":"2757","\u2764":"2764","\u27A1":"27a1","\u2934":"2934","\u2935":"2935","\u2B05":"2b05","\u2B06":"2b06","\u2B07":"2b07","\u2B1B":"2b1b","\u2B1C":"2b1c","\u2B50":"2b50","\u2B55":"2b55","\u3030":"3030","\u303D":"303d","\u3297":"3297","\u3299":"3299","\u271D":"271d","\u2328":"2328","\u270D":"270d","\u23CF":"23cf","\u23ED":"23ed","\u23EE":"23ee","\u23EF":"23ef","\u23F1":"23f1","\u23F2":"23f2","\u23F8":"23f8","\u23F9":"23f9","\u23FA":"23fa","\u2602":"2602","\u2603":"2603","\u2604":"2604","\u2618":"2618","\u2620":"2620","\u2622":"2622","\u2623":"2623","\u2626":"2626","\u262A":"262a","\u262E":"262e","\u262F":"262f","\u2638":"2638","\u2639":"2639","\u2692":"2692","\u2694":"2694","\u2696":"2696","\u2697":"2697","\u2699":"2699","\u269B":"269b","\u269C":"269c","\u26B0":"26b0","\u26B1":"26b1","\u26C8":"26c8","\u26CF":"26cf","\u26D1":"26d1","\u26D3":"26d3","\u26E9":"26e9","\u26F0":"26f0","\u26F1":"26f1","\u26F4":"26f4","\u26F7":"26f7","\u26F8":"26f8","\u26F9":"26f9","\u2721":"2721","\u2763":"2763","\uD83E\uDD49":"1f949","\uD83E\uDD48":"1f948","\uD83E\uDD47":"1f947","\uD83E\uDD3A":"1f93a","\uD83E\uDD45":"1f945","\uD83E\uDD3E":"1f93e","\uD83C\uDDFF":"1f1ff","\uD83E\uDD3D":"1f93d","\uD83E\uDD4B":"1f94b","\uD83E\uDD4A":"1f94a","\uD83E\uDD3C":"1f93c","\uD83E\uDD39":"1f939","\uD83E\uDD38":"1f938","\uD83D\uDEF6":"1f6f6","\uD83D\uDEF5":"1f6f5","\uD83D\uDEF4":"1f6f4","\uD83D\uDED2":"1f6d2","\uD83C\uDCCF":"1f0cf","\uD83C\uDD70":"1f170","\uD83C\uDD71":"1f171","\uD83C\uDD7E":"1f17e","\uD83D\uDED1":"1f6d1","\uD83C\uDD8E":"1f18e","\uD83C\uDD91":"1f191","\uD83C\uDDFE":"1f1fe","\uD83C\uDD92":"1f192","\uD83C\uDD93":"1f193","\uD83C\uDD94":"1f194","\uD83C\uDD95":"1f195","\uD83C\uDD96":"1f196","\uD83C\uDD97":"1f197","\uD83C\uDD98":"1f198","\uD83E\uDD44":"1f944","\uD83C\uDD99":"1f199","\uD83C\uDD9A":"1f19a","\uD83E\uDD42":"1f942","\uD83E\uDD43":"1f943","\uD83C\uDE01":"1f201","\uD83E\uDD59":"1f959","\uD83C\uDE32":"1f232","\uD83C\uDE33":"1f233","\uD83C\uDE34":"1f234","\uD83C\uDE35":"1f235","\uD83C\uDE36":"1f236","\uD83E\uDD58":"1f958","\uD83C\uDE38":"1f238","\uD83C\uDE39":"1f239","\uD83E\uDD57":"1f957","\uD83C\uDE3A":"1f23a","\uD83C\uDE50":"1f250","\uD83C\uDE51":"1f251","\uD83C\uDF00":"1f300","\uD83E\uDD56":"1f956","\uD83C\uDF01":"1f301","\uD83C\uDF02":"1f302","\uD83C\uDF03":"1f303","\uD83C\uDF04":"1f304","\uD83C\uDF05":"1f305","\uD83C\uDF06":"1f306","\uD83E\uDD55":"1f955","\uD83C\uDF07":"1f307","\uD83C\uDF08":"1f308","\uD83E\uDD54":"1f954","\uD83C\uDF09":"1f309","\uD83C\uDF0A":"1f30a","\uD83C\uDF0B":"1f30b","\uD83C\uDF0C":"1f30c","\uD83C\uDF0F":"1f30f","\uD83C\uDF11":"1f311","\uD83E\uDD53":"1f953","\uD83C\uDF13":"1f313","\uD83C\uDF14":"1f314","\uD83C\uDF15":"1f315","\uD83C\uDF19":"1f319","\uD83C\uDF1B":"1f31b","\uD83C\uDF1F":"1f31f","\uD83E\uDD52":"1f952","\uD83C\uDF20":"1f320","\uD83C\uDF30":"1f330","\uD83E\uDD51":"1f951","\uD83C\uDF31":"1f331","\uD83C\uDF34":"1f334","\uD83C\uDF35":"1f335","\uD83C\uDF37":"1f337","\uD83C\uDF38":"1f338","\uD83C\uDF39":"1f339","\uD83C\uDF3A":"1f33a","\uD83C\uDF3B":"1f33b","\uD83C\uDF3C":"1f33c","\uD83C\uDF3D":"1f33d","\uD83E\uDD50":"1f950","\uD83C\uDF3E":"1f33e","\uD83C\uDF3F":"1f33f","\uD83C\uDF40":"1f340","\uD83C\uDF41":"1f341","\uD83C\uDF42":"1f342","\uD83C\uDF43":"1f343","\uD83C\uDF44":"1f344","\uD83C\uDF45":"1f345","\uD83C\uDF46":"1f346","\uD83C\uDF47":"1f347","\uD83C\uDF48":"1f348","\uD83C\uDF49":"1f349","\uD83C\uDF4A":"1f34a","\uD83E\uDD40":"1f940","\uD83C\uDF4C":"1f34c","\uD83C\uDF4D":"1f34d","\uD83C\uDF4E":"1f34e","\uD83C\uDF4F":"1f34f","\uD83C\uDF51":"1f351","\uD83C\uDF52":"1f352","\uD83C\uDF53":"1f353","\uD83E\uDD8F":"1f98f","\uD83C\uDF54":"1f354","\uD83C\uDF55":"1f355","\uD83C\uDF56":"1f356","\uD83E\uDD8E":"1f98e","\uD83C\uDF57":"1f357","\uD83C\uDF58":"1f358","\uD83C\uDF59":"1f359","\uD83E\uDD8D":"1f98d","\uD83C\uDF5A":"1f35a","\uD83C\uDF5B":"1f35b","\uD83E\uDD8C":"1f98c","\uD83C\uDF5C":"1f35c","\uD83C\uDF5D":"1f35d","\uD83C\uDF5E":"1f35e","\uD83C\uDF5F":"1f35f","\uD83E\uDD8B":"1f98b","\uD83C\uDF60":"1f360","\uD83C\uDF61":"1f361","\uD83E\uDD8A":"1f98a","\uD83C\uDF62":"1f362","\uD83C\uDF63":"1f363","\uD83E\uDD89":"1f989","\uD83C\uDF64":"1f364","\uD83C\uDF65":"1f365","\uD83E\uDD88":"1f988","\uD83C\uDF66":"1f366","\uD83E\uDD87":"1f987","\uD83C\uDF67":"1f367","\uD83C\uDDFD":"1f1fd","\uD83C\uDF68":"1f368","\uD83E\uDD86":"1f986","\uD83C\uDF69":"1f369","\uD83E\uDD85":"1f985","\uD83C\uDF6A":"1f36a","\uD83D\uDDA4":"1f5a4","\uD83C\uDF6B":"1f36b","\uD83C\uDF6C":"1f36c","\uD83C\uDF6D":"1f36d","\uD83C\uDF6E":"1f36e","\uD83C\uDF6F":"1f36f","\uD83E\uDD1E":"1f91e","\uD83C\uDF70":"1f370","\uD83C\uDF71":"1f371","\uD83C\uDF72":"1f372","\uD83E\uDD1D":"1f91d","\uD83C\uDF73":"1f373","\uD83C\uDF74":"1f374","\uD83C\uDF75":"1f375","\uD83C\uDF76":"1f376","\uD83C\uDF77":"1f377","\uD83C\uDF78":"1f378","\uD83C\uDF79":"1f379","\uD83C\uDF7A":"1f37a","\uD83C\uDF7B":"1f37b","\uD83C\uDF80":"1f380","\uD83C\uDF81":"1f381","\uD83C\uDF82":"1f382","\uD83C\uDF83":"1f383","\uD83E\uDD1B":"1f91b","\uD83E\uDD1C":"1f91c","\uD83C\uDF84":"1f384","\uD83C\uDF85":"1f385","\uD83C\uDF86":"1f386","\uD83E\uDD1A":"1f91a","\uD83C\uDF87":"1f387","\uD83C\uDF88":"1f388","\uD83C\uDF89":"1f389","\uD83C\uDF8A":"1f38a","\uD83C\uDF8B":"1f38b","\uD83C\uDF8C":"1f38c","\uD83E\uDD19":"1f919","\uD83C\uDF8D":"1f38d","\uD83D\uDD7A":"1f57a","\uD83C\uDF8E":"1f38e","\uD83E\uDD33":"1f933","\uD83C\uDF8F":"1f38f","\uD83E\uDD30":"1f930","\uD83C\uDF90":"1f390","\uD83E\uDD26":"1f926","\uD83E\uDD37":"1f937","\uD83C\uDF91":"1f391","\uD83C\uDF92":"1f392","\uD83C\uDF93":"1f393","\uD83C\uDFA0":"1f3a0","\uD83C\uDFA1":"1f3a1","\uD83C\uDFA2":"1f3a2","\uD83C\uDFA3":"1f3a3","\uD83C\uDFA4":"1f3a4","\uD83C\uDFA5":"1f3a5","\uD83C\uDFA6":"1f3a6","\uD83C\uDFA7":"1f3a7","\uD83E\uDD36":"1f936","\uD83C\uDFA8":"1f3a8","\uD83E\uDD35":"1f935","\uD83C\uDFA9":"1f3a9","\uD83C\uDFAA":"1f3aa","\uD83E\uDD34":"1f934","\uD83C\uDFAB":"1f3ab","\uD83C\uDFAC":"1f3ac","\uD83C\uDFAD":"1f3ad","\uD83E\uDD27":"1f927","\uD83C\uDFAE":"1f3ae","\uD83C\uDFAF":"1f3af","\uD83C\uDFB0":"1f3b0","\uD83C\uDFB1":"1f3b1","\uD83C\uDFB2":"1f3b2","\uD83C\uDFB3":"1f3b3","\uD83C\uDFB4":"1f3b4","\uD83E\uDD25":"1f925","\uD83C\uDFB5":"1f3b5","\uD83C\uDFB6":"1f3b6","\uD83C\uDFB7":"1f3b7","\uD83E\uDD24":"1f924","\uD83C\uDFB8":"1f3b8","\uD83C\uDFB9":"1f3b9","\uD83C\uDFBA":"1f3ba","\uD83E\uDD23":"1f923","\uD83C\uDFBB":"1f3bb","\uD83C\uDFBC":"1f3bc","\uD83C\uDFBD":"1f3bd","\uD83E\uDD22":"1f922","\uD83C\uDFBE":"1f3be","\uD83C\uDFBF":"1f3bf","\uD83C\uDFC0":"1f3c0","\uD83C\uDFC1":"1f3c1","\uD83E\uDD21":"1f921","\uD83C\uDFC2":"1f3c2","\uD83C\uDFC3":"1f3c3","\uD83C\uDFC4":"1f3c4","\uD83C\uDFC6":"1f3c6","\uD83C\uDFC8":"1f3c8","\uD83C\uDFCA":"1f3ca","\uD83C\uDFE0":"1f3e0","\uD83C\uDFE1":"1f3e1","\uD83C\uDFE2":"1f3e2","\uD83C\uDFE3":"1f3e3","\uD83C\uDFE5":"1f3e5","\uD83C\uDFE6":"1f3e6","\uD83C\uDFE7":"1f3e7","\uD83C\uDFE8":"1f3e8","\uD83C\uDFE9":"1f3e9","\uD83C\uDFEA":"1f3ea","\uD83C\uDFEB":"1f3eb","\uD83C\uDFEC":"1f3ec","\uD83E\uDD20":"1f920","\uD83C\uDFED":"1f3ed","\uD83C\uDFEE":"1f3ee","\uD83C\uDFEF":"1f3ef","\uD83C\uDFF0":"1f3f0","\uD83D\uDC0C":"1f40c","\uD83D\uDC0D":"1f40d","\uD83D\uDC0E":"1f40e","\uD83D\uDC11":"1f411","\uD83D\uDC12":"1f412","\uD83D\uDC14":"1f414","\uD83D\uDC17":"1f417","\uD83D\uDC18":"1f418","\uD83D\uDC19":"1f419","\uD83D\uDC1A":"1f41a","\uD83D\uDC1B":"1f41b","\uD83D\uDC1C":"1f41c","\uD83D\uDC1D":"1f41d","\uD83D\uDC1E":"1f41e","\uD83D\uDC1F":"1f41f","\uD83D\uDC20":"1f420","\uD83D\uDC21":"1f421","\uD83D\uDC22":"1f422","\uD83D\uDC23":"1f423","\uD83D\uDC24":"1f424","\uD83D\uDC25":"1f425","\uD83D\uDC26":"1f426","\uD83D\uDC27":"1f427","\uD83D\uDC28":"1f428","\uD83D\uDC29":"1f429","\uD83D\uDC2B":"1f42b","\uD83D\uDC2C":"1f42c","\uD83D\uDC2D":"1f42d","\uD83D\uDC2E":"1f42e","\uD83D\uDC2F":"1f42f","\uD83D\uDC30":"1f430","\uD83D\uDC31":"1f431","\uD83D\uDC32":"1f432","\uD83D\uDC33":"1f433","\uD83D\uDC34":"1f434","\uD83D\uDC35":"1f435","\uD83D\uDC36":"1f436","\uD83D\uDC37":"1f437","\uD83D\uDC38":"1f438","\uD83D\uDC39":"1f439","\uD83D\uDC3A":"1f43a","\uD83D\uDC3B":"1f43b","\uD83D\uDC3C":"1f43c","\uD83D\uDC3D":"1f43d","\uD83D\uDC3E":"1f43e","\uD83D\uDC40":"1f440","\uD83D\uDC42":"1f442","\uD83D\uDC43":"1f443","\uD83D\uDC44":"1f444","\uD83D\uDC45":"1f445","\uD83D\uDC46":"1f446","\uD83D\uDC47":"1f447","\uD83D\uDC48":"1f448","\uD83D\uDC49":"1f449","\uD83D\uDC4A":"1f44a","\uD83D\uDC4B":"1f44b","\uD83D\uDC4C":"1f44c","\uD83D\uDC4D":"1f44d","\uD83D\uDC4E":"1f44e","\uD83D\uDC4F":"1f44f","\uD83D\uDC50":"1f450","\uD83D\uDC51":"1f451","\uD83D\uDC52":"1f452","\uD83D\uDC53":"1f453","\uD83D\uDC54":"1f454","\uD83D\uDC55":"1f455","\uD83D\uDC56":"1f456","\uD83D\uDC57":"1f457","\uD83D\uDC58":"1f458","\uD83D\uDC59":"1f459","\uD83D\uDC5A":"1f45a","\uD83D\uDC5B":"1f45b","\uD83D\uDC5C":"1f45c","\uD83D\uDC5D":"1f45d","\uD83D\uDC5E":"1f45e","\uD83D\uDC5F":"1f45f","\uD83D\uDC60":"1f460","\uD83D\uDC61":"1f461","\uD83D\uDC62":"1f462","\uD83D\uDC63":"1f463","\uD83D\uDC64":"1f464","\uD83D\uDC66":"1f466","\uD83D\uDC67":"1f467","\uD83D\uDC68":"1f468","\uD83D\uDC69":"1f469","\uD83D\uDC6A":"1f46a","\uD83D\uDC6B":"1f46b","\uD83D\uDC6E":"1f46e","\uD83D\uDC6F":"1f46f","\uD83D\uDC70":"1f470","\uD83D\uDC71":"1f471","\uD83D\uDC72":"1f472","\uD83D\uDC73":"1f473","\uD83D\uDC74":"1f474","\uD83D\uDC75":"1f475","\uD83D\uDC76":"1f476","\uD83D\uDC77":"1f477","\uD83D\uDC78":"1f478","\uD83D\uDC79":"1f479","\uD83D\uDC7A":"1f47a","\uD83D\uDC7B":"1f47b","\uD83D\uDC7C":"1f47c","\uD83D\uDC7D":"1f47d","\uD83D\uDC7E":"1f47e","\uD83D\uDC7F":"1f47f","\uD83D\uDC80":"1f480","\uD83D\uDCC7":"1f4c7","\uD83D\uDC81":"1f481","\uD83D\uDC82":"1f482","\uD83D\uDC83":"1f483","\uD83D\uDC84":"1f484","\uD83D\uDC85":"1f485","\uD83D\uDCD2":"1f4d2","\uD83D\uDC86":"1f486","\uD83D\uDCD3":"1f4d3","\uD83D\uDC87":"1f487","\uD83D\uDCD4":"1f4d4","\uD83D\uDC88":"1f488","\uD83D\uDCD5":"1f4d5","\uD83D\uDC89":"1f489","\uD83D\uDCD6":"1f4d6","\uD83D\uDC8A":"1f48a","\uD83D\uDCD7":"1f4d7","\uD83D\uDC8B":"1f48b","\uD83D\uDCD8":"1f4d8","\uD83D\uDC8C":"1f48c","\uD83D\uDCD9":"1f4d9","\uD83D\uDC8D":"1f48d","\uD83D\uDCDA":"1f4da","\uD83D\uDC8E":"1f48e","\uD83D\uDCDB":"1f4db","\uD83D\uDC8F":"1f48f","\uD83D\uDCDC":"1f4dc","\uD83D\uDC90":"1f490","\uD83D\uDCDD":"1f4dd","\uD83D\uDC91":"1f491","\uD83D\uDCDE":"1f4de","\uD83D\uDC92":"1f492","\uD83D\uDCDF":"1f4df","\uD83D\uDCE0":"1f4e0","\uD83D\uDC93":"1f493","\uD83D\uDCE1":"1f4e1","\uD83D\uDCE2":"1f4e2","\uD83D\uDC94":"1f494","\uD83D\uDCE3":"1f4e3","\uD83D\uDCE4":"1f4e4","\uD83D\uDC95":"1f495","\uD83D\uDCE5":"1f4e5","\uD83D\uDCE6":"1f4e6","\uD83D\uDC96":"1f496","\uD83D\uDCE7":"1f4e7","\uD83D\uDCE8":"1f4e8","\uD83D\uDC97":"1f497","\uD83D\uDCE9":"1f4e9","\uD83D\uDCEA":"1f4ea","\uD83D\uDC98":"1f498","\uD83D\uDCEB":"1f4eb","\uD83D\uDCEE":"1f4ee","\uD83D\uDC99":"1f499","\uD83D\uDCF0":"1f4f0","\uD83D\uDCF1":"1f4f1","\uD83D\uDC9A":"1f49a","\uD83D\uDCF2":"1f4f2","\uD83D\uDCF3":"1f4f3","\uD83D\uDC9B":"1f49b","\uD83D\uDCF4":"1f4f4","\uD83D\uDCF6":"1f4f6","\uD83D\uDC9C":"1f49c","\uD83D\uDCF7":"1f4f7","\uD83D\uDCF9":"1f4f9","\uD83D\uDC9D":"1f49d","\uD83D\uDCFA":"1f4fa","\uD83D\uDCFB":"1f4fb","\uD83D\uDC9E":"1f49e","\uD83D\uDCFC":"1f4fc","\uD83D\uDD03":"1f503","\uD83D\uDC9F":"1f49f","\uD83D\uDD0A":"1f50a","\uD83D\uDD0B":"1f50b","\uD83D\uDCA0":"1f4a0","\uD83D\uDD0C":"1f50c","\uD83D\uDD0D":"1f50d","\uD83D\uDCA1":"1f4a1","\uD83D\uDD0E":"1f50e","\uD83D\uDD0F":"1f50f","\uD83D\uDCA2":"1f4a2","\uD83D\uDD10":"1f510","\uD83D\uDD11":"1f511","\uD83D\uDCA3":"1f4a3","\uD83D\uDD12":"1f512","\uD83D\uDD13":"1f513","\uD83D\uDCA4":"1f4a4","\uD83D\uDD14":"1f514","\uD83D\uDD16":"1f516","\uD83D\uDCA5":"1f4a5","\uD83D\uDD17":"1f517","\uD83D\uDD18":"1f518","\uD83D\uDCA6":"1f4a6","\uD83D\uDD19":"1f519","\uD83D\uDD1A":"1f51a","\uD83D\uDCA7":"1f4a7","\uD83D\uDD1B":"1f51b","\uD83D\uDD1C":"1f51c","\uD83D\uDCA8":"1f4a8","\uD83D\uDD1D":"1f51d","\uD83D\uDD1E":"1f51e","\uD83D\uDCA9":"1f4a9","\uD83D\uDD1F":"1f51f","\uD83D\uDCAA":"1f4aa","\uD83D\uDD20":"1f520","\uD83D\uDD21":"1f521","\uD83D\uDCAB":"1f4ab","\uD83D\uDD22":"1f522","\uD83D\uDD23":"1f523","\uD83D\uDCAC":"1f4ac","\uD83D\uDD24":"1f524","\uD83D\uDD25":"1f525","\uD83D\uDCAE":"1f4ae","\uD83D\uDD26":"1f526","\uD83D\uDD27":"1f527","\uD83D\uDCAF":"1f4af","\uD83D\uDD28":"1f528","\uD83D\uDD29":"1f529","\uD83D\uDCB0":"1f4b0","\uD83D\uDD2A":"1f52a","\uD83D\uDD2B":"1f52b","\uD83D\uDCB1":"1f4b1","\uD83D\uDD2E":"1f52e","\uD83D\uDCB2":"1f4b2","\uD83D\uDD2F":"1f52f","\uD83D\uDCB3":"1f4b3","\uD83D\uDD30":"1f530","\uD83D\uDD31":"1f531","\uD83D\uDCB4":"1f4b4","\uD83D\uDD32":"1f532","\uD83D\uDD33":"1f533","\uD83D\uDCB5":"1f4b5","\uD83D\uDD34":"1f534","\uD83D\uDD35":"1f535","\uD83D\uDCB8":"1f4b8","\uD83D\uDD36":"1f536","\uD83D\uDD37":"1f537","\uD83D\uDCB9":"1f4b9","\uD83D\uDD38":"1f538","\uD83D\uDD39":"1f539","\uD83D\uDCBA":"1f4ba","\uD83D\uDD3A":"1f53a","\uD83D\uDD3B":"1f53b","\uD83D\uDCBB":"1f4bb","\uD83D\uDD3C":"1f53c","\uD83D\uDCBC":"1f4bc","\uD83D\uDD3D":"1f53d","\uD83D\uDD50":"1f550","\uD83D\uDCBD":"1f4bd","\uD83D\uDD51":"1f551","\uD83D\uDCBE":"1f4be","\uD83D\uDD52":"1f552","\uD83D\uDCBF":"1f4bf","\uD83D\uDD53":"1f553","\uD83D\uDCC0":"1f4c0","\uD83D\uDD54":"1f554","\uD83D\uDD55":"1f555","\uD83D\uDCC1":"1f4c1","\uD83D\uDD56":"1f556","\uD83D\uDD57":"1f557","\uD83D\uDCC2":"1f4c2","\uD83D\uDD58":"1f558","\uD83D\uDD59":"1f559","\uD83D\uDCC3":"1f4c3","\uD83D\uDD5A":"1f55a","\uD83D\uDD5B":"1f55b","\uD83D\uDCC4":"1f4c4","\uD83D\uDDFB":"1f5fb","\uD83D\uDDFC":"1f5fc","\uD83D\uDCC5":"1f4c5","\uD83D\uDDFD":"1f5fd","\uD83D\uDDFE":"1f5fe","\uD83D\uDCC6":"1f4c6","\uD83D\uDDFF":"1f5ff","\uD83D\uDE01":"1f601","\uD83D\uDE02":"1f602","\uD83D\uDE03":"1f603","\uD83D\uDCC8":"1f4c8","\uD83D\uDE04":"1f604","\uD83D\uDE05":"1f605","\uD83D\uDCC9":"1f4c9","\uD83D\uDE06":"1f606","\uD83D\uDE09":"1f609","\uD83D\uDCCA":"1f4ca","\uD83D\uDE0A":"1f60a","\uD83D\uDE0B":"1f60b","\uD83D\uDCCB":"1f4cb","\uD83D\uDE0C":"1f60c","\uD83D\uDE0D":"1f60d","\uD83D\uDCCC":"1f4cc","\uD83D\uDE0F":"1f60f","\uD83D\uDE12":"1f612","\uD83D\uDCCD":"1f4cd","\uD83D\uDE13":"1f613","\uD83D\uDE14":"1f614","\uD83D\uDCCE":"1f4ce","\uD83D\uDE16":"1f616","\uD83D\uDE18":"1f618","\uD83D\uDCCF":"1f4cf","\uD83D\uDE1A":"1f61a","\uD83D\uDE1C":"1f61c","\uD83D\uDCD0":"1f4d0","\uD83D\uDE1D":"1f61d","\uD83D\uDE1E":"1f61e","\uD83D\uDCD1":"1f4d1","\uD83D\uDE20":"1f620","\uD83D\uDE21":"1f621","\uD83D\uDE22":"1f622","\uD83D\uDE23":"1f623","\uD83D\uDE24":"1f624","\uD83D\uDE25":"1f625","\uD83D\uDE28":"1f628","\uD83D\uDE29":"1f629","\uD83D\uDE2A":"1f62a","\uD83D\uDE2B":"1f62b","\uD83D\uDE2D":"1f62d","\uD83D\uDE30":"1f630","\uD83D\uDE31":"1f631","\uD83D\uDE32":"1f632","\uD83D\uDE33":"1f633","\uD83D\uDE35":"1f635","\uD83D\uDE37":"1f637","\uD83D\uDE38":"1f638","\uD83D\uDE39":"1f639","\uD83D\uDE3A":"1f63a","\uD83D\uDE3B":"1f63b","\uD83D\uDE3C":"1f63c","\uD83D\uDE3D":"1f63d","\uD83D\uDE3E":"1f63e","\uD83D\uDE3F":"1f63f","\uD83D\uDE40":"1f640","\uD83D\uDE45":"1f645","\uD83D\uDE46":"1f646","\uD83D\uDE47":"1f647","\uD83D\uDE48":"1f648","\uD83D\uDE49":"1f649","\uD83D\uDE4A":"1f64a","\uD83D\uDE4B":"1f64b","\uD83D\uDE4C":"1f64c","\uD83D\uDE4D":"1f64d","\uD83D\uDE4E":"1f64e","\uD83D\uDE4F":"1f64f","\uD83D\uDE80":"1f680","\uD83D\uDE83":"1f683","\uD83D\uDE84":"1f684","\uD83D\uDE85":"1f685","\uD83D\uDE87":"1f687","\uD83D\uDE89":"1f689","\uD83D\uDE8C":"1f68c","\uD83D\uDE8F":"1f68f","\uD83D\uDE91":"1f691","\uD83D\uDE92":"1f692","\uD83D\uDE93":"1f693","\uD83D\uDE95":"1f695","\uD83D\uDE97":"1f697","\uD83D\uDE99":"1f699","\uD83D\uDE9A":"1f69a","\uD83D\uDEA2":"1f6a2","\uD83D\uDEA4":"1f6a4","\uD83D\uDEA5":"1f6a5","\uD83D\uDEA7":"1f6a7","\uD83D\uDEA8":"1f6a8","\uD83D\uDEA9":"1f6a9","\uD83D\uDEAA":"1f6aa","\uD83D\uDEAB":"1f6ab","\uD83D\uDEAC":"1f6ac","\uD83D\uDEAD":"1f6ad","\uD83D\uDEB2":"1f6b2","\uD83D\uDEB6":"1f6b6","\uD83D\uDEB9":"1f6b9","\uD83D\uDEBA":"1f6ba","\uD83D\uDEBB":"1f6bb","\uD83D\uDEBC":"1f6bc","\uD83D\uDEBD":"1f6bd","\uD83D\uDEBE":"1f6be","\uD83D\uDEC0":"1f6c0","\uD83E\uDD18":"1f918","\uD83D\uDE00":"1f600","\uD83D\uDE07":"1f607","\uD83D\uDE08":"1f608","\uD83D\uDE0E":"1f60e","\uD83D\uDE10":"1f610","\uD83D\uDE11":"1f611","\uD83D\uDE15":"1f615","\uD83D\uDE17":"1f617","\uD83D\uDE19":"1f619","\uD83D\uDE1B":"1f61b","\uD83D\uDE1F":"1f61f","\uD83D\uDE26":"1f626","\uD83D\uDE27":"1f627","\uD83D\uDE2C":"1f62c","\uD83D\uDE2E":"1f62e","\uD83D\uDE2F":"1f62f","\uD83D\uDE34":"1f634","\uD83D\uDE36":"1f636","\uD83D\uDE81":"1f681","\uD83D\uDE82":"1f682","\uD83D\uDE86":"1f686","\uD83D\uDE88":"1f688","\uD83D\uDE8A":"1f68a","\uD83D\uDE8D":"1f68d","\uD83D\uDE8E":"1f68e","\uD83D\uDE90":"1f690","\uD83D\uDE94":"1f694","\uD83D\uDE96":"1f696","\uD83D\uDE98":"1f698","\uD83D\uDE9B":"1f69b","\uD83D\uDE9C":"1f69c","\uD83D\uDE9D":"1f69d","\uD83D\uDE9E":"1f69e","\uD83D\uDE9F":"1f69f","\uD83D\uDEA0":"1f6a0","\uD83D\uDEA1":"1f6a1","\uD83D\uDEA3":"1f6a3","\uD83D\uDEA6":"1f6a6","\uD83D\uDEAE":"1f6ae","\uD83D\uDEAF":"1f6af","\uD83D\uDEB0":"1f6b0","\uD83D\uDEB1":"1f6b1","\uD83D\uDEB3":"1f6b3","\uD83D\uDEB4":"1f6b4","\uD83D\uDEB5":"1f6b5","\uD83D\uDEB7":"1f6b7","\uD83D\uDEB8":"1f6b8","\uD83D\uDEBF":"1f6bf","\uD83D\uDEC1":"1f6c1","\uD83D\uDEC2":"1f6c2","\uD83D\uDEC3":"1f6c3","\uD83D\uDEC4":"1f6c4","\uD83D\uDEC5":"1f6c5","\uD83C\uDF0D":"1f30d","\uD83C\uDF0E":"1f30e","\uD83C\uDF10":"1f310","\uD83C\uDF12":"1f312","\uD83C\uDF16":"1f316","\uD83C\uDF17":"1f317","\uD83C\uDF18":"1f318","\uD83C\uDF1A":"1f31a","\uD83C\uDF1C":"1f31c","\uD83C\uDF1D":"1f31d","\uD83C\uDF1E":"1f31e","\uD83C\uDF32":"1f332","\uD83C\uDF33":"1f333","\uD83C\uDF4B":"1f34b","\uD83C\uDF50":"1f350","\uD83C\uDF7C":"1f37c","\uD83C\uDFC7":"1f3c7","\uD83C\uDFC9":"1f3c9","\uD83C\uDFE4":"1f3e4","\uD83D\uDC00":"1f400","\uD83D\uDC01":"1f401","\uD83D\uDC02":"1f402","\uD83D\uDC03":"1f403","\uD83D\uDC04":"1f404","\uD83D\uDC05":"1f405","\uD83D\uDC06":"1f406","\uD83D\uDC07":"1f407","\uD83D\uDC08":"1f408","\uD83D\uDC09":"1f409","\uD83D\uDC0A":"1f40a","\uD83D\uDC0B":"1f40b","\uD83D\uDC0F":"1f40f","\uD83D\uDC10":"1f410","\uD83D\uDC13":"1f413","\uD83D\uDC15":"1f415","\uD83D\uDC16":"1f416","\uD83D\uDC2A":"1f42a","\uD83D\uDC65":"1f465","\uD83D\uDC6C":"1f46c","\uD83D\uDC6D":"1f46d","\uD83D\uDCAD":"1f4ad","\uD83D\uDCB6":"1f4b6","\uD83D\uDCB7":"1f4b7","\uD83D\uDCEC":"1f4ec","\uD83D\uDCED":"1f4ed","\uD83D\uDCEF":"1f4ef","\uD83D\uDCF5":"1f4f5","\uD83D\uDD00":"1f500","\uD83D\uDD01":"1f501","\uD83D\uDD02":"1f502","\uD83D\uDD04":"1f504","\uD83D\uDD05":"1f505","\uD83D\uDD06":"1f506","\uD83D\uDD07":"1f507","\uD83D\uDD09":"1f509","\uD83D\uDD15":"1f515","\uD83D\uDD2C":"1f52c","\uD83D\uDD2D":"1f52d","\uD83D\uDD5C":"1f55c","\uD83D\uDD5D":"1f55d","\uD83D\uDD5E":"1f55e","\uD83D\uDD5F":"1f55f","\uD83D\uDD60":"1f560","\uD83D\uDD61":"1f561","\uD83D\uDD62":"1f562","\uD83D\uDD63":"1f563","\uD83D\uDD64":"1f564","\uD83D\uDD65":"1f565","\uD83D\uDD66":"1f566","\uD83D\uDD67":"1f567","\uD83D\uDD08":"1f508","\uD83D\uDE8B":"1f68b","\uD83C\uDFC5":"1f3c5","\uD83C\uDFF4":"1f3f4","\uD83D\uDCF8":"1f4f8","\uD83D\uDECC":"1f6cc","\uD83D\uDD95":"1f595","\uD83D\uDD96":"1f596","\uD83D\uDE41":"1f641","\uD83D\uDE42":"1f642","\uD83D\uDEEB":"1f6eb","\uD83D\uDEEC":"1f6ec","\uD83C\uDFFB":"1f3fb","\uD83C\uDFFC":"1f3fc","\uD83C\uDFFD":"1f3fd","\uD83C\uDFFE":"1f3fe","\uD83C\uDFFF":"1f3ff","\uD83D\uDE43":"1f643","\uD83E\uDD11":"1f911","\uD83E\uDD13":"1f913","\uD83E\uDD17":"1f917","\uD83D\uDE44":"1f644","\uD83E\uDD14":"1f914","\uD83E\uDD10":"1f910","\uD83E\uDD12":"1f912","\uD83E\uDD15":"1f915","\uD83E\uDD16":"1f916","\uD83E\uDD81":"1f981","\uD83E\uDD84":"1f984","\uD83E\uDD82":"1f982","\uD83E\uDD80":"1f980","\uD83E\uDD83":"1f983","\uD83E\uDDC0":"1f9c0","\uD83C\uDF2D":"1f32d","\uD83C\uDF2E":"1f32e","\uD83C\uDF2F":"1f32f","\uD83C\uDF7F":"1f37f","\uD83C\uDF7E":"1f37e","\uD83C\uDFF9":"1f3f9","\uD83C\uDFFA":"1f3fa","\uD83D\uDED0":"1f6d0","\uD83D\uDD4B":"1f54b","\uD83D\uDD4C":"1f54c","\uD83D\uDD4D":"1f54d","\uD83D\uDD4E":"1f54e","\uD83D\uDCFF":"1f4ff","\uD83C\uDFCF":"1f3cf","\uD83C\uDFD0":"1f3d0","\uD83C\uDFD1":"1f3d1","\uD83C\uDFD2":"1f3d2","\uD83C\uDFD3":"1f3d3","\uD83C\uDFF8":"1f3f8","\uD83E\uDD41":"1f941","\uD83E\uDD90":"1f990","\uD83E\uDD91":"1f991","\uD83E\uDD5A":"1f95a","\uD83E\uDD5B":"1f95b","\uD83E\uDD5C":"1f95c","\uD83E\uDD5D":"1f95d","\uD83E\uDD5E":"1f95e","\uD83C\uDDFC":"1f1fc","\uD83C\uDDFB":"1f1fb","\uD83C\uDDFA":"1f1fa","\uD83C\uDDF9":"1f1f9","\uD83C\uDDF8":"1f1f8","\uD83C\uDDF7":"1f1f7","\uD83C\uDDF6":"1f1f6","\uD83C\uDDF5":"1f1f5","\uD83C\uDDF4":"1f1f4","\uD83C\uDDF3":"1f1f3","\uD83C\uDDF2":"1f1f2","\uD83C\uDDF1":"1f1f1","\uD83C\uDDF0":"1f1f0","\uD83C\uDDEF":"1f1ef","\uD83C\uDDEE":"1f1ee","\uD83C\uDDED":"1f1ed","\uD83C\uDDEC":"1f1ec","\uD83C\uDDEB":"1f1eb","\uD83C\uDDEA":"1f1ea","\uD83C\uDDE9":"1f1e9","\uD83C\uDDE8":"1f1e8","\uD83C\uDDE7":"1f1e7","\uD83C\uDDE6":"1f1e6","\u23E9":"23e9","\u23EA":"23ea","\u23EB":"23eb","\u23EC":"23ec","\u23F0":"23f0","\u23F3":"23f3","*":"002a","\u26CE":"26ce","\u2705":"2705","\u270A":"270a","\u270B":"270b","\u2728":"2728","\u274C":"274c","\u274E":"274e","\u2753":"2753","\u2754":"2754","\u2755":"2755","\u2795":"2795","\u2796":"2796","\u2797":"2797","\u27B0":"27b0","#":"0023","\u27BF":"27bf","9":"0039","8":"0038","7":"0037","6":"0036","5":"0035","4":"0034","3":"0033","2":"0032","1":"0031","0":"0030","\u00A9":"00a9","\u00AE":"00ae","\u203C":"203c","\u2049":"2049","\u2122":"2122","\u2139":"2139","\u2194":"2194","\u2195":"2195","\u2196":"2196","\u2197":"2197","\u2198":"2198","\u2199":"2199","\u21A9":"21a9","\u21AA":"21aa","\u231A":"231a","\u231B":"231b","\u24C2":"24c2","\u25AA":"25aa","\u25AB":"25ab","\u25B6":"25b6","\u25C0":"25c0","\u25FB":"25fb","\u25FC":"25fc","\u25FD":"25fd","\u25FE":"25fe","\u2600":"2600","\u2601":"2601","\u260E":"260e","\u2611":"2611","\u2614":"2614","\u2615":"2615","\u261D":"261d","\u263A":"263a","\u2648":"2648","\u2649":"2649","\u264A":"264a","\u264B":"264b","\u264C":"264c","\u264D":"264d","\u264E":"264e","\u264F":"264f","\u2650":"2650","\u2651":"2651","\u2652":"2652","\u2653":"2653","\u2660":"2660","\u2663":"2663","\u2665":"2665","\u2666":"2666","\u2668":"2668","\u267B":"267b","\u267F":"267f","\u2693":"2693","\u26A0":"26a0","\u26A1":"26a1","\u26AA":"26aa","\u26AB":"26ab","\u26BD":"26bd","\u26BE":"26be","\u26C4":"26c4","\u26C5":"26c5","\u26D4":"26d4","\u26EA":"26ea","\u26F2":"26f2","\u26F3":"26f3","\u26F5":"26f5","\u26FA":"26fa","\u26FD":"26fd","\u2702":"2702","\u2708":"2708","\u2709":"2709","\u270C":"270c","\u270F":"270f","\u2712":"2712","\u2714":"2714","\u2716":"2716","\u2733":"2733","\u2734":"2734","\u2744":"2744","\u2747":"2747","\u2757":"2757","\u2764":"2764","\u27A1":"27a1","\u2934":"2934","\u2935":"2935","\u2B05":"2b05","\u2B06":"2b06","\u2B07":"2b07","\u2B1B":"2b1b","\u2B1C":"2b1c","\u2B50":"2b50","\u2B55":"2b55","\u3030":"3030","\u303D":"303d","\u3297":"3297","\u3299":"3299","\uD83C\uDC04":"1f004","\uD83C\uDD7F":"1f17f","\uD83C\uDE02":"1f202","\uD83C\uDE1A":"1f21a","\uD83C\uDE2F":"1f22f","\uD83C\uDE37":"1f237","\uD83C\uDF9E":"1f39e","\uD83C\uDF9F":"1f39f","\uD83C\uDFCB":"1f3cb","\uD83C\uDFCC":"1f3cc","\uD83C\uDFCD":"1f3cd","\uD83C\uDFCE":"1f3ce","\uD83C\uDF96":"1f396","\uD83C\uDF97":"1f397","\uD83C\uDF36":"1f336","\uD83C\uDF27":"1f327","\uD83C\uDF28":"1f328","\uD83C\uDF29":"1f329","\uD83C\uDF2A":"1f32a","\uD83C\uDF2B":"1f32b","\uD83C\uDF2C":"1f32c","\uD83D\uDC3F":"1f43f","\uD83D\uDD77":"1f577","\uD83D\uDD78":"1f578","\uD83C\uDF21":"1f321","\uD83C\uDF99":"1f399","\uD83C\uDF9A":"1f39a","\uD83C\uDF9B":"1f39b","\uD83C\uDFF3":"1f3f3","\uD83C\uDFF5":"1f3f5","\uD83C\uDFF7":"1f3f7","\uD83D\uDCFD":"1f4fd","\u271D":"271d","\uD83D\uDD49":"1f549","\uD83D\uDD4A":"1f54a","\uD83D\uDD6F":"1f56f","\uD83D\uDD70":"1f570","\uD83D\uDD73":"1f573","\uD83D\uDD76":"1f576","\uD83D\uDD79":"1f579","\uD83D\uDD87":"1f587","\uD83D\uDD8A":"1f58a","\uD83D\uDD8B":"1f58b","\uD83D\uDD8C":"1f58c","\uD83D\uDD8D":"1f58d","\uD83D\uDDA5":"1f5a5","\uD83D\uDDA8":"1f5a8","\u2328":"2328","\uD83D\uDDB2":"1f5b2","\uD83D\uDDBC":"1f5bc","\uD83D\uDDC2":"1f5c2","\uD83D\uDDC3":"1f5c3","\uD83D\uDDC4":"1f5c4","\uD83D\uDDD1":"1f5d1","\uD83D\uDDD2":"1f5d2","\uD83D\uDDD3":"1f5d3","\uD83D\uDDDC":"1f5dc","\uD83D\uDDDD":"1f5dd","\uD83D\uDDDE":"1f5de","\uD83D\uDDE1":"1f5e1","\uD83D\uDDE3":"1f5e3","\uD83D\uDDE8":"1f5e8","\uD83D\uDDEF":"1f5ef","\uD83D\uDDF3":"1f5f3","\uD83D\uDDFA":"1f5fa","\uD83D\uDEE0":"1f6e0","\uD83D\uDEE1":"1f6e1","\uD83D\uDEE2":"1f6e2","\uD83D\uDEF0":"1f6f0","\uD83C\uDF7D":"1f37d","\uD83D\uDC41":"1f441","\uD83D\uDD74":"1f574","\uD83D\uDD75":"1f575","\u270D":"270d","\uD83D\uDD90":"1f590","\uD83C\uDFD4":"1f3d4","\uD83C\uDFD5":"1f3d5","\uD83C\uDFD6":"1f3d6","\uD83C\uDFD7":"1f3d7","\uD83C\uDFD8":"1f3d8","\uD83C\uDFD9":"1f3d9","\uD83C\uDFDA":"1f3da","\uD83C\uDFDB":"1f3db","\uD83C\uDFDC":"1f3dc","\uD83C\uDFDD":"1f3dd","\uD83C\uDFDE":"1f3de","\uD83C\uDFDF":"1f3df","\uD83D\uDECB":"1f6cb","\uD83D\uDECD":"1f6cd","\uD83D\uDECE":"1f6ce","\uD83D\uDECF":"1f6cf","\uD83D\uDEE3":"1f6e3","\uD83D\uDEE4":"1f6e4","\uD83D\uDEE5":"1f6e5","\uD83D\uDEE9":"1f6e9","\uD83D\uDEF3":"1f6f3","\u23CF":"23cf","\u23ED":"23ed","\u23EE":"23ee","\u23EF":"23ef","\u23F1":"23f1","\u23F2":"23f2","\u23F8":"23f8","\u23F9":"23f9","\u23FA":"23fa","\u2602":"2602","\u2603":"2603","\u2604":"2604","\u2618":"2618","\u2620":"2620","\u2622":"2622","\u2623":"2623","\u2626":"2626","\u262A":"262a","\u262E":"262e","\u262F":"262f","\u2638":"2638","\u2639":"2639","\u2692":"2692","\u2694":"2694","\u2696":"2696","\u2697":"2697","\u2699":"2699","\u269B":"269b","\u269C":"269c","\u26B0":"26b0","\u26B1":"26b1","\u26C8":"26c8","\u26CF":"26cf","\u26D1":"26d1","\u26D3":"26d3","\u26E9":"26e9","\u26F0":"26f0","\u26F1":"26f1","\u26F4":"26f4","\u26F7":"26f7","\u26F8":"26f8","\u26F9":"26f9","\u2721":"2721","\u2763":"2763","\uD83C\uDF24":"1f324","\uD83C\uDF25":"1f325","\uD83C\uDF26":"1f326","\uD83D\uDDB1":"1f5b1"};
    ns.imagePathPNG = '//cdn.jsdelivr.net/emojione/assets/png/';
    ns.imagePathSVG = '//cdn.jsdelivr.net/emojione/assets/svg/';
    ns.imagePathSVGSprites = './../assets/sprites/emojione.sprites.svg';
    ns.imageType = 'png'; // or svg
    ns.sprites = false; // if this is true then sprite markup will be used (if SVG image type is set then you must include the SVG sprite file locally)
    ns.unicodeAlt = true; // use the unicode char as the alt attribute (makes copy and pasting the resulting text better)
    ns.ascii = false; // change to true to convert ascii smileys
    ns.cacheBustParam = '?v=2.2.6'; // you can [optionally] modify this to force browsers to refresh their cache. it will be appended to the send of the filenames

    ns.regShortNames = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+ns.shortnames+")", "gi");
    ns.regAscii = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|((\\s|^)"+ns.asciiRegexp+"(?=\\s|$|[!,.?]))", "g");
    ns.regUnicode = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+ns.unicodeRegexp+")", "gi");

    ns.toImage = function(str) {
        str = ns.unicodeToImage(str);
        str = ns.shortnameToImage(str);
        return str;
    };

    // Uses toShort to transform all unicode into a standard shortname
    // then transforms the shortname into unicode
    // This is done for standardization when converting several unicode types
    ns.unifyUnicode = function(str) {
        str = ns.toShort(str);
        str = ns.shortnameToUnicode(str);
        return str;
    };

    // Replace shortnames (:wink:) with Ascii equivalents ( ;^) )
    // Useful for systems that dont support unicode nor images
    ns.shortnameToAscii = function(str) {
        var unicode,
        // something to keep in mind here is that array flip will destroy
        // half of the ascii text "emojis" because the unicode numbers are duplicated
        // this is ok for what it's being used for
            unicodeToAscii = ns.objectFlip(ns.asciiList);

        str = str.replace(ns.regShortNames, function(shortname) {
            if( (typeof shortname === 'undefined') || (shortname === '') || (!(shortname in ns.emojioneList)) ) {
                // if the shortname doesnt exist just return the entire match
                return shortname;
            }
            else {
                unicode = ns.emojioneList[shortname].unicode[ns.emojioneList[shortname].unicode.length-1];
                if(typeof unicodeToAscii[unicode] !== 'undefined') {
                    return unicodeToAscii[unicode];
                } else {
                    return shortname;
                }
            }
        });
        return str;
    };

    // will output unicode from shortname
    // useful for sending emojis back to mobile devices
    ns.shortnameToUnicode = function(str) {
        // replace regular shortnames first
        var unicode;
        str = str.replace(ns.regShortNames, function(shortname) {
            if( (typeof shortname === 'undefined') || (shortname === '') || (!(shortname in ns.emojioneList)) ) {
                // if the shortname doesnt exist just return the entire match
                return shortname;
            }
            unicode = ns.emojioneList[shortname].unicode[0].toUpperCase();
            return ns.convert(unicode);
        });

        // if ascii smileys are turned on, then we'll replace them!
        if (ns.ascii) {

            str = str.replace(ns.regAscii, function(entire, m1, m2, m3) {
                if( (typeof m3 === 'undefined') || (m3 === '') || (!(ns.unescapeHTML(m3) in ns.asciiList)) ) {
                    // if the shortname doesnt exist just return the entire match
                    return entire;
                }

                m3 = ns.unescapeHTML(m3);
                unicode = ns.asciiList[m3].toUpperCase();
                return m2+ns.convert(unicode);
            });
        }

        return str;
    };

    ns.shortnameToImage = function(str) {
        // replace regular shortnames first
        var replaceWith,unicode,alt;
        str = str.replace(ns.regShortNames, function(shortname) {
            if( (typeof shortname === 'undefined') || (shortname === '') || (!(shortname in ns.emojioneList)) ) {
                // if the shortname doesnt exist just return the entire match
                return shortname;
            }
            else {
                unicode = ns.emojioneList[shortname].unicode[ns.emojioneList[shortname].unicode.length-1];

                // depending on the settings, we'll either add the native unicode as the alt tag, otherwise the shortname
                alt = (ns.unicodeAlt) ? ns.convert(unicode.toUpperCase()) : shortname;

                if(ns.imageType === 'png') {
                    if(ns.sprites) {
                        replaceWith = '<span class="emojione emojione-'+unicode+'" title="'+shortname+'">'+alt+'</span>';
                    }
                    else {
                        replaceWith = '<img class="emojione" alt="'+alt+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
                    }
                }
                else {
                    // svg
                    if(ns.sprites) {
                        replaceWith = '<svg class="emojione"><description>'+alt+'</description><use xlink:href="'+ns.imagePathSVGSprites+'#emoji-'+unicode+'"></use></svg>';
                    }
                    else {
                        replaceWith = '<object class="emojione" data="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'" type="image/svg+xml" standby="'+alt+'">'+alt+'</object>';
                    }
                }

                return replaceWith;
            }
        });

        // if ascii smileys are turned on, then we'll replace them!
        if (ns.ascii) {

            str = str.replace(ns.regAscii, function(entire, m1, m2, m3) {
                if( (typeof m3 === 'undefined') || (m3 === '') || (!(ns.unescapeHTML(m3) in ns.asciiList)) ) {
                    // if the shortname doesnt exist just return the entire match
                    return entire;
                }

                m3 = ns.unescapeHTML(m3);
                unicode = ns.asciiList[m3];

                // depending on the settings, we'll either add the native unicode as the alt tag, otherwise the shortname
                alt = (ns.unicodeAlt) ? ns.convert(unicode.toUpperCase()) : ns.escapeHTML(m3);

                if(ns.imageType === 'png') {
                    if(ns.sprites) {
                        replaceWith = m2+'<span class="emojione emojione-'+unicode+'" title="'+ns.escapeHTML(m3)+'">'+alt+'</span>';
                    }
                    else {
                        replaceWith = m2+'<img class="emojione" alt="'+alt+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
                    }
                }
                else {
                    // svg
                    if(ns.sprites) {
                        replaceWith = '<svg class="emojione"><description>'+alt+'</description><use xlink:href="'+ns.imagePathSVGSprites+'#emoji-'+unicode+'"></use></svg>';
                    }
                    else {
                        replaceWith = m2+'<object class="emojione" data="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'" type="image/svg+xml" standby="'+alt+'">'+alt+'</object>';
                    }
                }

                return replaceWith;
            });
        }

        return str;
    };

    ns.unicodeToImage = function(str) {

        var replaceWith,unicode,alt;

        if((!ns.unicodeAlt) || (ns.sprites)) {
            // if we are using the shortname as the alt tag then we need a reversed array to map unicode code point to shortnames
            var mappedUnicode = ns.mapUnicodeToShort();
        }

        str = str.replace(ns.regUnicode, function(unicodeChar) {
            if( (typeof unicodeChar === 'undefined') || (unicodeChar === '') || (!(unicodeChar in ns.jsEscapeMap)) ) {
                // if the unicodeChar doesnt exist just return the entire match
                return unicodeChar;
            }
            else {
                // get the unicode codepoint from the actual char
                unicode = ns.jsEscapeMap[unicodeChar];

                // depending on the settings, we'll either add the native unicode as the alt tag, otherwise the shortname
                alt = (ns.unicodeAlt) ? ns.convert(unicode.toUpperCase()) : mappedUnicode[unicode];

                if(ns.imageType === 'png') {
                    if(ns.sprites) {
                        replaceWith = '<span class="emojione emojione-'+unicode+'" title="'+mappedUnicode[unicode]+'">'+alt+'</span>';
                    }
                    else {
                        replaceWith = '<img class="emojione" alt="'+alt+'" src="'+ns.imagePathPNG+unicode+'.png'+ns.cacheBustParam+'"/>';
                    }
                }
                else {
                    // svg
                    if(ns.sprites) {
                        replaceWith = '<svg class="emojione"><description>'+alt+'</description><use xlink:href="'+ns.imagePathSVGSprites+'#emoji-'+unicode+'"></use></svg>';
                    }
                    else {
                        replaceWith = '<img class="emojione" alt="'+alt+'" src="'+ns.imagePathSVG+unicode+'.svg'+ns.cacheBustParam+'"/>';
                    }
                }

                return replaceWith;
            }
        });

        return str;
    };

    // this is really just unicodeToShortname() but I opted for the shorthand name to match toImage()
    ns.toShort = function(str) {
        var find = ns.getUnicodeReplacementRegEx(),
            replacementList = ns.mapUnicodeCharactersToShort();
        return  ns.replaceAll(str, find,replacementList);
    };

    // for converting unicode code points and code pairs to their respective characters
    ns.convert = function(unicode) {
        if(unicode.indexOf("-") > -1) {
            var parts = [];
            var s = unicode.split('-');
            for(var i = 0; i < s.length; i++) {
                var part = parseInt(s[i], 16);
                if (part >= 0x10000 && part <= 0x10FFFF) {
                    var hi = Math.floor((part - 0x10000) / 0x400) + 0xD800;
                    var lo = ((part - 0x10000) % 0x400) + 0xDC00;
                    part = (String.fromCharCode(hi) + String.fromCharCode(lo));
                }
                else {
                    part = String.fromCharCode(part);
                }
                parts.push(part);
            }
            return parts.join('');
        }
        else {
            var s = parseInt(unicode, 16);
            if (s >= 0x10000 && s <= 0x10FFFF) {
                var hi = Math.floor((s - 0x10000) / 0x400) + 0xD800;
                var lo = ((s - 0x10000) % 0x400) + 0xDC00;
                return (String.fromCharCode(hi) + String.fromCharCode(lo));
            }
            else {
                return String.fromCharCode(s);
            }
        }
    };

    ns.escapeHTML = function (string) {
        var escaped = {
            '&' : '&amp;',
            '<' : '&lt;',
            '>' : '&gt;',
            '"' : '&quot;',
            '\'': '&#039;'
        };

        return string.replace(/[&<>"']/g, function (match) {
            return escaped[match];
        });
    };
    ns.unescapeHTML = function (string) {
        var unescaped = {
            '&amp;'  : '&',
            '&#38;'  : '&',
            '&#x26;' : '&',
            '&lt;'   : '<',
            '&#60;'  : '<',
            '&#x3C;' : '<',
            '&gt;'   : '>',
            '&#62;'  : '>',
            '&#x3E;' : '>',
            '&quot;' : '"',
            '&#34;'  : '"',
            '&#x22;' : '"',
            '&apos;' : '\'',
            '&#39;'  : '\'',
            '&#x27;' : '\''
        };

        return string.replace(/&(?:amp|#38|#x26|lt|#60|#x3C|gt|#62|#x3E|apos|#39|#x27|quot|#34|#x22);/ig, function (match) {
            return unescaped[match];
        });
    };

    ns.mapEmojioneList = function (addToMapStorage) {
        for (var shortname in ns.emojioneList) {
            if (!ns.emojioneList.hasOwnProperty(shortname)) { continue; }
            for (var i = 0, len = ns.emojioneList[shortname].unicode.length; i < len; i++) {
                var unicode = ns.emojioneList[shortname].unicode[i];
                addToMapStorage(unicode, shortname);
            }
        }
    };

    ns.mapUnicodeToShort = function() {
        if (!ns.memMapShortToUnicode) {
            ns.memMapShortToUnicode = {};
            ns.mapEmojioneList(function (unicode, shortname) {
                ns.memMapShortToUnicode[unicode] = shortname;
            });
        }
        return ns.memMapShortToUnicode;
    };

    ns.memoizeReplacement = function() {
        if (!ns.unicodeReplacementRegEx || !ns.memMapShortToUnicodeCharacters) {
            var unicodeList = [];
            ns.memMapShortToUnicodeCharacters = {};
            ns.mapEmojioneList(function (unicode, shortname) {
                var emojiCharacter = ns.convert(unicode);
                if(ns.emojioneList[shortname].isCanonical) {
                    ns.memMapShortToUnicodeCharacters[emojiCharacter] = shortname;
                }
                unicodeList.push(emojiCharacter);
            });
            ns.unicodeReplacementRegEx = unicodeList.join('|');
        }
    };

    ns.mapUnicodeCharactersToShort = function() {
        ns.memoizeReplacement();
        return ns.memMapShortToUnicodeCharacters;
    };

    ns.getUnicodeReplacementRegEx = function() {
        ns.memoizeReplacement();
        return ns.unicodeReplacementRegEx;
    };

    //reverse an object
    ns.objectFlip = function (obj) {
        var key, tmp_obj = {};

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                tmp_obj[obj[key]] = key;
            }
        }

        return tmp_obj;
    };

    ns.escapeRegExp = function(string) {
        return string.replace(/[-[\]{}()*+?.,;:&\\^$#\s]/g, "\\$&");
    };

    ns.replaceAll = function(string, find, replacementList) {
        var escapedFind = ns.escapeRegExp(find);
        var search = new RegExp("<object[^>]*>.*?<\/object>|<span[^>]*>.*?<\/span>|<(?:object|embed|svg|img|div|span|p|a)[^>]*>|("+escapedFind+")", "gi");

        // callback prevents replacing anything inside of these common html tags as well as between an <object></object> tag
        var replace = function(entire, m1) {
            return ((typeof m1 === 'undefined') || (m1 === '')) ? entire : replacementList[m1];
        };

        return string.replace(search,replace);
    };

}(this.emojione = this.emojione || {}));
if(typeof module === "object") module.exports = this.emojione;

},{}],7:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":55,"./_root":87}],8:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":59,"./_hashDelete":60,"./_hashGet":61,"./_hashHas":62,"./_hashSet":63}],9:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":71,"./_listCacheDelete":72,"./_listCacheGet":73,"./_listCacheHas":74,"./_listCacheSet":75}],10:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":55,"./_root":87}],11:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":76,"./_mapCacheDelete":77,"./_mapCacheGet":78,"./_mapCacheHas":79,"./_mapCacheSet":80}],12:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":55,"./_root":87}],13:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":55,"./_root":87}],14:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":11,"./_setCacheAdd":88,"./_setCacheHas":89}],15:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":9,"./_stackClear":91,"./_stackDelete":92,"./_stackGet":93,"./_stackHas":94,"./_stackSet":95}],16:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":87}],17:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":87}],18:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":55,"./_root":87}],19:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],20:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":42,"./_isIndex":65,"./isArguments":107,"./isArray":108}],21:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],22:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],23:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":102}],24:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":26,"./_createBaseEach":47}],25:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":48}],26:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":25,"./keys":117}],27:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":45,"./_isKey":66,"./_toKey":97}],28:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

module.exports = baseGetTag;

},{}],29:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],30:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":31,"./isObject":113,"./isObjectLike":114}],31:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isHostObject = require('./_isHostObject'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":15,"./_equalArrays":49,"./_equalByTag":50,"./_equalObjects":51,"./_getTag":56,"./_isHostObject":64,"./isArray":108,"./isTypedArray":116}],32:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":15,"./_baseIsEqual":30}],33:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isHostObject":64,"./_isMasked":68,"./_toSource":98,"./isFunction":111,"./isObject":113}],34:[function(require,module,exports){
var isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = baseIsTypedArray;

},{"./isLength":112,"./isObjectLike":114}],35:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":38,"./_baseMatchesProperty":39,"./identity":106,"./isArray":108,"./property":121}],36:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":69,"./_nativeKeys":84}],37:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./_baseEach":24,"./isArrayLike":109}],38:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":32,"./_getMatchData":54,"./_matchesStrictComparable":82}],39:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":30,"./_isKey":66,"./_isStrictComparable":70,"./_matchesStrictComparable":82,"./_toKey":97,"./get":104,"./hasIn":105}],40:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],41:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":27}],42:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],43:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":16,"./isSymbol":115}],44:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],45:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

module.exports = castPath;

},{"./_stringToPath":96,"./isArray":108}],46:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":87}],47:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":109}],48:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],49:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":14,"./_arraySome":22}],50:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":16,"./_Uint8Array":17,"./_equalArrays":49,"./_mapToArray":81,"./_setToArray":90,"./eq":102}],51:[function(require,module,exports){
var keys = require('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./keys":117}],52:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],53:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":67}],54:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":70,"./keys":117}],55:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":33,"./_getValue":57}],56:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":7,"./_Map":10,"./_Promise":12,"./_Set":13,"./_WeakMap":18,"./_baseGetTag":28,"./_toSource":98}],57:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],58:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":45,"./_isIndex":65,"./_isKey":66,"./_toKey":97,"./isArguments":107,"./isArray":108,"./isLength":112}],59:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

module.exports = hashClear;

},{"./_nativeCreate":83}],60:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

module.exports = hashDelete;

},{}],61:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":83}],62:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":83}],63:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":83}],64:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],65:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],66:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":108,"./isSymbol":115}],67:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],68:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":46}],69:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],70:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":113}],71:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

module.exports = listCacheClear;

},{}],72:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":23}],73:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":23}],74:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":23}],75:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":23}],76:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":8,"./_ListCache":9,"./_Map":10}],77:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

module.exports = mapCacheDelete;

},{"./_getMapData":53}],78:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":53}],79:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":53}],80:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":53}],81:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],82:[function(require,module,exports){
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],83:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":55}],84:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":86}],85:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":52}],86:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],87:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":52}],88:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],89:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],90:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],91:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

module.exports = stackClear;

},{"./_ListCache":9}],92:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

module.exports = stackDelete;

},{}],93:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],94:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],95:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

module.exports = stackSet;

},{"./_ListCache":9,"./_Map":10,"./_MapCache":11}],96:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./memoize":119,"./toString":124}],97:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":115}],98:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],99:[function(require,module,exports){
/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array ? array.length : 0,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = compact;

},{}],100:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":113,"./now":120,"./toNumber":123}],101:[function(require,module,exports){
module.exports = require('./forEach');

},{"./forEach":103}],102:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],103:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _([1, 2]).forEach(function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEach;

},{"./_arrayEach":19,"./_baseEach":24,"./_baseIteratee":35,"./isArray":108}],104:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":27}],105:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":29,"./_hasPath":58}],106:[function(require,module,exports){
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],107:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

},{"./isArrayLikeObject":110}],108:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],109:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":111,"./isLength":112}],110:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":109,"./isObjectLike":114}],111:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

},{"./isObject":113}],112:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],113:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],114:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],115:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":114}],116:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":34,"./_baseUnary":44,"./_nodeUtil":85}],117:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":20,"./_baseKeys":36,"./isArrayLike":109}],118:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

},{"./_arrayMap":21,"./_baseIteratee":35,"./_baseMap":37,"./isArray":108}],119:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":11}],120:[function(require,module,exports){
var root = require('./_root');

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;

},{"./_root":87}],121:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":40,"./_basePropertyDeep":41,"./_isKey":66,"./_toKey":97}],122:[function(require,module,exports){
var debounce = require('./debounce'),
    isObject = require('./isObject');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;

},{"./debounce":100,"./isObject":113}],123:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":113,"./isSymbol":115}],124:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":43}],125:[function(require,module,exports){
(function (global){
"use strict"
// Module export pattern from
// https://github.com/umdjs/umd/blob/master/returnExports.js
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.store = factory();
  }
}(this, function () {
	
	// Store.js
	var store = {},
		win = (typeof window != 'undefined' ? window : global),
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.20'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc && doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		var ieKeyFix = function(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=attributes.length-1; i>=0; i--) {
				storage.removeAttribute(attributes[i].name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled
	
	return store
}));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[4])(4)
});