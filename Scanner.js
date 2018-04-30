const Token = require('./Token');
const TokenType = require('./TokenType');
const common = require('./common');
const isDigit=function (c) {
  return c >= '0' && c <= '9';
}
var isAlpha = function(ch){
  return /^[A-Z]$/i.test(ch);
}
var isAlphaNumeric=function (ch) {
return /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i.test(ch)

}
class Scanner {
  constructor(source) {
    this.start=0;
    this.current=0;
    this.line=1;
    this.source=source;
    this.tokens=[];
    this.keywords={
      AND:"AND",
       CLASS:"CLASS",
       ELSE:"ELSE", FALSE:"FALSE",
       FUN:"FUN", FOR:"FOR", IF:"IF",
       NIL:"NIL", OR:"OR",
      PRINT:"PRINT",
      RETURN:"RETURN",
      SUPER:"SUPER",
      THIS:"THIS",
       TRUE:"TRUE", VAR:"VAR", WHILE:"WHILE"
    }
  }
  scanTokens(){
    while (!this.isAtEnd()) {
      this.start=this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF,"",null,this.line))
    return this.tokens;
  }
  isAtEnd(){
    return this.current>=this.source.length;
  }
  scanToken() {
    let c = this.advance();
    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '*': this.addToken(TokenType.STAR); break;
      case '!': this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG); break;
      case '=': this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); break;
      case '<': this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS); break;
      case '>': this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER); break;
      case '/':
       if (this.match('/')) {
         // A comment goes until the end of the line.
         while (this.peek() != '\n' && !this.isAtEnd()){
            this.advance();
          }
       } else {
         this.addToken(TokenType.SLASH);
       }
       break;
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break;

      case '\n':
        this.line++;
        break;
      case '"': this.string(); break;
      default:
      if (isDigit(c)) {
          this.number();
        } else if (isAlpha(c)) {
        this.identifier();
        } else {
          common.error(this.line, "Unexpected character.");
        }
        break;
    }
  }
  identifier() {
    while (isAlphaNumeric(this.peek())) this.advance();
     let text = this.source.substring(this.start, this.current);
    let type = this.keywords[text.toUpperCase()];
    if (type == null) type = TokenType.IDENTIFIER;
    this.addToken(type);
  }
  number() {
    while (isDigit(this.peek())) this.advance();

    // Look for a fractional part.
    if (this.peek() == '.' && isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (isDigit(this.peek())) this.advance();
    }

    this.addToken(TokenType.NUMBER,+this.source.substring(this.start, this.current));
  }
  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return source[this.current + 1];
  }
  string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == '\n') this.line++;
      this.advance();
    }

    // Unterminated string.
    if (this.isAtEnd()) {
      common.error(this.line, "Unterminated string.");
      return;
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    let value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }
  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source[this.current];
  }
  match(str){
    if (this.isAtEnd()) return false;
    if (source[this.current] != expected) return false;

    this.current++;
    return true;
  }
  advance() {
    this.current++;
    return this.source[this.current - 1];
  }
  addToken(type,literal) {
    let text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
}
module.exports=Scanner;
