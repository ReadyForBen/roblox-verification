const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function bloxlink(userid) {
    return new Promise(function(resolve, reject) {
        fetch(`https://api.blox.link/v4/public/guilds/${process.env.SERVER_ID}/discord-to-roblox/${userid}`, {
            method: "GET",
            headers: { "Authorization": process.env.BLOXLINK_API_KEY }
        }).then(async (response) => {
            let json = await response.json();
            if (response.status !== 200 || json.robloxID === undefined) return resolve("not_linked");
            resolve(json.robloxID);
        }).catch(err => {
            console.error("Error fetching Bloxlink data:", err);
            reject(err);
        });
    });
}

async function getUsernameById(robloxId) {
    return new Promise(function(resolve, reject) {
        fetch(`https://users.roblox.com/v1/users/${robloxId}`, {
            method: "GET"
        }).then(async (response) => {
            let json = await response.json();
            resolve(json.name);
        }).catch(err => {
            console.error("Error fetching Roblox username:", err);
            reject(err);
        });
    });
}

module.exports = { bloxlink, getUsernameById };
