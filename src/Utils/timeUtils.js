// utils/timeUtils.js
export const getCurrentDay = () => {
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	return days[new Date().getDay()];
};

export const getCurrentTimeInMinutes = () => {
	const now = new Date();
	return now.getHours() * 60 + now.getMinutes();
};
