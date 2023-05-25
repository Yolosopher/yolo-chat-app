import React from 'react';

const NotificationBadge = ({ count }) => {
	if (count < 1) return null;
	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				right: 0,
				backgroundColor: 'red',
				color: 'white',
				width: 24,
				height: 24,
				fontSize: 18,
				borderRadius: '50%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			{count}
		</div>
	);
};

export default NotificationBadge;
