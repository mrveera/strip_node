const TokenType = require('./TokenType');
  let error=function(token, message) {
    if (token.type == TokenType.EOF) {
      report(token.line, " at end", message);
    } else {
      report(token.line, " at '" + token.lexeme + "'", message);
    }
  }
  let report=function(line,message){
    console.error("[line " + line + "] Error where + : " + message);
  }
module.exports={
  error,report
}
