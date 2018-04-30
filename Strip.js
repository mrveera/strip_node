const fs = require('fs');
const Scanner = require('./Scanner');
const Parser = require('./Parser');
const AstPrinter = require('./AstPrinter');
class Strip {
  constructor(){
    this.name="strip";
  }
  runFile(file){
    let source=fs.readFileSync(file,'utf8');
    this.run(source);
  }
  run(source){
    let scanner = new Scanner(source);
    let tokens = scanner.scanTokens();
    let parser = new Parser(tokens);
    let expression = parser.parse();

    // Stop if there was a syntax error.
    if (this.hadError) return;
    new AstPrinter().print(expression)
  }
  main(args){
    if (args.length>3) {
      console.log("Usage : Strip [script]");
    } else if(args.length==3){
      this.runFile(args[2]);
    }else {
      this.runPrompt();
    }
  }
  runPrompt(){
  
    process.stdin.on('data',(data)=>{
      this.run(data+'');
      this.hadError = false;
    });

  }

}

new Strip().main(process.argv);
