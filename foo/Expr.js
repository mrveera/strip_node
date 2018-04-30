 class Binary  {
          constructor(left,operator,right){
          this.left=left
            this.operator=operator
            this.right=right
            
        }
        accept(visitor){
          return visitor.visitorBinaryExpr(this);
        }
    } class Grouping  {
          constructor(expression){
          this.expression=expression
            
        }
        accept(visitor){
          return visitor.visitorGroupingExpr(this);
        }
    } class Literal  {
          constructor(value){
          this.value=value
            
        }
        accept(visitor){
          return visitor.visitorLiteralExpr(this);
        }
    } class Unary  {
          constructor(operator,right){
          this.operator=operator
            this.right=right
            
        }
        accept(visitor){
          return visitor.visitorUnaryExpr(this);
        }
    }module.exports={Binary,Grouping,Literal,Unary}