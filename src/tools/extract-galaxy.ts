import { createReadStream, createWriteStream } from "node:fs";
import readline from "node:readline";
import { createGunzip } from "node:zlib";

interface System {
    name: string;
    coords: { x: number, y: number, z: number };
    bodies: Array<{
        name: string;
        type: string;
    }>;
    stations: Array<{
        name: string;
        type: string;
    }>;
}

if (process.argv.length < 7) {
    console.error(`Syntax: ${process.argv[1]} galaxy.json.gz systems.txt bodies.txt stations.txt positions.txt`);
    process.exit(1);
}

const input = process.argv[2];
const systems = process.argv[3];
const bodies = process.argv[4];
const stations = process.argv[5];
const positions = process.argv[6];

const systemsFile = createWriteStream(systems, { encoding: "utf8", highWaterMark: 1024 * 1024 });
const bodiesFile = createWriteStream(bodies, { encoding: "utf8", highWaterMark: 1024 * 1024 });
const stationsFile = createWriteStream(stations, { encoding: "utf8", highWaterMark: 1024 * 1024 });
const bubbleFile = createWriteStream(positions, { encoding: "utf8", highWaterMark: 1024 * 1024 });

const file = createReadStream(input, { highWaterMark: 1024 * 1024 });
const gunzip = createGunzip();
const decoded = file.pipe(gunzip).setEncoding("utf8");
const rl = readline.createInterface({ input: decoded, crlfDelay: Infinity });
let numSystems = 0;
try {
    for await (let line of rl) {
        if (line === "[" || line === "]") {
            continue;
        }
        if (line.endsWith(",")) {
            line = line.substring(0, line.length - 1);
        }
        const system = JSON.parse(line) as System;
        const systemName = system.name;
        if (systemName != null) {
            systemsFile.write(systemName);
            systemsFile.write("\n");
        }
        if (system.coords != null) {
            const { x, y, z } = system.coords;
            bubbleFile.write(`${systemName} ${x} ${y} ${z}\n`);
        }
        for (const body of system.bodies) {
            if (body.type === "Barycentre") {
                continue;
            }
            const bodyName = body.name;
            if (bodyName != null && !bodyName.startsWith(systemName)) {
                bodiesFile.write(bodyName);
                bodiesFile.write("\n");
            }
        }
        for (const station of system.stations) {
            if (station.type === "Planetary Construction Depot" || station.type === "Space Construction Depot" || station.type === "Drake-Class Carrier"
                    || station.name.startsWith("$") || station.name === "System Colonisation Ship" || station.name.startsWith("Orbital Construction Site")) {
                continue;
            }
            const stationName = station.name;
            if (stationName != null) {
                stationsFile.write(stationName);
                stationsFile.write("\n");
            }
        }
        numSystems++;
        if (numSystems % 10000 === 0) {
            console.log(`${numSystems} systems processed`);
        }
    }
} finally {
    rl.close();
    file.destroy();
    gunzip.destroy();
    systemsFile.close();
    bodiesFile.close();
}
