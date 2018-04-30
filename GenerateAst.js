const fs = require('fs');
class GenerateAst {
  main(args) {
    if (args.length != 3) {
      console.error("Usage: generate_ast <output directory>");
      process.exit(1);
    }
    let outputDir = args[2];
    this.defineAst(outputDir, "Expr", {
      "Binary ": " Expr left, Token operator, Expr right",
      "Grouping": "Expr expression",
      "Literal  ": "Object value",
      "Unary    ": "Token operator, Expr right"
    });
  }
  defineAst(outputDir, baseName, types) {
    let path = outputDir + '/' + baseName + '.js';
    let contents = ``;
    let modules = `module.exports={`;
    for (var type in types) {
      let className = type;
      let fields = types[type];
      contents += this.defineType(baseName.trim(), className.trim(), fields);
      modules += `${className.trim()},`;
    }
    fs.writeFileSync(path, contents + modules.slice(0, -1) + '}', "utf8")
  }
  defineType(baseName, className, fields) {
    let anFields = fields.split(',').reduce((p, c) => {
      p += c.trim().split(' ')[1] + ',';
      return p;
    }, '').slice(0, -1);
    let head = ` class ${className}  {
          constructor(${anFields}){
          ${anFields.split(',').reduce((p,c)=>{
            p += `this.${c}=${c}
            `;
            return p;
          },'')}
        }
        accept(visitor){
          return visitor.visit${className}${baseName}(this);
        }
    }`;
    return head;

  }
}

new GenerateAst().main(process.argv);
