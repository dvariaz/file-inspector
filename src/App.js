import { useEffect, useCallback } from "react";
import { promisify } from "util";
import DataStream from "datastream-js";
import { parseStringPromise } from "xml2js";
import * as PizZip from "pizzip";
import * as PizZipUtils from "pizzip/utils/es6";
import "./App.css";
import doc from "./documento.docx";

import { useDropzone } from "react-dropzone";

const loadFile = promisify(PizZipUtils.getBinaryContent);

async function getDocumentProps(fileContent) {
  const zip = new PizZip(fileContent); //Cargamos el contenido de la plantilla
  const xml = zip.file("docProps/app.xml").asText();

  console.log(xml);

  return parseStringPromise(xml)
    .then((result) => {
      return result["Properties"]["Pages"][0];
    })
    .catch((err) => {
      console.error(err);
      throw new Error("No se pudo detectar el número de páginas");
    });
}

function MyDropzone() {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({ onDrop });

  if (acceptedFiles.length > 0) {
    let [file] = acceptedFiles;
    console.log(file);

    const reader = new FileReader();

    reader.onload = () => {
      getDocumentProps(reader.result).then((count) => {
        console.log(count);
      });
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <>
      <div
        style={{
          margin: "auto",
          width: 400,
          height: 200,
          border: "2px solid black",
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <div>
        <div></div>
      </div>
    </>
  );
}

function App() {
  // loadFile(doc).then((binaryDoc) => {
  //   getDocumentProps(binaryDoc);
  // }); //Leemos la plantilla
  return (
    <div className="App">
      <h1>Información del archivo</h1>
      <MyDropzone />
    </div>
  );
}

export default App;
