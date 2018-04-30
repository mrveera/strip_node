const TokenType = require('./TokenType');
const Expr = require('./Expr');
const common = require('./common');
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }
  parse(){
    try {
      return this.expression();
    } catch (error) {
      console.log(error)
      return null;
    }
  }
  expression() {
    return this.equality();
  }
  equality() {
    let expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.previous();
      let right = this.comparison();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }
  match(...types) {
    for (let i = 0; i < types.length; i++) {
      let type = types[i];
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }
  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }
  isAtEnd() {
    return this.peek().type == TokenType.EOF;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }
  comparison() {
    let expr = this.addition();

    while (this.match(TokenType.GREATER,
        TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      let operator = this.previous();
      let right = this.addition();
      expr = new Expr.Binary(expr, operator, right);
    }
    return expr;
  }
  addition() {
    let expr = this.multiplication();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let operator = this.previous();
      let right = this.multiplication();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }

  multiplication() {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let operator = this.previous();
      let right = this.unary();
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;
  }
  unary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator = this.previous();
      let right = this.unary();
      return new Expr.Unary(operator, right);
    }

    return this.primary();
  }
  primary() {
    if (this.match(TokenType.FALSE)) return new Expr.Literal(false);
    if (this.match(TokenType.TRUE)) return new Expr.Literal(true);
    if (this.match(TokenType.NIL)) return new Expr.Literal(null);

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Expr.Literal(this.previous().literal);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      let expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Expr.Grouping(expr);
    }
    throw common.error(this.peek(), "Expect expression.");

  }
  consume(type, message) {
    if (this.check(type)) return this.advance();

    throw common.error(this.peek(), message);
  }

  synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type == SEMICOLON) return;

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }
}
module.exports=Parser;
