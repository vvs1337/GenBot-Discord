const request = require("request");
const fs = require('fs');
const chalk = require('chalk')
const { red, green, yellow, cyan } = require('colors')
const { generateFromEmail, generateUsername } = require("unique-username-generator");

const tokens = fs.readFileSync("./tokenUser.txt", "utf-8").replace(/\r/gi, "").split("\n");

let token = ""

let idBot;

let proxy2 = cheap.com:31112"
let proxy = cheap.com:31112"

let index = 0

create_application()

async function create_application() {
    token = tokens[index];

    const username = generateUsername("", 2, 9);

    console.log(yellow(`[${index}] - Création de l'application en cours...`));

    request(`https://discord.com/api/v9/applications`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "fr,fr-FR;q=0.9",
            "authorization": token,
            "content-type": "application/json",
        },
        "body": `{\"name\":\"${username}\"}`,
        "method": "POST",
        "mode": "cors",
        "proxy": proxy
    }, (err, response, body) => {
        let data = JSON.parse(body);
        //   console.log(data)
        if (data.message === "401: Unauthorized") {
            console.log(red("[CREATE_APP] 401 Unauthorized !"));
            index++;
            create_application();
        } else if (data.message === "You are being rate limited.") {
            const retryAfter = data.retry_after || 1000; // Default to 1 second
            console.log(red("[CREATE_APP] Rate limited !", retryAfter));
            setTimeout(() => {
                index++;
                create_application();
            }, retryAfter);
        } else if (data.message === "Limite d'application OAuth2 atteinte") {
            console.log(red("[CREATE_APP] Limit Apllication !"));
            setTimeout(() => {
                index++;
                create_application();
            }, 1000);
        } else {
            idBot = data.id;
            create_bot();
        }
    });
}

async function create_bot() {
    console.log(yellow(`[${index}] - Création du bot en cours...`))

    request(`https://discord.com/api/v9/applications/${idBot}/bot`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "fr,fr-FR;q=0.9",
            "authorization": token,
            "content-type": "application/json",
        },
        "body": null,
        "method": "POST",
        "mode": "cors",
        "proxy": proxy
    }, (err, response, body) => {
        let data = JSON.parse(body);
        //console.log(data)
        if (data.message === "You are being rate limited.") return console.log(red("[CREATE_BOT] rate limited !", data.retry_after)) || process.exit();


        intents_token()
    })
}

async function intents_token() {
    console.log(yellow(`[${index}] - Activation des intents en cours...`))

    request(`https://discord.com/api/v9/applications/${idBot}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "fr,fr-FR;q=0.9",
            "authorization": token,
            "content-type": "application/json",
        },
        "body": `{\"flags\":\"565248\"}`,
        "method": "PATCH",
        "mode": "cors",
        "proxy": proxy
    }, (err, response, body) => {
        let data = JSON.parse(body);
        if (data.message === "You are being rate limited.") return console.log(red("[INTENTS_BOT] rate limited !", data.retry_after)) || create_application()

        reset_token()

    })
}

async function reset_token() {
    console.log(yellow(`[${index}] - Récupération du token en cours...`))

    request(`https://discord.com/api/v9/applications/${idBot}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "fr,fr-FR;q=0.9",
            "authorization": token,
            "content-type": "application/json",
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "proxy": proxy
    }, (err, response, body) => {
        let datas = JSON.parse(body);
        if (datas.message === "You are being rate limited.") return console.log(red("[RESET_TOKEN] rate limited !", datas.retry_after)) || create_application()

        request(`https://discord.com/api/v9/applications/${idBot}/bot/reset`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "fr,fr-FR;q=0.9",
                "authorization": token,
                "content-type": "application/json",
            },
            "body": null,
            "method": "POST",
            "mode": "cors",
            "proxy": proxy
        }, (err, response, body) => {
            let data = JSON.parse(body);

            if (data.message === "Tu dois vérifier ton compte afin de réaliser cette action.") {
                console.log(red("[RESET_TOKEN] Verif Account !", data.retry_after))
                setTimeout(() => {
                    index++;
                    create_application();
                }, 1000);
            } else {

                if (data.message === "You are being rate limited.") return console.log(red("[RESET_TOKEN] rate limited !", data.retry_after)) || create_application()

                fs.appendFile('tokens.txt', `${data.token}\n`, function (err) {
                    if (err) throw err;
                });

                const tokenss = fs.readFileSync("./tokens.txt", "utf-8").replace(/\r/gi, "").split("\n");
                fs.appendFile('bots.txt', `${datas.bot.username}#${datas.bot.discriminator} | ${data.token}\n`, function (err) {
                    if (err) throw err;
                    console.log(green(`[${datas.bot.username}#${datas.bot.discriminator}] - Le token a bien été inscrit (${tokenss.length}) !`));


                    setTimeout(() => {
                        create_application()
                    }, 1000);
                });
            }
        })
    })
}



process.on('uncaughtException', (err, origin) => {
    //  console.log(chalk.cyan(err))
});
process.on('unhandledRejection', (err, promise) => {
    console.log(chalk.cyan(err))
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(chalk.cyan(err))
    setTimeout(() => {
        create_application()
    }, 3000);
});
process.on('multipleResolves', (type, pomise, reason) => {
    console.log(chalk.blue(type, reason))
});