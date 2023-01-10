const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder().setName('entry').setDescription('企画のエントリーフォームを送信する'),
    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('clickedEntry')
                    .setLabel('エントリーする')
                    .setStyle(ButtonStyle.Success),
            );

        const embed = new EmbedBuilder()
                .setColor(0x0088FF)
                .setTitle('【おかるーむマッチ】エントリー')
                .setDescription('下のエントリーボタンから企画に参加してください。\nDMに送られてくる項目をすべて記入して送信してください。');

        await interaction.reply({embeds: [embed], components: [row]});
    }
}