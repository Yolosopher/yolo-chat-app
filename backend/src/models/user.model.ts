import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Model<any> {
	name: string;
	email: string;
	password: string;
	pic: string;
	isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		pic: {
			type: String,
			required: true,
			default:
				'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
	const user = this;

	if (!user.isModified('password')) {
		return next();
	}

	// @ts-ignore
	user.password = await bcrypt.hash(user.password, 10);

	next();
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
