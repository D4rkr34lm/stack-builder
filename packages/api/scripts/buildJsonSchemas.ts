import { existsSync } from "fs";
import { appendFile, copyFile, lstat, mkdir, readdir, writeFile } from "fs/promises";
import { compileFromFile } from 'json-schema-to-typescript';
import path from "path";

//-----------------------------------------------------------
// Config
const ROOT_PATH = path.join(process.cwd(), './src');
const OUTPUT_PATH = path.join(process.cwd(), "./gen")
// ----------------------------------------------------------

async function getFilesPathsFromFolder(folderPath: string) {
  const filePaths: string[] = [];
  const dir = await readdir(folderPath);

  const crawlPromises = dir.map(async (fdName) => {
    const fdPath = path.join(folderPath, fdName);
    const fdStat = await lstat(fdPath);

    if(fdStat.isFile() && /.*\.schema\.json/.test(fdName)){
      filePaths.push(fdPath);
    }
    else if(fdStat.isDirectory()){
      const files = await getFilesPathsFromFolder(fdPath);
      filePaths.push(...files)
    }
  })

  await Promise.allSettled(crawlPromises);

  return filePaths;
}

const schemaPaths = await getFilesPathsFromFolder(ROOT_PATH);
console.log(`Found ${schemaPaths.length} schemas`, schemaPaths)

await writeFile(path.join(OUTPUT_PATH, "schema-types.ts"), `
  import AJV from "ajv"
  const ajv = new AJV()  
`);

const compilePromises = schemaPaths.map(async (schemaPath) => {
  const dirName = path.dirname(schemaPath);
  const compileRes = (await compileFromFile(schemaPath, {cwd: dirName}))
  .replace(/\/\*.*\*\//, '')
  .replace(/\/\*\*\D*\*\//, '');
  
  
  const [schemaName] = path.basename(schemaPath).split(".")
  
  const libSchemaPath = `./schemas/${schemaName}.schema.json`

  const typeguardCode = `
    import ${schemaName}Schema from "${libSchemaPath}" assert {type: "json"};
    const validate${schemaName} = ajv.compile(${schemaName}Schema);
    const is${schemaName} = (value: unknown): value is ${schemaName} => validate${schemaName}(value);
  `

  appendFile(path.join(OUTPUT_PATH, "schema-types.ts"), compileRes + typeguardCode);
})

const schemaLibFolder = path.join(OUTPUT_PATH, "schemas");
if(!existsSync(schemaLibFolder)) {
  await mkdir(schemaLibFolder)
}
const copyPromises = schemaPaths.map(async (schemaPath) => {
  const schemaFileName = path.basename(schemaPath);
  await copyFile(schemaPath, path.join(schemaLibFolder, schemaFileName))

});

await Promise.allSettled(compilePromises);
await Promise.allSettled(copyPromises);
console.log("Finished compiling schemas")