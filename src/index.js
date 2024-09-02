// Updated using https://blox.link/dashboard/user/developer


const { Client, Intents, MessageEmbed } = require("discord.js");
require('dotenv').config();
const axios = require('axios');

const client = new Client({
    disableEveryone: true,
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING],
});

const { TOKEN, PREFIX, ACCENT_COLOR, STATUS, VERIFIED_ROLE, BLOXLINK_API_KEY, SERVER_ID } = process.env;

client.on("ready", () => {
    client.user.setActivity(STATUS, { type: 'WATCHING' });
    console.log(`${client.user.username} is connected to Discord`);
});

client.on("messageCreate", async (message) => {
    if(message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(PREFIX)) return;

    if(message.content.toLowerCase().includes("verify")) {
        let verifiedrole = message.guild.roles.cache.get(VERIFIED_ROLE);

        try {
            // Get Roblox ID from Bloxlink API
            const response = await axios.get(`https://api.blox.link/v4/public/guilds/${SERVER_ID}/discord-to-roblox/${message.author.id}`, {
                headers: { "Authorization": BLOXLINK_API_KEY }
            });

            if (response.data && response.data.robloxID) {
                let robloxid = response.data.robloxID;

                // Optionally, fetch the Roblox username (you may need to implement this function)
                let robloxusername = await util.getUsernameById(robloxid);

                let embed = new MessageEmbed()
                    .setTitle(`Verified`)
                    .setColor(ACCENT_COLOR)
                    .setThumbnail(`https://www.roblox.com/headshot-thumbnail/image?userId=${robloxid}&width=420&height=420&format=png`)
                    .setDescription(`Welcome **${robloxusername}**`);

                // Update user's nickname and roles
                message.member.setNickname(robloxusername); // Remove this line if you don't want to change the user's nickname
                message.member.roles.add(verifiedrole);
                message.channel.send({ embeds: [embed] });
            } else {
                message.channel.send({ content: `You don't seem to be linked with Bloxlink.\nPlease verify yourself here: https://blox.link/verify` });
            }
        } catch (err) {
            console.error("Error verifying user:", err);
            message.channel.send({ content: `There was an error trying to verify your account. Please try again later.` });
        }
    }
});

client.login(TOKEN);
