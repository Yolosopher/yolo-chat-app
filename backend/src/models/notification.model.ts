import { Schema, model } from 'mongoose';

const notifSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	],
});

const NotificationModel = model('Notification', notifSchema);

export default NotificationModel;
