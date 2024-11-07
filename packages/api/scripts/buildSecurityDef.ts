import fs from "fs";
import _ from "lodash";
import { Project, VariableDeclarationKind } from "ts-morph";
import { parse } from "yaml";

const OUT_PATH = "./gen/security-def.ts";
const SECURITY_TYPE = `{
  email: string;
}`;


const openApiString = fs.readFileSync("./api.bundle.yml").toString(); 
const openApi = parse(openApiString);

if(fs.existsSync(OUT_PATH)) {
  fs.unlinkSync(OUT_PATH);
}



const routes = _.keys(openApi.paths);

const securitySchemeObject: any = {};

const routeTypeStrings = routes.map((route) => {
  const methods = ["post", "get", "put", "delete", "patch"];
  securitySchemeObject[route] = {}

  const methodTypeStrings = methods.map((method) => {
    console.log(`Handling ${route}:${method}`)

    const securitySchemes = openApi.paths[route][method]?.security;

    if(securitySchemes !== undefined && securitySchemes.length > 0){
      securitySchemeObject[route][method] = "user"
      return `${method}: ${SECURITY_TYPE};`
    }
    else {
      securitySchemeObject[route][method] = "none"
      return `${method}: never;`
    }
  });

  return `"${route}": {${methodTypeStrings.join("\r\n")}}`
});

const interfaceDef = `${routeTypeStrings.join(",\r\n")}`

const project = new Project()
const outFile = project.createSourceFile(OUT_PATH);

const securityInterface = outFile.addInterface({name: "RouterSecurityDef", isExported: true});
securityInterface.removeText()
securityInterface.insertText(36,interfaceDef);

outFile.addVariableStatement({declarationKind: VariableDeclarationKind.Const, isExported: true, declarations: [{name: "routeSecurityLevel", initializer: JSON.stringify(securitySchemeObject)}]})

outFile.formatText({indentSize: 2})
outFile.saveSync();