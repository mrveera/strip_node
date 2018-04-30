const Expr = require('./Expr');
const Token = require('./Token');
const TokenType = require('./TokenType');
class AstPrinter {
  constructor(){
    this.foo="foo";
  }
  print(expr){
    console.log(expr.accept(this))
  }
 visitBinaryExpr(expr) {
   return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
 }
 visitGroupingExpr(expr) {
   return this.parenthesize("group", expr.expression);
 }
 visitLiteralExpr(expr) {
   if (expr.value == null) return "nil";
   return expr.value.toString();
 }
 visitUnaryExpr(expr) {
   return this.parenthesize(expr.operator.lexeme, expr.right);
 }
 parenthesize(name, ...exprs) {
   let content=`(${name}`;
   for (let i =0 ;i<exprs.length;i++) {
     let expr=exprs[i];
     content += " ";
     content += expr.accept(this);
   }
   content += ")";
    return content;
  }
  main(args) {
    let expression = new Expr.Binary(
        new Expr.Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Expr.Literal(123)),
        new Token(TokenType.STAR, "*", null, 1),
        new Expr.Grouping(
            new Expr.Literal(45.67)));
    return expression;
  }

}
a=new AstPrinter();
a.print(a.main())
// module.exports=AstPrinter;
