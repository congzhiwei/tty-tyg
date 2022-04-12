const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true,
    port: 465,
    auth: {
        user: "354115516@qq.com",
        pass: "spvvhsjnjsezcaac"
    }
});

const mailOptions = {
    from: "小刘的保姆 354115516@qq.com",
    to: "354115516@qq.com",
    subject: "凌风云签到提醒",
    text: "测试文本",
};

function sendMail(mailOptions) {
    transport.sendMail(mailOptions, function(err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    })
}

function getSendMailInfo (receiver, subject, text) {
    return {
        from: "小刘机器人 354115516@qq.com",
        to: receiver,
        subject: subject,
        text: text
    }
}

module.exports = { sendMail, getSendMailInfo };