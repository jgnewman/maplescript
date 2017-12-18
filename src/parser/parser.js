/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[5,17,19,21,23,24,25,26,27,28],$V1=[1,14],$V2=[1,15],$V3=[1,16],$V4=[1,17],$V5=[1,18],$V6=[1,19],$V7=[1,20],$V8=[1,21],$V9=[1,22],$Va=[5,17,18,19,20,21,22,23,24,25,26,27,28,31],$Vb=[17,19,21,23,24,25,26,27,28],$Vc=[2,14],$Vd=[5,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"Program":3,"ProgramBody":4,"EOF":5,"SourceElement":6,"List":7,"Arr":8,"Obj":9,"Str":10,"Regexp":11,"Atom":12,"Identifier":13,"Num":14,"Html":15,"NodeSequence":16,"(":17,")":18,"[":19,"]":20,"{":21,"}":22,"STRING":23,"REGEXP":24,"ATOM":25,"IDENTIFIER":26,"NUMBER":27,"<":28,"/>":29,">":30,"CLOSER":31,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",17:"(",18:")",19:"[",20:"]",21:"{",22:"}",23:"STRING",24:"REGEXP",25:"ATOM",26:"IDENTIFIER",27:"NUMBER",28:"<",29:"/>",30:">",31:"CLOSER"},
productions_: [0,[3,2],[4,2],[4,0],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[16,2],[16,0],[7,3],[7,2],[8,3],[8,2],[9,3],[9,2],[10,1],[11,1],[12,1],[13,1],[14,1],[15,3],[15,4],[15,4],[15,5],[15,5],[15,6]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

      this.$ = new ProgramNode($$[$0-1], createSourceLocation(null, _$[$0-1], _$[$0]));
      return this.$;
    
break;
case 2: case 13:

      this.$ = $$[$0-1].concat($$[$0]);
    
break;
case 3: case 14:

      this.$ = [];
    
break;
case 15:

      this.$ = new ListNode($$[$0-1], createSourceLocation(null, _$[$0-2], _$[$0]));
    
break;
case 16:

      this.$ = new ListNode([], createSourceLocation(null, _$[$0-1], _$[$0]));
    
break;
case 17:

      this.$ = new ArrNode($$[$0-1], createSourceLocation(null, _$[$0-2], _$[$0]));
    
break;
case 18:

      this.$ = new ArrNode([], createSourceLocation(null, _$[$0-1], _$[$0]));
    
break;
case 19:

      this.$ = new ObjNode($$[$0-1], createSourceLocation(null, _$[$0-2], _$[$0]));
    
break;
case 20:

      this.$ = new ObjNode([], createSourceLocation(null, _$[$0-1], _$[$0]));
    
break;
case 21:

      this.$ = new StringNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));
    
break;
case 22:

      this.$ = new RegexpNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));
    
break;
case 23:

      this.$ = new AtomNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));
    
break;
case 24:

      this.$ = new IdentifierNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));
    
break;
case 25:

      this.$ = new NumberNode($$[$0], createSourceLocation(null, _$[$0], _$[$0]));
    
break;
case 26:

      this.$ = new HtmlNode(true, $$[$0-1], [], null, null, createSourceLocation(null, _$[$0-2], _$[$0]));
    
break;
case 27:

      this.$ = new HtmlNode(true, $$[$0-2], $$[$0-1], null, null, createSourceLocation(null, _$[$0-3], _$[$0]));
    
break;
case 28:

      this.$ = new HtmlNode(false, $$[$0-2], [], [], $$[$0], createSourceLocation(null, _$[$0-3], _$[$0]));
    
break;
case 29:

      this.$ = new HtmlNode(false, $$[$0-3], [], $$[$0-1], $$[$0], createSourceLocation(null, _$[$0-4], _$[$0]));
    
break;
case 30:

      this.$ = new HtmlNode(false, $$[$0-3], $$[$0-2], [], $$[$0], createSourceLocation(null, _$[$0-4], _$[$0]));
    
break;
case 31:

      this.$ = new HtmlNode(false, $$[$0-4], $$[$0-3], $$[$0-1], $$[$0], createSourceLocation(null, _$[$0-5], _$[$0]));
    
break;
}
},
table: [o($V0,[2,3],{3:1,4:2}),{1:[3]},{5:[1,3],6:4,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,17:$V1,19:$V2,21:$V3,23:$V4,24:$V5,25:$V6,26:$V7,27:$V8,28:$V9},{1:[2,1]},o($V0,[2,2]),o($Va,[2,4]),o($Va,[2,5]),o($Va,[2,6]),o($Va,[2,7]),o($Va,[2,8]),o($Va,[2,9]),o($Va,[2,10]),o($Va,[2,11]),o($Va,[2,12]),o($Vb,$Vc,{16:23,18:[1,24]}),o($Vb,$Vc,{16:25,20:[1,26]}),o($Vb,$Vc,{16:27,22:[1,28]}),o($Va,[2,21]),o($Va,[2,22]),o($Va,[2,23]),o($Vd,[2,24]),o($Va,[2,25]),{13:29,26:$V7},{6:31,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,17:$V1,18:[1,30],19:$V2,21:$V3,23:$V4,24:$V5,25:$V6,26:$V7,27:$V8,28:$V9},o($Va,[2,16]),{6:31,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,17:$V1,19:$V2,20:[1,32],21:$V3,23:$V4,24:$V5,25:$V6,26:$V7,27:$V8,28:$V9},o($Va,[2,18]),{6:31,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,17:$V1,19:$V2,21:$V3,22:[1,33],23:$V4,24:$V5,25:$V6,26:$V7,27:$V8,28:$V9},o($Vd,[2,20]),{9:35,21:$V3,29:[1,34],30:[1,36]},o($Va,[2,15]),o([17,18,19,20,21,22,23,24,25,26,27,28,31],[2,13]),o($Va,[2,17]),o($Vd,[2,19]),o($Va,[2,26]),{29:[1,37],30:[1,38]},o($Vb,$Vc,{16:40,31:[1,39]}),o($Va,[2,27]),o($Vb,$Vc,{16:42,31:[1,41]}),o($Va,[2,28]),{6:31,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,17:$V1,19:$V2,21:$V3,23:$V4,24:$V5,25:$V6,26:$V7,27:$V8,28:$V9,31:[1,43]},o($Va,[2,30]),{6:31,7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:12,15:13,17:$V1,19:$V2,21:$V3,23:$V4,24:$V5,25:$V6,26:$V7,27:$V8,28:$V9,31:[1,44]},o($Va,[2,29]),o($Va,[2,31])],
defaultActions: {3:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};


var shared = {};

function createSourceLocation(source, firstToken, lastToken) {
    return new SourceLocation(
        source,
        new Position(
            firstToken.first_line,
            firstToken.first_column
        ),
        new Position(
            lastToken.last_line,
            lastToken.last_column
        )
    );
}

function Position(line, column) {
  this.line   = line;
  this.column = column;
}

function SourceLocation(source, start, end) {
  this.source = source;
  this.start  = start;
  this.end    = end;
}

function ProgramNode(body, loc) {
  this.type = "Program";
  this.length = body.length;
  this.body = body;
  this.loc  = loc;
  this.shared = shared;
}

function RegexpNode(text, loc) {
  this.src = text;
  this.text = text;
  this.type = 'Regexp';
  this.loc = loc;
  this.shared = shared;
}

function IdentifierNode(text, loc) {
  this.src = text;
  this.type = 'Identifier';
  this.text = text;
  this.loc = loc;
  this.shared = shared;
}

function StringNode(text, loc) {
  this.src = text;
  this.type = 'String';
  this.text = text;
  this.loc = loc;
  this.shared = shared;
}

function AtomNode(text, loc) {
  this.src = text;
  this.type = 'Atom';
  this.text = text;
  this.loc = loc;
  this.shared = shared;
}

function NumberNode(num, loc) {
  this.src = num;
  this.type = 'Number';
  this.number = num;
  this.loc = loc;
  this.shared = shared;
}

function ListNode(items, loc) {
  this.src = '(' + items.map(function (item) { return item.src }).join(', ') + ')';
  this.type = 'List';
  this.length = items.length;
  this.items = items;
  this.loc = loc;
  this.shared = shared;
}

function ArrNode(items, loc) {
  this.src = "[" + items.map(function (item) { return item.src; }).join(', ') + "]";
  this.type = 'Arr';
  this.length = items.length;
  this.items = items;
  this.loc = loc;
  this.shared = shared;
}

function ObjNode(items, loc) {
  this.src = "{" + items.map(function (item) { return item.src; }).join(', ') + "}";
  this.type = 'Obj';
  this.length = items.length;
  this.items = items;
  this.loc = loc;
  this.shared = shared;
}

function HtmlNode(selfClosing, openTag, attrs, body, closeTag, loc) {
  this.type = 'Html';
  this.selfClosing = selfClosing;
  this.openTag = openTag;
  this.closeTag = closeTag;
  this.attrs = attrs;
  this.body = body;
  this.loc = loc;
  this.shared = shared;
}


/* Expose the Node Constructors */
var n = parser.nodes = {};

n.shared = shared;
n.ProgramNode = ProgramNode;
n.RegexpNode = RegexpNode;
n.StringNode = StringNode;
n.AtomNode = AtomNode;
n.IdentifierNode = IdentifierNode;
n.NumberNode = NumberNode;
n.ListNode = ListNode;
n.ArrNode = ArrNode;
n.ObjNode = ObjNode;
n.HtmlNode = HtmlNode;
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:
                                        if (yy_.yytext.match(/\r|\n/)) {
                                            parser.newLine = true;
                                        }

                                        if (parser.restricted && parser.newLine) {
                                            this.unput(yy_.yytext);
                                            parser.restricted = false;
                                            return ";";
                                        }
                                     
break;
case 1:
                                        if (yy_.yytext.match(/\r|\n/)) {
                                            parser.newLine = true;
                                        }

                                        if (parser.restricted && parser.newLine) {
                                            this.unput(yy_.yytext);
                                            parser.restricted = false;
                                            return ";";
                                        }
                                     
break;
case 2:return "(";
break;
case 3:return ")";
break;
case 4:return "[";
break;
case 5:return "]";
break;
case 6:return "{";
break;
case 7:return "}";
break;
case 8:return "CLOSER";
break;
case 9:return "</";
break;
case 10:return "<";
break;
case 11:return "/>";
break;
case 12:return ">";
break;
case 13:/* skip other whitespace */
break;
case 14:return "NUMBER";
break;
case 15:return "REGEXP";
break;
case 16:return "STRING";       /* " fix syntax highlighting */
break;
case 17:return "STRING";       /* ' fix syntax highlighting */
break;
case 18:return "STRING";       /* ` fix syntax highlighting */
break;
case 19:return "ATOM";
break;
case 20:return "IDENTIFIER";
break;
case 21:return "EOF";
break;
}
},
rules: [/^(?:###(.|\r|\n)*?###)/,/^(?:#.*($|\r\n|\r|\n))/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:<\/[^\>]+>)/,/^(?:<\/\s*)/,/^(?:<\s*)/,/^(?:\/>)/,/^(?:>)/,/^(?:\s+)/,/^(?:(-)?[0-9]+(\.[0-9]+)?(e-?[0-9]+)?)/,/^(?:\/([^\/\s]|\/)+\/[gim]*)/,/^(?:"([^\"]|\\[\"])*")/,/^(?:'([^\']|\\[\'])*')/,/^(?:`([^\`]|\\[\`])*`)/,/^(?::[A-Za-z][^\s\(\)\[\]\{\}\<\>]*)/,/^(?:[^\s\(\)\[\]\{\}\<\>]+)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}