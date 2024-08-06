import DatauriParser from "datauri/parser.js"
import path from "path"

const getDataUrl = (file) => {
    const parser = new DatauriParser()

    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer)
}

export default getDataUrl;