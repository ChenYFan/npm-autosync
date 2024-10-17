import fetch from "node-fetch"
import fs from "fs"
import allowedPackage from "./allowedPackage.js"
import { exec } from "child_process"

const excuteCommand = async (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            }
            resolve(stdout ? stdout : stderr)
        })
    })
}

const loadAsyncConfig = function (AsyncFileName) {
    this.name = AsyncFileName;
    if (!fs.existsSync(AsyncFileName)) { fs.writeFileSync(AsyncFileName, JSON.stringify({})) }
    this.read = () => {
        return JSON.parse(fs.readFileSync(AsyncFileName))
    }
    this.write = (data) => {
        fs.writeFileSync(AsyncFileName, JSON.stringify(data, null, 4))
    }
}



const asyncNPM = async (config) => {
    const { registry } = config
    const getNPMPackageMeta = async (packageName) => {
        return fetch(`${registry}/${packageName}`)
            .then(response => response.json())
    }
    const getNPMSinglePackageMeta = async (packageName, packageVersion) => {
        return fetch(`${registry}/${packageName}/${packageVersion}`)
            .then(response => response.json())
    }
    const unTarPackage = async (FilePath, unTarFolderPath) => {
        const command = `tar -xzf ${FilePath} -C ${unTarFolderPath}`
        return excuteCommand(command)
    }
    const packageList = config.packages
    for (let scopes in config.scopes) {
        for (let scopePackageName in config.scopes[scopes]) {
            packageList[scopes + "/" + scopePackageName] = config.scopes[scopes][scopePackageName]
        }
    }
    for (const packageName in packageList) {
        const npmConfig = new loadAsyncConfig(config.asyncFile)
        const npmConfigData = await npmConfig.read()
        const packageMeta = await getNPMPackageMeta(packageName)
        if (!npmConfigData[packageName]) {
            npmConfigData[packageName] = {
                latest: null,
                versions: []
            }
            packageName.split("/").reduce((acc, cur) => {
                if (!fs.existsSync(config.asyncFolder + "/" + acc)) {
                    fs.mkdirSync(config.asyncFolder + "/" + acc)
                }
                acc += "/" + cur
            })
            if (!fs.existsSync(config.asyncFolder + "/" + packageName)) {
                fs.mkdirSync(config.asyncFolder + "/" + packageName)
            }
        }
        if (npmConfigData[packageName].latest !== packageMeta["dist-tags"].latest) {
            console.log(`Updating ${packageName}...`)
            npmConfigData[packageName].latest = packageMeta["dist-tags"].latest
            const AllVersions = Object.keys(packageMeta.versions)
            const DiffVersions = AllVersions.filter(version => !npmConfigData[packageName].versions.includes(version))
            console.log(`Downloading ${packageName}...`)
            for (const version of DiffVersions) {
                console.log(`Downloading ${packageName}@${version}...`)
                if (!version.match(new RegExp(config.packages[packageName]))) {
                    console.log(`Skipping ${packageName}@${version}...`)
                    continue
                }
                const SinglePackageMeta = await getNPMSinglePackageMeta(packageName, version)
                const tarballName = SinglePackageMeta.dist.tarball.split("/").pop()
                const tarballPath = `${config.asyncFolder}/${packageName}/${tarballName}`
                console.log(tarballPath)
                const tarballBuffer = await fetch(SinglePackageMeta.dist.tarball)
                    .then(response => response.buffer())
                fs.writeFileSync(tarballPath, tarballBuffer)
                fs.mkdirSync(config.asyncFolder + "/" + packageName + "/" + version)
                await unTarPackage(tarballPath, config.asyncFolder + "/" + packageName + "/" + version)
                fs.renameSync(config.asyncFolder + "/" + packageName + "/" + version + "/package", config.asyncFolder + "/" + packageName + "/" + version + "/files")
                npmConfigData[packageName].versions.push(version)
                fs.unlinkSync(tarballPath)
            }
        } else {
            console.log(`Skipping ${packageName}...`)
        }
        await npmConfig.write(npmConfigData)
    }

}

const asyncAll = async (config) => {
    console.log("Updating NPM packages...")
    await asyncNPM(config.npm)
}

!(async () => {
    console.log("Updating packages...")
    await asyncAll(allowedPackage)
        .then(() => {
            console.log("Downloaded all packages...")
        })
        .catch((err) => {
            console.error(err)
        })
})()