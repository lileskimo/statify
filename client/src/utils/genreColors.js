export const colorPalette = [
  '#FF6F61', // Vibrant Coral
  '#FFB347', // Vibrant Orange
  '#FFD700', // Bright Gold
  '#7CFC00', // Lawn Green
  '#40E0D0', // Turquoise
  '#00BFFF', // Deep Sky Blue
  '#1E90FF', // Dodger Blue
  '#00FA9A', // Medium Spring Green
  '#FF69B4', // Hot Pink
  '#FF85CB', // Pink
  '#FF5E3A', // Orange Red
  '#FF2D55', // Pink Red
  '#FFD31D', // Yellow
  '#A3CB38', // Light Green
  '#17EAD9', // Cyan
  '#38A1DB', // Blue
  '#32FF7E', // Neon Green
  '#18DCFF', // Neon Blue
  '#7D5FFF', // Light Purple
  '#B967FF', // Light Violet
  '#F97F51', // Light Orange
  '#F8EFBA', // Light Yellow
  '#F6E58D', // Pastel Yellow
  '#F9CA24', // Bright Yellow
  '#F3A683', // Light Peach
  '#F19066', // Peach
  '#F5CD79', // Light Gold
  '#5468FF', // Bright Blue
  '#3AE374', // Bright Mint
  '#67E6DC', // Light Aqua
  '#FFC312', // Bright Yellow
  '#C4E538', // Light Lime
  '#12CBC4', // Bright Cyan
  '#FDA7DF', // Light Pink
  '#ED4C67', // Vibrant Pink
  '#5758BB', // Bright Indigo
  '#9980FA', // Light Lavender
  '#D980FA', // Light Purple
  '#B53471', // Vibrant Magenta
  '#833471', // Vibrant Purple
];

export const getGenreColor = (genre) => {
  if (!genre) return '#FFD700';
  const hash = genre.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
};