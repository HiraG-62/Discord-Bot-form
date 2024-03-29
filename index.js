require('dotenv').config();
const { PythonShell } = require('python-shell');
const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_BOT_TOKEN;

const {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ActionRow,
    ModalBuilder,
    EmbedBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require('discord.js');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(filePath);
    }
}

let ps = new PythonShell('./pythonFiles/formWriter.py');
ps.send('');
ps.on('message', function (data) {
    console.log(data)
})

client.once(Events.ClientReady, c => {
    console.log("Ready!");
});

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(interaction.commandName);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }
});

client.on(Events.InteractionCreate, async interaction => {
    const dmEntryButton = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('clickedStart')
                                .setLabel('エントリー開始')
                                .setStyle(ButtonStyle.Success),
                        );

    //サーバーでのエントリーボタン設置
    if(interaction.customId === 'clickedEntry') {
        await interaction.update({
            content: `${interaction.user.username}がエントリーしました`
        });

        const targetGuild = client.guilds.cache.get('897119069445193768');
        const role = targetGuild.roles.cache.find(role => role.name === '第3弾[スプラ3] 参加者');
        targetGuild.members.cache.get(interaction.user.id).roles.add(role);

        await interaction.user.send({components: [dmEntryButton]});
    }
    
    else if(interaction.customId === 'clickedStart' || interaction.customId === 'clickedEditFirst'){

        //ボタンを押した人のDiscord IDをpythonへ送信
        const modal1 = new ModalBuilder()
            .setCustomId('modal1')
            .setTitle('エントリーシート1');
    
        const nameInput = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('名前を入力してください。')
            .setMaxLength(15)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const nameActionRow = new ActionRowBuilder().addComponents(nameInput);
    
        const historyInput = new TextInputBuilder()
            .setCustomId('history')
            .setLabel('歴代最高ウデマエを入力してください。例: B+, 最高XP2500など')
            .setMaxLength(20)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const historyActionRow = new ActionRowBuilder().addComponents(historyInput);
    
        const confidenceInput = new TextInputBuilder()
            .setCustomId('confidence')
            .setLabel('得意な武器を入力してください。※複数入力可')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        const confidenceActionRow = new ActionRowBuilder().addComponents(confidenceInput);
    
        const poorInput = new TextInputBuilder()
            .setCustomId('poor')
            .setLabel('苦手な武器を入力してください。※複数入力可')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        const poorActionRow = new ActionRowBuilder().addComponents(poorInput);
    
        modal1.addComponents(nameActionRow);
        modal1.addComponents(historyActionRow);
        modal1.addComponents(confidenceActionRow);
        modal1.addComponents(poorActionRow);
    
        await interaction.showModal(modal1);
    }
    
    else if(interaction.customId === 'modal1') {
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('clickedEditFirst')
                    .setLabel('修正する')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('clickedNext')
                    .setLabel('次へ')
                    .setStyle(ButtonStyle.Success),
            );
    
        let embed;
        if(interaction.fields.getTextInputValue('confidence') && interaction.fields.getTextInputValue('poor')) {
            embed = new EmbedBuilder()
                    .setColor(0x0088FF)
                    .setTitle('エントリーシート1')
                    .setDescription('確認用')
                    .addFields(
                        { name: '名前', value: interaction.fields.getTextInputValue('name') },
                        { name: '最高ウデマエ', value: interaction.fields.getTextInputValue('history') },
                        { name: '得意武器', value: interaction.fields.getTextInputValue('confidence') },
                        { name: '苦手武器', value: interaction.fields.getTextInputValue('poor') }
                    )
        } else if(interaction.fields.getTextInputValue('poor')) {
            embed = new EmbedBuilder()
                    .setColor(0x0088FF)
                    .setTitle('エントリーシート1')
                    .setDescription('確認用')
                    .addFields(
                        { name: '名前', value: interaction.fields.getTextInputValue('name') },
                        { name: '最高ウデマエ', value: interaction.fields.getTextInputValue('history') },
                        { name: '得意武器', value: 'なし' },
                        { name: '苦手武器', value: interaction.fields.getTextInputValue('poor') }
                    )
        } else if(interaction.fields.getTextInputValue('confidence')) {
            embed = new EmbedBuilder()
                    .setColor(0x0088FF)
                    .setTitle('エントリーシート1')
                    .setDescription('確認用')
                    .addFields(
                        { name: '名前', value: interaction.fields.getTextInputValue('name') },
                        { name: '最高ウデマエ', value: interaction.fields.getTextInputValue('history') },
                        { name: '得意武器', value: interaction.fields.getTextInputValue('confidence') },
                        { name: '苦手武器', value: 'なし' }
                    )
        } else {
            embed = new EmbedBuilder()
                    .setColor(0x0088FF)
                    .setTitle('エントリーシート1')
                    .setDescription('確認用')
                    .addFields(
                        { name: '名前', value: interaction.fields.getTextInputValue('name') },
                        { name: '最高ウデマエ', value: interaction.fields.getTextInputValue('history') },
                        { name: '得意武器', value: 'なし' },
                        { name: '苦手武器', value: 'なし' }
                    )
        }

        let pyShell = new PythonShell('./pythonFiles/formWriter.py');
        let jsonData = {
            sheet: 'first',
            discordId: interaction.user.id,
            form1: encodeURI(interaction.fields.getTextInputValue('name')),
            form2: encodeURI(interaction.fields.getTextInputValue('history')),
            form3: encodeURI(interaction.fields.getTextInputValue('confidence')),
            form4: encodeURI(interaction.fields.getTextInputValue('poor'))
        };
        pyShell.send(JSON.stringify(jsonData));

        await interaction.reply({embeds: [embed], components: [button]});
    }

    else if(interaction.customId === 'clickedNext' || interaction.customId === 'clickedEditSecond'){
        const modal2 = new ModalBuilder()
                .setCustomId('modal2')
                .setTitle('エントリーシート2');
            
        const ngInput = new TextInputBuilder()
            .setCustomId('ng')
            .setLabel('共演NG、チームを組みたくない人がいたら入力してください。※未入力、複数入力可')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        const ngActionRow = new ActionRowBuilder().addComponents(ngInput);
    
        const streamingInput = new TextInputBuilder()
            .setCustomId('streaming')
            .setLabel('録画、配信をする場合は何か文字を入力してください。※なしの場合は未入力')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        const streamingActionRow = new ActionRowBuilder().addComponents(streamingInput);
    
        const contactInput = new TextInputBuilder()
            .setCustomId('contact')
            .setLabel('連絡を取れるアカウントを入力してください。※TwitterやDiscord')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const contactActionRow = new ActionRowBuilder().addComponents(contactInput);
    
        modal2.addComponents(ngActionRow);
        modal2.addComponents(streamingActionRow);
        modal2.addComponents(contactActionRow);
    
        await interaction.showModal(modal2);
    }

    else if(interaction.customId === 'modal2') {
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('clickedEditSecond')
                    .setLabel('修正する')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('clickedSend')
                    .setLabel('送信する')
                    .setStyle(ButtonStyle.Success),
            );
    
        let embed;
        if(interaction.fields.getTextInputValue('ng') && interaction.fields.getTextInputValue('streaming')) {
            embed = new EmbedBuilder()
                    .setColor(0x0088FF)
                    .setTitle('エントリーシート2')
                    .setDescription('確認用')
                    .addFields(
                        { name: '共演NG', value: interaction.fields.getTextInputValue('ng') },
                        { name: '録画、配信', value: 'あり' },
                        { name: '連絡可能アカウント', value: interaction.fields.getTextInputValue('contact') }
                    )
        } else if(interaction.fields.getTextInputValue('ng')) {
            embed = new EmbedBuilder()
                    .setColor(0x0088FF)
                    .setTitle('エントリーシート2')
                    .setDescription('確認用')
                    .addFields(
                        { name: '共演NG', value: interaction.fields.getTextInputValue('ng') },
                        { name: '録画、配信', value: 'なし' },
                        { name: '連絡可能アカウント', value: interaction.fields.getTextInputValue('contact') }
                    )
        } else if(interaction.fields.getTextInputValue('streaming')) {
            embed = new EmbedBuilder()
                    .setColor(0x0088FF)
                    .setTitle('エントリーシート2')
                    .setDescription('確認用')
                    .addFields(
                        { name: '共演NG', value: 'なし' },
                        { name: '録画、配信', value: 'あり' },
                        { name: '連絡可能アカウント', value: interaction.fields.getTextInputValue('contact') }
                    )
        } else {
            embed = new EmbedBuilder()
                    .setColor(0x0088FF)
                    .setTitle('エントリーシート2')
                    .setDescription('確認用')
                    .addFields(
                        { name: '共演NG', value: 'なし' },
                        { name: '録画、配信', value: 'なし' },
                        { name: '連絡可能アカウント', value: interaction.fields.getTextInputValue('contact') }
                    )
        }

        let pyShell = new PythonShell('./pythonFiles/formWriter.py');
        let jsonData = {
            sheet: 'second',
            discordId: interaction.user.id,
            form1: encodeURI(interaction.fields.getTextInputValue('ng')),
            form2: encodeURI(interaction.fields.getTextInputValue('streaming')),
            form3: encodeURI(interaction.fields.getTextInputValue('contact')),
            form4: 'empty'
        };
        pyShell.send(JSON.stringify(jsonData));
    
        await interaction.reply({embeds: [embed], components: [button]});
    }

    else if(interaction.customId === 'clickedSend') {
        interaction.reply('エントリーありがとうございました。');
    }
});


client.login(token);