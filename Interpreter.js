const TokenType = require('./TokenType');
class Interpreter {
  visitLiteralExpr(expr) {
    return expr.value;
  }
  visitGroupingExpr(expr) {
    return this.evaluate(expr.expression);
  }
  evaluate(expr) {
    return expr.accept(this);
  }
  visitUnaryExpr(expr) {
    let right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.BANG:
        return !this.isTruthy(right);
      case TokenType.MINUS:
         this.checkNumberOperand(expr.operator, right);
        return -right;
    }

    // Unreachable.
    return nul
  }
  isTruthy(object) {
    if (object == null) return false;
    if (object instanceof Boolean) return false;
    return true;
  }
  visitBinaryExpr(expr) {
    let left = this.evaluate(expr.left);
    let right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.GREATER:
        return left > right;
      case TokenType.GREATER_EQUAL:
        return left >= right;
      case TokenType.LESS:
        return left < right;
      case TokenType.LESS_EQUAL:
        return left <= right;
      case TokenType.MINUS:
        return left - right;
      case PLUS:
        return left + right;
      case TokenType.SLASH:
        return left / right;
      case TokenType.STAR:
        return left * right;
      case TokenType.BANG_EQUAL: return !this.isEqual(left, right);
      case TokenType.EQUAL_EQUAL: return this.isEqual(left, right);
    }

    // Unreachable.
    return null;
  }
  isEqual(a,b) {
    console.log(a,b)
    // nil is only equal to nil.
    if (a == null && b == null) return true;
    if (a == null) return false;

    return a==b;
  }
}
