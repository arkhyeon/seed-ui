const calcRem = (size) => `${size / 16}rem`;

const fontSizes = {
	small: calcRem(14),
	base: calcRem(16),
	large: calcRem(18),
};

const paddings = {
	small: calcRem(8),
	base: calcRem(10),
	large: calcRem(12),
};

const margins = {
	small: calcRem(8),
	base: calcRem(10),
	large: calcRem(12),
};

const colors = {
	light_1: '#f1f4f5',
	light_2: '#cfd8dc',
	light_3: '#b0bec5',
	normal_1: '#90a4ae',
	normal_2: '#78909c',
	normal_3: '#607d8b',
	normal_4: '#546e7a',
	dark_1: '#455a64',
	dark_2: '#37474f',
	gray_1: '#e9e9e9',
	gray_2: '#c4c4c4',
	gray_3: '#929292',
	gray_4: '#666666',
	gray_5: '#383838',
};

const theme = {
	fontSizes,
	paddings,
	margins,
	colors,
	menuColor: '#3f525c',
	menuFontColor: '#fafafa',
	defaultColor: '#3f525c',
};

export default theme;
