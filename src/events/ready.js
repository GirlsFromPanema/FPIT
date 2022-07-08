"use strict";

const { Client } = require("discord.js");
const { red, green, blue, yellow, cyan } = require("chalk");

// Database queries
const Cases = require("../models/reports/cases");

// Configs
const client = require("../util/bot");
const emojis = require("../../Controller/emojis/emojis");

module.exports.data = {
  name: "ready",
  once: true,
};

/**
 * Handle the clients event.
 * @param {Client} client The client that triggered the event.
 */
module.exports.run = async (client) => {


  // log all documents that are saved 
  let cases = Cases.length || "0";

  // Set the Bot status
  client.user.setPresence({ activities: [{ name: `Reported users: ${cases}` }], status: "dnd" });

  const loading = String.raw`
                  __         ______   __    __  __    __   ______   __    __  ______  __    __   ______  
                 /  |       /      \ /  |  /  |/  \  /  | /      \ /  |  /  |/      |/  \  /  | /      \ 
                 $$ |      /$$$$$$  |$$ |  $$ |$$  \ $$ |/$$$$$$  |$$ |  $$ |$$$$$$/ $$  \ $$ |/$$$$$$  |
                 $$ |      $$ |__$$ |$$ |  $$ |$$$  \$$ |$$ |  $$/ $$ |__$$ |  $$ |  $$$  \$$ |$$ | _$$/ 
                 $$ |      $$    $$ |$$ |  $$ |$$$$  $$ |$$ |      $$    $$ |  $$ |  $$$$  $$ |$$ |/    |
                 $$ |      $$$$$$$$ |$$ |  $$ |$$ $$ $$ |$$ |   __ $$$$$$$$ |  $$ |  $$ $$ $$ |$$ |$$$$ |
                 $$ |_____ $$ |  $$ |$$ \__$$ |$$ |$$$$ |$$ \__/  |$$ |  $$ | _$$ |_ $$ |$$$$ |$$ \__$$ |
                 $$       |$$ |  $$ |$$    $$/ $$ | $$$ |$$    $$/ $$ |  $$ |/ $$   |$$ | $$$ |$$    $$/ 
                 $$$$$$$$/ $$/   $$/  $$$$$$/  $$/   $$/  $$$$$$/  $$/   $$/ $$$$$$/ $$/   $$/  $$$$$$/  
                                                                                                                                                                                                      
`;
  // backslash
  const backslash = String.raw` \ `;
  const prefix = "/";

  console.log(red(loading));
  console.log(``);
  console.log(
    green(`                                                     Konicord`)
  );
  console.log(``);
  console.log(``);
  console.log(
    yellow(
      "               + ================================================================================== +"
    )
  );
  console.log(
    cyan(
      `                                [i] :: ${prefix}help                :: Displays commands.                   `
    )
  );
  console.log(
    cyan(
      `                                [i] :: ${prefix}ping                :: Displays bots ping.                  `
    )
  );
  console.log(
    yellow(
      "               + ================================Commands========================================== +"
    )
  );
  console.log(
    cyan(
      `                       Author   [i] :: Programmed by [Koni#9521]    :: © 2021 Development                   `
    )
  );
  console.log(
    cyan(
      `                       Bot info [i] :: Status                       :: ✅ Online                           `
    )
  );
  console.log(
    cyan(
      `                       Users    [i] ::                              :: ${client.users.cache.size}  Users   `
    )
  );
  console.log(
    cyan(
      `                       Guilds   [i] ::                              :: ${client.guilds.cache.size} Guilds  `
    )
  );
  console.log(
    yellow(
      "               + ================================Website=========================================== +"
    )
  );
  console.log(
    cyan(
      `                       Link     [i] ::        [myweb.com]        :: Our Website                          `
    )
  );

  console.log("Press [CTRL + C] to stop the Terminal ...");
};
