/**
 * @module "Renumberation" class
 * @description Performs renumberation of Dynamics objects
 * @version 0.0.1 (2021-02-18)
 */

const fs = require("fs");
const path = require("path");
__require("general/javaScript");
const DynamicsApp = __require("dynamics/dynamicsApp");
const DynamicsObjects = __require("dynamics/dynamicsObjects");
const RenumberatorFactory = __require("renumberation/renumberatorFactory");

class Renumberation {
    get folderPath() { return this.mFolderPath; }
    get dynamicsApp() { return this.mDynamicsApp; }
    set dynamicsApp(pValue) { this.mDynamicsApp = pValue; }
    get renumberators() { return this.mRenumberators; }
    set renumberators(pValue) { this.mRenumberators = pValue; }

    get onDynamicsApp() { return this.mOnDynamicsApp; }
    set onDynamicsApp(pValue) { this.mOnDynamicsApp = pValue; }
    get onFolder() { return this.mOnFolder; }
    set onFolder(pValue) { this.mOnFolder = pValue; }
    get onFile() { return this.mOnFile; }
    set onFile(pValue) { this.mOnFile = pValue; }

    constructor(pFolderPath) {
        this.mFolderPath = String.default(pFolderPath);
        this.mDynamicsApp = null;
        this.mDynamicsObjects = new DynamicsObjects();
        this.mRenumberators = [];
    }

    async run() {
        this.validate();
        this.readDynamicsApp();
        this.readDynamicsObjects();
        this.createRenumberators();
        await this.renumber();
    }

    validate() {
        if (!this.folderPath)
            throw new Error("Folder path can't be empty.");
        if (!fs.existsSync(this.folderPath))
            throw new Error(`Folder ${this.folderPath} doesn't exist.`);
    }

    readDynamicsApp() {
        const filePath = path.join(this.folderPath, "app.json");
        if (fs.existsSync(filePath)) {
            const rawData = fs.readFileSync(filePath);
            const data = JSON.parse(rawData);
            this.dynamicsApp = DynamicsApp.deserialise(data);
            if (this.onDynamicsApp)
                this.onDynamicsApp(this.dynamicsApp);
        } else
            throw new Error("Dynamics application manifest (app.json) is missing.");
    }

    readDynamicsObjects() {
        //TODO - Not implemented
    }

    createRenumberators() {
        this.renumberators = RenumberatorFactory.create();
    }

    async renumber() {
        this.renumberFolder(this.folderPath, 0);
    }

    async renumberFolder(pFolderPath, pIndentation) {
        const folderName = pIndentation > 0 ? path.basename(pFolderPath) : "/";
        if (this.onFolder)
            this.onFolder(folderName, pIndentation);
        const folderEntries = fs.readdirSync(pFolderPath, { withFileTypes: true });
        for (const folderEntry of folderEntries) {
            const folderEntryPath = path.join(pFolderPath, folderEntry.name);
            if (folderEntry.isDirectory())
                await this.renumberFolder(folderEntryPath, pIndentation + 1);
            else 
                if (folderEntry.isFile())
                    await this.renumberFile(folderEntryPath, pIndentation + 1); 
        };
    }	   
    
    async renumberFile(pFilePath, pIndentation) {
        let renumbered = false;
        const renumberator = this.findRenumberator(pFilePath);
        if (renumberator) {
            await renumberator.renumber(pFilePath);
            renumbered = true;
        }
        const fileName = path.basename(pFilePath);
        if (this.onFile)
            this.onFile(fileName, renumbered, renumberator, pIndentation);
    }

    findRenumberator(pFilePath) {
        let renumberatorFound = null;
        for (const renumberator of this.renumberators)
            if (renumberator.canRenumber(pFilePath)) {
                renumberatorFound = renumberator;
                break;
            }
        return renumberatorFound;
    }
}

module.exports = Renumberation;