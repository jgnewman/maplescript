/*
 * Grammar file.
 * Pass this to Jison to generate the Cream and Sugar parser file.
 */

%lex

%%

/* Comments */
"---"(.|\r|\n)*?"---"                 %{
                                         if (yytext.match(/\r|\n/)) {
                                             parser.newLine = true;
                                         }

                                         if (parser.restricted && parser.newLine) {
                                             this.unput(yytext);
                                             parser.restricted = false;
                                             return ";";
                                         }
                                      %}
"--".*($|\r\n|\r|\n)                  %{
                                         if (yytext.match(/\r|\n/)) {
                                             parser.newLine = true;
                                         }

                                         if (parser.restricted && parser.newLine) {
                                             this.unput(yytext);
                                             parser.restricted = false;
                                             return ";";
                                         }
                                      %}

"("                                   return "(";
")"                                   return ")";

"["                                   return "[";
"]"                                   return "]";

"{"                                   return "{";
"}"                                   return "}";

"->"                                  return "IDENTIFIER";
">>="                                 return "IDENTIFIER";
"?<"                                  return "IDENTIFIER";
"?>"                                  return "IDENTIFIER";
"<="                                  return "IDENTIFIER";
">="                                  return "IDENTIFIER";

\<\/[^\>]+\>                          return "CLOSER";
\<\/\s*                               return "</";
\<\s*                                 return "<";
"/>"                                  return "/>";
">"                                   return ">";

\s+                                   /* skip other whitespace */

0x[A-z0-9]+                           return "NUMBER";
(\-)?[0-9]+(\.[0-9]+)?(e\-?[0-9]+)?   return "NUMBER";
\/(\\\/|[^\r\n\/])+\/[gim]*           return "REGEXP";
\"([^\"]|\\[\"])*\"                   return "STRING";       /* " fix syntax highlighting */
\'([^\']|\\[\'])*\'                   return "STRING";       /* ' fix syntax highlighting */
\`([^\`]|\\[\`])*\`                   return "STRING";       /* ` fix syntax highlighting */

"@async"                                         return "IDENTIFIER";
(\+|\-|\*|\/|\%|\!\=|\=|\@)                      return "IDENTIFIER";
\:[A-Za-z_\$][A-Za-z0-9_\$\-\.]*                 return "SYMBOL";
[A-Za-z\_\$\&][A-Za-z0-9_\$\.\:\|\?\-]*(\/\d+)?  return "IDENTIFIER";

<<EOF>>                               return "EOF";

%%


/lex

%start Program
/* Define Start Production */
/* Define Grammar Productions */

%%

Program
  : ProgramBody EOF
    {
      $$ = new ProgramNode($1, createSourceLocation(null, @1, @2));
      return $$;
    }
  ;

ProgramBody
  : ProgramBody SourceElement
    {
      $$ = $1.concat($2);
    }
  | /* Empty */
    {
      $$ = [];
    }
  ;

SourceElement
  : List
  | Arr
  | Obj
  | Str
  | Regexp
  | Sym
  | Identifier
  | Num
  | Html
  ;

NodeSequence
  : NodeSequence SourceElement
    {
      $$ = $1.concat($2);
    }
  | /* empty */
    {
      $$ = [];
    }
  ;

ArrSequence
  : ArrSequence SourceElement
    {
      $$ = $1.concat($2);
    }
  | /* empty */
    {
      $$ = [];
    }
  ;

List
  : "(" NodeSequence ")"
    {
      $$ = new ListNode($2, createSourceLocation(null, @1, @3));
    }
  | "(" /* empty */ ")"
    {
      $$ = new ListNode([], createSourceLocation(null, @1, @2));
    }
  ;

Arr
  : "[" ArrSequence "]"
    {
      var lastItem = $2[$2.length - 1];
      var sequence = $2;
      var qualifier = null;

      if (lastItem.type === 'Qualifier') {
        qualifier = lastItem.list;
        sequence = $2.slice(0, $2.length - 1);
      }

      $$ = new ArrNode(sequence, qualifier, createSourceLocation(null, @1, @3));
    }
  | "[" /* empty */ "]"
    {
      $$ = new ArrNode([], null, createSourceLocation(null, @1, @2));
    }
  ;

Obj
  : "{" NodeSequence "}"
    {
      $$ = new ObjNode($2, createSourceLocation(null, @1, @3));
    }
  | "{" /* empty */ "}"
    {
      $$ = new ObjNode([], createSourceLocation(null, @1, @2));
    }
  ;

Str
  : STRING
    {
      $$ = new StringNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Regexp
  : REGEXP
    {
      $$ = new RegexpNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Sym
  : SYMBOL
    {
      $$ = new SymbolNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Identifier
  : IDENTIFIER
    {
      $$ = new IdentifierNode($1, ($1 === '::'), createSourceLocation(null, @1, @1));
    }
  ;

Num
  : NUMBER
    {
      $$ = new NumberNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Html
  : "<" Identifier "/>"
    {
      $$ = new HtmlNode(true, $2, null, null, null, createSourceLocation(null, @1, @3));
    }
  | "<" Identifier Obj "/>"
    {
      $$ = new HtmlNode(true, $2, $3, null, null, createSourceLocation(null, @1, @4));
    }
  | "<" Identifier ">" CLOSER
    {
      $$ = new HtmlNode(false, $2, null, [], $4, createSourceLocation(null, @1, @4));
    }
  | "<" Identifier ">" NodeSequence CLOSER
    {
      $$ = new HtmlNode(false, $2, null, $4, $5, createSourceLocation(null, @1, @5));
    }
  | "<" Identifier Obj ">" CLOSER
    {
      $$ = new HtmlNode(false, $2, $3, [], $5, createSourceLocation(null, @1, @5));
    }
  | "<" Identifier Obj ">" NodeSequence CLOSER
    {
      $$ = new HtmlNode(false, $2, $3, $5, $6, createSourceLocation(null, @1, @6));
    }
  ;

/* Create Node constructors for each type of statement */

%%

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

function IdentifierNode(text, argSep, loc) {
  this.src = text;
  this.type = 'Identifier';
  this.isArgSeparator = argSep;
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

function SymbolNode(text, loc) {
  this.src = text;
  this.type = 'Symbol';
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
  this.src = '(' + items.map(function (item) { return item.src }).join(' ') + ')';
  this.type = 'List';
  this.length = items.length;
  this.items = items;
  this.loc = loc;
  this.shared = shared;
}

function ArrNode(items, qualifier, loc) {
  this.src = "[" + items.map(function (item) { return item.src; }).join(', ') + "]";
  this.type = 'Arr';
  this.length = items.length;
  this.items = items;
  this.qualifier = qualifier;
  this.loc = loc;
  this.shared = shared;
}

function QualifierNode(list) {
  this.type = 'Qualifier';
  this.list = list;
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
n.SymbolNode = SymbolNode;
n.IdentifierNode = IdentifierNode;
n.NumberNode = NumberNode;
n.ListNode = ListNode;
n.ArrNode = ArrNode;
n.ObjNode = ObjNode;
n.HtmlNode = HtmlNode;
