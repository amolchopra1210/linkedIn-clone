import {mailTrapClient, sender} from '../lib/mailtrap.js';
import { createWelcomeEmailTemplate } from './emailTemplates.js';

export const sendWelcomeMail = async(email, name, profileUrl) => {
    const recipients = [{email}]
    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipients,
            subject: "Welcome to LinkedIn",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "welcome"
        })
        console.log("Email sent successfully", response)
    } catch (error) {
        console.log("Error", error)
        throw error;
    }
}

export const sendCommentNotificationEmail = async (
	recipientEmail,
	recipientName,
	commenterName,
	postUrl,
	commentContent
) => {
	const recipient = [{ email: recipientEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "New Comment on Your Post",
			html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
			category: "comment_notification",
		});
		console.log("Comment Notification Email sent successfully", response);
	} catch (error) {
		throw error;
	}
};

export const sendConnectionAcceptedEmail = async (senderEmail, senderName, recipientName, profileUrl) => {
	const recipient = [{ email: senderEmail }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: `${recipientName} accepted your connection request`,
			html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
			category: "connection_accepted",
		});
	} catch (error) {}
};